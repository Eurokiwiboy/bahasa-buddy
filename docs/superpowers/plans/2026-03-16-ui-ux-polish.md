# UI/UX Polish Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Five independent UI/UX improvements — splash card data, sidebar dropdown, logo, avatar upload, and expandable achievements.

**Architecture:** Each task is fully independent and can be implemented in any order. Tasks 1 (splash cards) and 4 (avatar storage) involve Supabase migrations applied via the MCP tool. Tasks 2, 3, 5 are frontend-only changes. Task 4 spans both backend (storage bucket) and frontend (upload UI + shared component).

**Tech Stack:** React 18, TypeScript, Vite, Supabase (DB + Storage), Tailwind CSS, Framer Motion, shadcn/ui (DropdownMenu, Switch, Progress), Radix primitives.

**Spec:** `docs/superpowers/specs/2026-03-16-ui-ux-polish-design.md`

---

## Chunk 1: Splash Cards + Logo + Sidebar Dropdown

### Task 1: Seed Splash Cards for Units 8–10 and Fix Ordering

**Files:**
- Create: `supabase/migrations/20260316200000_seed_units_8_9_10_cards.sql`
- Modify: `src/hooks/useCards.ts:53`

- [ ] **Step 1: Create the seed migration**

Write a SQL migration that:
1. Fixes `order_index` for units 8, 9, 10 to match their `unit_number`.
2. Seeds 15 splash cards each for the three empty categories.

Use the exact pattern from `20260315100000_seed_content.sql` — same columns, same idempotent guard (`WHERE NOT EXISTS`), same category UUIDs from the database:
- Unit 8 (Home & Accommodation): `062d3460-ee60-480d-b8db-67632611188a`
- Unit 9 (Weather & Nature): `31aa797b-fd40-4f5c-9139-7f20230b6c52`
- Unit 10 (A1 Review & Milestone): `1dbe52a6-0ffd-4706-bb13-af1974aec6f6`

```sql
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
```

- [ ] **Step 2: Apply migration to live database**

Use the Supabase MCP `execute_sql` tool with `project_id: zxmwfvyqrtqtsrfhdvhv` to run the migration SQL. Then verify:
```sql
SELECT c.name, c.unit_number, c.order_index, COUNT(sc.id) as card_count
FROM categories c
LEFT JOIN splash_cards sc ON sc.category_id = c.id
WHERE c.unit_number IN (8, 9, 10)
GROUP BY c.id, c.name, c.unit_number, c.order_index
ORDER BY c.unit_number;
```
Expected: each unit shows `card_count = 15` and `order_index` matches `unit_number`.

- [ ] **Step 3: Fix category ordering in useCards hook**

In `src/hooks/useCards.ts` line 53, change:
```typescript
.order('order_index');
```
to:
```typescript
.order('unit_number', { nullsFirst: false });
```

This ensures any categories with `null` unit_number (like "Formal" unit 23) sort to the end rather than unpredictably.

- [ ] **Step 4: Save migration file and commit**

Save the migration SQL to `supabase/migrations/20260316200000_seed_units_8_9_10_cards.sql`.

```bash
git add supabase/migrations/20260316200000_seed_units_8_9_10_cards.sql src/hooks/useCards.ts
git commit -m "feat: seed splash cards for units 8-10 and fix category ordering"
```

---

### Task 2: Logo Area — Use App Logo + Elegant Text

**Files:**
- Modify: `src/components/DesktopSidebar.tsx:28-36`

- [ ] **Step 1: Replace logo section**

In `src/components/DesktopSidebar.tsx`, replace lines 28-36 (the logo div):

Old:
```tsx
<div className="flex items-center gap-3 px-6 py-6 border-b border-border">
  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xl">
    B
  </div>
  <div>
    <h1 className="font-bold text-lg text-foreground">Bahasa Buddy</h1>
    <p className="text-xs text-muted-foreground">Learn Indonesian</p>
  </div>
</div>
```

New:
```tsx
<div className="flex items-center gap-3 px-6 py-6 border-b border-border">
  <img
    src="/logo.png"
    alt="Bahasa Buddy"
    className="w-10 h-10 rounded-xl object-cover"
  />
  <div>
    <h1 className="text-lg text-foreground font-light">
      Bahasa <span className="font-semibold text-primary">Buddy</span>
    </h1>
    <p className="text-xs text-muted-foreground italic tracking-wide">Learn Indonesian</p>
  </div>
</div>
```

- [ ] **Step 2: Verify visually and commit**

