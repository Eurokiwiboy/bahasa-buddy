-- 20260316000003_add_missing_lessons.sql
-- Add new lessons to units 1-7 to bring each unit to ~4 lessons.
-- Each lesson has 5 phrases with varied exercise types and difficulty tiers.

-- ============================================================
-- UNIT 1: Greetings — "Goodbye & See You" (lesson 4)
-- ============================================================
DO $$
DECLARE
  v_lesson_id UUID;
BEGIN
  INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, lesson_number, is_premium)
  VALUES ('49968d87-9b5b-43a7-9b81-bf4ce5cbbba4', 'Goodbye & See You', 'Learn how to say farewell in various situations', 1, 20, 5, 4, 4, false)
  RETURNING id INTO v_lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, order_index, exercise_type, difficulty_tier, grammar_tags, context_sentence, context_translation)
  VALUES
    (v_lesson_id, 'Sampai jumpa', 'See you', 'sam-PAI JUM-pa', 1, 'multiple_choice', 'easy', NULL, 'Sampai jumpa besok!', 'See you tomorrow!'),
    (v_lesson_id, 'Selamat tinggal', 'Goodbye (said by the one leaving)', 'se-LA-mat TING-gal', 2, 'multiple_choice_reverse', 'easy', NULL, 'Selamat tinggal, teman-teman.', 'Goodbye, friends.'),
    (v_lesson_id, 'Selamat jalan', 'Goodbye (said to the one leaving)', 'se-LA-mat JA-lan', 3, 'fill_blank', 'medium', NULL, 'Selamat jalan, hati-hati di jalan.', 'Goodbye, be careful on the road.'),
    (v_lesson_id, 'Hati-hati', 'Be careful / Take care', 'HA-ti HA-ti', 4, 'match_pairs', 'medium', NULL, 'Hati-hati ya, sudah malam.', 'Take care, it is already late.'),
    (v_lesson_id, 'Sampai ketemu lagi', 'See you again', 'sam-PAI ke-TE-mu LA-gi', 5, 'word_bank', 'hard', NULL, 'Sampai ketemu lagi minggu depan.', 'See you again next week.');
END $$;

-- ============================================================
-- UNIT 2: Numbers — "Big Numbers" (lesson 3)
-- ============================================================
DO $$
DECLARE
  v_lesson_id UUID;
BEGIN
  INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, lesson_number, is_premium)
  VALUES ('625f9d84-9c63-48df-99af-e902e3765b3b', 'Big Numbers', 'Learn numbers from 100 to thousands', 2, 25, 7, 3, 3, false)
  RETURNING id INTO v_lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, order_index, exercise_type, difficulty_tier, grammar_tags, context_sentence, context_translation)
  VALUES
    (v_lesson_id, 'Seratus', 'One hundred', 'se-RA-tus', 1, 'multiple_choice', 'easy', NULL, 'Harganya seratus ribu.', 'The price is one hundred thousand.'),
    (v_lesson_id, 'Lima ratus', 'Five hundred', 'LI-ma RA-tus', 2, 'multiple_choice_reverse', 'easy', NULL, 'Saya punya lima ratus rupiah.', 'I have five hundred rupiah.'),
    (v_lesson_id, 'Seribu', 'One thousand', 'se-RI-bu', 3, 'fill_blank', 'medium', NULL, 'Satu botol air seribu rupiah.', 'One bottle of water is one thousand rupiah.'),
    (v_lesson_id, 'Dua ribu lima ratus', 'Two thousand five hundred', 'DU-a RI-bu LI-ma RA-tus', 4, 'match_pairs', 'medium', NULL, 'Ongkosnya dua ribu lima ratus.', 'The fare is two thousand five hundred.'),
    (v_lesson_id, 'Sepuluh ribu', 'Ten thousand', 'se-PU-luh RI-bu', 5, 'word_bank', 'hard', ARRAY['classifiers'], 'Nasi goreng harganya sepuluh ribu rupiah.', 'Fried rice costs ten thousand rupiah.');
END $$;

