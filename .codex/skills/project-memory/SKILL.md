---
name: project-memory
description: Use when the user asks to remember state, preserve context, summarize progress, resume work, capture decisions, or create a durable memory similar to Mempalace for this repository.
---

# Project Memory

Use `docs/codex/STATE.md` as the durable project memory for Codex sessions.

## When To Update

- After a meaningful implementation.
- After an audit discovers important risks.
- After the user makes a durable decision.
- Before ending a long session with unresolved next steps.

## What To Record

- Current risks.
- Decisions and constraints.
- Next useful work.
- Verification status.
- Pointers to important files.

## Rules

- Keep entries concise and current.
- Remove stale risks once fixed.
- Do not store secrets, tokens, private user data, or credentials.
- Do not duplicate long plans that already live in `docs/prps`.

