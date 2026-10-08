# Skill: Business Logic, Workflow & Delay Extractor

`id`: `kbcodedev/business-logic-workflow-extractor`  
`category`: `03-software-engineering`  
`version`: `2.2.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions

### When to Use

Use this skill whenever the objective requires comprehensive behavioral understanding of an existing software system, including:

- Codebase archaeology
- Reverse-engineering unknown or undocumented repositories
- Business-rule extraction
- End-to-end workflow reconstruction
- Call-graph and execution-path analysis
- Delay, timeout, retry, polling, and scheduling extraction
- Concurrency and parallelism analysis
- Database, cache, queue, and event topology analysis
- External dependency analysis
- Configuration and feature-flag behavior analysis
- Documentation-vs-implementation drift detection
- Architectural boundary auditing
- Generation of a complete behavioral specification from actual project evidence

The skill's mission is not to produce a plan for later execution.

**The mission is to autonomously execute the complete analysis and return a verified behavioral specification.**

### Triggers

Activate when the user requests or the surrounding task implies:

- "Extract all business logic"
- "Understand how this project works"
- "Map the complete flow"
- "Find all delays/timeouts/retries"
- "Reverse engineer this repository"
- "Document the complete behavior"
- "Find hidden business rules"
- "Analyze execution paths"
- "Analyze trading/order/payment/workflow logic"
- "Find all dependencies and integrations"
- "Generate a behavioral specification"
- "Compare implementation with documentation"
- "Explain what the system actually does"

### Prerequisites

Use whatever project evidence is available, including:

- Source tree
- Dependency manifests and lockfiles
- Configuration files
- Environment definitions
- Database schemas and migrations
- API specifications
- Queue/event definitions
- Infrastructure/deployment definitions
- Tests
- Build/lint/type-check configuration
- Runtime evidence where available
- Logs, traces, metrics, fixtures, or recorded outputs where available

Do not require a particular programming language, framework, database, broker, deployment model, or project structure.

---

# 2. Autonomous Execution Contract

## 2.1 Mission Completion Principle

The agent MUST treat the skill as an **end-to-end execution task**, not as a request to describe future work.

The agent must autonomously:

1. Discover the project.
2. Determine the project's architecture and evidence sources.
3. Select appropriate inspection methods.
4. Extract behavioral evidence.
5. Resolve dependencies between evidence sources.
6. Reconstruct workflows.
7. Extract business rules.
8. Extract temporal behavior.
9. Normalize overlapping findings.
10. Synthesize the complete 24-dimension behavioral specification.
11. Validate the generated artifact.
12. Verify claims against project artifacts.
13. Repair failures or inconsistencies.
14. Re-run validation and verification.
15. Return the completed result.

The agent must not wait for the user to tell it how to perform any of these steps.

---

## 2.2 No Planning-Only Completion

The following are **not completion**:

- "I will now create the JSON."
- "The next step is to validate."
- "I need to formulate the specification."
- "I will inspect the artifacts."
- "Phase 5 is in progress."
- "The script will generate the specification."
- "The specification needs verification."
- "I have identified the components."
- "I am going to map these components."
- A TODO list describing work that has not been executed.
- A proposed schema without populated findings.
- A partially populated JSON artifact presented as the final result.

Planning may be used internally, but the agent must continue execution automatically.

**Do not end the task merely because a plan has been created.**

---

## 2.3 No Manual Phase Steering

The agent must not require user instructions such as:

- "Now do Phase 5."
- "Now validate it."
- "Now check the source code."
- "Now generate the JSON."
- "Now verify the results."
- "Now fix the failed validation."
- "Continue to the next phase."

The agent owns the complete workflow.

If the current phase produces enough evidence to proceed, proceed automatically.

---

## 2.4 Adaptive Execution

Do not assume a fixed implementation technique.

The agent must dynamically select the best available evidence and inspection mechanism based on the target project.

Examples:

- Python project → inspect Python modules, imports, decorators, async flows, tests, configuration.
- Flutter project → inspect Dart entry points, routes, providers, services, isolates, platform channels, Firebase configuration, native integration.
- Node.js project → inspect package manifests, module graph, middleware, async/event flows, workers.
- Java/Spring → inspect controllers, services, repositories, DI configuration, annotations, transactions.
- Rust → inspect crates, traits, async runtime, ownership boundaries, channels, database integrations.
- Go → inspect packages, handlers, goroutines, channels, contexts, interfaces.
- SQL-heavy system → inspect migrations, procedures, triggers, indexes, constraints, isolation.
- Distributed system → inspect services, brokers, queues, events, retries, idempotency, deployment configuration.

Never require the user to identify these mechanisms manually.

---

# 3. Core Mental Model & Invariant Principles

## 3.1 Three Behavioral Planes

Deconstruct the target system across three orthogonal planes.

### Plane A — Domain Rules & Business Invariants

Extract:

- Business rules
- Guard clauses
- Validation
- Domain entities
- State machines
- Permission boundaries
- Pricing/calculation logic
- Decision algorithms
- Quotas
- Eligibility rules
- Risk controls
- State-dependent behavior
- Hidden domain rules

### Plane B — Workflow & Execution Topologies

Extract:

- Entry points
- Routing
- Middleware
- Services
- Call graphs
- Synchronous flows
- Asynchronous flows
- Event emission
- Queue consumption
- Database operations
- Cache operations
- External integrations
- Transactions
- Error and recovery paths

### Plane C — Temporal Mechanics

Extract:

- Explicit delays
- Sleeps
- Polling
- Timeouts
- Cancellation deadlines
- Retry attempts
- Backoff
- Jitter
- Cron schedules
- Worker intervals
- Queue visibility timeouts
- Connection-pool waits
- Rate-limit windows
- Scheduling conversions
- Time-dependent business rules

---

## 3.2 Multi-Modal Evidence Synthesis

AST analysis alone is insufficient.

Use all relevant evidence modalities available in the target project:

1. Semantic AST/CST and symbol graphs
2. Configuration and environment
3. Dependency injection and framework wiring
4. Persistence, SQL, schemas, migrations
5. Messaging and integrations
6. Tests and operational/runtime evidence

Do not force all six modalities when a modality does not exist in the project.

**Absence of a modality is itself project information, not an error.**

---

## 3.3 Project-Grounding Invariant

The real project always wins.

Before asserting behavior:

1. Inspect the actual project.
2. Locate the implementation.
3. Resolve configuration affecting that implementation.
4. Trace dependencies.
5. Determine whether the behavior is statically provable or runtime-dependent.
6. Record provenance.
7. Assign confidence.

Never convert an example, convention, framework assumption, or inferred pattern into project fact.

If evidence is unavailable:

`confidence = "unverified_gap"`

and record the verification requirement.

---

## 3.4 Evidence Precedence

When multiple sources appear to conflict, resolve them according to the following hierarchy **only when the sources govern the same runtime context**:

### Tier 1 — Executed Runtime/Test Evidence

Highest precedence:

- Executed tests
- Runtime measurements
- Logs
- Traces
- Metrics
- Actual execution outputs

Runtime evidence must correspond to the relevant environment/configuration.

### Tier 2 — Active Runtime Configuration

Examples:

- Active environment variables
- Deployment overrides
- Runtime feature flags
- Container configuration
- Active remote configuration

### Tier 3 — Actual Code Implementation

Examples:

- Function bodies
- Branches
- SQL statements
- Call paths
- State transitions
- Error handlers

### Tier 4 — Declarative Wiring and Schemas

Examples:

- Dependency injection
- ORM mappings
- Serialization schemas
- Database migrations
- API contracts

### Tier 5 — Static Defaults

Examples:

- Default configuration
- Fallback constants
- Template configuration

### Tier 6 — Documentation

Examples:

- README
- Comments
- Docstrings
- Architecture documents
- OpenAPI descriptions

Documentation never silently overrides stronger implementation evidence.

When a conflict exists, record it under `documentation_contradictions`.

---

# 4. Dependency-Aware Discovery Order

The agent must dynamically respect prerequisite relationships.

The default dependency order is:

```text
PROJECT DISCOVERY
       ↓
