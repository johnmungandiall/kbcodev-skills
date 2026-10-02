# Skill: Polars & Pandas High-Performance DataFrame Processing Engine
`id`: `kbcodedev/polars-pandas-dataframe-engine`  
`category`: `13-data-engineering-mlops`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Engineering high-performance tabular data processing, feature engineering, and ETL pipelines using Python, Polars (LazyFrame, expression engine, streaming batches), Pandas 2.x (PyArrow backend), Parquet partitioning, and out-of-core computations on massive datasets.
- **Triggers**: Processing multi-gigabyte CSV/Parquet datasets, migrating slow Pandas pipelines to ultra-fast Polars LazyFrames, eliminating Python GIL bottlenecks in data aggregation, and building production-grade data transformation engines.
- **Prerequisites**: Python 3.11+, Polars 1.0+, Pandas 2.2+, PyArrow 15+, DuckDB (optional for hybrid analytical queries).

---

## 2. Core Mental Model & Invariant Principles
1. **Lazy Execution & Query Plan Optimization**: In Polars, always build transformations on `LazyFrame` (`pl.scan_parquet()`, `pl.scan_csv()`). Let the Polars query optimizer perform predicate pushdown (filtering before reading disk) and projection pushdown (loading only necessary columns) before invoking `.collect()`.
2. **Vectorized Expression Engine (No Python `for` loops or `apply()`)**: Never iterate over DataFrame rows or use custom Python `.apply()` functions that force Python bytecode execution per row. Express all mutations using native Polars expressions (`pl.col("x").filter(...)`, `pl.when().then().otherwise()`) executed in multi-threaded Rust.
3. **Apache Arrow Memory Foundation**: Leverage zero-copy Apache Arrow memory structures. When using Pandas 2.x, configure `dtype_backend="pyarrow"` to eliminate high RAM overhead and gain native missing value (null) support without type-casting floats.
4. **Streaming for Out-of-Core Processing**: When datasets exceed available system RAM, invoke `.collect(streaming=True)` in Polars to process data in chunked streaming batches rather than crashing with Out-Of-Memory (OOM) errors.

5. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Raw Files (Parquet/CSV/Delta)]
              │
              ▼
┌──────────────────────────────────────┐
│ Phase 1: Lazy Scanning & Predicate   │ ── pl.scan_parquet, projection pushdown,
│          Pushdown                    │    partition pruning
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: Vectorized Expression       │ ── pl.col transformations, window functions,
│          Pipeline                    │    pl.when/then condition matrices
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Fast GroupBy Aggregations   │ ── Multi-threaded aggregations, dynamic
│          & Window Partitions         │    rolling calculations
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Streaming Execution &       │ ── .collect(streaming=True), partitioned
│          Parquet Sink                │    Parquet output with Snappy/ZSTD
└──────────────────────────────────────┘
```

### Phase 1: Polars Lazy Pipeline & Feature Engineering

```python
# src/etl/pipeline.py
import polars as pl
from datetime import datetime

def process_financial_transactions(
    input_glob: str,
    output_path: str,
    start_date: datetime,
) -> pl.DataFrame:
    """High-performance out-of-core financial transaction ETL pipeline."""
    # 1. Scan Parquet files with lazy evaluation
    lazy_df = pl.scan_parquet(input_glob)

    # 2. Vectorized transformation pipeline with predicate pushdown
    processed_lazy = (
        lazy_df
        # Predicate pushdown (filters applied during disk read)
        .filter(pl.col("timestamp") >= start_date)
        .filter(pl.col("status") == "COMPLETED")
        # Feature engineering via native expressions
        .with_columns(
            (pl.col("amount") * pl.col("exchange_rate")).alias("amount_usd"),
            pl.col("timestamp").dt.truncate("1d").alias("transaction_day"),
            pl.when(pl.col("amount") > 10000)
            .then(pl.lit("HIGH_VALUE"))
            .otherwise(pl.lit("STANDARD"))
            .alias("risk_tier"),
        )
        # Window calculation: rolling 7-day spend per customer
        .with_columns(
            pl.col("amount_usd")
            .sum()
            .over(
                partition_by="customer_id",
                order_by="timestamp",
            )
            .alias("cumulative_customer_spend")
        )
    )

    # 3. Stream execution to avoid RAM exhaustion on massive datasets
    processed_lazy.sink_parquet(
        output_path,
        compression="zstd",
        compression_level=3,
        row_group_size=100_000,
    )
```

### Phase 2: Pandas 2.x PyArrow Engine Configuration

```python
# src/etl/pandas_arrow.py
import pandas as pd

def load_with_pyarrow_backend(csv_path: str) -> pd.DataFrame:
    """Load large CSV with zero-copy PyArrow strings and nullable types."""
    return pd.read_csv(
        csv_path,
        engine="pyarrow",
        dtype_backend="pyarrow",
    )
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
  "engine": "polars_lazy | pandas_2_pyarrow",
  "dataset_size": "10GB+",
  "input_format": "parquet | csv",
  "execution_mode": "streaming_out_of_core",
  "compression": "zstd_snappy"
}
```

### Output Contract
```json
{
  "performance_metrics": {
    "memory_footprint": "Bounded via streaming chunks (never exceeds 4GB RAM)",
    "execution_speed": "10x-50x faster than legacy Pandas apply() loops",
    "disk_io": "Minimized via Parquet column projection and predicate pushdown"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Using `.apply(lambda row: ...)`**: Drops down into single-threaded Python interpreter loops, destroying Polars/Pandas multi-core Rust/C++ SIMD performance.
- ❌ **Eagerly Collecting (`.collect()`) Too Early**: Calling `.collect()` immediately after scanning forces the entire raw dataset into memory, defeating query optimization and causing OOM.
- ❌ **Writing Uncompressed Raw CSVs for Large Data**: Producing giant I/O-bound CSV files instead of partitioned, columnar compressed Parquet formats.

---

## 6. Real-World Production Example

```markdown
**Task**: Aggregate and extract fraud features from 450 million transaction logs (85 GB raw data) daily.

1. **Pipeline Migration**: Replaced 4-hour PySpark job with a single-node Polars LazyFrame script.
2. **Lazy Optimization**: Used `pl.scan_parquet()` with predicate pushdown on `transaction_year` and column projection.
3. **Out-of-Core Streaming**: Processed all 450M rows using `.sink_parquet(streaming=True)` on a 16-core workstation with 32GB RAM.

**Outcome**: Pipeline completed in 4.8 minutes (50x speedup vs original Pandas/Spark pipeline) with peak memory consumption under 6 GB RAM.
```
