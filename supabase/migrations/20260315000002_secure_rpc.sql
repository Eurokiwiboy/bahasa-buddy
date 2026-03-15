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
