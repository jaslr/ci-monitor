// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { repos } from '$lib/config/repos';

// Default groups based on current repo config
const DEFAULT_GROUPS = [
	{ id: 'jaslr', name: 'JASLR', color: '#3b82f6' },
	{ id: 'jvp-ux', name: 'JVP-UX', color: '#8b5cf6' },
	{ id: 'junipa', name: 'Junipa', color: '#10b981' }
];

export const load = async ({ cookies }: Parameters<PageServerLoad>[0]) => {
	// Load saved config from cookie (or use defaults)
	const savedConfig = cookies.get('project_config');
	let projectConfig: {
		groups: typeof DEFAULT_GROUPS;
		projects: Array<{
			id: string;
			owner: string;
			repo: string;
			displayName: string;
			groups: string[];
			order: number;
		}>;
	};

	if (savedConfig) {
		try {
			projectConfig = JSON.parse(savedConfig);
		} catch {
			projectConfig = buildDefaultConfig();
		}
	} else {
		projectConfig = buildDefaultConfig();
	}

	return {
		groups: projectConfig.groups,
		projects: projectConfig.projects
	};
};

function buildDefaultConfig() {
	const projects: Array<{
		id: string;
		owner: string;
		repo: string;
		displayName: string;
		groups: string[];
		order: number;
	}> = [];

	let order = 0;
	for (const [owner, repoList] of Object.entries(repos)) {
		for (const repo of repoList) {
			// Determine groups based on owner and repo name
			const groups = [owner];

			// Junipa repos belong to both jvp-ux and junipa groups
			if (repo.toLowerCase().includes('junipa')) {
				groups.push('junipa');
			}

			projects.push({
				id: `${owner}/${repo}`,
				owner,
				repo,
				displayName: repo,
				groups,
				order: order++
			});
		}
	}

	return {
		groups: DEFAULT_GROUPS,
		projects
	};
}

export const actions = {
	// Save project configuration
	saveConfig: async ({ request, cookies }: import('./$types').RequestEvent) => {
		const formData = await request.formData();
		const configJson = formData.get('config') as string;

		if (!configJson) {
			return fail(400, { error: 'No config provided' });
		}

		try {
			const config = JSON.parse(configJson);

			// Validate structure
			if (!config.groups || !config.projects) {
				return fail(400, { error: 'Invalid config structure' });
			}

			// Save to cookie (limited to 4KB, but should be fine for our use case)
			cookies.set('project_config', configJson, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 365 // 1 year
			});

			return { success: true, message: 'Configuration saved!' };
		} catch (err) {
			return fail(400, { error: 'Invalid JSON' });
		}
	},

	// Reset to defaults
	resetConfig: async ({ cookies }: import('./$types').RequestEvent) => {
		cookies.delete('project_config', { path: '/' });
		return { success: true, message: 'Reset to defaults!' };
	},

	// Add a new group
	addGroup: async ({ request, cookies }: import('./$types').RequestEvent) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const color = formData.get('color') as string || '#6b7280';

		if (!name) {
			return fail(400, { error: 'Group name is required' });
		}

		const savedConfig = cookies.get('project_config');
		const config = savedConfig ? JSON.parse(savedConfig) : buildDefaultConfig();

		const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

		if (config.groups.some((g: { id: string }) => g.id === id)) {
			return fail(400, { error: 'Group already exists' });
		}

		config.groups.push({ id, name, color });

		cookies.set('project_config', JSON.stringify(config), {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 365
		});

		return { success: true, message: `Group "${name}" created!` };
	},

	// Delete a group
	deleteGroup: async ({ request, cookies }: import('./$types').RequestEvent) => {
		const formData = await request.formData();
		const groupId = formData.get('groupId') as string;

		if (!groupId) {
			return fail(400, { error: 'Group ID is required' });
		}

		const savedConfig = cookies.get('project_config');
		const config = savedConfig ? JSON.parse(savedConfig) : buildDefaultConfig();

		// Remove group
		config.groups = config.groups.filter((g: { id: string }) => g.id !== groupId);

		// Remove group from all projects
		for (const project of config.projects) {
			project.groups = project.groups.filter((g: string) => g !== groupId);
		}

		cookies.set('project_config', JSON.stringify(config), {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 365
		});

		return { success: true, message: 'Group deleted!' };
	}
};
;null as any as Actions;