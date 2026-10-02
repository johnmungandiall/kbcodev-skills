#!/usr/bin/env node

/**
 * tools/export-prompt.mjs
 * Formats and exports any skill from kbcodedev-skills for injection into
 * Claude system prompts, Cursor .cursorrules, or kbcode learned skills.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'SKILLS_MANIFEST.json');

const args = process.argv.slice(2);
const skillQuery = args[0];
const targetFormat = (args[1] || 'claude').toLowerCase(); // 'claude' | 'cursor' | 'json' | 'markdown'

if (!skillQuery) {
  console.log(`
Usage:
  node tools/export-prompt.mjs <skill-id-or-keyword> [format]

Formats:
  claude    - Claude XML system prompt tag (<skill name="...">...</skill>) [default]
  cursor    - Cursor .cursorrules / .mdc rule format
  markdown  - Clean markdown prompt block
  json      - Structured JSON object

Examples:
  node tools/export-prompt.mjs autonomous-react-loop claude
  node tools/export-prompt.mjs zero-downtime-ship-pipeline cursor
`);
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
let targetSkill = null;

for (const cat of manifest.categories) {
  for (const s of cat.skills) {
    if (s.id.includes(skillQuery) || s.path.includes(skillQuery)) {
      targetSkill = s;
      break;
    }
  }
  if (targetSkill) break;
}

if (!targetSkill) {
  console.error(`Error: No skill found matching "${skillQuery}".`);
  process.exit(1);
}

const fullPath = path.join(ROOT_DIR, targetSkill.path);
if (!fs.existsSync(fullPath)) {
  console.error(`Error: Skill file missing at ${fullPath}`);
  process.exit(1);
}

const rawContent = fs.readFileSync(fullPath, 'utf-8');

switch (targetFormat) {
  case 'cursor':
    console.log(`---`);
    console.log(`description: ${targetSkill.title}`);
    console.log(`globs: *`);
    console.log(`---`);
    console.log(`\n# Skill Context: ${targetSkill.id}\n`);
    console.log(rawContent);
    break;

  case 'json':
    console.log(JSON.stringify({
      id: targetSkill.id,
      title: targetSkill.title,
      source_path: targetSkill.path,
      prompt_content: rawContent
    }, null, 2));
    break;

  case 'markdown':
    console.log(`<!-- START SKILL: ${targetSkill.id} -->\n`);
    console.log(rawContent);
    console.log(`\n<!-- END SKILL: ${targetSkill.id} -->`);
    break;

  case 'claude':
  default:
    console.log(`<skill name="${targetSkill.id}" title="${targetSkill.title}">\n${rawContent}\n</skill>`);
    break;
}
