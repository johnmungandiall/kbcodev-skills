# Skill: CPO Product Discovery & Jobs-To-Be-Done (JTBD)
`id`: `kbcodedev/cpo-product-discovery-jtbd`  
`category`: `15-c-suite-executive-advisory`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Conducting customer discovery interviews, structuring Jobs-To-Be-Done (JTBD) frameworks, building Opportunity Solution Trees (Teresa Torres), and mapping user mental models.
- **Triggers**: Low feature adoption, roadmap prioritization debates, entering new customer verticals, identifying churn root causes.
- **Prerequisites**: User interview transcripts, product usage telemetry.

---

## 2. Core Mental Model & Invariant Principles
1. **The JTBD Core Formula**:
   $$\text{When } [\text{Situation}], \text{ I want to } [\text{Motivation/Action}], \text{ so I can } [\text{Desired Outcome}].$$
2. **Focus on Past Behavior, Not Speculative Opinion**: Ask users *"Tell me about the last time you tried to solve this"* instead of *"Would you like a feature that does X?"*. People are terrible at predicting their future desires.
3. **Opportunity Solution Trees**: Connect High-Level Desired Outcome $\rightarrow$ Customer Opportunities/Pain Points $\rightarrow$ Multiple Candidate Solutions $\rightarrow$ Rapid Assumption Experiments.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Customer Interview Transcript / Churn Feedback]
                        │
                        ▼
┌──────────────────────────────────────────────┐
│ Phase 1: Extract Functional & Emotional Jobs │ ── What is the user really trying to achieve?
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Phase 2: Opportunity Solution Tree Mapping   │ ── Outcome -> Opportunity -> Solution -> Test
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Phase 3: Assumption Falsification Matrix     │ ── Value, Usability, Feasibility, Viability
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Phase 4: Product Discovery Recommendation    │ ── Low-fidelity test design (Ship in 3 days)
└──────────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "product": "B2B Cloud Cost Management Dashboard",
  "customer_feedback": "Engineers ignore cost alerts until the end of the month when the AWS bill arrives 40% over budget."
}
```

### Output Contract
```markdown
# CPO Product Discovery: Cloud Cost Optimization

## 1. Jobs-To-Be-Done (JTBD) Synthesis
> **When** an engineer deploys high-memory cloud infrastructure during development,  
> **I want to** be notified immediately with the specific cost impact before the pull request merges,  
> **So I can** optimize instance sizing without being publicly reprimanded by finance at month-end.

## 2. Opportunity Solution Tree
- **Desired Outcome**: Reduce monthly cloud bill overruns by 80%.
  - **Opportunity (Pain Point)**: Engineers don't see financial cost at the moment of code creation.
    - *Candidate Solution 1*: Automated Pull Request comment showing estimated monthly cost delta (e.g. `+$420/mo`).
    - *Candidate Solution 2*: Weekly executive email to engineering managers.

## 3. 3-Day Assumption Experiment
- Build a simple GitHub Action that comments estimated Terraform cost diffs on PRs for 2 pilot engineering teams.
- Success Metric: 70% of high-cost PRs are resized before merging.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **The Faster Horse Trap**: Asking customers what features to build instead of uncovering their underlying functional and emotional struggles.
- ❌ **Leading Interview Questions**: Asking *"Do you think our dashboard is easy to use?"* (forces polite affirmation).
- ❌ **Building Full Features to Test Assumptions**: Writing 5,000 lines of production code before testing the core value hypothesis with a Figma prototype or concierge test.

---

## 6. Real-World Production Example

```markdown
**JTBD Discovery Impact**:
- Discovery revealed users didn't want another complex analytics dashboard; they wanted an automatic Slack alert when their database exceeded 85% capacity.
- Replaced 6-month dashboard roadmap with a 2-day Slack webhook alert, increasing daily active engagement by 300%.
```
