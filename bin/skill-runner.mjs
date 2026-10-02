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
      const matchRuntime = skill.runtime && skill.runtime.toLowerCase().includes(q);
      const matchDifficulty = skill.difficulty && skill.difficulty.toLowerCase().includes(q);

      if (matchId || matchTitle || matchCat || matchTags || matchRuntime || matchDifficulty) {
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

// --- Fence-aware structural validation -------------------------------------------------
// A required section counts as present ONLY when it appears as a real `## N. Title`
// heading OUTSIDE any code fence. The previous implementation used content.includes(title),
// so a title that existed only inside a fenced example or in prose passed as "verified".
const REQUIRED_SECTIONS = [
  'Intent & Trigger Conditions',
  'Core Mental Model & Invariant Principles',
  'High-Signal Execution Workflow',
  'Input / Output Contracts',
  'Anti-Patterns & Critical Traps',
  'Real-World Production Example'
];

function normalizeHeading(title) {
  return title.replace(/^\d+\.\s*/, '').trim().toLowerCase();
}

// Walk the file line-wise, tracking fence state. Returns the level-2 headings seen outside
// fences plus each section's body (its lines up to the next heading). Inline backticks
// mid-line are not fences; only a line that starts with three-or-more backticks opens/closes.
function parseSkillStructure(content) {
  const lines = content.split(/\r?\n/);
  const headings = [];
  const bodies = new Map();
  let fence = null;
  let current = null;

  for (const line of lines) {
    const fenceMatch = /^\s*(`{3,})(.*)$/.exec(line);
    if (fenceMatch) {
      const ticks = fenceMatch[1].length;
      if (fence === null) fence = ticks;
      else if (ticks >= fence) fence = null;
      if (current) current.body.push(line);
      continue;
    }
    const headingMatch = /^(#{2,6})\s+(.*)$/.exec(line);
    if (fence === null && headingMatch) {
      if (headingMatch[1].length === 2) {
        if (current) bodies.set(normalizeHeading(current.title), current.body);
        current = { title: headingMatch[2].trim(), body: [] };
        headings.push(current.title);
      } else if (current) {
        current.body.push(line);
      }
      continue;
    }
    if (current) current.body.push(line);
  }
  if (current) bodies.set(normalizeHeading(current.title), current.body);
  return { headings, bodies };
}

// Every ```json block inside the Input/Output Contracts section must parse.
function validateContractJson(bodies) {
  const body = bodies.get(normalizeHeading('Input / Output Contracts'));
  if (!body) return { blocks: 0, failedBlocks: [] };
  let blocks = 0;
  const failedBlocks = [];
  for (let i = 0; i < body.length; i++) {
    if (!/^\s*```json\s*$/.test(body[i])) continue;
    let close = -1;
    for (let j = i + 1; j < body.length; j++) {
      if (/^\s*```\s*$/.test(body[j])) { close = j; break; }
    }
    blocks++;
    if (close === -1) { failedBlocks.push('unclosed ```json block'); break; }
    try {
      JSON.parse(body.slice(i + 1, close).join('\n'));
    } catch (e) {
      failedBlocks.push(e.message.slice(0, 60));
    }
    i = close;
  }
  return { blocks, failedBlocks };
}

function validateSkills() {
  const manifest = loadManifest();
  console.log(`\n🧪 Validating all ${manifest.total_skills} skills across ${manifest.total_categories} categories...\n`);

  let passed = 0;
  let failed = 0;
  const errors = [];

  for (const cat of manifest.categories) {
    for (const skill of cat.skills) {
      const fullPath = path.join(ROOT_DIR, skill.path);
      if (!fs.existsSync(fullPath)) {
        errors.push(`[MISSING_FILE] ${skill.path} does not exist`);
        failed++;
        continue;
      }

      const content = fs.readFileSync(fullPath, 'utf-8');
      const { headings, bodies } = parseSkillStructure(content);
      const present = new Set(headings.map(normalizeHeading));
      const missingSections = REQUIRED_SECTIONS.filter((s) => !present.has(normalizeHeading(s)));
      const { failedBlocks } = validateContractJson(bodies);
      const problems = [];

      if (missingSections.length > 0) {
        problems.push(`Missing sections: ${missingSections.join(', ')}`);
      }
      if (failedBlocks.length > 0) {
        problems.push(`Invalid contract JSON: ${failedBlocks.join('; ')}`);
      }

      if (problems.length > 0) {
        errors.push(`[SCHEMA_FAIL] ${skill.id}: ${problems.join(' | ')}`);
        failed++;
      } else {
        passed++;
      }
    }
  }

  if (failed === 0) {
    console.log(`✅ 100% PASS: All ${passed}/${passed} skills successfully validated!`);
    console.log(`   - File existence: Verified`);
    console.log(`   - Heading-anchored structure (outside code fences): Verified`);
    console.log(`   - Input/Output contract JSON parses: Verified\n`);
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
  validate             Validate all 130 skills against the canonical structure
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
