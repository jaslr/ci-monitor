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

### Get It Live (Deployment)

When asked to "get it live":
```bash
npm run get-it-live
```

This automated script:
1. Checks for uncommitted changes
2. Bumps version (patch)
3. Stages all changes
4. Runs lint/fix
5. Commits with version message
6. Pushes to remote
7. Monitors GitHub Actions until complete
8. Reports Cloudflare deployment status

**Manual steps if needed:**
```bash
npm run version:patch     # Bump version
git add -A                # Stage changes
npm run check             # Fix any type errors
git commit -m "message"   # Commit
git push                  # Push
gh run watch              # Monitor GitHub Actions
```

### VS Code Tasks

- **Dev: Observatory (Full Stack)** - Starts SvelteKit + PocketBase
- **Dev: SvelteKit (Port 4573)** - Starts app only
- **Dev: PocketBase (Port 4617)** - Starts database only
- **Check: Active Ports** - Shows port usage
- **Deploy: Get It Live** - Full deployment
