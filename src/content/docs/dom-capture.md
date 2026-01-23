---
title: DOM Capture
description: How Raiken captures DOM context for stable selectors.
---

Raiken captures a focused DOM snapshot for test generation. It extracts interactive elements rather than dumping the full HTML.

## How it works

Raiken uses Playwright to open the target page and collects:

- **Interactive elements** — buttons, links, and clickable items
- **Form fields** — inputs, textareas, selects with their labels
- **Accessibility tree** — a simplified tree of roles and names

Only visible, usable elements are included to keep the context clean and relevant for test generation.

## What gets captured

For each interactive element, Raiken extracts:

```json
{
  "tagName": "button",
  "role": "button",
  "name": "Sign In",
  "text": "Sign In",
  "testId": "login-submit",
  "suggestedSelectors": [
    "getByTestId('login-submit')",
    "getByRole('button', { name: 'Sign In' })",
    "getByText('Sign In')"
  ]
}
```

For form fields:

```json
{
  "name": "Email address",
  "type": "email",
  "label": "Email address",
  "placeholder": "Enter your email",
  "required": true,
  "suggestedSelector": "getByRole('textbox', { name: 'Email address' })"
}
```

## How the AI sees it

Raiken formats the captured data for the AI like this:

```text title="DOM Context"
═══════════════════════════════════════════════════════════════
[LIVE DOM CONTEXT - http://localhost:3000/login]
═══════════════════════════════════════════════════════════════
Page Title: Login - My App

ACCESSIBILITY TREE:
───────────────────
• WebArea: "Login - My App"
  • textbox: "Email address"
  • textbox: "Password"
  • button: "Sign In"
  • link: "Forgot password?"

INTERACTIVE ELEMENTS:
─────────────────────
• button: "Sign In"
  Selector: getByRole('button', { name: 'Sign In' })
• textbox: "Email address"
  Selector: getByRole('textbox', { name: 'Email address' })
• link: "Forgot password?"
  Selector: getByRole('link', { name: 'Forgot password?' })

SELECTOR PRIORITY:
──────────────────
1. getByRole() - Most reliable, matches accessibility tree
2. getByLabel() - Great for form inputs
3. getByText() - For buttons and links
```

This structured format helps the AI generate tests with stable, accessible selectors.

## Selector priority

Raiken ranks selectors by reliability:

| Priority | Selector Type | Example | Stability |
| --- | --- | --- | --- |
| 1 | Role + name | `getByRole('button', { name: 'Submit' })` | Highest |
| 2 | Label | `getByLabel('Email')` | High |
| 3 | Test ID | `getByTestId('login-form')` | High |
| 4 | Text | `getByText('Sign In')` | Medium |
| 5 | CSS | `locator('.btn-primary')` | Low |

Role-based selectors are preferred because they're tied to accessibility semantics, not implementation details.

## Authentication

For pages that require login, set up Playwright storage state:

```json title="raiken.config.json"
{
  "storageStatePath": ".raiken/auth.json"
}
```

Raiken will reuse this session when capturing DOM context. See [Configuration](/configuration/) for details.

## Limitations

- **Single page** — Captures one page at a time (multi-page capture coming soon)
- **Visible elements only** — Hidden or off-screen elements are excluded
- **Element limits** — Large pages are sampled for performance

For full HTML exports or multi-page crawling, you can extend with custom Playwright scripts, but the default path is optimized for test generation accuracy.
