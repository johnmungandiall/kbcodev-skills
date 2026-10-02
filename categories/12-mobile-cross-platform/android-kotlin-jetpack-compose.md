# Skill: Android Kotlin Jetpack Compose & Clean Architecture
`id`: `kbcodedev/android-kotlin-jetpack-compose`  
`category`: `12-mobile-cross-platform`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building modern native Android applications with Jetpack Compose, Kotlin Coroutines & Flow, Hilt dependency injection, and Room SQLite persistence.
- **Triggers**: Android UI development, Jetpack Compose migration, Kotlin Flow state management, Room database schema design.
- **Prerequisites**: Android Studio, Kotlin 1.9+, Jetpack Compose BOM, Hilt DI.

---

## 2. Core Mental Model & Invariant Principles
1. **State Hoisting & Unidirectional Data Flow (UDF)**: Composables must be stateless; state flows down from ViewModel via `StateFlow<T>`, and events flow up via lambda callbacks.
2. **Recomposition Stability**: Annotate immutable data classes with `@Immutable` or `@Stable` to allow the Compose compiler to skip unnecessary recompositions.
3. **Structured Coroutine Scopes**: Launch ViewModel coroutines strictly inside `viewModelScope` with `SharingStarted.WhileSubscribed(5000)` to automatically stop upstream flows when UI goes into the background.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[User Interaction in Composable] ── Invokes ViewModel lambda
               │
               ▼
┌──────────────────────────────┐
│ ViewModel (viewModelScope)   │ ── Collects Repository Flow & emits StateFlow<UiState>
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Room Database (Local Cache)  │ ── Single Source of Truth (SSOT)
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Jetpack Compose UI Recompiles│ ── Only recomposes targeted composable nodes
└──────────────────────────────┘
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
  "screen": "UserProfileScreen",
  "stack": "Jetpack Compose + Kotlin StateFlow + Room DB + Hilt",
  "state_fields": ["user", "isLoading", "isSubmitting"]
}
```

### Output Contract
```kotlin
// 1. Immutable UI State
@Immutable
data class UserProfileUiState(
    val user: User? = null,
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

// 2. Hilt ViewModel with StateFlow
@HiltViewModel
class UserProfileViewModel @Inject constructor(
    private val userRepository: UserRepository
) : ViewModel() {

    val uiState: StateFlow<UserProfileUiState> = userRepository.getUserStream()
        .map { user -> UserProfileUiState(user = user) }
        .catch { e -> emit(UserProfileUiState(errorMessage = e.message)) }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = UserProfileUiState(isLoading = true)
        )
}

// 3. Stateless Composable with State Hoisting
@Composable
fun UserProfileScreen(
    viewModel: UserProfileViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    UserProfileContent(state = state)
}

@Composable
fun UserProfileContent(state: UserProfileUiState) {
    Scaffold(
        topBar = { TopAppBar(title = { Text("Profile") }) }
    ) { padding ->
        Box(modifier = Modifier.fillMaxSize().padding(padding)) {
            when {
                state.isLoading -> CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                state.errorMessage != null -> Text("Error: ${state.errorMessage}", color = MaterialTheme.colorScheme.error)
                state.user != null -> {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(text = state.user.name, style = MaterialTheme.typography.headlineMedium)
                        Text(text = state.user.email, style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
        }
    }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Passing ViewModel Down the Composable Tree**: Passing ViewModel instances to child composables, making previewing and unit testing impossible.
- ❌ **Unstable Parameter Types**: Passing mutable `List<T>` directly into composables, forcing re-evaluation on every recomposition cycle (use `ImmutableList<T>`).
- ❌ **GlobalScope Coroutines**: Launching unmanaged coroutines in `GlobalScope`, creating memory leaks when activities are destroyed.

---

## 6. Real-World Production Example

```markdown
**Recomposition Optimization**:
- Replaced unstable standard `List<CartItem>` with kotlinx immutable list.
- Compose compiler skipped 98% of recompositions during price slider adjustments.
```
