---
name: bahasa-buddy-build
description: Use when implementing, fixing, or reviewing Bahasa Buddy app code across React, TypeScript, Vite, Tailwind, shadcn/ui, Supabase hooks, learning progress, onboarding, profile, lessons, cards, or community chat.
---

# Bahasa Buddy Build

## Workflow

1. Read `AGENTS.md`, `README.md`, `package.json`, and the files nearest the change.
2. Identify the affected domain: frontend state, Supabase/RLS, learning systems, chat, onboarding, profile, or curriculum.
3. Make the smallest change that fixes the behavior.
4. Add or update focused tests when the behavior is important or easy to regress.
5. Run the narrowest useful verification first, then broader checks if they complete.
6. Update `docs/codex/STATE.md` when the work changes project direction, known risks, or next steps.

## Local Patterns

- Hooks live in `src/hooks` and usually wrap Supabase queries.
- App pages live in `src/pages`.
- Shared UI is mostly shadcn/radix in `src/components/ui`.
- Supabase client and generated types live in `src/integrations/supabase`.
- Migrations live in `supabase/migrations` and must match app code.

## Checks To Keep In Mind

- Loading states must settle on success and failure.
- User-owned data must include `auth.uid()` or `user.id` checks.
- Progress updates should be idempotent or protected against double-click/retry duplication.
- Prefer visible error handling for user-facing flows instead of only `console.error`.
- Avoid adding a new abstraction unless it clearly reduces repeated logic.

