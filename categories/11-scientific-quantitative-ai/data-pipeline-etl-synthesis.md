# Skill: Data Pipeline & High-Performance ETL Synthesis
`id`: `kbcodedev/data-pipeline-etl-synthesis`  
`category`: `11-scientific-quantitative-ai`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building high-throughput, memory-efficient Extract-Transform-Load (ETL) pipelines, data deduplication, schema validation, and vector database ingestion using Polars, Pandas, DuckDB, and PyArrow.
- **Triggers**: Large CSV/Parquet processing, automated data cleansing, feature store engineering, data warehouse ingestion.
- **Prerequisites**: Source data files (CSV, Parquet, JSON lines), target destination schemas.

---

## 2. Core Mental Model & Invariant Principles
1. **Polars & DuckDB Over Heavy Spark for Medium Data (<100GB)**: Use multi-threaded columnar engines (Polars/DuckDB) on single large memory instances—10x faster and cheaper than distributed Spark clusters.
2. **Streaming & Lazy Execution**: Always use LazyFrames (`pl.scan_parquet()`) and streaming chunks (`sink_parquet()`) to process datasets larger than available RAM.
3. **Data Quality Schemas as Hard Gates**: Validate data types, missing value thresholds, and ranges before committing records to downstream data lakes.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Raw Data Sources (CSV / S3 Parquet / JSONL)]
                     │
                     ▼
┌───────────────────────────────────────────┐
│ Phase 1: Lazy Schema Scan                 │ ── pl.scan_csv() with type inference
└────────────────────┬──────────────────────┘
                     ▼
┌───────────────────────────────────────────┐
│ Phase 2: Columnar Transformations         │ ── Vectorized filters, joins, aggregations
└────────────────────┬──────────────────────┘
                     ▼
┌───────────────────────────────────────────┐
│ Phase 3: Data Quality Validation Gate     │ ── Assert zero nulls in primary keys
└────────────────────┬──────────────────────┘
                     ▼
┌───────────────────────────────────────────┐
│ Phase 4: Streaming Parquet Sink           │ ── sink_parquet(compression="zstd")
└───────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "source_path": "s3://raw-data/transactions_2026_*.csv",
  "output_path": "s3://analytics/clean_transactions.parquet",
  "operations": ["Filter status == 'COMPLETED'", "Parse UTC timestamps", "Aggregate daily spend by customer"]
}
```

### Output Contract
```python
import polars as pl

def process_transaction_etl(source_pattern: str, output_path: str):
    # 1. Lazy Execution Pipeline (Zero Memory Overhead)
    lazy_pipeline = (
        pl.scan_csv(source_pattern, try_parse_dates=True)
        .filter(pl.col("status") == "COMPLETED")
        .with_columns([
            pl.col("amount_cents").cast(pl.Int64),
            pl.col("timestamp").dt.date().alias("transaction_date")
        ])
        .group_by(["customer_id", "transaction_date"])
        .agg([
            pl.col("amount_cents").sum().alias("total_daily_spend_cents"),
            pl.count().alias("transaction_count")
        ])
        .sort(["customer_id", "transaction_date"])
    )

    # 2. Stream to Optimized ZSTD-Compressed Parquet
    lazy_pipeline.sink_parquet(
        output_path,
        compression="zstd",
        compression_level=6,
        row_group_size=100_000
    )

    print(f"ETL completed. Streamed to {output_path}")
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Iterating Rows with `for index, row in df.iterrows():`**: Python row loops in Pandas are 1,000x slower than vectorized columnar operations.
- ❌ **Uncompressed CSV Exports**: Storing terabytes of uncompressed CSVs instead of snappy/zstd compressed Parquet with columnar statistics.
- ❌ **Loading 50GB into Memory at Once**: Calling `df.read_csv()` on a file larger than physical RAM, crashing the pipeline with OOM.

---

## 6. Real-World Production Example

```markdown
**ETL Performance Transformation**:
- Legacy: Python Pandas script processed 40M clickstream events in 42 minutes (peaked at 38GB RAM).
- Optimized: Rewritten in Polars LazyFrames with streaming sink.
- Result: Runtime dropped to 1 minute 48 seconds (23x speedup) using only 2.1GB RAM.
```
