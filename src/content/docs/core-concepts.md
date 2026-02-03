---
title: Core Concepts
description: The key ideas behind code graph, DOM context, and orchestration.
---

This section explains the main ideas that power Raiken.

## At a glance

| Concept | Purpose | Stored in |
| --- | --- | --- |
| Code graph | Structural context for prompts | `.raiken/raiken.db` |
| DOM capture | UI context and selectors | `.raiken/` cache |
| Orchestrator | Routes the right tools | CLI process |
| Test generation | Produces test files | `tests/` directory |

![Concept map preview](/placeholder-diagram.svg)

## Code graph

Raiken builds a graph of your project to provide structural context. This helps
the agent understand entry points, dependencies, and file layout.

Where it lives:

- `.raiken/raiken.db`

## DOM context

Raiken captures a semantic snapshot of the page to generate stable selectors.
This is optimized for test authoring, not full page scraping.

See: [DOM capture](/dom-capture/)

## Orchestrator

The orchestrator decides which tools to call:

- code graph for file context
- DOM capture for UI context
- test generation for output

This routing keeps the agent focused on the right context for each request.

## Local state

Raiken stores local project state on disk so it can:

- avoid re-indexing on every run
- reuse prior context
- improve test generation accuracy over time

This local state includes a SQLite database (`.raiken/raiken.db`) with code graph data,
keywords, embeddings, and agent memory.

## Exploration-first default

Raiken explores and captures context by default. Tests are generated only when you
explicitly ask for them.

## Test generation

Prompts are grounded by:

- code graph context
- DOM context
- user intent

The result is a test file (Playwright by default) with selectors derived from
actual UI structure.
