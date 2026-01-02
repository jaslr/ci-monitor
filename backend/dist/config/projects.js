// Project configuration - synced with orchon frontend
// This defines which projects we monitor and their alert levels
// Projects to monitor - matches ci-monitor/src/lib/config/repos.ts
export const projects = [
    {
        id: 'livna',
        name: 'livna',
        displayName: 'Livna',
        owner: 'jaslr',
        alertLevel: 'business',
        uptimeUrl: 'https://livna.anvilenterprises.com.au',
        services: [
            { id: 'livna-hosting', category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', cfProjectName: 'livna' },
            { id: 'livna-db', category: 'database', provider: 'supabase', serviceName: 'Supabase Database', supabaseProjectRef: 'vtyfsrpupgrkkbnsiuqe' },
            { id: 'livna-auth', category: 'auth', provider: 'supabase', serviceName: 'Supabase Auth', supabaseProjectRef: 'vtyfsrpupgrkkbnsiuqe' },
            { id: 'livna-ci', category: 'ci', provider: 'github', serviceName: 'GitHub Actions' },
            { id: 'livna-monitoring', category: 'monitoring', provider: 'sentry', serviceName: 'Sentry' },
        ],
    },
    {
        id: 'ladderbox',
        name: 'Ladderbox',
        displayName: 'Ladderbox',
        owner: 'jaslr',
        alertLevel: 'business',
        uptimeUrl: 'https://ladderbox.fly.dev',
        services: [
            { id: 'ladderbox-hosting', category: 'hosting', provider: 'flyio', serviceName: 'Fly.io', flyAppName: 'ladderbox' },
            { id: 'ladderbox-db', category: 'database', provider: 'supabase', serviceName: 'Supabase Database' }, // TODO: Add supabaseProjectRef
            { id: 'ladderbox-ci', category: 'ci', provider: 'github', serviceName: 'GitHub Actions' },
        ],
    },
    {
        id: 'orchon',
        name: 'orchon',
        displayName: 'Orchon',
        owner: 'jaslr',
        alertLevel: 'hobby',
        uptimeUrl: 'https://orchon.pages.dev',
        services: [
            { id: 'orchon-hosting', category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', cfProjectName: 'orchon' },
            { id: 'orchon-ci', category: 'ci', provider: 'github', serviceName: 'GitHub Actions' },
        ],
    },
    {
        id: 'littlelistoflights',
        name: 'littlelistoflights',
        displayName: 'Little List of Lights',
        owner: 'jaslr',
        alertLevel: 'hobby',
        uptimeUrl: 'https://littlelistoflights.com',
        services: [
            { id: 'littlelistoflights-hosting', category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', cfProjectName: 'littlelistoflights' },
            { id: 'littlelistoflights-db', category: 'database', provider: 'supabase', serviceName: 'Supabase Database', supabaseProjectRef: 'hjrawccyhnvtwulzfbbo' },
            { id: 'littlelistoflights-ci', category: 'ci', provider: 'github', serviceName: 'GitHub Actions' },
        ],
    },
    {
        id: 'brontiq',
        name: 'brontiq',
        displayName: 'Brontiq',
        owner: 'jaslr',
        alertLevel: 'hobby',
        services: [
            { id: 'brontiq-ci', category: 'ci', provider: 'github', serviceName: 'GitHub Actions' },
        ],
    },
    {
        id: 'shippywhippy',
        name: 'shippywhippy',
        displayName: 'ShippyWhippy',
        owner: 'jaslr',
        alertLevel: 'hobby',
        uptimeUrl: 'https://shippywhippy-admin.pages.dev',
        services: [
            { id: 'shippywhippy-hosting', category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', cfProjectName: 'shippywhippy-admin' },
            { id: 'shippywhippy-ci', category: 'ci', provider: 'github', serviceName: 'GitHub Actions' },
        ],
    },
    // loadmanagement - MCP server, no hosting needed
    {
        id: 'loadmanagement',
        name: 'loadmanagement',
        displayName: 'Load Management',
        owner: 'jaslr',
        alertLevel: 'hobby',
        services: [
            { id: 'loadmanagement-ci', category: 'ci', provider: 'github', serviceName: 'GitHub Actions' },
        ],
    },
    {
        id: 'workwithchip',
        name: 'workwithchip',
        displayName: 'Work With Chip',
        owner: 'jaslr',
        alertLevel: 'hobby',
        uptimeUrl: 'https://workwithchip.com',
        services: [
            { id: 'workwithchip-hosting', category: 'hosting', provider: 'cloudflare', serviceName: 'Cloudflare Pages', cfProjectName: 'workwithchip' },
        ],
    },
    // Junipa - Main tenant app (GCP Cloud Build)
    {
        id: 'junipa-demo',
        name: 'junipa',
        displayName: 'Junipa Demo',
        owner: 'jvp-ux',
        alertLevel: 'business',
        uptimeUrl: 'https://demo2.junipa.com.au',
        services: [
            { id: 'junipa-demo-ci', category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', gcpProjectId: 'junipa' },
        ],
    },
    {
        id: 'junipa-cedarcollege',
        name: 'junipa',
        displayName: 'Junipa - Cedar College',
        owner: 'jvp-ux',
        alertLevel: 'business',
        uptimeUrl: 'https://cedarcollege.junipa.com.au',
        services: [
            { id: 'junipa-cedarcollege-ci', category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', gcpProjectId: 'cedarcollege-prod' },
        ],
    },
    {
        id: 'junipa-menofbusiness',
        name: 'junipa',
        displayName: 'Junipa - Men of Business',
        owner: 'jvp-ux',
        alertLevel: 'business',
        uptimeUrl: 'https://menofbusiness.junipa.com.au',
        services: [
            { id: 'junipa-menofbusiness-ci', category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', gcpProjectId: 'menofbusiness-prod' },
        ],
    },
    {
        id: 'junipa-mjc',
        name: 'junipa',
        displayName: 'Junipa - MJC',
        owner: 'jvp-ux',
        alertLevel: 'business',
        uptimeUrl: 'https://mjc.junipa.com.au',
        services: [
            { id: 'junipa-mjc-ci', category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', gcpProjectId: 'mjc-prod-2022b' },
        ],
    },
    {
        id: 'junipa-tuncurry',
        name: 'junipa',
        displayName: 'Junipa - Tuncurry',
        owner: 'jvp-ux',
        alertLevel: 'business',
        uptimeUrl: 'https://tuncurry.junipa.com.au',
        services: [
            { id: 'junipa-tuncurry-ci', category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', gcpProjectId: 'mjc-tuncurry-prod' },
        ],
    },
    {
        id: 'junipa-central-demo',
        name: 'junipa',
        displayName: 'Junipa Central Demo',
        owner: 'jvp-ux',
        alertLevel: 'business',
        uptimeUrl: 'https://junipacentral.junipa.com.au',
        services: [
            { id: 'junipa-central-ci', category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', gcpProjectId: 'junipa-central-demo' },
        ],
    },
    {
        id: 'junipa-west-demo',
        name: 'junipa',
        displayName: 'Junipa West Demo',
        owner: 'jvp-ux',
        alertLevel: 'business',
        uptimeUrl: 'https://junipawest.junipa.com.au',
        services: [
            { id: 'junipa-west-ci', category: 'ci', provider: 'gcp', serviceName: 'GCP Cloud Build', gcpProjectId: 'junipa-west-demo' },
        ],
    },
    // Junipa Organisations - Org hub (GitHub Actions)
    {
        id: 'junipa-organisations',
        name: 'junipa-organisations',
        displayName: 'Junipa Organisations',
        owner: 'jvp-ux',
        alertLevel: 'business',
        uptimeUrl: 'https://organisation.junipa.com.au',
        services: [
            { id: 'junipa-org-ci', category: 'ci', provider: 'github', serviceName: 'GitHub Actions' },
        ],
    },
];
// Helper to find project by repo name
export function getProjectByRepo(repoName) {
    return projects.find((p) => p.name.toLowerCase() === repoName.toLowerCase());
}
// Helper to find project by owner and repo
export function getProjectByOwnerRepo(owner, repo) {
    return projects.find((p) => p.owner.toLowerCase() === owner.toLowerCase() && p.name.toLowerCase() === repo.toLowerCase());
}
//# sourceMappingURL=projects.js.map