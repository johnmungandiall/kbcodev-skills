# Skill: Typographic PDF Generation & Print Layout
`id`: `kbcodedev/typographic-pdf-generator`  
`category`: `09-document-media-synthesis`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Generating crisp, print-ready, typographically beautiful PDF invoices, technical whitepapers, financial reports, and certificates using Puppeteer/Chromium or WeasyPrint.
- **Triggers**: PDF generation, invoice rendering, report export, certificate generation.
- **Prerequisites**: HTML/CSS paged media (`@page`), Chromium headless print driver or Typst/WeasyPrint.

---

## 2. Core Mental Model & Invariant Principles
1. **CSS Paged Media Mastery**: Use `@page { size: A4; margin: 20mm; @bottom-right { content: counter(page); } }` for deterministic print pagination.
2. **Page-Break Control**: Use `break-inside: avoid` on cards, tables, and callouts to prevent awkward cuts across page boundaries.
3. **Web Fonts & Vector Assets**: Embed SVG icons and licensed web fonts (Inter, Roboto Mono) as base64 data URIs to ensure 100% reliable offline rendering.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[HTML + CSS Template with Paged Media]
                  │
                  ▼
┌─────────────────────────────────┐
│ Step 1: Base64 Embed Assets     │ ── Fonts, Logos, SVG Icons into single HTML string
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 2: Configure @page Rules   │ ── Size (A4/Letter), margins, header/footer zones
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 3: Prevent Page Breaks     │ ── Apply break-inside: avoid on cards and table rows
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 4: Chromium Print-to-PDF   │ ── page.pdf({ printBackground: true, format: 'A4' })
└─────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "invoice_number": "INV-2026-0042",
  "client_name": "Acme Global Industries",
  "items": [
    { "description": "Cloud Architecture Consultation", "hours": 20, "rate": 250, "total": 5000 },
    { "description": "Kubernetes Security Hardening", "hours": 15, "rate": 250, "total": 3750 }
  ],
  "total_amount": "$8,750.00"
}
```

### Output Contract
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 15mm 20mm;
      @bottom-right {
        content: "Page " counter(page) " of " counter(pages);
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #94a3b8;
      }
    }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      color: #0f172a;
      line-height: 1.5;
      font-size: 10pt;
      margin: 0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 15px;
      margin-bottom: 30px;
    }
    .invoice-title { font-size: 24pt; font-weight: 800; color: #4f46e5; }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .table th {
      background: #f8fafc;
      text-align: left;
      padding: 10px;
      border-bottom: 2px solid #cbd5e1;
      font-size: 9pt;
      text-transform: uppercase;
    }
    .table td {
      padding: 12px 10px;
      border-bottom: 1px solid #e2e8f0;
    }
    .table tr { break-inside: avoid; }
    .total-box {
      float: right;
      width: 250px;
      background: #f1f5f9;
      padding: 15px;
      border-radius: 8px;
      text-align: right;
      break-inside: avoid;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="invoice-title">INVOICE</div>
      <div><strong>Invoice #:</strong> INV-2026-0042</div>
      <div><strong>Date:</strong> October 2, 2026</div>
    </div>
    <div style="text-align: right;">
      <strong>Billed To:</strong><br>
      Acme Global Industries<br>
      Attn: Accounts Payable
    </div>
  </div>

  <table class="table">
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: center;">Hours</th>
        <th style="text-align: right;">Rate</th>
        <th style="text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Cloud Architecture Consultation</td>
        <td style="text-align: center;">20</td>
        <td style="text-align: right;">$250.00</td>
        <td style="text-align: right;">$5,000.00</td>
      </tr>
      <tr>
        <td>Kubernetes Security Hardening</td>
        <td style="text-align: center;">15</td>
        <td style="text-align: right;">$250.00</td>
        <td style="text-align: right;">$3,750.00</td>
      </tr>
    </tbody>
  </table>

  <div class="total-box">
    <div style="font-size: 11pt; color: #64748b;">Total Due:</div>
    <div style="font-size: 20pt; font-weight: 800; color: #4f46e5;">$8,750.00</div>
  </div>
</body>
</html>
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Missing `printBackground: true`**: Generating PDFs in headless Chrome where background colors and header shading vanish.
- ❌ **Page Break in Table Rows**: Omitting `break-inside: avoid` on table rows, splitting text sentences across page breaks.
- ❌ **External CDN Assets in Offline Pipelines**: Linking to `https://fonts.googleapis.com` in secure backend PDF workers without internet access.

---

## 6. Real-World Production Example

```markdown
**Automated Invoice Engine**:
- Renders HTML template with embedded vector CSS -> Puppeteer converts to PDF in 280ms -> Stored in S3 with secure pre-signed download link.
```
