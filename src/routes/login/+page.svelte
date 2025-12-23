<script lang="ts">
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { ActionData } from './$types';
	import { Eye, EyeOff } from '@lucide/svelte';

	let { form }: { form: ActionData } = $props();

	let showPassword = $state(false);
	let isLoading = $state(false);
	let rememberMe = $state(true);
	let savedUsername = $state('');

	// Load saved username on mount
	onMount(() => {
		savedUsername = localStorage.getItem('orchon-username') || '';
	});
</script>

<div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
	<div class="w-full max-w-sm">
		<!-- Logo -->
		<div class="flex justify-center mb-8">
			<img src="/logo.svg" alt="Orchon" class="w-20 h-20" />
		</div>

		<form
			method="POST"
			autocomplete="on"
			use:enhance={() => {
				isLoading = true;
				return async ({ update, formData }) => {
					// Save username if "remember me" checked
					if (rememberMe && browser) {
						const username = formData.get('username') as string;
						localStorage.setItem('orchon-username', username);
					} else if (browser) {
						localStorage.removeItem('orchon-username');
					}
					await update();
					isLoading = false;
				};
			}}
			class="bg-gray-800 rounded-lg p-6 shadow-xl"
		>
			{#if form?.error}
				<div class="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">
					{form.error}
				</div>
			{/if}

			<div class="mb-4">
				<input
					type="email"
					name="username"
					id="username"
					required
					autocomplete="email"
					inputmode="email"
					value={savedUsername}
					class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
					placeholder="Email"
				/>
			</div>

			<div class="mb-4">
				<div class="relative">
					<input
						type={showPassword ? 'text' : 'password'}
						name="password"
						id="password"
						required
						autocomplete="current-password"
						class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 text-base"
						placeholder="Password"
					/>
					<button
						type="button"
						onclick={() => (showPassword = !showPassword)}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 p-1"
						aria-label={showPassword ? 'Hide password' : 'Show password'}
					>
						{#if showPassword}
							<EyeOff class="w-5 h-5" />
						{:else}
							<Eye class="w-5 h-5" />
						{/if}
					</button>
				</div>
			</div>

			<!-- Remember Me checkbox -->
			<div class="mb-4 flex items-center gap-2">
				<input
					type="checkbox"
					id="remember"
					name="remember"
					bind:checked={rememberMe}
					class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
				/>
				<label for="remember" class="text-sm text-gray-400">Remember me</label>
			</div>

			<button
				type="submit"
				disabled={isLoading}
				class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-base"
			>
				{isLoading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>
	</div>
</div>
