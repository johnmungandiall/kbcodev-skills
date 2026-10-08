# Agent → User Reply Style: Collected Real-World Evidence

Root document: `AGENT-USER-REPLY-EXAMPLES.md` (repo root, 2026-10-08).
Answers: "when an AI agent talks to a user, how should it reply and what makes the user
understand it?" — evidence collected from live agent prompts and official docs, 2025-09 → 2026-09.

## Core finding
Answer-first. Every major agent (Claude Code, Cursor, Copilot, Devin, Manus) removed the same
three things: **preamble, narration of the search, closing recap**. Two carve-outs always keep
full length: what the user explicitly asked for, and what they need to act safely (error output,
failing tests, security warnings, destructive confirmations).

## Primary sources (all read this session)
- `Anthropic/Claude Code 2.0.txt` (2025-09-29) — "Tone and style" section; ban list on preamble;
  6 calibration examples; anti-sycophancy clause. Repo: github.com/x1xhlol/system-prompts-and-models-of-ai-tools
- Claude Code output styles (official docs) — `Concise` = "the first sentence of a response states
  what happened or what the answer is"; also `Proactive`, `Explanatory`, `Learning`.
- `Cursor Prompts/Agent Prompt 2025-09-03.txt` — separate `<status_update_spec>` (1–3 sentences,
  conversational, correct tense) and `<summary_spec>` (skip for basic queries, no "Summary:" heading).
- `VSCode Agent/gpt-5.txt` (Copilot) — "short and impersonal"; one-sentence preamble per tool batch;
  checkpoint every 3–5 calls; delta updates only; no empty filler.
- `Devin AI/Prompt.txt` — "When to Communicate with User" (5 named moments) + think-before-done.
- `Manus Agent Tools & Prompt/Prompt.txt` — communication listed as a tool capability.
- OpenAI Model Spec `model-spec.openai.com/2025-09-12.html` (superseded version) — headings:
  "Don't be sycophantic", "Be clear and direct", "Be concise and conversational",
  "Adapt length and structure to user objectives".
- Microsoft HAX 18 guidelines (microsoft.com/en-us/haxtoolkit/library/) — G1, G2, G9, G10, G11,
  G15, G16, G18 govern what a reply owes the user.
- `github.com/yzhao062/agent-style` (RULES.md) — 21 writing rules; RULE-01 (curse of knowledge) and
  RULE-H (citation discipline) are the two it marks *critical*; RULE-A…I are LLM-output tells.
  Contains the BAD→GOOD example library used in §6 of the root document.

## Reader-side / failure-mode evidence
- HN thread 49610631 (2026-09-08, 363 comments) synthesised at terminalblog.com — verbatim user
  complaints: "talking about what it didn't do in addition to what it did", "one thing at a time"
  and "too much text" as the most-used follow-ups; a repo named `i-have-adhd` (answer-first,
  skip preamble, <100 words) reached 30k stars for restating what a `Concise` output style already does.
- nativeagents.dev/posts/guidelines/ai-as-coding-partner (2026-04-22) — names the three sycophancy
  failures: **frame echo**, **praise inflation**, **bug softening**.
- NN/g "AI Agents as Users" (2026-04-10) — agent-as-user of an interface; relevant to how agents
  read pages, NOT to reply style. Do not conflate.

## Architectural lesson (not a wording lesson)
A reply-style rule placed once near the top of a long system prompt decays. The Claude Code voice
survives because the output style is re-injected every turn. Any agent carrying reply-style rules
must re-inject them per turn, not rely on a one-time AGENTS.md/CLAUDE.md line.

## Tiers
Each entry in the root document is marked [PRIMARY] (source document read directly) or [SECONDARY]
(aggregator/blog — lead only). §"Secondary claims" lists what was NOT verified: Codex personality
variants, Windsurf "AI Flow", version histories, WaPo coverage, repo star counts.

## Promoted to a skill (2026-10-08)
This collection became `categories/07-ai-mcp-prompt-engineering/clear-replies.md`
(`kbcodedev/clear-replies`, category 07) — "Clear Replies - Answer-First Writing & Reading-Level
Adaptation". Renamed 2026-10-08 from `agent-user-reply-style`, whose own name was jargon — the exact
defect the skill exists to prevent. Registry synced the same turn: `SKILLS_MANIFEST.json` (total_skills 131 → 132, category 07
skills_count 9 → 10), `INDEX.md`, `README.md`, `AGENT.md`, 21 regenerated `categories/*/README.md`,
and the `kb/` notes.

