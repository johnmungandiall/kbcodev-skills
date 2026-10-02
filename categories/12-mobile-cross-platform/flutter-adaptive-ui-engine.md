# Skill: Flutter Adaptive UI, Animation & Theming Engine
`id`: `kbcodedev/flutter-adaptive-ui-engine`  
`category`: `12-mobile-cross-platform`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building production-grade Flutter UIs with responsive multi-form-factor layouts, implicit/explicit animations, Material 3 dynamic theming, custom painting, adaptive platform widgets, and pixel-perfect design-to-code translation.
- **Triggers**: Design handoff (Figma → Flutter), responsive layout engineering (phone/tablet/desktop/foldable), custom animation sequences, dark/light/dynamic color theming, accessibility-compliant widget trees.
- **Prerequisites**: Dart 3+, Flutter 3.20+, Material 3 (`useMaterial3: true`), target device matrix (screen sizes, pixel ratios, platform conventions).

---

## 2. Core Mental Model & Invariant Principles
1. **Responsive-First Composition**: Never hardcode pixel dimensions. Compose layouts with `LayoutBuilder`, `MediaQuery`, `FractionallySizedBox`, and breakpoint-driven adaptive scaffolds that reshape from single-column mobile to multi-pane desktop without separate widget trees.
2. **Animation Performance Budget**: Implicit animations (`AnimatedContainer`, `AnimatedOpacity`) for simple state transitions; explicit `AnimationController` + `Tween` chains only when choreographing multi-property sequences. Every animation must run on the GPU compositor thread — never trigger `markNeedsLayout` mid-animation; use `Transform`, `Opacity`, and `ClipRect` (compositor-friendly) over `Container` resizing.
3. **Semantic Theming Over Magic Colors**: Every color, text style, elevation, and shape radius must resolve from `Theme.of(context).colorScheme` / `textTheme` — never from inline `Color(0xFF...)` literals. Dynamic color via `ColorScheme.fromSeed()` or platform `DynamicColorBuilder` adapts the entire app to wallpaper/brand with zero per-widget changes.

---

## 3. High-Signal Execution Workflow

```
[Design Spec / Figma Handoff]
              │
              ▼
┌──────────────────────────────────────┐
│ Phase 1: Design Token Extraction &   │ ── ColorScheme, TextTheme, shape, elevation,
│          Theme Architecture          │    spacing scale from design system
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: Responsive Layout           │ ── Breakpoint scaffold, adaptive navigation,
│          Composition                 │    form-factor-aware widget selection
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Animation & Micro-          │ ── Implicit transitions, explicit choreography,
│          Interaction Engineering     │    hero transitions, staggered lists
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Accessibility, Testing &    │ ── Semantics tree, golden tests, contrast
│          Visual QA                   │    verification, screen reader audit
└──────────────────────────────────────┘
```

### Phase 1: Design Token Extraction & Theme Architecture

**Dynamic Material 3 Theme**:
```dart
// core/theme/app_theme.dart
import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData light({Color? seedColor}) {
    final scheme = ColorScheme.fromSeed(
      seedColor: seedColor ?? const Color(0xFF1A73E8),
      brightness: Brightness.light,
    );
    return _buildTheme(scheme);
  }

  static ThemeData dark({Color? seedColor}) {
    final scheme = ColorScheme.fromSeed(
      seedColor: seedColor ?? const Color(0xFF1A73E8),
      brightness: Brightness.dark,
    );
    return _buildTheme(scheme);
  }

  static ThemeData _buildTheme(ColorScheme scheme) {
    final textTheme = _buildTextTheme(scheme);
    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        backgroundColor: scheme.surface,
        foregroundColor: scheme.onSurface,
        elevation: 0,
        scrolledUnderElevation: 1,
      ),
      cardTheme: CardTheme(
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        color: scheme.surfaceContainerLow,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: scheme.surfaceContainerHighest,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size(double.infinity, 48),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
    );
  }

  static TextTheme _buildTextTheme(ColorScheme scheme) {
    return TextTheme(
      displayLarge: TextStyle(fontSize: 57, fontWeight: FontWeight.w400, color: scheme.onSurface),
      headlineMedium: TextStyle(fontSize: 28, fontWeight: FontWeight.w500, color: scheme.onSurface),
      titleLarge: TextStyle(fontSize: 22, fontWeight: FontWeight.w600, color: scheme.onSurface),
      bodyLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.w400, color: scheme.onSurfaceVariant),
      bodyMedium: TextStyle(fontSize: 14, fontWeight: FontWeight.w400, color: scheme.onSurfaceVariant),
      labelLarge: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: scheme.onSurface),
    );
  }
}
```

