# Agents Guide for Infrastructure Observatory

## Issue Tracking with bd (beads)

**IMPORTANT**: This project uses **bd (beads)** for ALL issue tracking. Do NOT use markdown TODOs, task lists, or other tracking methods.

### Why bd?

- Dependency-aware: Track blockers and relationships between issues
- Git-friendly: Auto-syncs to JSONL for version control
- Agent-optimized: JSON output, ready work detection, discovered-from links
- Prevents duplicate tracking systems and confusion

### Quick Start

**Check for ready work:**
```bash
bd ready --json
```

**Create new issues:**
```bash
bd create "Issue title" -t bug|feature|task -p 0-4 --json
bd create "Issue title" -p 1 --deps discovered-from:bd-123 --json
bd create "Subtask" --parent <epic-id> --json  # Hierarchical subtask
```

**Claim and update:**
```bash
bd update <id> --status in_progress --json
bd update <id> --priority 1 --json
```

**Complete work:**
```bash
bd close <id> --reason "Completed" --json
```

### Issue Types

- `bug` - Something broken
- `feature` - New functionality
- `task` - Work item (tests, docs, refactoring)
- `epic` - Large feature with subtasks
- `chore` - Maintenance (dependencies, tooling)

### Priorities

- `0` - Critical (security, data loss, broken builds)
- `1` - High (major features, important bugs)
- `2` - Medium (default, nice-to-have)
- `3` - Low (polish, optimization)
- `4` - Backlog (future ideas)

### Workflow for AI Agents

1. **Check ready work**: `bd ready` shows unblocked issues
2. **Claim your task**: `bd update <id> --status in_progress`
3. **Work on it**: Implement, test, document
4. **Discover new work?** Create linked issue:
   - `bd create "Found bug" -p 1 --deps discovered-from:<parent-id>`
5. **Complete**: `bd close <id> --reason "Done"`
6. **Commit together**: Always commit `.beads/issues.jsonl` with code changes

### Auto-Sync

bd automatically syncs with git:
- Exports to `.beads/issues.jsonl` after changes (5s debounce)
- Imports from JSONL when newer (e.g., after `git pull`)
- No manual export/import needed

## Project Context

This is an **Infrastructure Observatory** - a comprehensive monitoring platform that tracks:

- CI/CD pipeline status across multiple repos
- Infrastructure health (DNS, hosting, databases, auth)
- Service integrations (Cloudflare, Fly.io, Supabase, AWS, GCP)
- Account/identity mapping across multiple GitHub accounts
- Tech stack detection per project

### Architecture Principles

1. **Local-first**: Browser storage and local services for speed
2. **Background refresh**: No UI flashing, data fetches in background
3. **Mobile-responsive**: Works on all devices
4. **No emojis**: Use Lucide icons or Skeleton UI icons
5. **Live diagrams**: Infrastructure flows update in real-time during deployments

### Tech Stack

- SvelteKit 2.x with Svelte 5
- Tailwind CSS 4.x
- Skeleton UI (optional, for opinionated components)
- Lucide icons
- Deployed to Cloudflare Pages

### Accounts/Identities to Track

- **jvp-ux**: Simulations dev
- **jaslr**: Ladderbox, Bath Puddle/Junipa projects
- **stickyjason**: Other projects
- **Client work**: LAT&A, Brontic
- **Hobby**: LittleListOfLights, Ladderbox, Load Management
