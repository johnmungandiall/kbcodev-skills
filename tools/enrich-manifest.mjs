import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'SKILLS_MANIFEST.json');

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

function inferMetadata(skill, categoryId) {
  const id = skill.id.toLowerCase();
  const title = skill.title.toLowerCase();
  
  // 1. Infer Runtime
  let runtime = "agnostic";
  if (id.includes("react") || id.includes("frontend") || id.includes("vitest") || id.includes("playwright") || id.includes("next") || id.includes("node") || id.includes("typescript") || id.includes("threejs") || id.includes("canvas")) {
    runtime = "typescript";
  } else if (id.includes("python") || id.includes("polars") || id.includes("scipy") || id.includes("pandas") || id.includes("bioinformatics") || id.includes("triton") || id.includes("airflow")) {
    runtime = "python";
  } else if (id.includes("rust")) {
    runtime = "rust";
  } else if (id.includes("swift")) {
    runtime = "swift";
  } else if (id.includes("kotlin") || id.includes("android")) {
    runtime = "kotlin";
  } else if (id.includes("flutter")) {
    runtime = "dart";
  } else if (id.includes("c-cpp") || id.includes("valgrind")) {
    runtime = "c/cpp";
  } else if (id.includes("docker") || id.includes("kubernetes") || id.includes("k8s") || id.includes("iac") || id.includes("terraform")) {
    runtime = "devops";
  }

  // 2. Infer Difficulty Tier
  let difficulty = "advanced";
  if (id.includes("c4") || id.includes("distributed") || id.includes("kernel") || id.includes("embedded") || id.includes("triton") || id.includes("crank") || id.includes("threat-model") || id.includes("bisect")) {
    difficulty = "expert";
  } else if (id.includes("scaffolding") || id.includes("unit-integration") || id.includes("resume") || id.includes("bullets") || id.includes("docs")) {
    difficulty = "intermediate";
  }

  // 3. Generate Search Tags
  const tokens = new Set();
  categoryId.split('-').forEach(t => tokens.add(t));
  id.replace('kbcodedev/', '').split('-').forEach(t => tokens.add(t));
  title.toLowerCase().split(/\s+/).forEach(t => {
    if (t.length > 2 && !['and', 'the', 'for', 'with'].includes(t)) tokens.add(t);
  });
  tokens.add(runtime);
  tokens.add(difficulty);

  const tags = Array.from(tokens).slice(0, 8);

  return { runtime, difficulty, tags };
}

let totalEnriched = 0;
for (const cat of manifest.categories) {
  for (const skill of cat.skills) {
    const meta = inferMetadata(skill, cat.id);
    skill.runtime = meta.runtime;
    skill.difficulty = meta.difficulty;
    skill.tags = meta.tags;
    totalEnriched++;
  }
}

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
console.log(`Successfully enriched ${totalEnriched} skills across ${manifest.categories.length} categories with runtime, difficulty, and tags!`);
