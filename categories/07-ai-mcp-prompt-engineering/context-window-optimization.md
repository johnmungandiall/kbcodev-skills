# Skill: Context Window Optimization & KV-Cache Compaction
`id`: `kbcodedev/context-window-optimization`  
`category`: `07-ai-mcp-prompt-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Managing long agent sessions, preventing context window overflow, maximizing KV-cache reuse, compacting conversation history, and maintaining session state integrity.
- **Triggers**: Context usage > 60% of window limit, multi-turn coding sessions, repetitive large tool result outputs.
- **Prerequisites**: Session worklog tool (`update_worklog`), targeted search/read tools (`read_file` with offset/symbol).

---

## 2. Core Mental Model & Invariant Principles
1. **Information Density Over Bulk**: A 20-line high-density summary of decisions, state, and next steps preserves more actionable signal than 10,000 lines of raw command output.
2. **Worklog as Compaction Anchor**: Pin immutable goals, user standing rules, and state milestones in a structured worklog that survives turn compaction.
3. **Minimal Targeted Reads**: Never read entire 5,000-line files when `search_code` can locate the exact 15-line target range.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Growing Session Context (>50k tokens)]
                   │
                   ▼
┌──────────────────────────────────────┐
│ Phase 1: Identify Redundant History  │ ── Intermediate tool outputs, raw build logs
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: Extract Durable Decisions   │ ── User constraints, verified fixes, architecture
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Synthesize Worklog State    │ ── Goal + Standing Rules + Current State + Next Step
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Compact & Prune History     │ ── Replace raw turns with structured [Recap]
└──────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "total_context_tokens": 142000,
  "max_context_window": 200000,
  "turns_to_compact": 18
}
```

### Output Contract
```markdown
# Session State Compaction Record

## Goal
Migrate authentication service from legacy session cookies to JWT tokens.

## User Standing Rules
- Do not modify database schemas without backward compatibility.
- Ensure all unit tests in `tests/auth/` pass before marking complete.

## Decisions & History
- [14:10] Identified race condition in token refresh queue.
- [14:15] Replaced in-memory session map with Redis token store.
- [14:22] Patched `src/auth/jwt.ts` and added 6 unit tests.

## Current State & Next Step
- **Current State**: Backend JWT issue and verification complete (tests 6/6 passed).
- **NEXT STEP**: Update frontend API client in `src/client/apiClient.ts` to attach Authorization header.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Reading Entire Large Files into Context**: Invoking `read_file` without offset/limit on massive minified JS or log files.
- ❌ **Losing User Standing Rules during Compaction**: Forgetting explicit user preferences when summarizing older turns.
- ❌ **Compaction Without a Next Step**: Creating recaps that leave the agent with no clear concrete next action.

---

## 6. Real-World Production Example

```markdown
**Context Optimization**:
- Compacted 35 turns of debugging logs into a 250-token structured worklog digest.
- Token consumption per subsequent turn dropped from 140,000 tokens to 12,000 tokens (91% reduction in input token cost and 5x faster inference).
```
