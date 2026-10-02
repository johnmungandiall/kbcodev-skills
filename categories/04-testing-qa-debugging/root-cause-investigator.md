# Skill: Root Cause Investigator & Deep Debugger
`id`: `kbcodedev/root-cause-investigator`  
`category`: `04-testing-qa-debugging`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Diagnosing tricky, intermittent, or complex software defects, stack traces, deadlocks, and behavioral anomalies.
- **Triggers**: Failing test suites, production error alerts, unhandled exceptions, race conditions, unexpected null values.
- **Prerequisites**: Access to logs, stack traces, source code, reproducible test harness.

---

## 2. Core Mental Model & Invariant Principles
1. **Never Guess—Inspect the Stack Frame**: Always inspect the exact stack trace, variable bindings, and execution frame before theorizing solutions.
2. **Fix the Root Cause, Never the Symptom**: Do not slap a band-aid null-check or try/catch around an un-diagnosed defect; fix the underlying state corruption.
3. **5-Whys Diagnostic Method**: Ask "Why did this fail?" recursively until reaching the fundamental design or logic defect.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Defect Reported / Stack Trace]
              │
              ▼
┌─────────────────────────────┐
│ Phase 1: Repro Isolation    │ ── Create minimal, standalone reproduction script
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Phase 2: Frame & State      │ ── Inspect call stack, local variables, thread state
│          Inspection         │
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Phase 3: Root Cause         │ ── Apply 5-Whys to uncover origin of faulty state
│          Identification     │
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Phase 4: Surgical Fix &     │ ── Fix origin + Add regression test preventing relapse
│          Regression Proof   │
└─────────────────────────────┘
```

### 5-Whys Diagnostic Checklist
- **Why 1**: Why did `NullPointerException` occur? *Because `user.getAddress()` returned null.*
- **Why 2**: Why was address null? *Because the registration form allowed empty address submission.*
- **Why 3**: Why did the form allow it? *Because frontend validation was disabled for OAuth logins.*
- **Why 4**: Why was OAuth missing address handling? *Because the OAuth profile mapper didn't default address fields.*
- **Why 5 (Root Cause)**: *OAuth provider mapping schema lacked mandatory default fallback for optional external attributes.*

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
  "error_message": "TypeError: Cannot read properties of undefined (reading 'tier')",
  "stack_trace": "at calculateDiscount (src/pricing.ts:42:15)\nat checkout (src/checkout.ts:88:20)",
  "context": "Occurred when guest users attempted checkout without logging in"
}
```

### Output Contract
```markdown
# Root Cause Diagnostic Report

## 1. Defect Analysis
- **Location**: `src/pricing.ts#calculateDiscount` (Line 42)
- **Mechanism**: `user` parameter was passed as `undefined` for anonymous guest sessions, but `calculateDiscount` assumed `user` was always populated.

## 2. Root Cause
- Architectural mismatch: Pricing service contract did not differentiate between authenticated user discounts and anonymous guest baseline pricing.

## 3. Surgical Fix
- Updated `calculateDiscount(user?: User)` to cleanly evaluate anonymous guest fallback tier before checking user membership.

## 4. Regression Proof
- Added unit test: `test('calculateDiscount returns default for guest user')` -> Passed.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Swallowing Exceptions**: Adding `catch (e) {}` and returning `null` or empty string, masking the defect while corrupting downstream state.
- ❌ **Speculative Fixing**: Changing 5 different files without testing whether the first edit actually resolved the bug.
- ❌ **Missing Regression Test**: Fixing a bug in code without adding a targeted unit test, allowing the bug to resurface in future releases.

---

## 6. Real-World Production Example

```markdown
**Production Triage**: High memory spike and process crash during CSV exports.
- Profiling: Revealed `exportAllUsers()` loaded 2,000,000 database rows into a single in-memory array.
- Root Cause: Missing database stream / cursor pagination.
- Fix: Converted query to PostgreSQL cursor stream piped directly to HTTP response stream. Memory usage dropped from 4GB to 15MB.
```
