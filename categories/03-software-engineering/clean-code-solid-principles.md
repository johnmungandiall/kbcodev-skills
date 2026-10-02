# Skill: Clean Code & SOLID Architectural Principles
`id`: `kbcodedev/clean-code-solid-principles`  
`category`: `03-software-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring clean, maintainable, extensible, and self-documenting code adhering to SOLID principles and clean architecture standards.
- **Triggers**: Code reviews, system design, domain entity refactoring, API interface definition.
- **Prerequisites**: Domain requirements, object-oriented or functional programming context.

---

## 2. Core Mental Model & Invariant Principles
1. **Single Responsibility (SRP)**: A module or class should have one, and only one, reason to change.
2. **Open / Closed (OCP)**: Software entities should be open for extension, but closed for modification.
3. **Liskov Substitution (LSP)**: Subtypes must be substitutable for their base types without altering program correctness.
4. **Interface Segregation (ISP)**: Clients should not be forced to depend on methods they do not use.
5. **Dependency Inversion (DIP)**: High-level modules should not depend on low-level modules; both should depend on abstractions.

6. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Feature Request / Domain Logic]
               │
               ▼
┌──────────────────────────────┐
│ Phase 1: Responsibility      │ ── Isolate single concern per class/function
│          Separation (SRP)    │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 2: Interface           │ ── Small, client-tailored contracts (ISP)
│          Definition          │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 3: Inversion of        │ ── Inject dependencies via constructor/factory (DIP)
│          Control             │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 4: Polymorphic         │ ── Allow adding new plugins without modifying core (OCP)
│          Extension Hooks     │
└──────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "problem": "ReportGenerator class connects directly to MySQL, formats data to PDF, and emails the file to users (violates SRP, DIP, OCP)."
}
```

### Output Contract
```typescript
// Production SOLID Implementation

// 1. Abstractions (DIP & ISP)
export interface IDataRepository<T> {
  fetchReportData(query: ReportQuery): Promise<T[]>;
}

export interface IDocumentFormatter<T> {
  format(data: T[]): Promise<Buffer>;
}

export interface INotificationSender {
  send(recipient: string, attachment: Buffer): Promise<void>;
}

// 2. High-Level Orchestrator (SRP & OCP)
export class ReportCoordinator<T> {
  constructor(
    private readonly repository: IDataRepository<T>,
    private readonly formatter: IDocumentFormatter<T>,
    private readonly notifier: INotificationSender
  ) {}

  async generateAndSend(query: ReportQuery, recipientEmail: string): Promise<void> {
    const rawData = await this.repository.fetchReportData(query);
    const documentBuffer = await this.formatter.format(rawData);
    await this.notifier.send(recipientEmail, documentBuffer);
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **God Classes**: Single classes spanning 3,000 lines handling UI, network, database, and validation.
- ❌ **Fat Interfaces**: Defining interfaces with 30 methods, forcing mock classes to implement 28 dummy methods.
- ❌ **Tight Coupling via `new`**: Instantiating concrete dependencies inside methods (`const db = new MySQLDatabase()`) preventing unit testing and substitution.

---

## 6. Real-World Production Example

```markdown
**Applying OCP to Payment Processing**:
- Instead of: `if (type === 'stripe') chargeStripe() else if (type === 'paypal') chargePaypal()`
- Implement: `IPaymentProcessor` interface. Adding `ApplePayProcessor` requires creating one new class file, with zero modifications to existing checkout logic.
```
