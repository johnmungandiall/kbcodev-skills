# Skill: CEO Strategic Plan & Product-Market Fit Review
`id`: `kbcodedev/ceo-strategic-plan-review`  
`category`: `08-strategic-product-leadership`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Reviewing engineering initiatives, PRDs, roadmaps, and feature proposals from an executive, business value, unit economics, and product-market fit (PMF) vantage point.
- **Triggers**: Roadmap planning, major feature proposal review, business pivot evaluation, resource allocation decisions.
- **Prerequisites**: Proposed initiative or PRD description, target customer profile, competitive landscape.

---

## 2. Core Mental Model & Invariant Principles
1. **Focus on the 10x Value Proposition**: Does this feature solve a hair-on-fire problem for the core user, or is it marginal nice-to-have busywork?
2. **Ruthless Simplification (Scope Halving)**: If forced to ship in 1 week instead of 3 months, what 20% of the feature delivers 80% of customer value?
3. **Distribution & Monetization Alignment**: A great product without a built-in distribution flywheel or clear unit economic path is an expensive hobby.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Proposed Feature / PRD Roadmap]
                │
                ▼
┌───────────────────────────────┐
│ Phase 1: Core Problem & ICP   │ ── Who is the specific user? What is their exact pain?
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Phase 2: Business & Economic  │ ── Impact on Retention, Activation, LTV, and CAC
│          Viability Audit      │
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Phase 3: Scope Halving Pass   │ ── Strip non-essential features, define 1-week MVP
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Phase 4: Executive Verdict    │ ── Approve / Pivot / Kill with clear strategic rationale
└───────────────────────────────┘
```

### Verification Gate
- Run this domain's own check against the real artefact before claiming success — the project's test/build/lint command, a schema or spec validator, a render or screenshot/diff inspection, or a dry run — whichever the project actually provides. Report the exact command and its result.
- Written, drafted, generated or merely executed is NOT verified; only the check passing is. If no such check exists or none can be run, say so plainly and deliver the claim as unverified.
- On failure: stop, keep the diagnostic output, name the actual failure, and retry only after something changed.
- Never report a result the check did not produce.

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "proposal_title": "AI-Powered Automated Social Media Scheduler for Real Estate Agents",
  "estimated_timeline": "12 weeks",
  "core_hypothesis": "Realtors spend 5 hours/week drafting posts; automating this will drive $49/mo subscriptions"
}
```

### Output Contract
```markdown
# CEO Strategic Review: Automated Real Estate Social Scheduler

## 1. Strategic Verdict: CONDITIONAL APPROVAL (Scope Reduced by 70%)

## 2. Executive Assessment
- **Problem Severity**: High pain, but real estate agents are low-tech and churn rapidly if setup takes > 5 minutes.
- **Economic Viability**: $49/mo is viable ($588 ACV), but customer acquisition cost (CAC) via outbound ads is too high. Needs a viral MLS listing integration.

## 3. Scope Halving Recommendation (Ship in 10 Days)
- **Cut (Phase 2)**: Custom image editor, multi-channel analytics, custom AI fine-tuning.
- **Keep (MVP)**: Connect 1 Instagram account -> Input MLS property URL -> Generate and schedule 3 property showcase posts in 1 click.

## 4. Key Success Metrics (Week 1 Post-Launch)
- $W_1$ Activation: % of signups who schedule their first post within 10 minutes (Target: > 60%).
- 30-Day Retention: % of users publishing weekly posts (Target: > 40%).
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Building in a Vacuum**: Spending 6 months building advanced features before talking to 10 paying customers.
- ❌ **Feature Creep by Consensus**: Saying yes to every customer feature request until the product becomes an unusable bloated monolith.
- ❌ **Confusing Motion with Progress**: Writing thousands of lines of code that move no core business metric (activation, retention, revenue).

---

## 6. Real-World Production Example

```markdown
**YC Office Hours Review**:
- Founder proposed building an enterprise analytics dashboard with 50 customizable chart widgets.
- CEO Review feedback: Cut 47 widgets. Build 1 automatic email alert sent every Monday morning with the 3 numbers the CEO actually cares about.
- Result: Customer onboarding time dropped from 3 weeks to 2 minutes; conversion tripled.
```
