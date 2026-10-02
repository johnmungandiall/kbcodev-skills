# Skill: C/C++ Memory Leak Sanitizer & Valgrind Auditor
`id`: `kbcodedev/c-cpp-memory-leak-sanitizer`  
`category`: `21-systems-embedded-programming`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Diagnosing and eliminating memory leaks, buffer overflows, use-after-free, double-frees, and data races in C/C++ codebases using Valgrind, AddressSanitizer (ASan), and UndefinedBehaviorSanitizer (UBSan).
- **Triggers**: Segmentation faults (`SIGSEGV`), memory leaks, CI sanitizer test failures, auditing legacy C/C++ libraries.
- **Prerequisites**: GCC / Clang compiler, Valgrind, CMake/Makefile build configuration.

---

## 2. Core Mental Model & Invariant Principles
1. **RAII & Smart Pointers (Modern C++)**: Never use manual `malloc()` / `free()` or raw `new` / `delete`. Manage dynamic memory strictly through `std::unique_ptr` and `std::shared_ptr`.
2. **Compiler Sanitizers at Build Time**: Build with `-fsanitize=address,undefined -g` during unit testing. AddressSanitizer detects memory corruption with near-zero overhead compared to Valgrind.
3. **Zero Leaks Invariant**: A production test suite must pass with `0 bytes in 0 blocks definitely lost` in Valgrind.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[C/C++ Build & Test Target]
             │
             ▼
┌────────────────────────────┐
│ Step 1: Compile with ASan  │ ── clang++ -fsanitize=address -g -O1 main.cpp
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Step 2: Run Valgrind Memcheck ── valgrind --leak-check=full --show-leak-kinds=all
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Step 3: Stack Trace Pinpoint ── Identify exact allocation line without corresponding free
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Step 4: Refactor to RAII   │ ── Replace raw pointers with std::unique_ptr
└────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "codebase": "C++ High-Throughput Packet Parser",
  "issue": "Process memory grows by 200MB/hour and crashes with SIGSEGV after 12 hours"
}
```

### Output Contract
```cpp
// Refactored RAII Memory Management (Zero-Leak C++20)
#include <iostream>
#include <memory>
#include <vector>
#include <string_view>

struct Packet {
    uint32_t id;
    std::vector<uint8_t> payload;
};

class PacketProcessor {
public:
    // Uses std::unique_ptr for strict single-ownership RAII
    void processPacket(std::unique_ptr<Packet> packet) {
        if (!packet) return;

        // Process packet safely without manual free
        std::cout << "Processing packet ID: " << packet->id 
                  << " Payload size: " << packet->payload.size() << "\n";
        
        // Memory automatically freed when packet unique_ptr falls out of scope
    }

    std::unique_ptr<Packet> createPacket(uint32_t id, const uint8_t* data, size_t len) {
        auto pkt = std::make_unique<Packet>();
        pkt->id = id;
        pkt->payload.assign(data, data + len);
        return pkt;
    }
};

// Build Command for CI Sanitization:
// clang++ -std=c++20 -fsanitize=address,undefined -g -Wall -Wextra main.cpp -o test_runner
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Use-After-Free**: Referencing a pointer after calling `free(ptr)` or deleting its object.
- ❌ **Double Free**: Freeing the same memory buffer twice, causing heap corruption exploits.
- ❌ **Ignoring Valgrind Warnings**: Disregarding "Invalid read of size 4" assuming that because the program didn't crash, the memory bug is harmless.

---

## 6. Real-World Production Example

```markdown
**ASan Diagnostic**:
- AddressSanitizer pinpointed an off-by-one buffer overflow in a custom string parsing routine at `parser.cpp:88`.
- Replaced raw `char buffer[256]` with `std::string_view`, eliminating the security vulnerability in 15 minutes.
```
