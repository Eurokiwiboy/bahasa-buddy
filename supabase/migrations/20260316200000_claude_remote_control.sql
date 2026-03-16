-- 20260316200000_claude_remote_control.sql
-- Claude Remote Control Interface
-- Allows a Claude agent (via service_role) to send real-time commands/messages
-- to users in the app. Commands are broadcast via Supabase Realtime.

-- Command types:
--   message    : Display a chat-style tip or greeting from Claude
--   navigate   : Suggest navigating to a route (e.g. /learn/lesson/123)
--   highlight  : Highlight a specific phrase or concept by ID
--   exercise   : Prompt the user to try an exercise (payload: { lesson_id, phrase_id })
--   celebrate  : Show a celebration/encouragement overlay

CREATE TABLE IF NOT EXISTS claude_commands (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- null = broadcast to all authenticated users; set to a user's profile ID to target one user
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  command_type  TEXT NOT NULL CHECK (command_type IN (
                  'message', 'navigate', 'highlight', 'exercise', 'celebrate'
                )),
  payload       JSONB NOT NULL DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'executed', 'dismissed')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Commands expire after 30 minutes so the table stays clean
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT now() + interval '30 minutes'
);

-- Enable RLS
ALTER TABLE claude_commands ENABLE ROW LEVEL SECURITY;

-- Users can read commands addressed to them or broadcast (user_id IS NULL)
CREATE POLICY "claude_commands_read_own_or_broadcast"
  ON claude_commands
  FOR SELECT
  USING (
    user_id IS NULL
    OR user_id = auth.uid()
  );

-- Users can update status (mark executed/dismissed) on their own commands
CREATE POLICY "claude_commands_update_status"
  ON claude_commands
  FOR UPDATE
  USING (
    user_id IS NULL
    OR user_id = auth.uid()
  )
  WITH CHECK (
    user_id IS NULL
    OR user_id = auth.uid()
  );

-- Only service_role can insert commands (Claude agent uses service_role key)
-- Regular authenticated users cannot write commands
-- (No INSERT policy = only service_role bypass gets through)

-- Index for fast lookups of pending commands per user
CREATE INDEX IF NOT EXISTS idx_claude_commands_user_status
  ON claude_commands (user_id, status, created_at DESC);

-- Auto-delete expired commands to keep the table small
-- This is a cleanup helper; production would use pg_cron or a scheduled function
CREATE OR REPLACE FUNCTION delete_expired_claude_commands()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM claude_commands WHERE expires_at < now();
END;
$$;

-- Enable realtime for the table so the frontend can subscribe
ALTER PUBLICATION supabase_realtime ADD TABLE claude_commands;
