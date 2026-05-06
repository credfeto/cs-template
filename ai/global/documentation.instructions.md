# Documentation Instructions

[Back to Global Instructions Index](index.md)

## README

- `README.md` must describe what the repository is for and be kept up to date.
- If `README.md` still contains template placeholder content, rewrite it to reflect the actual repository when work begins.
- `README.md` must include the following where applicable:
  - GitHub Actions workflow badges for **debug** and **release** builds/tests.
  - Link to project documentation (e.g. `docs/`).
  - Link to build instructions.
  - Link to `CONTRIBUTING.md`.
  - Link to `SECURITY.md`.
  - Link to `CHANGELOG.md`.

## Configuration Documentation

- Whenever a configuration option is added, removed, or renamed (in `appsettings.json`, an options class, or env var mapping), update the `README.md` configuration section in the same commit.
- The section must accurately reflect all current options, their types, default values, and a brief description.

## CHANGELOG

- `README.md` must link to `CHANGELOG.md`.
- For format, tooling, and how to add/remove entries, see [changelog.instructions.md](changelog.instructions.md).

## Additional Documentation

- Generate and maintain docs for all repos except `credfeto/cs-template` — that repo must not contain a `docs/` folder.
- Place documentation and architecture diagrams (other than `README.md` and `CHANGELOG.md`) in the `docs/` folder.
- Keep docs up-to-date as changes are applied; create when missing.
- In architecture diagrams, show folder structure — do not list every file or package version.
- Prefer vector formats (SVG) over raster (PNG, JPEG) for generated diagrams.
