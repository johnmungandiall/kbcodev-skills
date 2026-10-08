# Skills Dynamism & Adaptivity Audit

Records the exhaustive audit of the 115-skill library (historical snapshot — the tree now holds 130) across 21 categories, to determine if they are genuinely fully dynamic or contain static/rigid anti-patterns.

## Dynamism Breakdown (115 Skills)
- **Fully Dynamic (81 skills / 70.4%)**: Completely parameterized JSON input contracts, environment-adaptive discovery, framework-agnostic execution.
- **Dynamic Workflow with Stack Bias (29 skills / 25.2%)**: Dynamic step execution, but examples or contracts are tightly coupled to specific stacks (Next.js, Tailwind, PostgreSQL, Playwright).
- **Static Heuristics & Magic Numbers (5 skills / 4.4%)**: Inflexible thresholds or constants (30-80 step budgets, 60-second onboarding, 7-day sprints, < 5min hello-world).

See `SKILLS_DYNAMISM_AUDIT.md` for the full 21-category table and remediation guidelines.

## Project-Grounding Invariant (added to every skill)
An audit found **none** of the library's skills carried any directive telling the executing agent to inspect the real target project before applying the skill's examples — while 85 contained hardcoded numeric thresholds. Each skill's section 2 now ends with a **Project-Grounding Invariant** (marker string `Project-Grounding Invariant`) requiring the agent to: inspect the real project (manifest/lockfile, installed toolchain, existing implementations) before changing code; adapt each example's specifics (versions, names, paths, thresholds) while keeping the principle; treat the real code as authoritative where it and the skill disagree; and re-derive every numeric bound from the project's own evidence rather than treating it as a constant. `skill-authoring-framework.md` carries the same item in its canonical template so new skills inherit it.

## Corrected technical defects (verified against upstream sources)
- `categories/03-software-engineering/flask-modular-microservice-engine.md` Gunicorn `post_fork` hook: corrected to `db.engine.dispose(close=False)` — SQLAlchemy's documented fork-safe form; a bare `dispose()` closes inherited descriptors the master and sibling workers still hold. Scope narrowed to `--preload` only. App access changed to `server.app.wsgi()` (`BaseApplication.wsgi`).
- `categories/03-software-engineering/flask-modular-microservice-engine.md` pytest fixture: replaced the bare `db.session.begin_nested()` with `join_transaction_mode="create_savepoint"` bound to an external connection transaction — in SQLAlchemy 2.0 `Session.commit()` commits the OUTERMOST transaction, so a route-level commit would durably persist test data.
- `categories/03-software-engineering/flask-modular-microservice-engine.md`: removed `JSON_SORT_KEYS` config and `FLASK_ENV` (both removed in Flask 2.3).
- `categories/03-software-engineering/django-enterprise-architecture.md`: Pydantic v1 `.dict()` → `model_dump()`.

## Library growth
- 2026-10-02: library now **130 skills** across 21 categories — added `universal-skill-quality` (category 07), a structure-agnostic audit/repair/hardening engine for any skill definition (assumption & absolute triage, project-grounding, evidence discipline, verification gates, fixed four-part report). It carries the Project-Grounding Invariant in its own section 2 and treats every numeric bound as a heuristic.
- 2026-10-08: library now **132 skills** — added the reply-style skill (category 07), sourced from real agent prompts and public specs (see [[agent-user-reply-examples]]). It was renamed to `clear-replies` because **its own name was jargon** — a skill about being understandable must not be titled for a specialist (the user flagged exactly that). Rewritten in-place to **v3.0.0**, then extended to **v3.1.0** the same day: converted from a research/reference document into an **executable runtime skill** — §3.1 six-step per-turn loop (LOAD → CLASSIFY → RESOLVE → COMPOSE → SELF-CHECK → SEND+RECORD, per turn), §3.2 seven axes D1–D7 → five Response Classes R0–R4 defined by content criteria, §3.3 deterministic ladder P0–P5 (safety → explicit user request → task completion → necessary context → conciseness → style) with tie-breaks, §3.4 a 13-row communication-failure catalogue each with a detection test and a `Does NOT apply when` column, §3.5 eight execution states, §3.6 event-driven progress + announce-then-do + a cross-turn announce-ledger, §3.7 verified-completion checklist, §3.8 eight-gate pre-send self-check with a non-overridable P0 pre-scan, §3.9 anti-decay surface ranking + install-ready 10-line policy block + four decay metrics **AO/NC/CC/CR**. **It deliberately asserts no universal line/word limit** — the two product-cited anchors (`less than 4 lines`; `one to three sentences`) are documented as calibration evidence, not caps, because a cap without the safety carve-outs teaches the agent to hide defects. §7 gained an `Origin` column (EVIDENCE / DERIVED / CONVENTION) so the PRIMARY-vs-SECONDARY source distinction survived the rewrite, and no evidence was dropped to shorten the document.

