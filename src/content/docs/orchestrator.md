---
title: Orchestrator
description: The routing layer that coordinates context gathering and test generation.
---

The orchestrator is the brain of Raiken. It interprets your prompts, decides what context to gather, and coordinates the test generation pipeline.

## What it does

1. **Classifies intent** — Determines if you want to generate tests, ask a question, or refine previous output
2. **Gathers context** — Fetches relevant code and DOM data based on your request
3. **Routes to the right tool** — Decides whether to capture DOM, search code, or generate tests
4. **Streams the response** — Sends output back to the dashboard in real-time

## Routing decisions

The orchestrator makes smart decisions about what context is needed:

| Your prompt | Context gathered | Action |
| --- | --- | --- |
| "Test the login flow" | DOM capture + code graph | Generate test |
| "Test @src/components/Button.tsx" | Code graph (specific file) | Generate test |
| "What does this file do?" | Code graph | Explain code |
| "Add error handling tests" | Previous context | Refine test |

## Intent classification

When you send a prompt, the orchestrator classifies it:

- **test-generation** — You want to create or modify tests
- **chat** — You're asking a question or having a conversation
- **help** — You need guidance on how to use Raiken

It also detects meta-intents like "retry", "continue", or "cancel".

## Context gathering

Depending on the intent, the orchestrator may:

### Capture DOM

For UI-focused tests, Raiken opens the target URL and captures:
- Interactive elements (buttons, links, inputs)
- Form fields with labels
- Accessibility tree

### Search code

For component or file-specific tests, Raiken:
- Finds the referenced files in the code graph
- Extracts relevant functions, types, and relationships
- Includes related files when helpful

### Combine both

Most test generation requests use both code and DOM context for the best results.

## Streaming output

The orchestrator streams responses token-by-token to the dashboard. This means you can:

- Watch the test being written in real-time
- Cancel generation early if it's going in the wrong direction
- Provide feedback without waiting for completion

## Session memory

The orchestrator maintains context across turns in a conversation:

- **Current goal** — What you're trying to accomplish
- **Last action** — What was generated or explained
- **DOM context** — Most recent page capture
- **URL** — The page being tested

This allows follow-up prompts like "add error cases" or "also test the logout button" to work without re-explaining the context.

## Error handling

If something goes wrong, the orchestrator will:

1. Retry with adjusted parameters (up to a limit)
2. Ask for clarification if the prompt is ambiguous
3. Report clear error messages if the issue can't be resolved

## Why this matters

Different requests need different context. A request about UI needs DOM data. A request about code structure needs the code graph. The orchestrator avoids slow or irrelevant work by:

- Only capturing DOM when UI context is needed
- Only searching code when file context is needed
- Reusing cached context when possible
