/**
 * Infrastructure Observatory - Core Types
 *
 * Central type definitions for all infrastructure monitoring.
 * Keep this file as the single source of truth for data structures.
 */

// =============================================================================
// ACCOUNTS & IDENTITY
// =============================================================================

export type AccountIdentity =
  | 'jaslr'           // Ladderbox, hobby projects
  | 'jvp-ux'          // Bath Puddle / Junipa work
  | 'stickyjason'     // Misc projects
  | 'client';         // LAT&A, Brontic, etc.

export interface AccountMapping {
  identity: AccountIdentity;
  githubUsername: string;
  displayName: string;
  projects: string[];  // Project IDs
}

// =============================================================================
// PROJECTS
// =============================================================================

export interface Project {
  id: string;
  name: string;                    // "livna" (repo name)
  displayName: string;             // "Livna" (human readable)
  repoOwner: string;               // GitHub owner
  repoName: string;                // GitHub repo
  localPath?: string;              // Local filesystem path if available
  accountIdentity: AccountIdentity;
  services: InfraService[];
  stack?: TechStack;
  lastDiscovered: string;          // ISO timestamp
}

// =============================================================================
// INFRASTRUCTURE SERVICES
// =============================================================================

export type ServiceCategory =
  | 'hosting'      // Where the app runs (Cloudflare Pages, Fly.io, Vercel)
  | 'database'     // Data storage (Supabase, PlanetScale, Neon)
  | 'auth'         // Authentication (Supabase Auth, Auth0, Clerk)
  | 'storage'      // File/blob storage (S3, R2, Supabase Storage)
  | 'dns'          // DNS management (Cloudflare, Route53, DNS Made Easy)
  | 'domain'       // Domain registration (Namecheap, Cloudflare, Ventra IP)
  | 'email'        // Email/MX (Resend, SendGrid, Postmark)
  | 'ci'           // CI/CD (GitHub Actions, CircleCI)
  | 'monitoring'   // Error tracking (Sentry, LogRocket)
  | 'analytics'    // Usage analytics (Plausible, PostHog, GA)
  | 'cdn'          // CDN (Cloudflare, Fastly)
  | 'secrets';     // Secrets management (Doppler, Vault)

export type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'unknown' | 'checking';

export interface InfraService {
  id: string;
  projectId: string;
  category: ServiceCategory;
  provider: string;               // "cloudflare", "supabase", "sentry"
  serviceName: string;            // "Cloudflare Pages", "Supabase Database"
  status: ServiceStatus;
  statusMessage?: string;
  lastChecked: string;            // ISO timestamp
  dashboardUrl?: string;          // Link to provider dashboard
  apiEndpoint?: string;           // API endpoint if applicable
  config: Record<string, unknown>; // Provider-specific metadata
  discoveryMethod: DiscoveryMethod;
}

export type DiscoveryMethod =
  | 'package_json'    // Found in dependencies
  | 'env_vars'        // Found in .env files
  | 'config_file'     // Found in config files (wrangler.toml, etc.)
  | 'dns_lookup'      // Discovered via DNS query
  | 'api_probe'       // Discovered via API health check
  | 'manual';         // Manually configured

// =============================================================================
// TECH STACK
// =============================================================================

export interface TechStack {
  projectId: string;
  framework: FrameworkType;
  frameworkVersion?: string;
  language: 'typescript' | 'javascript';
  css: CssFramework[];
  icons?: string;                 // "lucide", "heroicons", etc.
  testing: TestingFramework[];
  buildTool: BuildTool;
  packageManager: PackageManager;
  adapter?: string;               // SvelteKit adapter, Next.js output, etc.
}

export type FrameworkType =
  | 'sveltekit' | 'svelte'
  | 'nextjs' | 'react'
  | 'angular'
  | 'nuxt' | 'vue'
  | 'astro'
  | 'node'
  | 'other';

export type CssFramework =
  | 'tailwind' | 'skeleton' | 'daisyui'
  | 'bootstrap' | 'bulma'
  | 'angular-material'
  | 'css-modules' | 'styled-components'
  | 'scss' | 'less'
  | 'other';

export type TestingFramework =
  | 'playwright' | 'cypress' | 'puppeteer'
  | 'jest' | 'vitest' | 'mocha'
  | 'other';

