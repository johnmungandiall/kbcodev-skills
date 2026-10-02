# Skill: Threat Modeling & STRIDE Security Architecture
`id`: `kbcodedev/threat-modeling-stride`  
`category`: `14-security-compliance-governance`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Performing comprehensive architectural threat modeling using Microsoft's STRIDE methodology, identifying trust boundaries, mapping attack surfaces, and prioritizing mitigations using DREAD risk scoring.
- **Triggers**: Pre-implementation architectural review, major system redesign, third-party penetration testing preparation.
- **Prerequisites**: Architecture data flow diagram (DFD), list of system assets, trust boundary definitions.

---

## 2. Core Mental Model & Invariant Principles
1. **STRIDE Threat Taxonomy**:
   - **S**poofing (Identity verification)
   - **T**ampering (Data integrity)
   - **R**epudiation (Audit logging & non-repudiation)
   - **I**nformation Disclosure (Privacy & encryption)
   - **D**enial of Service (Availability & rate limiting)
   - **E**levation of Privilege (Authorization & least privilege)
2. **Trust Boundary Crossing**: The highest density of vulnerabilities occurs where data crosses trust boundaries (e.g. Public Internet $\rightarrow$ API Gateway $\rightarrow$ Internal DB).
3. **DREAD Quantitative Risk Scoring**: Score threats: $\text{Risk} = \frac{D + R + E + A + D}{5}$ (Damage, Reproducibility, Exploitability, Affected Users, Discoverability).

---

## 3. High-Signal Execution Workflow

```
[System Data Flow Diagram (DFD)]
                 │
                 ▼
┌────────────────────────────────┐
│ Phase 1: Identify Trust        │ ── Public Web, DMZ, VPC, Private DB boundaries
│          Boundaries            │
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Phase 2: Systematic STRIDE     │ ── Evaluate S, T, R, I, D, E per data flow node
│          Evaluation            │
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Phase 3: DREAD Risk Scoring    │ ── Calculate quantitative priority (High / Med / Low)
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Phase 4: Concrete Mitigations  │ ── Specific technical controls & CI tests required
└────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "system": "Automated Invoice PDF Generation Webhook",
  "data_flow": "External Client -> Webhook Receiver -> Redis Queue -> Chromium PDF Worker -> S3"
}
```

### Output Contract
```markdown
# STRIDE Threat Model: Invoice PDF Generation

## 1. Trust Boundaries & Attack Surfaces
- **Boundary 1**: Public Internet to Webhook Receiver (Untrusted -> DMZ)
- **Boundary 2**: PDF Worker to Local Filesystem & Chromium (DMZ -> Internal Worker)

## 2. STRIDE Threat Findings & Mitigations

| Threat Category | Specific Threat Scenario | DREAD Score | Required Technical Mitigation |
|---|---|---|---|
| **Spoofing** | Attacker sends forged webhook calls generating fake invoices | **8.2 (High)** | Enforce HMAC-SHA256 signature verification on all incoming webhook payloads. |
| **Tampering** | Attacker modifies invoice HTML payload injecting malicious scripts | **7.8 (High)** | Sanitize HTML inputs using DOMPurify before passing to Chromium renderer. |
| **Info Disclosure** | Attacker uses `file:///etc/passwd` iframe in HTML to read server files | **9.0 (Critical)** | Disable Chromium local file access via `--disable-local-file-access` flag. |
| **Denial of Service** | Attacker submits 50,000 requests, exhausting PDF worker RAM | **8.0 (High)** | Implement IP rate limiting (10 req/min) + bounded Redis queue concurrency. |
| **Elevation of Priv.** | Chromium RCE breakout accessing host kernel | **8.5 (High)** | Run Chromium inside unprivileged Docker container with `readOnlyRootFilesystem`. |
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Threat Modeling After Shipping to Production**: Conducting threat models as a post-launch checkbox rather than an engineering design phase tool.
- ❌ **Ignoring Internal Microservice Trust**: Assuming that internal microservices require zero authentication because they sit inside the VPC.
- ❌ **Vague Mitigations**: Writing *"Make authentication secure"* instead of *"Enforce HMAC-SHA256 signature verification"*.

---

## 6. Real-World Production Example

```markdown
**Threat Model Intervention**:
- STRIDE analysis revealed Chromium headless browser could be used for SSRF to access AWS metadata (`http://169.254.169.254`).
- Blocked IMDSv1 and restricted worker egress to S3 only before shipping the feature, preventing a critical security breach.
```
