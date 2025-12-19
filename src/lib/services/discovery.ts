/**
 * Infrastructure Discovery Service
 *
 * Programmatically discovers infrastructure by:
 * 1. Scanning package.json for dependencies
 * 2. Scanning config files (wrangler.toml, fly.toml, etc.)
 * 3. Parsing .env.example for service hints
 * 4. DNS lookups for domain/hosting info
 * 5. Probing known API endpoints
 */

import type {
  Project,
  InfraService,
  TechStack,
  DnsInfo,
  DnsRecord,
  DiscoveryResult,
  DiscoveryError,
  ServiceCategory,
  FrameworkType,
  CssFramework,
  TestingFramework,
  BuildTool,
  PackageManager
} from '$lib/types/infrastructure';

// =============================================================================
// DEPENDENCY -> SERVICE MAPPING
// =============================================================================

const DEPENDENCY_SERVICE_MAP: Record<string, { category: ServiceCategory; provider: string; serviceName: string }> = {
  // Databases
  '@supabase/supabase-js': { category: 'database', provider: 'supabase', serviceName: 'Supabase Database' },
  '@supabase/ssr': { category: 'auth', provider: 'supabase', serviceName: 'Supabase Auth' },
  '@planetscale/database': { category: 'database', provider: 'planetscale', serviceName: 'PlanetScale' },
  '@neondatabase/serverless': { category: 'database', provider: 'neon', serviceName: 'Neon Database' },
  'pg': { category: 'database', provider: 'postgres', serviceName: 'PostgreSQL' },
  'mysql2': { category: 'database', provider: 'mysql', serviceName: 'MySQL' },

  // Hosting adapters
  '@sveltejs/adapter-cloudflare': { category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages' },
  '@sveltejs/adapter-vercel': { category: 'hosting', provider: 'vercel', serviceName: 'Vercel' },
  '@sveltejs/adapter-netlify': { category: 'hosting', provider: 'netlify', serviceName: 'Netlify' },

  // Storage
  '@aws-sdk/client-s3': { category: 'storage', provider: 'aws', serviceName: 'AWS S3' },

  // Monitoring
  '@sentry/sveltekit': { category: 'monitoring', provider: 'sentry', serviceName: 'Sentry' },
  '@sentry/browser': { category: 'monitoring', provider: 'sentry', serviceName: 'Sentry' },
  '@sentry/cloudflare': { category: 'monitoring', provider: 'sentry', serviceName: 'Sentry (Cloudflare)' },

  // Analytics
  '@vercel/analytics': { category: 'analytics', provider: 'vercel', serviceName: 'Vercel Analytics' },
  'posthog-js': { category: 'analytics', provider: 'posthog', serviceName: 'PostHog' },
  'plausible-tracker': { category: 'analytics', provider: 'plausible', serviceName: 'Plausible' },

  // Auth
  '@auth/sveltekit': { category: 'auth', provider: 'authjs', serviceName: 'Auth.js' },
  '@clerk/clerk-sdk-node': { category: 'auth', provider: 'clerk', serviceName: 'Clerk' },
  'next-auth': { category: 'auth', provider: 'nextauth', serviceName: 'NextAuth.js' },
};

// Framework detection
const FRAMEWORK_PACKAGES: Record<string, FrameworkType> = {
  '@sveltejs/kit': 'sveltekit',
  'svelte': 'svelte',
  'next': 'nextjs',
  'react': 'react',
  '@angular/core': 'angular',
  'nuxt': 'nuxt',
  'vue': 'vue',
  'astro': 'astro',
};

// CSS framework detection
const CSS_PACKAGES: Record<string, CssFramework> = {
  'tailwindcss': 'tailwind',
  '@skeletonlabs/skeleton': 'skeleton',
  '@skeletonlabs/skeleton-svelte': 'skeleton',
  'daisyui': 'daisyui',
  'bootstrap': 'bootstrap',
};

// Testing framework detection
const TEST_PACKAGES: Record<string, TestingFramework> = {
  '@playwright/test': 'playwright',
  'cypress': 'cypress',
  'puppeteer': 'puppeteer',
  'jest': 'jest',
  'vitest': 'vitest',
};

// =============================================================================
// ENV VAR -> SERVICE HINTS
// =============================================================================

const ENV_SERVICE_HINTS: Record<string, { category: ServiceCategory; provider: string; serviceName: string }> = {
  'SUPABASE': { category: 'database', provider: 'supabase', serviceName: 'Supabase' },
  'SENTRY': { category: 'monitoring', provider: 'sentry', serviceName: 'Sentry' },
  'CLOUDFLARE_R2': { category: 'storage', provider: 'cloudflare', serviceName: 'Cloudflare R2' },
  'AWS_S3': { category: 'storage', provider: 'aws', serviceName: 'AWS S3' },
  'STRIPE': { category: 'external' as ServiceCategory, provider: 'stripe', serviceName: 'Stripe' },
  'RESEND': { category: 'email', provider: 'resend', serviceName: 'Resend' },
  'SENDGRID': { category: 'email', provider: 'sendgrid', serviceName: 'SendGrid' },
  'POSTMARK': { category: 'email', provider: 'postmark', serviceName: 'Postmark' },
  'PLAUSIBLE': { category: 'analytics', provider: 'plausible', serviceName: 'Plausible' },
  'POSTHOG': { category: 'analytics', provider: 'posthog', serviceName: 'PostHog' },
  'GA_': { category: 'analytics', provider: 'google', serviceName: 'Google Analytics' },
};

// =============================================================================
// DNS PROVIDER DETECTION
// =============================================================================

const NAMESERVER_PROVIDERS: Record<string, string> = {
  'cloudflare.com': 'Cloudflare',
  'awsdns': 'AWS Route 53',
  'googledomains.com': 'Google Domains',
  'domaincontrol.com': 'GoDaddy',
  'name-services.com': 'Namecheap',
  'dnsmadeeasy.com': 'DNS Made Easy',
  'ventraip': 'VentraIP',
  'digitalocean.com': 'DigitalOcean',
};

// =============================================================================
// DISCOVERY FUNCTIONS
// =============================================================================

/**
 * Discover services from package.json dependencies
 */
export function discoverFromPackageJson(
  packageJson: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> },
  projectId: string
): { services: InfraService[]; stack: Partial<TechStack> } {
  const services: InfraService[] = [];
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const seenProviders = new Set<string>();

  // Discover services
  for (const [dep, mapping] of Object.entries(DEPENDENCY_SERVICE_MAP)) {
    if (allDeps[dep] && !seenProviders.has(mapping.provider)) {
      seenProviders.add(mapping.provider);
      services.push({
        id: `${projectId}-${mapping.provider}-${mapping.category}`,
        projectId,
        category: mapping.category,
        provider: mapping.provider,
        serviceName: mapping.serviceName,
        status: 'unknown',
        lastChecked: new Date().toISOString(),
        config: { version: allDeps[dep] },
        discoveryMethod: 'package_json',
      });
    }
  }

  // Detect tech stack
  const stack: Partial<TechStack> = {
    projectId,
    language: allDeps['typescript'] ? 'typescript' : 'javascript',
    css: [],
    testing: [],
  };

  // Framework
  for (const [pkg, framework] of Object.entries(FRAMEWORK_PACKAGES)) {
    if (allDeps[pkg]) {
      stack.framework = framework;
      stack.frameworkVersion = allDeps[pkg];
      break;
    }
  }

  // CSS frameworks
  for (const [pkg, css] of Object.entries(CSS_PACKAGES)) {
    if (allDeps[pkg]) {
      stack.css!.push(css);
    }
  }

  // Testing frameworks
  for (const [pkg, test] of Object.entries(TEST_PACKAGES)) {
    if (allDeps[pkg]) {
      stack.testing!.push(test);
    }
  }

  // Build tool
  if (allDeps['vite']) stack.buildTool = 'vite';
  else if (allDeps['webpack']) stack.buildTool = 'webpack';
  else if (allDeps['esbuild']) stack.buildTool = 'esbuild';

  // Icons
  if (allDeps['@lucide/svelte'] || allDeps['lucide-react']) stack.icons = 'lucide';
  else if (allDeps['@heroicons/react']) stack.icons = 'heroicons';

  // Package manager (from lockfile or packageManager field)
  // This would need filesystem access to check for lockfiles

  return { services, stack };
}

