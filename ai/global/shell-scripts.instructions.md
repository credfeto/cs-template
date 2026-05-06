# Shell Script Instructions

[Back to Global Instructions Index](index.md)

## Shebang

- Prefer `#!/bin/sh` over `#!/bin/bash` for new scripts and when maintaining existing ones.
- Only use `#!/bin/bash` if the script requires bash-specific functionality that cannot be achieved without shelling out to another executable.

## Linting

All `#!/bin/sh` scripts must pass both `shellcheck` and `checkbashisms` before committing.

## Visual Indicators

> These conventions apply to **standalone shell scripts only**. GitHub Actions `run:` steps use emoji indicators — see [github-workflows.instructions.md](github-workflows.instructions.md#step-output-formatting).

Use three output helper functions for all user-facing output. See [shell-scripts.examples.md](shell-scripts.examples.md) for implementations:

- `die` — fatal error, prints a red `✗` prefix to stderr, exits non-zero
- `success` — completion, prints a green `✓` prefix
- `info` — progress announcement before a step begins, prints a green `→` prefix

Use `printf` rather than `echo` for portable escape-sequence handling. Always direct `die()` output to stderr (`>&2`).

## AI Agent Detection

Scripts that behave differently when invoked by an AI agent must use the standard `is_ai_agent` helper — see [shell-scripts.examples.md](shell-scripts.examples.md) for the implementation and usage pattern.

- Define `is_ai_agent` alongside the other output helpers near the top of the script.
- Keep the source URL comment so future maintainers know where `CLAUDECODE` comes from.

## No Naked echo or printf

Never use bare `echo` or `printf` for user-facing output — always route through `die`, `success`, or `info`.

Interpolate variables directly into the string argument:

```sh
info "Opening port ${PORT}/tcp..."   # correct
printf '→ Opening port %s/tcp...\n' "${PORT}"  # wrong — naked printf
```
