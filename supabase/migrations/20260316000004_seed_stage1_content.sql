-- 20260316000004_seed_stage1_content.sql
-- Seed lessons and phrases for units 8, 9, 10 (Stage 1: Survival)
-- 4 lessons per unit, 5 phrases per lesson = 60 phrases total

-- ============================================================
-- UNIT 8: Home & Accommodation
-- ============================================================

DO $$
DECLARE
  cat_id UUID;
  lesson_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE unit_number = 8;

  -- Lesson 1: Parts of the House
  INSERT INTO lessons (category_id, title, description, order_index, lesson_number, difficulty, xp_reward, estimated_minutes)
  VALUES (cat_id, 'Parts of the House', 'Learn the names of rooms and areas in an Indonesian home', 1, 1, 1, 20, 5)
  RETURNING id INTO lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index, exercise_type, difficulty_tier, grammar_tags)
  VALUES
    (lesson_id, 'Rumah', 'House / Home', 'RU-mah', 'Ini rumah saya.', 'This is my house.', '"Rumah" is one of the most fundamental words in Indonesian.', 1, 'multiple_choice', 'easy', NULL),
    (lesson_id, 'Kamar', 'Room / Bedroom', 'KA-mar', 'Kamar saya di lantai dua.', 'My room is on the second floor.', '"Kamar" alone usually means bedroom. Add a modifier for other rooms.', 2, 'multiple_choice', 'easy', NULL),
    (lesson_id, 'Dapur', 'Kitchen', 'DA-pur', 'Ibu memasak di dapur.', 'Mother is cooking in the kitchen.', NULL, 3, 'multiple_choice_reverse', 'easy', NULL),
    (lesson_id, 'Kamar mandi', 'Bathroom', 'KA-mar MAN-di', 'Di mana kamar mandinya?', 'Where is the bathroom?', 'Literally "bathing room." "Mandi" means to bathe.', 4, 'match_pairs', 'medium', ARRAY['question-words']),
    (lesson_id, 'Ruang tamu', 'Living room', 'RU-ang TA-mu', 'Silakan duduk di ruang tamu.', 'Please sit in the living room.', '"Ruang" = room/space, "tamu" = guest. Literally "guest room."', 5, 'fill_blank', 'medium', NULL);

  -- Lesson 2: Furniture & Things
  INSERT INTO lessons (category_id, title, description, order_index, lesson_number, difficulty, xp_reward, estimated_minutes)
  VALUES (cat_id, 'Furniture & Things', 'Name common household furniture and objects', 2, 2, 1, 20, 5)
  RETURNING id INTO lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index, exercise_type, difficulty_tier, grammar_tags)
  VALUES
    (lesson_id, 'Meja', 'Table / Desk', 'ME-ja', 'Taruh di atas meja.', 'Put it on the table.', NULL, 1, 'multiple_choice', 'easy', NULL),
    (lesson_id, 'Kursi', 'Chair', 'KUR-si', 'Ada berapa kursi?', 'How many chairs are there?', NULL, 2, 'multiple_choice', 'easy', ARRAY['question-words']),
    (lesson_id, 'Lemari', 'Wardrobe / Cabinet', 'le-MA-ri', 'Baju ada di dalam lemari.', 'The clothes are inside the wardrobe.', '"Di dalam" = inside.', 3, 'multiple_choice_reverse', 'easy', NULL),
    (lesson_id, 'Tempat tidur', 'Bed', 'TEM-pat TI-dur', 'Tempat tidurnya besar sekali.', 'The bed is very big.', 'Literally "sleeping place." "Tempat" = place, "tidur" = sleep.', 4, 'match_pairs', 'medium', NULL),
    (lesson_id, 'Pintu', 'Door', 'PIN-tu', 'Tolong tutup pintunya.', 'Please close the door.', '"Tutup" = close, "buka" = open.', 5, 'word_bank', 'medium', NULL);

  -- Lesson 3: Renting a Room
  INSERT INTO lessons (category_id, title, description, order_index, lesson_number, difficulty, xp_reward, estimated_minutes)
  VALUES (cat_id, 'Renting a Room', 'Essential vocabulary for finding and renting accommodation', 3, 3, 2, 25, 5)
  RETURNING id INTO lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index, exercise_type, difficulty_tier, grammar_tags)
  VALUES
    (lesson_id, 'Kos', 'Boarding house', 'kos', 'Saya tinggal di kos.', 'I live in a boarding house.', '"Kos" (or "kost") is the most common housing for students and young workers in Indonesia.', 1, 'multiple_choice', 'easy', NULL),
    (lesson_id, 'Kontrakan', 'Rented house', 'kon-TRA-kan', 'Kontrakan ini ada dua kamar.', 'This rented house has two rooms.', '"Kontrakan" is a rented house, usually for families. Bigger than a kos.', 2, 'multiple_choice_reverse', 'medium', NULL),
    (lesson_id, 'Sewa', 'Rent / To rent', 'SE-wa', 'Berapa sewanya?', 'How much is the rent?', '"Sewa" functions as both noun and verb.', 3, 'fill_blank', 'medium', ARRAY['question-words']),
    (lesson_id, 'Per bulan', 'Per month', 'per BU-lan', 'Sewanya dua juta per bulan.', 'The rent is two million per month.', '"Bulan" also means "moon." Indonesian rent is usually quoted monthly.', 4, 'match_pairs', 'medium', ARRAY['time-markers']),
    (lesson_id, 'Termasuk', 'Including / Included', 'ter-MA-suk', 'Termasuk listrik dan air.', 'Including electricity and water.', '"Termasuk" is used to describe what is included in the rent.', 5, 'word_bank', 'hard', NULL);

  -- Lesson 4: Talking to Your Landlord
  INSERT INTO lessons (category_id, title, description, order_index, lesson_number, difficulty, xp_reward, estimated_minutes)
  VALUES (cat_id, 'Talking to Your Landlord', 'Communicate about repairs, payments, and issues at home', 4, 4, 2, 25, 5)
  RETURNING id INTO lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index, exercise_type, difficulty_tier, grammar_tags)
  VALUES
    (lesson_id, 'AC rusak', 'The AC is broken', 'a-SE RU-sak', 'Pak, AC di kamar saya rusak.', 'Sir, the AC in my room is broken.', '"Rusak" = broken/damaged. Very useful word for reporting problems.', 1, 'multiple_choice', 'medium', NULL),
    (lesson_id, 'Air mati', 'The water is off', 'A-ir MA-ti', 'Air mati sejak tadi pagi.', 'The water has been off since this morning.', '"Mati" literally means "dead" but is used for utilities being off. "Listrik mati" = power is out.', 2, 'multiple_choice_reverse', 'medium', ARRAY['time-markers']),
    (lesson_id, 'Bayar sewa', 'Pay rent', 'BA-yar SE-wa', 'Saya mau bayar sewa bulan ini.', 'I want to pay this month''s rent.', '"Bayar" = to pay. Used for any payment.', 3, 'fill_blank', 'medium', NULL),
    (lesson_id, 'Kapan diperbaiki?', 'When will it be fixed?', 'KA-pan di-per-BA-i-ki', 'Kapan AC-nya diperbaiki, Pak?', 'When will the AC be fixed, Sir?', '"Diperbaiki" is the passive form of "memperbaiki" (to fix). The "di-" prefix marks passive voice.', 4, 'word_bank', 'hard', ARRAY['question-words']),
    (lesson_id, 'Terima kasih, Pak', 'Thank you, Sir', 'te-RI-ma KA-sih pak', 'Terima kasih banyak, Pak.', 'Thank you very much, Sir.', 'Always show respect to your landlord. "Pak" for men, "Bu" for women.', 5, 'multiple_choice', 'easy', NULL);
