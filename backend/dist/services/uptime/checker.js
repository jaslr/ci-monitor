import { projects } from '../../config/projects.js';
import * as db from '../../db/queries.js';
import { broadcast } from '../../sse/broadcaster.js';
import { dispatchAlert } from '../alerts/dispatcher.js';
// Track previous status to detect changes
const previousStatus = new Map();
export async function checkUptime(url) {
    const startTime = Date.now();
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'User-Agent': 'Observatory-Uptime-Check/1.0',
            },
            redirect: 'follow',
        });
        clearTimeout(timeout);
        return {
            url,
            isUp: response.ok,
            statusCode: response.status,
            responseTimeMs: Date.now() - startTime,
        };
    }
    catch (error) {
        return {
            url,
            isUp: false,
            responseTimeMs: Date.now() - startTime,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
export async function runUptimeChecks() {
    console.log('Running uptime checks...');
    // Get all projects with uptime URLs
    const projectsWithUrls = projects.filter((p) => p.uptimeUrl);
    for (const project of projectsWithUrls) {
        if (!project.uptimeUrl)
            continue;
        // Find hosting service
        const hostingService = project.services.find((s) => s.category === 'hosting');
        if (!hostingService)
            continue;
        const result = await checkUptime(project.uptimeUrl);
        const wasUp = previousStatus.get(project.id);
        // Store uptime check
        try {
            await db.insertUptimeCheck({
                serviceId: hostingService.id,
                url: project.uptimeUrl,
                responseTimeMs: result.responseTimeMs,
                statusCode: result.statusCode,
                isUp: result.isUp,
                errorMessage: result.errorMessage,
            });
        }
        catch (err) {
            console.error(`Failed to store uptime check for ${project.id}:`, err);
        }
        // Broadcast status change
        if (wasUp !== undefined && wasUp !== result.isUp) {
            broadcast({
                type: 'uptime',
                project: project.id,
                data: {
                    serviceId: hostingService.id,
                    url: project.uptimeUrl,
                    isUp: result.isUp,
                    statusCode: result.statusCode,
                    responseTimeMs: result.responseTimeMs,
                    timestamp: new Date().toISOString(),
                },
            });
            // Alert on downtime
            if (!result.isUp) {
                await dispatchAlert(project.id, hostingService.id, 'down', `${project.displayName} is down! ${result.errorMessage || `HTTP ${result.statusCode}`}`);
            }
        }
        previousStatus.set(project.id, result.isUp);
        console.log(`Uptime check: ${project.id} - ${result.isUp ? 'UP' : 'DOWN'} (${result.responseTimeMs}ms)`);
    }
    console.log(`Uptime checks complete: ${projectsWithUrls.length} sites checked`);
}
//# sourceMappingURL=checker.js.map