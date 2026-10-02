# Skill: Data Lakehouse Architecture (Delta Lake & Apache Iceberg)
`id`: `kbcodedev/data-lakehouse-delta-iceberg`  
`category`: `13-data-engineering-mlops`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Designing scalable, ACID-compliant Data Lakehouses using Apache Iceberg, Delta Lake, or Apache Hudi on cloud object storage (S3/GCS/Azure Blob), managing schema evolution, compaction, and time-travel audits.
- **Triggers**: Lakehouse design, data corruption on object stores, slow parquet query performance, GDPR Right-to-be-Forgotten row deletion requirements.
- **Prerequisites**: Cloud object storage, query engine (DuckDB, Trino, Spark, Snowflake, Athena), Iceberg/Delta table catalogs.

---

## 2. Core Mental Model & Invariant Principles
1. **ACID Transactions on Object Storage**: Ensure atomic commits, snapshot isolation, and rollback capabilities directly on object store buckets via metadata manifest logs.
2. **Compaction & Small File Elimination**: Automatically merge thousands of small partition files into optimized 128MB-512MB Parquet files to prevent metadata scan overhead.
3. **Time Travel & Zero-Copy Branching**: Query historical snapshots (`VERSION AS OF 42` or `TIMESTAMP AS OF '2026-09-01'`) for reproducible ML training and instant rollback.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Raw Streaming / Batch Data Ingestion]
                   │
                   ▼
┌──────────────────────────────────────────┐
│ Step 1: Atomic ACID Write Commit         │ ── Write Parquet + Update Metadata Manifest
└──────────────────┬───────────────────────┘
                   ▼
┌──────────────────────────────────────────┐
│ Step 2: Hidden Partitioning & Indexing   │ ── Iceberg partition evolution (e.g. days(ts))
└──────────────────┬───────────────────────┘
                   ▼
┌──────────────────────────────────────────┐
│ Step 3: Compaction Maintenance Job       │ ── Rewrite small files into 256MB blocks
└──────────────────┬───────────────────────┘
                   ▼
┌──────────────────────────────────────────┐
│ Step 4: Time-Travel & Snapshot Query     │ ── Query historical states for audits/ML
└──────────────────────────────────────────┘
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
  "lakehouse_format": "Apache Iceberg",
  "table_name": "analytics.user_events",
  "storage_location": "s3://company-lakehouse/user_events/",
  "partition_key": "days(event_timestamp)"
}
```

### Output Contract
```sql
-- Production Apache Iceberg Table DDL & Maintenance SQL
CREATE TABLE analytics.user_events (
    event_id UUID,
    user_id BIGINT,
    event_name VARCHAR(100),
    event_payload JSON,
    event_timestamp TIMESTAMPTZ,
    ingestion_date DATE
)
USING ICEBERG
PARTITIONED BY (days(event_timestamp))
LOCATION 's3://company-lakehouse/user_events/'
TBLPROPERTIES (
    'write.format.default' = 'parquet',
    'write.parquet.compression-codec' = 'zstd',
    'write.parquet.compression-level' = '6',
    'history.expire.max-snapshot-age-ms' = '604800000', -- 7 Days
    'write.object-storage.enabled' = 'true'
);

-- GDPR Compliant Row Deletion with Snapshot Isolation
DELETE FROM analytics.user_events 
WHERE user_id = 991204;

-- Time-Travel Historical Query for ML Audits
SELECT COUNT(*), AVG(CAST(event_payload->>'amount' AS DOUBLE))
FROM analytics.user_events 
FOR SYSTEM_TIME AS OF TIMESTAMP '2026-10-01 00:00:00 UTC';
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **The Small File Problem**: Ingesting streaming data directly to S3 every 10 seconds without running periodic compaction, creating 500,000 tiny 5KB files that choke query engines.
- ❌ **Over-Partitioning**: Partitioning tables by `user_id` or `minute` creating millions of empty partitions.
- ❌ **Manual S3 Deletions**: Deleting `.parquet` files directly via S3 API instead of through Iceberg/Delta table maintenance APIs, corrupting table metadata catalogs.

---

## 6. Real-World Production Example

```markdown
**Query Acceleration with Iceberg**:
- Migrated raw S3 Hive table with 2M small files to Apache Iceberg with ZSTD compression and automated compaction.
- Trino query scanning time decreased from 4 minutes 20 seconds to 1.8 seconds.
```
