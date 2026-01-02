-- Add Junipa projects and services
-- Run with: psql $DATABASE_URL -f migrations/002_add_junipa_projects.sql

-- Add workwithchip (was missing from initial seed)
INSERT INTO projects (id, name, display_name, owner, alert_level) VALUES
  ('workwithchip', 'workwithchip', 'Work With Chip', 'jaslr', 'hobby')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  owner = EXCLUDED.owner,
  alert_level = EXCLUDED.alert_level,
  updated_at = NOW();

INSERT INTO services (id, project_id, category, provider, service_name) VALUES
  ('workwithchip-hosting', 'workwithchip', 'hosting', 'cloudflare', 'Cloudflare Pages')
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  provider = EXCLUDED.provider,
  service_name = EXCLUDED.service_name;

-- Junipa tenant projects (GCP Cloud Build)
INSERT INTO projects (id, name, display_name, owner, alert_level) VALUES
  ('junipa-demo', 'junipa', 'Junipa Demo', 'jvp-ux', 'business'),
  ('junipa-cedarcollege', 'junipa', 'Junipa - Cedar College', 'jvp-ux', 'business'),
  ('junipa-menofbusiness', 'junipa', 'Junipa - Men of Business', 'jvp-ux', 'business'),
  ('junipa-mjc', 'junipa', 'Junipa - MJC', 'jvp-ux', 'business'),
  ('junipa-tuncurry', 'junipa', 'Junipa - Tuncurry', 'jvp-ux', 'business'),
  ('junipa-central-demo', 'junipa', 'Junipa Central Demo', 'jvp-ux', 'business'),
  ('junipa-west-demo', 'junipa', 'Junipa West Demo', 'jvp-ux', 'business'),
  ('junipa-organisations', 'junipa-organisations', 'Junipa Organisations', 'jvp-ux', 'business')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  owner = EXCLUDED.owner,
  alert_level = EXCLUDED.alert_level,
  updated_at = NOW();

-- Junipa services
INSERT INTO services (id, project_id, category, provider, service_name, config) VALUES
  ('junipa-demo-ci', 'junipa-demo', 'ci', 'gcp', 'GCP Cloud Build', '{"gcpProjectId": "junipa"}'),
  ('junipa-cedarcollege-ci', 'junipa-cedarcollege', 'ci', 'gcp', 'GCP Cloud Build', '{"gcpProjectId": "cedarcollege-prod"}'),
  ('junipa-menofbusiness-ci', 'junipa-menofbusiness', 'ci', 'gcp', 'GCP Cloud Build', '{"gcpProjectId": "menofbusiness-prod"}'),
  ('junipa-mjc-ci', 'junipa-mjc', 'ci', 'gcp', 'GCP Cloud Build', '{"gcpProjectId": "mjc-prod-2022b"}'),
  ('junipa-tuncurry-ci', 'junipa-tuncurry', 'ci', 'gcp', 'GCP Cloud Build', '{"gcpProjectId": "mjc-tuncurry-prod"}'),
  ('junipa-central-ci', 'junipa-central-demo', 'ci', 'gcp', 'GCP Cloud Build', '{"gcpProjectId": "junipa-central-demo"}'),
  ('junipa-west-ci', 'junipa-west-demo', 'ci', 'gcp', 'GCP Cloud Build', '{"gcpProjectId": "junipa-west-demo"}'),
  ('junipa-org-ci', 'junipa-organisations', 'ci', 'github', 'GitHub Actions', '{}')
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  provider = EXCLUDED.provider,
  service_name = EXCLUDED.service_name,
  config = EXCLUDED.config;
