# Skill: Product Hunt #1 Launch & Distribution Playbook
`id`: `kbcodedev/product-hunt-launch-playbook`  
`category`: `15-c-suite-executive-advisory`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Planning, executing, and optimizing a #1 Product of the Day launch on Product Hunt, Hacker News Show HN, X/Twitter, and developer communities.
- **Triggers**: Product launch planning, public beta release, developer marketing strategy, Product Hunt asset preparation.
- **Prerequisites**: Working product URL, demo video / GIF, tagline, maker first comment.

---

## 2. Core Mental Model & Invariant Principles
1. **The 24-Hour PST Launch Window**: Product Hunt rankings reset at 00:01 PST. Launch precisely at 00:02 PST to maximize the full 24-hour voting window.
2. **Clear Tagline Formula**: Never write abstract slogans (*"Empowering seamless workflows"*). Write clear, functional descriptions (*"AI-powered SQL query optimizer for PostgreSQL"*).
3. **First 4 Hours Velocity**: The initial 4 hours (00:01 - 04:00 PST) determine leaderboard algorithm momentum. Coordinate early genuine community advocates to test and leave authentic reviews.

---

## 3. High-Signal Execution Workflow

```
[Product Ready for Public Launch]
                │
                ▼
┌───────────────────────────────────────────────┐
│ T-7 Days: Asset Preparation & Hunter Alignment │ ── 240x240 GIF Logo, 5 Screenshots, Video
└───────────────────────┬───────────────────────┘
                        ▼
┌───────────────────────────────────────────────┐
│ T-0 (00:02 PST): Launch Live & Maker Comment   │ ── Personal founder story & transparent roadmap
└───────────────────────┬───────────────────────┘
                        ▼
┌───────────────────────────────────────────────┐
│ T+2 Hours: Community & Social Amplification   │ ── X/Twitter thread, Show HN, Discord/Slack
└───────────────────────┬───────────────────────┘
                        ▼
┌───────────────────────────────────────────────┐
│ T+24 Hours: Post-Launch Conversion Pipeline   │ ── Convert 5,000 visitors to active trial users
└───────────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "product_name": "kbcodedev",
  "category": "Developer Tools / AI",
  "core_feature": "65+ production-grade autonomous agent skills for AI coding assistants"
}
```

### Output Contract
```markdown
# Product Hunt Launch Kit: kbcodedev

## 1. Metadata
- **Name**: kbcodedev-skills
- **Tagline**: The production-grade developer skills library for AI coding agents
- **Topics**: Developer Tools, Artificial Intelligence, Open Source, Productivity

## 2. Maker's First Comment (Founder Story)
> *"Hey Product Hunt community! 👋 I'm John, maker of kbcodedev-skills.*
>
> *Over the past year of building autonomous AI coding agents, we noticed a massive problem: raw prompts are filled with conversational fluff, broken assumptions, and zero execution contracts.*
>
> *We synthesized over 50,000 prompt repositories into **99 production-grade, contract-driven developer skills** across 18 domains (Architecture, DevOps, Testing, Security, and C-Suite Advisory).*
>
> *Everything is 100% open-source and ready to drop into kbcode, Claude Code, or Cursor. Would love your feedback and to answer any questions! 🚀"*

## 3. Launch Day Hourly Checklist (PST)
- **00:02 PST**: Publish listing live + post Maker's Comment.
- **06:00 PST**: Publish X/Twitter launch thread with 30-second product demo GIF.
- **08:00 PST**: Post "Show HN: kbcodedev – 99 Production AI Developer Skills" on Hacker News.
- **12:00 PST**: Reply to every single Product Hunt comment within 10 minutes.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Launching at 2:00 PM PST**: Launching midway through the day, throwing away 14 hours of voting eligibility.
- ❌ **Asking for Upvotes Directly**: Posting *"Please upvote me!"* (triggers Product Hunt anti-spam voting penalties; ask for *"feedback and support"* instead).
- ❌ **Ignoring User Comments**: Leaving comments unanswered for 6 hours, killing engagement momentum.

---

## 6. Real-World Production Example

```markdown
**#1 Product of the Day Launch**:
- Followed 00:02 PST launch playbook with interactive demo video and authentic maker comment.
- Achieved #1 Product of the Day with 820 upvotes, driving 12,500 developer signups in 48 hours.
```