/**
 * Discover services from environment variable names
 */
export function discoverFromEnvVars(
  envContent: string,
  projectId: string
): InfraService[] {
  const services: InfraService[] = [];
  const seenProviders = new Set<string>();
  const lines = envContent.split('\n');

  for (const line of lines) {
    const varName = line.split('=')[0]?.trim().toUpperCase() || '';

    for (const [hint, mapping] of Object.entries(ENV_SERVICE_HINTS)) {
      if (varName.includes(hint) && !seenProviders.has(mapping.provider)) {
        seenProviders.add(mapping.provider);
        services.push({
          id: `${projectId}-${mapping.provider}-${mapping.category}`,
          projectId,
          category: mapping.category,
          provider: mapping.provider,
          serviceName: mapping.serviceName,
          status: 'unknown',
          lastChecked: new Date().toISOString(),
          config: { envVar: varName },
          discoveryMethod: 'env_vars',
        });
      }
    }
  }

  return services;
}

/**
 * Detect DNS provider from nameservers
 */
export function detectDnsProvider(nameservers: string[]): string | undefined {
  for (const ns of nameservers) {
    const nsLower = ns.toLowerCase();
    for (const [pattern, provider] of Object.entries(NAMESERVER_PROVIDERS)) {
      if (nsLower.includes(pattern)) {
        return provider;
      }
    }
  }
  return undefined;
}

