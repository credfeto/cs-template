# Shell Script Instructions

> Load when: any `.sh` file is present or shell script work is needed.

[Back to Global Instructions Index](index.md)

## Shebang

- Prefer `#!/bin/sh`; only use `#!/bin/bash` if bash-specific functionality is genuinely required.
- All `#!/bin/sh` scripts must pass `shellcheck` and `checkbashisms` before committing.

## Output Helpers

> Applies to **standalone shell scripts only**. GitHub Actions `run:` steps use emoji indicators; see [github-workflows.instructions.md](github-workflows.instructions.md#step-output-formatting).

Use `die`, `success`, and `info` for all user-facing output; never bare `echo` or `printf`. See [shell-scripts.examples.md](shell-scripts.examples.md) for implementations and usage examples.

- `die`: fatal error, red `✗` to stderr, exits non-zero
- `success`: completion, green `✓`
- `info`: progress/step announcement, green `→`

## AI Agent Detection

Scripts that behave differently when invoked by an AI agent must use the standard `is_ai_agent` helper; see [shell-scripts.examples.md](shell-scripts.examples.md).

## Git File Lists

Read git file lists NUL-separated per [File Names and Git File Lists](git.instructions.md#file-names-and-git-file-lists-mandatory):

- Never use `xargs` in scripts or workflow steps, because it is on the `command-blocklist` (see [claude-hooks.instructions.md](claude-hooks.instructions.md)).
- Make a script that reads a git file list `#!/bin/bash` and loop with `while IFS= read -r -d '' f; do ...; done < <(git ls-files -z)`, because process substitution is bash-only and fails `checkbashisms`. Use `mapfile -d '' files < <(git ls-files -z)` only where bash 4.4 or later is guaranteed, because `mapfile -d` needs bash 4.4 and macOS `/bin/bash` is 3.2.
- Only where a script cannot be switched to bash, use `git ls-files -z | tr '\0' '\n' | while IFS= read -r f; do ...; done`. This does not support names containing a newline, which the [ASCII file-name rule](git.instructions.md#file-names-and-git-file-lists-mandatory) already bans, and the loop runs in a subshell, so variables it sets are lost after `done`.
- Neither form surfaces a `git ls-files` failure: `#!/bin/sh` has no `pipefail`, so the pipeline returns the loop's status, and bash discards a process substitution's exit status even under `set -e`, so a script that checks an empty list exits 0 having checked nothing (for example when git refuses a checkout with `detected dubious ownership`). Where an empty list would silently pass, run git on its own first and check its status, for example `git ls-files -z >"$tmp" || die "git ls-files failed"`, then read the list from `"$tmp"`.

## Argument Size Limits

Never pass a value of unbounded or externally-sourced size (an API response, accumulated log/comment data, file contents, etc.) as a single command-line argument to an external command. Use stdin (piping), or a temp file with a flag designed for it (e.g. `jq --slurpfile`/`--rawfile` instead of `--argjson`/`--arg`), instead.

- This applies even when the total combined argument list looks well under `ARG_MAX`: a single argv string is separately capped at `MAX_ARG_STRLEN` (128KiB on Linux), and that per-string ceiling is the one that actually gets hit in practice with growing data.
- Values that are inherently small and bounded (flags, IDs, short fixed strings, scalars) are fine as regular arguments.