-- ============================================================
-- UNIT 2: Numbers — "Counting Things" (lesson 4)
-- ============================================================
DO $$
DECLARE
  v_lesson_id UUID;
BEGIN
  INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, lesson_number, is_premium)
  VALUES ('625f9d84-9c63-48df-99af-e902e3765b3b', 'Counting Things', 'Use classifiers to count people, animals, and objects', 2, 25, 7, 4, 4, false)
  RETURNING id INTO v_lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, order_index, exercise_type, difficulty_tier, grammar_tags, context_sentence, context_translation)
  VALUES
    (v_lesson_id, 'Berapa?', 'How many? / How much?', 'be-RA-pa', 1, 'multiple_choice', 'easy', ARRAY['question-words'], 'Berapa harganya?', 'How much is it?'),
    (v_lesson_id, 'Dua orang', 'Two people', 'DU-a O-rang', 2, 'multiple_choice_reverse', 'easy', ARRAY['classifiers'], 'Meja untuk dua orang.', 'A table for two people.'),
    (v_lesson_id, 'Tiga buah', 'Three (items/fruits)', 'TI-ga BU-ah', 3, 'fill_blank', 'medium', ARRAY['classifiers'], 'Saya mau beli tiga buah mangga.', 'I want to buy three mangoes.'),
    (v_lesson_id, 'Satu ekor', 'One (animal)', 'SA-tu E-kor', 4, 'match_pairs', 'medium', ARRAY['classifiers'], 'Ada satu ekor kucing di taman.', 'There is one cat in the park.'),
    (v_lesson_id, 'Lima lembar', 'Five (flat things/sheets)', 'LI-ma lem-BAR', 5, 'word_bank', 'hard', ARRAY['classifiers'], 'Saya perlu lima lembar kertas.', 'I need five sheets of paper.');
END $$;

-- ============================================================
-- UNIT 3: Food — "Drinks & Desserts" (lesson 3)
-- ============================================================
DO $$
DECLARE
  v_lesson_id UUID;
BEGIN
  INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, lesson_number, is_premium)
  VALUES ('eb1c2ece-8087-434c-884b-91168eacbf1d', 'Drinks & Desserts', 'Order beverages and sweet treats', 1, 20, 5, 3, 3, false)
  RETURNING id INTO v_lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, order_index, exercise_type, difficulty_tier, grammar_tags, context_sentence, context_translation)
  VALUES
    (v_lesson_id, 'Teh manis', 'Sweet tea', 'teh MA-nis', 1, 'multiple_choice', 'easy', NULL, 'Saya mau pesan teh manis.', 'I want to order sweet tea.'),
    (v_lesson_id, 'Kopi susu', 'Milk coffee', 'KO-pi SU-su', 2, 'multiple_choice_reverse', 'easy', NULL, 'Kopi susu satu, ya.', 'One milk coffee, please.'),
    (v_lesson_id, 'Es jeruk', 'Iced orange juice', 'es JE-ruk', 3, 'fill_blank', 'medium', NULL, 'Es jeruknya segar sekali.', 'The iced orange juice is very refreshing.'),
    (v_lesson_id, 'Air putih', 'Plain water', 'A-ir PU-tih', 4, 'match_pairs', 'medium', NULL, 'Boleh minta air putih?', 'May I have plain water?'),
    (v_lesson_id, 'Kue lapis', 'Layer cake', 'KU-e LA-pis', 5, 'word_bank', 'hard', NULL, 'Kue lapis ini enak sekali.', 'This layer cake is very delicious.');
END $$;

-- ============================================================
-- UNIT 3: Food — "Ordering Food" (lesson 4)
-- ============================================================
DO $$
DECLARE
  v_lesson_id UUID;
