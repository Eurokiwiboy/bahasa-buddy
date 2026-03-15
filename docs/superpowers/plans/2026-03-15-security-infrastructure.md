# Security & Infrastructure Foundation — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Secure the Bahasa Buddy app by fixing exposed credentials, adding RLS to all 15 database tables, setting up Supabase CLI with migrations, and cleaning up Lovable artifacts.

**Architecture:** Remove hardcoded Supabase keys from client code and use environment variables. Write RLS policies as SQL migration files. Set up Supabase CLI for schema-as-code workflow. Add guard-rail tests to prevent security regressions.

**Tech Stack:** React 18, TypeScript, Vite, Supabase (CLI + migrations), vitest

**Spec:** `docs/superpowers/specs/2026-03-15-security-infrastructure-design.md`

**Source code location:** `/tmp/bahasa-buddy-main/` (extracted from zip; the working directory at the CloudDocs path contains docs/plans only)

---

## Chunk 1: Credential Security & Environment Setup

### Task 1: Add .env to .gitignore and create .env.example

**Files:**
- Modify: `/tmp/bahasa-buddy-main/.gitignore`
- Create: `/tmp/bahasa-buddy-main/.env.example`

- [ ] **Step 1: Add .env entries to .gitignore**

Append to `.gitignore`:
```
# Environment variables
.env
.env.local
.env.*.local
```

- [ ] **Step 2: Create .env.example with placeholder values**

```
# Supabase Configuration
# Copy this file to .env and fill in your credentials
# Get these from: Supabase Dashboard → Settings → API

VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

- [ ] **Step 3: Create .env with your actual credentials (local only, never committed)**

Copy `.env.example` to `.env` and fill in your Supabase project URL and anon key from the Supabase dashboard (Settings → API). Use the current key for now — Task 6 covers key rotation.

```bash
cp .env.example .env
# Then edit .env with your real values
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore .env.example
git commit -m "chore: add .env to gitignore, create .env.example"
```

---

### Task 2: Remove hardcoded credentials from client.ts

**Files:**
- Modify: `/tmp/bahasa-buddy-main/src/integrations/supabase/client.ts`

- [ ] **Step 1: Read the current client.ts to confirm exact content**

```bash
cat src/integrations/supabase/client.ts
```

The file currently has:
```typescript
const SUPABASE_URL = 'https://zxmwfvyqrtqtsrfhdvhv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

- [ ] **Step 2: Replace hardcoded values with environment variable reads**

Replace the hardcoded URL and key constants with:

```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Copy .env.example to .env and fill in your credentials.'
  );
}
```

Also remove the comment about "ignoring Lovable's env vars" if present.

- [ ] **Step 3: Verify the app still loads locally**

```bash
npm run dev
```

Open http://localhost:8080 and confirm the app loads without errors. Check the browser console for any Supabase connection errors.

- [ ] **Step 4: Commit**

```bash
git add src/integrations/supabase/client.ts
git commit -m "fix: remove hardcoded Supabase credentials, use env vars"
```

---

### Task 3: Write guard-rail test for Supabase client

