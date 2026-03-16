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

Each unit contains **4 lessons**, each lesson following a consistent flow:

1. **Introduce** (receptive) — New vocabulary presented with images, audio, and context sentences. Learner listens and reads. ~8–12 new items per lesson.
2. **Practice** (guided) — Multiple-choice, matching, and fill-in-the-blank exercises. Scaffolded difficulty.
3. **Produce** (active) — Translation exercises (English→Indonesian), sentence construction, speaking prompts.
4. **Review** (spaced) — SM-2 spaced repetition pulls from current and previous lessons. Adaptive difficulty.

### Lesson progression within a unit:
- **Lesson 1:** Core vocabulary + basic phrases
- **Lesson 2:** Extended vocabulary + grammar pattern
- **Lesson 3:** Conversational phrases + cultural context
- **Lesson 4:** Unit review + mini-assessment

## 6. Exercise Types

Exercises follow a **receptive-first** progression within each lesson:

| Exercise Type | Direction | Difficulty | When Introduced |
|--------------|-----------|------------|-----------------|
| `listen_select` | Audio → Select image/word | Easiest | First exposure |
| `match_pairs` | Indonesian ↔ English pairs | Easy | First exposure |
| `multiple_choice` | Indonesian → Pick English | Easy | After listen |
| `multiple_choice_reverse` | English → Pick Indonesian | Medium | After match |
| `fill_blank` | Sentence with gap | Medium | Mid-lesson |
| `word_order` | Arrange words into sentence | Medium-Hard | Mid-lesson |
| `translate_to_id` | English → Type Indonesian | Hard | Late lesson |
| `translate_to_en` | Indonesian → Type English | Medium-Hard | Late lesson |
| `listen_type` | Audio → Type what you hear | Hard | Late lesson |
| `speaking` | Prompt → Speak response | Hardest | End of lesson |

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
| Exercise types | 10 |

## 9. Data Model Changes

### Modified: `categories` table

Add columns to support curriculum structure:

```sql
ALTER TABLE categories ADD COLUMN stage TEXT CHECK (stage IN ('survival', 'daily_life', 'fluency'));
ALTER TABLE categories ADD COLUMN cefr_level TEXT CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'));
ALTER TABLE categories ADD COLUMN unit_number INTEGER;
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
ALTER TABLE phrases ADD COLUMN exercise_type TEXT DEFAULT 'multiple_choice';
ALTER TABLE phrases ADD COLUMN difficulty_tier TEXT CHECK (difficulty_tier IN ('easy', 'medium', 'hard')) DEFAULT 'easy';
ALTER TABLE phrases ADD COLUMN grammar_tags TEXT[]; -- e.g., {'negation', 'pronouns'}
ALTER TABLE phrases ADD COLUMN audio_url TEXT; -- for listen exercises
ALTER TABLE phrases ADD COLUMN image_url TEXT; -- for visual exercises
ALTER TABLE phrases ADD COLUMN context_sentence TEXT; -- example usage
ALTER TABLE phrases ADD COLUMN context_translation TEXT; -- English translation of context
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
```

### New: `unit_prerequisites` table

Define unlock order:

```sql
CREATE TABLE unit_prerequisites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES categories(id),
  prerequisite_unit_id UUID REFERENCES categories(id),
  min_completion_percent INTEGER DEFAULT 80
);
```

## 10. Progression & Unlocking

- Units unlock sequentially: Unit N+1 requires ≥80% completion of Unit N
- Stage transitions (A1→A2, A2→B1) require passing the milestone review unit (Units 10, 20)
- Each lesson tracks: started, completed, score, time spent
- XP awards scale with difficulty: easy exercises 5 XP, medium 10 XP, hard 15 XP
- Streak bonuses and daily goals remain unchanged

## 11. Existing Content Migration

Current 8 categories and 120 cards map into the new structure:

| Current Category | → New Unit | Stage |
|-----------------|-----------|-------|
| Greetings | Unit 1 | Survival |
| Numbers | Unit 2 | Survival |
| Food & Drink | Unit 3 | Survival |
| Transportation | Unit 4 | Survival |
| Shopping | Unit 5 | Survival |
| Time & Dates | Unit 6 | Survival |
| Family | Unit 11 | Daily Life |
| Work & Business | Unit 12 | Daily Life |

Existing cards and phrases will be re-tagged with the new columns. No data is deleted.

## 12. Out of Scope

- B2/C1/C2 content (future expansion)
- AI-generated exercises (future — use static content first)
- Voice recognition for speaking exercises (use TTS playback only for now)
- Regional dialect variations (stick to standard Bahasa Indonesia)
- Writing system lessons (Indonesian uses Latin alphabet — no special handling needed)

## 13. Success Criteria

- User can progress from zero Indonesian to B1 conversational fluency
- Curriculum covers all practical situations an expat encounters
- Grammar concepts build naturally through context, not isolated drills
- SM-2 spaced repetition ensures long-term retention
- XP/streak/achievement system maintains motivation throughout 120 lessons
