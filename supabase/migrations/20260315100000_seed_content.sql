-- Comprehensive content seed: cards for 5 empty categories, lessons + phrases for all categories
-- Idempotent: checks before inserting

-- ============================================================
-- SPLASH CARDS for empty categories
-- ============================================================

-- Travel cards (category: 633dbffd-78d0-4170-897e-a50e6263071b)
INSERT INTO splash_cards (category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
SELECT * FROM (VALUES
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Bandara', 'Airport', 'ban-DA-ra', 'Saya pergi ke bandara.', 'I am going to the airport.', 'Indonesia has many domestic airports connecting its 17,000+ islands.', 1, 1),
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Hotel', 'Hotel', 'ho-TEL', 'Saya menginap di hotel.', 'I am staying at a hotel.', 'Budget hotels called "losmen" or "penginapan" are common throughout Indonesia.', 1, 2),
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Tiket', 'Ticket', 'TI-ket', 'Saya perlu beli tiket.', 'I need to buy a ticket.', NULL, 1, 3),
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Peta', 'Map', 'PE-ta', 'Apakah ada peta kota?', 'Is there a city map?', NULL, 1, 4),
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Taksi', 'Taxi', 'TAK-si', 'Tolong panggil taksi.', 'Please call a taxi.', 'Ride-hailing apps like Grab and Gojek are widely used in Indonesian cities.', 1, 5),
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Stasiun', 'Station', 'sta-SI-un', 'Di mana stasiun kereta?', 'Where is the train station?', 'Java has an extensive rail network connecting major cities.', 1, 6),
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Pantai', 'Beach', 'PAN-tai', 'Pantai ini sangat indah.', 'This beach is very beautiful.', 'Indonesia has over 54,000 km of coastline with world-class beaches.', 1, 7),
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Gunung', 'Mountain', 'GU-nung', 'Kami mendaki gunung.', 'We are climbing the mountain.', 'Indonesia has 127 active volcanoes, making it part of the Pacific Ring of Fire.', 2, 8),
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Pemandangan', 'Scenery/View', 'pe-man-DANG-an', 'Pemandangan dari sini bagus sekali.', 'The view from here is very nice.', NULL, 2, 9),
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Jalan-jalan', 'To travel/sightsee', 'JA-lan JA-lan', 'Kami mau jalan-jalan ke Bali.', 'We want to travel to Bali.', 'Reduplication (repeating a word) is common in Indonesian and often changes the meaning.', 1, 10),
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Koper', 'Suitcase', 'KO-per', 'Koper saya hilang.', 'My suitcase is lost.', NULL, 1, 11),
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Paspor', 'Passport', 'PAS-por', 'Tolong tunjukkan paspor Anda.', 'Please show your passport.', NULL, 1, 12),
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Kiri', 'Left', 'KI-ri', 'Belok kiri di perempatan.', 'Turn left at the intersection.', NULL, 1, 13),
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Kanan', 'Right', 'KA-nan', 'Belok kanan setelah lampu merah.', 'Turn right after the traffic light.', NULL, 1, 14),
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Lurus', 'Straight', 'LU-rus', 'Jalan lurus saja.', 'Just go straight.', NULL, 1, 15)
) AS v(category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
WHERE NOT EXISTS (SELECT 1 FROM splash_cards WHERE category_id = '633dbffd-78d0-4170-897e-a50e6263071b' LIMIT 1);

-- Shopping cards (category: 6217d598-cc80-43a2-9a66-d4b671691f82)
INSERT INTO splash_cards (category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
SELECT * FROM (VALUES
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Berapa harganya?', 'How much is it?', 'be-RA-pa har-GA-nya', 'Berapa harganya baju ini?', 'How much is this shirt?', 'Bargaining is expected at traditional markets (pasar) but not in malls or supermarkets.', 1, 1),
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Mahal', 'Expensive', 'MA-hal', 'Ini terlalu mahal.', 'This is too expensive.', 'Saying "mahal" is a normal part of bargaining and not considered rude.', 1, 2),
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Murah', 'Cheap/Affordable', 'MU-rah', 'Ada yang lebih murah?', 'Is there a cheaper one?', NULL, 1, 3),
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Pasar', 'Market', 'PA-sar', 'Saya mau ke pasar.', 'I want to go to the market.', 'Traditional markets (pasar tradisional) are vibrant social hubs and often the best place for fresh produce.', 1, 4),
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Toko', 'Shop/Store', 'TO-ko', 'Toko ini buka jam berapa?', 'What time does this shop open?', NULL, 1, 5),
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Beli', 'To buy', 'BE-li', 'Saya mau beli ini.', 'I want to buy this.', NULL, 1, 6),
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Bayar', 'To pay', 'BA-yar', 'Saya mau bayar.', 'I want to pay.', 'Digital payments via GoPay, OVO, and DANA are increasingly common.', 1, 7),
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Diskon', 'Discount', 'DIS-kon', 'Ada diskon tidak?', 'Is there a discount?', NULL, 1, 8),
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Ukuran', 'Size', 'u-KU-ran', 'Ada ukuran yang lebih besar?', 'Is there a bigger size?', NULL, 1, 9),
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Warna', 'Color', 'WAR-na', 'Ada warna lain?', 'Is there another color?', NULL, 1, 10),
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Uang', 'Money', 'U-ang', 'Saya tidak punya uang tunai.', 'I don''t have cash.', 'The Indonesian currency is the Rupiah (IDR).', 1, 11),
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Kembalian', 'Change (money)', 'kem-ba-LI-an', 'Ini kembaliannya.', 'Here is your change.', NULL, 1, 12),
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Tas', 'Bag', 'tas', 'Saya perlu tas plastik.', 'I need a plastic bag.', 'Many stores now charge for plastic bags as part of environmental initiatives.', 1, 13),
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Coba', 'To try', 'CO-ba', 'Boleh saya coba dulu?', 'May I try it first?', NULL, 1, 14),
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Oleh-oleh', 'Souvenirs', 'O-leh O-leh', 'Saya mencari oleh-oleh.', 'I am looking for souvenirs.', 'Bringing back oleh-oleh (souvenirs/gifts, often food) for family and friends after a trip is an important cultural tradition.', 1, 15)
) AS v(category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
WHERE NOT EXISTS (SELECT 1 FROM splash_cards WHERE category_id = '6217d598-cc80-43a2-9a66-d4b671691f82' LIMIT 1);

-- Daily Life cards (category: ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a)
INSERT INTO splash_cards (category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
SELECT * FROM (VALUES
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Rumah', 'House/Home', 'RU-mah', 'Saya pulang ke rumah.', 'I am going home.', NULL, 1, 1),
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Keluarga', 'Family', 'ke-lu-AR-ga', 'Keluarga saya besar.', 'My family is big.', 'Family bonds are very strong in Indonesian culture. Extended families often live together.', 1, 2),
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Makan', 'To eat', 'MA-kan', 'Sudah makan belum?', 'Have you eaten yet?', '"Sudah makan?" is one of the most common greetings in Indonesia, showing care for someone''s wellbeing.', 1, 3),
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Minum', 'To drink', 'MI-num', 'Mau minum apa?', 'What would you like to drink?', NULL, 1, 4),
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Tidur', 'To sleep', 'TI-dur', 'Saya mau tidur.', 'I want to sleep.', NULL, 1, 5),
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Bangun', 'To wake up', 'BA-ngun', 'Saya bangun pagi.', 'I wake up early.', NULL, 1, 6),
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Kerja', 'Work', 'KER-ja', 'Saya pergi kerja.', 'I am going to work.', NULL, 1, 7),
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Sekolah', 'School', 'se-KO-lah', 'Anak-anak pergi ke sekolah.', 'The children go to school.', NULL, 1, 8),
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Teman', 'Friend', 'TE-man', 'Dia teman baik saya.', 'He/She is my good friend.', NULL, 1, 9),
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Hari', 'Day', 'HA-ri', 'Hari ini hari apa?', 'What day is today?', NULL, 1, 10),
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Pagi', 'Morning', 'PA-gi', 'Selamat pagi!', 'Good morning!', 'Pagi typically refers to 6am-10am.', 1, 11),
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Siang', 'Afternoon/Midday', 'SI-ang', 'Makan siang di mana?', 'Where to eat lunch?', 'Siang covers roughly 10am-3pm.', 1, 12),
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Malam', 'Night/Evening', 'MA-lam', 'Selamat malam.', 'Good evening.', NULL, 1, 13),
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Senang', 'Happy/Glad', 'se-NANG', 'Saya senang bertemu Anda.', 'I am glad to meet you.', NULL, 1, 14),
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Capek', 'Tired', 'CA-pek', 'Saya sangat capek hari ini.', 'I am very tired today.', 'Also spelled "capai" in formal Indonesian.', 1, 15)
) AS v(category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
WHERE NOT EXISTS (SELECT 1 FROM splash_cards WHERE category_id = 'ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a' LIMIT 1);

-- Emergency cards (category: f36d40c7-382a-4237-b84c-13a092d1a7a2)
INSERT INTO splash_cards (category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
SELECT * FROM (VALUES
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Tolong!', 'Help!', 'TO-long', 'Tolong saya!', 'Help me!', 'In an emergency, call 112 (general), 118/119 (ambulance), or 110 (police).', 1, 1),
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Polisi', 'Police', 'po-LI-si', 'Tolong panggil polisi.', 'Please call the police.', NULL, 1, 2),
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Rumah sakit', 'Hospital', 'RU-mah SA-kit', 'Di mana rumah sakit terdekat?', 'Where is the nearest hospital?', 'Literally "house of sick" — rumah (house) + sakit (sick).', 1, 3),
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Dokter', 'Doctor', 'DOK-ter', 'Saya perlu dokter.', 'I need a doctor.', NULL, 1, 4),
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Sakit', 'Sick/Pain', 'SA-kit', 'Perut saya sakit.', 'My stomach hurts.', NULL, 1, 5),
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Obat', 'Medicine', 'O-bat', 'Saya perlu obat.', 'I need medicine.', 'Pharmacies (apotek) are widely available and many medications can be bought without prescription.', 1, 6),
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Bahaya', 'Danger', 'ba-HA-ya', 'Hati-hati, bahaya!', 'Be careful, danger!', NULL, 1, 7),
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Kebakaran', 'Fire', 'ke-ba-KAR-an', 'Ada kebakaran!', 'There is a fire!', 'Fire department number: 113.', 1, 8),
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Ambulans', 'Ambulance', 'am-BU-lans', 'Tolong panggil ambulans.', 'Please call an ambulance.', NULL, 1, 9),
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Hilang', 'Lost', 'HI-lang', 'Dompet saya hilang.', 'My wallet is lost.', NULL, 1, 10),
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Alergi', 'Allergy', 'a-LER-gi', 'Saya alergi kacang.', 'I am allergic to nuts.', NULL, 1, 11),
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Darurat', 'Emergency', 'da-RU-rat', 'Ini keadaan darurat.', 'This is an emergency.', NULL, 1, 12),
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Tidak bisa', 'Cannot/Unable', 'TI-dak BI-sa', 'Saya tidak bisa bernafas.', 'I cannot breathe.', NULL, 2, 13),
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Kedutaan', 'Embassy', 'ke-du-TA-an', 'Di mana kedutaan Australia?', 'Where is the Australian embassy?', NULL, 2, 14),
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Pencuri', 'Thief', 'pen-CU-ri', 'Ada pencuri!', 'There is a thief!', NULL, 1, 15)
) AS v(category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
WHERE NOT EXISTS (SELECT 1 FROM splash_cards WHERE category_id = 'f36d40c7-382a-4237-b84c-13a092d1a7a2' LIMIT 1);

-- Formal cards (category: 07b2f598-0e5b-47ea-afc7-d5da111ccccb)
INSERT INTO splash_cards (category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
SELECT * FROM (VALUES
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Permisi', 'Excuse me', 'per-MI-si', 'Permisi, boleh saya bertanya?', 'Excuse me, may I ask a question?', 'Always use "permisi" when passing someone or entering a room — it shows respect.', 1, 1),
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Silakan', 'Please (offering)', 'si-LA-kan', 'Silakan duduk.', 'Please have a seat.', '"Silakan" is used when offering or inviting, while "tolong" is for requesting.', 1, 2),
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Bapak', 'Sir/Mr.', 'BA-pak', 'Selamat pagi, Bapak.', 'Good morning, Sir.', 'Bapak (Pak) is used for older men or those in positions of authority. It literally means "father."', 1, 3),
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Ibu', 'Ma''am/Mrs.', 'I-bu', 'Terima kasih, Ibu.', 'Thank you, Ma''am.', 'Ibu (Bu) is used for older women. It literally means "mother."', 1, 4),
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Mohon maaf', 'I sincerely apologize', 'MO-hon MA-af', 'Mohon maaf atas keterlambatan.', 'I sincerely apologize for the delay.', '"Mohon maaf" is more formal than "maaf" alone.', 2, 5),
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Dengan hormat', 'With respect', 'de-NGAN HOR-mat', 'Dengan hormat, saya ingin menyampaikan...', 'With respect, I would like to convey...', 'This phrase is commonly used to begin formal letters and speeches.', 2, 6),
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Saya ingin', 'I would like', 'SA-ya I-ngin', 'Saya ingin berbicara dengan manajer.', 'I would like to speak with the manager.', '"Ingin" is more formal than "mau" (want).', 1, 7),
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Bisakah', 'Could you/Can you', 'BI-sa-kah', 'Bisakah Anda membantu saya?', 'Could you help me?', 'Adding "-kah" makes questions more polite and formal.', 2, 8),
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Anda', 'You (formal)', 'AN-da', 'Bagaimana kabar Anda?', 'How are you? (formal)', '"Anda" is formal. "Kamu" is informal. Using the wrong one can be seen as disrespectful.', 1, 9),
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Terima kasih banyak', 'Thank you very much', 'te-RI-ma KA-sih BA-nyak', 'Terima kasih banyak atas bantuannya.', 'Thank you very much for your help.', NULL, 1, 10),
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Sama-sama', 'You''re welcome', 'SA-ma SA-ma', 'Sama-sama, Pak.', 'You''re welcome, Sir.', 'Literally means "same-same" — a beautiful expression of mutual respect.', 1, 11),
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Perkenalkan', 'Allow me to introduce', 'per-ke-NAL-kan', 'Perkenalkan, nama saya Adi.', 'Allow me to introduce myself, my name is Adi.', NULL, 1, 12),
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Senang berkenalan', 'Nice to meet you', 'se-NANG ber-ke-NAL-an', 'Senang berkenalan dengan Anda.', 'Nice to meet you (formal).', NULL, 1, 13),
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Maaf mengganggu', 'Sorry to disturb', 'MA-af meng-GANG-gu', 'Maaf mengganggu, Pak.', 'Sorry to disturb you, Sir.', 'A very polite way to interrupt someone or get their attention.', 2, 14),
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Surat', 'Letter/Document', 'SU-rat', 'Saya perlu surat resmi.', 'I need an official letter.', NULL, 2, 15)
) AS v(category_id, indonesian_text, english_translation, pronunciation_guide, example_sentence_id, example_sentence_en, cultural_note, difficulty, order_index)
WHERE NOT EXISTS (SELECT 1 FROM splash_cards WHERE category_id = '07b2f598-0e5b-47ea-afc7-d5da111ccccb' LIMIT 1);

-- ============================================================
-- LESSONS for categories that have none
-- ============================================================

-- Travel lessons
INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, is_premium)
SELECT * FROM (VALUES
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'Getting Around', 'Learn essential transport and direction words', 1, 20, 5, 1, false),
  ('633dbffd-78d0-4170-897e-a50e6263071b'::uuid, 'At the Airport', 'Navigate airports and immigration', 2, 25, 5, 2, false)
) AS v(category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, is_premium)
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE category_id = '633dbffd-78d0-4170-897e-a50e6263071b' LIMIT 1);

-- Shopping lessons
INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, is_premium)
SELECT * FROM (VALUES
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'At the Market', 'Bargain and buy at traditional markets', 1, 20, 5, 1, false),
  ('6217d598-cc80-43a2-9a66-d4b671691f82'::uuid, 'Paying & Prices', 'Handle money and transactions', 1, 20, 5, 2, false)
) AS v(category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, is_premium)
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE category_id = '6217d598-cc80-43a2-9a66-d4b671691f82' LIMIT 1);

-- Daily Life lessons
INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, is_premium)
SELECT * FROM (VALUES
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Morning Routine', 'Daily activities from waking up to heading out', 1, 20, 5, 1, false),
  ('ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a'::uuid, 'Family & Friends', 'Talk about people in your life', 1, 20, 5, 2, false)
) AS v(category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, is_premium)
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE category_id = 'ce6853ac-0f92-4d4d-ad9c-a246fe6c3d6a' LIMIT 1);

-- Emergency lessons
INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, is_premium)
SELECT * FROM (VALUES
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'Getting Help', 'Ask for help in urgent situations', 1, 20, 5, 1, false),
  ('f36d40c7-382a-4237-b84c-13a092d1a7a2'::uuid, 'At the Hospital', 'Describe symptoms and medical needs', 2, 25, 5, 2, false)
) AS v(category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, is_premium)
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE category_id = 'f36d40c7-382a-4237-b84c-13a092d1a7a2' LIMIT 1);

