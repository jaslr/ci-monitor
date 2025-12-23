<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';

	let { children } = $props();

	// Register service worker for PWA
	$effect(() => {
		if (browser && 'serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/sw.js')
				.then((reg) => console.log('[SW] Registered:', reg.scope))
				.catch((err) => console.error('[SW] Registration failed:', err));
		}
	});
</script>

<svelte:head>
	<title>Orchon</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</svelte:head>

{@render children()}
