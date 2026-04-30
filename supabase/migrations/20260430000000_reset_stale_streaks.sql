-- Reset stale profile streak counters for existing deployed rows.
-- Fresh streak updates still live in add_xp; this migration repairs old state.

UPDATE profiles
SET
  current_streak = 0,
  xp_today = CASE
    WHEN last_practice_date = CURRENT_DATE THEN xp_today
    ELSE 0
  END,
  updated_at = now()
WHERE current_streak > 0
  AND (
    last_practice_date IS NULL
    OR last_practice_date < CURRENT_DATE - INTERVAL '1 day'
  );
