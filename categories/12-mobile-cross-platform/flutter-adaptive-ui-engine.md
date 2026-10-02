# Skill: Flutter Production UI Engineering Engine
`id`: `kbcodedev/flutter-adaptive-ui-engine`  
`category`: `12-mobile-cross-platform`  
`version`: `3.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building production-grade Flutter UIs with responsive multi-form-factor layouts (mobile, tablet, desktop, web, foldable), Material 3 dynamic theming, implicit/explicit animations, custom painting, desktop-native interactions (keyboard, hover, context menus, window management), and pixel-perfect design-to-code translation.
- **Triggers**: Design handoff (Figma → Flutter), responsive layout engineering, custom animation sequences, dark/light/dynamic color theming, desktop application UI (Windows/macOS/Linux), accessibility-compliant widget trees.
- **Prerequisites**: Dart 3+, Flutter 3.20+, Material 3 (`useMaterial3: true`), target device matrix (screen sizes, pixel ratios, platform conventions). For foldable support: `package:dual_screen` (^1.0.0). For desktop window management: `package:window_manager` (^0.4.0).

---

## 2. Core Mental Model & Invariant Principles
1. **Responsive-First Composition**: Never hardcode pixel dimensions. Compose layouts with `LayoutBuilder`, `MediaQuery`, `FractionallySizedBox`, and breakpoint-driven adaptive scaffolds that reshape from single-column mobile to multi-pane desktop without separate widget trees.
2. **Animation Performance Tiers**: `AnimatedContainer` and `AnimatedOpacity` are convenient for small/simple layout transitions on lightweight subtrees — but they DO trigger `markNeedsLayout` when layout-affecting properties (width, height, padding) change, so they are NOT compositor-thread-only. For large or complex subtrees where layout cost is high, prefer `Transform.scale` / `Transform.translate` / `Opacity` — these run entirely on the GPU compositor thread without triggering layout. Never claim `AnimatedContainer` is compositor-safe; choose the animation widget from the subtree complexity and the property being animated.
3. **Semantic Theming Over Magic Colors**: Every color, text style, elevation, and shape radius must resolve from `Theme.of(context).colorScheme` / `textTheme` — never from inline `Color(0xFF...)` literals. Dynamic color via `ColorScheme.fromSeed()` or platform `DynamicColorBuilder` adapts the entire app to wallpaper/brand with zero per-widget changes.
4. **UI Layer Purity (Architecture Boundary)**: UI components must contain ONLY presentation logic — widget composition, layout, animation, and theming. Never place business logic, API calls, database operations, authentication, navigation routing decisions, or state mutation logic inside widget `build()` methods or widget classes. The UI layer consumes state and emits user intents; it never owns or transforms domain data. This boundary holds regardless of state-management solution.
5. **State-Management Agnostic UI**: All UI widgets must be state-management agnostic. Widgets receive their data as constructor parameters or read it through a generic abstraction (a `ValueListenable`, a `Stream`, or a context-based lookup). The skill's patterns work identically whether the app uses Provider, Riverpod, Bloc/Cubit, ChangeNotifier, ValueNotifier, or signals — the UI layer never imports or depends on a specific state-management package directly in widget files.

---

## 3. High-Signal Execution Workflow

```
[Design Spec / Figma Handoff]
              │
              ▼
