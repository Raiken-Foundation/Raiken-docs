---
title: CLI Reference
description: Commands, options, and environment variables for Raiken.
---

Raiken ships as a CLI that initializes projects and starts the dashboard.

## Commands

### raiken init

Initialize Raiken in the current project.

```bash title="Terminal"
raiken init
```

**Options:**

| Flag | Description |
| --- | --- |
| `--force`, `-f` | Overwrite existing configuration files |

**What it does:**

1. Detects your project type and test framework
2. Creates `.raiken/` workspace directory
3. Writes `raiken.config.json`
4. Creates `test-results/` and `test-reports/` directories
5. Optionally generates `playwright.config.ts`
6. Optionally creates an example test file
7. Adds scripts to `package.json`

**Example output:**

```text title="Terminal"
🔎 Analyzing your project...

🔍 Detected project information:
   Project: my-app
   Type: nextjs
   Test Framework: playwright
   Package Manager: pnpm

✓ Auto-detected project configuration.
   nextjs + playwright → e2e/

? Use auto-detected configuration? Yes
? Install Playwright browsers now? Yes
? Generate an example test file? Yes

📁 Setting up nextjs project: my-app

✓ Created .raiken/ directory
✓ Updated .gitignore to exclude .raiken/
✓ Created test directory: e2e/
✓ Created raiken.config.json
✓ Created playwright.config.ts
✓ Updated package.json scripts
✓ Created example test: e2e/example.spec.ts
📦 Installing Playwright browsers...
✓ Playwright browsers installed successfully

✅ Project initialization complete!

Next steps:
  1. Run "raiken start" to launch the dashboard
  2. Open http://localhost:7101 in your browser
  3. Start generating AI-powered tests!
```

### raiken start

Start the Raiken server and dashboard.

```bash title="Terminal"
raiken start
```

**Options:**

| Flag | Description |
| --- | --- |
| `-p, --port <number>` | Set the server port (default: 7101) |

**Example:**

```bash title="Terminal"
raiken start -p 8080
```

**Example output:**

```text title="Terminal"
📍 Found 3 entry points
✅ Code graph built successfully: 47 files indexed

🚀 Raiken UI running at http://localhost:7101
```

## API surface (local)

The CLI exposes a small local API used by the dashboard:

- `POST /api/generate-test` — SSE stream for exploration and test generation output
- `POST /api/trpc/*` — tRPC router for dashboard actions

## Environment variables

Raiken reads `.env` from your project root.

| Variable | Required | Description |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | Yes | API key for AI generation |
| `OPENROUTER_MODEL` | No | Override the default model |
| `OPENROUTER_BASE_URL` | No | Custom API base URL |

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Success |
| `1` | Initialization failed or startup error |

## Quick reference

```bash title="Terminal"
# Initialize a new project
raiken init

# Force reinitialize (overwrites config)
raiken init --force

# Start the dashboard
raiken start

# Start on a custom port
raiken start -p 8080

# Check version
raiken --version

# Show help
raiken --help
```
