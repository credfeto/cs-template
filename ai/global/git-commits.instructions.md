# Git Commit Instructions

[Back to Global Instructions Index](index.md)

Load this file when about to commit or acting as the Committer agent. See [git.instructions.md](git.instructions.md) for the mandatory identity check and branch verification.

## Commit Rules

- **Never create an empty commit.** Verify `git diff --cached --name-only` lists at least one file before running `git commit`.
- Work in small increments — one logical change per commit:
  - Coverage tasks: commit each file individually as it reaches 100% — do not batch.
  - Dead/unreachable code removal: separate commit from test changes, after running tests on the entire handler or app; one method or function per commit.
  - Shared code removal: only after the entire codebase has 100% coverage; each removal is its own commit.
  - Never amend an existing commit — always create a new one.
- Push to `origin` after every commit.

## Commit Message Format

- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.
- Include the user's original prompt verbatim in the commit body, prefixed with `Prompt:` followed by a space — not in the title.
