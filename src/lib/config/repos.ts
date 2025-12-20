// Curated list of repos to monitor
// Format: { owner: [repo1, repo2, ...] }
export const repos: Record<string, string[]> = {
	jaslr: [
		'ci-monitor',
		'livna',
		'brontiq',
		'shippywhippy',
		'loadmanagement',
		'Ladderbox',
		'littlelistoflights'
	],
	'jvp-ux': [
		'vastpuddle.com.au',
		'support.junipa.com.au',
		'junipa-organisations',
		'junipa.com.au'
	]
};

// Map owners to their environment variable names for PATs
export const ownerPATEnvVar: Record<string, string> = {
	jaslr: 'GITHUB_PAT_JASLR',
	'jvp-ux': 'GITHUB_PAT_JVP_UX'
};
