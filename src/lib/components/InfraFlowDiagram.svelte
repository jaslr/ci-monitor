<script lang="ts">
	import type { InfraNode, InfraEdge, InfraService } from '$lib/types/infrastructure';
	import {
		Globe,
		Cloud,
		Server,
		Database,
		Shield,
		HardDrive,
		GitBranch,
		AlertTriangle,
		ExternalLink
	} from '@lucide/svelte';

	// Deployment timestamps for each stage
	export interface DeploymentTimestamps {
		pushStarted?: string;    // When git push started
		ciStarted?: string;      // When CI/deploy started
		ciCompleted?: string;    // When CI/deploy finished
		deployStarted?: string;  // When site deployment started
		deployCompleted?: string; // When site is live
	}

	interface Props {
		services: InfraService[];
		projectName: string;
		domain?: string;
		animated?: boolean;
		isDeploying?: boolean;  // True when actively deploying
		deploymentTimestamps?: DeploymentTimestamps;
	}

	let { services, projectName, domain, animated = true, isDeploying = false, deploymentTimestamps }: Props = $props();

	// Logo display state - persisted to localStorage
	const SHOW_LOGOS_KEY = 'infra-diagram-show-logos';
	let showLogos = $state(true);
	let isClient = $state(false);

	// Initialize showLogos from localStorage on mount
	$effect(() => {
		if (typeof window !== 'undefined') {
			isClient = true;
			const stored = localStorage.getItem(SHOW_LOGOS_KEY);
			if (stored !== null) {
				showLogos = stored === 'true';
			}
		}
	});

	// Persist showLogos changes to localStorage
	function toggleShowLogos() {
		showLogos = !showLogos;
		if (typeof window !== 'undefined') {
			localStorage.setItem(SHOW_LOGOS_KEY, String(showLogos));
		}
	}

	// Build nodes from services - include dashboard URLs
	let nodes = $derived(buildNodes(services, projectName, domain));
	let edges = $derived(buildEdges(nodes));

	// Calculate dynamic viewBox based on actual node positions
	// ViewBox matches content bounds - SVG naturally fills container
	let viewBox = $derived(() => {
		if (nodes.length === 0) return { x: 0, y: 0, width: 200, height: 150 };

		const padding = 30; // Space for labels below nodes
		const sidePadding = 20; // Horizontal padding

		const minX = Math.min(...nodes.map(n => n.x ?? 0));
		const maxX = Math.max(...nodes.map(n => n.x ?? 0));
		const minY = Math.min(...nodes.map(n => n.y ?? 0));
		const maxY = Math.max(...nodes.map(n => n.y ?? 0));

		const contentWidth = maxX - minX + sidePadding * 2;
		const contentHeight = maxY - minY + padding * 2;

		return {
			x: minX - sidePadding,
			y: minY - padding,
			width: Math.max(180, contentWidth),
			height: Math.max(120, contentHeight)
		};
	});

	const nodeIcons: Record<string, typeof Cloud> = {
		dns: Globe,
		cdn: Cloud,
		site: Globe,
		hosting: Cloud,
		api: Server,
		database: Database,
		auth: Shield,
		storage: HardDrive,
		ci: GitBranch,
		monitoring: AlertTriangle,
		localdev: Server
	};

	const nodeColors: Record<string, string> = {
		dns: '#06b6d4',
		cdn: '#f97316',
		site: '#10b981',
		hosting: '#f97316',
		api: '#8b5cf6',
		database: '#22c55e',
		auth: '#eab308',
		storage: '#ec4899',
		ci: '#64748b',
		monitoring: '#ef4444',
		localdev: '#9ca3af'
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
		google: 'Google'
	};

	// Format timestamp to HH:MM:SS
	function formatTimestamp(isoString: string | undefined): string {
		if (!isoString) return '';
		const date = new Date(isoString);
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		});
	}

	// Get timestamp for a specific node based on deployment progress
	function getNodeTimestamp(nodeId: string): string | undefined {
		if (!deploymentTimestamps) return undefined;
		switch (nodeId) {
			case 'localdev':
				return deploymentTimestamps.pushStarted;
			case 'ci':
				return deploymentTimestamps.ciStarted || deploymentTimestamps.ciCompleted;
			case 'site':
				return deploymentTimestamps.deployCompleted || deploymentTimestamps.deployStarted;
			default:
				return undefined;
		}
	}

	// Get logo URL for a provider (returns null if provider doesn't have a logo)
	function getLogoUrl(provider: string | undefined): string | null {
		if (!provider) return null;
		// These providers have logos in our R2 bucket
		const providersWithLogos = ['cloudflare', 'flyio', 'supabase', 'github', 'sentry', 'vercel', 'netlify', 'auth0', 'clerk', 'planetscale', 'plausible', 'posthog', 'resend'];
		if (providersWithLogos.includes(provider)) {
			return `/api/logos/infra/${provider}.svg`;
		}
		return null;
	}

	interface DiagramNode extends InfraNode {
		dashboardUrl?: string;
		label2?: string; // Secondary label (e.g., provider name)
	}

	function buildNodes(services: InfraService[], name: string, siteDomain?: string): DiagramNode[] {
		const nodes: DiagramNode[] = [];

		// Compact layout - smaller spacing
		const hasDb = services.some((s) => s.category === 'database');
		const hasAuth = services.some((s) => s.category === 'auth');
		const hasStorage = services.some((s) => s.category === 'storage');
		const hasCi = services.some((s) => s.category === 'ci');
		const hasMonitoring = services.some((s) => s.category === 'monitoring');

		// Count backend services for vertical centering
		const backendCount = [hasDb, hasAuth, hasStorage].filter(Boolean).length;
		const backendStartY = backendCount === 1 ? 70 : backendCount === 2 ? 50 : 30;
		const backendSpacing = 40;

		// Local Dev node - top left (developer's machine)
		nodes.push({
			id: 'localdev',
			type: 'localdev',
			label: 'Local Dev',
			status: 'unknown',
			x: -10,
			y: 15
		});

		// CI - top center (deploy pipeline)
		if (hasCi) {
			const ciService = services.find((s) => s.category === 'ci')!;
			nodes.push({
				id: 'ci',
				type: 'ci',
				label: 'Deploy',
				provider: ciService.provider,
				status: ciService.status,
				dashboardUrl: ciService.dashboardUrl,
				x: 70,
				y: 15
			});
		}

		// Site node - center (front-facing application)
		const hostingService = services.find((s) => s.category === 'hosting');
		const hostingProvider = hostingService?.provider;
		const hostingLabel = hostingProvider ? providerNames[hostingProvider] || hostingProvider : name;
		nodes.push({
			id: 'site',
			type: 'site',
			label: hostingLabel,
			provider: hostingProvider,
			status: hostingService?.status || 'unknown',
			dashboardUrl: hostingService?.dashboardUrl,
			x: 70,
			y: 70
		});

		// Backend services - right column with type | provider format
		let backendY = backendStartY;

		if (hasDb) {
			const dbService = services.find((s) => s.category === 'database')!;
			const dbProvider = providerNames[dbService.provider] || dbService.provider;
			nodes.push({
				id: 'database',
				type: 'database',
				label: 'DB',
				label2: dbProvider,
				provider: dbService.provider,
				status: dbService.status,
				dashboardUrl: dbService.dashboardUrl,
				x: 150,
				y: backendY
			});
			backendY += backendSpacing;
		}

		if (hasAuth) {
			const authService = services.find((s) => s.category === 'auth')!;
			const authProvider = providerNames[authService.provider] || authService.provider;
			nodes.push({
				id: 'auth',
				type: 'auth',
				label: 'Auth',
				label2: authProvider,
				provider: authService.provider,
				status: authService.status,
				dashboardUrl: authService.dashboardUrl,
				x: 150,
				y: backendY
			});
			backendY += backendSpacing;
		}

		if (hasStorage) {
			const storageService = services.find((s) => s.category === 'storage')!;
			const storageProvider = providerNames[storageService.provider] || storageService.provider;
			// For storage, use R2 as the product name if Cloudflare
			const storageName = storageService.provider === 'cloudflare' ? 'R2' : storageProvider;
			nodes.push({
				id: 'storage',
				type: 'storage',
				label: 'Storage',
				label2: storageName,
				provider: storageService.provider,
				status: storageService.status,
				dashboardUrl: storageService.dashboardUrl,
				x: 150,
				y: backendY
			});
		}

		// Monitoring - bottom center
		if (hasMonitoring) {
			const monitoringService = services.find((s) => s.category === 'monitoring')!;
			const monitoringProvider = providerNames[monitoringService.provider] || monitoringService.provider;
			nodes.push({
				id: 'monitoring',
				type: 'monitoring',
				label: 'Errors',
				label2: monitoringProvider,
				provider: monitoringService.provider,
				status: monitoringService.status,
				dashboardUrl: monitoringService.dashboardUrl,
				x: 70,
				y: 125
			});
		}

		return nodes;
	}

	// Extended edge type for deployment edges
	interface ExtendedEdge extends InfraEdge {
		isDeployPipeline?: boolean;  // Part of the deploy flow (localdev→ci→site)
	}

	function buildEdges(nodes: DiagramNode[]): ExtendedEdge[] {
		const edges: ExtendedEdge[] = [];
		const nodeIds = new Set(nodes.map((n) => n.id));

		// Local dev to CI (deploy pipeline - animates during deployment)
		if (nodeIds.has('localdev') && nodeIds.has('ci')) {
			edges.push({ id: 'localdev-ci', source: 'localdev', target: 'ci', status: 'idle', isDeployPipeline: true });
		}

		// CI to Site (deploy pipeline - animates during deployment)
		if (nodeIds.has('ci')) {
			edges.push({ id: 'ci-site', source: 'ci', target: 'site', status: 'idle', isDeployPipeline: true });
		}

		// Site to backend services (static green connections - shows data flow paths)
		if (nodeIds.has('database')) {
			edges.push({ id: 'site-database', source: 'site', target: 'database', status: 'active' });
		}
		if (nodeIds.has('auth')) {
			edges.push({ id: 'site-auth', source: 'site', target: 'auth', status: 'active' });
		}
		if (nodeIds.has('storage')) {
			edges.push({ id: 'site-storage', source: 'site', target: 'storage', status: 'active' });
		}

		// Site to monitoring (static grey)
		if (nodeIds.has('monitoring')) {
			edges.push({ id: 'site-monitoring', source: 'site', target: 'monitoring', status: 'idle' });
		}

		return edges;
	}

	function getNodePosition(nodeId: string): { x: number; y: number } {
		const node = nodes.find((n) => n.id === nodeId);
		return node ? { x: node.x || 0, y: node.y || 0 } : { x: 0, y: 0 };
	}

	function getEdgePath(
		source: { x: number; y: number },
		target: { x: number; y: number }
	): { x1: number; y1: number; x2: number; y2: number; midX: number; midY: number; angle: number } {
		const nodeRadius = 12; // Match actual node radius
		const arrowGap = 2; // Minimal gap for arrow tip
		const dx = target.x - source.x;
		const dy = target.y - source.y;
		const dist = Math.sqrt(dx * dx + dy * dy);

		if (dist === 0) return { x1: source.x, y1: source.y, x2: target.x, y2: target.y, midX: source.x, midY: source.y, angle: 0 };

		const nx = dx / dist;
		const ny = dy / dist;

		const x1 = source.x + nx * nodeRadius;
		const y1 = source.y + ny * nodeRadius;
		const x2 = target.x - nx * (nodeRadius + arrowGap);
		const y2 = target.y - ny * (nodeRadius + arrowGap);

		return {
			x1, y1, x2, y2,
			midX: (x1 + x2) / 2,
			midY: (y1 + y2) / 2,
			angle: Math.atan2(dy, dx) * 180 / Math.PI
		};
	}

	function handleNodeClick(node: DiagramNode) {
		if (node.dashboardUrl) {
			window.open(node.dashboardUrl, '_blank', 'noopener,noreferrer');
		}
	}