ACTIVE CONFIGURATION
       ↓
DATABASE / STORAGE CONTRACTS
       ↓
INGRESS & BOUNDARIES
       ↓
CALL GRAPH / EXECUTION FLOWS
       ↓
BUSINESS RULES & STATE
       ↓
TEMPORAL / CONCURRENCY BEHAVIOR
       ↓
CROSS-EVIDENCE RECONCILIATION
       ↓
24-DIMENSION SYNTHESIS
       ↓
SCHEMA VALIDATION
       ↓
PROJECT VERIFICATION
       ↓
REPAIR / REVALIDATE
       ↓
FINAL VERIFIED SPECIFICATION
```

This is a dependency model, not a rigid tool-specific implementation.

If project evidence reveals a different dependency relationship, adapt while preserving the invariant:

**Do not make a behavioral claim before resolving the evidence required to establish that claim.**

---

# 5. Autonomous Execution Workflow

## Phase 0 — Project Discovery

Automatically determine:

- Repository structure
- Languages
- Frameworks
- Runtime targets
- Build systems
- Dependency managers
- Databases
- Caches
- Message brokers
- External services
- Test systems
- Deployment systems
- Configuration mechanisms

Determine which evidence modalities actually exist.

Do not assume a modality exists.

### Completion condition

The agent can identify:

- What the project is.
- How it runs.
- Where configuration comes from.
- Where major runtime boundaries exist.
- Which evidence sources are available.

---

## Phase 1 — Configuration, Environment & Storage Grounding

Resolve:

- Environment variables
- Configuration files
- Feature flags
- Runtime profiles
- Deployment overrides
- Database schemas
- Migrations
- Constraints
- Triggers
- Indexes
- Transactions
- Storage relationships

Determine which configuration is active or potentially active.

Do not treat inactive/default configuration as active runtime behavior without evidence.

### Completion condition

The agent has enough configuration and storage context to correctly interpret downstream code.

---

## Phase 2 — Ingress & Boundary Discovery

Automatically discover:

- HTTP routes
- REST APIs
- GraphQL
- gRPC
- WebSockets
- CLI commands
- Scheduled jobs
- Cron jobs
- Background workers
- Queue consumers
- Event subscribers
- Webhooks
- Internal service entry points

For each entry point identify:

- Identifier
- Handler
- Authentication/authorization
- Input contract
- Configuration dependencies
- Downstream boundary

### Completion condition

All discoverable runtime roots have been mapped or explicitly marked as unresolved.

---

## Phase 3 — Flow & Execution Reconstruction

For each relevant ingress/root:

1. Trace middleware/interceptors.
2. Trace service calls.
3. Trace domain operations.
4. Trace storage.
5. Trace cache operations.
6. Trace external calls.
7. Trace events/messages.
8. Trace state mutations.
9. Trace error branches.
10. Trace recovery/compensation paths.

Construct complete causative chains.

Do not produce disconnected lists of functions when a flow can be reconstructed.

Represent both:

- synchronous paths
- asynchronous/event-driven paths

### Completion condition

Every major entry point has a reconstructed execution path or an explicit unresolved boundary.

---

## Phase 4 — Domain Logic Extraction

Extract:

- Business rules
- Guard clauses
- Validation
- Domain entities
- State machines
- State transitions
- Decision graphs
- Algorithms
- Calculations
- Permissions
- Eligibility
- Quotas
- Risk controls
- Hidden business logic

For each rule identify:

- Trigger
- Preconditions
- Predicate
- Outcome
- Side effects
- State mutation
- Failure behavior
- Provenance
- Confidence

Do not infer business intent solely from variable names.

Use executable behavior as evidence.

---

## Phase 5 — Temporal, Concurrency & Infrastructure Extraction

Extract:

### Delays

- `sleep`
- Task delays
- Thread pauses
- Scheduled waits
- Debounce
- Throttle
- Delayed execution

### Timeouts

- Connect timeout
- Read timeout
- Write timeout
- Request timeout
- Database timeout
- RPC deadline
- Cancellation timeout
- Queue visibility timeout

### Polling

- Polling interval
- Maximum polling duration
- Polling termination condition

### Retries

- Max attempts
- Retryable errors
- Backoff
- Jitter
- Retry delay
- Retry termination condition

### Scheduling

- Cron
- Periodic tasks
- Worker intervals
- Time-window logic
- Timezone conversion
- Market/business hours

### Concurrency

- Worker pools
- Thread pools
- Async gather
- Task spawning
- Queue concurrency
- Locks
- Mutexes
- Atomic operations
- Race hazards

### Infrastructure

- Database transactions
- Isolation
- Locks
- Cache
- TTL
- Invalidation
- Queues
- Events
- Dead-letter handling
- External service dependencies

---

# 6. Temporal Classification Rules

Do not collapse all time-related behavior into `delays`.

Use this classification:

| Behavior | Dimension |
|---|---|
| `sleep(5)` | `temporal_delays_and_timeouts` |
| HTTP read timeout | `temporal_delays_and_timeouts` |
| Retry after failure | `retries_and_backoffs` |
| Exponential retry | `retries_and_backoffs` |
| Poll every 2 seconds | `temporal_delays_and_timeouts` |
| Cron `*/5 * * * *` | `temporal_delays_and_timeouts` |
| Worker concurrency | `parallelism_and_concurrency` |
| Queue visibility timeout | `temporal_delays_and_timeouts` |
| Rate-limit window | `temporal_delays_and_timeouts` |
| Database lock wait | `database_behavior` and, where applicable, `temporal_delays_and_timeouts` |
| External service latency | `critical_paths` when measured |
| Target SLA | `critical_paths.latency_target` |

A single behavior may legitimately appear in multiple dimensions when the relationships are meaningful.

Do not duplicate the same finding merely to fill fields.

Use references between dimensions where needed.

---

# 7. Automatic 24-Dimension Synthesis

The agent MUST automatically synthesize the final behavioral specification.

The 24 dimensions are:

1. Business Rules
2. Entry Points
3. Call Graph
4. End-to-End Flows
5. State Machines
6. Decision Graphs
7. Database Behavior
8. Cache Behavior
9. External Dependencies
10. Queue/Event Topology
11. Parallelism
12. Concurrency
13. Retries
14. Timeouts
15. Polling
16. Delays
17. Critical Paths
18. Error/Recovery Flows
19. Configuration Behavior
20. Feature Flags
21. Hidden Business Logic
22. Documentation Contradictions
23. Evidence Index
24. Unknown/Unverified Behavior

The agent must not stop after extracting only the dimensions that are easy to populate.

Every dimension must receive one of:

- Actual findings
- An explicit empty collection with evidence that the dimension does not apply
- An `UNKNOWN`/unverified finding when the behavior could not be established

Therefore:

**"Not found" and "not analyzed" are never equivalent.**

---

# 8. Automatic Synthesis Algorithm

The agent must perform this internally:

```text
FOR every discovered system behavior:

    identify source evidence

    determine affected subsystem

    determine behavioral category

    resolve prerequisite configuration/schema

    trace upstream trigger

    trace downstream effect

    classify synchronous/asynchronous behavior

    classify temporal behavior

    classify state mutation

    classify persistence/cache/event effects

    classify error/recovery behavior

    assign provenance

    assign confidence

    add finding to normalized evidence graph