Start the dev server, check the sidebar logo at desktop width. Confirm:
- Logo image renders at 40×40
- "Buddy" shows primary accent color
- Subtitle is italic with letter-spacing

```bash
git add src/components/DesktopSidebar.tsx
git commit -m "feat: use app logo and elegant text in sidebar"
```

---

### Task 3: Desktop Sidebar Profile Dropdown

**Files:**
- Modify: `src/components/DesktopSidebar.tsx:1-109`

- [ ] **Step 1: Add imports**

**Merge** the following into the existing imports at the top of `src/components/DesktopSidebar.tsx`. Do NOT replace the existing imports — add to them:

```typescript
// Add to existing react-router-dom import (already has Link, useLocation):
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Add Moon and LogOut to the existing lucide-react import (keep Home, BookOpen, Dumbbell, Users, User, Flame):
import { Home, BookOpen, Dumbbell, Users, User, Flame, Moon, LogOut } from 'lucide-react';

// New imports:
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
```

Update existing destructures — add `signOut` to the existing `useAuth()` call:
```typescript
const { user, isAuthenticated, signOut } = useAuth();
```

Add inside the component:
```typescript
const navigate = useNavigate();
const { isDark, toggleTheme } = useTheme();
```

- [ ] **Step 2: Wrap the authenticated user card in DropdownMenu**

Replace the `{/* User Card */}` section (lines 78-106). The key change: wrap the authenticated card in `<DropdownMenu>`:

```tsx
{/* User Card */}
<div className="p-4 border-t border-border">
  {isAuthenticated && !loading ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {displayName[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground">Level {level} • {levelTitle}</p>
          </div>
          <div className="xp-badge text-xs">
            {xp} XP
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56 mb-2">
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="h-4 w-4 mr-2" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="flex items-center justify-between"
        >
          <div className="flex items-center">
            <Moon className="h-4 w-4 mr-2" />
            Dark Mode
          </div>
          <Switch checked={isDark} onCheckedChange={toggleTheme} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : isAuthenticated && loading ? (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-muted" />
      <div className="flex-1">
        <div className="h-4 bg-muted rounded w-20 mb-1" />
        <div className="h-3 bg-muted rounded w-16" />
      </div>
    </div>
  ) : (
    <Link to="/auth" className="block p-3 rounded-xl bg-primary/10 text-center">
      <p className="text-sm font-medium text-primary">Sign In</p>
    </Link>
  )}
</div>
```

- [ ] **Step 3: Verify and commit**

Test: click user card → dropdown opens upward → View Profile navigates → Dark Mode toggles → Log Out signs out. Test keyboard: Tab to trigger, Enter to open, arrow keys to navigate, Escape to close.

```bash
git add src/components/DesktopSidebar.tsx
git commit -m "feat: add profile dropdown menu to desktop sidebar"
```

---

## Chunk 2: Avatar Upload

### Task 4: Profile Avatar Upload

**Files:**
- Create: `supabase/migrations/20260316200001_create_avatars_bucket.sql`
- Create: `src/components/UserAvatar.tsx`
- Modify: `src/pages/ProfilePage.tsx`
- Modify: `src/components/DesktopSidebar.tsx`

- [ ] **Step 1: Create the avatars storage bucket**

Use the Supabase MCP `execute_sql` tool to create the bucket and RLS policies:

```sql
-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- RLS policies for avatars bucket
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

Save to `supabase/migrations/20260316200001_create_avatars_bucket.sql`.

- [ ] **Step 2: Create the UserAvatar component**

Create `src/components/UserAvatar.tsx`:

```tsx
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  displayName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-16 h-16 text-xl',
  lg: 'w-20 h-20 text-3xl',
};

export function UserAvatar({ avatarUrl, displayName, size = 'sm', className }: UserAvatarProps) {
  const initial = displayName?.[0]?.toUpperCase() || '?';

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={displayName}
        className={cn(
          'rounded-full object-cover',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold',
        sizeClasses[size],
        className
      )}
    >
      {initial}
    </div>
  );
}
```

- [ ] **Step 3: Add avatar upload to ProfilePage**

In `src/pages/ProfilePage.tsx`, add the upload logic. Changes needed:

1. Update imports — add `useRef` to the existing `useState` import from react, and add new imports:
```tsx
// Merge into existing react import:
import { useState, useRef } from 'react';

// Add to existing lucide-react import (keep existing icons):
import { Camera, Loader2 } from 'lucide-react';

