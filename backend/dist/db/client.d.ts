import pg from 'pg';
export declare function initDb(): Promise<void>;
export declare function getPool(): pg.Pool | null;
export declare function query<T extends pg.QueryResultRow>(text: string, params?: unknown[]): Promise<pg.QueryResult<T>>;
export declare function getDbStatus(): Promise<{
    connected: boolean;
    latencyMs?: number;
}>;
export declare function closeDb(): Promise<void>;
//# sourceMappingURL=client.d.ts.map