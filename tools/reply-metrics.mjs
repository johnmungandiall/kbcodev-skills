#!/usr/bin/env node
/**
 * reply-metrics.mjs - the real measuring instrument for the Clear Replies contract
 * (categories/07-ai-mcp-prompt-engineering/clear-replies.md, section 3.9 metrics).
 *
 * Measures on an ACTUAL reply text - never on the rules:
 *   AO  answer offset     1-based index of the first content line. Contract requires 1.
 *   NC  narration count   sentences describing the agent's own process. Contract requires 0.
 *   CC  complement count  sentences about what was NOT done / NOT changed. Contract requires 0.
 *   CR  carve-out retention   are the required evidence markers present? Contract requires true.
 *   LM  lexical mismatch  technical terms on the first content line that a low-level reader
 *                         cannot resolve from that same line. Contract requires 0.
 *   OA  over-adaptation   patronising / over-simplifying markers. Contract requires 0.
 * Plus two hard gates:
 *   EX  classification exposure - any of the four forbidden statements (or a close variant).
 *   PR  preamble on the first content line (a starter that describes the agent's own action).
 *
 * Usage:
 *   node tools/reply-metrics.mjs <reply-file> [--level <non-technical|unknown|intermediate|technical|expert>]
 *                                          [--expect "<marker>" --expect "<marker>" ...]
 *   node tools/reply-metrics.mjs --batch tools/reply-scenarios.json
 *
 * Scenarios may set "must_fail": true to mark a falsification control - the control PASSES the
 * harness only when the detector REJECTS it. Without that, a control that is correctly caught
 * would be reported as a harness failure.
 *
 * Exit code 0 only when every measured scenario passes.
 */
import fs from 'node:fs';
import path from 'node:path';