/**
 * Detect hosting provider from CNAME/A records
 */
export function detectHostingFromDns(records: DnsRecord[]): { provider: string; serviceName: string } | undefined {
  for (const record of records) {
    const value = record.value.toLowerCase();

    if (value.includes('pages.dev') || value.includes('cloudflare')) {
      return { provider: 'cloudflare', serviceName: 'Cloudflare Pages' };
    }
    if (value.includes('vercel') || value.includes('vercel-dns.com')) {
      return { provider: 'vercel', serviceName: 'Vercel' };
    }
    if (value.includes('netlify')) {
      return { provider: 'netlify', serviceName: 'Netlify' };
    }
    if (value.includes('fly.dev') || value.includes('fly.io')) {
      return { provider: 'flyio', serviceName: 'Fly.io' };
    }
    if (value.includes('herokuapp.com')) {
      return { provider: 'heroku', serviceName: 'Heroku' };
    }
    if (value.includes('railway.app')) {
      return { provider: 'railway', serviceName: 'Railway' };
    }
  }
  return undefined;
}

/**
 * Detect email provider from MX records
 */
export function detectEmailFromMx(mxRecords: DnsRecord[]): { provider: string; serviceName: string } | undefined {
  for (const record of mxRecords) {
    const value = record.value.toLowerCase();

    if (value.includes('google') || value.includes('gmail')) {
      return { provider: 'google', serviceName: 'Google Workspace' };
    }
    if (value.includes('outlook') || value.includes('microsoft')) {
      return { provider: 'microsoft', serviceName: 'Microsoft 365' };
    }
    if (value.includes('protonmail')) {
      return { provider: 'proton', serviceName: 'ProtonMail' };
    }
    if (value.includes('zoho')) {
      return { provider: 'zoho', serviceName: 'Zoho Mail' };
    }
    if (value.includes('mailgun')) {
      return { provider: 'mailgun', serviceName: 'Mailgun' };
    }
    if (value.includes('sendgrid')) {
      return { provider: 'sendgrid', serviceName: 'SendGrid' };
    }
  }
  return undefined;
}

/**
 * Parse wrangler.toml for Cloudflare config
 */
export function parseWranglerToml(content: string): Record<string, unknown> {
  const config: Record<string, unknown> = {};
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;

    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    if (key && value) {
      config[key.trim()] = value;
    }
  }

  return config;
}

/**
 * Parse fly.toml for Fly.io config
 */
export function parseFlyToml(content: string): Record<string, unknown> {
  const config: Record<string, unknown> = {};
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;

    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    if (key && value) {
      config[key.trim()] = value;
    }
  }

  return config;
}

/**
 * Merge discovered services, avoiding duplicates
 */
export function mergeServices(existing: InfraService[], discovered: InfraService[]): InfraService[] {
  const merged = [...existing];
  const existingIds = new Set(existing.map(s => `${s.provider}-${s.category}`));

  for (const service of discovered) {
    const key = `${service.provider}-${service.category}`;
    if (!existingIds.has(key)) {
      merged.push(service);
      existingIds.add(key);
    }
  }

  return merged;
}
