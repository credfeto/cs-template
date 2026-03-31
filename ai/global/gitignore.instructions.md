# .gitignore Instructions

[Back to Global Instructions Index](index.md)

## Root `.gitignore`

- The root `.gitignore` is the global baseline and must only be edited in `git@github.com:credfeto/cs-template.git`.
- Updates to the root `.gitignore` are distributed to derived repositories via the standard template update mechanism.

## Additional `.gitignore` Files

- Derived repositories should have additional `.gitignore` files to cover repo-specific concerns not handled by the root — e.g. language-specific build output folders, generated content, local tooling artefacts.
- These additional files should be placed at the appropriate level in the directory tree (e.g. alongside the code they relate to).

## Consistency

- Whenever any `.gitignore` is created or modified, check it against the root `.gitignore` to ensure:
  - There is no duplication of rules already covered by the root.
  - There are no conflicts with rules in the root.
