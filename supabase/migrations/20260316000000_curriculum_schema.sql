-- 20260316000000_curriculum_schema.sql
-- Curriculum structure: stages, units, exercise types, grammar concepts

-- 1. Extend categories table for curriculum units
ALTER TABLE categories ADD COLUMN IF NOT EXISTS stage TEXT CHECK (stage IN ('survival', 'daily_life', 'fluency'));
ALTER TABLE categories ADD COLUMN IF NOT EXISTS cefr_level TEXT CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'));
ALTER TABLE categories ADD COLUMN IF NOT EXISTS unit_number INTEGER UNIQUE;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS unit_description TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS requires_unit_id UUID REFERENCES categories(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS min_completion_percent INTEGER DEFAULT 80;

-- 2. Extend lessons table
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS lesson_number INTEGER DEFAULT 1;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS tip_content JSONB;

-- 3. Extend phrases table for exercise metadata
ALTER TABLE phrases ADD COLUMN IF NOT EXISTS exercise_type TEXT DEFAULT 'multiple_choice'
  CHECK (exercise_type IN ('listen_select', 'match_pairs', 'multiple_choice',
    'multiple_choice_reverse', 'fill_blank', 'word_bank', 'word_order',
    'translate_to_id', 'translate_to_en', 'listen_type', 'speaking'));
ALTER TABLE phrases ADD COLUMN IF NOT EXISTS difficulty_tier TEXT CHECK (difficulty_tier IN ('easy', 'medium', 'hard')) DEFAULT 'easy';
ALTER TABLE phrases ADD COLUMN IF NOT EXISTS grammar_tags TEXT[];
ALTER TABLE phrases ADD COLUMN IF NOT EXISTS context_sentence TEXT;
ALTER TABLE phrases ADD COLUMN IF NOT EXISTS context_translation TEXT;

-- 4. Add question_text column to quiz_answers (used by exercise tracking)
ALTER TABLE quiz_answers ADD COLUMN IF NOT EXISTS question_text TEXT;

-- 5. Update quiz_answers CHECK constraint
ALTER TABLE quiz_answers DROP CONSTRAINT IF EXISTS quiz_answers_question_type_check;
ALTER TABLE quiz_answers ADD CONSTRAINT quiz_answers_question_type_check
  CHECK (question_type IN ('multiple_choice', 'typing', 'matching', 'listening',
    'speaking', 'listen_select', 'match_pairs', 'multiple_choice_reverse',
    'fill_blank', 'word_bank', 'word_order', 'translate_to_id', 'translate_to_en', 'listen_type'));

-- 6. Create grammar_concepts table
CREATE TABLE IF NOT EXISTS grammar_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  stage TEXT CHECK (stage IN ('survival', 'daily_life', 'fluency')),
  introduced_in_unit INTEGER REFERENCES categories(unit_number),
  revisited_in_units INTEGER[],
  examples JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE grammar_concepts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "grammar_concepts_public_read" ON grammar_concepts FOR SELECT USING (true);

-- 7. Add index for unit lookups
CREATE INDEX IF NOT EXISTS idx_categories_unit_number ON categories(unit_number);
CREATE INDEX IF NOT EXISTS idx_categories_stage ON categories(stage);
CREATE INDEX IF NOT EXISTS idx_lessons_lesson_number ON lessons(lesson_number);
CREATE INDEX IF NOT EXISTS idx_phrases_exercise_type ON phrases(exercise_type);
