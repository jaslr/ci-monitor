import type { SSEStreamingApi } from 'hono/streaming';
export interface SSEEvent {
    type: 'deployment' | 'status' | 'uptime' | 'alert';
    project: string;
    data: unknown;
}
export declare function addClient(id: string, stream: SSEStreamingApi, projectFilter?: string[]): void;
export declare function removeClient(id: string): void;
export declare function broadcast(event: SSEEvent): void;
export declare function getClientCount(): number;
//# sourceMappingURL=broadcaster.d.ts.map