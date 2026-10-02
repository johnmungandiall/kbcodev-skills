# Skill: Cap Table & Startup Equity Dilution Modeler
`id`: `kbcodedev/cap-table-equity-dilution-modeler`  
`category`: `15-c-suite-executive-advisory`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Modeling startup capitalization tables (Cap Tables), pre-seed/seed SAFE notes (Post-Money vs Pre-Money SAFEs), Series A priced rounds, option pool expansions, and founder equity dilution.
- **Triggers**: Evaluating investor term sheets, issuing employee stock option grants (ESOP), SAFE note conversions, modeling exit payout waterfalls.
- **Prerequisites**: Current share count, SAFE note valuation caps and discounts, new investment amount.

---

## 2. Core Mental Model & Invariant Principles
1. **Post-Money SAFE Invariant (YC Standard)**:
   $$\text{Investor Ownership \%} = \frac{\text{Investment Amount}}{\text{Post-Money Valuation Cap}}$$
   Post-Money SAFEs dilute founders and existing equity holders, but do NOT dilute other SAFE holders who invest at the same stage.
2. **Option Pool Shuffle (Unallocated Pool Dilution)**: Investors typically mandate a 10%-15% unallocated employee option pool created *prior* to the priced round, placing 100% of that dilution on the existing founders.
3. **Fully Diluted Share Count**: Always calculate ownership percentages against the Fully Diluted Share count (Common shares + Preferred shares + Options issued + Unallocated pool + Convertible note shares).

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Founder Initial Shares (e.g. 10,000,000 Shares)]
                        │
                        ▼
┌───────────────────────────────────────────────┐
│ Step 1: Model Seed SAFE Notes                 │ ── $1M on $10M Post-Money Cap (10% Ownership)
└───────────────────────┬───────────────────────┘
                        ▼
┌───────────────────────────────────────────────┐
│ Step 2: Series A Priced Round Simulation      │ ── $5M on $20M Pre-Money Valuation
└───────────────────────┬───────────────────────┘
                        ▼
┌───────────────────────────────────────────────┐
│ Step 3: Option Pool Expansion (10% Pool)      │ ── Calculate pre-money founder dilution
└───────────────────────┬───────────────────────┘
                        ▼
┌───────────────────────────────────────────────┐
│ Step 4: Final Cap Table Ownership Waterfall   │ ── Founders %, Investors %, Option Pool %
└───────────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "founder_shares": 8000000,
  "safe_investments": [
    { "investor": "YC", "amount": 500000, "post_money_cap": 5000000 },
    { "investor": "Angel Syndicate", "amount": 1000000, "post_money_cap": 10000000 }
  ],
  "series_a": {
    "lead_investment": 5000000,
    "pre_money_valuation": 20000000,
    "target_option_pool_percent": 0.10
  }
}
```

### Output Contract
```markdown
# Startup Capitalization Table & Dilution Waterfall

## 1. Post-Series A Fully Diluted Ownership

| Shareholder Group | Shares Owned | Ownership % | Economic Value (@ $25M Post) |
|---|---|---|---|
| **Founder 1** | 4,000,000 | **32.0%** | $8,000,000 |
| **Founder 2** | 4,000,000 | **32.0%** | $8,000,000 |
| **YC (Seed SAFE)** | 1,000,000 | **8.0%** | $2,000,000 |
| **Angel Syndicate**| 1,000,000 | **8.0%** | $2,000,000 |
| **Series A Lead VC**| 2,500,000 | **20.0%** | $5,000,000 |
| **Unallocated ESOP**| 1,250,000 | **10.0%** | $2,500,000 |
| **TOTAL** | **12,500,000** | **100.0%** | **$25,000,000** |

## 2. Key Founder Takeaways
- Combined founder ownership post-$5M Series A is **64.0%**, maintaining super-majority voting control.
- Effective share price at Series A: **$2.00 / share**.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Stacking Pre-Money SAFEs Unknowingly**: Stacking multiple pre-money convertible notes where ownership calculation overlaps, resulting in massive unexpected founder dilution at conversion.
- ❌ **Ignoring Option Pool Pre-Money Loading**: Failing to negotiate option pool size down from 15% to 10%, giving away 5% of extra founder equity to the new VC.
- ❌ **Failing to File 83(b) Election**: Founders forgetting to file their IRS Section 83(b) tax election within 30 days of stock issuance, incurring massive tax penalties upon vesting.

---

## 6. Real-World Production Example

```markdown
**Term Sheet Negotiation**:
- Modeled competing Series A term sheets: VC A offered $25M pre-money with 15% option pool; VC B offered $22M pre-money with 8% option pool.
- Cap table simulation proved VC B gave founders 3.4% higher net ownership despite lower headline valuation.
```
