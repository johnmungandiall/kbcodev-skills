# Skill: Programmatic DOCX Document Synthesis
`id`: `kbcodedev/programmatic-docx-generator`  
`category`: `09-document-media-synthesis`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Programmatically generating polished, executive-ready Word (.docx) documents with styled headers, custom typography, callout boxes, tables, and page numbering using `docx` (Node.js/Python).
- **Triggers**: Automated report synthesis, contract generation, executive whitepapers, technical documentation exports.
- **Prerequisites**: Node.js `docx` package or Python `python-docx`.

---

## 2. Core Mental Model & Invariant Principles
1. **Typographic Hierarchy & Consistency**: Use consistent font pairings (e.g. Arial / Calibri or Aptos / Aptos Display), explicit heading sizes, and standardized line spacing (1.15x - 1.25x).
2. **Structured Tables with Explicit Column Widths**: Always specify percentage-based or exact point widths on table cells with zebra striping and bold header rows.
3. **Callout Boxes for High-Density Signal**: Wrap executive summaries, warnings, and key takeaways in colored border callout tables.

---

## 3. High-Signal Execution Workflow

```
[Markdown / Structured Document Content]
                    │
                    ▼
┌───────────────────────────────────────┐
│ Step 1: Define Document Theme Tokens  │ ── Colors, Heading Fonts, Margins (1 inch)
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Step 2: Build Cover Page & Headers    │ ── Title, Subtitle, Metadata, Header/Footer
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Step 3: Render Sections & Callouts    │ ── Headings, Paragraphs, Callout Panels
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Step 4: Generate Styled Data Tables   │ ── Header row shading, borders, alignment
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Step 5: Export Buffer & Save File     │ ── Packer.toBuffer() -> Write to disk
└───────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "title": "Cloud Infrastructure Security Audit Q3",
  "author": "SecOps Team",
  "summary": "Full review of AWS production environment and SOC2 readiness",
  "findings": [
    { "id": "SEC-01", "severity": "High", "finding": "Public S3 bucket detected", "remediation": "Enable block public access" },
    { "id": "SEC-02", "severity": "Low", "finding": "TLS 1.1 enabled on legacy endpoint", "remediation": "Deprecate TLS 1.1" }
  ]
}
```

### Output Contract
```typescript
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle } from "docx";
import * as fs from "fs";

export async function generateSecurityAuditDocx(data: any, outputPath: string) {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 22, color: "1E293B" }, // 11pt
        },
      },
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }, // 1 inch
        },
        children: [
          new Paragraph({
            text: data.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Author: ${data.author} | Date: ${new Date().toLocaleDateString()}`, italics: true, color: "64748B" }),
            ],
            spacing: { after: 400 },
          }),
          // Callout Box (Executive Summary)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "F1F5F9" },
                    margins: { top: 200, bottom: 200, left: 200, right: 200 },
                    borders: {
                      left: { style: BorderStyle.SINGLE, size: 24, color: "4F46E5" },
                      top: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Executive Summary: ", bold: true }),
                          new TextRun(data.summary),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: "Detailed Audit Findings", heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
          // Findings Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: ["ID", "Severity", "Finding", "Remediation"].map(header => 
                  new TableCell({
                    shading: { fill: "1E293B" },
                    children: [new Paragraph({ children: [new TextRun({ text: header, bold: true, color: "FFFFFF" })] })],
                  })
                ),
              }),
              ...data.findings.map((f: any) => 
                new TableRow({
                  children: [f.id, f.severity, f.finding, f.remediation].map(val => 
                    new TableCell({
                      margins: { top: 100, bottom: 100, left: 100, right: 100 },
                      children: [new Paragraph({ text: val })],
                    })
                  ),
                })
              ),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Unstyled Default Word Output**: Generating bare text paragraphs with no headers, standard margins, or table borders.
- ❌ **Overlapping Table Cells**: Omitting `width: { type: WidthType.PERCENTAGE }` causing table columns to collapse or overflow margins.
- ❌ **Hardcoded Raw RGB Strings with Hash**: Passing `"#1E293B"` to `docx` instead of `"1E293B"` (without hash).

---

## 6. Real-World Production Example

```markdown
**Automated Weekly Billing Report**:
- Node.js cron job executes `generateAuditDocx()` aggregating AWS cost anomalies.
- Generates a beautifully formatted 4-page DOCX with executive callouts and sends via email to CTO every Monday at 08:00 UTC.
```