// New imports:
import { supabase } from '@/integrations/supabase/client';
import { UserAvatar } from '@/components/UserAvatar';
```

Note: `useAuth` is already imported in the existing file. The component will need to destructure `user` from `useAuth()` — see Task 5 Step 4 which adds this.

2. Add upload state and handler inside the component (after existing state):
```tsx
const { user } = useAuth();
const fileInputRef = useRef<HTMLInputElement>(null);
const [uploading, setUploading] = useState(false);
const [previewUrl, setPreviewUrl] = useState<string | null>(null);

const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !user) return;

  // Show optimistic preview
  const localUrl = URL.createObjectURL(file);
  setPreviewUrl(localUrl);
  setUploading(true);

  try {
    // Resize image client-side
    const resized = await resizeImage(file, 400);

    // Upload to Supabase Storage
    const filePath = `${user.id}/avatar.webp`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, resized, { upsert: true, contentType: 'image/webp' });

    if (uploadError) throw uploadError;

    // Get public URL with cache bust
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;
    await updateProfile({ avatar_url: urlWithCacheBust });
  } catch (err) {
    console.error('Avatar upload failed:', err);
    setPreviewUrl(null); // Revert preview on error
  } finally {
    setUploading(false);
    URL.revokeObjectURL(localUrl);
  }
};

// Client-side image resize using Canvas API
async function resizeImage(file: File, maxSize: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl); // Prevent memory leak
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > height) {
        if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
      } else {
        if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
        'image/webp',
        0.85
      );
    };
    img.onerror = reject;
    img.src = objectUrl;
  });
}
```

3. Replace the avatar square in the profile header (the `<div className="w-20 h-20 ...">` block) with:
```tsx
<button
  onClick={() => fileInputRef.current?.click()}
  className="relative group"
  disabled={uploading}
>
  <UserAvatar
    avatarUrl={previewUrl || profile?.avatar_url}
    displayName={displayName}
    size="lg"
    className="rounded-2xl"
  />
  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
    {uploading ? (
      <Loader2 className="h-6 w-6 text-white animate-spin" />
    ) : (
      <Camera className="h-6 w-6 text-white" />
    )}
  </div>
</button>
<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handleAvatarUpload}
  className="hidden"
/>
```

- [ ] **Step 4: Use UserAvatar in DesktopSidebar**

In `src/components/DesktopSidebar.tsx`, import `UserAvatar` and replace the initial-letter div in the dropdown trigger:

```tsx
import { UserAvatar } from '@/components/UserAvatar';
```

Replace:
```tsx
<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
  {displayName[0]?.toUpperCase() || '?'}
</div>
```

With:
```tsx
<UserAvatar avatarUrl={profile?.avatar_url} displayName={displayName} size="sm" />
```

- [ ] **Step 5: Verify and commit**

Test: click avatar on profile page → file picker opens → select image → preview shows immediately → image persists after page refresh → shows in sidebar too.

**Note:** The sidebar avatar updates on next page navigation or refresh because `useProfile` refetches on mount. This is acceptable UX — the optimistic preview on the Profile page provides immediate feedback where it matters.

```bash
git add supabase/migrations/20260316200001_create_avatars_bucket.sql \
  src/components/UserAvatar.tsx \
  src/pages/ProfilePage.tsx \
  src/components/DesktopSidebar.tsx
git commit -m "feat: add avatar upload with optimistic preview and shared UserAvatar component"
```

---

## Chunk 3: Achievements

### Task 5: Expandable Achievement Cards

**Files:**
- Create: `src/components/AchievementCard.tsx`
- Modify: `src/pages/ProfilePage.tsx`

- [ ] **Step 1: Create AchievementCard component**

Create `src/components/AchievementCard.tsx`:

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Achievement } from '@/integrations/supabase/types';

interface AchievementCardProps {
  achievement: Achievement;
  isEarned: boolean;
  earnedAt?: string | null;
  currentProgress: number | null; // null = can't calculate
  isExpanded: boolean;
  onToggle: () => void;
}

export function AchievementCard({
  achievement,
  isEarned,
  earnedAt,
  currentProgress,
  isExpanded,
  onToggle,
}: AchievementCardProps) {
  const progressPercent =
    currentProgress !== null
      ? Math.min(Math.round((currentProgress / achievement.requirement_value) * 100), 100)
      : null;

  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`w-full flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
          isEarned
            ? 'bg-primary/10 ring-2 ring-primary/30'
            : 'bg-muted/50 opacity-60'
        }`}
      >
        <span className="text-2xl">{achievement.icon}</span>
        <span className="text-xs font-medium text-foreground text-center leading-tight">
          {achievement.name}
        </span>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 rounded-xl bg-card border border-border text-sm space-y-2">
              <p className="text-muted-foreground">{achievement.description}</p>

              {progressPercent !== null && !isEarned && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">
                      {currentProgress}/{achievement.requirement_value}
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-1.5" />
                </div>
              )}

              {isEarned && earnedAt && (
                <p className="text-xs text-primary font-medium">
                  Earned {new Date(earnedAt).toLocaleDateString()}
                </p>
              )}

              {!isEarned && progressPercent === null && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>Not yet earned</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Add progress fetching to ProfilePage**

In `src/pages/ProfilePage.tsx`, add progress data fetching and the progress resolver. Add these imports and state:

```tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AchievementCard } from '@/components/AchievementCard';
```

Add state and fetch inside the component:
```tsx
const [expandedAchievement, setExpandedAchievement] = useState<string | null>(null);
const [achievementProgress, setAchievementProgress] = useState<Record<string, number>>({});

