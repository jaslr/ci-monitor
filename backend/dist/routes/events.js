import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { addClient, removeClient } from '../sse/broadcaster.js';
export const eventsRoutes = new Hono();
// SSE endpoint for real-time updates
eventsRoutes.get('/', async (c) => {
    const projectFilter = c.req.query('projects')?.split(',').filter(Boolean);
    const clientId = crypto.randomUUID();
    return streamSSE(c, async (stream) => {
        console.log(`SSE client connected: ${clientId}`);
        // Register client
        addClient(clientId, stream, projectFilter);
        // Send initial connection event
        await stream.writeSSE({
            event: 'connected',
            data: JSON.stringify({ clientId, timestamp: new Date().toISOString() }),
        });
        // Keep connection alive with periodic pings
        const pingInterval = setInterval(async () => {
            try {
                await stream.writeSSE({
                    event: 'ping',
                    data: JSON.stringify({ timestamp: new Date().toISOString() }),
                });
            }
            catch {
                clearInterval(pingInterval);
                removeClient(clientId);
            }
        }, 30000);
        // Wait for client disconnect
        try {
            await new Promise((resolve) => {
                c.req.raw.signal.addEventListener('abort', resolve);
            });
        }
        finally {
            clearInterval(pingInterval);
            removeClient(clientId);
            console.log(`SSE client disconnected: ${clientId}`);
        }
    });
});
//# sourceMappingURL=events.js.map