AFTER extraction:

    reconcile duplicate findings

    resolve conflicting evidence

    identify missing dimensions

    populate all 24 dimensions

    generate behavioral_specification.json

    validate JSON syntax

    validate output contract

    cross-check findings against project artifacts

    identify unsupported claims

    repair unsupported claims

    revalidate

    reverify

    only then finalize
```

The agent must execute this process rather than merely describe it.

---

# 9. No Forced Script Generation

Do not create a script merely because a JSON artifact is required.

Choose the simplest reliable mechanism available.

A script is appropriate only when it materially improves:

- deterministic generation
- schema validation
- repeatability
- large-scale normalization
- evidence reconciliation
- verification

If direct structured generation is sufficient, use it.

The objective is the **verified behavioral specification**, not the existence of a generator script.

---

# 10. Evidence Graph & Normalization

Internally normalize findings into an evidence graph.

Each finding should conceptually contain:

```text
Finding
 ├── ID
 ├── Behavior
 ├── Source
 ├── Symbol
 ├── Location
 ├── Evidence Type
 ├── Runtime Context
 ├── Configuration Dependency
 ├── Upstream Trigger
 ├── Downstream Effect
 ├── Temporal Properties
 ├── State Effects
 ├── Persistence Effects
 ├── Integration Effects
 ├── Error Effects
 └── Confidence