**Files:**
- Create: `/tmp/bahasa-buddy-main/src/__tests__/supabase-client.test.ts`
- Create: `/tmp/bahasa-buddy-main/src/test/setup.ts` (if it doesn't exist)

- [ ] **Step 1: Ensure test setup file exists**

Check if `src/test/setup.ts` exists (referenced in `vitest.config.ts`). If not, create it:

```typescript
// src/test/setup.ts
// Vitest setup file
```

- [ ] **Step 2: Write the failing test — verify no hardcoded credentials**

```typescript
// src/__tests__/supabase-client.test.ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Supabase client security', () => {
  const clientSource = readFileSync(
    resolve(__dirname, '../integrations/supabase/client.ts'),
    'utf-8'
  );

  it('should not contain hardcoded Supabase URLs', () => {
    // Match any supabase.co URL that is directly assigned as a string literal
    const hardcodedUrl = /['"]https:\/\/[a-z]+\.supabase\.co['"]/;
    expect(clientSource).not.toMatch(hardcodedUrl);
  });

  it('should not contain hardcoded JWT tokens', () => {
    // Match any eyJ... JWT token string literal
    const hardcodedJwt = /['"]eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+['"]/;
    expect(clientSource).not.toMatch(hardcodedJwt);
  });

  it('should read URL from environment variables', () => {
    expect(clientSource).toContain('import.meta.env.VITE_SUPABASE_URL');
  });

  it('should read anon key from environment variables', () => {
    expect(clientSource).toContain('import.meta.env.VITE_SUPABASE_ANON_KEY');
  });

  it('should not reference service_role key', () => {
    expect(clientSource.toLowerCase()).not.toContain('service_role');
    expect(clientSource).not.toContain('SUPABASE_SERVICE_ROLE');
  });
});
```

- [ ] **Step 3: Run the test to verify it passes (since Task 2 already fixed the client)**

```bash
npx vitest run src/__tests__/supabase-client.test.ts
```

Expected: All 5 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add src/__tests__/supabase-client.test.ts src/test/setup.ts
git commit -m "test: add guard-rail tests for Supabase client credentials"
```

---

### Task 4: Write env validation test

**Files:**
- Create: `/tmp/bahasa-buddy-main/src/__tests__/env-validation.test.ts`

- [ ] **Step 1: Write the test**

```typescript
// src/__tests__/env-validation.test.ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Environment variable validation', () => {
  it('.env.example should exist and list required variables', () => {
    const envExample = readFileSync(
      resolve(__dirname, '../../.env.example'),
      'utf-8'
    );

    expect(envExample).toContain('VITE_SUPABASE_URL');
    expect(envExample).toContain('VITE_SUPABASE_ANON_KEY');
  });

  it('.env.example should not contain real credentials', () => {
    const envExample = readFileSync(
      resolve(__dirname, '../../.env.example'),
      'utf-8'
    );

    // Should not contain any real Supabase project refs
    expect(envExample).not.toContain('zxmwfvyqrtqtsrfhdvhv');
    expect(envExample).not.toContain('efpgaasufgsfimakduve');
    // Should not contain any JWT tokens
    expect(envExample).not.toMatch(/eyJ[A-Za-z0-9_-]{20,}/);
  });

  it('.gitignore should include .env', () => {
    const gitignore = readFileSync(
      resolve(__dirname, '../../.gitignore'),
      'utf-8'
    );

    expect(gitignore).toContain('.env');
  });
});
```

- [ ] **Step 2: Run test**

```bash
npx vitest run src/__tests__/env-validation.test.ts
```

Expected: All 3 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/env-validation.test.ts
git commit -m "test: add env validation guard-rail tests"
```

---

### Task 5: Clean up Lovable references

**Files:**
- Modify: `/tmp/bahasa-buddy-main/supabase/config.toml`
- Delete: `/tmp/bahasa-buddy-main/.env` (from git tracking only — keep local file)
- Modify: `/tmp/bahasa-buddy-main/src/integrations/supabase/client.ts` (if any Lovable comments remain)

- [ ] **Step 1: Update supabase/config.toml**

Replace contents with:
```toml
[project]
project_id = "zxmwfvyqrtqtsrfhdvhv"
```

- [ ] **Step 2: Remove .env from git tracking (but keep local file)**

```bash
git rm --cached .env 2>/dev/null || echo ".env was not tracked — skipping"
```

This removes `.env` from the repo but keeps your local copy. If the file was never tracked, the command will skip gracefully.

- [ ] **Step 2b: Verify no code references old Lovable env variable names**

```bash
grep -r "VITE_SUPABASE_PROJECT_ID\|VITE_SUPABASE_PUBLISHABLE_KEY" src/ --include="*.ts" --include="*.tsx"
```

