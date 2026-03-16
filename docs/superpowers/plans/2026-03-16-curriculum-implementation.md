# Curriculum Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the A1→B1 curriculum structure with schema changes, content seeding for Stage 1 (Units 1–10), 5 Phase 1 exercise components, grammar tip cards, unit progression/unlocking, and a redesigned Learn page showing the curriculum path.

**Architecture:** Database-first approach — migrate schema, seed Stage 1 content, then build UI components that consume the new data. The existing LearnPage becomes a curriculum path view organized by stages/units. LessonPage is replaced with an exercise engine that renders different exercise types. Existing hooks are extended, not replaced.

**Tech Stack:** Supabase (Postgres migrations), React 18, TypeScript, Tailwind CSS, Framer Motion, Vitest

**Spec:** `docs/superpowers/specs/2026-03-16-bahasa-curriculum-design.md`

---

## Chunk 1: Schema Migration & Content Seeding

### Task 1: Database Schema Migration

**Files:**
- Create: `supabase/migrations/20260316000000_curriculum_schema.sql`

- [ ] **Step 1: Write the migration SQL file**

```sql
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
```

- [ ] **Step 2: Apply migration to Supabase**

Run via Supabase MCP `apply_migration` tool or:
```bash
npx supabase db push
```
Expected: Migration applies without errors.

- [ ] **Step 3: Verify migration applied**

Run SQL to confirm new columns exist:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'categories' AND column_name IN ('stage', 'cefr_level', 'unit_number');
```
Expected: 3 rows returned.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260316000000_curriculum_schema.sql
git commit -m "feat: add curriculum schema migration (stages, units, exercises, grammar)"
```

---

### Task 2: Tag Existing Categories with Curriculum Metadata

**Files:**
- Create: `supabase/migrations/20260316000001_tag_existing_content.sql`

- [ ] **Step 1: Write migration to tag existing categories**

This maps existing categories to their unit positions per spec section 11. Must query actual category names to get UUIDs.

```sql
-- Tag existing categories with stage, cefr_level, unit_number
-- Using exact UUIDs from the database (categories were seeded outside migrations)

-- Greetings → Unit 1 (Survival/A1)
UPDATE categories SET stage = 'survival', cefr_level = 'A1', unit_number = 1,
  unit_description = 'Selamat pagi/siang/sore/malam, nama saya, apa kabar'
  WHERE id = '49968d87-9b5b-43a7-9b81-bf4ce5cbbba4';

-- Numbers → Unit 2 (Survival/A1)
UPDATE categories SET stage = 'survival', cefr_level = 'A1', unit_number = 2,
  unit_description = '0–1000, harga, berapa, currency handling'
  WHERE id = '625f9d84-9c63-48df-99af-e902e3765b3b';

-- Food → Unit 3 (Survival/A1)
UPDATE categories SET stage = 'survival', cefr_level = 'A1', unit_number = 3,
  unit_description = 'Ordering food, mau/tidak mau, ini/itu, basic negation'
  WHERE id = 'eb1c2ece-8087-434c-884b-91168eacbf1d';

-- Travel → Unit 4 (Survival/A1)
UPDATE categories SET stage = 'survival', cefr_level = 'A1', unit_number = 4,
  unit_description = 'Directions, di mana, kiri/kanan, transportation vocab'
  WHERE id = '633dbffd-78d0-4170-897e-a50e6263071b';

-- Shopping → Unit 5 (Survival/A1)
UPDATE categories SET stage = 'survival', cefr_level = 'A1', unit_number = 5,
  unit_description = 'Terlalu mahal, bisa kurang, colors, sizes'
  WHERE id = '6217d598-cc80-43a2-9a66-d4b671691f82';

-- Daily Life → Unit 6 (Survival/A1) — remapped as "Time & Days" content
UPDATE categories SET stage = 'survival', cefr_level = 'A1', unit_number = 6,
  name = 'Time & Days', description = 'Time, days, and daily routines',
  unit_description = 'Jam, hari, bulan, making appointments'
  WHERE id = 'ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a';

-- Emergency → Unit 7 (Survival/A1)
UPDATE categories SET stage = 'survival', cefr_level = 'A1', unit_number = 7,
  unit_description = 'Tolong, sakit, rumah sakit, pharmacy vocab'
  WHERE id = 'f36d40c7-382a-4237-b84c-13a092d1a7a2';

-- Formal → Unit 23 (Fluency/B1)
UPDATE categories SET stage = 'fluency', cefr_level = 'B1', unit_number = 23,
  unit_description = 'Surat (letters), formal meetings, bahasa baku vs bahasa gaul'
  WHERE id = '07b2f598-0e5b-47ea-afc7-d5da111ccccb';

-- NOTE: Family (Unit 11) and Work & Business (Unit 12) from spec section 11
-- do NOT exist in the database yet. They are Stage 2 (Daily Life/A2) categories
-- and will be created when Stage 2 content is implemented.

-- Tag existing lessons with lesson_number based on order_index within category
UPDATE lessons SET lesson_number = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY order_index) as rn
  FROM lessons
) sub
WHERE lessons.id = sub.id;

-- Tag existing phrases with default exercise_type and difficulty
UPDATE phrases SET exercise_type = 'multiple_choice', difficulty_tier = 'easy'
WHERE exercise_type IS NULL;
```

