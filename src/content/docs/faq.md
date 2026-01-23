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

## How do I reset state?

Delete the `.raiken/` directory and run `raiken init` again.
