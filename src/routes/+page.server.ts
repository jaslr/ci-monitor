import type { PageServerLoad } from './$types';
import { repos, ownerPATEnvVar } from '$lib/config/repos';
import { getLatestWorkflowRun, type RepoStatus } from '$lib/github';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async () => {
	const statuses: RepoStatus[] = [];

	for (const [owner, repoList] of Object.entries(repos)) {
		const patEnvVar = ownerPATEnvVar[owner];
		const pat = env[patEnvVar];

		if (!pat) {
			console.warn(`Missing PAT for ${owner}: ${patEnvVar}`);
			// Add repos with unknown status if PAT is missing
			for (const repo of repoList) {
				statuses.push({
					owner,
					repo,
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
			repoList.map((repo) => getLatestWorkflowRun(owner, repo, pat))
		);

		statuses.push(...repoStatuses);
	}

	return {
		statuses,
		lastUpdated: new Date().toISOString()
	};
};
