-- Reconcile RLS policies and restore secure XP awarding for already-deployed databases.

-- Remove baseline public/permissive policies that remain permissive even after
-- stricter policies are added.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "User achievements are viewable by everyone" ON user_achievements;
DROP POLICY IF EXISTS "Users can create XP transactions" ON xp_transactions;

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Splash cards are viewable by everyone" ON splash_cards;
DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON lessons;
DROP POLICY IF EXISTS "Phrases are viewable by everyone" ON phrases;
DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON achievements;

DROP POLICY IF EXISTS "Active chat rooms are viewable by everyone" ON chat_rooms;
DROP POLICY IF EXISTS "Users can view room members" ON chat_room_members;
DROP POLICY IF EXISTS "Users can view messages in their rooms" ON chat_messages;
DROP POLICY IF EXISTS "Users can send messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can view reactions" ON message_reactions;

-- Recreate the intended stricter policies idempotently.
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Authenticated users can read categories" ON categories;
CREATE POLICY "Authenticated users can read categories"
  ON categories FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read splash cards" ON splash_cards;
CREATE POLICY "Authenticated users can read splash cards"
  ON splash_cards FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read lessons" ON lessons;
CREATE POLICY "Authenticated users can read lessons"
  ON lessons FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read phrases" ON phrases;
CREATE POLICY "Authenticated users can read phrases"
  ON phrases FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read achievements" ON achievements;
CREATE POLICY "Authenticated users can read achievements"
  ON achievements FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can read own achievements" ON user_achievements;
CREATE POLICY "Users can read own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own xp transactions" ON xp_transactions;
CREATE POLICY "Users can read own xp transactions"
  ON xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can read chat rooms" ON chat_rooms;
CREATE POLICY "Authenticated users can read chat rooms"
  ON chat_rooms FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can see room members" ON chat_room_members;
CREATE POLICY "Authenticated users can see room members"
  ON chat_room_members FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Room members can read messages" ON chat_messages;
CREATE POLICY "Room members can read messages"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_room_members
      WHERE chat_room_members.room_id = chat_messages.room_id
        AND chat_room_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Room members can send messages" ON chat_messages;
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

DROP POLICY IF EXISTS "Room members can see reactions" ON message_reactions;
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

CREATE OR REPLACE VIEW public_profiles AS
SELECT
  id,
  display_name,
  avatar_url,
  learning_level
FROM profiles;

GRANT SELECT ON public_profiles TO authenticated;

CREATE OR REPLACE FUNCTION add_xp(
  p_user_id uuid,
  p_amount integer,
  p_source text,
  p_description text DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_last_practice date;
  v_current_streak integer;
  v_longest_streak integer;
BEGIN
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot add XP for another user';
  END IF;

  IF p_amount < 1 OR p_amount > 100 THEN
    RAISE EXCEPTION 'XP amount must be between 1 and 100';
  END IF;

  SELECT last_practice_date, current_streak, longest_streak
  INTO v_last_practice, v_current_streak, v_longest_streak
  FROM profiles
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  v_current_streak := COALESCE(v_current_streak, 0);
  v_longest_streak := COALESCE(v_longest_streak, 0);

  IF v_last_practice IS NULL OR v_last_practice < current_date - interval '1 day' THEN
    v_current_streak := 1;
  ELSIF v_last_practice = current_date - interval '1 day' THEN
    v_current_streak := v_current_streak + 1;
  END IF;

  IF v_current_streak > v_longest_streak THEN
    v_longest_streak := v_current_streak;
  END IF;

  UPDATE profiles
  SET
    xp_total = COALESCE(xp_total, 0) + p_amount,
    xp_today = CASE
      WHEN last_practice_date = current_date THEN COALESCE(xp_today, 0) + p_amount
      ELSE p_amount
    END,
    current_streak = v_current_streak,
    longest_streak = v_longest_streak,
    last_practice_date = current_date,
    updated_at = now()
  WHERE id = p_user_id;

  INSERT INTO xp_transactions (user_id, amount, source, description)
  VALUES (p_user_id, p_amount, p_source, p_description);

  INSERT INTO daily_goals (user_id, goal_date, xp_earned)
  VALUES (p_user_id, current_date, p_amount)
  ON CONFLICT (user_id, goal_date)
  DO UPDATE SET xp_earned = daily_goals.xp_earned + p_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION add_xp(uuid, integer, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION add_xp(uuid, integer, text, text) TO authenticated;
REVOKE INSERT ON xp_transactions FROM anon, authenticated;
