# UI/UX Polish: Splash Cards, Sidebar Dropdown, Logo, Avatar Upload, Achievements

**Date:** 2026-03-16
**Status:** Approved

## Overview

Five targeted UI/UX improvements to Bahasa Buddy, addressing empty content, missing interactivity, and visual polish across the Learn page, desktop sidebar, profile page, and branding.

---

## 1. Splash Cards — Populate & Align with Curriculum

### Problem
Units 8 (Home & Accommodation), 9 (Weather & Nature), and 10 (A1 Review & Milestone) have zero **splash cards** (in the `splash_cards` table) despite having 4 lessons each. Their `order_index` is 0, causing them to sort before units 1–7.

Note: These units already have lesson content seeded — the gap is specifically in the `splash_cards` table used for the flashcard review feature.

### Solution
- Seed 15 splash cards each for units 8, 9, and 10 into the `splash_cards` table, following the established pattern (Indonesian word, English translation, example sentence, difficulty level).
- Fix `order_index` on categories for units 8, 9, 10 to match their `unit_number` (8, 9, 10).
- In `useCards.ts`, change `fetchCategories` ordering from `.order('order_index')` to `.order('unit_number')` so splash card categories follow the curriculum path.
- `LearnPage.tsx` renders `cardCategories` in the order returned by the hook — no page-level changes needed once the hook is fixed.

### Files
- New migration: `supabase/migrations/TIMESTAMP_seed_units_8_9_10_cards.sql`
- `src/hooks/useCards.ts` — line 53: change `.order('order_index')` to `.order('unit_number')`

---

## 2. Desktop Sidebar Profile Dropdown

### Problem
The user card at the bottom of the desktop sidebar is a static `<div>` — not clickable, no navigation to profile, no quick actions.

### Solution
- Replace the static user card with a Radix `DropdownMenu` trigger (better than Popover for keyboard accessibility — provides arrow key navigation, Enter to activate, and Escape to close natively).
- Menu opens upward (side="top") with these items:
  - **View Profile** — navigates to `/profile`
  - **Dark Mode** — inline `Switch` toggle
  - Divider
  - **Log Out** — destructive style button
- Sound toggle removed from this dropdown — there is no shared sound context or persistence yet. Sound settings remain on the full Profile page only.
- Add hover/active state to the trigger card for click affordance.
- The DropdownMenu only wraps the authenticated user card, not the "Sign In" link shown when unauthenticated.

### New imports needed
- `import { useTheme } from '@/hooks/useTheme'`
- Destructure `signOut` from existing `useAuth()` call
- `DropdownMenu` components from `@/components/ui/dropdown-menu`

### Files
- `src/components/DesktopSidebar.tsx` — wrap user card in DropdownMenu, add menu items

### Dependencies
- `@radix-ui/react-dropdown-menu` (already installed via shadcn)

---

## 3. Logo Area — Use App Logo + Elegant Text

### Problem
The sidebar logo area uses a plain "B" square with basic bold text. Doesn't reflect the app's visual identity.

### Solution
- Replace the "B" square with `<img src="/logo.png" />` at 40x40px, rounded-xl.
- Style "Bahasa Buddy" with lighter weight; accent color on "Buddy" (`text-primary`).
- Subtitle "Learn Indonesian" with italic style and slight letter-spacing (`tracking-wide`).

### Files
- `src/components/DesktopSidebar.tsx` — logo section only

Note: `WelcomeStep.tsx` already uses `<motion.img src="/logo.png" />` — no changes needed there.

---

## 4. Profile Avatar Upload

### Problem
The `avatar_url` column exists on profiles but there's no upload UI. Users see a colored initial-letter square everywhere.

