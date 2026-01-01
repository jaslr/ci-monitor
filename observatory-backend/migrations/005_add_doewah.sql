-- Add Doewah project and services
-- Run with: psql $DATABASE_URL -f migrations/005_add_doewah.sql

INSERT INTO projects (id, name, display_name, owner, alert_level) VALUES
  ('doewah', 'doewah', 'Doewah', 'jaslr', 'hobby')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  owner = EXCLUDED.owner,
  alert_level = EXCLUDED.alert_level,
  updated_at = NOW();

INSERT INTO services (id, project_id, category, provider, service_name, config) VALUES
  ('doewah-ci', 'doewah', 'ci', 'github', 'GitHub Actions', '{}')
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  provider = EXCLUDED.provider,
  service_name = EXCLUDED.service_name,
  config = EXCLUDED.config;