### v3.0.0 — rewritten in-place from reference document to executable runtime skill (2026-10-08)
The v2.0.0 skill documented the rules; v3.0.0 makes them *run*. It now has two declared modes
(RUNTIME = govern the reply about to be sent this turn; AUTHORING = design/install a contract for an
agent, with DIAGNOSIS as a sub-case) and these executable sections:
- **§3.1** six-step per-turn loop — LOAD → CLASSIFY → RESOLVE → COMPOSE → SELF-CHECK → SEND+RECORD,
  mandatory on every response including one-line and tool-only turns.
- **§3.2** adaptive logic: seven axes D1–D7 (complexity, epistemic need, progress need, clarification,
  safety/error, explicit detail request, surface) → five Response Classes R0–R4 (silent / answer-only /
  short report / structured report / detailed), each defined by *content criteria*, each axis carrying a
  "does NOT change the reply" case. The `1–3 sentences` and `several paragraphs` tiers are the
  requested anchors, kept as cited calibration — **never caps**.
- **§3.3** deterministic ladder P0 safety/critical-correctness → P1 explicit user instruction →
  P2 task completion → P3 necessary context → P4 conciseness → P5 stylistic preference, plus a
  five-step tie-break and four worked conflicts.
- **§3.4** 13-row failure catalogue (preamble, postamble, request echo, plan echo, search narration,
  non-action reporting, sycophancy, over-bulleting, vague nouns, needless questions, premature
  completion, excess progress, over-long trivial explanations), each with a detection test, a
  corrective action, and a `Does NOT apply when` column.
- **§3.5** eight execution states (repo inspection, editing, tests/builds, debugging, tool calls,
  failure handling, multi-step, autonomous) — what may and may not be said in each.
- **§3.6** event-driven progress only (six triggers, five anti-triggers) + the announce-then-do
  invariant + a cross-turn **announce-ledger** with a retraction duty.
- **§3.7** completion checklist — enumerate every requested item, run the real check, record
  command + result, say `unverified` when no check exists.
- **§3.8** eight-gate pre-send self-check, preceded by a P0 pre-scan that no gate may override.
- **§3.9** anti-decay: rank the four enforcement surfaces, ship an install-ready runtime policy block,
  and measure decay with four observable metrics **AO / NC / CC / CR** (answer offset, narration count,
  complement count, carve-out retention).
- **§7** evidence table gains an `Origin` column (EVIDENCE / DERIVED / CONVENTION) so the PRIMARY vs
  SECONDARY source distinction survives the rewrite intact; every quoted rule keeps its source and date.
- **§5** split into contract-design traps (AUTHORING) and runtime traps (RUNTIME); **§6** keeps the
  authoring case and adds a runtime case showing four turns taking four different classes.

### Verification recorded for v3.0.0
- `node bin/skill-runner.mjs validate` → **132 skills, 1 error**, and that one error is the
  PRE-EXISTING `kbcodedev/business-logic-workflow-extractor` (its level-2 headings are numbered
  `## 2.1` / `## 3.1` / `## Phase 0` instead of the canonical `## N. Title`). It failed identically in
  the run taken BEFORE this change; the new skill passes the same check.
- A purpose-built mechanical conformance check over the skill file returned **56/56 PASS**: all six
  canonical headings, all nine workflow sub-sections, D1–D7, R0–R4, P0–P5, the 13-row catalogue,
  the 8 gates, the progress triggers/anti-triggers, the announce-ledger, all four decay metrics, the
  install-ready policy block, the non-applicability columns, every section cross-reference resolving,
  both §4 JSON blocks parsing, and the two negative assertions — **no universal numeric cap asserted**
  and **no bare "be concise" directive**. The script ran from the OS temp directory as a one-off, so no
  test artifact was added to the repository.
- Deliberate design decision (requirement 11): the skill defines **no** universal line/word/sentence
  limit. Length derives from the class content criteria plus the surface; the two product-cited anchors
  are calibration only. A cap without the safety carve-outs is itself an anti-pattern.

## Related
- [[categories]] — the skill lives in category 07.
- Skill-authoring template for turning it into a skill:
  `categories/07-ai-mcp-prompt-engineering/skill-authoring-framework.md`
- Prose de-AI-ification: `categories/10-communication-humanizer-career/humanizer-de-ai-voice.md`
