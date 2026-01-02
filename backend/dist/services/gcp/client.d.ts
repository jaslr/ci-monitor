export interface GCPBuild {
    id: string;
    projectId: string;
    status: 'STATUS_UNKNOWN' | 'PENDING' | 'QUEUED' | 'WORKING' | 'SUCCESS' | 'FAILURE' | 'INTERNAL_ERROR' | 'TIMEOUT' | 'CANCELLED' | 'EXPIRED';
    createTime: string;
    startTime?: string;
    finishTime?: string;
    logUrl: string;
    source?: {
        repoSource?: {
            projectId: string;
            repoName: string;
            branchName?: string;
            commitSha?: string;
        };
    };
    sourceProvenance?: {
        resolvedRepoSource?: {
            commitSha: string;
        };
    };
    buildTriggerId?: string;
    options?: {
        machineType?: string;
    };
    failureInfo?: {
        type: string;
        detail: string;
    };
}
/**
 * Fetch latest build for a GCP project
 */
export declare function fetchLatestBuild(projectId: string): Promise<GCPBuild | null>;
/**
 * Map GCP build status to our standard health status
 */
export declare function mapGCPStatusToHealth(build: GCPBuild | null): 'healthy' | 'degraded' | 'down' | 'unknown';
/**
 * Map GCP build status to deployment status
 */
export declare function mapGCPStatusToDeployment(status: GCPBuild['status']): 'success' | 'failure' | 'in_progress';
/**
 * Calculate build duration in seconds
 */
export declare function getBuildDuration(build: GCPBuild): number | null;
//# sourceMappingURL=client.d.ts.map