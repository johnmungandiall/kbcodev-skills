# Skill: Apache Airflow DAG & Orchestration Engineering
`id`: `kbcodedev/airflow-dag-orchestration`  
`category`: `13-data-engineering-mlops`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring robust, idempotent data pipeline DAGs (Directed Acyclic Graphs) in Apache Airflow 2+, Prefect, or Dagster, configuring sensors, task concurrency, SLA alerting, and automated backfilling.
- **Triggers**: Scheduled data pipeline authoring, ETL pipeline failure triage, DAG dependency modeling, backfilling historical data partitions.
- **Prerequisites**: Python Airflow 2.8+ SDK, task operator libraries (PostgreSQL, Snowflake, S3, Spark).

---

## 2. Core Mental Model & Invariant Principles
1. **Strict Task Idempotency**: Running a DAG task for date partition `2026-10-02` 10 times must produce the exact same outcome as running it once (e.g. `INSERT OVERWRITE` or delete partition before insert).
2. **No Heavy Compute at Top-Level DAG Scope**: Top-level code is parsed every 30 seconds by the Airflow Scheduler. Never make database queries or API calls outside of task execution operators (`@task`).
3. **Dynamic Task Mapping**: Use Airflow's `.expand()` dynamic task mapping instead of hardcoding loops of operators in DAG files.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Schedule / Event Trigger (execution_date)]
                    │
                    ▼
┌───────────────────────────────────────┐
│ Task 1: S3KeySensor (Wait for Source) │ ── poke_interval: 60s, mode: 'reschedule'
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Task 2: Transform Data (TaskFlow API) │ ── Polars/DuckDB idempotent partition transform
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Task 3: Load into Snowflake / Postgres│ ── Atomic transaction swap / INSERT OVERWRITE
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Task 4: Data Quality Assertion Gate   │ ── Great Expectations / SQLTableCheckOperator
└───────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "dag_id": "daily_customer_churn_etl",
  "schedule": "@daily",
  "catchup": false,
  "tasks": ["Wait for S3 raw logs", "Compute churn metrics", "Upsert to Postgres"]
}
```

### Output Contract
```python
from datetime import datetime, timedelta
from airflow.decorators import dag, task
from airflow.providers.amazon.aws.sensors.s3 import S3KeySensor
from airflow.providers.postgres.hooks.postgres import PostgresHook

default_args = {
    'owner': 'data_platform',
    'depends_on_past': False,
    'email_on_failure': True,
    'email': ['data-alerts@example.com'],
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
}

@dag(
    dag_id='daily_customer_churn_etl',
    default_args=default_args,
    start_date=datetime(2026, 1, 1),
    schedule='@daily',
    catchup=False,
    max_active_runs=1,
    tags=['finance', 'churn']
)
def churn_pipeline():

    # 1. Non-blocking Sensor
    wait_for_raw_data = S3KeySensor(
        task_id='wait_for_raw_data',
        bucket_name='company-lake-raw',
        bucket_key='events/{{ ds }}/transactions.parquet',
        mode='reschedule', # Frees worker slot while waiting
        poke_interval=120,
        timeout=3600
    )

    # 2. Python TaskFlow Transformation
    @task
    def calculate_daily_churn(ds=None) -> str:
        # Idempotent transformation for single date partition 'ds'
        output_path = f"s3://company-lake-clean/churn/{ds}/metrics.parquet"
        # ... Execute Polars partition aggregation ...
        return output_path

    # 3. Database Ingestion Task
    @task
    def load_to_postgres(clean_data_path: str, ds=None):
        pg_hook = PostgresHook(postgres_conn_id='postgres_analytics')
        sql = f"""
        DELETE FROM daily_churn_metrics WHERE date = '{ds}';
        -- Copy clean data into partition ...
        """
        pg_hook.run(sql)

    clean_path = calculate_daily_churn()
    wait_for_raw_data >> clean_path >> load_to_postgres(clean_path)

churn_pipeline()
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **`mode='poke'` on Long Sensors**: Blocking an Airflow Celery worker slot for 4 hours while waiting for an external file instead of using `mode='reschedule'`.
- ❌ **Database Connections in Top-Level DAG Code**: Connecting to Postgres at top-level scope, exhausting database connections every time the Airflow scheduler scans the folder.
- ❌ **Non-Idempotent Appends**: Running `INSERT INTO table SELECT ...` without partition deletion, resulting in duplicate data every time a task is retried.

---

## 6. Real-World Production Example

```markdown
**Scheduler Performance Fix**:
- Removed 12 top-level HTTP and database calls across DAG files.
- Airflow scheduler CPU usage dropped from 95% to 8%, and DAG parsing latency improved from 42s to 0.4s.
```
