# kbcodedev-skills: Comprehensive Dynamism & Adaptivity Audit

**Audit Target**: All 115 Skills across 21 Categories — **historical snapshot**; the library has since grown to 130 skills (see `SKILLS_MANIFEST.json`), so the counts below describe the 115-skill snapshot, not the current tree.  
**Execution Date**: October 2026  
**Auditor**: Antigravity / kbcode  

---

## 1. Executive Summary: Are the Skills Truly Dynamic?

**Verdict**: **Anni skills 100% fully dynamic ga levu.**
Prasthutam unna 115 skills lo:
- **81 Skills (70.4%) — Fully Dynamic**: True runtime discovery, dynamic JSON input contracts, environment-adaptive heuristics, zero stack-locking.
- **29 Skills (25.2%) — Dynamic Workflow with Stack-Biased / Static Examples**: Workflow logic dynamic ga unna, code examples mariyu anti-patterns lo specific opinionated frameworks (Next.js App Router, Tailwind CSS, PostgreSQL, Playwright) ni hardcode chesi unnaayi.
- **5 Skills (4.4%) — Static Heuristics & Magic Numbers**: Hardcoded thresholds, rigid step counts, or fixed time windows ni invariant ga enforce chesthunnayi (e.g. "30-80 steps budget", "60-second onboarding", "7-day sprint", "< 5 min time-to-hello-world", "48-hour falsification").

---

## 2. Breakdown Across All 21 Categories

| Category ID | Category Name | Total Skills | Fully Dynamic | Stack-Biased Examples | Static Heuristics |
|---|---|---|---|---|---|
| `01-agentic-orchestration` | Agentic Orchestration | 8 | 7 | 0 | 1 (`autonomous-react-loop`) |
| `02-system-architecture` | System Architecture | 6 | 5 | 1 (`c4-system-architecture`) | 0 |
| `03-software-engineering` | Software Engineering | 7 | 7 | 0 | 0 |
| `04-testing-qa-debugging` | Testing & QA | 7 | 5 | 2 (`root-cause`, `e2e-webapp`) | 0 |
| `05-frontend-ui-ux` | Frontend UI/UX | 7 | 2 | 5 (`modern-frontend`, `interactive-artifacts`, etc.) | 0 |
| `06-devops-sre-release` | DevOps & SRE | 6 | 5 | 1 (`docker-container`) | 0 |
| `07-ai-mcp-prompt-engineering`| AI & MCP Prompt Eng | 7 | 6 | 1 (`metaprompt-chain-of-thought`) | 0 |
| `08-strategic-product-leadership`| Product Leadership | 7 | 3 | 2 (`staff-eng`, `yc-startup`) | 2 (`product-design-ux`, `developer-experience`) |
| `09-document-media-synthesis` | Document Synthesis | 5 | 3 | 2 (`docx`, `pdf`) | 0 |
| `10-communication-humanizer-career`| Communication | 5 | 3 | 2 (`ats-resume`, `executive-comms`) | 0 |
| `11-scientific-quantitative-ai`| Scientific AI | 6 | 5 | 1 (`data-pipeline-etl`) | 0 |
| `12-mobile-cross-platform` | Mobile Engineering | 5 | 5 | 0 | 0 |
| `13-data-engineering-mlops` | Data Eng & MLOps | 5 | 3 | 2 (`feature-store`, `mlops-triton`) | 0 |
| `14-security-compliance` | Security & Compliance | 6 | 5 | 1 (`api-security-rate-limit`) | 0 |
| `15-c-suite-executive-advisory`| Executive Advisory | 8 | 4 | 3 (`cto-tech-radar`, `cmo-growth`, `copywriting`) | 1 (`cfo-saas-metrics`) |
| `16-tool-integrations` | Tool Integrations | 5 | 4 | 1 (`database-connector-supabase`) | 0 |
| `17-visual-architecture-diagrams`| Diagram Synthesis | 4 | 3 | 1 (`cloud-topology`) | 0 |
| `18-yc-tech-leaders-frameworks`| YC Frameworks | 5 | 4 | 0 | 1 (`sam-altman-velocity`) |
| `19-game-dev-3d-graphics` | Game Dev & 3D | 2 | 2 | 0 | 0 |
| `20-web-scraping-browser` | Web Scraping | 2 | 0 | 2 (`anti-detect`, `headless-crawler`) | 0 |
| `21-systems-embedded` | Systems Programming | 2 | 2 | 0 | 0 |
| **Totals** | **21 Categories** | **115** | **81** | **29** | **5** |

---

## 3. Deep Analysis of Static Traps & Hardcoded Patterns

### Trap 1: Magic Numbers & Rigid Time Windows (5 Skills)
1. `autonomous-react-loop.md`: Enforces "Maintain a strict step budget (e.g., 30-80 steps)" and fixed 20%/50%/30% discovery/execution/verification ratios instead of sizing dynamically to the task.
2. `product-design-ux-review.md`: Enforces a rigid "60-second onboarding test" threshold regardless of B2B enterprise complexity.
3. `developer-experience-devex-review.md`: Hardcodes "Time-to-Hello-World < 5 min" as a rigid metric.
4. `yc-startup-playbook.md`: Enforces fixed "7-day MVP sprint" cycles.
5. `sam-altman-execution-velocity.md`: Hardcodes "48-hour falsification test".
6. `cfo-saas-metrics-unit-economics.md`: Fixates on a generic "3:1 LTV:CAC" rule.

### Trap 2: Stack Bias in "Agnostic" Skills (29 Skills)
- `modern-frontend-architecture.md`: Mentions agnostic UI principles, but hardcodes Next.js 14 App Router, React Server Components (RSC), and Tailwind CSS in execution and contract schemas.
- `anti-detect-browser-automation.md` & `e2e-webapp-testing.md`: Strictly binds to Playwright and `@sparticuz/chromium`, conflicting with extension-driven or custom agent runtimes.
- `c4-system-architecture.md` & `staff-eng-architect-review.md`: Default to PostgreSQL and Next.js as the canonical architectural example rather than extracting dynamic topology from project files.

---

## 4. Remediation: How to Make All 115 Skills 100% Dynamic

1. **Parameterize Step Budgets**: In `autonomous-react-loop.md`, derive the step budget dynamically from the task complexity (`estimated_steps = f(blast_radius, file_count)`), never a fixed 30-80 band.
2. **Dynamic Heuristics Over Magic Numbers**: Replace fixed "60-second" or "7-day" rules with relative SLA constraints supplied via the `Input Contract`.
3. **Stack-Adaptive Contracts**: Ensure all schemas accept a `target_stack` or inspect the live repo rather than defaulting to Next.js/Tailwind/Playwright.
