<script lang="ts">
	import type { PageData } from './$types';
	import type { WorkflowStatus, RepoStatus, DeploymentStatus, ServiceHealthStatus, ServiceHealth } from '$lib/github';
	import type { InfraService, TechStack } from '$lib/types/infrastructure';
	import type { StatusEvent } from '$lib/services/sse-client';
	import { getProjectInfrastructure } from '$lib/config/infrastructure';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { sseClient, type SSEEvent, type DeploymentEvent } from '$lib/services/sse-client';
	import { getCachedData, setCachedData } from '$lib/stores/dataCache';
	import {
		Cloud,
		Database,
		Shield,
		HardDrive,
		Globe,
		Mail,
		GitBranch,
		AlertTriangle,
		BarChart3,
		Server,
		Layers,
		ExternalLink,
		Settings,
		ArrowDownAZ,
		Clock,
		ChevronDown,
		Key
	} from '@lucide/svelte';
	import InfraFlowDiagram, { type DeploymentTimestamps } from '$lib/components/InfraFlowDiagram.svelte';

	let { data }: { data: PageData } = $props();

	// Load cached data for instant display (before server data arrives)
	const cachedOnLoad = browser ? getCachedData() : null;

	// Local state for real-time updates - use cache first for instant load
	let statuses = $state<RepoStatus[]>(cachedOnLoad?.statuses || data.statuses);
	let lastUpdated = $state(cachedOnLoad?.lastUpdated || data.lastUpdated);
	let sseConnected = $state(false);

	// Track deployment timestamps per project (for infra flow diagram)
	let deploymentTimestamps = $state<Record<string, DeploymentTimestamps>>({});

	// Update local state when server data changes and save to cache
	$effect(() => {
		if (data.statuses && data.statuses.length > 0) {
			statuses = data.statuses;
			lastUpdated = data.lastUpdated;
			// Cache the fresh data for next visit
			setCachedData(data.statuses, data.lastUpdated);
		}
	});

	// SSE connection for real-time updates
	const BACKEND_URL = 'https://observatory-backend.fly.dev';

	// Get API secret from layout data (passed from server)
	let apiSecret = $derived((data as { apiSecret?: string }).apiSecret || '');

	$effect(() => {
		if (!browser) return;

		sseClient.connect(BACKEND_URL, apiSecret);

		const unsubscribe = sseClient.subscribe((event: SSEEvent) => {
			handleSSEEvent(event);
		});

		// Check connection status periodically
		const statusCheck = setInterval(() => {
			sseConnected = sseClient.isConnected;
		}, 1000);

		return () => {
			unsubscribe();
			clearInterval(statusCheck);
			sseClient.disconnect();
		};
	});

	function handleSSEEvent(event: SSEEvent): void {
		lastUpdated = new Date().toISOString();

		if (event.type === 'connected') {
			sseConnected = true;
			return;
		}

		if (event.type === 'deployment' && event.project) {
			const deployment = event.data as DeploymentEvent;
			updateRepoStatusFromDeployment(event.project, deployment);
		}

		if (event.type === 'status' && event.project) {
			const statusData = event.data as StatusEvent & { provider?: string };
			updateRepoStatusFromHealth(event.project, statusData);
		}
	}

	function updateRepoStatusFromDeployment(projectId: string, deployment: DeploymentEvent): void {
		// Update deployment timestamps for this project
		const currentTimestamps = deploymentTimestamps[projectId] || {};
		deploymentTimestamps[projectId] = {
			...currentTimestamps,
			pushStarted: deployment.pushedAt || currentTimestamps.pushStarted,
			ciStarted: deployment.ciStartedAt || currentTimestamps.ciStarted,
			ciCompleted: deployment.ciCompletedAt || currentTimestamps.ciCompleted,
			deployStarted: deployment.deployStartedAt || currentTimestamps.deployStarted,
			deployCompleted: deployment.deployCompletedAt || currentTimestamps.deployCompleted,
		};

		statuses = statuses.map((status) => {
			if (status.repo === projectId || status.repo.toLowerCase() === projectId.toLowerCase()) {
				let newDeployStatus: DeploymentStatus;
				switch (deployment.status) {
					case 'success':
						newDeployStatus = 'success';
						break;
					case 'failure':
						newDeployStatus = 'failure';
						break;
					case 'in_progress':
					case 'queued':
						newDeployStatus = 'deploying';
						break;
					default:
						newDeployStatus = 'unknown';
				}

				let newStatus: WorkflowStatus;
				switch (deployment.status) {
					case 'success':
						newStatus = 'success';
						break;
					case 'failure':
						newStatus = 'failure';
						break;
					case 'in_progress':
					case 'queued':
						newStatus = 'in_progress';
						break;
					default:
						newStatus = 'unknown';
				}

				return {
					...status,
					deployStatus: newDeployStatus,
					deployedAt: new Date().toISOString(),
					deployUrl: deployment.runUrl || status.deployUrl,
					status: newStatus,
					conclusion: deployment.status,
					html_url: deployment.runUrl || status.html_url,
					run_date: new Date().toISOString()
				};
			}
			return status;
		});
	}

	function updateRepoStatusFromHealth(projectId: string, healthData: StatusEvent & { provider?: string }): void {
		statuses = statuses.map((status) => {
			if (status.repo === projectId || status.repo.toLowerCase() === projectId.toLowerCase()) {
				if (healthData.category === 'database' || healthData.category === 'auth') {
					const currentHealth = status.serviceHealth || {};
					const newServiceHealth: ServiceHealth = {
						...currentHealth,
						[healthData.category]: healthData.status as ServiceHealthStatus
					};
					return {
						...status,
						serviceHealth: newServiceHealth
					};
				}

				let newDeployStatus: DeploymentStatus;
				switch (healthData.status) {
					case 'healthy':
						newDeployStatus = 'success';
						break;
					case 'down':
						newDeployStatus = 'failure';
						break;
					case 'degraded':
						newDeployStatus = 'deploying';
						break;
					default:
						newDeployStatus = 'unknown';
				}

				let newStatus: WorkflowStatus;
				switch (healthData.status) {
					case 'healthy':
						newStatus = 'success';
						break;
					case 'down':
						newStatus = 'failure';
						break;
					case 'degraded':
						newStatus = 'in_progress';
						break;
					default:
						newStatus = 'unknown';
				}

				return {
					...status,
					deployStatus: newDeployStatus,
					deployedAt: new Date().toISOString(),
					status: newStatus,
					run_date: new Date().toISOString()
				};
			}
			return status;
		});
	}

	let sortBy = $state<'name' | 'recent'>('name');
	let sortDropdownOpen = $state(false);

	// Close dropdowns when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as Element;
		if (sortDropdownOpen && !target.closest('.sort-dropdown')) {
			sortDropdownOpen = false;
		}
	}

	$effect(() => {
		if (!browser) return;
		if (sortDropdownOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	// Owner filter state - load from localStorage
	type OwnerFilter = 'jaslr' | 'vp' | 'junipa';
	let ownerFilters = $state<Record<OwnerFilter, boolean>>({
		jaslr: true,
		vp: true,
		junipa: true
	});

	// Load filters from localStorage on mount
	$effect(() => {
		if (!browser) return;
		const saved = localStorage.getItem('ci-monitor-owner-filters');
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				ownerFilters = { jaslr: true, vp: true, junipa: true, ...parsed };
			} catch (e) {
				// Ignore invalid JSON
			}
		}
	});

	function toggleFilter(filter: OwnerFilter) {
		ownerFilters[filter] = !ownerFilters[filter];
		if (browser) {
			localStorage.setItem('ci-monitor-owner-filters', JSON.stringify(ownerFilters));
		}
	}

	function filterByOwner(statuses: RepoStatus[]): RepoStatus[] {
		return statuses.filter((status) => {
			const isJaslr = status.owner === 'jaslr';
			const isVP = status.owner === 'jvp-ux' || status.owner === 'unknown';
			const isJunipa = status.repo.toLowerCase().includes('junipa');

			if (ownerFilters.junipa && isJunipa) return true;
			if (isJaslr && ownerFilters.jaslr) return true;
			if (isVP && ownerFilters.vp && !isJunipa) return true;
			if (!ownerFilters.jaslr && !ownerFilters.vp && ownerFilters.junipa) {
				return isJunipa;
			}
			return false;
		});
	}

	let selectedRepo = $state<string | null>(null);
	let initializedFromUrl = $state(false);

	function getInfra(repoName: string) {
		return getProjectInfrastructure(repoName);
	}

	function getHostingDashboardUrl(infra: ReturnType<typeof getProjectInfrastructure>): string | null {
		if (!infra) return null;
		const hostingService = infra.services.find(s => s.category === 'hosting');
		return hostingService?.dashboardUrl || null;
	}

	const statusColors: Record<WorkflowStatus, string> = {
		success: 'bg-green-500',
		failure: 'bg-red-500',
		in_progress: 'bg-yellow-500 animate-pulse',
		unknown: 'bg-gray-500'
	};

	const deployStatusColors: Record<DeploymentStatus, string> = {
		success: 'bg-green-500',
		failure: 'bg-red-500',
		deploying: 'bg-transparent',
		unknown: 'bg-gray-500'
	};

	function formatRelativeTime(isoString: string | null): string {
		if (!isoString) return 'never';
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

	function formatDeploymentTime(isoString: string | null): { date: string; time: string } | null {
		if (!isoString) return null;
		const date = new Date(isoString);
		const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
		const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
		return { date: dateStr, time: timeStr };
	}

	const categoryIcons: Record<string, typeof Cloud> = {
		hosting: Cloud,
		database: Database,
		auth: Shield,
		storage: HardDrive,
		dns: Globe,
		domain: Globe,
		email: Mail,
		ci: GitBranch,
		monitoring: AlertTriangle,
		analytics: BarChart3,
		cdn: Server,
		secrets: Shield
	};

	const providerColors: Record<string, string> = {
		cloudflare: 'text-orange-400',
		supabase: 'text-green-400',
		sentry: 'text-purple-400',
		github: 'text-gray-300',
		aws: 'text-yellow-400',
		vercel: 'text-white',
		flyio: 'text-violet-400',
		google: 'text-blue-400',
		gcp: 'text-blue-400',
		netlify: 'text-teal-400'
	};

	function sortedStatuses(statuses: RepoStatus[], sort: 'name' | 'recent'): RepoStatus[] {
		const sorted = [...statuses];
		if (sort === 'name') {
			sorted.sort((a, b) => a.repo.localeCompare(b.repo));
		} else if (sort === 'recent') {
			sorted.sort((a, b) => {
				if (!a.run_date && !b.run_date) return 0;
				if (!a.run_date) return 1;
				if (!b.run_date) return -1;
				return new Date(b.run_date).getTime() - new Date(a.run_date).getTime();
			});
		}
		return sorted;
	}

	function selectRepo(repoName: string) {
		const newSelection = selectedRepo === repoName ? null : repoName;
		selectedRepo = newSelection;

		if (browser) {
			const url = new URL(window.location.href);
			if (newSelection) {
				url.searchParams.set('project', newSelection);
			} else {
				url.searchParams.delete('project');
			}
			goto(url.toString(), { replaceState: true, noScroll: true });
		}
	}

	function groupServicesByCategory(services: InfraService[]): Map<string, InfraService[]> {
		const grouped = new Map<string, InfraService[]>();
		for (const service of services) {
			const existing = grouped.get(service.category) || [];
			existing.push(service);
			grouped.set(service.category, existing);
		}
		return grouped;
	}

	let filteredStatuses = $derived(filterByOwner(statuses));
	let displayStatuses = $derived(sortedStatuses(filteredStatuses, sortBy));
	let selectedStatus = $derived(displayStatuses.find((s) => s.repo === selectedRepo));
	let selectedInfra = $derived(selectedRepo ? getInfra(selectedRepo) : null);

	// Initialize selectedRepo from URL or first repo
	$effect(() => {
		if (!browser || initializedFromUrl) return;
		if (displayStatuses.length === 0) return;

		const projectParam = page.url.searchParams.get('project');
		const repoToSelect = projectParam || displayStatuses[0].repo;

		initializedFromUrl = true;
		selectedRepo = repoToSelect;

		if (!projectParam) {
			const url = new URL(window.location.href);
			url.searchParams.set('project', repoToSelect);
			goto(url.toString(), { replaceState: true, noScroll: true });
		}
	});
</script>

<svelte:head>
	<title>Deployments | Orchon</title>
</svelte:head>

<!-- Deployments page content -->
<div class="flex-1 flex flex-col lg:flex-row min-h-0 h-full">
	<!-- Left Sidebar - Project List (hidden on small, shown on lg+) -->
	<aside class="hidden lg:flex lg:flex-col w-[18rem] shrink-0 border-r border-gray-800 bg-gray-900">
		<!-- Sort & Filter Options -->
		<div class="shrink-0 px-4 py-2 border-b border-gray-800 flex justify-between items-center">
			<!-- Sort dropdown -->
			<div class="relative sort-dropdown">
				<button
					onclick={() => (sortDropdownOpen = !sortDropdownOpen)}
					class="flex items-center gap-1 p-1.5 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
					title={sortBy === 'name' ? 'Sorted A-Z' : 'Sorted by Recent'}
				>
					{#if sortBy === 'name'}
						<ArrowDownAZ class="w-4 h-4" />
					{:else}
						<Clock class="w-4 h-4" />
					{/if}
					<ChevronDown class="w-3 h-3" />
				</button>
				{#if sortDropdownOpen}
					<div class="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-10 min-w-[100px]">
						<button
							onclick={() => { sortBy = 'name'; sortDropdownOpen = false; }}
							class="w-full flex items-center gap-2 px-3 py-2 text-xs text-left cursor-pointer hover:bg-gray-700 transition-colors {sortBy === 'name' ? 'text-white' : 'text-gray-400'}"
						>
							<ArrowDownAZ class="w-4 h-4" />
							<span>A-Z</span>
						</button>
						<button
							onclick={() => { sortBy = 'recent'; sortDropdownOpen = false; }}
							class="w-full flex items-center gap-2 px-3 py-2 text-xs text-left cursor-pointer hover:bg-gray-700 transition-colors {sortBy === 'recent' ? 'text-white' : 'text-gray-400'}"
						>
							<Clock class="w-4 h-4" />
							<span>Recent</span>
						</button>
					</div>
				{/if}
			</div>
			<!-- Owner filter buttons -->
			<div class="flex gap-2">
				<button
					onclick={() => toggleFilter('jaslr')}
					class="px-2 py-1 text-xs cursor-pointer transition-colors {ownerFilters.jaslr ? 'text-gray-200' : 'text-gray-500'}"
					title="Show jaslr projects"
				>jaslr</button>
				<button
					onclick={() => toggleFilter('vp')}
					class="px-2 py-1 text-xs cursor-pointer transition-colors {ownerFilters.vp ? 'text-gray-200' : 'text-gray-500'}"
					title="Show Vast Puddle projects"
				>VP</button>
				<button
					onclick={() => toggleFilter('junipa')}
					class="px-2 py-1 text-xs cursor-pointer transition-colors {ownerFilters.junipa ? 'text-gray-200' : 'text-gray-500'}"
					title="Show Junipa projects only"
				>Junipa</button>
			</div>
		</div>

		<!-- Project List -->
		{#if statuses.length === 0}
			<div class="p-4 text-center text-gray-500">
				<p>No repos configured.</p>
			</div>
		{:else}
			<div class="flex-1 overflow-y-auto py-1">
				{#each displayStatuses as status (status.repo)}
					{@const repoInfra = getInfra(status.repo)}
					{@const isSelected = selectedRepo === status.repo}
					{@const deployTime = sortBy === 'recent' ? formatDeploymentTime(status.run_date) : null}
					<button
						onclick={() => selectRepo(status.repo)}
						class="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors {isSelected
							? 'bg-gray-800 border-l-2 border-blue-500'
							: 'hover:bg-gray-800/50 border-l-2 border-transparent'}"
					>
						<!-- Deployment Status Indicator -->
						{#if status.deployStatus === 'deploying'}
							<div class="w-2.5 h-2.5 shrink-0 relative" title="Deploying...">
								<svg class="w-2.5 h-2.5 animate-spin" viewBox="0 0 16 16">
									<circle cx="8" cy="8" r="6" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="28" stroke-dashoffset="7" stroke-linecap="round" />
								</svg>
							</div>
						{:else}
							<div class="w-2.5 h-2.5 rounded-full {deployStatusColors[status.deployStatus]} shrink-0" title="Deployment: {status.deployStatus}"></div>
						{/if}

						<!-- Repo Info -->
						<div class="flex-1 min-w-0">
							{#if deployTime}
								<div class="text-xs text-gray-500 truncate">
									{deployTime.date}, <span class="text-gray-600">{deployTime.time}</span>
								</div>
							{/if}
							<div class="font-medium text-sm truncate {isSelected ? 'text-white' : 'text-gray-300'}">
								{status.repo}
							</div>
							{#if !deployTime}
								<div class="text-xs text-gray-500 truncate">{status.owner}</div>
							{/if}
							{#if status.deployStatus === 'failure'}
								<div class="text-xs text-red-400 truncate">
									{status.conclusion === 'cancelled' ? 'Cancelled' : status.conclusion === 'timed_out' ? 'Timed out' : 'Build failed'}
								</div>
							{/if}
						</div>

						<!-- Git Repo Status -->
						<a
							href={status.repoUrl}
							target="_blank"
							rel="noopener noreferrer"
							onclick={(e) => e.stopPropagation()}
							class="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors shrink-0"
							title="GitHub: {status.version || 'no version'} - {formatRelativeTime(status.lastPush)}"
						>
							<GitBranch class="w-3.5 h-3.5" />
							{#if status.version}
								<span class="text-xs">{status.version}</span>
							{/if}
						</a>

						<!-- Error Link -->
						{#if status.deployStatus === 'failure'}
							<a
								href={status.deployUrl || status.html_url}
								target="_blank"
								rel="noopener noreferrer"
								onclick={(e) => e.stopPropagation()}
								class="p-1 -m-1 text-red-400 hover:text-red-300 transition-colors shrink-0"
								title="View failed deployment"
							>
								<AlertTriangle class="w-4 h-4" />
							</a>
						{/if}

						<!-- Service Health Indicators -->
						{#if status.serviceHealth?.database && status.serviceHealth.database !== 'healthy'}
							<div class="shrink-0" title="Database: {status.serviceHealth.database}">
								<Database class="w-3.5 h-3.5 {status.serviceHealth.database === 'down' ? 'text-red-400' : 'text-yellow-400'}" />
							</div>
						{/if}
						{#if status.serviceHealth?.auth && status.serviceHealth.auth !== 'healthy'}
							<div class="shrink-0" title="Auth: {status.serviceHealth.auth}">
								<Key class="w-3.5 h-3.5 {status.serviceHealth.auth === 'down' ? 'text-red-400' : 'text-yellow-400'}" />
							</div>
						{/if}

						<!-- Service Count -->
						{#if repoInfra}
							<div class="flex items-center gap-1 text-xs text-gray-500 shrink-0">
								<Layers class="w-3 h-3" />
								<span>{repoInfra.services.length}</span>
							</div>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</aside>

	<!-- Mobile View - Accordion -->
	<div class="lg:hidden flex-1 flex flex-col overflow-hidden bg-gray-900">
		<!-- Mobile Filter Bar -->
		<div class="shrink-0 px-4 py-2 border-b border-gray-800 flex justify-between items-center">
			<div class="relative sort-dropdown">
				<button
					onclick={() => (sortDropdownOpen = !sortDropdownOpen)}
					class="flex items-center gap-1 p-1.5 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
				>
					{#if sortBy === 'name'}
						<ArrowDownAZ class="w-4 h-4" />
					{:else}
						<Clock class="w-4 h-4" />
					{/if}
					<ChevronDown class="w-3 h-3" />
				</button>
				{#if sortDropdownOpen}
					<div class="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-10 min-w-[100px]">
						<button
							onclick={() => { sortBy = 'name'; sortDropdownOpen = false; }}
							class="w-full flex items-center gap-2 px-3 py-2 text-xs text-left cursor-pointer hover:bg-gray-700 transition-colors {sortBy === 'name' ? 'text-white' : 'text-gray-400'}"
						>
							<ArrowDownAZ class="w-4 h-4" />
							<span>A-Z</span>
						</button>
						<button
							onclick={() => { sortBy = 'recent'; sortDropdownOpen = false; }}
							class="w-full flex items-center gap-2 px-3 py-2 text-xs text-left cursor-pointer hover:bg-gray-700 transition-colors {sortBy === 'recent' ? 'text-white' : 'text-gray-400'}"
						>
							<Clock class="w-4 h-4" />
							<span>Recent</span>
						</button>
					</div>
				{/if}
			</div>
			<div class="flex gap-2">
				<button onclick={() => toggleFilter('jaslr')} class="px-2 py-1 text-xs cursor-pointer transition-colors {ownerFilters.jaslr ? 'text-gray-200' : 'text-gray-500'}">jaslr</button>
				<button onclick={() => toggleFilter('vp')} class="px-2 py-1 text-xs cursor-pointer transition-colors {ownerFilters.vp ? 'text-gray-200' : 'text-gray-500'}">VP</button>
				<button onclick={() => toggleFilter('junipa')} class="px-2 py-1 text-xs cursor-pointer transition-colors {ownerFilters.junipa ? 'text-gray-200' : 'text-gray-500'}">Junipa</button>
			</div>
		</div>
		{#if displayStatuses.length === 0}
			<div class="p-4 text-center text-gray-500">
				<p>No repos configured.</p>
			</div>
		{:else}
			<div class="flex-1 overflow-y-auto divide-y divide-gray-800">
				{#each displayStatuses as status (status.repo)}
					{@const repoInfra = getInfra(status.repo)}
					{@const isExpanded = selectedRepo === status.repo}
					{@const deployTimeMobile = sortBy === 'recent' ? formatDeploymentTime(status.run_date) : null}
					<div>
						<button
							onclick={() => selectRepo(status.repo)}
							class="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors {isExpanded ? 'bg-gray-800' : 'hover:bg-gray-800/50'}"
						>
							{#if status.deployStatus === 'deploying'}
								<div class="w-2.5 h-2.5 shrink-0 relative" title="Deploying...">
									<svg class="w-2.5 h-2.5 animate-spin" viewBox="0 0 16 16">
										<circle cx="8" cy="8" r="6" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="28" stroke-dashoffset="7" stroke-linecap="round" />
									</svg>
								</div>
							{:else}
								<div class="w-2.5 h-2.5 rounded-full {deployStatusColors[status.deployStatus]} shrink-0"></div>
							{/if}

							<div class="flex-1 min-w-0">
								{#if deployTimeMobile}
									<div class="text-xs text-gray-500 truncate">
										{deployTimeMobile.date}, <span class="text-gray-600">{deployTimeMobile.time}</span>
									</div>
								{/if}
								<div class="font-medium text-sm truncate {isExpanded ? 'text-white' : 'text-gray-300'}">
									{status.repo}
								</div>
								{#if !deployTimeMobile}
									<div class="text-xs text-gray-500 truncate">{status.owner}</div>
								{/if}
							</div>

							<a href={status.repoUrl} target="_blank" rel="noopener noreferrer" onclick={(e) => e.stopPropagation()} class="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors shrink-0">
								<GitBranch class="w-3.5 h-3.5" />
							</a>

							{#if repoInfra}
								<div class="flex items-center gap-2 text-xs text-gray-500 shrink-0">
									<Layers class="w-3 h-3" />
									<span>{repoInfra.services.length}</span>
								</div>
							{/if}
							<svg class="w-4 h-4 text-gray-500 transition-transform {isExpanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>

						{#if isExpanded && repoInfra}
							{@const grouped = groupServicesByCategory(repoInfra.services)}
							<div class="bg-gray-850">
								<div class="bg-gray-900 py-2 px-2 h-72">
									<InfraFlowDiagram
										services={repoInfra.services}
										projectName={repoInfra.displayName}
										isDeploying={status.deployStatus === 'deploying'}
										deploymentTimestamps={deploymentTimestamps[status.repo]}
									/>
								</div>
								<div class="grid grid-cols-2 gap-3 text-xs px-4 pb-4 pt-3">
									{#each [...grouped.entries()] as [category, services]}
										{@const IconComponent = categoryIcons[category] || Server}
										<div class="bg-gray-800 p-2">
											<div class="flex items-center gap-1 text-gray-500 uppercase tracking-wider mb-1">
												<IconComponent class="w-3 h-3" />
												<span>{category}</span>
											</div>
											{#each services as service}
												{#if service.dashboardUrl}
													<a href={service.dashboardUrl} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 py-0.5 {providerColors[service.provider] || 'text-gray-300'} hover:underline">
														<span class="truncate">{service.serviceName}</span>
														<ExternalLink class="w-2.5 h-2.5 opacity-50 shrink-0" />
													</a>
												{:else}
													<div class="py-0.5 {providerColors[service.provider] || 'text-gray-300'} truncate">{service.serviceName}</div>
												{/if}
											{/each}
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Right Panel - Infrastructure Details (hidden on small, shown on lg+) -->
	<div class="hidden lg:flex flex-1 flex-col overflow-y-auto bg-gray-850 min-w-0">
		{#if selectedStatus && selectedInfra}
			{@const grouped = groupServicesByCategory(selectedInfra.services)}
			<div class="h-full flex flex-col">
				<!-- Project Header -->
				<div class="shrink-0 px-6 py-4 border-b border-gray-700 bg-gray-800">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							{#if selectedStatus.deployStatus === 'deploying'}
								<div class="w-3 h-3 shrink-0 relative" title="Deploying...">
									<svg class="w-3 h-3 animate-spin" viewBox="0 0 16 16">
										<circle cx="8" cy="8" r="6" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="28" stroke-dashoffset="7" stroke-linecap="round" />
									</svg>
								</div>
							{:else}
								<div class="w-3 h-3 rounded-full {deployStatusColors[selectedStatus.deployStatus]}"></div>
							{/if}
							<div>
								<h2 class="text-xl font-semibold text-white">{selectedInfra.displayName}</h2>
								<p class="text-sm text-gray-400">{selectedStatus.owner}/{selectedStatus.repo}</p>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<a href={selectedStatus.repoUrl} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-400 transition-colors">
								<GitBranch class="w-4 h-4" />
								<span>{selectedStatus.version || 'Repo'}</span>
								<ExternalLink class="w-3 h-3" />
							</a>
							{#if selectedStatus.deployUrl}
								<a href={selectedStatus.deployUrl} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 transition-colors">
									<Cloud class="w-4 h-4" />
									<span>Deploy</span>
									<ExternalLink class="w-3 h-3" />
								</a>
							{/if}
							<a href="/admin/repos?project={selectedStatus.repo}" class="flex items-center justify-center w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-gray-400 hover:text-gray-300 transition-colors">
								<Settings class="w-4 h-4" />
							</a>
						</div>
					</div>
				</div>

				<!-- Last Deployment Status -->
				<div class="shrink-0 px-6 py-4 border-b border-gray-700">
					<div class="text-xs text-gray-500 uppercase tracking-wider mb-3">Last Deployment</div>
					<div class="bg-gray-900 rounded-lg p-4">
						{#if selectedStatus.deployStatus === 'failure'}
							{@const hostingDashboard = getHostingDashboardUrl(selectedInfra)}
							<div class="flex items-center gap-3 mb-4 p-3 bg-red-900/30 border border-red-800 rounded">
								<AlertTriangle class="w-5 h-5 text-red-400 shrink-0" />
								<div class="flex-1 min-w-0">
									<div class="text-red-400 font-medium">Deployment Failed</div>
									<div class="text-sm text-red-300/70">{selectedStatus.workflow_name || 'Unknown workflow'} {#if selectedStatus.conclusion} - {selectedStatus.conclusion}{/if}</div>
								</div>
								<div class="flex items-center gap-2 shrink-0">
									{#if selectedStatus.html_url}
										<a href={selectedStatus.html_url} target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 bg-red-800 hover:bg-red-700 rounded text-sm text-red-100 transition-colors flex items-center gap-2">
											View Logs <ExternalLink class="w-3 h-3" />
										</a>
									{/if}
									{#if hostingDashboard}
										<a href={hostingDashboard} target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-100 transition-colors flex items-center gap-2">
											View Dashboard <ExternalLink class="w-3 h-3" />
										</a>
									{/if}
								</div>
							</div>
						{:else if selectedStatus.deployStatus === 'deploying'}
							{@const hostingDashboard = getHostingDashboardUrl(selectedInfra)}
							<div class="flex items-center gap-3 mb-4 p-3 bg-cyan-900/30 border border-cyan-800 rounded">
								<svg class="w-5 h-5 animate-spin text-cyan-400 shrink-0" viewBox="0 0 16 16">
									<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="28" stroke-dashoffset="7" stroke-linecap="round" />
								</svg>
								<div class="flex-1 min-w-0">
									<div class="text-cyan-400 font-medium">Deploying...</div>
									<div class="text-sm text-cyan-300/70">{selectedStatus.workflow_name || 'Deployment in progress'}</div>
								</div>
								<div class="flex items-center gap-2 shrink-0">
									{#if selectedStatus.html_url}
										<a href={selectedStatus.html_url} target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 bg-cyan-800 hover:bg-cyan-700 rounded text-sm text-cyan-100 transition-colors flex items-center gap-2">
											View Progress <ExternalLink class="w-3 h-3" />
										</a>
									{/if}
									{#if hostingDashboard}
										<a href={hostingDashboard} target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-100 transition-colors flex items-center gap-2">
											View Dashboard <ExternalLink class="w-3 h-3" />
										</a>
									{/if}
								</div>
							</div>
						{:else if selectedStatus.deployStatus === 'success'}
							{@const hostingDashboard = getHostingDashboardUrl(selectedInfra)}
							<div class="flex items-center gap-3 mb-4 p-3 bg-green-900/30 border border-green-800 rounded">
								<div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
									<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
									</svg>
								</div>
								<div class="flex-1 min-w-0">
									<div class="text-green-400 font-medium">Deployed Successfully</div>
									<div class="text-sm text-green-300/70">{selectedStatus.workflow_name || 'Last deployment succeeded'}</div>
								</div>
								{#if hostingDashboard}
									<a href={hostingDashboard} target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 bg-green-800 hover:bg-green-700 rounded text-sm text-green-100 transition-colors flex items-center gap-2 shrink-0">
										View Dashboard <ExternalLink class="w-3 h-3" />
									</a>
								{/if}
							</div>
						{/if}

						<div class="grid grid-cols-2 gap-4 text-sm">
							<div>
								<div class="text-gray-500 text-xs uppercase mb-1">Platform</div>
								<div class="text-gray-300 capitalize">{selectedStatus.deployPlatform || 'Unknown'}</div>
							</div>
							<div>
								<div class="text-gray-500 text-xs uppercase mb-1">Last Updated</div>
								<div class="text-gray-300">
									{#if selectedStatus.deployedAt || selectedStatus.run_date}
										{formatRelativeTime(selectedStatus.deployedAt || selectedStatus.run_date)}
										<span class="text-gray-500 text-xs ml-1">({new Date(selectedStatus.deployedAt || selectedStatus.run_date || '').toLocaleString()})</span>
									{:else}
										<span class="text-gray-500">Unknown</span>
									{/if}
								</div>
							</div>
							{#if selectedStatus.lastCommitSha}
								<div>
									<div class="text-gray-500 text-xs uppercase mb-1">Commit</div>
									<a href="{selectedStatus.repoUrl}/commit/{selectedStatus.lastCommitSha}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 font-mono text-xs flex items-center gap-1">
										{selectedStatus.lastCommitSha.slice(0, 7)} <ExternalLink class="w-3 h-3" />
									</a>
								</div>
							{/if}
							{#if selectedStatus.html_url}
								<div>
									<div class="text-gray-500 text-xs uppercase mb-1">CI Run</div>
									<a href={selectedStatus.html_url} target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 flex items-center gap-1">
										{selectedStatus.workflow_name || 'View Run'} <ExternalLink class="w-3 h-3" />
									</a>
								</div>
							{/if}
							{#if selectedStatus.deployUrl}
								<div class="col-span-2">
									<div class="text-gray-500 text-xs uppercase mb-1">Deploy Log</div>
									<a href={selectedStatus.deployUrl} target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 flex items-center gap-1">
										View deployment details <ExternalLink class="w-3 h-3" />
									</a>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Flow Diagram -->
				<div class="shrink-0 px-6 py-4 border-b border-gray-700">
					<div class="text-xs text-gray-500 uppercase tracking-wider mb-2">Infrastructure Flow</div>
					<div class="bg-gray-900 p-3">
						<InfraFlowDiagram
							services={selectedInfra.services}
							projectName={selectedInfra.displayName}
							isDeploying={selectedStatus.deployStatus === 'deploying'}
							deploymentTimestamps={deploymentTimestamps[selectedStatus.repo]}
						/>
					</div>
				</div>

				<!-- Details Grid -->
				<div class="flex-1 p-6 overflow-y-auto">
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{#if selectedInfra.stack}
							<div class="bg-gray-800 p-4">
								<div class="text-xs text-gray-500 uppercase tracking-wider mb-3">Tech Stack</div>
								<div class="flex flex-wrap gap-2">
									{#if selectedInfra.stack.framework}
										<span class="px-3 py-1.5 bg-gray-700 text-sm text-blue-400">{selectedInfra.stack.framework}</span>
									{/if}
									{#each selectedInfra.stack.css || [] as css}
										<span class="px-3 py-1.5 bg-gray-700 text-sm text-cyan-400">{css}</span>
									{/each}
									{#if selectedInfra.stack.buildTool}
										<span class="px-3 py-1.5 bg-gray-700 text-sm text-yellow-400">{selectedInfra.stack.buildTool}</span>
									{/if}
									{#if selectedInfra.stack.language}
										<span class="px-3 py-1.5 bg-gray-700 text-sm text-gray-400">{selectedInfra.stack.language}</span>
									{/if}
									{#if selectedInfra.stack.packageManager}
										<span class="px-3 py-1.5 bg-gray-700 text-sm text-gray-500">{selectedInfra.stack.packageManager}</span>
									{/if}
								</div>
							</div>
						{/if}

						<div class="bg-gray-800 p-4">
							<div class="text-xs text-gray-500 uppercase tracking-wider mb-3">Services</div>
							<div class="space-y-3">
								{#each [...grouped.entries()] as [category, services]}
									{@const IconComponent = categoryIcons[category] || Server}
									<div>
										<div class="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-1">
											<IconComponent class="w-3 h-3" />
											<span>{category}</span>
										</div>
										{#each services as service}
											{#if service.dashboardUrl}
												<a href={service.dashboardUrl} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 py-1 text-sm {providerColors[service.provider] || 'text-gray-300'} hover:underline">
													<span>{service.serviceName}</span>
													<ExternalLink class="w-3 h-3 opacity-50" />
												</a>
											{:else}
												<div class="flex items-center gap-2 py-1 text-sm {providerColors[service.provider] || 'text-gray-300'}">
													<span>{service.serviceName}</span>
												</div>
											{/if}
										{/each}
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="h-full flex items-center justify-center text-gray-500">
				<p>Select a repository to view infrastructure</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.bg-gray-850 {
		background-color: rgb(30 32 36);
	}
</style>
