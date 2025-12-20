<script lang="ts">
	import type { PageData } from './$types';
	import type { WorkflowStatus, RepoStatus } from '$lib/github';
	import type { InfraService, TechStack } from '$lib/types/infrastructure';
	import { getProjectInfrastructure } from '$lib/config/infrastructure';
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
		ExternalLink
	} from '@lucide/svelte';
	import InfraFlowDiagram from '$lib/components/InfraFlowDiagram.svelte';

	let { data }: { data: PageData } = $props();

	let sortBy = $state<'name' | 'account' | 'recent'>('name');
	let selectedRepo = $state<string | null>(null);

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

	function selectRepo(repoName: string) {
		selectedRepo = selectedRepo === repoName ? null : repoName;
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
	let selectedStatus = $derived(displayStatuses.find((s) => s.repo === selectedRepo));
	let selectedInfra = $derived(selectedRepo ? getInfra(selectedRepo) : null);

	// Auto-select first repo on load
	$effect(() => {
		if (!selectedRepo && displayStatuses.length > 0) {
			selectedRepo = displayStatuses[0].repo;
		}
	});
</script>

<div class="min-h-screen bg-gray-900 text-white flex flex-col">
	<!-- Header -->
	<header class="shrink-0 px-4 py-3 border-b border-gray-800">
		<div>
			<h1 class="text-lg font-semibold text-gray-100">Infrastructure Observatory</h1>
			<p class="text-xs text-gray-500">Last updated: {formatTime(data.lastUpdated)}</p>
		</div>
	</header>

	<!-- Main Content - Responsive Layout -->
	<div class="flex-1 flex flex-col lg:flex-row min-h-0">
		<!-- Left Sidebar - Repo List (hidden on small, shown on lg+) -->
		<aside class="hidden lg:flex lg:flex-col w-[20rem] shrink-0 border-r border-gray-800 bg-gray-900">
			<!-- Sort Options -->
			<div class="shrink-0 px-4 py-2 border-b border-gray-800 flex gap-1">
				<button
					onclick={() => (sortBy = 'name')}
					class="px-2 py-1 text-xs rounded cursor-pointer {sortBy === 'name'
						? 'bg-blue-600'
						: 'bg-gray-700 hover:bg-gray-600'} transition-colors"
				>
					A-Z
				</button>
				<button
					onclick={() => (sortBy = 'account')}
					class="px-2 py-1 text-xs rounded cursor-pointer {sortBy === 'account'
						? 'bg-blue-600'
						: 'bg-gray-700 hover:bg-gray-600'} transition-colors"
				>
					Account
				</button>
				<button
					onclick={() => (sortBy = 'recent')}
					class="px-2 py-1 text-xs rounded cursor-pointer {sortBy === 'recent'
						? 'bg-blue-600'
						: 'bg-gray-700 hover:bg-gray-600'} transition-colors"
				>
					Recent
				</button>
			</div>

			<!-- Repo List -->
			{#if data.statuses.length === 0}
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
							<!-- Status Dot -->
							<div class="w-2.5 h-2.5 rounded-full {statusColors[status.status]} shrink-0"></div>

							<!-- Repo Info -->
							<div class="flex-1 min-w-0">
								<div class="font-medium text-sm truncate {isSelected ? 'text-white' : 'text-gray-300'}">
									{status.repo}
								</div>
								<div class="text-xs text-gray-500 truncate">{status.owner}</div>
							</div>

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

		<!-- Mobile Accordion View (shown on small, hidden on lg+) -->
		<div class="lg:hidden flex-1 overflow-y-auto bg-gray-900">
			{#if data.statuses.length === 0}
				<div class="p-4 text-center text-gray-500">
					<p>No repos configured.</p>
				</div>
			{:else}
				<div class="divide-y divide-gray-800">
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
								<!-- Status Dot -->
								<div class="w-2.5 h-2.5 rounded-full {statusColors[status.status]} shrink-0"></div>

								<!-- Repo Info -->
								<div class="flex-1 min-w-0">
									<div class="font-medium text-sm truncate {isExpanded ? 'text-white' : 'text-gray-300'}">
										{status.repo}
									</div>
									<div class="text-xs text-gray-500 truncate">{status.owner}</div>
								</div>

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
							<div>
								<h2 class="text-xl font-semibold text-white">{selectedInfra.displayName}</h2>
								<p class="text-sm text-gray-400">{selectedStatus.owner}/{selectedStatus.repo}</p>
							</div>
							<a
								href={selectedStatus.html_url}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 transition-colors"
							>
								<GitBranch class="w-4 h-4" />
								<span>Actions</span>
								<ExternalLink class="w-3 h-3" />
							</a>
						</div>
					</div>

					<!-- Flow Diagram -->
					<div class="shrink-0 px-6 py-4 border-b border-gray-700">
						<div class="flex items-center justify-between mb-2">
							<div class="text-xs text-gray-500 uppercase tracking-wider">Infrastructure Flow</div>
							<div class="text-xs text-gray-600">Drag to pan • Scroll to zoom</div>
						</div>
						<div class="bg-gray-900 p-3 pt-8 min-h-[10rem]">
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
