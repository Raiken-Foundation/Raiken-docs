---
title: Architecture
description: How the CLI, dashboard, and core modules fit together.
---

Raiken is built as a monorepo with a clear separation between the CLI,
dashboard, and core logic.

![System architecture diagram](/placeholder-diagram.svg)

## Modules

| Module | Location | Responsibility |
| --- | --- | --- |
| CLI | `apps/cli` | Runs the server, detects project info, starts the agent |
| Dashboard | `apps/dashboard` | UI for prompts, results, and test management |
| Core | `libs/core` | Code graph, DOM capture, test generation, orchestration |
| Shared | `libs/shared` | tRPC router, shared types, config |

## Data flow

1. Developer runs the CLI.
2. CLI starts a local Fastify server.
3. Dashboard connects via tRPC.
4. Core builds a code graph and stores it in `.raiken/raiken.db`.
5. The agent captures DOM context and generates tests.

## Example request timeline

```text title="Timeline"
T+0s  CLI started and project loaded
T+2s  Code graph refreshed
T+4s  DOM capture snapshot received
T+6s  Test generated and streamed to UI
```

## Ports

- CLI server: `http://localhost:7101`
- Dashboard (dev): `http://localhost:4200`

## Local state

Raiken keeps local state under `.raiken/` so it can:

- track project structure over time
- cache embeddings and analysis
- store entry points and file metadata
