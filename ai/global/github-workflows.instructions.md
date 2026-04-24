# GitHub Workflows Instructions

[Back to Global Instructions Index](index.md)

## Third-Party Action Policy

When adding or reviewing a `uses:` reference in a workflow or composite action, categorise it as follows:

- **Always allowed**: `actions/*` and `github/*` (official GitHub-owned actions)
- **Convert to github-script or local action**: all other third-party actions — see the sections below for guidance on which conversion to apply
- **Acceptable as-is**: actions that require specialised external tooling that cannot be expressed via the GitHub API or a simple bash step — see [Cannot Convert](#actions-that-cannot-be-converted)

Do not add new third-party actions without first determining which category they fall into. When encountering existing third-party actions (including `credfeto/*`), replace them with local equivalents where practical.

## Converting to github-script (wrap in local composite action)

Use `actions/github-script` to replace third-party actions that perform any of the following:

- Reading a file from the workspace
- Creating, finding, approving, or merging a pull request
- Deleting a branch
- Adding or syncing labels on a PR or issue
- Assigning a user to a PR or issue
- Enabling auto-merge on a PR (via GraphQL)
- Checking PR commits for merge commits
- Checking repository visibility (public vs private)

When converting, always wrap the `actions/github-script` step in a **local composite action** placed at `.github/actions/<name>/action.yml`. Do not inline the script directly in workflow files — use the local action instead. This keeps the conversion reusable and the workflow files clean.

The local action must:
- Mirror the inputs and outputs of the replaced action so callers need only change the `uses:` line
- Use `runs.using: composite`
- Pin `actions/github-script` to a specific version (e.g. `@v9.0.0`)
- Pass any file paths or user-controlled strings via `env:` rather than string interpolation into the `script:` body, to prevent injection

### Minimal local action template

```yaml
name: "Action Name"
description: "What it does"

inputs:
  my-input:
    description: "..."
    required: true

outputs:
  my-output:
    description: "..."
    value: ${{steps.the-step.outputs.my-output}}

runs:
  using: composite
  steps:
    - name: "Do Thing"
      id: the-step
      uses: actions/github-script@v9.0.0
      env:
        MY_INPUT: ${{inputs.my-input}}
      with:
        script: |
          // use process.env.MY_INPUT, not ${{inputs.my-input}}, in the script body
          core.setOutput('my-output', result);
```

## Simple Bash Replacements

Some third-party actions perform tasks simple enough to replace with a bash step directly — no `github-script` needed:

- **Merge conflict markers**: `git grep -rl '^<<<<<<< ' --` — fails if any file contains conflict markers
- **Case sensitivity conflicts**: `git ls-files | sort -f | awk 'BEGIN{prev=""} tolower($0)==tolower(prev){print prev; print $0} {prev=$0}'`
- **Tracked files matching `.gitignore`**: `git ls-files -i --exclude-standard`
- **Dotnet SDK version from global.json**: `jq -r '.sdk.version' src/global.json` — read once, set `DOTNET_VERSION` env var; fall back to a default if the file is absent

When replacing an action with a bash step, keep the step name consistent with what it was before so PR history is legible.

## Actions That Cannot Be Converted

Do not attempt to replace these with github-script or bash — they require specialised tooling that the GitHub API does not provide:

- **Docker toolchain**: `docker/build-push-action`, `docker/login-action`, `docker/setup-buildx-action`, `docker/setup-qemu-action`
- **AWS credential management**: `aws-actions/configure-aws-credentials`
- **Git operations** (rebase, auto-commit): `stefanzweifel/git-auto-commit-action`, `bbeesley/gha-auto-dependabot-rebase`
- **Security scanning**: `trufflesecurity/trufflehog`
- **Multi-language linting**: `super-linter/super-linter`
- **Complex config-driven label sync**: `crazy-max/ghaction-github-labeler`

## Version Pinning

All `uses:` references must be pinned to a specific released version tag. Never use `@latest`, `@main`, `@master`, or a bare major version tag (e.g. `@v6`). Branch references are also forbidden — they can change without notice.

Correct: `uses: actions/github-script@v9.0.0`
Wrong:   `uses: actions/github-script@latest`
Wrong:   `uses: actions/labeler@v6`
Wrong:   `uses: some-owner/some-action@fix/some-branch`

## Keeping Actions Up to Date

Whenever you add or modify a `uses:` reference — whether in a workflow file or a composite action — check that all actions referenced in that file are on the latest released version:

1. For each `uses:` in the file, run `gh api repos/<owner>/<action>/releases/latest --jq '.tag_name'` to find the current latest release.
2. If the pinned version is behind, update it in the same commit as the other changes to that file.
3. Do not leave a file with a mix of updated and stale versions after touching it.

This applies to all actions in the file, not just the one being added or changed.

## Bash Steps

Prefer `actions/github-script` over inline bash (`run: |`) for any step that is non-trivial — i.e. anything beyond a single-line command or a straightforward secret/env check. In particular, use `actions/github-script` for:

- Any step that calls the GitHub REST or GraphQL API
- Any step that processes git log output to make API decisions (e.g. creating branches, detecting missing releases)
- Any step that reads or writes files as part of a workflow (not as part of a build tool)
- Any step that manipulates PR metadata (labels, assignees, draft state)

If a bash step performing non-trivial logic appears in more than one workflow or composite action after the repository checkout step, extract it into a local composite action at `.github/actions/<name>/action.yml` rather than duplicating it.

Simple, single-purpose steps that do not call external APIs and are short enough to be self-evident (e.g. `sudo chown -R "$USER:$USER" "$GITHUB_WORKSPACE"`) may remain as bash.

## Dead Steps

If a step's output is never referenced by any subsequent step or job output, remove the step entirely. Do not leave unreferenced steps in workflows or composite actions.

## Checkout Configuration

Minimise the checkout depth and tag fetching to exactly what the job requires:

- **Default**: `fetch-depth: 1` — sufficient for jobs that only read files, run build tools, or scan the working tree
- **Full history** (`fetch-depth: 0`): required only when the job uses `git diff --merge-base`, `git log`, `git rev-list`, or any command that traverses commit history (e.g. changelog diff checks, trufflehog, missing-release detection)
- **`fetch-tags: true`**: required only when the job reads, creates, or compares tags
- **`clean: true`**: include on self-hosted runners to ensure a clean workspace; may be omitted on GitHub-hosted runners if not needed

Jobs that check static file content, scan for markers, or invoke build/lint tools never need deep history or tags.

## Permissions

- Declare `permissions:` at workflow level with the minimum required (default to `contents: read`).
- Override at job level with narrower or broader write permissions as needed.
- Never rely on the default `GITHUB_TOKEN` write permissions without an explicit `permissions:` declaration.

## Workflow Structure

- Use `concurrency:` with a meaningful `group:` key and `cancel-in-progress: true` on workflows triggered by pushes to feature branches (to avoid wasted runs on rapid pushes).
- Use `cancel-in-progress: false` on workflows where in-progress runs must not be interrupted (e.g. release workflows, dependency merge).
- Check required secrets with an explicit `run:` step before performing any operation that depends on them. Fail fast with a clear error message.

## Composite Action Placement

All local composite actions live under `.github/actions/<name>/action.yml`. Name the directory to describe what the action does (e.g. `read-file`, `approve-pr`, `find-pull-request`).

When the same step pattern appears in more than one workflow or composite action, extract it into a local composite action — do not copy-paste.
