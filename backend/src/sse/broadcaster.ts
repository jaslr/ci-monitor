import type { SSEStreamingApi } from 'hono/streaming';

export interface SSEEvent {
  type: 'deployment' | 'status' | 'uptime' | 'alert';
  project: string;
  data: unknown;
}

interface SSEClient {
  id: string;
  stream: SSEStreamingApi;
  projectFilter?: string[];
}

const clients = new Map<string, SSEClient>();

export function addClient(id: string, stream: SSEStreamingApi, projectFilter?: string[]): void {
  clients.set(id, { id, stream, projectFilter });
  console.log(`SSE clients connected: ${clients.size}`);
}

export function removeClient(id: string): void {
  clients.delete(id);
  console.log(`SSE clients connected: ${clients.size}`);
}

export function broadcast(event: SSEEvent): void {
  const eventData = JSON.stringify(event);

  for (const client of clients.values()) {
    // Filter by project if client specified
    if (
      client.projectFilter &&
      client.projectFilter.length > 0 &&
      !client.projectFilter.includes(event.project)
    ) {
      continue;
    }

    try {
      client.stream.writeSSE({
        event: event.type,
        data: eventData,
      });
    } catch (err) {
      console.error(`Failed to send to client ${client.id}:`, err);
      removeClient(client.id);
    }
  }
}

export function getClientCount(): number {
  return clients.size;
}