┌──────────────────────────────────────┐
│ Layer 1: DESIGN SYSTEM              │ ── ColorScheme, TextTheme, shape, elevation,
│          Theme Token Extraction      │    spacing scale, platform-adaptive tokens
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Layer 2: RESPONSIVE / ADAPTIVE      │ ── Breakpoint scaffold, adaptive navigation,
│          LAYOUT                      │    width-based grid, foldable hinge detection
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Layer 3: DESKTOP + MOBILE           │ ── Keyboard nav, hover states, context menus,
│          INTERACTION                 │    shortcuts, focus traversal, window mgmt,
│                                      │    scrollbars, drag-drop, touch targets
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Layer 4: ANIMATION + PERFORMANCE    │ ── Implicit vs explicit selection, compositor
│                                      │    safety, staggered lists, hero transitions,
│                                      │    custom painting, rebuild minimization
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Layer 5: ACCESSIBILITY + VISUAL QA  │ ── Semantics tree, WCAG contrast (all tiers),
│                                      │    golden tests, text scaling, screen readers
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ PRODUCTION VALIDATION GATE          │ ── Mandatory checklist before declaring
│                                      │    UI complete (see Section 7)
└──────────────────────────────────────┘
```

### Layer 1: Design System — Theme Token Extraction

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
      // Desktop: visible scrollbars, compact visual density
      scrollbarTheme: const ScrollbarThemeData(
        thumbVisibility: WidgetStatePropertyAll(true),
        thickness: WidgetStatePropertyAll(8),
      ),
      visualDensity: VisualDensity.adaptivePlatformDensity,
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
  // Standard spacing scale
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 16;
  static const double lg = 24;
  static const double xl = 32;
  static const double xxl = 48;

  // Desktop-compact variants (denser layouts for mouse/keyboard users)
  static const double desktopXs = 2;
  static const double desktopSm = 4;
  static const double desktopMd = 8;
  static const double desktopLg = 12;

  /// Dynamic spacing that scales with text scale factor
  static double scaled(BuildContext context, double base) =>
      base * MediaQuery.textScalerOf(context).scale(1.0).clamp(1.0, 1.5);

  /// Platform-aware spacing: compact on desktop, standard on mobile
  static double adaptive(BuildContext context, {required double mobile, required double desktop}) {
    final platform = Theme.of(context).platform;
    final isDesktop = platform == TargetPlatform.windows ||
        platform == TargetPlatform.macOS ||
        platform == TargetPlatform.linux;
    return isDesktop ? desktop : mobile;
  }
}
```

### Layer 2: Responsive / Adaptive Layout

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

**Width-Based Responsive Grid (dynamic column calculation)**:
```dart
// core/layout/responsive_grid.dart
class ResponsiveGrid extends StatelessWidget {
  final List<Widget> children;
  final double spacing;
  final double minItemWidth;
  final int maxColumns;
  final double? childAspectRatio;

  const ResponsiveGrid({
    super.key,
    required this.children,
    this.spacing = 16,
    this.minItemWidth = 200,
    this.maxColumns = 12,
    this.childAspectRatio,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) {
      // Dynamic column count from available width and minimum item width
      final availableWidth = constraints.maxWidth;
      final columns = ((availableWidth + spacing) / (minItemWidth + spacing))
          .floor()
          .clamp(1, maxColumns);

      // Derive aspect ratio from actual item width if not explicitly set
      final itemWidth = (availableWidth - (columns - 1) * spacing) / columns;
      final effectiveAspectRatio = childAspectRatio ?? (itemWidth / (itemWidth * 0.85));

      return GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: columns,
          crossAxisSpacing: spacing,
          mainAxisSpacing: spacing,
          childAspectRatio: effectiveAspectRatio,
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
// Requires: dual_screen ^1.0.0 (package:dual_screen)
// pubspec.yaml dependency: dual_screen: ^1.0.4
import 'package:dual_screen/dual_screen.dart';

Widget buildFoldableLayout(BuildContext context) {
  // dual_screen's TwoPane automatically detects hinge position
  // and splits the layout across the physical display fold.
  return TwoPane(
    startPane: const ListPane(),
    endPane: const DetailPane(),
    paneProportion: 0.5,
    // On non-foldable devices, TwoPane renders only startPane
    // unless the screen is wide enough for side-by-side.
  );
}

// Alternative: manual hinge detection without the package
Widget buildFoldableManual(BuildContext context) {
  final hinges = MediaQuery.displayFeaturesOf(context)
      .where((f) => f.type == DisplayFeatureType.hinge);
  if (hinges.isEmpty) return const SinglePaneLayout();

  final hinge = hinges.first;
  return Row(children: [
    SizedBox(width: hinge.bounds.left, child: const ListPane()),
    SizedBox(width: hinge.bounds.width), // gap for the physical hinge
    Expanded(child: const DetailPane()),
  ]);
}
```

### Layer 3: Desktop + Mobile Interaction

