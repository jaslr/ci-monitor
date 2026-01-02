export type WorkflowStatus = 'success' | 'failure' | 'in_progress' | 'unknown';
export interface RepoStatus {
    owner: string;
    repo: string;
    status: WorkflowStatus;
    conclusion: string | null;
    htmlUrl: string | null;
    workflowName: string | null;
    runDate: string | null;
}
//# sourceMappingURL=types.d.ts.map