BEGIN
  INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, lesson_number, is_premium)
  VALUES ('eb1c2ece-8087-434c-884b-91168eacbf1d', 'Ordering Food', 'Order meals and express preferences', 2, 25, 7, 4, 4, false)
  RETURNING id INTO v_lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, order_index, exercise_type, difficulty_tier, grammar_tags, context_sentence, context_translation)
  VALUES
    (v_lesson_id, 'Saya mau pesan', 'I would like to order', 'SA-ya mau PE-san', 1, 'multiple_choice', 'easy', NULL, 'Saya mau pesan nasi goreng.', 'I would like to order fried rice.'),
    (v_lesson_id, 'Tidak pedas', 'Not spicy', 'TI-dak PE-das', 2, 'multiple_choice_reverse', 'easy', ARRAY['negation'], 'Tidak pedas, ya.', 'Not spicy, please.'),
    (v_lesson_id, 'Pedas sedikit', 'A little spicy', 'PE-das se-DI-kit', 3, 'fill_blank', 'medium', NULL, 'Pedas sedikit saja, ya.', 'Just a little spicy, please.'),
    (v_lesson_id, 'Tambah nasi', 'Extra rice', 'TAM-bah NA-si', 4, 'match_pairs', 'medium', NULL, 'Boleh tambah nasi?', 'May I have extra rice?'),
    (v_lesson_id, 'Minta bonnya', 'The bill, please', 'MIN-ta BON-nya', 5, 'word_bank', 'hard', ARRAY['possessives'], 'Permisi, minta bonnya.', 'Excuse me, the bill please.');
END $$;

-- ============================================================
-- UNIT 4: Travel — "Asking Directions" (lesson 3)
-- ============================================================
DO $$
DECLARE
  v_lesson_id UUID;
BEGIN
  INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, lesson_number, is_premium)
  VALUES ('633dbffd-78d0-4170-897e-a50e6263071b', 'Asking Directions', 'Ask for and understand directions', 2, 25, 7, 3, 3, false)
  RETURNING id INTO v_lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, order_index, exercise_type, difficulty_tier, grammar_tags, context_sentence, context_translation)
  VALUES
    (v_lesson_id, 'Di mana?', 'Where?', 'di MA-na', 1, 'multiple_choice', 'easy', ARRAY['question-words'], 'Di mana toilet?', 'Where is the toilet?'),
    (v_lesson_id, 'Belok kiri', 'Turn left', 'BE-lok KI-ri', 2, 'multiple_choice_reverse', 'easy', NULL, 'Belok kiri di perempatan.', 'Turn left at the intersection.'),
    (v_lesson_id, 'Belok kanan', 'Turn right', 'BE-lok KA-nan', 3, 'fill_blank', 'medium', NULL, 'Belok kanan setelah lampu merah.', 'Turn right after the traffic light.'),
    (v_lesson_id, 'Jalan lurus', 'Go straight', 'JA-lan LU-rus', 4, 'match_pairs', 'medium', NULL, 'Jalan lurus kira-kira dua ratus meter.', 'Go straight about two hundred meters.'),
    (v_lesson_id, 'Dekat atau jauh?', 'Near or far?', 'DE-kat A-tau JA-uh', 5, 'word_bank', 'hard', ARRAY['question-words'], 'Apakah dekat atau jauh dari sini?', 'Is it near or far from here?');
END $$;

-- ============================================================
-- UNIT 4: Travel — "Taking Transport" (lesson 4)
-- ============================================================
DO $$
DECLARE
  v_lesson_id UUID;