- [ ] **Step 2: Apply migration**

Run via Supabase MCP `apply_migration` or `execute_sql`.
Expected: Multiple rows updated without errors.

- [ ] **Step 3: Verify tagging**

```sql
SELECT name, unit_number, stage, cefr_level FROM categories
WHERE unit_number IS NOT NULL ORDER BY unit_number;
```
Expected: 10 rows with correct stage/cefr/unit assignments.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260316000001_tag_existing_content.sql
git commit -m "feat: tag existing categories with curriculum unit metadata"
```

---

### Task 3: Create New Units for Stage 1 (Units 8–10)

**Files:**
- Create: `supabase/migrations/20260316000002_seed_stage1_units.sql`

Units 1–7 exist (from existing categories). Units 8, 9, 10 are new for Stage 1.

- [ ] **Step 1: Write seed migration for remaining Stage 1 units**

```sql
-- Unit 8: Home & Accommodation
INSERT INTO categories (name, description, icon, stage, cefr_level, unit_number, unit_description)
VALUES ('Home & Accommodation', 'Rooms, furniture, kos/kontrakan vocab, landlord communication', '🏠', 'survival', 'A1', 8,
  'Rooms, furniture, kos/kontrakan vocab, landlord communication');

-- Unit 9: Weather & Nature
INSERT INTO categories (name, description, icon, stage, cefr_level, unit_number, unit_description)
VALUES ('Weather & Nature', 'Hujan, panas, musim, basic environment', '🌤️', 'survival', 'A1', 9,
  'Hujan, panas, musim, basic environment');

-- Unit 10: Review & Milestone (A1 Checkpoint)
INSERT INTO categories (name, description, icon, stage, cefr_level, unit_number, unit_description)
VALUES ('A1 Review & Milestone', 'Cumulative review, A1 checkpoint assessment', '🏆', 'survival', 'A1', 10,
  'Cumulative review, A1 checkpoint assessment');

-- Set up sequential unlock chain for Stage 1
-- Unit 2 requires Unit 1, Unit 3 requires Unit 2, etc.
UPDATE categories c2 SET requires_unit_id = c1.id
FROM categories c1
WHERE c2.unit_number = c1.unit_number + 1
  AND c1.unit_number >= 1 AND c1.unit_number <= 9
  AND c2.unit_number >= 2 AND c2.unit_number <= 10;
```

- [ ] **Step 2: Apply migration and verify**

```sql
SELECT name, unit_number, requires_unit_id IS NOT NULL as has_prereq
FROM categories WHERE stage = 'survival' ORDER BY unit_number;
```
Expected: 10 rows, units 2–10 have prereqs, unit 1 has none.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260316000002_seed_stage1_units.sql
git commit -m "feat: seed Stage 1 units 8-10 with unlock chain"
```

---

### Task 3.5: Add Missing Lessons for Existing Units (1–7)

**Files:**
- Create: `supabase/migrations/20260316000003_add_missing_lessons.sql`

Each existing unit has 2 lessons but needs 4 per spec. This task adds lesson 3 (conversational phrases) and lesson 4 (unit review) for units 1–7.

- [ ] **Step 1: Write migration to add 2 lessons per existing unit**

For each of the 7 units, add:
- Lesson 3: conversational phrases + cultural context
- Lesson 4: unit review + mini-assessment

Each lesson gets 10 phrases with mixed exercise types. This is a **content authoring task** — the implementer must write ~140 Indonesian phrases (14 lessons × 10 phrases). Use existing splash card content as a reference for vocabulary and pronunciation guides.

Pattern per unit:
```sql
-- Unit 1 (Greetings) - Lesson 3: Casual Conversations
INSERT INTO lessons (category_id, title, description, order_index, lesson_number, estimated_minutes, xp_reward)
VALUES ('49968d87-9b5b-43a7-9b81-bf4ce5cbbba4', 'Casual Conversations', 'Practice everyday greetings in context', 3, 3, 4, 25);
-- Then insert 10 phrases with exercise_type variety
```

- [ ] **Step 2: Apply and verify each unit now has 4 lessons**

```sql
SELECT c.name, c.unit_number, COUNT(l.id) as lesson_count
FROM categories c JOIN lessons l ON l.category_id = c.id
WHERE c.unit_number BETWEEN 1 AND 7
GROUP BY c.name, c.unit_number ORDER BY c.unit_number;
```
Expected: Each unit shows 4 lessons.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260316000003_add_missing_lessons.sql
git commit -m "feat: add lessons 3-4 for existing units 1-7 (conversational + review)"
```

---

### Task 4: Seed Stage 1 Lessons and Phrases (Units 8–10)

**Files:**
- Create: `supabase/migrations/20260316000004_seed_stage1_content.sql`

Each unit gets 4 lessons with 10 phrases each. This task seeds content for the 3 new units (8, 9, 10). Units 1–7 already have partial content from existing seeds.

- [ ] **Step 1: Write content seed for Unit 8 (Home & Accommodation)**

Create 4 lessons × 10 phrases. Include tip_content JSONB for lesson 2 (grammar lesson). Tag phrases with exercise_type and difficulty_tier.

The SQL should follow this pattern per lesson:
```sql
-- Get the category ID for this unit
WITH unit AS (SELECT id FROM categories WHERE unit_number = 8)

