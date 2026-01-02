// GCP Cloud Build poller
import { fetchLatestBuild, mapGCPStatusToHealth, mapGCPStatusToDeployment, getBuildDuration } from './client.js';
import { projects } from '../../config/projects.js';
import * as db from '../../db/queries.js';
import { broadcast } from '../../sse/broadcaster.js';
import { dispatchAlert } from '../alerts/dispatcher.js';
// Track previous status to detect changes
const previousStatus = new Map();
export async function pollGCPCloudBuild() {
    console.log('Polling GCP Cloud Build...');
    // Find projects that use GCP Cloud Build
    const gcpProjects = projects.filter((p) => p.services.some((s) => s.provider === 'gcp' && s.category === 'ci'));
    if (gcpProjects.length === 0) {
        console.log('No GCP Cloud Build projects configured');
        return;
    }
    let checkedCount = 0;
    for (const project of gcpProjects) {
        const gcpService = project.services.find((s) => s.provider === 'gcp' && s.category === 'ci');
        if (!gcpService || !gcpService.gcpProjectId)
            continue;
        const build = await fetchLatestBuild(gcpService.gcpProjectId);
        if (!build) {
            console.log(`No builds found for ${project.id} (${gcpService.gcpProjectId})`);
            continue;
        }
        checkedCount++;
        const status = mapGCPStatusToHealth(build);
        const prevStatus = previousStatus.get(project.id);
        const duration = getBuildDuration(build);
        // Store status check
        try {
            await db.insertStatusCheck(gcpService.id, status, `Build ${build.status}${duration ? ` (${Math.round(duration / 60)}m)` : ''}`);
        }
        catch (err) {
            console.error(`Failed to store GCP status for ${project.id}:`, err);
        }
        // Store deployment with granular phase timestamps
        const commitSha = build.sourceProvenance?.resolvedRepoSource?.commitSha ||
            build.source?.repoSource?.commitSha;
        const ciStartedAt = build.startTime ? new Date(build.startTime) : undefined;
        const ciCompletedAt = build.finishTime ? new Date(build.finishTime) : undefined;
        const pushedAt = build.createTime ? new Date(build.createTime) : undefined;
        try {
            await db.insertDeployment({
                id: `gcp-${build.id}`,
                serviceId: gcpService.id,
                provider: 'gcp',
                status: mapGCPStatusToDeployment(build.status),
                commitSha,
                runUrl: build.logUrl,
                startedAt: ciStartedAt,
                completedAt: ciCompletedAt,
                // Granular phase timestamps
                pushedAt, // createTime = when build was queued
                ciStartedAt, // startTime = when build started
                ciCompletedAt, // finishTime = when build completed
            });
        }
        catch (err) {
            // Might be a duplicate, that's OK
        }
        // Broadcast if status changed
        if (status !== prevStatus) {
            previousStatus.set(project.id, status);
            broadcast({
                type: 'status',
                project: project.id,
                data: {
                    serviceId: gcpService.id,
                    provider: 'gcp',
                    status,
                    gcpProjectId: gcpService.gcpProjectId,
                    build: {
                        id: build.id,
                        status: build.status,
                        duration,
                        logUrl: build.logUrl,
                    },
                    timestamp: new Date().toISOString(),
                },
            });
            // Alert on failures
            if (status === 'down' && prevStatus !== 'down') {
                await dispatchAlert(project.id, gcpService.id, 'deploy_failure', `GCP Cloud Build failed for ${gcpService.gcpProjectId}: ${build.failureInfo?.detail || build.status}`);
            }
        }
    }
    console.log(`GCP Cloud Build poll complete: ${checkedCount} projects checked`);
}
//# sourceMappingURL=poller.js.map