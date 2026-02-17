---
title: FAQ
description: Common questions about Raiken.
---

## Does Raiken work with my framework?

Yes. Raiken supports generic JavaScript and TypeScript projects and uses
Playwright by default.

## Where are tests saved?

Tests are generated in the configured test directory (default: `tests/`).

## Can I use my own AI provider?

Yes. Configure the `ai` block in `raiken.config.json` to select a provider and
model.

## How do I handle authentication?

Use Playwright storage state and set `storageStatePath` in your config.

For discovery flows, you can also run `raiken discover --auth` to capture auth
state before discovery starts.

## Can discovery pause and continue?

Yes. Discovery supports pause/continue semantics using persisted session metadata
and queue snapshots for best-effort continuation.

## What do link statuses mean in discovery?

Discovery classifies links based on observed outcomes:

- `verified` — target navigation succeeded
- `broken` — navigation failed
- `auth_required` — access blocked by auth (for example `401`/`403`)

## How do I reset state?

Delete the `.raiken/` directory and run `raiken init` again.
