# Cheatsheet: kbcodedev-skills

Fast reference for CLI commands, testing, and agent integration patterns in this repository.

## CLI Runner Commands
- `npm run skill list` — Display all 130 skills across 21 categories.
- `npm run search <query>` — Search skills by keyword, title, or category.
- `npm run skill show <id>` — View complete skill markdown in terminal.
- `npm run validate` — Automated test suite validating all 130 skills against canonical schema.

## Agent Prompt Exporter Tool
- `node tools/export-prompt.mjs <skill-id> claude` — Export into Claude XML `<skill>` block.
- `node tools/export-prompt.mjs <skill-id> cursor` — Export into Cursor `.cursorrules` format.
- `node tools/export-prompt.mjs <skill-id> json` — Export into structured JSON object.

## In kbcode & Claude Code
- Load dynamically via `get_skill("kbcodedev/<id>")`.
- Reference directly from `categories/<category>/<skill>.md`.
