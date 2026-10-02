# Skill: Codebase Freeze & Mutation Safety Guard
`id`: `kbcodedev/codebase-freeze-unfreeze-guard`  
`category`: `01-agentic-orchestration`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Locking down codebase files during delicate refactorings, production hotfixes, or autonomous agent loops to prevent accidental edits to sensitive or out-of-scope files.
- **Triggers**: Pre-release freeze, sensitive configuration protection, autonomous agent boundary enforcement.
- **Prerequisites**: Git repository working tree, file scope whitelist.

---

## 2. Core Mental Model & Invariant Principles
1. **Explicit Scope Whitelisting**: An agent may ONLY mutate files explicitly declared in the task scope. All other files in the workspace are considered strictly frozen.
2. **Atomic Pre-Commit Diff Inspection**: Before committing, inspect `git status --short` and `git diff --stat` to guarantee that zero unrequested files were touched.
3. **Instant Reversion of Drift**: If an out-of-scope file is modified, automatically revert that file (`git checkout -- <file>`) before proceeding.

---

## 3. High-Signal Execution Workflow

```
[Agent Task Scope Declared (e.g. src/auth/*)]
                      │
                      ▼
┌─────────────────────────────────────────────┐
│ Phase 1: Set Frozen File Whitelist Boundary │ ── Whitelist: [src/auth/*]; Frozen: [All else]
└─────────────────────┬───────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│ Phase 2: Intercept Tool Call Path           │ ── Validate target path against whitelist
└─────────────────────┬───────────────────────┘
         ┌────────────┴────────────┐
     [Allowed]                 [Frozen]
         ▼                         ▼
┌─────────────────┐       ┌────────────────────────────────────────┐
│ Execute Edit    │       │ Block Action & Alert: File is Frozen!  │
└─────────────────┘       └────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "allowed_files": ["src/billing/invoice.ts", "tests/billing/invoice.test.ts"],
  "attempted_action": "edit_file('src/config/database.ts')"
}
```

### Output Contract
```json
{
  "status": "BLOCKED_MUTATION_GUARD",
  "reason": "File 'src/config/database.ts' is outside the declared task scope. Codebase is FROZEN for all non-billing files.",
  "recommended_action": "Confine edits strictly to 'src/billing/invoice.ts' or request explicit user scope expansion."
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Silent Scope Creep**: "Cleaning up" or refactoring unrelated files while fixing a localized bug.
- ❌ **Touching Lockfiles Unprompted**: Regenerating `package-lock.json` or `poetry.lock` when the user asked for a simple logic edit.
- ❌ **Unstaging Collateral Edits**: Leaving modified unrelated files in the working tree when delivering the task.

---

## 6. Real-World Production Example

```markdown
**Mutation Guard in Action**:
- Agent was tasked with updating an email template.
- Attempted to refactor the entire `NotificationManager.ts` class.
- Mutation Guard intercepted the edit, confining the diff to `templates/welcome.html`, avoiding 4 unintended regressions.
```
