---
name: supabase-rls-audit
description: Use when reviewing or changing Supabase migrations, RLS policies, RPC functions, storage buckets, generated database types, auth flows, XP transactions, user progress, profiles, or realtime chat security.
---

# Supabase RLS Audit

## Required Reads

- `supabase/migrations/*.sql` relevant to the touched tables.
- `src/integrations/supabase/types.ts` for the app's generated schema.
- Hooks or pages that call the affected tables or RPCs.

## Audit Steps

1. Check migration replay from an empty database: duplicate policy names, duplicate columns, missing `IF EXISTS`, and ordering problems.
2. Compare every referenced column in app code, RPCs, and migrations.
3. Remember RLS policies are permissive by default. A stricter new policy does not cancel an older `USING (true)` policy.
4. Confirm `WITH CHECK` exists for inserts and updates where clients provide `user_id`.
5. For `SECURITY DEFINER` functions, validate `auth.uid()`, amount bounds, search path assumptions, and table columns.
6. For storage buckets, validate file path ownership, MIME limits, file size limits, and public-read intent.

## Bahasa Buddy Hotspots

- `add_xp` must use `xp_total`, `xp_today`, streak fields, `xp_transactions`, and `daily_goals` consistently.
- Profiles may need public display fields for chat, but private settings should not become globally readable.
- Chat membership policies must balance room discovery with message privacy.
- `quiz_sessions`, `quiz_answers`, `user_lesson_progress`, and `user_card_progress` should be user-owned.

## Output

Lead with findings and file links. For fixes, prefer a new migration that explicitly reconciles existing production state rather than editing old applied migrations unless the user is still pre-production and asks for a clean reset.

