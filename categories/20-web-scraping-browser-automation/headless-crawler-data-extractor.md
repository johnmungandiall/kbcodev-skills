# Skill: High-Concurrency Web Crawler & Data Extractor
`id`: `kbcodedev/headless-crawler-data-extractor`  
`category`: `20-web-scraping-browser-automation`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building distributed, high-concurrency web crawling pipelines, recursive link traversal, DOM parsing with Cheerio / Playwright, rate limiting, and structured JSON extraction.
- **Triggers**: Large-scale web scraping (>100k pages), sitemap crawling, data lake ingestion from public web catalogs.
- **Prerequisites**: Target website sitemap / URL patterns, robots.txt compliance rules, extraction schema.

---

## 2. Core Mental Model & Invariant Principles
1. **HTTP First, Browser Only When Necessary**: 90% of web data can be scraped 50x faster using lightweight HTTP requests (`axios` / `undici`) parsed with `cheerio` rather than launching heavy Chromium browser instances. Use headless browsers only for client-side SPAs.
2. **Domain-Level Rate Limiting & Politeness**: Respect domain rate limits using token buckets (e.g. max 5 req/sec per target host) to prevent server throttling and IP bans.
3. **Deduplication via URL Normalization & Bloom Filters**: Normalize URLs (strip tracking query params like `utm_*`, sort query keys) and maintain an in-memory Bloom filter to prevent crawling the same page twice.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Seed URLs / Sitemap XML]
            │
            ▼
┌───────────────────────────┐
│ Step 1: URL Normalizer &  │ ── Strip utm_*, canonicalize, Bloom filter check
│         Queue Ingestion   │
└───────────┬───────────────┘
            ▼
┌───────────────────────────┐
│ Step 2: HTTP Fast Fetch   │ ── Undici HTTP client with connection pooling & retry
└───────────┬───────────────┘
            ▼
┌───────────────────────────┐
│ Step 3: Cheerio DOM Parse │ ── Extract structured fields + discover new links
└───────────┬───────────────┘
            ▼
┌───────────────────────────┐
│ Step 4: Stream to Parquet │ ── Flush batch of 1,000 records to disk/S3
└───────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "seed_urls": ["https://news.example.com/sitemap.xml"],
  "concurrency": 20,
  "max_depth": 2,
  "extract_schema": { "title": "h1", "body": "article", "author": ".author-name" }
}
```

### Output Contract
```typescript
import { fetch } from 'undici';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';

export interface CrawledArticle {
  url: string;
  title: string;
  bodyText: string;
  scrapedAt: string;
}

export class HighThroughputCrawler {
  private visitedUrls = new Set<string>();
  private limit = pLimit(20); // Max 20 concurrent connections

  async crawlUrl(targetUrl: string): Promise<CrawledArticle | null> {
    const cleanUrl = this.normalizeUrl(targetUrl);
    if (this.visitedUrls.has(cleanUrl)) return null;
    this.visitedUrls.add(cleanUrl);

    return this.limit(async () => {
      try {
        const response = await fetch(cleanUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        if (!response.ok) return null;
        const html = await response.text();
        const $ = cheerio.load(html);

        return {
          url: cleanUrl,
          title: $('h1').first().text().trim(),
          bodyText: $('article').text().trim() || $('main').text().trim(),
          scrapedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error(`Failed to crawl ${cleanUrl}:`, error);
        return null;
      }
    });
  }

  private normalizeUrl(rawUrl: string): string {
    const parsed = new URL(rawUrl);
    parsed.hash = '';
    // Strip tracking parameters
    ['utm_source', 'utm_medium', 'utm_campaign', 'ref'].forEach((param) =>
      parsed.searchParams.delete(param)
    );
    return parsed.toString();
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Launching 50 Headless Browsers at Once**: Launching 50 Chromium browser instances simultaneously, exhausting host RAM (use Cheerio instead).
- ❌ **Infinite Crawler Traps**: Getting caught in dynamic calendar link loops (`/calendar?date=2026-10-02` $\rightarrow$ `/calendar?date=2026-10-03`) without max depth caps.
- ❌ **Storing Everything in RAM**: Accumulating 500,000 scraped JSON records in an in-memory array before writing to disk.

---

## 6. Real-World Production Example

```markdown
**High-Throughput Crawl**:
- Scraped 120,000 documentation pages using Undici + Cheerio with concurrency cap of 25.
- Crawl completed in 8 minutes using only 180MB RAM on a $10/mo VPS.
```
