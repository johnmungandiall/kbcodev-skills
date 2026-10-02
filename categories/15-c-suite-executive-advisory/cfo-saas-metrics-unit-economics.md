# Skill: CFO SaaS Metrics, Unit Economics & Runway Engine
`id`: `kbcodedev/cfo-saas-metrics-unit-economics`  
`category`: `15-c-suite-executive-advisory`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Calculating, auditing, and modeling SaaS financial metrics (ARR, MRR, Net Revenue Retention, CAC Payback, LTV:CAC, Gross Margin, Burn Multiple, and Runway) for executive decision-making and investor fundraising.
- **Triggers**: Quarterly financial reviews, pricing changes, fundraising deck preparation, headcount planning, runway extension audits.
- **Prerequisites**: Current MRR, revenue churn, customer acquisition costs, monthly operating expenses, cash reserves.

---

## 2. Core Mental Model & Invariant Principles
1. **The Core SaaS Benchmark Triad**:
   - **LTV : CAC Ratio**: Target calibrated dynamically by segment (SMB $\ge 2.5\times$, Mid-Market $\ge 3.0\times$, Enterprise $\ge 4.0\times$).
   - **CAC Payback Period**: Target $< 12 \text{ months}$ (Efficient cash recycling).
   - **Net Revenue Retention (NRR)**: Target $> 110\%$ for SMB, $> 130\%$ for Enterprise.
2. **Burn Multiple (Efficiency Metric)**:
   $$\text{Burn Multiple} = \frac{\text{Net Burn}}{\text{Net New ARR}}$$
   - $< 1.0\times$: Amazing | $1.0\times - 1.5\times$: Good | $> 2.5\times$: Dangerous cash incineration.
3. **True Gross Margin Rigor**: Include hosting compute (AWS), third-party API costs (OpenAI/Stripe), customer support salaries, and payment processing fees in COGS—not just hosting.

---

## 3. High-Signal Execution Workflow

```
[Financial Data: Revenue, Churn, Marketing Spend, Cash Balance]
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│ Step 1: Calculate Unit Economics (LTV, CAC, Payback Period)│
└────────────────────────────┬───────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────┐
│ Step 2: Calculate Retention Health (Gross Churn & NRR)     │
└────────────────────────────┬───────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────┐
│ Step 3: Compute Burn Multiple & Zero-Cash Runway (Months)  │
└────────────────────────────┬───────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────┐
│ Step 4: Executive CFO Recommendations                      │
└────────────────────────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "starting_arr": 2400000,
  "net_new_arr_q3": 600000,
  "quarterly_burn": 450000,
  "cash_balance": 3600000,
  "sales_marketing_spend_q3": 300000,
  "new_customers_q3": 60,
  "monthly_gross_churn": 0.008
}
```

### Output Contract
```markdown
# CFO Executive Financial Health Report

## 1. Core SaaS Scorecard

| Metric | Computed Value | Industry Benchmark | Health Status |
|---|---|---|---|
| **Annual Recurring Revenue (ARR)** | **$3.0M** | — | 🟢 On Track |
| **CAC (Blended)** | **$5,000** ($300k / 60) | — | 🟢 Efficient |
| **CAC Payback Period** | **6.0 Months** | < 12 Months | 🚀 Excellent |
| **Burn Multiple** | **0.75x** ($450k net burn / $600k new ARR) | < 1.0x | 🏆 Best-in-Class |
| **Net Cash Runway** | **24.0 Months** ($3.6M / $150k mo. burn) | > 18 Months | 🟢 Safe |
| **Net Revenue Retention (NRR)**| **118.4%** | > 110% | 🟢 Strong Expansion |

## 2. CFO Strategic Takeaway
The business operates at top-decile capital efficiency (Burn Multiple of 0.75x). With 24 months of runway, there is zero immediate financing risk. Recommend selectively increasing sales headcount to accelerate customer acquisition.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Hiding Support Salaries from COGS**: Classifying customer support and implementation engineers as OpEx instead of COGS to artificially inflate Gross Margin.
- ❌ **Ignoring Negative Churn/Expansion**: Focusing purely on new logo acquisition while ignoring high customer churn eroding the base.
- ❌ **Calculating LTV with 0% Discount Rate**: Projecting customer lifetime value 10 years into the future without factoring in churn risk.

---

## 6. Real-World Production Example

```markdown
**Runway Extension Strategy**:
- Financial audit identified $42k/month in redundant cloud GPU instances and unused SaaS seats.
- Cut non-essential spend -> Extended startup runway by 7.5 months without laying off engineers.
```