**Window Management (Windows/macOS/Linux)**:
```dart
// Requires: window_manager ^0.4.0
// pubspec.yaml dependency: window_manager: ^0.4.2
import 'package:window_manager/window_manager.dart';

Future<void> configureDesktopWindow() async {
  if (!(Platform.isWindows || Platform.isMacOS || Platform.isLinux)) return;

  await windowManager.ensureInitialized();
  const windowOptions = WindowOptions(
    size: Size(1280, 800),
    minimumSize: Size(800, 500),
    center: true,
    title: 'My App',
    // Windows: integrates with native title bar
    titleBarStyle: TitleBarStyle.normal,
  );
  await windowManager.waitUntilReadyToShow(windowOptions, () async {
    await windowManager.show();
    await windowManager.focus();
  });
}
```

**Keyboard Shortcuts & Focus Traversal**:
```dart
// Desktop keyboard shortcut registration
class AppShortcuts extends StatelessWidget {
  final Widget child;
  const AppShortcuts({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return CallbackShortcuts(
      bindings: {
        const SingleActivator(LogicalKeyboardKey.keyN, control: true): () =>
            _handleNewItem(context),
        const SingleActivator(LogicalKeyboardKey.keyS, control: true): () =>
            _handleSave(context),
        const SingleActivator(LogicalKeyboardKey.keyF, control: true): () =>
            _handleSearch(context),
        const SingleActivator(LogicalKeyboardKey.escape): () =>
            _handleEscape(context),
      },
      child: FocusTraversalGroup(
        policy: OrderedTraversalPolicy(),
        child: child,
      ),
    );
  }

  // Handlers emit intents — no business logic here (architecture boundary)
  void _handleNewItem(BuildContext context) { /* emit intent */ }
  void _handleSave(BuildContext context) { /* emit intent */ }
  void _handleSearch(BuildContext context) { /* emit intent */ }
  void _handleEscape(BuildContext context) { /* emit intent */ }
}
```

**Mouse Hover States & Context Menus**:
```dart
// Hover-aware card for desktop (mouse users)
class HoverCard extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final List<PopupMenuEntry<String>> Function(BuildContext)? contextMenuBuilder;

  const HoverCard({super.key, required this.child, this.onTap, this.contextMenuBuilder});

  @override
  State<HoverCard> createState() => _HoverCardState();
}

class _HoverCardState extends State<HoverCard> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    Widget card = MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        curve: Curves.easeOut,
        decoration: BoxDecoration(
          color: _isHovered
              ? colorScheme.surfaceContainerHigh
              : colorScheme.surfaceContainerLow,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: _isHovered ? colorScheme.outline : Colors.transparent,
          ),
        ),
        child: InkWell(
          onTap: widget.onTap,
          borderRadius: BorderRadius.circular(12),
          child: widget.child,
        ),
      ),
    );

    // Right-click context menu (desktop)
    if (widget.contextMenuBuilder != null) {
      card = ContextMenuRegion(
        contextMenuBuilder: (context, offset) {
          return AdaptiveTextSelectionToolbar.buttonItems(
            anchors: TextSelectionToolbarAnchors(primaryAnchor: offset),
            buttonItems: [
              ContextMenuButtonItem(label: 'Open', onPressed: widget.onTap),
              ContextMenuButtonItem(label: 'Copy Link', onPressed: () {}),
              ContextMenuButtonItem(label: 'Delete', onPressed: () {}),
            ],
          );
        },
        child: card,
      );
    }

    return card;
  }
}
```

**Drag & Drop (desktop file/widget drag)**:
```dart
// Draggable card with drop target
Draggable<String>(
  data: item.id,
  feedback: Material(
    elevation: 8,
    borderRadius: BorderRadius.circular(12),
    child: SizedBox(width: 200, child: ItemCard(item: item)),
  ),
  childWhenDragging: Opacity(opacity: 0.3, child: ItemCard(item: item)),
  child: ItemCard(item: item),
)

// Drop target zone
DragTarget<String>(
  onAcceptWithDetails: (details) => onItemDropped(details.data),
  builder: (context, candidateData, rejectedData) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      decoration: BoxDecoration(
        border: Border.all(
          color: candidateData.isNotEmpty
              ? Theme.of(context).colorScheme.primary
              : Colors.transparent,
          width: 2,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: dropZoneContent,
    );
  },
)
```

