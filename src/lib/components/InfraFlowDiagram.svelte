<script lang="ts">
	import type { InfraNode, InfraEdge, InfraService } from '$lib/types/infrastructure';
	import {
		User,
		Globe,
		Cloud,
		Server,
		Database,
		Shield,
		HardDrive,
		GitBranch,
		AlertTriangle,
		ExternalLink,
		Plus,
		Minus
	} from '@lucide/svelte';

	interface Props {
		services: InfraService[];
		projectName: string;
		domain?: string;
		animated?: boolean;
	}

	let { services, projectName, domain, animated = true }: Props = $props();

	// Zoom state - start at comfortable viewing size
	let scale = $state(1.8);
	let panX = $state(0);
	let panY = $state(0);
	let containerEl: HTMLDivElement | null = $state(null);

	const MIN_SCALE = 0.5;
	const MAX_SCALE = 4;
	const ZOOM_STEP = 0.2;

	// Build nodes from services - include dashboard URLs
	let nodes = $derived(buildNodes(services, projectName, domain));
	let edges = $derived(buildEdges(nodes));

	const nodeIcons: Record<string, typeof Cloud> = {
		user: User,
		dns: Globe,
		cdn: Cloud,
		site: ExternalLink,
		hosting: Cloud,
		api: Server,
		database: Database,
		auth: Shield,
		storage: HardDrive,
		ci: GitBranch,
		monitoring: AlertTriangle
	};

	const nodeColors: Record<string, string> = {
		user: '#6366f1',
		dns: '#06b6d4',
		cdn: '#f97316',
		site: '#10b981',
		hosting: '#f97316',
		api: '#8b5cf6',
		database: '#22c55e',
		auth: '#eab308',
		storage: '#ec4899',
		ci: '#64748b',
		monitoring: '#ef4444'
	};

	interface DiagramNode extends InfraNode {
		dashboardUrl?: string;
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

		// User node - left side
		nodes.push({
			id: 'user',
			type: 'user',
			label: 'Users',
			status: 'healthy',
			x: 30,
			y: 70
		});

		// Hosting/Site node - center
		const hostingService = services.find((s) => s.category === 'hosting');
		nodes.push({
			id: 'site',
			type: 'site',
			label: siteDomain || name,
			provider: hostingService?.provider,
			status: hostingService?.status || 'unknown',
			dashboardUrl: hostingService?.dashboardUrl,
			x: 110,
			y: 70
		});

		// Backend services - right column
		let backendY = backendStartY;

		if (hasDb) {
			const dbService = services.find((s) => s.category === 'database')!;
			nodes.push({
				id: 'database',
				type: 'database',
				label: dbService.serviceName.replace('Supabase ', ''),
				provider: dbService.provider,
				status: dbService.status,
				dashboardUrl: dbService.dashboardUrl,
				x: 190,
				y: backendY
			});
			backendY += backendSpacing;
		}

		if (hasAuth) {
			const authService = services.find((s) => s.category === 'auth')!;
			nodes.push({
				id: 'auth',
				type: 'auth',
				label: authService.serviceName.replace('Supabase ', ''),
				provider: authService.provider,
				status: authService.status,
				dashboardUrl: authService.dashboardUrl,
				x: 190,
				y: backendY
			});
			backendY += backendSpacing;
		}

		if (hasStorage) {
			const storageService = services.find((s) => s.category === 'storage')!;
			nodes.push({
				id: 'storage',
				type: 'storage',
				label: storageService.serviceName.replace('Cloudflare ', ''),
				provider: storageService.provider,
				status: storageService.status,
				dashboardUrl: storageService.dashboardUrl,
				x: 190,
				y: backendY
			});
		}

		// CI - top center
		if (hasCi) {
			const ciService = services.find((s) => s.category === 'ci')!;
			nodes.push({
				id: 'ci',
				type: 'ci',
				label: 'CI/CD',
				provider: ciService.provider,
				status: ciService.status,
				dashboardUrl: ciService.dashboardUrl,
				x: 110,
				y: 15
			});
		}

		// Monitoring - bottom center
		if (hasMonitoring) {
			const monitoringService = services.find((s) => s.category === 'monitoring')!;
			nodes.push({
				id: 'monitoring',
				type: 'monitoring',
				label: monitoringService.serviceName,
				provider: monitoringService.provider,
				status: monitoringService.status,
				dashboardUrl: monitoringService.dashboardUrl,
				x: 110,
				y: 125
			});
		}

		return nodes;
	}

	function buildEdges(nodes: DiagramNode[]): InfraEdge[] {
		const edges: InfraEdge[] = [];
		const nodeIds = new Set(nodes.map((n) => n.id));

		if (nodeIds.has('site')) {
			edges.push({ id: 'user-site', source: 'user', target: 'site', status: 'active' });
		}
		if (nodeIds.has('database')) {
			edges.push({ id: 'site-database', source: 'site', target: 'database', status: 'active' });
		}
		if (nodeIds.has('auth')) {
			edges.push({ id: 'site-auth', source: 'site', target: 'auth', status: 'active' });
		}
		if (nodeIds.has('storage')) {
			edges.push({ id: 'site-storage', source: 'site', target: 'storage', status: 'active' });
		}
		if (nodeIds.has('ci')) {
			edges.push({ id: 'ci-site', source: 'ci', target: 'site', label: 'deploy', status: 'idle' });
		}
		if (nodeIds.has('monitoring')) {
			edges.push({ id: 'site-monitoring', source: 'site', target: 'monitoring', label: 'logs', status: 'idle' });
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
	): { x1: number; y1: number; x2: number; y2: number } {
		const nodeRadius = 12;
		const dx = target.x - source.x;
		const dy = target.y - source.y;
		const dist = Math.sqrt(dx * dx + dy * dy);

		if (dist === 0) return { x1: source.x, y1: source.y, x2: target.x, y2: target.y };

		const nx = dx / dist;
		const ny = dy / dist;

		return {
			x1: source.x + nx * nodeRadius,
			y1: source.y + ny * nodeRadius,
			x2: target.x - nx * (nodeRadius + 4),
			y2: target.y - ny * (nodeRadius + 4)
		};
	}

	function handleNodeClick(node: DiagramNode) {
		if (node.dashboardUrl) {
			window.open(node.dashboardUrl, '_blank', 'noopener,noreferrer');
		}
	}

	function zoomIn() {
		scale = Math.min(MAX_SCALE, scale + ZOOM_STEP);
	}

	function zoomOut() {
		scale = Math.max(MIN_SCALE, scale - ZOOM_STEP);
	}

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
		const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta));

		if (containerEl) {
			const rect = containerEl.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			// Adjust pan to zoom toward cursor
			const scaleChange = newScale / scale;
			panX = mouseX - (mouseX - panX) * scaleChange;
			panY = mouseY - (mouseY - panY) * scaleChange;
		}

		scale = newScale;
	}

	function resetZoom() {
		scale = 1.8;
		panX = 0;
		panY = 0;
	}
