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
		Zap
	} from '@lucide/svelte';

	interface Props {
		services: InfraService[];
		projectName: string;
		animated?: boolean;
	}

	let { services, projectName, animated = false }: Props = $props();

	// Build nodes from services
	let nodes = $derived(buildNodes(services, projectName));
	let edges = $derived(buildEdges(nodes));

	const nodeIcons: Record<string, typeof Cloud> = {
		user: User,
		dns: Globe,
		cdn: Cloud,
		hosting: Cloud,
		api: Server,
		database: Database,
		auth: Shield,
		storage: HardDrive,
		ci: GitBranch,
		monitoring: AlertTriangle,
		external: Zap
	};

	const nodeColors: Record<string, string> = {
		user: '#6366f1',
		dns: '#06b6d4',
		cdn: '#f97316',
		hosting: '#f97316',
		api: '#8b5cf6',
		database: '#22c55e',
		auth: '#eab308',
		storage: '#ec4899',
		ci: '#64748b',
		monitoring: '#ef4444',
		external: '#a855f7'
	};

	function buildNodes(services: InfraService[], name: string): InfraNode[] {
		const nodes: InfraNode[] = [];
		const seen = new Set<string>();

		// Always add user node
		nodes.push({
			id: 'user',
			type: 'user',
			label: 'User',
			status: 'healthy',
			x: 50,
			y: 150
		});

		// Add DNS if present
		const dnsService = services.find((s) => s.category === 'dns');
		if (dnsService) {
			nodes.push({
				id: 'dns',
				type: 'dns',
				label: dnsService.serviceName,
				provider: dnsService.provider,
				status: dnsService.status,
				x: 150,
				y: 150
			});
			seen.add('dns');
		}

		// Add hosting
		const hostingService = services.find((s) => s.category === 'hosting');
		if (hostingService) {
			nodes.push({
				id: 'hosting',
				type: 'hosting',
				label: hostingService.serviceName,
				provider: hostingService.provider,
				status: hostingService.status,
				x: 250,
				y: 150
			});
			seen.add('hosting');
		} else {
			// Default hosting node
			nodes.push({
				id: 'hosting',
				type: 'hosting',
				label: name,
				status: 'unknown',
				x: 250,
				y: 150
			});
		}

		// Add database if present
		const dbService = services.find((s) => s.category === 'database');
		if (dbService) {
			nodes.push({
				id: 'database',
				type: 'database',
				label: dbService.serviceName,
				provider: dbService.provider,
				status: dbService.status,
				x: 350,
				y: 80
			});
			seen.add('database');
		}

		// Add auth if present
		const authService = services.find((s) => s.category === 'auth');
		if (authService) {
			nodes.push({
				id: 'auth',
				type: 'auth',
				label: authService.serviceName,
				provider: authService.provider,
				status: authService.status,
				x: 350,
				y: 150
			});
			seen.add('auth');
		}

		// Add storage if present
		const storageService = services.find((s) => s.category === 'storage');
		if (storageService) {
			nodes.push({
				id: 'storage',
				type: 'storage',
				label: storageService.serviceName,
				provider: storageService.provider,
				status: storageService.status,
				x: 350,
				y: 220
			});
			seen.add('storage');
		}

		// Add CI if present
		const ciService = services.find((s) => s.category === 'ci');
		if (ciService) {
			nodes.push({
				id: 'ci',
				type: 'ci',
				label: ciService.serviceName,
				provider: ciService.provider,
				status: ciService.status,
				x: 150,
				y: 50
			});
			seen.add('ci');
		}

		// Add monitoring if present
		const monitoringService = services.find((s) => s.category === 'monitoring');
		if (monitoringService) {
			nodes.push({
				id: 'monitoring',
				type: 'monitoring',
				label: monitoringService.serviceName,
				provider: monitoringService.provider,
				status: monitoringService.status,
				x: 150,
				y: 250
			});
			seen.add('monitoring');
		}

		return nodes;
	}

	function buildEdges(nodes: InfraNode[]): InfraEdge[] {
		const edges: InfraEdge[] = [];
		const nodeIds = new Set(nodes.map((n) => n.id));

		// User -> DNS or Hosting
		if (nodeIds.has('dns')) {
			edges.push({
				id: 'user-dns',
				source: 'user',
				target: 'dns',
				status: 'active'
			});
			edges.push({
				id: 'dns-hosting',
				source: 'dns',
				target: 'hosting',
				status: 'active'
			});
		} else if (nodeIds.has('hosting')) {
			edges.push({
				id: 'user-hosting',
				source: 'user',
				target: 'hosting',
				status: 'active'
			});
		}

		// Hosting -> Database
		if (nodeIds.has('database')) {
			edges.push({
				id: 'hosting-database',
				source: 'hosting',
				target: 'database',
				status: 'active'
			});
		}

		// Hosting -> Auth
		if (nodeIds.has('auth')) {
			edges.push({
				id: 'hosting-auth',
				source: 'hosting',
				target: 'auth',
				status: 'active'
			});
		}

		// Hosting -> Storage
		if (nodeIds.has('storage')) {
			edges.push({
				id: 'hosting-storage',
				source: 'hosting',
				target: 'storage',
				status: 'active'
			});
		}

		// CI -> Hosting (deploy)
		if (nodeIds.has('ci')) {
			edges.push({
				id: 'ci-hosting',
				source: 'ci',
				target: 'hosting',
				label: 'deploy',
				status: 'idle'
			});
		}

		// Hosting -> Monitoring
		if (nodeIds.has('monitoring')) {
			edges.push({
				id: 'hosting-monitoring',
				source: 'hosting',
				target: 'monitoring',
				label: 'errors',
				status: 'idle'
			});
		}

		return edges;
	}

	function getNodePosition(nodeId: string): { x: number; y: number } {
		const node = nodes.find((n) => n.id === nodeId);
		return node ? { x: node.x || 0, y: node.y || 0 } : { x: 0, y: 0 };
	}
