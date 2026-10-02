# Skill: YC Startup Execution Playbook & Growth Velocity
`id`: `kbcodedev/yc-startup-playbook`  
`category`: `08-strategic-product-leadership`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Guiding early-stage startup execution, rapid prototyping, customer discovery, high-velocity iterations, and unscalable early validation moves.
- **Triggers**: Startup ideation, MVP scoping, founder decision paralysis, pre-launch strategy, rapid validation sprints.
- **Prerequisites**: Startup concept, target market hypothesis.

---

## 2. Core Mental Model & Invariant Principles
1. **Make Something People Want**: The only fundamental requirement of a startup. If users aren't frantically using and recommending the product, nothing else matters.
2. **Do Things That Don't Scale (Paul Graham)**: Manually recruit your first 100 users, provide concierge white-glove onboarding, and hand-craft custom solutions before automating.
3. **Relentless Execution Velocity (Sam Altman)**: Speed of iteration is the ultimate competitive moat. Ship small increments daily rather than massive monolithic releases quarterly.

---

## 3. High-Signal Execution Workflow

```
[Startup Hypothesis / New Product Concept]
                     │
                     ▼
┌───────────────────────────────────────────┐
│ Phase 1: Hair-on-Fire Pain Identification │ ── Is this a must-have vitamin or painkiller?
└────────────────────┬──────────────────────┘
                     ▼
┌───────────────────────────────────────────┐
│ Phase 2: Concierge MVP Build (3-5 Days)   │ ── Ship the absolute minimum working prototype
└────────────────────┬──────────────────────┘
                     ▼
┌───────────────────────────────────────────┐
│ Phase 3: Manual Onboarding & User Calls   │ ── Watch users use the product live over Zoom
└────────────────────┬──────────────────────┘
                     ▼
┌───────────────────────────────────────────┐
│ Phase 4: Weekly Growth Sprints            │ ── Measure: 5-7% WoW growth on core metric
└───────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "startup_idea": "AI Copilot for Dental Clinic Front-Desk Receptionists",
  "founder_question": "Should we build an automated voice bot or a text appointment scheduler first?"
}
```

### Output Contract
```markdown
# YC Execution Playbook: Dental Clinic Copilot

## 1. Immediate Next Step: Do Things That Don't Scale
- Do NOT spend 3 months training custom voice models.
- **Concierge Test**: Go to 10 local dental clinics tomorrow in person. Offer to handle their SMS appointment confirmations manually using a simple AI script dashboard.

## 2. The 7-Day Sprint Plan
- **Day 1-2**: Build a simple Next.js + Twilio SMS interface that drafts appointment reminder texts.
- **Day 3-4**: Get 3 dental office managers to test it for their next 50 patients.
- **Day 5-6**: Observe where the AI drafts fail and iterate prompt templates live.
- **Day 7**: Ask: *"Will you pay $199/month to keep using this starting next Monday?"*

## 3. Core Metric to Track
- **Primary Metric**: Number of confirmed dental appointments processed weekly. Target: 7% Week-over-Week growth.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Fake Work**: Spending weeks on logos, business cards, complex entity incorporation, and patent filings before validating customer willingness to pay.
- ❌ **Premature Automation**: Writing 10,000 lines of automated workflow code before understanding what users manually want.
- ❌ **Chasing Feature Requests from Non-Users**: Altering your roadmap based on opinions of people who haven't paid or used the product.

---

## 6. Real-World Production Example

```markdown
**Do Things That Don't Scale in Practice**:
- DoorDash started as "PaloAltoDelivery.com" with a static PDF menu. The founders took orders by phone and personally drove food to customers to prove demand before writing a single dispatch algorithm.
```
