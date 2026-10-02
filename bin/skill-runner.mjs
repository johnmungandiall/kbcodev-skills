#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'SKILLS_MANIFEST.json');

const args = process.argv.slice(2);
const command = args[0] || 'help';

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Error: Manifest not found at ${MANIFEST_PATH}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
}

function listSkills() {
  const manifest = loadManifest();
  console.log(`\n📚 kbcodedev-skills: ${manifest.total_skills} Skills across ${manifest.total_categories} Categories\n`);
  
  for (const cat of manifest.categories) {
    console.log(`📁 [${cat.id}] ${cat.name} (${cat.skills.length} skills)`);
    for (const skill of cat.skills) {
      console.log(`   └─ ${skill.id.padEnd(45)} -> ${skill.title}`);
    }
    console.log('');
  }
}

function searchSkills(query) {
  if (!query) {
    console.error('Error: Please provide a search query. Example: node bin/skill-runner.mjs search docker');
    process.exit(1);
  }
  
  const manifest = loadManifest();
  const q = query.toLowerCase();
  const results = [];

  for (const cat of manifest.categories) {
    for (const skill of cat.skills) {
      const matchId = skill.id.toLowerCase().includes(q);
      const matchTitle = skill.title.toLowerCase().includes(q);
      const matchCat = cat.name.toLowerCase().includes(q) || cat.id.toLowerCase().includes(q);
      const matchTags = skill.tags && skill.tags.some(t => t.toLowerCase().includes(q));

      if (matchId || matchTitle || matchCat || matchTags) {
        results.push({ ...skill, category: cat.name });
      }
    }
  }

  console.log(`\n🔍 Found ${results.length} skills matching "${query}":\n`);
  for (const res of results) {
    console.log(`• ${res.title}`);
    console.log(`  ID:       ${res.id}`);
    console.log(`  Category: ${res.category}`);
    console.log(`  Path:     ${res.path}`);
    if (res.tags) console.log(`  Tags:     ${res.tags.join(', ')}`);
    console.log('');
  }
}

function showSkill(target) {
  if (!target) {
    console.error('Error: Please provide a skill ID or filename. Example: node bin/skill-runner.mjs show autonomous-react-loop');
    process.exit(1);
  }

  const manifest = loadManifest();
  let foundPath = null;

  for (const cat of manifest.categories) {
    for (const skill of cat.skills) {
      if (skill.id === target || skill.id.endsWith(target) || skill.path.includes(target)) {
        foundPath = path.join(ROOT_DIR, skill.path);
        break;
      }
    }
    if (foundPath) break;
  }

  if (!foundPath && fs.existsSync(path.resolve(ROOT_DIR, target))) {
    foundPath = path.resolve(ROOT_DIR, target);
  }

  if (!foundPath || !fs.existsSync(foundPath)) {
    console.error(`Error: Skill "${target}" not found.`);
    process.exit(1);
  }

  const content = fs.readFileSync(foundPath, 'utf-8');
  console.log(`\n======================================================`);
  console.log(`📄 Viewing: ${path.relative(ROOT_DIR, foundPath)}`);
  console.log(`======================================================\n`);
  console.log(content);
}

function validateSkills() {
  const manifest = loadManifest();
  console.log(`\n🧪 Validating all ${manifest.total_skills} skills across ${manifest.total_categories} categories...\n`);

  let passed = 0;
  let failed = 0;
  const errors = [];

  const REQUIRED_SECTIONS = [
    'Intent & Trigger Conditions',
    'Core Mental Model & Invariant Principles',
    'High-Signal Execution Workflow',
    'Input / Output Contracts',
    'Anti-Patterns & Critical Traps',
    'Real-World Production Example'
  ];

  for (const cat of manifest.categories) {
    for (const skill of cat.skills) {
      const fullPath = path.join(ROOT_DIR, skill.path);
      if (!fs.existsSync(fullPath)) {
        errors.push(`[MISSING_FILE] ${skill.path} does not exist`);
        failed++;
        continue;
      }

      const content = fs.readFileSync(fullPath, 'utf-8');
      const missingSections = [];

      for (const section of REQUIRED_SECTIONS) {
        if (!content.includes(section)) {
          missingSections.push(section);
        }
      }

      if (missingSections.length > 0) {
        errors.push(`[SCHEMA_FAIL] ${skill.id}: Missing sections: ${missingSections.join(', ')}`);
        failed++;
      } else {
        passed++;
      }
    }
  }

  if (failed === 0) {
    console.log(`✅ 100% PASS: All ${passed}/${passed} skills successfully validated!`);
    console.log(`   - File existence: Verified`);
    console.log(`   - Canonical structure: Verified`);
    console.log(`   - Contracts & Guardrails: Verified\n`);
  } else {
    console.error(`❌ Validation Failures (${failed} errors):\n`);
    for (const err of errors) console.error(`  • ${err}`);
    process.exit(1);
  }
}

function exportSkill(target, format = 'xml') {
  if (!target) {
    console.error('Error: Please provide a skill ID. Example: node bin/skill-runner.mjs export autonomous-react-loop xml');
    process.exit(1);
  }

  const manifest = loadManifest();
  let foundSkill = null;

  for (const cat of manifest.categories) {
    for (const s of cat.skills) {
      if (s.id === target || s.id.endsWith(target)) {
        foundSkill = s;
        break;
      }
    }
    if (foundSkill) break;
  }

  if (!foundSkill) {
    console.error(`Error: Skill "${target}" not found.`);
    process.exit(1);
  }

  const fullPath = path.join(ROOT_DIR, foundSkill.path);
  const content = fs.readFileSync(fullPath, 'utf-8');

  if (format === 'xml') {
    console.log(`<skill name="${foundSkill.id}" title="${foundSkill.title}">\n${content}\n</skill>`);
  } else if (format === 'json') {
    console.log(JSON.stringify({
      id: foundSkill.id,
      title: foundSkill.title,
      path: foundSkill.path,
      content: content
    }, null, 2));
  } else {
    console.log(content);
  }
}

function showHelp() {
  console.log(`
kbcodedev-skills CLI Runner v2.0.0

Usage:
  node bin/skill-runner.mjs <command> [arguments]

Commands:
  list                 List all categories and skills
  search <query>       Search skills by keyword, title, tag, or category
  show <id>            Display the complete markdown content of a skill
  validate             Validate all 115 skills against the canonical structure
  export <id> [format] Export skill formatted for Claude XML (<skill>), JSON, or Markdown
  help                 Display this help menu

Examples:
  node bin/skill-runner.mjs search docker
  node bin/skill-runner.mjs show zero-downtime-ship-pipeline
  node bin/skill-runner.mjs validate
  node bin/skill-runner.mjs export autonomous-react-loop xml
`);
}

switch (command) {
  case 'list':
    listSkills();
    break;
  case 'search':
    searchSkills(args[1]);
    break;
  case 'show':
    showSkill(args[1]);
    break;
  case 'validate':
    validateSkills();
    break;
  case 'export':
    exportSkill(args[1], args[2] || 'xml');
    break;
  case 'help':
  default:
    showHelp();
    break;
}
