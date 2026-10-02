# Skill: Vector Database & Hybrid RAG Retrieval Engine
`id`: `kbcodedev/vector-database-rag-engine`  
`category`: `13-data-engineering-mlops`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building production-grade Retrieval-Augmented Generation (RAG) pipelines, vector database indexing (Qdrant, Pinecone, Chroma, pgvector), hybrid sparse/dense search (BM25 + Dense Embeddings), semantic chunking, and Cohere/Cross-Encoder reranking.
- **Triggers**: RAG pipeline hallucination elimination, knowledge base search indexing, semantic doc retrieval, multi-modal search.
- **Prerequisites**: Embedding model (`text-embedding-3-small`, BGE-M3), Vector Database instance, Reranker model.

---

## 2. Core Mental Model & Invariant Principles
1. **Hybrid Search Supremacy (Dense + Sparse)**: Pure vector search fails on exact product codes, acronyms, and names. Combine Dense Vectors (Semantic concepts) with Sparse BM25 (Keyword precision) using Reciprocal Rank Fusion (RRF).
2. **Semantic Chunking Over Naive Fixed Splitting**: Split documents along semantic boundaries (Markdown headings, paragraph structures) with parent-child context linking rather than arbitrary 500-token hard slices.
3. **Cross-Encoder Reranking Gate**: Always run retrieved top-25 chunks through a cross-encoder reranker to pick the top-5 most relevant chunks before feeding LLM context.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[User Query: "What is our SOC2 password rotation policy?"]
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
[Dense Embedding (1536-dim)]    [Sparse BM25 Tokens]
       │                               │
       └───────────────┬───────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Phase 1: Qdrant / Pgvector Hybrid Search     │ ── Retrieve Top-25 candidate chunks
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Phase 2: Cross-Encoder / Cohere Reranking    │ ── Rank top-25 down to Top-5 highest relevance
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Phase 3: Prompt Context Injection            │ ── Deduplicate & format into LLM prompt
└──────────────────────────────────────────────┘
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
  "query": "Kubernetes pod memory limit best practices",
  "top_k": 5,
  "collection": "engineering_runbooks"
}
```

### Output Contract
```python
import qdrant_client
from qdrant_client.models import Prefetch, SearchRequest
from sentence_transformers import CrossEncoder

def hybrid_rag_retrieve(query: str, client: qdrant_client.QdrantClient, top_k: int = 5):
    # 1. Generate Embeddings
    dense_vec = get_dense_embedding(query)   # e.g. text-embedding-3-small
    sparse_vec = get_sparse_bm25(query)      # SPLADE or BM25

    # 2. Qdrant Hybrid Search with Reciprocal Rank Fusion (RRF)
    raw_results = client.query_points(
        collection_name="engineering_runbooks",
        prefetch=[
            Prefetch(query=dense_vec, using="dense", limit=25),
            Prefetch(query=sparse_vec, using="sparse", limit=25),
        ],
        query=models.FusionQuery(fusion=models.Fusion.RRF),
        limit=25
    )

    candidate_texts = [hit.payload["text"] for hit in raw_results.points]

    # 3. Cross-Encoder Reranking
    reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
    pairs = [[query, text] for text in candidate_texts]
    scores = reranker.predict(pairs)

    # Sort and take Top-K
    scored_candidates = sorted(zip(candidate_texts, scores), key=lambda x: x[1], reverse=True)
    top_chunks = [cand[0] for cand in scored_candidates[:top_k]]

    return top_chunks
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Naive Fixed-Character Chunking**: Splitting text blindly at 1,000 characters, cutting sentences and code blocks in half.
- ❌ **Vector-Only Search for Exact Keywords**: Searching for specific error code `"ERR_9941"` using pure dense embeddings, retrieving irrelevant general error pages.
- ❌ **Context Flooding Without Reranking**: Stuffing 50 unranked vector chunks into prompt context, triggering "Lost in the Middle" LLM attention degradation.

---

## 6. Real-World Production Example

```markdown
**RAG Accuracy Leap**:
- Baseline: Standard cosine similarity on 500-token chunks achieved 64% retrieval accuracy on technical documentation.
- Optimized: Hybrid BM25 + Dense Qdrant search with Cross-Encoder reranking boosted retrieval accuracy to 94.8% while cutting context tokens by 60%.
```
