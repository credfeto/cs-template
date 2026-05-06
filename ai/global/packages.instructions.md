# Package Management Instructions

[Back to Global Instructions Index](index.md)

## Security

- Use only secure package versions — avoid known vulnerabilities.
- See [security.instructions.md](security.instructions.md#dependency-vulnerability-scanning) for dependency scanning requirements.

## Managed vs Native Libraries

- In managed languages (e.g. .NET, JVM, Python), prefer managed libraries over native ones.
- Only use a native library if it is the most actively maintained and stable choice for the task.

## Deprecated or Obsolete Packages

- Avoid obsolete or deprecated packages and language features.
- If necessary, add a comment explaining why and when they can be removed.

## Standard Library and Trusted Third-Party Preference

- Prefer the standard library for tasks it covers — do not reimplement what it provides.
- Where the standard library is insufficient, prefer well-known, actively maintained third-party libraries.
- If you find hand-rolled code duplicating standard-library or trusted-third-party functionality (not introduced by the current work), raise a GitHub issue to refactor it — do not modify it inline.
