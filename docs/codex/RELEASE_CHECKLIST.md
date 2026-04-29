# Bahasa Buddy Release Checklist

Use this checklist when moving Codex or Claude Code work from local files to GitHub, Supabase, and the live Lovable site.

## 1. Preflight

Run these before staging:

```bash
npm run audit:prod
npm run typecheck
npm run lint
npm test
npm run build
```

Current note: local Vitest, ESLint, TypeScript, and Vite build checks have been hanging in this workspace. Treat that as a release blocker unless you can confirm the same commands pass in another terminal, CI, Lovable, or a fresh checkout.

For database work, start Docker Desktop and replay migrations locally:

```bash
supabase db reset --local --no-seed
```

Then verify the corrective migration exists and is pending/applied as expected:

```bash
supabase migration list
```

## 2. Supabase Push

Only push database migrations after the preflight is green or you have accepted the risk.

```bash
supabase link --project-ref zxmwfvyqrtqtsrfhdvhv
supabase db push
```

After pushing, check the Supabase dashboard for:

- `public.public_profiles` exists and only exposes `id`, `display_name`, `avatar_url`, and `learning_level`.
- `public.add_xp` is executable by authenticated users, rejects cross-user awards, and rejects suspicious XP amounts.
- Direct inserts into `xp_transactions` are not available to normal authenticated users.
- The duplicate permissive RLS policies from the baseline migration are gone.

## 3. Git Push

Review the worktree first:

```bash
git status --short
git diff --stat
git diff
```

Recommended staging set for this audit slice:

```bash
git add AGENTS.md \
  docs/codex \
  .codex \
  package.json package-lock.json \
  src/hooks/useChat.ts \
  src/integrations/supabase/types.ts \
  src/__tests__/stability-regressions.test.ts \
  supabase/migrations/20260315000001_enable_rls.sql \
  supabase/migrations/20260315000002_secure_rpc.sql \
  supabase/migrations/20260429000000_reconcile_rls_and_xp.sql
```

Do not stage `.superpowers/brainstorm/*` unless you intentionally want those generated brainstorming folders in this commit.

```bash
git commit -m "chore: add codex workflow and stabilize supabase chat"
git push origin main
```

## 4. Live Site

The public site is documented as:

```text
https://bahasabuddy.lovable.app
```

If Lovable is connected to GitHub `main`, pushing to `origin/main` should trigger the site update. If it does not, open the Lovable project and manually sync/deploy the latest GitHub commit.

Confirm production environment variables before testing:

```text
VITE_SUPABASE_URL=https://zxmwfvyqrtqtsrfhdvhv.supabase.co
VITE_SUPABASE_ANON_KEY=<current anon key from Supabase dashboard>
```

Smoke test the live site after deploy:

- Sign up or sign in.
- Complete onboarding.
- Complete a lesson or card flow and confirm XP changes.
- Open Community and confirm rooms, messages, avatar/name display, and realtime updates.
- Upload or change an avatar.
- Check browser console and Supabase logs for RLS, RPC, or storage errors.

## 5. Rollback

Frontend rollback:

```bash
git revert <bad-commit-sha>
git push origin main
```

Database rollback should be deliberate. For urgent RLS breakage, use the emergency SQL in `supabase/emergency/rollback_disable_rls.sql` from the Supabase SQL editor, then replace it with a proper forward migration.
