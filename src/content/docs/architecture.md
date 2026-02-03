---
title: Architecture
description: How the CLI, dashboard, and core modules fit together.
---

Raiken is built as an Nx monorepo with a clear separation between the CLI,
dashboard, and core logic.

![System architecture diagram](/placeholder-diagram.svg)

## Modules

| Module | Location | Responsibility |
| --- | --- | --- |
| CLI | `apps/cli` | Fastify server, SSE output, tRPC API, serves dashboard in production |
| Dashboard | `apps/dashboard` | React + Vite UI for prompts, results, and approvals |
| Core | `libs/core` | LangGraph agent, tools, browser session, DOM capture, DB, testing |
| Shared | `libs/shared` | tRPC router and shared types |

## Data flow

1. User submits a prompt in the dashboard.
2. CLI receives the prompt and streams agent output via SSE.
3. Orchestrator runs the LangGraph agent with tool calls.
4. Core tools execute browser actions, file operations, and test runs.
5. Results are persisted locally in `.raiken/raiken.db`.

## Local persistence

Raiken keeps local state under `.raiken/` so it can:

- store the code graph, keywords, embeddings, and memory
- cache analysis for faster follow-up prompts
- track test run history and outcomes

## Ports

- CLI server + dashboard: `http://localhost:7101`
