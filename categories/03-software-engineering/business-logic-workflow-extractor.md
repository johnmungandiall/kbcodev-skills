# Skill: Business Logic, Workflow & Delay Extractor
`id`: `kbcodedev/business-logic-workflow-extractor`  
`category`: `03-software-engineering`  
`version`: `2.1.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Performing comprehensive codebase archaeology, reverse-engineering legacy or undocumented systems, auditing architectural boundaries, and synthesizing a Complete Behavioral Specification covering domain business logic, end-to-end execution flows, temporal mechanics, concurrency, queues, storage, and configuration.
- **Triggers**: Reverse-engineering unknown repositories, extracting hidden business rules from monolithic codebases, uncovering latency/timeout bottlenecks, mapping distributed event topologies, discovering cache/database invariants, and detecting documentation-vs-implementation drift.
- **Prerequisites**: Access to the project source tree, configuration manifests, schema definitions, and read-only repository inspection tools.

---

## 2. Core Mental Model & Invariant Principles
1. **Three-Plane Universal Decomposition**: Deconstruct any codebase along three orthogonal semantic planes:
   - **Plane A (Domain Rules & Business Invariants)**: Conditional guard branches, domain entities, validation schemas, state machine lifecycles, decision graphs, permission boundaries, and pricing/calculation algorithms.
   - **Plane B (Workflow & Execution Topologies)**: Ingress entry points, middleware sequences, call graphs, synchronous vs. asynchronous hops, message queue/event topologies, cache behaviors, external dependencies, error/recovery paths, and database transaction scopes.
   - **Plane C (Temporal Mechanics & Delays)**: Explicit thread/task pauses, transport and socket timeouts, database statement execution deadlines, retry backoff algorithms with jitter, queue visibility timeouts, polling intervals, and periodic cron schedules.
2. **Multi-Modal Evidence Synthesis over AST Alone**: Semantic AST/CST analysis is necessary but insufficient on its own. Comprehensive behavioral extraction synthesizes six converging evidence modalities:
   - (a) *Semantic AST/CST & Symbol Graphs*: Syntax trees, type hierarchies, interface implementations, and call graphs.
   - (b) *Configuration & Environment Modality*: Environment variables, static and dynamic config files, feature flags, secret manifests, and runtime settings.
   - (c) *Dependency Injection & Framework Modality*: DI container registrations, middleware pipelines, framework conventions, reflection, and dynamic import bindings.
   - (d) *Persistence & Storage Modality*: Raw SQL files, ORM migration histories, database triggers/procedures, indices, locking mechanisms, and transaction isolation levels.
   - (e) *Messaging & Integration Modality*: Message broker routing keys, topic bindings, dead-letter queues, RPC/REST client contracts, and webhook subscriptions.
   - (f) *Operational & Verification Modality*: Test suites, build manifests, CI/CD scripts, and deployment configurations providing ground-truth proof of runtime behavior.
3. **Evidence Precedence Hierarchy for Conflicting Sources**: When multiple evidence sources report conflicting information about behavior, constraints, timeouts, or flows, resolve the conflict deterministically using this strict 6-tier precedence hierarchy:
   - **Tier 1 (Highest Precedence) — Live Runtime Execution & Test Assertions**: Real executed test assertions, CI/CD run outputs, and live system metrics represent undeniable runtime ground truth.
   - **Tier 2 — Running Configuration & Active Environment Variables**: Production config files, container env overrides, active feature flags, and deployment manifests override static code defaults (e.g. an env var `TIMEOUT=10s` overrides in-code default `timeout=5s`).
   - **Tier 3 — Code Implementation & Abstract Syntax Tree (AST/CST)**: Actual implementation logic, branching conditions, SQL statements, and call hierarchies override comments, documentation, and interface stubs.
   - **Tier 4 — Dependency Injection & Declarative Schemas**: DI wiring, ORM schema mappings, serializer validation models, and migration histories.
   - **Tier 5 — Static Configuration Defaults & Fallbacks**: Default settings objects, fallback constants, and un-overridden template configs.
   - **Tier 6 (Lowest Precedence) — Documentation, Comments & OpenAPI Specs**: Inline docstrings, code comments, READMEs, architectural docs, and OpenAPI/Swagger YAML specs. If code or config conflicts with documentation, **the code/config wins**, and the discrepancy is flagged as **Documentation Drift / Contradiction**.
4. **Strict Dependency Ordering in Discovery & Extraction**: Extraction phases must execute in strict prerequisite dependency order to prevent analyzing dead branches or hallucinating unconfigured behaviors:
   - *Order 1: Manifests, Configurations & Active Environment* (must be inspected first to resolve runtime flags, module boundaries, and active toggles before parsing code).
   - *Order 2: Database Schemas, Migrations & Storage Contracts* (must be parsed before business logic to establish ground-truth entity relations, unique constraints, and transaction capabilities).
   - *Order 3: Ingress Boundaries & Routing Definitions* (must be mapped before call graphs to establish true entry-point roots).
   - *Order 4: AST Call-Graph & Execution Pipeline Traversal* (traces from verified ingress roots downstream to storage and integration sinks).
   - *Order 5: Domain Invariant, Guard & Decision Mining* (mined along verified call paths using resolved configuration values and schema constraints).
   - *Order 6: Temporal Mechanics & Concurrency Audit* (derives timeouts, retries, and cadences using Tier 2 config values over Tier 5 static defaults).
   - *Order 7: Conflict Resolution & Behavioral Specification Synthesis* (applies evidence precedence to resolve contradictions and flags documentation drift).
5. **Pure Prompt Directives without Synthetic Code Examples**: Guide the agent through structural semantic instructions, analytical protocols, and schema contracts. Never clutter the prompt with fragile, language-specific code snippets or static keyword dictionaries.
6. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Target Codebase Source Tree + Manifests + Schemas + Configurations]
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Phase 1: Ingress & Boundary Discovery                        │
│ ── HTTP/gRPC/CLI, Message Queues, Schedulers, Feature Flags │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Phase 2: Flow & Call-Graph Reconstruction                    │
│ ── Entry Points -> Interceptors -> Services -> Sinks/Storage │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Phase 3: Business Invariant & Decision Mining                │
│ ── Guards, State Lifecycles, Calculations, Hidden Rules      │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Phase 4: Temporal, Concurrency & Infrastructure Discovery    │
│ ── Delays, Timeouts, Retries, Crons, DB, Cache & Queues      │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Phase 5: Complete Behavioral Specification Synthesis         │
│ ── 24-Dimension Behavioral Model, Evidence Index & Drift     │
└──────────────────────────────────────────────────────────────┘
```