</script>

<div class="w-full overflow-x-auto">
	<svg viewBox="0 0 450 300" class="w-full h-auto min-w-[300px]">
		<defs>
			<!-- Arrow marker -->
			<marker
				id="arrowhead"
				markerWidth="10"
				markerHeight="7"
				refX="9"
				refY="3.5"
				orient="auto"
			>
				<polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
			</marker>

			<!-- Animated dash pattern -->
			{#if animated}
				<style>
					@keyframes dash {
						to {
							stroke-dashoffset: -20;
						}
					}
					.animated-edge {
						stroke-dasharray: 5 5;
						animation: dash 1s linear infinite;
					}
				</style>
			{/if}
		</defs>

		<!-- Edges -->
		{#each edges as edge}
			{@const source = getNodePosition(edge.source)}
			{@const target = getNodePosition(edge.target)}
			<g>
				<line
					x1={source.x + 25}
					y1={source.y}
					x2={target.x - 25}
					y2={target.y}
					stroke={edge.status === 'active' ? '#22c55e' : '#4b5563'}
					stroke-width="2"
					marker-end="url(#arrowhead)"
					class={animated && edge.status === 'active' ? 'animated-edge' : ''}
				/>
				{#if edge.label}
					<text
						x={(source.x + target.x) / 2}
						y={(source.y + target.y) / 2 - 8}
						text-anchor="middle"
						class="text-[10px] fill-gray-500"
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
			<g transform="translate({nodeX - 25}, {nodeY - 25})">
				<!-- Node circle -->
				<circle
					cx="25"
					cy="25"
					r="22"
					fill="#1f2937"
					stroke={color}
					stroke-width="2"
					class="transition-all hover:stroke-[3px]"
				/>

				<!-- Status indicator -->
				{#if node.status === 'healthy'}
					<circle cx="40" cy="10" r="5" fill="#22c55e" />
				{:else if node.status === 'degraded'}
					<circle cx="40" cy="10" r="5" fill="#eab308" />
				{:else if node.status === 'down'}
					<circle cx="40" cy="10" r="5" fill="#ef4444" />
				{/if}

				<!-- Icon (positioned in center) -->
				<foreignObject x="9" y="9" width="32" height="32">
					<div class="flex items-center justify-center w-full h-full" style="color: {color}">
						<IconComponent class="w-5 h-5" />
					</div>
				</foreignObject>

				<!-- Label -->
				<text x="25" y="60" text-anchor="middle" class="text-[9px] fill-gray-400 font-medium">
					{node.label.length > 12 ? node.label.slice(0, 10) + '..' : node.label}
				</text>
			</g>
		{/each}
	</svg>
</div>
