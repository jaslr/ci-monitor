// GCP Cloud Build API client
import { env } from '../../config/env.js';

const CLOUDBUILD_API_BASE = 'https://cloudbuild.googleapis.com/v1';

export interface GCPBuild {
  id: string;
  projectId: string;
  status: 'STATUS_UNKNOWN' | 'PENDING' | 'QUEUED' | 'WORKING' | 'SUCCESS' | 'FAILURE' | 'INTERNAL_ERROR' | 'TIMEOUT' | 'CANCELLED' | 'EXPIRED';
  createTime: string;
  startTime?: string;
  finishTime?: string;
  logUrl: string;
  source?: {
    repoSource?: {
      projectId: string;
      repoName: string;
      branchName?: string;
      commitSha?: string;
    };
  };
  sourceProvenance?: {
    resolvedRepoSource?: {
      commitSha: string;
    };
  };
  buildTriggerId?: string;
  options?: {
    machineType?: string;
  };
  failureInfo?: {
    type: string;
    detail: string;
  };
}

interface CloudBuildListResponse {
  builds?: GCPBuild[];
  nextPageToken?: string;
}

// Cache for access tokens (they last 1 hour)
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get access token from service account key
 */
async function getAccessToken(): Promise<string | null> {
  if (!env.gcpServiceAccountKey) {
    return null;
  }

  // Return cached token if still valid (with 5 min buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cachedToken.token;
  }

  try {
    const key = JSON.parse(env.gcpServiceAccountKey);

    // Create JWT for token request
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    };

    // Base64url encode
    const b64url = (obj: unknown) =>
      Buffer.from(JSON.stringify(obj)).toString('base64url');

    const signatureInput = `${b64url(header)}.${b64url(payload)}`;

    // Sign with private key
    const crypto = await import('crypto');
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    const signature = sign.sign(key.private_key, 'base64url');

    const jwt = `${signatureInput}.${signature}`;

    // Exchange JWT for access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    const data = await response.json() as { access_token: string; expires_in: number };

    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    return cachedToken.token;
  } catch (err) {
    console.error('Failed to get GCP access token:', err);
    return null;
  }
}

/**
 * Fetch latest build for a GCP project
 */
export async function fetchLatestBuild(projectId: string): Promise<GCPBuild | null> {
  const token = await getAccessToken();
  if (!token) {
    console.warn('No GCP credentials available, skipping Cloud Build polling');
    return null;
  }

  try {
    const response = await fetch(
      `${CLOUDBUILD_API_BASE}/projects/${projectId}/builds?pageSize=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GCP Cloud Build API error: ${response.status} - ${text}`);
    }

    const data = await response.json() as CloudBuildListResponse;
    return data.builds?.[0] || null;
  } catch (err) {
    console.error(`Failed to fetch builds for ${projectId}:`, err);
    return null;
  }
}

/**
 * Map GCP build status to our standard health status
 */
export function mapGCPStatusToHealth(
  build: GCPBuild | null
): 'healthy' | 'degraded' | 'down' | 'unknown' {
  if (!build) {
    return 'unknown';
  }

  switch (build.status) {
    case 'SUCCESS':
      return 'healthy';
    case 'FAILURE':
    case 'INTERNAL_ERROR':
    case 'TIMEOUT':
    case 'CANCELLED':
    case 'EXPIRED':
      return 'down';
    case 'WORKING':
    case 'QUEUED':
    case 'PENDING':
      return 'degraded'; // Building
    default:
      return 'unknown';
  }
}

/**
 * Map GCP build status to deployment status
 */
export function mapGCPStatusToDeployment(
  status: GCPBuild['status']
): 'success' | 'failure' | 'in_progress' {
  switch (status) {
    case 'SUCCESS':
      return 'success';
    case 'WORKING':
    case 'QUEUED':
    case 'PENDING':
      return 'in_progress';
    default:
      return 'failure';
  }
}

/**
 * Calculate build duration in seconds
 */
export function getBuildDuration(build: GCPBuild): number | null {
  if (!build.startTime || !build.finishTime) {
    return null;
  }
  const start = new Date(build.startTime).getTime();
  const end = new Date(build.finishTime).getTime();
  return Math.round((end - start) / 1000);
}
