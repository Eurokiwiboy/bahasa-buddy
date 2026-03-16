# Bahasa Buddy Curriculum Design Spec

**Date:** 2026-03-16
**Status:** Approved
**Scope:** Structured A1→B1 CEFR curriculum for learning Bahasa Indonesia, targeting expat/long-term residents

---

## 1. Target Learner

**Expat / Long-term Resident** — living or planning to live in Indonesia. Needs conversational fluency across daily life, workplace, and social situations. Depth + breadth, with emphasis on practical communication over academic completeness.

## 2. CEFR Range

**A1 → B1** (Survival → Daily Life → Fluency)

- **A1 (Survival):** Can understand and use familiar everyday expressions and very basic phrases. Can introduce themselves and ask/answer questions about personal details.
- **A2 (Daily Life):** Can understand sentences and frequently used expressions related to areas of most immediate relevance (shopping, local geography, employment). Can communicate in simple, routine tasks.
- **B1 (Fluency):** Can understand the main points of clear standard input on familiar matters. Can deal with most situations likely to arise while living in Indonesia. Can produce simple connected text on familiar topics.

Going beyond B1 (B2/C1/C2) is out of scope for this phase but the data model supports future expansion.

## 3. Curriculum Organization

**Topic-based units with light spiraling.** Each unit focuses on a real-life domain (e.g., "At the Market," "Getting Around") and teaches vocabulary, phrases, and grammar in that context. Grammar concepts reappear across units at increasing complexity — for example, negation introduced in Unit 3 is revisited with more nuance in Units 8 and 15.

### Why topic-based with spiraling?

- Mirrors how expats actually encounter the language — by situation, not by grammar rule
- Keeps motivation high through immediately applicable vocabulary
- Spiraling ensures grammar retention without dedicating entire units to abstract rules
- Aligns with Duolingo's proven approach of contextual learning

## 4. Three-Stage Structure

### Stage 1: Survival (A1) — Units 1–10, 40 lessons

The absolute essentials for someone who just arrived in Indonesia.

| Unit | Topic | Key Skills |
|------|-------|------------|
| 1 | Greetings & Introductions | Selamat pagi/siang/sore/malam, nama saya, apa kabar |
| 2 | Numbers & Money | 0–1000, harga, berapa, currency handling |
| 3 | At the Warung (Food Stall) | Ordering food, mau/tidak mau, ini/itu, basic negation |
| 4 | Getting Around | Directions, di mana, kiri/kanan, transportation vocab |
| 5 | Shopping & Bargaining | Terlalu mahal, bisa kurang, colors, sizes |
| 6 | Time & Days | Jam, hari, bulan, making appointments |
| 7 | Emergencies & Health | Tolong, sakit, rumah sakit, pharmacy vocab |
| 8 | Home & Accommodation | Rooms, furniture, kos/kontrakan vocab, landlord communication |
| 9 | Weather & Nature | Hujan, panas, musim, basic environment |
| 10 | Review & Milestone | Cumulative review, A1 checkpoint assessment |

### Stage 2: Daily Life (A2) — Units 11–20, 40 lessons

Building conversational ability for someone settling into Indonesian life.

| Unit | Topic | Key Skills |
|------|-------|------------|
| 11 | Family & Relationships | Family terms, possessives (-nya), describing people |
| 12 | Work & Office | Job titles, meeting vocab, formal/informal registers |
| 13 | Making Friends | Hobbies, invitations, casual conversation patterns |
| 14 | Indonesian Food Deep Dive | Cuisine names, ingredients, cooking methods, dietary restrictions |
| 15 | Banking & Admin | ATM, transfer, KTP/KITAS vocab, bureaucratic language |
| 16 | Health & Fitness | Body parts, symptoms, doctor visits, gym/sports |
| 17 | Technology & Communication | Phone, internet, apps, social media vocab |
| 18 | Celebrations & Culture | Holidays (Lebaran, Nyepi), traditions, gift-giving customs |
| 19 | Nature & Travel | Islands, beaches, mountains, booking travel |
| 20 | Review & Milestone | Cumulative review, A2 checkpoint assessment |

### Stage 3: Fluency (B1) — Units 21–30, 40 lessons

Achieving independence and nuance in daily communication.

