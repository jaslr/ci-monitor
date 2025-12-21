<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import {
		Upload,
		Trash2,
		Image,
		Layers,
		Code,
		Server,
		Check,
		X
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let selectedFile = $state<File | null>(null);
	let isUploading = $state(false);
	let selectedItem = $state<{ type: 'infra' | 'techstack'; name: string; displayName: string } | null>(null);

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			selectedFile = input.files[0];
		}
	}

	function selectItem(type: 'infra' | 'techstack', name: string, displayName: string) {
		selectedItem = { type, name, displayName };
		selectedFile = null;
	}

	function clearSelection() {
		selectedItem = null;
		selectedFile = null;
	}

	// Infrastructure providers with their services
	const infrastructureProviders = [
		{
			name: 'cloudflare',
			displayName: 'Cloudflare',
			services: ['Pages', 'R2 Storage', 'DNS', 'CDN', 'Workers']
		},
		{
			name: 'flyio',
			displayName: 'Fly.io',
			services: ['Hosting', 'Postgres']
		},
		{
			name: 'vercel',
			displayName: 'Vercel',
			services: ['Hosting', 'Postgres', 'Blob Storage']
		},
		{
			name: 'netlify',
			displayName: 'Netlify',
			services: ['Hosting', 'Functions']
		},
		{
			name: 'supabase',
			displayName: 'Supabase',
			services: ['Database', 'Auth', 'Storage', 'Realtime', 'Edge Functions']
		},
		{
			name: 'planetscale',
			displayName: 'PlanetScale',
			services: ['Database']
		},
		{
			name: 'neon',
			displayName: 'Neon',
			services: ['Postgres']
		},
		{
			name: 'aws',
			displayName: 'AWS',
			services: ['S3', 'Route53', 'Lambda', 'CloudFront']
		},
		{
			name: 'github',
			displayName: 'GitHub',
			services: ['Actions', 'Pages']
		},
		{
			name: 'auth0',
			displayName: 'Auth0',
			services: ['Authentication']
		},
		{
			name: 'clerk',
			displayName: 'Clerk',
			services: ['Authentication']
		},
		{
			name: 'sentry',
			displayName: 'Sentry',
			services: ['Error Tracking']
		},
		{
			name: 'logrocket',
			displayName: 'LogRocket',
			services: ['Session Replay']
		},
		{
			name: 'resend',
			displayName: 'Resend',
			services: ['Email']
		},
		{
			name: 'sendgrid',
			displayName: 'SendGrid',
			services: ['Email']
		},
		{
			name: 'postmark',
			displayName: 'Postmark',
			services: ['Email']
		},
		{
			name: 'plausible',
			displayName: 'Plausible',
			services: ['Analytics']
		},
		{
			name: 'posthog',
			displayName: 'PostHog',
			services: ['Analytics']
		},
		{
			name: 'doppler',
			displayName: 'Doppler',
			services: ['Secrets Management']
		}
	];

	// Tech stack items by category
	const techStackCategories = [
		{
			category: 'Frameworks',
			items: [
				{ name: 'sveltekit', display: 'SvelteKit' },
				{ name: 'svelte', display: 'Svelte' },
				{ name: 'nextjs', display: 'Next.js' },
				{ name: 'react', display: 'React' },
				{ name: 'angular', display: 'Angular' },
				{ name: 'nuxt', display: 'Nuxt' },
				{ name: 'vue', display: 'Vue' },
				{ name: 'astro', display: 'Astro' },
				{ name: 'nodejs', display: 'Node.js' },
				{ name: 'express', display: 'Express' }
			]
		},
		{
			category: 'CSS & Styling',
			items: [
				{ name: 'tailwind', display: 'Tailwind CSS' },
				{ name: 'skeleton', display: 'Skeleton UI' },
				{ name: 'daisyui', display: 'DaisyUI' },
				{ name: 'bootstrap', display: 'Bootstrap' },
				{ name: 'bulma', display: 'Bulma' },
				{ name: 'angular-material', display: 'Angular Material' },
				{ name: 'styled-components', display: 'Styled Components' },
				{ name: 'sass', display: 'Sass/SCSS' }
			]
		},
		{
			category: 'Testing',
			items: [
				{ name: 'playwright', display: 'Playwright' },
				{ name: 'cypress', display: 'Cypress' },
				{ name: 'vitest', display: 'Vitest' },
				{ name: 'jest', display: 'Jest' },
				{ name: 'mocha', display: 'Mocha' }
			]
		},
		{
			category: 'Build Tools',
			items: [
				{ name: 'vite', display: 'Vite' },
				{ name: 'webpack', display: 'Webpack' },
				{ name: 'esbuild', display: 'esbuild' },
				{ name: 'rollup', display: 'Rollup' },
				{ name: 'turbopack', display: 'Turbopack' }
			]
		},
		{
			category: 'Package Managers',
			items: [
				{ name: 'npm', display: 'npm' },
				{ name: 'pnpm', display: 'pnpm' },
				{ name: 'yarn', display: 'Yarn' },
				{ name: 'bun', display: 'Bun' }
			]
		},
		{
			category: 'Icons',
			items: [
				{ name: 'lucide', display: 'Lucide' },
				{ name: 'heroicons', display: 'Heroicons' },
				{ name: 'fontawesome', display: 'Font Awesome' },
				{ name: 'tabler', display: 'Tabler Icons' }
			]
		},
		{
			category: 'Languages',
			items: [
				{ name: 'typescript', display: 'TypeScript' },
				{ name: 'javascript', display: 'JavaScript' },
				{ name: 'python', display: 'Python' },
				{ name: 'go', display: 'Go' },
				{ name: 'rust', display: 'Rust' }
			]
		}
	];

	// Get existing logo names for highlighting uploaded items
	const existingLogoNames = $derived(new Set(data.logos?.map((l) => l.name.replace(/\.(svg|png)$/, '')) ?? []));

	// Get logo URL for a provider/item
	function getLogoUrl(name: string): string | null {
		const logo = data.logos?.find((l) => l.name.replace(/\.(svg|png)$/, '') === name);
		return logo?.url ?? null;
	}