**Desktop Scrollbar & DPI Awareness**:
```dart
// Scrollbar is always visible on desktop (configured in theme above).
// For custom scroll views, wrap with Scrollbar explicitly:
Scrollbar(
  thumbVisibility: true,
  controller: _scrollController,
  child: ListView.builder(
    controller: _scrollController,
    itemCount: items.length,
    itemBuilder: (_, i) => ItemTile(item: items[i]),
  ),
)

// DPI/scaling: Flutter handles device pixel ratio automatically via
// MediaQuery.devicePixelRatioOf(context). For custom painting, always
// use logical pixels — Flutter's rendering engine scales to physical.
// Test at 100%, 125%, 150%, 200% scale factors on Windows/macOS.
```

### Layer 4: Animation + Performance

**Implicit Animations (small/simple layout transitions)**:
```dart
// AnimatedContainer is fine for small, lightweight subtrees.
// It DOES trigger markNeedsLayout when layout properties change —
// acceptable for simple cards, buttons, and small containers.
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
  child: content, // Keep this subtree small/cheap to layout
)

// For LARGE subtrees or performance-critical paths, use compositor-safe
// widgets that do NOT trigger layout:
// - Transform.scale / Transform.translate (position/size without layout)
// - Opacity / FadeTransition (visibility without layout)
// - ClipRect (clipping without layout)
// These run entirely on the GPU compositor thread at 60/120fps.
```

**Explicit Staggered List Animation**:
```dart
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
    // FadeTransition + SlideTransition are compositor-safe
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
import 'package:flutter/foundation.dart' show listEquals;

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
      // Deep list comparison — prevents unnecessary repaints when a new
      // list instance is created with identical values.
      !listEquals(old.data, data) ||
      old.lineColor != lineColor ||
      old.fillColor != fillColor;
}
```

### Layer 5: Accessibility + Visual QA

**Semantics & Accessibility**:
```dart
// Wrap interactive custom widgets with Semantics
Semantics(
  label: 'Order total: \$${total.toStringAsFixed(2)}',
  button: false,
  readOnly: true,
  child: CustomPaint(painter: SparklineChart(data: prices, lineColor: colorScheme.primary, fillColor: colorScheme.primary)),
)

// Ensure minimum touch targets (48x48 dp on mobile, 36x36 on desktop)
SizedBox(
  width: AppSpacing.adaptive(context, mobile: 48, desktop: 36),
  height: AppSpacing.adaptive(context, mobile: 48, desktop: 36),
  child: IconButton(
    icon: const Icon(Icons.close),
    onPressed: onDismiss,
    tooltip: 'Dismiss notification',  // always provide tooltip for icon buttons
  ),
)
```

