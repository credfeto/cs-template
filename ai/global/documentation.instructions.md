# Documentation Instructions

[Back to Global Instructions Index](index.md)

## README

- Keep `README.md` up to date with how the project is supposed to be used and developed.

## CHANGELOG

- Maintain `CHANGELOG.md` in [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format to track changes and updates to the project.
- Purely documentation changes should not be added to the changelog.
- Use the `Credfeto.Changelog.Cmd` dotnet tool to update the changelog:
  ```
  dotnet changelog -f CHANGELOG.md -a <ChangeType> -m "<reason for change>"
  ```
- Each task should be updated in `CHANGELOG.md`, **unless**:
  - This is the `git@github.com:credfeto/cs-template.git` repository — the `CHANGELOG.md` there is expected to be kept blank, ready for new repositories using the template.
  - It is purely a documentation change and does not affect any production code.
  - It is an AI instructions change.

## Additional Documentation

- Documentation should be generated and maintained for repositories other than `git@github.com:credfeto/cs-template.git`.
- Documentation and architecture diagrams other than `README.md` and `CHANGELOG.md` should be placed in the `docs` folder.
- Documentation should be kept up-to-date as changes are applied and be created when missing.
- Do not specify every detail (e.g. package version numbers, every single file) in architecture diagrams — folder structure is sufficient.
