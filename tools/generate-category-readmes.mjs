import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'SKILLS_MANIFEST.json');

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

let generatedCount = 0;

for (const cat of manifest.categories) {
  const catDir = path.join(ROOT_DIR, 'categories', cat.id);
  if (!fs.existsSync(catDir)) {
    fs.mkdirSync(catDir, { recursive: true });
  }

  const categoryReadmePath = path.join(catDir, 'README.md');

  const content = `# 📁 Category: ${cat.name} (\`${cat.id}\`)

> **${cat.description}**
> Total Skills: **${cat.skills.length}** | Back to [Master Catalog](../../README.md) | [Fast Index](../../INDEX.md)

---

## 📜 Skills in this Category

| Skill Title | Skill ID | Runtime | Difficulty | Direct File Link |
|---|---|---|---|---|
${cat.skills.map(s => {
  const filename = path.basename(s.path);
  return `| **${s.title}** | \`${s.id}\` | \`${s.runtime || 'agnostic'}\` | \`${s.difficulty || 'advanced'}\` | [📄 Open ${filename}](${filename}) |`;
}).join('\n')}

---

## 🎯 How to Use These Skills

In **kbcode**:
\`\`\`markdown
get_skill("${cat.skills[0].id}")
\`\`\`

In **Terminal / CLI**:
\`\`\`bash
# Read skill in terminal
node ../../bin/skill-runner.mjs show ${path.basename(cat.skills[0].path, '.md')}

# Export skill for Claude or Cursor
node ../../tools/export-prompt.mjs ${path.basename(cat.skills[0].path, '.md')} claude
\`\`\`

[⬅️ Return to Root README](../../README.md) | [🗺️ Task Lookup Index](../../INDEX.md)
`;

  fs.writeFileSync(categoryReadmePath, content, 'utf-8');
  generatedCount++;
}

console.log(`Successfully generated ${generatedCount} category README.md files!`);
