# Bahasa Buddy — Security & Infrastructure Foundation

**Date:** 2026-03-15
**Status:** Approved
**Approach:** Proper Foundation (Option B)

## Context

Bahasa Buddy is a React + TypeScript language learning app (Duolingo-inspired for Bahasa Indonesia) deployed publicly at `bahasabuddy.lovable.app`. It uses Supabase for auth, database, and real-time features.

### Current Problems

1. **Exposed credentials** — Supabase anon key is hardcoded in `src/integrations/supabase/client.ts` AND committed in `.env` in the public GitHub repo
2. **Two Supabase projects** — Lovable's project (efpgaa...) in `.env`, Elliott's project (zxmwfv...) hardcoded in `client.ts`. Elliott's is the canonical one.
3. **No Row Level Security** — all tables are open to anyone with the anon key
4. **No database migrations** — schema exists only in Supabase dashboard, not version-controlled
5. **No `.env.example`** — no documentation of required environment variables
6. **Lovable artifacts** — README still says "Lovable App", config references Lovable's project
7. **No tests** — vitest is configured but no test files exist

### Decisions Made

- **Canonical Supabase project:** zxmwfv... (Elliott's personal project)
- **Lovable's project:** abandoned, all references removed
- **Supabase management:** currently dashboard-only; will set up CLI + migrations
- **RLS status:** none currently; will enable on all tables
- **Deployment:** publicly live, making security fixes urgent

---

## Section 1: Credential Security

### Changes

| Current State | Target State |
|---|---|
| `.env` committed to repo with Lovable keys | `.env` in `.gitignore`, never committed |
| `client.ts` has hardcoded keys overriding `.env` | `client.ts` reads from `import.meta.env` |
| Both key sets visible in git history | Git history scrubbed via BFG Repo-Cleaner |
| No `.env.example` | `.env.example` with placeholders and comments |

### Implementation Details

**client.ts** will change from:
```typescript
const SUPABASE_URL = 'https://zxmwfvyqrtqtsrfhdvhv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJ...';
```

To:
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Copy .env.example to .env and fill in your credentials.');
}
```

**.env.example** will contain:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Manual Steps (by Elliott)

1. **Rotate anon key** in Supabase dashboard (Settings → API → Regenerate anon key)
2. **Update Lovable deployment** env vars with the new key
3. **Run BFG Repo-Cleaner** to scrub old keys from git history (instructions provided in plan)

---

## Section 2: Row Level Security (RLS)

### Policy Design

All tables get RLS enabled with default-deny. Three tiers of access:

#### Tier 1: User-Owned Data (users see only their own rows)

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | own row (`auth.uid() = id`) | — (created by trigger) | own row | — |
| `user_card_progress` | own rows | own rows | own rows | — |
| `user_lesson_progress` | own rows | own rows | own rows | — |
| `daily_goals` | own rows | own rows | own rows | — |
| `user_achievements` | own rows | own rows | — | — |
| `xp_transactions` | own rows | via RPC only | — | — |

#### Tier 2: Shared Content (read-only for authenticated users)

| Table | SELECT | INSERT/UPDATE/DELETE |
|---|---|---|
| `categories` | all authenticated | none (admin via service_role) |
| `splash_cards` | all authenticated | none (admin via service_role) |
| `lessons` | all authenticated | none (admin via service_role) |
| `phrases` | all authenticated | none (admin via service_role) |
| `achievements` | all authenticated | none (admin via service_role) |

#### Tier 3: Community Chat (scoped to room membership)

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `chat_rooms` | all authenticated | — | — | — |
| `chat_room_members` | all authenticated | own membership | — | own membership |
| `chat_messages` | if room member | if room member | own messages | own messages |
| `message_reactions` | if room member | own reactions | — | own reactions |

### Example RLS SQL — Tier 1 (User-Owned)

```sql
-- profiles: users can only read and update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

```sql
-- user_card_progress: users can only access their own progress
ALTER TABLE user_card_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own card progress"
  ON user_card_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own card progress"
  ON user_card_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own card progress"
  ON user_card_progress FOR UPDATE
  USING (auth.uid() = user_id);
```

The same `auth.uid() = user_id` pattern applies to `user_lesson_progress`, `daily_goals`, and `user_achievements`.

### Example RLS SQL — Tier 2 (Shared Content)

