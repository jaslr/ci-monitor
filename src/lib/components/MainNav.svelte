<script lang="ts">
	import { page } from '$app/state';
	import { Activity, Layers, Network } from '@lucide/svelte';

	// Determine active route
	let currentPath = $derived(page.url.pathname);
</script>

<nav class="flex flex-col gap-1 py-2">
	<a
		href="/"
		class="flex items-center gap-3 px-4 py-2.5 text-left transition-colors {currentPath === '/'
			? 'bg-gray-800 border-l-2 border-blue-500'
			: 'hover:bg-gray-800/50 border-l-2 border-transparent'}"
	>
		<Activity class="w-4 h-4 {currentPath === '/' ? 'text-blue-400' : 'text-gray-500'} shrink-0" />
		<div class="flex-1 min-w-0">
			<div class="font-medium text-sm {currentPath === '/' ? 'text-white' : 'text-gray-300'} truncate">Console</div>
		</div>
	</a>

	<a
		href="/projects"
		class="flex items-center gap-3 px-4 py-2.5 text-left transition-colors {currentPath === '/projects' || currentPath.startsWith('/projects')
			? 'bg-gray-800 border-l-2 border-blue-500'
			: 'hover:bg-gray-800/50 border-l-2 border-transparent'}"
	>
		<Layers class="w-4 h-4 {currentPath === '/projects' || currentPath.startsWith('/projects') ? 'text-blue-400' : 'text-gray-500'} shrink-0" />
		<div class="flex-1 min-w-0">
			<div class="font-medium text-sm {currentPath === '/projects' || currentPath.startsWith('/projects') ? 'text-white' : 'text-gray-300'} truncate">Projects</div>
		</div>
	</a>

	<a
		href="/ecosystem"
		class="flex items-center gap-3 px-4 py-2.5 text-left transition-colors {currentPath === '/ecosystem'
			? 'bg-gray-800 border-l-2 border-blue-500'
			: 'hover:bg-gray-800/50 border-l-2 border-transparent'}"
	>
		<Network class="w-4 h-4 {currentPath === '/ecosystem' ? 'text-blue-400' : 'text-gray-500'} shrink-0" />
		<div class="flex-1 min-w-0">
			<div class="font-medium text-sm {currentPath === '/ecosystem' ? 'text-white' : 'text-gray-300'} truncate">Ecosystem</div>
		</div>
	</a>
</nav>