**Spacing Scale (consistent rhythm)**:
```dart
// core/theme/spacing.dart
abstract final class AppSpacing {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 16;
  static const double lg = 24;
  static const double xl = 32;
  static const double xxl = 48;

  /// Dynamic spacing that scales with text scale factor
  static double scaled(BuildContext context, double base) =>
      base * MediaQuery.textScalerOf(context).scale(1.0).clamp(1.0, 1.5);
}
```

### Phase 2: Responsive Layout Composition

**Breakpoint-Driven Adaptive Scaffold**:
```dart
// core/layout/adaptive_scaffold.dart
enum FormFactor { mobile, tablet, desktop }

FormFactor formFactorOf(BuildContext context) {
  final width = MediaQuery.sizeOf(context).width;
  if (width < 600) return FormFactor.mobile;
  if (width < 1200) return FormFactor.tablet;
  return FormFactor.desktop;
}

class AdaptiveScaffold extends StatelessWidget {
  final Widget mobileBody;
  final Widget? tabletBody;
  final Widget? desktopBody;
  final Widget? navigationRail;   // tablet/desktop side nav
  final Widget? bottomNav;        // mobile bottom nav
  final PreferredSizeWidget? appBar;

  const AdaptiveScaffold({
    super.key,
    required this.mobileBody,
    this.tabletBody,
    this.desktopBody,
    this.navigationRail,
    this.bottomNav,
    this.appBar,
  });

  @override
  Widget build(BuildContext context) {
    final factor = formFactorOf(context);
    return switch (factor) {
      FormFactor.mobile => Scaffold(
        appBar: appBar,
        body: mobileBody,
        bottomNavigationBar: bottomNav,
      ),
      FormFactor.tablet => Scaffold(
        appBar: appBar,
        body: Row(
          children: [
            if (navigationRail != null) navigationRail!,
            Expanded(child: tabletBody ?? mobileBody),
          ],
        ),
      ),
      FormFactor.desktop => Scaffold(
        body: Row(
          children: [
            if (navigationRail != null) navigationRail!,
            Expanded(flex: 2, child: desktopBody ?? tabletBody ?? mobileBody),
          ],
        ),
      ),
    };
  }
}
```

**Responsive Grid with Dynamic Columns**:
```dart
// core/layout/responsive_grid.dart
class ResponsiveGrid extends StatelessWidget {
  final List<Widget> children;
  final double spacing;
  final int? mobileColumns;
  final int? tabletColumns;
  final int? desktopColumns;

  const ResponsiveGrid({
    super.key,
    required this.children,
    this.spacing = 16,
    this.mobileColumns,
    this.tabletColumns,
    this.desktopColumns,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) {
      final columns = switch (formFactorOf(context)) {
        FormFactor.mobile  => mobileColumns ?? 1,
        FormFactor.tablet  => tabletColumns ?? 2,
        FormFactor.desktop => desktopColumns ?? 3,
      };
      return GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: columns,
          crossAxisSpacing: spacing,
          mainAxisSpacing: spacing,
          childAspectRatio: 1.2,
        ),
        itemCount: children.length,
        itemBuilder: (_, i) => children[i],
      );
    });
  }
}
```

**Foldable / Multi-Window Support**:
```dart
// Detect hinge for foldable devices (Samsung Fold, Pixel Fold)
Widget buildFoldableLayout(BuildContext context) {
  final hinges = MediaQuery.displayFeaturesOf(context)
      .where((f) => f.type == DisplayFeatureType.hinge);
  if (hinges.isNotEmpty) {
    // Dual-pane layout split at the hinge
    return TwoPane(
      startPane: const ListPane(),
      endPane: const DetailPane(),
      paneProportion: 0.5,
    );
  }
  return const SinglePaneLayout();
}
```

### Phase 3: Animation & Micro-Interaction Engineering

**Implicit Animations (simple state transitions)**:
```dart
// Smooth container transitions — GPU-friendly, zero boilerplate
AnimatedContainer(
  duration: const Duration(milliseconds: 300),
  curve: Curves.easeOutCubic,
  padding: EdgeInsets.all(isExpanded ? 24 : 16),
  decoration: BoxDecoration(
    color: isSelected
        ? Theme.of(context).colorScheme.primaryContainer
        : Theme.of(context).colorScheme.surfaceContainerLow,
    borderRadius: BorderRadius.circular(isExpanded ? 20 : 12),
  ),
  child: content,
)
```

