-- Add missing project configuration fields
-- Run with: psql $DATABASE_URL -f migrations/004_add_project_config_fields.sql

-- Add new columns to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS uptime_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS production_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS repo_name TEXT;  -- GitHub repo name (may differ from project id, e.g., 'wwc' vs 'workwithchip')
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deploy_mechanism TEXT CHECK (deploy_mechanism IN ('github-actions', 'local-wrangler', 'local-fly', 'gcp-cloudbuild'));

-- Add dashboard_url to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS dashboard_url TEXT;

-- Update existing projects with uptime_url and deploy_mechanism
UPDATE projects SET
  uptime_url = CASE id
    WHEN 'livna' THEN 'https://livna.anvilenterprises.com.au'
    WHEN 'ladderbox' THEN 'https://ladderbox.fly.dev'
    WHEN 'ci-monitor' THEN 'https://ci-monitor.pages.dev'
    WHEN 'littlelistoflights' THEN 'https://littlelistoflights.com'
    WHEN 'shippywhippy' THEN 'https://shippywhippy-admin.pages.dev'
    WHEN 'workwithchip' THEN 'https://workwithchip.com'
    WHEN 'junipa-demo' THEN 'https://demo2.junipa.com.au'
    WHEN 'junipa-cedarcollege' THEN 'https://cedarcollege.junipa.com.au'
    WHEN 'junipa-menofbusiness' THEN 'https://menofbusiness.junipa.com.au'
    WHEN 'junipa-mjc' THEN 'https://mjc.junipa.com.au'
    WHEN 'junipa-tuncurry' THEN 'https://tuncurry.junipa.com.au'
    WHEN 'junipa-central-demo' THEN 'https://junipacentral.junipa.com.au'
    WHEN 'junipa-west-demo' THEN 'https://junipawest.junipa.com.au'
    WHEN 'junipa-organisations' THEN 'https://organisation.junipa.com.au'
    ELSE uptime_url
  END,
  production_url = CASE id
    WHEN 'livna' THEN 'https://livna.pages.dev'
    WHEN 'ladderbox' THEN 'https://ladderbox.fly.dev'
    WHEN 'ci-monitor' THEN 'https://ci-monitor.pages.dev'
    WHEN 'littlelistoflights' THEN 'https://littlelistoflights.pages.dev'
    WHEN 'brontiq' THEN 'https://brontiq.fly.dev'
    WHEN 'shippywhippy' THEN 'https://shippywhippy.fly.dev'
    WHEN 'workwithchip' THEN 'https://workwithchip.pages.dev'
    ELSE production_url
  END,
  repo_name = CASE id
    WHEN 'workwithchip' THEN 'wwc'
    WHEN 'ladderbox' THEN 'Ladderbox'
    ELSE name
  END,
  deploy_mechanism = CASE id
    WHEN 'livna' THEN 'local-wrangler'
    WHEN 'ladderbox' THEN 'local-fly'
    WHEN 'ci-monitor' THEN 'local-wrangler'
    WHEN 'littlelistoflights' THEN 'local-wrangler'
    WHEN 'brontiq' THEN 'github-actions'
    WHEN 'shippywhippy' THEN 'github-actions'
    WHEN 'loadmanagement' THEN 'github-actions'
    WHEN 'workwithchip' THEN 'github-actions'
    WHEN 'junipa-demo' THEN 'gcp-cloudbuild'
    WHEN 'junipa-cedarcollege' THEN 'gcp-cloudbuild'
    WHEN 'junipa-menofbusiness' THEN 'gcp-cloudbuild'
    WHEN 'junipa-mjc' THEN 'gcp-cloudbuild'
    WHEN 'junipa-tuncurry' THEN 'gcp-cloudbuild'
    WHEN 'junipa-central-demo' THEN 'gcp-cloudbuild'
    WHEN 'junipa-west-demo' THEN 'gcp-cloudbuild'
    WHEN 'junipa-organisations' THEN 'github-actions'
    ELSE deploy_mechanism
  END
