/**
 * Static Infrastructure Configuration
 *
 * This contains known infrastructure metadata for all projects.
 * This data is relatively static and changes infrequently.
 *
 * STATUS is dynamic and fetched separately (when we add status checking).
 */

import type { Project, InfraService, TechStack, AccountIdentity } from '$lib/types/infrastructure';

// Infrastructure metadata by project
export const INFRASTRUCTURE: Record<string, {
  displayName: string;
  identity: AccountIdentity;
  services: Omit<InfraService, 'id' | 'projectId' | 'lastChecked'>[];
  stack: Omit<TechStack, 'projectId'>;
  repoOwner: string;
}> = {
  // ==========================================================================
  // CI-MONITOR - This application (monitors itself!)
  // ==========================================================================
  'ci-monitor': {
    displayName: 'Infrastructure Observatory',
    identity: 'jaslr',
    repoOwner: 'jaslr',
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
  },

  // ==========================================================================
  // LIVNA - Full-featured SvelteKit app
  // ==========================================================================
  livna: {
    displayName: 'Livna',
    identity: 'jaslr',
    repoOwner: 'jaslr',
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
  },

  // ==========================================================================
  // BRONTIQ
  // ==========================================================================
  brontiq: {
    displayName: 'Brontiq',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/brontiq' },
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
  },

  // ==========================================================================
  // LADDERBOX
  // ==========================================================================
  Ladderbox: {
    displayName: 'Ladderbox',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    services: [
      { category: 'hosting', provider: 'flyio', serviceName: 'Fly.io', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://fly.io/apps/ladderbox' },
      { category: 'database', provider: 'supabase', serviceName: 'Supabase Database', status: 'unknown', config: {}, discoveryMethod: 'package_json', dashboardUrl: 'https://supabase.com/dashboard/project/ladderbox' },
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
  },

  // ==========================================================================
  // SHIPPYWHIPPY
  // ==========================================================================
  shippywhippy: {
    displayName: 'Shippy Whippy',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/shippywhippy' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jaslr/shippywhippy/actions' },
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
  // LOADMANAGEMENT
  // ==========================================================================
  loadmanagement: {
    displayName: 'Load Management',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/loadmanagement' },
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
  },

  // ==========================================================================
  // LITTLELISTOFLIGHTS
  // ==========================================================================
  littlelistoflights: {
    displayName: 'Little List of Lights',
    identity: 'jaslr',
    repoOwner: 'jaslr',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/littlelistoflights' },
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
  },

  // ==========================================================================
  // JVP-UX PROJECTS
  // ==========================================================================
  'vastpuddle.com.au': {
    displayName: 'Vast Puddle',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/vastpuddle-com-au' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jvp-ux/vastpuddle.com.au/actions' },
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

  'junipa.com.au': {
    displayName: 'Junipa',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/junipa-com-au' },
      { category: 'database', provider: 'supabase', serviceName: 'Supabase Database', status: 'unknown', config: {}, discoveryMethod: 'package_json', dashboardUrl: 'https://supabase.com/dashboard/project/junipa' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jvp-ux/junipa.com.au/actions' },
    ],
    stack: {
      framework: 'angular',
      language: 'typescript',
      css: ['tailwind'],
      testing: [],
      buildTool: 'webpack',
      packageManager: 'npm',
    },
  },

  'junipa-organisations': {
    displayName: 'Junipa Organisations',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
    services: [
      { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://dash.cloudflare.com/?to=/:account/pages/view/junipa-organisations' },
      { category: 'ci', provider: 'github', serviceName: 'GitHub Actions', status: 'unknown', config: {}, discoveryMethod: 'config_file', dashboardUrl: 'https://github.com/jvp-ux/junipa-organisations/actions' },
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

  'support.junipa.com.au': {
    displayName: 'Junipa Support',
    identity: 'jvp-ux',
    repoOwner: 'jvp-ux',
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
};

/**
 * Get infrastructure for a project by repo name
 */
export function getProjectInfrastructure(repoName: string): {
  displayName: string;
  identity: AccountIdentity;
  repoOwner: string;
  services: InfraService[];
  stack: TechStack;
} | null {
  const infra = INFRASTRUCTURE[repoName];
  if (!infra) return null;

  const now = new Date().toISOString();

  return {
    displayName: infra.displayName,
    identity: infra.identity,
    repoOwner: infra.repoOwner,
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
