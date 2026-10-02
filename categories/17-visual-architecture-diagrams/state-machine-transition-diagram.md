# Skill: State Machine & Lifecycle Transition Diagram Synthesis
`id`: `kbcodedev/state-machine-transition-diagram`  
`category`: `17-visual-architecture-diagrams`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Modeling complex entity state lifecycles, finite state machines (FSM), order processing, subscription status changes, and circuit breaker transitions using Mermaid state diagrams.
- **Triggers**: State transition logic design, race condition elimination in entity lifecycles, payment status modeling, drafting workflow specs.
- **Prerequisites**: List of states, allowed transition events, terminal states.

---

## 2. Core Mental Model & Invariant Principles
1. **Deterministic State Transitions**: An entity in state $S_1$ receiving event $E$ must transition deterministically to exactly one state $S_2$. Illegal transitions must throw an explicit error.
2. **Explicit Terminal States (`[*]`)**: Clearly identify terminal states (e.g. `Canceled`, `Refunded`, `Archived`) from which no further state transitions are permitted.
3. **Guard Conditions & Actions**: Annotate transition arrows with triggering events and required guard conditions (`[guard] / action`).

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Entity Lifecycle Requirements (e.g. Subscription)]
                        │
                        ▼
┌──────────────────────────────────────────────┐
│ Step 1: Identify Initial & Terminal States   │ ── Start -> Active -> Canceled -> Terminal
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Step 2: Map Intermediate Transient States    │ ── Past_Due, Trialing, Paused, Pending_Retry
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Step 3: Define Event Triggers & Guards       │ ── PaymentSuccess, PaymentFailed [retries < 3]
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Step 4: Render Mermaid stateDiagram-v2       │ ── Clean, copy-pasteable Mermaid text
└──────────────────────────────────────────────┘
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
  "entity": "E-Commerce Order Lifecycle",
  "states": ["Created", "Payment_Pending", "Paid", "Fulfillment", "Shipped", "Delivered", "Canceled", "Refunded"]
}
```

### Output Contract
```mermaid
stateDiagram-v2
    [*] --> Created : Checkout Initiated

    Created --> Payment_Pending : Submit Payment Details
    Created --> Canceled : User Abandons / Timeout (15 min)

    Payment_Pending --> Paid : Payment Success [Webhook verified]
    Payment_Pending --> Payment_Failed : Card Declined
    Payment_Failed --> Payment_Pending : Retry Payment [Attempts < 3]
    Payment_Failed --> Canceled : Max Retries Exceeded

    Paid --> Fulfillment : Inventory Reserved
    Paid --> Refunded : Immediate Customer Cancellation

    Fulfillment --> Shipped : Carrier Picked Up [Tracking Number Generated]
    Fulfillment --> Refunded : Out of Stock

    Shipped --> Delivered : Delivery Confirmed by Carrier
    Shipped --> Lost_In_Transit : Delivery SLA Breached (>14 Days)
    Lost_In_Transit --> Refunded : Issue Insurance Claim

    Delivered --> Return_Requested : User Initiates Return (30 Days)
    Return_Requested --> Refunded : Item Inspected at Warehouse
    Return_Requested --> Delivered : Return Rejected

    Canceled --> [*]
    Refunded --> [*]
    Delivered --> [*] : Closed (After 30 Days)
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Allowing Undefined Transitions**: Allowing code to transition directly from `Refunded` back to `Shipped` without state validation.
- ❌ **Missing Timeout Transitions**: Leaving entities stranded in transient states (e.g. `Payment_Pending`) indefinitely without automated timeout transitions.
- ❌ **Circular Zombie Loops**: Allowing states to loop infinitely without an exit gate or retry limit.

---

## 6. Real-World Production Example

```markdown
**State Machine Refactoring**:
- Implemented XState / Prisma state machine for subscription billing.
- Eliminated edge-case bug where users in `CANCELED` status were charged monthly renewals due to missing state guard assertions.
```
