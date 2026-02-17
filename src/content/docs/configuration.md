---
title: Configuration
description: Configure Raiken with raiken.config.json and environment variables.
---

Raiken is configured with `raiken.config.json`. This file is created by `raiken init` and can be edited at any time.

## Configuration categories

Raiken supports high-level configuration for:

- AI provider and model selection
- Browser settings (engine, headless, timeouts, retries)
- Feature flags (screenshots, video, tracing, network capture)
- Autonomy controls for save/run behavior (when enabled)
- Discovery runtime defaults (limits, timeout, auth pause behavior)

## Full configuration

```json title="raiken.config.json"
{
  "projectType": "generic",
  "testDirectory": "tests",
  "playwrightConfig": "playwright.config.ts",
  "outputFormats": ["typescript"],
  "storageStatePath": null,
  "ai": {
    "provider": "openrouter",
    "model": "anthropic/claude-3.5-sonnet",
    "apiKey": null
  },
  "features": {
    "video": true,
    "screenshots": true,
    "tracing": false,
    "network": true
  },
  "browser": {
    "defaultBrowser": "chromium",
    "headless": true,
    "timeout": 30000,
    "retries": 1
  },
  "discovery": {
    "maxPages": 100,
    "maxDepth": 4,
    "maxConcurrency": 3,
    "timeout": 30000,
    "excludePatterns": [],
    "pauseOnAuth": true
  }
}
```

## Minimal config

Most fields have sensible defaults. A minimal config looks like:

```json title="raiken.config.json"
{
  "projectType": "generic",
  "testDirectory": "tests"
}
```

## Field reference

### Project settings

| Field | Default | Description |
| --- | --- | --- |
| `projectType` | `"generic"` | Project preset (`generic`, `nextjs`, `react`, `vue`) |
| `testDirectory` | `"tests"` | Where generated tests are saved |
| `playwrightConfig` | `"playwright.config.ts"` | Path to Playwright config |
| `outputFormats` | `["typescript"]` | Generated file types |
| `storageStatePath` | `null` | Path to Playwright storage state for auth |

### AI settings

| Field | Default | Description |
| --- | --- | --- |
| `ai.provider` | `"openrouter"` | AI provider |
| `ai.model` | `"anthropic/claude-3.5-sonnet"` | Model identifier |
| `ai.apiKey` | `null` | API key (prefer env var instead) |

### Feature flags

| Field | Default | Description |
| --- | --- | --- |
| `features.video` | `true` | Record video during test runs |
| `features.screenshots` | `true` | Capture screenshots on failure |
| `features.tracing` | `false` | Enable Playwright tracing |
| `features.network` | `true` | Log network requests |

### Browser settings

| Field | Default | Description |
| --- | --- | --- |
| `browser.defaultBrowser` | `"chromium"` | Browser to use (`chromium`, `firefox`, `webkit`) |
| `browser.headless` | `true` | Run browser in headless mode |
| `browser.timeout` | `30000` | Default timeout in milliseconds |
| `browser.retries` | `1` | Number of test retries |

### Discovery settings

| Field | Default | Description |
| --- | --- | --- |
| `discovery.maxPages` | `100` | Maximum pages to process in one run |
| `discovery.maxDepth` | `4` | Maximum crawl depth from the start URL |
| `discovery.maxConcurrency` | `3` | Number of concurrent discovery workers |
| `discovery.timeout` | `30000` | Per-request timeout in milliseconds |
| `discovery.excludePatterns` | `[]` | URL patterns to skip during discovery |
| `discovery.pauseOnAuth` | `true` | Pause runtime on auth blockers and wait for assist |

## Precedence rules

Discovery command-line options override project-level `discovery` config values
for the current invocation.

## Environment variables

Set your API key in `.env` rather than the config file:

```bash title=".env"
# Required - AI Provider API Key
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional - Override model
OPENROUTER_MODEL=anthropic/claude-sonnet-4.5

# Optional - Custom base URL
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

Environment variables take precedence over config file values.

## Local workspace

Raiken creates a `.raiken/` directory containing:

- `raiken.db` — SQLite database with code graph and embeddings
- `cache/` — Analysis cache
- `auth-state.json` — Captured auth state for protected discovery/test routes

Add this to your `.gitignore`:

```gitignore
.raiken/
storage/
```

## Test artifacts

Raiken also creates:

- `test-results/` — Playwright artifacts (videos, screenshots, traces)
- `test-reports/` — Raiken JSON output

## Authenticated sessions

For apps that require login, capture a Playwright storage state and reference it:

```json title="raiken.config.json"
{
  "storageStatePath": ".raiken/auth-state.json"
}
```

See [Playwright's authentication docs](https://playwright.dev/docs/auth) for how to generate storage state.
