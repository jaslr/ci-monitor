import pg from 'pg';
import { env } from '../config/env.js';
const { Pool } = pg;
let pool = null;
let isReconnecting = false;
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function createPool() {
    if (!env.databaseUrl) {
        console.warn('DATABASE_URL not set, running without database');
        return null;
    }
    const newPool = new Pool({
        connectionString: env.databaseUrl,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    });
    // Test connection
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const client = await newPool.connect();
            await client.query('SELECT NOW()');
            client.release();
            console.log('Database connected successfully');
            return newPool;
        }
        catch (err) {
            console.error(`Database connection attempt ${attempt}/${maxRetries} failed:`, err);
            if (attempt === maxRetries) {
                console.warn('Database unavailable after retries');
                await newPool.end().catch(() => { });
                return null;
            }
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            console.log(`Retrying in ${delay}ms...`);
            await sleep(delay);
        }
    }
    return null;
}
export async function initDb() {
    pool = await createPool();
    if (!pool) {
        console.warn('Running in degraded mode - will attempt reconnection on requests');
    }
}
// Try to reconnect if pool is null - called on each request that needs DB
export async function ensureDb() {
    if (pool) {
        // Verify connection is still alive
        try {
            await pool.query('SELECT 1');
            return pool;
        }
        catch (err) {
            console.error('Database connection lost, attempting reconnect:', err);
            try {
                await pool.end();
            }
            catch { }
            pool = null;
        }
    }
    // Pool is null, try to reconnect (but only one reconnection attempt at a time)
    if (!pool && !isReconnecting) {
        isReconnecting = true;
        console.log('Attempting database reconnection...');
        try {
            pool = await createPool();
        }
        finally {
            isReconnecting = false;
        }
    }
    return pool;
}
export function getPool() {
    return pool;
}
export async function query(text, params) {
    // Try to reconnect if pool is null
    const activePool = await ensureDb();
    if (!activePool) {
        throw new Error('Database not initialized');
    }
    return activePool.query(text, params);
}
export async function getDbStatus() {
    const activePool = await ensureDb();
    if (!activePool) {
        return { connected: false };
    }
    try {
        const start = Date.now();
        await activePool.query('SELECT 1');
        return { connected: true, latencyMs: Date.now() - start };
    }
    catch {
        return { connected: false };
    }
}
export async function closeDb() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
//# sourceMappingURL=client.js.map