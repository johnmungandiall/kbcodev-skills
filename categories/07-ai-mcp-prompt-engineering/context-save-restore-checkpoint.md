# Skill: Context Save & State Checkpoint Serializer
`id`: `kbcodedev/context-save-restore-checkpoint`  
`category`: `07-ai-mcp-prompt-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Serializing and checkpointing complex agent execution state, open hypotheses, and task memory to disk, allowing seamless session restoration across LLM restarts or context compactions.
- **Triggers**: Session state checkpointing, multi-day coding tasks, handoff between specialized subagents, recovery after process restart.
- **Prerequisites**: Persistent disk storage (`.kbcode/state/` or JSON checkpoint file).

---

## 2. Core Mental Model & Invariant Principles
1. **High-Density State Serialization**: Capture the complete operational truth: Active Goal, Validated Hypotheses, Modified Files, Test Status, Open Doubts, and Next Concrete Step.
2. **Zero-Loss Restoration**: Loading a checkpoint must immediately equip any agent with 100% operational context without re-reading the entire git history or re-running tests.
3. **Atomic File Writes**: Write checkpoints to temporary `.tmp` files before renaming to prevent state corruption during power or process interruption.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Agent Completes Milestone / End of Turn]
                    │
                    ▼
┌───────────────────────────────────────┐
│ Step 1: Synthesize State Payload      │ ── Goal, Files Changed, Verified Proof, Next Step
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Step 2: Atomic Write to Disk          │ ── Write to .kbcode/state/checkpoint.json
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Step 3: Cold Session Restoration      │ ── Read checkpoint & inject directly into worklog
└───────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "checkpoint_action": "SAVE",
  "goal": "Migrate database connection pooling from pg to Supavisor",
  "next_step": "Run load benchmark tests on port 6543"
}
```

### Output Contract
```json
{
  "checkpoint_version": "2.0.0",
  "timestamp": "2026-10-02T14:45:00Z",
  "state": {
    "goal": "Migrate database connection pooling from pg to Supavisor",
    "completed_milestones": [
      "Updated prisma/schema.prisma with directUrl and transaction pooler URL",
      "Configured connection limits in .env"
    ],
    "modified_files": [
      "prisma/schema.prisma",
      "src/lib/db.ts"
    ],
    "verification_proof": "Prisma schema validated successfully via prisma validate",
    "next_step": "Run load benchmark tests on port 6543 via k6"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Saving Raw Massive Logs**: Storing 50,000 lines of terminal output in the checkpoint JSON, bloating the save file.
- ❌ **Missing the `next_step`**: Creating checkpoints that summarize the past but leave the resuming agent with no concrete direction on what to do next.
- ❌ **Non-Atomic Checkpoint Overwrites**: Writing directly to the active state file, corrupting data if killed mid-write.

---

## 6. Real-World Production Example

```markdown
**State Restoration**:
- Session was interrupted due to a laptop battery shutdown.
- On reboot, agent read `.kbcode/state/checkpoint.json`, restored exact worklog state, and resumed execution on the next step in 2 seconds.
```
