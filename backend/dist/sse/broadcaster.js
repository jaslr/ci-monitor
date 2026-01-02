const clients = new Map();
export function addClient(id, stream, projectFilter) {
    clients.set(id, { id, stream, projectFilter });
    console.log(`SSE clients connected: ${clients.size}`);
}
export function removeClient(id) {
    clients.delete(id);
    console.log(`SSE clients connected: ${clients.size}`);
}
export function broadcast(event) {
    const eventData = JSON.stringify(event);
    for (const client of clients.values()) {
        // Filter by project if client specified
        if (client.projectFilter &&
            client.projectFilter.length > 0 &&
            !client.projectFilter.includes(event.project)) {
            continue;
        }
        try {
            client.stream.writeSSE({
                event: event.type,
                data: eventData,
            });
        }
        catch (err) {
            console.error(`Failed to send to client ${client.id}:`, err);
            removeClient(client.id);
        }
    }
}
export function getClientCount() {
    return clients.size;
}
//# sourceMappingURL=broadcaster.js.map