-- Formal lessons
INSERT INTO lessons (category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, is_premium)
SELECT * FROM (VALUES
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Polite Introductions', 'Formal greetings and introductions', 1, 20, 5, 1, false),
  ('07b2f598-0e5b-47ea-afc7-d5da111ccccb'::uuid, 'Formal Requests', 'Make polite requests and apologies', 2, 25, 5, 2, false)
) AS v(category_id, title, description, difficulty, xp_reward, estimated_minutes, order_index, is_premium)
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE category_id = '07b2f598-0e5b-47ea-afc7-d5da111ccccb' LIMIT 1);

-- ============================================================
-- PHRASES for existing empty lessons
-- ============================================================

-- "Introducing Yourself" lesson (6567385e-c708-41c3-b373-fbbb55407c22) - Greetings category
INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index)
SELECT * FROM (VALUES
  ('6567385e-c708-41c3-b373-fbbb55407c22'::uuid, 'Nama saya...', 'My name is...', 'NA-ma SA-ya', 'Nama saya Adi. Siapa nama Anda?', 'My name is Adi. What is your name?', '"Saya" means "I" or "my" depending on context.', 1),
  ('6567385e-c708-41c3-b373-fbbb55407c22'::uuid, 'Saya dari...', 'I am from...', 'SA-ya DA-ri', 'Saya dari Australia. Anda dari mana?', 'I am from Australia. Where are you from?', '"Dari" means "from."', 2),
  ('6567385e-c708-41c3-b373-fbbb55407c22'::uuid, 'Saya tinggal di...', 'I live in...', 'SA-ya TING-gal di', 'Saya tinggal di Jakarta.', 'I live in Jakarta.', '"Tinggal" means "to live/stay."', 3),
  ('6567385e-c708-41c3-b373-fbbb55407c22'::uuid, 'Umur saya...', 'I am ... years old', 'U-mur SA-ya', 'Umur saya dua puluh lima tahun.', 'I am twenty-five years old.', '"Umur" = age, "tahun" = years.', 4),
  ('6567385e-c708-41c3-b373-fbbb55407c22'::uuid, 'Saya bekerja sebagai...', 'I work as a...', 'SA-ya be-KER-ja se-BA-gai', 'Saya bekerja sebagai guru.', 'I work as a teacher.', '"Bekerja" = to work, "sebagai" = as.', 5),
  ('6567385e-c708-41c3-b373-fbbb55407c22'::uuid, 'Senang berkenalan', 'Nice to meet you', 'se-NANG ber-ke-NAL-an', 'Senang berkenalan dengan Anda!', 'Nice to meet you!', NULL, 6)
) AS v(lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index)
WHERE NOT EXISTS (SELECT 1 FROM phrases WHERE lesson_id = '6567385e-c708-41c3-b373-fbbb55407c22' LIMIT 1);

