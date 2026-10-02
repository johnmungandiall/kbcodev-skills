# Skill: Multi-Agent Swarm & Supervisor Orchestration
`id`: `kbcodedev/multi-agent-swarm`  
`category`: `01-agentic-orchestration`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Large, multi-faceted tasks that exceed a single context window or require concurrent division of labor across isolated domains.
- **Triggers**: Complex codebase migrations, parallel security/dependency audits, end-to-end fullstack features with separate backend/frontend scopes.
- **Prerequisites**: Modular task boundary definition, subagent dispatch capability, strict owner-file isolation.

---

## 2. Core Mental Model & Invariant Principles
1. **Context Isolation**: Each specialized subagent operates in its own clean context window, returning only high-density synthesis digests.
2. **File Ownership Exclusivity (`owns`)**: No two concurrent subagents may write to the same file. Concurrent writes are strictly partitioned.
3. **Supervisor-Worker Hierarchy**: The supervisor decomposes, routes, monitors, and reconciles; workers execute within tightly bounded scopes.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
             ┌─────────────────────────┐
             │  Supervisor / Director  │
             └────────────┬────────────┘
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
 ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
 │ Explorer     │  │ Backend Dev  │  │ Frontend Dev │
 │ (Read-Only)  │  │ (Owns: api/) │  │ (Owns: ui/)  │
 └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
        └─────────────────┼─────────────────┘
                          ▼
             ┌─────────────────────────┐
             │ Integration & Gate Check│
             └─────────────────────────┘
```

### Phase 1: Task Partitioning & Contract Definition
- Deconstruct the master objective into independent, non-overlapping worker contracts.
- Assign agent types based on tooling needs:
  - `code-explorer` (Read-only, discovery, research)
  - `autopilot` (Full write/exec capabilities)
  - `qa-verifier` (Test execution & assertion)

### Phase 2: Parallel Dispatch & State Monitoring
- Dispatch independent worker branches concurrently in a single round.
- Explicitly declare `owns: [...]` boundaries to prevent race conditions.
- Enforce step budgets per subagent (e.g., 10-30 steps) to prevent rogue execution.

### Phase 3: Fan-In Synthesis & Integration Verification
- Ingest worker digests and resolve inter-module dependencies.
- Execute unified integration test suite across combined changes.
- Finalize documentation and release notes in a single consolidated pass.

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "mission": "Migrate auth service from session cookies to JWT tokens",
  "subagents": [
    {
      "name": "backend-auth",
      "agent": "autopilot",
      "owns": ["src/server/auth.py", "src/server/middleware.py"],
      "task": "Implement JWT issue and verify middleware"
    },
    {
      "name": "frontend-auth",
      "agent": "autopilot",
      "owns": ["src/client/apiClient.ts", "src/client/hooks/useAuth.ts"],
      "task": "Store JWT in memory and attach Authorization header"
    }
  ]
}
```

### Output Contract
```json
{
  "status": "completed",
  "branches_executed": 2,
  "results": {
    "backend-auth": "JWT middleware added and tested with 8 unit tests",
    "frontend-auth": "Axios interceptor configured and useAuth hook updated"
  },
  "integration_test": "Integration suite: 14 passed in 2.8s"
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Unpartitioned Concurrent Writes**: Letting two workers write to the same shared directory or config file without synchronization.
- ❌ **Context Flooding**: Passing full multi-thousand-line file logs between subagents instead of concise structured summaries.
- ❌ **Orphaned Subagents**: Dispatching workers without monitoring their completion or integrating their outputs.

---

## 6. Real-World Production Example

```markdown
**Scenario**: Refactor database models and update REST API endpoints simultaneously.

**Supervisor Dispatch**:
1. Worker A (DB Specialist):
   - Scope: `models/user.py`, `migrations/004_user.sql`
   - Deliverable: Added `organization_id` column with index and migration script.
2. Worker B (API Specialist):
   - Scope: `controllers/user_controller.py`, `schemas/user_dto.py`
   - Deliverable: Updated DTO validation schema and controller endpoints.

**Reconciliation**:
Supervisor runs `pytest tests/api/test_user.py` -> 100% pass rate -> Combined commit staged.
```