BEGIN
  INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, lesson_number, is_premium)
  VALUES ('633dbffd-78d0-4170-897e-a50e6263071b', 'Taking Transport', 'Use ride-hailing apps and public transport', 2, 25, 7, 4, 4, false)
  RETURNING id INTO v_lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, order_index, exercise_type, difficulty_tier, grammar_tags, context_sentence, context_translation)
  VALUES
    (v_lesson_id, 'Saya mau naik ojek', 'I want to take a motorbike taxi', 'SA-ya mau NA-ik O-jek', 1, 'multiple_choice', 'easy', NULL, 'Saya mau naik ojek ke stasiun.', 'I want to take a motorbike taxi to the station.'),
    (v_lesson_id, 'Berapa ongkosnya?', 'How much is the fare?', 'be-RA-pa ong-KOS-nya', 2, 'multiple_choice_reverse', 'easy', ARRAY['question-words', 'possessives'], 'Berapa ongkosnya ke bandara?', 'How much is the fare to the airport?'),
    (v_lesson_id, 'Turun di sini', 'Drop off here', 'TU-run di SI-ni', 3, 'fill_blank', 'medium', NULL, 'Pak, turun di sini saja.', 'Sir, drop off here please.'),
    (v_lesson_id, 'Naik bus ke mana?', 'Where does this bus go?', 'NA-ik bus ke MA-na', 4, 'match_pairs', 'medium', ARRAY['question-words'], 'Bus ini naik bus ke mana?', 'Where does this bus go?'),
    (v_lesson_id, 'Tolong antar saya ke hotel', 'Please take me to the hotel', 'TO-long AN-tar SA-ya ke ho-TEL', 5, 'word_bank', 'hard', NULL, 'Tolong antar saya ke hotel ini.', 'Please take me to this hotel.');
END $$;

-- ============================================================
-- UNIT 5: Shopping — "Bargaining" (lesson 3)
-- ============================================================
DO $$
DECLARE
  v_lesson_id UUID;
BEGIN
  INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, lesson_number, is_premium)
  VALUES ('6217d598-cc80-43a2-9a66-d4b671691f82', 'Bargaining', 'Negotiate prices at the market', 2, 25, 7, 3, 3, false)
  RETURNING id INTO v_lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, order_index, exercise_type, difficulty_tier, grammar_tags, context_sentence, context_translation)
  VALUES
    (v_lesson_id, 'Terlalu mahal', 'Too expensive', 'ter-LA-lu MA-hal', 1, 'multiple_choice', 'easy', NULL, 'Ini terlalu mahal, Pak.', 'This is too expensive, Sir.'),
    (v_lesson_id, 'Bisa kurang?', 'Can you lower the price?', 'BI-sa KU-rang', 2, 'multiple_choice_reverse', 'easy', ARRAY['question-words'], 'Bisa kurang sedikit?', 'Can you lower it a little?'),
    (v_lesson_id, 'Harga pas', 'Fixed price', 'HAR-ga pas', 3, 'fill_blank', 'medium', NULL, 'Maaf, ini harga pas.', 'Sorry, this is a fixed price.'),
    (v_lesson_id, 'Yang lebih murah', 'A cheaper one', 'yang le-BIH MU-rah', 4, 'match_pairs', 'medium', NULL, 'Ada yang lebih murah?', 'Is there a cheaper one?'),
    (v_lesson_id, 'Saya ambil yang ini', 'I will take this one', 'SA-ya AM-bil yang I-ni', 5, 'word_bank', 'hard', ARRAY['pronouns'], 'Oke, saya ambil yang ini.', 'Okay, I will take this one.');
END $$;

-- ============================================================
-- UNIT 5: Shopping — "Colors & Sizes" (lesson 4)
-- ============================================================
DO $$
DECLARE
  v_lesson_id UUID;
BEGIN
  INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, lesson_number, is_premium)
  VALUES ('6217d598-cc80-43a2-9a66-d4b671691f82', 'Colors & Sizes', 'Describe items by color and size', 2, 25, 7, 4, 4, false)
  RETURNING id INTO v_lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, order_index, exercise_type, difficulty_tier, grammar_tags, context_sentence, context_translation)
  VALUES
    (v_lesson_id, 'Merah', 'Red', 'ME-rah', 1, 'multiple_choice', 'easy', NULL, 'Saya suka warna merah.', 'I like the color red.'),
    (v_lesson_id, 'Biru', 'Blue', 'BI-ru', 2, 'match_pairs', 'easy', NULL, 'Ada baju warna biru?', 'Is there a blue shirt?'),
    (v_lesson_id, 'Ukuran besar', 'Large size', 'u-KU-ran BE-sar', 3, 'multiple_choice_reverse', 'medium', NULL, 'Ada ukuran besar?', 'Is there a large size?'),
    (v_lesson_id, 'Terlalu kecil', 'Too small', 'ter-LA-lu ke-CIL', 4, 'fill_blank', 'medium', NULL, 'Ini terlalu kecil untuk saya.', 'This is too small for me.'),
    (v_lesson_id, 'Warna hijau ukuran sedang', 'Green in medium size', 'WAR-na HI-jau u-KU-ran se-DANG', 5, 'word_bank', 'hard', NULL, 'Saya mau warna hijau ukuran sedang.', 'I want green in medium size.');
