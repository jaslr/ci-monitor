import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createMiddleware } from 'hono/factory';
import { env, validateEnv } from './config/env.js';
import { healthRoutes } from './routes/health.js';
import { webhookRoutes } from './routes/webhooks.js';
import { eventsRoutes } from './routes/events.js';
import { apiRoutes } from './routes/api.js';
import { authRoutes } from './routes/auth.js';
import { startScheduler } from './jobs/scheduler.js';
import { initDb } from './db/client.js';
// Validate environment
validateEnv();
// Create Hono app
const app = new Hono();
// API Secret authentication middleware
const apiAuth = createMiddleware(async (c, next) => {
    // Check Authorization header or query param for API secret
    const authHeader = c.req.header('Authorization');
    const querySecret = c.req.query('secret');
    const providedSecret = authHeader?.replace('Bearer ', '') || querySecret;
    if (!env.apiSecret) {
        // No secret configured (dev mode), allow all
        return next();
    }
    if (providedSecret !== env.apiSecret) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    return next();
});
// Middleware
app.use('*', logger());
app.use('*', cors({
    origin: ['https://orchon.pages.dev', 'https://ci-monitor.pages.dev', 'http://localhost:4573', 'http://localhost:5173'],
    credentials: true,
}));
// Public routes (no auth required)
app.route('/health', healthRoutes);
app.route('/webhooks', webhookRoutes);
// Auth routes - /auth/verify is public, admin endpoints require API secret
app.use('/auth/users', apiAuth);
app.use('/auth/users/*', apiAuth);
app.use('/auth/set-password', apiAuth);
app.route('/auth', authRoutes);
// Protected routes (require API secret)
app.use('/events/*', apiAuth);
app.use('/api/*', apiAuth);
app.route('/events', eventsRoutes);
app.route('/api', apiRoutes);
// Root
app.get('/', (c) => {
    return c.json({
        name: 'observatory-backend',
        version: '0.1.0',
        status: 'running',
    });
});
// Start server
async function main() {
    // Initialize database
    await initDb();
    // Start background jobs
    startScheduler();
    // Start HTTP server
    console.log(`Starting observatory-backend on port ${env.port}...`);
    serve({
        fetch: app.fetch,
        port: env.port,
    });
    console.log(`Server running at http://localhost:${env.port}`);
}
main().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map