/**
 * Static Infrastructure Configuration
 *
 * This contains known infrastructure metadata for all projects.
 * This data is relatively static and changes infrequently.
 *
 * STATUS is dynamic and fetched separately (when we add status checking).
 */

import type { Project, InfraService, TechStack, AccountIdentity, LogCommand } from '$lib/types/infrastructure';

// Infrastructure metadata by project
export const INFRASTRUCTURE: Record<string, {
  displayName: string;
  identity: AccountIdentity;
  services: Omit<InfraService, 'id' | 'projectId' | 'lastChecked'>[];
  stack: Omit<TechStack, 'projectId'>;
  repoOwner: string;
  localPath?: string;
  logCommands?: LogCommand[];
  productionUrl?: string;  // Live production site URL for evidence
}> = {
  // ==========================================================================
  // CI-MONITOR - This application (monitors itself!)
  // ==========================================================================
  'ci-monitor': {
    displayName: 'Infrastructure Observatory',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    localPath: '/home/chip/ci-monitor',
    productionUrl: 'https://ci-monitor.pages.dev',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/ci-monitor' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jaslr/ci-monitor/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      frameworkVersion: '2.x',
      language: 'typescript',
      css: ['tailwind'],
      icons: 'lucide',
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'Dev Server', command: 'npm run dev 2>&1 | tail -f', environment: 'local', target: 'server', description: 'Dev server output' },
      { label: 'PocketBase', command: 'npm run pocketbase', environment: 'local', target: 'database', description: 'Local PocketBase logs' },
    ],
  },

  // ==========================================================================
  // LIVNA - Full-featured SvelteKit app
  // ==========================================================================
  livna: {
    displayName: 'Livna',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    localPath: '/home/chip/livna',
    productionUrl: 'https://livna.pages.dev',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/livna' },
      { category: 'database', provider: 'supabase', serviceName: 'Supabase Database', status: 'unknown', config: {}, discoveryMethod: 'package_json', dashboardUrl: 'https://supabase.com/dashboard/project/vtyfsrpupgrkkbnsiuqe' },
      { category: 'auth', provider: 'supabase', serviceName: 'Supabase Auth', status: 'unknown', config: {}, discoveryMethod: 'package_json', dashboardUrl: 'https://supabase.com/dashboard/project/vtyfsrpupgrkkbnsiuqe/auth/users' },
      { category: 'storage', provider: 'cloudflare', serviceName: 'Cloudflare R2', status: 'unknown', config: {}, discoveryMethod: 'env_vars', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/r2/default/buckets' },
      { category: 'monitoring', provider: 'sentry', serviceName: 'Sentry', status: 'unknown', config: {}, discoveryMethod: 'package_json', dashboardUrl: 'https://jaslr.sentry.io/projects/livna/' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jaslr/livna/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      frameworkVersion: '2.x',
      language: 'typescript',
      css: ['tailwind', 'skeleton'],
      icons: 'lucide',
      testing: ['playwright'],
      buildTool: 'vite',
      packageManager: 'pnpm',
    },
    logCommands: [
      { label: 'Dev Server (5173)', command: 'tail -f .logs/sveltekit-dev-5173.log', environment: 'local', target: 'server', description: 'Live dev server logs' },
      { label: 'Dev Server (5183)', command: 'tail -f .logs/sveltekit-dev-5183.log', environment: 'local', target: 'server', description: 'Alternate port dev logs' },
      { label: 'Dev Errors Only', command: 'tail -n 100 .logs/sveltekit-dev-5173.log | grep -E "(ERROR|error|Error)"', environment: 'local', target: 'server', description: 'Filter for errors' },
      { label: 'Monitor Errors', command: 'bash scripts/monitor-dev-logs.sh', environment: 'local', target: 'server', description: 'Real-time error monitoring' },
      { label: 'Production Logs', command: 'npm run logs:tail', environment: 'production', target: 'server', description: 'Tail Cloudflare Pages deployment' },
      { label: 'Latest Deploy Logs', command: 'npm run logs:latest', environment: 'production', target: 'server', description: 'Get latest deployment logs' },
      { label: 'List Deployments', command: 'npm run logs:list', environment: 'production', target: 'all', description: 'List all Cloudflare deployments' },
    ],
  },

  // ==========================================================================
  // BRONTIQ
  // ==========================================================================
  brontiq: {
    displayName: 'Brontiq',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    localPath: '/home/chip/brontiq',
    productionUrl: 'https://brontiq.fly.dev',
    services: [
      { category: 'hosting', provider: 'flyio', serviceName: 'Fly.io', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://fly.io/apps/brontiq' },
      { category: 'database', provider: 'flyio', serviceName: 'Fly.io PocketBase', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://fly.io/apps/brontiq-pocketbase' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jaslr/brontiq/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'Dev Server', command: 'docker compose logs -f', environment: 'local', target: 'all', description: 'Docker Compose dev logs' },
      { label: 'Production DB Logs', command: 'fly logs --app brontiq-pocketbase --no-tail', environment: 'production', target: 'database', description: 'PocketBase logs (check first)' },
      { label: 'Production App Logs', command: 'fly logs --app brontiq --no-tail', environment: 'production', target: 'server', description: 'Frontend/SSR logs' },
      { label: 'DB App Status', command: 'fly status --app brontiq-pocketbase', environment: 'production', target: 'database', description: 'Check PocketBase health' },
      { label: 'App Status', command: 'fly status --app brontiq', environment: 'production', target: 'server', description: 'Check app health' },
    ],
  },

  // ==========================================================================
  // LADDERBOX
  // ==========================================================================
  Ladderbox: {
    displayName: 'Ladderbox',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    localPath: '/home/chip/blaterbox/ladderbox',
    productionUrl: 'https://ladderbox.fly.dev',
    services: [
      { category: 'hosting', provider: 'flyio', serviceName: 'Fly.io', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://fly.io/apps/ladderbox' },
      { category: 'database', provider: 'flyio', serviceName: 'Fly.io PocketBase', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://fly.io/apps/ladderbox-pocketbase' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jaslr/Ladderbox/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'Dev Server', command: 'tail -f .logs/dev.log', environment: 'local', target: 'server', description: 'Live dev server logs' },
      { label: 'Dev Errors', command: 'grep ERROR .logs/dev.log', environment: 'local', target: 'server', description: 'Filter for errors' },
      { label: 'Production UI Logs', command: 'fly logs --app ladderbox --since 5m', environment: 'production', target: 'server', description: 'Last 5 min UI app logs' },
      { label: 'Production DB Logs', command: 'fly logs --app ladderbox-pocketbase --since 5m', environment: 'production', target: 'database', description: 'Last 5 min PocketBase logs' },
      { label: 'UI App Status', command: 'fly status --app ladderbox', environment: 'production', target: 'server', description: 'Check UI app health' },
      { label: 'DB App Status', command: 'fly status --app ladderbox-pocketbase', environment: 'production', target: 'database', description: 'Check PocketBase health' },
    ],
  },

  // ==========================================================================
  // SHIPPYWHIPPY
  // ==========================================================================
  shippywhippy: {
    displayName: 'Shippy Whippy',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    localPath: '/home/chip/shippywhippy',
    productionUrl: 'https://shippywhippy.fly.dev',
    services: [
      { category: 'hosting', provider: 'flyio', serviceName: 'Fly.io', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://fly.io/apps/shippywhippy' },
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages (Admin)', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/shippywhippy-admin' },
      { category: 'database', provider: 'supabase', serviceName: 'Supabase Database', status: 'unknown', config: {}, discoveryMethod: 'package_json', dashboardUrl: 'https://supabase.com/dashboard' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jaslr/shippywhippy/actions' },
    ],
    stack: {
      framework: 'other',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'Fly.io Logs', command: './scripts/tail_fly_logs.sh', environment: 'production', target: 'server', description: 'Production app logs' },
      { label: 'CF Admin Logs', command: './scripts/tail_cloudflare_admin_logs.sh', environment: 'production', target: 'server', description: 'Admin dashboard logs' },
      { label: 'Carrier Service', command: 'tail -f carrier-service.log', environment: 'local', target: 'server', description: 'Australia Post/Aramex logs' },
      { label: 'Check Local DB', command: 'npm run check:db', environment: 'local', target: 'database', description: 'Verify PostgreSQL connection' },
      { label: 'Check Prod DB', command: 'npm run check:db:prod', environment: 'production', target: 'database', description: 'Verify Supabase connection' },
    ],
  },

  // ==========================================================================
  // LOADMANAGEMENT (Gabbyblat MCP)
  // ==========================================================================
  loadmanagement: {
    displayName: 'Load Management',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    localPath: '/home/chip/loadmanagement',
    productionUrl: 'https://blatblat.fly.dev',
    services: [
      { category: 'hosting', provider: 'flyio', serviceName: 'Fly.io', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://fly.io/apps/blatblat' },
      { category: 'database', provider: 'pocketbase', serviceName: 'PocketBase', status: 'unknown', config: {}, discoveryMethod: 'config_file' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jaslr/loadmanagement/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'Dev Server', command: 'tail -f logs/dev-server.log', environment: 'local', target: 'server', description: 'Vite dev logs (1000 line rolling)' },
      { label: 'Production Logs', command: './scripts/tailFlyLogs.sh', environment: 'production', target: 'server', description: 'Fly.io logs to logs/tail.log' },
      { label: 'Fly.io Direct', command: 'flyctl logs -a blatblat', environment: 'production', target: 'server', description: 'Direct Fly.io streaming' },
      { label: 'PocketBase', command: 'npm run pocketbase', environment: 'local', target: 'database', description: 'Local PocketBase at :8190' },
    ],
  },

  // ==========================================================================
  // LITTLELISTOFLIGHTS
  // ==========================================================================
  littlelistoflights: {
    displayName: 'Little List of Lights',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    localPath: '/home/chip/littlelistoflights',
    productionUrl: 'https://littlelistoflights.pages.dev',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/littlelistoflights' },
      { category: 'database', provider: 'supabase', serviceName: 'Supabase Database', status: 'unknown', config: {}, discoveryMethod: 'package_json', dashboardUrl: 'https://supabase.com/dashboard/project/hjrawccyhnvtwulzfbbo' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jaslr/littlelistoflights/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'CF Pages Logs', command: 'npm run cf:logs', environment: 'production', target: 'server', description: 'Cloudflare Pages real-time logs' },
      { label: 'Dev Server', command: 'npm run dev', environment: 'local', target: 'server', description: 'Vite dev server on :5173' },
      { label: 'Supabase Status', command: 'npm run supabase:status', environment: 'local', target: 'database', description: 'Docker container status' },
      { label: 'DB Studio', command: 'npm run db:studio', environment: 'local', target: 'database', description: 'Open Supabase Studio' },
      { label: 'DB Backup', command: 'npm run db:backup', environment: 'production', target: 'database', description: 'Create database backup' },
    ],
  },

  // ==========================================================================
  // JVP-UX PROJECTS
  // ==========================================================================
  'vastpuddle.com.au': {
    displayName: 'Vast Puddle',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    localPath: '/home/chip/vastpuddle/vastpuddle.com.au',
    productionUrl: 'https://vastpuddle.com.au',
    services: [
      { category: 'hosting', provider: 'github', serviceName: 'GitHub Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jvp-ux/vastpuddle.com.au/deployments' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jvp-ux/vastpuddle.com.au/actions' },
    ],
    stack: {
      framework: 'other',
      language: 'javascript',
      css: ['other'],
      testing: [],
      buildTool: 'other',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'Deploy History', command: 'gh run list --workflow=deploy-pages.yml --limit=5', environment: 'production', target: 'all', description: 'GitHub Pages deployments' },
      { label: 'Git Log', command: 'git log --oneline -10', environment: 'local', target: 'all', description: 'Recent commits' },
    ],
  },

  'junipa.com.au': {
    displayName: 'Junipa Marketing',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    localPath: '/home/chip/vastpuddle/junipa.com.au',
    productionUrl: 'https://junipa.com.au',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/junipa-com-au' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jvp-ux/junipa.com.au/actions' },
    ],
    stack: {
      framework: 'other',
      language: 'javascript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'other',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'Dev Server', command: 'npm run dev', environment: 'local', target: 'server', description: '11ty + Wrangler dev' },
      { label: 'Deploy', command: 'npm run deploy', environment: 'production', target: 'all', description: 'Deploy to Cloudflare' },
    ],
  },

  'junipa-organisations': {
    displayName: 'Junipa Organisations',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    localPath: '/home/chip/vastpuddle/junipa-organisations',
    productionUrl: 'https://junipa-organisations.web.app',
    services: [
      { category: 'hosting', provider: 'firebase', serviceName: 'Firebase Hosting', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.firebase.google.com/project/junipa-organisations/hosting' },
      { category: 'hosting', provider: 'gcp', serviceName: 'Cloud Run (API)', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/run?project=junipa-organisations' },
      { category: 'database', provider: 'firebase', serviceName: 'Firestore', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.firebase.google.com/project/junipa-organisations/firestore' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jvp-ux/junipa-organisations/actions' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'Dev Server', command: 'tail -50 logs/dev-server.log', environment: 'local', target: 'server', description: 'Last 50 lines dev logs' },
      { label: 'Dev Errors', command: 'grep -i "error\\|fail\\|exception" logs/dev-server.log', environment: 'local', target: 'server', description: 'Filter errors only' },
      { label: 'Live Dev Logs', command: 'tail -f logs/dev-server.log', environment: 'local', target: 'server', description: 'Follow dev server output' },
      { label: 'Start Dev', command: './tools/start-org-portal.sh', environment: 'local', target: 'server', description: 'Start with logging on :4300' },
      { label: 'Firebase Emulators', command: './tools/start-emulators.sh', environment: 'local', target: 'database', description: 'Start Firebase emulators' },
    ],
  },

  'support.junipa.com.au': {
    displayName: 'Junipa Support',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    productionUrl: 'https://support.junipa.com.au',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/support-junipa-com-au' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jvp-ux/support.junipa.com.au/actions' },
    ],
    stack: {
      framework: 'sveltekit',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'vite',
      packageManager: 'npm',
    },
  },

  // ==========================================================================
  // JUNIPA MAIN APP (Angular + NestJS)
  // ==========================================================================
  'junipa': {
    displayName: 'Junipa App',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    localPath: '/home/chip/vastpuddle/junipa',
    productionUrl: 'https://junipa.web.app',
    services: [
      { category: 'hosting', provider: 'firebase', serviceName: 'Firebase Hosting', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.firebase.google.com/project/junipa/hosting' },
      { category: 'hosting', provider: 'gcp', serviceName: 'Cloud Run (API)', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/run?project=junipa' },
      { category: 'database', provider: 'firebase', serviceName: 'Firestore', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.firebase.google.com/project/junipa/firestore' },
      { category: 'auth', provider: 'firebase', serviceName: 'Firebase Auth', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.firebase.google.com/project/junipa/authentication' },
      { category: 'storage', provider: 'firebase', serviceName: 'Firebase Storage', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.firebase.google.com/project/junipa/storage' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['angular-material'],
      testing: ['playwright'],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'Dev Server', command: 'tail -1000 logs/devserver.log', environment: 'local', target: 'server', description: 'Angular dev logs' },
      { label: 'Dev Errors', command: 'grep -i "error" logs/devserver.log', environment: 'local', target: 'server', description: 'Filter errors only' },
      { label: 'Check Dev Running', command: 'lsof -ti:4200', environment: 'local', target: 'server', description: 'Check if dev server on :4200' },
      { label: 'Start Frontend', command: 'npm run dev:junipa', environment: 'local', target: 'server', description: 'Start Angular on :4200' },
      { label: 'Start API', command: 'npm run dev:api', environment: 'local', target: 'server', description: 'Start NestJS API' },
      { label: 'Start All', command: 'npm run dev:all', environment: 'local', target: 'all', description: 'API + Frontend' },
      { label: 'Firebase Emulators', command: 'npm run emulators:start', environment: 'local', target: 'database', description: 'Start Firebase emulators' },
    ],
  },

  // ==========================================================================
  // JUNIPA TENANT APPS (GCP Cloud Build)
  // Note: All tenants share the same codebase from /home/chip/vastpuddle/junipa
  // with environment-specific configs
  // ==========================================================================
  'junipa-demo': {
    displayName: 'Junipa Demo',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    productionUrl: 'https://junipa.appspot.com',
    services: [
      { category: 'hosting', provider: 'gcp', serviceName: 'GCP App Engine', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/appengine?project=junipa' },
      { category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/cloud-build/builds?project=junipa' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['angular-material'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'App Engine Logs', command: 'gcloud app logs tail --project=junipa', environment: 'production', target: 'server', description: 'Stream App Engine logs' },
      { label: 'Cloud Build History', command: 'gcloud builds list --project=junipa --limit=5', environment: 'production', target: 'all', description: 'Recent builds' },
    ],
  },

  'junipa-cedarcollege': {
    displayName: 'Junipa - Cedar College',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    productionUrl: 'https://cedarcollege-prod.appspot.com',
    services: [
      { category: 'hosting', provider: 'gcp', serviceName: 'GCP App Engine', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/appengine?project=cedarcollege-prod' },
      { category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/cloud-build/builds?project=cedarcollege-prod' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['angular-material'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'App Engine Logs', command: 'gcloud app logs tail --project=cedarcollege-prod', environment: 'production', target: 'server', description: 'Stream App Engine logs' },
      { label: 'Cloud Build History', command: 'gcloud builds list --project=cedarcollege-prod --limit=5', environment: 'production', target: 'all', description: 'Recent builds' },
    ],
  },

  'junipa-menofbusiness': {
    displayName: 'Junipa - Men of Business',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    productionUrl: 'https://menofbusiness-prod.appspot.com',
    services: [
      { category: 'hosting', provider: 'gcp', serviceName: 'GCP App Engine', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/appengine?project=menofbusiness-prod' },
      { category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/cloud-build/builds?project=menofbusiness-prod' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['angular-material'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'App Engine Logs', command: 'gcloud app logs tail --project=menofbusiness-prod', environment: 'production', target: 'server', description: 'Stream App Engine logs' },
      { label: 'Cloud Build History', command: 'gcloud builds list --project=menofbusiness-prod --limit=5', environment: 'production', target: 'all', description: 'Recent builds' },
    ],
  },

  'junipa-mjc': {
    displayName: 'Junipa - MJC',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    productionUrl: 'https://mjc-prod-2022b.appspot.com',
    services: [
      { category: 'hosting', provider: 'gcp', serviceName: 'GCP App Engine', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/appengine?project=mjc-prod-2022b' },
      { category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/cloud-build/builds?project=mjc-prod-2022b' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['angular-material'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'App Engine Logs', command: 'gcloud app logs tail --project=mjc-prod-2022b', environment: 'production', target: 'server', description: 'Stream App Engine logs' },
      { label: 'Cloud Build History', command: 'gcloud builds list --project=mjc-prod-2022b --limit=5', environment: 'production', target: 'all', description: 'Recent builds' },
    ],
  },

  'junipa-tuncurry': {
    displayName: 'Junipa - Tuncurry',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    productionUrl: 'https://mjc-tuncurry-prod.appspot.com',
    services: [
      { category: 'hosting', provider: 'gcp', serviceName: 'GCP App Engine', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/appengine?project=mjc-tuncurry-prod' },
      { category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/cloud-build/builds?project=mjc-tuncurry-prod' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['angular-material'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'App Engine Logs', command: 'gcloud app logs tail --project=mjc-tuncurry-prod', environment: 'production', target: 'server', description: 'Stream App Engine logs' },
      { label: 'Cloud Build History', command: 'gcloud builds list --project=mjc-tuncurry-prod --limit=5', environment: 'production', target: 'all', description: 'Recent builds' },
    ],
  },

  'junipa-central-demo': {
    displayName: 'Junipa Central Demo',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    productionUrl: 'https://junipa-central-demo.appspot.com',
    services: [
      { category: 'hosting', provider: 'gcp', serviceName: 'GCP App Engine', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/appengine?project=junipa-central-demo' },
      { category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/cloud-build/builds?project=junipa-central-demo' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['angular-material'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'App Engine Logs', command: 'gcloud app logs tail --project=junipa-central-demo', environment: 'production', target: 'server', description: 'Stream App Engine logs' },
      { label: 'Cloud Build History', command: 'gcloud builds list --project=junipa-central-demo --limit=5', environment: 'production', target: 'all', description: 'Recent builds' },
    ],
  },

  'junipa-west-demo': {
    displayName: 'Junipa West Demo',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    productionUrl: 'https://junipa-west-demo.appspot.com',
    services: [
      { category: 'hosting', provider: 'gcp', serviceName: 'GCP App Engine', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/appengine?project=junipa-west-demo' },
      { category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://console.cloud.google.com/cloud-build/builds?project=junipa-west-demo' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['angular-material'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
    logCommands: [
      { label: 'App Engine Logs', command: 'gcloud app logs tail --project=junipa-west-demo', environment: 'production', target: 'server', description: 'Stream App Engine logs' },
      { label: 'Cloud Build History', command: 'gcloud builds list --project=junipa-west-demo --limit=5', environment: 'production', target: 'all', description: 'Recent builds' },
    ],
  },
};

/**
 * Get infrastructure for a project by repo name
 */
export function getProjectInfrastructure(repoName: string): {
  displayName: string;
  identity: AccountIdentity;
  repoOwner: string;
  localPath?: string;
  services: InfraService[];
  stack: TechStack;
  logCommands?: LogCommand[];
  productionUrl?: string;
} | null {
  const infra = INFRASTRUCTURE[repoName];
  if (!infra) return null;

  const now = new Date().toISOString();

  return {
    displayName: infra.displayName,
    identity: infra.identity,
    repoOwner: infra.repoOwner,
    localPath: infra.localPath,
    productionUrl: infra.productionUrl,
    services: infra.services.map((s, i) => ({
      ...s,
      id: `${repoName}-${s.provider}-${s.category}-${i}`,
      projectId: repoName,
      lastChecked: now,
    })),
    stack: {
      ...infra.stack,
      projectId: repoName,
    },
    logCommands: infra.logCommands,
  };
}

/**
 * Get all known projects with infrastructure
 */
export function getAllProjectsInfrastructure(): Map<string, ReturnType<typeof getProjectInfrastructure>> {
  const result = new Map();
  for (const repoName of Object.keys(INFRASTRUCTURE)) {
    result.set(repoName, getProjectInfrastructure(repoName));
  }
  return result;
}

/**
 * Provider usage info for ecosystem view
 */
export interface ProviderUsage {
  provider: string;
  serviceName: string;
  projects: { id: string; displayName: string }[];
  dashboardUrl?: string;
}

/**
 * Category with providers for ecosystem view
 */
export interface CategoryProviders {
  category: string;
  providers: ProviderUsage[];
}

/**
 * Get all providers grouped by category with their dependent projects
 * Inverts the data structure from project-centric to provider-centric
 */
export function getProvidersByCategory(): CategoryProviders[] {
  const categoryMap = new Map<string, Map<string, ProviderUsage>>();

  for (const [repoName, infra] of Object.entries(INFRASTRUCTURE)) {
    for (const service of infra.services) {
      // Get or create category
      if (!categoryMap.has(service.category)) {
        categoryMap.set(service.category, new Map());
      }
      const providerMap = categoryMap.get(service.category)!;

      // Get or create provider entry
      if (!providerMap.has(service.provider)) {
        providerMap.set(service.provider, {
          provider: service.provider,
          serviceName: service.serviceName,
          projects: [],
          dashboardUrl: undefined,
        });
      }

      // Add project to provider
      const providerUsage = providerMap.get(service.provider)!;
      providerUsage.projects.push({
        id: repoName,
        displayName: infra.displayName,
      });

      // Keep first dashboard URL as representative
      if (!providerUsage.dashboardUrl && service.dashboardUrl) {
        providerUsage.dashboardUrl = service.dashboardUrl;
      }
    }
  }

  // Convert to array format, sorted by category importance
  const categoryOrder = ['hosting', 'database', 'auth', 'storage', 'ci', 'monitoring', 'dns', 'email', 'analytics', 'cdn', 'secrets'];

  const result: CategoryProviders[] = [];

  for (const category of categoryOrder) {
    const providerMap = categoryMap.get(category);
    if (providerMap) {
      const providers = Array.from(providerMap.values())
        .sort((a, b) => b.projects.length - a.projects.length);

      result.push({ category, providers });
    }
  }

  // Add any remaining categories not in the order
  for (const [category, providerMap] of categoryMap) {
    if (!categoryOrder.includes(category)) {
      const providers = Array.from(providerMap.values())
        .sort((a, b) => b.projects.length - a.projects.length);
      result.push({ category, providers });
    }
  }

  return result;
}

/**
 * Get flat list of all projects for ecosystem diagram
 */
export function getAllProjects(): { id: string; displayName: string; identity: string }[] {
  return Object.entries(INFRASTRUCTURE).map(([id, infra]) => ({
    id,
    displayName: infra.displayName,
    identity: infra.identity,
  }));
}