**WCAG Contrast Verification (comprehensive)**:
```dart
import 'dart:math';

/// WCAG 2.1 contrast ratio calculator with tier-aware validation.
class ContrastChecker {
  /// Compute the contrast ratio between two colors (1:1 to 21:1).
  static double ratio(Color foreground, Color background) {
    final l1 = _relativeLuminance(foreground);
    final l2 = _relativeLuminance(background);
    final lighter = max(l1, l2), darker = min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  /// Check whether a pair meets the required WCAG tier.
  static bool meetsRequirement(Color fg, Color bg, ContrastTier tier) {
    return ratio(fg, bg) >= tier.minimumRatio;
  }

  static double _relativeLuminance(Color c) {
    double linearize(double channel) =>
        channel <= 0.03928 ? channel / 12.92 : pow((channel + 0.055) / 1.055, 2.4).toDouble();
    return 0.2126 * linearize(c.red / 255) +
        0.7152 * linearize(c.green / 255) +
        0.0722 * linearize(c.blue / 255);
  }
}

enum ContrastTier {
  /// Normal text (< 18pt regular, < 14pt bold): 4.5:1
  normalTextAA(4.5),
  /// Large text (>= 18pt regular, >= 14pt bold): 3.0:1
  largeTextAA(3.0),
  /// UI components, non-text contrast (icons, borders, focus rings): 3.0:1
  uiComponentAA(3.0),
  /// Normal text AAA (enhanced): 7.0:1
  normalTextAAA(7.0),
  /// Large text AAA (enhanced): 4.5:1
  largeTextAAA(4.5);

  final double minimumRatio;
  const ContrastTier(this.minimumRatio);
}

// Usage in tests or runtime validation:
// assert(ContrastChecker.meetsRequirement(
//   colorScheme.onSurface, colorScheme.surface, ContrastTier.normalTextAA));
//
// Verify these pairs for EVERY theme variant (light, dark, dynamic color):
// - onSurface / surface (body text)
// - onPrimary / primary (button text)
// - onPrimaryContainer / primaryContainer (chip/badge text)
// - onError / error (error messages)
// - outline / surface (borders, focus indicators)
//
// Disabled states: no minimum contrast required by WCAG, but ensure
// disabled controls are visually distinguishable from enabled ones.
//
// Focus indicators: must meet 3:0:1 against adjacent colors (WCAG 2.4.7).
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

  // Test at multiple form factors
  goldenTest('ProductCard responsive variants', fileName: 'product_card_responsive', builder: () {
    return GoldenTestGroup(children: [
      GoldenTestScenario(name: 'mobile_360', constraints: BoxConstraints.tight(const Size(360, 640)),
        child: const ProductCard(product: sampleProduct)),
      GoldenTestScenario(name: 'tablet_768', constraints: BoxConstraints.tight(const Size(768, 1024)),
        child: const ProductCard(product: sampleProduct)),
      GoldenTestScenario(name: 'desktop_1440', constraints: BoxConstraints.tight(const Size(1440, 900)),
        child: const ProductCard(product: sampleProduct)),
    ]);
  });

  // Test text scaling
  goldenTest('ProductCard text scaling', fileName: 'product_card_textscale', builder: () {
    return GoldenTestGroup(children: [
      GoldenTestScenario(name: 'scale_1.0', child: MediaQuery(
        data: const MediaQueryData(textScaler: TextScaler.linear(1.0)),
        child: const ProductCard(product: sampleProduct))),
      GoldenTestScenario(name: 'scale_1.5', child: MediaQuery(
        data: const MediaQueryData(textScaler: TextScaler.linear(1.5)),
        child: const ProductCard(product: sampleProduct))),
      GoldenTestScenario(name: 'scale_2.0', child: MediaQuery(
        data: const MediaQueryData(textScaler: TextScaler.linear(2.0)),
        child: const ProductCard(product: sampleProduct))),
    ]);
  });
}
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "design_source": "figma_url | screenshot | verbal_spec",
  "target_platforms": ["android", "ios", "web", "macos", "windows", "linux"],
  "form_factors": ["phone", "tablet", "desktop", "foldable"],
  "theme_mode": "light_dark | dynamic_color | brand_seed",
  "seed_color": "#1A73E8",
  "animation_tier": "minimal | standard | rich",
  "accessibility_target": "WCAG_AA | WCAG_AAA",
  "state_management": "provider | riverpod | bloc | changenotifier | valuenotifier | signals | none",
  "desktop_features": ["window_management", "keyboard_shortcuts", "context_menus", "drag_drop", "hover_states"],
  "components": ["adaptive_scaffold", "responsive_grid", "animated_list", "custom_chart", "bottom_sheet"]
}
```

