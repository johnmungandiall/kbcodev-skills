# Skill: Flutter Production Architecture & Enterprise Clean Code
`id`: `kbcodedev/flutter-production-architecture`  
`category`: `12-mobile-cross-platform`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Architecting production-grade Flutter applications with enterprise clean architecture, layered dependency injection, robust error handling, platform channel integration, performance optimization, and CI/CD release pipelines.
- **Triggers**: New Flutter project scaffolding, monolith-to-clean-architecture migration, production release hardening, performance profiling, platform-specific native integration.
- **Prerequisites**: Dart 3+, Flutter 3.20+, `get_it` + `injectable` (or manual DI), `freezed` + `json_serializable`, `go_router`, `dio` or `http`.

---

## 2. Core Mental Model & Invariant Principles
1. **Layered Clean Architecture with Strict Dependency Rules**: Enforce a 4-layer architecture (`presentation` → `application` → `domain` → `data`) where inner layers NEVER import outer layers. Domain entities and repository interfaces live in `domain/`; concrete implementations live in `data/`. Violations are caught by custom lint rules (`depend_on_referenced_packages`, import path restrictions).
2. **Compile-Time Safety Over Runtime Reflection**: Use `freezed` sealed unions for state modeling, `json_serializable` for codec generation, and `injectable` + `get_it` for compile-time verified DI — never `dart:mirrors`, never string-based service locators, never untyped `Map<String, dynamic>` as domain models.
3. **Dynamic Performance Budgets**: Size frame budgets, shader warm-up strategies, and image cache limits dynamically from the target device class and screen density (`MediaQuery.devicePixelRatio`, `Platform` checks), never from hardcoded constants. Profile with DevTools timeline; target jank-free 60fps (or 120fps on ProMotion devices) measured on the lowest-tier device in the support matrix.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Flutter Production App Requirement]
                │
                ▼
┌──────────────────────────────────────┐
│ Phase 1: Project Scaffold &          │ ── Clean architecture layers, DI, router, theme
│          Foundation Setup            │
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: Domain & Data Layer         │ ── Entities, repository contracts, API clients,
│          Implementation              │    local DB (Drift/Isar), error types
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Presentation Layer &        │ ── BLoC/Cubit/Riverpod, GoRouter, adaptive UI,
│          Platform Integration        │    platform channels, deep links
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Production Hardening &      │ ── Obfuscation, tree-shaking, Crashlytics,
│          Release Pipeline            │    Fastlane/Codemagic CI/CD, store submission
└──────────────────────────────────────┘
```

### Phase 1: Project Scaffold & Foundation Setup

```
lib/
├── core/                          # Cross-cutting: theme, constants, extensions, DI
│   ├── di/                        # get_it + injectable module registration
│   │   └── injection.dart         # @InjectableInit configureDependencies()
│   ├── theme/                     # AppTheme, ColorTokens, TextStyles (dynamic)
│   ├── router/                    # GoRouter config, route guards, deep link handlers
│   ├── network/                   # Dio interceptors, retry policy, connectivity monitor
│   └── error/                     # Failure sealed class hierarchy (freezed)
├── features/                      # Feature-first vertical slices
│   └── <feature_name>/
│       ├── domain/                # Entities, repository interfaces, use cases
│       │   ├── entities/
│       │   ├── repositories/      # Abstract repository contracts
│       │   └── usecases/          # Single-responsibility use case classes
│       ├── data/                  # Concrete implementations
│       │   ├── datasources/       # Remote (API) + Local (Drift/Isar/SharedPrefs)
│       │   ├── models/            # DTO classes (@freezed + @JsonSerializable)
│       │   └── repositories/      # Repository implementations
│       └── presentation/          # UI layer
│           ├── bloc/              # BLoC/Cubit + Events + States (@freezed)
│           ├── pages/             # Screen widgets
│           └── widgets/           # Reusable feature-scoped widgets
└── main.dart                      # Entry point: WidgetsFlutterBinding, configureDependencies()
```

**Dependency Injection (get_it + injectable)**:
```dart
// core/di/injection.dart
import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'injection.config.dart';

