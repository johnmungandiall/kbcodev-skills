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
