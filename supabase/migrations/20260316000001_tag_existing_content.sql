-- Tag existing categories with stage, cefr_level, unit_number
-- Using exact UUIDs from the database

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

-- Daily Life → Unit 6 (Survival/A1) — remapped as "Time & Days"
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
