# Skill: Typer, Click & Rich CLI Terminal Application Engine
`id`: `kbcodedev/typer-click-rich-cli-engine`  
`category`: `03-software-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building production-grade, type-safe command-line interfaces (CLIs), developer tools, and terminal applications in Python using Typer, Click, Rich (tables, progress bars, live status spinners, syntax highlighting), interactive user prompts, nested subcommands, autocompletion, and exit code standards.
- **Triggers**: Creating modern Python CLI tools, building DevOps automation scripts, converting messy `argparse` scripts into clean type-annotated CLIs, and designing rich terminal dashboards.
- **Prerequisites**: Python 3.11+, Typer 0.12+, Click 8.1+, Rich 13.7+, Shellingham (for autocompletion).

---

## 2. Core Mental Model & Invariant Principles
1. **Type-Annotated CLI Contracts**: Use standard Python type hints (`Annotated[str, typer.Option(...)]`, `Path`, `Enum`) as the single source of truth for CLI argument parsing, help documentation, validation, and shell autocompletion.
2. **Standard POSIX Exit Codes**: Always terminate CLI commands with explicit, standard exit codes (0 = Success, 1 = General Error, 2 = Usage/Argument Syntax Error, 130 = Script Interrupted by Ctrl+C). Never allow unhandled tracebacks to dump on user terminal unless `--debug` is explicitly passed.
3. **Console vs. Stdout Discipline**: Send human-friendly Rich formatting, progress spinners, and tables to `stderr` (or interactive TTY only); send machine-parseable data (JSON, raw strings) to `stdout` when piped to downstream commands (`| jq`, `> file.json`).
4. **Graceful Signal Handling**: Intercept `SIGINT` (Ctrl+C) and `SIGTERM` gracefully, cleaning up open file descriptors and temporary working directories before termination.

---

## 3. High-Signal Execution Workflow

```
[User Terminal Command]
          │
          ▼
┌──────────────────────────────────────┐
│ Phase 1: Argument Parsing & Type     │ ── Typer type coercion, Enum validation,
│          Validation                  │    shell autocompletion resolution
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: Configuration & Context     │ ── Load .env / config.yaml, global flags
│          Initialization              │    (--verbose, --json, --dry-run)
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Core Command Execution &    │ ── Rich progress bars / live spinners,
│          Feedback                    │    subprocess orchestration, API calls
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Output Rendering & Standard │ ── Rich Table / JSON egress, exit code
│          Exit Code Egress            │    (0 on success, non-zero on failure)
└──────────────────────────────────────┘
```

### Phase 1: Typer App with Rich Terminal Formatting

```python
# cli/main.py
import sys
from enum import Enum
from pathlib import Path
from typing import Annotated, Optional
import typer
from rich.console import Console
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn

app = typer.Typer(
    name="deployer",
    help="🚀 Enterprise Cloud Deployment & Infrastructure CLI",
    add_completion=True,
    no_args_is_help=True,
)

console = Console()
err_console = Console(stderr=True)

class Environment(str, Enum):
    DEV = "dev"
    STAGING = "staging"
    PROD = "prod"

@app.command()
def deploy(
    service_name: Annotated[str, typer.Argument(help="Name of the service to deploy")],
    env: Annotated[Environment, typer.Option("--env", "-e", help="Target deployment environment")] = Environment.DEV,
    config_file: Annotated[Optional[Path], typer.Option("--config", "-c", exists=True, file_okay=True, dir_okay=False, help="Path to config file")] = None,
    dry_run: Annotated[bool, typer.Option("--dry-run", help="Simulate deployment without applying changes")] = False,
    output_json: Annotated[bool, typer.Option("--json", help="Output machine-readable JSON to stdout")] = False,
):
    """Deploy a microservice to Kubernetes or Cloud Run."""
    if env == Environment.PROD and not dry_run:
        confirm = typer.confirm(f"⚠️ Are you sure you want to deploy {service_name} to PRODUCTION?", default=False)
        if not confirm:
            err_console.print("[yellow]Deployment cancelled by user.[/yellow]")
            raise typer.Exit(code=1)

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TaskProgressColumn(),
        console=err_console,
    ) as progress:
        task = progress.add_task(f"Deploying {service_name} to {env.value}...", total=100)
        # Step 1: Validate manifests
        progress.update(task, advance=30, description="Validating manifests...")
        # Step 2: Push container image
        progress.update(task, advance=40, description="Pushing container image...")
        # Step 3: Apply rolling update
        progress.update(task, advance=30, description="Applying rolling update...")

    if output_json:
        console.print(f'{{"service": "{service_name}", "env": "{env.value}", "status": "deployed"}}')
    else:
        table = Table(title="Deployment Status Summary", show_header=True, header_style="bold magenta")
        table.add_column("Service", style="cyan")
        table.add_column("Environment", style="green")
        table.add_column("Status", style="bold green")
        table.add_row(service_name, env.value, "SUCCESS" if not dry_run else "DRY_RUN")
        console.print(table)

    raise typer.Exit(code=0)

if __name__ == "__main__":
    app()
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "frameworks": ["typer", "click", "rich"],
  "features": ["nested_commands", "type_annotations", "progress_bars", "posix_exit_codes"]
}
```

### Output Contract
```json
{
  "cli_behavior": {
    "interactive": "Rich tables, colors, prompts on TTY",
    "pipeable": "Clean JSON to stdout when --json flag or non-TTY pipe detected",
    "exit_codes": "0 for success, 1 for user abort/error, 2 for bad arguments"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Dumping Raw Tracebacks to Terminal**: Allowing uncaught Python exceptions to spew stack traces on CLI users. Catch exceptions and display formatted Rich error boxes with clear action steps.
- ❌ **Printing Progress Logs to Stdout**: Corrupting shell pipeline output (`deploy --json | jq`) by writing progress spinners to `stdout` instead of `stderr`.

---

## 6. Real-World Production Example

```markdown
**Task**: Build a database migration and seed CLI for developer onboarding.

1. **Command Structure**: Created `db create`, `db migrate`, and `db seed` subcommands using Typer.
2. **Interactive Progress**: Rendered Rich live spinners showing real-time schema execution and data seeding progress.
3. **Safety Prompts**: Implemented interactive y/N confirmation gates with red warning banners when targeting production databases.

**Outcome**: Adopted by 60+ engineers, cutting onboarding environment setup time from 45 minutes to a single `setup-env` command.
```
