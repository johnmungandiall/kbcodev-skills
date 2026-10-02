# kbcodedev-skills: Comprehensive Dynamism & Adaptivity Audit

**Audit Target**: All **130** Skills across 21 Categories  
**Baseline**: 115 skills (original audit) — **re-measured at 130 on 2026-10-02**  
**Method**: deterministic script over every skill file (manifest-driven). The original audit's
three-way split was an LLM judgement and was not reproducible; it is superseded by the
script measurement below, and the original analysis is preserved in §4 as history.  
**Auditor**: Antigravity / kbcode  

---

## 1. Executive Summary: Are the Skills Truly Dynamic?

**Verdict**: **the library is not uniformly "fully dynamic", and that is by design.** Workflow and
contracts are dynamic; what remains fixed is a small, bounded set of numeric bounds plus one
deliberate library-wide invariant block.

**Current measurement (all 130 skills)**

- **6 skills carry a rule-shaped fixed numeric bound** — a step band, day window or enforced %
  written as a rule rather than derived. Of these, **5 are already labelled as examples/heuristics**
  ("e.g.", a named domain heuristic) and **1 was a genuine unsupported quantitative claim**, which
  has been corrected. See §3.
- **15 skills were added after the 115-skill baseline** (Python frameworks, Flutter, MLOps,
  skill-quality). All 15 inherit the canonical structure and the Project-Grounding Invariant.
- **130 of 130 skills now carry an explicit `### Verification Gate`** in their execution workflow
  (added 2026-10-02). Before this pass, **none** of the 130 stated how to verify, and 59 stated
  nothing about verification anywhere in their workflow section. See §5.
- The **Project-Grounding Invariant** is present in all 130 skills, at the end of each skill's own
  invariant list (item 4 in 117 skills, item 5 in 10, item 6 in 2, item 10 in 1). It is the **only**
  prose block repeated across the library (≈156 KB of 884 KB total, ≈17.7%).

---

## 2. Per-Category Inventory (current: 130 skills)

| Category ID | Category Name | Total Skills | Added since 115 |
|---|---|---|---|
| `01-agentic-orchestration` | Agentic Orchestration | 8 | 0 |
| `02-system-architecture` | System Architecture | 6 | 0 |
| `03-software-engineering` | Software Engineering | 13 | 6 |
| `04-testing-qa-debugging` | Testing & QA | 8 | 1 |
| `05-frontend-ui-ux` | Frontend UI/UX | 8 | 1 |
| `06-devops-sre-release` | DevOps & SRE | 6 | 0 |
| `07-ai-mcp-prompt-engineering`| AI & MCP Prompt Eng | 9 | 2 |
| `08-strategic-product-leadership` | Product Leadership | 7 | 0 |
| `09-document-media-synthesis` | Document Synthesis | 5 | 0 |
| `10-communication-humanizer-career` | Communication | 5 | 0 |
| `11-scientific-quantitative-ai` | Scientific AI | 6 | 0 |
| `12-mobile-cross-platform` | Mobile Engineering | 7 | 2 |
| `13-data-engineering-mlops` | Data Eng & MLOps | 8 | 3 |
| `14-security-compliance-governance` | Security & Compliance | 6 | 0 |
| `15-c-suite-executive-advisory` | Executive Advisory | 8 | 0 |
| `16-tool-integrations-connectors` | Tool Integrations | 5 | 0 |
| `17-visual-architecture-diagrams` | Diagram Synthesis | 4 | 0 |
| `18-yc-tech-leaders-frameworks` | YC Frameworks | 5 | 0 |
| `19-game-dev-3d-graphics` | Game Dev & 3D | 2 | 0 |
| `20-web-scraping-browser-automation` | Web Scraping | 2 | 0 |
| `21-systems-embedded-programming` | Systems Programming | 2 | 0 |
| **Totals** | **21 Categories** | **130** | **15** |

**The 15 skills added since the 115 baseline** (evidence: `git log --diff-filter=A`):
`fastapi-async-production-architecture`, `django-enterprise-architecture`,
`flask-modular-microservice-engine`, `celery-distributed-task-queue`, `typer-click-rich-cli-engine`,
`litestar-async-api-engine`, `pytest-advanced-test-engineering`, `streamlit-reflex-python-ui-engine`,
`langchain-llamaindex-agentic-framework`, `universal-skill-quality`, `flutter-production-architecture`,
`flutter-adaptive-ui-engine`, `pytorch-deep-learning-pipeline`, `polars-pandas-dataframe-engine`,
`huggingface-transformers-pipeline`.

