# Skill: PRD & Technical Roadmap Engineering
`id`: `kbcodedev/prd-roadmap-engineering`  
`category`: `08-strategic-product-leadership`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring comprehensive Product Requirement Documents (PRDs), feature specifications, RICE prioritization matrices, and milestone delivery roadmaps.
- **Triggers**: New product kickoff, cross-functional engineering alignment, quarterly sprint planning.
- **Prerequisites**: Business objectives, target user personas, technical constraints.

---

## 2. Core Mental Model & Invariant Principles
1. **Problem First, Solution Second**: Clearly articulate the user pain, business impact, and measurable success metrics before proposing technical UI or architecture.
2. **Explicit Non-Goals**: Stating what the project will NOT do is just as critical as defining features, preventing scope bloat.
3. **RICE Prioritization Framework**: Score features quantitatively: $\text{Score} = \frac{\text{Reach} \times \text{Impact} \times \text{Confidence}}{\text{Effort}}$.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Product Opportunity / Feature Initiative]
                    │
                    ▼
┌───────────────────────────────────────┐
│ Section 1: Problem Statement & Why Now │ ── User pain point + Market urgency
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Section 2: Success Metrics & OKRs     │ ── North star metric + Target KPI changes
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Section 3: User Stories & Scenarios   │ ── "As a [user], I want [goal], so that [value]"
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Section 4: Non-Goals & Out-of-Scope   │ ── Hard boundary definitions
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Section 5: Phased Milestone Roadmap   │ ── M0 (Spike), M1 (Alpha), M2 (Beta), GA
└───────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "feature_name": "Multi-Factor Authentication (MFA / 2FA)",
  "target_audience": "Enterprise B2B Customers",
  "business_driver": "SOC2 Compliance requirement and customer account takeover prevention"
}
```

### Output Contract
```markdown
# Product Requirement Document (PRD): Enterprise Multi-Factor Authentication

## 1. Executive Summary & Problem
- **Problem**: Enterprise customers require SOC2 Type II compliance and mandate TOTP/SMS 2FA to protect sensitive organizational financial data.
- **Success Metric**: 100% of enterprise accounts enforce MFA within 30 days of release; zero account takeover incidents.

## 2. In-Scope User Stories (P0 / P1)
- **US-01 (P0)**: As an admin, I can mandate MFA for all members in my organization.
- **US-02 (P0)**: As a user, I can configure TOTP (Google Authenticator / 1Password) with a QR code.
- **US-03 (P0)**: As a user, I receive 10 single-use recovery backup codes during setup.
- **US-04 (P1)**: As a user, I can configure SMS backup verification.

## 3. Explicit Non-Goals (Out of Scope)
- Hardware security keys (FIDO2 / WebAuthn / YubiKey) are deferred to Q3.
- Custom enterprise SSO / SAML 2.0 (covered in separate PRD).

## 4. Delivery Roadmap
- **M1 (Sprint 1)**: Database schema for TOTP secrets + Authenticator verification endpoint.
- **M2 (Sprint 2)**: Frontend QR enrollment modal + Recovery code download.
- **M3 (Sprint 3)**: Organization-level enforcement gate + Internal security penetration testing.
- **GA (Sprint 4)**: Production rollout to 100% of users.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **50-Page PRDs Nobody Reads**: Writing massive narrative essays instead of structured, high-density bulleted specifications.
- ❌ **Vague Success Criteria**: Stating *"Make users happy"* instead of *"Increase 30-day retention from 35% to 45%"*.
- ❌ **Missing Phased Milestones**: Attempting a giant-bang release with no intermediate alpha/beta testing gates.

---

## 6. Real-World Production Example

```markdown
**PRD Impact**:
- Authored structured PRD for CSV Data Importer.
- Explicitly defined Non-Goal: *"Real-time automated sync is out of scope for v1."*
- Saved engineering team 6 weeks of unnecessary infrastructure complexity, shipping the core importer on schedule in 14 days.
```
