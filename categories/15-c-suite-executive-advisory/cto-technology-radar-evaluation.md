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
