# .NET Instructions

[Back to Global Instructions Index](index.md)

## Build and Test Before Commit (MANDATORY)

Run `dotnet build` and `dotnet test` before every commit — see [git.instructions.md](git.instructions.md#build-and-test-verification-mandatory-before-any-commit-or-push).

## Source-Generated Logging

- Prefer `LoggerMessage` source generators over runtime string-based logging — faster, allocation-free, and compile-time structured.
- Logging methods must be in a dedicated `internal static` class:
  - Placed in a `LoggingExtensions` sub-namespace relative to the class it serves.
  - Named `<ClassName>LoggingExtensions` (e.g. `FooLoggingExtensions` for `Foo`).

## Asynchronous Code

See [code-quality.instructions.md](code-quality.instructions.md) for general async rules. .NET-specific:

- Prefer `ValueTask`/`ValueTask<T>` over `Task`/`Task<T>` — avoids heap allocations on synchronous-completion paths.
- Only use `Task`/`Task<T>` where `ValueTask` is unsupported or the method always completes asynchronously.

## Cancellation

- All async methods must accept and pass down a `CancellationToken`.
- Never create a new `CancellationToken` when one has been provided, unless combining with a timeout via `CancellationTokenSource.CreateLinkedTokenSource`.
- Prefer overloads that accept a `CancellationToken`.
- Do not pass `CancellationToken.None` without explicit documented reason.

## Project and Solution Structure

- All projects must be added to the solution file (`.slnx` or `.sln`).
- All projects must pass `FunFair.BuildCheck` before committing: `dotnet buildcheck` (run from solution root; `dotnet buildcheck --help` for options).

## Test Assembly Naming

| Test type | Assembly name pattern |
| --------- | --------------------- |
| Unit tests | `<AssemblyName>.Tests` |
| Integration tests | `<AssemblyName>.Integration.Tests` |
| Benchmarks | `<AssemblyName>.Benchmark.Tests` |

## Test Dependencies

- All test projects must reference the latest release of `FunFair.Test.Common`.
- All test projects must import the latest release of `FunFair.Test.Source.Generator`.
- Test fixture classes must derive from `FunFair.Test.Common.TestBase`.

## NSubstitute and FunFair.Test.Common Patterns

| Instead of | Use |
| ---------- | --- |
| `Substitute.For<IMyInterface>()` | `GetSubstitute<IMyInterface>()` (static — no `this.`) |
| `Substitute.For<ILogger<MyClass>>()` | `this.GetTypedLogger<MyClass>()` (instance — requires `this.`) |

- Never call `Substitute.For<T>()` in classes deriving from `TestBase` or `DependencyInjectionTestsBase`.
- Remove unused `using NSubstitute;` after replacing all `Substitute.For<>()` calls.

## DI Setup Test Patterns

Use `AddMockedService<T>()` in tests deriving from `DependencyInjectionTestsBase` — see [dotnet.examples.md](dotnet.examples.md) for `AddMockedService` and `IOptions` patterns.

- Never create concrete no-op inner classes to satisfy DI mocking.
- `GetSubstitute<T>()` is safe in `static` Configure methods.

## Source File Organisation

- One type per file — class, record, struct, interface, or enum.
- File name must match the type name exactly (e.g. `FooBar.cs` for `class FooBar`).

## Debugger Diagnostics

- All `struct` types must have `[DebuggerDisplay("...")]` showing key fields.
- All value types (records with positional parameters or `record struct`) must have `[DebuggerDisplay("...")]`.
- All configuration/options classes must have `[DebuggerDisplay("...")]` showing key properties.

## Time Abstraction

- Use `System.TimeProvider` (.NET 8+) for all time abstractions.
- Never use `Credfeto.Date.ICurrentTimeSource` or `FunFair.Common.Services.IDateTimeSource` — these are obsolete.
- In tests, use `FakeTimeProvider` from `Microsoft.Extensions.TimeProvider.Testing` — never roll a custom mock.
- Migrate any code touching `ICurrentTimeSource` or `IDateTimeSource` to `TimeProvider`/`FakeTimeProvider` as part of that work.

## Warning Suppression

- Never use `#pragma warning disable <ID>`.
- For genuinely unfixable warnings, use `[SuppressMessage("category", "ID", Justification = "reason")]` at the narrowest scope.
- `Justification` is **mandatory** — suppression without one is a build error.

## Warnings as Errors

- Every project must build with `<TreatWarningsAsErrors>true</TreatWarningsAsErrors>`.
- Never use `<NoWarn>` or `<WarningsNotAsErrors>` — fix the code or use `[SuppressMessage]`. Exception: per-advisory NuGet audit suppressions (see below).

## NuGet Vulnerability Suppression

Suppress per-project using the advisory URL — never globally in shared `.props` files. Track each suppression in a GitHub issue.

```xml
<ItemGroup>
  <!-- Reason: <why accepted> -->
  <NuGetAuditSuppress Include="https://github.com/advisories/GHSA-xxxx-xxxx-xxxx" />
</ItemGroup>
```

Prohibited (global suppression — silently hides new advisories):

```xml
<WarningsNotAsErrors>NU1901;NU1902;NU1903;NU1904</WarningsNotAsErrors>
<NoWarn>NU1901;NU1902;NU1903;NU1904</NoWarn>
```
