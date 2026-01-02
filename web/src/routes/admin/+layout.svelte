<script lang="ts">
	import { page } from '$app/state';
	import {
		ArrowLeft,
		Image,
		FolderGit2,
		Settings,
		LogOut
	} from '@lucide/svelte';

	let { children } = $props();

	const navItems = [
		{ href: '/admin/media', label: 'Media', icon: Image, description: 'Upload & manage logos' },
		{ href: '/admin/projects', label: 'Projects', icon: FolderGit2, description: 'Repos & groups' },
		{ href: '/admin/repos', label: 'Config', icon: Settings, description: 'Tech stack detection' }
	];

	function isActive(href: string): boolean {
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}
</script>

<div class="min-h-screen bg-gray-900 text-white flex flex-col">
	<!-- Header -->
	<header class="shrink-0 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a
				href="/"
				class="p-2 -m-2 text-gray-400 hover:text-gray-200 transition-colors"
				title="Back to Dashboard"
			>
				<ArrowLeft class="w-5 h-5" />
			</a>
			<div>
				<h1 class="text-lg font-semibold text-gray-100">Admin</h1>
				<p class="text-xs text-gray-500">Manage projects, media, and settings</p>
			</div>
		</div>
		<form method="POST" action="/logout">
			<button
				type="submit"
				class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors"
			>
				<LogOut class="w-4 h-4" />
				<span>Logout</span>
			</button>
		</form>
	</header>

	<!-- Body with sidebar -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Left Navigation -->
		<nav class="w-56 shrink-0 border-r border-gray-800 bg-gray-900/50 overflow-y-auto">
			<div class="p-4 space-y-1">
				{#each navItems as item}
					{@const Icon = item.icon}
					<a
						href={item.href}
						class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors {isActive(item.href)
							? 'bg-blue-600 text-white'
							: 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
					>
						<Icon class="w-5 h-5 shrink-0" />
						<div class="min-w-0">
							<div class="font-medium truncate">{item.label}</div>
							<div class="text-xs opacity-70 truncate">{item.description}</div>
						</div>
					</a>
				{/each}
			</div>
		</nav>

		<!-- Main Content -->
		<main class="flex-1 overflow-y-auto">
			{@render children()}
		</main>
	</div>
</div>
