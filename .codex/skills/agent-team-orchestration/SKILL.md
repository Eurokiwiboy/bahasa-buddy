---
name: agent-team-orchestration
description: Use when the user asks to use agents, create a team, delegate work, parallelize analysis, coordinate specialist reviewers, or translate Claude Code agent workflows into Codex.
---

# Agent Team Orchestration

Codex does not need a large imported autonomous swarm for this repo. Use the `AGENTS.md` team roster as lightweight role guidance.

## Safe Default

Use role-based thinking locally:

- Product Architect
- Supabase Guardian
- TypeScript Frontend Engineer
- Learning Systems Engineer
- Quality Verifier
- Security Reviewer
- Research Scout
- Memory Scribe

## When To Delegate

Only spawn subagents when the user explicitly asks for agents, delegation, or parallel agent work. Keep each delegated task concrete and bounded.

Good delegation examples:

- Supabase Guardian: review only migrations and RLS for `add_xp`.
- TypeScript Frontend Engineer: fix only `useChat` loading behavior and tests.
- Quality Verifier: run and summarize verification while implementation continues.

## Rules

- Do not delegate the immediate blocker if local work depends on the answer.
- Give each worker a disjoint write scope.
- Tell workers they are not alone in the codebase and must not revert others' work.
- Prefer review and verification agents over autonomous rewrite agents.
- Avoid hook-heavy or broad-permission imported agents unless the user explicitly accepts the risk.