</script>

<div class="relative w-full h-full" bind:this={containerEl}>
	<!-- Zoom Controls -->
	<div class="absolute top-1 right-1 flex items-center gap-0.5 z-20 bg-gray-800/90 backdrop-blur rounded px-1 py-0.5 border border-gray-600">
		<button
			onclick={zoomOut}
			class="p-1 hover:bg-gray-700 rounded text-gray-300 transition-colors"
			title="Zoom out"
		>
			<Minus class="w-3 h-3" />
		</button>
		<button
			onclick={resetZoom}
			class="px-1 py-0.5 hover:bg-gray-700 rounded text-[9px] text-gray-300 transition-colors min-w-[2rem] text-center"
			title="Reset zoom"
		>
			{Math.round(scale * 100)}%
		</button>
		<button
			onclick={zoomIn}
			class="p-1 hover:bg-gray-700 rounded text-gray-300 transition-colors"
			title="Zoom in"
		>
			<Plus class="w-3 h-3" />
		</button>
	</div>

	<!-- Diagram Canvas -->
	<div
		class="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
		onwheel={handleWheel}
	>
		<svg
			viewBox="0 0 230 150"
			class="w-full h-full"
			preserveAspectRatio="xMidYMid meet"
			style="transform: scale({scale}) translate({panX / scale}px, {panY / scale}px); transform-origin: center;"
		>
			<defs>
				<marker id="arrow-active" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
					<polygon points="0 0, 6 2.5, 0 5" fill="#22c55e" />
				</marker>
				<marker id="arrow-idle" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
					<polygon points="0 0, 6 2.5, 0 5" fill="#4b5563" />
				</marker>

				{#if animated}
					<style>
						@keyframes flowDash {
							to { stroke-dashoffset: -12; }
						}
						.flow-animated {
							stroke-dasharray: 4 4;
							animation: flowDash 0.8s linear infinite;
						}
					</style>
				{/if}
			</defs>

			<!-- Edges -->
			{#each edges as edge}
				{@const source = getNodePosition(edge.source)}
				{@const target = getNodePosition(edge.target)}
				{@const path = getEdgePath(source, target)}
				{@const isActive = edge.status === 'active'}
				<g>
					<line
						x1={path.x1}
						y1={path.y1}
						x2={path.x2}
						y2={path.y2}
						stroke={isActive ? '#22c55e' : '#4b5563'}
						stroke-width="1"
						marker-end={isActive ? 'url(#arrow-active)' : 'url(#arrow-idle)'}
						class={animated && isActive ? 'flow-animated' : ''}
					/>
					{#if edge.label}
						<text
							x={(source.x + target.x) / 2}
							y={(source.y + target.y) / 2 - 3}
							text-anchor="middle"
							class="text-[6px] fill-gray-500"
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
						stroke-width="1.5"
						class="transition-all {isClickable ? 'hover:stroke-2 hover:fill-gray-800' : ''}"
					/>

					<!-- Icon -->
					<foreignObject x="-7" y="-7" width="14" height="14">
						<div class="flex items-center justify-center w-full h-full" style="color: {color}">
							<IconComponent class="w-2.5 h-2.5" />
						</div>
					</foreignObject>

					<!-- Label -->
					<text x="0" y="20" text-anchor="middle" class="text-[7px] fill-gray-400">
						{node.label.length > 10 ? node.label.slice(0, 9) + '..' : node.label}
					</text>

					<!-- Clickable indicator -->
					{#if isClickable}
						<circle cx="9" cy="-9" r="3" fill="#374151" stroke={color} stroke-width="0.5" />
						<foreignObject x="6" y="-12" width="6" height="6">
							<div class="flex items-center justify-center w-full h-full text-gray-400">
								<ExternalLink class="w-1.5 h-1.5" />
							</div>
						</foreignObject>
					{/if}
				</g>
			{/each}
		</svg>
	</div>
</div>
