# Skill: Andrew Ng Data-Centric AI & Error Analysis
`id`: `kbcodedev/andrew-ng-data-centric-ai`  
`category`: `18-yc-tech-leaders-frameworks`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Improving machine learning and LLM pipeline performance by systematically cleaning datasets, fixing label errors, conducting structured error analyses, and generating high-quality synthetic training data rather than endlessly tweaking model hyperparameters.
- **Triggers**: Model accuracy plateau, high variance across test slices, dirty training datasets, synthetic data generation.
- **Prerequisites**: Training dataset, validation set, baseline model performance metrics.

---

## 2. Core Mental Model & Invariant Principles
1. **Model-Centric vs Data-Centric AI**:
   - **Model-Centric**: Keep data fixed; endlessly tune model architectures and hyperparameters.
   - **Data-Centric (Superior)**: Keep the model fixed; systematically improve data quality, label consistency, and edge-case coverage.
2. **Structured Error Analysis**: Manually inspect 100 misclassified examples. Group errors into categories (e.g. Mislabelled: 40%, Blurry images: 30%, Rare edge cases: 30%). Fix the largest bucket first.
3. **Consistency in Labeling**: If 3 human annotators label identical examples differently, model training is fundamentally bottlenecked. Write unambiguous annotation guidelines.

---

## 3. High-Signal Execution Workflow

```
[Baseline Model Hits Accuracy Ceiling (e.g. 78%)]
                        │
                        ▼
┌──────────────────────────────────────────────┐
│ Step 1: Collect 100 Misclassified Errors     │ ── Sample failing test cases
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Step 2: Categorize Error Buckets             │ ── Label Ambiguity, Truncation, Out-of-Domain
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Step 3: Targeted Data Cleansing & Synthetic  │ ── Fix bad labels + generate targeted synthetic examples
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Step 4: Retrain Baseline Model               │ ── Accuracy jumps to 92% with ZERO code changes
└──────────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "task": "Named Entity Recognition (NER) for Legal Contracts",
  "current_f1_score": 0.74,
  "issue": "Model performance is stalling despite upgrading from BERT to RoBERTa-Large"
}
```

### Output Contract
```markdown
# Andrew Ng Data-Centric Error Analysis Report

## 1. Error Audit (100 Sample Failures)

| Error Category | Failure Count | % of Total Errors | Actionable Remediation |
|---|---|---|---|
| **Inconsistent Date Labeling** | 48 | **48%** | Standardized annotation rules: ISO 8601 strings only. |
| **Truncated Legal Clause Text**| 28 | **28%** | Increased context chunk window from 256 to 512 tokens. |
| **Rare Jurisdiction Acronyms** | 14 | **14%** | Generated 500 synthetic examples of UK/EU legal terms. |
| **Model Inherent Ambiguity** | 10 | **10%** | Accepted noise floor. |

## 2. Expected Impact
Fixing Date Labeling and Chunk Truncation addresses **76% of all observed errors**.

## 3. Result After Data Cleansing
- Model architecture kept 100% identical.
- F1-Score increased from **0.74 to 0.91 (+17 point improvement)**.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Hyperparameter Tweaking on Dirty Data**: Spending 3 weeks tuning learning rates and batch sizes on a dataset where 15% of labels are flat wrong.
- ❌ **Chasing Massive Quantity Over Quality**: Scraping 1,000,000 low-quality web pages instead of curating 10,000 clean, verified, high-signal examples.
- ❌ **Skipping Manual Error Inspection**: Refusing to manually look at failing examples, guessing blindly at what is causing model errors.

---

## 6. Real-World Production Example

```markdown
**Data-Centric AI Success**:
- Steel surface defect detection model was stuck at 76% accuracy.
- Error analysis revealed inspectors had inconsistent definitions of "micro-scratch".
- Defined exact pixel measurement guidelines and relabeled 400 images. Accuracy jumped to 93% in 2 days.
```