-- Lesson 1: Core vocabulary
INSERT INTO lessons (category_id, title, description, order_index, lesson_number, estimated_minutes, xp_reward, tip_content)
SELECT unit.id, 'Your Indonesian Home', 'Learn room names and basic furniture', 1, 1, 4, 20, NULL
FROM unit;

-- Then insert 10 phrases referencing the lesson
-- Mix of exercise types: 3 match_pairs (easy), 3 multiple_choice (easy), 2 fill_blank (medium), 2 word_bank (medium)
```

**Content authoring task (~30 min):** Full content for all 3 units (8, 9, 10) with realistic Indonesian vocabulary. This will be a large file (~300 lines). The implementer should use Claude or an Indonesian language reference to author accurate content. Each phrase needs: `indonesian_text`, `english_translation`, `pronunciation_guide`, `exercise_type`, `difficulty_tier`, `order_index`.

Exercise type distribution per lesson: 3× `match_pairs` (easy), 3× `multiple_choice` (easy), 2× `fill_blank` (medium), 2× `word_bank` (medium).

**Exercise count note:** Each lesson stores 10 phrases in the database. Each phrase maps 1:1 to an exercise. The spec's "12–15 exercises per lesson" target is achieved in later phases by re-using phrases with harder exercise types (e.g., a phrase seen as `multiple_choice` in exercise 3 may reappear as `word_bank` in exercise 12). Phase 1 delivers 10 exercises per lesson; Phase 2 adds the replay/escalation logic.

- [ ] **Step 2: Apply and verify content counts**

```sql
SELECT c.name, c.unit_number, COUNT(DISTINCT l.id) as lessons, COUNT(p.id) as phrases
FROM categories c
LEFT JOIN lessons l ON l.category_id = c.id
LEFT JOIN phrases p ON p.lesson_id = l.id
WHERE c.stage = 'survival'
GROUP BY c.name, c.unit_number ORDER BY c.unit_number;
```
Expected: Units 8, 9 each have 4 lessons and ~40 phrases. Unit 10 has 4 review lessons.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260316000004_seed_stage1_content.sql
git commit -m "feat: seed Stage 1 content (units 8-10, 12 lessons, ~120 phrases)"
```

---

### Task 5: Seed Grammar Concepts for Stage 1

**Files:**
- Create: `supabase/migrations/20260316000005_seed_grammar_concepts.sql`

- [ ] **Step 1: Write grammar concepts seed**

```sql
INSERT INTO grammar_concepts (name, slug, description, stage, introduced_in_unit, revisited_in_units, examples) VALUES
('Basic Negation', 'negation', 'tidak for verbs/adjectives, bukan for nouns', 'survival', 3, '{8, 15}',
  '[{"indonesian": "Saya tidak mau", "english": "I don''t want", "explanation": "tidak negates verbs"},
    {"indonesian": "Ini bukan kopi", "english": "This is not coffee", "explanation": "bukan negates nouns"}]'::jsonb),

('Pronouns', 'pronouns', 'Personal pronouns: saya, kamu, dia, kami, mereka', 'survival', 1, '{11, 23}',
  '[{"indonesian": "Saya dari Australia", "english": "I am from Australia", "explanation": "saya = I (formal)"},
    {"indonesian": "Kamu mau apa?", "english": "What do you want?", "explanation": "kamu = you (informal)"}]'::jsonb),

('Question Words', 'question-words', 'apa, siapa, di mana, kapan, mengapa, bagaimana', 'survival', 4, '{13, 22}',
  '[{"indonesian": "Di mana stasiun?", "english": "Where is the station?", "explanation": "di mana = where"},
    {"indonesian": "Berapa harganya?", "english": "How much is it?", "explanation": "berapa = how much/many"}]'::jsonb),

('Time Markers', 'time-markers', 'sudah (already), belum (not yet), akan (will), sedang (currently)', 'survival', 6, '{13, 24}',
  '[{"indonesian": "Saya sudah makan", "english": "I have eaten", "explanation": "sudah = already/have done"},
    {"indonesian": "Dia belum datang", "english": "He hasn''t arrived yet", "explanation": "belum = not yet"}]'::jsonb),

('Classifiers', 'classifiers', 'Measure words: buah, orang, ekor, batang, lembar', 'survival', 5, '{14, 26}',
  '[{"indonesian": "Dua buah apel", "english": "Two apples", "explanation": "buah = classifier for round objects/fruits"},
    {"indonesian": "Tiga orang anak", "english": "Three children", "explanation": "orang = classifier for people"}]'::jsonb),

('Possessives', 'possessives', 'Ownership: -nya (his/her/its), punya (to have/own), suffix possession', 'survival', 8, '{11, 21}',
  '[{"indonesian": "Rumahnya besar", "english": "His/her house is big", "explanation": "-nya = his/her/its (suffix)"},
    {"indonesian": "Saya punya dua kamar", "english": "I have two rooms", "explanation": "punya = to have/own"}]'::jsonb);
```

- [ ] **Step 2: Apply and verify**

