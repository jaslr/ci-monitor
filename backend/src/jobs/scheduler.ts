import { pollFlyioApps } from '../services/flyio/poller.js';
import { pollCloudflarePages } from '../services/cloudflare/poller.js';
import { pollGCPCloudBuild } from '../services/gcp/poller.js';
import { pollSupabaseServices } from '../services/supabase/poller.js';
import { runUptimeChecks } from '../services/uptime/checker.js';

// Polling intervals
const FLY_POLL_INTERVAL = 60 * 1000; // 1 minute
const CF_POLL_INTERVAL = 60 * 1000; // 1 minute
const GCP_POLL_INTERVAL = 60 * 1000; // 1 minute
const SUPABASE_POLL_INTERVAL = 60 * 1000; // 1 minute
const UPTIME_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

let flyInterval: NodeJS.Timeout | null = null;
let cfInterval: NodeJS.Timeout | null = null;
let gcpInterval: NodeJS.Timeout | null = null;
let supabaseInterval: NodeJS.Timeout | null = null;
let uptimeInterval: NodeJS.Timeout | null = null;

export function startScheduler(): void {
  console.log('Starting background job scheduler...');

  // Run initial checks after a short delay
  setTimeout(() => {
    console.log('Running initial checks...');
    pollFlyioApps().catch((err) => console.error('Fly.io poll error:', err));
    pollCloudflarePages().catch((err) => console.error('Cloudflare poll error:', err));
    pollGCPCloudBuild().catch((err) => console.error('GCP Cloud Build poll error:', err));
    pollSupabaseServices().catch((err) => console.error('Supabase poll error:', err));
    runUptimeChecks().catch((err) => console.error('Uptime check error:', err));
  }, 5000);

  // Schedule recurring polls
  flyInterval = setInterval(() => {
    pollFlyioApps().catch((err) => console.error('Fly.io poll error:', err));
  }, FLY_POLL_INTERVAL);

  cfInterval = setInterval(() => {
    pollCloudflarePages().catch((err) => console.error('Cloudflare poll error:', err));
  }, CF_POLL_INTERVAL);

  gcpInterval = setInterval(() => {
    pollGCPCloudBuild().catch((err) => console.error('GCP Cloud Build poll error:', err));
  }, GCP_POLL_INTERVAL);

  supabaseInterval = setInterval(() => {
    pollSupabaseServices().catch((err) => console.error('Supabase poll error:', err));
  }, SUPABASE_POLL_INTERVAL);

  uptimeInterval = setInterval(() => {
    runUptimeChecks().catch((err) => console.error('Uptime check error:', err));
  }, UPTIME_CHECK_INTERVAL);

  console.log(`Scheduler started:
  - Fly.io polling: every ${FLY_POLL_INTERVAL / 1000}s
  - Cloudflare polling: every ${CF_POLL_INTERVAL / 1000}s
  - GCP Cloud Build polling: every ${GCP_POLL_INTERVAL / 1000}s
  - Supabase polling: every ${SUPABASE_POLL_INTERVAL / 1000}s
  - Uptime checks: every ${UPTIME_CHECK_INTERVAL / 1000}s`);
}

export function stopScheduler(): void {
  if (flyInterval) {
    clearInterval(flyInterval);
    flyInterval = null;
  }
  if (cfInterval) {
    clearInterval(cfInterval);
    cfInterval = null;
  }
  if (gcpInterval) {
    clearInterval(gcpInterval);
    gcpInterval = null;
  }
  if (supabaseInterval) {
    clearInterval(supabaseInterval);
    supabaseInterval = null;
  }
  if (uptimeInterval) {
    clearInterval(uptimeInterval);
    uptimeInterval = null;
  }
  console.log('Scheduler stopped');
}