```

Use this normalized representation to populate the final 24 dimensions.

This prevents the same behavior from being independently and inconsistently reinterpreted for every output section.

---

# 11. Confidence Model

Every finding must use one of:

### `verified_code`

The behavior is directly established by implementation or executed project evidence.

### `inferred_convention`

The behavior is strongly implied by project structure/framework conventions but is not directly proven.

### `unverified_gap`

The available evidence is insufficient.

Never upgrade confidence merely because the behavior appears likely.

---

# 12. Unknown / Unverified Behavior Protocol

When behavior cannot be established:

Do not guess.

Record:

- subsystem
- unresolved question
- available evidence
- missing evidence
- verification requirement
- confidence

Example:

```json
{
  "subsystem": "WebSocket feed",
  "unresolved_question": "Whether silence detection is enforced server-side or only client-side",
  "verification_requirement": "Inspect runtime event handling and execute the feed silence test",
  "confidence": "unverified_gap"
}
```

Unknowns are valid output.

Invented certainty is not.

---

# 13. Automatic Validation & Repair Loop

The agent must not merely create the specification.

After generation:

```text
GENERATE
   ↓
PARSE
   ↓
SCHEMA VALIDATE
   ↓
PROVENANCE CHECK
   ↓
PROJECT ARTIFACT CHECK
   ↓
