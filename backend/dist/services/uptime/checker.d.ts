export interface UptimeResult {
    url: string;
    isUp: boolean;
    statusCode?: number;
    responseTimeMs: number;
    errorMessage?: string;
}
export declare function checkUptime(url: string): Promise<UptimeResult>;
export declare function runUptimeChecks(): Promise<void>;
//# sourceMappingURL=checker.d.ts.map