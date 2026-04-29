-- Migration: Secure the add_xp RPC function
-- Adds input validation and revokes direct INSERT on xp_transactions

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
  -- Validate: only the authenticated user can add XP to their own account
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot add XP for another user';
  END IF;

  -- Validate: reasonable XP amount (prevent abuse)
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

-- Revoke direct INSERT on xp_transactions from client roles.
REVOKE INSERT ON xp_transactions FROM anon, authenticated;
