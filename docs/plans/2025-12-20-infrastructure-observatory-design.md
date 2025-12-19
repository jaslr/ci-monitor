# Infrastructure Observatory Design

**Date**: 2025-12-20
**Status**: In Progress
**Epic**: ci-monitor-r7f

## Overview

Transform the CI Monitor into a comprehensive Infrastructure Observatory that provides visibility into:
- CI/CD pipeline status
- Infrastructure health (DNS, hosting, databases, auth)
- Service integrations across multiple projects
- Account/identity mapping
- Tech stack detection
- Local port usage tracking

## Architecture

### Core Principles

1. **Local-first**: Browser storage and local services for speed
2. **Background refresh**: Data fetched in background, no UI flashing
3. **Auto-discovery**: Programmatically identify infrastructure from code/config
4. **Mobile-responsive**: Works on all devices
5. **No emojis**: Use Lucide icons throughout

### Data Model

Types defined in `src/lib/types/infrastructure.ts`:

- **Project**: The monitored entity (repo + identity mapping)
- **InfraService**: Infrastructure service connected to a project
- **TechStack**: Framework, CSS, build tools, etc.
- **DnsInfo**: Domain and DNS provider information
- **PortUsage**: Local development port tracking
- **InfraTopology**: Node/edge graph for flow diagrams

### Discovery Methods

1. **package.json scanning**: Detect dependencies -> services
2. **Config file scanning**: wrangler.toml, fly.toml, vercel.json
3. **Environment variable parsing**: .env.example hints
4. **DNS-over-HTTPS queries**: Discover DNS provider, MX records, hosting
5. **API probing**: Health checks on known endpoints

### Services Supported

| Category | Providers |
|----------|-----------|
| Hosting | Cloudflare Pages, Fly.io, Vercel, Netlify |
| Database | Supabase, PlanetScale, Neon, PostgreSQL |
| Auth | Supabase Auth, Auth.js, Clerk |
| Storage | AWS S3, Cloudflare R2 |
| DNS | Cloudflare, AWS Route 53, DNS Made Easy, VentraIP |
| Monitoring | Sentry |
| CI/CD | GitHub Actions |

### Local Backend

- **PocketBase** on port 4617 for data persistence
- **SvelteKit** dev server on port 4573
- Ports chosen to avoid conflicts (400+ above standard)

## UI Design

### Main Dashboard

- List of projects with CI status (green/yellow/red dots)
- Click to expand and see infrastructure breakdown
- Sort by: name, account, recent activity
- Toggle: show dates

### Expanded Row (Infrastructure Panel)

- Tech stack badges (framework, CSS, build tool, language)
- Services grouped by category with provider colors
- DNS information
- Discovery notes/errors

### Future: Infrastructure Flow Diagram

- Live animated diagram showing data flow
- Nodes: User -> CDN -> Hosting -> API -> Database
- Edges animate during deployments
- Click node for details

## Implementation Phases

### Phase 1: Read-Only (Current)

- [x] Data model and types
- [x] Discovery service (package.json, config files)
- [x] DNS-over-HTTPS lookup
- [x] Expandable row UI
- [ ] Port tracking
- [ ] PocketBase integration

### Phase 2: CRUD

- Trigger CI reruns
- Trigger deployments
- Edit project configuration

### Phase 3: Meta-Monitoring

- Deploy watcher on separate cloud (AWS/GCP/Azure free tier)
- "Who watches the watcher" resilience

## Ports Reference

| Service | Port |
|---------|------|
| SvelteKit Dev | 4573 |
| PocketBase | 4617 |
| Livna Supabase | 55321-55324 |

## Files Created

- `src/lib/types/infrastructure.ts` - Core types
- `src/lib/services/discovery.ts` - Service discovery
- `src/lib/services/dns-lookup.ts` - DNS-over-HTTPS queries
- `src/lib/services/project-scanner.ts` - Project scanning
- `src/routes/api/scan/+server.ts` - Scan API endpoint
- `.vscode/tasks.json` - VS Code tasks
- `scripts/get-it-live.js` - Deployment automation
- `CLAUDE.md` - Claude instructions
- `AGENTS.md` - Agent instructions

## Accounts/Identities

| Identity | GitHub | Projects |
|----------|--------|----------|
| jaslr | jaslr | Livna, Ladderbox, Brontiq, hobby |
| jvp-ux | jvp-ux | Junipa, Vast Puddle |
| stickyjason | stickyjason | Misc |
| client | various | LAT&A, Brontic |
