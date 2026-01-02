import { browser } from '$app/environment';
import type { RepoStatus } from '$lib/github';

const CACHE_KEY = 'orchon-statuses';
const CACHE_TIMESTAMP_KEY = 'orchon-statuses-timestamp';

export interface CachedData {
	statuses: RepoStatus[];
	lastUpdated: string;
	timestamp: number;
}

export function getCachedData(): CachedData | null {
	if (!browser) return null;

	try {
		const cached = localStorage.getItem(CACHE_KEY);
		const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

		if (!cached || !timestamp) return null;

		const data = JSON.parse(cached);
		const ts = parseInt(timestamp, 10);

		return {
			statuses: data.statuses,
			lastUpdated: data.lastUpdated,
			timestamp: ts
		};
	} catch {
		return null;
	}
}

export function setCachedData(statuses: RepoStatus[], lastUpdated: string): void {
	if (!browser) return;

	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify({ statuses, lastUpdated }));
		localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));
	} catch {
		// Quota exceeded or private mode - ignore
	}
}
