# SQL Instructions

[Back to Global Instructions Index](index.md)

## Linting

Run a SQL linter appropriate for the dialect before every commit. Refer to local AI instructions for the specific linter and command.

## Local Database Connection (MS SQL Server)

Two `.database` files together provide the local SQL Server connection:

- **`$HOME/.database`** — machine-specific credentials, never committed. Contains:

  ```sh
  SERVER=localhost
  USER=sa
  PASSWORD=<password>
  ```

- **`<repo>/.database`** — committed, repo-specific. Contains:

  ```sh
  DB=Treasury
  ```

The `./testdb` script sources both automatically — do NOT pre-source them before calling `./testdb`. For ad-hoc `sqlcmd` use, source them first:

```sh
. "$HOME/.database" && . .database && sqlcmd -S "$SERVER" -U "$USER" -P "$PASSWORD" -d "$DB" ...
```

## Performance Optimization

Before committing a stored procedure or view, reduce IO and CPU:

1. **Baseline** — run the example EXEC call with statistics:

   ```sql
   SET STATISTICS IO ON;
   SET STATISTICS TIME ON;
   -- run the example
   SET STATISTICS IO OFF;
   SET STATISTICS TIME OFF;
   ```

2. **Identify hotspots** — high logical reads on large tables; prefer index seeks over table scans.
3. **Optimize** (minimum set, not exhaustive):
   - Add `WITH (NOLOCK)` to every table/view reference in read-only SPs and views
   - Push `WHERE` predicates into subqueries/CTEs to seek before joining
   - Use covering indexes where available
   - Prefer table variables with a primary key (small sets) or `#temp` tables with statistics (large sets) over repeated scans
   - Avoid scalar UDFs in `WHERE`/`JOIN` clauses — they suppress parallelism
4. **No query hints** — avoid `OPTION (...)`, `FORCE ORDER`, `USE PLAN`, or index hints unless measured proof justifies them.
5. **Linter constraint (SRP0009)** — build rules block `DATEPART()` / function calls on any column in a `WHERE` clause. Use `DECLARE` variables to pre-compute values outside the query.
6. **Record** — update `docs/Benchmarks/<Schema>.md` with before/after logical-read and Workfile totals for material changes, including example parameters.
7. **Known Bottlenecks** — if a performance issue cannot be fixed immediately, document it as a "Known Bottleneck" in `docs/Benchmarks/<Schema>.md` and raise a GitHub issue describing the bottleneck, affected procedure/view, observed stats, and proposed fix. Reference the issue number in the benchmark file.
