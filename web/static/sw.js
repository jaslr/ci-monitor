const CACHE_NAME = 'orchon-v1';
const DATA_CACHE_NAME = 'orchon-data-v1';

// Static assets to precache
const PRECACHE_URLS = [
	'/',
	'/login',
	'/manifest.json',
	'/favicon.svg',
	'/logo.svg',
	'/icons/icon-192.png',
	'/icons/icon-512.png'
];

// Install: precache shell
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(PRECACHE_URLS))
			.then(() => self.skipWaiting())
	);
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys.filter((key) => key !== CACHE_NAME && key !== DATA_CACHE_NAME).map((key) => caches.delete(key))
				)
			)
			.then(() => self.clients.claim())
	);
});

// Fetch: cache-first for static, stale-while-revalidate for pages
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET and cross-origin
	if (request.method !== 'GET' || url.origin !== location.origin) {
		return;
	}

	// Skip SSE connections
	if (request.headers.get('accept')?.includes('text/event-stream')) {
		return;
	}

	// Static assets: cache-first
	if (url.pathname.match(/\.(js|css|png|svg|ico|woff2?)$/)) {
		event.respondWith(cacheFirst(request, CACHE_NAME));
		return;
	}

	// HTML pages: stale-while-revalidate
	event.respondWith(staleWhileRevalidate(request, DATA_CACHE_NAME));
});

async function cacheFirst(request, cacheName) {
	const cached = await caches.match(request);
	if (cached) return cached;

	try {
		const response = await fetch(request);
		if (response.ok) {
			const cache = await caches.open(cacheName);
			cache.put(request, response.clone());
		}
		return response;
	} catch (err) {
		return new Response('Offline', { status: 503 });
	}
}

async function staleWhileRevalidate(request, cacheName) {
	const cache = await caches.open(cacheName);
	const cached = await cache.match(request);

	// Fetch in background and update cache
	const fetchPromise = fetch(request)
		.then((response) => {
			if (response.ok) {
				cache.put(request, response.clone());
			}
			return response;
		})
		.catch(() => null);

	// Return cached immediately if available, otherwise wait for fetch
	if (cached) {
		fetchPromise.catch(() => {});
		return cached;
	}

	const response = await fetchPromise;
	return response || new Response('Offline', { status: 503 });
}