| Unit | Topic | Key Skills |
|------|-------|------------|
| 21 | Opinions & Feelings | Expressing views, agreeing/disagreeing, emotional vocabulary |
| 22 | News & Current Events | Reading headlines, discussing events, media vocab |
| 23 | Formal Indonesian | Surat (letters), formal meetings, bahasa baku vs bahasa gaul |
| 24 | Storytelling & Past Events | Narrative tenses, sudah/belum/pernah, sequencing |
| 25 | Problem Solving | Complaints, negotiations, conflict resolution |
| 26 | Indonesian Humor & Slang | Colloquialisms, wordplay, regional expressions |
| 27 | Environment & Society | Social issues, community, environmental vocab |
| 28 | Career & Ambitions | Future plans, mau/akan/ingin, professional goals |
| 29 | Deep Culture | Gotong royong, adat, Pancasila, cultural values |
| 30 | Final Review & B1 Assessment | Comprehensive review, B1 checkpoint, certificate |

## 5. Lesson Structure

Each unit contains **4 lessons**, each lesson following a consistent flow.

### Lesson format

Each lesson contains **12–15 exercises** and takes **3–5 minutes** to complete (aligned with Duolingo's bite-sized format for daily habit formation). Each lesson begins with a **grammar tip card** — a brief, scrollable explanation of the grammar pattern or vocabulary theme before exercises start (similar to Duolingo's "Tips" and Babbel's inline grammar explanations).

### Exercise flow within a lesson:

1. **Introduce** (receptive) — New vocabulary presented with audio and context. ~8–12 new items per lesson.
2. **Practice** (guided) — Multiple-choice, matching, and word-bank exercises. Scaffolded difficulty.
3. **Produce** (active) — Fill-in-the-blank, word ordering, and translation exercises.
4. **Review** (spaced) — SM-2 spaced repetition pulls from current and previous lessons.

### Lesson progression within a unit:
- **Lesson 1:** Core vocabulary + basic phrases
- **Lesson 2:** Extended vocabulary + grammar pattern (with grammar tip card)
- **Lesson 3:** Conversational phrases + cultural context
- **Lesson 4:** Unit review + mini-assessment (mixed exercises from lessons 1–3)

## 6. Exercise Types

Exercises follow a **receptive-first** progression within each lesson:

| Exercise Type | Direction | Difficulty | When Introduced | Phase |
|--------------|-----------|------------|-----------------|-------|
| `match_pairs` | Indonesian ↔ English tap pairs | Easy | First exposure | 1 |
| `multiple_choice` | Indonesian → Pick English | Easy | After match | 1 |
| `multiple_choice_reverse` | English → Pick Indonesian | Medium | After MC | 1 |
| `fill_blank` | Sentence with gap | Medium | Mid-lesson | 1 |
| `word_bank` | Tap words to build sentence | Medium | Mid-lesson | 1 |
| `listen_select` | Audio → Select image/word | Easy | First exposure | 2 |
| `word_order` | Arrange scrambled words | Medium-Hard | Mid-lesson | 2 |
| `translate_to_id` | English → Type Indonesian | Hard | Late lesson | 2 |
| `translate_to_en` | Indonesian → Type English | Medium-Hard | Late lesson | 2 |
| `listen_type` | Audio → Type what you hear | Hard | Late lesson | 2 |
| `speaking` | Prompt → Speak response | Hardest | End of lesson | 3 |

**Note on `word_bank`:** This is Duolingo's most-used scaffold exercise. The learner taps word tiles to assemble a sentence — easier than free typing, harder than multiple choice. This bridges the gap between recognition and production and is critical for Phase 1.

## 7. Grammar Spiral Map

Grammar concepts are introduced incrementally and revisited across stages:

| Grammar Concept | First Introduced | Revisited | Deepened |
|----------------|-----------------|-----------|----------|
| Basic negation (tidak/bukan) | Unit 3 | Unit 8 | Unit 15 |
| Pronouns (saya/kamu/dia) | Unit 1 | Unit 11 | Unit 23 |
| Possessives (-nya, punya) | Unit 8 | Unit 11 | Unit 21 |
| Affixes (me-, ber-, -kan, -i) | Unit 12 | Unit 17 | Unit 24 |
| Time markers (sudah/belum/akan) | Unit 6 | Unit 13 | Unit 24 |
| Passive voice (di-) | Unit 15 | Unit 22 | Unit 25 |
| Formal register (bahasa baku) | Unit 12 | Unit 15 | Unit 23 |
| Conjunctions & connectors | Unit 13 | Unit 21 | Unit 27 |
| Question words (apa/siapa/di mana/kapan/mengapa/bagaimana) | Unit 4 | Unit 13 | Unit 22 |
| Classifiers/measure words (buah, orang, ekor) | Unit 5 | Unit 14 | Unit 26 |

### Indonesian affix system (critical for B1)

Indonesian's affix system (me-, ber-, di-, ter-, pe-, -kan, -i, -an, ke-...-an, per-...-an) is the single most important grammar topic for reaching B1. Following Duolingo Indonesian's approach of dedicating specific attention to affixes, each affix group is introduced within a topical unit and then spiraled:

| Affix Group | Introduced In | Context |
|------------|---------------|---------|
| ber- (intransitive verbs) | Unit 12 (Work) | bekerja, berbicara, berjalan |
| me- (active transitive verbs) | Unit 13 (Making Friends) | menulis, membaca, mendengar |
| di- (passive voice) | Unit 15 (Banking) | dibayar, dikirim, dibuat |
| -kan (causative/benefactive) | Unit 17 (Technology) | mengirimkan, memberikan |
| -i (locative/repetitive) | Unit 21 (Opinions) | mengetahui, mendekati |
| ter- (accidental/superlative) | Unit 24 (Storytelling) | terjatuh, terbesar |
| pe-/-an (nominalizer) | Unit 22 (News) | pelajaran, pekerjaan, pendidikan |
| ke-...-an (abstract nouns) | Unit 27 (Environment) | keindahan, kesehatan, kemerdekaan |

## 8. Content Volume

| Metric | Count |
|--------|-------|
| Stages | 3 |
| Units | 30 |
| Lessons per unit | 4 |
| Total lessons | 120 |
| Vocabulary items per lesson | 8–12 |
| Total vocabulary items | ~1,200–1,500 |
| Phrases/sentences per lesson | 10–15 |
| Total phrases/sentences | ~1,200–1,800 |
| Exercise types | 11 |
| Exercises per lesson | 12–15 |
| Lesson duration target | 3–5 minutes |

## 9. Data Model Changes

### Modified: `categories` table

Add columns to support curriculum structure:

```sql
ALTER TABLE categories ADD COLUMN stage TEXT CHECK (stage IN ('survival', 'daily_life', 'fluency'));
ALTER TABLE categories ADD COLUMN cefr_level TEXT CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'));
ALTER TABLE categories ADD COLUMN unit_number INTEGER UNIQUE;
ALTER TABLE categories ADD COLUMN unit_description TEXT;
```

- `stage`: Maps to Survival/Daily Life/Fluency
- `cefr_level`: CEFR proficiency level
- `unit_number`: Sequential position (1–30)
- `unit_description`: Brief description of unit focus

### Modified: `lessons` table

Add column for lesson position within unit:

```sql
ALTER TABLE lessons ADD COLUMN lesson_number INTEGER DEFAULT 1;
```

### Modified: `phrases` table

Add column for exercise type metadata:

```sql
ALTER TABLE phrases ADD COLUMN exercise_type TEXT DEFAULT 'multiple_choice'
  CHECK (exercise_type IN ('listen_select', 'match_pairs', 'multiple_choice',
    'multiple_choice_reverse', 'fill_blank', 'word_bank', 'word_order',
    'translate_to_id', 'translate_to_en', 'listen_type', 'speaking'));
ALTER TABLE phrases ADD COLUMN difficulty_tier TEXT CHECK (difficulty_tier IN ('easy', 'medium', 'hard')) DEFAULT 'easy';
ALTER TABLE phrases ADD COLUMN grammar_tags TEXT[]; -- e.g., {'negation', 'pronouns'}
-- NOTE: audio_url and image_url already exist on phrases table; do NOT re-add
ALTER TABLE phrases ADD COLUMN context_sentence TEXT; -- example usage
ALTER TABLE phrases ADD COLUMN context_translation TEXT; -- English translation of context
```

### Modified: `quiz_answers` table

Update CHECK constraint to accept new exercise types:

```sql
ALTER TABLE quiz_answers DROP CONSTRAINT IF EXISTS quiz_answers_question_type_check;
ALTER TABLE quiz_answers ADD CONSTRAINT quiz_answers_question_type_check
  CHECK (question_type IN ('multiple_choice', 'typing', 'matching', 'listening',
    'speaking', 'listen_select', 'match_pairs', 'multiple_choice_reverse',
    'fill_blank', 'word_bank', 'word_order', 'translate_to_id', 'translate_to_en', 'listen_type'));
```

### New: `grammar_concepts` table

Track grammar spiral progression:

```sql
CREATE TABLE grammar_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  stage TEXT CHECK (stage IN ('survival', 'daily_life', 'fluency')),
  introduced_in_unit INTEGER REFERENCES categories(unit_number),
  revisited_in_units INTEGER[],
  examples JSONB, -- {indonesian, english, explanation}
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE grammar_concepts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "grammar_concepts_public_read" ON grammar_concepts FOR SELECT USING (true);
```

### New: `unit_prerequisites` table

Since units unlock strictly sequentially (Unit N+1 requires ≥80% of Unit N), use a simple self-referencing column on `categories` instead of a separate join table:

```sql
ALTER TABLE categories ADD COLUMN requires_unit_id UUID REFERENCES categories(id);
ALTER TABLE categories ADD COLUMN min_completion_percent INTEGER DEFAULT 80;
```

## 10. Progression & Unlocking

- Units unlock sequentially: Unit N+1 requires ≥80% completion of Unit N
- Stage transitions (A1→A2, A2→B1) require passing the milestone review unit (Units 10, 20)
- Each lesson tracks: started, completed, score, time spent
- **XP awards by activity type (unified table):**
  - Card review (existing, unchanged): 5 XP per correct review
  - Quiz answer (existing `PracticePage`, unchanged): 10 XP per correct answer
  - Lesson completion (existing, unchanged): proportional to `xp_reward` field × score
  - New curriculum exercises: easy 5 XP, medium 10 XP, hard 15 XP
- Streak bonuses and daily goals remain unchanged

## 11. Existing Content Migration

Current 8 categories and 120 cards map into the new structure. Family and Work & Business do not exist yet and will be created as new categories for Stage 2.

| Current Category | → New Unit | Stage | Status |
|-----------------|-----------|-------|--------|
| Greetings | Unit 1 | Survival | Exists |
| Numbers | Unit 2 | Survival | Exists |
| Food & Drink | Unit 3 | Survival | Exists |
| Transportation | Unit 4 | Survival | Exists |
| Shopping | Unit 5 | Survival | Exists |
| Time & Dates | Unit 6 | Survival | Exists |
| Emergency | Unit 7 | Survival | Exists |
| Family | Unit 11 | Daily Life | To create |
| Work & Business | Unit 12 | Daily Life | To create |
| Formal | Unit 23 | Fluency | Exists |

Existing cards and phrases will be re-tagged with the new columns. No data is deleted.

### Content creation scope

- **Existing:** 10 categories → 10 units get partial content (existing 2 lessons each need 2 more lessons added)
- **New:** 20 units have no content yet and need 4 lessons + vocabulary each
- **Total new content needed:** ~100 new lessons, ~1,000 new vocabulary items, ~1,000 new phrases
- Content seeding will be done via SQL seed scripts as part of the implementation plan
- Content is authored in English↔Indonesian pairs with difficulty tags

## 12. UI Components Required

Exercise types map to UI components that need to be built or modified:

| Exercise Type | Component | Phase | Status |
|--------------|-----------|-------|--------|
| `multiple_choice` | `MultipleChoiceExercise` | 1 | Exists (PracticePage) — extract into reusable component |
| `multiple_choice_reverse` | `MultipleChoiceExercise` | 1 | Same component, reversed direction |
| `match_pairs` | `MatchPairsExercise` | 1 | New — tap-to-match pairs (Duolingo "tap the pairs") |
| `fill_blank` | `FillBlankExercise` | 1 | New — sentence with input field |
| `word_bank` | `WordBankExercise` | 1 | New — tap word tiles to build sentence (core Duolingo mechanic) |
| `listen_select` | `ListenSelectExercise` | 2 | New — audio playback + word grid |
| `word_order` | `WordOrderExercise` | 2 | New — drag to reorder scrambled words |
| `translate_to_id` | `TranslationExercise` | 2 | New — free text input with fuzzy matching |
| `translate_to_en` | `TranslationExercise` | 2 | Same component, reversed direction |
| `listen_type` | `ListenTypeExercise` | 2 | New — audio playback + text input |
| `speaking` | Deferred | 3 | Out of scope — requires voice recognition |

**Implementation phasing:** Phase 1 implements 5 exercise types (`multiple_choice`, `multiple_choice_reverse`, `match_pairs`, `fill_blank`, `word_bank`). Phase 2 adds 5 more. Phase 3 (speaking) requires voice recognition integration.

### Grammar tip cards

Each lesson that introduces a new grammar concept includes a **tip card** shown before exercises begin. This is a short, scrollable card with:
- Grammar rule in plain English (1–3 sentences)
- 2–3 example sentences with Indonesian + English
- Visual highlight of the pattern (e.g., bolding the affix in **me**nulis)

This follows both Duolingo's "Tips" feature and Babbel's inline grammar explanations. Stored as a `tip_content` JSONB field on the `lessons` table:

```sql
ALTER TABLE lessons ADD COLUMN tip_content JSONB;
-- Format: {"title": "The me- prefix", "explanation": "...", "examples": [...]}
```

### TypeScript type regeneration

After schema migration, regenerate Supabase TypeScript types via `npx supabase gen types typescript` to pick up new columns (`grammar_tags TEXT[]`, `exercise_type`, `difficulty_tier`, `context_sentence`, `context_translation`, `stage`, `cefr_level`, `unit_number`). The existing auto-generated types in `src/integrations/supabase/types.ts` must be updated before any code references new columns.

## 13. Out of Scope

- B2/C1/C2 content (future expansion)
- AI-generated exercises (future — use static content first)
- Voice recognition for speaking exercises (use TTS playback only for now)
- Regional dialect variations (stick to standard Bahasa Indonesia)
- Writing system lessons (Indonesian uses Latin alphabet — no special handling needed)
- Phase 2 exercise UI components: `listen_select`, `word_order`, `translate_to_id/en`, `listen_type`
- Phase 3: `speaking` exercise (requires voice recognition)

## 14. Success Criteria

- User can progress from zero Indonesian to B1 conversational fluency
- Curriculum covers all practical situations an expat encounters
- Grammar concepts build naturally through context, not isolated drills
- SM-2 spaced repetition ensures long-term retention
- XP/streak/achievement system maintains motivation throughout 120 lessons

## 15. Competitive Analysis & Design Rationale

Design decisions validated against Duolingo and Babbel:

| Feature | Duolingo | Babbel | Bahasa Buddy |
|---------|----------|--------|-------------|
| Lesson length | 3–4 min (~15 exercises) | 10–15 min | 3–5 min (12–15 exercises) — follows Duolingo for habit formation |
| CEFR target | A2 (Indonesian) | A1–C1 | A1–B1 — exceeds Duolingo's Indonesian, practical for expats |
| Unit count | 69 (Indonesian) | Varies by language | 30 — fewer but deeper units |
| Grammar approach | Mixed topic + grammar units | Inline tips + exercises | Topic-based with grammar spiraling + tip cards |
| Core exercise types | ~8 (tap pairs, word bank, translate, listen, speak, MC, fill blank, match) | ~5 (fill blank, MC, speaking, listening, matching) | 11 types across 3 phases |
| Spaced repetition | Built into path ordering | 6-tier review manager | SM-2 algorithm (industry standard) |
| Indonesian affixes | Dedicated units (me-, ber-, di-, ter-) | N/A (no Indonesian) | Spiraled within topic units + affix-specific grammar tips |
| Word bank exercise | Core mechanic, heavily used | Not used | Phase 1 — critical scaffold between recognition and production |
| Grammar tips | "Tips" section before lessons | Inline explanations | Tip cards with examples before grammar-focused lessons |
| Unlocking | Strictly sequential | Unlocked (skip freely) | Sequential with 80% gate — balances structure with pacing |
