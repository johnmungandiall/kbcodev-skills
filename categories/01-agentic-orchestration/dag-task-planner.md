# Skill: Dynamic DAG Task Planner & Executor
`id`: `kbcodedev/dag-task-planner`  
`category`: `01-agentic-orchestration`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Complex multi-stage workflows with clear prerequisite dependencies, parallelizable execution branches, and dynamic mid-flight adjustments.
- **Triggers**: Architectural refactorings, multi-module features, full-stack migrations, benchmark test matrices.
- **Prerequisites**: Dependency graph formulation, task checklist tool (`manage_todos`), failure rollback paths.

---

## 2. Core Mental Model & Invariant Principles
1. **Strict Dependency Gating**: An item whose `needs` list contains incomplete prerequisites must NEVER be started.
2. **Maximum Autonomous Concurrency**: All nodes with 0 unsatisfied dependencies must be executed concurrently.
3. **Mid-Flight Dynamic Spawning**: When new subtasks or bugs are discovered during execution, dynamically insert nodes into the DAG without resetting completed progress.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
   [Task 1: Schema Update]       [Task 2: API Contract Spec]
              │                              │
              └──────────────┬───────────────┘
                             ▼
               [Task 3: Backend Implementation] (needs: [1, 2])
                             │
                             ▼
               [Task 4: Frontend UI Updates]    (needs: [3])
                             │
                             ▼
               [Task 5: End-to-End Test Gate]   (needs: [3, 4])
```

### Phase 1: Dependency Graph Construction
- Break down high-level requirement into discrete, atomic execution units.
- Define explicit prerequisite arrays (`needs: [1, 2]`) for items requiring prior outputs.
- Keep independent nodes unlinked to enable parallel execution.

### Phase 2: Topological Execution & State Dispatch
- Execute all unblocked root tasks in parallel.
- Upon completion of any task, immediately update status to `done` and evaluate newly unblocked downstream nodes.
- Maintain transparent progress tracking with percentage and completion ratios.

### Phase 3: Dynamic Graph Mutation (Spawn / Prune)
- If unexpected edge cases or failing tests arise, invoke dynamic spawn operations to attach child tasks to the failing node.
- Prune redundant or invalidated downstream tasks when upstream decisions change.

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "workflow_name": "Fullstack Payment Gateway Integration",
  "nodes": [
    { "id": 1, "task": "Create Stripe webhook handler endpoint", "status": "pending" },
    { "id": 2, "task": "Design checkout UI component", "status": "pending" },
    { "id": 3, "task": "Connect checkout UI to Stripe SDK", "status": "pending", "needs": [1, 2] },
    { "id": 4, "task": "Run webhook signature verification tests", "status": "pending", "needs": [1] },
    { "id": 5, "task": "End-to-end checkout flow test", "status": "pending", "needs": [3, 4] }
  ]
}
```

### Output Contract
```json
{
  "status": "completed",
  "total_nodes": 5,
  "completed_nodes": 5,
  "execution_order": [
    ["Node 1", "Node 2"],
    ["Node 3", "Node 4"],
    ["Node 5"]
  ],
  "total_duration_seconds": 18.4
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Artificial Serialization**: Creating a linear `1 -> 2 -> 3 -> 4` chain when tasks 1 and 2 are completely independent.
- ❌ **Circular Dependencies**: Allowing cyclic prerequisite definitions (`Node 1 needs Node 2; Node 2 needs Node 1`).
- ❌ **Batch Updating at End**: Delaying status updates until the entire workflow finishes rather than marking items `done` immediately upon completion.

---

## 6. Real-World Production Example

```markdown
**DAG Execution in Action**:
- Turn 1: Batch execute Task 1 (DB migration) + Task 2 (Generate API types) in parallel.
- Turn 2: Mark Task 1 & 2 `done`. Task 3 (Implement service logic) unblocks.
- Turn 3: Execute Task 3. Midway, discover missing caching layer -> Spawn Task 3a (Add Redis cache, needs: [1]).
- Turn 4: Execute Task 3a -> Complete Task 3 -> Unblock Task 4 (E2E Test).
- Turn 5: Complete Task 4 -> All 5 nodes resolved.
```
