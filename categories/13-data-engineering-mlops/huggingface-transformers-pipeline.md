# Skill: Hugging Face Transformers, PEFT & Open-Source LLM Pipeline
`id`: `kbcodedev/huggingface-transformers-pipeline`  
`category`: `13-data-engineering-mlops`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Fine-tuning, optimizing, and deploying open-source Large Language Models (LLMs) and foundation models using Python, Hugging Face `transformers`, `datasets`, `accelerate`, `peft` (LoRA/QLoRA), `bitsandbytes` 4-bit/8-bit quantization, `trl` (SFT/DPO alignment), and Text Generation Inference (TGI) / vLLM serving.
- **Triggers**: Fine-tuning Llama 3, Mistral, Qwen, or Gemma models on custom domain data, implementing Parameter-Efficient Fine-Tuning (LoRA), optimizing VRAM footprint for GPU training, and building high-throughput inference endpoints.
- **Prerequisites**: Python 3.11+, PyTorch 2.2+, `transformers 4.40+`, `peft 0.10+`, `trl 0.8+`, `bitsandbytes 0.43+`, CUDA 12+.

---

## 2. Core Mental Model & Invariant Principles
1. **QLoRA Parameter Efficiency**: Never perform full-parameter fine-tuning on multi-billion parameter LLMs unless required by foundation pre-training. Freeze the base model in 4-bit NormalFloat (`BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4")`) and train lightweight Low-Rank Adaptation (LoRA) adapter matrices on attention query/key/value projection weights.
2. **Tokenization & Padding Discipline**: Always configure tokenizer `padding_side = "right"` for training and `padding_side = "left"` for batch generative inference. Ensure `pad_token_id` is explicitly set to `eos_token_id` if missing.
3. **Data Formatting & Chat Templates**: Format all instruction-tuning datasets using the model's canonical chat template (`tokenizer.apply_chat_template(messages, tokenize=False)`) to preserve special token semantics (e.g., `<|im_start|>`, `<|user|>`, `<|assistant|>`).
4. **FlashAttention-2 & Memory Optimization**: Enable FlashAttention-2 (`attn_implementation="flash_attention_2"`) and gradient checkpointing to reduce quadratic self-attention memory complexity from $O(N^2)$ to $O(N)$.

5. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Raw Instruction Dataset]
              │
              ▼
┌──────────────────────────────────────┐
│ Phase 1: Chat Template Formatting    │ ── apply_chat_template, tokenization,
│          & Tokenizer Config          │    EOS token alignment
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: 4-Bit Model Quantization    │ ── BitsAndBytesConfig(nf4), LoRA
│          & PEFT Adapter Injection    │    LoraConfig(r=16, alpha=32, targets)
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: SFT / DPO Training Loop     │ ── TRL SFTTrainer, gradient checkpointing,
│          with Accelerate             │    cosine LR scheduler, W&B logging
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Adapter Merge & Deployment  │ ── merge_and_unload(), GGUF/AWQ export,
│          Ready Serving               │    vLLM / TGI container serving
└──────────────────────────────────────┘
```

### Phase 1: QLoRA SFT Training Pipeline

```python
# src/training/train_qlora.py
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer
from datasets import load_dataset

MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"

def run_qlora_finetune(dataset_path: str, output_dir: str):
    # 1. 4-bit Quantization Configuration
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16,
        bnb_4bit_use_double_quant=True,
    )

    # 2. Load Model & Tokenizer
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        quantization_config=bnb_config,
        device_map="auto",
        torch_dtype=torch.bfloat16,
        attn_implementation="flash_attention_2",
    )
    model = prepare_model_for_kbit_training(model)

    # 3. LoRA Adapter Configuration
    peft_config = LoraConfig(
        r=16,
        lora_alpha=32,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    )
    model = get_peft_model(model, peft_config)

    # 4. Training Arguments
    training_args = TrainingArguments(
        output_dir=output_dir,
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        lr_scheduler_type="cosine",
        warmup_ratio=0.03,
        logging_steps=10,
        num_train_epochs=3,
        bf16=True,
        optim="paged_adamw_8bit",
        gradient_checkpointing=True,
        save_strategy="epoch",
        report_to="wandb",
    )

    # 5. SFT Trainer
    dataset = load_dataset("json", data_files=dataset_path, split="train")
    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        peft_config=peft_config,
        dataset_text_field="text",
        max_seq_length=4096,
        tokenizer=tokenizer,
        args=training_args,
    )
    trainer.train()
    trainer.model.save_pretrained(f"{output_dir}/final_adapter")
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "base_model": "llama_3_8b | mistral_7b",
  "tuning_method": "qlora_4bit",
  "dataset_format": "chat_template_jsonl",
  "max_seq_length": 4096,
  "hardware": "1x_or_8x_A100_H100"
}
```

### Output Contract
```json
{
  "artifacts": {
    "adapter": "adapter_model.safetensors with adapter_config.json",
    "merged_model": "16-bit merged weights for vLLM / Ollama GGUF conversion"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Targeting Only Query/Value Projections in LoRA**: Leaving `gate_proj`, `up_proj`, `down_proj` unadapted, significantly capping model downstream performance.
- ❌ **Forgetting `padding_side = 'left'` During Batch Generation**: Right-padding during auto-regressive generation causes degraded tokens and premature EOS stops.
- ❌ **Ignoring `paged_adamw_8bit`**: Using standard 32-bit AdamW on quantized models, consuming excessive GPU VRAM for optimizer states.

---

## 6. Real-World Production Example

```markdown
**Task**: Fine-tune Llama 3 8B on 50,000 domain-specific medical diagnostic dialogues on a single RTX 4090 (24GB VRAM).

1. **Optimization Stack**: Configured 4-bit QLoRA, FlashAttention-2, gradient checkpointing, and `paged_adamw_8bit`.
2. **Training Dynamics**: Ran 3 epochs in 5.4 hours with peak VRAM consumption staying at 16.8 GB.
3. **Serving**: Merged LoRA weights and exported to FP16 serving on vLLM with PagedAttention.

**Outcome**: Achieved 92.4% medical domain diagnostic accuracy with 110 tokens/sec generative throughput.
```
