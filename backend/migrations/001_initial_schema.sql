-- Observatory Backend Initial Schema
-- Run with: psql $DATABASE_URL -f migrations/001_initial_schema.sql

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  owner TEXT NOT NULL,
  alert_level TEXT DEFAULT 'hobby' CHECK (alert_level IN ('hobby', 'business')),
  alert_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  provider TEXT NOT NULL,
  service_name TEXT NOT NULL,
  check_url TEXT,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Status checks - point-in-time snapshots
CREATE TABLE IF NOT EXISTS status_checks (
  id SERIAL PRIMARY KEY,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'down', 'unknown')),
  message TEXT,
  raw_data JSONB,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deployments from CI/CD
CREATE TABLE IF NOT EXISTS deployments (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'in_progress', 'success', 'failure')),
  commit_sha TEXT,
  branch TEXT,
  run_url TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Uptime checks
CREATE TABLE IF NOT EXISTS uptime_checks (
  id SERIAL PRIMARY KEY,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  url TEXT,
  response_time_ms INTEGER,
  status_code INTEGER,
  is_up BOOLEAN NOT NULL,
  error_message TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts sent
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  service_id TEXT REFERENCES services(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL,
  message TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('ui', 'email', 'slack', 'sms')),
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cost entries (manual since Fly.io billing API not public)
CREATE TABLE IF NOT EXISTS cost_entries (
  id SERIAL PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  amount_cents INTEGER NOT NULL,
  provider TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, month, provider)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_status_checks_service_checked ON status_checks(service_id, checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_deployments_service_created ON deployments(service_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_uptime_checks_service_checked ON uptime_checks(service_id, checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_project_sent ON alerts(project_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_cost_entries_project_month ON cost_entries(project_id, month DESC);

-- Seed initial projects and services (from config/projects.ts)
INSERT INTO projects (id, name, display_name, owner, alert_level) VALUES
  ('livna', 'livna', 'Livna', 'jaslr', 'business'),
  ('ladderbox', 'Ladderbox', 'Ladderbox', 'jaslr', 'business'),
  ('ci-monitor', 'ci-monitor', 'Infrastructure Observatory', 'jaslr', 'hobby'),
  ('littlelistoflights', 'littlelistoflights', 'Little List of Lights', 'jaslr', 'hobby'),
  ('brontiq', 'brontiq', 'Brontiq', 'jaslr', 'hobby'),
  ('shippywhippy', 'shippywhippy', 'ShippyWhippy', 'jaslr', 'hobby'),
  ('loadmanagement', 'loadmanagement', 'Load Management', 'jaslr', 'hobby')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  owner = EXCLUDED.owner,
  alert_level = EXCLUDED.alert_level,
  updated_at = NOW();

-- Seed services
INSERT INTO services (id, project_id, category, provider, service_name) VALUES
  -- Livna
  ('livna-hosting', 'livna', 'hosting', 'cloudflare', 'Cloudflare Pages'),
  ('livna-db', 'livna', 'database', 'supabase', 'Supabase'),
  ('livna-ci', 'livna', 'ci', 'github', 'GitHub Actions'),
  ('livna-monitoring', 'livna', 'monitoring', 'sentry', 'Sentry'),
  -- Ladderbox
  ('ladderbox-hosting', 'ladderbox', 'hosting', 'flyio', 'Fly.io'),
  ('ladderbox-db', 'ladderbox', 'database', 'supabase', 'Supabase'),
  ('ladderbox-ci', 'ladderbox', 'ci', 'github', 'GitHub Actions'),
  -- ci-monitor
  ('ci-monitor-hosting', 'ci-monitor', 'hosting', 'cloudflare', 'Cloudflare Pages'),
  ('ci-monitor-ci', 'ci-monitor', 'ci', 'github', 'GitHub Actions'),
  -- Little List of Lights
  ('littlelistoflights-hosting', 'littlelistoflights', 'hosting', 'cloudflare', 'Cloudflare Pages'),
  ('littlelistoflights-db', 'littlelistoflights', 'database', 'supabase', 'Supabase'),
  ('littlelistoflights-ci', 'littlelistoflights', 'ci', 'github', 'GitHub Actions'),
  -- Brontiq
  ('brontiq-ci', 'brontiq', 'ci', 'github', 'GitHub Actions'),
  -- ShippyWhippy
  ('shippywhippy-hosting', 'shippywhippy', 'hosting', 'cloudflare', 'Cloudflare Pages'),
  ('shippywhippy-ci', 'shippywhippy', 'ci', 'github', 'GitHub Actions'),
  -- Load Management
  ('loadmanagement-ci', 'loadmanagement', 'ci', 'github', 'GitHub Actions')
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  provider = EXCLUDED.provider,
  service_name = EXCLUDED.service_name;
