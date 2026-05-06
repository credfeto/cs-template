# Changelog Instructions

[Back to Global Instructions Index](index.md)

Load this file when adding changelog entries or acting as the Changelog agent.

## Format and Tooling

- Maintain `CHANGELOG.md` in [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.
- The `Credfeto.Changelog.Cmd` dotnet tool is the **only** permitted way to modify `CHANGELOG.md` — never edit manually.
- `CHANGELOG.md` must be excluded from markdownlint by ensuring it is listed in `.markdownlintignore` at the repo root. If `.markdownlintignore` does not exist, create it and add `CHANGELOG.md` as the first entry.
- Changelog entries must be understandable by someone who has not read the code — describe what changed and why it matters, not how it was implemented.

## When to Add an Entry

Add a changelog entry for every task, **unless**:

- This is the `credfeto/cs-template` repository — the `CHANGELOG.md` there is kept blank for new repositories using the template.
- It is purely a documentation change with no effect on production code.
- It is an AI instructions change.

## Adding an Entry

Use the `-a` flag with one of the standard [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) change types:

```bash
dotnet changelog -f CHANGELOG.md -a Added      -m "Brief description of what was added"
dotnet changelog -f CHANGELOG.md -a Changed    -m "Brief description of what changed and why"
dotnet changelog -f CHANGELOG.md -a Deprecated -m "Brief description of what is now deprecated"
dotnet changelog -f CHANGELOG.md -a Removed    -m "Brief description of what was removed"
dotnet changelog -f CHANGELOG.md -a Fixed      -m "Brief description of what was fixed"
dotnet changelog -f CHANGELOG.md -a Security   -m "Brief description of the security fix"
```

## Removing an Entry

Use the `-r` flag with the change type and the exact message to remove:

```bash
dotnet changelog -f CHANGELOG.md -r <ChangeType> -m "<exact message to remove>"
```

## All Other Operations

```bash
dotnet changelog --help
```
