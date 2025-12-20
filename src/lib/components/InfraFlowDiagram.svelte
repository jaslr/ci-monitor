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
		ExternalLink,
		Plus,
		Minus,
		Maximize2
	} from '@lucide/svelte';

	interface Props {
		services: InfraService[];
		projectName: string;
		domain?: string;
		animated?: boolean;
	}

	let { services, projectName, domain, animated = true }: Props = $props();

	// Zoom and pan state
	let panX = $state(0);
	let panY = $state(0);
	let containerEl: HTMLDivElement | null = $state(null);

	// Drag state
	let isDragging = $state(false);
	let dragStartX = $state(0);
	let dragStartY = $state(0);
	let dragStartPanX = $state(0);
	let dragStartPanY = $state(0);

	const MIN_SCALE = 0.2;
	const MAX_SCALE = 4;
	const ZOOM_STEP = 0.1;

	// Build nodes from services - include dashboard URLs
	let nodes = $derived(buildNodes(services, projectName, domain));
	let edges = $derived(buildEdges(nodes));

	// Calculate dynamic viewBox based on actual node positions
	// Scale factor of 3 makes default view show nodes at ~45-50px diameter
	const SCALE_FACTOR = 3;

	let viewBox = $derived(() => {
		if (nodes.length === 0) return { x: 0, y: 0, width: 230 * SCALE_FACTOR, height: 100 };

		const padding = 25; // Space for labels below nodes
		const topMargin = 30; // ~100px from top at 3x scale

		const minY = Math.min(...nodes.map(n => n.y ?? 0));
		const maxY = Math.max(...nodes.map(n => n.y ?? 0)) + padding;

		// Height based on actual content (NOT scaled - just the content bounds)
		const contentHeight = maxY - minY + topMargin + 10;

		return {
			x: -115, // Center the content horizontally in wider viewBox
			y: minY - topMargin,
			width: 230 * SCALE_FACTOR,
			height: Math.max(80, contentHeight) // No scale factor on height
		};
	});

	// Default to 100% scale
	let baseScale = $derived(1);
	let scale = $state(1);

	// Initialize scale when nodes change
	$effect(() => {
		scale = baseScale;
		panX = 0;
		panY = 0;
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
		monitoring: AlertTriangle
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

		// Site node - left side (front-facing application with globe icon)
		const hostingService = services.find((s) => s.category === 'hosting');
		nodes.push({
			id: 'site',
			type: 'site',
			label: siteDomain || name,
			provider: hostingService?.provider,
			status: hostingService?.status || 'unknown',
			dashboardUrl: hostingService?.dashboardUrl,
			x: 70,
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
				x: 150,
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
				x: 150,
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
				x: 150,
				y: backendY
			});
		}

		// CI - top center
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
				x: 70,
				y: 125
			});
		}

		return nodes;
	}

	function buildEdges(nodes: DiagramNode[]): InfraEdge[] {
		const edges: InfraEdge[] = [];
		const nodeIds = new Set(nodes.map((n) => n.id));

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
			edges.push({ id: 'ci-site', source: 'ci', target: 'site', status: 'idle' });
		}
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

		if (containerEl && newScale !== scale) {
			const rect = containerEl.getBoundingClientRect();
			const centerX = rect.width / 2;
			const centerY = rect.height / 2;

			// Get mouse position relative to center
			const mouseX = e.clientX - rect.left - centerX;
			const mouseY = e.clientY - rect.top - centerY;

			// Adjust pan to zoom toward cursor
			const scaleFactor = newScale / scale;
			panX = panX * scaleFactor - mouseX * (scaleFactor - 1) / newScale;
			panY = panY * scaleFactor - mouseY * (scaleFactor - 1) / newScale;
		}

		scale = newScale;
	}

	function resetZoom() {
		scale = baseScale;
		panX = 0;
		panY = 0;
	}

	function maximizeView() {
		// Scale to fill the container width while keeping aspect ratio
		// The viewBox width is 690 (230 * 3), so we calculate how much to scale
		// to make content fill available width
		if (containerEl) {
			const containerWidth = containerEl.getBoundingClientRect().width;
			const contentWidth = 230; // Original content width before SCALE_FACTOR
			const currentViewBoxWidth = viewBox().width;
			// Calculate scale to make content fill ~90% of container width
			const targetScale = (containerWidth * 0.9) / (contentWidth * (currentViewBoxWidth / (230 * SCALE_FACTOR)));
			scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetScale / SCALE_FACTOR));
			panX = 0;
			panY = 0;
		}
	}

	function handleMouseDown(e: MouseEvent) {
		// Don't start drag if clicking on a node
		if ((e.target as HTMLElement).closest('g[role="button"]')) return;

		isDragging = true;
		dragStartX = e.clientX;
		dragStartY = e.clientY;
		dragStartPanX = panX;
		dragStartPanY = panY;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) return;

		const dx = e.clientX - dragStartX;
		const dy = e.clientY - dragStartY;

		panX = dragStartPanX + dx / scale;
		panY = dragStartPanY + dy / scale;
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleMouseLeave() {
		isDragging = false;
	}
</script>

<div class="relative w-full" bind:this={containerEl}>
	<!-- Zoom Controls - outside diagram -->
	<div class="absolute -top-6 right-0 flex items-center gap-1 z-20">
		<button
			onclick={zoomOut}
			class="p-0.5 hover:bg-gray-700/50 rounded text-gray-400 hover:text-gray-200 transition-colors"
			title="Zoom out"
		>
			<Minus class="w-3.5 h-3.5" />
		</button>
		<button
			onclick={resetZoom}
			class="px-1 hover:bg-gray-700/50 rounded text-[10px] text-gray-400 hover:text-gray-200 transition-colors"
			title="Reset zoom"
		>
			{Math.round(scale * 100)}%
		</button>
		<button
			onclick={zoomIn}
			class="p-0.5 hover:bg-gray-700/50 rounded text-gray-400 hover:text-gray-200 transition-colors"
			title="Zoom in"
		>
			<Plus class="w-3.5 h-3.5" />
		</button>
		<button
			onclick={maximizeView}
			class="p-0.5 hover:bg-gray-700/50 rounded text-gray-400 hover:text-gray-200 transition-colors"
			title="Maximize"
		>
			<Maximize2 class="w-3 h-3" />
		</button>
	</div>

	<!-- Diagram Canvas -->
	<div
		class="w-full overflow-hidden select-none {isDragging ? 'cursor-grabbing' : 'cursor-grab'}"
		onwheel={handleWheel}
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		onmouseleave={handleMouseLeave}
		role="application"
		aria-label="Infrastructure diagram - drag to pan, scroll to zoom"
	>
		<svg
			viewBox="{viewBox().x} {viewBox().y} {viewBox().width} {viewBox().height}"
			class="w-full"
			style="aspect-ratio: {viewBox().width}/{viewBox().height}; transform: scale({scale}) translate({panX / scale}px, {panY / scale}px); transform-origin: center;"
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
						stroke-width="0.75"
						marker-end={isActive ? 'url(#arrow-active)' : 'url(#arrow-idle)'}
						class={animated && isActive ? 'flow-animated' : ''}
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

					<!-- Icon -->
					<foreignObject x="-7" y="-7" width="14" height="14">
						<div class="flex items-center justify-center w-full h-full" style="color: {color}">
							<IconComponent class="w-2.5 h-2.5" />
						</div>
					</foreignObject>

					<!-- Label -->
					<text x="0" y="20" text-anchor="middle" class="text-[4px] fill-gray-400">
						{node.label.length > 10 ? node.label.slice(0, 9) + '..' : node.label}
					</text>

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
