---
name: quality-gate
description: Use when verifying changes, running tests, checking build/lint/typecheck, auditing dependencies, validating migrations, or preparing a final confidence report.
---

# Quality Gate

## Standard Checks

Run the narrowest relevant checks first:

```bash
npm test
npm run lint
npm run build
npx tsc --noEmit -p tsconfig.app.json
```

For dependencies:

```bash
npm audit --omit=dev
```

## If Commands Hang

- Stop the command.
- Report the timeout and the last visible output.
- Check that no spawned process remains running.
- Continue with static review rather than pretending verification passed.

## Supabase Checks

- Migration replay safety.
- Policy interactions, especially older permissive policies.
- Column names in RPCs versus schema and generated types.
- User ownership checks for writes.

## Final Report

Say what passed, what failed, what timed out, and what remains risky.

