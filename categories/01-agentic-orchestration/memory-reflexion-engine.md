# Skill: Memory Reflexion & Episodic Self-Correction
`id`: `kbcodedev/memory-reflexion-engine`  
`category`: `01-agentic-orchestration`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Trapping execution errors, learning from unexpected tool failures, and preventing repetitive mistakes across long sessions and future runs.
- **Triggers**: Command failure, syntax error on edit, failed test assertion, user correction, schema validation failure.
- **Prerequisites**: Mistake recording tool (`note_mistake`), long-term memory engine (`remember`), session cleanup (`clear_mistakes`).

---

## 2. Core Mental Model & Invariant Principles
1. **Immediate Reflexion**: Note a mistake the exact moment it occurs—do not wait for the entire task to fail before analyzing.
2. **Binding Behavioral Rule**: A recorded mistake immediately injects a mandatory negative constraint for all subsequent steps in the session.
3. **Episodic to Semantic Memory**: Transient session mistakes that reveal durable architectural or user-specific facts are promoted to long-term memory (`remember(kind='lesson')`).

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Tool Execution Failure / User Correction]
                     │
                     ▼
       ┌───────────────────────────┐
       │ Step 1: Root Cause Probe  │ ── Identify exact mechanism of failure
       └─────────────┬─────────────┘
                     ▼
       ┌───────────────────────────┐
       │ Step 2: Immediate Mistake │ ── Call note_mistake(mistake, rule)
       │         Binding           │    Rule becomes active constraint
       └─────────────┬─────────────┘
                     ▼
       ┌───────────────────────────┐
       │ Step 3: Corrective Action │ ── Execute alternative path adhering to rule
       └─────────────┬─────────────┘
                     ▼
       ┌───────────────────────────┐
       │ Step 4: Durable Promotion │ ── Promote to remember(kind='lesson')
       │         & Cleanup         │    Clear transient mistake list
       └───────────────────────────┘
```

### Phase 1: Failure Diagnosis & Attribution
- Analyze the exact stderr, traceback, or correction.
- Distinguish between transient external errors (network glitch) and procedural/logic errors (wrong API usage, broken selector, missing import).

### Phase 2: Ingestion & Active Rule Synthesis
- Frame the mistake in one factual sentence: *"What went wrong"*.
- Formulate a precise, actionable imperative rule: *"What to do instead"*.
- Inject rule into active agent context.

### Phase 3: Durable Memory Consolidation
- Upon successful task delivery, evaluate if the lesson applies across sessions.
- If durable, record via `remember(kind="lesson", content="...")`.
- Clean transient session state via `clear_mistakes()`.

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
  "failure_event": {
    "action": "run_command('pytest tests/test_payment.py')",
    "error_output": "ModuleNotFoundError: No module named 'stripe'",
    "context": "Virtualenv was not activated in shell subshell"
  }
}
```

### Output Contract
```json
{
  "mistake": "Ran pytest directly without activating the virtual environment in .venv",
  "rule": "Always invoke Python tools via .venv/bin/pytest or source .venv/bin/activate first",
  "durable_lesson_saved": true,
  "transient_cleared": true
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Ignoring Failures**: Proceeding to subsequent steps after a command failed, pretending it succeeded.
- ❌ **Vague Rules**: Creating useless rules like *"Be more careful with Python"* instead of concrete rules like *"Invoke .venv/bin/python"*.
- ❌ **Mistake Accumulation**: Never clearing resolved transient mistakes, cluttering the prompt context.

---

## 6. Real-World Production Example

```markdown
**Failure**: An edit replaced an import in `api.py` but missed a secondary usage in `middleware.py`, causing `NameError: decode_token is not defined`.

**Immediate Reflexion**:
- Call: `note_mistake(mistake="Edited decode_token in api.py without checking callers in middleware.py", rule="Always search for all external symbol callers across the workspace before renaming or moving a function")`
- Action: Fixed import in `middleware.py` and ran test suite.
- Verification: Tests 100% green.
- Resolution: Promoted to `remember(kind='lesson', key='refactor_caller_check', ...)` and called `clear_mistakes()`.
```
