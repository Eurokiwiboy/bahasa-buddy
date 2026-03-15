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
