# Skill: CMO Growth Loops, Programmatic SEO & Funnel Engine
`id`: `kbcodedev/cmo-growth-loops-technical-seo`  
`category`: `15-c-suite-executive-advisory`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Designing self-sustaining viral growth loops, programmatic SEO architectures (generating 10,000+ indexable high-intent landing pages), conversion rate optimization (CRO), and technical Core Web Vitals SEO audits.
- **Triggers**: Growth strategy planning, organic search traffic acquisition, user referral loop engineering, programmatic landing page generation.
- **Prerequisites**: Programmatic database datasets, Next.js dynamic routing, schema.org structured JSON-LD data.

---

## 2. Core Mental Model & Invariant Principles
1. **Growth Loops Over Linear Funnels**: Linear funnels (Paid Ads $\rightarrow$ Landing Page $\rightarrow$ User) stop when you stop paying. Growth loops (User creates artifact $\rightarrow$ Artifact indexed on Google / shared with colleague $\rightarrow$ New User signs up) compound organically.
2. **Programmatic SEO (pSEO) with High Information Gain**: Generating programmatic pages requires unique dataset value (charts, calculations, real benchmarks)—never generate spammy boilerplate keyword-stuffed pages.
3. **Core Web Vitals Rigor**: LCP (Largest Contentful Paint) $< 2.5\text{s}$, INP (Interaction to Next Paint) $< 200\text{ms}$, CLS (Cumulative Layout Shift) $< 0.1$.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Proprietary Dataset / Public API (e.g. 5,000 Tech Stacks)]
                            │
                            ▼
┌───────────────────────────────────────────────────────────┐
│ Step 1: Programmatic Keyword Taxonomy (e.g. "X vs Y Stack")│
└───────────────────────────┬───────────────────────────────┘
                            ▼
┌───────────────────────────────────────────────────────────┐
│ Step 2: Next.js Dynamic Template Engine + Static Generation│
└───────────────────────────┬───────────────────────────────┘
                            ▼
┌───────────────────────────────────────────────────────────┐
│ Step 3: Schema.org JSON-LD Structured Data Injection      │
└───────────────────────────┬───────────────────────────────┘
                            ▼
┌───────────────────────────────────────────────────────────┐
│ Step 4: Built-in Viral Product Loop CTA                   │
└───────────────────────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "dataset": "PostgreSQL vs MySQL vs SQLite database benchmark comparisons",
  "total_variants": 120,
  "goal": "Capture high-intent 'X vs Y database performance' developer search queries"
}
```

### Output Contract
```tsx
// app/compare/[dbA]-vs-[dbB]/page.tsx - Programmatic SEO Template
import { Metadata } from 'next';
import { getBenchmarkData } from '@/lib/benchmarks';

export async function generateMetadata({ params }: { params: { dbA: string; dbB: string } }): Promise<Metadata> {
  const title = `${params.dbA.toUpperCase()} vs ${params.dbB.toUpperCase()} Performance Benchmarks (2026)`;
  const description = `In-depth latency, throughput, and memory comparison between ${params.dbA} and ${params.dbB} with real query benchmarks.`;

  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
    alternates: { canonical: `https://example.com/compare/${params.dbA}-vs-${params.dbB}` }
  };
}

export default async function ComparisonPage({ params }: { params: { dbA: string; dbB: string } }) {
  const data = await getBenchmarkData(params.dbA, params.dbB);

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${params.dbA} vs ${params.dbB} Architectural Comparison`,
    datePublished: '2026-10-02T00:00:00Z',
    author: { '@type': 'Organization', name: 'Database Performance Labs' }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
        {params.dbA.toUpperCase()} vs {params.dbB.toUpperCase()}: Real-World Performance Analysis
      </h1>
      {/* Dynamic Benchmark Data Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-800 text-white">
          <h2 className="text-lg font-bold">{params.dbA} Latency</h2>
          <p className="text-3xl font-extrabold text-indigo-400">{data.dbALatency}ms</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800 text-white">
          <h2 className="text-lg font-bold">{params.dbB} Latency</h2>
          <p className="text-3xl font-extrabold text-indigo-400">{data.dbBLatency}ms</p>
        </div>
      </div>
      {/* Viral CTA Loop */}
      <div className="mt-12 p-6 rounded-2xl bg-indigo-600 text-white text-center">
        <h3 className="text-xl font-bold">Benchmark Your Own Database in 60 Seconds</h3>
        <button className="mt-4 px-6 py-3 rounded-lg bg-white text-indigo-600 font-bold hover:bg-slate-100">
          Run Free Cloud Benchmark
        </button>
      </div>
    </main>
  );
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Thin Doorway Pages**: Generating 10,000 pages with only a city name swapped in text, triggering Google Helpful Content algorithmic penalties.
- ❌ **Ignoring Canonical URLs**: Failing to set `<link rel="canonical">`, creating duplicate content penalties across query parameter variations.
- ❌ **Missing Organic Loop**: Getting 100,000 visitors to a blog post with zero interactive tool or clear sign-up incentive.

---

## 6. Real-World Production Example

```markdown
**pSEO Growth Engine**:
- Built 4,200 programmatic comparison pages using verified database latency data.
- Organic monthly search visitors grew from 2,500 to 180,000 in 5 months, generating 1,400 qualified trial signups monthly.
```
