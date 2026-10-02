# Skill: Event-Driven Architecture & Message Streaming
`id`: `kbcodedev/event-driven-streaming`  
`category`: `02-system-architecture`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Asynchronous service decoupling, stream processing, high-throughput event ingestion (Kafka, RabbitMQ, SQS, Redis Streams), and event sourcing/CQRS.
- **Triggers**: Async background job processing, event notifications, multi-consumer broadcast streams, audit trail logging.
- **Prerequisites**: Broker infrastructure, message schema registry (Avro/Protobuf/JSON Schema), consumer group topology.

---

## 2. Core Mental Model & Invariant Principles
1. **At-Least-Once Delivery**: Message brokers guarantee delivery, but network retries mean consumers WILL receive duplicate messages. Design consumers to be strictly idempotent.
2. **Partition Ordering vs Global Ordering**: In distributed logs (Kafka), ordering is guaranteed ONLY within a single partition (determined by message partition key).
3. **Dead Letter Queue (DLQ)**: Poison pill messages that fail processing after $N$ retry attempts must be shunted to a DLQ without blocking the consumer partition.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Producer Service] ── Writes Event to Local Outbox DB Table
        │
        ▼
[Outbox Relay Worker] ── Publishes Event with Partition Key
        │
        ▼
┌────────────────────────┐
│ Kafka / RabbitMQ Topic │ ── Partitioned Distributed Stream
└──────────┬─────────────┘
           ├────────────────────────────┐
           ▼                            ▼
┌─────────────────────┐      ┌─────────────────────┐
│ Consumer A (Billing)│      │ Consumer B (Email)  │
└──────────┬──────────┘      └──────────┬──────────┘
           │                            │
      [Failed x3]                   [Success]
           ▼                            ▼
┌─────────────────────┐      ┌─────────────────────┐
│ Dead Letter Queue   │      │ Commit Offset       │
└─────────────────────┘      └─────────────────────┘
```

### Standard CloudEvent Envelope (v1.0)
```json
{
  "specversion": "1.0",
  "id": "evt_7f8a9b2c-3d4e-5f6a",
  "source": "https://services.example.com/order-service",
  "type": "com.example.order.created.v1",
  "datacontenttype": "application/json",
  "time": "2026-10-02T14:30:00Z",
  "data": {
    "order_id": "ord_9941",
    "customer_id": "cust_1120",
    "amount_cents": 4900,
    "currency": "USD"
  }
}
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "event_type": "UserRegisteredEvent",
  "producer": "AuthService",
  "consumers": ["EmailService", "AnalyticsService", "FraudDetectionService"],
  "partition_key": "user_id"
}
```

### Output Contract
```typescript
// Production Consumer Handler with DLQ & Idempotency
export async function handleUserRegisteredEvent(
  message: KafkaMessage,
  idempotencyStore: IdempotencyRepository,
  dlqProducer: KafkaProducer
): Promise<void> {
  const event = JSON.parse(message.value.toString());
  const eventId = event.id;

  // 1. Idempotency Gate
  if (await idempotencyStore.hasProcessed(eventId)) {
    console.log(`Event ${eventId} already processed. Skipping.`);
    return;
  }

  try {
    // 2. Business Execution
    await sendWelcomeEmail(event.data.email, event.data.name);

    // 3. Mark Processed
    await idempotencyStore.markProcessed(eventId, 86400); // 24h TTL
  } catch (error) {
    if (message.retryCount >= 3) {
      await dlqProducer.sendToDLQ("user-registered-dlq", message, error);
    } else {
      throw error; // Trigger backoff retry
    }
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Missing Partition Keys in Kafka**: Publishing messages with random null keys causing out-of-order state mutations for the same entity.
- ❌ **Blocking the Entire Consumer Group**: Retrying a malformed payload infinitely without DLQ routing, freezing the pipeline for all valid messages.
- ❌ **State Synchronization via Ephemeral Events**: Using pub/sub events as the primary source of truth without backing persistent state stores.

---

## 6. Real-World Production Example

```markdown
**Architecture**: Payment Gateway Webhook Ingestion.
- Webhook receiver immediately validates signature, writes raw webhook payload to Kafka topic `stripe-raw-webhooks` (partitioned by `customer_id`), and returns `200 OK` in 12ms.
- Downstream async workers ingest events, update customer balances, and publish downstream notifications with zero risk of webhook timeouts.
```
