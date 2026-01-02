import { projects } from '../../config/projects.js';
import * as db from '../../db/queries.js';
import { broadcast } from '../../sse/broadcaster.js';
import { dispatchAlert } from '../alerts/dispatcher.js';
// Track previous status to detect changes
const previousStatus = new Map();
/**
 * Check Supabase REST API health (database)
 * Endpoint: https://<ref>.supabase.co/rest/v1/
 * Returns 200 if PostgREST is running
 */
async function checkDatabaseHealth(projectRef) {
    const url = `https://${projectRef}.supabase.co/rest/v1/`;
    const startTime = Date.now();
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(10000), // 10 second timeout
        });
        const responseTimeMs = Date.now() - startTime;
        return {
            isHealthy: response.status === 200,
            statusCode: response.status,
            message: response.status === 200 ? 'PostgREST healthy' : `HTTP ${response.status}`,
            responseTimeMs,
        };
    }
    catch (error) {
        return {
            isHealthy: false,
            message: error instanceof Error ? error.message : 'Connection failed',
            responseTimeMs: Date.now() - startTime,
        };
    }
}
/**
 * Check Supabase Auth health
 * Endpoint: https://<ref>.supabase.co/auth/v1/health
 * Returns {"status":"ok"} when healthy
 */
async function checkAuthHealth(projectRef) {
    const url = `https://${projectRef}.supabase.co/auth/v1/health`;
    const startTime = Date.now();
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(10000),
        });
        const responseTimeMs = Date.now() - startTime;
        if (response.status === 200) {
            const data = await response.json();
            return {
                isHealthy: data.status === 'ok',
                statusCode: response.status,
                message: data.status === 'ok' ? 'Auth healthy' : `Status: ${data.status}`,
                responseTimeMs,
            };
        }
        return {
            isHealthy: false,
            statusCode: response.status,
            message: `HTTP ${response.status}`,
            responseTimeMs,
        };
    }
    catch (error) {
        return {
            isHealthy: false,
            message: error instanceof Error ? error.message : 'Connection failed',
            responseTimeMs: Date.now() - startTime,
        };
    }
}
function mapHealthToStatus(result) {
    if (!result.isHealthy)
        return 'down';
    if (result.responseTimeMs && result.responseTimeMs > 3000)
        return 'degraded';
    return 'healthy';
}
export async function pollSupabaseServices() {
    console.log('Polling Supabase services...');
    // Find projects that use Supabase
    const supabaseProjects = projects.filter((p) => p.services.some((s) => s.provider === 'supabase'));
    let checksPerformed = 0;
    for (const project of supabaseProjects) {
        const supabaseServices = project.services.filter((s) => s.provider === 'supabase');
        for (const service of supabaseServices) {
            // Get project ref from service config
            const projectRef = service.supabaseProjectRef;
            if (!projectRef) {
                console.log(`No Supabase project ref configured for ${project.id}/${service.id}`);
                continue;
            }
            // Check database health for 'database' category services
            if (service.category === 'database') {
                const result = await checkDatabaseHealth(projectRef);
                const status = mapHealthToStatus(result);
                const statusKey = `${service.id}-db`;
                const prevStatus = previousStatus.get(statusKey);
                checksPerformed++;
                // Store status check
                try {
                    await db.insertStatusCheck(service.id, status, result.message || '');
                }
                catch (err) {
                    console.error(`Failed to store Supabase DB status for ${project.id}:`, err);
                }
                // Broadcast if status changed
                if (status !== prevStatus) {
                    previousStatus.set(statusKey, status);
                    broadcast({
                        type: 'status',
                        project: project.id,
                        data: {
                            serviceId: service.id,
                            category: 'database',
                            provider: 'supabase',
                            status,
                            responseTimeMs: result.responseTimeMs,
                            message: result.message,
                            timestamp: new Date().toISOString(),
                        },
                    });
                    // Alert on degradation or down
                    if (status === 'down' || (prevStatus === 'healthy' && status === 'degraded')) {
                        await dispatchAlert(project.id, service.id, status === 'down' ? 'down' : 'degraded', `Supabase database for ${project.displayName} is ${status}: ${result.message}`);
                    }
                }
            }
            // Check auth health for 'auth' category services
            if (service.category === 'auth') {
                const result = await checkAuthHealth(projectRef);
                const status = mapHealthToStatus(result);
                const statusKey = `${service.id}-auth`;
                const prevStatus = previousStatus.get(statusKey);
                checksPerformed++;
                // Store status check
                try {
                    await db.insertStatusCheck(service.id, status, result.message || '');
                }
                catch (err) {
                    console.error(`Failed to store Supabase Auth status for ${project.id}:`, err);
                }
                // Broadcast if status changed
                if (status !== prevStatus) {
                    previousStatus.set(statusKey, status);
                    broadcast({
                        type: 'status',
                        project: project.id,
                        data: {
                            serviceId: service.id,
                            category: 'auth',
                            provider: 'supabase',
                            status,
                            responseTimeMs: result.responseTimeMs,
                            message: result.message,
                            timestamp: new Date().toISOString(),
                        },
                    });
                    // Alert on degradation or down
                    if (status === 'down' || (prevStatus === 'healthy' && status === 'degraded')) {
                        await dispatchAlert(project.id, service.id, status === 'down' ? 'down' : 'degraded', `Supabase auth for ${project.displayName} is ${status}: ${result.message}`);
                    }
                }
            }
        }
    }
    console.log(`Supabase poll complete: ${checksPerformed} checks performed`);
}
//# sourceMappingURL=poller.js.map