### Phase 1: Ingress & Boundary Discovery
1. Inspect project manifests, package files, and configuration descriptors to detect runtime platforms, framework conventions, and active modules.
2. Discover all ingress entry points:
   - Network APIs: REST, GraphQL, gRPC, WebSocket endpoints and route handlers.
   - Messaging consumers: Queue listeners, event stream subscribers, and worker loops.
   - Schedulers & Daemons: Periodic cron tasks, interval tickers, and maintenance runners.
   - CLI commands, background job runners, and external webhook receivers.
3. Inspect feature flags and environment configuration:
   - Identify toggles, tenant flags, dynamic config values, and environment variable bindings that control feature activation.

### Phase 2: Flow & Call-Graph Reconstruction
1. Trace downstream call graphs from each ingress point to data and network sinks:
   - Interceptors & Middleware: Authentication, rate limiting, logging, distributed tracing, and tenancy scoping.
   - Service Logic: Domain orchestrators, application services, and business handlers.
   - Storage Sinks: ORM calls, SQL queries, transaction demarcations, and row/table lock acquisitions.
   - External Network Outbounds: Third-party REST/gRPC client invocations and payment/service integrations.
2. Identify critical execution paths:
   - Map high-traffic and latency-sensitive trajectories from request entry to terminal response.
3. Identify error and recovery flows:
   - Catch handlers, fallback branches, circuit breaker trips, compensation transactions, and dead-letter queues.

### Phase 3: Business Invariant & Decision Mining
1. Extract business invariants and guard clauses:
   - Locate conditional branches that evaluate domain state and trigger abrupt terminations, rejections, or business errors.
