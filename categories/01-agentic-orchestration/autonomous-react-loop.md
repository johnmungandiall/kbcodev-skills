# Skill: Autonomous ReAct Loop & Decision Engine
`id`: `kbcodedev/autonomous-react-loop`  
`category`: `01-agentic-orchestration`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Long-running autonomous tasks requiring multi-step reasoning, dynamic tool dispatch, hypothesis testing, and continuous environment feedback.
- **Triggers**: Autonomous coding flows, multi-file code refactoring, system troubleshooting, unattended agent pipelines.
- **Prerequisites**: Executable toolset (read/write/command), verifiable goal specification, bounded step budget.

---

## 2. Core Mental Model & Invariant Principles
1. **Thought-Action-Observation Triad**: Never execute a tool without a clear hypothesis; never form a new hypothesis without grounding in the latest observation.
2. **Loop & Oscillation Detection**: If an identical tool signature is invoked 3 times with unchanged state, force a strategy pivot immediately.
3. **Dynamic Step Budget Allocation**: Size the step budget dynamically from the task blast radius and uncertainty (`max_steps = f(blast_radius, affected_files, uncertainty)`), dynamically balancing discovery, execution, and verification phases to the specific task rather than enforcing a static step constant.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[User Request]
       │
       ▼
┌──────────────┐
│  Phase 1:    │ ── State Check & Grounding (read files, verify baseline)
│  Discovery   │
└──────┬───────┘
       ▼
┌──────────────┐
│  Phase 2:    │ ── Formulate Hypothesis -> Pick Minimal Action -> Execute
│  ReAct Loop  │ ── Observe Result -> Compare Against Target State
└──────┬───────┘
       │  ▲ (Iterate until Goal Achieved or Step Budget Reached)
       ▼  │
┌──────────────┐
│  Phase 3:    │ ── Targeted Falsification & Blast-Radius Check
│ Verification │
└──────┬───────┘
       ▼
[Structured Outcome Hand-off]
```

### Phase 1: State Grounding
- Inspect current workspace state before mutating anything.
- Verify environment prerequisites (compiler, runtime, test runner, git cleanliness).
- Define the invariant "Done Condition" in verifiable programmatic terms.

### Phase 2: Autonomous ReAct Execution
- **Thought**: State what is known, what is missing, and the single next hypothesis.
- **Action**: Emit the most focused, minimal tool call (batching independent operations when possible).
- **Observation**: Ingest raw tool output, extract proof-of-work, and discard noisy logs.
- **Circuit Breaker**: If error repeats twice, switch from forward-execution to diagnostic probing.

### Phase 3: Verification & Invariant Proof
- Execute targeted unit/integration checks proving the fix or feature works.
- Verify zero collateral damage on untouched modules.
- Ensure all intermediate scratch files are wiped clean.

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "task_description": "string (verifiable objective)",
  "max_steps": 40,
  "allowed_tools": ["read_file", "write_file", "edit_file", "run_command"],
  "exit_criteria": "string (exact condition determining success)"
}
```

### Output Contract
```json
{
  "status": "success | failed | budget_exhausted",
  "steps_used": 14,
  "actions_taken": [
    { "step": 1, "tool": "read_file", "outcome": "verified bug in auth.py#login" },
    { "step": 2, "tool": "edit_file", "outcome": "patched JWT expiration check" }
  ],
  "verification_proof": "Tests: 4 passed, 0 failed in 1.2s",
  "summary": "Crisp one-line delivery description"
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Blind Trial-and-Error**: Making arbitrary code edits hoping tests will pass without diagnosing root cause.
- ❌ **Silent Loop Spin**: Re-running the exact same failed command 4+ times without altering arguments or environment.
- ❌ **Premature Completion**: Declaring victory when a file is edited without proving runtime reachability and test execution.

---

## 6. Real-World Production Example

```markdown
**Task**: Resolve token refresh race condition in `src/auth/session.ts`.

**Step 1 (Thought)**: Locate the token refresh mutex and check current concurrency handling.
**Step 1 (Action)**: `read_file(path="src/auth/session.ts", symbol="refreshToken")`
**Step 1 (Observation)**: Found un-synchronized async call allowing concurrent refresh requests.

**Step 2 (Thought)**: Implement promise-deduplication queue so concurrent callers share one in-flight promise.
**Step 2 (Action)**: `edit_file(path="src/auth/session.ts", old_string="...", new_string="...")`
**Step 2 (Observation)**: File edited cleanly.

**Step 3 (Thought)**: Run concurrent refresh tests to verify race condition is resolved.
**Step 3 (Action)**: `run_command(command="npm test test/auth/session.test.ts")`
**Step 3 (Observation)**: 6/6 tests passed.

**Outcome**: Fixed: Session token refresh deduplication prevents multiple concurrent refresh requests. Tests: 6 passed.
```