If any files reference these old variable names (`VITE_SUPABASE_PROJECT_ID` or `VITE_SUPABASE_PUBLISHABLE_KEY`), update them to use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` respectively.

- [ ] **Step 3: Remove any remaining Lovable comments from client.ts**

Search for and remove any comments mentioning "Lovable" in `client.ts`.

- [ ] **Step 4: Commit**

```bash
git add supabase/config.toml src/integrations/supabase/client.ts
git commit -m "chore: remove Lovable references, update supabase config to correct project"
```

---

### Task 6: Manual — Rotate Supabase anon key (Elliott)

**This task requires manual action in the Supabase dashboard. It cannot be automated.**

- [ ] **Step 1: Go to Supabase dashboard**

Navigate to: https://supabase.com/dashboard/project/zxmwfvyqrtqtsrfhdvhv/settings/api

- [ ] **Step 2: Regenerate the anon (public) key**

Click the regenerate button next to the anon key. Copy the new key.

- [ ] **Step 3: Update your local .env with the new key**

Edit `.env`:
```
VITE_SUPABASE_URL=https://zxmwfvyqrtqtsrfhdvhv.supabase.co
VITE_SUPABASE_ANON_KEY=<paste-new-key-here>
```

- [ ] **Step 4: Update Lovable deployment env vars**

In Lovable's deployment settings, update the environment variables to use the new key and your project URL.

- [ ] **Step 5: Verify the app works locally and on the deployed site**

```bash
npm run dev
```

Check http://localhost:8080 — app should load and auth should work. Then check https://bahasabuddy.lovable.app.

---

### Task 7: Scrub git history of exposed keys

**Files:** None (git operation only)

- [ ] **Step 1: Install BFG Repo-Cleaner**

```bash
brew install bfg
```

- [ ] **Step 2: Create a file listing the secrets to remove**

Create a temporary file `secrets.txt` (do NOT commit this). To find the old keys, run:

```bash
git log --all -p -- .env src/integrations/supabase/client.ts | grep -oE 'eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+' | sort -u
```

Put each unique JWT token on its own line in `secrets.txt`. Also add the Lovable project ref `efpgaasufgsfimakduve` on its own line.

**Note:** Do NOT include `zxmwfvyqrtqtsrfhdvhv` — that's your project ref and is fine to have in config.toml.

- [ ] **Step 3: Clone a mirror copy and run BFG**

BFG must run on a bare/mirror clone:

```bash
cd /tmp
git clone --mirror git@github.com:Eurokiwiboy/bahasa-buddy.git bahasa-buddy-mirror.git
cd bahasa-buddy-mirror.git
bfg --replace-text /path/to/secrets.txt
git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

- [ ] **Step 4: Force push the cleaned history from the mirror**

```bash
git push --force
```

**Warning:** This rewrites git history. All collaborators (if any) will need to re-clone.

- [ ] **Step 5: Re-clone your working copy**

```bash
cd /tmp
rm -rf bahasa-buddy-mirror.git
cd /path/to/your/working/directory
git clone git@github.com:Eurokiwiboy/bahasa-buddy.git
```

Copy your `.env` file into the new clone.

- [ ] **Step 6: Delete secrets.txt**

```bash
rm secrets.txt
```

- [ ] **Step 7: Run all tests to verify nothing broke**

```bash
npx vitest run
```

Expected: All tests PASS.

---

## Chunk 2: Supabase CLI & Migration Setup

### Task 8: Install and link Supabase CLI

**Files:** None (CLI setup only)

- [ ] **Step 1: Install Supabase CLI**

```bash
brew install supabase/tap/supabase
```

- [ ] **Step 2: Verify installation**

```bash
supabase --version
```

Expected: Version number output (e.g., `1.x.x`).

- [ ] **Step 3: Log in to Supabase**

```bash
supabase login
```

Follow the browser-based auth flow.

- [ ] **Step 4: Link to your project**

```bash
cd /tmp/bahasa-buddy-main
supabase link --project-ref zxmwfvyqrtqtsrfhdvhv
```

Enter your database password when prompted.

---

### Task 9: Export baseline schema migration

**Files:**
- Create: `/tmp/bahasa-buddy-main/supabase/migrations/20260315000000_baseline.sql`

- [ ] **Step 1: Create migrations directory**

```bash
mkdir -p supabase/migrations
```

- [ ] **Step 2: Export current schema**

```bash
supabase db dump --schema public > supabase/migrations/20260315000000_baseline.sql
```

