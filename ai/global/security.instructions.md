# Security Instructions

[Back to Global Instructions Index](index.md)

## Secrets and Credentials

- Never commit secrets, credentials, API keys, tokens, or passwords.
- If a secret is accidentally committed, treat it as compromised immediately — rotate it and purge it from history.
- Use environment variables, secrets managers, or platform-provided vaults for all runtime secrets.
- Refer to local AI instructions for the specific secrets management approach used in the project.

## Input Validation

- All input from external sources (user input, API requests, file contents, environment variables, message queues) must be validated before use.
- Reject input that does not conform to the expected shape, type, range, or format — do not attempt to silently fix or guess malformed input.
- Validation must happen at the boundary where data enters the system, not deep in business logic.

## Output Sanitisation

- All output that may include externally sourced data must be sanitised appropriately for its context (e.g. HTML encoding for web output, parameterised queries for SQL, escaping for shell commands).
- Never construct queries, commands, or markup by string concatenation of untrusted input.

## Threat Modelling

- For any new feature handling data, exposing an endpoint, or introducing a trust boundary — model threats before writing code: who can call it, what can they send, what can go wrong, what is the worst case. Document significant threats and mitigations.

## Dependency Vulnerability Scanning

- Dependencies must be scanned for known vulnerabilities as part of the build or CI pipeline.
- Vulnerabilities must be assessed and resolved promptly — do not leave known vulnerabilities unaddressed.
- Refer to local AI instructions for the specific scanning tool used in the project.