WHERE id IN (
  'livna', 'ladderbox', 'ci-monitor', 'littlelistoflights', 'brontiq',
  'shippywhippy', 'loadmanagement', 'workwithchip',
  'junipa-demo', 'junipa-cedarcollege', 'junipa-menofbusiness', 'junipa-mjc',
  'junipa-tuncurry', 'junipa-central-demo', 'junipa-west-demo', 'junipa-organisations'
);

-- Update services with dashboard URLs
UPDATE services SET dashboard_url = CASE id
  -- Cloudflare Pages
  WHEN 'livna-hosting' THEN 'https://dash.cloudflare.com/?to=/:account/pages/view/livna'
  WHEN 'ci-monitor-hosting' THEN 'https://dash.cloudflare.com/?to=/:account/pages/view/ci-monitor'
  WHEN 'littlelistoflights-hosting' THEN 'https://dash.cloudflare.com/?to=/:account/pages/view/littlelistoflights'
  WHEN 'shippywhippy-hosting' THEN 'https://dash.cloudflare.com/?to=/:account/pages/view/shippywhippy-admin'
  WHEN 'workwithchip-hosting' THEN 'https://dash.cloudflare.com/?to=/:account/pages/view/workwithchip'
  -- Fly.io
  WHEN 'ladderbox-hosting' THEN 'https://fly.io/apps/ladderbox'
  -- GitHub Actions
  WHEN 'livna-ci' THEN 'https://github.com/jaslr/livna/actions'
  WHEN 'ladderbox-ci' THEN 'https://github.com/jaslr/Ladderbox/actions'
  WHEN 'ci-monitor-ci' THEN 'https://github.com/jaslr/ci-monitor/actions'
  WHEN 'littlelistoflights-ci' THEN 'https://github.com/jaslr/littlelistoflights/actions'
  WHEN 'brontiq-ci' THEN 'https://github.com/jaslr/brontiq/actions'
  WHEN 'shippywhippy-ci' THEN 'https://github.com/jaslr/shippywhippy/actions'
  WHEN 'loadmanagement-ci' THEN 'https://github.com/jaslr/loadmanagement/actions'
  -- GCP Cloud Build
  WHEN 'junipa-demo-ci' THEN 'https://console.cloud.google.com/cloud-build/builds?project=junipa'
  WHEN 'junipa-cedarcollege-ci' THEN 'https://console.cloud.google.com/cloud-build/builds?project=cedarcollege-prod'
  WHEN 'junipa-menofbusiness-ci' THEN 'https://console.cloud.google.com/cloud-build/builds?project=menofbusiness-prod'
  WHEN 'junipa-mjc-ci' THEN 'https://console.cloud.google.com/cloud-build/builds?project=mjc-prod-2022b'
  WHEN 'junipa-tuncurry-ci' THEN 'https://console.cloud.google.com/cloud-build/builds?project=mjc-tuncurry-prod'
  WHEN 'junipa-central-ci' THEN 'https://console.cloud.google.com/cloud-build/builds?project=junipa-central-demo'
  WHEN 'junipa-west-ci' THEN 'https://console.cloud.google.com/cloud-build/builds?project=junipa-west-demo'
  WHEN 'junipa-org-ci' THEN 'https://github.com/jvp-ux/junipa-organisations/actions'
  ELSE dashboard_url
END
WHERE id IN (
  'livna-hosting', 'ci-monitor-hosting', 'littlelistoflights-hosting', 'shippywhippy-hosting', 'workwithchip-hosting',
  'ladderbox-hosting',
  'livna-ci', 'ladderbox-ci', 'ci-monitor-ci', 'littlelistoflights-ci', 'brontiq-ci', 'shippywhippy-ci', 'loadmanagement-ci',
  'junipa-demo-ci', 'junipa-cedarcollege-ci', 'junipa-menofbusiness-ci', 'junipa-mjc-ci', 'junipa-tuncurry-ci',
  'junipa-central-ci', 'junipa-west-ci', 'junipa-org-ci'
);

-- Create index for repo lookups
CREATE INDEX IF NOT EXISTS idx_projects_repo_name ON projects(repo_name);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner);
