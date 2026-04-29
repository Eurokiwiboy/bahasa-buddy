# Bahasa Buddy Codex Guide

This file is the repo-level operating guide for Codex. Keep it short, practical, and biased toward shipping safe improvements to Bahasa Buddy.

## Project Shape

- App: React 18, TypeScript, Vite, Tailwind, shadcn/ui, Framer Motion.
- Backend: Supabase auth, Postgres, RLS, realtime, storage.
- Core domains: Bahasa Indonesia curriculum, lessons, phrase exercises, splash cards with spaced repetition, XP/streaks, onboarding, profile, and community chat.
- Important paths: `src/hooks`, `src/pages`, `src/components`, `src/integrations/supabase`, `supabase/migrations`, `docs/superpowers`.

## Working Rules

- Read the nearby code and migrations before editing.
- Keep changes scoped to the user request and the failing behavior.
- Prefer existing hooks, component patterns, and shadcn/ui primitives.
- Treat Supabase migrations as production-critical. They must be replay-safe, idempotent where possible, and consistent with generated types.
- Do not add autonomous hooks, broad shell permissions, background daemons, or third-party installers unless the user explicitly asks.
- Preserve user work. Do not revert unrelated changes or generated brainstorm folders.
- When verification commands hang, stop them and report the timeout plainly.

## Agent Team

Use these roles as mental models, or as concrete subagent prompts only when the user explicitly asks Codex to delegate.

### Product Architect

Owns learning flow, onboarding, lesson sequencing, and user experience. Checks whether a feature matches the Bahasa Buddy product, not just whether it compiles.

### Supabase Guardian

Owns schema, migrations, RLS, RPCs, storage policies, and generated Supabase types. Checks migration replay, policy interactions, and client/server trust boundaries.

### TypeScript Frontend Engineer

Owns React hooks, pages, UI state, routing, loading/error states, accessibility, and responsive layout. Keeps components consistent with existing style.

### Learning Systems Engineer

Owns SM-2 card review, XP, streaks, daily goals, achievements, lesson progress, and curriculum unlock logic. Looks for silent progress-loss bugs.

### Quality Verifier

Owns tests, typecheck, build, lint, dependency audit, and targeted manual verification notes. Prefers small deterministic regression tests over broad snapshots.

### Security Reviewer

Owns auth, RLS, public data exposure, storage uploads, dependency risk, and abuse paths such as XP farming or chat spam.

### Research Scout

Owns current external research, especially last-30-days market or product research. Uses current sources and records links and dates.

### Memory Scribe

Owns `docs/codex/STATE.md`. Records decisions, known risks, and next actions after meaningful work so future sessions do not restart cold.

## Default Review Checklist

- Does the database schema match app code and generated types?
- Are RLS policies effective after considering older permissive policies?
- Can a user only mutate their own progress, profile, messages, and uploads?
- Do loading and error states settle correctly?
- Does progress update exactly once for retries, realtime events, and repeated clicks?
- Are migrations replay-safe from an empty database?
- Do `npm test`, `npm run lint`, `npm run build`, and typecheck complete or fail with actionable output?

