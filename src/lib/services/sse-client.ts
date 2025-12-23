// SSE Client for real-time updates from observatory-backend

export type SSEEventType = 'deployment' | 'status' | 'uptime' | 'alert' | 'connected';

export interface SSEEvent {
	type: SSEEventType;
	project?: string;
	data: unknown;
}

export interface DeploymentEvent {
	serviceId: string;
	provider: string;
	status: 'queued' | 'in_progress' | 'success' | 'failure';
	commitSha?: string;
	branch?: string;
	runUrl?: string;
	// Granular phase timestamps (ISO 8601 strings)
	pushedAt?: string;        // When git push was received
	ciStartedAt?: string;     // When CI workflow started
	ciCompletedAt?: string;   // When CI workflow completed
	deployStartedAt?: string; // When deploy to hosting started
	deployCompletedAt?: string; // When deploy is live
}

export interface StatusEvent {
	serviceId: string;
	status: 'healthy' | 'degraded' | 'down' | 'unknown';
	message?: string;
}

export interface UptimeEvent {
	serviceId: string;
	isUp: boolean;
	responseTimeMs?: number;
	statusCode?: number;
}

export interface AlertEvent {
	alertType: string;
	message: string;
	projectId: string;
}

type EventHandler = (event: SSEEvent) => void;

class SSEClient {
	private eventSource: EventSource | null = null;
	private handlers: Set<EventHandler> = new Set();
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectDelay = 1000;
	private baseUrl: string | null = null;
	private apiSecret: string | null = null;

	connect(baseUrl: string, apiSecret?: string): void {
		if (this.eventSource) {
			this.disconnect();
		}

		this.baseUrl = baseUrl;
		this.apiSecret = apiSecret || null;

		// Include API secret as query param for SSE (can't use headers)
		const url = apiSecret
			? `${baseUrl}/events?secret=${encodeURIComponent(apiSecret)}`
			: `${baseUrl}/events`;

		try {
			this.eventSource = new EventSource(url);

			this.eventSource.onopen = () => {
				console.log('[SSE] Connected to observatory-backend');
				this.reconnectAttempts = 0;
			};

			this.eventSource.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data) as SSEEvent;
					this.notifyHandlers(data);
				} catch (err) {
					console.error('[SSE] Failed to parse event:', err);
				}
			};

			this.eventSource.onerror = (error) => {
				console.error('[SSE] Connection error:', error);
				this.handleReconnect();
			};
		} catch (err) {
			console.error('[SSE] Failed to create EventSource:', err);
		}
	}

	private handleReconnect(): void {
		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			console.error('[SSE] Max reconnect attempts reached, giving up');
			return;
		}

		this.reconnectAttempts++;
		const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

		console.log(`[SSE] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

		setTimeout(() => {
			if (this.baseUrl) {
				this.connect(this.baseUrl, this.apiSecret || undefined);
			}
		}, delay);
	}

	disconnect(): void {
		if (this.eventSource) {
			this.eventSource.close();
			this.eventSource = null;
		}
	}

	subscribe(handler: EventHandler): () => void {
		this.handlers.add(handler);
		return () => {
			this.handlers.delete(handler);
		};
	}

	private notifyHandlers(event: SSEEvent): void {
		for (const handler of this.handlers) {
			try {
				handler(event);
			} catch (err) {
				console.error('[SSE] Handler error:', err);
			}
		}
	}

	get isConnected(): boolean {
		return this.eventSource?.readyState === EventSource.OPEN;
	}

	get connectionStatus(): {
		connected: boolean;
		connecting: boolean;
		url: string | null;
		reconnectAttempts: number;
		maxReconnectAttempts: number;
		readyState: number;
		readyStateText: string;
	} {
		const readyState = this.eventSource?.readyState ?? -1;
		const readyStateText = readyState === 0 ? 'Connecting' :
			readyState === 1 ? 'Connected' :
			readyState === 2 ? 'Closed' : 'Not initialized';

		return {
			connected: readyState === EventSource.OPEN,
			connecting: readyState === EventSource.CONNECTING,
			url: this.baseUrl,
			reconnectAttempts: this.reconnectAttempts,
			maxReconnectAttempts: this.maxReconnectAttempts,
			readyState,
			readyStateText
		};
	}
}

// Singleton instance
export const sseClient = new SSEClient();
