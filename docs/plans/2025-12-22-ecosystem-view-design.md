# Ecosystem View Design

## Overview

A new page that shows provider/vendor dependencies across all projects, helping identify vendor lock-in exposure. Instead of "Project X uses these services", it shows "Provider Y is used by these projects".

## Navigation

- New section label "ECOSYSTEM" below the project list in sidebar
- Menu item: "Ecosystem" with network icon
- Route: `/ecosystem`
- Sidebar remains visible; clicking a project returns to `/?project=xyz`

## Page Layout

```
+------------------+----------------------------------------+
| Sidebar          | Aggregated Flow Diagram               |
| (projects)       | [Projects] -----> [Providers by Cat]  |
|                  |                                        |
| -----------      |                                        |
| ECOSYSTEM        +----------------------------------------+
| > Ecosystem      | Provider Breakdown                     |
|                  | HOSTING: Cloudflare (8), Fly.io (1)   |
|                  | DATABASE: Supabase (3)                |
|                  | ...                                    |
+------------------+----------------------------------------+
```

### Aggregated Flow Diagram (top ~40-50%)

**Structure:**
- Left: Project nodes (vertical list, small circles with labels)
- Right: Provider nodes grouped by category (Hosting, Database, Auth, Storage, CI, Monitoring)
- Lines connecting projects to their providers

**Provider nodes:**
- Provider logo (reusing existing `/api/logos/infra/` infrastructure)
- Provider name
- Count badge showing number of dependent projects

**Interaction:**
- Hover project: Highlights its provider connections
- Click provider: Filters breakdown list, dims other connections
- Click elsewhere: Clears filter

### Provider Breakdown (bottom, scrollable)

**Structure:**
- Category sections: "HOSTING", "DATABASE", "STORAGE", etc.
- Each section lists providers with usage counts
- Under each provider: clickable project names (link to `/?project=xyz`)

**Example:**
```
HOSTING
  Cloudflare Pages (8)
    ci-monitor, livna, brontiq, shippywhippy,
    loadmanagement, littlelistoflights, vastpuddle.com.au, junipa.com.au
  Fly.io (1)
    Ladderbox
  GCP App Engine (7)
    junipa-demo, junipa-cedarcollege, ...

DATABASE
  Supabase (3)
    livna, Ladderbox, junipa.com.au
```

## Technical Implementation

### Files to Create

1. `src/routes/ecosystem/+page.svelte` - Main page component
2. `src/lib/components/EcosystemFlowDiagram.svelte` - Aggregated flow visualization

### Files to Modify

1. `src/routes/+page.svelte` - Add "ECOSYSTEM" section to sidebar
2. Possibly extract sidebar to shared component (optional, for DRY)

### Data Flow

- All data from existing `INFRASTRUCTURE` config in `src/lib/config/infrastructure.ts`
- No server-side data fetching needed initially
- Helper function to invert the data structure:
  ```ts
  // From: { project: { services: [...] } }
  // To: { category: { provider: [projects...] } }
  function getProvidersByCategory(infra: typeof INFRASTRUCTURE)
  ```

### Responsive Behavior

- Desktop: Full diagram + breakdown side by side or stacked
- Mobile: Diagram collapses to summary counts, breakdown list is primary

## What's NOT on This Page

- Tech stack section (separate future page)
- Per-project services list (redundant)
- Individual project flow diagrams (stay on main page)

## Future Considerations

- Tech Stack page (frameworks/tooling view) - separate feature
- Real-time status integration for providers
- Provider health dashboard links
