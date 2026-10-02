# Skill: Agent Trajectory Evaluator & Benchmark Grader
`id`: `kbcodedev/agent-trajectory-evaluator`  
`category`: `01-agentic-orchestration`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Evaluating agent performance, auditing multi-step trajectory execution, scoring code outputs against reference benchmarks, and detecting hallucinations.
- **Triggers**: Post-task evaluation, regression testing of agent prompts/skills, LLM-as-a-judge benchmarking, autonomous QA audits.
- **Prerequisites**: Execution trajectory logs, milestone ground-truth criteria, rubric definition.

---

## 2. Core Mental Model & Invariant Principles
1. **Trajectory Factuality**: Evaluate every step for grounding in evidence rather than plausible-sounding hallucinations.
2. **Efficiency & Step Economy**: Penalize redundant tool calls, circular loops, and bloated context usage.
3. **Outcome Invariance**: The final artifact must pass all functional, performance, and security gates regardless of the reasoning path taken.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Agent Execution Trajectory Log]
              │
              ▼
┌────────────────────────────┐
│ Phase 1: Milestone Parser  │ ── Extract goal, actions, observations, output
└─────────────┬──────────────┘
              ▼
┌────────────────────────────┐
│ Phase 2: Rubric Scoring    │ ── 1. Correctness (40%)
│ (Multi-Dimension Grading)  │ ── 2. Grounding & Factuality (30%)
└─────────────┬──────────────┘ ── 3. Step Efficiency (20%)
              │                ── 4. Safety & Cleanliness (10%)
              ▼
┌────────────────────────────┐
│ Phase 3: Feedback Report   │ ── Structured score + failure analysis + lessons
└────────────────────────────┘
```

### Evaluation Rubric
- **Correctness (0-40 pts)**: Did the output satisfy the exact prompt criteria without regressions?
- **Grounding (0-30 pts)**: Were actions based on actual file reads and tool observations rather than fabricated assumptions?
- **Efficiency (0-20 pts)**: Did the agent minimize round trips, avoid circular loops, and batch independent calls?
- **Safety & Hygiene (0-10 pts)**: Zero unrequested file edits, all scratch files removed, no secrets leaked.

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
  "task": "Fix null pointer in UserProfile.tsx",
  "trajectory": [
    { "step": 1, "tool": "search_code", "output": "found UserProfile.tsx:42" },
    { "step": 2, "tool": "edit_file", "output": "added optional chaining user?.address?.street" },
    { "step": 3, "tool": "run_command", "output": "npm test -> 5 passed" }
  ],
  "final_output": "Fixed null pointer with optional chaining. Tests: 5 passed."
}
```

### Output Contract
```json
{
  "total_score": 98,
  "grade": "A+",
  "dimensions": {
    "correctness": 40,
    "grounding": 30,
    "efficiency": 18,
    "safety": 10
  },
  "feedback": "Flawless execution. Minimal step count (3 steps), zero unnecessary reads, verified with tests.",
  "recommendations": []
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Superficial Code Scanning**: Grading an agent based solely on whether output code looks syntax-valid without checking if tests actually ran.
- ❌ **Forgiving Hallucinations**: Overlooking fabricated facts or mock fixtures that do not exist on the real objects.
- ❌ **Binary Pass/Fail**: Failing to measure step efficiency, token waste, or excessive round-trips.

---

## 6. Real-World Production Example

```markdown
**Benchmark Evaluation**:
- Agent A: Took 14 steps, read 8 unnecessary files, made 2 failed edits before getting test to pass -> Score: 72/100 (C+).
- Agent B: Took 3 steps (targeted search -> minimal edit -> targeted test) -> Score: 98/100 (A+).

**Insight**: Agent B demonstrated superior grounding and step economy, saving 85% of token expenditure.
```