-- "Polite Expressions" lesson (076cd366-feed-4378-bc50-a3eef0c368a1) - Greetings category
INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index)
SELECT * FROM (VALUES
  ('076cd366-feed-4378-bc50-a3eef0c368a1'::uuid, 'Terima kasih', 'Thank you', 'te-RI-ma KA-sih', 'Terima kasih banyak, Bu!', 'Thank you very much, Ma''am!', 'Literally "receive love" — a beautiful expression.', 1),
  ('076cd366-feed-4378-bc50-a3eef0c368a1'::uuid, 'Sama-sama', 'You''re welcome', 'SA-ma SA-ma', 'A: Terima kasih. B: Sama-sama.', 'A: Thank you. B: You''re welcome.', 'Literally "same-same."', 2),
  ('076cd366-feed-4378-bc50-a3eef0c368a1'::uuid, 'Maaf', 'Sorry', 'MA-af', 'Maaf, saya terlambat.', 'Sorry, I am late.', NULL, 3),
  ('076cd366-feed-4378-bc50-a3eef0c368a1'::uuid, 'Permisi', 'Excuse me', 'per-MI-si', 'Permisi, boleh saya lewat?', 'Excuse me, may I pass?', 'Used when passing someone or entering a room.', 4),
  ('076cd366-feed-4378-bc50-a3eef0c368a1'::uuid, 'Tolong', 'Please/Help', 'TO-long', 'Tolong bantu saya.', 'Please help me.', '"Tolong" is used when requesting, unlike "silakan" which is for offering.', 5),
  ('076cd366-feed-4378-bc50-a3eef0c368a1'::uuid, 'Tidak apa-apa', 'It''s okay/No problem', 'TI-dak A-pa A-pa', 'A: Maaf! B: Tidak apa-apa.', 'A: Sorry! B: It''s okay.', 'A very common and reassuring phrase.', 6)
) AS v(lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index)
WHERE NOT EXISTS (SELECT 1 FROM phrases WHERE lesson_id = '076cd366-feed-4378-bc50-a3eef0c368a1' LIMIT 1);

