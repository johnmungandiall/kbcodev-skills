# Skill: Dario Amodei Scaling Laws & AI Safety Architecture
`id`: `kbcodedev/dario-amodei-scaling-safety`  
`category`: `18-yc-tech-leaders-frameworks`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Designing AI safety guardrails, understanding empirical LLM compute scaling laws (Chinchilla / Kaplan), mechanistic interpretability principles, and managing AI existential/operational risks.
- **Triggers**: AI model safety auditing, compute budget allocation, fine-tuning vs pre-training decisions, evaluating prompt injection vulnerabilities.
- **Prerequisites**: Neural network compute scaling principles ($N$ parameters, $D$ dataset tokens, $C$ FLOPs).

---

## 2. Core Mental Model & Invariant Principles
1. **Empirical Compute Scaling Laws**: Model performance scales as a power law with Compute ($C$), Dataset Size ($D$), and Parameter Count ($N$), provided compute is allocated optimally ($D \approx 20 \times N$).
2. **Constitutional AI & Rule-Based RL**: Steer model behavior using explicit constitutional principles and self-critique loops rather than purely relying on subjective human feedback (RLHF).
3. **Responsible Scaling Policies (RSP)**: Define explicit safety capability thresholds (e.g. Autonomous Cyber Defense, CBRN risk) with mandatory pre-deployment safety evaluations.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[AI System Architecture & Training / Deploy Plan]
                        │
                        ▼
┌───────────────────────────────────────────────┐
│ Phase 1: Compute & Token Budget Optimization  │ ── Chinchilla optimal compute allocation
└───────────────────────┬───────────────────────┘
                        ▼
┌───────────────────────────────────────────────┐
│ Phase 2: Constitutional Self-Critique Gate    │ ── Model critiques output against safety rules
└───────────────────────┬───────────────────────┘
                        ▼
┌───────────────────────────────────────────────┐
│ Phase 3: Adversarial Red-Teaming              │ ── Prompt injection, jailbreak stress tests
└───────────────────────┬───────────────────────┘
                        ▼
┌───────────────────────────────────────────────┐
│ Phase 4: Safe Production Deployment           │ ── Continuous evaluation & bounded agency
└───────────────────────────────────────────────┘
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
  "system": "Autonomous AI Code Review & Deployment Agent",
  "risk_profile": "Agent has permissions to edit code and merge PRs"
}
```

### Output Contract
```markdown
# AI Safety & Bounded Agency Architecture (Dario Amodei Framework)

## 1. Bounded Operational Agency
- **Principle**: An AI agent must never possess un-monitored unilateral authority to execute destructive actions.
- **Hard Technical Guardrail**: All code modifications must pass automated CI security tests and require human approval for Tier-3 actions (Infrastructure, Database, Production Deploys).

## 2. Constitutional Self-Critique Step
Before emitting final code patches, the agent executes an internal evaluation pass:
```markdown
<safety_check>
1. Does this diff introduce hardcoded credentials or secret leaks? (PASS)
2. Does this code introduce unauthenticated API routes? (PASS)
3. Does this change alter database schemas destructively? (PASS)
</safety_check>
```

## 3. Sandboxed Execution Environment
All code generated by the agent executes inside isolated ephemeral Docker containers with no access to production networks or AWS credentials.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Unbounded Agent Authority**: Granting an AI agent raw production database write credentials with zero human-in-the-loop gates.
- ❌ **Under-Training Over-Sized Models**: Training a 70B model on only 100B tokens (severely compute sub-optimal according to Chinchilla scaling laws).
- ❌ **Ignoring Adversarial Red-Teaming**: Launching LLM customer-facing apps without testing indirect prompt injection defenses.

---

## 6. Real-World Production Example

```markdown
**Constitutional AI Filter**:
- Implemented a 1-step constitutional safety critique on customer-facing chatbot.
- Reduced prompt injection vulnerability exploits by 99.2% without degrading legitimate user conversation quality.
```
