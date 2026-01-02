export type WorkflowStatus = 'success' | 'failure' | 'in_progress' | 'unknown';
export type DeploymentStatus = 'success' | 'failure' | 'deploying' | 'unknown';
export type HostingPlatform = 'flyio' | 'cloudflare' | 'vercel' | 'netlify' | 'gcp' | 'local';
export type ServiceHealthStatus = 'healthy' | 'degraded' | 'down' | 'unknown';

export interface ServiceHealth {
	database?: ServiceHealthStatus;
	auth?: ServiceHealthStatus;
}

export interface RepoStatus {
	owner: string;
	repo: string;
	// Deployment status (primary - colored dot)
	deployStatus: DeploymentStatus;
	deployPlatform: HostingPlatform;
	deployedAt: string | null;
	deployUrl: string | null;
	// Git repo status (secondary - grey icon)
	version: string | null;
	lastPush: string | null;
	lastCommitSha: string | null;
	repoUrl: string;
	// Legacy CI status (for backward compatibility)
	status: WorkflowStatus;
	conclusion: string | null;
	html_url: string | null;
	workflow_name: string | null;
	run_date: string | null;
	// Service health (DB, Auth)
	serviceHealth?: ServiceHealth;
}

interface WorkflowRun {
	status: string;
	conclusion: string | null;
	html_url: string;
	name: string;
	updated_at: string;
}

interface WorkflowRunsResponse {
	workflow_runs: WorkflowRun[];
}

export async function getLatestWorkflowRun(
	owner: string,
	repo: string,
	pat: string
): Promise<RepoStatus> {
	const url = `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=1`;

	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${pat}`,
				Accept: 'application/vnd.github.v3+json',
				'User-Agent': 'ci-monitor'
			}
		});

		if (!response.ok) {
			console.error(`GitHub API error for ${owner}/${repo}: ${response.status}`);
			return {
				owner,
				repo,
				// Deployment status - unknown until we get real platform data
				deployStatus: 'unknown',
				deployPlatform: 'local',
				deployedAt: null,
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
			};
		}

		const data: WorkflowRunsResponse = await response.json();

		if (!data.workflow_runs || data.workflow_runs.length === 0) {
			return {
				owner,
				repo,
				// Deployment status - unknown until we get real platform data
				deployStatus: 'unknown',
				deployPlatform: 'local',
				deployedAt: null,
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
			};
		}

		const latestRun = data.workflow_runs[0];
		let status: WorkflowStatus;

		if (latestRun.status === 'in_progress' || latestRun.status === 'queued') {
			status = 'in_progress';
		} else if (latestRun.conclusion === 'success') {
			status = 'success';
		} else if (latestRun.conclusion === 'failure' || latestRun.conclusion === 'cancelled') {
			status = 'failure';
		} else {
			status = 'unknown';
		}

		return {
			owner,
			repo,
			// Deployment status - unknown until we get real platform data
			deployStatus: 'unknown',
			deployPlatform: 'local',
			deployedAt: null,
			deployUrl: null,
			// Git repo status - use workflow updated_at as proxy for last push
			version: null,
			lastPush: latestRun.updated_at,
			lastCommitSha: null,
			repoUrl: `https://github.com/${owner}/${repo}`,
			// Legacy CI status
			status,
			conclusion: latestRun.conclusion,
			html_url: latestRun.html_url,
			workflow_name: latestRun.name,
			run_date: latestRun.updated_at
		};
	} catch (error) {
		console.error(`Error fetching workflow for ${owner}/${repo}:`, error);
		return {
			owner,
			repo,
			// Deployment status - unknown on error
			deployStatus: 'unknown',
			deployPlatform: 'local',
			deployedAt: null,
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
		};
	}
}
