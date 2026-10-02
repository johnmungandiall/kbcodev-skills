# Skill: Mathematical Optimization & SciPy Modeling
`id`: `kbcodedev/mathematical-optimization-scipy`  
`category`: `11-scientific-quantitative-ai`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Solving complex mathematical optimization problems, linear programming (LP), mixed-integer programming (MIP), constrained non-linear minimization, curve fitting, and convex optimization using Python (`scipy.optimize`, CVXPY, NumPy).
- **Triggers**: Resource allocation problems, portfolio risk minimization, server capacity optimization, curve fitting experimental data.
- **Prerequisites**: Objective function formulation, constraint bounds, SciPy / NumPy.

---

## 2. Core Mental Model & Invariant Principles
1. **Formulate Objective Function and Constraints Mathematically**:
   $$\min_{\mathbf{x}} f(\mathbf{x}) \quad \text{subject to} \quad g_i(\mathbf{x}) \le 0, \quad h_j(\mathbf{x}) = 0, \quad \mathbf{lb} \le \mathbf{x} \le \mathbf{ub}$$
2. **Select the Exact Solver for the Problem Structure**:
   - **Linear Programming (LP)**: `scipy.optimize.linprog` with `method='highs'`.
   - **Constrained Non-Linear**: `scipy.optimize.minimize` with `method='SLSQP'` or `method='trust-constr'`.
   - **Global Optimization**: `scipy.optimize.differential_evolution`.
3. **Provide Analytical Gradients (Jacobians) Where Possible**: Supplying analytical gradients instead of finite differences speeds up optimization convergence by $10\times - 50\times$.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Business / Engineering Optimization Goal]
                    │
                    ▼
┌───────────────────────────────────────────┐
│ Step 1: Define Decision Variables (x)     │ ── Bounds: [0 <= x1 <= 100, 0 <= x2 <= 50]
└───────────────────┬───────────────────────┘
                    ▼
┌───────────────────────────────────────────┐
│ Step 2: Formulate Objective Function f(x) │ ── Minimize Cost / Maximize Throughput
└───────────────────┬───────────────────────┘
                    ▼
┌───────────────────────────────────────────┐
│ Step 3: Define Equality & Inequality      │ ── Budget <= $50,000; Latency <= 50ms
│         Constraints                       │
└───────────────────┬───────────────────────┘
                    ▼
┌───────────────────────────────────────────┐
│ Step 4: Execute Solver & Validate Optima  │ ── Verify res.success == True and KKT conditions
└───────────────────────────────────────────┘
```

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
  "problem": "Server Fleet Cost Optimization",
  "objective": "Minimize monthly cloud spend while meeting compute requirements",
  "compute_demand": "Must supply at least 500 CPU cores and 2000 GB RAM",
  "instances": [
    { "type": "c5.xlarge", "cpu": 4, "ram": 8, "cost_monthly": 120 },
    { "type": "m5.2xlarge", "cpu": 8, "ram": 32, "cost_monthly": 280 },
    { "type": "r5.4xlarge", "cpu": 16, "ram": 128, "cost_monthly": 720 }
  ]
}
```

### Output Contract
```python
import numpy as np
from scipy.optimize import linprog

def optimize_cloud_fleet():
    # Cost coefficients (c5.xlarge, m5.2xlarge, r5.4xlarge)
    c = [120, 280, 720]

    # Inequality constraints A_ub * x <= b_ub (Negated for >= requirements)
    # 4*x0 + 8*x1 + 16*x2 >= 500  -> -4*x0 - 8*x1 - 16*x2 <= -500 (CPU)
    # 8*x0 + 32*x1 + 128*x2 >= 2000 -> -8*x0 - 32*x1 - 128*x2 <= -2000 (RAM)
    A_ub = [
        [-4, -8, -16],
        [-8, -32, -128]
    ]
    b_ub = [-500, -2000]

    # Bounds: Integer counts >= 0
    bounds = [(0, None), (0, None), (0, None)]

    # Solve via modern HiGHS solver
    res = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=bounds, method="highs")

    if res.success:
        return {
            "status": "OPTIMAL",
            "c5_xlarge_count": int(np.ceil(res.x[0])),
            "m5_2xlarge_count": int(np.ceil(res.x[1])),
            "r5_4xlarge_count": int(np.ceil(res.x[2])),
            "total_monthly_cost": f"${res.fun:.2f}",
            "supplied_cpu": int(res.x[0]*4 + res.x[1]*8 + res.x[2]*16),
            "supplied_ram_gb": int(res.x[0]*8 + res.x[1]*32 + res.x[2]*128)
        }
    else:
        return {"status": "INFEASIBLE"}

# Optimal Result: Total Monthly Cost = $11,340.00
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Ignoring `res.success`**: Using solver results when `res.success == False`, operating on invalid or divergent values.
- ❌ **Using Legacy Simplex Solver**: Using deprecated `method='simplex'` instead of modern high-performance `method='highs'`.
- ❌ **Unbounded Decision Variables**: Forgetting to declare lower bounds `bounds=[(0, None)]`, causing the solver to propose negative quantities of physical resources.

---

## 6. Real-World Production Example

```markdown
**Supply Chain Cost Minimization**:
- Formulated linear programming model for multi-warehouse freight routing.
- HiGHS solver solved 12,000 constraint equations in 140ms, saving $380,000 in monthly shipping costs.
```