```sql
SELECT name, slug, introduced_in_unit FROM grammar_concepts ORDER BY introduced_in_unit;
```
Expected: 6 grammar concepts for Stage 1.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260316000005_seed_grammar_concepts.sql
git commit -m "feat: seed Stage 1 grammar concepts with examples"
```

---

### Task 6: Update TypeScript Types

**Files:**
- Modify: `src/integrations/supabase/types.ts`

- [ ] **Step 1: Add new columns to categories types**

In `src/integrations/supabase/types.ts`, add these fields to `categories.Row` (after `order_index`):
```typescript
stage: string | null
cefr_level: string | null
unit_number: number | null
unit_description: string | null
requires_unit_id: string | null
min_completion_percent: number
```
Add matching optional fields to `categories.Insert` and `categories.Update`:
```typescript
stage?: string | null
cefr_level?: string | null
unit_number?: number | null
unit_description?: string | null
requires_unit_id?: string | null
min_completion_percent?: number
```

- [ ] **Step 2: Add new columns to lessons types**

Add to `lessons.Row` (after `order_index`):
```typescript
lesson_number: number
tip_content: Json | null
```
Add to `lessons.Insert` and `lessons.Update`:
```typescript
lesson_number?: number
tip_content?: Json | null
```

- [ ] **Step 3: Add new columns to phrases types**

Add to `phrases.Row` (after `grammar_note`):
```typescript
exercise_type: string
difficulty_tier: string | null
grammar_tags: string[] | null
context_sentence: string | null
context_translation: string | null
```
Add to `phrases.Insert` and `phrases.Update`:
```typescript
exercise_type?: string
difficulty_tier?: string | null
grammar_tags?: string[] | null
context_sentence?: string | null
context_translation?: string | null
```

- [ ] **Step 4: Add grammar_concepts table type**

Add as a new entry in `Database['public']['Tables']` (after `xp_transactions`):
```typescript
grammar_concepts: {
  Row: {
    id: string
    name: string
    slug: string
    description: string | null
    stage: string | null
    introduced_in_unit: number | null
    revisited_in_units: number[] | null
    examples: Json | null
    created_at: string
  }
  Insert: {
    id?: string
    name: string
    slug: string
    description?: string | null
    stage?: string | null
    introduced_in_unit?: number | null
    revisited_in_units?: number[] | null
    examples?: Json | null
    created_at?: string
  }
  Update: {
    name?: string
    slug?: string
    description?: string | null
    stage?: string | null
    introduced_in_unit?: number | null
    revisited_in_units?: number[] | null
    examples?: Json | null
  }
}
```

- [ ] **Step 5: Add quiz_sessions and quiz_answers table types**

These tables already exist in the database but are missing from `types.ts`. Add them:
```typescript
quiz_sessions: {
  Row: {
    id: string
    user_id: string
    quiz_type: string
    total_questions: number
    correct_answers: number
    wrong_answers: number
    xp_earned: number
    time_spent_seconds: number
    started_at: string
    completed_at: string | null
  }
  Insert: {
    id?: string
    user_id: string
    quiz_type: string
    total_questions?: number
    correct_answers?: number
    wrong_answers?: number
    xp_earned?: number
    time_spent_seconds?: number
    started_at?: string
    completed_at?: string | null
  }
  Update: {
    total_questions?: number
    correct_answers?: number
    wrong_answers?: number
    xp_earned?: number
    time_spent_seconds?: number
    completed_at?: string | null
  }
}
quiz_answers: {
  Row: {
    id: string
    session_id: string
    card_id: string | null
    phrase_id: string | null
    question_type: string
    question_text: string | null
    correct_answer: string
    user_answer: string | null
    is_correct: boolean
    time_spent_ms: number
    created_at: string
  }
  Insert: {
    id?: string
    session_id: string
    card_id?: string | null
    phrase_id?: string | null
    question_type: string
    question_text?: string | null
    correct_answer: string
    user_answer?: string | null
    is_correct: boolean
    time_spent_ms?: number
    created_at?: string
  }
  Update: never
}
```

- [ ] **Step 6: Add helper type aliases**

After the existing helper types, add:
```typescript
export type GrammarConcept = Database['public']['Tables']['grammar_concepts']['Row']
export type QuizSession = Database['public']['Tables']['quiz_sessions']['Row']
export type QuizAnswer = Database['public']['Tables']['quiz_answers']['Row']
```

- [ ] **Step 7: Verify build compiles**

```bash
npm run build 2>&1 | head -20
```
Expected: No TypeScript errors related to new columns.

- [ ] **Step 8: Commit**

```bash
git add src/integrations/supabase/types.ts
git commit -m "feat: update Supabase types for curriculum schema"
```

---

## Chunk 2: Exercise Components (Phase 1)

### Task 7: Extract MultipleChoiceExercise Component

**Files:**
- Create: `src/components/exercises/MultipleChoiceExercise.tsx`
- Create: `src/components/exercises/ExerciseShell.tsx`
- Create: `src/components/exercises/types.ts`

- [ ] **Step 1: Define exercise component types**

```typescript
// src/components/exercises/types.ts
export interface ExerciseProps {
  phrase: {
    id: string;
    indonesian_text: string;
    english_translation: string;
    pronunciation_guide: string | null;
    context_sentence?: string | null;
    context_translation?: string | null;
    exercise_type: string;
    difficulty_tier: string;
    audio_url?: string | null;
  };
  allPhrases: Array<{ indonesian_text: string; english_translation: string }>;
  onAnswer: (correct: boolean, userAnswer: string) => void;
  onNext: () => void;
  showResult: boolean;
}

