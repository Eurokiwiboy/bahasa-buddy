-- Seed initial chat rooms for community feature
-- Only inserts if no rooms exist yet (idempotent)

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM chat_rooms LIMIT 1) THEN
    INSERT INTO chat_rooms (name, description, icon, level_requirement, is_active) VALUES
      ('Beginners Lounge', 'Perfect for A1-A2 learners', '🌱', 'beginner', true),
      ('Intermediate Discussion', 'For B1-B2 level conversations', '📖', 'intermediate', true),
      ('Advanced Conversations', 'Fluent speakers welcome', '🎓', 'advanced', true),
      ('Food & Recipes', 'Discuss Indonesian cuisine', '🍜', 'beginner', true),
      ('Travel Tips', 'Share travel experiences', '✈️', 'beginner', true),
      ('Culture & Traditions', 'Learn about Indonesian culture', '🎭', 'beginner', true);
  END IF;
END $$;
