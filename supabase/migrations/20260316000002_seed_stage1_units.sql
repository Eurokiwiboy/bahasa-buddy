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
UPDATE categories c2 SET requires_unit_id = c1.id
FROM categories c1
WHERE c2.unit_number = c1.unit_number + 1
  AND c1.unit_number >= 1 AND c1.unit_number <= 9
  AND c2.unit_number >= 2 AND c2.unit_number <= 10;
