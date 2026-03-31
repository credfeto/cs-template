# Code Quality Instructions

[Back to Global Instructions Index](index.md)

## Code Coverage

- 100% code coverage must be maintained by tests.
- How tests are organised should be detailed in the local AI instructions for each repository.

## Pre-Commit

- Unit tests must be written and must pass before every commit.
- Never commit code that causes existing tests to fail.

## Dead Code

- If code cannot be reached by any code path (dead code), remove it rather than writing tests around it.

## Compile-Time Configuration

- Compile-time configuration (e.g. environment-specific constants, feature flags resolved at build time) must be covered by a unit test rather than verified with a runtime check.
- This keeps production code clean and free of defensive assertions that only exist for testing purposes.