2. Extract domain models and validation rules:
   - Catalog entity definitions, field constraints, type assertions, unique constraints, and schema validations.
3. Extract state machines and lifecycle transitions:
   - Enumerate all entity lifecycle states, permitted transitions, triggering events, validation gates, and mutation side effects.
4. Extract decision graphs and business algorithms:
   - Trace complex multi-branch decision tables, pricing formulas, discount tiers, interest computations, and quota allocations.
5. Uncover hidden business logic:
   - Identify implicit rules residing in database triggers, default column values, framework convention hooks, dynamic reflection, or unstated side effects.
6. Identify documentation-vs-implementation contradictions:
   - Compare code logic against inline documentation, READMEs, OpenAPI specs, and user guides to flag architectural and behavioral drift.

### Phase 4: Temporal, Concurrency & Infrastructure Discovery
1. Discover temporal mechanics and delays:
   - Explicit pauses and sleeps: locate thread/task pauses and record their operational rationale.
   - Transport and socket timeouts: extract connect, read, write, and cancellation timeouts for HTTP, gRPC, and database connections.
   - Retry policies: extract retry counts, backoff factors, decorrelated jitter, and retryable error filters.
   - Periodic cadences: extract cron expressions, interval timers, polling frequencies, and queue worker sleep intervals.
2. Discover concurrency and parallelism:
   - Map thread pools, async event loop spawns, worker queue concurrency caps, mutex/lock acquisitions, and race-hazard zones.
3. Discover database behavior:
   - Document transaction scopes, isolation levels, row-level locks (such as select for update), migration constraints, and cascade deletes.
4. Discover cache behavior:
   - Identify caching patterns (cache-aside, write-through), TTL durations, cache key composition, and invalidation triggers.
5. Discover queue and event topologies:
   - Map exchange-to-queue bindings, partition routing keys, consumer concurrency, ack/nack semantics, and dead-letter queue routing.

### Phase 5: Complete Behavioral Specification Synthesis
1. Compile all findings into the 24-dimension Complete Behavioral Specification:
   - Business Rules, Entry Points, Call Graph, End-to-End Flows, State Machines, Decision Graphs, Database Behavior, Cache Behavior, External Dependencies, Queue/Event Topology, Parallelism, Concurrency, Retries, Timeouts, Polling, Delays, Critical Paths, Error/Recovery Flows, Configuration Behavior, Feature Flags, Hidden Business Logic, Documentation Contradictions, Evidence Index, and Unknown/Unverified Behavior.
