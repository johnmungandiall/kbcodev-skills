# Skill: API Security, Rate Limiting & Cloudflare WAF Engineering
`id`: `kbcodedev/api-security-rate-limit-waf`  
`category`: `14-security-compliance-governance`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Protecting public REST/GraphQL APIs and web applications against automated bot scrapers, brute force login attacks, credential stuffing, and DDoS using Cloudflare WAF, Redis Token Bucket rate limiting, and mTLS.
- **Triggers**: Public API launch, login endpoint brute force attacks, scraping mitigation, Cloudflare WAF configuration.
- **Prerequisites**: Reverse proxy / CDN (Cloudflare, AWS CloudFront), Redis for distributed rate limit state.

---

## 2. Core Mental Model & Invariant Principles
1. **Tiered Defense-in-Depth**:
   - **Layer 1 (CDN / WAF Edge)**: Cloudflare bot management, geo-blocking, managed OWASP rulesets.
   - **Layer 2 (API Gateway)**: Distributed Redis Token Bucket per IP / API Key (`429 Too Many Requests`).
   - **Layer 3 (Application)**: Account-level anomaly detection and captcha challenge step-ups.
2. **Token Bucket with Sliding Window**: Use sliding window log or token bucket algorithms in Redis to prevent burst exploitation at window boundaries.
3. **Informative Rate Limit Headers**: Always return standard RFC 6585 headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and `Retry-After`.

---

## 3. High-Signal Execution Workflow

```
[Inbound HTTP Request]
          │
          ▼
┌─────────────────────────────────┐
│ Layer 1: Cloudflare WAF Edge    │ ── Block known bots, Tor exit nodes, SQLi payloads
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Layer 2: Redis Sliding Window   │ ── Evaluate: Requests in last 60 seconds < Limit?
└─────────────────┬───────────────┘
         ┌────────┴────────┐
     [Under Limit]    [Over Limit]
         ▼                 ▼
┌─────────────────┐ ┌──────────────────────────────────────────────┐
│ Route to App    │ │ Return 429 Too Many Requests (Retry-After: 30) │
└─────────────────┘ └──────────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "endpoint": "/api/v1/auth/login",
  "limit": 5,
  "window_seconds": 60,
  "key_strategy": "ip_address + email_hash"
}
```

### Output Contract
```typescript
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export interface RateLimitResult {
  isAllowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export async function checkSlidingWindowRateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  const key = `ratelimit:${identifier}`;

  // Atomic Redis Pipeline (Sliding Window Log)
  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, 0, windowStart); // Remove old entries
  pipeline.zadd(key, now, `${now}-${Math.random()}`); // Record current request
  pipeline.zcard(key); // Count active requests
  pipeline.expire(key, windowSeconds); // Set TTL

  const results = await pipeline.exec();
  const currentCount = (results?.[2]?.[1] as number) || 1;

  const isAllowed = currentCount <= limit;
  const remaining = Math.max(0, limit - currentCount);

  return {
    isAllowed,
    limit,
    remaining,
    resetSeconds: windowSeconds,
  };
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Fixed Window Boundary Spikes**: Using fixed 1-minute windows allowing an attacker to fire 100 requests at 00:59 and 100 requests at 01:00 (200 requests in 2 seconds).
- ❌ **Rate Limiting by IP Alone on Auth**: Allowing attackers to bypass login brute-force limits by rotating residential proxies (combine IP + hashed email).
- ❌ **Returning Generic 500 on Rate Exceeded**: Crashing or returning 500 Internal Error instead of standard `429 Too Many Requests`.

---

## 6. Real-World Production Example

```markdown
**Brute Force Mitigation**:
- Attacker launched 500,000 password attempts against `/api/v1/auth/login`.
- Cloudflare WAF + Redis Sliding Window throttled 99.8% of requests at the edge. Application CPU usage remained under 15%.
```
