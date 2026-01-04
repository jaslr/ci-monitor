<script lang="ts">
	import type { PageData } from './$types';
	import type { DeploymentLogEntry } from './+page.server';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import {
		Cloud,
		CheckCircle,
		XCircle,
		Loader,
		ExternalLink,
		GitBranch,
		Clock,
		Filter,
		X,
		ArrowRight,
		Upload,
		Hammer,
		CloudUpload,
		Github,
		Tag
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	// Local state
	let selectedProject = $state<string | null>(data.projectFilter);
	let recentSelections = $state<string[]>([]);

	// Load recent selections from localStorage
	$effect(() => {
		if (browser) {
			const stored = localStorage.getItem('orchon-recent-project-filters');
			if (stored) {
				try {
					recentSelections = JSON.parse(stored);
				} catch {
					recentSelections = [];
				}
			}
		}
	});

	// Filter deployments by selected project
	let filteredDeployments = $derived(
		selectedProject
			? data.deployments.filter(d => d.projectName === selectedProject)
			: data.deployments
	);

	// Get display name for a project
	function getProjectDisplayName(projectName: string): string {
		const project = data.projects.find(p => p.id === projectName);
		return project?.name || projectName;
	}

	// Handle project selection
	function selectProject(projectName: string | null) {
		selectedProject = projectName;

		// Update URL
		if (browser) {
			const url = new URL(window.location.href);
			if (projectName) {
				url.searchParams.set('project', projectName);
			} else {
				url.searchParams.delete('project');
			}
			goto(url.toString(), { replaceState: true, noScroll: true });

			// Add to recent selections (if not null)
			if (projectName && !recentSelections.includes(projectName)) {
				recentSelections = [projectName, ...recentSelections.filter(p => p !== projectName)].slice(0, 5);
				localStorage.setItem('orchon-recent-project-filters', JSON.stringify(recentSelections));
			}
		}
	}

	// Format relative time
	function formatRelativeTime(isoString: string | null | undefined): string {
		if (!isoString) return 'Unknown';
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

	// Format full timestamp
	function formatFullTime(isoString: string | null | undefined): string {
		if (!isoString) return '';
		return new Date(isoString).toLocaleString();
	}

	// Get status color
	function getStatusColor(status: string): string {
		switch (status) {
			case 'success': return 'text-green-400';
			case 'failure': return 'text-red-400';
			case 'in_progress': return 'text-cyan-400';
			default: return 'text-gray-400';
		}
	}

	// Get status label
	function getStatusLabel(status: string): string {
		switch (status) {
			case 'success': return 'Success';
			case 'failure': return 'Failed';
			case 'in_progress': return 'Deploying';
			case 'queued': return 'Queued';
			default: return 'Unknown';
		}
	}

	// Get deployment pipeline description
	function getPipelineDescription(deployment: DeploymentLogEntry): string {
		const mechanism = deployment.deployMechanism || 'github-actions';
		const target = getTargetName(deployment.provider);

		switch (mechanism) {
			case 'github-actions': return `GitHub → Actions → ${target}`;
			case 'local-wrangler': return `Local → Wrangler → Cloudflare`;
			case 'local-fly': return `Local → Fly CLI → Fly.io`;
			case 'gcp-cloudbuild': return `GitHub → Cloud Build → Cloud Run`;
			default: return `Push → Build → ${target}`;
		}
	}

	function getTargetName(provider: string): string {
		switch (provider?.toLowerCase()) {
			case 'cloudflare': return 'Cloudflare';
			case 'flyio': return 'Fly.io';
			case 'gcp': return 'GCP';
			default: return 'Host';
		}
	}

	// Get GitHub Action link label
	function getCILinkLabel(deployment: DeploymentLogEntry): string {
		switch (deployment.provider?.toLowerCase()) {
			case 'github': return 'GitHub Action';
			case 'cloudflare': return 'CF Build';
			case 'flyio': return 'Fly Deploy';
			case 'gcp': return 'Cloud Build';
			default: return 'CI/CD';
		}
	}

	// Selected deployment for detail view
	let selectedDeployment = $state<DeploymentLogEntry | null>(null);
</script>

<svelte:head>
	<title>Deployments | Orchon</title>
</svelte:head>

<div class="flex-1 flex flex-col h-full overflow-hidden">
	<!-- Header with filters -->
	<div class="shrink-0 px-4 py-4 border-b border-gray-800 bg-gray-900/50">
		<div class="flex flex-col gap-3">
			<div class="flex items-center justify-between">
				<h1 class="text-lg font-semibold text-white">Deployment Log</h1>
				<span class="text-sm text-gray-500">
					{filteredDeployments.length} deployment{filteredDeployments.length !== 1 ? 's' : ''}
				</span>
			</div>

			<!-- Project filter -->
			<div class="flex flex-wrap items-center gap-2">
				<Filter class="w-4 h-4 text-gray-500 shrink-0" />
				<select
					class="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
					value={selectedProject || ''}
					onchange={(e) => selectProject(e.currentTarget.value || null)}
				>
					<option value="">All Projects</option>
					{#each data.projects as project}
						<option value={project.id}>{project.name}</option>
					{/each}
				</select>

				{#if selectedProject}
					<button
						onclick={() => selectProject(null)}
						class="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
					>
						{getProjectDisplayName(selectedProject)}
						<X class="w-3 h-3" />
					</button>
				{/if}
			</div>

			<!-- Recent selections as badges -->
			{#if recentSelections.length > 0 && !selectedProject}
				<div class="flex flex-wrap items-center gap-2">
					<span class="text-xs text-gray-500">Recent:</span>
					{#each recentSelections as projectName}
						<button
							onclick={() => selectProject(projectName)}
							class="px-2 py-0.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded transition-colors"
						>
							{getProjectDisplayName(projectName)}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Deployment list -->
	<div class="flex-1 overflow-y-auto">
		{#if filteredDeployments.length === 0}
			<div class="p-8 text-center text-gray-500">
				<Cloud class="w-12 h-12 mx-auto mb-3 opacity-50" />
				<p class="text-lg">No deployments found</p>
				{#if selectedProject}
					<p class="text-sm mt-1">Try selecting a different project or clear the filter</p>
				{/if}
			</div>
		{:else}
			<div class="divide-y divide-gray-800">
				{#each filteredDeployments as deployment (deployment.id)}
					{@const deployTime = deployment.deployCompletedAt || deployment.completedAt || deployment.startedAt}
					{@const deployStatus = deployment.status}
					<div class="px-4 py-4 hover:bg-gray-800/30 transition-colors">
						<div class="flex items-start gap-4">
							<!-- Status Icon -->
							<div class="shrink-0 mt-0.5">
								{#if deployStatus === 'in_progress'}
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
								<div class="flex items-center gap-2 flex-wrap">
									<button
										onclick={() => selectProject(deployment.projectName)}
										class="font-medium text-white hover:text-blue-400 transition-colors"
									>
										{deployment.projectDisplayName || deployment.projectName}
									</button>
									<span class="text-xs px-1.5 py-0.5 rounded {getStatusColor(deployStatus)} bg-gray-800">
										{getStatusLabel(deployStatus)}
									</span>
									<span class="text-xs text-gray-600 capitalize">{deployment.provider}</span>
								</div>

								<div class="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
									{#if deployment.branch}
										<span class="flex items-center gap-1">
											<GitBranch class="w-3.5 h-3.5" />
											{deployment.branch}
										</span>
									{/if}
									{#if deployment.commitSha}
										<a
											href="https://github.com/jaslr/{deployment.projectName}/commit/{deployment.commitSha}"
											target="_blank"
											rel="noopener noreferrer"
											class="font-mono text-xs hover:text-blue-400 transition-colors"
										>
											{deployment.commitSha.slice(0, 7)}
										</a>
									{/if}
									{#if deployment.runUrl}
										<a
											href={deployment.runUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="flex items-center gap-1 hover:text-blue-400 transition-colors"
										>
											View logs <ExternalLink class="w-3 h-3" />
										</a>
									{/if}
								</div>
							</div>

							<!-- Time -->
							<div class="shrink-0 text-right">
								<div class="flex items-center gap-1.5 text-sm text-gray-400">
									<Clock class="w-3.5 h-3.5" />
									{formatRelativeTime(deployTime)}
								</div>
								<div class="text-xs text-gray-600 mt-0.5">
									{formatFullTime(deployTime)}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
