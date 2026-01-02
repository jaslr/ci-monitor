import { query } from './client.js';
// Queries
export async function getLatestStatusForAllProjects() {
    const result = await query(`
    SELECT DISTINCT ON (project_id)
      project_id as "projectId",
      status,
      message,
      checked_at as "checkedAt"
    FROM status_checks sc
    JOIN services s ON s.id = sc.service_id
    ORDER BY project_id, checked_at DESC
  `);
    return result.rows;
}
export async function getLatestStatus(projectId) {
    const result = await query(`
    SELECT
      s.project_id as "projectId",
      sc.status,
      sc.message,
      sc.checked_at as "checkedAt"
    FROM status_checks sc
    JOIN services s ON s.id = sc.service_id
    WHERE s.project_id = $1
    ORDER BY sc.checked_at DESC
    LIMIT 1
  `, [projectId]);
    return result.rows[0] || null;
}
export async function getRecentDeployments(projectId, limit) {
    const result = await query(`
    SELECT
      d.id,
      d.service_id as "serviceId",
      d.provider,
      d.status,
      d.commit_sha as "commitSha",
      d.branch,
      d.run_url as "runUrl",
      d.started_at as "startedAt",
      d.completed_at as "completedAt",
      d.pushed_at as "pushedAt",
      d.ci_started_at as "ciStartedAt",
      d.ci_completed_at as "ciCompletedAt",
      d.deploy_started_at as "deployStartedAt",
      d.deploy_completed_at as "deployCompletedAt"
    FROM deployments d
    JOIN services s ON s.id = d.service_id
    WHERE s.project_id = $1
    ORDER BY d.created_at DESC
    LIMIT $2
  `, [projectId, limit]);
    return result.rows;
}
// Get recent deployments across ALL projects (for the live deployment log)
export async function getGlobalRecentDeployments(limit) {
    const result = await query(`
    SELECT
      d.id,
      d.service_id as "serviceId",
      d.provider,
      d.status,
      d.commit_sha as "commitSha",
      d.branch,
      d.run_url as "runUrl",
      d.started_at as "startedAt",
      d.completed_at as "completedAt",
      d.pushed_at as "pushedAt",
      d.ci_started_at as "ciStartedAt",
      d.ci_completed_at as "ciCompletedAt",
      d.deploy_started_at as "deployStartedAt",
      d.deploy_completed_at as "deployCompletedAt",
      p.id as "projectId",
      p.name as "projectName",
      p.display_name as "projectDisplayName"
    FROM deployments d
    JOIN services s ON s.id = d.service_id
    JOIN projects p ON p.id = s.project_id
    ORDER BY COALESCE(d.deploy_completed_at, d.completed_at, d.created_at) DESC
    LIMIT $1
  `, [limit]);
    return result.rows;
}
export async function getUptimeHistory(projectId, hours) {
    const result = await query(`
    SELECT
      uc.service_id as "serviceId",
      uc.response_time_ms as "responseTimeMs",
      uc.status_code as "statusCode",
      uc.is_up as "isUp",
      uc.checked_at as "checkedAt"
    FROM uptime_checks uc
    JOIN services s ON s.id = uc.service_id
    WHERE s.project_id = $1
      AND uc.checked_at > NOW() - INTERVAL '1 hour' * $2
    ORDER BY uc.checked_at DESC
  `, [projectId, hours]);
    return result.rows;
}
export async function getStatusHistory(projectId, hours) {
    const result = await query(`
    SELECT
      s.project_id as "projectId",
      sc.status,
      sc.message,
      sc.checked_at as "checkedAt"
    FROM status_checks sc
    JOIN services s ON s.id = sc.service_id
    WHERE s.project_id = $1
      AND sc.checked_at > NOW() - INTERVAL '1 hour' * $2
    ORDER BY sc.checked_at DESC
  `, [projectId, hours]);
    return result.rows;
}
export async function insertDeployment(deployment) {
    await query(`
    INSERT INTO deployments (
      id, service_id, provider, status, commit_sha, branch, run_url,
      started_at, completed_at,
      pushed_at, ci_started_at, ci_completed_at, deploy_started_at, deploy_completed_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    ON CONFLICT (id) DO UPDATE SET
      status = EXCLUDED.status,
      completed_at = COALESCE(EXCLUDED.completed_at, deployments.completed_at),
      ci_started_at = COALESCE(EXCLUDED.ci_started_at, deployments.ci_started_at),
      ci_completed_at = COALESCE(EXCLUDED.ci_completed_at, deployments.ci_completed_at),
      deploy_started_at = COALESCE(EXCLUDED.deploy_started_at, deployments.deploy_started_at),
      deploy_completed_at = COALESCE(EXCLUDED.deploy_completed_at, deployments.deploy_completed_at)
  `, [
        deployment.id,
        deployment.serviceId,
        deployment.provider,
        deployment.status,
        deployment.commitSha,
        deployment.branch,
        deployment.runUrl,
        deployment.startedAt,
        deployment.completedAt,
        deployment.pushedAt,
        deployment.ciStartedAt,
        deployment.ciCompletedAt,
        deployment.deployStartedAt,
        deployment.deployCompletedAt,
    ]);
}
// Update deployment timestamps by commit SHA (for correlating CI and deploy events)
export async function updateDeploymentByCommit(commitSha, updates) {
    const result = await query(`
    UPDATE deployments SET
      deploy_started_at = COALESCE($2, deploy_started_at),
      deploy_completed_at = COALESCE($3, deploy_completed_at),
      status = COALESCE($4, status)
    WHERE commit_sha = $1
    RETURNING
      id,
      service_id as "serviceId",
      provider,
      status,
      commit_sha as "commitSha",
      branch,
      run_url as "runUrl",
      pushed_at as "pushedAt",
      ci_started_at as "ciStartedAt",
      ci_completed_at as "ciCompletedAt",
      deploy_started_at as "deployStartedAt",
      deploy_completed_at as "deployCompletedAt"
  `, [commitSha, updates.deployStartedAt, updates.deployCompletedAt, updates.status]);
    return result.rows[0] || null;
}
export async function insertStatusCheck(serviceId, status, message) {
    await query(`
    INSERT INTO status_checks (service_id, status, message)
    VALUES ($1, $2, $3)
  `, [serviceId, status, message]);
}
export async function insertUptimeCheck(check) {
    await query(`
    INSERT INTO uptime_checks (service_id, response_time_ms, status_code, is_up, error_message)
    VALUES ($1, $2, $3, $4, $5)
  `, [check.serviceId, check.responseTimeMs, check.statusCode, check.isUp, check.errorMessage]);
}
export async function getAllCosts() {
    const result = await query(`
    SELECT
      project_id as "projectId",
      month,
      amount_cents as "amountCents",
      provider,
      notes
    FROM cost_entries
    ORDER BY month DESC, project_id
  `);
    return result.rows;
}
export async function insertCost(cost) {
    const result = await query(`
    INSERT INTO cost_entries (project_id, month, amount_cents, provider, notes)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id as "projectId", month, amount_cents as "amountCents", provider, notes
  `, [cost.projectId, cost.month, cost.amountCents, cost.provider, cost.notes]);
    return result.rows[0];
}
export async function getProject(projectId) {
    const result = await query(`SELECT alert_level as "alertLevel", alert_email as "alertEmail" FROM projects WHERE id = $1`, [projectId]);
    return result.rows[0] || null;
}
export async function insertAlert(alert) {
    await query(`
    INSERT INTO alerts (project_id, service_id, alert_type, message, channel)
    VALUES ($1, $2, $3, $4, $5)
  `, [alert.projectId, alert.serviceId, alert.alertType, alert.message, alert.channel]);
}
export async function getAllProjects() {
    const result = await query(`
    SELECT
      id,
      name,
      display_name as "displayName",
      owner,
      alert_level as "alertLevel",
      alert_email as "alertEmail",
      uptime_url as "uptimeUrl",
      production_url as "productionUrl",
      repo_name as "repoName",
      deploy_mechanism as "deployMechanism",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM projects
    ORDER BY display_name
  `);
    return result.rows;
}
export async function getProjectById(projectId) {
    const result = await query(`
    SELECT
      id,
      name,
      display_name as "displayName",
      owner,
      alert_level as "alertLevel",
      alert_email as "alertEmail",
      uptime_url as "uptimeUrl",
      production_url as "productionUrl",
      repo_name as "repoName",
      deploy_mechanism as "deployMechanism",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM projects
    WHERE id = $1
  `, [projectId]);
    return result.rows[0] || null;
}
export async function getProjectByRepoName(owner, repoName) {
    const result = await query(`
    SELECT
      id,
      name,
      display_name as "displayName",
      owner,
      alert_level as "alertLevel",
      alert_email as "alertEmail",
      uptime_url as "uptimeUrl",
      production_url as "productionUrl",
      repo_name as "repoName",
      deploy_mechanism as "deployMechanism",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM projects
    WHERE owner = $1 AND (repo_name = $2 OR name = $2)
  `, [owner, repoName]);
    return result.rows[0] || null;
}
export async function createProject(project) {
    const result = await query(`
    INSERT INTO projects (id, name, display_name, owner, alert_level, alert_email, uptime_url, production_url, repo_name, deploy_mechanism)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING
      id,
      name,
      display_name as "displayName",
      owner,
      alert_level as "alertLevel",
      alert_email as "alertEmail",
      uptime_url as "uptimeUrl",
      production_url as "productionUrl",
      repo_name as "repoName",
      deploy_mechanism as "deployMechanism",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `, [
        project.id,
        project.name,
        project.displayName,
        project.owner,
        project.alertLevel || 'hobby',
        project.alertEmail,
        project.uptimeUrl,
        project.productionUrl,
        project.repoName || project.name,
        project.deployMechanism,
    ]);
    return result.rows[0];
}
export async function updateProject(projectId, updates) {
    const result = await query(`
    UPDATE projects SET
      name = COALESCE($2, name),
      display_name = COALESCE($3, display_name),
      owner = COALESCE($4, owner),
      alert_level = COALESCE($5, alert_level),
      alert_email = COALESCE($6, alert_email),
      uptime_url = COALESCE($7, uptime_url),
      production_url = COALESCE($8, production_url),
      repo_name = COALESCE($9, repo_name),
      deploy_mechanism = COALESCE($10, deploy_mechanism),
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      name,
      display_name as "displayName",
      owner,
      alert_level as "alertLevel",
      alert_email as "alertEmail",
      uptime_url as "uptimeUrl",
      production_url as "productionUrl",
      repo_name as "repoName",
      deploy_mechanism as "deployMechanism",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `, [
        projectId,
        updates.name,
        updates.displayName,
        updates.owner,
        updates.alertLevel,
        updates.alertEmail,
        updates.uptimeUrl,
        updates.productionUrl,
        updates.repoName,
        updates.deployMechanism,
    ]);
    return result.rows[0] || null;
}
export async function deleteProject(projectId) {
    const result = await query(`DELETE FROM projects WHERE id = $1`, [projectId]);
    return (result.rowCount ?? 0) > 0;
}
// =============================================================================
// Service CRUD operations
// =============================================================================
export async function getServicesByProject(projectId) {
    const result = await query(`
    SELECT
      id,
      project_id as "projectId",
      category,
      provider,
      service_name as "serviceName",
      check_url as "checkUrl",
      dashboard_url as "dashboardUrl",
      config
    FROM services
    WHERE project_id = $1
    ORDER BY category, provider
  `, [projectId]);
    return result.rows;
}
export async function createService(service) {
    const result = await query(`
    INSERT INTO services (id, project_id, category, provider, service_name, check_url, dashboard_url, config)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING
      id,
      project_id as "projectId",
      category,
      provider,
      service_name as "serviceName",
      check_url as "checkUrl",
      dashboard_url as "dashboardUrl",
      config
  `, [
        service.id,
        service.projectId,
        service.category,
        service.provider,
        service.serviceName,
        service.checkUrl,
        service.dashboardUrl,
        JSON.stringify(service.config || {}),
    ]);
    return result.rows[0];
}
export async function updateService(serviceId, updates) {
    const result = await query(`
    UPDATE services SET
      category = COALESCE($2, category),
      provider = COALESCE($3, provider),
      service_name = COALESCE($4, service_name),
      check_url = COALESCE($5, check_url),
      dashboard_url = COALESCE($6, dashboard_url),
      config = COALESCE($7, config)
    WHERE id = $1
    RETURNING
      id,
      project_id as "projectId",
      category,
      provider,
      service_name as "serviceName",
      check_url as "checkUrl",
      dashboard_url as "dashboardUrl",
      config
  `, [
        serviceId,
        updates.category,
        updates.provider,
        updates.serviceName,
        updates.checkUrl,
        updates.dashboardUrl,
        updates.config ? JSON.stringify(updates.config) : undefined,
    ]);
    return result.rows[0] || null;
}
export async function deleteService(serviceId) {
    const result = await query(`DELETE FROM services WHERE id = $1`, [serviceId]);
    return (result.rowCount ?? 0) > 0;
}
//# sourceMappingURL=queries.js.map