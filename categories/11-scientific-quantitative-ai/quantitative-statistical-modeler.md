# Skill: Quantitative & Statistical Modeler
`id`: `kbcodedev/quantitative-statistical-modeler`  
`category`: `11-scientific-quantitative-ai`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Performing quantitative data modeling, hypothesis testing ($t$-test, ANOVA, Chi-Square), Bayesian inference, regression analysis, and predictive statistical modeling using Python (NumPy, SciPy, Statsmodels, Scikit-learn).
- **Triggers**: A/B test analysis, statistical anomaly detection, predictive forecasting, correlation vs causation studies.
- **Prerequisites**: Raw tabular dataset, statistical hypothesis definition.

---

## 2. Core Mental Model & Invariant Principles
1. **Validate Assumptions Before Testing**: Always verify normality (Shapiro-Wilk test), homoscedasticity, and independence before choosing between parametric and non-parametric tests.
2. **Effect Size Over Raw $p$-Values**: A statistically significant $p < 0.001$ on $N = 1,000,000$ may represent a trivial $0.01\%$ real-world effect. Always report Cohen's $d$ or confidence intervals.
3. **Outlier & Multicollinearity Discipline**: Check Variance Inflation Factor (VIF < 5) to ensure independent variables are not collinear.

---

## 3. High-Signal Execution Workflow

```
[Raw Dataset & Experimental Hypothesis]
                   │
                   ▼
┌──────────────────────────────────────┐
│ Phase 1: Exploratory Data & Normality│ ── Check distributions, skewness, missing values
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: Statistical Test Selection  │ ── Parametric (t-test) vs Non-Parametric (Mann-Whitney)
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Model Fitting & Diagnostics │ ── Fit OLS / Logistic / Bayesian regression
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Statistical Verdict Report  │ ── p-value, 95% CI, Effect size, Business takeaway
└──────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "experiment": "A/B Test of New Onboarding Flow",
  "metric": "30-Day Conversion Rate",
  "sample_size": { "control": 14200, "variant": 14350 },
  "conversions": { "control": 852, "variant": 1033 }
}
```

### Output Contract
```python
import numpy as np
from statsmodels.stats.proportion import proportions_ztest, confint_proportions_2indep

def analyze_ab_test(n_ctrl, conv_ctrl, n_var, conv_var):
    count = np.array([conv_var, conv_ctrl])
    nobs = np.array([n_var, n_ctrl])

    # Two-sided Z-test for proportions
    z_stat, p_val = proportions_ztest(count, nobs)

    # 95% Confidence Interval for Difference
    ci_low, ci_high = confint_proportions_2indep(conv_var, n_var, conv_ctrl, n_ctrl, method='wald')

    rate_ctrl = conv_ctrl / n_ctrl
    rate_var = conv_var / n_var
    relative_uplift = (rate_var - rate_ctrl) / rate_ctrl

    return {
        "control_rate": f"{rate_ctrl:.2%}",
        "variant_rate": f"{rate_var:.2%}",
        "relative_uplift": f"{relative_uplift:+.2%}",
        "p_value": f"{p_val:.4e}",
        "is_significant": p_val < 0.05,
        "ci_95_diff": f"[{ci_low:.4f}, {ci_high:.4f}]"
    }

# Result:
# Variant Rate: 7.20% vs Control: 6.00% (+20.00% Uplift)
# p-value: 4.12e-05 (Statistically Significant at alpha=0.01)
# 95% CI for Lift: [+0.64%, +1.76%]
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **$p$-Hacking / Peeking at A/B Tests Daily**: Checking significance continuously and stopping the test early the moment $p < 0.05$, inflating false positive rates up to 30%.
- ❌ **Ignoring Simpson's Paradox**: Failing to segment aggregate metrics across cohorts, masking hidden counter-trends.
- ❌ **Overfitting Complex Models**: Fitting 50-parameter polynomials on 100 data points with zero cross-validation.

---

## 6. Real-World Production Example

```markdown
**A/B Test Verification**:
- Analyzed pricing page test.
- Discovered overall revenue was up 8%, but mobile users experienced a 14% conversion drop due to viewport layout breakage. Segmented statistical analysis prevented a disastrous rollout.
```
