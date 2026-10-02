# Skill: Unit & Integration Test Generator
`id`: `kbcodedev/unit-integration-test-generator`  
`category`: `04-testing-qa-debugging`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring comprehensive unit, integration, and property-based test suites with high branch coverage, boundary verification, and robust assertions.
- **Triggers**: New feature delivery, refactoring safety baselines, bugfix regression proof, code review test gaps.
- **Prerequisites**: Target test runner (Jest, Vitest, Pytest, Go testing), mock/fixture factories, assertions library.

---

## 2. Core Mental Model & Invariant Principles
1. **AAA Pattern (Arrange-Act-Assert)**: Every test must follow strict structural separation: prepare test state, invoke the single action under test, assert the outcome.
2. **Boundary Condition & Edge Case Rigor**: Test 0, 1, many, null, undefined, negative numbers, max integer, empty string, and malformed inputs.
3. **Fakes Over Over-Mocking**: Prefer fast in-memory fakes (e.g. in-memory SQLite / mock HTTP server) over fragile method mocks that tightly couple tests to internal implementation details.

---

## 3. High-Signal Execution Workflow

```
[Target Code / Function Under Test]
                 │
                 ▼
┌────────────────────────────────┐
│ Step 1: Interface & State Map  │ ── Inputs, Outputs, Invariants, Exceptions
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 2: Happy Path Test        │ ── Typical valid scenario with standard data
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 3: Boundary & Edge Cases  │ ── Empty lists, max values, zero, edge dates
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 4: Error & Failure Modes  │ ── Network timeout, DB error, validation rejection
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 5: Test Execution & Proof │ ── Verify 100% pass rate & high branch coverage
└────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "function_name": "transferFunds",
  "signature": "transferFunds(sourceAccountId: string, targetAccountId: string, amountCents: number): Promise<TransferReceipt>",
  "rules": [
    "amountCents must be > 0",
    "sourceAccount must have balance >= amountCents",
    "cannot transfer to the same account"
  ]
}
```

### Output Contract
```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { transferFunds, InsufficientFundsError, InvalidTransferError } from "./transfer";
import { InMemoryAccountRepository } from "./test/fakes";

describe("transferFunds", () => {
  let repo: InMemoryAccountRepository;

  beforeEach(() => {
    repo = new InMemoryAccountRepository();
    repo.seedAccount("acc_source", 10_000); // $100.00
    repo.seedAccount("acc_target", 2_000);  // $20.00
  });

  it("successfully transfers funds between valid accounts", async () => {
    // Arrange
    const amount = 5_000;

    // Act
    const receipt = await transferFunds("acc_source", "acc_target", amount, repo);

    // Assert
    expect(receipt.status).toBe("COMPLETED");
    expect(await repo.getBalance("acc_source")).toBe(5_000);
    expect(await repo.getBalance("acc_target")).toBe(7_000);
  });

  it("throws InsufficientFundsError when balance is less than transfer amount", async () => {
    await expect(
      transferFunds("acc_source", "acc_target", 15_000, repo)
    ).rejects.toThrow(InsufficientFundsError);
  });

  it("throws InvalidTransferError when transferring zero or negative amount", async () => {
    await expect(
      transferFunds("acc_source", "acc_target", 0, repo)
    ).rejects.toThrow(InvalidTransferError);

    await expect(
      transferFunds("acc_source", "acc_target", -500, repo)
    ).rejects.toThrow(InvalidTransferError);
  });

  it("throws InvalidTransferError when source and target accounts are identical", async () => {
    await expect(
      transferFunds("acc_source", "acc_source", 1000, repo)
    ).rejects.toThrow(InvalidTransferError);
  });
});
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Testing Implementation Details**: Asserting internal private function calls rather than observable output and state transitions.
- ❌ **Shared Mutable Test State**: Letting one test mutate a database without resetting state, causing downstream tests to fail unpredictably.
- ❌ **Tests Without Assertions**: Writing tests that invoke code but lack `expect()` assertions, verifying only that no crash occurred.

---

## 6. Real-World Production Example

```markdown
**Property-Based Testing with fast-check**:
- Generated 10,000 randomized JSON inputs to test parser resiliency.
- Discovered unhandled unicode surrogate pair decoding bug before shipping to production.
```
