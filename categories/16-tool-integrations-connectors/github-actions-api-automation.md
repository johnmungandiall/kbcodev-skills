# Skill: GitHub Actions API & Automated Release Bot
`id`: `kbcodedev/github-actions-api-automation`  
`category`: `16-tool-integrations-connectors`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building automated GitHub PR bots, release note generators, changelog synthesizers, issue triagers, and Octokit REST/GraphQL API automations.
- **Triggers**: Automated release tagging, PR bot development, automated branch protection sync, issue labeling workflows.
- **Prerequisites**: GitHub Personal Access Token (PAT) or GitHub App credentials, `@octokit/rest`.

---

## 2. Core Mental Model & Invariant Principles
1. **Semantic Versioning Automation**: Calculate SemVer bumps (`patch`, `minor`, `major`) automatically by analyzing Conventional Commit headers (`fix:`, `feat:`, `feat!: / BREAKING CHANGE:`).
2. **GraphQL for High-Density Batching**: Use GitHub GraphQL API (`graphql()`) to fetch PRs, reviews, and comments in 1 network request rather than 10 separate REST calls.
3. **Idempotent PR Bot Comments**: Search for existing bot comments before posting; update the existing comment in-place with a hidden HTML marker (`<!-- bot-comment-id: pr-summary -->`) to avoid spamming the PR thread.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Git Commit Tag / Merged Pull Request]
                  │
                  ▼
┌─────────────────────────────────┐
│ Step 1: Parse Commit Messages   │ ── Conventional Commits parser (feat, fix, refactor)
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 2: Compute Next SemVer     │ ── v2.14.0 -> v2.15.0
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 3: Generate Changelog Body │ ── Group commits by category with PR author mentions
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 4: Create GitHub Release   │ ── octokit.rest.repos.createRelease() + upload binaries
└─────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "owner": "organization",
  "repo": "kbcodedev-skills",
  "target_commit": "main",
  "commits": [
    { "message": "feat(auth): add SAML 2.0 SSO support (#42)", "author": "john" },
    { "message": "fix(db): resolve connection pool leak (#43)", "author": "jane" }
  ]
}
```

### Output Contract
```typescript
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function createAutomatedRelease(
  owner: string,
  repo: string,
  tagName: string,
  releaseNotes: string
) {
  const response = await octokit.rest.repos.createRelease({
    owner,
    repo,
    tag_name: tagName,
    name: `Release ${tagName}`,
    body: releaseNotes,
    draft: false,
    prerelease: false,
    generate_release_notes: true,
  });

  return response.data.html_url;
}

// Idempotent PR Comment Updater
export async function postOrUpdatePrComment(
  owner: string,
  repo: string,
  issueNumber: number,
  bodyContent: string,
  botTag: string = "<!-- pr-summary-bot -->"
) {
  const { data: comments } = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber,
  });

  const existing = comments.find((c) => c.body?.includes(botTag));
  const fullBody = `${botTag}\n${bodyContent}`;

  if (existing) {
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existing.id,
      body: fullBody,
    });
  } else {
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: fullBody,
    });
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Spamming New Comments on Every Commit**: Creating 20 duplicate comments on a single PR instead of editing the existing comment.
- ❌ **Hitting Secondary Rate Limits**: Making 100 concurrent REST API calls in a loop without rate-limit exponential backoff.
- ❌ **Creating Releases on Broken Builds**: Tagging releases before verifying that CI test workflows have completed with a green pass.

---

## 6. Real-World Production Example

```markdown
**Automated Release Bot**:
- Automated GitHub Actions release pipeline parses PR titles on merge to `main`.
- Bumps version in `package.json`, generates markdown changelog, and publishes GitHub Release with attached compiled binaries in 14 seconds.
```