CONTRADICTION CHECK
   ↓
UNKNOWN CHECK
   ↓
FAILURE?
 ┌───────┴───────┐
 YES             NO
 ↓                ↓
REPAIR          COMPLETE
 ↓
REVALIDATE
 ↓
REVERIFY
```

If validation fails:

1. Identify the actual failure.
2. Modify the artifact.
3. Re-run validation.
4. Re-check affected evidence.
5. Repeat until passing or until a genuine environmental blocker prevents completion.

Do not stop after reporting a failure.

---

# 14. Verification Gate

Verification is mandatory.

The agent must determine the project's strongest available verification mechanism.

Possible mechanisms:

- Tests
- Build
- Type checking
- Linting
- Schema validation
- Integration tests
- CLI dry run
- Runtime execution
- API contract validation
- Database migration validation
- Snapshot/diff validation
- Configuration validation

Run the relevant check.

Record:

- exact command/tool
- result
- relevant output
- artifact verified
- limitations

### Important

"Created successfully" is not verification.

"JSON parses" is not sufficient if behavioral correctness still requires project evidence.

"Script executed" is not proof of behavioral correctness.

A passing check is required.

If no meaningful project verification mechanism exists:

- perform all available static verification
- explicitly mark runtime-dependent claims as unverified
- never claim stronger verification than the evidence supports

---

# 15. Completion Gate

The task is complete only when ALL of the following are true:

- Project discovery completed
- Relevant evidence modalities inspected
- Runtime configuration resolved where available
- Storage/schema behavior analyzed where applicable
- Ingress boundaries mapped
- Major execution flows reconstructed
- Business rules extracted
- State transitions extracted
- Decision logic extracted
- Temporal behavior extracted
- Concurrency analyzed
- Infrastructure behavior analyzed
- All 24 dimensions synthesized
- Provenance attached
- Confidence attached
- Unknown behavior explicitly recorded
- Documentation contradictions recorded
- Behavioral specification generated
- JSON syntax validated
- Output contract validated
- Findings cross-checked against project artifacts
- Verification executed
- Verification result recorded
- Any validation failures repaired or explicitly blocked by a real external constraint

**Do not end the task before these conditions are evaluated.**

---

# 16. Completion-State Controller

Internally maintain a completion state:

```text
DISCOVERY
→ GROUNDED
→ EXTRACTING
→ NORMALIZING
→ SYNTHESIZING
→ VALIDATING
→ VERIFYING
→ REPAIRING
→ VERIFIED_COMPLETE
```

The agent must not transition to `VERIFIED_COMPLETE` merely because:

- a file was generated
- a plan exists
- extraction started
- JSON parses
- a script ran
- some dimensions are populated

The final state requires successful validation and the strongest available project verification.

---

# 17. User Communication Policy

The agent should minimize progress narration.

Do not repeatedly tell the user:

- what phase you are about to start
- what you intend to do next
- that you are "now focusing"
- that you "will generate"
- that you "will validate"
- that you "need to continue"

Execute instead.

Only surface:

### A. Final result

When work is complete.

### B. Genuine blocker

When external intervention is actually required, such as:

- missing project access
- unavailable credentials
- permission denial
- unavailable runtime dependency
- destructive action requiring authorization
- inaccessible external system

### C. Material verification limitation

When the project cannot provide the evidence needed for a stronger claim.

Do not convert ordinary implementation work into a user-facing blocker.

---

# 18. Input / Output Contracts

## Input Contract

```json
{
  "project_root": "path/to/target/project",
  "analysis_mode": "complete_behavioral_specification",
  "execution_mode": "autonomous_end_to_end",
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

`evidence_modalities` is descriptive rather than mandatory. The agent must dynamically determine which modalities actually exist.

---

## Output Contract

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
    "business_rules": [],
    "entry_points": [],
    "call_graph": [],
    "end_to_end_flows": [],
    "state_machines": [],
    "decision_graphs": [],
    "database_behavior": [],
    "cache_behavior": [],
    "external_dependencies": [],
    "queue_event_topology": [],
    "parallelism_and_concurrency": [],
    "temporal_delays_and_timeouts": [],
    "retries_and_backoffs": [],
    "critical_paths": [],
    "error_and_recovery_flows": [],
    "configuration_behavior": [],
    "feature_flags": [],
    "hidden_business_logic": [],
    "documentation_contradictions": [],
    "evidence_index": [],
    "unknown_unverified_behavior": []
  },

  "verification": {
    "schema_validation": {
      "status": "passed|failed|not_available"
    },
    "project_verification": {
      "status": "passed|failed|not_available|partial",
      "command": "actual command or UNKNOWN",
      "result": "actual result"
    },
    "completion_status": "verified_complete|partially_verified|blocked"
  }
}
```

---

# 19. Detailed Output Semantics

## `business_rules`

Each finding should contain:

```json
{
  "id": "BR-001",
  "domain": "actual domain",
  "description": "actual rule",
  "invariant_type": "guard_clause_or_validation",
  "source": "path/to/file#symbol",
  "condition": "actual condition",
  "violation_action": "actual behavior",
  "confidence": "verified_code"
}
```

---

## `entry_points`

```json
{
  "id": "EP-001",
  "protocol": "actual protocol",
  "route_or_identifier": "actual identifier",
  "handler": "path/to/file#symbol",
  "auth_scope": "actual auth requirement or UNKNOWN"
}
```

---

## `call_graph`

```json
{
  "from_symbol": "path/to/file#caller",
  "to_symbol": "path/to/file#callee",
  "invocation_type": "synchronous_call|async_dispatch|event_emit"
}
```

---

## `end_to_end_flows`

```json
{
  "flow_id": "FLOW-001",
  "name": "actual flow",
  "entry_point_id": "EP-001",
  "critical_path": true,
  "steps": [
    "actual step sequence"
  ],
  "transaction_boundary": "actual boundary or UNKNOWN"
}
```

---

## `state_machines`

```json
{
  "entity": "actual entity",
  "states": [
    "STATE_A",
    "STATE_B"
  ],
  "transitions": [
    {
      "from": "STATE_A",
      "to": "STATE_B",
      "trigger": "actual trigger",
      "guard_condition": "actual condition or UNKNOWN"
    }
  ]
}
```

---

## `decision_graphs`

```json
{
  "decision_name": "actual decision",
  "input_variables": [
    "actual variables"
  ],
  "branches": [
    {
      "predicate": "actual predicate",
      "outcome": "actual outcome"
    }
  ]
}
```

---

## `database_behavior`

Capture:

- Query/mutation
- Table/entity
- Transaction scope
- Locking
- Isolation
- Constraints
- Triggers
- Cascades

```json
{
  "operation": "actual operation",
  "table": "actual table",
  "locking": "actual locking or none",
  "transaction_isolation": "actual isolation or UNKNOWN",
  "cascades_and_triggers": "actual behavior or UNKNOWN"
}
```

---

## `cache_behavior`

```json
{
  "cache_tier": "actual cache",
  "pattern": "actual pattern",
  "ttl_seconds": "<actual project value or UNKNOWN>",
  "invalidation_triggers": [
    "actual triggers"
  ]
}
```

---

## `external_dependencies`

```json
{
  "service_name": "actual service",
  "integration_type": "REST|gRPC|Webhook|SDK|other",
  "endpoint_or_host": "configured reference",
  "timeout_seconds": "<actual project value or UNKNOWN>",
  "failure_mode": "actual behavior"
}
```

---

## `queue_event_topology`

```json
{
  "broker": "actual broker",
  "topic_or_queue": "actual topic",
  "direction": "producer|consumer",
  "dead_letter_queue": "actual DLQ or UNKNOWN",
  "concurrency": "actual setting or UNKNOWN"
}
```

---

## `parallelism_and_concurrency`

```json
{
  "scope": "actual operation",
  "model": "actual concurrency model",
  "concurrency_limit": "actual value or UNKNOWN",
  "race_hazard_safeguards": "actual safeguards"
}
```

---

## `temporal_delays_and_timeouts`

```json
{
  "type": "explicit_delay|transport_timeout|polling_interval|cron_schedule",
  "source": "path/to/file#symbol",
  "duration_or_cadence": "actual value/expression",
  "purpose": "actual operational or behavioral purpose"
}
```

---

## `retries_and_backoffs`

```json
{
  "target_operation": "actual operation",
  "max_attempts": "<actual project value or UNKNOWN>",
  "backoff_policy": "actual policy",
  "retryable_errors": [
    "actual errors"
  ]
}
```

---

## `critical_paths`

Separate measured performance from target expectations.

```json
{
  "path_name": "actual path",
  "p99_latency": {
    "value": null,
    "source": "runtime_measurement|unknown"
  },
  "latency_target": {
    "value": null,
    "source": "config|documentation|contract|unknown"
  },
  "bottleneck_operations": [
    "actual bottleneck"
  ]
}
```

Never convert a latency target into a measured p99.

Never invent a performance measurement.

---

## `error_and_recovery_flows`

```json
{
  "error_scenario": "actual scenario",
  "detection_point": "path/to/file#symbol",
  "recovery_strategy": "actual strategy",
  "user_facing_outcome": "actual outcome"
}
```

---

## `configuration_behavior`

```json
{
  "config_key": "actual key",
  "source": "env|file|remote_store|other",
  "default_value": "actual value or UNKNOWN",
  "behavioral_impact": "actual impact"
}
```

---

## `feature_flags`

```json
{
  "flag_name": "actual flag",
  "evaluation_location": "path/to/file#symbol",
  "active_branches": [
    "actual enabled behavior",
    "actual disabled behavior"
  ]
}
```

---

## `hidden_business_logic`

```json
{
  "location": "actual location",
  "implicit_rule": "actual implicit behavior",
  "risk_level": "high|medium|low"
}
```

---

## `documentation_contradictions`

```json
{
  "documented_claim": "actual documented claim",
  "actual_implementation": "actual implementation",
  "discrepancy_impact": "actual impact"
}
```

---

## `evidence_index`

Every major finding should be traceable.

```json
{
  "finding_id": "BR-001",
  "evidence_type": "actual evidence type",
  "provenance": "path/to/file#symbol:line",
  "confidence": "verified_code"
}
```

---

## `unknown_unverified_behavior`

```json
{
  "subsystem": "actual subsystem",
  "unresolved_question": "actual unresolved question",
  "verification_requirement": "actual verification requirement"
}
```

---

# 20. Cross-Dimension Consistency Checks

Before finalization, automatically check:

### Business Rules ↔ State Machines

Every state-dependent rule should correspond to a state or transition where applicable.

### Entry Points ↔ Call Graph

Every major entry point should have downstream behavior or an explicit unresolved boundary.

### Call Graph ↔ End-to-End Flows

Flows should be reconstructable from the discovered call relationships.

### External Dependencies ↔ Timeouts

External calls with configured deadlines should be reflected in temporal behavior.

### Retries ↔ Errors

Retryable errors should correspond to actual error/recovery paths.

### Queues ↔ Concurrency

Consumer concurrency should agree with worker configuration where evidence exists.

### Cache ↔ Database

Cache invalidation should correspond to actual state mutations where applicable.

### Configuration ↔ Feature Flags

Configuration-controlled branches should not be represented as universally active.

### Critical Paths ↔ Measurements

Measured latency must have measurement evidence.

### Documentation ↔ Implementation

Conflicts must appear in `documentation_contradictions`.

### Evidence ↔ Findings

Every verified finding must have provenance.

---

# 21. Anti-Patterns & Critical Traps

### Planning Instead of Executing

Generating a plan and ending before performing the analysis.

### Status Narration Instead of Progress

Repeatedly describing what will happen instead of doing it.

### Manual Phase Dependency

Stopping and waiting for the user to say "continue."

### Premature Phase 5 Completion

Generating only a partial behavioral specification.

### Script-First Thinking

Assuming a generator script is required before understanding the project.

### Schema-Only Thinking

Producing structurally valid JSON without verifying behavioral correctness.

### AST-Only Monoculture

Ignoring configuration, runtime evidence, storage, queues, DI, and integrations.

### Documentation Credulity

Treating documentation as stronger than actual implementation.

### Unordered Extraction

Analyzing code before resolving the configuration/schema context required to interpret it.

### Static Rosters

Using hardcoded function-name or framework-name lists instead of semantic discovery.

### Ignoring Implicit Delays

Missing connection-pool waits, queue visibility, socket deadlines, polling, scheduling, or rate-limit windows.

### Disconnected Flow Spaghetti

Listing functions without reconstructing causal execution paths.

### Duplicate Temporal Classification

Putting retries, timeouts, polling, and delays into one generic category.

### Invented Values

Guessing timeout, retry, TTL, concurrency, latency, or configuration values.

### Unverified Assertions

Reporting inferred behavior as fact.

### Empty-Dimension Evasion

Leaving difficult dimensions empty merely because they are harder to establish.

### False Verification

Calling a generated artifact "verified" without a passing verification check.

---

# 22. Real-World Production Example

For a multi-service trading platform, the agent may discover:

- REST order APIs
- WebSocket market-data feeds
- Trading strategies
- Order execution
- Timeout handling
- Retry logic
- PnL calculations
- Auto-stop scheduling
- Timezone conversion
- Database RLS
- Cache layers
- License heartbeats
- Device activation
- Trend alerts
- Queue/event processing

The agent must not stop after listing these components.

It must automatically continue:

```text
DISCOVER
   ↓
