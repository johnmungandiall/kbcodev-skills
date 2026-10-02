# Skill: PyTorch Deep Learning Training Pipeline & Model Optimization Engine
`id`: `kbcodedev/pytorch-deep-learning-pipeline`  
`category`: `13-data-engineering-mlops`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Training, fine-tuning, and optimizing deep learning models in PyTorch 2.x using `torch.compile`, Distributed Data Parallel (DDP) / Fully Sharded Data Parallel (FSDP), custom `Dataset`/`DataLoader` pipelines, mixed-precision (AMP fp16/bf16), PyTorch Lightning, ONNX/TensorRT export, and experiment tracking (Weights & Biases / MLflow).
- **Triggers**: Training deep neural networks, building reproducible PyTorch training loops, scaling multi-GPU distributed training, optimizing GPU memory consumption, and exporting models for low-latency inference serving.
- **Prerequisites**: Python 3.11+, PyTorch 2.2+, CUDA 12+, torchvision/torchaudio/transformers, Weights & Biases or TensorBoard.

---

## 2. Core Mental Model & Invariant Principles
1. **Device-Agnostic & Memory-Efficient Design**: Always structure models, tensors, and data pipelines to run transparently across CPU, CUDA, and Apple MPS. Always utilize Automatic Mixed Precision (`torch.amp.autocast('cuda')`) and gradient scaling to cut VRAM usage by 50% without numerical divergence.
2. **DataLoader Bottleneck Elimination**: Never perform heavy disk reads or un-vectorized data transformations inside the forward pass. Configure `DataLoader(num_workers=4, pin_memory=True, persistent_workers=True)` and prefetch data into pinned GPU host memory.
3. **Reproducibility Contract**: Enforce deterministic training across epochs: set seeds for `random`, `numpy`, `torch.manual_seed()`, and configure `torch.backends.cudnn.deterministic = True`.
4. **PyTorch 2.x `torch.compile` Optimization**: Leverage Inductor graph compilation (`torch.compile(model, mode="reduce-overhead")`) to fuse kernel operations and eliminate Python runtime overhead.

5. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Raw Dataset / Feature Store]
              │
              ▼
┌──────────────────────────────────────┐
│ Phase 1: High-Performance DataLoader │ ── Pinned memory, worker prefetching,
│          & Augmentation Pipeline     │    distributed sampler (DDP)
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: Model Architecture &        │ ── Layer initialization, torch.compile,
│          Optimization                │    FSDP / DDP multi-GPU wrapping
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Mixed-Precision Training    │ ── AMP autocast, GradScaler, gradient
│          Loop with Checkpointing     │    clipping, learning rate schedulers
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Model Evaluation &          │ ── Loss/Metric tracking (W&B), ONNX/
│          Inference Export            │    TensorRT graph export, TorchScript
└──────────────────────────────────────┘
```

### Phase 1: Custom Dataset & High-Throughput DataLoader

```python
# src/data/dataset.py
import torch
from torch.utils.data import Dataset, DataLoader, DistributedSampler

class MultimodalEmbeddingDataset(Dataset):
    """High-performance dataset yielding pre-processed feature tensors."""
    def __init__(self, features: torch.Tensor, labels: torch.Tensor):
        assert len(features) == len(labels)
        self.features = features
        self.labels = labels

    def __len__(self) -> int:
        return len(self.features)

    def __getitem__(self, idx: int) -> tuple[torch.Tensor, torch.Tensor]:
        return self.features[idx], self.labels[idx]

def build_dataloader(
    dataset: Dataset,
    batch_size: int = 128,
    is_distributed: bool = False,
    num_workers: int = 4,
) -> DataLoader:
    sampler = DistributedSampler(dataset) if is_distributed else None
    return DataLoader(
        dataset,
        batch_size=batch_size,
        shuffle=(sampler is None),
        sampler=sampler,
        num_workers=num_workers,
        pin_memory=torch.cuda.is_available(),
        persistent_workers=(num_workers > 0),
        drop_last=True,
    )
```

### Phase 2: PyTorch 2.x Training Loop with Mixed Precision

```python
# src/training/trainer.py
import torch
import torch.nn as nn
from torch.amp import autocast, GradScaler

class ProductionTrainer:
    def __init__(
        self,
        model: nn.Module,
        optimizer: torch.optim.Optimizer,
        criterion: nn.Module,
        device: torch.device,
        use_compile: bool = True,
    ):
        self.device = device
        self.model = model.to(self.device)
        if use_compile and hasattr(torch, "compile"):
            self.model = torch.compile(self.model, mode="reduce-overhead")

        self.optimizer = optimizer
        self.criterion = criterion
        self.scaler = GradScaler("cuda" if device.type == "cuda" else "cpu")

    def train_epoch(self, dataloader) -> float:
        self.model.train()
        total_loss = 0.0

        for batch_idx, (inputs, targets) in enumerate(dataloader):
            inputs = inputs.to(self.device, non_blocking=True)
            targets = targets.to(self.device, non_blocking=True)

            self.optimizer.zero_grad(set_to_none=True)

            # Mixed precision forward pass
            with autocast(device_type=self.device.type, dtype=torch.bfloat16):
                outputs = self.model(inputs)
                loss = self.criterion(outputs, targets)

            # Scaled backward pass
            self.scaler.scale(loss).backward()
            self.scaler.unscale_(self.optimizer)
            torch.nn.utils.clip_grad_norm_(self.model.parameters(), max_norm=1.0)
            self.scaler.step(self.optimizer)
            self.scaler.update()

            total_loss += loss.item()

        return total_loss / len(dataloader)
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
  "framework": "pytorch_2_x",
  "accelerator": "cuda_amp_bfloat16",
  "distributed_strategy": "ddp | fsdp",
  "optimization": "torch_compile_inductor",
  "tracking": "wandb | mlflow"
}
```

### Output Contract
```json
{
  "artifacts": {
    "checkpoint": "model_best.pt (weights, optimizer, scheduler, scaler state)",
    "export": "model.onnx with dynamic batch axes verified via ONNX Runtime"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Using `optimizer.zero_grad()` Instead of `set_to_none=True`**: `set_to_none=True` saves memory bandwidth by omitting zero-writing memory sweeps.
- ❌ **DataLoader Bottleneck (`num_workers=0`, `pin_memory=False`)**: CPU data preparation stalls GPU CUDA cores, resulting in low GPU utilization (<30%).
- ❌ **Accumulating Tensors with Computation History in Lists**: Appending `loss` instead of `loss.item()` or `.detach()` into tracking lists, causing catastrophic CUDA out-of-memory (OOM) memory leaks.

---

## 6. Real-World Production Example

```markdown
**Task**: Train a 100M parameter Transformer ranking model on 4x NVIDIA A100 GPUs using PyTorch 2.x and DDP.

1. **Architecture & Optimization**: Compiled Transformer backbone via `torch.compile()` and wrapped with `DistributedDataParallel`.
2. **Data Pipeline**: Pinned memory DataLoader with 8 workers per GPU achieving 98% sustained GPU compute utilization.
3. **Mixed Precision**: Trained with `torch.bfloat16` and gradient clipping (1.0), cutting epoch training time from 4.2 hours to 1.4 hours.
4. **ONNX Export**: Exported final checkpoint to ONNX with dynamic batch sizing for low-latency Triton Inference Server deployment.

**Outcome**: Achieved 3x training speedup with zero divergence and deployed to production serving 10,000 queries/sec at 6ms p99 latency.
```
