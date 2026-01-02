// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { repos, ownerPATEnvVar } from '$lib/config/repos';
import { INFRASTRUCTURE } from '$lib/config/infrastructure';
import { env } from '$env/dynamic/private';

const BACKEND_URL = 'https://observatory-backend.fly.dev';

interface PackageJson {
	name?: string;
	version?: string;
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	scripts?: Record<string, string>;
}

interface RepoInfo {
	lastPush: string | null;
	defaultBranch: string | null;
	hasGitHubActions: boolean;
	deploymentMethod: 'github-actions' | 'forked' | 'unknown';
	workflowFiles: string[];
}

interface DetectedStack {
	framework: string | null;
	language: string;
	css: string[];
	testing: string[];
	buildTool: string | null;
	packageManager: string;
	icons: string | null;
}

// Detect tech stack from package.json dependencies
function detectTechStack(pkg: PackageJson): DetectedStack {
	const deps = { ...pkg.dependencies, ...pkg.devDependencies };
	const depNames = Object.keys(deps);

	const stack: DetectedStack = {
		framework: null,
		language: 'javascript',
		css: [],
		testing: [],
		buildTool: null,
		packageManager: 'npm',
		icons: null
	};

	// Detect TypeScript
	if (depNames.includes('typescript') || depNames.includes('@types/node')) {
		stack.language = 'typescript';
	}

	// Detect framework
	if (depNames.includes('@sveltejs/kit')) stack.framework = 'sveltekit';
	else if (depNames.includes('svelte')) stack.framework = 'svelte';
	else if (depNames.includes('next')) stack.framework = 'next';
	else if (depNames.includes('nuxt')) stack.framework = 'nuxt';
	else if (depNames.includes('@angular/core')) stack.framework = 'angular';
	else if (depNames.includes('react')) stack.framework = 'react';
	else if (depNames.includes('vue')) stack.framework = 'vue';
	else if (depNames.includes('express')) stack.framework = 'express';
	else if (depNames.includes('hono')) stack.framework = 'hono';
	else if (depNames.includes('fastify')) stack.framework = 'fastify';

	// Detect CSS
	if (depNames.includes('tailwindcss')) stack.css.push('tailwind');
	if (depNames.includes('@skeletonlabs/skeleton')) stack.css.push('skeleton');
	if (depNames.includes('sass') || depNames.includes('node-sass')) stack.css.push('sass');
	if (depNames.includes('styled-components')) stack.css.push('styled-components');

	// Detect testing
	if (depNames.includes('@playwright/test') || depNames.includes('playwright')) stack.testing.push('playwright');
	if (depNames.includes('vitest')) stack.testing.push('vitest');
	if (depNames.includes('jest')) stack.testing.push('jest');
	if (depNames.includes('cypress')) stack.testing.push('cypress');

	// Detect build tool
	if (depNames.includes('vite')) stack.buildTool = 'vite';
	else if (depNames.includes('webpack')) stack.buildTool = 'webpack';
	else if (depNames.includes('esbuild')) stack.buildTool = 'esbuild';
	else if (depNames.includes('rollup')) stack.buildTool = 'rollup';

	// Detect icons
	if (depNames.includes('lucide-svelte') || depNames.includes('@lucide/svelte')) stack.icons = 'lucide';
	else if (depNames.includes('@heroicons/react') || depNames.includes('heroicons')) stack.icons = 'heroicons';
	else if (depNames.includes('@fortawesome/fontawesome-free')) stack.icons = 'fontawesome';

	return stack;
}

