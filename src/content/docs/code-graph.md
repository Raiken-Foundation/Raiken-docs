---
title: Code Graph
description: How Raiken indexes your project for context-aware test generation.
---

Raiken builds a code graph to understand your project structure and provide relevant context during test generation.

## What it captures

For each file in your project, Raiken extracts:

- **Functions and classes** — names, parameters, export status
- **Imports and dependencies** — what each file imports and is imported by
- **Types and interfaces** — TypeScript type definitions
- **Entry points** — pages, layouts, API routes based on framework conventions

This information is stored in a local SQLite database at `.raiken/raiken.db`.

## Example: What Raiken knows about a file

```typescript
{
  relativePath: "src/components/Button.tsx",
  lines: 45,
  depth: 2,  // 2 hops from an entry point
  parsed: {
    functions: [
      { name: "Button", isExported: true, line: 5 }
    ],
    imports: [
      { source: "react", namedImports: ["useState"] },
      { source: "./utils", namedImports: ["formatDate"] }
    ],
    exports: ["Button", "default"],
    types: [
      { name: "ButtonProps", kind: "interface", isExported: true }
    ]
  }
}
```

## How it's built

1. **Detect entry points** — Raiken looks for common conventions:
   - Next.js: `app/`, `pages/`, API routes
   - React: `src/index.tsx`, `src/App.tsx`
   - Vue: `src/main.ts`, `src/App.vue`

2. **Walk the import graph** — Starting from entry points, Raiken follows imports to build a dependency tree.

3. **Parse each file** — Using Babel, Raiken extracts functions, classes, types, and relationships.

4. **Store for reuse** — Results are cached in `.raiken/raiken.db` so subsequent runs are fast.

## Example dependency graph

```text
src/app/page.tsx
  └── src/components/LoginForm.tsx
       ├── src/lib/auth.ts
       └── src/components/Button.tsx
            └── src/lib/utils.ts
```

Raiken uses this to understand which files are relevant when you ask it to test a specific component or flow.

## When to rebuild

The graph is updated automatically when you run `raiken start`. You may want to fully rebuild after:

- Major refactors
- Large file moves or renames
- Adding new entry points

To rebuild from scratch:

```bash title="Terminal"
rm -rf .raiken/
raiken init
```

## What's stored

The `.raiken/` directory contains:

| File | Purpose |
| --- | --- |
| `raiken.db` | SQLite database with file metadata, dependencies, and embeddings |
| `cache/` | Temporary analysis cache |

This directory should be in your `.gitignore`.

## Semantic search

Raiken also generates embeddings for semantic search. When you reference a component or concept in your prompt, Raiken can find relevant files even if you don't specify exact paths.

For example, "test the login flow" will surface files related to authentication based on their content, not just their names.
