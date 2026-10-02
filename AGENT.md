# AGENT.md

Loaded every session. Keep it short — it points the agent at the knowledge
base in `kb/` and the master skills library in `categories/`.

## Repository Overview: `kbcodev-skills`
This repository contains the **kbcodedev-skills** master library (130 production-grade rewritten skills across 21 structured domains).

## How to navigate and use skills here
1. Consult `INDEX.md` or `SKILLS_MANIFEST.json` to find the exact skill matching any developer prompt.
2. Read the specific skill under `categories/<category-id>/<skill-file>.md`.
3. Follow the skill's **Execution Workflow**, **Input/Output Contracts**, and **Anti-Patterns**.
4. When editing skills or adding new skills, follow the template in `categories/07-ai-mcp-prompt-engineering/skill-authoring-framework.md` and update `SKILLS_MANIFEST.json` + `INDEX.md` + `README.md` + `kb/` in the same turn.

## Knowledge Base Map
- `kb/overview.md` — What kbcodedev-skills is and how it is structured (130 skills, 21 categories).
- `kb/architecture.md` — 21-category taxonomy and design standards.
- `kb/categories.md` — Detailed category index and skill mapping.
- `kb/cheatsheet.md` — Fast lookup commands and skill integration patterns.
