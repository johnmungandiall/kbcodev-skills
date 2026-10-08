# Overview: kbcodedev-skills

kbcodedev-skills is a comprehensive, production-grade library of 132 advanced yet simplified AI developer skills, agentic orchestration engines, and engineering playbooks designed for kbcode, Claude Code, and autonomous coding agents.

## Repository Structure
- `categories/` — 21 structured domain categories containing 132 standalone `.md` skill files.
- `SKILLS_MANIFEST.json` — Machine-readable registry mapping categories, skill IDs, paths, runtimes, difficulty tiers, and searchable tags.
- `INDEX.md` — Fast lookup index mapping user prompts to skills.
- `README.md` — Full master catalog, "When to Use" guide, and CLI tooling docs.
- `AGENT.md` — Root agent steering guide.
- `bin/skill-runner.mjs` — Interactive CLI runner, search engine, and canonical schema validator.
- `tools/export-prompt.mjs` — Automated prompt exporter for Claude XML, Cursor rules, JSON, and Markdown.

See [[architecture]] for the design standards, [[categories]] for the full category index, [[skills-gap-analysis]] for the inventory audit and missing skills roadmap, and [[cheatsheet]] for CLI commands.
