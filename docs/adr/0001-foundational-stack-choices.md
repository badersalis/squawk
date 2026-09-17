# ADR 0001: Foundational stack choices

Status: Accepted — 2026-09-17

## Context

Kicking off Step 1 (foundations + tracing) required locking in three choices before any
code could be written: monorepo tooling, ORM, and unit test runner.

## Decisions

### Monorepo tooling: Nx

Considered Nx vs. NestJS's built-in monorepo mode. Chose **Nx** for its dependency graph,
task caching, and `nx affected` — this pays off once the roadmap's ~8-10 bounded-context
services and several shared libs (`domain`, `contracts`, `observability`, `testing`) exist.
Nest's built-in mode is simpler but would likely need migrating to Nx later anyway as the
service count grows.

### ORM: Prisma

Considered Prisma vs. TypeORM. Chose **Prisma** for its schema/migration DX. The one place
this costs us is pessimistic row locking for seat holds (Step 5) — Prisma has no first-class
API for `SELECT ... FOR UPDATE`, so that will go through `$queryRaw`/`$transaction` as a
deliberate, visible escape hatch rather than a hidden ORM feature. TypeORM's native
`pessimistic_write` lock mode reads more declaratively but loses on migrations and general DX.

### Test runner: Vitest

Considered Vitest vs. Jest. Chose **Vitest** for speed (esbuild-based) and native ESM/TS
support. Nx's Nest generator defaults to Jest, so each generated project's test config is
swapped to Vitest explicitly at generation time (`--unitTestRunner=vitest`).

## Consequences

- Every new app/lib is generated with `--unitTestRunner=vitest`.
- The Inventory service's seat-hold locking code (Step 5) will read raw SQL for the lock
  acquisition, wrapped behind a repository method — this is expected and should not be
  "cleaned up" into a Prisma-only abstraction later.
- No Nx Cloud, no Temporal, no Nx's own Claude Code plugin — none of these were asked for
  and each would add a dependency/service beyond what's justified for this step.
