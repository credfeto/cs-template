# Git Commit Instructions

[Back to Global Instructions Index](index.md)

Load this file when about to commit or acting as the Committer agent. See [git.instructions.md](git.instructions.md) for the mandatory identity check and branch verification.

## Commit Rules

- **Never create an empty commit.** Verify `git diff --cached --name-only` lists at least one file before running `git commit`.
- Never amend an existing commit — always create a new one.
- Push to `origin` after every commit.
- You are not allowed to bypass hooks or formatters. If they fail, stop and report the failure — do not bypass or attempt to fix them yourself.
- You are not allowed to bypass commit message validation. If it fails, stop and report the failure — do not bypass or attempt to fix it yourself.
- You are not allowed to change linting or formatting rules to make a commit pass. If they fail, stop and report the failure — do not change rules or attempt to fix it yourself.
- You are not allowed to change ignore files in any way to make a commit pass. If they cause a failure, stop and report the failure — do not change ignore files or attempt to fix them yourself.

## Unexpected Reformatting During Commit (MANDATORY)

If hooks or formatters modify files **not in your intended change set**:

1. Do not stage the unrequested changes.
2. Abort the commit.
3. Report the affected files and which hook/formatter changed them.
4. Wait for explicit instructions.

## Commit Message Format

- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.
- Include the user's original prompt verbatim in the commit body, prefixed with `Prompt:` followed by a space — not in the title.
