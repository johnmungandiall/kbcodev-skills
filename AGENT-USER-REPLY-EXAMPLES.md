# How an AI Agent Should Reply to the User — Real-World Examples (2025–2026)

> Collected from live agent system prompts, official product docs, public spec documents, and
> developer threads published between **2025-09** and **2026-09**.
> Every quoted line below is copied verbatim from the source named next to it.
> Evidence tier is marked on each entry:
> **[PRIMARY]** = I read the source document itself this session.
> **[SECONDARY]** = an aggregator/blog describing it — treat as a lead, not a fact.

Purpose: this is the evidence base for "agent reply style that a human actually understands".
Use it when authoring reply-style rules for a skill, a system prompt, an output style, or an AGENTS.md.

---

## 1. The one-line answer

**The first line must carry the answer. Preamble, narration and the closing recap are the
three things every major agent removed — and the three things users complain about most.**

---

## 2. Verbatim rules harvested from live agent prompts

### 2.1 Claude Code 2.0 — "Tone and style" **[PRIMARY]**
Source: `Anthropic/Claude Code 2.0.txt`, release date **2025-09-29**
(https://raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/Anthropic/Claude%20Code%202.0.txt)

```
You should be concise, direct, and to the point, while providing complete information and
matching the level of detail you provide in your response with the level of complexity of the
user's query or the work you have completed.
A concise response is generally less than 4 lines, not including tool calls or code generated.
You should provide more detail when the task is complex or when the user asks you to.

IMPORTANT: You should NOT answer with unnecessary preamble or postamble (such as explaining your
code or summarizing your action), unless the user asks you to.

Answer the user's question directly, avoiding any elaboration, explanation, introduction,
conclusion, or excessive details.

You MUST avoid extra preamble before/after your response, such as "The answer is <answer>.",
"Here is the content of the file..." or "Based on the information provided, the answer is..."
or "Here is what I will do next...".
```

Its own worked examples of correct verbosity (copy these as calibration pairs):

| user | assistant |
|---|---|
| `2 + 2` | `4` |
| `what is 2+2?` | `4` |
| `is 11 a prime number?` | `Yes` |
| `what command should I run to list files in the current directory?` | `ls` |
| `How many golf balls fit inside a jetta?` | `150000` |
| `which file contains the implementation of foo?` | `src/foo.c` |

Two more rules from the same section that decide *when* to break brevity:

```
When you run a non-trivial bash command, you should explain what the command does and why you are
running it, to make sure the user understands what you are doing (this is especially important
when you are running a command that will make changes to the user's system).

If you cannot or will not help the user with something, please do not say why or what it could
lead to, since this comes across as preachy and annoying. Please offer helpful alternatives if
possible, and otherwise keep your response to 1-2 sentences.
```

And the anti-sycophancy clause, verbatim from the same prompt:

```
Prioritize technical accuracy and truthfulness over validating the user's beliefs. Focus on facts
and problem-solving, providing direct, objective technical info without any unnecessary
superlatives, praise, or emotional validation. ... Objective guidance and respectful correction
are more valuable than false agreement.
```

### 2.2 Claude Code built-in output styles — official docs **[PRIMARY]**
Source: https://docs.claude.com/en/docs/claude-code/output-styles (read 2026-10-08). Concise requires v2.1.237+.

| Style | What it changes about the reply | Verbatim |
|---|---|---|
| **Concise** | answer-first, no narration, no recap | "the first sentence of a response states what happened or what the answer is. Claude leaves out the lead-in, the step-by-step narration, and the closing recap, and answers a simple question in one to three sentences. It does the engineering work as thoroughly as in the Default style." |
| **Proactive** | acts without asking routine questions | "Claude starts implementing as soon as you send a task. It makes reasonable assumptions about routine decisions rather than stopping to ask" — while still checking before "an action that deletes data or changes a shared or production system". |
| **Explanatory** | adds short *Insight* blocks explaining choices | Insight blocks carry "two or three points about your codebase or the code Claude wrote". |
| **Learning** | explains + leaves code for the human | marks the spot with `TODO(human)` and sends a *Learn by Doing* block with `Context:` / `Your Task:` / `Guidance:`. |

**The two carve-outs are the important part of Concise** — the reply goes long in exactly two cases:

```
Claude still writes at full length in these cases:
- Anything you ask for: when you ask for an explanation or more detail, Claude answers in full.
- Anything you need in order to act safely: error reports, failing test output, security warnings,
  and confirmations for destructive actions keep their complete content.
```

And the honest limitation, verbatim:

```
An output style gives Claude instructions to follow. It doesn't guarantee that something always
happens or never happens.
```

### 2.3 Cursor Agent prompt — three separate reply specs **[PRIMARY]**
Source: `Cursor Prompts/Agent Prompt 2025-09-03.txt` (https://raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/Cursor%20Prompts/Agent%20Prompt%202025-09-03.txt)

**Status update spec (mid-task talk):**
```
Definition: A brief progress note (1-3 sentences) about what just happened, what you're about to do,
blockers/risks if relevant. Write updates in a continuous conversational style, narrating the story
of your progress as you go.

Critical execution rule: If you say you're about to do something, actually do it in the same turn
(run the tool call right after).
```
Its own examples of the right tone:
```
"Let me search for where the load balancer is configured."
"I found the load balancer configuration. Now I'll update the number of replicas to 3."
"My edit introduced a linter error. Let me fix that."
```
Also: "Don't add headings like 'Update:'."

**Summary spec (end of turn):**
```
If the user asked for info, summarize the answer but don't explain your search process.
If the user asked a basic query, skip the summary entirely.
It's very important that you keep the summary short, non-repetitive, and high-signal, or it will be
too long to read. The user can view your full code changes in the editor, so only flag specific
code changes that are very important to highlight to the user.
Don't add headings like "Summary:" or "Update:".
```
Also: "Don't repeat the plan." — and from `<communication>`: "optimize your writing for clarity and
skimmability giving the user the option to read more or less", "Refer to code changes as "edits" not
"patches"", "State assumptions and continue; don't stop for approval unless you're blocked."

### 2.4 GitHub Copilot / VS Code agent (GPT-5 prompt) **[PRIMARY]**
Source: `VSCode Agent/gpt-5.txt` (https://raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/VSCode%20Agent/gpt-5.txt)

```
Keep your answers short and impersonal.
...
After any parallel, read-only context gathering, give a concise progress update and what's next.
Avoid repetition across turns: don't restate unchanged plans or sections (like the todo list)
verbatim; provide delta updates or only the parts that changed.
Tool batches: You MUST preface each batch with a one-sentence why/what/outcome preamble.
Progress cadence: After 3 to 5 tool calls, or when you create/edit > ~3 files in a burst, pause and
post a compact checkpoint.
Communication style: Use a friendly, confident, and conversational tone. Prefer short sentences,
contractions, and concrete language. Keep it skimmable and encouraging, not formal or robotic. A
tiny touch of personality is okay; avoid overusing exclamations or emoji. Avoid empty filler like
"Sounds good!", "Great!", "Okay, I will…", or apologies when not needed—open with a purposeful
preamble about what you're doing next.
```
Plus two rules that shape the *end* of a reply: "Report deltas only (PASS/FAIL)." and
"Requirements coverage: ... map each requirement to its status (Done/Deferred + reason)".
And two that protect the user's hands: "Never invent file paths, APIs, or commands." /
"When commands are required, run them yourself in a terminal and summarize the results. Do not print
runnable commands unless the user asks." Plus the 3-strike rule: "Do not loop more than 3 times
attempting to fix errors in the same file. If the third try fails, you should stop and ask the user."

### 2.5 Devin — *when* to talk to the user **[PRIMARY]**
Source: `Devin AI/Prompt.txt` (https://raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/Devin%20AI/Prompt.txt)

```
When to Communicate with User
- When encountering environment issues
- To share deliverables with the user
- When critical information cannot be accessed through available resources
- When requesting permissions or keys from the user
- Use the same language as the user
```
Plus a pre-reply self-check, verbatim:
```
Before reporting completion to the user. You must critically examine your work so far and ensure
that you completely fulfilled the user's request and intent.
```
And on asking: "If you cannot find some information, believe the user's task is not clearly defined,
or are missing crucial context or credentials you should ask the user for help. Don't be shy."

### 2.6 Manus — the reply surface is a first-class capability **[PRIMARY]**
Source: `Manus Agent Tools & Prompt/Prompt.txt`

```
### Communication Tools
- Sending informative messages to users
- Asking questions to clarify requirements
- Providing progress updates during long-running tasks
- Attaching files and resources to messages
- Suggesting next steps or additional actions
...
## Communication Style
I strive to communicate clearly and concisely, adapting my style to the user's preferences.
```

### 2.7 OpenAI Model Spec — the *policy* layer **[PRIMARY]**
Source: https://model-spec.openai.com/2025-09-12.html (version dated 2025-09-12; the page itself
states "A newer version of the Model Spec is available. This version is provided for historical
reference"). These are the reply-shaping instructions, verbatim (level of authority in brackets):

| Instruction (verbatim heading) | Level |
|---|---|
| "Don't be sycophantic" | User |
| "Be clear and direct" | Guideline |
| "Be concise and conversational" | Guideline |
| "Be thorough but efficient, while respecting length limits" | Guideline |
| "Adapt length and structure to user objectives" | Guideline |
| "Adapt to the user's modality" | User +1 |
| "Consider uncertainty, state assumptions, and ask clarifying questions when appropriate" | Guideline |
| "Express uncertainty" | Guideline |
| "Highlight possible misalignments" | Guideline |
| "Avoid overstepping" | User |
| "Avoid being condescending or patronizing" | Guideline |
| "When appropriate, be helpful when refusing" | Guideline |
| "Handle interruptions gracefully" | Guideline |
| "Avoid factual, reasoning, and formatting errors" | User |

The spec's own worked case for the length question, verbatim:
```
Why include default instructions at all? Consider a request to write code: without additional style
guidance or context, should the assistant provide a detailed, explanatory response or simply deliver
runnable code?
```
That is the ambiguity every reply-style rule exists to settle.

### 2.8 Microsoft HAX — the 18 human-AI interaction guidelines **[PRIMARY]**
Source: https://www.microsoft.com/en-us/haxtoolkit/library/ (read 2026-10-08). These are the
guidelines that govern *what the reply owes the user*, quoted verbatim:

| # | Guideline (verbatim) | What it means for a reply |
|---|---|---|
| G1 | "Make clear what the system can do" | state the capability, not just the result |
| G2 | "Make clear how well the system can do what it can do" | state confidence / how often it errs |
| G9 | "Support efficient correction" | make "you can change this here" easy |
| G10 | "Scope services when in doubt" | "Engage in disambiguation or gracefully degrade ... when uncertain about a user's goals" |
| G11 | "Make clear why the system did what it did" | one line of *why*, on request |
| G15 | "Encourage granular feedback" | invite a targeted correction, not "was this helpful?" |
| G16 | "Convey the consequences of user actions" | say what changes if they accept |
| G18 | "Notify users about changes" | announce behaviour changes unprompted |

### 2.9 community rule set: agent-style (yzhao062) **[PRIMARY]**
Source: https://raw.githubusercontent.com/yzhao062/agent-style/main/RULES.md and its README
(21 rules: 12 canonical from Strunk & White / Orwell / Pinker / Gopen & Swan, 9 field-observed from
LLM output 2022–2026). Severity rubric: **critical** = "reader cannot understand or trust the prose
if the rule is violated"; **high** = "externally visible AI-tell".

The two rules it calls **critical** are the two a reply must never break:

| # | Rule | Severity |
|---|---|---|
| RULE-01 | "Do not assume the reader shares your tacit knowledge" (resist the curse of knowledge) | critical |
| RULE-H | "Support factual claims with citation or concrete evidence; do not be handwavy" | critical |

Its field-observed AI tells (RULE-A…I) — the ones that make a reply *feel* machine-written:

| # | Rule (verbatim) |
|---|---|
| A | "Do not convert prose into bullet points unless the content is a genuine list (and do not over-bullet where 2 items or a sentence fit)" |
| B | "Do not use em or en dashes as casual sentence punctuation" |
| C | "Do not start consecutive sentences with the same word or phrase" |
| D | "Do not overuse transition words ("Additionally", "Furthermore", "Moreover")" |
| E | "Do not close every paragraph with a summary sentence" |
| F | "Use consistent terms; do not redefine abbreviations mid-document" |
| I | "Prefer full forms over contractions in formal technical prose ("it is" over "it's")" |

Measured effect (its own sanity bench, 10 fixed tasks × 2 generations × 2 conditions, self-reported
and labelled directional-not-significant, and explicitly covering only 7 of the 21 rules):
Claude Opus 4.7 **88 → 47** violations, GPT-5.4 via Codex CLI **48 → 26**, Gemini 3 Flash **65 → 9**,
GitHub Copilot CLI **52 → 52** (reported as a noise control, not a result).

---

## 3. The rules, consolidated

Derived only from the sources above; the source for each is named.

| # | Rule | Where it comes from |
|---|---|---|
| 1 | **Answer first.** Line one = the outcome, the number, the yes/no. | Claude Code 2.0; Claude Code Concise style |
| 2 | **No preamble, no postamble.** Never "Here is what I will do next…" / "Based on the information provided…". | Claude Code 2.0 (verbatim ban list) |
| 3 | **Scale length to the question.** Trivial question = one line; complex work = more. | Claude Code 2.0; Model Spec "Adapt length and structure to user objectives" |
| 4 | **Two carve-outs from brevity: what the user asked for, and what they need to act safely** (errors, failing tests, security warnings, destructive confirmations). | Claude Code Concise style (verbatim) |
| 5 | **Name the thing, not a category.** No "various factors", no "some improvements". | agent-style RULE-03; RULE-01 |
| 6 | **No sycophancy.** No "Great!", no praise inflation, no agreeing with the user's framing. | Claude Code 2.0; Model Spec "Don't be sycophantic"; sycophancy write-up (2026-04-22) |
| 7 | **Don't restate the plan or the todo list.** Delta updates only. | Copilot GPT-5 prompt (verbatim) |
| 8 | **Don't narrate the search.** If they asked for information, give the information. | Cursor summary spec (verbatim) |
| 9 | **Don't talk about what you did *not* do.** Talk about what changed. | HN thread complaint, 2026-09-08 (verbatim quote in §4) |
| 10 | **State assumptions and continue; ask only when truly blocked.** | Cursor prompt; Model Spec G10/HAX; Devin |
| 11 | **Say uncertainty out loud.** | Model Spec "Express uncertainty"; HAX G2 |
| 12 | **Run the thing yourself; don't hand the user a command to paste.** | Copilot GPT-5 prompt (verbatim) |
| 13 | **Mark the correction path** — where the user can change what you just did. | HAX G9, G15, G16 |
| 14 | **Sensitive/destructive actions get named as such, before they happen.** | Claude Code Proactive style; Claude Code Concise carve-out |

---

## 4. What real users actually complained about (verbatim)

Source: Hacker News thread 49610631 (363 comments, 535 points, posted **2026-09-08**), synthesised at
https://terminalblog.com/blog/claude-opus-5-verbosity-hn-developer-backlash/ **[SECONDARY]**
— quoted as "paraphrased or lightly edited from real comments" by that write-up.

```
"The biggest 'Claudism' that I have a hard time getting the LLM to stop doing is its insistence on
talking about what it didn't do in addition to what it did. 'I edited this.py and that.py but I did
not edit README.md and I did not commit…'"
```
```
"My most used follow-ups with Opus 5 are 'one thing at a time' and 'too much text.'"
```
```
"Instead of telling me what to do, it first tells me 3 ways that might technically work, but I
probably shouldn't use for various reasons. This is all a waste of my time, tokens, and sanity."
```
```
"I solved this by switching from Claude to Codex. It's crazy how much faster it is to reply and how
much less verbose its replies are."
```
The most useful engineering observation in the thread, about *why* reply-style rules decay:
```
"CLAUDE.md doesn't survive longer contexts because it's towards the top of the context. One of the
reasons the Claude Code voice survives is it's part of the output style which gets 'reminded' to the
context at every turn."
```
And the artifact it produced: a repo called `i-have-adhd` — "140 lines of markdown telling Claude to
stop talking so much" — reported at **30,000 GitHub stars in September 2026**. Its instruction set:
answer first, skip preamble, under 100 words when possible.

**Takeaway:** a reply-style rule placed once in a long system prompt decays; a rule re-injected every
turn (an output style) survives. That is a design lesson, not a wording lesson.

---

## 5. The sycophancy failure modes, named

Source: https://www.nativeagents.dev/posts/guidelines/ai-as-coding-partner (Nabin Pokhrel, **2026-04-22**) **[PRIMARY]**

| Failure | Verbatim definition |
|---|---|
| **Frame echo** | "You call your own code 'clean,' the agent calls it clean. You call it 'hacky,' the agent finds the exact same lines hacky." |
| **Praise inflation** | "Every diff is 'excellent,' every refactor 'a significant improvement,' every function name 'very clear.' The vocabulary stops carrying information." |
| **Bug softening** | "The agent spots a real problem, then buries it under three paragraphs of what you got right. ... The dangerous one is the third. The agent knew. It just didn't want to hurt your feelings." |

Its prompt fixes, verbatim:
```
❌ "No validation, no recap of my question, no summary at the end. Answer the question in the first
   sentence." — put this in your system prompt or AGENTS.md once and forget about it.

✅ "Argue against this approach. What would a senior engineer push back on in code review?"

✅ "Give me two reasonable approaches to retries here, the tradeoff between them, and which you'd
   pick for a team of 3 engineers with no on-call rotation."
```

---

## 6. BAD → GOOD example library

All pairs below are quoted from agent-style `RULES.md` **[PRIMARY]**. They are writing pairs, so they
transfer directly into agent replies, PR descriptions, commit messages and postmortems.

**Curse of knowledge (RULE-01) — the critical rule:**
```
BAD : We use contrastive learning with InfoNCE and a momentum encoder.
GOOD: Our method trains a representation to separate similar from dissimilar image pairs
      (contrastive learning), with InfoNCE as the loss and a slowly-updating momentum encoder
      to stabilize training.

BAD : The API uses JWT with RS256 refresh tokens rotated via the OIDC flow.
GOOD: Authentication uses short-lived signed tokens (JWT with RS256) issued by our OIDC identity
      provider. Clients refresh these tokens before expiry through the standard OIDC refresh flow.

BAD (runbook): If the queue is backed up, bounce the workers and clear the dead-letter.
GOOD (runbook): If RabbitMQ queue depth exceeds 10k messages for more than 5 minutes,
      (1) drain and restart the Celery worker pool ... then (2) drain the dead-letter queue so
      failed messages do not replay against the now-fresh workers.
```

**Concrete over abstract (RULE-03):**
```
BAD : The model shows improvements across various metrics.
GOOD: The model improves FEVER F1 by 3.2 points and cuts the TruthfulQA hallucination rate by
      4.5 points (Table 2).

BAD : The system has performance issues.            [implied]
GOOD: the checkout endpoint p95 latency rose from 120ms to 450ms at 14:00 UTC
      [stated in the rule's directive as the model answer]

BAD (runbook): Scale up the backend if traffic is high.
GOOD (runbook): If p95 latency on /search exceeds 300ms for more than 2 minutes, scale the search
      worker pool from 8 to 16 replicas via kubectl scale deployment/search-worker --replicas=16.
```

**Kill the filler (RULE-04) — includes the exact deny list:**
```
BAD : It is important to note that the learning rate was reduced in order to prevent divergence.
GOOD: We reduced the learning rate to prevent divergence.

BAD : Due to the fact that the data pipeline may potentially fail under high load, we have added
      retry logic.
GOOD: Because the data pipeline can fail under load, we added retry logic.

BAD : At this point in time, the service is able to process approximately 1000 requests per second.
GOOD: The service processes ~1000 requests per second.

BAD (PR): This PR makes some minor adjustments in order to fix an issue that was causing failures
      in certain test cases.
GOOD (PR): Fixes a null-pointer crash in `test_checkout_flow` when the cart has a single item.

BAD (commit): Some small changes have been made that may potentially improve the overall performance
      of the system in certain scenarios.
GOOD (commit): Cache product lookups in the hot path; reduces p99 from 310ms to 180ms.
```
The deny list quoted from that rule: "it is important to note that", "in order to", "due to the fact
that", "at this point in time", "may potentially", "could possibly", "in the event that",
"it may be necessary to".

**Active over passive when the agent matters (RULE-02):**
```
BAD : Errors are logged to /var/log/app.log when the service restarts.
GOOD: The service logs errors to /var/log/app.log on restart.

BAD (postmortem): The incident was caused by a misconfigured load balancer rule.
GOOD (postmortem): A misconfigured load balancer rule (typo in the ingress-nginx path-rewrite regex)
      routed /auth/* to the wrong upstream and caused the incident.
```

**Prose vs bullets (RULE-A) — the over-bulleting tell:**
```
BAD : a sentence turned into three one-line bullets
GOOD: keep it a sentence; bullet only a genuine list (and not a 2-item one)
```

---

## 7. Platform comparison — what each shipped agent does for the user-facing reply

| Agent | Reply rule that defines it | Evidence | Date |
|---|---|---|---|
| **Claude Code** | concise/direct, <4 lines by default, explicit ban list on preamble; 4 built-in output styles on top | [PRIMARY] system prompt + official docs | 2025-09-29 / docs read 2026-10-08 |
| **Cursor** | separate *status update* spec (1–3 sentences, conversational, correct tense) and *summary* spec (skip for basic queries); no "Update:"/"Summary:" headings | [PRIMARY] `Agent Prompt 2025-09-03.txt` | 2025-09-03 |
| **GitHub Copilot / VS Code** | "short and impersonal"; one-sentence preamble before each tool batch; checkpoint every 3–5 calls; delta updates only; no empty filler | [PRIMARY] `VSCode Agent/gpt-5.txt` | era 2025 (GPT-5) |
| **Devin** | communicates at 5 named moments only; thinks before declaring done; asks without shyness when blocked | [PRIMARY] `Devin AI/Prompt.txt` | undated prompt |
| **Manus** | communication is a tool surface; progress updates for long tasks; style adapts to user | [PRIMARY] `Manus …/Prompt.txt` | undated prompt |
| **Windsurf** | "AI Flow" — continuous, minimise interruptions, batch operations, stream results | [SECONDARY] aggregator guide | 2026-07-17 |
| **OpenAI / Codex** | Model Spec policy layer: don't be sycophantic, be clear and direct, be concise and conversational, adapt length to user objectives | [PRIMARY] Model Spec | 2025-09-12 version |

---

## 8. Two paste-ready blocks

Both are assembled from the verbatim rules in §2 — nothing invented.

**A. Concise reply style (drop-in for a system prompt / output style / AGENTS.md):**
```
Reply rules:
1. First sentence = the answer or the outcome. Never open with what you are about to do.
2. No preamble ("Let me…", "I'll check…", "Great!") and no closing recap.
3. Scale length to the question: a simple question gets 1–3 sentences; only complexity earns length.
4. Full length is required for: anything the user explicitly asked for, error reports, failing test
   output, security warnings, and confirmations for destructive actions.
5. Name the specific thing, never a category ("various factors", "some improvements").
6. No praise, no validation, no superlatives. Disagree when the evidence disagrees.
7. Do not restate the plan or the todo list. Give the delta since the last message.
8. Do not narrate the search. If the user asked for information, give the information.
9. Do not report what you did not do. Report what changed.
10. State assumptions and continue; ask only when you genuinely cannot proceed.
11. Run it yourself — never hand the user a command to paste.
```

**B. Anti-sycophancy probe block (for the *user* side — paste when you want pushback):**
```
Argue against this approach. What would a senior engineer push back on in code review?
No validation, no recap of my question, no summary at the end. Answer in the first sentence.
Give me two reasonable approaches, the tradeoff between them, and which you'd pick for
<your team size and constraints>.
```

---

## 9. Sources (with what each is good for)

| Source | URL | Date | Tier |
|---|---|---|---|
| Claude Code 2.0 system prompt | raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/Anthropic/Claude%20Code%202.0.txt | 2025-09-29 | PRIMARY |
| Claude Code output styles (official) | docs.claude.com/en/docs/claude-code/output-styles | read 2026-10-08 | PRIMARY |
| Cursor Agent prompt | …/Cursor%20Prompts/Agent%20Prompt%202025-09-03.txt | 2025-09-03 | PRIMARY |
| GitHub Copilot / VS Code GPT-5 prompt | …/VSCode%20Agent/gpt-5.txt | 2025 | PRIMARY |
| Devin prompt | …/Devin%20AI/Prompt.txt | undated | PRIMARY |
| Manus prompt | …/Manus%20Agent%20Tools%20%26%20Prompt/Prompt.txt | undated | PRIMARY |
| OpenAI Model Spec | model-spec.openai.com/2025-09-12.html | 2025-09-12 (superseded) | PRIMARY |
| Microsoft HAX — 18 guidelines | microsoft.com/en-us/haxtoolkit/library/ | read 2026-10-08 | PRIMARY |
| agent-style — 21 rules + BAD/GOOD pairs | github.com/yzhao062/agent-style (RULES.md, README.md) | 2026 (v0.5.0 era) | PRIMARY |
| Sycophancy in coding agents | nativeagents.dev/posts/guidelines/ai-as-coding-partner | 2026-04-22 | PRIMARY |
| Verbatim HN thread synthesis | terminalblog.com/blog/claude-opus-5-verbosity-hn-developer-backlash/ | 2026-09-11 (thread 2026-09-08) | SECONDARY |
| Aggregator: system prompts of AI tools 2026 | baeseokjae.github.io/posts/system-prompts-ai-tools-collection-2026/ | 2026-07-17 | SECONDARY |
| NN/g — AI agents as users | nngroup.com/articles/ai-agents-as-users/ | 2026-04-10 | PRIMARY (for agent-as-user, not reply style) |
| system-prompts-and-models-of-ai-tools (index) | github.com/x1xhlol/system-prompts-and-models-of-ai-tools | live | PRIMARY (the raw prompt files) |

### Secondary claims — recorded as leads, NOT verified
The 2026-07-17 aggregator additionally reports: Codex personality variants (Friendly / Pragmatic /
Professional); Windsurf's "AI Flow" continuous-interaction paradigm; Claude Code version history
(Opus 4.6 → Sonnet 5) and Codex version history (GPT-5.3 → GPT-5.6); a Washington Post story on
system-prompt extraction (May 2026); star counts for the prompt-collection repos.
**None of these was checked against a primary source in this session.** Do not cite them as fact.

---

## 10. How this file relates to the rest of the repo

- **Promoted to a skill (2026-10-08), then rewritten in-place to v3.0.0 the same day:**
  `categories/07-ai-mcp-prompt-engineering/clear-replies.md` (`kbcodedev/clear-replies`) — renamed from `agent-user-reply-style` on 2026-10-08, then extended to **v3.1.0** with the receiver / reading-capacity layer. Runtime measurement recorded in [[skills-dynamism-audit]].
  — the operational form of this evidence base. v3.0.0 converts the rules below from a documented
  reference into an **executable runtime skill**: a six-step per-turn loop; seven axes D1–D7 → Response
  Classes R0–R4; the deterministic P0–P5 conflict ladder; a 13-row failure catalogue with detection tests;
  eight execution states; event-driven progress with an announce-ledger; a verified-completion checklist;
  an eight-gate pre-send self-check; and four decay metrics (AO/NC/CC/CR). §7 of that skill maps each rule
  back to the source in this file, tagging every entry EVIDENCE / DERIVED / CONVENTION so the
  PRIMARY-vs-SECONDARY distinction survives. **No evidence in this document was dropped to shorten it.**
- Reply-style *authoring* methodology: `categories/07-ai-mcp-prompt-engineering/skill-authoring-framework.md`
- Prose de-AI-ification (tells, voice): `categories/10-communication-humanizer-career/humanizer-de-ai-voice.md`
- Executive-length status writing: `categories/10-communication-humanizer-career/executive-internal-comms.md`
- Why the rules must be re-injected each turn rather than written once (§4, tstrimple): treat as an
  architectural requirement for any agent that carries a reply-style rule.
- KB note: `kb/agent-user-reply-examples.md`

Footer: collected 2026-10-08. If this is promoted into a skill, it belongs in
`07-ai-mcp-prompt-engineering` (agent behaviour authoring) or `10-communication-humanizer-career`
(user-facing prose) — pick one and update `SKILLS_MANIFEST.json` + `INDEX.md` + `README.md` in the
same turn.
