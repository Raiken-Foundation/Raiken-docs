---
title: Architecture
description: How the CLI, dashboard, and core modules fit together.
---

Raiken is built as an Nx monorepo with a clear separation between the CLI,
dashboard, and core logic.

## Modules

| Module | Location | Responsibility |
| --- | --- | --- |
| CLI | `apps/cli` | Fastify server, SSE output, tRPC API, discover/auth/init command surface |
| Dashboard | `apps/dashboard` | React + Vite UI for test generation and discovery runtime monitoring |
| Core | `libs/core` | LangGraph agent, site discovery runtime, browser session, DB, testing |
| Shared | `libs/shared` | tRPC router, discovery runtime orchestration, shared types |
| Playground (internal) | `tools/playground` | Route-rich test surface for discovery and generated E2E validation |

## Data flow

1. User submits a prompt or starts discovery from the dashboard.
2. CLI receives the request and streams runtime output via SSE/tRPC.
3. Shared router coordinates runtime phase, events, and active jobs.
4. Core executes LangGraph tools or discovery crawler operations.
5. Results and session state are persisted locally in `.raiken/raiken.db`.

## Local persistence

Raiken keeps local state under `.raiken/` so it can:

- store the code graph, keywords, embeddings, and memory
- cache analysis for faster follow-up prompts
- track test run history and outcomes
- persist discovery sessions and resume metadata

## Ports

- CLI server + dashboard: `http://localhost:7101`

## Discovery runtime

Discovery now operates as a stateful subsystem with explicit runtime phases:
`idle`, `running`, `paused`, `completed`, and `error`.

Runtime state is exposed to the dashboard through shared tRPC endpoints for:

- start/continue operations
- runtime state and event timeline
- auth-assist and cleanup flows

Recent persistence changes include discovery session fields such as `max_pages` and
`max_depth` to support predictable continuation behavior across pause/resume runs.

See [Site Discovery](/site-discovery/) for implementation details.
