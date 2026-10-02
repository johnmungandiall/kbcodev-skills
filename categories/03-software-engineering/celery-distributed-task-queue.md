# Skill: Celery Distributed Task Queue & Asynchronous Architecture Engine
`id`: `kbcodedev/celery-distributed-task-queue`  
`category`: `03-software-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building high-throughput, fault-tolerant distributed background processing pipelines in Python using Celery 5+, Redis or RabbitMQ message brokers, complex workflow canvas primitives (`group`, `chain`, `chord`), exponential backoff retries, dead-letter queues, Celery Beat periodic task scheduling, and real-time monitoring via Flower.
- **Triggers**: Offloading long-running jobs (video transcoding, PDF generation, report exports), implementing resilient webhook dispatchers with retry budgets, executing distributed batch pipelines, and scheduling periodic cron jobs.
- **Prerequisites**: Python 3.11+, Celery 5.3+, Redis 7+ or RabbitMQ 3.12+, Flower (optional for monitoring).

---

## 2. Core Mental Model & Invariant Principles
1. **Idempotency as Immutable Contract**: Every background task must be completely idempotent. Tasks can and will be retried upon network glitches, worker crashes, or broker re-deliveries. Never assume a task will run exactly once; use idempotency keys, database transaction locks, or unique state transitions.
2. **Small, Serialisable Arguments**: Pass database entity IDs (strings, integers, UUIDs) to tasks — never pass live ORM objects, file descriptors, or open database connections. Let the worker fetch fresh database state at execution time.
3. **Dedicated Queues & Priority Routing**: Segregate fast high-priority tasks (e.g., transactional emails, instant alerts) from slow long-running tasks (e.g., report synthesis, bulk imports) into separate queues with dedicated worker pools to prevent queue starvation.
4. **Canvas Workflow Composition**: Use Celery Canvas primitives (`chain` for sequential pipelines, `group` for parallel map operations, `chord` for map-reduce aggregations with callbacks) instead of synchronously waiting (`task.get()`) inside worker threads.

5. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Triggering Application (FastAPI/Django)]
                 │
                 ▼
┌────────────────────────────────────────┐
│ Phase 1: Task Dispatch & Routing       │ ── Queue assignment, payload serialization,
│          (ID-only payload)             │    countdown / eta scheduling
└──────────────────┬─────────────────────┘
                   ▼
┌────────────────────────────────────────┐
│ Phase 2: Broker Transport (RabbitMQ/   │ ── ACK configuration, prefetch limits,
│          Redis)                        │    dead-letter queue routing
└──────────────────┬─────────────────────┘
                   ▼
┌────────────────────────────────────────┐
│ Phase 3: Worker Execution & Resilience │ ── Exponential backoff retry, timeout limits
│                                        │    (soft/hard time_limit), idempotency lock
└──────────────────┬─────────────────────┘
                   ▼
┌────────────────────────────────────────┐
│ Phase 4: Canvas Aggregation & Result   │ ── Chord callback execution, state storage
│          Egress                        │    (Redis), metrics logging to Flower
└────────────────────────────────────────┘
```

### Phase 1: Celery App Factory & Configuration

```python
# core/celery_app.py
from celery import Celery
from kombu import Exchange, Queue
from core.config import settings

celery_app = Celery("enterprise_worker")

celery_app.conf.update(
    broker_url=settings.CELERY_BROKER_URL,
    result_backend=settings.CELERY_RESULT_BACKEND,
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,  # Acknowledge after task execution completes
    worker_prefetch_multiplier=1,  # Fair task distribution for long jobs
    task_time_limit=300,  # Hard kill after 5 minutes
    task_soft_time_limit=240,  # Soft exception after 4 minutes
    # Custom Queue Routing
    task_queues=(
        Queue("default", Exchange("default"), routing_key="default"),
        Queue("high_priority", Exchange("high_priority"), routing_key="high_priority"),
        Queue("batch_reports", Exchange("batch_reports"), routing_key="batch_reports"),
    ),
    task_routes={
        "core.tasks.notifications.*": {"queue": "high_priority"},
        "core.tasks.reports.*": {"queue": "batch_reports"},
    },
)
```

### Phase 2: Resilient Task Definition with Backoff

