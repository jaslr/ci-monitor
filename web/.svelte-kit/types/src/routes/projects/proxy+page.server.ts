// @ts-nocheck
import type { PageServerLoad } from './$types';
import { repos, ownerPATEnvVar } from '$lib/config/repos';
import { getLatestWorkflowRun, type RepoStatus, type DeploymentStatus, type HostingPlatform } from '$lib/github';
import { getProjectInfrastructure } from '$lib/config/infrastructure';
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

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
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

				// Get infrastructure config including deployment mechanism
				const infra = getProjectInfrastructure(repo);
				const hostingService = infra?.services.find(s => s.category === 'hosting');
				let platform: HostingPlatform = 'local';
				if (hostingService?.provider === 'flyio') platform = 'flyio';
				else if (hostingService?.provider === 'cloudflare') platform = 'cloudflare';
				else if (hostingService?.provider === 'vercel') platform = 'vercel';
				else if (hostingService?.provider === 'netlify') platform = 'netlify';
				else if (hostingService?.provider === 'gcp' || hostingService?.provider === 'firebase') platform = 'gcp';

				// If we have backend status, use it (highest priority)
				if (backendProject?.currentStatus) {
					return {
						...gitStatus,
						deployStatus: mapBackendStatus(backendProject.currentStatus.status),
						deployPlatform: getHostingPlatform(backendProject),
						deployedAt: backendProject.currentStatus.checkedAt
					};
				}

				// Determine deploy status based on HOW the project deploys
				const deployMechanism = infra?.deployMechanism;
				let deployStatus: DeploymentStatus = 'unknown';
				let deployedAt: string | null = null;

				if (deployMechanism === 'github-actions') {
					// GitHub Actions deploys to hosting - CI status IS deploy status
					const ciStatus = gitStatus.status;
					if (ciStatus === 'success') deployStatus = 'success';
					else if (ciStatus === 'failure') deployStatus = 'failure';
					else if (ciStatus === 'in_progress') deployStatus = 'deploying';
					deployedAt = gitStatus.run_date;
				}
				// For 'local-wrangler', 'local-fly', 'gcp-cloudbuild':
				// No backend data and CI doesn't deploy - status is unknown
				// (These deploy directly from local dev, not via CI)

				return {
					...gitStatus,
					deployStatus,
					deployPlatform: platform,
					deployedAt
				};
			})
		);

		statuses.push(...repoStatuses);
	}

	// Add backend-only projects (like Junipa GCP projects) that aren't in GitHub repos
	const gitRepoIds = new Set(
		Object.entries(repos).flatMap(([owner, repoList]) =>
			repoList.map(repo => repo.toLowerCase())
		)
	);

	for (const project of backendProjects) {
		// Skip if we already have this repo from GitHub config
		if (gitRepoIds.has(project.name.toLowerCase()) || gitRepoIds.has(project.id.toLowerCase())) {
			continue;
		}

		// Check if this is a GCP/non-GitHub project
		const ciService = project.services.find(s => s.category === 'ci');
		if (ciService?.provider === 'gcp' || ciService?.provider === 'github') {
			// Determine owner from project ID or use a default
			const owner = project.id.startsWith('junipa') ? 'jvp-ux' : 'unknown';

			statuses.push({
				owner,
				repo: project.id,
				// Deployment status from backend
				deployStatus: mapBackendStatus(project.currentStatus?.status),
				deployPlatform: ciService?.provider === 'gcp' ? 'gcp' as HostingPlatform : getHostingPlatform(project),
				deployedAt: project.currentStatus?.checkedAt || null,
				deployUrl: null,
				// Git repo status - not applicable for GCP Source Repos
				version: null,
				lastPush: null,
				lastCommitSha: null,
				repoUrl: ciService?.provider === 'gcp'
					? `https://console.cloud.google.com/cloud-build/builds?project=${project.services.find(s => s.category === 'ci')?.provider === 'gcp' ? project.id : ''}`
					: `https://github.com/${owner}/${project.name}`,
				// Legacy CI status - use backend status
				status: project.currentStatus?.status === 'healthy' ? 'success' :
				        project.currentStatus?.status === 'down' ? 'failure' : 'unknown',
				conclusion: project.currentStatus?.status || null,
				html_url: ciService?.provider === 'gcp'
					? `https://console.cloud.google.com/cloud-build/builds?project=${project.id}`
					: `https://github.com/${owner}/${project.name}/actions`,
				workflow_name: ciService?.provider === 'gcp' ? 'GCP Cloud Build' : null,
				run_date: project.currentStatus?.checkedAt || null
			});
		}
	}

	return {
		statuses,
		lastUpdated: new Date().toISOString()
	};
};
