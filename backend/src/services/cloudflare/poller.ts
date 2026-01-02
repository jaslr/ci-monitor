import { fetchPagesProjects, fetchLatestDeployment, mapCFStatusToHealth } from './client.js';
import { projects } from '../../config/projects.js';
import * as db from '../../db/queries.js';
import { broadcast } from '../../sse/broadcaster.js';
import { dispatchAlert } from '../alerts/dispatcher.js';

// Track previous status to detect changes
const previousStatus = new Map<string, string>();

export async function pollCloudflarePages(): Promise<void> {
  console.log('Polling Cloudflare Pages...');

  const cfProjects = await fetchPagesProjects();
  if (cfProjects.length === 0) {
    console.log('No Cloudflare Pages projects found - check API token permissions');
    return;
  }

  // Log available CF projects for debugging
  console.log(`Found ${cfProjects.length} Cloudflare Pages projects: ${cfProjects.map(p => p.name).join(', ')}`);

  // Find our projects that use Cloudflare
  const cloudflareProjects = projects.filter((p) =>
    p.services.some((s) => s.provider === 'cloudflare' && s.category === 'hosting')
  );

  for (const project of cloudflareProjects) {
    const cfService = project.services.find(
      (s) => s.provider === 'cloudflare' && s.category === 'hosting'
    );
    if (!cfService) continue;

    // Match CF project by name - check cfProjectName first, then fallback to project.name/id
    const searchNames = [
      cfService.cfProjectName,
      project.name,
      project.id,
    ].filter(Boolean).map(n => n!.toLowerCase());

    const cfProject = cfProjects.find((cf) =>
      searchNames.includes(cf.name.toLowerCase())
    );

    if (!cfProject) {
      console.log(`No Cloudflare Pages project found for ${project.id} (searched: ${searchNames.join(', ')})`);
      continue;
    }

    // Get latest deployment
    const deployment = await fetchLatestDeployment(cfProject.name);
    const status = mapCFStatusToHealth(deployment);
    const prevStatus = previousStatus.get(project.id);

    // Store status check
    try {
      await db.insertStatusCheck(
        cfService.id,
        status,
        deployment
          ? `Last deploy: ${deployment.latest_stage.status} (${deployment.deployment_trigger.metadata.branch})`
          : 'No deployments found'
      );
    } catch (err) {
      console.error(`Failed to store CF status for ${project.id}:`, err);
    }

    // Store deployment if we have one
    if (deployment) {
      const commitSha = deployment.deployment_trigger.metadata.commit_hash;
      const deployStatus = deployment.latest_stage.status === 'success'
        ? 'success'
        : deployment.latest_stage.status === 'active'
          ? 'in_progress'
          : 'failure';
      const deployStartedAt = deployment.latest_stage.started_on
        ? new Date(deployment.latest_stage.started_on)
        : undefined;
      const deployCompletedAt = deployment.latest_stage.ended_on
        ? new Date(deployment.latest_stage.ended_on)
        : undefined;

      // First, try to update existing deployment record by commit SHA
      // This correlates the CF deploy with the CI run for the same commit
      try {
        const updated = await db.updateDeploymentByCommit(commitSha, {
          deployStartedAt,
          deployCompletedAt,
          status: deployStatus,
        });

        if (updated) {
          // Broadcast the correlated deployment with all timestamps
          broadcast({
            type: 'deployment',
            project: project.id,
            data: {
              ...updated,
              provider: 'cloudflare',
              projectId: project.id,
            },
          });
        }
      } catch (err) {
        // No existing record for this commit - create new CF-only deployment
      }

      // Also store as CF-specific deployment record
      try {
        await db.insertDeployment({
          id: `cf-${deployment.id}`,
          serviceId: cfService.id,
          provider: 'cloudflare',
          status: deployStatus,
          commitSha,
          branch: deployment.deployment_trigger.metadata.branch,
          runUrl: deployment.url,
          startedAt: deployStartedAt,
          completedAt: deployCompletedAt,
          deployStartedAt,
          deployCompletedAt,
        });
      } catch (err) {
        // Might be a duplicate, that's OK
      }
    }

    // Broadcast if status changed
    if (status !== prevStatus) {
      previousStatus.set(project.id, status);

      broadcast({
        type: 'status',
        project: project.id,
        data: {
          serviceId: cfService.id,
          provider: 'cloudflare',
          status,
          projectName: cfProject.name,
          deployment: deployment
            ? {
                id: deployment.id,
                status: deployment.latest_stage.status,
                branch: deployment.deployment_trigger.metadata.branch,
              }
            : null,
          timestamp: new Date().toISOString(),
        },
      });

      // Alert on failures
      if (status === 'down' && prevStatus !== 'down') {
        await dispatchAlert(
          project.id,
          cfService.id,
          'deploy_failure',
          `Cloudflare Pages deployment failed for ${cfProject.name}`
        );
      }
    }
  }

  console.log(`Cloudflare poll complete: ${cfProjects.length} projects checked`);
}