</script>

<div class="relative w-full h-full flex flex-col">
	<!-- Logo Toggle Control -->
	<div class="absolute top-0 right-0 z-20">
		<button
			onclick={toggleShowLogos}
			class="flex items-center justify-center w-8 h-8 hover:bg-gray-700/50 text-xs transition-colors {showLogos ? 'text-gray-200' : 'text-gray-500'}"
			title={showLogos ? 'Hide logos' : 'Show logos'}
		>
			<span class="w-6 h-3 relative {showLogos ? 'bg-green-600' : 'bg-gray-600'} transition-colors">
				<span class="absolute top-0.5 {showLogos ? 'right-0.5' : 'left-0.5'} w-2 h-2 bg-white transition-all"></span>
			</span>
		</button>
	</div>

	<!-- Diagram Canvas - SVG fills container naturally -->
	<div class="flex-1 w-full flex items-center justify-center">
		<svg
			viewBox="{viewBox().x} {viewBox().y} {viewBox().width} {viewBox().height}"
			class="w-full h-full max-h-full"
			preserveAspectRatio="xMidYMid meet"
		>
			<defs>
				<!-- Green arrow for data flow (site→backend) -->
				<marker id="arrow-active" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
					<polygon points="0 0, 6 2.5, 0 5" fill="#22c55e" />
				</marker>
				<!-- Grey arrow for idle connections -->
				<marker id="arrow-idle" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
					<polygon points="0 0, 6 2.5, 0 5" fill="#4b5563" />
				</marker>
				<!-- Cyan arrow for active deployment (deploy pipeline) -->
				<marker id="arrow-deploy" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
					<polygon points="0 0, 6 2.5, 0 5" fill="#06b6d4" />
				</marker>

				<style>
					@keyframes deployDash {
						to { stroke-dashoffset: -12; }
					}
					.deploy-animated {
						stroke-dasharray: 4 4;
						animation: deployDash 0.5s linear infinite;
					}
				</style>
			</defs>

			<!-- Edges -->
			{#each edges as edge}
				{@const source = getNodePosition(edge.source)}
				{@const target = getNodePosition(edge.target)}
				{@const path = getEdgePath(source, target)}
				{@const isDataFlow = edge.status === 'active'}
				{@const isDeployEdge = (edge as ExtendedEdge).isDeployPipeline}
				{@const shouldAnimateDeploy = isDeploying && isDeployEdge}
				<g>
					<line
						x1={path.x1}
						y1={path.y1}
						x2={path.x2}
						y2={path.y2}
						stroke={shouldAnimateDeploy ? '#06b6d4' : isDataFlow ? '#22c55e' : '#4b5563'}
						stroke-width="0.75"
						marker-end={shouldAnimateDeploy ? 'url(#arrow-deploy)' : isDataFlow ? 'url(#arrow-active)' : 'url(#arrow-idle)'}
						class={shouldAnimateDeploy ? 'deploy-animated' : ''}
					/>
					{#if edge.label}
						<text
							x={path.midX}
							y={path.midY + 1}
							text-anchor="middle"
							class="text-[4px] fill-gray-400 font-medium"
						>
							{edge.label}
						</text>
					{/if}
				</g>
			{/each}

			<!-- Nodes -->
			{#each nodes as node}
				{@const IconComponent = nodeIcons[node.type] || Server}
				{@const color = nodeColors[node.type] || '#6b7280'}
				{@const nodeX = node.x ?? 0}
				{@const nodeY = node.y ?? 0}
				{@const isClickable = !!node.dashboardUrl}
				{@const logoUrl = getLogoUrl(node.provider)}
				<g
					transform="translate({nodeX}, {nodeY})"
					class={isClickable ? 'cursor-pointer' : ''}
					onclick={() => handleNodeClick(node)}
					onkeydown={(e) => e.key === 'Enter' && handleNodeClick(node)}
					role={isClickable ? 'button' : undefined}
					tabindex={isClickable ? 0 : undefined}
				>
					<!-- Node circle -->
					<circle
						cx="0"
						cy="0"
						r="12"
						fill="#1f2937"
						stroke={color}
						stroke-width="1"
						class="transition-all {isClickable ? 'hover:stroke-[1.5] hover:fill-gray-800' : ''}"
					/>

					<!-- Icon or Logo -->
					{#if showLogos && logoUrl}
						<image
							x="-8"
							y="-8"
							width="16"
							height="16"
							href={logoUrl}
							preserveAspectRatio="xMidYMid meet"
						/>
					{:else}
						<foreignObject x="-7" y="-7" width="14" height="14">
							<div class="flex items-center justify-center w-full h-full" style="color: {color}">
								<IconComponent class="w-2.5 h-2.5" />
							</div>
						</foreignObject>
					{/if}

					<!-- Labels -->
					<text x="0" y="18" text-anchor="middle" class="text-[4px] fill-gray-400 font-medium">
						{node.label.length > 10 ? node.label.slice(0, 9) + '..' : node.label}
					</text>
					{#if node.label2}
						<text x="0" y="24" text-anchor="middle" class="text-[3.5px] fill-gray-500">
							{node.label2.length > 12 ? node.label2.slice(0, 11) + '..' : node.label2}
						</text>
					{/if}

					<!-- Timestamp display during deployment -->
					{#if isDeploying}
						{@const timestamp = getNodeTimestamp(node.id)}
						{#if timestamp}
							<text x="0" y={node.label2 ? 31 : 25} text-anchor="middle" class="text-[3px] fill-cyan-400 font-mono">
								{formatTimestamp(timestamp)}
							</text>
						{/if}
					{/if}

					<!-- Clickable indicator (external link) -->
					{#if isClickable}
						<foreignObject x="6" y="-12" width="6" height="6">
							<div class="flex items-center justify-center w-full h-full text-gray-400">
								<ExternalLink class="w-1.5 h-1.5" />
							</div>
						</foreignObject>
					{/if}

					<!-- Error indicator (shows when node has error/down status) -->
					{#if node.status === 'down' || node.status === 'degraded'}
						<foreignObject x="-12" y="-12" width="6" height="6">
							<div class="flex items-center justify-center w-full h-full text-red-500">
								<AlertTriangle class="w-2 h-2" />
							</div>
						</foreignObject>
					{/if}
				</g>
			{/each}
		</svg>
	</div>
</div>
