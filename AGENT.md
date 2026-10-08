# AGENT.md

Loaded every session. Keep it short — it points the agent at the knowledge
base in `kb/` and the master skills library in `categories/`.

## Repository Overview: `kbcodev-skills`
This repository contains the **kbcodedev-skills** master library (132 production-grade rewritten skills across 21 structured domains).

## Reply contract (applies to every reply this agent writes)
When writing any user-facing reply in this project, follow
`categories/07-ai-mcp-prompt-engineering/clear-replies.md`
(`kbcodedev/clear-replies`): first line = outcome · no preamble/search-narration/recap/
complement reporting · scale length to the request · always keep full length for what the user asked
for and for errors, failing tests, security findings and destructive confirmations · never expose a
reader classification. Measure a reply with `node tools/reply-metrics.mjs <file>` (or the whole
scenario harness with `--batch tools/reply-scenarios.json`).

## How to navigate and use skills here
1. Consult `INDEX.md` or `SKILLS_MANIFEST.json` to find the exact skill matching any developer prompt.
2. Read the specific skill under `categories/<category-id>/<skill-file>.md`.
3. Follow the skill's **Execution Workflow**, **Input/Output Contracts**, and **Anti-Patterns**.
4. When editing skills or adding new skills, follow the template in `categories/07-ai-mcp-prompt-engineering/skill-authoring-framework.md` and update `SKILLS_MANIFEST.json` + `INDEX.md` + `README.md` + `kb/` in the same turn.

## Knowledge Base Map
- `kb/overview.md` — What kbcodedev-skills is and how it is structured (132 skills, 21 categories).
- `kb/architecture.md` — 21-category taxonomy and design standards.
- `kb/categories.md` — Detailed category index and skill mapping.
- `kb/cheatsheet.md` — Fast lookup commands and skill integration patterns.
