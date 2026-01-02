import { env } from '../../config/env.js';
const CF_API_BASE = 'https://api.cloudflare.com/client/v4';
export async function fetchPagesProjects() {
    if (!env.cloudflareApiToken || !env.cloudflareAccountId) {
        console.warn('Cloudflare credentials not set, skipping CF polling');
        return [];
    }
    try {
        const response = await fetch(`${CF_API_BASE}/accounts/${env.cloudflareAccountId}/pages/projects`, {
            headers: {
                Authorization: `Bearer ${env.cloudflareApiToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Cloudflare API error: ${response.status}`);
        }
        const data = (await response.json());
        return data.result || [];
    }
    catch (err) {
        console.error('Failed to fetch Cloudflare Pages projects:', err);
        return [];
    }
}
export async function fetchLatestDeployment(projectName) {
    if (!env.cloudflareApiToken || !env.cloudflareAccountId) {
        return null;
    }
    try {
        const response = await fetch(`${CF_API_BASE}/accounts/${env.cloudflareAccountId}/pages/projects/${projectName}/deployments?per_page=1`, {
            headers: {
                Authorization: `Bearer ${env.cloudflareApiToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Cloudflare API error: ${response.status}`);
        }
        const data = (await response.json());
        return data.result?.[0] || null;
    }
    catch (err) {
        console.error(`Failed to fetch deployment for ${projectName}:`, err);
        return null;
    }
}
export function mapCFStatusToHealth(deployment) {
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
//# sourceMappingURL=client.js.map