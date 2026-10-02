# Architecture: kbcodedev-skills

## Design Philosophy
1. **Advanced & Simplified**: High signal, zero conversational filler, direct execution pipelines.
2. **Contract-Driven**: Every skill defines Triggers, Input JSON Contracts, Output Contracts, and Invariant Principles.
3. **Safety Gated**: Integrated 3-tier risk assessment, non-destructive fallbacks, and 5-Whys root cause analysis.
4. **ReAct & Tool Ergonomics**: Engineered for minimal context waste, dynamic batch widths, and KV-cache reuse.
5. **Multi-Runtime & Tooling Integration**: Native TypeScript & Python implementations with automated schema validation and prompt export harnesses.

## Metadata & Search Taxonomy
Every skill in `SKILLS_MANIFEST.json` contains:
- `id`: Unique kebab-case identifier (e.g. `kbcodedev/autonomous-react-loop`)
- `runtime`: Target runtime (`typescript`, `python`, `go`, `rust`, `swift`, `kotlin`, `dart`, `c/cpp`, `devops`, `agnostic`)
- `difficulty`: Complexity tier (`intermediate`, `advanced`, `expert`)
- `tags`: High-signal keyword array for CLI and agent search discovery

See [[categories]] for individual skill mappings and [[cheatsheet]] for quick lookups and CLI commands.