END $$;

-- ============================================================
-- UNIT 6: Time & Days — "Days & Months" (lesson 3)
-- ============================================================
DO $$
DECLARE
  v_lesson_id UUID;
BEGIN
  INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, lesson_number, is_premium)
  VALUES ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a', 'Days & Months', 'Learn the days of the week and months of the year', 2, 25, 7, 3, 3, false)
  RETURNING id INTO v_lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, order_index, exercise_type, difficulty_tier, grammar_tags, context_sentence, context_translation)
  VALUES
    (v_lesson_id, 'Hari Senin', 'Monday', 'HA-ri se-NIN', 1, 'multiple_choice', 'easy', ARRAY['time-markers'], 'Saya mulai kerja hari Senin.', 'I start work on Monday.'),
    (v_lesson_id, 'Hari Jumat', 'Friday', 'HA-ri JU-mat', 2, 'multiple_choice_reverse', 'easy', ARRAY['time-markers'], 'Hari Jumat kita libur.', 'We have a day off on Friday.'),
    (v_lesson_id, 'Hari Minggu', 'Sunday', 'HA-ri MING-gu', 3, 'fill_blank', 'medium', ARRAY['time-markers'], 'Hari Minggu saya istirahat.', 'I rest on Sunday.'),
    (v_lesson_id, 'Bulan Januari', 'January', 'BU-lan ja-nu-A-ri', 4, 'match_pairs', 'medium', ARRAY['time-markers'], 'Tahun baru bulan Januari.', 'New Year is in January.'),
    (v_lesson_id, 'Tanggal berapa hari ini?', 'What is today''s date?', 'TANG-gal be-RA-pa HA-ri I-ni', 5, 'word_bank', 'hard', ARRAY['question-words', 'time-markers'], 'Tanggal berapa hari ini? Tanggal lima belas.', 'What is today''s date? The fifteenth.');
END $$;

-- ============================================================
-- UNIT 6: Time & Days — "Making Plans" (lesson 4)
-- ============================================================
DO $$
DECLARE
  v_lesson_id UUID;
BEGIN
  INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, lesson_number, is_premium)
  VALUES ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a', 'Making Plans', 'Schedule activities and ask about time', 2, 25, 7, 4, 4, false)
  RETURNING id INTO v_lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, order_index, exercise_type, difficulty_tier, grammar_tags, context_sentence, context_translation)
  VALUES
    (v_lesson_id, 'Kapan?', 'When?', 'KA-pan', 1, 'multiple_choice', 'easy', ARRAY['question-words'], 'Kapan kita ketemu?', 'When do we meet?'),
    (v_lesson_id, 'Besok pagi', 'Tomorrow morning', 'BE-sok PA-gi', 2, 'multiple_choice_reverse', 'easy', ARRAY['time-markers'], 'Kita ketemu besok pagi.', 'We meet tomorrow morning.'),
    (v_lesson_id, 'Minggu depan', 'Next week', 'MING-gu DE-pan', 3, 'fill_blank', 'medium', ARRAY['time-markers'], 'Saya pergi minggu depan.', 'I leave next week.'),
    (v_lesson_id, 'Jam berapa?', 'What time?', 'jam be-RA-pa', 4, 'match_pairs', 'medium', ARRAY['question-words', 'time-markers'], 'Jam berapa kita berangkat?', 'What time do we depart?'),
    (v_lesson_id, 'Lusa sore jam tiga', 'Day after tomorrow afternoon at three', 'LU-sa SO-re jam TI-ga', 5, 'word_bank', 'hard', ARRAY['time-markers'], 'Kita ketemu lusa sore jam tiga.', 'We meet the day after tomorrow afternoon at three.');