**Explicit Staggered List Animation**:
```dart
// Staggered entrance animation for list items
class StaggeredListItem extends StatelessWidget {
  final int index;
  final Animation<double> animation;
  final Widget child;

  const StaggeredListItem({
    super.key,
    required this.index,
    required this.animation,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final delay = index * 0.05;
    final itemAnimation = CurvedAnimation(
      parent: animation,
      curve: Interval(delay.clamp(0.0, 0.8), (delay + 0.4).clamp(0.0, 1.0),
          curve: Curves.easeOutCubic),
    );
    return FadeTransition(
      opacity: itemAnimation,
      child: SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(0, 0.15),
          end: Offset.zero,
        ).animate(itemAnimation),
        child: child,
      ),
    );
  }
}
```

**Hero Transition with Custom Flight Shuttle**:
```dart
Hero(
  tag: 'product-${product.id}',
  flightShuttleBuilder: (_, animation, direction, fromContext, toContext) {
    return AnimatedBuilder(
      animation: animation,
      builder: (_, __) => Material(
        elevation: lerpDouble(2, 8, animation.value)!,
        borderRadius: BorderRadius.circular(
          lerpDouble(12, 0, animation.value)!,
        ),
        clipBehavior: Clip.antiAlias,
        child: toContext.widget,
      ),
    );
  },
  child: ProductCard(product: product),
)
```

**Custom Painter for Data Visualization**:
```dart
class SparklineChart extends CustomPainter {
  final List<double> data;
  final Color lineColor;
  final Color fillColor;

  SparklineChart({required this.data, required this.lineColor, required this.fillColor});

  @override
  void paint(Canvas canvas, Size size) {
    if (data.isEmpty) return;
    final maxVal = data.reduce(max);
    final minVal = data.reduce(min);
    final range = maxVal - minVal;
    if (range == 0) return;

    final path = Path();
    final fillPath = Path();
    final dx = size.width / (data.length - 1);

    for (var i = 0; i < data.length; i++) {
      final x = i * dx;
      final y = size.height - ((data[i] - minVal) / range) * size.height;
      if (i == 0) {
        path.moveTo(x, y);
        fillPath.moveTo(x, size.height);
        fillPath.lineTo(x, y);
      } else {
        path.lineTo(x, y);
        fillPath.lineTo(x, y);
      }
    }

    fillPath.lineTo(size.width, size.height);
    fillPath.close();

    canvas.drawPath(fillPath, Paint()..color = fillColor.withOpacity(0.15));
    canvas.drawPath(path, Paint()
      ..color = lineColor
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round);
  }

  @override
  bool shouldRepaint(covariant SparklineChart old) =>
      old.data != data || old.lineColor != lineColor;
}
```

### Phase 4: Accessibility, Testing & Visual QA

**Semantics & Accessibility**:
```dart
// Wrap interactive custom widgets with Semantics
Semantics(
  label: 'Order total: \$${total.toStringAsFixed(2)}',
  button: false,
  readOnly: true,
  child: CustomPaint(painter: SparklineChart(data: prices, lineColor: colorScheme.primary, fillColor: colorScheme.primary)),
)

// Ensure minimum touch targets (48x48 dp)
SizedBox(
  width: 48,
  height: 48,
  child: IconButton(
    icon: const Icon(Icons.close),
    onPressed: onDismiss,
    tooltip: 'Dismiss notification',  // always provide tooltip for icon buttons
  ),
)
```

**Golden Tests (pixel-perfect visual regression)**:
```dart
// test/golden/product_card_test.dart
import 'package:alchemist/alchemist.dart';

void main() {
  goldenTest('ProductCard renders correctly across themes', fileName: 'product_card', builder: () {
    return GoldenTestGroup(children: [
      GoldenTestScenario(name: 'light', child: Theme(
        data: AppTheme.light(),
        child: const ProductCard(product: sampleProduct),
      )),
      GoldenTestScenario(name: 'dark', child: Theme(
        data: AppTheme.dark(),
        child: const ProductCard(product: sampleProduct),
      )),
    ]);
  });
}
```

**Contrast Verification**:
```dart
// Programmatic WCAG contrast check
double contrastRatio(Color foreground, Color background) {
  double luminance(Color c) {
    final r = c.red / 255, g = c.green / 255, b = c.blue / 255;
    final rl = r <= 0.03928 ? r / 12.92 : pow((r + 0.055) / 1.055, 2.4).toDouble();
    final gl = g <= 0.03928 ? g / 12.92 : pow((g + 0.055) / 1.055, 2.4).toDouble();
    final bl = b <= 0.03928 ? b / 12.92 : pow((b + 0.055) / 1.055, 2.4).toDouble();
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
  }
  final l1 = luminance(foreground), l2 = luminance(background);
  final lighter = max(l1, l2), darker = min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
  // WCAG AA: >= 4.5 for normal text, >= 3.0 for large text
}
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "design_source": "figma_url | screenshot | verbal_spec",
  "target_platforms": ["android", "ios", "web", "macos", "windows"],
  "form_factors": ["phone", "tablet", "desktop", "foldable"],
  "theme_mode": "light_dark | dynamic_color | brand_seed",
  "seed_color": "#1A73E8",
  "animation_tier": "minimal | standard | rich",
  "accessibility_target": "WCAG_AA | WCAG_AAA",
  "components": ["adaptive_scaffold", "responsive_grid", "animated_list", "custom_chart", "bottom_sheet"]
}
```

