# Bahasa Buddy

A Duolingo-inspired app for learning Bahasa Indonesia. Practice vocabulary with spaced-repetition flashcards, take quizzes, chat with the community, and track your progress with XP and achievements.

## Features

- Splash card flashcards with SM-2 spaced repetition
- Practice quizzes (multiple choice, fill-in-the-blank, listening, speed round)
- Community chat rooms with real-time messaging
- XP system, achievements, streaks, and daily goals
- Google and Apple OAuth sign-in

## Tech Stack

React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Supabase, Framer Motion, Tanstack Query

## Getting Started

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your Supabase credentials
3. `npm install`
4. `npm run dev`

The dev server runs at http://localhost:8080.

## Database Setup

1. Install Supabase CLI: `brew install supabase/tap/supabase`
2. Log in: `supabase login`
3. Link your project: `supabase link --project-ref <your-project-ref>`
4. Apply migrations: `supabase db push`

## Testing

```bash
npm test          # Run all tests
npm run test:watch  # Run tests in watch mode
```
