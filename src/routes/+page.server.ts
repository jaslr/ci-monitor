import type { PageServerLoad } from './$types';
import { repos, ownerPATEnvVar } from '$lib/config/repos';
import { getLatestWorkflowRun, type RepoStatus, type DeploymentStatus, type HostingPlatform } from '$lib/github';
import { env } from '$env/dynamic/private';

const BACKEND_URL = 'https://observatory-backend.fly.dev';

interface BackendProject {
	id: string;
	name: string;
	services: Array<{
		category: string;
		provider: string;
	}>;
	currentStatus?: {
		status: string;
		checkedAt: string;
	} | null;
}

interface BackendResponse {
	projects: BackendProject[];
}

// Map backend status to DeploymentStatus
function mapBackendStatus(status: string | undefined): DeploymentStatus {
	switch (status) {
		case 'healthy':
			return 'success';
		case 'degraded':
		case 'deploying':
			return 'deploying';
		case 'down':
		case 'unhealthy':
			return 'failure';
		default:
			return 'unknown';
	}
}

// Get hosting platform from backend project
function getHostingPlatform(project: BackendProject): HostingPlatform {
	const hostingService = project.services.find(s => s.category === 'hosting');
	if (!hostingService) return 'local';

	switch (hostingService.provider) {
		case 'cloudflare':
			return 'cloudflare';
		case 'flyio':
			return 'flyio';
		case 'vercel':
			return 'vercel';
		case 'netlify':
			return 'netlify';
		default:
			return 'local';
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	const statuses: RepoStatus[] = [];

	// Fetch deployment status from backend
	let backendProjects: BackendProject[] = [];
	try {
		const apiSecret = locals.apiSecret;
		const response = await fetch(`${BACKEND_URL}/api/projects`, {
			headers: apiSecret ? { 'Authorization': `Bearer ${apiSecret}` } : {}
		});
		if (response.ok) {
			const data: BackendResponse = await response.json();
			backendProjects = data.projects || [];
		}
	} catch (err) {
		console.warn('Failed to fetch backend status:', err);
	}

	for (const [owner, repoList] of Object.entries(repos)) {
		const patEnvVar = ownerPATEnvVar[owner];
		const pat = env[patEnvVar];

		if (!pat) {
			console.warn(`Missing PAT for ${owner}: ${patEnvVar}`);
			// Add repos with unknown status if PAT is missing
			for (const repo of repoList) {
				// Check if we have backend status for this repo
				const backendProject = backendProjects.find(
					p => p.name.toLowerCase() === repo.toLowerCase() || p.id.toLowerCase() === repo.toLowerCase()
				);

				statuses.push({
					owner,
					repo,
					// Deployment status from backend
					deployStatus: mapBackendStatus(backendProject?.currentStatus?.status),
					deployPlatform: backendProject ? getHostingPlatform(backendProject) : 'local',
					deployedAt: backendProject?.currentStatus?.checkedAt || null,
					deployUrl: null,
					// Git repo status
					version: null,
					lastPush: null,
					lastCommitSha: null,
					repoUrl: `https://github.com/${owner}/${repo}`,
					// Legacy CI status
					status: 'unknown',
					conclusion: null,
					html_url: `https://github.com/${owner}/${repo}/actions`,
					workflow_name: null,
					run_date: null
				});
			}
			continue;
		}

		// Fetch status for each repo in parallel
		const repoStatuses = await Promise.all(
			repoList.map(async (repo) => {
				const gitStatus = await getLatestWorkflowRun(owner, repo, pat);

				// Merge with backend deployment status
				const backendProject = backendProjects.find(
					p => p.name.toLowerCase() === repo.toLowerCase() || p.id.toLowerCase() === repo.toLowerCase()
				);

				if (backendProject?.currentStatus) {
					return {
						...gitStatus,
						deployStatus: mapBackendStatus(backendProject.currentStatus.status),
						deployPlatform: getHostingPlatform(backendProject),
						deployedAt: backendProject.currentStatus.checkedAt
					};
				}

				return gitStatus;
			})
		);

		statuses.push(...repoStatuses);
	}

	return {
		statuses,
		lastUpdated: new Date().toISOString()
	};
};