export type ExerciseType = 'multiple_choice' | 'multiple_choice_reverse' | 'match_pairs' | 'fill_blank' | 'word_bank';
```

- [ ] **Step 2: Create ExerciseShell (shared wrapper for feedback/next)**

```typescript
// src/components/exercises/ExerciseShell.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Volume2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExerciseShellProps {
  children: React.ReactNode;
  isCorrect: boolean | null; // null = not yet answered
  correctAnswer: string; // shown on incorrect answer
  xpEarned?: number;
  onNext: () => void;
  onPlayAudio?: () => void;
}

export default function ExerciseShell({
  children,
  isCorrect,
  correctAnswer,
  xpEarned,
  onNext,
  onPlayAudio,
}: ExerciseShellProps) {
  return (
    <div className="flex flex-col flex-1">
      {/* Exercise content area */}
      <div className="flex-1 flex items-center justify-center px-4">
        {children}
      </div>

      {/* Feedback banner - slides up after answer */}
      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`p-4 rounded-t-2xl ${
              isCorrect
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-red-100 dark:bg-red-900/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {isCorrect ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
              <div>
                <p className={`font-bold ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite'}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-muted-foreground">
                    Correct answer: <strong>{correctAnswer}</strong>
                  </p>
                )}
                {isCorrect && xpEarned && (
                  <p className="text-sm text-green-600">+{xpEarned} XP</p>
                )}
              </div>
              {onPlayAudio && (
                <button onClick={onPlayAudio} className="ml-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Volume2 className="h-5 w-5 text-primary" />
                </button>
              )}
            </div>
            <Button onClick={onNext} className="w-full h-12 btn-primary">
              Continue <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 3: Extract MultipleChoiceExercise from PracticePage logic**

Extract the answer option rendering, selection, and correctness checking from `PracticePage.tsx` lines 316–357 into a standalone component. Support both directions via a `reverse` prop:
- Default: show Indonesian, pick English
- Reverse: show English, pick Indonesian

Generate 3 wrong options from `allPhrases` + 1 correct, shuffled.

- [ ] **Step 4: Write test for MultipleChoiceExercise**

Create: `src/__tests__/exercises/MultipleChoiceExercise.test.tsx`

Test: renders 4 options, correct option triggers `onAnswer(true)`, wrong triggers `onAnswer(false)`.

- [ ] **Step 5: Run tests**

```bash
npm run test -- --reporter=verbose 2>&1 | tail -20
```
Expected: New test passes.

- [ ] **Step 6: Commit**

```bash
git add src/components/exercises/
git add src/__tests__/exercises/
git commit -m "feat: extract MultipleChoiceExercise component with ExerciseShell"
```

---

### Task 8: Build MatchPairsExercise Component

**Files:**
- Create: `src/components/exercises/MatchPairsExercise.tsx`

- [ ] **Step 1: Build the component**

Duolingo "tap the pairs" mechanic:
- Shows 4 Indonesian words on left, 4 English translations on right (shuffled)
- User taps one from each side to form a pair
- Correct pairs animate out with success color
- Wrong pairs flash red and reset
- All 4 pairs matched = exercise complete

State: `selectedLeft`, `selectedRight`, `matchedPairs[]`, `wrongPair`.
Uses phrases from `allPhrases` — picks 4 including the current phrase.

- [ ] **Step 2: Write test**

Create: `src/__tests__/exercises/MatchPairsExercise.test.tsx`

Test: renders 8 tiles (4 pairs), matching correct pair removes them, all matched calls `onAnswer(true)`.

- [ ] **Step 3: Run tests and commit**

```bash
npm run test -- --reporter=verbose 2>&1 | tail -20
git add src/components/exercises/MatchPairsExercise.tsx src/__tests__/exercises/
git commit -m "feat: add MatchPairsExercise tap-to-match component"
```

---

### Task 9: Build FillBlankExercise Component

**Files:**
- Create: `src/components/exercises/FillBlankExercise.tsx`

- [ ] **Step 1: Build the component**

- Shows a sentence with one word replaced by `____`
- Uses `context_sentence` if available, otherwise generates from `indonesian_text`
- User types the missing word into an input field
- Case-insensitive comparison
- Shows correct answer on wrong attempt

The blank word is the `indonesian_text` from the phrase. The sentence is the `context_sentence` with the target word replaced by a blank.

- [ ] **Step 2: Write test**

Create: `src/__tests__/exercises/FillBlankExercise.test.tsx`

Test: renders sentence with blank, typing correct word triggers `onAnswer(true, 'word')`, typing wrong word triggers `onAnswer(false, 'wrong')`, comparison is case-insensitive.

- [ ] **Step 3: Run tests and commit**

```bash
npm run test -- --reporter=verbose 2>&1 | tail -20
git add src/components/exercises/FillBlankExercise.tsx src/__tests__/exercises/
git commit -m "feat: add FillBlankExercise component"
```

---

### Task 10: Build WordBankExercise Component

**Files:**
- Create: `src/components/exercises/WordBankExercise.tsx`

- [ ] **Step 1: Build the component**

Core Duolingo mechanic — tap word tiles to build a sentence:
- Shows English prompt at top
- Shows scrambled Indonesian word tiles below
- User taps tiles to add to answer area (top)
- Tapping a placed tile returns it to bank
- "Check" button validates the assembled sentence
- Comparison is order-sensitive but case-insensitive

