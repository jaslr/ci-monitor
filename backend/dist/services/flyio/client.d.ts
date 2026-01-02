export interface FlyApp {
    id: string;
    name: string;
    status: string;
    deployed: boolean;
    hostname: string;
    currentRelease?: {
        id: string;
        status: string;
        createdAt: string;
    };
    machines: {
        nodes: FlyMachine[];
    };
}
export interface FlyMachine {
    id: string;
    name: string;
    state: 'created' | 'starting' | 'started' | 'stopping' | 'stopped' | 'destroying' | 'destroyed';
    region: string;
    createdAt: string;
    updatedAt: string;
}
export declare function fetchFlyApps(): Promise<FlyApp[]>;
export declare function mapFlyStatusToHealth(app: FlyApp): 'healthy' | 'degraded' | 'down' | 'unknown';
//# sourceMappingURL=client.d.ts.map