```sql
-- categories: read-only for authenticated users
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read categories"
  ON categories FOR SELECT
  USING (auth.role() = 'authenticated');
```

The same pattern applies to `splash_cards`, `lessons`, `phrases`, and `achievements`. No INSERT/UPDATE/DELETE policies — content is managed via the Supabase dashboard using the `service_role` key.

### Example RLS SQL — Tier 3 (Community Chat)

```sql
-- chat_rooms: readable by all authenticated users
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read chat rooms"
  ON chat_rooms FOR SELECT
  USING (auth.role() = 'authenticated');

-- chat_room_members: users can join/leave rooms, all can see membership
ALTER TABLE chat_room_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can see room members"
  ON chat_room_members FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can join rooms"
  ON chat_room_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms"
  ON chat_room_members FOR DELETE
  USING (auth.uid() = user_id);

-- chat_messages: scoped to room membership via subquery
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Room members can read messages"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_room_members
      WHERE chat_room_members.room_id = chat_messages.room_id
        AND chat_room_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Room members can send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM chat_room_members
      WHERE chat_room_members.room_id = chat_messages.room_id
        AND chat_room_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can edit own messages"
  ON chat_messages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON chat_messages FOR DELETE
  USING (auth.uid() = user_id);

-- message_reactions: similar membership gating
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Room members can see reactions"
  ON message_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_room_members crm
      JOIN chat_messages cm ON cm.room_id = crm.room_id
      WHERE cm.id = message_reactions.message_id
        AND crm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add reactions"
  ON message_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions"
  ON message_reactions FOR DELETE
  USING (auth.uid() = user_id);
```

**Performance note:** The `chat_room_members` table should have an index on `(room_id, user_id)` for the membership subqueries. This will be included in the baseline migration or as a separate index migration.

### XP RPC Function Security

The existing `add_xp` RPC function must be `SECURITY DEFINER` (runs as function owner, bypassing RLS) with input validation:

```sql
CREATE OR REPLACE FUNCTION add_xp(
  p_user_id uuid,
  p_amount integer,
  p_source text,
  p_description text
) RETURNS void AS $$
BEGIN
  -- Validate: only the authenticated user can add XP to their own account
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot add XP for another user';
  END IF;

  -- Validate: reasonable XP amount (prevent abuse)
  IF p_amount < 1 OR p_amount > 100 THEN
    RAISE EXCEPTION 'XP amount must be between 1 and 100';
  END IF;

  INSERT INTO xp_transactions (user_id, amount, source, description)
  VALUES (p_user_id, p_amount, p_source, p_description);

  UPDATE profiles
  SET total_xp = COALESCE(total_xp, 0) + p_amount
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revoke direct INSERT on xp_transactions from anon and authenticated roles
REVOKE INSERT ON xp_transactions FROM anon, authenticated;
```

### service_role Key Handling

**Critical rule:** The `service_role` key must NEVER appear in client-side code. It bypasses all RLS policies.

- **Where it's used:** only in the Supabase dashboard SQL editor, or in server-side Edge Functions (future)
- **Content management** (adding lessons, cards, categories) is done via the Supabase dashboard Table Editor, which uses the `service_role` key internally
- **The `.env.example` and client code must never reference `service_role`**

### DELETE Policy Decisions

DELETE is intentionally omitted from user-owned data tables (`user_card_progress`, `user_lesson_progress`, `daily_goals`, `user_achievements`). Rationale:

- Users should not accidentally lose learning progress
- If a GDPR-style data deletion request is needed, it can be handled via the Supabase dashboard using `service_role`
- A future "reset progress" feature can be added as an RPC function with appropriate validation

### Chat Room Access Model

All chat rooms are currently **public** — any authenticated user can join any room. This is intentional for the current community feature. If private/invite-only rooms are needed later, the `chat_room_members` INSERT policy would be updated to check an `is_public` column on `chat_rooms` or require an invitation record.

### RLS Deployment Strategy

To avoid breaking the live app during migration:

1. **Per-table transaction** — each table's RLS enablement + policies are applied in a single SQL transaction
2. **Order:** Enable RLS and add all policies for a table in the same `BEGIN...COMMIT` block
3. **Emergency rollback:** Keep a rollback migration ready that disables RLS if something breaks: `ALTER TABLE <table> DISABLE ROW LEVEL SECURITY;`
4. **Realtime compatibility:** Tables using Supabase Realtime (chat_messages) will continue to work — Supabase Realtime respects RLS policies. Verify the `realtime` publication includes the relevant tables after enabling RLS.