### Output Contract
```json
{
  "theme": {
    "light": "Material 3 ColorScheme.fromSeed() with full token coverage",
    "dark": "Auto-generated dark variant from same seed",
    "text_theme": "Scaled typography with TextScaler support"
  },
  "layout": {
    "scaffold": "AdaptiveScaffold with breakpoint-driven navigation (bottom → rail → drawer)",
    "grid": "ResponsiveGrid with dynamic column counts per form factor",
    "foldable": "TwoPane hinge-aware layout for foldable devices"
  },
  "animations": {
    "implicit": "AnimatedContainer / AnimatedOpacity for state transitions",
    "explicit": "Staggered list entrance, Hero flight shuttles, custom painters",
    "performance": "All animations compositor-thread safe (Transform/Opacity only)"
  },
  "accessibility": {
    "semantics": "Full Semantics tree with labels, roles, and traits",
    "touch_targets": "Minimum 48x48dp interactive areas",
    "contrast": "Programmatic WCAG AA verification on all text/background pairs"
  },
  "testing": {
    "golden": "Alchemist golden tests for light/dark/responsive variants",
    "widget": "Key interaction widget tests with WidgetTester"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Hardcoded Pixel Dimensions**: Using `SizedBox(width: 375, height: 812)` or `Padding(padding: EdgeInsets.all(16))` everywhere instead of responsive `LayoutBuilder`, `FractionallySizedBox`, or spacing scale tokens.
- ❌ **Inline Color Literals**: Writing `Color(0xFF2196F3)` inside widgets instead of resolving from `Theme.of(context).colorScheme.primary`. Breaks dark mode, dynamic color, and brand theming in one stroke.
- ❌ **Layout-Triggering Animations**: Animating `width`, `height`, or `padding` via `AnimatedContainer` on complex subtrees causing `markNeedsLayout` every frame. Use `Transform.scale` / `Transform.translate` / `Opacity` for 60fps compositor-thread animations.
- ❌ **Single-Breakpoint Design**: Building only for phone (360-414dp) and shipping to tablet/desktop/foldable without testing. Use `AdaptiveScaffold` with explicit tablet and desktop bodies.
- ❌ **Missing Semantics on Custom Widgets**: Shipping `CustomPaint` or `GestureDetector` widgets without `Semantics` wrappers, making them invisible to TalkBack/VoiceOver screen readers.
- ❌ **God Build Method**: Placing 200+ lines of widget tree inside a single `build()` method instead of extracting reusable, testable widget components with clear single responsibilities.

---

## 6. Real-World Production Example

```markdown
**Task**: Build a responsive e-commerce product catalog with animated cards, adaptive navigation, and dark mode support.

**Phase 1 (Theme)**:
- Extracted brand seed color `#1A73E8` into `ColorScheme.fromSeed()`.
- Built `AppTheme.light()` and `AppTheme.dark()` with full Material 3 token coverage.
- Created `AppSpacing` scale (4/8/16/24/32/48) for consistent rhythm.

**Phase 2 (Layout)**:
- Implemented `AdaptiveScaffold` switching BottomNavigationBar (mobile) → NavigationRail (tablet) → permanent NavigationDrawer (desktop).
- Built `ResponsiveGrid` rendering 1 column (phone), 2 columns (tablet), 4 columns (desktop).
- Added foldable hinge detection for Samsung Fold dual-pane layout.

**Phase 3 (Animation)**:
- Product cards use `AnimatedContainer` for selection highlight with 300ms easeOutCubic.
- List entrance uses staggered `FadeTransition` + `SlideTransition` with 50ms per-item delay.
- Product detail uses `Hero` with custom `flightShuttleBuilder` for smooth card-to-fullscreen morph.
- Sparkline price chart rendered via `CustomPainter` with gradient fill.

**Phase 4 (Accessibility & QA)**:
- All product cards wrapped in `Semantics(label: ...)` with price and availability.
- Touch targets verified at minimum 48x48dp.
- Contrast ratio programmatically checked: all text/background pairs exceed WCAG AA 4.5:1.
- Golden tests captured for light, dark, mobile, tablet, and desktop variants.

**Outcome**: Shipped adaptive e-commerce catalog to Play Store, App Store, and Flutter Web. Zero visual regressions across 3 releases. Lighthouse accessibility score: 98/100.
```