---

## 3. Remaining Static Heuristics — measured, classified

Classified under the `universal-skill-quality` Phase-2 table (never delete an absolute or a number
by reflex; never keep one unexamined):

| # | Skill | Fixed bound found | Classification | Action |
|---|---|---|---|---|
| 1 | `multi-agent-swarm` | "step budgets per subagent (e.g., 10-30 steps)" | Heuristic, **already labelled** with "e.g." | Keep |
| 2 | `context-save-restore-checkpoint` | "100% operational context" | Rhetoric, not a numeric bound | Keep |
| 3 | `yc-startup-playbook` | "Concierge MVP Build (3-5 Days)" | Domain-standard sprint heuristic | Keep |
| 4 | `tech-interview-grilling-prep` | "do not talk uninterrupted for 15 minutes; check in every 2-3 minutes" | Communication heuristic | Keep |
| 5 | `technical-copywriting-landing-page` | "The 5-Second Hero Rule" | Named domain heuristic (the 5-second test) | Keep |
| 6 | `headless-crawler-data-extractor` | "90% of web data … 50x faster" | **Unsupported quantitative claim** (no evidence) | **Corrected** → "most web data … far faster … measure the actual saving" |

**Net**: of 6 candidates, 1 was a proven defect. The other 5 are domain heuristics or already
labelled examples — removing them would have destroyed domain intelligence for no reliability gain.

---

## 4. Historical Analysis (115-skill snapshot) — preserved

### Original Trap 1: Magic Numbers & Rigid Time Windows
The original audit named 6 skills: `autonomous-react-loop` (a fixed "30-80 steps" band and fixed
20/50/30 ratios), `product-design-ux-review` ("60-second onboarding test"), `developer-experience-devex-review`
("Time-to-Hello-World < 5 min"), `yc-startup-playbook` ("7-day MVP sprint"), `sam-altman-execution-velocity`
("48-hour falsification test"), `cfo-saas-metrics-unit-economics` ("3:1 LTV:CAC").

**Re-measured at 130**: `autonomous-react-loop` no longer carries a fixed band — its step budget is
now derived (`max_steps = f(blast_radius, affected_files, uncertainty)`). The remaining named cases are
domain heuristics of the kind the library intends to keep, each now covered by the Project-Grounding
Invariant's "re-derive from the project's own evidence" rule.

### Original Trap 2: Stack Bias in "Agnostic" Skills
The original audit named `modern-frontend-architecture` (Next.js 14 App Router, RSC, Tailwind),
`anti-detect-browser-automation` / `e2e-webapp-testing` (Playwright, `@sparticuz/chromium`),
and `c4-system-architecture` / `staff-eng-architect-review` (PostgreSQL/Next.js as canonical example).

**Assessment**: this remains the library's main coupling. It is **stack bias in examples**, not in
workflow logic — the workflows are parameterised, and the Project-Grounding Invariant now instructs the
agent to reconcile each example against the real project and let the real code win. This is a **style
choice of the library, not a defect**, and is not changed here.

### Original Remediation Guidance (still valid)
1. Parameterise step budgets from task complexity — **done** in `autonomous-react-loop`.
2. Prefer dynamic heuristics over magic numbers, or take the bound from the Input Contract.
3. Keep contracts stack-adaptive: accept a `target_stack` or inspect the live repo rather than
   defaulting to Next.js/Tailwind/Playwright.

---

## 5. Library-Wide Invariants (added 2026-10-02)

- **Project-Grounding Invariant** — every version, path, threshold and code sample is a reference
  pattern; the agent inspects the real project first, adapts each specific while keeping the principle,
  treats the real code as authoritative where the two disagree, and re-derives every numeric bound
  from the project's own evidence. Carried by all 130 skills; `skill-authoring-framework.md` carries it
  in the canonical template so new skills inherit it.
- **Verification Gate** — a `### Verification Gate` at the end of section 3 in all 130 skills:
  run the domain's own check against the real artefact before claiming success and report the exact
  command and result; written/generated/executed is NOT verified; on failure stop, keep the diagnostic,
  name the actual failure, retry only after something changed; never report a result the check did not
  produce.

Both are enforced by `bin/skill-runner.mjs validate`, which now checks (a) file existence,
(b) heading-anchored structure with required sections present **outside** code fences, and
(c) that every `json` block in the Input/Output Contracts section parses.