### Table Coverage Verification

Before implementation, cross-reference the tables listed above against:
- `src/integrations/supabase/types.ts` — the TypeScript type definitions
- All hooks in `src/hooks/` — any Supabase queries

If any tables exist in the database that are NOT listed in this spec, they must be added to the appropriate tier before RLS is enabled (otherwise they become inaccessible with default-deny).

### Key Principles

- **Default deny** — RLS enabled = no policies means no access
- **Content is read-only** — only admins (service_role in dashboard) manage lessons/cards
- **XP via RPC only** — `add_xp` function prevents users from inserting arbitrary XP
- **Chat membership gating** — must be a room member to read or send messages
- **service_role never in client** — only used in dashboard or server-side code

---

## Section 3: Supabase CLI & Schema Migrations

### New Directory Structure

```
supabase/
  ├── config.toml                           ← updated with zxmwfv... project ID
  ├── migrations/
  │   ├── 20260315000000_baseline.sql       ← exported current schema (includes profile trigger)
  │   ├── 20260315000001_enable_rls.sql     ← RLS policies from Section 2
  │   └── 20260315000002_secure_rpc.sql     ← lock down add_xp function
  └── seed.sql                              ← optional: sample data for fresh setup
```

**Note:** Migration filenames use Supabase CLI's timestamp convention (`YYYYMMDDHHMMSS_name.sql`) for compatibility with `supabase db push` ordering.

**Profiles trigger:** The baseline migration must include (or verify) the `handle_new_user` trigger on `auth.users` that auto-creates a `profiles` row on signup. Without this, new users would be locked out after RLS is enabled. If the trigger already exists in the remote database, the baseline export will capture it.

### Setup Steps

1. Install Supabase CLI: `brew install supabase/tap/supabase`
2. Log in: `supabase login`
3. Link project: `supabase link --project-ref zxmwfvyqrtqtsrfhdvhv`
4. Export current schema: `supabase db dump > supabase/migrations/00000000000000_baseline.sql`
5. Apply RLS migration: write policies as SQL, push with `supabase db push`

### Developer Workflow Going Forward

| Command | Purpose |
|---|---|
| `supabase db diff --schema public` | See differences between local migrations and remote |
| `supabase migration new <name>` | Create new timestamped migration file |
| `supabase db push` | Apply pending migrations to remote database |
| `supabase db reset` | Reset local DB and replay all migrations (for local dev) |

---

## Section 4: Cleanup, README & Testing

### Lovable Cleanup

- **Remove:** `.env` from repo (add to `.gitignore`)
- **Remove:** All Lovable project ID references (config.toml, any code comments)
- **Update:** `client.ts` — env vars instead of hardcoded keys
- **Update:** `supabase/config.toml` — Elliott's project ID only
- **Add:** `.env.example` with placeholder values

### README Rewrite

Replace the current Lovable template README with:

```
# Bahasa Buddy
A Duolingo-inspired app for learning Bahasa Indonesia.

## Features
- Splash card flashcards with SM-2 spaced repetition
- Practice quizzes (multiple choice, fill-in-the-blank, listening, speed round)
- Community chat rooms with real-time messaging
- XP system, achievements, and daily goals

## Tech Stack
React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Supabase, Framer Motion

## Getting Started
1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your Supabase credentials
3. `npm install`
4. `npm run dev`

## Database Setup
1. Install Supabase CLI: `brew install supabase/tap/supabase`
2. Link your project: `supabase link --project-ref <your-project-ref>`
3. Apply migrations: `supabase db push`
```

### Guard-Rail Tests

Three lightweight tests using vitest (already installed):

| Test File | Purpose |
|---|---|
| `src/__tests__/supabase-client.test.ts` | Verifies client reads from env vars, not hardcoded values |
| `src/__tests__/env-validation.test.ts` | Fails if required VITE_SUPABASE_* env vars are missing |
| `src/__tests__/auth-flow.test.ts` | Basic unit tests for useAuth hook with mocked Supabase |

These are regression guards — they prevent anyone from re-introducing the security issues we're fixing.

---

## Out of Scope (Future Work)

- Voice engine / speech recognition (next priority after security)
- Backend API layer (Edge Functions or separate server)
- CI/CD pipeline
- Staging vs production environments
- Content management system for lessons/cards