-- "Numbers 1-10" lesson (864fe5e1-cbcc-4334-8cf5-8c4386faccec) - Numbers category
INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index)
SELECT * FROM (VALUES
  ('864fe5e1-cbcc-4334-8cf5-8c4386faccec'::uuid, 'Satu', 'One', 'SA-tu', 'Saya mau satu kopi.', 'I want one coffee.', NULL, 1),
  ('864fe5e1-cbcc-4334-8cf5-8c4386faccec'::uuid, 'Dua', 'Two', 'DU-a', 'Dua orang, silakan.', 'Two people, please.', '"Orang" is the counter word for people.', 2),
  ('864fe5e1-cbcc-4334-8cf5-8c4386faccec'::uuid, 'Tiga', 'Three', 'TI-ga', 'Ada tiga kucing.', 'There are three cats.', NULL, 3),
  ('864fe5e1-cbcc-4334-8cf5-8c4386faccec'::uuid, 'Empat', 'Four', 'EM-pat', 'Kamar nomor empat.', 'Room number four.', NULL, 4),
  ('864fe5e1-cbcc-4334-8cf5-8c4386faccec'::uuid, 'Lima', 'Five', 'LI-ma', 'Lima menit lagi.', 'Five more minutes.', NULL, 5),
  ('864fe5e1-cbcc-4334-8cf5-8c4386faccec'::uuid, 'Enam', 'Six', 'E-nam', 'Jam enam pagi.', 'Six o''clock in the morning.', NULL, 6),
  ('864fe5e1-cbcc-4334-8cf5-8c4386faccec'::uuid, 'Tujuh', 'Seven', 'TU-juh', 'Ada tujuh hari dalam seminggu.', 'There are seven days in a week.', NULL, 7),
  ('864fe5e1-cbcc-4334-8cf5-8c4386faccec'::uuid, 'Delapan', 'Eight', 'de-LA-pan', 'Delapan ribu rupiah.', 'Eight thousand rupiah.', NULL, 8),
  ('864fe5e1-cbcc-4334-8cf5-8c4386faccec'::uuid, 'Sembilan', 'Nine', 'sem-BI-lan', 'Sembilan siswa di kelas.', 'Nine students in the class.', NULL, 9),
  ('864fe5e1-cbcc-4334-8cf5-8c4386faccec'::uuid, 'Sepuluh', 'Ten', 'se-PU-luh', 'Harganya sepuluh ribu.', 'The price is ten thousand.', '"Se-" is a prefix meaning "one" — sepuluh literally means "one ten."', 10)
) AS v(lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index)
WHERE NOT EXISTS (SELECT 1 FROM phrases WHERE lesson_id = '864fe5e1-cbcc-4334-8cf5-8c4386faccec' LIMIT 1);

