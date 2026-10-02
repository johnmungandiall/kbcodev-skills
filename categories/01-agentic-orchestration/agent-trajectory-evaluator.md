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