// Fetch repo info from GitHub
async function fetchRepoInfo(owner: string, repo: string, pat: string): Promise<RepoInfo> {
	const defaultInfo: RepoInfo = {
		lastPush: null,
		defaultBranch: null,
		hasGitHubActions: false,
		deploymentMethod: 'unknown',
		workflowFiles: []
	};

	try {
		// Get repo info (last push, default branch)
		const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
			headers: {
				'Authorization': `Bearer ${pat}`,
				'Accept': 'application/vnd.github.v3+json',
				'User-Agent': 'ci-monitor'
			}
		});

		if (repoResponse.ok) {
			const repoData = await repoResponse.json();
			defaultInfo.lastPush = repoData.pushed_at;
			defaultInfo.defaultBranch = repoData.default_branch;
		}

		// Check for GitHub Actions workflows
		const workflowsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows`, {
			headers: {
				'Authorization': `Bearer ${pat}`,
				'Accept': 'application/vnd.github.v3+json',
				'User-Agent': 'ci-monitor'
			}
		});

		if (workflowsResponse.ok) {
			const files = await workflowsResponse.json();
			if (Array.isArray(files)) {
				defaultInfo.workflowFiles = files
					.filter((f: { name: string }) => f.name.endsWith('.yml') || f.name.endsWith('.yaml'))
					.map((f: { name: string }) => f.name);
				defaultInfo.hasGitHubActions = defaultInfo.workflowFiles.length > 0;

				// Check if any workflow deploys
				const deployWorkflows = defaultInfo.workflowFiles.filter(f =>
					f.toLowerCase().includes('deploy') ||
					f.toLowerCase().includes('release') ||
					f.toLowerCase().includes('publish')
				);
				defaultInfo.deploymentMethod = deployWorkflows.length > 0 ? 'github-actions' : 'forked';
			}
		} else {
			// No workflows directory means forked deployment
			defaultInfo.deploymentMethod = 'forked';
		}

		return defaultInfo;
	} catch (err) {
		console.warn(`Error fetching repo info for ${owner}/${repo}:`, err);
		return defaultInfo;
	}
}

// Fetch package.json from GitHub repo
async function fetchPackageJson(owner: string, repo: string, pat: string): Promise<PackageJson | null> {
	try {
		const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, {
			headers: {
				'Authorization': `Bearer ${pat}`,
				'Accept': 'application/vnd.github.v3.raw',
				'User-Agent': 'ci-monitor'
			}
		});

		if (!response.ok) {
			console.warn(`Failed to fetch package.json for ${owner}/${repo}: ${response.status}`);
			return null;
		}

		return await response.json();
	} catch (err) {
		console.warn(`Error fetching package.json for ${owner}/${repo}:`, err);
		return null;
	}
}

export const load = async ({ url }: Parameters<PageServerLoad>[0]) => {
	const selectedProject = url.searchParams.get('project');

	// Get all repos with their infrastructure config
	const projects: Array<{
		owner: string;
		repo: string;
		infraConfig: typeof INFRASTRUCTURE[string] | null;
		detectedStack: DetectedStack | null;
		packageJson: PackageJson | null;
		repoInfo: RepoInfo | null;
	}> = [];

	for (const [owner, repoList] of Object.entries(repos)) {
		const patEnvVar = ownerPATEnvVar[owner];
		const pat = env[patEnvVar];

		for (const repo of repoList) {
			const infraConfig = INFRASTRUCTURE[repo] || null;
			let packageJson: PackageJson | null = null;
			let detectedStack: DetectedStack | null = null;
			let repoInfo: RepoInfo | null = null;

			// Only fetch for the selected project to avoid rate limits
			if (pat && selectedProject === repo) {
				// Fetch repo info and package.json in parallel
				const [fetchedRepoInfo, fetchedPackageJson] = await Promise.all([
					fetchRepoInfo(owner, repo, pat),
					fetchPackageJson(owner, repo, pat)
				]);

				repoInfo = fetchedRepoInfo;
				packageJson = fetchedPackageJson;
				if (packageJson) {
					detectedStack = detectTechStack(packageJson);
				}
			}

			projects.push({
				owner,
				repo,
				infraConfig,
				detectedStack,
				packageJson,
				repoInfo
			});
		}
	}

	return {
		projects,
		selectedProject,
		configFilePath: 'src/lib/config/infrastructure.ts',
		reposFilePath: 'src/lib/config/repos.ts'
	};
};

// Check a package version against npm registry
async function checkPackageVersion(name: string, currentVersion: string): Promise<{
	name: string;
	current: string;
	latest: string;
	isOutdated: boolean;
	majorBehind: number;
}> {
	try {
		const response = await fetch(`https://registry.npmjs.org/${name}/latest`, {
			headers: { 'Accept': 'application/json' }
		});

		if (!response.ok) {
			return { name, current: currentVersion, latest: 'unknown', isOutdated: false, majorBehind: 0 };
		}

		const data = await response.json();
		const latest = data.version || 'unknown';

		// Parse versions to compare
		const cleanCurrent = currentVersion.replace(/^[\^~]/, '');
		const currentParts = cleanCurrent.split('.').map(p => parseInt(p) || 0);
		const latestParts = latest.split('.').map((p: string) => parseInt(p) || 0);

		const majorBehind = latestParts[0] - currentParts[0];
		const isOutdated = majorBehind > 0 ||
			(majorBehind === 0 && latestParts[1] > currentParts[1]) ||
			(majorBehind === 0 && latestParts[1] === currentParts[1] && latestParts[2] > currentParts[2]);

		return { name, current: cleanCurrent, latest, isOutdated, majorBehind };
	} catch {
		return { name, current: currentVersion, latest: 'error', isOutdated: false, majorBehind: 0 };
	}
}

export const actions = {
	// Scan a specific repo's package.json
	scanRepo: async ({ request }: import('./$types').RequestEvent) => {
		const formData = await request.formData();
		const owner = formData.get('owner') as string;
		const repo = formData.get('repo') as string;

		if (!owner || !repo) {
			return fail(400, { error: 'Missing owner or repo' });
		}

		const patEnvVar = ownerPATEnvVar[owner];
		const pat = env[patEnvVar];

		if (!pat) {
			return fail(400, { error: `No PAT configured for ${owner}` });
		}

		const packageJson = await fetchPackageJson(owner, repo, pat);
		if (!packageJson) {
			return fail(404, { error: `Could not fetch package.json for ${owner}/${repo}` });
		}

		const detectedStack = detectTechStack(packageJson);

		return {
			success: true,
			repo,
			detectedStack,
			packageJson
		};
	},

	// Check for outdated packages
	checkOutdated: async ({ request }: import('./$types').RequestEvent) => {
		const formData = await request.formData();
		const packagesJson = formData.get('packages') as string;

		if (!packagesJson) {
			return fail(400, { error: 'Missing packages data' });
		}

		try {
			const packages: Record<string, string> = JSON.parse(packagesJson);
			const packageNames = Object.keys(packages);

			// Check up to 10 key packages to avoid rate limiting
			const keyPackages = packageNames.slice(0, 10);
			const results = await Promise.all(
				keyPackages.map(name => checkPackageVersion(name, packages[name]))
			);

			const outdated = results.filter(r => r.isOutdated);
			const majorOutdated = results.filter(r => r.majorBehind > 0);

			return {
				action: 'checkOutdated',
				success: true,
				results,
				summary: {
					checked: results.length,
					outdated: outdated.length,
					majorOutdated: majorOutdated.length
				}
			};
		} catch (err) {
			return fail(400, { error: 'Invalid packages data' });
		}
	}
};
;null as any as Actions;