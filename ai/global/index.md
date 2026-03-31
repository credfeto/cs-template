# Global instructions

This is an index of global instructions that apply to all projects.
- Ensure consistency across all projects.
- This file should be considered an index of global instructions.
- Each file other than this one should be named in the format `<category>.instructions.md` Where `<category>` is the category of the file and all related rules should be listed there.
- `<category>.instructions.md` files should be placed in this directory.
- `<category>.instructions.md` files should maintain a backlink to this file.
- This folder should be maintained ONLY in the git@github.com:credfeto/cs-template.git repository.
- Updates to this folder will be distributed to using an external mechanism.

## Instruction Files

| File | Description |
|------|-------------|
| [git.instructions.md](git.instructions.md) | Branching strategy, commit size, commit message format (Conventional Commits, prompt in body) |
| [documentation.instructions.md](documentation.instructions.md) | README, CHANGELOG (KeepAChangeLog, `Credfeto.Changelog.Cmd`), and docs folder conventions |
| [code-quality.instructions.md](code-quality.instructions.md) | 100% code coverage, dead code removal, compile-time configuration testing |
| [packages.instructions.md](packages.instructions.md) | Secure package versions, avoiding deprecated or obsolete packages |
| [api.instructions.md](api.instructions.md) | `.http` test files for exposed API endpoints |
| [performance.instructions.md](performance.instructions.md) | Performance considerations: speed as priority, reducing memory allocations |
| [sql.instructions.md](sql.instructions.md) | SQL linting requirements before every commit |
| [gitignore.instructions.md](gitignore.instructions.md) | `.gitignore` ownership, additional ignore files, and consistency checks |
| [language.instructions.md](language.instructions.md) | UK English for documentation and comments; platform convention for code identifiers |
 