-- "Numbers 11-100" lesson (e04ee0b9-5d1b-48ad-8e21-7d7e68f6fc2f) - Numbers category
INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index)
SELECT * FROM (VALUES
  ('e04ee0b9-5d1b-48ad-8e21-7d7e68f6fc2f'::uuid, 'Sebelas', 'Eleven', 'se-BE-las', 'Jam sebelas siang.', 'Eleven o''clock midday.', '"Belas" means "teen" — sebelas = se(one) + belas(teen).', 1),
  ('e04ee0b9-5d1b-48ad-8e21-7d7e68f6fc2f'::uuid, 'Dua belas', 'Twelve', 'DU-a BE-las', 'Ada dua belas bulan.', 'There are twelve months.', NULL, 2),
  ('e04ee0b9-5d1b-48ad-8e21-7d7e68f6fc2f'::uuid, 'Dua puluh', 'Twenty', 'DU-a PU-luh', 'Dua puluh orang datang.', 'Twenty people came.', '"Puluh" means "tens" — dua puluh = two tens.', 3),
  ('e04ee0b9-5d1b-48ad-8e21-7d7e68f6fc2f'::uuid, 'Lima puluh', 'Fifty', 'LI-ma PU-luh', 'Lima puluh persen.', 'Fifty percent.', NULL, 4),
  ('e04ee0b9-5d1b-48ad-8e21-7d7e68f6fc2f'::uuid, 'Seratus', 'One hundred', 'se-RA-tus', 'Seratus ribu rupiah.', 'One hundred thousand rupiah.', '"Ratus" = hundreds. "Se-" prefix again meaning "one."', 5),
  ('e04ee0b9-5d1b-48ad-8e21-7d7e68f6fc2f'::uuid, 'Seribu', 'One thousand', 'se-RI-bu', 'Seribu rupiah.', 'One thousand rupiah.', '"Ribu" = thousands. Common in prices.', 6)
) AS v(lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index)
WHERE NOT EXISTS (SELECT 1 FROM phrases WHERE lesson_id = 'e04ee0b9-5d1b-48ad-8e21-7d7e68f6fc2f' LIMIT 1);

