-- Fix order_index for units 8-10
UPDATE categories SET order_index = 8 WHERE id = '062d3460-ee60-480d-b8db-67632611188a';
UPDATE categories SET order_index = 9 WHERE id = '31aa797b-fd40-4f5c-9139-7f20230b6c52';
UPDATE categories SET order_index = 10 WHERE id = '1dbe52a6-0ffd-4706-bb13-af1974aec6f6';

-- Home & Accommodation cards (unit 8)
INSERT INTO splash_cards (category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
SELECT * FROM (VALUES
  ('062d3460-ee60-480d-b8db-67632611188a'::uuid, 'Rumah', 'House', 'RU-mah', 'Rumah saya di Jakarta.', 'My house is in Jakarta.', NULL, 1, 1),
  ('062d3460-ee60-480d-b8db-67632611188a'::uuid, 'Apartemen', 'Apartment', 'a-par-TE-men', 'Saya tinggal di apartemen.', 'I live in an apartment.', 'Apartments are common in big cities like Jakarta and Surabaya.', 1, 2),
  ('062d3460-ee60-480d-b8db-67632611188a'::uuid, 'Kamar', 'Room', 'KA-mar', 'Kamar ini bersih.', 'This room is clean.', NULL, 1, 3),
  ('062d3460-ee60-480d-b8db-67632611188a'::uuid, 'Kamar tidur', 'Bedroom', 'KA-mar TI-dur', 'Kamar tidur saya kecil.', 'My bedroom is small.', NULL, 1, 4),
  ('062d3460-ee60-480d-b8db-67632611188a'::uuid, 'Kamar mandi', 'Bathroom', 'KA-mar MAN-di', 'Di mana kamar mandi?', 'Where is the bathroom?', 'Many Indonesian bathrooms use a water dipper (gayung) instead of toilet paper.', 1, 5),
  ('062d3460-ee60-480d-b8db-67632611188a'::uuid, 'Dapur', 'Kitchen', 'DA-pur', 'Ibu memasak di dapur.', 'Mom is cooking in the kitchen.', NULL, 1, 6),
  ('062d3460-ee60-480d-b8db-67632611188a'::uuid, 'Kunci', 'Key', 'KUN-ci', 'Saya lupa kunci rumah.', 'I forgot my house key.', NULL, 1, 7),
  ('062d3460-ee60-480d-b8db-67632611188a'::uuid, 'Pintu', 'Door', 'PIN-tu', 'Tolong buka pintu.', 'Please open the door.', NULL, 1, 8),
  ('062d3460-ee60-480d-b8db-67632611188a'::uuid, 'Jendela', 'Window', 'jen-DE-la', 'Buka jendela, panas sekali.', 'Open the window, it is very hot.', NULL, 1, 9),
  ('062d3460-ee60-480d-b8db-67632611188a'::uuid, 'Lantai', 'Floor', 'LAN-tai', 'Lantai ini licin.', 'This floor is slippery.', NULL, 1, 10),
  ('062d3460-ee60-480d-b8db-67632611188a'::uuid, 'Atap', 'Roof', 'A-tap', 'Atap rumah bocor.', 'The roof is leaking.', NULL, 2, 11),
  ('062d3460-ee60-480d-b8db-67632611188a'::uuid, 'Taman', 'Garden', 'TA-man', 'Ada taman di belakang rumah.', 'There is a garden behind the house.', NULL, 1, 12),
  ('062d3460-ee60-480d-b8db-67632611188a'::uuid, 'Tetangga', 'Neighbor', 'te-TANG-ga', 'Tetangga saya sangat baik.', 'My neighbor is very kind.', 'Neighbors often share food and help each other in Indonesian communities.', 2, 13),
  ('062d3460-ee60-480d-b8db-67632611188a'::uuid, 'Sewa', 'Rent', 'SE-wa', 'Berapa sewa per bulan?', 'How much is the rent per month?', 'Renting is called "kos" for single rooms, common among students and workers.', 2, 14),
  ('062d3460-ee60-480d-b8db-67632611188a'::uuid, 'Pindah', 'To move (house)', 'PIN-dah', 'Kami akan pindah bulan depan.', 'We will move next month.', NULL, 2, 15)
) AS v(category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
WHERE NOT EXISTS (SELECT 1 FROM splash_cards WHERE category_id = '062d3460-ee60-480d-b8db-67632611188a' LIMIT 1);

-- Weather & Nature cards (unit 9)
INSERT INTO splash_cards (category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
SELECT * FROM (VALUES
  ('31aa797b-fd40-4f5c-9139-7f20230b6c52'::uuid, 'Cuaca', 'Weather', 'CU-a-ca', 'Bagaimana cuaca hari ini?', 'How is the weather today?', 'Indonesia has a tropical climate with two seasons: dry (kemarau) and wet (hujan).', 1, 1),
  ('31aa797b-fd40-4f5c-9139-7f20230b6c52'::uuid, 'Hujan', 'Rain', 'HU-jan', 'Hari ini hujan deras.', 'It is raining heavily today.', 'The rainy season typically runs from October to April.', 1, 2),
  ('31aa797b-fd40-4f5c-9139-7f20230b6c52'::uuid, 'Panas', 'Hot', 'PA-nas', 'Hari ini sangat panas.', 'Today is very hot.', NULL, 1, 3),
  ('31aa797b-fd40-4f5c-9139-7f20230b6c52'::uuid, 'Dingin', 'Cold', 'DI-ngin', 'Malam ini dingin sekali.', 'Tonight is very cold.', 'Mountain areas like Dieng and Bromo can get surprisingly cold.', 1, 4),
  ('31aa797b-fd40-4f5c-9139-7f20230b6c52'::uuid, 'Angin', 'Wind', 'A-ngin', 'Anginnya kencang hari ini.', 'The wind is strong today.', NULL, 1, 5),
  ('31aa797b-fd40-4f5c-9139-7f20230b6c52'::uuid, 'Matahari', 'Sun', 'ma-ta-HA-ri', 'Matahari terbit dari timur.', 'The sun rises from the east.', 'Literally "eye of the day" — mata (eye) + hari (day).', 1, 6),
  ('31aa797b-fd40-4f5c-9139-7f20230b6c52'::uuid, 'Awan', 'Cloud', 'A-wan', 'Langit penuh awan.', 'The sky is full of clouds.', NULL, 1, 7),
  ('31aa797b-fd40-4f5c-9139-7f20230b6c52'::uuid, 'Banjir', 'Flood', 'BAN-jir', 'Jalanan banjir karena hujan.', 'The roads are flooded because of rain.', 'Flooding is common during the wet season, especially in Jakarta.', 2, 8),
  ('31aa797b-fd40-4f5c-9139-7f20230b6c52'::uuid, 'Pohon', 'Tree', 'PO-hon', 'Pohon itu sangat tinggi.', 'That tree is very tall.', NULL, 1, 9),
  ('31aa797b-fd40-4f5c-9139-7f20230b6c52'::uuid, 'Bunga', 'Flower', 'BU-nga', 'Bunga melati harum sekali.', 'Jasmine flowers smell very fragrant.', 'Melati (jasmine) is the national flower of Indonesia.', 1, 10),
  ('31aa797b-fd40-4f5c-9139-7f20230b6c52'::uuid, 'Laut', 'Sea/Ocean', 'LA-ut', 'Indonesia dikelilingi laut.', 'Indonesia is surrounded by the sea.', 'Indonesia is the world''s largest archipelago with over 17,000 islands.', 1, 11),
  ('31aa797b-fd40-4f5c-9139-7f20230b6c52'::uuid, 'Sungai', 'River', 'SU-ngai', 'Sungai ini sangat panjang.', 'This river is very long.', NULL, 1, 12),
  ('31aa797b-fd40-4f5c-9139-7f20230b6c52'::uuid, 'Hutan', 'Forest', 'HU-tan', 'Indonesia punya hutan hujan tropis.', 'Indonesia has tropical rainforests.', 'Indonesia has the third-largest area of tropical rainforest in the world.', 2, 13),
  ('31aa797b-fd40-4f5c-9139-7f20230b6c52'::uuid, 'Gempa', 'Earthquake', 'GEM-pa', 'Tadi malam ada gempa.', 'There was an earthquake last night.', 'Indonesia sits on the Ring of Fire and experiences frequent seismic activity.', 2, 14),
  ('31aa797b-fd40-4f5c-9139-7f20230b6c52'::uuid, 'Musim', 'Season', 'MU-sim', 'Sekarang musim hujan.', 'Now is the rainy season.', 'Indonesia has two main seasons: musim kemarau (dry) and musim hujan (wet).', 1, 15)
) AS v(category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
WHERE NOT EXISTS (SELECT 1 FROM splash_cards WHERE category_id = '31aa797b-fd40-4f5c-9139-7f20230b6c52' LIMIT 1);

-- A1 Review & Milestone cards (unit 10) — mixed review vocabulary
INSERT INTO splash_cards (category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
SELECT * FROM (VALUES
  ('1dbe52a6-0ffd-4706-bb13-af1974aec6f6'::uuid, 'Perkenalan', 'Introduction', 'per-ke-NAL-an', 'Mari kita mulai dengan perkenalan.', 'Let us start with introductions.', NULL, 1, 1),
  ('1dbe52a6-0ffd-4706-bb13-af1974aec6f6'::uuid, 'Berbicara', 'To speak/talk', 'ber-BI-ca-ra', 'Saya bisa berbicara bahasa Indonesia.', 'I can speak Indonesian.', NULL, 2, 2),
  ('1dbe52a6-0ffd-4706-bb13-af1974aec6f6'::uuid, 'Mengerti', 'To understand', 'me-NGER-ti', 'Apakah Anda mengerti?', 'Do you understand?', NULL, 1, 3),
  ('1dbe52a6-0ffd-4706-bb13-af1974aec6f6'::uuid, 'Belajar', 'To study/learn', 'be-LA-jar', 'Saya belajar bahasa Indonesia.', 'I am studying Indonesian.', NULL, 1, 4),
  ('1dbe52a6-0ffd-4706-bb13-af1974aec6f6'::uuid, 'Membaca', 'To read', 'mem-BA-ca', 'Saya suka membaca buku.', 'I like to read books.', NULL, 1, 5),
  ('1dbe52a6-0ffd-4706-bb13-af1974aec6f6'::uuid, 'Menulis', 'To write', 'me-NU-lis', 'Tolong tulis nama Anda.', 'Please write your name.', NULL, 1, 6),
  ('1dbe52a6-0ffd-4706-bb13-af1974aec6f6'::uuid, 'Pertanyaan', 'Question', 'per-ta-NYA-an', 'Ada pertanyaan?', 'Any questions?', NULL, 2, 7),
  ('1dbe52a6-0ffd-4706-bb13-af1974aec6f6'::uuid, 'Jawaban', 'Answer', 'ja-WA-ban', 'Apa jawabannya?', 'What is the answer?', NULL, 2, 8),
  ('1dbe52a6-0ffd-4706-bb13-af1974aec6f6'::uuid, 'Benar', 'Correct/True', 'BE-nar', 'Jawaban Anda benar!', 'Your answer is correct!', NULL, 1, 9),
  ('1dbe52a6-0ffd-4706-bb13-af1974aec6f6'::uuid, 'Salah', 'Wrong/Incorrect', 'SA-lah', 'Maaf, itu salah.', 'Sorry, that is wrong.', NULL, 1, 10),
  ('1dbe52a6-0ffd-4706-bb13-af1974aec6f6'::uuid, 'Mudah', 'Easy', 'MU-dah', 'Bahasa Indonesia mudah dipelajari.', 'Indonesian is easy to learn.', 'Indonesian is widely considered one of the easiest Asian languages for English speakers.', 1, 11),
  ('1dbe52a6-0ffd-4706-bb13-af1974aec6f6'::uuid, 'Sulit', 'Difficult', 'SU-lit', 'Soal ini sangat sulit.', 'This problem is very difficult.', NULL, 1, 12),
  ('1dbe52a6-0ffd-4706-bb13-af1974aec6f6'::uuid, 'Selesai', 'Finished/Done', 'se-LE-sai', 'Pelajaran sudah selesai.', 'The lesson is finished.', NULL, 1, 13),
  ('1dbe52a6-0ffd-4706-bb13-af1974aec6f6'::uuid, 'Bagus', 'Good/Great', 'BA-gus', 'Bagus sekali!', 'Very good!', 'A versatile word of praise used in everyday conversation.', 1, 14),
  ('1dbe52a6-0ffd-4706-bb13-af1974aec6f6'::uuid, 'Semangat', 'Spirit/Enthusiasm', 'se-MA-ngat', 'Semangat belajar!', 'Keep up the learning spirit!', 'Often used as encouragement, similar to "you can do it!" or "keep going!"', 1, 15)
) AS v(category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
WHERE NOT EXISTS (SELECT 1 FROM splash_cards WHERE category_id = '1dbe52a6-0ffd-4706-bb13-af1974aec6f6' LIMIT 1);
