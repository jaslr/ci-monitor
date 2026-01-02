export interface CFPagesProject {
    id: string;
    name: string;
    subdomain: string;
    domains: string[];
    created_on: string;
    production_branch: string;
    latest_deployment?: CFDeployment;
}
export interface CFDeployment {
    id: string;
    short_id: string;
    project_id: string;
    project_name: string;
    environment: 'production' | 'preview';
    url: string;
    created_on: string;
    modified_on: string;
    latest_stage: {
        name: string;
        status: 'idle' | 'active' | 'success' | 'failure' | 'canceled';
        started_on: string | null;
        ended_on: string | null;
    };
    deployment_trigger: {
        type: 'push' | 'hook' | 'rollback' | 'ad_hoc';
        metadata: {
            branch: string;
            commit_hash: string;
            commit_message: string;
        };
    };
    stages: Array<{
        name: string;
        status: string;
    }>;
}
export declare function fetchPagesProjects(): Promise<CFPagesProject[]>;
export declare function fetchLatestDeployment(projectName: string): Promise<CFDeployment | null>;
export declare function mapCFStatusToHealth(deployment: CFDeployment | null): 'healthy' | 'degraded' | 'down' | 'unknown';
//# sourceMappingURL=client.d.ts.map