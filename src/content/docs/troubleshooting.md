---
title: Troubleshooting
description: Common issues and quick fixes.
---

## Missing API key

If you see an error about `OPENROUTER_API_KEY`:

- Set `OPENROUTER_API_KEY` in your `.env`
- Or set `ai.apiKey` in `raiken.config.json`

## Playwright browsers not installed

If tests fail to launch a browser:

```bash title="Terminal"
npx playwright install
```

## Port already in use

Start Raiken on a different port:

```bash title="Terminal"
raiken start -p 7200
```

## Empty or slow test generation

- Make sure your app is running locally
- Provide a more specific prompt
- Check network access for the model provider

## Rebuild local state

If project structure changed significantly:

- Delete `.raiken/` and run `raiken init` again

## Discovery paused on authentication

If discovery enters a paused/auth-blocked state:

1. Capture auth state (`raiken auth` or `raiken discover --auth`)
2. Continue discovery (`raiken discover --continue`)
3. Confirm runtime phase changes from `paused` to `running` in the dashboard

## Discovery timeout or incomplete crawl

- Increase timeout via CLI: `raiken discover --timeout 60000`
- Or set project defaults in `raiken.config.json` under `discovery`
- Check `excludePatterns` and `maxDepth` if expected pages are missing

## Example error output

```text title="Error Log"
ERROR: No API key found. Set OPENROUTER_API_KEY in your environment.
ERROR: Failed to connect to http://localhost:7101 (connection refused).
```

## Status checklist

| Check | Status |
| --- | --- |
| API key configured | Confirmed |
| Dev server running | Confirmed |
| Playwright browsers installed | Confirmed |
| Auth state captured (if needed) | Confirmed |
| Discovery runtime phase healthy | Confirmed |
