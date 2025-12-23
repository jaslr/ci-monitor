import { query } from './client.js';

// Types
export interface ProjectStatus {
  projectId: string;
  status: 'healthy' | 'degraded' | 'down' | 'unknown';
  message?: string;
  checkedAt: Date;
}

export interface Deployment {
  id: string;
  serviceId: string;
  provider: string;
  status: 'queued' | 'in_progress' | 'success' | 'failure';
  commitSha?: string;
  branch?: string;
  runUrl?: string;
  // Legacy timestamps (kept for backwards compat)
  startedAt?: Date;
  completedAt?: Date;
  // Granular phase timestamps
  pushedAt?: Date;        // When git push was received
  ciStartedAt?: Date;     // When CI workflow started
  ciCompletedAt?: Date;   // When CI workflow completed
  deployStartedAt?: Date; // When deploy to hosting started
  deployCompletedAt?: Date; // When deploy is live
}

export interface UptimeCheck {
  serviceId: string;
  responseTimeMs?: number;
  statusCode?: number;
  isUp: boolean;
  checkedAt: Date;
}

export interface CostEntry {
  projectId: string;
  month: string;
  amountCents: number;
  provider: string;
  notes?: string;
}

// Queries
export async function getLatestStatusForAllProjects(): Promise<ProjectStatus[]> {
  const result = await query<ProjectStatus>(`
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

export async function getLatestStatus(projectId: string): Promise<ProjectStatus | null> {
  const result = await query<ProjectStatus>(
    `
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
  `,
    [projectId]
  );
  return result.rows[0] || null;
}

export async function getRecentDeployments(projectId: string, limit: number): Promise<Deployment[]> {
  const result = await query<Deployment>(
    `
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
  `,
    [projectId, limit]
  );
  return result.rows;
}

export async function getUptimeHistory(
  projectId: string,
  hours: number
): Promise<UptimeCheck[]> {
  const result = await query<UptimeCheck>(
    `
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
  `,
    [projectId, hours]
  );
  return result.rows;
}

export async function getStatusHistory(
  projectId: string,
  hours: number
): Promise<ProjectStatus[]> {
  const result = await query<ProjectStatus>(
    `
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
  `,
    [projectId, hours]
  );
  return result.rows;
}

export async function insertDeployment(deployment: Deployment): Promise<void> {
  await query(
    `
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
  `,
    [
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
    ]
  );
}

// Update deployment timestamps by commit SHA (for correlating CI and deploy events)
export async function updateDeploymentByCommit(
  commitSha: string,
  updates: Partial<Pick<Deployment, 'deployStartedAt' | 'deployCompletedAt' | 'status'>>
): Promise<Deployment | null> {
  const result = await query<Deployment>(
    `
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
  `,
    [commitSha, updates.deployStartedAt, updates.deployCompletedAt, updates.status]
  );
  return result.rows[0] || null;
}

export async function insertStatusCheck(
  serviceId: string,
  status: string,
  message?: string
): Promise<void> {
  await query(
    `
    INSERT INTO status_checks (service_id, status, message)
    VALUES ($1, $2, $3)
  `,
    [serviceId, status, message]
  );
}

export async function insertUptimeCheck(check: {
  serviceId: string;
  url: string;
  responseTimeMs?: number;
  statusCode?: number;
  isUp: boolean;
  errorMessage?: string;
}): Promise<void> {
  await query(
    `
    INSERT INTO uptime_checks (service_id, response_time_ms, status_code, is_up, error_message)
    VALUES ($1, $2, $3, $4, $5)
  `,
    [check.serviceId, check.responseTimeMs, check.statusCode, check.isUp, check.errorMessage]
  );
}

export async function getAllCosts(): Promise<CostEntry[]> {
  const result = await query<CostEntry>(`
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

export async function insertCost(cost: CostEntry): Promise<CostEntry> {
  const result = await query<CostEntry>(
    `
    INSERT INTO cost_entries (project_id, month, amount_cents, provider, notes)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id as "projectId", month, amount_cents as "amountCents", provider, notes
  `,
    [cost.projectId, cost.month, cost.amountCents, cost.provider, cost.notes]
  );
  return result.rows[0];
}

export async function getProject(projectId: string): Promise<{ alertLevel: string; alertEmail?: string } | null> {
  const result = await query<{ alertLevel: string; alertEmail?: string }>(
    `SELECT alert_level as "alertLevel", alert_email as "alertEmail" FROM projects WHERE id = $1`,
    [projectId]
  );
  return result.rows[0] || null;
}

export async function insertAlert(alert: {
  projectId: string;
  serviceId?: string;
  alertType: string;
  message: string;
  channel: string;
}): Promise<void> {
  await query(
    `
    INSERT INTO alerts (project_id, service_id, alert_type, message, channel)
    VALUES ($1, $2, $3, $4, $5)
  `,
    [alert.projectId, alert.serviceId, alert.alertType, alert.message, alert.channel]
  );
}
