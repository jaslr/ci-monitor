import { fetchFlyApps, mapFlyStatusToHealth } from './client.js';
import { projects } from '../../config/projects.js';
import * as db from '../../db/queries.js';
import { broadcast } from '../../sse/broadcaster.js';
import { dispatchAlert } from '../alerts/dispatcher.js';

// Track previous status to detect changes
const previousStatus = new Map<string, string>();

export async function pollFlyioApps(): Promise<void> {
  console.log('Polling Fly.io apps...');

  const apps = await fetchFlyApps();
  if (apps.length === 0) {
    return;
  }

  // Find projects that use Fly.io
  const flyProjects = projects.filter((p) =>
    p.services.some((s) => s.provider === 'flyio')
  );

  for (const project of flyProjects) {
    const flyService = project.services.find((s) => s.provider === 'flyio');
    if (!flyService) continue;

    // Match Fly app by project name (convention: app name = project name or similar)
    const app = apps.find(
      (a) =>
        a.name.toLowerCase() === project.name.toLowerCase() ||
        a.name.toLowerCase().includes(project.id.toLowerCase())
    );

    if (!app) {
      console.log(`No Fly.io app found for project ${project.id}`);
      continue;
    }

    const status = mapFlyStatusToHealth(app);
    const prevStatus = previousStatus.get(project.id);

    // Store status check
    try {
      await db.insertStatusCheck(
        flyService.id,
        status,
        `Machines: ${app.machines.nodes.filter((m) => m.state === 'started').length}/${app.machines.nodes.length} running`
      );
    } catch (err) {
      console.error(`Failed to store Fly.io status for ${project.id}:`, err);
    }

    // Broadcast if status changed
    if (status !== prevStatus) {
      previousStatus.set(project.id, status);

      broadcast({
        type: 'status',
        project: project.id,
        data: {
          serviceId: flyService.id,
          provider: 'flyio',
          status,
          appName: app.name,
          machines: app.machines.nodes.length,
          timestamp: new Date().toISOString(),
        },
      });

      // Alert on degradation or down
      if (status === 'down' || (prevStatus === 'healthy' && status === 'degraded')) {
        await dispatchAlert(
          project.id,
          flyService.id,
          status === 'down' ? 'down' : 'degraded',
          `Fly.io app ${app.name} is ${status}`
        );
      }
    }
  }

  console.log(`Fly.io poll complete: ${apps.length} apps checked`);
}
