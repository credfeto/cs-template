# NPM Package Version Instructions

> Load when: adding, updating, installing, or reviewing npm/JavaScript/TypeScript package dependencies.

[Back to Global Instructions Index](index.md)

- Adding any new npm package requires explicit human approval after a full security review; see [packages.instructions.md](packages.instructions.md#third-party-packages-require-human-approval-mandatory). Exception: a package a pre-commit component tool's own output (e.g. `npm audit`) demands as the specific fix for its failure; see [Conflict Resolution](packages.instructions.md#conflict-resolution-pre-commitcomponent-tool-mandated-package-changes-mandatory).

## Registry Lookup

- Before searching for or installing a package, check which registry is actually configured: `npm config get registry`. Use that registry for lookups rather than assuming the public npm registry, since it may point at a private feed, proxy, or mirror.

## Installing Dependencies (MANDATORY)

- Install with exactly `npm ci --ignore-scripts`, or `npm ci` if the repo needs its install scripts, as one plain command from the working directory, and read the output from the tool result.
- Never add `--prefix`, a `cd`, a redirect to a file (`> $TMPDIR/npm.log`), a `;`/`&&` chain, or a `| tail`, because any of those makes the permission allow list reject the call while the plain form is allowed.

## Fixed Package Versions

- Always use **exact (pinned) version numbers** in `package.json`, no `^` or `~` prefixes.
- New packages must be added with `npm install --save-exact` (or `npm install -E`) to avoid range specifiers.
- Dev dependencies must also use exact versions: `npm install --save-dev --save-exact`.
- Do not use `*`, `latest`, or any semver range expressions.
- Updates to existing packages must be **explicit and intentional**: specify the target version directly rather than relying on range resolution.
- When updating a package, update only that package (and its required peer dependencies); do not allow transitive upgrades to pull in unreviewed version changes.
- When a merge or rebase produces conflicting versions of the same package, take the latest secure candidate and regenerate `package-lock.json` rather than hand-merging it; see [git-rebasing.instructions.md](git-rebasing.instructions.md#resolving-version-conflicts-when-merging-or-rebasing).