### Solution
- Create an `avatars` public Storage bucket in Supabase (2MB limit, image MIME types only).
- On the Profile page, make the initial-letter square clickable with a camera/edit overlay icon on hover.
- On file select: client-side resize to max 400×400 using Canvas API, upload to `avatars/{user_id}.webp`, get public URL, update `profile.avatar_url`.
- **Cache busting:** Append `?t={Date.now()}` to the stored URL on each upload so browsers/CDN don't serve stale images.
- **Optimistic UI:** Show a local preview immediately via `URL.createObjectURL()` with a loading spinner overlay during upload.
- **File validation:** Use `accept="image/*"` on the file input. Server-side MIME validation via bucket config provides defense-in-depth. HEIC files from iOS will be handled by the browser's native conversion when drawn to Canvas.
- Create a shared `<UserAvatar />` component that checks `avatar_url` first, falls back to initial letter. Use it in:
  - Profile page header (with upload overlay)
  - DesktopSidebar user card
  - Sidebar dropdown trigger
- RLS policy: users can upload/update/delete only their own files (`auth.uid()::text = (storage.foldername(name))[1]`).

### Files
- New migration: `supabase/migrations/TIMESTAMP_create_avatars_bucket.sql`
- New component: `src/components/UserAvatar.tsx`
- `src/pages/ProfilePage.tsx` — avatar upload click handler, hidden file input
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
- **Progress calculation:** Inline in `ProfilePage.tsx`, compute current progress by mapping each achievement's `requirement_type` to the relevant profile/progress data:
  - `lessons_completed` → count from `user_lesson_progress` where `status = 'completed'`
  - `cards_reviewed` → sum of `times_seen` from `user_card_progress`
  - `cards_mastered` → count from `user_card_progress` where `mastery_level >= 3`
  - `streak_days` → `profile.current_streak`
  - `messages_sent` → count from chat messages (or omit progress bar if not easily queryable)
  - `corrections_made` → count from corrections (or omit progress bar)
  - `xp_total` → `profile.xp_total`
- Locked achievements stay dimmed with reduced opacity.
- Earned achievements get a primary-colored ring.
- `AnimatePresence` + `motion.div` for expand/collapse transition.
- Extract `<AchievementCard />` component for maintainability given the expand/collapse state and progress logic.

### Files
- New component: `src/components/AchievementCard.tsx`
- `src/pages/ProfilePage.tsx` — achievements section rewrite, use `<AchievementCard />`

### Data
All 12 achievements already have `name`, `description`, `icon`, `requirement_type`, and `requirement_value` in the database. No schema changes needed.

---

## Verification Checklist

### Section 1 — Splash Cards
- [ ] All 45 new splash cards appear in the database
- [ ] Categories order on Learn page matches curriculum: Units 1–10 in sequence
- [ ] Empty categories no longer appear at the top of the grid
- [ ] Existing card progress is unaffected

### Section 2 — Sidebar Dropdown
- [ ] Clicking user card opens dropdown upward
- [ ] "View Profile" navigates to `/profile`
- [ ] Dark mode toggle works inline
- [ ] Log Out signs user out and redirects to `/auth`
- [ ] Keyboard navigation (arrow keys, Enter, Escape) works
- [ ] Dropdown does not appear when unauthenticated (Sign In link shown instead)

### Section 3 — Logo
- [ ] App logo image renders at 40×40 in sidebar
- [ ] "Buddy" text shows accent color
- [ ] Subtitle has italic + letter-spacing treatment

### Section 4 — Avatar Upload
- [ ] Clicking avatar on Profile page opens file picker
- [ ] Image uploads and appears immediately (optimistic preview)
- [ ] Avatar shows in sidebar, dropdown, and profile page
- [ ] Re-uploading replaces the old image (cache bust works)
- [ ] Initial-letter fallback shows when no avatar is set

### Section 5 — Achievements
- [ ] Each badge shows emoji + name
- [ ] Tapping expands detail panel with description
- [ ] Progress indicator shows for trackable achievements
- [ ] Earned date displays for unlocked achievements
- [ ] Locked badges are visually dimmed
- [ ] Expand/collapse animates smoothly

---

## Non-Goals
- No additional npm installs required (all dependencies already present)
- No changes to authentication flow
- No mobile bottom nav changes (Profile link already works on mobile)
- No dark mode redesign (just toggle access in dropdown)
- No sound context/persistence (deferred — sound toggle remains on Profile page only)