- [ ] **Step 3: Review the exported schema**

Open the file and verify it contains:
- All 15 tables (profiles, categories, splash_cards, user_card_progress, lessons, phrases, user_lesson_progress, chat_rooms, chat_room_members, chat_messages, message_reactions, daily_goals, achievements, user_achievements, xp_transactions)
- The `handle_new_user` trigger on auth.users (or equivalent profile creation trigger)
- The `add_xp` RPC function
- Any indexes

If the trigger or function is missing, they'll need to be added manually.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260315000000_baseline.sql
git commit -m "chore: add baseline schema migration from current database"
```

---

## Chunk 3: RLS Policies Migration

### Task 10: Write RLS migration — Tier 1 (User-Owned Data)

**Files:**
- Create: `/tmp/bahasa-buddy-main/supabase/migrations/20260315000001_enable_rls.sql`

- [ ] **Step 1: Create the RLS migration file with Tier 1 policies**

```sql
-- Migration: Enable Row Level Security on all tables
-- Tier 1: User-Owned Data — users can only access their own rows

-- ============================================================
-- PROFILES
-- ============================================================
BEGIN;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
COMMIT;

-- ============================================================
-- USER_CARD_PROGRESS
-- ============================================================
BEGIN;
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
COMMIT;

-- ============================================================
-- USER_LESSON_PROGRESS
-- ============================================================
BEGIN;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own lesson progress"
  ON user_lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON user_lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON user_lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);
COMMIT;

-- ============================================================
-- DAILY_GOALS
-- ============================================================
BEGIN;
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own daily goals"
  ON daily_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily goals"
  ON daily_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily goals"
  ON daily_goals FOR UPDATE
  USING (auth.uid() = user_id);
COMMIT;

-- ============================================================
-- USER_ACHIEVEMENTS
-- ============================================================
BEGIN;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);
COMMIT;

-- ============================================================
-- XP_TRANSACTIONS (read own only — insert via RPC)
-- ============================================================
BEGIN;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own xp transactions"
  ON xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT policy — inserts go through the add_xp RPC function (SECURITY DEFINER)
COMMIT;
```

- [ ] **Step 2: Append Tier 2 policies to the same file**

```sql
-- ============================================================
-- Tier 2: Shared Content — read-only for authenticated users
-- ============================================================

BEGIN;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read categories"
  ON categories FOR SELECT
  USING (auth.role() = 'authenticated');
COMMIT;

BEGIN;
ALTER TABLE splash_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read splash cards"
  ON splash_cards FOR SELECT
  USING (auth.role() = 'authenticated');
COMMIT;

BEGIN;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read lessons"
  ON lessons FOR SELECT
  USING (auth.role() = 'authenticated');
COMMIT;

BEGIN;
ALTER TABLE phrases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read phrases"
  ON phrases FOR SELECT
  USING (auth.role() = 'authenticated');
COMMIT;

BEGIN;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read achievements"
  ON achievements FOR SELECT
  USING (auth.role() = 'authenticated');
COMMIT;
```

- [ ] **Step 3: Append Tier 3 policies (Community Chat)**

```sql
-- ============================================================
-- Tier 3: Community Chat — scoped to room membership
-- ============================================================

-- CHAT_ROOMS
BEGIN;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read chat rooms"
  ON chat_rooms FOR SELECT
  USING (auth.role() = 'authenticated');
COMMIT;

-- CHAT_ROOM_MEMBERS
BEGIN;
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
COMMIT;

-- CHAT_MESSAGES
BEGIN;
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
COMMIT;

-- MESSAGE_REACTIONS
BEGIN;
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
COMMIT;

-- ============================================================
-- Performance index for chat membership lookups
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_chat_room_members_room_user
  ON chat_room_members (room_id, user_id);
```

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260315000001_enable_rls.sql
git commit -m "feat: add RLS policies for all 15 tables"
```

---

### Task 11: Write RPC security migration

**Files:**
- Create: `/tmp/bahasa-buddy-main/supabase/migrations/20260315000002_secure_rpc.sql`

- [ ] **Step 1: Create the RPC security migration**

