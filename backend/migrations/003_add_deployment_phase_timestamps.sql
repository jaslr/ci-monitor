-- Add granular deployment phase timestamps
-- Tracks: push -> CI start -> CI complete -> deploy start -> deploy complete

-- Add phase timestamp columns to deployments table
ALTER TABLE deployments
  ADD COLUMN IF NOT EXISTS pushed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ci_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ci_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deploy_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deploy_completed_at TIMESTAMPTZ;

-- Add index for commit SHA lookups (needed to correlate CI and deploy events)
CREATE INDEX IF NOT EXISTS idx_deployments_commit_sha ON deployments(commit_sha);

-- Comment on columns for documentation
COMMENT ON COLUMN deployments.pushed_at IS 'When git push was received (workflow_run requested event)';
COMMENT ON COLUMN deployments.ci_started_at IS 'When CI workflow started running (workflow_run in_progress event)';
COMMENT ON COLUMN deployments.ci_completed_at IS 'When CI workflow completed (workflow_run completed event)';
COMMENT ON COLUMN deployments.deploy_started_at IS 'When deployment to hosting provider started';
COMMENT ON COLUMN deployments.deploy_completed_at IS 'When deployment is live on hosting provider';
