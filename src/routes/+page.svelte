<script lang="ts">
	import type { PageData } from './$types';
	import type { WorkflowStatus, RepoStatus } from '$lib/github';
	import type { Project, InfraService, DiscoveryResult } from '$lib/types/infrastructure';
	import {
		ChevronRight,
		ChevronDown,
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
		RefreshCw,
		Layers,
		Network
	} from '@lucide/svelte';
	import InfraFlowDiagram from '$lib/components/InfraFlowDiagram.svelte';

	let { data }: { data: PageData } = $props();

	let showDates = $state(false);
	let showDiagram = $state<Set<string>>(new Set());
	let sortBy = $state<'name' | 'account' | 'recent'>('name');
	let expandedRows = $state<Set<string>>(new Set());
	let infraData = $state<Map<string, { project: Project; discovery: DiscoveryResult }>>(new Map());
	let loadingInfra = $state<Set<string>>(new Set());

	function toggleDiagram(repoKey: string) {
		if (showDiagram.has(repoKey)) {
			showDiagram.delete(repoKey);
		} else {
			showDiagram.add(repoKey);
		}
		showDiagram = new Set(showDiagram);
	}

	const statusColors: Record<WorkflowStatus, string> = {
		success: 'bg-green-500',
		failure: 'bg-red-500',
		in_progress: 'bg-yellow-500 animate-pulse',
		unknown: 'bg-gray-500'
	};

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
		netlify: 'text-teal-400'
	};

	function formatTime(isoString: string): string {
		return new Date(isoString).toLocaleTimeString();
	}

	function formatRunDate(isoString: string | null): { date: string; time: string } {
		if (!isoString) return { date: '', time: '' };
		const d = new Date(isoString);
		const months = [
			'JAN',
			'FEB',
			'MAR',
			'APR',
			'MAY',
			'JUN',
			'JUL',
			'AUG',
			'SEP',
			'OCT',
			'NOV',
			'DEC'
		];
		const date = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
		const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
		return { date, time };
	}

	function sortedStatuses(statuses: RepoStatus[], sort: 'name' | 'account' | 'recent'): RepoStatus[] {
		const sorted = [...statuses];
		if (sort === 'name') {
			sorted.sort((a, b) => a.repo.localeCompare(b.repo));
		} else if (sort === 'account') {
			sorted.sort((a, b) => a.owner.localeCompare(b.owner) || a.repo.localeCompare(b.repo));
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

	async function toggleRow(repoKey: string, repoName: string) {
		if (expandedRows.has(repoKey)) {
			expandedRows.delete(repoKey);
			expandedRows = new Set(expandedRows);
		} else {
			expandedRows.add(repoKey);
			expandedRows = new Set(expandedRows);

			// Load infrastructure data if not already loaded
			if (!infraData.has(repoName) && !loadingInfra.has(repoName)) {
				loadingInfra.add(repoName);
				loadingInfra = new Set(loadingInfra);

				try {
					const response = await fetch(`/api/scan?project=${encodeURIComponent(repoName)}`);
					if (response.ok) {
						const result = await response.json();
						infraData.set(repoName, result);
						infraData = new Map(infraData);
					}
				} catch (e) {
					console.error('Failed to load infrastructure:', e);
				} finally {
					loadingInfra.delete(repoName);
					loadingInfra = new Set(loadingInfra);
				}
			}
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

	let displayStatuses = $derived(sortedStatuses(data.statuses, sortBy));
</script>

<div class="min-h-screen bg-gray-900 text-white p-4">
	<div class="max-w-4xl mx-auto">
		<header class="mb-4 text-center">
			<h1 class="text-2xl font-bold text-gray-100">Infrastructure Observatory</h1>
			<p class="text-sm text-gray-500">Last updated: {formatTime(data.lastUpdated)}</p>
		</header>

		<!-- Controls -->
		<div class="flex items-center justify-between mb-4 gap-4 flex-wrap">
			<!-- Show Dates Toggle -->
			<label class="flex items-center gap-2 cursor-pointer">
				<div class="relative">
					<input type="checkbox" bind:checked={showDates} class="sr-only peer" />
					<div
						class="w-10 h-5 bg-gray-700 rounded-full peer-checked:bg-blue-600 transition-colors"
					></div>
					<div
						class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"
					></div>
				</div>
				<span class="text-sm text-gray-400">Show dates</span>
			</label>

			<!-- Sort Options -->
			<div class="flex gap-2">
				<button
					onclick={() => (sortBy = 'name')}
					class="px-3 py-1 text-sm rounded {sortBy === 'name'
						? 'bg-blue-600'
						: 'bg-gray-700 hover:bg-gray-600'} transition-colors"
				>
					A-Z
				</button>
				<button
					onclick={() => (sortBy = 'account')}
					class="px-3 py-1 text-sm rounded {sortBy === 'account'
						? 'bg-blue-600'
						: 'bg-gray-700 hover:bg-gray-600'} transition-colors"
				>
					Account
				</button>
				<button
					onclick={() => (sortBy = 'recent')}
					class="px-3 py-1 text-sm rounded {sortBy === 'recent'
						? 'bg-blue-600'
						: 'bg-gray-700 hover:bg-gray-600'} transition-colors"
				>
					Recent
				</button>
			</div>
		</div>

		{#if data.statuses.length === 0}
			<div class="text-center text-gray-500 py-12">
				<p>No repos configured.</p>
				<p class="text-sm mt-2">Edit src/lib/config/repos.ts to add repos.</p>
			</div>
		{:else}
			<div class="space-y-2">
				{#each displayStatuses as status (`${status.owner}/${status.repo}`)}
					{@const runDate = formatRunDate(status.run_date)}
					{@const repoKey = `${status.owner}/${status.repo}`}
					{@const isExpanded = expandedRows.has(repoKey)}
					{@const repoInfra = infraData.get(status.repo)}
					{@const isLoading = loadingInfra.has(status.repo)}

					<div class="bg-gray-800 rounded-lg overflow-hidden">
						<!-- Main Row -->
						<div
							class="flex items-center gap-4 p-4 hover:bg-gray-700 transition-colors cursor-pointer"
							onclick={() => toggleRow(repoKey, status.repo)}
							onkeydown={(e) => e.key === 'Enter' && toggleRow(repoKey, status.repo)}
							role="button"
							tabindex="0"
						>
							<!-- Expand Icon -->
							<div class="text-gray-500 shrink-0">
								{#if isExpanded}
									<ChevronDown class="w-4 h-4" />
								{:else}
									<ChevronRight class="w-4 h-4" />
								{/if}
							</div>

							<!-- Status Dot -->
							<div class="w-4 h-4 rounded-full {statusColors[status.status]} shrink-0"></div>

							<!-- Repo Info -->
							<div class="flex-1 min-w-0">
								<div class="font-medium truncate">{status.repo}</div>
								<div class="text-xs text-gray-500 truncate">{status.owner}</div>
							</div>

							<!-- Service Count Badge -->
							{#if repoInfra}
								<div class="flex items-center gap-1 text-xs text-gray-400 shrink-0">
									<Layers class="w-3 h-3" />
									<span>{repoInfra.project.services.length}</span>
								</div>
							{/if}

							<!-- Date -->
							{#if showDates && status.run_date}
								<div class="text-right shrink-0">
									<div class="text-sm text-gray-300">{runDate.date}</div>
									<div class="text-xs text-gray-500">{runDate.time}</div>
								</div>
							{/if}

							<!-- External Link -->
							<a
								href={status.html_url}
								target="_blank"
								rel="noopener noreferrer"
								class="text-gray-500 hover:text-white shrink-0"
								onclick={(e) => e.stopPropagation()}
							>
								<GitBranch class="w-4 h-4" />
							</a>
						</div>

						<!-- Expanded Infrastructure Panel -->
						{#if isExpanded}
							<div class="border-t border-gray-700 p-4 bg-gray-850">
								{#if isLoading}
									<div class="flex items-center gap-2 text-gray-400 text-sm">
										<RefreshCw class="w-4 h-4 animate-spin" />
										<span>Scanning infrastructure...</span>
									</div>
								{:else if repoInfra}
									{@const grouped = groupServicesByCategory(repoInfra.project.services)}
									{@const isDiagramView = showDiagram.has(repoKey)}

									<!-- View Toggle -->
									<div class="flex items-center justify-end mb-4">
										<button
											onclick={() => toggleDiagram(repoKey)}
											class="flex items-center gap-1 px-2 py-1 text-xs rounded {isDiagramView ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} transition-colors"
										>
											<Network class="w-3 h-3" />
											<span>Flow</span>
										</button>
									</div>

									<!-- Flow Diagram View -->
									{#if isDiagramView}
										<div class="mb-4 pb-4 border-b border-gray-700">
											<InfraFlowDiagram
												services={repoInfra.project.services}
												projectName={repoInfra.project.displayName}
												animated={true}
											/>
										</div>
									{/if}

									<!-- Stack Info -->
									{#if repoInfra.project.stack}
										<div class="mb-4 pb-4 border-b border-gray-700">
											<div class="text-xs text-gray-500 uppercase tracking-wider mb-2">
												Tech Stack
											</div>
											<div class="flex flex-wrap gap-2">
												{#if repoInfra.project.stack.framework}
													<span class="px-2 py-1 bg-gray-700 rounded text-xs text-blue-400">
														{repoInfra.project.stack.framework}
													</span>
												{/if}
												{#each repoInfra.project.stack.css || [] as css}
													<span class="px-2 py-1 bg-gray-700 rounded text-xs text-cyan-400">
														{css}
													</span>
												{/each}
												{#if repoInfra.project.stack.buildTool}
													<span class="px-2 py-1 bg-gray-700 rounded text-xs text-yellow-400">
														{repoInfra.project.stack.buildTool}
													</span>
												{/if}
												{#if repoInfra.project.stack.language}
													<span class="px-2 py-1 bg-gray-700 rounded text-xs text-gray-400">
														{repoInfra.project.stack.language}
													</span>
												{/if}
											</div>
										</div>
									{/if}

									<!-- Services by Category -->
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
										{#each [...grouped.entries()] as [category, services]}
											{@const IconComponent = categoryIcons[category] || Server}
											<div class="space-y-2">
												<div class="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
													<IconComponent class="w-3 h-3" />
													<span>{category}</span>
												</div>
												{#each services as service}
													<div
														class="flex items-center gap-2 text-sm {providerColors[
															service.provider
														] || 'text-gray-300'}"
													>
														<span>{service.serviceName}</span>
														{#if service.status === 'healthy'}
															<span class="w-2 h-2 rounded-full bg-green-500"></span>
														{:else if service.status === 'degraded'}
															<span class="w-2 h-2 rounded-full bg-yellow-500"></span>
														{:else if service.status === 'down'}
															<span class="w-2 h-2 rounded-full bg-red-500"></span>
														{/if}
													</div>
												{/each}
											</div>
										{/each}
									</div>

									<!-- DNS Info -->
									{#if repoInfra.discovery.dns}
										<div class="mt-4 pt-4 border-t border-gray-700">
											<div class="text-xs text-gray-500 uppercase tracking-wider mb-2">DNS</div>
											<div class="text-sm text-gray-300">
												<div>Domain: {repoInfra.discovery.dns.domain}</div>
												{#if repoInfra.discovery.dns.dnsProvider}
													<div>Provider: {repoInfra.discovery.dns.dnsProvider}</div>
												{/if}
											</div>
										</div>
									{/if}

									<!-- Errors -->
									{#if repoInfra.discovery.errors.length > 0}
										<div class="mt-4 pt-4 border-t border-gray-700">
											<div class="text-xs text-yellow-500 uppercase tracking-wider mb-2">
												Discovery Notes
											</div>
											{#each repoInfra.discovery.errors as error}
												<div class="text-xs text-gray-500">
													{error.source}: {error.message}
												</div>
											{/each}
										</div>
									{/if}
								{:else}
									<div class="text-gray-500 text-sm">
										No local project found for infrastructure scanning.
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.bg-gray-850 {
		background-color: rgb(30 32 36);
	}
</style>