```sql
-- Migration: Secure the add_xp RPC function
-- Adds input validation and revokes direct INSERT on xp_transactions

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

-- Revoke direct INSERT on xp_transactions from client roles
REVOKE INSERT ON xp_transactions FROM anon, authenticated;
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/20260315000002_secure_rpc.sql
git commit -m "feat: secure add_xp RPC function with validation"
```

---

### Task 12: Create emergency rollback script

**Files:**
- Create: `/tmp/bahasa-buddy-main/supabase/emergency/rollback_disable_rls.sql`

**Note:** This file is placed OUTSIDE `supabase/migrations/` so `supabase db push` will NOT apply it automatically. It's an emergency escape hatch only — run manually via the Supabase dashboard SQL editor if needed.

- [ ] **Step 1: Create the emergency directory and rollback file**

```bash
mkdir -p supabase/emergency
```

```sql
-- EMERGENCY ROLLBACK: Disable RLS on all tables
-- Only run this if RLS migration breaks the live app
-- Run manually via Supabase dashboard SQL editor

ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_card_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE splash_cards DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE phrases DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions DISABLE ROW LEVEL SECURITY;

-- Re-grant INSERT on xp_transactions if needed
GRANT INSERT ON xp_transactions TO anon, authenticated;
```

- [ ] **Step 2: Commit**

```bash
git add supabase/emergency/rollback_disable_rls.sql
git commit -m "chore: add emergency RLS rollback script (outside migrations dir, manual use only)"
```

---

### Task 13: Apply migrations to live database

**This task requires the Supabase CLI to be linked (Task 8).**

- [ ] **Step 1: Review pending migrations**

```bash
ls -la supabase/migrations/
```

Confirm these files exist and review their contents one more time:
- `20260315000000_baseline.sql`
- `20260315000001_enable_rls.sql`
- `20260315000002_secure_rpc.sql`

- [ ] **Step 2: Apply the migrations**

```bash
supabase db push
```

The CLI will show which migrations are pending and apply them. If it asks for confirmation, review the list and confirm.

- [ ] **Step 3: Verify RLS is enabled in the Supabase dashboard**

Go to: https://supabase.com/dashboard/project/zxmwfvyqrtqtsrfhdvhv/database/tables

For each table, confirm the "RLS Enabled" badge is visible. All 15 tables should show RLS enabled.

- [ ] **Step 4: Verify Realtime publication includes chat tables**

Go to: https://supabase.com/dashboard/project/zxmwfvyqrtqtsrfhdvhv/database/publications

Confirm the `realtime` publication includes `chat_messages` (and any other tables the app subscribes to). If not, add them via the dashboard.

- [ ] **Step 5: Functional verification on the live app**

Open https://bahasabuddy.lovable.app and test each tier:

**Tier 1 — User data:**
- [ ] Sign in works
- [ ] Home dashboard loads (profile data, streaks, XP)
- [ ] Daily goals display correctly

**Tier 2 — Shared content:**
- [ ] Learn page shows categories
- [ ] Flashcards load and flip correctly
- [ ] Practice quizzes work

**Tier 3 — Community chat:**
- [ ] Chat rooms list loads
- [ ] Can join a room
- [ ] Can send and see messages in real-time
- [ ] Can add reactions

**XP system:**
- [ ] XP is awarded after completing a flashcard or quiz

If anything breaks, immediately run the rollback SQL from `supabase/emergency/rollback_disable_rls.sql` in the Supabase dashboard SQL editor.

---

## Chunk 4: README & Final Cleanup

### Task 14: Rewrite README

**Files:**
- Modify: `/tmp/bahasa-buddy-main/README.md`

- [ ] **Step 1: Replace README content**

