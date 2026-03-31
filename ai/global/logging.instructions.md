# Logging Instructions

[Back to Global Instructions Index](index.md)

## Structured Logging

- All logging must use structured logging — log data as key-value pairs or structured objects, not concatenated strings.
- This ensures logs are machine-readable and queryable in log aggregation tools.

## Log Levels

Use log levels consistently:

- **Error** — an unexpected failure that requires attention; the operation could not complete.
- **Warning** — something unexpected happened but the operation continued; may need investigation.
- **Information** — significant business or operational events (e.g. service started, job completed).
- **Debug** — detailed diagnostic information useful during development; must not be enabled in production by default.
- **Trace** — very fine-grained detail; only for deep diagnostics and never in production.

## What to Log

- Log enough context to diagnose a problem without needing to reproduce it — include relevant identifiers and state.
- Log at service/system boundaries (e.g. incoming requests, outgoing calls, significant state transitions).

## What Not to Log

- Never log personally identifiable information (PII) — e.g. names, email addresses, phone numbers, IP addresses, or any data that could identify an individual.
- Never log secrets, credentials, tokens, or passwords under any circumstances.
- Avoid logging large payloads in full — summarise or truncate where appropriate.
