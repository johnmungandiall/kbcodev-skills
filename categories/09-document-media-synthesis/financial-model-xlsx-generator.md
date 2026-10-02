# Skill: Financial Modeling & XLSX Spreadsheet Synthesis
`id`: `kbcodedev/financial-model-xlsx-generator`  
`category`: `09-document-media-synthesis`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Programmatically generating Excel (.xlsx) financial models, DCF valuations, unit economics spreadsheets, and SaaS metrics with dynamic formulas, conditional formatting, and auto-fit column widths using `exceljs` or `openpyxl`.
- **Triggers**: Financial report generation, SaaS KPI modeling, automated accounting exports, budget forecast synthesis.
- **Prerequisites**: Node.js `exceljs` or Python `openpyxl`.

---

## 2. Core Mental Model & Invariant Principles
1. **Dynamic Formulas Over Static Hardcoding**: Never write hardcoded calculated values into summary cells; always write active Excel formulas (`=SUM(B4:B12)`, `=B13/B3`, `=NPV(0.1, C4:G4)`).
2. **Standard Financial Number Formatting**: Format currencies explicitly (`$#,##0` or `$#,##0.00`), percentages (`0.0%`), and negative numbers in parentheses `($#,##0)`.
3. **Clean Visual Hierarchy**: Apply dark navy header rows (`#1E293B`), white bold text, subtle cell gridlines, and bold total rows with top/double-bottom accounting borders.

---

## 3. High-Signal Execution Workflow

```
[Financial Assumptions & Revenue Data]
                  │
                  ▼
┌─────────────────────────────────┐
│ Step 1: Initialize Workbook     │ ── Create Sheet, Set Gridlines, Define Number Formats
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 2: Render Header & Labels  │ ── Column Headers, Row Titles, Time Periods (Q1-Q4)
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 3: Insert Dynamic Formulas │ ── Revenue, COGS, Gross Profit, Operating Expenses
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 4: Format Accounting Cells │ ── Currency, Percentages, Double-Underline Totals
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 5: Auto-Fit Column Widths  │ ── Calculate max char length per column + padding
└─────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "model_name": "SaaS Unit Economics & Gross Margin Forecast",
  "periods": ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"],
  "data": {
    "subscribers": [1000, 1400, 1900, 2600],
    "arpu": 49,
    "hosting_cost_per_sub": 6,
    "support_cost_per_sub": 4
  }
}
```

### Output Contract
```typescript
import ExcelJS from 'exceljs';

export async function generateSaaSFinancialModel(outputPath: string) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Unit Economics', { views: [{ showGridLines: true }] });

  // 1. Header Styling
  sheet.columns = [
    { header: 'Metric', key: 'metric', width: 32 },
    { header: 'Q1 2026', key: 'q1', width: 16 },
    { header: 'Q2 2026', key: 'q2', width: 16 },
    { header: 'Q3 2026', key: 'q3', width: 16 },
    { header: 'Q4 2026', key: 'q4', width: 16 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11, name: 'Arial' };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

  // 2. Data Rows
  sheet.addRow(['Active Subscribers', 1000, 1400, 1900, 2600]);
  sheet.addRow(['Average Revenue Per User (ARPU)', 49, 49, 49, 49]);

  // Row 4: Total Revenue (Dynamic Formula)
  sheet.addRow([
    'Total Subscription Revenue',
    { formula: 'B2*B3' },
    { formula: 'C2*C3' },
    { formula: 'D2*D3' },
    { formula: 'E2*E3' },
  ]);

  sheet.addRow(['Hosting Infrastructure Cost', { formula: 'B2*6' }, { formula: 'C2*6' }, { formula: 'D2*6' }, { formula: 'E2*6' }]);
  sheet.addRow(['Customer Support Cost', { formula: 'B2*4' }, { formula: 'C2*4' }, { formula: 'D2*4' }, { formula: 'E2*4' }]);

  // Row 7: Gross Profit (Dynamic Formula)
  sheet.addRow([
    'Gross Profit',
    { formula: 'B4-(B5+B6)' },
    { formula: 'C4-(C5+C6)' },
    { formula: 'D4-(D5+D6)' },
    { formula: 'E4-(E5+E6)' },
  ]);

  // Row 8: Gross Margin % (Dynamic Formula)
  sheet.addRow([
    'Gross Margin %',
    { formula: 'B7/B4' },
    { formula: 'C7/C4' },
    { formula: 'D7/D4' },
    { formula: 'E7/E4' },
  ]);

  // 3. Format Numbers
  [2].forEach(rowIdx => sheet.getRow(rowIdx).numFmt = '#,##0');
  [3, 4, 5, 6, 7].forEach(rowIdx => sheet.getRow(rowIdx).numFmt = '$#,##0');
  [8].forEach(rowIdx => sheet.getRow(rowIdx).numFmt = '0.0%');

  // Highlight Summary Row (Gross Profit)
  const grossProfitRow = sheet.getRow(7);
  grossProfitRow.font = { bold: true };
  grossProfitRow.border = {
    top: { style: 'thin' },
    bottom: { style: 'double' }, // Accounting double underline
  };

  await workbook.xlsx.writeFile(outputPath);
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Hardcoded Calculation Values**: Writing static numbers like `49000` into Excel instead of dynamic formula `=B2*B3`.
- ❌ **Missing Column Width Auto-Fitting**: Leaving columns at default width causing `###` overflow errors for large currency numbers.
- ❌ **Missing Number Formatting**: Leaving raw unformatted floats (`0.7959183673469388`) instead of formatted percentages (`79.6%`).

---

## 6. Real-World Production Example

```markdown
**Automated SaaS Financial Forecast**:
- Generated a 3-year multi-scenario (Base, Bull, Bear) model with dynamic discount rate sensitivity tables. Excel formulas auto-recalculated instantly when changing assumption inputs.
```
