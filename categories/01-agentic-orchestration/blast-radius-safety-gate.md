# Skill: Blast Radius Safety Gate & Permission Auditor
`id`: `kbcodedev/blast-radius-safety-gate`  
`category`: `01-agentic-orchestration`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Preventing destructive, irreversible, or high-blast-radius operations on files, databases, git branches, or infrastructure without explicit safety gating.
- **Triggers**: File deletions, git branch resets (`git reset --hard`), database drops/migrations, production deployments, system package installations.
- **Prerequisites**: Blast-radius estimation model, non-destructive alternative search, user confirmation protocols.

---

## 2. Core Mental Model & Invariant Principles
1. **Blast Radius Calculus**: Categorize actions into Tier 1 (Safe/Reversible), Tier 2 (Moderate/Local State Change), Tier 3 (Destructive/Irreversible/External Impact).
2. **Least Destructive First**: Always attempt non-destructive alternatives (e.g. archiving to `.bak`, creating a new branch, soft-deleting) before hard mutations.
3. **Single-Level Enumerated Approval**: When asking the user for confirmation on Tier 3 actions, present a flat, single-level numbered roster with your recommended option highlighted.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Proposed High-Impact Action]
             │
             ▼
┌───────────────────────────┐
│ Blast Radius Evaluation   │ ── Calculate scope of damage / irreversibility
└────────────┬──────────────┘
             ▼
      [Risk Tiering]
   ┌─────────┼─────────┐
   ▼         ▼         ▼
[Tier 1]  [Tier 2]  [Tier 3]
 (Low)     (Medium)  (High)
   │         │         │
   ▼         ▼         ▼
[Auto-    [Backup &  [Block & Present Flat
 Execute]  Execute]   Numbered Options Roster]
```

### Risk Tier Definitions
- **Tier 1 (Safe)**: Reads, local targeted edits, running tests, creating non-tracked files.
- **Tier 2 (Moderate)**: Overwriting existing configuration files, running non-destructive DB migrations, modifying build configs. *Requirement: Automatic `.bak` backup or git stash point.*
- **Tier 3 (High / Destructive)**: Deleting directories, `git push --force`, `DROP TABLE`, running shell commands with elevated permissions. *Requirement: Mandatory User Confirmation.*

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
  "action_type": "git_reset",
  "command": "git reset --hard HEAD~5",
  "target_path": "C:/dev/project",
  "uncommitted_changes": 4
}
```

### Output Contract
```json
{
  "risk_tier": "Tier 3 (High)",
  "blast_radius": "Loss of 4 uncommitted files and 5 recent local commits",
  "safety_action": "BLOCKED_PENDING_APPROVAL",
  "non_destructive_alternative": "git stash && git branch backup-branch",
  "roster": [
    "1. Stash uncommitted changes, create backup branch, then reset to HEAD~5 (recommended)",
    "2. Soft reset (git reset --soft HEAD~5) keeping changes staged",
    "3. Cancel reset operation"
  ]
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Silent Destructive Execution**: Running `rm -rf` or `git reset --hard` without verifying uncommitted work.
- ❌ **Over-Asking on Trivial Actions**: Pestering the user with confirmation prompts for harmless, easily reversible edits.
- ❌ **Nested / Multi-Tiered Roster Prompts**: Presenting confusing questions with sub-options (e.g. 1a, 1b, 2.1) instead of a simple flat 1, 2, 3 list.

---

## 6. Real-World Production Example

```markdown
**Scenario**: User requests removing unused database migration files.

**Safety Gate Evaluation**:
- Target: `migrations/003_add_orders.sql`
- Check: Has this migration been applied to the live database?
- Finding: Migration is recorded in `schema_migrations`. Deleting it will break future migration sync.

**Action**:
Instead of deleting blindly, recommend archiving to `migrations/archive/` or creating a rollback migration `004_revert_orders.sql`. Present numbered options cleanly to the user.
```
