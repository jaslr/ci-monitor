/**
 * Project Scanner
 *
 * Scans a local project directory to discover all infrastructure.
 * This runs server-side and has filesystem access.
 */

import { readFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import type {
  Project,
  InfraService,
  TechStack,
  DiscoveryResult,
  DiscoveryError,
  PackageManager,
  AccountIdentity
} from '$lib/types/infrastructure';
import {
  discoverFromPackageJson,
  discoverFromEnvVars,
  mergeServices,
  parseWranglerToml,
  parseFlyToml
} from './discovery';
import { lookupDomain, findProductionDomain } from './dns-lookup';

// Known project paths on this machine
export const KNOWN_PROJECTS: Record<string, { path: string; identity: AccountIdentity; displayName: string }> = {
  // jaslr projects
  'livna': { path: '/home/chip/livna', identity: 'jaslr', displayName: 'Livna' },
  'Ladderbox': { path: '/home/chip/blaterbox/ladderbox', identity: 'jaslr', displayName: 'Ladderbox' },
  'brontiq': { path: '/home/chip/brontiq', identity: 'jaslr', displayName: 'Brontiq' },
  'shippywhippy': { path: '/home/chip/shippywhippy', identity: 'jaslr', displayName: 'Shippy Whippy' },
  'loadmanagement': { path: '/home/chip/loadmanagement', identity: 'jaslr', displayName: 'Load Management' },
  'littlelistoflights': { path: '/home/chip/littlelistoflights', identity: 'jaslr', displayName: 'Little List of Lights' },
  'ci-monitor': { path: '/home/chip/ci-monitor', identity: 'jaslr', displayName: 'Infrastructure Observatory' },
  'wwc': { path: '/home/chip/wwc', identity: 'jaslr', displayName: 'Work With Chip' },
  'experify': { path: '/home/chip/experify', identity: 'jaslr', displayName: 'Experify' },
  'hazy': { path: '/home/chip/hazy', identity: 'jaslr', displayName: 'Hazy' },
  'seizure-detect': { path: '/home/chip/seizure-detect', identity: 'jaslr', displayName: 'Seizure Detect' },
  // jvp-ux projects
  'vastpuddle.com.au': { path: '/home/chip/vastpuddle.com.au', identity: 'jvp-ux', displayName: 'Vast Puddle' },
  'junipa.com.au': { path: '/home/chip/junipa.com.au', identity: 'jvp-ux', displayName: 'Junipa' },
  'junipa-organisations': { path: '/home/chip/junipa-organisations', identity: 'jvp-ux', displayName: 'Junipa Organisations' },
  'support.junipa.com.au': { path: '/home/chip/support.junipa.com.au', identity: 'jvp-ux', displayName: 'Junipa Support' },
};

/**
 * Check if a file exists
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read file if it exists, return undefined otherwise
 */
async function readFileIfExists(path: string): Promise<string | undefined> {
  try {
    return await readFile(path, 'utf-8');
  } catch {
    return undefined;
  }
}

/**
 * Detect package manager from lockfiles
 */
async function detectPackageManager(projectPath: string): Promise<PackageManager> {
  if (await fileExists(join(projectPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (await fileExists(join(projectPath, 'yarn.lock'))) return 'yarn';
  if (await fileExists(join(projectPath, 'bun.lockb'))) return 'bun';
  return 'npm';
}

/**
 * Scan a project directory for infrastructure
 */
export async function scanProject(projectPath: string, projectId: string): Promise<DiscoveryResult> {
  const errors: DiscoveryError[] = [];
  let services: InfraService[] = [];
  let stack: Partial<TechStack> = { projectId };

  // 1. Read package.json
  const packageJsonPath = join(projectPath, 'package.json');
  const packageJsonContent = await readFileIfExists(packageJsonPath);

  if (packageJsonContent) {
    try {
      const packageJson = JSON.parse(packageJsonContent);
      const discovered = discoverFromPackageJson(packageJson, projectId);
      services = mergeServices(services, discovered.services);
      stack = { ...stack, ...discovered.stack };
    } catch (e) {
      errors.push({
        source: 'package.json',
        message: `Failed to parse: ${e instanceof Error ? e.message : 'Unknown error'}`,
        recoverable: true,
      });
    }
  }

  // 2. Read .env.example for service hints
  const envExamplePath = join(projectPath, '.env.example');
  const envContent = await readFileIfExists(envExamplePath);

  if (envContent) {
    const envServices = discoverFromEnvVars(envContent, projectId);
    services = mergeServices(services, envServices);
  }

  // 3. Check for wrangler.toml (Cloudflare)
  const wranglerPath = join(projectPath, 'wrangler.toml');
  const wranglerContent = await readFileIfExists(wranglerPath);
  let wranglerConfig: Record<string, unknown> | undefined;

  if (wranglerContent) {
    wranglerConfig = parseWranglerToml(wranglerContent);

    // Add Cloudflare hosting if not already detected
    const hasCloudflare = services.some(s => s.provider === 'cloudflare' && s.category === 'hosting');
    if (!hasCloudflare) {
      services.push({
        id: `${projectId}-cloudflare-hosting`,
        projectId,
        category: 'hosting',
        provider: 'cloudflare',
        serviceName: 'Cloudflare Pages',
        status: 'unknown',
        lastChecked: new Date().toISOString(),
        config: wranglerConfig,
        discoveryMethod: 'config_file',
      });
    }
  }

  // 4. Check for fly.toml (Fly.io)
  const flyPath = join(projectPath, 'fly.toml');
  const flyContent = await readFileIfExists(flyPath);
  let flyConfig: Record<string, unknown> | undefined;

  if (flyContent) {
    flyConfig = parseFlyToml(flyContent);

    services.push({
      id: `${projectId}-flyio-hosting`,
      projectId,
      category: 'hosting',
      provider: 'flyio',
      serviceName: 'Fly.io',
      status: 'unknown',
      lastChecked: new Date().toISOString(),
      config: flyConfig,
      discoveryMethod: 'config_file',
    });
  }

  // 5. Check for vercel.json
  const vercelPath = join(projectPath, 'vercel.json');
  if (await fileExists(vercelPath)) {
    const hasVercel = services.some(s => s.provider === 'vercel');
    if (!hasVercel) {
      services.push({
        id: `${projectId}-vercel-hosting`,
        projectId,
        category: 'hosting',
        provider: 'vercel',
        serviceName: 'Vercel',
        status: 'unknown',
        lastChecked: new Date().toISOString(),
        config: {},
        discoveryMethod: 'config_file',
      });
    }
  }

  // 6. Check for GitHub Actions
  const githubActionsPath = join(projectPath, '.github', 'workflows');
  if (await fileExists(githubActionsPath)) {
    services.push({
      id: `${projectId}-github-ci`,
      projectId,
      category: 'ci',
      provider: 'github',
      serviceName: 'GitHub Actions',
      status: 'unknown',
      lastChecked: new Date().toISOString(),
      config: {},
      discoveryMethod: 'config_file',
    });
  }

  // 7. Detect package manager
  stack.packageManager = await detectPackageManager(projectPath);

  // 8. Try to find and lookup production domain
  let dns;
  const productionDomain = findProductionDomain({
    wrangler: wranglerConfig,
    fly: flyConfig,
    envVars: envContent,
  });

  if (productionDomain) {
    try {
      dns = await lookupDomain(productionDomain, projectId);

      // Add DNS provider as a service if detected
      if (dns.dnsProvider) {
        services.push({
          id: `${projectId}-dns`,
          projectId,
          category: 'dns',
          provider: dns.dnsProvider.toLowerCase().replace(/\s+/g, '-'),
          serviceName: dns.dnsProvider,
          status: 'healthy',
          lastChecked: new Date().toISOString(),
          config: { domain: productionDomain, nameservers: dns.nameservers },
          discoveryMethod: 'dns_lookup',
        });
      }
    } catch (e) {
      errors.push({
        source: 'dns_lookup',
        message: `Failed to lookup ${productionDomain}: ${e instanceof Error ? e.message : 'Unknown error'}`,
        recoverable: true,
      });
    }
  }

  return {
    projectId,
    timestamp: new Date().toISOString(),
    services,
    stack: stack as TechStack,
    dns,
    errors,
  };
}

/**
 * Scan all known projects
 */
export async function scanAllProjects(): Promise<Map<string, DiscoveryResult>> {
  const results = new Map<string, DiscoveryResult>();

  for (const [projectId, info] of Object.entries(KNOWN_PROJECTS)) {
    if (await fileExists(info.path)) {
      try {
        const result = await scanProject(info.path, projectId);
        results.set(projectId, result);
      } catch (e) {
        console.error(`Failed to scan ${projectId}:`, e);
      }
    }
  }

  return results;
}

/**
 * Build a Project object from discovery results
 */
export function buildProject(
  projectId: string,
  discoveryResult: DiscoveryResult
): Project {
  const info = KNOWN_PROJECTS[projectId];

  return {
    id: projectId,
    name: projectId,
    displayName: info?.displayName || projectId,
    repoOwner: info?.identity || 'unknown',
    repoName: projectId,
    localPath: info?.path,
    accountIdentity: info?.identity || 'jaslr',
    services: discoveryResult.services,
    stack: discoveryResult.stack,
    lastDiscovered: discoveryResult.timestamp,
  };
}
