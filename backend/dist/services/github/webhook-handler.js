import * as db from '../../db/queries.js';
export async function handleWorkflowRun(payload) {
    const { action, workflow_run, repository } = payload;
    const owner = repository.owner.login;
    const repo = repository.name;
    // Find the project from database
    const project = await db.getProjectByRepoName(owner, repo);
    if (!project) {
        console.log(`Unknown repo: ${owner}/${repo}, skipping`);
        return null;
    }
    // Find the CI service for this project from database
    const services = await db.getServicesByProject(project.id);
    const ciService = services.find((s) => s.category === 'ci' && s.provider === 'github');
    if (!ciService) {
        console.log(`No GitHub CI service configured for ${project.id}`);
        return null;
    }
    // Map status and determine phase timestamps
    let status;
    let pushedAt;
    let ciStartedAt;
    let ciCompletedAt;
    if (action === 'requested') {
        // Push received, workflow queued
        status = 'queued';
        pushedAt = workflow_run.created_at;
    }
    else if (action === 'in_progress') {
        // CI started running
        status = 'in_progress';
        ciStartedAt = workflow_run.updated_at;
    }
    else if (action === 'completed') {
        // CI finished
        status = workflow_run.conclusion === 'success' ? 'success' : 'failure';
        ciCompletedAt = workflow_run.updated_at;
    }
    else {
        status = 'queued';
    }
    const deployment = {
        id: `gh-${workflow_run.id}`,
        projectId: project.id,
        serviceId: ciService.id,
        provider: 'github',
        status,
        workflowName: workflow_run.name,
        commitSha: workflow_run.head_sha,
        branch: workflow_run.head_branch,
        runUrl: workflow_run.html_url,
        // Legacy timestamps
        startedAt: workflow_run.created_at,
        completedAt: action === 'completed' ? workflow_run.updated_at : undefined,
        // Granular phase timestamps
        pushedAt,
        ciStartedAt,
        ciCompletedAt,
    };
    // Store in database
    try {
        await db.insertDeployment({
            id: deployment.id,
            serviceId: deployment.serviceId,
            provider: deployment.provider,
            status: deployment.status,
            commitSha: deployment.commitSha,
            branch: deployment.branch,
            runUrl: deployment.runUrl,
            startedAt: new Date(deployment.startedAt),
            completedAt: deployment.completedAt ? new Date(deployment.completedAt) : undefined,
            pushedAt: pushedAt ? new Date(pushedAt) : undefined,
            ciStartedAt: ciStartedAt ? new Date(ciStartedAt) : undefined,
            ciCompletedAt: ciCompletedAt ? new Date(ciCompletedAt) : undefined,
        });
    }
    catch (err) {
        console.error('Failed to store deployment:', err);
        // Continue - still return the deployment for SSE broadcast
    }
    return deployment;
}
//# sourceMappingURL=webhook-handler.js.map