2. Tag every finding with file provenance (`path#symbol`), line references, and a confidence rating (`verified_code`, `inferred_convention`, `unverified_gap`).

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
  "project_root": "path/to/target/project",
  "analysis_mode": "complete_behavioral_specification",
  "evidence_modalities": [
    "ast_cst_symbol_graph",
    "runtime_configuration_and_env",
    "dependency_injection_and_framework",
    "persistence_sql_and_schemas",
    "messaging_and_queues",
    "tests_and_operational_evidence"
  ],
  "output_format": "structured_behavioral_spec"
}
```

### Output Contract
```json
{
  "summary": {
    "scanned_files_count": 0,
    "entry_points_count": 0,
    "business_rules_count": 0,
    "end_to_end_flows_count": 0,
    "state_machines_count": 0,
    "temporal_delays_count": 0,
    "external_dependencies_count": 0,
    "configuration_flags_count": 0,
    "documentation_contradictions_count": 0
  },
  "behavioral_specification": {
    "business_rules": [
      {
        "id": "BR-001",
        "domain": "Domain Name",
        "description": "Rule description",
        "invariant_type": "guard_clause_or_validation",
        "source": "path/to/file#symbol",
        "condition": "Condition expression",
        "violation_action": "Action on violation",
        "confidence": "verified_code"
      }
    ],
    "entry_points": [
      {
        "id": "EP-001",
        "protocol": "HTTP / gRPC / Queue / CLI / Cron",
        "route_or_identifier": "Ingress identifier",
        "handler": "path/to/file#symbol",
        "auth_scope": "Required permissions or auth middleware"
      }
    ],
    "call_graph": [
      {
        "from_symbol": "path/to/file#caller",
        "to_symbol": "path/to/file#callee",
        "invocation_type": "synchronous_call / async_dispatch / event_emit"
      }
    ],
    "end_to_end_flows": [
      {
        "flow_id": "FLOW-001",
        "name": "Pipeline Name",
        "entry_point_id": "EP-001",
        "critical_path": true,
        "steps": ["Step sequence description"],
        "transaction_boundary": "Transaction demarcation scope"
      }
    ],
    "state_machines": [
      {
        "entity": "Entity Name",
        "states": ["STATE_A", "STATE_B"],
        "transitions": [
          {
            "from": "STATE_A",
            "to": "STATE_B",
            "trigger": "Event or method call",
            "guard_condition": "Validation check"
          }
        ]
      }
    ],
    "decision_graphs": [
      {
        "decision_name": "Decision Name",
        "input_variables": ["var1", "var2"],
        "branches": [
          {
            "predicate": "Condition",
            "outcome": "Computed result or routing path"
          }
        ]
      }
    ],
    "database_behavior": [
      {
        "operation": "Query or mutation name",
        "table": "table_name",
        "locking": "none / row_lock_for_update / table_lock",
        "transaction_isolation": "read_committed / repeatable_read / serializable",
        "cascades_and_triggers": "Trigger names or cascade behaviors"
      }
    ],
    "cache_behavior": [
      {
        "cache_tier": "Redis / In-Memory / CDN",
        "pattern": "cache_aside / write_through",
        "ttl_seconds": "<actual project value or UNKNOWN>",
        "invalidation_triggers": ["Events or mutations invalidating this cache"]
      }
    ],
    "external_dependencies": [
      {
        "service_name": "Service Name",
        "integration_type": "REST / gRPC / Webhook / SDK",
        "endpoint_or_host": "Configured host reference",
        "timeout_seconds": "<actual project value or UNKNOWN>",
        "failure_mode": "fail_fast / fallback_response / dead_letter"
      }
    ],
    "queue_event_topology": [
      {
        "broker": "Kafka / RabbitMQ / SQS / Redis",
        "topic_or_queue": "topic_name",
        "direction": "producer / consumer",
        "dead_letter_queue": "dlq_name",
        "concurrency": "Worker concurrency setting"
      }
    ],
    "parallelism_and_concurrency": [
      {
        "scope": "Operation scope",
        "model": "worker_pool / async_gather / thread_pool",
        "concurrency_limit": "Max concurrency limit or unbounded",
        "race_hazard_safeguards": "Locks, atomic operations, or mutexes"
      }
    ],
    "temporal_delays_and_timeouts": [
      {
        "type": "explicit_delay / transport_timeout / polling_interval / cron_schedule",
        "source": "path/to/file#symbol",
        "duration_or_cadence": "Duration expression or cron pattern",
        "purpose": "Operational rationale"
      }
    ],
    "retries_and_backoffs": [
      {
        "target_operation": "Operation name",
        "max_attempts": "<actual project value or UNKNOWN>",
        "backoff_policy": "exponential_with_jitter / linear / fixed",
        "retryable_errors": ["Error classes triggering retry"]
      }
    ],
    "critical_paths": [
      {
        "path_name": "Primary checkout pipeline",
        "p99_latency": {
          "value": null,
          "source": "runtime_measurement|config|documentation|unknown"
        },
        "latency_target": {
          "value": null,
          "source": "config|documentation|contract|unknown"
        },
        "bottleneck_operations": ["External payment call", "Database row lock"]
      }
    ],
    "error_and_recovery_flows": [
      {
        "error_scenario": "Scenario name",
        "detection_point": "path/to/file#symbol",
        "recovery_strategy": "circuit_breaker / compensation_transaction / fallback",
        "user_facing_outcome": "Sanitized error message or fallback value"
      }
    ],
    "configuration_behavior": [
      {
        "config_key": "CONFIG_KEY_NAME",
        "source": "env / file / remote_store",
        "default_value": "Default value",
        "behavioral_impact": "Impact on system behavior when toggled"
      }
    ],
    "feature_flags": [
      {
        "flag_name": "feature_flag_name",
        "evaluation_location": "path/to/file#symbol",
        "active_branches": ["Enabled branch logic", "Disabled branch logic"]
      }
    ],
    "hidden_business_logic": [
      {
        "location": "Database trigger / default value / middleware convention",
        "implicit_rule": "Implicit behavior not documented in application code",
        "risk_level": "high / medium / low"
      }
    ],
    "documentation_contradictions": [
      {
        "documented_claim": "Claim in documentation or comments",
        "actual_implementation": "Actual code behavior",
        "discrepancy_impact": "Impact of behavioral drift"
      }
    ],
    "evidence_index": [
      {
        "finding_id": "BR-001",
        "evidence_type": "ast_node / config_file / sql_migration / test_case",
        "provenance": "path/to/file#symbol:line",
        "confidence": "verified_code"
      }
    ],
    "unknown_unverified_behavior": [
      {
        "subsystem": "Subsystem name",
        "unresolved_question": "Unknown behavior due to missing dynamic evidence",
        "verification_requirement": "How to verify in running environment"
      }
    ]
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Inverted Precedence / Documentation Credulity**: Believing README documentation, code comments, or architectural diagrams over real code execution and active configuration. Static documentation must never override verified implementation; discrepancies must be classified as documentation drift.
- ❌ **Unordered Extraction**: Attempting to extract business logic or call graphs before resolving active environment configuration flags and database storage schemas, leading to analyzing dead branches or hallucinating unconfigured behaviors.
- ❌ **AST-Only Monoculture**: Relying solely on AST parsing while ignoring configuration files, database triggers, message brokers, dependency injection bindings, and dynamic environment flags where critical business behavior actually lives.
- ❌ **Hardcoded Code Examples in Prompt**: Including synthetic or language-specific code snippets in the skill prompt. Directives must remain purely conceptual, analytical, and instruction-driven.
- ❌ **Static Rosters & Keyword Dictionaries**: Relying on static lists of function names, frameworks, or libraries instead of semantic AST node introspection and type-directed discovery.
- ❌ **Ignoring Implicit & Cascading Delays**: Overlooking connection pool checkout timeouts, socket keepalive delays, gRPC channel deadlines, or queue visibility timeouts.
- ❌ **Disconnected Flow Spaghetti**: Generating disjointed lists of functions without tracing the complete causative sequence connecting ingress, domain logic, external I/O, delays, and state mutations.
- ❌ **Unverified Assertions**: Reporting inferred conventions as verified ground truth without corroboration from codebase evidence or configuration manifests.

---

## 6. Real-World Production Example

**Objective**: Perform complete behavioral extraction across an enterprise multi-service repository to synthesize the 24-dimension Complete Behavioral Specification.

**Step 1: Multi-Modal Ingress & Configuration Discovery**
Inspect project manifests, environment files, container definitions, and feature flag configs. Catalog all ingress API endpoints, queue listeners, and cron schedulers alongside active environment variables and feature flags.

**Step 2: Flow & Call-Graph Reconstruction**
Walk downstream from each ingress point through middleware, service layers, and storage boundaries. Demarcate database transaction scopes, cache operations, and external network dependencies. Trace error handling branches and circuit breaker recovery fallbacks.

**Step 3: Domain Invariants, Decisions & State Machines**
Mine conditional branching nodes to extract business invariants and guard clauses. Extract domain entities, validation constraints, and decision tables. Trace state mutation triggers to reconstruct complete entity state machine lifecycles.

**Step 4: Temporal Mechanics, Concurrency & Infrastructure Audit**
Catalog explicit thread pauses, client/socket timeouts, database statement limits, retry backoff algorithms with jitter, and cron intervals. Map worker concurrency limits, database transaction isolation levels, cache invalidation hooks, and message queue topic topologies.

**Step 5: Complete Behavioral Specification Synthesis**
Compile all 24 behavioral dimensions into the structured JSON specification. Index every finding with exact file#symbol provenance and confidence ratings. Flag any discrepancies between existing documentation and actual code implementation.
