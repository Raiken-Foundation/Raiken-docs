---
title: Dashboard
description: The web interface for generating and managing tests.
---

The Raiken dashboard is a browser-based interface for exploration, test generation, and managing your test suite.

:::tip[Quick Access]
After running `raiken start`, open **http://localhost:7101** in your browser.
:::

## Overview

The dashboard connects to the CLI server via tRPC and streams agent output in real time. Exploration runs are supported, and tests are generated only when explicitly requested.

## Key features

### Prompt composer

Write natural language descriptions of what you want Raiken to do:

```text
Explore the login flow and capture DOM context.
Generate a test that validates the dashboard welcome message.
```

The prompt composer supports:
- Multi-line input for complex scenarios
- File references with `@path/to/file.tsx`
- URL references like `http://localhost:3000/login`

### Real-time streaming

Watch your test generate token-by-token:

```text title="Streaming Output"
Generating test: "user login flow"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 78%

import { test, expect } from '@playwright/test';

test('user can log in with valid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  █
```

No waiting for completion — review as it writes and cancel early if needed.

### Selector suggestions

The dashboard shows suggested selectors ranked by stability:

| Selector | Type | Stability |
| --- | --- | --- |
| `getByRole('button', { name: 'Sign in' })` | Role | High |
| `getByLabel('Email')` | Label | High |
| `getByTestId('login-form')` | Test ID | Medium |
| `locator('.btn-primary')` | CSS | Low |

Role-based and label-based selectors are preferred for their resilience to UI changes.

### Interactive review

After generation:

1. **Review** — Read through the generated test
2. **Edit** — Make manual adjustments if needed
3. **Retry** — Refine your prompt and regenerate
4. **Save** — Save to your project's test directory

## Workflow

### 1. Start the dashboard

```bash title="Terminal"
raiken start
```

Open `http://localhost:7101` in your browser.

### 2. Enter a prompt

Describe the test you want in natural language:

```text
Generate tests for the Counter component that test
increment, decrement, and reset functionality.
```

### 3. Review the output

The test streams to the UI. Review it as it's generated.

### 4. Save or refine

If the test looks good, save it. Save and run actions require approval unless autonomy is enabled. If it needs work, add a follow-up prompt:

```text
Add a test for the edge case where decrement is clicked
when the counter is already at zero.
```

### 5. Run your tests

Once saved, run tests with your usual workflow:

```bash title="Terminal"
npx playwright test
```

## Tips

- **Be specific** — Clear prompts produce better tests
- **Iterate** — Start simple, then refine with follow-up prompts
- **Use file references** — `@src/components/Login.tsx` gives Raiken more context
- **Include URLs** — Helps Raiken capture the right page for DOM context
