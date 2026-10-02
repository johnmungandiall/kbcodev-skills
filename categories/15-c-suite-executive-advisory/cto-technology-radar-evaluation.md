# Skill: CTO Technology Radar & Stack Evaluation
`id`: `kbcodedev/cto-technology-radar-evaluation`  
`category`: `15-c-suite-executive-advisory`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Performing CTO-level technology stack evaluations, Buy vs Build analyses, adopting new programming languages/databases, evaluating open-source licenses, and assessing vendor lock-in.
- **Triggers**: Architectural modernization decisions, framework selection, database engine evaluation, vendor lock-in risk mitigation.
- **Prerequisites**: Business constraints (budget, timeline, team skillset), technical requirements (SLA, scale).

---

## 2. Core Mental Model & Invariant Principles
1. **Tech Radar Rings (Adopt / Trial / Assess / Hold)**:
   - **Adopt**: High industry maturity, battle-tested at scale, clear team competency (e.g., PostgreSQL, TypeScript).
   - **Trial**: Proven value on low-risk non-critical services (e.g., Rust microservices, Vector DBs).
   - **Assess**: High potential, exploratory spikes only.
   - **Hold**: Deprecated, high technical debt, or unproven hype.
2. **Buy vs Build Calculus**: If the capability is NOT your core competitive differentiator (e.g. Auth, Billing, Logging), buy best-in-class SaaS (Stripe, Auth0, Datadog). Build only what differentiates your business.
3. **Total Cost of Ownership (TCO)**: Factor developer hiring pool, operational maintenance, cloud hosting, and licensing costs—not just initial development speed.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Technology Adoption / Vendor Selection Decision]
                         │
                         ▼
┌────────────────────────────────────────────────┐
│ Phase 1: Core vs Commodity Differentiation     │ ── Differentiating = Build; Commodity = Buy
└────────────────────────┬───────────────────────┘
                         ▼
┌────────────────────────────────────────────────┐
│ Phase 2: Tech Radar Ring Classification        │ ── Adopt / Trial / Assess / Hold
└────────────────────────┬───────────────────────┘
                         ▼
┌────────────────────────────────────────────────┐
│ Phase 3: Total Cost of Ownership (TCO) Matrix  │ ── Infra + Licensing + Dev Salary + Maintenance
└────────────────────────┬───────────────────────┘
                         ▼
┌────────────────────────────────────────────────┐
│ Phase 4: CTO Recommendation & Migration Plan   │ ── Concrete roadmap with escape hatch
└────────────────────────────────────────────────┘
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
  "decision": "Build custom authentication and user management OR adopt WorkOS / Auth0",
  "team_size": "8 engineers",
  "target_market": "Enterprise B2B SaaS",
  "timeline": "Launch in 6 weeks"
}
```

### Output Contract
```markdown
# CTO Technology Evaluation: Custom Auth vs Auth0/WorkOS

## 1. Strategic Verdict: BUY / ADOPT (WorkOS / Auth0)

## 2. Evaluation Matrix

| Evaluation Dimension | Build Custom Auth | Adopt WorkOS / Auth0 |
|---|---|---|
| **Time to Market** | 8-12 Weeks (Misses launch deadline) | **2-3 Days (Integrated via SDK)** |
| **Enterprise Features** | SAML 2.0, SCIM, OIDC must be built from scratch | **Built-in Out of the Box** |
| **Year 1 Total Cost** | ~$140k (2 senior engineers for 3 months + maintenance) | **~$12k (SaaS subscription tier)** |
| **Security & Compliance** | Requires custom SOC2 penetration audits | **Pre-certified SOC2 Type II & ISO 27001** |
| **Vendor Lock-in** | Zero lock-in | Moderate (Mitigated via standard JWT tokens) |

## 3. Migration Escape Hatch
- Issue standard RFC 7519 JSON Web Tokens (JWT) signed by Auth0. If vendor costs exceed scale thresholds at >1M users, swap token verification keys with a self-hosted Hydra/Keycloak instance with zero client-side changes.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Building Commodity Wheels**: Spending 4 months building custom billing engines instead of integrating Stripe.
- ❌ **Ignoring Developer Hiring Availability**: Choosing esoteric programming languages or unmaintained databases where finding replacement engineers is impossible.
- ❌ **Adopting Without an Exit Strategy**: Entangling proprietary vendor APIs deep into core domain logic with no abstraction adapter.

---

## 6. Real-World Production Example

```markdown
**CTO Radar Decision**:
- Team proposed building custom distributed task queue in C++.
- CTO evaluation placed custom queue on **HOLD** and adopted **Redis + BullMQ**. Shipped 3 months earlier, saving $250k in engineering overhead.
```
