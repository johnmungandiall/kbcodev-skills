# Skill: Deep Code Refactoring & Monolith Decoupling
`id`: `kbcodedev/deep-code-refactoring`  
`category`: `03-software-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Modernizing legacy code, breaking down god classes/functions, reducing cyclomatic complexity, eliminating code smells, and decoupling tightly coupled components without behavioral regression.
- **Triggers**: Long method smells (>50 lines), duplicated logic, high cyclomatic complexity (>10), hard-to-test code, spaghetti inheritance.
- **Prerequisites**: Existing test coverage (or characterization tests established prior to refactoring), AST-aware editing tools.

---

## 2. Core Mental Model & Invariant Principles
1. **Preserve External Behavior**: Refactoring changes the internal structure of software without altering its observable external behavior.
2. **Strangler Fig Pattern**: Gradually replace specific parts of legacy monoliths with new modular implementations until the old system is completely phased out.
3. **Small, Atomic Commits**: Perform one refactoring transformation at a time (Extract Method -> Extract Class -> Rename Symbol), running tests after each atomic step.

---

## 3. High-Signal Execution Workflow

```
[Legacy Codebase / God Class]
             │
             ▼
┌────────────────────────────┐
│ Phase 1: Establish Test    │ ── Golden Master / Characterization Tests
│          Baseline          │
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Phase 2: Identify Code     │ ── Long functions, Feature Envy, Primitive Obsession
│          Smells & Targets  │
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Phase 3: Atomic Systematic │ ── 1. Extract Method / Pure Functions
│          Refactoring Steps │ ── 2. Introduce Parameter Objects / DTOs
└────────────┬───────────────┘ ── 3. Replace Conditionals with Polymorphism
             ▼
┌────────────────────────────┐
│ Phase 4: Regression Gate   │ ── Run full test suite & inspect diff for purity
└────────────────────────────┘
```

### Core Refactoring Techniques
- **Extract Method**: Break down massive multi-step procedures into small, single-purpose pure functions.
- **Introduce Parameter Object**: Replace 6+ positional arguments with a single validated interface/dataclass.
- **Replace Conditional with Strategy/Polymorphism**: Eliminate nested `switch(type)` statements by delegating to typed strategy classes.

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "target_file": "src/services/OrderProcessor.ts",
  "smells_detected": ["500-line execute() method", "Hardcoded SQL calls mixed with email sending"],
  "goal": "Decouple payment, inventory reservation, and notification into separate domain services"
}
```

### Output Contract
```typescript
// Refactored Architecture - Decoupled Clean Pipeline
export class OrderProcessor {
  constructor(
    private readonly inventoryService: IInventoryService,
    private readonly paymentService: IPaymentService,
    private readonly notificationService: INotificationService
  ) {}

  async processOrder(order: Order): Promise<ProcessOrderResult> {
    // 1. Reserve Inventory
    await this.inventoryService.reserve(order.items);

    try {
      // 2. Execute Payment
      const paymentReceipt = await this.paymentService.charge(order.paymentDetails);

      // 3. Dispatch Notification Asynchronously
      this.notificationService.sendReceipt(order.userEmail, paymentReceipt);

      return { status: "SUCCESS", receiptId: paymentReceipt.id };
    } catch (error) {
      // Rollback Inventory Reservation
      await this.inventoryService.release(order.items);
      throw new OrderProcessingError("Payment failed, inventory released", error);
    }
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Refactoring Without Tests**: Modifying core logic without characterization tests to catch subtle behavioral regressions.
- ❌ **Mixing Refactoring with New Feature Work**: Combining structural cleanup and new feature additions in the same commit.
- ❌ **Shotgun Surgery**: Making scattered, half-finished changes across 30 files instead of cleanly bounded modular updates.

---

## 6. Real-World Production Example

```markdown
**Legacy**: A 450-line `calculateInvoice()` function with 8 nested `if/else` ladders for tax calculations per country.

**Refactoring**:
1. Extracted `TaxStrategy` interface with `calculateTax(order)`.
2. Created concrete implementations: `USTaxStrategy`, `EUTaxStrategy`, `GlobalTaxStrategy`.
3. Created `TaxStrategyFactory.get(countryCode)`.
4. Result: `calculateInvoice()` reduced from 450 lines to 22 lines with 100% test pass rate.
```
