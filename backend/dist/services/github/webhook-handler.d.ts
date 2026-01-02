export interface WorkflowRunPayload {
    action: 'requested' | 'in_progress' | 'completed';
    workflow_run: {
        id: number;
        name: string;
        status: 'queued' | 'in_progress' | 'completed';
        conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | 'timed_out' | null;
        html_url: string;
        head_sha: string;
        head_branch: string;
        created_at: string;
        updated_at: string;
    };
    repository: {
        name: string;
        full_name: string;
        owner: {
            login: string;
        };
    };
}
export interface ProcessedDeployment {
    id: string;
    projectId: string;
    serviceId: string;
    provider: 'github' | 'cloudflare' | 'flyio' | 'gcp';
    status: 'queued' | 'in_progress' | 'success' | 'failure';
    workflowName?: string;
    commitSha: string;
    branch: string;
    runUrl: string;
    startedAt: string;
    completedAt?: string;
    pushedAt?: string;
    ciStartedAt?: string;
    ciCompletedAt?: string;
    deployStartedAt?: string;
    deployCompletedAt?: string;
}
export declare function handleWorkflowRun(payload: WorkflowRunPayload): Promise<ProcessedDeployment | null>;
//# sourceMappingURL=webhook-handler.d.ts.map