State: `availableTiles[]`, `placedTiles[]`.
Split `indonesian_text` by spaces to get tiles, add 2–3 distractor words from other phrases.

- [ ] **Step 2: Write test**

Create: `src/__tests__/exercises/WordBankExercise.test.tsx`

Test: renders scrambled tiles, tapping tiles moves them to answer area, tapping placed tile returns it, correct assembly triggers `onAnswer(true, 'assembled sentence')`, wrong order triggers `onAnswer(false, 'wrong order')`.

- [ ] **Step 3: Run tests and commit**

```bash
npm run test -- --reporter=verbose 2>&1 | tail -20
git add src/components/exercises/WordBankExercise.tsx src/__tests__/exercises/
git commit -m "feat: add WordBankExercise tap-to-build component"
```

---

### Task 11: Build Exercise Router Component

**Files:**
- Create: `src/components/exercises/ExerciseRouter.tsx`

- [ ] **Step 1: Build the router**

Takes an exercise type string and renders the correct component:

```typescript
// src/components/exercises/ExerciseRouter.tsx
import { ExerciseProps } from './types';
import MultipleChoiceExercise from './MultipleChoiceExercise';
import MatchPairsExercise from './MatchPairsExercise';
import FillBlankExercise from './FillBlankExercise';
import WordBankExercise from './WordBankExercise';

export default function ExerciseRouter({ phrase, ...props }: ExerciseProps) {
  switch (phrase.exercise_type) {
    case 'multiple_choice':
      return <MultipleChoiceExercise phrase={phrase} {...props} />;
    case 'multiple_choice_reverse':
      return <MultipleChoiceExercise phrase={phrase} {...props} reverse />;
    case 'match_pairs':
      return <MatchPairsExercise phrase={phrase} {...props} />;
    case 'fill_blank':
      return <FillBlankExercise phrase={phrase} {...props} />;
    case 'word_bank':
      return <WordBankExercise phrase={phrase} {...props} />;
    default:
      return <MultipleChoiceExercise phrase={phrase} {...props} />;
  }
}
```

- [ ] **Step 2: Create barrel export**

Create: `src/components/exercises/index.ts`

```typescript
export { default as ExerciseRouter } from './ExerciseRouter';
export { default as ExerciseShell } from './ExerciseShell';
export type { ExerciseProps, ExerciseType } from './types';
```

- [ ] **Step 3: Commit**

```bash
git add src/components/exercises/
git commit -m "feat: add ExerciseRouter to dispatch exercise types"
```

---

## Chunk 3: Grammar Tips & Lesson Engine

### Task 12: Build GrammarTipCard Component

**Files:**
- Create: `src/components/GrammarTipCard.tsx`

- [ ] **Step 1: Build the tip card**

Renders a `tip_content` JSONB object as a dismissible card:
- Title (e.g., "The me- prefix")
- Explanation text (1–3 sentences)
- Example sentences in a styled list (Indonesian bold, English italic)
- "Got it" button to dismiss

```typescript
interface TipContent {
  title: string;
  explanation: string;
  examples: Array<{ indonesian: string; english: string; note?: string }>;
}
```

Styled with `card-elevated` class, uses Framer Motion for slide-in animation.

- [ ] **Step 2: Commit**

```bash
git add src/components/GrammarTipCard.tsx
git commit -m "feat: add GrammarTipCard component for lesson tips"
```

---

### Task 13a: Extend useLessons Hook for Exercise Tracking

**Files:**
- Modify: `src/hooks/useLessons.ts`

- [ ] **Step 1: Add recordExerciseAnswer function**

Import `useProfile` to access `addXP`. Add session state and a new function to the `useLessons` hook that logs individual exercise results:
```typescript
// Add state for session tracking
const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

const recordExerciseAnswer = async (
  lessonId: string,
  phraseId: string,
  correct: boolean,
  exerciseType: string,
  difficulty: string,
  questionText: string,
  correctAnswer: string,
  userAnswer: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Get or create quiz session for this lesson attempt
  let sessionId = currentSessionId;
  if (!sessionId) {
    const { data: session } = await supabase.from('quiz_sessions').insert({
      user_id: user.id,
      quiz_type: 'lesson_quiz',
    }).select('id').single();
    sessionId = session?.id;
    setCurrentSessionId(sessionId);
  }

  // Record the answer
  await supabase.from('quiz_answers').insert({
    session_id: sessionId,
    phrase_id: phraseId,
    question_type: exerciseType,
    question_text: questionText,
    correct_answer: correctAnswer,
    user_answer: userAnswer,
    is_correct: correct,
  });

  // Award XP based on difficulty: easy=5, medium=10, hard=15
  if (correct) {
    const xpMap = { easy: 5, medium: 10, hard: 15 };
    const xp = xpMap[difficulty as keyof typeof xpMap] || 5;
    await addXP(xp, 'exercise', `${exerciseType} correct`);
  }
};
```

- [ ] **Step 2: Update completeLesson to use actual score**

Modify `completeLesson` to accept a score calculated from exercise results instead of hardcoded 100:
```typescript
// Before: completeLesson(lessonId, 100)
// After: completeLesson(lessonId, Math.round((correctCount / totalCount) * 100))
```

