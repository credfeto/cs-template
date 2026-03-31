# Performance Instructions

[Back to Global Instructions Index](index.md)

## General Principles

- Performance must be considered as part of any design decision, not treated as an afterthought.
- Priorities in order:
  1. **Speed** — minimise latency and execution time.
  2. **Memory** — reduce allocations and memory usage wherever possible.

## Design

- Prefer algorithms and data structures with better time and space complexity when there is a realistic choice.
- Avoid unnecessary object allocations — reuse instances, prefer value types where appropriate, and use pooling for frequently allocated objects.
- Avoid copying data unnecessarily — prefer passing by reference, using spans, or working in-place where safe to do so.
- Avoid blocking calls on hot paths — prefer asynchronous operations to keep threads free.

## Code

- Avoid LINQ in performance-critical paths where it introduces unnecessary allocations or overhead; use loops or spans instead.
- Use `StringBuilder`, `Span<T>`, `Memory<T>`, and similar low-allocation APIs when processing strings or buffers.
- Cache computed values that are expensive to recalculate and do not change within a given scope.
- Be mindful of boxing — avoid it on hot paths by using generic constraints or value types directly.
