# CI Monitor

A glanceable GitHub Actions status dashboard for monitoring multiple repos across multiple accounts.

**Live:** https://ci-monitor.pages.dev

## Features

- Status indicators: green (success), red (failure), yellow (in progress), grey (unknown)
- Toggle to show last run dates
- Sort by: A-Z, Account, or Most Recent
- Click any repo to go directly to its GitHub Actions page

## Tech Stack

- SvelteKit
- Tailwind CSS
- Cloudflare Pages

## Configuration

Edit `src/lib/config/repos.ts` to add/remove repos:

```ts
export const repos: Record<string, string[]> = {
  jaslr: ['repo1', 'repo2'],
  'jvp-ux': ['repo3', 'repo4']
};
```

## Environment Variables

Set these in Cloudflare Pages (Settings > Environment Variables):

- `GITHUB_PAT_JASLR` - GitHub PAT for jaslr account
- `GITHUB_PAT_JVP_UX` - GitHub PAT for jvp-ux account

PATs need `repo` and `workflow` scopes.

## Development

```bash
npm install
cp .env.example .env
# Edit .env with your PATs
npm run dev
```

## Deployment

```bash
npm run build
wrangler pages deploy .svelte-kit/cloudflare --project-name ci-monitor
```