final getIt = GetIt.instance;

@InjectableInit(preferRelativeImports: true)
void configureDependencies(String environment) =>
    getIt.init(environment: environment);
```

**Failure Hierarchy (freezed sealed union)**:
```dart
// core/error/failure.dart
import 'package:freezed_annotation/freezed_annotation.dart';
part 'failure.freezed.dart';

@freezed
sealed class Failure with _$Failure {
  const factory Failure.server({required String message, int? statusCode}) = ServerFailure;
  const factory Failure.network({required String message}) = NetworkFailure;
  const factory Failure.cache({required String message}) = CacheFailure;
  const factory Failure.validation({required String field, required String reason}) = ValidationFailure;
  const factory Failure.unauthorized() = UnauthorizedFailure;
  const factory Failure.unexpected({required Object error, StackTrace? stackTrace}) = UnexpectedFailure;
}
```

### Phase 2: Domain & Data Layer Implementation

**Repository Contract (domain layer — pure Dart, no Flutter imports)**:
```dart
// features/orders/domain/repositories/order_repository.dart
import 'package:fpdart/fpdart.dart';

abstract class OrderRepository {
  Future<Either<Failure, List<Order>>> getOrders({required int page, int pageSize = 20});
  Future<Either<Failure, Order>> getOrderById(String id);
  Future<Either<Failure, Unit>> cancelOrder(String id, {required String reason});
}
```

**Data Source + Repository Implementation**:
```dart
// features/orders/data/repositories/order_repository_impl.dart
@LazySingleton(as: OrderRepository)
class OrderRepositoryImpl implements OrderRepository {
  final OrderRemoteDataSource _remote;
  final OrderLocalDataSource _local;
  final NetworkInfo _networkInfo;

  OrderRepositoryImpl(this._remote, this._local, this._networkInfo);

  @override
  Future<Either<Failure, List<Order>>> getOrders({required int page, int pageSize = 20}) async {
    if (await _networkInfo.isConnected) {
      try {
        final dtos = await _remote.fetchOrders(page: page, pageSize: pageSize);
        final entities = dtos.map((dto) => dto.toDomain()).toList();
        await _local.cacheOrders(dtos);
        return right(entities);
      } on DioException catch (e) {
        return left(Failure.server(message: e.message ?? 'Server error', statusCode: e.response?.statusCode));
      }
    } else {
      try {
        final cached = await _local.getCachedOrders(page: page, pageSize: pageSize);
        return right(cached.map((dto) => dto.toDomain()).toList());
      } catch (_) {
        return left(const Failure.cache(message: 'No cached orders available'));
      }
    }
  }
}
```

**Use Case (single responsibility)**:
```dart
// features/orders/domain/usecases/get_orders.dart
@lazySingleton
class GetOrders {
  final OrderRepository _repository;
  GetOrders(this._repository);

  Future<Either<Failure, List<Order>>> call({required int page, int pageSize = 20}) =>
      _repository.getOrders(page: page, pageSize: pageSize);
}
```

### Phase 3: Presentation Layer & Platform Integration

**BLoC with freezed Events/States**:
```dart
// features/orders/presentation/bloc/orders_bloc.dart
@freezed
sealed class OrdersEvent with _$OrdersEvent {
  const factory OrdersEvent.fetch({@Default(1) int page}) = _FetchOrders;
  const factory OrdersEvent.refresh() = _RefreshOrders;
  const factory OrdersEvent.cancel({required String orderId, required String reason}) = _CancelOrder;
}

@freezed
sealed class OrdersState with _$OrdersState {
  const factory OrdersState.initial() = _Initial;
  const factory OrdersState.loading() = _Loading;
  const factory OrdersState.loaded({required List<Order> orders, required bool hasMore}) = _Loaded;
  const factory OrdersState.error({required Failure failure}) = _Error;
}

