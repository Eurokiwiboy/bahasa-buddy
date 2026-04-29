---
name: prp-lite
description: Use when the user asks for a PRP, implementation plan, spec-driven workflow, GSD-style planning, requirements extraction, task breakdown, or a careful plan before coding.
---

# PRP Lite

Use a compact Product Requirements Prompt when the task is medium or risky. Keep it useful, not ceremonial.

## Template

```markdown
# PRP: <name>

## Outcome
What should be true when this is done.

## Context
Relevant files, schema, existing behavior, and constraints.

## Requirements
- User-visible requirement
- Data/security requirement
- Verification requirement

## Plan
1. Smallest safe step
2. Next step
3. Verification

## Risks
- Risk and mitigation

## Done When
- Concrete check
```

## Where To Put PRPs

- For durable plans, create `docs/prps/YYYY-MM-DD-short-name.md`.
- For quick work, keep the PRP in the conversation and implement immediately.

## Rules

- Tie every requirement to an observable behavior or file.
- Include database/RLS requirements whenever Supabase is touched.
- Include a verification command or manual check.
- Do not create a PRP when the task is clearly tiny.

