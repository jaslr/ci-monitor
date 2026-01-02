// @ts-nocheck
import type { PageServerLoad } from './$types';

const BACKEND_URL = 'https://observatory-backend.fly.dev';

// Deployment log entry from backend
export interface DeploymentLogEntry {
	id: string;
	projectId: string;
	projectName: string;
	projectDisplayName: string;
	provider: string;
	status: 'queued' | 'in_progress' | 'success' | 'failure';
	commitSha?: string;
	branch?: string;
	runUrl?: string;
	startedAt?: string;
	completedAt?: string;
	deployStartedAt?: string;
	deployCompletedAt?: string;
}

interface DeploymentsResponse {
	deployments: DeploymentLogEntry[];
}

export const load = async ({ locals, url }: Parameters<PageServerLoad>[0]) => {
	const apiSecret = locals.apiSecret;
	const authHeaders = apiSecret ? { 'Authorization': `Bearer ${apiSecret}` } : {};

	// Get project filter from URL
	const projectFilter = url.searchParams.get('project');

	// Fetch deployment log from backend (get more for filtering)
	let deployments: DeploymentLogEntry[] = [];

	try {
		const response = await fetch(`${BACKEND_URL}/api/deployments/recent?limit=100`, {
			headers: authHeaders
		});

		if (response.ok) {
			const data: DeploymentsResponse = await response.json();
			deployments = data.deployments || [];
		}
	} catch (err) {
		console.warn('Failed to fetch deployments:', err);
	}

	// Get unique projects for the filter dropdown
	const projects = [...new Map(
		deployments.map(d => [d.projectName, { id: d.projectName, name: d.projectDisplayName || d.projectName }])
	).values()].sort((a, b) => a.name.localeCompare(b.name));

	return {
		deployments,
		projects,
		projectFilter,
		lastUpdated: new Date().toISOString()
	};
};
