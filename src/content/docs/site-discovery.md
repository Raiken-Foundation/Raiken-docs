---
title: Site Discovery Runtime
description: How Raiken discovery works with pause/resume, auth handling, and runtime observability.
---

Raiken discovery now runs as a stateful subsystem rather than a one-shot crawler
command. It persists session metadata, queue snapshots, and runtime phase details so
teams can operate discovery with pause/continue semantics and better observability.

## Runtime model

Discovery runtime tracks explicit phases:

- `idle`
- `running`
- `paused`
- `completed`
- `error`

For each active project runtime, Raiken tracks:

- current URL and depth
- counters for pages, links, and blockers
- blocker requirements and last error
- bounded event timeline for recent runtime events

## Startup flow

A discovery run now boots in this order:

1. Session bootstrap (`startNewSession` or `resumeSession`)
2. Start-domain validation
3. Auth storage-state load (when available)
4. Request queue open and optional queue rehydration
5. Crawler creation with pre-navigation auth-state application
6. Seed handling based on resume queue availability

This ordering ensures session context and auth state are ready before active crawl
execution begins.

## Pause and continue behavior

When discovery pauses, Raiken persists:

- session ID and counters
- configured limits (`maxPages`, `maxDepth`)
- queue snapshot (`queueJson`) for unhandled entries

When discovery continues, Raiken restores persisted runtime values and resumes from
checkpoint state where possible. Queue restoration is best-effort and local-process
scoped (not exactly-once distributed execution).

## Authentication lifecycle

Discovery can pause on auth blockers and request user assistance.

After auth capture saves `.raiken/auth-state.json`, unresolved auth blockers are
marked resolved and discovery can continue with auth state applied at browser context
level (cookies + storage seeding). This prevents stale blocker state after successful
login capture.

## Link outcome classification

Discovered links are now classified by navigation outcome:

- `verified` for successful target navigation
- `broken` for failed target navigation
- `auth_required` for blocked targets (for example `401`/`403`)

This improves graph reliability and downstream test-generation quality.

## Selector synthesis for discovered links

Selector generation prioritizes stability:

1. `data-testid` selectors when available
2. concrete `href` selectors
3. constrained text selectors
4. generic anchor selectors as fallback

## Snapshot persistence semantics

During discovery, Raiken persists structured page snapshots, not full raw HTML.

Current capture behavior:

- waits for `domcontentloaded`
- captures `page.locator("body").ariaSnapshot()`
- stores the payload in `discovered_pages.snapshot_json`
- stores page metadata (`url`, `title`, `depth`, `parent_url`, visit/timestamps)

This keeps storage smaller and emphasizes semantic/navigation structure over raw
markup completeness.

Example query for recent snapshot records:

```sql
SELECT
  url,
  title,
  depth,
  LENGTH(snapshot_json) AS snapshot_size
FROM discovered_pages
WHERE project_path = ?
ORDER BY discovered_at DESC
LIMIT 20;
```

## DB and API contract updates

- Discovery schema (v5) includes persisted `max_pages` and `max_depth` in
  `discovery_sessions`
- Lower-level DB consumers use `CodeGraphDB.getRawDatabase()` as the formal contract
- Site knowledge reads map raw rows into typed domain objects for session/page/link
  consistency
- Pending-link transitions use targeted lookups (for example `getPendingLinksTo(url)`)
  to mark outcomes after page success/failure
- Runtime orchestration endpoints are exposed through shared tRPC procedures:
  - `startDiscovery`
  - `continueDiscovery`
  - `getDiscoveryRuntime`
  - `getDiscoveryTimeline`
  - `authAssist`
  - `clearDiscoveryData`

## Config and CLI precedence

Project-level defaults are defined in `raiken.config.json` under `discovery`.
Per-run CLI flags override config defaults for that invocation.

```json title="raiken.config.json"
{
  "discovery": {
    "maxPages": 100,
    "maxDepth": 4,
    "maxConcurrency": 3,
    "timeout": 30000,
    "excludePatterns": ["**/logout", "**/signout"],
    "pauseOnAuth": true
  }
}
```

## Limitations and trade-offs

- Queue restoration is best-effort and local snapshot based
- Runtime timeline is in-memory and process-local
- Anchor-centric traversal may miss purely client-triggered transitions
- Auth-state continuation depends on freshness/validity of saved state