-- "At the Warung" lesson (e63ed8d1-b197-4560-b58c-4ecac293ea30) - Food category
INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index)
SELECT * FROM (VALUES
  ('e63ed8d1-b197-4560-b58c-4ecac293ea30'::uuid, 'Saya mau pesan', 'I would like to order', 'SA-ya MAU PE-san', 'Saya mau pesan nasi goreng.', 'I would like to order fried rice.', '"Pesan" = to order.', 1),
  ('e63ed8d1-b197-4560-b58c-4ecac293ea30'::uuid, 'Nasi goreng', 'Fried rice', 'NA-si GO-reng', 'Nasi goreng pedas, ya!', 'Spicy fried rice, please!', 'Indonesia''s national dish. Every warung has its own version.', 2),
  ('e63ed8d1-b197-4560-b58c-4ecac293ea30'::uuid, 'Mie ayam', 'Chicken noodles', 'MI A-yam', 'Satu mie ayam, Pak.', 'One chicken noodles, Sir.', NULL, 3),
  ('e63ed8d1-b197-4560-b58c-4ecac293ea30'::uuid, 'Pedas', 'Spicy', 'PE-das', 'Tidak pedas, ya.', 'Not spicy, please.', 'Indonesian food is often very spicy. Say "tidak pedas" if you prefer mild.', 4),
  ('e63ed8d1-b197-4560-b58c-4ecac293ea30'::uuid, 'Enak', 'Delicious', 'E-nak', 'Makanannya enak sekali!', 'The food is very delicious!', '"Sekali" intensifies — enak sekali = very delicious.', 5),
  ('e63ed8d1-b197-4560-b58c-4ecac293ea30'::uuid, 'Minta air putih', 'I''d like water please', 'MIN-ta A-ir PU-tih', 'Minta air putih satu.', 'One water, please.', '"Air putih" literally means "white water" = plain water.', 6),
  ('e63ed8d1-b197-4560-b58c-4ecac293ea30'::uuid, 'Berapa semuanya?', 'How much is everything?', 'be-RA-pa se-MU-a-nya', 'Berapa semuanya, Pak?', 'How much is everything, Sir?', 'Ask this when ready to pay at a warung.', 7)
) AS v(lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index)
WHERE NOT EXISTS (SELECT 1 FROM phrases WHERE lesson_id = 'e63ed8d1-b197-4560-b58c-4ecac293ea30' LIMIT 1);

