# ORCHON - Infrastructure Observatory & DevOps Control Plane

## Project Overview

**ORCHON** is a comprehensive infrastructure monitoring and DevOps control platform with multiple interfaces:

| Component | Location | Purpose |
|-----------|----------|---------|
| Web Dashboard | `web/` | SvelteKit frontend on Cloudflare Pages |
| Backend API | `backend/` | Hono + Postgres on Fly.io |
| Mobile App | `app/` | Flutter app with OTA updates |
| Droplet Services | `droplet/` | Bot, WebSocket, OTA server on DigitalOcean |

---

## Monorepo Structure

```
orchon/
├── web/                    # SvelteKit frontend (Cloudflare Pages)
│   ├── src/
│   ├── package.json
│   └── wrangler.toml
├── backend/                # Hono API (Fly.io)
│   ├── src/
│   ├── migrations/
│   ├── fly.toml
│   └── Dockerfile
├── app/                    # Flutter mobile app
│   ├── lib/
│   ├── android/
│   └── pubspec.yaml
├── droplet/                # DigitalOcean Droplet services
│   ├── bot/                # Telegram bot
│   ├── ws/                 # WebSocket + OTA servers
│   ├── orchestrator/       # NLP routing
│   ├── contexts/           # Project context files
│   └── systemd/            # Service definitions
└── scripts/                # Deployment scripts
```

---

## Infrastructure Layout

| Component | Platform | URL/Port | Purpose |
|-----------|----------|----------|---------|
| Web Dashboard | Cloudflare Pages | https://orchon.pages.dev | Status UI |
| Backend API | Fly.io | https://observatory-backend.fly.dev | REST API + webhooks |
| WebSocket | Droplet :8405 | ws://209.38.85.244:8405 | Real-time Claude threads |
| OTA Server | Droplet :8406 | http://209.38.85.244:8406 | App updates |
| Telegram Bot | Droplet | @orchon_bot | Chat control |
| Database | Fly.io Postgres | Internal | Deployment data |

---

## Deployment Commands

### IMPORTANT: Git Push ≠ Production Deploy

| Action | What it does |
|--------|--------------|
| `git push` | Version control backup to GitHub |
| `npm run deploy:web` | Build + deploy frontend to Cloudflare |
| `npm run deploy:backend` | Deploy backend to Fly.io |
| `npm run deploy:droplet` | Pull + restart services on droplet |
| `npm run app:ship` | Build + publish Flutter app to OTA |

### Quick Deploy (All Components)

```bash
git push && npm run deploy:all
```

### Web Dashboard (Cloudflare Pages)

```bash
cd web && npm run build && wrangler pages deploy .svelte-kit/cloudflare --project-name=orchon
```

### Backend API (Fly.io)

```bash
cd backend && fly deploy --now
```

### Droplet Services

```bash
ssh root@209.38.85.244 "cd /root/orchon && git pull && systemctl restart orchon-bot orchon-ws orchon-updates"
```

### Flutter App (OTA)

```bash
# 1. Bump version in app/pubspec.yaml
# 2. Build APK
cd app && flutter build apk --release \
  --dart-define=ORCHON_API_SECRET=$(grep API_SECRET ../.env | cut -d= -f2) \
  --dart-define=WS_URL=ws://209.38.85.244:8405

# 3. Publish to OTA server
cd .. && ./droplet/scripts/publish-release.sh release
```

**First-time install:** http://209.38.85.244:8406/download

**Check OTA version:** `curl http://209.38.85.244:8406/version`

---

## Configuration

### Shared Secret (API Authentication)

The `API_SECRET` must match between backend and app:

```bash
# Generate new secret
openssl rand -hex 32

# Update backend (Fly.io)
fly secrets set API_SECRET=<new> -a observatory-backend

# Rebuild app with new secret
flutter build apk --release --dart-define=ORCHON_API_SECRET=<new>
```

### Environment Files

| Location | Purpose |
|----------|---------|
| `.env` | Root config (droplet IP, secrets) |
| `backend/.env` | Fly.io secrets (DATABASE_URL, API_SECRET) |
| `/root/orchon/.env` | Droplet runtime config |

---

## Development

### Local Development

```bash
# Web frontend (port 4573)
npm run dev:web

# Backend (requires DATABASE_URL)
npm run dev:backend

# Flutter app
cd app && flutter run
```

### Tech Stack

| Component | Stack |
|-----------|-------|
| Web | SvelteKit 2.x + Svelte 5 + Tailwind 4 |
| Backend | Hono + TypeScript + Postgres |
| App | Flutter + Riverpod |
| Bot | Node.js |

### Code Style

- **No emojis** in UI - use Lucide icons
- **Mobile-first** responsive design
- Use Svelte 5 runes: `$state`, `$derived`, `$effect`

---

## API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/projects` | List monitored projects |
| `GET /api/deployments/recent?limit=N` | Recent deployments |
| `GET /api/deployments/failures?limit=N` | Failed deployments |
| `GET /api/deployments/:id` | Single deployment |
| `GET /api/status/summary` | Health overview |
| `POST /webhooks/github` | GitHub webhook receiver |

All API endpoints require `Authorization: Bearer <API_SECRET>`.

---

## Droplet Services

### Systemd Services

| Service | Description |
|---------|-------------|
| `orchon-bot` | Telegram bot |
| `orchon-ws` | WebSocket server |
| `orchon-updates` | OTA update server |

### Service Management

```bash
# Check status
systemctl status orchon-bot orchon-ws orchon-updates

# View logs
journalctl -u orchon-bot -f

# Restart all
systemctl restart orchon-bot orchon-ws orchon-updates
```

---

## Adding New Integrations

Follow the pattern in `droplet/orchestrator/index.js`:

1. Add config constants at top
2. Add API query function
3. Add `execute*` function(s) for actions
4. Add detection patterns in `detectAction()`
5. Add cases in `executeAction()` switch

---

## Task Completion Protocol

When completing any task:

1. **Commit changes** with descriptive message
2. **Push to GitHub**: `git push`
3. **Deploy affected components**:
   - Web changes: `npm run deploy:web`
   - Backend changes: `npm run deploy:backend`
   - Droplet changes: `npm run deploy:droplet`
   - App changes: Bump version + `npm run app:ship`

**ALWAYS deploy after completing tasks. Don't wait to be asked.**