const NARRATION = [
  /^\s*(let me|let's|i'll|i will|i am going to|i'm going to|now i will|now i'll)\b/i,
  /\b(i searched|i read|i looked|i checked|i inspected|i opened|i ran|i used|i am reading|i'm reading)\b/i,
  /\b(using the|via the)\s+\w+\s+tool\b/i,
  /\bnext i('| wi)ll\b/i,
  /^\s*(first, i|first i)\b/i,
];

const COMPLEMENT = [
  /\bbut i did not\b/i,
  /\bi did not\b/i,
  /\bi didn't\b/i,
  /\bnot (edited|committed|changed|touched|run|tested)\b/i,
  /\bi (have not|haven't)\b/i,
  /\bstill unchanged\b/i,
  /\bwithout (editing|touching)\b/i,
];

const PATRONISING = [
  /\bbasically\b/i,
  /\bin simple terms\b/i,
  /\bdon't worry\b/i,
  /\bdont worry\b/i,
  /\bit'?s easy\b/i,
  /\bthink of it like\b/i,
  /\bsimple really\b/i,
  /\bobviously\b/i,
  /\bof course\b/i,
  /\bjust a\b.{0,20}\bthing\b/i,
];

const EXPOSURE = [
  /you are a non-?technical user/i,
  /your reading capacity is low/i,
  /i classified you as/i,
  /i am adapting my response/i,
  /i'?m adapting my response/i,
  /you (are|seem) (a )?(non-?technical|technical|intermediate|expert) user/i,
  /as a non-?technical (user|reader)/i,
  /(simplified|shortened) (this|the answer) for you/i,
];

const PREAMBLE = /^\s*(let me|let's|i'll|i will|i am going to|i'm going to|sure\b|okay\b|ok\b|certainly\b|absolutely\b|happy to\b|great\b|sounds good|first,? i\b|here'?s what i)/i;

const GLOSS_WINDOW = 34;
const CODE_RPAREN = 41;
const CODE_HYPHEN = 45;
const CODE_EN_DASH = 0x2013;
const CODE_EM_DASH = 0x2014;

function countMatches(text, patterns) {
  let n = 0;
  for (const line of text.split('\n')) {
    if (line.trim() === '') continue;
    for (const p of patterns) if (p.test(line)) { n++; break; }
  }
  return n;
}

/** True when `after` opens with a gloss marker: ")", "-", en dash or em dash. */
function opensGloss(after) {
  const trimmed = after.replace(/^\s+/, '');
  if (trimmed === '') return false;
  const c = trimmed.charCodeAt(0);
  return c === CODE_RPAREN || c === CODE_HYPHEN || c === CODE_EN_DASH || c === CODE_EM_DASH;
}

export function measure(reply, opts = {}) {
  const level = opts.level || 'unknown';
  const expect = opts.expect || [];
  const jargon = opts.jargon || [];

  const lines = reply.split('\n');
  let ao = 1;
  let firstContent = '';
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '') { ao = i + 1; firstContent = lines[i]; break; }
  }

  const nc = countMatches(reply, NARRATION);
  const cc = countMatches(reply, COMPLEMENT);
  const oa = countMatches(reply, PATRONISING);
  const ex = EXPOSURE.filter((p) => p.test(reply)).length;
  const pr = PREAMBLE.test(firstContent) ? 1 : 0;

  let cr = true;
  const missing = [];
  for (const m of expect) {
    if (!reply.includes(m)) { cr = false; missing.push(m); }
  }

  let lm = 0;
  const unglossed = [];
  if (level === 'non-technical' || level === 'unknown') {
    for (const term of jargon) {
      const idx = firstContent.toLowerCase().indexOf(term.toLowerCase());
      if (idx === -1) continue;
      // A term is glossed if it sits INSIDE parentheses ("plain word (the term)" - the section
      // 3.11 V prescribed form for a non-technical/unknown reader) OR is followed by a gloss
      // marker. Checking only what FOLLOWS the term missed the plain-first gloss, which is the
      // correct form, and produced a false lexical-mismatch reading.
      const before = firstContent.slice(Math.max(0, idx - GLOSS_WINDOW), idx);
      const after = firstContent.slice(idx + term.length, idx + term.length + GLOSS_WINDOW);
      const inParens = before.lastIndexOf('(') > before.lastIndexOf(')');
      if (!inParens && !opensGloss(after)) { lm++; unglossed.push(term); }
    }
  }

  const pass = ao === 1 && nc === 0 && cc === 0 && cr && lm === 0 && oa === 0 && ex === 0 && pr === 0;

  return { ao, nc, cc, cr, lm, oa, ex, pr, pass, missing, unglossed };
}

function fmt(label, m) {
  const marks = [];
  if (m.ao !== 1) marks.push('AO=' + m.ao);
  if (m.nc) marks.push('NC=' + m.nc);
  if (m.cc) marks.push('CC=' + m.cc);
  if (!m.cr) marks.push('CR=false(missing:' + m.missing.join('|') + ')');
  if (m.lm) marks.push('LM=' + m.lm + '(' + m.unglossed.join('|') + ')');
  if (m.oa) marks.push('OA=' + m.oa);
  if (m.ex) marks.push('EX=' + m.ex);
  if (m.pr) marks.push('PR=1');
  return (m.pass ? 'PASS  ' : 'FAIL  ') + label.padEnd(46) +
    ' AO=' + m.ao + ' NC=' + m.nc + ' CC=' + m.cc + ' CR=' + m.cr +
    ' LM=' + m.lm + ' OA=' + m.oa + (marks.length ? '  << ' + marks.join(' ') : '');
}

function runBatch(file) {
  const data = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
  let failed = 0;
  let controls = 0;
  const groups = {};
  for (const s of data.scenarios) {
    const m = measure(s.reply, {
      level: s.reader && s.reader.technical_level,
      expect: s.expect_markers,
      jargon: s.jargon,
    });
    // A falsification control must be REJECTED for the harness to count it as good.
    let good = m.pass;
    let label = s.id + ' ' + (s.user || '').slice(0, 32);
    if (s.must_fail) { controls++; good = !m.pass; label = '[control] ' + label; }
    if (!good) failed++;
    groups[s.group] = groups[s.group] || [];
    groups[s.group].push(fmt(label, m));
  }
  console.log('\n=== reply-metrics.mjs - measured on actual reply text ===\n');
  for (const g of Object.keys(groups)) {
    console.log('-- ' + g + ' --');
    for (const line of groups[g]) console.log(line);
    console.log('');
  }
  console.log('RESULT: ' + (failed
    ? 'FAIL (' + failed + ' of ' + data.scenarios.length + ' scenarios)'
    : 'PASS (' + data.scenarios.length + ' scenarios' + (controls ? ', incl. ' + controls + ' controls correctly rejected' : '') + ')'));
  return failed;
}

function main() {
  const args = process.argv.slice(2);
  const batchIdx = args.indexOf('--batch');
  if (batchIdx !== -1) {
    process.exit(runBatch(args[batchIdx + 1]) ? 1 : 0);
  }

  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('usage: node tools/reply-metrics.mjs <reply-file> [--level ...] [--expect "..."]'); process.exit(2); }
  const level = args.includes('--level') ? args[args.indexOf('--level') + 1] : 'unknown';
  const expect = [];
  for (let i = 0; i < args.length; i++) if (args[i] === '--expect') expect.push(args[i + 1]);
  const m = measure(fs.readFileSync(path.resolve(file), 'utf8'), { level, expect });
  console.log(fmt(path.basename(file), m));
  process.exit(m.pass ? 0 : 1);
}

main();
