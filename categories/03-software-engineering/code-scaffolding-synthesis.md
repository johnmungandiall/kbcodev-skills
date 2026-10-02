# Skill: Code Scaffolding & Synthesis Architect
`id`: `kbcodedev/code-scaffolding-synthesis`  
`category`: `03-software-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Generating production-ready, clean-room boilerplate, microservices, CLI tools, libraries, or modular packages.
- **Triggers**: Initial project scaffolding, creating new domain modules, writing comprehensive service scaffolds from scratch.
- **Prerequisites**: Target language/framework conventions, typing standards, configuration file formats.

---

## 2. Core Mental Model & Invariant Principles
1. **Production-Trustworthy Defaults**: Always include type hints, runtime validation, structured logging, centralized error handling, and graceful shutdown out of the box.
2. **Dependency Injection**: Decouple business logic from external I/O (databases, network APIs, clock) by injecting dependencies via interfaces/constructors.
3. **Zero Dead Code**: Generate only the clean, necessary surface area requested—avoid speculative boilerplate that has no immediate caller.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Requirement & Tech Stack]
            │
            ▼
┌───────────────────────────┐
│ Step 1: Directory Layout  │ ── Standard idiomatic repository hierarchy
└───────────┬───────────────┘
            ▼
┌───────────────────────────┐
│ Step 2: Domain Interfaces │ ── Type definitions, DTO schemas, service contracts
└───────────┬───────────────┘
            ▼
┌───────────────────────────┐
│ Step 3: Core Business     │ ── Pure business rules devoid of direct I/O
│         Logic Engine      │
└───────────┬───────────────┘
            ▼
┌───────────────────────────┐
│ Step 4: Adapters & Config │ ── Database repositories, HTTP routers, env parser
└───────────────────────────┘
```

### Standard Project Layout Template (TypeScript / Go / Python)
```
src/
├── domain/            # Pure entities, domain errors, and interface contracts
├── application/       # Use cases, orchestrators, command handlers
├── infrastructure/    # DB clients, third-party API adapters, file systems
├── interfaces/        # HTTP controllers, CLI commands, queue consumers
└── config/            # Strongly-typed environment configuration
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "stack": "TypeScript / Node.js 20",
  "module": "PaymentSubscriptionService",
  "requirements": ["Stripe integration", "Postgres repository", "Zod validation"]
}
```

### Output Contract
```typescript
// src/domain/subscription.ts - Pure Domain Model
import { z } from "zod";

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.enum(["ACTIVE", "PAST_DUE", "CANCELED"]),
  planId: z.string(),
  currentPeriodEnd: z.date(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;

export interface ISubscriptionRepository {
  findById(id: string): Promise<Subscription | null>;
  save(sub: Subscription): Promise<void>;
}

export interface IPaymentGateway {
  cancelSubscription(gatewaySubId: string): Promise<void>;
}

// src/application/cancel_subscription.ts - Application Service
export class CancelSubscriptionUseCase {
  constructor(
    private readonly repo: ISubscriptionRepository,
    private readonly paymentGateway: IPaymentGateway
  ) {}

  async execute(subscriptionId: string): Promise<Subscription> {
    const sub = await this.repo.findById(subscriptionId);
    if (!sub) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    await this.paymentGateway.cancelSubscription(sub.id);
    const updated: Subscription = { ...sub, status: "CANCELED" };
    await this.repo.save(updated);
    return updated;
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Hardcoded Configuration**: Hardcoding database connection strings or ports inside application code.
- ❌ **Leaking Implementation Details**: Exposing ORM entities directly as external API responses without DTO mapping.
- ❌ **Missing Graceful Exit**: Failing to handle `SIGTERM` / `SIGINT` signals, causing abruptly severed database connections on container restarts.

---

## 6. Real-World Production Example

```markdown
**Scaffolding a Resilient Fastify REST Endpoint**:
- Environment loaded via `env-schema` with strict Zod validation.
- Route registration includes JSON Schema request validation and 400/500 typed response hooks.
- Server bootstraps with Pino logger and hooks into process signal handlers.
```