```python
# core/tasks/notifications.py
import structlog
from celery.exceptions import SoftTimeLimitExceeded
from core.celery_app import celery_app
from core.services.notification_service import NotificationService
from core.database import get_sync_session

logger = structlog.get_logger()

@celery_app.task(
    bind=True,
    max_retries=5,
    default_retry_delay=5,
    autoretry_for=(Exception,),
    retry_backoff=True,  # 5s, 10s, 20s, 40s, 80s
    retry_backoff_max=300,
    retry_jitter=True,
)
def send_webhook_task(self, webhook_id: str, payload: dict):
    """Resilient webhook dispatch with automatic exponential backoff jitter."""
    try:
        logger.info("task.webhook.start", webhook_id=webhook_id, attempt=self.request.retries)
        with get_sync_session() as session:
            service = NotificationService(session)
            service.deliver_webhook(webhook_id=webhook_id, payload=payload)
    except SoftTimeLimitExceeded:
        logger.error("task.webhook.timeout_soft", webhook_id=webhook_id)
        # Handle graceful cleanup before hard kill
        raise
```

### Phase 3: Canvas Workflow (Map-Reduce Chord)

```python
# core/tasks/data_processing.py
from celery import chord, group
from core.celery_app import celery_app

@celery_app.task
def process_chunk_task(chunk_id: str) -> dict:
    """Worker processing individual chunk in parallel."""
    # Process computation
    return {"chunk_id": chunk_id, "processed_rows": 1000, "status": "ok"}

@celery_app.task
def aggregate_chunks_callback(results: list[dict], batch_id: str):
    """Chord callback executing only when ALL chunks finish."""
    total_processed = sum(r["processed_rows"] for r in results)
    # Finalize batch record in DB
    return {"batch_id": batch_id, "total": total_processed}

def dispatch_batch_pipeline(chunk_ids: list[str], batch_id: str):
    """Compose parallel group tasks into an aggregated chord callback."""
    workflow = chord(
        group(process_chunk_task.s(cid) for cid in chunk_ids),
        aggregate_chunks_callback.s(batch_id=batch_id),
    )
    return workflow.apply_async()
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "broker": "redis | rabbitmq",
  "result_backend": "redis | postgresql",
  "queues": ["default", "high_priority", "batch_reports"],
  "task_resilience": {
    "retry_backoff": true,
    "max_retries": 5,
    "acks_late": true,
    "prefetch_multiplier": 1
  }
}
```

### Output Contract
```json
{
  "canvas_patterns": {
    "chain": "Sequential tasks: task1.s() | task2.s()",
    "group": "Parallel tasks: group(task.s(i) for i in items)",
    "chord": "Map-reduce: chord(group)(callback.s())"
  },
  "reliability_guarantees": {
    "idempotent_execution": "Every task handles repeat calls safely",
    "zero_deadlock_on_subtasks": "Never invoke task.get() inside worker"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Calling `task.get()` or `.wait()` Inside a Task**: Blocks worker processes, rapidly causing distributed deadlock as worker pool threads wait for each other.
- ❌ **Passing Live Database/ORM Objects as Arguments**: Serializing SQLAlchemy or Django model instances leads to stale data or deserialization crashes across worker nodes. Pass integer IDs only.
- ❌ **Ignoring `task_acks_late` for Critical Work**: Default Celery acknowledges tasks immediately on receipt; if worker crashes mid-task, message is permanently lost.
- ❌ **Unbounded Concurrency on Single Shared Queue**: Heavy batch tasks consuming all worker slots, starving time-sensitive transactional emails. Use dedicated queues.

---

## 6. Real-World Production Example

```markdown
**Task**: Architect a high-volume email campaign dispatch engine sending 500,000 personalized emails within 15 minutes.

1. **Queue Segregation**: Configured `campaign_emails` queue with 20 gevent concurrency workers separate from `default` API queue.
2. **Chunked Canvas**: Used Celery `chord` to chunk 500k recipients into 500 batches of 1,000, fanning out to parallel worker nodes with aggregated completion callback.
3. **Backoff Retries**: Configured exponential backoff with jitter for SMTP rate limit (429) resilience.

**Outcome**: Completed campaign in 11 minutes with 99.98% delivery success and zero impact on primary web application response times.
```