// Fetch achievement progress data
useEffect(() => {
  if (!user) return;

  const fetchProgress = async () => {
    const [lessonRes, cardProgressRes] = await Promise.all([
      supabase
        .from('user_lesson_progress')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed'),
      supabase
        .from('user_card_progress')
        .select('times_seen, mastery_level')
        .eq('user_id', user.id),
    ]);

    const lessonsCompleted = lessonRes.count || 0;
    const cardsData = cardProgressRes.data || [];
    const cardsReviewed = cardsData.reduce((sum, c) => sum + (c.times_seen || 0), 0);
    const cardsMastered = cardsData.filter(c => (c.mastery_level || 0) >= 3).length;

    setAchievementProgress({
      lessons_completed: lessonsCompleted,
      cards_reviewed: cardsReviewed,
      cards_mastered: cardsMastered,
      streak_days: profile?.current_streak || 0,
      total_xp: profile?.xp_total || 0,
      // messages_sent and corrections_made omitted — not easily queryable yet
    });
  };

  fetchProgress();
}, [user, profile]);

const getProgress = (requirementType: string): number | null => {
  return achievementProgress[requirementType] ?? null;
};
```

- [ ] **Step 3: Replace the achievements grid**

In `ProfilePage.tsx`, replace the entire `{/* Achievements */}` section (the `motion.div` with the grid of achievement badges) with:

```tsx
{/* Achievements */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="card-elevated p-5"
>
  <div className="flex items-center justify-between mb-4">
    <h2 className="font-semibold text-foreground flex items-center gap-2">
      <Trophy className="h-5 w-5 text-xp" />
      Achievements
    </h2>
    <span className="text-sm text-muted-foreground">
      {earnedAchievements.length}/{achievements.length}
    </span>
  </div>
  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
    {achievements.map((achievement) => {
      const earned = earnedAchievements.find(e => e.achievement_id === achievement.id);
      return (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          isEarned={!!earned}
          earnedAt={earned?.earned_at}
          currentProgress={getProgress(achievement.requirement_type)}
          isExpanded={expandedAchievement === achievement.id}
          onToggle={() =>
            setExpandedAchievement(
              expandedAchievement === achievement.id ? null : achievement.id
            )
          }
        />
      );
    })}
  </div>
</motion.div>
```

- [ ] **Step 4: Add `user` from useAuth to ProfilePage**

The existing `ProfilePage` does not destructure `user` from `useAuth`. Add at the top of the component:

```tsx
const { user, signOut } = useAuth();
```

(The existing `signOut` destructure from `useAuth` stays — just add `user` to it.)

- [ ] **Step 5: Verify and commit**

Test: achievements show emoji + name, tap one to expand → description + progress bar appear → earned ones show earned date → locked ones are dimmed → animation is smooth.

```bash
git add src/components/AchievementCard.tsx src/pages/ProfilePage.tsx
git commit -m "feat: expandable achievement cards with progress tracking"
```

---

## Final Verification

- [ ] **Step 1: Run existing tests**

```bash
npm test
```

All 11 tests should pass.

- [ ] **Step 2: Push to GitHub**

```bash
git push
```

- [ ] **Step 3: Visual walkthrough**

Using the preview server, check each page at mobile (375×812) and desktop (1280×800):
- Learn page: splash cards in correct order, all 10 categories have content
- Desktop sidebar: logo image, elegant text, dropdown works
- Profile page: avatar upload works, achievements expandable
- Dark mode: toggle from dropdown works
