# Skill: Scientific Literature Synthesis & Evidence Extraction
`id`: `kbcodedev/scientific-literature-synthesis`  
`category`: `11-scientific-quantitative-ai`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Systematically analyzing academic research papers, clinical trials, machine learning publications, and scientific datasets to extract verifiable methodology, evidence tables, and benchmark comparisons.
- **Triggers**: Research literature review, state-of-the-art (SOTA) algorithm comparison, scientific hypothesis synthesis, meta-analysis authoring.
- **Prerequisites**: Source papers (PDF/ArXiv text), research questions, domain taxonomy.

---

## 2. Core Mental Model & Invariant Principles
1. **Evidence Grounding & Citation Rigor**: Never make an empirical claim without citing the exact paper, authors, and experimental sample size ($N$).
2. **Methodology Extraction Matrix**: Deconstruct papers into standardized dimensions: (1) Core Hypothesis, (2) Dataset & Sample Size, (3) Baseline Comparison, (4) Primary Metric, (5) Key Limitation.
3. **Statistical Significance Verification**: Always check for $p$-values ($p < 0.05$), confidence intervals ($95\% \text{ CI}$), and ablation studies proving the mechanism of improvement.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Corpus of Academic Papers / ArXiv Studies]
                    │
                    ▼
┌───────────────────────────────────────────┐
│ Phase 1: Research Question Taxonomy       │ ── Formulate specific empirical interrogation
└───────────────────┬───────────────────────┘
                    ▼
┌───────────────────────────────────────────┐
│ Phase 2: Systematic Methodology Parsing   │ ── Extract Models, Baselines, Compute, Datasets
└───────────────────┬───────────────────────┘
                    ▼
┌───────────────────────────────────────────┐
│ Phase 3: Evidence Extraction Matrix       │ ── Tabulate quantitative performance comparisons
└───────────────────┬───────────────────────┘
                    ▼
┌───────────────────────────────────────────┐
│ Phase 4: Synthesis & Identified Gaps      │ ── Summarize consensus and open research questions
└───────────────────────────────────────────┘
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
  "topic": "Speculative Decoding vs Medusa Multi-Head Drafting in Large Language Models",
  "papers": ["Leviathan et al., 2023", "Cai et al., 2024 (Medusa)"],
  "metrics_of_interest": ["Latency speedup ratio", "Memory overhead", "Acceptance rate"]
}
```

### Output Contract
```markdown
# Scientific Literature Synthesis: Speculative Decoding vs Medusa

## 1. Executive Research Summary
Speculative execution accelerates LLM autoregressive inference without altering the target distribution. While traditional speculative decoding requires maintaining a separate smaller draft model, Medusa adds multiple decoding heads atop the frozen base model, eliminating draft model coordination overhead.

## 2. Quantitative Comparative Evidence Matrix

| Dimension | Speculative Decoding (Leviathan et al.) | Medusa (Cai et al.) |
|---|---|---|
| **Drafting Mechanism** | Independent Draft Model (e.g. LLaMA-68M) | Multiple residual heads on base model |
| **Speedup Ratio** | $2.0\times - 2.5\times$ on standard benchmarks | $2.2\times - 3.2\times$ on Vicuna/Alpaca |
| **VRAM Overhead** | High (Requires loading 2 separate models) | Minimal (~1-2% for additional heads) |
| **Distribution Shift** | Exact target distribution preserved (Lossless) | Lossless with tree-based verification |
| **Training Requirements** | Zero (if draft model exists) | Fine-tuning of Medusa heads required |

## 3. Consensus Finding
Medusa is superior for edge and single-GPU deployments where VRAM bandwidth is the primary constraint, while traditional speculative decoding remains preferred for zero-training plug-and-play workflows.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Conflating Correlation with Causation**: Asserting an algorithmic improvement caused benchmark gains without verifying controlled ablation studies.
- ❌ **Ignoring Negative Results**: Cherry-picking only positive findings while omitting acknowledged failure modes in the paper's appendix.
- ❌ **Hallucinating Citation Details**: Fabricating paper titles or author names not present in the verified literature.

---

## 6. Real-World Production Example

```markdown
**Literature-Guided LLM Optimization**:
- Synthesized 12 papers on KV-cache compression.
- Selected StreamingLLM (Xiao et al., 2023) attention sink strategy for infinite-context streaming, saving 80% VRAM with zero model retraining.
```