END $$;

-- ============================================================
-- UNIT 7: Emergency — "At the Pharmacy" (lesson 3)
-- ============================================================
DO $$
DECLARE
  v_lesson_id UUID;
BEGIN
  INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, lesson_number, is_premium)
  VALUES ('f36d40c7-382a-4237-b84c-13a092d1a7a2', 'At the Pharmacy', 'Buy medicine and describe symptoms', 2, 25, 7, 3, 3, false)
  RETURNING id INTO v_lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, order_index, exercise_type, difficulty_tier, grammar_tags, context_sentence, context_translation)
  VALUES
    (v_lesson_id, 'Obat sakit kepala', 'Headache medicine', 'O-bat SA-kit ke-PA-la', 1, 'multiple_choice', 'easy', NULL, 'Ada obat sakit kepala?', 'Do you have headache medicine?'),
    (v_lesson_id, 'Saya alergi', 'I am allergic', 'SA-ya a-LER-gi', 2, 'multiple_choice_reverse', 'easy', ARRAY['pronouns'], 'Saya alergi penisilin.', 'I am allergic to penicillin.'),
    (v_lesson_id, 'Obat masuk angin', 'Cold/flu medicine', 'O-bat MA-suk A-ngin', 3, 'fill_blank', 'medium', NULL, 'Saya perlu obat masuk angin.', 'I need cold medicine.'),
    (v_lesson_id, 'Berapa kali sehari?', 'How many times a day?', 'be-RA-pa KA-li se-HA-ri', 4, 'match_pairs', 'medium', ARRAY['question-words'], 'Minum obat ini berapa kali sehari?', 'How many times a day do I take this medicine?'),
    (v_lesson_id, 'Saya perlu resep dokter', 'I need a doctor''s prescription', 'SA-ya PER-lu RE-sep DOK-ter', 5, 'word_bank', 'hard', ARRAY['pronouns'], 'Apakah saya perlu resep dokter untuk obat ini?', 'Do I need a doctor''s prescription for this medicine?');
END $$;

-- ============================================================
-- UNIT 7: Emergency — "Calling for Help" (lesson 4)
-- ============================================================
DO $$
DECLARE
  v_lesson_id UUID;
BEGIN
  INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, lesson_number, is_premium)
  VALUES ('f36d40c7-382a-4237-b84c-13a092d1a7a2', 'Calling for Help', 'Handle emergencies and call for assistance', 3, 30, 8, 4, 4, false)
  RETURNING id INTO v_lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, order_index, exercise_type, difficulty_tier, grammar_tags, context_sentence, context_translation)
  VALUES
    (v_lesson_id, 'Tolong!', 'Help!', 'TO-long', 1, 'multiple_choice', 'easy', NULL, 'Tolong! Ada kecelakaan!', 'Help! There is an accident!'),
    (v_lesson_id, 'Panggil polisi!', 'Call the police!', 'PANG-gil po-LI-si', 2, 'multiple_choice_reverse', 'easy', NULL, 'Cepat, panggil polisi!', 'Quick, call the police!'),
    (v_lesson_id, 'Ada kebakaran!', 'There is a fire!', 'A-da ke-ba-KAR-an', 3, 'fill_blank', 'medium', NULL, 'Tolong, ada kebakaran di gedung itu!', 'Help, there is a fire in that building!'),
    (v_lesson_id, 'Ini darurat', 'This is an emergency', 'I-ni da-RU-rat', 4, 'match_pairs', 'medium', NULL, 'Ini darurat, saya perlu ambulans.', 'This is an emergency, I need an ambulance.'),
    (v_lesson_id, 'Nomor darurat seratus dua belas', 'Emergency number one hundred twelve', 'NO-mor da-RU-rat se-RA-tus DU-a BE-las', 5, 'word_bank', 'hard', NULL, 'Hubungi nomor darurat seratus dua belas.', 'Call emergency number one hundred twelve.');
END $$;
