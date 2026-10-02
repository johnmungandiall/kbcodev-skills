# Skill: React Native & Cross-Platform Mobile Architecture
`id`: `kbcodedev/react-native-architecture`  
`category`: `12-mobile-cross-platform`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Architecting high-performance React Native (Expo / Bare workflow) mobile applications, optimizing 60fps/120fps animations with Reanimated 3, native JSI bridges, Hermes bytecode compilation, and deep linking.
- **Triggers**: Mobile app initialization, slow scroll performance / JS thread lag, native module bridge authoring, Expo router configuration.
- **Prerequisites**: React Native 0.74+ New Architecture (TurboModules / Fabric), TypeScript, iOS/Android build toolchains.

---

## 2. Core Mental Model & Invariant Principles
1. **Never Block the JavaScript Thread**: Offload all animations and gesture interactions to the UI thread using React Native Reanimated worklets (`'worklet'`) and Gesture Handler.
2. **Hermes Bytecode & Memory Optimization**: Always enable Hermes engine; pre-allocate large list render windows using FlashList (`@shopify/flash-list`) instead of legacy FlatList.
3. **New Architecture First (TurboModules & Fabric)**: Build native module bindings using JSI (JavaScript Interface) for synchronous C++ memory sharing with zero JSON serialization overhead.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Mobile App Feature Spec]
           │
           ▼
┌───────────────────────────┐
│ Phase 1: Navigation &     │ ── Expo Router (File-based, Deep Linking, Native Stacks)
│          Screen Topology  │
└──────────┬────────────────┘
           ▼
┌───────────────────────────┐
│ Phase 2: UI Thread        │ ── Reanimated 3 worklets for gestures & transforms
│          Offloading       │
└──────────┬────────────────┘
           ▼
┌───────────────────────────┐
│ Phase 3: High-Throughput  │ ── FlashList with estimatedItemSize for 120fps scrolling
│          List Rendering   │
└──────────┬────────────────┘
           ▼
┌───────────────────────────┐
│ Phase 4: Native Release   │ ── ProGuard rules, Hermes bytecode, OTA EAS updates
└───────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "screen_name": "ProductFeedScreen",
  "data_volume": "10,000 items with image cards and interactive swipe-to-like",
  "target_fps": "60fps sustained on budget Android devices"
}
```

### Output Contract
```tsx
import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export function ProductFeed({ products }: { products: Product[] }) {
  const renderItem = useCallback(({ item }: { item: Product }) => (
    <ProductCard item={item} />
  ), []);

  return (
    <View style={styles.container}>
      <FlashList
        data={products}
        renderItem={renderItem}
        estimatedItemSize={280}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function ProductCard({ item }: { item: Product }) {
  const scale = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      scale.value = withSpring(0.96);
    })
    .onFinalize(() => {
      'worklet';
      scale.value = withSpring(1);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090D16' },
  card: { marginHorizontal: 16, marginVertical: 8, borderRadius: 16, backgroundColor: '#111827', overflow: 'hidden' },
  image: { width: '100%', height: 200 },
  info: { padding: 14, flexDirection: 'row', justifyContent: 'space-between' },
  title: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  price: { color: '#6366F1', fontSize: 16, fontWeight: '700' },
});
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **JS Thread Animation Loops**: Running JavaScript `setState` at 60Hz instead of driving animations via Reanimated worklets.
- ❌ **Unbounded FlatList Memory**: Using standard `FlatList` with huge item counts without setting `windowSize`, `maxToRenderPerBatch`, or replacing with `FlashList`.
- ❌ **Ignoring Android Back Handler**: Forgetting to handle Android hardware back button presses in modal dialogs.

---

## 6. Real-World Production Example

```markdown
**FlashList Migration**:
- Replaced FlatList with FlashList on a social feed with 5,000 photo cards.
- Frame drops on low-end Android devices decreased from 38% to 0.4%; RAM usage dropped from 420MB to 110MB.
```
