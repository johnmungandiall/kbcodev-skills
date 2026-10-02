# Skill: Feature Store & Streaming Feature Pipeline
`id`: `kbcodedev/feature-store-pipeline`  
`category`: `13-data-engineering-mlops`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Designing, managing, and serving real-time and batch machine learning feature stores (Feast, Hopsworks, Redis + Snowflake), point-in-time correct training dataset generation, and streaming transformations.
- **Triggers**: Machine learning training/serving feature skew, online low-latency feature retrieval (<10ms), feature deduplication across data science teams.
- **Prerequisites**: Batch datastore (Snowflake/BigQuery/S3 Parquet), Online low-latency store (Redis/DynamoDB), Feast SDK.

---

## 2. Core Mental Model & Invariant Principles
1. **Training-Serving Skew Prevention**: Use the exact same feature transformation definition for both offline historical training data and real-time online inference.
2. **Point-in-Time Correctness (Time-Travel Joins)**: Never allow future data leakage when generating training datasets; join features based on the timestamp when the prediction event occurred.
3. **Dual Storage Strategy**: Batch Store (Parquet/Snowflake) for high-throughput analytical model training; Online Store (Redis Key-Value) for sub-10ms real-time inference lookups.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Streaming Events (Kafka) / Batch Logs (S3)]
                    │
                    ▼
┌───────────────────────────────────────────┐
│ Step 1: Feature View Definition (Feast)   │ ── Entities, Features, Aggregations, TTL
└───────────────────┬───────────────────────┘
                    ▼
┌───────────────────────────────────────────┐
│ Step 2: Dual Materialization              │ ── Offline Parquet (Training) + Online Redis (Serving)
└───────────────────┬───────────────────────┘
                    ▼
┌───────────────────────────────────────────┐
│ Step 3: Point-in-Time Historical Join     │ ── get_historical_features(entity_df)
└───────────────────┬───────────────────────┘
                    ▼
┌───────────────────────────────────────────┐
│ Step 4: Online Low-Latency Retrieval      │ ── get_online_features(entity_keys) in 4ms
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
  "entity": "user_id",
  "features": [
    "user_transaction_count_30d",
    "user_avg_order_value_cents_90d",
    "user_account_fraud_risk_score"
  ],
  "online_store": "Redis",
  "offline_store": "Snowflake"
}
```

### Output Contract
```python
# Feast Feature Store Definition
from datetime import timedelta
from feast import Entity, FeatureView, Field, ValueType, SnowflakeSource, RedisOnlineStoreConfig
from feast.types import Int64, Float32

# 1. Entity Definition
user_entity = Entity(
    name="user_id",
    value_type=ValueType.INT64,
    description="Unique user identification integer"
)

# 2. Batch & Streaming Source
user_stats_source = SnowflakeSource(
    database="ANALYTICS",
    schema="FEATURES",
    table="USER_DAILY_METRICS",
    timestamp_field="event_timestamp",
    created_timestamp_column="created_at"
)

# 3. Feature View Specification
user_metrics_fv = FeatureView(
    name="user_fraud_features",
    entities=[user_entity],
    ttl=timedelta(days=90),
    schema=[
        Field(name="user_transaction_count_30d", dtype=Int64),
        Field(name="user_avg_order_value_cents_90d", dtype=Float32),
        Field(name="user_account_fraud_risk_score", dtype=Float32),
    ],
    online=True,
    source=user_stats_source,
    tags={"team": "fraud_prevention"}
)

# Retrieval in Real-Time Inference:
# features = store.get_online_features(
#     features=["user_fraud_features:user_account_fraud_risk_score"],
#     entity_rows=[{"user_id": 99420}]
# ).to_dict()
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Target Leakage in Training Joins**: Joining feature tables using simple `LEFT JOIN ON user_id` without matching `event_timestamp`, leaking future transaction information into training data.
- ❌ **Re-Computing Features in Python at Inference**: Recalculating 30-day aggregations in real-time inside the REST prediction endpoint instead of pre-aggregating in Redis.
- ❌ **Untracked Feature Schema Drift**: Changing feature data types or units without semantic versioning.

---

## 6. Real-World Production Example

```markdown
**Fraud Detection Latency Improvement**:
- Migrated real-time feature lookups from ad-hoc SQL queries on Postgres to Redis Feature Store.
- Real-time scoring latency dropped from 220ms to 4.5ms, blocking fraudulent transactions before checkout completion.
```
