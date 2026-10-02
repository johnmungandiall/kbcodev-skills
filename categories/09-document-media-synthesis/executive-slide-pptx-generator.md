# Skill: Executive Presentation Slide Deck (PPTX) Synthesis
`id`: `kbcodedev/executive-slide-pptx-generator`  
`category`: `09-document-media-synthesis`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring clean, executive-ready PowerPoint (.pptx) presentation decks, investor pitch decks, product launches, and technical review slides.
- **Triggers**: Pitch deck creation, board meeting presentations, technical slide generation, automated PPTX export.
- **Prerequisites**: Node.js `pptxgenjs` or Python `python-pptx`.

---

## 2. Core Mental Model & Invariant Principles
1. **One Core Idea Per Slide**: Never overcrowd slides with 5 competing paragraphs. Use 1 bold takeaway, 3 supporting metric columns, or 1 clear comparison chart.
2. **High-Contrast 16:9 Widescreen Layout**: Always design for standard 16:9 widescreen (`13.33 x 7.5 inches`) with dark or light solid background themes.
3. **Visual Card Grid Structure**: Organize slide information into distinct visual cards with clear headings, metric callouts, and icon anchors.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Slide Deck Outline & Key Metrics]
                 │
                 ▼
┌────────────────────────────────┐
│ Step 1: Initialize 16:9 Deck   │ ── Set Master Slide layout, brand colors, fonts
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 2: Title Slide Layout     │ ── Hero title, subtitle, presenter metadata
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 3: Multi-Column Cards     │ ── 3-column structured takeaways with stat callouts
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 4: Export PPTX File       │ ── pptx.writeFile({ fileName: 'deck.pptx' })
└────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "deck_title": "Q4 Engineering Velocity & AI Modernization",
  "slides": [
    {
      "title": "Key Accomplishments",
      "cards": [
        { "header": "CI Build Speed", "stat": "8.8x", "detail": "Reduced build time from 7m40s to 52s" },
        { "header": "Test Coverage", "stat": "94%", "detail": "Added 350 integration test cases" },
        { "header": "Cloud Spend", "stat": "-32%", "detail": "Optimized K8s resource requests" }
      ]
    }
  ]
}
```

### Output Contract
```typescript
import pptxgen from "pptxgenjs";

export async function generateExecutiveDeck() {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9"; // 13.33 x 7.5 inches

  // Slide 1: Dark Executive Title Slide
  const slide1 = pptx.addSlide();
  slide1.background = { color: "0F172A" }; // Slate 900

  slide1.addText("Q4 Engineering Velocity", {
    x: 1.0, y: 2.5, w: 11.3, h: 1.2,
    fontSize: 44, fontFace: "Arial", color: "FFFFFF", bold: true
  });
  slide1.addText("Infrastructure & AI Modernization Results", {
    x: 1.0, y: 3.8, w: 11.3, h: 0.8,
    fontSize: 22, fontFace: "Arial", color: "94A3B8"
  });

  // Slide 2: 3-Column Card Metric Grid
  const slide2 = pptx.addSlide();
  slide2.background = { color: "F8FAFC" };

  slide2.addText("Key Accomplishments & Performance ROI", {
    x: 0.8, y: 0.6, w: 11.7, h: 0.8,
    fontSize: 28, fontFace: "Arial", color: "0F172A", bold: true
  });

  const cards = [
    { title: "CI Build Speed", stat: "8.8x", desc: "Reduced build time from 7m40s to 52s" },
    { title: "Test Coverage", stat: "94%", desc: "Added 350 integration test cases" },
    { title: "Cloud Spend", stat: "-32%", desc: "Optimized K8s resource requests" },
  ];

  cards.forEach((card, idx) => {
    const xPos = 0.8 + idx * 4.0;
    // Card Background Shape
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 1.8, w: 3.6, h: 4.8,
      fill: { color: "FFFFFF" },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.15
    });

    // Card Header
    slide2.addText(card.title, {
      x: xPos + 0.3, y: 2.2, w: 3.0, h: 0.5,
      fontSize: 16, fontFace: "Arial", color: "64748B", bold: true
    });

    // Giant Metric Callout
    slide2.addText(card.stat, {
      x: xPos + 0.3, y: 2.8, w: 3.0, h: 1.2,
      fontSize: 48, fontFace: "Arial", color: "4F46E5", bold: true
    });

    // Detail Description
    slide2.addText(card.desc, {
      x: xPos + 0.3, y: 4.2, w: 3.0, h: 1.5,
      fontSize: 14, fontFace: "Arial", color: "334155"
    });
  });

  await pptx.writeFile({ fileName: "Q4_Engineering_Executive_Deck.pptx" });
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Wall of Text Bullet Points**: Filling an entire slide with 12-point text bullets that no one in an executive meeting can read.
- ❌ **Clashing Wild Color Schemes**: Using 8 different bright neon colors instead of a cohesive 2-color brand palette.
- ❌ **Low Resolution Bitmaps**: Pasting blurry pixelated screenshots instead of vector shapes or crisp data cards.

---

## 6. Real-World Production Example

```markdown
**Board Meeting Deck Generation**:
- Generated a 10-slide board presentation from live PostgreSQL metrics in 1.4 seconds.
- Clean typography and 3-card metric layouts allowed founders to present directly without manual redesign.
```