```markdown
# Bahasa Buddy

A Duolingo-inspired app for learning Bahasa Indonesia. Practice vocabulary with spaced-repetition flashcards, take quizzes, chat with the community, and track your progress with XP and achievements.

## Features

- Splash card flashcards with SM-2 spaced repetition
- Practice quizzes (multiple choice, fill-in-the-blank, listening, speed round)
- Community chat rooms with real-time messaging
- XP system, achievements, streaks, and daily goals
- Google and Apple OAuth sign-in

## Tech Stack

React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Supabase, Framer Motion, Tanstack Query

## Getting Started

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your Supabase credentials
3. `npm install`
4. `npm run dev`

The dev server runs at http://localhost:8080.

## Database Setup

1. Install Supabase CLI: `brew install supabase/tap/supabase`
2. Log in: `supabase login`
3. Link your project: `supabase link --project-ref <your-project-ref>`
4. Apply migrations: `supabase db push`

## Testing

```bash
npm test          # Run all tests
npm run test:watch  # Run tests in watch mode
```
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for Bahasa Buddy (replace Lovable template)"
```

---

### Task 15: Write auth flow test

**Files:**
- Create: `/tmp/bahasa-buddy-main/src/__tests__/auth-flow.test.ts`

- [ ] **Step 1: Write basic auth hook tests**

```typescript
// src/__tests__/auth-flow.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase client before importing the hook
vi.mock('../integrations/supabase/client', () => {
  const mockAuth = {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
  };

  return {
    supabase: {
      auth: mockAuth,
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
        upsert: vi.fn().mockResolvedValue({ error: null }),
      }),
    },
  };
});

describe('Auth flow security', () => {
  it('should not expose any credentials in the auth module', async () => {
    const { readFileSync } = await import('fs');
    const { resolve } = await import('path');

    const authSource = readFileSync(
      resolve(__dirname, '../hooks/useAuth.ts'),
      'utf-8'
    );

    // Auth hook should not contain any hardcoded keys or URLs
    expect(authSource).not.toMatch(/eyJ[A-Za-z0-9_-]{20,}/);
    expect(authSource).not.toMatch(/['"]https:\/\/[a-z]+\.supabase\.co['"]/);
  });

  it('should import supabase client from the integrations module', async () => {
    const { readFileSync } = await import('fs');
    const { resolve } = await import('path');

    const authSource = readFileSync(
      resolve(__dirname, '../hooks/useAuth.ts'),
      'utf-8'
    );

    // Should import from the centralized client, not create its own
    expect(authSource).toContain('supabase');
    expect(authSource).not.toContain('createClient');
  });
});
```

- [ ] **Step 2: Run all tests**

```bash
npx vitest run
```

Expected: All tests across all 3 test files PASS.

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/auth-flow.test.ts
git commit -m "test: add auth flow security tests"
```

---

### Task 16: Final verification

- [ ] **Step 1: Run the full test suite**

```bash
npx vitest run
```

Expected: All tests PASS.

- [ ] **Step 2: Run the build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Verify the deployed app**

Check https://bahasabuddy.lovable.app — all features should work:
- Sign in/out
- View categories and flashcards
- Practice quizzes
- Community chat
- Profile with XP and achievements

- [ ] **Step 4: Push all changes**

```bash
git push origin main
```

---

## Summary of All Tasks

| # | Task | Type | Dependencies |
|---|------|------|-------------|
| 1 | Add .env to .gitignore, create .env.example | Code | None |
| 2 | Remove hardcoded credentials from client.ts | Code | Task 1 |
| 3 | Guard-rail test: Supabase client | Test | Task 2 |
| 4 | Guard-rail test: env validation | Test | Task 1 |
| 5 | Clean up Lovable references | Code | Task 2 |
| 6 | **Manual:** Rotate Supabase anon key | Manual | Task 2 |
| 7 | Scrub git history with BFG | Git | Task 6 |
| 8 | Install and link Supabase CLI | Setup | None |
| 9 | Export baseline schema migration | Code | Task 8 |
| 10 | Write RLS migration (all 3 tiers) | Code | Task 9 |
| 11 | Write RPC security migration | Code | Task 10 |
| 12 | Create emergency rollback migration | Code | Task 10 |
| 13 | **Manual:** Apply migrations to live DB | Manual | Tasks 10-12 |
| 14 | Rewrite README | Docs | Task 5 |
| 15 | Auth flow test | Test | Task 2 |
| 16 | Final verification | QA | All tasks |
