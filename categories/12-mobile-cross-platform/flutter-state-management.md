# Skill: Flutter Reactive State & Widget Tree Architecture
`id`: `kbcodedev/flutter-state-management`  
`category`: `12-mobile-cross-platform`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Architecting large-scale cross-platform Flutter applications with BLoC (Business Logic Component) or Riverpod, optimizing widget rebuilds, reactive stream flows, and platform channels.
- **Triggers**: State management architecture, unnecessary full-screen widget rebuilds, clean architecture repository decoupling in Flutter/Dart.
- **Prerequisites**: Dart 3+, Flutter 3.20+, BLoC (`flutter_bloc`) or Riverpod (`flutter_riverpod`).

---

## 2. Core Mental Model & Invariant Principles
1. **Unidirectional Data Flow**: UI dispatches Events -> BLoC processes business logic -> BLoC emits immutable States -> UI rebuilds targeted subtrees.
2. **Fine-Grained Widget Rebuilding**: Never wrap entire screen scaffolds in `BlocBuilder`; scope builders tightly around the individual text or button widget that changes.
3. **Immutable State Classes**: Always use `@freezed` or `Equatable` for state and event classes to guarantee value equality and prevent unnecessary renders.

---

## 3. High-Signal Execution Workflow

```
[User Tap Event] ── Dispatches Event (e.g. FetchOrdersEvent)
       │
       ▼
┌───────────────────────────┐
│ BLoC / Riverpod Notifier  │ ── Pure Dart business logic & repository call
└──────────┬────────────────┘
           ▼
┌───────────────────────────┐
│ Emits Typed State         │ ── OrdersLoading -> OrdersLoaded / OrdersError
└──────────┬────────────────┘
           ▼
┌───────────────────────────┐
│ BlocBuilder<OrderBloc,    │ ── Rebuilds ONLY the list view; keeps appbar static
│             OrderState>   │
└───────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "feature": "Order Checkout State Management",
  "pattern": "flutter_bloc + Equatable",
  "states": ["Initial", "Submitting", "Success", "Failure"]
}
```

### Output Contract
```dart
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

// 1. Events
abstract class CheckoutEvent extends Equatable {
  const CheckoutEvent();
  @override
  List<Object?> get props => [];
}

class SubmitPaymentEvent extends CheckoutEvent {
  final String orderId;
  final String paymentMethodId;

  const SubmitPaymentEvent({required this.orderId, required this.paymentMethodId});

  @override
  List<Object?> get props => [orderId, paymentMethodId];
}

// 2. States
abstract class CheckoutState extends Equatable {
  const CheckoutState();
  @override
  List<Object?> get props => [];
}

class CheckoutInitialState extends CheckoutState {}
class CheckoutSubmittingState extends CheckoutState {}
class CheckoutSuccessState extends CheckoutState {
  final String receiptId;
  const CheckoutSuccessState(this.receiptId);
  @override
  List<Object?> get props => [receiptId];
}
class CheckoutFailureState extends CheckoutState {
  final String errorMessage;
  const CheckoutFailureState(this.errorMessage);
  @override
  List<Object?> get props => [errorMessage];
}

// 3. BLoC Logic Engine
class CheckoutBloc extends Bloc<CheckoutEvent, CheckoutState> {
  final IPaymentRepository paymentRepo;

  CheckoutBloc({required this.paymentRepo}) : super(CheckoutInitialState()) {
    on<SubmitPaymentEvent>((event, emit) async {
      emit(CheckoutSubmittingState());
      try {
        final receipt = await paymentRepo.processPayment(event.orderId, event.paymentMethodId);
        emit(CheckoutSuccessState(receipt.id));
      } catch (e) {
        emit(CheckoutFailureState(e.toString()));
      }
    });
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **`setState` Everywhere**: Storing complex asynchronous business logic in StatefulWidget `setState` methods.
- ❌ **Fat `BlocBuilder` Wrappers**: Wrapping the root `MaterialApp` in a `BlocBuilder`, triggering entire app rebuilds on every state tick.
- ❌ **Direct HTTP Calls in UI Widgets**: Making raw `http.get()` calls directly inside Flutter `build()` methods.

---

## 6. Real-World Production Example

```markdown
**Flutter Performance Audit**:
- Scoped `BlocBuilder` to a 40-pixel status badge widget instead of wrapping the entire 8-section profile page.
- Eliminated 94% of unnecessary widget render cycles during live order status streaming.
```