END $$;


-- ============================================================
-- UNIT 9: Weather & Nature
-- ============================================================

DO $$
DECLARE
  cat_id UUID;
  lesson_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE unit_number = 9;

  -- Lesson 1: Today's Weather
  INSERT INTO lessons (category_id, title, description, order_index, lesson_number, difficulty, xp_reward, estimated_minutes)
  VALUES (cat_id, 'Today''s Weather', 'Describe basic weather conditions in Indonesian', 1, 1, 1, 20, 5)
  RETURNING id INTO lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index, exercise_type, difficulty_tier, grammar_tags)
  VALUES
    (lesson_id, 'Panas', 'Hot', 'PA-nas', 'Hari ini panas sekali.', 'Today is very hot.', '"Sekali" after an adjective = "very."', 1, 'multiple_choice', 'easy', NULL),
    (lesson_id, 'Dingin', 'Cold', 'DI-ngin', 'Di gunung udaranya dingin.', 'In the mountains the air is cold.', '"Udara" = air/atmosphere.', 2, 'multiple_choice', 'easy', NULL),
    (lesson_id, 'Hujan', 'Rain / Rainy', 'HU-jan', 'Hari ini hujan terus.', 'It has been raining all day.', '"Hujan" is both a noun (rain) and adjective (rainy). "Terus" = continuously.', 3, 'multiple_choice_reverse', 'easy', NULL),
    (lesson_id, 'Cerah', 'Clear / Sunny', 'CE-rah', 'Cuaca hari ini cerah.', 'The weather today is clear.', '"Cuaca" = weather. A key vocabulary word.', 4, 'match_pairs', 'medium', NULL),
    (lesson_id, 'Mendung', 'Cloudy / Overcast', 'MEN-dung', 'Langit mendung, mungkin mau hujan.', 'The sky is cloudy, maybe it will rain.', '"Langit" = sky, "mungkin" = maybe.', 5, 'fill_blank', 'medium', NULL);

  -- Lesson 2: Seasons in Indonesia
  INSERT INTO lessons (category_id, title, description, order_index, lesson_number, difficulty, xp_reward, estimated_minutes)
  VALUES (cat_id, 'Seasons in Indonesia', 'Learn about Indonesia''s two seasons and related vocabulary', 2, 2, 1, 20, 5)
  RETURNING id INTO lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index, exercise_type, difficulty_tier, grammar_tags)
  VALUES
    (lesson_id, 'Musim hujan', 'Rainy season', 'MU-sim HU-jan', 'Sekarang musim hujan.', 'It is the rainy season now.', '"Musim" = season. Indonesia has two main seasons, not four.', 1, 'multiple_choice', 'easy', ARRAY['time-markers']),
    (lesson_id, 'Musim kemarau', 'Dry season', 'MU-sim ke-MA-rau', 'Musim kemarau dari April sampai Oktober.', 'The dry season is from April to October.', '"Kemarau" = drought/dry spell. "Sampai" = until.', 2, 'multiple_choice_reverse', 'medium', ARRAY['time-markers']),
    (lesson_id, 'Banjir', 'Flood', 'BAN-jir', 'Hati-hati, jalan banjir.', 'Be careful, the road is flooded.', '"Hati-hati" = be careful. Floods are common during musim hujan.', 3, 'match_pairs', 'medium', NULL),
    (lesson_id, 'Kering', 'Dry', 'KE-ring', 'Tanahnya sangat kering.', 'The soil is very dry.', '"Tanah" = land/soil.', 4, 'fill_blank', 'medium', NULL),
    (lesson_id, 'Musim panas', 'Summer / Hot season', 'MU-sim PA-nas', 'Indonesia tidak punya musim panas seperti Eropa.', 'Indonesia does not have a summer like Europe.', 'Indonesians sometimes use "musim panas" informally, but officially it is "musim kemarau."', 5, 'word_bank', 'hard', ARRAY['negation']);

  -- Lesson 3: Nature Around Us
  INSERT INTO lessons (category_id, title, description, order_index, lesson_number, difficulty, xp_reward, estimated_minutes)
  VALUES (cat_id, 'Nature Around Us', 'Name mountains, beaches, and other natural features', 3, 3, 2, 25, 5)
  RETURNING id INTO lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index, exercise_type, difficulty_tier, grammar_tags)
  VALUES
    (lesson_id, 'Gunung', 'Mountain', 'GU-nung', 'Kami mau mendaki gunung.', 'We want to climb the mountain.', '"Mendaki" = to climb/trek. Indonesia has 127 active volcanoes.', 1, 'multiple_choice', 'easy', NULL),
    (lesson_id, 'Laut', 'Sea / Ocean', 'LA-ut', 'Lautnya biru dan indah.', 'The sea is blue and beautiful.', '"Indah" = beautiful (for scenery/nature).', 2, 'multiple_choice', 'easy', NULL),
    (lesson_id, 'Pantai', 'Beach', 'PAN-tai', 'Ayo ke pantai!', 'Let''s go to the beach!', '"Ayo" = let''s / come on. Very common in casual speech.', 3, 'multiple_choice_reverse', 'easy', NULL),
    (lesson_id, 'Sungai', 'River', 'SU-ngai', 'Jangan berenang di sungai itu.', 'Don''t swim in that river.', '"Jangan" = don''t. Used for negative commands.', 4, 'match_pairs', 'medium', ARRAY['negation']),
    (lesson_id, 'Hutan', 'Forest', 'HU-tan', 'Hutan di Kalimantan sangat luas.', 'The forests in Kalimantan are very vast.', '"Luas" = vast/wide. Kalimantan has some of the oldest rainforests in the world.', 5, 'fill_blank', 'hard', NULL);

  -- Lesson 4: Weather Conversations
  INSERT INTO lessons (category_id, title, description, order_index, lesson_number, difficulty, xp_reward, estimated_minutes)
  VALUES (cat_id, 'Weather Conversations', 'Use weather vocabulary in everyday conversation', 4, 4, 2, 25, 5)
  RETURNING id INTO lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index, exercise_type, difficulty_tier, grammar_tags)
  VALUES
    (lesson_id, 'Hari ini panas sekali', 'Today is really hot', 'HA-ri I-ni PA-nas se-KA-li', 'Aduh, hari ini panas sekali ya!', 'Wow, today is really hot!', '"Aduh" = oh/wow (exclamation). "Ya" at the end seeks agreement.', 1, 'multiple_choice', 'easy', NULL),
    (lesson_id, 'Bawa payung', 'Bring an umbrella', 'BA-wa PA-yung', 'Bawa payung, mungkin hujan nanti.', 'Bring an umbrella, it might rain later.', '"Bawa" = bring/carry. "Nanti" = later.', 2, 'multiple_choice_reverse', 'medium', ARRAY['time-markers']),
    (lesson_id, 'Cuaca bagus', 'Nice weather', 'CU-a-ca BA-gus', 'Cuaca hari ini bagus, ayo jalan-jalan!', 'The weather today is nice, let''s go out!', '"Bagus" = good/nice. "Jalan-jalan" = to go out/stroll.', 3, 'fill_blank', 'medium', NULL),
    (lesson_id, 'Kapan musim hujan?', 'When is the rainy season?', 'KA-pan MU-sim HU-jan', 'Kapan musim hujan di Jakarta?', 'When is the rainy season in Jakarta?', '"Kapan" = when. Rainy season is typically October–March.', 4, 'word_bank', 'hard', ARRAY['question-words', 'time-markers']),
    (lesson_id, 'Angin kencang', 'Strong wind', 'A-ngin ken-CANG', 'Hati-hati, anginnya kencang hari ini.', 'Be careful, the wind is strong today.', '"Angin" = wind, "kencang" = strong/fast (for wind or speed).', 5, 'match_pairs', 'hard', NULL);
