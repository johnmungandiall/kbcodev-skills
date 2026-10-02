# Skill: Rust Embedded Systems & Bare-Metal Programming
`id`: `kbcodedev/rust-embedded-systems`  
`category`: `21-systems-embedded-programming`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Developing firmware for microcontrollers (ARM Cortex-M, RISC-V, ESP32) using `#![no_std]` Rust, Embedded HAL, memory-mapped I/O, and zero-allocation interrupt handlers.
- **Triggers**: Embedded firmware development, real-time control loops, writing bare-metal drivers, eliminating C memory safety bugs on hardware.
- **Prerequisites**: Rust toolchain (`thumbv7em-none-eabihf`), OpenOCD / probe-rs, microcontroller datasheet.

---

## 2. Core Mental Model & Invariant Principles
1. **`#![no_std]` Memory Safety**: Write firmware without the standard OS library or dynamic heap allocators; allocate all buffers statically to eliminate heap fragmentation and out-of-memory crashes.
2. **Type-Safe Peripheral Access (PAC & HAL)**: Use Rust type-state patterns to guarantee at compile-time that GPIO pins are configured in the correct mode (e.g. `Output<PushPull>`) before writing.
3. **Interrupt Service Routine (ISR) Concurrency**: Protect shared peripheral state across interrupt contexts using critical sections or RTIC (Real-Time Interrupt-driven Concurrency) mutexes.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Hardware Board / Microcontroller Spec]
                  │
                  ▼
┌─────────────────────────────────┐
│ Step 1: #![no_std] Entry Point  │ ── cortex_m_rt::entry + panic_halt handler
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 2: Peripheral Clocks & HAL │ ── Take PAC peripherals, configure PLL clocks
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 3: Type-State GPIO Config  │ ── Pin.into_push_pull_output(&mut gpio.moder)
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 4: Deterministic Loop / ISR│ ── Zero-allocation deterministic control loop
└─────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "target_mcu": "STM32F401 (ARM Cortex-M4)",
  "task": "Blink LED on Pin C13 and configure UART telemetry at 115200 baud"
}
```

### Output Contract
```rust
#![no_std]
#![no_main]

use panic_halt as _;
use cortex_m_rt::entry;
use stm32f4xx_hal::{
    pac,
    prelude::*,
    serial::config::Config,
};

#[entry]
fn main() -> ! {
    // 1. Take device peripherals (PAC)
    let dp = pac::Peripherals::take().unwrap();
    let cp = cortex_m::Peripherals::take().unwrap();

    // 2. Set up system clocks (84 MHz)
    let rcc = dp.RCC.constrain();
    let clocks = rcc.cfgr.sysclk(84.MHz()).freeze();

    // 3. Configure GPIO Pin C13 (LED) using Type-State
    let gpioc = dp.GPIOC.split();
    let mut led = gpioc.pc13.into_push_pull_output();

    // 4. Configure SysTick Timer for exact delays
    let mut delay = cp.SYST.delay(&clocks);

    // 5. Deterministic Infinite Control Loop
    loop {
        led.toggle();
        delay.delay_ms(500_u32);
    }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Using `std` Libraries in Bare-Metal**: Attempting to import `std::thread` or `std::fs` on microcontrollers with zero operating system.
- ❌ **Unbounded Interrupt Execution**: Running long blocking computations inside Interrupt Service Routines, starving other hardware interrupts.
- ❌ **Unchecked Volatile Memory Access**: Reading hardware registers without `read_volatile` / PAC wrappers, allowing compiler optimizations to optimize away hardware reads.

---

## 6. Real-World Production Example

```markdown
**Firmware Memory Safety**:
- Replaced legacy C firmware with `#![no_std]` Rust on medical sensor device.
- Eliminated 100% of buffer overflow vulnerabilities and null pointer hardware panics at compile time.
```