-- "Indonesian Flavours" lesson (40a7189d-36a4-4940-94e0-adfd01e0284e) - Food category
INSERT INTO phrases (lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index)
SELECT * FROM (VALUES
  ('40a7189d-36a4-4940-94e0-adfd01e0284e'::uuid, 'Manis', 'Sweet', 'MA-nis', 'Teh manis, tolong.', 'Sweet tea, please.', 'Teh manis (sweet tea) is one of Indonesia''s most popular drinks.', 1),
  ('40a7189d-36a4-4940-94e0-adfd01e0284e'::uuid, 'Asin', 'Salty', 'A-sin', 'Ini terlalu asin.', 'This is too salty.', NULL, 2),
  ('40a7189d-36a4-4940-94e0-adfd01e0284e'::uuid, 'Asam', 'Sour', 'A-sam', 'Saya suka rasa asam.', 'I like sour taste.', NULL, 3),
  ('40a7189d-36a4-4940-94e0-adfd01e0284e'::uuid, 'Pahit', 'Bitter', 'PA-hit', 'Kopi pahit, tanpa gula.', 'Bitter coffee, without sugar.', 'Many Indonesians drink "kopi pahit" — black coffee without sugar.', 4),
  ('40a7189d-36a4-4940-94e0-adfd01e0284e'::uuid, 'Sambal', 'Chili sauce', 'SAM-bal', 'Tambah sambal, dong!', 'Add more sambal, please!', 'Sambal is essential to Indonesian cuisine. There are hundreds of varieties.', 5),
  ('40a7189d-36a4-4940-94e0-adfd01e0284e'::uuid, 'Sayur', 'Vegetables', 'SA-yur', 'Saya mau pesan sayur.', 'I want to order vegetables.', NULL, 6)
) AS v(lesson_id, indonesian_text, english_translation, pronunciation_guide, example_dialogue_id, example_dialogue_en, grammar_note, order_index)
WHERE NOT EXISTS (SELECT 1 FROM phrases WHERE lesson_id = '40a7189d-36a4-4940-94e0-adfd01e0284e' LIMIT 1);
