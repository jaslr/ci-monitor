<script lang="ts">
	import type { PageData } from './$types';
	import type { WorkflowStatus, RepoStatus, DeploymentStatus } from '$lib/github';
	import type { InfraService, TechStack } from '$lib/types/infrastructure';
	import type { StatusEvent } from '$lib/services/sse-client';
	import { getProjectInfrastructure } from '$lib/config/infrastructure';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { sseClient, type SSEEvent, type DeploymentEvent } from '$lib/services/sse-client';
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
		Radio,
		Settings,
		ArrowDownAZ,
		Clock,
		ChevronDown,
		ChevronRight,
		Network,
		FolderGit2
	} from '@lucide/svelte';
	import InfraFlowDiagram from '$lib/components/InfraFlowDiagram.svelte';

	let { data }: { data: PageData } = $props();

	// Local state for real-time updates
	let statuses = $state<RepoStatus[]>(data.statuses);
	let lastUpdated = $state(data.lastUpdated);
	let sseConnected = $state(false);
	let connectionInfo = $state(sseClient.connectionStatus);
	let showConnectionDetails = $state(false);

	// Update local state when server data changes (navigation, etc.)
	$effect(() => {
		statuses = data.statuses;
		lastUpdated = data.lastUpdated;
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
			connectionInfo = sseClient.connectionStatus;
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
		statuses = statuses.map((status) => {
			// Match by repo name (project ID matches repo name in our config)
			if (status.repo === projectId || status.repo.toLowerCase() === projectId.toLowerCase()) {
				// Map SSE deployment status to our DeploymentStatus type
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

				// Also update legacy status for backward compatibility
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
					// New deployment fields
					deployStatus: newDeployStatus,
					deployedAt: new Date().toISOString(),
					deployUrl: deployment.runUrl || status.deployUrl,
					// Legacy fields for backward compatibility
					status: newStatus,
					conclusion: deployment.status,
					html_url: deployment.runUrl || status.html_url,
					run_date: new Date().toISOString()
				};
			}
			return status;
		});
	}

	// Handle status events from backend (Fly.io/Cloudflare health checks)
	function updateRepoStatusFromHealth(projectId: string, healthData: StatusEvent & { provider?: string }): void {
		statuses = statuses.map((status) => {
			if (status.repo === projectId || status.repo.toLowerCase() === projectId.toLowerCase()) {
				// Map health status to deployment status
				let newDeployStatus: DeploymentStatus;
				switch (healthData.status) {
					case 'healthy':
						newDeployStatus = 'success';
						break;
					case 'down':
						newDeployStatus = 'failure';
						break;
					case 'degraded':
						newDeployStatus = 'deploying'; // Show as "in progress"
						break;
					default:
						newDeployStatus = 'unknown';
				}

				// Map to legacy workflow status
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
	let projectsExpanded = $state(true);

	// Close dropdowns when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as Element;
		if (sortDropdownOpen && !target.closest('.sort-dropdown')) {
			sortDropdownOpen = false;
		}
		if (showConnectionDetails && !target.closest('.connection-status')) {
			showConnectionDetails = false;
		}
	}

	$effect(() => {
		if (!browser) return;
		if (sortDropdownOpen || showConnectionDetails) {
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

	// Load filters from localStorage on mount (runs once)
	$effect(() => {
		if (!browser) return;
		const saved = localStorage.getItem('ci-monitor-owner-filters');
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				// Don't spread ownerFilters here - that creates an infinite loop!
				ownerFilters = { jaslr: true, vp: true, junipa: true, ...parsed };
			} catch (e) {
				// Ignore invalid JSON
			}
		}
	});

	// Save filters to localStorage when changed
	function toggleFilter(filter: OwnerFilter) {
		ownerFilters[filter] = !ownerFilters[filter];
		if (browser) {
			localStorage.setItem('ci-monitor-owner-filters', JSON.stringify(ownerFilters));
		}
	}

	// Filter statuses based on owner
	function filterByOwner(statuses: RepoStatus[]): RepoStatus[] {
		return statuses.filter((status) => {
			const isJaslr = status.owner === 'jaslr';
			const isVP = status.owner === 'jvp-ux' || status.owner === 'unknown';
			const isJunipa = status.repo.toLowerCase().includes('junipa');

			// If Junipa filter is on, show all Junipa regardless of other filters
			if (ownerFilters.junipa && isJunipa) return true;

			// Otherwise check jaslr/vp filters
			if (isJaslr && ownerFilters.jaslr) return true;
			if (isVP && ownerFilters.vp && !isJunipa) return true;

			// If only junipa filter is on, only show junipa
			if (!ownerFilters.jaslr && !ownerFilters.vp && ownerFilters.junipa) {
				return isJunipa;
			}

			return false;
		});
	}

	// Initialize selectedRepo from URL param or first repo
	let selectedRepo = $state<string | null>(null);
	let initializedFromUrl = $state(false);

	// Infrastructure data is static - loaded from config
	function getInfra(repoName: string) {
		return getProjectInfrastructure(repoName);
	}

	const statusColors: Record<WorkflowStatus, string> = {
		success: 'bg-green-500',
		failure: 'bg-red-500',
		in_progress: 'bg-yellow-500 animate-pulse',
		unknown: 'bg-gray-500'
	};

	// Deployment status colors (for Fly.io/Cloudflare deployment status)
	const deployStatusColors: Record<DeploymentStatus, string> = {
		success: 'bg-green-500',
		failure: 'bg-red-500',
		deploying: 'bg-yellow-500 animate-pulse',
		unknown: 'bg-gray-500'
	};

	// Format relative time for last push
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

	function formatTime(isoString: string): string {
		return new Date(isoString).toLocaleTimeString();
	}

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

		// Update URL param
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

	// Initialize selectedRepo once on mount from URL or first repo
	$effect(() => {
		if (!browser || initializedFromUrl) return;
		if (displayStatuses.length === 0) return;

		const projectParam = page.url.searchParams.get('project');
		const repoToSelect = projectParam || displayStatuses[0].repo;

		// Mark as initialized BEFORE setting state to prevent re-runs
		initializedFromUrl = true;
		selectedRepo = repoToSelect;

		// Update URL if we auto-selected (no URL param was present)
		if (!projectParam) {
			const url = new URL(window.location.href);
			url.searchParams.set('project', repoToSelect);
			goto(url.toString(), { replaceState: true, noScroll: true });
		}
	});
</script>

<div class="min-h-screen bg-gray-900 text-white flex flex-col">
	<!-- Header -->
	<header class="shrink-0 px-4 py-3 border-b border-gray-800">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<img src="/logo.svg" alt="Orchon logo" class="w-8 h-8 text-gray-200" />
				<div>
					<h1 class="text-lg font-semibold text-gray-100" style="font-family: 'Roboto', sans-serif;">Orchon</h1>
					<p class="text-xs text-gray-500">Last updated: {formatTime(lastUpdated)}</p>
				</div>
			</div>
			<!-- Right side: SSE status + Settings -->
			<div class="flex items-center gap-4">
				<!-- SSE Connection Status (clickable) -->
				<div class="relative connection-status">
					<button
						onclick={() => showConnectionDetails = !showConnectionDetails}
						class="flex items-center gap-2 text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors cursor-pointer"
					>
						<Radio class="w-3 h-3 {sseConnected ? 'text-green-400' : connectionInfo.connecting ? 'text-yellow-400 animate-pulse' : 'text-red-400'}" />
						<span class="{sseConnected ? 'text-green-400' : connectionInfo.connecting ? 'text-yellow-400' : 'text-red-400'}">
							{sseConnected ? 'Live' : connectionInfo.connecting ? 'Connecting...' : 'Disconnected'}
						</span>
					</button>

					<!-- Connection Details Popup -->
					{#if showConnectionDetails}
						<div class="absolute top-full right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded shadow-xl z-50">
							<div class="p-3 border-b border-gray-700">
								<div class="flex items-center justify-between">
									<span class="text-xs text-gray-400 uppercase tracking-wider">Connection Status</span>
									<button
										onclick={() => showConnectionDetails = false}
										class="text-gray-500 hover:text-gray-300 cursor-pointer"
										aria-label="Close"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>
							</div>
							<div class="p-3 space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-gray-400">State:</span>
									<span class="{sseConnected ? 'text-green-400' : connectionInfo.connecting ? 'text-yellow-400' : 'text-red-400'}">
										{connectionInfo.readyStateText}
									</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-400">Backend:</span>
									<span class="text-gray-300 text-xs font-mono truncate max-w-[180px]" title={connectionInfo.url || 'Not set'}>
										{connectionInfo.url ? new URL(connectionInfo.url).host : 'Not set'}
									</span>
								</div>
								{#if connectionInfo.reconnectAttempts > 0}
									<div class="flex justify-between">
										<span class="text-gray-400">Reconnect attempts:</span>
										<span class="text-yellow-400">
											{connectionInfo.reconnectAttempts} / {connectionInfo.maxReconnectAttempts}
										</span>
									</div>
								{/if}
								<div class="pt-2 border-t border-gray-700 text-xs text-gray-500">
									Real-time updates from the backend SSE stream
								</div>
							</div>
						</div>
					{/if}
				</div>
				<!-- Settings cog -->
				<a
					href="/admin"
					class="p-2 -m-2 text-gray-400 hover:text-gray-200 transition-colors"
					title="Settings"
				>
					<Settings class="w-5 h-5" />
				</a>
			</div>
		</div>
	</header>

	<!-- Main Content - Responsive Layout -->
	<div class="flex-1 flex flex-col lg:flex-row min-h-0">
		<!-- Left Sidebar - Repo List (hidden on small, shown on lg+) -->
		<aside class="hidden lg:flex lg:flex-col w-[20rem] shrink-0 border-r border-gray-800 bg-gray-900">
			<!-- Projects (collapsible header) -->
			<button
				onclick={() => projectsExpanded = !projectsExpanded}
				class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors bg-gray-800 border-l-2 border-blue-500 cursor-pointer shrink-0"
			>
				{#if projectsExpanded}
					<ChevronDown class="w-4 h-4 text-blue-400 shrink-0" />
				{:else}
					<ChevronRight class="w-4 h-4 text-blue-400 shrink-0" />
				{/if}
				<div class="flex-1 min-w-0">
					<div class="font-medium text-sm text-white truncate">Projects</div>
				</div>
			</button>

			<!-- Projects content (collapsible) -->
			{#if projectsExpanded}
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
				<!-- Owner filter buttons (groups) -->
				<div class="flex gap-2">
					<button
						onclick={() => toggleFilter('jaslr')}
						class="px-2 py-1 text-xs cursor-pointer transition-colors {ownerFilters.jaslr
							? 'text-gray-200'
							: 'text-gray-500'}"
						title="Show jaslr projects"
					>
						jaslr
					</button>
					<button
						onclick={() => toggleFilter('vp')}
						class="px-2 py-1 text-xs cursor-pointer transition-colors {ownerFilters.vp
							? 'text-gray-200'
							: 'text-gray-500'}"
						title="Show Vast Puddle projects"
					>
						VP
					</button>
					<button
						onclick={() => toggleFilter('junipa')}
						class="px-2 py-1 text-xs cursor-pointer transition-colors {ownerFilters.junipa
							? 'text-gray-200'
							: 'text-gray-500'}"
						title="Show Junipa projects only"
					>
						Junipa
					</button>
				</div>
			</div>

			<!-- Repo List -->
			{#if statuses.length === 0}
				<div class="p-4 text-center text-gray-500">
					<p>No repos configured.</p>
				</div>
			{:else}
				<div class="flex-1 overflow-y-auto py-1">
					{#each displayStatuses as status (status.repo)}
						{@const repoInfra = getInfra(status.repo)}
						{@const isSelected = selectedRepo === status.repo}
						<button
							onclick={() => selectRepo(status.repo)}
							class="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors {isSelected
								? 'bg-gray-800 border-l-2 border-blue-500'
								: 'hover:bg-gray-800/50 border-l-2 border-transparent'}"
						>
							<!-- Deployment Status Dot (Fly.io/Cloudflare) -->
							<div class="w-2.5 h-2.5 rounded-full {deployStatusColors[status.deployStatus]} shrink-0" title="Deployment: {status.deployStatus}"></div>

							<!-- Repo Info -->
							<div class="flex-1 min-w-0">
								<div class="font-medium text-sm truncate {isSelected ? 'text-white' : 'text-gray-300'}">
									{status.repo}
								</div>
								<div class="text-xs text-gray-500 truncate">{status.owner}</div>
							</div>

							<!-- Git Repo Status (grey icon) -->
							<a
								href={status.repoUrl}
								target="_blank"
								rel="noopener noreferrer"
								onclick={(e) => e.stopPropagation()}
								class="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors shrink-0"
								title="GitHub: {status.version || 'no version'} • {formatRelativeTime(status.lastPush)}"
							>
								<GitBranch class="w-3.5 h-3.5" />
								{#if status.version}
									<span class="text-xs">{status.version}</span>
								{/if}
							</a>

							<!-- Error Link (clickable, goes to problematic service) -->
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

			<!-- Ecosystem (at bottom of project list) -->
			<a
				href="/ecosystem"
				class="flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-800/50 border-l-2 border-transparent shrink-0"
			>
				<Network class="w-4 h-4 text-gray-500 shrink-0" />
				<div class="flex-1 min-w-0">
					<div class="font-medium text-sm text-gray-300 truncate">Ecosystem</div>
					<div class="text-xs text-gray-500 truncate">Provider dependencies</div>
				</div>
			</a>
			{/if}
		</aside>

		<!-- Mobile Accordion View (shown on small, hidden on lg+) -->
		<div class="lg:hidden flex-1 flex flex-col overflow-hidden bg-gray-900">
			<!-- Mobile Filter Bar -->
			<div class="shrink-0 px-4 py-2 border-b border-gray-800 flex justify-between items-center">
				<!-- Sort dropdown (mobile) -->
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
				<!-- Owner filter buttons (groups - mobile) -->
				<div class="flex gap-2">
					<button
						onclick={() => toggleFilter('jaslr')}
						class="px-2 py-1 text-xs cursor-pointer transition-colors {ownerFilters.jaslr ? 'text-gray-200' : 'text-gray-500'}"
					>jaslr</button>
					<button
						onclick={() => toggleFilter('vp')}
						class="px-2 py-1 text-xs cursor-pointer transition-colors {ownerFilters.vp ? 'text-gray-200' : 'text-gray-500'}"
					>VP</button>
					<button
						onclick={() => toggleFilter('junipa')}
						class="px-2 py-1 text-xs cursor-pointer transition-colors {ownerFilters.junipa ? 'text-gray-200' : 'text-gray-500'}"
					>Junipa</button>
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
						<div>
							<!-- Accordion Header -->
							<button
								onclick={() => selectRepo(status.repo)}
								class="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors {isExpanded
									? 'bg-gray-800'
									: 'hover:bg-gray-800/50'}"
							>
								<!-- Deployment Status Dot (Fly.io/Cloudflare) -->
								<div class="w-2.5 h-2.5 rounded-full {deployStatusColors[status.deployStatus]} shrink-0" title="Deployment: {status.deployStatus}"></div>

								<!-- Repo Info -->
								<div class="flex-1 min-w-0">
									<div class="font-medium text-sm truncate {isExpanded ? 'text-white' : 'text-gray-300'}">
										{status.repo}
									</div>
									<div class="text-xs text-gray-500 truncate">{status.owner}</div>
								</div>

								<!-- Git Repo Status (grey icon) -->
								<a
									href={status.repoUrl}
									target="_blank"
									rel="noopener noreferrer"
									onclick={(e) => e.stopPropagation()}
									class="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors shrink-0"
									title="GitHub: {status.version || 'no version'} • {formatRelativeTime(status.lastPush)}"
								>
									<GitBranch class="w-3.5 h-3.5" />
								</a>

								<!-- Error Link (clickable, goes to problematic service) -->
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

								<!-- Service Count & Expand Icon -->
								{#if repoInfra}
									<div class="flex items-center gap-2 text-xs text-gray-500 shrink-0">
										<Layers class="w-3 h-3" />
										<span>{repoInfra.services.length}</span>
									</div>
								{/if}
								<svg
									class="w-4 h-4 text-gray-500 transition-transform {isExpanded ? 'rotate-180' : ''}"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</button>

							<!-- Accordion Content -->
							{#if isExpanded && repoInfra}
								{@const grouped = groupServicesByCategory(repoInfra.services)}
								<div class="px-4 pb-4 bg-gray-850">
									<!-- Flow Diagram - Compact -->
									<div class="py-3">
										<div class="bg-gray-900 p-3 h-40">
											<InfraFlowDiagram
												services={repoInfra.services}
												projectName={repoInfra.displayName}
											/>
										</div>
									</div>

									<!-- Services Grid -->
									<div class="grid grid-cols-2 gap-3 text-xs">
										{#each [...grouped.entries()] as [category, services]}
											{@const IconComponent = categoryIcons[category] || Server}
											<div class="bg-gray-800 p-2">
												<div class="flex items-center gap-1 text-gray-500 uppercase tracking-wider mb-1">
													<IconComponent class="w-3 h-3" />
													<span>{category}</span>
												</div>
												{#each services as service}
													{#if service.dashboardUrl}
														<a
															href={service.dashboardUrl}
															target="_blank"
															rel="noopener noreferrer"
															class="flex items-center gap-1 py-0.5 {providerColors[service.provider] || 'text-gray-300'} hover:underline"
														>
															<span class="truncate">{service.serviceName}</span>
															<ExternalLink class="w-2.5 h-2.5 opacity-50 shrink-0" />
														</a>
													{:else}
														<div class="py-0.5 {providerColors[service.provider] || 'text-gray-300'} truncate">
															{service.serviceName}
														</div>
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
		<main class="hidden lg:flex flex-1 flex-col overflow-y-auto bg-gray-850 min-w-0">
			{#if selectedStatus && selectedInfra}
				{@const grouped = groupServicesByCategory(selectedInfra.services)}
				<div class="h-full flex flex-col">
					<!-- Project Header -->
					<div class="shrink-0 px-6 py-4 border-b border-gray-700 bg-gray-800">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<!-- Deployment Status Dot -->
								<div class="w-3 h-3 rounded-full {deployStatusColors[selectedStatus.deployStatus]}" title="Deployment: {selectedStatus.deployStatus}"></div>
								<div>
									<h2 class="text-xl font-semibold text-white">{selectedInfra.displayName}</h2>
									<p class="text-sm text-gray-400">{selectedStatus.owner}/{selectedStatus.repo}</p>
								</div>
							</div>
							<div class="flex items-center gap-2">
								<!-- GitHub Repo Link (grey) -->
								<a
									href={selectedStatus.repoUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-400 transition-colors"
									title="GitHub: {selectedStatus.version || 'no version'} • {formatRelativeTime(selectedStatus.lastPush)}"
								>
									<GitBranch class="w-4 h-4" />
									<span>{selectedStatus.version || 'Repo'}</span>
									<ExternalLink class="w-3 h-3" />
								</a>
								<!-- Deployment Link (if available) -->
								{#if selectedStatus.deployUrl}
									<a
										href={selectedStatus.deployUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 transition-colors"
									>
										<Cloud class="w-4 h-4" />
										<span>Deploy</span>
										<ExternalLink class="w-3 h-3" />
									</a>
								{/if}
								<!-- Settings Link -->
								<a
									href="/admin/repos?project={selectedStatus.repo}"
									class="flex items-center justify-center w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-gray-400 hover:text-gray-300 transition-colors"
									title="Configure {selectedStatus.repo}"
								>
									<Settings class="w-4 h-4" />
								</a>
							</div>
						</div>
					</div>

					<!-- Flow Diagram -->
					<div class="shrink-0 px-6 py-4 border-b border-gray-700">
						<div class="flex items-center justify-between mb-2">
							<div class="text-xs text-gray-500 uppercase tracking-wider">Infrastructure Flow</div>
							<div class="text-xs text-gray-600">Drag to pan • Scroll to zoom</div>
						</div>
						<div class="bg-gray-900 p-3 pt-8">
							<InfraFlowDiagram
								services={selectedInfra.services}
								projectName={selectedInfra.displayName}
							/>
						</div>
					</div>

					<!-- Details Grid -->
					<div class="flex-1 p-6 overflow-y-auto">
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<!-- Tech Stack -->
							{#if selectedInfra.stack}
								<div class="bg-gray-800 p-4">
									<div class="text-xs text-gray-500 uppercase tracking-wider mb-3">Tech Stack</div>
									<div class="flex flex-wrap gap-2">
										{#if selectedInfra.stack.framework}
											<span class="px-3 py-1.5 bg-gray-700 text-sm text-blue-400">
												{selectedInfra.stack.framework}
											</span>
										{/if}
										{#each selectedInfra.stack.css || [] as css}
											<span class="px-3 py-1.5 bg-gray-700 text-sm text-cyan-400">
												{css}
											</span>
										{/each}
										{#if selectedInfra.stack.buildTool}
											<span class="px-3 py-1.5 bg-gray-700 text-sm text-yellow-400">
												{selectedInfra.stack.buildTool}
											</span>
										{/if}
										{#if selectedInfra.stack.language}
											<span class="px-3 py-1.5 bg-gray-700 text-sm text-gray-400">
												{selectedInfra.stack.language}
											</span>
										{/if}
										{#if selectedInfra.stack.packageManager}
											<span class="px-3 py-1.5 bg-gray-700 text-sm text-gray-500">
												{selectedInfra.stack.packageManager}
											</span>
										{/if}
									</div>
								</div>
							{/if}

							<!-- Services List with Links -->
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
													<a
														href={service.dashboardUrl}
														target="_blank"
														rel="noopener noreferrer"
														class="flex items-center gap-2 py-1 text-sm {providerColors[service.provider] || 'text-gray-300'} hover:underline"
													>
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
		</main>
	</div>
</div>

<style>
	.bg-gray-850 {
		background-color: rgb(30 32 36);
	}
</style>
