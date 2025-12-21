export interface ProjectConfig {
    id: string;
    name: string;
    displayName: string;
    owner: string;
    alertLevel: 'hobby' | 'business';
    alertEmail?: string;
    uptimeUrl?: string;
    services: ServiceConfig[];
}
export interface ServiceConfig {
    id: string;
    category: 'hosting' | 'database' | 'auth' | 'storage' | 'dns' | 'ci' | 'monitoring';
    provider: 'cloudflare' | 'flyio' | 'supabase' | 'github' | 'sentry' | 'aws';
    serviceName: string;
    checkUrl?: string;
    cfProjectName?: string;
    flyAppName?: string;
}
export declare const projects: ProjectConfig[];
export declare function getProjectByRepo(repoName: string): ProjectConfig | undefined;
export declare function getProjectByOwnerRepo(owner: string, repo: string): ProjectConfig | undefined;
//# sourceMappingURL=projects.d.ts.map