END $$;


-- ============================================================
-- UNIT 10: A1 Review & Milestone
-- ============================================================

DO $$
DECLARE
  cat_id UUID;
  lesson_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE unit_number = 10;

  -- Lesson 1: Review — Greetings & Introductions (Units 1-2)
  INSERT INTO lessons (category_id, title, description, order_index, lesson_number, difficulty, xp_reward, estimated_minutes)
  VALUES (cat_id, 'Review: Greetings & Introductions', 'Revisit key phrases from Units 1 and 2', 1, 1, 2, 30, 5)
  RETURNING id INTO lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index, exercise_type, difficulty_tier, grammar_tags)
  VALUES
    (lesson_id, 'Selamat pagi, apa kabar?', 'Good morning, how are you?', 'se-LA-mat PA-gi A-pa KA-bar', 'Selamat pagi, Pak! Apa kabar?', 'Good morning, Sir! How are you?', 'Combines greeting + question. Use "pagi" before ~10am.', 1, 'word_bank', 'medium', ARRAY['question-words']),
    (lesson_id, 'Nama saya Adi, saya dari Jakarta', 'My name is Adi, I am from Jakarta', 'NA-ma SA-ya A-di SA-ya DA-ri ja-KAR-ta', 'Perkenalkan, nama saya Adi. Saya dari Jakarta.', 'Let me introduce myself, my name is Adi. I am from Jakarta.', 'Full self-introduction pattern.', 2, 'fill_blank', 'medium', ARRAY['pronouns']),
    (lesson_id, 'Senang berkenalan dengan Anda', 'Nice to meet you', 'se-NANG ber-ke-NAL-an de-NGAN AN-da', 'Senang berkenalan dengan Anda, Bu.', 'Nice to meet you, Ma''am.', '"Anda" is formal "you." Use "kamu" with friends.', 3, 'word_bank', 'hard', ARRAY['pronouns']),
    (lesson_id, 'Saya tinggal di Bali', 'I live in Bali', 'SA-ya TING-gal di BA-li', 'Saya tinggal di Bali sudah dua tahun.', 'I have lived in Bali for two years.', '"Sudah" + time = have been doing for (duration).', 4, 'fill_blank', 'hard', ARRAY['pronouns', 'time-markers']),
    (lesson_id, 'Sampai jumpa lagi', 'See you again', 'SAM-pai JUM-pa LA-gi', 'Sampai jumpa lagi besok!', 'See you again tomorrow!', '"Sampai" = until, "jumpa" = meet, "lagi" = again. A warm farewell.', 5, 'word_bank', 'medium', NULL);

  -- Lesson 2: Review — Food & Shopping (Units 3, 5)
  INSERT INTO lessons (category_id, title, description, order_index, lesson_number, difficulty, xp_reward, estimated_minutes)
  VALUES (cat_id, 'Review: Food & Shopping', 'Revisit key phrases from Units 3 and 5', 2, 2, 2, 30, 5)
  RETURNING id INTO lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index, exercise_type, difficulty_tier, grammar_tags)
  VALUES
    (lesson_id, 'Saya mau pesan nasi goreng', 'I want to order fried rice', 'SA-ya MAU PE-san NA-si GO-reng', 'Saya mau pesan nasi goreng satu, Pak.', 'I want to order one fried rice, Sir.', '"Mau" = want. "Pesan" = to order.', 1, 'word_bank', 'medium', NULL),
    (lesson_id, 'Tidak pedas, ya', 'Not spicy, please', 'TI-dak PE-das ya', 'Tolong tidak pedas, ya.', 'Please not spicy, OK?', '"Ya" at the end softens the request.', 2, 'fill_blank', 'medium', ARRAY['negation']),
    (lesson_id, 'Berapa harganya?', 'How much does it cost?', 'be-RA-pa har-GA-nya', 'Berapa harganya baju ini?', 'How much is this shirt?', '"-nya" adds specificity, like "the" in English.', 3, 'word_bank', 'medium', ARRAY['question-words']),
    (lesson_id, 'Terlalu mahal, bisa kurang?', 'Too expensive, can you lower it?', 'ter-LA-lu MA-hal BI-sa KU-rang', 'Terlalu mahal, Pak. Bisa kurang sedikit?', 'Too expensive, Sir. Can you lower it a bit?', '"Terlalu" = too (much). "Bisa kurang?" is the essential bargaining phrase.', 4, 'fill_blank', 'hard', NULL),
    (lesson_id, 'Saya bayar pakai ini', 'I will pay with this', 'SA-ya BA-yar PA-kai I-ni', 'Saya bayar pakai kartu, bisa?', 'Can I pay with a card?', '"Pakai" = use/with (for method). "Kartu" = card.', 5, 'word_bank', 'hard', NULL);

  -- Lesson 3: Review — Getting Around (Units 4, 6)
  INSERT INTO lessons (category_id, title, description, order_index, lesson_number, difficulty, xp_reward, estimated_minutes)
  VALUES (cat_id, 'Review: Getting Around', 'Revisit key phrases from Units 4 and 6', 3, 3, 2, 30, 5)
  RETURNING id INTO lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index, exercise_type, difficulty_tier, grammar_tags)
  VALUES
    (lesson_id, 'Saya mau ke stasiun', 'I want to go to the station', 'SA-ya MAU ke sta-SI-un', 'Saya mau ke stasiun kereta.', 'I want to go to the train station.', '"Ke" = to (direction). A key preposition.', 1, 'fill_blank', 'medium', NULL),
    (lesson_id, 'Belok kiri di perempatan', 'Turn left at the intersection', 'BE-lok KI-ri di per-em-PA-tan', 'Belok kiri di perempatan pertama.', 'Turn left at the first intersection.', '"Belok" = turn, "perempatan" = intersection (four-way).', 2, 'word_bank', 'medium', NULL),
    (lesson_id, 'Berapa lama ke sana?', 'How long to get there?', 'be-RA-pa LA-ma ke SA-na', 'Berapa lama dari sini ke bandara?', 'How long from here to the airport?', '"Berapa lama" = how long. "Dari sini" = from here, "ke sana" = to there.', 3, 'fill_blank', 'hard', ARRAY['question-words', 'time-markers']),
    (lesson_id, 'Jam berapa sampai?', 'What time do we arrive?', 'jam be-RA-pa SAM-pai', 'Jam berapa sampai di Surabaya?', 'What time do we arrive in Surabaya?', '"Jam berapa" = what time. "Sampai" = arrive.', 4, 'word_bank', 'hard', ARRAY['question-words', 'time-markers']),
    (lesson_id, 'Tolong berhenti di sini', 'Please stop here', 'TO-long ber-HEN-ti di SI-ni', 'Pak, tolong berhenti di sini.', 'Sir, please stop here.', '"Berhenti" = stop. Essential for taxis and ojek rides.', 5, 'fill_blank', 'medium', NULL);

  -- Lesson 4: Review — Emergency & Home (Units 7, 8)
  INSERT INTO lessons (category_id, title, description, order_index, lesson_number, difficulty, xp_reward, estimated_minutes)
  VALUES (cat_id, 'Review: Emergency & Home', 'Revisit key phrases from Units 7 and 8', 4, 4, 3, 30, 5)
  RETURNING id INTO lesson_id;

  INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index, exercise_type, difficulty_tier, grammar_tags)
  VALUES
    (lesson_id, 'Saya perlu dokter', 'I need a doctor', 'SA-ya PER-lu DOK-ter', 'Saya perlu dokter sekarang.', 'I need a doctor now.', '"Perlu" = need. Stronger than "mau" (want).', 1, 'fill_blank', 'medium', NULL),
    (lesson_id, 'Di mana rumah sakit terdekat?', 'Where is the nearest hospital?', 'di MA-na RU-mah SA-kit ter-DE-kat', 'Permisi, di mana rumah sakit terdekat?', 'Excuse me, where is the nearest hospital?', '"Terdekat" = nearest. "Ter-" prefix = most/superlative.', 2, 'word_bank', 'hard', ARRAY['question-words']),
    (lesson_id, 'Tolong panggil polisi', 'Please call the police', 'TO-long PANG-gil po-LI-si', 'Tolong panggil polisi, ada pencuri!', 'Please call the police, there is a thief!', '"Panggil" = to call (someone). For phone calls, use "telepon."', 3, 'fill_blank', 'hard', NULL),
    (lesson_id, 'AC rusak, bisa diperbaiki?', 'The AC is broken, can it be fixed?', 'a-SE RU-sak BI-sa di-per-BA-i-ki', 'Pak, AC rusak. Bisa diperbaiki hari ini?', 'Sir, the AC is broken. Can it be fixed today?', '"Bisa diperbaiki?" = can it be fixed? "Di-" prefix marks passive.', 4, 'word_bank', 'hard', NULL),
    (lesson_id, 'Saya mau bayar sewa bulan ini', 'I want to pay this month''s rent', 'SA-ya MAU BA-yar SE-wa BU-lan I-ni', 'Bu, saya mau bayar sewa bulan ini.', 'Ma''am, I want to pay this month''s rent.', 'Combines payment vocab with time expression.', 5, 'fill_blank', 'hard', ARRAY['time-markers']);
END $$;
