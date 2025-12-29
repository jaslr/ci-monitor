<script lang="ts">
	import { browser } from '$app/environment';
	import { getProvidersByCategory, getAllProjects, INFRASTRUCTURE } from '$lib/config/infrastructure';
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
		ExternalLink,
		ArrowDownAZ,
		Clock,
		ChevronDown,
		List,
		LayoutGrid
	} from '@lucide/svelte';
	import EcosystemFlowDiagram from '$lib/components/EcosystemFlowDiagram.svelte';

	// Get ecosystem data
	const categories = getProvidersByCategory();
	const projects = getAllProjects();

	// === TAB STATE ===
	type TabId = 'projects' | 'diagram';
	let activeTab = $state<TabId>('projects');

	// Load tab preference from localStorage
	$effect(() => {
		if (!browser) return;
		const savedTab = localStorage.getItem('ecosystem-active-tab');
		if (savedTab === 'projects' || savedTab === 'diagram') {
			activeTab = savedTab;
		}
	});

	function setActiveTab(tab: TabId) {
		activeTab = tab;
		if (browser) {
			localStorage.setItem('ecosystem-active-tab', tab);
		}
	}

	// === SORTING STATE ===
	let sortBy = $state<'name' | 'recent'>('name');
	let sortDropdownOpen = $state(false);

	// Close dropdown when clicking outside
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

	// Load sort preference
	$effect(() => {
		if (!browser) return;
		const savedSort = localStorage.getItem('ecosystem-sort');
		if (savedSort === 'name' || savedSort === 'recent') {
			sortBy = savedSort;
		}
	});

	// === OWNER FILTER STATE ===
	type OwnerFilter = 'jaslr' | 'vp' | 'junipa';
	let ownerFilters = $state<Record<OwnerFilter, boolean>>({
		jaslr: true,
		vp: true,
		junipa: true
	});

	// Load filters from localStorage
	$effect(() => {
		if (!browser) return;
		const saved = localStorage.getItem('ecosystem-owner-filters');
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
			localStorage.setItem('ecosystem-owner-filters', JSON.stringify(ownerFilters));
		}
	}

	// === DISPLAY MODE STATE ===
	let displayMode = $state<'compact' | 'detailed'>('compact');

	// Load display mode preference
	$effect(() => {
		if (!browser) return;
		const saved = localStorage.getItem('ecosystem-display-mode');
		if (saved === 'compact' || saved === 'detailed') {
			displayMode = saved;
		}
	});

	function toggleDisplayMode() {
		displayMode = displayMode === 'compact' ? 'detailed' : 'compact';
		if (browser) {
			localStorage.setItem('ecosystem-display-mode', displayMode);
		}
	}

	// === DIAGRAM FILTER STATE (for existing diagram tab) ===
	let selectedProvider = $state<string | null>(null);

	function selectProvider(provider: string) {
		selectedProvider = selectedProvider === provider ? null : provider;
	}

	function clearSelection() {
		selectedProvider = null;
	}

	// === CATEGORY ORDER FOR ICON CHIPS ===
	const categoryOrder = ['hosting', 'database', 'auth', 'storage', 'monitoring', 'ci', 'dns', 'email', 'analytics', 'cdn', 'secrets'];

	// === PROJECT-TO-SERVICES MAPPING ===
	interface ProjectWithServices {
		id: string;
		displayName: string;
		identity: string;
		services: Array<{
			category: string;
			provider: string;
			serviceName: string;
		}>;
	}

	let projectsWithServices = $derived.by(() => {
		const result: ProjectWithServices[] = [];

		for (const project of projects) {
			const infraConfig = INFRASTRUCTURE[project.id];
			if (!infraConfig) continue;

			// Sort services by category order
			const sortedServices = [...infraConfig.services].sort((a, b) => {
				const aIndex = categoryOrder.indexOf(a.category);
				const bIndex = categoryOrder.indexOf(b.category);
				return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
			});

			result.push({
				id: project.id,
				displayName: infraConfig.displayName,
				identity: infraConfig.identity,
				services: sortedServices.map((s) => ({
					category: s.category,
					provider: s.provider,
					serviceName: s.serviceName
				}))
			});
		}

		return result;
	});

	// Apply owner filtering
	function filterByOwner(projectList: ProjectWithServices[]): ProjectWithServices[] {
		return projectList.filter((project) => {
			const isJaslr = project.identity === 'jaslr';
			const isVP = project.identity === 'jvp-ux';
			const isJunipa =
				project.id.toLowerCase().includes('junipa') ||
				project.displayName.toLowerCase().includes('junipa');

			if (ownerFilters.junipa && isJunipa) return true;
			if (isJaslr && ownerFilters.jaslr && !isJunipa) return true;
			if (isVP && ownerFilters.vp && !isJunipa) return true;
			return false;
		});
	}

	// Final display list with filtering and sorting
	let displayProjects = $derived.by(() => {
		const filtered = filterByOwner(projectsWithServices);
		const sorted = [...filtered];

		if (sortBy === 'name') {
			sorted.sort((a, b) => a.displayName.localeCompare(b.displayName));
		}
		// Note: 'recent' sorting would require deployment data - for now, default to name

		return sorted;
	});

	// === CATEGORY ICONS ===
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

	// Provider display names
	const providerNames: Record<string, string> = {
		cloudflare: 'Cloudflare',
		flyio: 'Fly.io',
		supabase: 'Supabase',
		github: 'GitHub',
		sentry: 'Sentry',
		aws: 'AWS',
		vercel: 'Vercel',
		netlify: 'Netlify',
		google: 'Google',
		gcp: 'GCP',
		pocketbase: 'PocketBase'
	};

	// Provider colors for fallback
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
		netlify: 'text-teal-400',
		pocketbase: 'text-gray-300'
	};

	function getProviderName(provider: string): string {
		return providerNames[provider] || provider;
	}

	// Provider fallback icons (when logo not available)
	const providerFallbackIcons: Record<string, typeof Cloud> = {
		cloudflare: Cloud,
		flyio: Cloud,
		supabase: Database,
		github: GitBranch,
		sentry: AlertTriangle,
		firebase: Database,
		gcp: Cloud,
		aws: Cloud,
		pocketbase: Database,
		vercel: Cloud,
		netlify: Cloud
	};
