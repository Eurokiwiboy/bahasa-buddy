# UI/UX Polish: Splash Cards, Sidebar Dropdown, Logo, Avatar Upload, Achievements

**Date:** 2026-03-16
**Status:** Approved

## Overview

Five targeted UI/UX improvements to Bahasa Buddy, addressing empty content, missing interactivity, and visual polish across the Learn page, desktop sidebar, profile page, and branding.

---

## 1. Splash Cards — Populate & Align with Curriculum

### Problem
Units 8 (Home & Accommodation), 9 (Weather & Nature), and 10 (A1 Review & Milestone) have zero splash cards despite having 4 lessons each. Their `order_index` is 0, causing them to sort incorrectly.

### Solution
- Seed 15 splash cards each for units 8, 9, and 10 following the established pattern (Indonesian word, English translation, example sentence, difficulty level).
- Fix `order_index` on categories for units 8, 9, 10 to match their `unit_number` (8, 9, 10).
- On the Learn page, order splash card categories by `unit_number` instead of `order_index` so they follow the curriculum path: Greetings → Numbers → Food → Travel → Shopping → Time & Days → Emergency → Home & Accommodation → Weather & Nature → A1 Review & Milestone.

### Files
- New migration: `supabase/migrations/TIMESTAMP_seed_units_8_9_10_cards.sql`
- `src/hooks/useCards.ts` — update fetch ordering to use `unit_number` via the categories join
- `src/pages/LearnPage.tsx` — ensure splash card grid respects curriculum order

---

## 2. Desktop Sidebar Profile Dropdown

### Problem
The user card at the bottom of the desktop sidebar is a static `<div>` — not clickable, no navigation to profile, no quick actions.

### Solution
- Replace the static user card with a Radix Popover trigger (via shadcn `Popover`).
- Popover opens upward (side="top") with these items:
  - **View Profile** — navigates to `/profile`
  - **Dark Mode** — inline `Switch` toggle
  - **Sound** — inline `Switch` toggle
  - Divider
  - **Log Out** — destructive style button
- Click outside or Escape closes the popover.
- Add hover/active state to the trigger card for affordance.

### Files
- `src/components/DesktopSidebar.tsx` — add Popover, import Switch, useTheme, signOut
- No new components needed; inline within the sidebar

### Dependencies
- `@radix-ui/react-popover` (already installed via shadcn)

---

## 3. Logo Area — Use App Logo + Elegant Text

### Problem
The sidebar logo area uses a plain "B" square with basic bold text. Doesn't reflect the app's visual identity.

### Solution
- Replace the "B" square with `<img src="/logo.png" />` at 40x40px, rounded-xl.
- Style "Bahasa Buddy" with lighter weight; accent color on "Buddy" (text-primary).
- Subtitle "Learn Indonesian" with italic style and slight letter-spacing (tracking-wide).
- Apply the same logo swap in `src/components/onboarding/WelcomeStep.tsx` where the "B" box is also rendered.

### Files
- `src/components/DesktopSidebar.tsx` — logo section
- `src/components/onboarding/WelcomeStep.tsx` — onboarding logo

---

## 4. Profile Avatar Upload

### Problem
The `avatar_url` column exists on profiles but there's no upload UI. Users see a colored initial-letter square everywhere.

### Solution
- Create an `avatars` public Storage bucket in Supabase (2MB limit, image MIME types only).
- On the Profile page, make the initial-letter square clickable with a camera/edit overlay icon on hover.
- On file select: client-side resize to max 400x400, upload to `avatars/{user_id}.webp`, get public URL, update `profile.avatar_url`.
- Create a shared `<UserAvatar />` component that checks `avatar_url` first, falls back to initial letter. Use it in:
  - Profile page header
  - DesktopSidebar user card
  - Sidebar dropdown trigger
- RLS policy: users can upload/update/delete only their own files (`auth.uid()::text = (storage.foldername(name))[1]`).

### Files
- New migration: `supabase/migrations/TIMESTAMP_create_avatars_bucket.sql`
- New component: `src/components/UserAvatar.tsx`
- `src/pages/ProfilePage.tsx` — avatar upload click handler, file input
- `src/components/DesktopSidebar.tsx` — use `<UserAvatar />`

### Dependencies
- Supabase Storage JS client (already included in `@supabase/supabase-js`)
- No new npm packages; browser Canvas API for resize

---

## 5. Achievements — Expandable Cards

### Problem
Achievement badges show only emojis with no visible name or description. The `title` attribute tooltip is invisible on mobile.

### Solution
- Replace the current 4-column emoji grid with a grid showing emoji + achievement name (3 columns mobile, 4 columns desktop).
- Tapping a badge expands an inline detail panel below showing:
  - Achievement description (e.g. "Maintain a 30-day streak")
  - Progress indicator if trackable (e.g. "7/30 days")
  - Earned date if unlocked
- Locked achievements stay dimmed with reduced opacity.
- Earned achievements get a primary-colored ring.
- `AnimatePresence` + `motion.div` for expand/collapse transition.

### Files
- `src/pages/ProfilePage.tsx` — achievements section rewrite
- No new components; inline within ProfilePage (section is self-contained)

### Data
All 12 achievements already have `name`, `description`, and `icon` in the database. No schema changes needed.

---

## Non-Goals
- No new npm dependencies
- No changes to authentication flow
- No mobile bottom nav changes (Profile link already works on mobile)
- No dark mode redesign (just toggle access in dropdown)
