# Skill: iOS Swift Modern Concurrency & SwiftUI Architecture
`id`: `kbcodedev/ios-swift-modern-concurrency`  
`category`: `12-mobile-cross-platform`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Developing native iOS applications with Swift 6, SwiftUI, modern async/await, Actor-based isolation (eliminating data races), and SwiftData persistence.
- **Triggers**: Native iOS app development, thread sanitization / data race warnings, `@Observable` state migration, Swift concurrency audits.
- **Prerequisites**: Swift 5.9 / 6.0, iOS 17+ deployment target, Xcode 15+.

---

## 2. Core Mental Model & Invariant Principles
1. **Actor Isolation for Thread Safety**: Protect mutable shared state with `actor` or `@MainActor` to eliminate data races at compile-time.
2. **SwiftUI Observation Framework (`@Observable`)**: Use iOS 17 `@Observable` macro instead of legacy `ObservableObject` and `@Published` for fine-grained dependency tracking.
3. **Structured Task Cancellation**: Always propagate `Task.isCancelled` inside long-running network or compute operations to instantly abort when the user navigates away.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[SwiftUI View Lifecycle]
          │
          ▼
┌─────────────────────────────────┐
│ View Model (@Observable,        │ ── @MainActor bounded UI state
│             @MainActor)         │
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Background Actor Service        │ ── actor NetworkClient (Isolated background thread)
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ SwiftData Persistence Layer     │ ── @Model schema with automatic iCloud sync
└─────────────────────────────────┘
```

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
  "feature": "Background Transaction Sync & User Profile Display",
  "requirements": ["Swift 6 Sendable compliance", "@Observable ViewModel", "Actor-isolated cache"]
}
```

### Output Contract
```swift
import SwiftUI
import Observation

// 1. Thread-Safe Actor Cache
actor TransactionStore {
    private var cache: [String: Transaction] = [:]

    func set(_ tx: Transaction) {
        cache[tx.id] = tx
    }

    func get(id: String) -> Transaction? {
        cache[id]
    }
}

// 2. Modern Observable ViewModel
@Observable
@MainActor
final class TransactionViewModel {
    var transactions: [Transaction] = []
    var isLoading = false
    var errorMessage: String?

    private let store: TransactionStore
    private let api: APIClient

    init(store: TransactionStore = TransactionStore(), api: APIClient = APIClient()) {
        self.store = store
        self.api = api
    }

    func loadTransactions() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            let fetched = try await api.fetchTransactions()
            self.transactions = fetched
            for tx in fetched {
                await store.set(tx)
            }
        } catch {
            self.errorMessage = error.localizedDescription
        }
    }
}

// 3. Declarative SwiftUI View
struct TransactionListView: View {
    @State private var viewModel = TransactionViewModel()

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    ProgressView("Loading Ledger...")
                } else if let error = viewModel.errorMessage {
                    ContentUnavailableView("Error", systemImage: "exclamationmark.triangle", description: Text(error))
                } else {
                    List(viewModel.transactions) { tx in
                        HStack {
                            Text(tx.title).font(.headline)
                            Spacer()
                            Text(tx.amountFormatted).bold().foregroundStyle(.indigo)
                        }
                    }
                }
            }
            .navigationTitle("Transactions")
            .task {
                await viewModel.loadTransactions()
            }
        }
    }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **`DispatchQueue.main.async` in Modern Swift**: Using legacy GCD queues instead of modern `@MainActor` annotations.
- ❌ **Data Races on Non-Sendable Types**: Passing mutable class instances across async boundaries without marking them `Sendable` or encapsulating in an `actor`.
- ❌ **Ignoring `task` Cancellation**: Spawning detached tasks `Task.detached` without binding them to the SwiftUI `.task` lifecycle modifier.

---

## 6. Real-World Production Example

```markdown
**Swift 6 Data Race Elimination**:
- Converted shared network session manager to an `actor`.
- Xcode Thread Sanitizer reported 0 data races, achieving full Swift 6 strict concurrency compliance.
```