### Output Contract
```json
{
  "theme": {
    "light": "Material 3 ColorScheme.fromSeed() with full token coverage",
    "dark": "Auto-generated dark variant from same seed",
    "text_theme": "Scaled typography with TextScaler support",
    "desktop_density": "Compact spacing and visible scrollbars for desktop"
  },
  "layout": {
    "scaffold": "AdaptiveScaffold with breakpoint-driven navigation (bottom → rail → drawer)",
    "grid": "ResponsiveGrid with width-based dynamic column calculation (not device-category fixed)",
    "foldable": "dual_screen TwoPane with hinge detection (explicit package dependency)"
  },
  "desktop": {
    "window": "window_manager with min/max size, title bar, DPI-aware",
    "keyboard": "CallbackShortcuts with Ctrl+N/S/F/Esc, FocusTraversalGroup",
    "mouse": "MouseRegion hover states, right-click ContextMenuRegion",
    "drag_drop": "Draggable/DragTarget with visual feedback",
    "scrollbars": "Always-visible scrollbars on desktop platforms"
  },
  "animations": {
    "implicit": "AnimatedContainer for small/simple subtrees (triggers layout — acceptable for lightweight widgets)",
    "compositor_safe": "Transform/Opacity/FadeTransition/SlideTransition for large subtrees (GPU-only, no layout)",
    "explicit": "Staggered list entrance, Hero flight shuttles, custom painters",
    "performance": "Animation widget chosen by subtree complexity, never by convenience"
  },
  "accessibility": {
    "semantics": "Full Semantics tree with labels, roles, and traits",
    "touch_targets": "48dp mobile / 36dp desktop minimum interactive areas",
    "contrast": "ContrastChecker with all WCAG tiers: normal text 4.5:1, large text 3:1, UI components 3:1, focus indicators 3:1, AAA 7:1/4.5:1",
    "disabled_states": "Visually distinguishable from enabled, no minimum contrast required",
    "dark_mode": "All contrast pairs verified in both light and dark themes",
    "dynamic_color": "Contrast re-verified when seed color changes"
  },
  "architecture": {
    "ui_purity": "Zero business logic, API calls, DB ops, or auth in widget layer",
    "state_agnostic": "UI receives data via constructor params or generic abstractions (ValueListenable/Stream/context lookup)",
    "composability": "No God build methods — extracted, testable widget components"
  },
  "testing": {
    "golden": "Alchemist golden tests for light/dark, mobile/tablet/desktop, text scaling variants",
    "widget": "Key interaction widget tests with WidgetTester",
    "contrast": "Programmatic ContrastChecker assertions on all theme color pairs"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Hardcoded Pixel Dimensions**: Using `SizedBox(width: 375, height: 812)` or `Padding(padding: EdgeInsets.all(16))` everywhere instead of responsive `LayoutBuilder`, `FractionallySizedBox`, or spacing scale tokens.
- ❌ **Inline Color Literals**: Writing `Color(0xFF2196F3)` inside widgets instead of resolving from `Theme.of(context).colorScheme.primary`. Breaks dark mode, dynamic color, and brand theming in one stroke.
- ❌ **Misunderstanding AnimatedContainer Performance**: Treating `AnimatedContainer` as compositor-safe. It triggers `markNeedsLayout` when layout-affecting properties change (width, height, padding, margin). Use it for small/simple subtrees; for large or complex subtrees, use `Transform` / `Opacity` which run on the GPU compositor thread without layout passes.
- ❌ **Fixed-Column Grids**: Hardcoding `crossAxisCount: 3` or mapping columns to device categories (mobile=1, tablet=2, desktop=3). Calculate columns dynamically from `(availableWidth + spacing) / (minItemWidth + spacing)` so the grid adapts to any window width including resized desktop windows.
- ❌ **Single-Breakpoint Design**: Building only for phone (360-414dp) and shipping to tablet/desktop/foldable without testing. Use `AdaptiveScaffold` with explicit tablet and desktop bodies.
- ❌ **Missing Semantics on Custom Widgets**: Shipping `CustomPaint` or `GestureDetector` widgets without `Semantics` wrappers, making them invisible to TalkBack/VoiceOver screen readers.
- ❌ **God Build Method**: Placing 200+ lines of widget tree inside a single `build()` method instead of extracting reusable, testable widget components with clear single responsibilities.
- ❌ **Business Logic in UI**: Placing API calls, database queries, authentication checks, or state mutation inside widget `build()` methods or event handlers. The UI layer emits intents and consumes state — it never owns domain logic.
- ❌ **State-Management Lock-in**: Importing `package:bloc`, `package:riverpod`, or `package:provider` directly inside widget files. Widgets should receive data through constructor parameters or generic abstractions, keeping the UI layer portable across state-management solutions.
- ❌ **Shallow List Equality in shouldRepaint**: Using `old.data != data` for `List` properties in `CustomPainter.shouldRepaint()`. Dart's `!=` on lists checks reference identity, not deep equality — use `listEquals()` from `package:flutter/foundation.dart` to avoid unnecessary repaints when a new list instance contains identical values.
- ❌ **Desktop-Blind UI**: Shipping to Windows/macOS/Web without keyboard shortcuts, hover states, visible scrollbars, context menus, focus traversal, or window size constraints. Desktop users expect mouse+keyboard-first interaction, not touch-first.
- ❌ **Contrast-Checking Only Body Text**: Verifying only `onSurface/surface` contrast and ignoring large text (3:1), UI components/borders (3:1), focus indicators (3:1), and dark mode / dynamic color variants.

---

## 6. Real-World Production Example

```markdown
**Task**: Build a responsive e-commerce product catalog with animated cards, adaptive navigation, desktop support, and dark mode.

