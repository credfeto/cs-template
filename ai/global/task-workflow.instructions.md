# Task Workflow Instructions

[Back to Global Instructions Index](index.md)

## Issue Assignment

- **When picking up an issue to work on**, assign it to yourself (`gh issue edit <number> --add-assignee @me`) before starting any work.
- **Do not pick up issues already assigned to someone else.** If an issue is assigned, skip it and move to the next available one.
- Only work on issues that are unassigned, or already assigned to you.

## PR Assignment

- **When creating or updating a PR**, always add yourself as an assignee (`gh pr edit <number> --add-assignee @me`).
- Do this at the time of PR creation, or immediately after if the PR already exists.

## PR and Branch Concurrency

- Only one active branch or open PR per repository at a time.
- Do not start new work (create a new branch or open a new PR) until the current branch has been merged and the PR closed.
- If asked to start new work while a PR is still open, stop and inform the user — do not proceed until either the open PR is merged or the user explicitly instructs you to work in parallel.

## PR Draft State

- **When additional work needs to be added to an open PR** (e.g. addressing review comments, adding missing coverage, fixing CI failures), convert it to a draft immediately before starting: `gh pr ready <number> --undo`.
- Keep the PR in draft for the entire duration of that work — do not flip it back early.
- **Only convert back to ready for review once all work is complete** and Code Tester and Code Reviewer are both satisfied — this is done by PR Submitter at the end of the pipeline, not manually.

## Rules Compliance for In-Flight Work

Whenever any instruction file is added or updated — in this repo or in the global cs-template — all currently open branches and PRs must be re-evaluated against the new rules before being merged.

- After any rule change, review every open branch (`git diff origin/main...HEAD`) and every open PR to check whether the new or updated rules apply to the code already written.
- If any code or documentation on an in-flight branch does not comply, fix it on that branch before continuing other work on it.
- Treat rule compliance the same as a CI failure: work cannot be considered done until the code satisfies all current rules, not the rules that existed when the work started.

This applies to all rule types: coding conventions, test conventions, documentation structure, workflow rules, and AI instruction files themselves.

## Instruction File Source Routing

When an instruction file needs to be changed or a new rule needs to be added:

- If the file originates from `funfair/funfair-server-template` and the required change is not already present in that repository, raise an issue on `funfair/funfair-server-template` to get it added there — do not make the change only in the current repository.
- If the file originates from `credfeto/cs-template` and the required change is not already present in that repository, raise an issue on `credfeto/cs-template` to get it added there — do not make the change only in the current repository.
- If neither of the above applies, make the change directly in the current repository.

## Large Multi-Handler / Multi-App Tasks

When given a task that spans multiple handlers, apps, or components (e.g. "ensure 100% coverage for all handlers", "migrate all projects to a new package"):

1. **Create a top-level GitHub issue** if none is specified. Assign it to whoever asked. Include the full original prompt as the issue body.
2. **Comment findings** on the issue before starting any work (e.g. list handlers found, current state of each).
3. **For each handler/app/component**, create a sub-issue referencing the top-level issue. Use the sub-issue number in the branch name and commit messages.
4. **Work on one handler/component at a time** — do not start the next until the current one is committed and pushed.
5. **Push each branch** when the handler's work is complete.
6. **Close the sub-issue** as soon as the relevant commits have been pushed to the working branch — do not leave sub-issues open after the work is done.

## Sub-issue File Status Tracking

Each sub-issue (not the top-level issue) should contain the list of files being worked on and their status. Keep this updated as work progresses:

- Use a table or checklist with one row per file.
- Mark each file as: `❌ Not started`, `🔄 In progress`, or `✅ Done`.
- Update the sub-issue **immediately after each commit+push** that completes a file.
- For complex files where multiple rounds of changes are needed, update the sub-issue after each commit+push.

The top-level issue should only track handler/app-level status (which sub-issues are open/closed, which branches are merged).

## GitHub Issue Updates

- **Only update issues if the GitHub CLI (`gh`) is installed and properly authenticated.** To check: run `gh auth status`. If it fails or shows unauthenticated, determine current state by reading the code and git log instead — do not attempt issue updates.
- **Update the sub-issue** after each significant piece of work (each commit+push to the branch).
- **Update the top-level issue** when the overall status changes (e.g. a sub-issue is closed, a PR is raised).
- When resuming work, update the issue with current state before continuing.

## Commit, Push, and Issue Update Cadence

For coverage tasks, the cadence per file is:

1. Write tests until the file reaches target coverage.
2. `git commit` the test file (one file per commit).
3. `git push` the branch immediately — do not batch pushes.
4. Update the sub-issue to mark that file as done.
5. Move to the next file.

For complex files where it takes multiple rounds of changes:

1. After each round: commit, push, update the sub-issue.
2. Do not wait until the file is fully complete before the first push.

> **Note:** Commits may take longer than expected due to pre-commit hooks running linters. Do not assume failure if the commit is slow — wait for the hooks to complete before retrying.

## Multi-Agent Implementation and Review Pattern

### Model Selection

Agents that perform mechanical, well-defined tasks (running builds, committing, submitting PRs, monitoring CI, rebasing) must use a smaller/cheaper model. Agents that require judgement, creativity, or diagnosis use the full model.

| Use full model | Use lesser model |
| --- | --- |
| Orchestrator, Code Writer, Code Reviewer, Code Fixer, CI Debugger, Dependency Updater | Code Tester, Committer, Changelog, Rebase Agent, PR Submitter, CI Monitor |

### Failure Handling — No Self-Repair

Mechanical agents must not attempt to interpret or fix failures themselves. When a hardcoded check fails, the agent must:

1. Capture the full output of the failing step.
2. Stop immediately — do not proceed with subsequent steps.
3. Return the failure details verbatim to the calling agent so it can decide how to respond.

The calling agent is responsible for diagnosis and repair.

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

When asked to resume a large task:

- Check the status of existing issues and branches (open, closed, merged).
- If a branch has been merged into main, skip that — the work is done.
- If a branch exists but is unmerged, decide whether to continue it or delete and recreate based on its state.
- Determine current position from issue/branch status and continue from there.
- Update the top-level issue with the current status and next steps before resuming work.
- Update the sub-issue as work progresses.
