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
