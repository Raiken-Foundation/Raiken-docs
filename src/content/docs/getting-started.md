---
title: Getting Started
description: Install Raiken and generate your first test.
---

This guide walks through installing Raiken and generating your first test.

:::note[Quickstart]
```bash title="Terminal"
npm install -D raiken
OPENROUTER_API_KEY=your_key_here
raiken init
raiken start
```
:::

## Prerequisites

- Node.js 18+
- A JavaScript or TypeScript project with a `package.json`
- A running dev server for the app you want to test

## Install Raiken

Raiken can be installed globally, run via `npx`, or added as a dev dependency.

Global install:

```bash title="Terminal"
npm install -g raiken
```

Run once with `npx`:

```bash title="Terminal"
npx raiken
```

Project-local install:

```bash title="Terminal"
npm install -D raiken
```

Verify the install:

```bash title="Terminal"
raiken --version
```

## Initialize your project

From your project root:

```bash title="Terminal"
raiken init
```

This will:

- Create `.raiken/` for local state and the SQLite database
- Create `raiken.config.json`
- Create `test-results/` and `test-reports/`
- Optionally generate `playwright.config.ts`
- Optionally generate an example test file
- Add scripts to `package.json`

## Sample CLI output

```text title="Output"
Detected framework: Playwright
Created .raiken/ workspace
Wrote raiken.config.json
Ready to start: raiken start
```

## Setup checklist

1. Make sure your app can run locally (dev server available).
2. Set your AI API key (see below).
3. Run `raiken init` in the project root.
4. Install Playwright browsers if you plan to run tests.
5. Start Raiken and open the dashboard.

## Add your API key

Raiken uses OpenRouter by default. Set this in your environment:

```bash title=".env"
OPENROUTER_API_KEY=your_key_here
```

You can also set `ai.apiKey` inside `raiken.config.json`.

:::tip[Example prompt]
`test that the login button navigates to the dashboard`
:::

## Install Playwright browsers (recommended)

If you selected Playwright and want to run tests locally:

```bash title="Terminal"
npx playwright install
```

## Start Raiken

```bash title="Terminal"
raiken start
```

The dashboard runs at:

```
http://localhost:7101
```

## Generate your first test

1. Open the dashboard.
2. Enter a prompt like the example above.
3. Review the generated test.
4. Save and run it from your test framework.

## Next steps

- [Configuration](/configuration/)
- [CLI commands](/cli/)
- [DOM capture](/dom-capture/)