Also update the quiz_session with final totals:
```typescript
if (currentSessionId) {
  await supabase.from('quiz_sessions').update({
    total_questions: totalCount,
    correct_answers: correctCount,
    wrong_answers: totalCount - correctCount,
    completed_at: new Date().toISOString(),
  }).eq('id', currentSessionId);
}
```

- [ ] **Step 3: Run build to verify no type errors**

```bash
npm run build 2>&1 | head -20
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useLessons.ts
git commit -m "feat: extend useLessons with exercise answer tracking and quiz sessions"
```

---

### Task 13b: Rebuild LessonPage UI as Exercise Engine

**Files:**
- Modify: `src/pages/LessonPage.tsx`

This task replaces the phrase flip-card UI with the exercise engine.

- [ ] **Step 1: Rewrite LessonPage state and flow**

Replace the current flip-card state with exercise engine state:
```typescript
// Remove: isFlipped
// Add:
const [showTip, setShowTip] = useState(true);
const [answers, setAnswers] = useState<Map<string, boolean>>(new Map());
const [currentResult, setCurrentResult] = useState<boolean | null>(null);
const [score, setScore] = useState(0);
const [streak, setStreak] = useState(0);
```

- [ ] **Step 2: Implement grammar tip card gate**

At the start of the exercise flow, check if `currentLesson?.tip_content` exists. If so, render `GrammarTipCard` with a "Got it" dismiss button. When dismissed, set `showTip = false` to proceed to exercises.

```tsx
if (showTip && currentLesson?.tip_content) {
  return (
    <div className="min-h-screen p-4 pt-6 lg:p-8 flex flex-col">
      {/* Keep header with back button */}
      <GrammarTipCard
        tip={currentLesson.tip_content as TipContent}
        onDismiss={() => setShowTip(false)}
      />
    </div>
  );
}
```

- [ ] **Step 3: Replace flip-card with ExerciseRouter**

Replace the "Phrase Card" section (the `div` with `perspective: '1200px'`) with:
```tsx
<ExerciseShell
  isCorrect={currentResult}
  correctAnswer={currentPhrase.english_translation}
  xpEarned={currentResult ? xpForDifficulty(currentPhrase.difficulty_tier) : undefined}
  onNext={handleNext}
  onPlayAudio={() => speakIndonesian(currentPhrase.indonesian_text)}
>
  <ExerciseRouter
    phrase={currentPhrase}
    allPhrases={phrases}
    onAnswer={handleAnswer}
    onNext={handleNext}
    showResult={currentResult !== null}
  />
</ExerciseShell>
```

- [ ] **Step 4: Implement handleAnswer**

```typescript
const handleAnswer = async (correct: boolean, userAnswer: string) => {
  setCurrentResult(correct);
  setAnswers(prev => new Map(prev).set(currentPhrase.id, correct));
  if (correct) {
    setScore(s => s + 1);
    setStreak(s => s + 1);
  } else {
    setStreak(0);
  }
  await recordExerciseAnswer(
    lesson.id, currentPhrase.id, correct,
    currentPhrase.exercise_type,
    currentPhrase.difficulty_tier || 'easy',
    currentPhrase.indonesian_text,
    currentPhrase.english_translation,
    userAnswer
  );
};
```

- [ ] **Step 5: Update handleNext to use score**

Replace the existing `handleNext` to advance after feedback is shown:
```typescript
const handleNext = async () => {
  setCurrentResult(null);
  if (currentPhraseIndex < phrases.length - 1) {
    setCurrentPhraseIndex(currentPhraseIndex + 1);
  } else {
    const finalScore = Math.round((score / phrases.length) * 100);
    await completeLesson(lesson.id, finalScore);
    setCompleted(true);
  }
};
```

- [ ] **Step 6: Update completion screen to show score**

Update the completion screen to show exercise results:
```tsx
<p className="text-lg font-semibold text-primary mb-2">
  Score: {score}/{phrases.length} ({Math.round((score / phrases.length) * 100)}%)
</p>
<p className="text-muted-foreground mb-6">+{lesson.xp_reward} XP</p>
```

- [ ] **Step 7: Test manually**

Run dev server, navigate to `/learn/lesson/{id}`, verify:
- Tip card shows if lesson has `tip_content`, dismisses on "Got it"
- Exercise renders correctly for each phrase
- Correct/incorrect feedback shows via ExerciseShell banner
- Progress bar advances with each answer
- Completion screen shows score and XP

- [ ] **Step 8: Commit**

```bash
git add src/pages/LessonPage.tsx
git commit -m "feat: rebuild LessonPage UI as exercise engine with tip cards"
```

---

## Chunk 4: Learn Page Curriculum Path

### Task 14: Build Unit Progression Hook

**Files:**
- Create: `src/hooks/useCurriculum.ts`

- [ ] **Step 1: Build the hook**

```typescript
// src/hooks/useCurriculum.ts
// Manages curriculum state: stages, units, unlock status, completion progress

export function useCurriculum() {
  // Fetch categories with stage/unit_number populated, ordered by unit_number
  // Fetch user_lesson_progress for all lessons
  // Calculate per-unit completion percentage
  // Determine which units are unlocked (based on requires_unit_id + min_completion_percent)
  // Group units by stage

  return {
    stages: [
      { name: 'Survival', cefr: 'A1', units: [...] },
      { name: 'Daily Life', cefr: 'A2', units: [...] },
      { name: 'Fluency', cefr: 'B1', units: [...] },
    ],
    getUnitCompletion: (unitId: string) => number, // 0-100
    isUnitUnlocked: (unitId: string) => boolean,
    currentUnit: Unit | null, // first incomplete unit
    loading: boolean,
  };
}
```

