# Performance Instructions

[Back to Global Instructions Index](index.md)

## General Principles

Consider performance in every design decision. Priorities in order:

1. **Speed** — minimise latency and execution time.
2. **Memory** — reduce allocations and memory usage.

## Design

- Prefer algorithms and data structures with better time and space complexity.
- Avoid unnecessary object allocations — reuse instances and use pooling for frequently allocated objects.
- Avoid copying data unnecessarily — work in-place or pass by reference where safe.
- Avoid blocking calls on hot paths — prefer async to keep threads free.

## Code

- Avoid high-level abstractions (functional pipelines, heavy reflection, dynamic dispatch) on performance-critical paths; prefer lower-level constructs.
- Use low-allocation APIs when processing strings or buffers.
- Cache expensive computed values that do not change within a given scope.
- Be mindful of implicit conversions, wrapping, or type coercions on hot paths.

## Benchmarks

- Write benchmarks for performance-critical code; commit them alongside the code they measure.
- Record a baseline — regressions against it are not acceptable.
- Assert memory allocation limits using `FunFair.Test.Common` extensions — assert zero or within an explicit byte threshold; do not roll custom helpers.

## Optimisation Workflow

- Ensure tests and benchmarks both exist and pass before optimising.
- Commit and push tests and benchmarks first as a standalone commit.
- Only commit the optimisation if it produces a measurable gain against the baseline.
- If no gain is achieved, discard the optimisation change but keep the tests and benchmarks.
