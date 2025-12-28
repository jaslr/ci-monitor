<script lang="ts">
	import type { PageData } from './$types';
	import type { RepoStatus, DeploymentStatus } from '$lib/github';
	import type { DeploymentLogEntry } from './+page.server';
	import { browser } from '$app/environment';
	import { sseClient, type SSEEvent, type DeploymentEvent } from '$lib/services/sse-client';
	import { getCachedData, setCachedData } from '$lib/stores/dataCache';
	import {
		Cloud,
		GitCommit,
		CheckCircle,
		XCircle,
		Loader,
		ExternalLink,
		ArrowRight
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	// Load cached data for instant display
	const cachedOnLoad = browser ? getCachedData() : null;

	// Local state for real-time updates
	let statuses = $state<RepoStatus[]>(cachedOnLoad?.statuses || data.statuses);
	let lastUpdated = $state(cachedOnLoad?.lastUpdated || data.lastUpdated);

	// Real deployment log from backend (actual deployment events, not derived)
	let deploymentLog = $state<DeploymentLogEntry[]>(data.deploymentLog || []);

	// Commits activity (derived from statuses for now - shows last push info)
	let commitActivity = $derived(
		[...statuses]
			.filter(s => s.lastPush)
			.sort((a, b) => {
				const dateA = new Date(a.lastPush || 0).getTime();
				const dateB = new Date(b.lastPush || 0).getTime();
				return dateB - dateA;
			})
			.slice(0, 20)
	);

	// Update local state when server data changes
	$effect(() => {
		if (data.statuses && data.statuses.length > 0) {
			statuses = data.statuses;
			lastUpdated = data.lastUpdated;
			setCachedData(data.statuses, data.lastUpdated);
		}
		if (data.deploymentLog) {
			deploymentLog = data.deploymentLog;
		}
	});

	// SSE connection for real-time updates
	const BACKEND_URL = 'https://observatory-backend.fly.dev';
	let apiSecret = $derived((data as { apiSecret?: string }).apiSecret || '');

	$effect(() => {
		if (!browser) return;

		sseClient.connect(BACKEND_URL, apiSecret);

		const unsubscribe = sseClient.subscribe((event: SSEEvent) => {
			if (event.type === 'deployment' && event.project) {
				const deployment = event.data as DeploymentEvent;
				updateFromDeployment(event.project, deployment);
			}
		});

		return () => {
			unsubscribe();
			sseClient.disconnect();
		};
	});

	function updateFromDeployment(projectId: string, deployment: DeploymentEvent): void {
		lastUpdated = new Date().toISOString();

		statuses = statuses.map((status) => {
			if (status.repo === projectId || status.repo.toLowerCase() === projectId.toLowerCase()) {
				let newDeployStatus: DeploymentStatus;
				switch (deployment.status) {
					case 'success': newDeployStatus = 'success'; break;
					case 'failure': newDeployStatus = 'failure'; break;
					case 'in_progress':
					case 'queued': newDeployStatus = 'deploying'; break;
					default: newDeployStatus = 'unknown';
				}

				return {
					...status,
					deployStatus: newDeployStatus,
					deployedAt: new Date().toISOString(),
					deployUrl: deployment.runUrl || status.deployUrl,
					run_date: new Date().toISOString()
				};
			}
			return status;
		});
	}

	function formatRelativeTime(isoString: string | null): string {
		if (!isoString) return '';
		const date = new Date(isoString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return date.toLocaleDateString();
	}

	function getStatusColor(status: DeploymentStatus): string {
		switch (status) {
			case 'success': return 'text-green-400';
			case 'failure': return 'text-red-400';
			case 'deploying': return 'text-cyan-400';
			default: return 'text-gray-400';
		}
	}

	function getStatusLabel(status: DeploymentStatus): string {
		switch (status) {
			case 'success': return 'Deployed';
			case 'failure': return 'Failed';
			case 'deploying': return 'Deploying';
			default: return 'Unknown';
		}
	}
</script>

<svelte:head>
	<title>Console | Orchon</title>
</svelte:head>

<!-- Console Activity Log -->
<div class="flex-1 flex flex-col lg:flex-row min-h-0 h-full overflow-hidden gap-4 lg:gap-6 p-4">
	<!-- Left Panel: Recent Deployments -->
	<div class="flex-1 flex flex-col border border-gray-800 rounded-lg min-w-0 overflow-hidden">
		<div class="shrink-0 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
			<div class="flex items-center gap-2 text-gray-400">
				<Cloud class="w-4 h-4" />
				<span class="text-sm font-medium">Recent Deployments</span>
			</div>
			<a href="/deployments" class="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1">
				View all <ArrowRight class="w-3 h-3" />
			</a>
		</div>

		<div class="flex-1 overflow-y-auto">
			{#if deploymentLog.length === 0}
				<div class="p-8 text-center text-gray-500">
					<Cloud class="w-8 h-8 mx-auto mb-2 opacity-50" />
					<p class="text-sm">No recent deployments</p>
				</div>
			{:else}
				<div class="divide-y divide-gray-800">
					{#each deploymentLog as deployment (deployment.id)}
						{@const deployTime = deployment.deployCompletedAt || deployment.completedAt || deployment.startedAt}
						{@const deployStatus = deployment.status === 'success' ? 'success' : deployment.status === 'failure' ? 'failure' : deployment.status === 'in_progress' ? 'deploying' : 'unknown'}
						<a
							href="/deployments?project={deployment.projectName}"
							class="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors"
						>
							<!-- Status Icon -->
							<div class="shrink-0">
								{#if deployStatus === 'deploying'}
									<Loader class="w-5 h-5 text-cyan-400 animate-spin" />
								{:else if deployStatus === 'success'}
									<CheckCircle class="w-5 h-5 text-green-400" />
								{:else if deployStatus === 'failure'}
									<XCircle class="w-5 h-5 text-red-400" />
								{:else}
									<Cloud class="w-5 h-5 text-gray-500" />
								{/if}
							</div>

							<!-- Content -->
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2">
									<span class="font-medium text-white truncate">{deployment.projectDisplayName || deployment.projectName}</span>
									<span class="text-xs {getStatusColor(deployStatus)}">{getStatusLabel(deployStatus)}</span>
								</div>
								<div class="text-xs text-gray-500 truncate">
									{deployment.provider} {deployment.branch ? `• ${deployment.branch}` : ''}
								</div>
							</div>

							<!-- Time -->
							<div class="shrink-0 text-xs text-gray-500">
								{formatRelativeTime(deployTime)}
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Right Panel: Recent Commits -->
	<div class="flex-1 flex flex-col border border-gray-800 rounded-lg min-w-0 overflow-hidden">
		<div class="shrink-0 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
			<div class="flex items-center gap-2 text-gray-400">
				<GitCommit class="w-4 h-4" />
				<span class="text-sm font-medium">Recent Commits</span>
			</div>
		</div>

		<div class="flex-1 overflow-y-auto">
			{#if commitActivity.length === 0}
				<div class="p-8 text-center text-gray-500">
					<GitCommit class="w-8 h-8 mx-auto mb-2 opacity-50" />
					<p class="text-sm">No recent commits</p>
				</div>
			{:else}
				<div class="divide-y divide-gray-800">
					{#each commitActivity as status (status.repo + status.lastPush)}
						<a
							href={status.repoUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors"
						>
							<!-- Commit Icon -->
							<div class="shrink-0">
								<GitCommit class="w-5 h-5 text-gray-400" />
							</div>

							<!-- Content -->
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2">
									<span class="font-medium text-white truncate">{status.repo}</span>
									{#if status.version}
										<span class="text-xs text-gray-500 font-mono">{status.version}</span>
									{/if}
								</div>
								<div class="text-xs text-gray-500 truncate">
									{#if status.lastCommitSha}
										<span class="font-mono">{status.lastCommitSha.slice(0, 7)}</span>
									{:else}
										Pushed to {status.owner}/{status.repo}
									{/if}
								</div>
							</div>

							<!-- Time & Link -->
							<div class="shrink-0 flex items-center gap-2 text-xs text-gray-500">
								<span>{formatRelativeTime(status.lastPush)}</span>
								<ExternalLink class="w-3 h-3" />
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
