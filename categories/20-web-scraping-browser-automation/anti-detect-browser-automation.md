# Skill: Anti-Detect Browser Automation & Cloudflare Bypass
`id`: `kbcodedev/anti-detect-browser-automation`  
`category`: `20-web-scraping-browser-automation`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Driving automated browser tasks on websites protected by Cloudflare Turnstile, Akamai Bot Manager, PerimeterX, Datadome, and browser fingerprinting defenses across real Chrome extensions or stealth browser drivers.
- **Triggers**: Bot detection blocks (403 Forbidden / Cloudflare challenge page), headless browser fingerprint leaks (`navigator.webdriver === true`), automated data extraction.
- **Prerequisites**: Real Chrome extension session OR stealth browser automation driver (Playwright/Puppeteer with stealth patches), proxy pools.

---

## 2. Core Mental Model & Invariant Principles
1. **Fingerprint Masking Invariants**: Neutralize headless telltales: delete `navigator.webdriver`, mock `navigator.plugins`, randomize `WebGLRenderingContext` vendor strings, and match `User-Agent` to client platform architecture.
2. **Humanized Cursor & Keystroke Dynamics**: Never use synthetic instant `page.fill()` or teleporting clicks; simulate Bézier curve mouse trajectories with jitter and randomized 40ms-120ms typing cadences.
3. **Residential Proxy Rotation & TLS Fingerprint Matching**: Route traffic through rotating residential IPs with matching TLS Client Hello (JA3/JA4) signatures.

---

## 3. High-Signal Execution Workflow

```
[Target URL Protected by Cloudflare Turnstile]
                      │
                      ▼
┌─────────────────────────────────────────────┐
│ Step 1: Initialize Stealth Browser Context  │ ── Override navigator.webdriver & WebGL strings
└─────────────────────┬───────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│ Step 2: Route Through Residential Proxy     │ ── Rotate IP per session with sticky cookies
└─────────────────────┬───────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│ Step 3: Humanized Bézier Curve Navigation   │ ── Natural scroll, mouse hover, randomized typing
└─────────────────────┬───────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│ Step 4: Extract Verified Target DOM Payload │ ── Ingest structured data & terminate context
└─────────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "target_url": "https://protected-portal.example.com/data",
  "auth_required": false,
  "bot_defense": "Cloudflare Turnstile + TLS Fingerprinting"
}
```

### Output Contract
```typescript
import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';

// Apply stealth patches
chromium.use(stealthPlugin());

export async function scrapeWithStealth(url: string) {
  const browser = await chromium.launch({
    headless: false, // Non-headless or virtual framebuffer for lowest detection score
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-size=1920,1080',
    ],
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
  });

  const page = await context.newPage();

  // Evaluate script at document start to sanitize fingerprint
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  await page.goto(url, { waitUntil: 'networkidle' });

  // Humanized typing simulation
  async function humanType(selector: string, text: string) {
    await page.focus(selector);
    for (const char of text) {
      await page.keyboard.type(char, { delay: Math.floor(Math.random() * 80) + 40 });
    }
  }

  // Extract structured content ...
  const data = await page.evaluate(() => document.title);
  await browser.close();
  return data;
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Instant Automated Form Submissions**: Injecting text into 10 form fields in 0.01 seconds, triggering instant bot risk scoring.
- ❌ **Headless Default User-Agents**: Using default Playwright headers containing `HeadlessChrome`, immediately flagged by WAFs.
- ❌ **Static Single IP Scraping**: Firing 1,000 requests from a single datacenter AWS IP, resulting in immediate IP range ban.

---

## 6. Real-World Production Example

```markdown
**Bypassing WAF Gating**:
- Scraper was blocked by Cloudflare 403 on target directory.
- Enabled Playwright stealth plugin + residential proxy + humanized mouse trajectory curve.
- Successfully extracted 15,000 public catalog records with 0% block rate.
```
