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
Per-skill correctness of all 130 skills' domain claims against upstream docs (only the sections/subjects touched above were checked). Anthropic/OpenAI model-family strings in `claude-api-advanced-patterns`, `langchain-…`, `andrej-karpathy-software-3.0` were **not** re-verified this pass and stay marked *requires verification*.