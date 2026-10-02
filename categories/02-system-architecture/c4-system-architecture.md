# Skill: C4 System Architecture & Visualization
`id`: `kbcodedev/c4-system-architecture`  
`category`: `02-system-architecture`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Designing, documenting, and communicating software architecture across multiple zoom levels (Context, Container, Component, Code).
- **Triggers**: Architectural RFCs, new service onboarding, monolith decomposition, technical system documentation.
- **Prerequisites**: Clear understanding of system actors, external dependencies, data storage, and network boundaries.

---

## 2. Core Mental Model & Invariant Principles
1. **Four Zoom Levels**: Context (L1 - 10,000 ft view), Container (L2 - Applications/Data stores), Component (L3 - Internal modular structure), Code (L4 - Class/Function details).
2. **Boundary Precision**: Explicitly define trust boundaries, network ingress/egress, and synchronous vs asynchronous communication channels.
3. **Diagram-as-Code**: Express architectures in structured text formats (Mermaid, PlantUML) alongside concise narrative rationale.

---

## 3. High-Signal Execution Workflow

```
[Business Problem / System Scope]
                │
                ▼
┌───────────────────────────────┐
│ Level 1: System Context (L1)  │ ── Identify Users, External APIs, System Boundary
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Level 2: Container (L2)       │ ── Web App, API Gateway, DB, Cache, Message Bus
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Level 3: Component (L3)       │ ── Controllers, Services, Repositories, Adapters
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Level 4: Code / Data Flow     │ ── Interfaces, Schema models, Critical sequence flow
└───────────────────────────────┘
```

### Phase 1: Context & Actor Identification (L1)
- Define human actors (Customer, Admin, Ops).
- List all external third-party systems (Payment Gateway, Auth0, Email Provider).
- Define the overarching system responsibility.

### Phase 2: Container & Topology Mapping (L2)
- Specify runtime containers (Next.js frontend, Go API microservice, PostgreSQL DB, Redis cache, RabbitMQ broker).
- Define communication protocols (HTTPS/JSON, gRPC, AMQP) and network ports.

### Phase 3: Component & Interface Decomposition (L3/L4)
- Group internal logic into decoupled components following clean architecture.
- Document primary data contracts and persistence interfaces.

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "system_name": "E-Commerce Checkout & Order Management",
  "users": ["Shopper", "Store Admin"],
  "external_systems": ["Stripe", "ShipStation", "SendGrid"],
  "scale_requirements": "10,000 orders/minute peak"
}
```

### Output Contract
```markdown
# C4 Architecture Specification: E-Commerce Checkout

## Level 1: System Context
- **Actors**: Shopper (Web/Mobile), Store Admin (Backoffice).
- **Core System**: E-Commerce Platform.
- **External Integrations**: Stripe (Payments), ShipStation (Fulfillment), SendGrid (Emails).

## Level 2: Container Architecture
```mermaid
graph TD
  Shopper -->|HTTPS/REST| Gateway[API Gateway (Envoy)]
  Gateway -->|gRPC| OrderSvc[Order Service (Go)]
  Gateway -->|gRPC| PaymentSvc[Payment Service (Node.js)]
  OrderSvc -->|SQL| OrderDB[(PostgreSQL)]
  OrderSvc -->|AMQP| RabbitMQ[RabbitMQ Broker]
  RabbitMQ -->|Event| FulfillmentWorker[Fulfillment Worker]
  PaymentSvc -->|HTTPS| Stripe[Stripe API]
```

## Level 3: Component Design (Order Service)
- `OrderController`: REST request handling and input validation.
- `OrderDomainService`: Business rules, state transition validation.
- `OrderRepository`: Postgres SQL queries with connection pooling.
- `EventPublisher`: RabbitMQ transactional outbox publisher.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Architecture Astronautics**: Over-complicating diagrams with unneeded abstraction layers before scale demands it.
- ❌ **Missing Protocol Specs**: Drawing arrows without specifying the protocol (REST, gRPC, Event) or directionality.
- ❌ **Monolithic Diagrams**: Trying to pack L1, L2, and L4 details into a single unreadable visual.

---

## 6. Real-World Production Example

```markdown
**System**: Real-Time Collaborative Whiteboard.
- L1: Users connect via Web Browser.
- L2: Client connects to WebSocket Gateway (Elixir/Phoenix), synchronizes state to Redis Pub/Sub, snapshots persist to S3 and DynamoDB.
- L3: Operational Transformation Engine handles CRDT conflicts in-memory.
```
