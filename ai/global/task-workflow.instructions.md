# Task Workflow Instructions

[Back to Global Instructions Index](index.md)

## Issue Assignment

- Assign the issue to yourself before starting (`gh issue edit <number> --add-assignee @me`).
- Only work on unassigned issues or issues already assigned to you.

## PR Assignment

Add yourself as assignee when creating or updating a PR: `gh pr edit <number> --add-assignee @me`.

## PR and Branch Concurrency

- Only one active branch or open PR per repository at a time.
- Do not create a new branch or PR until the current one is merged and closed.

## PR Draft State

- When adding work to an open PR (review comments, missing coverage, CI fixes), convert to draft first: `gh pr ready <number> --undo`.
- Keep it in draft for the entire duration — only PR Submitter converts it back once Code Tester and Code Reviewer are both satisfied.

## Rules Compliance for In-Flight Work

Whenever an instruction file is added or updated, re-evaluate all open branches and PRs:

- Check every open branch (`git diff origin/main...HEAD`) and PR against the new rules.
- Fix any non-compliance on the branch before continuing.
- Treat rule compliance the same as a CI failure — work is not done until it satisfies all current rules.

Applies to all rule types: coding conventions, test conventions, documentation, workflow rules, and AI instruction files.

## Instruction File Source Routing

- If the file originates from `funfair/funfair-server-template`, raise an issue there first.
- If the file originates from `credfeto/cs-template`, raise an issue there first.
- Otherwise, make the change directly in the current repository.

## Large Multi-Handler / Multi-App Tasks

1. Create a top-level GitHub issue (if none specified); assign it; include the full original prompt as the body.
2. Comment findings on the issue before starting (e.g. list handlers found, current state).
3. For each handler/app/component, create a sub-issue referencing the top-level issue; use the sub-issue number in branch names and commit messages.
4. Work on one handler/component at a time — commit and push before starting the next.
5. Close the sub-issue as soon as the relevant commits are pushed — do not leave them open after the work is done.

## Sub-issue File Status Tracking

Each sub-issue must list files being worked on with status — use a table or checklist:

- `❌ Not started` / `🔄 In progress` / `✅ Done`
- Update immediately after each commit+push.

The top-level issue tracks only handler/app-level status (which sub-issues are open/closed, which branches merged).

## GitHub Issue Updates

- Only update issues if `gh` is installed and authenticated (`gh auth status`); otherwise read code and git log for state.
- Update the sub-issue after each significant commit+push.
- Update the top-level issue when overall status changes (sub-issue closed, PR raised).
- When resuming, update the issue with current state before continuing.

## Commit, Push, and Issue Update Cadence

- One logical change per commit; do not batch unrelated changes.

Per-file cadence for coverage tasks:

1. Write tests until the file reaches target coverage.
2. `git commit` the test file.
3. `git push` immediately — do not batch.
4. Update the sub-issue to mark the file done.
5. Move to the next file.

For complex files, commit+push+update after each round — do not wait until fully complete.

> Pre-commit hooks may make commits slow — wait for them to complete before assuming failure.

## Multi-Agent Implementation and Review Pattern

### Model Selection

| Use full model | Use lesser model |
| --- | --- |
| Orchestrator, Code Writer, Code Reviewer, Code Fixer, CI Debugger, Dependency Updater | Code Tester, Committer, Changelog, Rebase Agent, PR Submitter, CI Monitor |

### Failure Handling — No Self-Repair

Mechanical agents must not interpret or fix failures. When a check fails:

1. Capture the full output.
2. Stop immediately.
3. Return failure details verbatim to the calling agent.

### Routing Rules

| Work type | Agent sequence |
| --- | --- |
| New feature / bug fix / refactor | Code Writer → Code Tester (loop ≤5 with Code Writer) → Code Reviewer (loop ≤5, re-running Code Writer and Code Tester each round) → Changelog → Committer → PR Submitter → CI Monitor |
| `CHANGES_REQUESTED` on existing PR | Code Fixer → Code Tester (loop ≤5 with Code Fixer) → Code Reviewer (loop ≤5, re-running Code Fixer and Code Tester each round) → Changelog → Committer → PR Submitter → CI Monitor |
| Coverage-only task | Code Writer (tests only) → Code Tester (loop ≤5 with Code Writer) → Code Reviewer (loop ≤5, re-running Code Writer and Code Tester each round) → Changelog → Committer → PR Submitter → CI Monitor |
| Documentation-only | Code Writer (docs only) → PR Submitter |
| Rebase requested | Rebase Agent → PR Submitter |
| CI failure (unknown cause) | CI Debugger |
| Dependabot / dependency update | Dependency Updater |

For detailed agent role definitions, see [agent-roles.instructions.md](agent-roles.instructions.md).

## Resuming Interrupted Work

- Check the status of existing issues and branches.
- Skip merged branches — the work is done.
- For unmerged branches, decide whether to continue or delete and recreate.
- Update the top-level issue with current status and next steps before resuming.
