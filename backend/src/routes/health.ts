import { Hono } from 'hono';
import { getDbStatus } from '../db/client.js';

export const healthRoutes = new Hono();

healthRoutes.get('/', async (c) => {
  const dbStatus = await getDbStatus();

  return c.json({
    status: dbStatus.connected ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks: {
      database: dbStatus,
    },
  });
});