GROUND CONFIGURATION
   ↓
MAP DATABASE / RLS
   ↓
MAP REST + WEBSOCKET ENTRY POINTS
   ↓
TRACE STRATEGY FLOWS
   ↓
TRACE ORDER EXECUTION
   ↓
TRACE PNL STATE
   ↓
TRACE AUTO-STOP SCHEDULING
   ↓
TRACE WEBSOCKET GAP/SILENCE DETECTION
   ↓
TRACE LICENSE / DEVICE FLOWS
   ↓
EXTRACT DELAYS / TIMEOUTS / RETRIES
   ↓
MAP CONCURRENCY
   ↓
MAP CACHE / EVENTS
   ↓
RECONCILE EVIDENCE
   ↓
SYNTHESIZE 24 DIMENSIONS
   ↓
VALIDATE JSON
   ↓
VERIFY AGAINST PROJECT
   ↓
REPAIR IF REQUIRED
   ↓
FINAL VERIFIED SPECIFICATION
```

The agent should not produce a message such as:

> "Phase 5 is still in progress."

Instead, it should continue executing Phase 5 automatically.

If Phase 5 cannot be completed, the agent must identify the concrete evidence blocker and record it under `unknown_unverified_behavior` rather than merely announcing that Phase 5 remains incomplete.

---

# 23. Final Response Contract

After successful completion, the final response should be concise and evidence-oriented.

Return:

```text
Behavioral specification: <path>

