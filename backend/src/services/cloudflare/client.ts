import { env } from '../../config/env.js';

const CF_API_BASE = 'https://api.cloudflare.com/client/v4';

export interface CFPagesProject {
  id: string;
  name: string;
  subdomain: string;
  domains: string[];
  created_on: string;
  production_branch: string;
  latest_deployment?: CFDeployment;
}

export interface CFDeployment {
  id: string;
  short_id: string;
  project_id: string;
  project_name: string;
  environment: 'production' | 'preview';
  url: string;
  created_on: string;
  modified_on: string;
  latest_stage: {
    name: string;
    status: 'idle' | 'active' | 'success' | 'failure' | 'canceled';
    started_on: string | null;
    ended_on: string | null;
  };
  deployment_trigger: {
    type: 'push' | 'hook' | 'rollback' | 'ad_hoc';
    metadata: {
      branch: string;
      commit_hash: string;
      commit_message: string;
    };
  };
  stages: Array<{
    name: string;
    status: string;
  }>;
}

export async function fetchPagesProjects(): Promise<CFPagesProject[]> {
  if (!env.cloudflareApiToken || !env.cloudflareAccountId) {
    console.warn('Cloudflare credentials not set, skipping CF polling');
    return [];
  }

  try {
    const response = await fetch(
      `${CF_API_BASE}/accounts/${env.cloudflareAccountId}/pages/projects`,
      {
        headers: {
          Authorization: `Bearer ${env.cloudflareApiToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.status}`);
    }

    const data = (await response.json()) as { result?: CFPagesProject[] };
    return data.result || [];
  } catch (err) {
    console.error('Failed to fetch Cloudflare Pages projects:', err);
    return [];
  }
}

export async function fetchLatestDeployment(
  projectName: string
): Promise<CFDeployment | null> {
  if (!env.cloudflareApiToken || !env.cloudflareAccountId) {
    return null;
  }

  try {
    const response = await fetch(
      `${CF_API_BASE}/accounts/${env.cloudflareAccountId}/pages/projects/${projectName}/deployments?per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${env.cloudflareApiToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.status}`);
    }

    const data = (await response.json()) as { result?: CFDeployment[] };
    return data.result?.[0] || null;
  } catch (err) {
    console.error(`Failed to fetch deployment for ${projectName}:`, err);
    return null;
  }
}

export function mapCFStatusToHealth(
  deployment: CFDeployment | null
): 'healthy' | 'degraded' | 'down' | 'unknown' {
  if (!deployment) {
    return 'unknown';
  }

  const status = deployment.latest_stage.status;

  switch (status) {
    case 'success':
      return 'healthy';
    case 'failure':
    case 'canceled':
      return 'down';
    case 'active':
      return 'degraded'; // Deploying
    default:
      return 'unknown';
  }
}
