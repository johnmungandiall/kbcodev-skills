# Skill: Engineering Career Ladder & Leveling Framework
`id`: `kbcodedev/head-of-people-eng-career-ladder`  
`category`: `15-c-suite-executive-advisory`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Establishing transparent engineering leveling frameworks, Individual Contributor (IC) vs Engineering Management (EM) tracks (L3 to L8 / Principal), conducting fair performance calibrations, and structuring promotion criteria.
- **Triggers**: Engineering team scaling (>15 engineers), confusing title inflation, compensation reviews, retention risk mitigation.
- **Prerequisites**: Current team headcount, engineering values.

---

## 2. Core Mental Model & Invariant Principles
1. **Parallel Dual Tracks (IC vs Management)**: A Principal Engineer (L7) must command the exact same compensation and organizational influence as an Engineering Director (M2), preventing great engineers from being forced into management.
2. **Scope of Influence Expansion**:
   - **L3 (Junior)**: Execution within a single bounded task.
   - **L4 (Mid)**: Autonomous feature delivery across 1 service.
   - **L5 (Senior)**: Ownership of an entire subsystem, mentoring, and technical design.
   - **L6 (Staff)**: Multi-team technical leadership, architectural standards, blast-radius mitigation.
   - **L7 (Principal)**: Organization-wide technical strategy, business-level leverage.
3. **No Surprises Performance Reviews**: A formal review should never contain unexpected feedback; continuous bi-weekly 1:1s must surface growth areas in real time.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Engineering Team Hierarchy & Growth Stage]
                     │
                     ▼
┌───────────────────────────────────────────┐
│ Leveling Matrix: L3 -> L4 -> L5 -> L6 -> L7│ ── Craft, Execution, Influence, Leadership
└────────────────────┬──────────────────────┘
                     ▼
┌───────────────────────────────────────────┐
│ Performance Calibration Rubric           │ ── Exceeds / Meets / Needs Improvement
└────────────────────┬──────────────────────┘
                     ▼
┌───────────────────────────────────────────┐
│ Promotion Packet Formulation              │ ── Demonstrate sustained impact at target level
└───────────────────────────────────────────┘
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
  "level": "L6 (Staff Engineer)",
  "tracks": ["Individual Contributor (IC)"]
}
```

### Output Contract
```markdown
# Engineering Leveling Specification: L6 Staff Engineer

## 1. Scope & Core Mission
Staff Engineers operate at the **Multi-Team / Subsystem Level**. They identify architectural bottlenecks before they manifest as outages, author foundational RFCs, establish engineering rigor, and multiply the output of 15+ engineers.

## 2. Competency Pillars

| Dimension | Expectations for L6 Staff Engineer |
|---|---|
| **Technical Craft** | Deep mastery of distributed systems, data storage, and resilience. Author of core architectural RFCs. |
| **Execution & Delivery** | Deconstructs multi-quarter initiatives into executable milestones. Mitigates high-blast-radius risks upfront. |
| **Influence & Scope** | Sets technical direction across 2-4 teams. Elevates team code review and testing standards. |
| **People & Mentorship** | Actively mentors Senior (L5) engineers toward Staff. Conducts rigorous interview evaluations. |

## 3. Promotion Evidence Requirements
- Must demonstrate sustained performance at the L6 level for at least 2 consecutive quarters prior to promotion.
- Authored at least 2 major accepted RFCs that unlocked measurable business or reliability gains.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Promoting Based on Tenure Alone**: Promoting engineers simply because they have been at the company for 2 years rather than demonstrating higher scope of influence.
- ❌ **Management as the Only Growth Path**: Forcing technical wizards to become people managers just to get a salary increase.
- ❌ **Vague Promotion Goals**: Telling engineers *"Just show more leadership"* instead of setting concrete, measurable milestone goals.

---

## 6. Real-World Production Example

```markdown
**Career Ladder Rollout**:
- Implemented clear 5-level IC ladder.
- Eliminated engineering compensation dissatisfaction and reduced unwanted senior engineer turnover from 24% to 4% annually.
```