Each unit includes: `id`, `name`, `icon`, `unit_number`, `stage`, `cefr_level`, `lessons[]`, `completion`, `locked`.

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useCurriculum.ts
git commit -m "feat: add useCurriculum hook for unit progression and unlocking"
```

---

### Task 15: Redesign LearnPage with Curriculum Path

**Files:**
- Modify: `src/pages/LearnPage.tsx`

- [ ] **Step 1: Redesign the Learn page**

Replace the flat grid of categories + lessons list with a curriculum path view:

**Layout:**
```
Stage header: "Stage 1: Survival (A1)" — collapsible
  Unit 1: Greetings [progress ring] [4 lesson dots]
  Unit 2: Numbers [locked icon or progress ring]
  ...
  Unit 10: A1 Milestone [trophy icon]

Stage header: "Stage 2: Daily Life (A2)" — collapsed, locked
  ...
```

Each unit row shows:
- Icon + name
- Progress ring (0–100%)
- 4 lesson dots (empty/filled/current)
- Lock icon if not yet unlocked
- Tap unlocked unit → expand to show 4 lessons with start buttons

Locked units show a lock overlay and are not tappable.
Stage headers show overall stage progress.

Use `useCurriculum()` hook for data.
Keep existing Splash Cards section at the top (unchanged).

- [ ] **Step 2: Test the layout**

Run dev server, verify:
- Units display in order with correct stage grouping
- Locked units show lock icon
- Unlocked units show progress
- Tapping a unit shows its lessons
- Tapping a lesson navigates to `/learn/lesson/{id}`

- [ ] **Step 3: Commit**

```bash
git add src/pages/LearnPage.tsx
git commit -m "feat: redesign LearnPage with curriculum path and unit progression"
```

---

### Task 16: Update PracticePage to Use Exercise Components

**Files:**
- Modify: `src/pages/PracticePage.tsx`

- [ ] **Step 1: Refactor PracticePage to use ExerciseRouter**

Replace the inline quiz logic (lines 270–387) with `ExerciseRouter`. The quiz generation stays the same, but exercise rendering delegates to the shared components.

This ensures consistency between practice mode and lesson mode exercise UIs.

- [ ] **Step 2: Verify practice still works**

Run dev server, start a quiz, verify multiple-choice exercises render and score correctly.

- [ ] **Step 3: Commit**

```bash
git add src/pages/PracticePage.tsx
git commit -m "refactor: PracticePage uses shared ExerciseRouter components"
```

---

## Chunk 5: Integration, Testing & Polish

### Task 17: Add Curriculum Integration Tests

**Files:**
- Create: `src/__tests__/curriculum.test.ts`

- [ ] **Step 1: Write integration tests**

Test the curriculum data flow:
1. Verify categories have stage/cefr_level/unit_number set
2. Verify unit unlock logic (unit 1 always unlocked, unit 2 locked until unit 1 ≥80%)
3. Verify lesson ordering within units
4. Verify exercise type distribution per lesson

- [ ] **Step 2: Run all tests**

```bash
npm run test -- --reporter=verbose
```
Expected: All tests pass, including existing auth tests.

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/curriculum.test.ts
git commit -m "test: add curriculum integration tests"
```

---

### Task 18: Build Verification & Final Commit

- [ ] **Step 1: Run full build**

```bash
npm run build
```
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 2: Run all tests**

```bash
npm run test
```
Expected: All tests pass.

- [ ] **Step 3: Verify in browser**

Start dev server and verify:
1. Learn page shows curriculum path with stages
2. Unit 1 is unlocked, others are locked
3. Starting a lesson shows grammar tip (if present) then exercises
4. Completing exercises awards XP
5. Completing all lessons in a unit updates progress
6. Practice page still works with shared exercise components

- [ ] **Step 4: Final commit if any cleanup needed**

```bash
git add -A
git commit -m "chore: curriculum implementation cleanup and polish"
```

---

## Summary

| Chunk | Tasks | What it delivers |
|-------|-------|-----------------|
| 1: Schema & Content | Tasks 1–6 | Database schema, existing content tagged, new units/lessons/phrases seeded, grammar concepts, updated TS types (incl. quiz_sessions/quiz_answers) |
| 2: Exercise Components | Tasks 7–11 | 5 Phase 1 exercise components (MC, MC-reverse, match pairs, fill blank, word bank) + ExerciseShell + router |
| 3: Grammar Tips & Lesson Engine | Tasks 12, 13a, 13b | Grammar tip cards, extended useLessons hook with exercise tracking, rebuilt LessonPage as exercise engine |
| 4: Learn Page Curriculum Path | Tasks 14–16 | useCurriculum hook, redesigned LearnPage with staged path, PracticePage refactored |
| 5: Integration & Polish | Tasks 17–18 | Tests, build verification, browser testing |

**Total: 20 tasks across 5 chunks** (18 original + Task 3.5 + Task 13 split into 13a/13b).
