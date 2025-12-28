<script lang="ts">
	import { getProvidersByCategory, getAllProjects } from '$lib/config/infrastructure';
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
		ExternalLink
	} from '@lucide/svelte';
	import EcosystemFlowDiagram from '$lib/components/EcosystemFlowDiagram.svelte';

	// Get ecosystem data
	const categories = getProvidersByCategory();
	const projects = getAllProjects();

	// Filter state - selected provider
	let selectedProvider = $state<string | null>(null);

	// Category icons
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
		gcp: 'GCP'
	};

	// Provider colors
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

	function getProviderName(provider: string): string {
		return providerNames[provider] || provider;
	}

	function selectProvider(provider: string) {
		selectedProvider = selectedProvider === provider ? null : provider;
	}

	function clearSelection() {
		selectedProvider = null;
	}
</script>

<svelte:head>
	<title>Ecosystem | Orchon</title>
</svelte:head>

<!-- Ecosystem page content -->
<div class="flex-1 flex flex-col overflow-hidden">
	<!-- Flow Diagram Section -->
	<div class="shrink-0 border-b border-gray-800 bg-gray-850">
		<div class="px-6 py-4">
			<div class="flex items-center justify-between mb-3">
				<div class="text-xs text-gray-500 uppercase tracking-wider">Ecosystem Flow</div>
				{#if selectedProvider}
					<button
						onclick={clearSelection}
						class="text-xs text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
					>
						Clear filter
					</button>
				{/if}
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
			{#each categories as category}
				{@const IconComponent = categoryIcons[category.category] || Server}
				<div class="bg-gray-800 rounded-lg p-4">
					<div class="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-4">
						<IconComponent class="w-4 h-4" />
						<span>{category.category}</span>
					</div>

					<div class="space-y-4">
						{#each category.providers as provider}
							{@const isSelected = selectedProvider === provider.provider}
							{@const isFiltered = selectedProvider && !isSelected}
							<div
								class="transition-opacity {isFiltered ? 'opacity-30' : ''}"
							>
								<button
									onclick={() => selectProvider(provider.provider)}
									class="w-full text-left group cursor-pointer"
								>
									<div class="flex items-center justify-between mb-1">
										<span class="font-medium {providerColors[provider.provider] || 'text-gray-300'} {isSelected ? 'underline' : 'group-hover:underline'}">
											{getProviderName(provider.provider)}
										</span>
										<span class="text-xs text-gray-500">
											{provider.projects.length} project{provider.projects.length !== 1 ? 's' : ''}
										</span>
									</div>
								</button>
								<div class="flex flex-wrap gap-1.5 mt-2">
									{#each provider.projects as project}
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
</div>

<style>
	.bg-gray-850 {
		background-color: rgb(30 32 36);
	}
</style>
