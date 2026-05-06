# Git Commit Instructions

[Back to Global Instructions Index](index.md)

Load this file when you are about to commit, or when acting as the Committer agent. See [git.instructions.md](git.instructions.md) for the mandatory identity check and branch verification that must always run before committing.

## Commit Rules

- **Never create an empty commit.** Before running `git commit`, verify that `git diff --cached --name-only` lists at least one file. If the staging area is empty, stop and investigate — do not proceed.
- Work in small increments — one logical change per commit:
  - When achieving 100% coverage, commit each file as soon as it reaches 100% individually; do not batch.
  - Dead/unreachable code removal must be a separate commit from test changes, made only after running tests on the entire handler or app; remove one method or function per commit.
  - For shared code removal, first verify the entire codebase does not access it — this can only be done once all apps and handlers have 100% coverage; each removal is its own commit.
  - Never amend an existing commit; always create a new one.
- After every commit, push to `origin` immediately.

## Commit Message Format

- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format for all commit messages.
- Always include the user's original prompt verbatim in the commit description (body), prefixed with `Prompt:` followed by a space. Do not include it in the commit title.