</script>

<svelte:head>
	<title>Ecosystem | Orchon</title>
</svelte:head>

<!-- Ecosystem page content -->
<div class="flex-1 flex flex-col overflow-hidden">
	<!-- Tab Bar + Controls -->
	<div class="shrink-0 border-b border-gray-800 bg-gray-900 px-4 sm:px-6 py-3">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
			<!-- Tabs -->
			<div class="flex gap-1">
				<button
					onclick={() => setActiveTab('projects')}
					class="px-4 py-2 text-sm font-medium transition-colors cursor-pointer rounded-t {activeTab ===
					'projects'
						? 'text-white bg-gray-800 border-b-2 border-blue-500'
						: 'text-gray-400 hover:text-gray-200'}"
				>
					Projects
				</button>
				<button
					onclick={() => setActiveTab('diagram')}
					class="px-4 py-2 text-sm font-medium transition-colors cursor-pointer rounded-t {activeTab ===
					'diagram'
						? 'text-white bg-gray-800 border-b-2 border-blue-500'
						: 'text-gray-400 hover:text-gray-200'}"
				>
					Flow Diagram
				</button>
			</div>

			<!-- Controls (visible on Projects tab) -->
			{#if activeTab === 'projects'}
				<div class="flex items-center gap-3 sm:gap-4">
					<!-- Display Mode Toggle -->
					<button
						onclick={toggleDisplayMode}
						class="p-2 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer rounded hover:bg-gray-800"
						title={displayMode === 'compact' ? 'Show service names' : 'Hide service names'}
					>
						{#if displayMode === 'compact'}
							<List class="w-4 h-4" />
						{:else}
							<LayoutGrid class="w-4 h-4" />
						{/if}
					</button>

					<!-- Sort Dropdown -->
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
							<div
								class="absolute top-full right-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-10 min-w-[100px]"
							>
								<button
									onclick={() => {
										sortBy = 'name';
										sortDropdownOpen = false;
										if (browser) localStorage.setItem('ecosystem-sort', 'name');
									}}
									class="w-full flex items-center gap-2 px-3 py-2 text-xs text-left cursor-pointer hover:bg-gray-700 transition-colors {sortBy ===
									'name'
										? 'text-white'
										: 'text-gray-400'}"
								>
									<ArrowDownAZ class="w-4 h-4" />
									<span>A-Z</span>
								</button>
								<button
									onclick={() => {
										sortBy = 'recent';
										sortDropdownOpen = false;
										if (browser) localStorage.setItem('ecosystem-sort', 'recent');
									}}
									class="w-full flex items-center gap-2 px-3 py-2 text-xs text-left cursor-pointer hover:bg-gray-700 transition-colors {sortBy ===
									'recent'
										? 'text-white'
										: 'text-gray-400'}"
								>
									<Clock class="w-4 h-4" />
									<span>Recent</span>
								</button>
							</div>
						{/if}
					</div>

					<!-- Owner Filter Buttons -->
					<div class="flex gap-1 sm:gap-2">
						<button
							onclick={() => toggleFilter('jaslr')}
							class="px-2 py-1 text-xs cursor-pointer transition-colors rounded {ownerFilters.jaslr
								? 'text-gray-200 bg-gray-800'
								: 'text-gray-500 hover:text-gray-400'}"
							title="Show jaslr projects"
						>
							jaslr
						</button>
						<button
							onclick={() => toggleFilter('vp')}
							class="px-2 py-1 text-xs cursor-pointer transition-colors rounded {ownerFilters.vp
								? 'text-gray-200 bg-gray-800'
								: 'text-gray-500 hover:text-gray-400'}"
							title="Show Vast Puddle projects"
						>
							VP
						</button>
						<button
							onclick={() => toggleFilter('junipa')}
							class="px-2 py-1 text-xs cursor-pointer transition-colors rounded {ownerFilters.junipa
								? 'text-gray-200 bg-gray-800'
								: 'text-gray-500 hover:text-gray-400'}"
							title="Show Junipa projects only"
						>
							Junipa
						</button>
					</div>
				</div>
			{:else if selectedProvider}
				<button
					onclick={clearSelection}
					class="text-xs text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
				>
					Clear filter
				</button>
			{/if}
		</div>
	</div>

	<!-- Tab Content -->
	{#if activeTab === 'projects'}
		<!-- Projects List View -->
		<div class="flex-1 overflow-y-auto p-4 sm:p-6">
			{#if displayProjects.length === 0}
				<div class="text-center text-gray-500 py-8">
					<p>No projects match the current filters.</p>
				</div>
			{:else}
				<div class="space-y-2">
					{#each displayProjects as project (project.id)}
						<div
							class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors"
						>
							<!-- Project Name -->
							<a
								href="/projects?project={project.id}"
								class="font-medium text-gray-200 hover:text-white sm:min-w-[160px] truncate shrink-0"
							>
								{project.displayName}
							</a>

							<!-- Provider Icon Chips -->
							<div class="flex flex-wrap gap-1.5 sm:gap-2 flex-1">
								{#each project.services as service, i (service.provider + '-' + service.category + '-' + i)}
									{@const logoUrl = `/api/logos/infra/${service.provider}.svg`}
									{@const FallbackIcon = providerFallbackIcons[service.provider] || Server}
									{@const fallbackColor = providerColors[service.provider] || 'text-gray-400'}
									<div
										class="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-700 rounded text-xs {displayMode ===
										'compact'
											? 'px-1.5'
											: ''}"
										title={service.serviceName}
									>
										<img
											src={logoUrl}
											alt={service.provider}
											class="w-4 h-4 object-contain"
											onerror={(e) => {
												const img = e.target as HTMLImageElement;
												img.style.display = 'none';
												const fallback = img.nextElementSibling as HTMLElement;
												if (fallback) fallback.classList.remove('hidden');
											}}
										/>
										<span class="hidden {fallbackColor}">
											<FallbackIcon class="w-4 h-4" />
										</span>
										{#if displayMode === 'detailed'}
											<span class="text-gray-300">{service.serviceName}</span>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<!-- Flow Diagram View (existing) -->
		<div class="shrink-0 border-b border-gray-800 bg-gray-850">
			<div class="px-6 py-4">
				<div class="flex items-center justify-between mb-3">
					<div class="text-xs text-gray-500 uppercase tracking-wider">Ecosystem Flow</div>
				</div>
				<div class="bg-gray-900 rounded-lg p-4 min-h-[300px]">
					<EcosystemFlowDiagram
						{projects}
						{categories}
						{selectedProvider}
						onProviderClick={selectProvider}
					/>
				</div>
			</div>
		</div>

		<!-- Provider Breakdown Section -->
		<div class="flex-1 overflow-y-auto p-6">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each categories as category (category.category)}
					{@const IconComponent = categoryIcons[category.category] || Server}
					<div class="bg-gray-800 rounded-lg p-4">
						<div
							class="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-4"
						>
							<IconComponent class="w-4 h-4" />
							<span>{category.category}</span>
						</div>

						<div class="space-y-4">
							{#each category.providers as provider (provider.provider)}
								{@const isSelected = selectedProvider === provider.provider}
								{@const isFiltered = selectedProvider && !isSelected}
								<div class="transition-opacity {isFiltered ? 'opacity-30' : ''}">
									<button
										onclick={() => selectProvider(provider.provider)}
										class="w-full text-left group cursor-pointer"
									>
										<div class="flex items-center justify-between mb-1">
											<span
												class="font-medium {providerColors[provider.provider] ||
													'text-gray-300'} {isSelected ? 'underline' : 'group-hover:underline'}"
											>
												{getProviderName(provider.provider)}
											</span>
											<span class="text-xs text-gray-500">
												{provider.projects.length} project{provider.projects.length !== 1
													? 's'
													: ''}
											</span>
										</div>
									</button>
									<div class="flex flex-wrap gap-1.5 mt-2">
										{#each provider.projects as project (project.id)}
											<a
												href="/projects?project={project.id}"
												class="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-gray-300 hover:text-white"
											>
												{project.displayName}
											</a>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.bg-gray-850 {
		background-color: rgb(30 32 36);
	}

	.bg-gray-750 {
		background-color: rgb(42 44 50);
	}
</style>