### v3.1.0 — receiver / reading-capacity layer + FIRST RUNTIME MEASUREMENT (2026-10-08)

**Renamed** `agent-user-reply-style` → **`clear-replies`** (`kbcodedev/clear-replies`, file `categories/07-ai-mcp-prompt-engineering/clear-replies.md`) because the old name was itself jargon.

**Extended, not redesigned** — R0–R4 classes and the P0–P5 ladder are unchanged. Added §3.10 six-dimension receiver model (`technical_level`, `reading_preference`, `attention_budget`, `context_need`, `language_complexity`, `current_urgency`) with a signal-inference table and six binding inference rules (start unknown · task complexity NEVER raises `technical_level` · per-turn update · probabilistic · not carried across contexts · conflicts resolve toward comprehension) plus an exposure ban on the four forbidden statements; §3.11 presentation shaping (vocabulary 4 tiers · density by re-ordering, never deleting · structure · progressive disclosure · the seven adapt-not-truth P0 prohibitions · the over-adaptation ban); §3.12 conversation adaptation incl. the Telugu instructions and "I don't understand" → re-frame, not repeat; the nine-reader coverage matrix; the six reading-length minima. Self-check gates 8 → 10, metrics 4 → 6 (+ **LM** lexical mismatch, **OA** over-adaptation), invariants 6 → 8.

**Instrument**: `tools/reply-metrics.mjs` measures AO / NC / CC / CR / LM / OA plus two hard gates (EX classification-exposure, PR preamble) on an ACTUAL reply text. `tools/reply-scenarios.json` holds 22 scenarios (10 task-complexity, 10 receiver-matrix, 2 falsification controls).

**Measured results — not rule-reading:**
- Scenario harness: **PASS (22 scenarios, incl. 2 controls correctly rejected)**. CTL-1 caught preamble + narration + complement + praise; CTL-2 caught patronising language + `EX=3` + missing required evidence.
- Real-surface evidence `tools/reply-real-samples.json` — 8 verbatim excerpts of this agent's OWN replies in this session (three from before the contract existed, including late turns ~40–43 that test decay): **8/8 PASS**, every one `AO=1 NC=0 CC=0 CR=true LM=0 OA=0`.
- One genuine failure found: **M05 `LM=2`**. The responsible rule was NOT the skill — the detector checked only what FOLLOWED a jargon term, so the correct §3.11 V plain-first gloss (`queue (the Kafka consumer)`) read as a miss. Instrument fixed (parenthesis-aware, code-point comparison), M05 rerun → `LM=0`, full batch reverified.

**Honest limits**: the 22 scenario replies were composed for the harness, so they are weaker evidence. The 8 real-session excerpts are the stronger signal but are a small sample on one surface (terminal, one user). The skill is **not** declared fully verified.

- Validator after the change: `node bin/skill-runner.mjs validate` → 132 skills, 1 error = the PRE-EXISTING `business-logic-workflow-extractor` heading-shape failure (identical before this work).

#### Worked examples removed from section 6 (2026-10-08, user request)
The three standalone worked cases (Case 1 authoring, Case 2 four-turns/four-classes, Case 3 four-readers) were **deleted** from `## 6. Real-World Production Example` at the user's request — "examples ni delete chesesi". The **level-2 heading itself was kept**, because `bin/skill-runner.mjs#validateSkills` requires that exact section title; deleting the heading would fail the repo validator. The operational rule tables were deliberately **not** touched — the example phrasings inside §3.4 (failure catalogue), §3.10 (signal-inference) and §3.11 (V/D/S/R/N) are the executable criteria the skill is built on, not standalone examples. Validator re-run after the deletion: 132 skills, 1 error (the same pre-existing one, unrelated).

## Skill-quality pass (2026-10-02) — `universal-skill-quality` over all 130 skills
Read-only instrumented audit (line-based, markdown-aware, scripts kept OUTSIDE the repo) + classify-before-repair. Repairs (5 files):
- `categories/07-ai-mcp-prompt-engineering/skill-authoring-framework.md` (section 4 heading): renamed `## 4. Standard Skill Template (Canonical Spec)` → `## 4. Input / Output Contracts (Canonical Skill Template)`. Its section was detectable only as a code-fence sample, so `bin/skill-runner.mjs#validateSkills` (substring match) and any fence-aware checker saw the required `Input / Output Contracts` heading only inside a fence.
- `categories/07-ai-mcp-prompt-engineering/structured-output-json-schema.md` (execution-workflow diagram, step 1): the label read "Remove ```json fences" — an inline triple-backtick inside a fenced block closed it early for markdown-aware readers; reworded to "Remove markdown fences" (meaning unchanged).
- `bin/skill-runner.mjs#showHelp`: help text said "Validate all 115 skills" → 130.
- `SKILLS_DYNAMISM_AUDIT.md`, `SKILLS_GAP_ANALYSIS.md`: 115-skill figures labelled **historical snapshot** (not silent rewrites of their tables).

