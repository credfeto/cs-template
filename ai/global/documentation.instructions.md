# Documentation Instructions

[Back to Global Instructions Index](index.md)

## README

- Keep `README.md` accurate and up to date; rewrite template placeholder content before starting work.
- Update the configuration section in the same commit whenever a config option (`appsettings.json`, options class, or env var) is added, removed, or renamed — include type, default, and description.
- For changelog format and tooling see [changelog.instructions.md](changelog.instructions.md).

### Required Sections (in this order)

1. **Title and one-line description** — state what the project does, not just what it is named.
2. **Badges** — see [Badge Guidelines](#badge-guidelines) below.
3. **Overview** — 2–3 sentences explaining the purpose and key features.
4. **Quick Start / Simple Example** — the minimal copy-paste snippet that gets something working; no preamble.
5. **Installation** — e.g. `dotnet add package <Name>` or the NuGet Package Manager command.
6. **Usage / Examples** — one or two brief, self-contained examples; link to `docs/` for more complex ones.
7. **Documentation** — link to the `docs/` folder and any generated API documentation (e.g. DocFX, Doxygen, GitHub Pages).
8. **Changelog** — link to `CHANGELOG.md`.
9. **Contributing** — link to `CONTRIBUTING.md`.
10. **Security** — link to `SECURITY.md`.
11. **Licence** — link to `LICENSE`.
12. **Contributors** — all-contributors section (keep the auto-generated markers in place).

Omit any section that does not apply (e.g. no Installation section for a library with no NuGet package), but never invent placeholder sections.

### Badge Guidelines

Place all badges near the top of the file, after the title but before the overview prose.

#### CI / Build Status

Use a table to separate `main`/pre-release from `release` builds:

```markdown
| Branch  | Status |
|---------|--------|
| main    | [![Build: Pre-Release](https://github.com/OWNER/REPO/actions/workflows/build-and-publish-pre-release.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/build-and-publish-pre-release.yml) |
| release | [![Build: Release](https://github.com/OWNER/REPO/actions/workflows/build-and-publish-release.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/build-and-publish-release.yml) |
```

#### NuGet (when the project publishes a package)

```markdown
[![NuGet](https://img.shields.io/nuget/v/PACKAGE_NAME.svg)](https://www.nuget.org/packages/PACKAGE_NAME)
[![NuGet Downloads](https://img.shields.io/nuget/dt/PACKAGE_NAME.svg)](https://www.nuget.org/packages/PACKAGE_NAME)
```

#### Code Coverage

```markdown
[![codecov](https://codecov.io/gh/OWNER/REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/OWNER/REPO)
```

#### Licence

```markdown
[![Licence](https://img.shields.io/github/license/OWNER/REPO)](LICENSE)
```

#### Open Issues / Bugs

```markdown
[![Bugs](https://img.shields.io/github/issues/OWNER/REPO/bug)](https://github.com/OWNER/REPO/issues?q=is%3Aopen+is%3Aissue+label%3Abug)
```

Only include badges that are actively maintained and reflect real state. Remove any badge whose target service is unavailable or whose data is stale.

## Additional Documentation

- All non-template repos must have a `docs/` folder; template repos must not.
- Place all docs and architecture diagrams (except `README.md`/`CHANGELOG.md`) in `docs/`; keep them current.
- Architecture diagrams: show folder structure only — omit individual files and package versions; prefer SVG over raster formats.