@injectable
class OrdersBloc extends Bloc<OrdersEvent, OrdersState> {
  final GetOrders _getOrders;

  OrdersBloc(this._getOrders) : super(const OrdersState.initial()) {
    on<_FetchOrders>(_onFetch);
    on<_RefreshOrders>(_onRefresh);
  }

  Future<void> _onFetch(_FetchOrders event, Emitter<OrdersState> emit) async {
    emit(const OrdersState.loading());
    final result = await _getOrders(page: event.page);
    result.fold(
      (failure) => emit(OrdersState.error(failure: failure)),
      (orders) => emit(OrdersState.loaded(orders: orders, hasMore: orders.length >= 20)),
    );
  }

  Future<void> _onRefresh(_RefreshOrders event, Emitter<OrdersState> emit) async {
    final result = await _getOrders(page: 1);
    result.fold(
      (failure) => emit(OrdersState.error(failure: failure)),
      (orders) => emit(OrdersState.loaded(orders: orders, hasMore: orders.length >= 20)),
    );
  }
}
```

**Adaptive Platform UI**:
```dart
// Adaptive widget that respects platform conventions
Widget buildAdaptiveScaffold(BuildContext context) {
  final platform = Theme.of(context).platform;
  return switch (platform) {
    TargetPlatform.iOS     => CupertinoPageScaffold(/* iOS-native navigation */),
    TargetPlatform.android => Scaffold(/* Material 3 navigation */),
    _                      => Scaffold(/* Desktop/Web fallback */),
  };
}
```

**Platform Channel Integration (Method Channel)**:
```dart
// core/platform/native_bridge.dart
class NativeBridge {
  static const _channel = MethodChannel('com.app/native');

  static Future<String?> getDeviceSecurityLevel() async {
    try {
      return await _channel.invokeMethod<String>('getSecurityLevel');
    } on PlatformException catch (e) {
      debugPrint('Platform channel error: ${e.message}');
      return null;
    }
  }
}
```

### Phase 4: Production Hardening & Release Pipeline

**Performance Optimization Checklist**:
- `const` constructors on every stateless widget and immutable object.
- `RepaintBoundary` around expensive subtrees (charts, maps, animations).
- `ListView.builder` / `SliverList` with `itemExtent` for fixed-height items.
- Image caching via `cached_network_image` with `memCacheHeight`/`memCacheWidth` sized to display resolution.
- Shader warm-up: `ShaderWarmUp` subclass for custom shaders; run during splash screen.
- Tree-shake unused Material/Cupertino icons: `--no-tree-shake-icons` only when custom icon fonts are used.

**Obfuscation & Release Build**:
```bash
# Android release
flutter build appbundle --release --obfuscate --split-debug-info=build/symbols/

# iOS release
flutter build ipa --release --obfuscate --split-debug-info=build/symbols/

# Upload debug symbols to Crashlytics
firebase crashlytics:symbols:upload --app=<APP_ID> build/symbols/
```

**CI/CD Pipeline (Codemagic / GitHub Actions)**:
```yaml
# .github/workflows/flutter-release.yml
name: Flutter Release
on:
  push:
    tags: ['v*']
jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.x'
          channel: stable
      - run: flutter pub get
      - run: flutter analyze --fatal-infos
      - run: flutter test --coverage
      - run: flutter build appbundle --release --obfuscate --split-debug-info=build/symbols/
      - run: flutter build ipa --release --obfuscate --split-debug-info=build/symbols/
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "app_name": "string (e.g. 'Acme Orders')",
  "package_name": "string (e.g. 'com.acme.orders')",
  "target_platforms": ["android", "ios", "web"],
  "state_management": "bloc | riverpod | cubit",
  "features": ["auth", "orders", "profile", "settings"],
  "backend_api_base_url": "string (e.g. 'https://api.acme.com/v1')",
  "local_db": "drift | isar | hive | none",
  "auth_strategy": "jwt | oauth2 | firebase_auth",
  "ci_cd": "github_actions | codemagic | fastlane",
  "min_sdk": { "android": 24, "ios": "15.0" }
}
```

### Output Contract
```json
{
  "scaffold": {
    "structure": "4-layer clean architecture (presentation → application → domain → data)",
    "di_setup": "get_it + injectable with environment-aware registration",
    "router": "GoRouter with typed routes and auth guards",
    "theme": "Material 3 dynamic color with adaptive platform switching"
  },
  "features_generated": ["auth", "orders", "profile", "settings"],
  "error_handling": "freezed Failure sealed union with Either<Failure, T> returns",
  "test_coverage": {
    "unit": "Use cases + BLoC + repository tests with mocktail",
    "widget": "Key screen golden tests with alchemist",
    "integration": "Critical user flow patrol tests"
  },
  "release_artifacts": {
    "android": ".aab with obfuscation + split debug symbols",
    "ios": ".ipa with obfuscation + dSYM upload",
    "ci_pipeline": "GitHub Actions / Codemagic YAML"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **God Widget**: Placing business logic, API calls, and navigation inside `build()` methods instead of delegating to BLoC/Cubit and use cases.
- ❌ **Untyped JSON Drilling**: Passing `Map<String, dynamic>` through layers instead of typed `@freezed` DTOs and domain entities with explicit `fromJson`/`toJson` codecs.
- ❌ **Global Mutable Singletons**: Using top-level `late` variables or static mutable fields for state instead of scoped DI with `get_it` lifecycle management (`@lazySingleton`, `@factoryMethod`).
- ❌ **Full-Tree BlocBuilder**: Wrapping `Scaffold` or `MaterialApp` inside `BlocBuilder` causing entire screen rebuilds on every state change instead of scoping builders to the smallest changing subtree.
- ❌ **Hardcoded Pixel Values**: Using `SizedBox(height: 812)` or `width: 375` instead of `MediaQuery`, `LayoutBuilder`, or `FractionallySizedBox` for responsive layouts.
- ❌ **Ignoring Platform Conventions**: Forcing Material Design on iOS or Cupertino on Android instead of adaptive widgets (`Switch.adaptive`, `AlertDialog.adaptive`, platform-aware navigation patterns).

---

## 6. Real-World Production Example

```markdown
**Task**: Scaffold a production Flutter e-commerce app with auth, product catalog, cart, and checkout.

**Phase 1 (Scaffold)**:
- Created 4-layer clean architecture under `lib/features/{auth,catalog,cart,checkout}/`.
- Configured `get_it` + `injectable` DI with `dev` and `prod` environments.
- Set up `GoRouter` with auth guard redirecting unauthenticated users to login.
- Implemented Material 3 dynamic color theme with `ColorScheme.fromSeed()`.

**Phase 2 (Domain + Data)**:
- Defined `Product`, `CartItem`, `Order` entities as `@freezed` classes.
- Created `ProductRepository`, `CartRepository`, `OrderRepository` abstract contracts.
- Implemented `DioRemoteDataSource` with retry interceptor (3 attempts, exponential backoff).
- Added `DriftLocalDataSource` for offline product catalog caching.

**Phase 3 (Presentation)**:
- Built `CatalogBloc` with pagination (`FetchNextPage` event, `hasMore` state flag).
- Implemented `CartCubit` with optimistic UI updates and server sync on checkout.
- Added `MethodChannel` bridge for biometric authentication on iOS (Face ID) and Android (fingerprint).

**Phase 4 (Release)**:
- Configured GitHub Actions: `flutter analyze` → `flutter test --coverage` → `flutter build appbundle --obfuscate`.
- Uploaded split debug symbols to Firebase Crashlytics.
- Achieved 94% crash-free rate in first production week with 12,000 DAU.

**Outcome**: Production e-commerce app shipped to Play Store and App Store with clean architecture, offline support, biometric auth, and automated CI/CD. Zero P0 crashes in first 30 days.
```