### Rejected as false positives (do not "fix" these later)
- **"115" in `database-schema-modeling.md` is `115,000 buffer reads`; "128" in `flask-…` is `max_length=128`, in `mathematical-optimization-scipy.md` is RAM 128GB, in `pytorch-…` is `batch_size=128`.** Legitimate values, not stale counts.
- **The Project-Grounding Invariant appears as item N of each skill's own list (4th in 117 skills, 5th in 10, 6th in 2, 10th in 1)** — not a schema violation. It is present in **all 130** skills.
- **Only duplicated prose in the whole library is that invariant block** (156,007 of 883,786 bytes ≈ 17.7%); no other line ≥60 chars repeats across ≥5 files. Deliberate design, not slop.
- **5 skills use non-JSON contracts** (`language-migration-modernizer`, `performance-profiler-benchmark`, `developer-experience-devex-review`, `humanizer-de-ai-voice`, `skill-authoring-framework`) and **all 130 contract JSON blocks parse**. The earlier "0/130 parse" reading was a tool artifact: a non-greedy regex `[\s\S]*?` stopping at the first ``` fence, which the example payloads legitimately contain. Match `^```json$` / `^```$` line-wise instead.
- Flask `JSON_SORT_KEYS` / `FLASK_ENV` and Pydantic `.dict()` mentions are **corrections that name the removed API** — correct, not outdated usage.

### Suggested, NOT applied (needs user approval — changes existing behaviour)
`validateSkills()` in `bin/skill-runner.mjs` substring-matches the 6 required section titles, so a title occurring *only inside a code fence* or in prose passes. A fence-aware, heading-anchored check would catch that class. Not changed unilaterally.

### Unverified
Per-skill correctness of all 130 skills' domain claims against upstream docs (only the sections/subjects touched above were checked). ### Follow-up "fix all" pass (2026-10-02) — every open item closed
- **`bin/skill-runner.mjs#validateSkills` HARDENED.** It was `content.includes(title)` (substring), so a required heading existing only inside a code fence passed as present. Now fence-aware and heading-anchored (`parseSkillStructure`), and it additionally parses every `json` block in the Input/Output Contracts section (`validateContractJson`). Proven by a falsification fixture in a throwaway tree outside the repo: a fence-only heading is caught, invalid contract JSON is caught, a clean skill still passes; the real tree then validates 130/130.
- **`skill-authoring-framework.md` section-4 heading normalised to exactly `## 4. Input / Output Contracts`** with the "canonical template" framing moved into prose — the earlier parenthetical suffix made the heading non-canonical, and the hardened validator correctly failed on it.
- **`### Verification Gate` added to all 130 skills** at the end of section 3. Before this pass **no** skill stated how to verify and 59 said nothing about verification anywhere in their workflow. The gate: run the domain's own check against the real artefact and report the exact command and result; written/generated/executed is NOT verified; on failure stop, keep the diagnostic, retry only after something changed; never report a result the check did not produce.
- **Outdated model references corrected** (checked against Anthropic's live models overview, 2026-10-02): `claude-3-5-sonnet-20241022` → `claude-sonnet-5-5` in `claude-api-advanced-patterns` (contract + TS + Python) and `langchain-llamaindex-agentic-framework`; dated model names generalised in `andrej-karpathy-software-3.0`. Current API IDs at verification time: `claude-fable-5-1`, `claude-opus-5-5`, `claude-sonnet-5-5`, `claude-haiku-4-5`.
- **`headless-crawler-data-extractor`**: unsupported "90% of web data … 50x faster" replaced with "most web data … far faster — measure the actual saving".
- **`SKILLS_DYNAMISM_AUDIT.md` rewritten at 130** (measured: 6 rule-shaped magic numbers — 5 are labelled domain heuristics, 1 fixed; 15 skills added since the 115 baseline; 130/130 gates). **`SKILLS_GAP_ANALYSIS.md`** inventory re-counted to 130.

### Still unverified
Per-skill domain correctness beyond the sections/subjects touched (no upstream re-check of every claim, no runtime execution of the skills themselves).