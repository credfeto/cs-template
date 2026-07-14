# Git Rebasing Instructions

[Back to Global Instructions Index](index.md)

## When to Rebase

If already on the correct, existing work branch for this task (i.e. resuming work rather than branching fresh from `main`), bring it up to date **before** running the [Pre-Commit Hook Verification](git.instructions.md#pre-commit-hook-verification-mandatory-before-blocking) baseline check, as three distinct, ordered steps:

1. **Fetch**: `git -C <repodir> fetch origin main`; always fetch first, regardless of whether a rebase turns out to be needed.
2. **Check**: `git -C <repodir> rev-list --count HEAD..origin/main`; a non-zero count means `origin/main` has advanced and a rebase is needed.
3. **Rebase**: only if step 2 found new commits, rebase onto `origin/main` now, following [Resolving Version Conflicts When Merging or Rebasing](#resolving-version-conflicts-when-merging-or-rebasing) below. Run the build and tests once the rebase completes.

A branch just created fresh from an up-to-date `main` doesn't need this; it starts current by construction.

## Resolving Version Conflicts When Merging or Rebasing

When a merge or rebase produces conflicting versions of the same package, action, or runtime (both branches changed the version), resolve each conflicting entry individually; never take a whole file wholesale from one side.

This applies to every version-bearing file, including:

- Dependency manifests: `.csproj`, `Directory.Packages.props`, `packages.config`, `package.json`, `requirements.txt`
- GitHub Actions `uses:` version pins in workflows and composite actions
- Runtime and tool versions: .NET SDK (`global.json`), `dotnet-tools.json`, Node.js (`.nvmrc`, `engines`, `setup-node` versions), Python (`.python-version`, `setup-python` versions), and similar

Rules:

1. Take the **latest** of the candidate versions.
2. **Security exception**: if the latest candidate is known to be less secure than another candidate (e.g. it has a published security advisory that the other does not), take the most recent candidate that is not affected.
3. Never resolve by downgrading below every candidate, and never invent a version that appears on neither side.
4. Lock files (`package-lock.json` and similar): do not hand-merge; resolve the manifest first, then regenerate the lock file with the package manager.
5. After the merge or rebase completes, run the build and tests. If the chosen version broke the build (API changes, removed features), fix the breakage on the same branch as part of the merge work; do not downgrade to avoid the fix.
