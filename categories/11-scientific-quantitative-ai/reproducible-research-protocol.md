# Skill: Reproducible Research & Experiment Protocol
`id`: `kbcodedev/reproducible-research-protocol`  
`category`: `11-scientific-quantitative-ai`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Structuring reproducible machine learning experiments, computational research pipelines, random seed management, artifact versioning, and environment freezing.
- **Triggers**: Training ML models, publishing benchmark results, computational biology pipelines, scientific paper companion code.
- **Prerequisites**: Python virtual environment, package lockfile, data lineage tracking tool (DVC/Git LFS/MLflow).

---

## 2. Core Mental Model & Invariant Principles
1. **Deterministic Random Seed Pinning**: Always pin global random seeds across all libraries (`random.seed()`, `np.random.seed()`, `torch.manual_seed()`, `torch.cuda.manual_seed_all()`, `torch.backends.cudnn.deterministic = True`).
2. **Environment & Dependency Immutability**: Pin exact package versions using poetry lockfiles or conda environment files (`requirements.lock.txt`).
3. **Artifact and Data Lineage Tracking**: Track the exact hash of input data, hyperparameters, and code commit used to generate every model weight or metric report.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Raw Research Hypothesis & Dataset]
                 │
                 ▼
┌────────────────────────────────┐
│ Step 1: Global Seed Pinning    │ ── Enforce determinism across Python, NumPy, PyTorch
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 2: Config Hyperparameters │ ── Store all params in immutable YAML / Hydra config
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 3: Run Experiment Script  │ ── Log metrics, intermediate loss, hardware metadata
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 4: Checkpoint & Hash Log  │ ── Commit weights, data sha256, and git commit SHA
└────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "experiment_name": "Transformer Attention Baseline Evaluation",
  "seed": 42,
  "epochs": 10,
  "batch_size": 32,
  "learning_rate": 1e-4
}
```

### Output Contract
```python
import os
import random
import json
import hashlib
import numpy as np
import torch

def set_deterministic_seed(seed: int = 42):
    random.seed(seed)
    os.environ["PYTHONHASHSEED"] = str(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

def log_experiment_manifest(config: dict, metrics: dict, output_file: str = "manifest.json"):
    manifest = {
        "git_commit": os.popen("git rev-parse HEAD").read().strip(),
        "random_seed": config.get("seed", 42),
        "hyperparameters": config,
        "results": metrics,
        "environment": {
            "pytorch_version": torch.__version__,
            "cuda_available": torch.cuda.is_available(),
            "cuda_device": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU"
        }
    }

    with open(output_file, "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"Reproducibility manifest locked: {output_file}")
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Unseeded Randomized Splits**: Calling `train_test_split(X, y)` without `random_state=42`, causing different test sets on every run.
- ❌ **Undocumented Hyperparameters**: Tweaking learning rates manually in code comments without saving them to a structured run config.
- ❌ **Non-Deterministic GPU Operations**: Using non-deterministic CUDA atomic operations without setting `torch.use_deterministic_algorithms(True)`.

---

## 6. Real-World Production Example

```markdown
**Scientific Audit Proof**:
- Research team recreated published benchmark results 18 months later using the locked `manifest.json` and conda lockfile, achieving 100% exact numerical match on all test metrics.
```