**Layer 1 (Design System)**:
- Extracted brand seed color `#1A73E8` into `ColorScheme.fromSeed()`.
- Built `AppTheme.light()` and `AppTheme.dark()` with full Material 3 token coverage.
- Created `AppSpacing` scale with desktop-compact variants for denser layouts.
- Configured visible scrollbars and `VisualDensity.adaptivePlatformDensity`.

**Layer 2 (Responsive Layout)**:
- Implemented `AdaptiveScaffold` switching BottomNavigationBar (mobile) → NavigationRail (tablet) → permanent NavigationDrawer (desktop).
- Built `ResponsiveGrid` with `minItemWidth: 240` — dynamically calculates 1 column (phone), 2-3 columns (tablet), 4-6 columns (desktop) from actual available width.
- Added `dual_screen` TwoPane for Samsung Fold / Pixel Fold dual-pane layout.

**Layer 3 (Desktop + Mobile Interaction)**:
- Configured `window_manager` with minimum 800x500, default 1280x800.
- Added `CallbackShortcuts` for Ctrl+N (new), Ctrl+S (save), Ctrl+F (search), Escape (dismiss).
- Built `HoverCard` with `MouseRegion` hover highlight and right-click `ContextMenuRegion`.
- Implemented `Draggable`/`DragTarget` for product reordering.
- `FocusTraversalGroup` with `OrderedTraversalPolicy` for Tab-key navigation.

**Layer 4 (Animation + Performance)**:
- Product cards use `AnimatedContainer` for selection highlight (small subtree, layout cost acceptable).
- Product list entrance uses staggered `FadeTransition` + `SlideTransition` (compositor-safe, no layout).
- Product detail uses `Hero` with custom `flightShuttleBuilder` for smooth card-to-fullscreen morph.
- Sparkline chart via `CustomPainter` with `listEquals` in `shouldRepaint` — zero unnecessary repaints.

**Layer 5 (Accessibility + Visual QA)**:
- All product cards wrapped in `Semantics(label: ...)` with price and availability.
- Touch targets: 48dp mobile, 36dp desktop.
- `ContrastChecker` assertions on all 8 theme color pairs in both light and dark modes.
- Focus indicators verified at 3:1 contrast against adjacent colors.
- Golden tests captured for light, dark, mobile (360), tablet (768), desktop (1440), and text scale 1.0/1.5/2.0.

**Production Validation Gate**: All 17 checks passed (see Section 7).

**Outcome**: Shipped adaptive e-commerce catalog to Play Store, App Store, Flutter Web, and Windows (MSIX). Zero visual regressions across 5 releases. Lighthouse accessibility score: 98/100.
```

---

## 7. Production Validation Gate

**Before declaring UI complete, every item must pass:**

| # | Check | Verified |
|---|-------|----------|
| 1 | No hardcoded responsive dimensions (no magic pixel values) | ☐ |
| 2 | No unnecessary layout-triggering animations on complex subtrees | ☐ |
| 3 | Theme tokens used consistently (zero inline `Color(0xFF...)` literals) | ☐ |
| 4 | Mobile tested (360-414dp) | ☐ |
| 5 | Tablet tested (600-1200dp) | ☐ |
| 6 | Desktop tested (1200dp+) | ☐ |
| 7 | Window resize tested (drag window edges, verify no overflow) | ☐ |
| 8 | Keyboard navigation tested (Tab, Shift+Tab, Enter, Escape, shortcuts) | ☐ |
| 9 | Mouse hover states tested (hover highlight, cursor changes) | ☐ |
| 10 | Accessibility tested (TalkBack/VoiceOver, Semantics tree) | ☐ |
| 11 | Dark mode tested (all contrast pairs verified) | ☐ |
| 12 | Text scaling tested (1.0x, 1.5x, 2.0x — no overflow, no clipping) | ☐ |
| 13 | Golden / visual regression tests added | ☐ |
| 14 | No God widgets (no `build()` method > 80 lines) | ☐ |
| 15 | No business logic inside UI layer | ☐ |
| 16 | No analyzer errors (`dart analyze` clean) | ☐ |
| 17 | No overflow errors (checked in debug mode with `debugPaintSizeEnabled`) | ☐ |
| 18 | No unnecessary rebuilds (verified with `debugPrintRebuildDirtyWidgets`) | ☐ |