</script>

<div class="p-6 space-y-8">
	<div>
		<h2 class="text-xl font-semibold text-white">Media Library</h2>
		<p class="text-gray-400 text-sm mt-1">Upload and manage logos for services and tech stack</p>
	</div>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<div class="p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-center gap-3">
			<Check class="w-5 h-5 text-green-400" />
			<span class="text-green-300">{form.message}</span>
		</div>
	{/if}
	{#if form?.error}
		<div class="p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-3">
			<X class="w-5 h-5 text-red-400" />
			<span class="text-red-300">{form.error}</span>
		</div>
	{/if}

	<!-- Upload Modal/Section -->
	{#if selectedItem}
		<section class="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
			<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
				<Upload class="w-5 h-5 text-blue-400" />
				Upload Logo: {selectedItem.displayName}
			</h3>
			<p class="text-gray-400 text-sm mb-4">
				Uploading to: <code class="bg-gray-700 px-2 py-1 rounded">{selectedItem.type}/{selectedItem.name}.svg</code>
			</p>

			<form
				method="POST"
				action="?/uploadLogo"
				enctype="multipart/form-data"
				use:enhance={() => {
					isUploading = true;
					return async ({ update }) => {
						await update();
						isUploading = false;
						selectedFile = null;
						selectedItem = null;
					};
				}}
			>
				<input type="hidden" name="type" value={selectedItem.type} />
				<input type="hidden" name="filename" value={selectedItem.name} />

				<div
					class="border-2 border-dashed border-blue-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors bg-gray-800/50"
				>
					<input
						type="file"
						name="logo"
						accept=".svg,.png"
						onchange={handleFileSelect}
						class="hidden"
						id="logo-upload"
					/>
					<label for="logo-upload" class="cursor-pointer">
						<Upload class="w-12 h-12 mx-auto text-blue-500 mb-4" />
						{#if selectedFile}
							<p class="text-white font-medium">{selectedFile.name}</p>
							<p class="text-gray-500 text-sm mt-1">Click to change or drop a new file</p>
						{:else}
							<p class="text-gray-300">Click to upload or drag and drop</p>
							<p class="text-gray-500 text-sm mt-1">SVG or PNG (max 1MB)</p>
						{/if}
					</label>
				</div>

				<div class="mt-4 flex justify-between">
					<button
						type="button"
						onclick={clearSelection}
						class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
					>
						Cancel
					</button>
					{#if selectedFile}
						<button
							type="submit"
							disabled={isUploading}
							class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg transition-colors"
						>
							<Upload class="w-4 h-4" />
							{isUploading ? 'Uploading...' : 'Upload Logo'}
						</button>
					{/if}
				</div>
			</form>
		</section>
	{/if}

	<!-- Infrastructure Section -->
	<section class="bg-gray-800 rounded-lg p-6">
		<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
			<Server class="w-5 h-5 text-blue-400" />
			Infrastructure
		</h3>

		<div class="space-y-3">
			{#each infrastructureProviders as provider}
				{@const hasLogo = existingLogoNames.has(provider.name)}
				{@const logoUrl = getLogoUrl(provider.name)}
				<div class="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
					<!-- Logo display area -->
					<div class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden">
						{#if logoUrl}
							<img src={logoUrl} alt={provider.displayName} class="max-w-full max-h-full object-contain" />
						{:else}
							<div class="w-6 h-6 bg-gray-600 rounded"></div>
						{/if}
					</div>

					<!-- Provider name and services -->
					<div class="flex-1 min-w-0">
						<div class="font-medium text-white">{provider.displayName}</div>
						<div class="text-xs text-gray-400 truncate">
							{provider.services.join(' · ')}
						</div>
					</div>

					<!-- Upload button -->
					<button
						type="button"
						onclick={() => selectItem('infra', provider.name, provider.displayName)}
						class="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors {hasLogo
							? 'bg-green-900/50 text-green-300 hover:bg-green-800/50'
							: 'bg-gray-600 text-gray-300 hover:bg-gray-500'}"
					>
						{#if hasLogo}
							<Check class="w-4 h-4" />
							Replace
						{:else}
							<Upload class="w-4 h-4" />
							Add
						{/if}
					</button>
				</div>
			{/each}
		</div>
	</section>

	<!-- Tech Stack Section -->
	<section class="bg-gray-800 rounded-lg p-6">
		<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
			<Code class="w-5 h-5 text-purple-400" />
			Tech Stack
		</h3>

		<div class="space-y-6">
			{#each techStackCategories as category}
				<div>
					<h4 class="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">{category.category}</h4>
					<div class="space-y-2">
						{#each category.items as item}
							{@const hasLogo = existingLogoNames.has(item.name)}
							{@const logoUrl = getLogoUrl(item.name)}
							<div class="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
								<!-- Logo display area -->
								<div class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden">
									{#if logoUrl}
										<img src={logoUrl} alt={item.display} class="max-w-full max-h-full object-contain" />
									{:else}
										<div class="w-6 h-6 bg-gray-600 rounded"></div>
									{/if}
								</div>

								<!-- Item name -->
								<div class="flex-1 min-w-0">
									<div class="font-medium text-white">{item.display}</div>
								</div>

								<!-- Upload button -->
								<button
									type="button"
									onclick={() => selectItem('techstack', item.name, item.display)}
									class="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors {hasLogo
										? 'bg-green-900/50 text-green-300 hover:bg-green-800/50'
										: 'bg-gray-600 text-gray-300 hover:bg-gray-500'}"
								>
									{#if hasLogo}
										<Check class="w-4 h-4" />
										Replace
									{:else}
										<Upload class="w-4 h-4" />
										Add
									{/if}
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Existing Logos Section (for reference/deletion) -->
	<section class="bg-gray-800 rounded-lg p-6">
		<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
			<Layers class="w-5 h-5 text-purple-400" />
			All Uploaded Logos ({data.logos?.length ?? 0})
		</h3>

		{#if data.logos && data.logos.length > 0}
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{#each data.logos as logo}
					<div class="bg-gray-700 rounded-lg p-4 flex flex-col items-center gap-2 group relative">
						<div class="w-12 h-12 flex items-center justify-center">
							<img src={logo.url} alt={logo.name} class="max-w-full max-h-full object-contain" />
						</div>
						<span class="text-xs text-gray-300 truncate max-w-full">{logo.name}</span>
						<span
							class="text-xs px-2 py-0.5 rounded {logo.type === 'infra'
								? 'bg-blue-900 text-blue-300'
								: 'bg-purple-900 text-purple-300'}"
						>
							{logo.type === 'infra' ? 'Infra' : 'Stack'}
						</span>
						<form method="POST" action="?/deleteLogo" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
							<input type="hidden" name="logoId" value={logo.id} />
							<button
								type="submit"
								class="p-1 bg-red-600 hover:bg-red-700 rounded text-white"
								title="Delete logo"
							>
								<Trash2 class="w-3 h-3" />
							</button>
						</form>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-8 text-gray-500">
				<Image class="w-12 h-12 mx-auto mb-3 opacity-50" />
				<p>No logos uploaded yet</p>
				<p class="text-sm">Click "Add" buttons above to upload logos</p>
			</div>
		{/if}
	</section>
</div>