export type BuildTool = 'vite' | 'webpack' | 'esbuild' | 'rollup' | 'turbopack' | 'other';
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

// =============================================================================
// PORT TRACKING
// =============================================================================

export interface PortUsage {
  port: number;
  process: string;
  pid?: number;
  project?: string;               // Project ID if identified
  category: 'dev-server' | 'database' | 'service' | 'unknown';
  lastSeen: string;               // ISO timestamp
}

// =============================================================================
// DEPLOYMENT STATUS (Fly.io / Cloudflare)
// =============================================================================

export type DeploymentStatus = 'success' | 'failure' | 'deploying' | 'unknown';

export interface DeploymentInfo {
  projectId: string;
  platform: 'flyio' | 'cloudflare' | 'vercel' | 'netlify' | 'other';
  status: DeploymentStatus;
  version?: string;               // Deployed version
  deployedAt?: string;            // ISO timestamp
  deployUrl?: string;             // URL to deployment logs
  commitSha?: string;             // Commit that was deployed
}

// =============================================================================
// GITHUB REPO STATUS (version control / backup)
// =============================================================================

export interface RepoInfo {
  projectId: string;
  owner: string;
  repo: string;
  version?: string;               // From package.json
  lastPush?: string;              // ISO timestamp of last push
  lastCommitSha?: string;
  lastCommitMessage?: string;
  branch?: string;
  repoUrl: string;
}

// =============================================================================
// CI/CD STATUS (legacy - for repos still using GitHub Actions for deploy)
// =============================================================================

export type WorkflowStatus = 'success' | 'failure' | 'in_progress' | 'queued' | 'unknown';

export interface CIStatus {
  projectId: string;
  provider: 'github_actions' | 'circleci' | 'gitlab_ci' | 'other';
  workflowName: string;
  status: WorkflowStatus;
  conclusion?: string;
  runUrl?: string;
  runDate?: string;
  branch?: string;
  commit?: string;
}

// =============================================================================
// DNS & DOMAIN
// =============================================================================

export interface DnsInfo {
  projectId: string;
  domain: string;
  registrar?: string;             // Where domain is registered
  dnsProvider?: string;           // Where DNS is managed (may differ from registrar)
  nameservers: string[];
  records: DnsRecord[];
  sslStatus: 'valid' | 'expiring' | 'expired' | 'none' | 'unknown';
  sslExpiry?: string;
  lastChecked: string;
}

export interface DnsRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SOA';
  name: string;
  value: string;
  ttl?: number;
}

// =============================================================================
// INFRASTRUCTURE FLOW (for diagrams)
// =============================================================================

export interface InfraNode {
  id: string;
  type: 'user' | 'cdn' | 'dns' | 'site' | 'hosting' | 'api' | 'database' | 'storage' | 'auth' | 'external' | 'ci' | 'monitoring' | 'localdev';
  label: string;
  provider?: string;
  icon?: string;                  // Lucide icon name
  status: ServiceStatus;
  x?: number;                     // Position for diagram
  y?: number;
}

export interface InfraEdge {
  id: string;
  source: string;                 // Node ID
  target: string;                 // Node ID
  label?: string;
  animated?: boolean;             // For showing active data flow
  status: 'active' | 'idle' | 'error';
}

export interface InfraTopology {
  projectId: string;
  nodes: InfraNode[];
  edges: InfraEdge[];
  lastUpdated: string;
}

// =============================================================================
// DISCOVERY RESULTS
// =============================================================================

export interface DiscoveryResult {
  projectId: string;
  timestamp: string;
  services: InfraService[];
  stack: TechStack;
  dns?: DnsInfo;
  errors: DiscoveryError[];
}

export interface DiscoveryError {
  source: string;                 // What we were trying to discover
  message: string;
  recoverable: boolean;
}

// =============================================================================
// LOG COMMANDS
// =============================================================================

export type LogEnvironment = 'local' | 'production';
export type LogTarget = 'server' | 'database' | 'all';

export interface LogCommand {
  label: string;                  // "Dev Server Logs", "Production Logs"
  command: string;                // Shell command to run
  environment: LogEnvironment;
  target: LogTarget;
  description?: string;           // Optional explanation
  workingDir?: string;            // Working directory (defaults to project localPath)
}