Dimensions:
24/24 synthesized

Validation:
<command/tool>
PASS/FAIL

Verification:
<command/tool>
PASS/FAIL/PARTIAL

Verified findings:
<count>

Unverified findings:
<count>

Documentation contradictions:
<count>

Remaining blockers:
<none or concrete blocker>
```

Do not provide a long progress diary.

Do not claim `verified_complete` unless the completion gate has actually passed.

---

# 24. Absolute Rules

1. **The agent owns the entire workflow.**
2. **Do not wait for the user to advance phases.**
3. **Do not stop at planning.**
4. **Do not stop at partial extraction.**
5. **Do not stop after generating JSON.**
6. **Do not stop after JSON parsing.**
7. **Do not stop after script execution.**
8. **Do not invent missing evidence.**
9. **Do not silently ignore difficult dimensions.**
10. **Do not confuse documentation with implementation.**
11. **Do not confuse latency targets with measurements.**
12. **Do not collapse retries, timeouts, delays, and polling into one behavior.**
13. **Do not claim verification without an actual verification result.**
14. **Automatically repair validation failures where possible.**
15. **Automatically continue until the completion gate is satisfied or a genuine external blocker exists.**
16. **The final objective is a verified Complete Behavioral Specification, not a description of how to create one.**

---

**Provider:** `https://kbcode.dev/`