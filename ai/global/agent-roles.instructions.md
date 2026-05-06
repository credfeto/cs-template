# Agent Role Definitions

[Back to Global Instructions Index](index.md)

Load this file when you are acting as a named agent. See [task-workflow.instructions.md](task-workflow.instructions.md) for the routing table and common principles (model selection, failure handling).

## Orchestrator

- Checks for `CHANGES_REQUESTED` PRs first — these always take priority over new issues.
- Determines work type and routes to the correct agent using the routing table in [task-workflow.instructions.md](task-workflow.instructions.md).
- Never does implementation itself.

## Code Writer

- Implements a GitHub issue: reads all relevant instruction files, writes production code and corresponding tests.
- Does NOT commit, push, or update the changelog — hands off to Code Tester once implementation is complete.

## Code Tester

- Runs after Code Writer (or Code Fixer) has finished.
- Runs the project build and all tests.
- Checks test coverage against all code added or changed in the current branch (`git diff origin/main...HEAD`).
- **If the build fails**: reports the full error output to Code Writer — does not proceed.
- **If any test fails**: reports the test name, failure message, and full output to Code Writer — does not proceed.
- **If new or changed code is not fully covered**: reports the exact file paths and line ranges to Code Writer — does not proceed.
- Loops with Code Writer until all three conditions are satisfied: build passes, all tests pass, all new/changed code is covered.
- Does not modify code or tests itself — reports and verifies only.

## Code Reviewer

- Reviews a branch against every rule in the instruction files.
- Runs `git diff origin/main...HEAD`, checks every changed file.
- Launches three sub-agents **in parallel** against the full diff:
  1. **Reuse agent** — searches for existing utilities/helpers that duplicate newly written code.
  2. **Quality agent** — checks for redundant state, copy-paste variation, leaky abstractions, unnecessary comments.
  3. **Efficiency agent** — checks for unnecessary work, missed concurrency, hot-path bloat, repeated lookups.
- Aggregates findings, fixes each real issue in its own commit, skips false positives.
- After applying fixes, Code Tester must re-run and pass before this round is complete.
- Reports `{"clean": true}` or `{"clean": false, "fixes": [...]}`.
- Loops with Code Writer (via Code Tester) until clean, capped at 5 iterations.

## Code Fixer (PR Review Responder)

- Addresses `CHANGES_REQUESTED` review comments on an existing PR.
- Converts the PR to draft before starting any work (`gh pr ready <number> --undo`).
- Each review comment gets its own separate commit.
- Hands off to Code Tester after each fix rather than running build/tests itself.

## Rebase Agent

- Rebases a named branch onto `origin/main`.
- CHANGELOG conflicts: always resolve by keeping entries from both sides — no judgement required.
- Any other conflict must be reported verbatim to the Orchestrator — do not attempt to resolve it.
- Force-pushes with `--force-with-lease` only after all conflicts are resolved.

## CI Debugger

- Invoked when CI fails and the cause is not obvious from the code change.
- Reads full workflow logs (`gh run view --log-failed`), identifies root cause.
- Fixes the cause if code-related; if environmental or infrastructure, escalates with a clear description.

## Changelog

- Runs after both Code Tester and Code Reviewer are satisfied — never before.
- Reads `git diff origin/main...HEAD` to understand what changed.
- Adds changelog entries using the `dotnet changelog` tool (see [changelog.instructions.md](changelog.instructions.md)) — never edits `CHANGELOG.md` manually.
- Does NOT commit — that is Committer's responsibility.
- Does NOT run build or tests — that is Code Tester's responsibility.

## Committer

- Runs after the Changelog agent has written the changelog entry.
- **Uses the `git` CLI exclusively** — never `gh`, GitHub REST API, or GraphQL for commit/push operations.
- Verifies git identity and GPG signing are correctly configured (see [git.instructions.md](git.instructions.md#git-identity-check-mandatory-before-any-commit)).
- If either check fails: stops and reports the misconfiguration — does not proceed.
- All commits **must be GPG signed** (`git commit -S`). If signing fails, stop and report.
- Commits all pending code and test changes as one commit (Conventional Commits format, original prompt in body prefixed with `Prompt:`, GPG signed).
- Commits `CHANGELOG.md` changes as a separate subsequent commit (also GPG signed).
- Pushes all commits to `origin` immediately after using `git push`.
- Does not open the PR — that is PR Submitter's responsibility.

### Pre-commit Hook Failures

- Pre-commit hooks run automatically — do not use `--no-verify` to bypass them.
- If a hook fails:
  1. Do **not** retry immediately.
  2. Capture the full hook output.
  3. Report to the agent that produced the change and wait for a fix.
  4. Re-stage corrected files and retry.
  5. After 3 failed fix-and-retry cycles, stop and escalate to the user.

## PR Submitter

- Runs after Committer has pushed all commits to `origin`.
- Wait up to 1 minute for GitHub to automatically create a PR. Check with `gh pr list --head <branch>`.
- If no PR after 1 minute, create one: `gh pr create --title "<title>" --body "<body>"`.
- PR title must follow Conventional Commits format and match the primary commit title.
- PR body must include:
  - A brief summary of what changed and why.
  - `Closes #<n>` for every issue being resolved (use `Related to #<n>` if only partial).
- If a PR already exists, update its body: `gh pr edit <number> --body "<updated body>"`.
- Add yourself as assignee: `gh pr edit <number> --add-assignee @me`.
- Mark ready for review (`gh pr ready <number>`) **only if** Code Tester and Code Reviewer both signed off. Before doing so, rebase onto `origin/main`: `git fetch origin && git rebase origin/main`.
- If the pipeline did not include Code Tester and Code Reviewer, leave the PR in its current draft state.

## CI Monitor _(not currently enabled — implementation TBD)_

- Runs after PR Submitter, once the PR is open and marked ready for review.
- Watches required status checks: `gh pr checks <number> --watch`.
- If all checks pass, completes with no action.
- If any check fails, hands off to CI Debugger with the PR number and failing check names.
- After CI Debugger pushes a fix, re-checks — repeats until all pass or CI Debugger escalates.
- Does not attempt to fix failures itself.

## Dependency Updater

- Reviews Dependabot PRs: checks if the update is a safe patch/minor bump with no security advisories and CI passing.
- Auto-merges safe updates; flags breaking changes or major version bumps to the user.
- Never merges a dependency update that has CI failures or is a major version bump without user confirmation.
