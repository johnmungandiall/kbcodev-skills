# Skill: MLOps Model Serving & Triton Inference Engine
`id`: `kbcodedev/mlops-model-serving-triton`  
`category`: `13-data-engineering-mlops`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Deploying, optimizing, and scaling high-throughput, low-latency machine learning inference pipelines using NVIDIA Triton Inference Server, ONNX Runtime, TensorRT, dynamic batching, and FP16/INT8 quantization.
- **Triggers**: Production model deployment, GPU inference cost optimization, high p99 prediction latency, model versioning.
- **Prerequisites**: Exported model weights (ONNX, PyTorch TorchScript, TensorRT engine), Triton Server container.

---

## 2. Core Mental Model & Invariant Principles
1. **Dynamic Batching for Maximum GPU Saturation**: Group concurrent individual HTTP/gRPC requests into a single tensor batch on the GPU within a small delay window (`max_queue_delay_microseconds: 5000`).
2. **Model Format Optimization (PyTorch $\rightarrow$ ONNX $\rightarrow$ TensorRT)**: Compiling PyTorch models to TensorRT/ONNX eliminates Python interpreter runtime overhead, achieving $3\times - 8\times$ inference speedups.
3. **Multi-Model Concurrent Execution**: Triton executes multiple model instances concurrently across GPU compute streams to achieve 100% GPU core utilization.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[PyTorch / HuggingFace Model Weights]
                 │
                 ▼
┌────────────────────────────────┐
│ Step 1: Export to ONNX / TRT   │ ── torch.onnx.export() + INT8 Quantization
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 2: Configure config.pbtxt │ ── Dynamic batching, instance groups, input/output tensors
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 3: Launch Triton Server   │ ── High-performance C++ gRPC & HTTP endpoints
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 4: Model Analyzer Bench   │ ── Measure throughput (req/s) vs p99 latency SLA
└────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "model_name": "embedding_transformer",
  "framework": "ONNX Runtime",
  "max_batch_size": 64,
  "max_latency_sla_ms": 15
}
```

### Output Contract
```protobuf
# Triton Inference Server Model Configuration (config.pbtxt)
name: "embedding_transformer"
platform: "onnxruntime_onnx"
max_batch_size: 64

input [
  {
    name: "input_ids"
    data_type: TYPE_INT64
    dims: [ -1 ]
  },
  {
    name: "attention_mask"
    data_type: TYPE_INT64
    dims: [ -1 ]
  }
]

output [
  {
    name: "embeddings"
    data_type: TYPE_FP32
    dims: [ 768 ]
  }
]

# Dynamic Batching Configuration
dynamic_batching {
  max_queue_delay_microseconds: 4000
  preferred_batch_size: [ 8, 16, 32, 64 ]
}

# GPU Instance Parallelism
instance_group [
  {
    count: 2
    kind: KIND_GPU
    gpus: [ 0 ]
  }
]
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Serving Raw PyTorch via Flask/FastAPI**: Running un-batched `model(tensor)` inside Python REST endpoints, suffering from Python GIL locks and GPU under-utilization (<10%).
- ❌ **Unbounded Dynamic Batching Delay**: Setting `max_queue_delay` to 500ms, violating user-facing interactive latency SLAs.
- ❌ **Single Model Instance on Heavy GPUs**: Running 1 model instance on an NVIDIA A100 GPU with 80GB VRAM, wasting 90% of GPU compute capacity.

---

## 6. Real-World Production Example

```markdown
**Triton Migration Impact**:
- Migrated transformer embedding model from FastAPI/PyTorch to NVIDIA Triton with TensorRT FP16 optimization.
- Throughput increased by 7.4x (from 180 req/s to 1,330 req/s); p99 latency dropped from 48ms to 6.2ms on a single T4 GPU.
```
