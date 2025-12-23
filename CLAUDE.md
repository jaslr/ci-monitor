# Claude Instructions for Infrastructure Observatory

## Project Overview

This is an **Infrastructure Observatory** (working name: ci-monitor) - a comprehensive platform for monitoring CI/CD pipelines, infrastructure health, and service integrations across multiple projects and accounts.

## Development Guidelines

### Use Beads for Issue Tracking

```bash
bd ready           # Check what's ready to work on
bd create "..."    # Create new issues
bd update <id>     # Update status
bd close <id>      # Complete work
```

Always commit `.beads/issues.jsonl` with related code changes.

### Code Style

- **No emojis** in UI - use Lucide icons instead
- **Mobile-first** responsive design
- **Local-first** architecture - minimize server round-trips
- **Background data fetching** - no UI refresh flashing

### Tech Stack

- SvelteKit 2.x + Svelte 5 (use runes: `$state`, `$derived`, `$effect`)
- Tailwind CSS 4.x
- Consider Skeleton UI for component library
- Lucide for icons

### Architecture Decisions

1. **Read-only Phase 1**: Display infrastructure status, no mutations
2. **CRUD Phase 2**: Add ability to trigger actions (retries, deployments)
3. **Meta-monitoring**: Deploy watcher on separate cloud (AWS/GCP/Azure free tier)

### Infrastructure Services to Support

- **CI/CD**: GitHub Actions
- **Hosting**: Cloudflare Pages, Fly.io, Vercel, Netlify
- **Database**: Supabase, PlanetScale, Neon
- **DNS**: Cloudflare, Ventra IP, DNS Made Easy
- **Storage**: AWS S3, Cloudflare R2
- **Auth**: Supabase Auth, Auth0, Clerk
- **Analytics**: Various
- **Error Tracking**: Sentry

### Account Mapping

Track which GitHub account owns each repo:
- jvp-ux (simulations)
- jaslr (Ladderbox, Junipa)
- stickyjason (misc)
- Plus client and hobby projects

### Key Features to Build

1. CI status dashboard (current)
2. Infrastructure topology diagrams (live, animated during deploys)
3. Service health checks (DNS, domains, MX records)
4. Stack detection (framework, CSS, tools)
5. Account/identity mapping
6. Ecosystem overview diagram

### Ports

| Service | Port | Description |
|---------|------|-------------|
| SvelteKit Dev | 4573 | Main app (400 above standard 4173) |
| PocketBase | 4617 | Local DB + Admin UI at /_/ |

### Commands

```bash
npm run dev        # Start dev server on port 4573
npm run dev:all    # Start both SvelteKit + PocketBase
npm run pocketbase # Start PocketBase only (port 4617)
npm run ports      # List all listening ports
npm run ports:kill # Kill observatory ports
npm run build      # Production build
npm run check      # Type checking
bd ready           # Check beads issues
```

### Quick Commands

- **"get it live"** = Full deployment workflow (see below)

### Get It Live (Cloudflare Pages Deployment)

When asked to "get it live" for this project:

1. **Check for uncommitted changes first**:
   ```bash
   git status --porcelain
   ```
2. If there are uncommitted files, commit them with a descriptive message
3. **Bump version**:
   ```bash
   npm version patch --no-git-tag-version
   ```
4. **Commit the version bump**:
   ```bash
   git add -A && git commit -m "v0.x.x: <description>"
   ```
5. **Push to GitHub** (version control/backup):
   ```bash
   git push
   ```
6. **Deploy to Cloudflare Pages (production)**:
   ```bash
   npm run build && npx wrangler pages deploy .svelte-kit/cloudflare --project-name=ci-monitor --branch=main
   ```
   Production URL: https://ci-monitor.pages.dev

### Task Completion Protocol

When completing a task where work has been signed off:
1. Run `npm version patch --no-git-tag-version`
2. Commit with descriptive message
3. Push to GitHub
4. Deploy to Cloudflare Pages

### Deployment (Forked Workflow - No GitHub Actions)

This project uses a **forked deployment workflow**:

```
Your Machine
    │
    ├──► git push     →  GitHub (version control, backup)
    │
    └──► wrangler     →  Cloudflare Pages (production)
```

**Quick commands:**
```bash
npm version patch --no-git-tag-version                                                            # Bump version
git add -A && git commit -m "v0.x.x: ..."                                                         # Commit
git push                                                                                           # Push to GitHub
npm run build && npx wrangler pages deploy .svelte-kit/cloudflare --project-name=ci-monitor --branch=main  # Deploy to production
```

**Production URL:** https://ci-monitor.pages.dev

**Why forked?**
- Deploys directly via Wrangler - no GitHub Actions minutes consumed
- Build errors appear locally in your terminal
- Faster than waiting for CI runner to spin up
- GitHub is for version control/backup, not deployment triggers

### VS Code Tasks

- **Dev: Observatory (Full Stack)** - Starts SvelteKit + PocketBase
- **Dev: SvelteKit (Port 4573)** - Starts app only
- **Dev: PocketBase (Port 4617)** - Starts database only
- **Check: Active Ports** - Shows port usage
- **Deploy: Get It Live** - Full deployment
