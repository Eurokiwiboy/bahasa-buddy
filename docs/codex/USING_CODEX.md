# Using Codex On Bahasa Buddy

This repo now has a Codex-native setup inspired by GSD, Mempalace, Everything Claude Code, PRPs/context engineering, and Last30Days research, without importing their risky autonomous hooks.

## How To Ask Codex

Use direct task prompts:

```text
Use the Supabase Guardian and Quality Verifier roles to fix XP awards and prove the migration is replay-safe.
```

```text
Create a PRP-lite plan for rebuilding community chat loading, then implement it.
```

```text
Use last-30-days research to compare Indonesian learning app onboarding patterns, then propose changes for Bahasa Buddy.
```

## What Codex Can Use

- `AGENTS.md`: repo-wide rules and the agent team roster.
- `.codex/agents`: safe read-only specialist agent definitions.
- `.codex/skills/bahasa-buddy-build`: implementation workflow.
- `.codex/skills/supabase-rls-audit`: database and RLS review workflow.
- `.codex/skills/prp-lite`: compact PRP planning workflow.
- `.codex/skills/project-memory`: durable session memory workflow.
- `.codex/skills/last30days-research-lite`: current research workflow.
- `.codex/skills/quality-gate`: verification workflow.
- `.codex/skills/agent-team-orchestration`: safe multi-role coordination.

## Claude Code Versus Codex

Claude Code slash commands and subagents are usually installed as `.claude/commands` and `.claude/agents`. Codex works best here with:

- repo instructions in `AGENTS.md`
- local skills in `.codex/skills`
- optional specialist definitions in `.codex/agents`
- explicit user prompts naming the role or skill needed
- subagents only when the user explicitly asks for delegation

That keeps the setup predictable and avoids hidden orchestration.

## Suggested Operating Rhythm

1. Ask for a PRP-lite plan for medium or risky work.
2. Ask Codex to implement the next smallest slice.
3. Ask for the Quality Verifier before moving on.
4. Ask the Memory Scribe to update `docs/codex/STATE.md` after meaningful changes.
