// Environment configuration
export const env = {
    // Server
    port: parseInt(process.env.PORT || '8080', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV !== 'production',
    // Database
    databaseUrl: process.env.DATABASE_URL || '',
    // GitHub
    githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET || '',
    githubPatJaslr: process.env.GITHUB_PAT_JASLR || '',
    githubPatJvpUx: process.env.GITHUB_PAT_JVP_UX || '',
    // Fly.io
    flyApiToken: process.env.FLY_API_TOKEN || '',
    // Cloudflare
    cloudflareApiToken: process.env.CLOUDFLARE_API_TOKEN || '',
    cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
    // Email
    resendApiKey: process.env.RESEND_API_KEY || '',
    // API Security
    apiSecret: process.env.API_SECRET || '',
    // GCP Cloud Build
    gcpServiceAccountKey: process.env.GCP_SERVICE_ACCOUNT_KEY || '',
};
// Validate required env vars in production
export function validateEnv() {
    const required = [
        'DATABASE_URL',
        'GITHUB_WEBHOOK_SECRET',
        'FLY_API_TOKEN',
        'CLOUDFLARE_API_TOKEN',
        'CLOUDFLARE_ACCOUNT_ID',
        'API_SECRET',
    ];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0 && !env.isDev) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}
//# sourceMappingURL=env.js.map