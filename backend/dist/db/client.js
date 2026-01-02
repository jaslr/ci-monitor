import pg from 'pg';
import { env } from '../config/env.js';
const { Pool } = pg;
let pool = null;
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function initDb() {
    if (!env.databaseUrl) {
        console.warn('DATABASE_URL not set, running without database');
        return;
    }
    pool = new Pool({
        connectionString: env.databaseUrl,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    });
    // Retry connection with exponential backoff (handles sleeping serverless DBs)
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const client = await pool.connect();
            await client.query('SELECT NOW()');
            client.release();
            console.log('Database connected successfully');
            return;
        }
        catch (err) {
            console.error(`Database connection attempt ${attempt}/${maxRetries} failed:`, err);
            if (attempt === maxRetries) {
                console.warn('Database unavailable - running in degraded mode (no persistence)');
                pool = null; // Clear pool so getPool() returns null
                return; // Don't throw - run in degraded mode
            }
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            console.log(`Retrying in ${delay}ms...`);
            await sleep(delay);
        }
    }
}
export function getPool() {
    return pool;
}
export async function query(text, params) {
    if (!pool) {
        throw new Error('Database not initialized');
    }
    return pool.query(text, params);
}
export async function getDbStatus() {
    if (!pool) {
        return { connected: false };
    }
    try {
        const start = Date.now();
        await pool.query('SELECT 1');
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