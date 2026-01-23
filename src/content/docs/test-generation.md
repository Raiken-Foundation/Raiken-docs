---
title: Test Generation
description: How Raiken combines context to generate Playwright tests.
---

Raiken generates tests by combining your intent with live project context.

## How it works

1. **You describe the test** — Enter a natural language prompt in the dashboard.
2. **Raiken gathers context** — The orchestrator collects code graph data and captures the DOM.
3. **AI generates the test** — The prompt, code context, and DOM snapshot are sent to the AI.
4. **Output streams to the UI** — Watch the test being written in real-time.

## Inputs used

| Source | What it provides |
| --- | --- |
| Your prompt | The intent and scope of the test |
| Code graph | File structure, component relationships, types |
| DOM capture | Interactive elements, form fields, suggested selectors |
| Config | Output format, test directory, browser settings |

## Example prompt

```text
Generate a test that logs in, opens settings, and verifies the usage counter.
```

## Example output

```ts title="tests/settings.spec.ts"
import { test, expect } from '@playwright/test';

test('settings usage counter updates', async ({ page }) => {
  // Login
  await page.goto('http://localhost:3000/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('dev@acme.io');
  await page.getByRole('textbox', { name: 'Password' }).fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Navigate to settings
  await page.getByRole('link', { name: 'Settings' }).click();
  
  // Verify usage counter
  await expect(page.getByRole('heading', { name: 'Usage' })).toBeVisible();
});
```

## Output location

Generated tests are saved to the directory specified in your config:

```json title="raiken.config.json"
{
  "testDirectory": "tests"
}
```

By default, this is `tests/` or `e2e/` depending on your framework.

## Selector strategy

Raiken prioritizes stable, accessible selectors:

1. **`getByRole()`** — Best for buttons, links, headings
2. **`getByLabel()`** — Best for form inputs
3. **`getByTestId()`** — Fallback when semantic selectors aren't available
4. **`getByText()`** — For unique text content

CSS selectors are avoided unless no better option exists.

## Tips for better results

### Be specific about the flow

```text
✗ "Test login"
✓ "Test that a user can log in with valid credentials and see their dashboard"
```

### Include visible UI text

```text
✗ "Test the form"
✓ "Test the form with fields 'Email' and 'Password' and a 'Sign In' button"
```

### Reference URLs when relevant

```text
"Test the settings page at http://localhost:3000/settings"
```

### Iterate with follow-up prompts

After the initial generation:

```text
"Add a test for invalid credentials"
"Include an assertion for the error message"
```

## Supported frameworks

Playwright is the default and recommended framework. The generated tests use Playwright's locator API for maximum stability.

Other frameworks may be supported in the future, but selector generation is currently optimized for Playwright.
