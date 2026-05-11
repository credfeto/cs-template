# Git Commit Instructions

[Back to Global Instructions Index](index.md)

Load this file when about to commit or acting as the Committer agent. See [git.instructions.md](git.instructions.md) for the mandatory identity check and branch verification.

## Commit Rules

- **Never create an empty commit.** Verify `git diff --cached --name-only` lists at least one file before running `git commit`.
- Never amend an existing commit — always create a new one.
- Push to `origin` after every commit.

## Unexpected Reformatting During Commit (MANDATORY)

Before finalising a commit, check whether pre-commit hooks or formatters have modified any files that were **not part of your intended change set** (e.g. CSharpier, end-of-file fixer, trailing-whitespace normaliser).

If they have:

1. Do **not** stage or commit the unrequested reformatting.
2. Abort the commit.
3. Report to the user: list the unexpectedly modified files, which hook/formatter changed them, and that the repository has pre-existing formatting violations.
4. Wait for explicit instructions before continuing.

Do not use `--no-verify` to bypass hooks as a workaround.

## Commit Message Format

- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.
- Include the user's original prompt verbatim in the commit body, prefixed with `Prompt:` followed by a space — not in the title.
