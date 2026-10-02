# Skill: Product Design & User Experience (UX) Friction Auditor
`id`: `kbcodedev/product-design-ux-review`  
`category`: `08-strategic-product-leadership`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Auditing user journeys, UI mockups, interaction flows, and form ergonomics to eliminate cognitive friction, confusing affordances, and drop-off points.
- **Triggers**: UI design reviews, conversion rate optimization (CRO), onboarding flow redesign, user churn audits.
- **Prerequisites**: User flow wireframes / live UI screens, target persona goals.

---

## 2. Core Mental Model & Invariant Principles
1. **Don't Make Me Think (Cognitive Load Minimization)**: Every additional form field, ambiguous icon, or non-standard interaction pattern increases user drop-off exponentially.
2. **Clear Visual Hierarchy & Affordance**: Buttons must look like buttons; primary actions must dominate secondary actions; destructive actions must be visually distinct.
3. **Immediate Error Recovery**: Validate form fields inline on blur; explain errors in human, actionable language right next to the offending input.

---

## 3. High-Signal Execution Workflow

```
[User Journey / UI Screen Flow]
               │
               ▼
┌──────────────────────────────┐
│ Phase 1: First-Time User Run │ ── Can a user complete the core goal within the target cognitive SLA?
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 2: Friction & Ambiguity│ ── Identify confusing jargon, hidden buttons, dead ends
│          Detection           │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 3: Form Ergonomics     │ ── Auto-focus, smart defaults, input masking, clear labels
│          Optimization        │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 4: Actionable UX Spec  │ ── Before/After wireframe recommendations
└──────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "flow_name": "API Key Generation & Onboarding",
  "current_steps": 6,
  "dropoff_point": "Users abandon at the 'Configure IAM Scopes' step"
}
```

### Output Contract
```markdown
# UX Friction Audit: API Key Onboarding

## 1. Identified Bottlenecks
- **High Cognitive Friction**: Forcing new developers to manually select 24 granular permission checkboxes before creating their first key.
- **Dead End**: After creating the key, displaying the secret in an un-copyable plain text paragraph with no "Copy to Clipboard" button or curl snippet.

## 2. Streamlined UX Redesign (Reduced from 6 steps to 2 clicks)
1. **Smart Default Presets**:
   - Replace 24 checkboxes with 3 radio cards: `Read-Only (Default)`, `Full Access (Sandbox)`, `Custom Scopes`.
2. **Instant Copy & Code Snippet**:
   - Provide a 1-click `Copy Key` button.
   - Display ready-to-run copyable `curl` and `npm` terminal snippets pre-populated with the generated key.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Mystery Meat Navigation**: Using abstract, unlabelled icons that force users to hover to discover what they do.
- ❌ **Cryptic Error Messages**: Showing `"Error: 0x80041"` instead of `"Your credit card expiration date is invalid"`.
- ❌ **Modal Overload**: Popping up 3 consecutive modals (Cookie consent + Newsletter signup + Feedback survey) before the user even sees the product.

---

## 6. Real-World Production Example

```markdown
**Checkout Flow Optimization**:
- Removed optional fields ("Company Name", "Fax", "Address Line 2") from default checkout view.
- Added automatic ZIP code address autocompletion.
- Result: Checkout completion rate jumped by 22% within 48 hours.
```
