<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { Radio, Settings } from '@lucide/svelte';
	import MainNav from '$lib/components/MainNav.svelte';

	let { children, data } = $props();

	// SSE connection status (shared across pages)
	let sseConnected = $state(false);
	let showConnectionDetails = $state(false);

	// Register service worker for PWA
	$effect(() => {
		if (browser && 'serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/sw.js')
				.then((reg) => console.log('[SW] Registered:', reg.scope))
				.catch((err) => console.error('[SW] Registration failed:', err));
		}
	});

	function formatTime(isoString: string): string {
		return new Date(isoString).toLocaleTimeString();
	}

	// Close connection details when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as Element;
		if (showConnectionDetails && !target.closest('.connection-status')) {
			showConnectionDetails = false;
		}
	}

	$effect(() => {
		if (!browser) return;
		if (showConnectionDetails) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	// Check if we're on admin routes (they have their own layout)
	let isAdminRoute = $derived(page.url.pathname.startsWith('/admin'));
	let isLoginRoute = $derived(page.url.pathname === '/login');
</script>

<svelte:head>
	<title>Orchon</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</svelte:head>

{#if isAdminRoute || isLoginRoute}
	<!-- Admin and login pages use their own layout -->
	{@render children()}
{:else}
	<!-- Main app layout with shared header and nav -->
	<div class="min-h-screen bg-gray-900 text-white flex flex-col">
		<!-- Header -->
		<header class="shrink-0 px-4 py-3 border-b border-gray-800">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<a href="/" class="flex items-center gap-3">
						<img src="/logo.svg" alt="Orchon logo" class="w-8 h-8 text-gray-200" />
						<div>
							<h1 class="text-lg font-semibold text-gray-100" style="font-family: 'Roboto', sans-serif;">Orchon</h1>
							<p class="text-xs text-gray-500">Infrastructure Observatory</p>
						</div>
					</a>
				</div>
				<!-- Right side: SSE status + Settings -->
				<div class="flex items-center gap-4">
					<!-- SSE Connection Status (clickable) -->
					<div class="relative connection-status">
						<button
							onclick={() => showConnectionDetails = !showConnectionDetails}
							class="flex items-center gap-2 text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors cursor-pointer"
						>
							<Radio class="w-3 h-3 {sseConnected ? 'text-green-400' : 'text-gray-500'}" />
							<span class="{sseConnected ? 'text-green-400' : 'text-gray-500'}">
								{sseConnected ? 'Live' : 'Offline'}
							</span>
						</button>
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

		<!-- Main Content -->
		<div class="flex-1 flex flex-col lg:flex-row min-h-0">
			<!-- Left Sidebar - Navigation (hidden on small, shown on lg+) -->
			<aside class="hidden lg:flex lg:flex-col w-[12rem] shrink-0 border-r border-gray-800 bg-gray-900">
				<MainNav />
			</aside>

			<!-- Mobile Navigation (shown on small, hidden on lg+) -->
			<div class="lg:hidden border-b border-gray-800 bg-gray-900">
				<div class="flex">
					<a
						href="/"
						class="flex-1 py-2 text-center text-sm {page.url.pathname === '/' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}"
					>Console</a>
					<a
						href="/projects"
						class="flex-1 py-2 text-center text-sm {page.url.pathname.startsWith('/projects') ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}"
					>Projects</a>
					<a
						href="/deployments"
						class="flex-1 py-2 text-center text-sm {page.url.pathname.startsWith('/deployments') ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}"
					>Deploys</a>
					<a
						href="/ecosystem"
						class="flex-1 py-2 text-center text-sm {page.url.pathname === '/ecosystem' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}"
					>Ecosystem</a>
				</div>
			</div>

			<!-- Page Content -->
			<main class="flex-1 flex flex-col overflow-hidden min-w-0">
				{@render children()}
			</main>
		</div>
	</div>
{/if}
