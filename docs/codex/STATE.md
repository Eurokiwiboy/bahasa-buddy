# Bahasa Buddy Codex State

## Current Risks

- Local verification commands are timing out after the runner starts: `npm test`, targeted Vitest, whole-project lint, targeted lint, `npm run build`, and `npx tsc --noEmit -p tsconfig.app.json`.
- Supabase local migration replay is blocked until Docker Desktop is running.
- Full `npm audit` still reports dev-only dependency issues in the test/build toolchain. Production audit is clean after dependency updates.
- Live database migration and live previous host deploy have not been performed from this workspace.
- The current cleanup pass still needs full local verification before release.
- `npm run audit:prod` is blocked in the sandbox without registry access.

## Decisions

- Do not import full autonomous orchestration repos or hook-heavy agents by default.
- Prefer small local Codex skills plus `AGENTS.md` role instructions.
- Keep GSD/PRP patterns lightweight and project-local.
- Treat database and RLS work as the first stabilization priority.
- Use a corrective migration for deployed databases and keep older migrations replay-safe for fresh local environments.

## Completed

- Added local Codex skills and read-only agent definitions.
- Added `docs/codex/RELEASE_CHECKLIST.md` for GitHub, Supabase, and previous host deployment.
- Made `20260315000001_enable_rls.sql` drop duplicate/permissive baseline policies before creating stricter policies.
- Restored secure `add_xp` behavior in `20260315000002_secure_rpc.sql`: correct `xp_total`, `xp_today`, streaks, transactions, daily goals, authenticated-user validation, amount bounds, and direct insert revocation.
- Added `20260429000000_reconcile_rls_and_xp.sql` to apply RLS and XP fixes to already-deployed databases, including a narrow `public_profiles` projection for community display data.
- Fixed `useChat` room-list loading so `fetchRooms` clears loading in a `finally` block and replaced embedded profile reads with `public_profiles` lookups.
- Updated Supabase TypeScript types for `public_profiles`.
- Added `src/__tests__/stability-regressions.test.ts` to catch the XP/RLS/chat-loading regression class.
- Updated production dependencies and overrides so `npm audit --omit=dev` passes.
- Added `npm run typecheck` and `npm run audit:prod` scripts for release gates.
- Removed retired hosting/tooling traces from app runtime, dependencies, docs, and tracked generated brainstorm artifacts.
- Made Supabase client configuration env-only.
- Tightened flashcard review controls, app shell density, profile hierarchy, home next-action loop, and curriculum path review affordances.
- Normalized stale streaks on profile read and added a corrective migration to reset deployed stale streak rows.
- Added profile update broadcasts and Supabase realtime subscriptions so XP, daily goals, and profile stats refresh across mounted views without a full page reload.
- Moved profile preferences into the bottom profile menu and kept the profile page focused on identity, streak, level title, XP, and achievements.
- Added Indonesian audio playback fallback, flashcard example audio, lesson prompt audio, and short correct/incorrect feedback tones.
- Recorded the first lexicon/audio direction in `docs/codex/LEXICON_AUDIO_NOTES.md`.

## Next Useful Work

1. Investigate why Vitest, ESLint, Vite build, and TypeScript checks hang locally.
2. Start Docker Desktop and replay migrations with `supabase db reset --local --no-seed`.
3. Push the corrective migration with `supabase db push` after verification.
4. Commit the cleanup and UI polish slice after verification.
5. Trigger or verify the previous host deployment and smoke test onboarding, XP, chat, profile avatars, and console/Supabase logs.
