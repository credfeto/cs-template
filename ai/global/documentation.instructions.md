# Documentation Instructions

[Back to Global Instructions Index](index.md)

## README

- `README.md` must contain a clear description of what the repository is for and be kept up to date as things change.
- If the `README.md` still contains template placeholder content (e.g. describes itself as a template), it must be rewritten automatically to reflect the actual repository when work begins.
- `README.md` must include the following links and badges where applicable:
  - GitHub Actions workflow badges for **debug** and **release** builds/tests (as appropriate for the repository).
  - Link to the head of any project documentation (e.g. `docs/`).
  - Link to build instructions in the documentation.
  - Link to the contributing guide — use the standard filename (`CONTRIBUTING.md`).
  - Link to the security policy — use the standard filename (`SECURITY.md`).
  - Link to `CHANGELOG.md`.

## Configuration Documentation

- Whenever a configuration option is added, removed, or renamed (in `appsettings.json`, an options class, or environment variable mapping), the corresponding section in `README.md` must be updated in the same commit.
- The `README.md` configuration section must accurately reflect all current options, their types, default values, and a brief description of what each does.
- This applies to any project that has a `README.md` with a configuration or setup section.

## CHANGELOG

- `README.md` must link to `CHANGELOG.md`.
- For full rules on format, tooling, and how to add or remove entries, see [changelog.instructions.md](changelog.instructions.md) — load that file when making changelog changes.

## Additional Documentation

- Documentation should be generated and maintained for repositories other than `git@github.com:credfeto/cs-template.git`.
- The `git@github.com:credfeto/cs-template.git` repository must not contain a `docs` folder — documentation is explicitly for derived repositories only.
- Documentation and architecture diagrams other than `README.md` and `CHANGELOG.md` should be placed in the `docs` folder.
- Documentation should be kept up-to-date as changes are applied and be created when missing.
- Do not specify every detail (e.g. package version numbers, every single file) in architecture diagrams — folder structure is sufficient.
- Where diagrams are generated, prefer vector formats (e.g. SVG) over raster formats (e.g. PNG, JPEG).
