# Squawk — Airline Reservation System

Production-shaped airline reservation system in NestJS + TypeScript. "Production-shaped"
means the architecture, consistency guarantees, and observability are real; only
commercially-gated external data (fares, GDS, ATPCO) is simulated behind clean interfaces.

This is a collaborative, incremental build with the user contributing code and decisions
alongside Claude. Optimize for a codebase that's readable and reviewable, not for finishing
fast.

## Working agreement

- Work in small, reviewable increments. One concern per change. Prefer several small,
  coherent commits over one large one.
- Propose before building anything hard to reverse: a database schema, a public API/event
  contract, a new dependency, or a cross-cutting pattern. State options, tradeoffs, and a
  recommendation, then wait for go-ahead.
- Do not add technology outside the stack below without asking. Every dependency must be
  justifiable in one sentence.
- Don't over-engineer. No premature abstraction, no speculative generality. Build for the
  current step; leave clearly-marked `TODO(next):` seams for later steps.
- Leave contribution points for the user. When a piece is a good learning/ownership
  candidate (e.g. the hold logic, a compensation), stub the interface and its tests and hand
  it off rather than filling it in.
- End every increment with a handoff note: what changed, how to run it, how to verify it
  works (exact commands), and what's proposed next.
- Test the hard parts. Sagas, seat holds, idempotency, and compensations get tests that
  deliberately inject failure. UI/CRUD glue can stay light.
- Conventional Commits. Keep PR-sized diffs. No secrets in the repo, ever.
- If a request is ambiguous or would force an architectural decision, stop and ask rather
  than guessing.

## Architecture principles

1. Split the read path from the write path. Shopping/search is high-volume, cacheable,
   eventually-consistent. Booking is low-volume, strongly consistent, transactional. They
   do not share a database or a scaling profile.
2. One durable source of truth per aggregate. PostgreSQL holds the truth for inventory and
   orders. Caches (Redis) are optimizations in front of it, never the system of record.
3. Long-running writes are sagas, not transactions. Multi-step, multi-service writes
   (order → hold → payment → ticket) use an orchestrated saga with explicit compensating
   actions and idempotency keys on every mutating call. A booking either fully completes or
   fully rolls back. Never double-book, never double-charge.
4. Event-driven backbone. Services communicate state changes over Kafka. Events are
   versioned and treated as a public contract.
5. Observability from commit #1. OpenTelemetry tracing is wired before feature work.
   Every request and every saga is traceable end to end.
6. Simulate gated externals behind interfaces. Anything that can't be legally obtained
   (fares, revenue management, GDS, payment network) lives behind a port with a fake
   adapter. The interface is real; only the data is simulated.
7. Hexagonal layering inside each service. Domain logic is independent of NestJS, the DB,
   and the transport. Adapters plug into ports.

## Technology stack (confirmed)

| Concern             | Choice                                                                                       |
| ------------------- | -------------------------------------------------------------------------------------------- |
| Language            | TypeScript (strict)                                                                          |
| Framework           | NestJS — one module ≈ one bounded context; `@nestjs/microservices` Kafka transport           |
| Monorepo            | **Nx**                                                                                       |
| Source of truth     | PostgreSQL — row-level locking required for holds                                            |
| ORM                 | **Prisma** — pessimistic locking via `$queryRaw`/`$transaction` as a deliberate escape hatch |
| Cache / holds       | Redis — TTL-based seat holds + search cache (optimization layer only)                        |
| Event backbone      | Kafka, run as Redpanda locally                                                               |
| Saga                | Hand-rolled orchestrator first; Temporal later only if asked                                 |
| Payments            | Stripe (test mode) — must support forced declines/timeouts                                   |
| Observability       | OpenTelemetry → Grafana stack (Tempo/Prometheus/Loki)                                        |
| Local orchestration | docker-compose                                                                               |
| Tests               | **Vitest** + Testcontainers for integration                                                  |
| CI                  | GitHub Actions — lint, typecheck, test on every PR                                           |
| Frontend (later)    | Next.js + TypeScript — out of scope until backend slice works                                |

## Repository structure

```
/apps
  /<service-name>        # one deployable NestJS app per bounded context
/libs
  /domain               # shared domain types (Flight, Segment, RBD, Offer, Order…)
  /contracts            # versioned event & API schemas
  /observability        # OTel bootstrap, shared instrumentation
  /testing              # test helpers, Testcontainers fixtures
/infra
  docker-compose.yml
  /otel                 # collector config
  /grafana              # dashboards/provisioning
/docs
  README.md             # opens with the problem, not the tech list
  adr/                  # short Architecture Decision Records
```

Each service follows hexagonal layering:

```
/src
  /domain               # entities, value objects, domain services (no Nest, no DB)
  /application          # use-cases, saga steps, ports (interfaces)
  /infrastructure       # adapters: db, kafka, redis, http, fakes
  <service>.module.ts
  main.ts
```

## Conventions

- Idempotency: every mutating endpoint and saga step accepts an idempotency key; a shared
  idempotency store makes retries safe. Not optional.
- Events: named `<Context>.<Event>.vN`, schema in `/libs/contracts`. Additive changes only
  within a version.
- Errors: domain errors are typed and distinct from infrastructure errors; map to transport
  errors only at the edge.
- Config: env-driven via `@nestjs/config`; validate on boot; no secrets committed.
- ADRs: any architecture-principle-level decision gets a short ADR in `/docs/adr`.
- README as showcase: leads with the interesting problem and architecture diagram, states
  plainly that fares/GDS are simulated behind interfaces, highlights the saga + a
  distributed trace. This project is public — honesty about simulated parts reads as
  maturity.

## Domain — bounded contexts

- **Schedule** — flights, legs, origin-destination pairs, simulated fare/revenue feed
  behind a port.
- **Shopping/Search** _(read path)_ — itinerary building incl. multi-leg connections; cached.
- **Offer & Pricing** _(read path)_ — itinerary → time-bound priced Offer (id + expiry).
- **Inventory** _(write path)_ — source of truth for authorization units per booking class
  (RBD); TTL seat holds; overbooking is a deliberate business input, not a bug.
- **Order** _(write path)_ — Offer/Order model (NDC-style): accepted Offer → Order of
  OrderItems. Owns the PNR lifecycle.
- **Payment** _(write path)_ — Stripe test-mode adapter; forcible failures.
- **Ticketing** _(write path)_ — e-ticket/coupons (OrderItems); the value-bearing artifact.
  Separate step from booking.
- Later: IROPS, Ancillaries + seat map, Loyalty, DCS/check-in.

**Key invariants:** inventory enforces current authorization limits (which may exceed
capacity); an Offer is only valid until its expiry (price-at-search ≠ price-at-book); a
booking is never "done" — it stays mutable via IROPS.

## Roadmap (arc only — do not run ahead)

1. Foundations + tracing _(current)_ → 2. Schedule + simulated feed → 3. Search/read path +
   caching → 4. Offer & pricing (expiry) → 5. **Inventory & seat holds** (concurrency,
   last-seat race) → 6. **Booking saga** (compensations + idempotency; forcible payment
   failure) → 7. Ticketing & order management → 8. IROPS → 9. Ancillaries/seat map/loyalty →
2. DCS/check-in _(stretch)_.

Steps 5–6 are the intellectual core; everything before is setup to reach them.

## Nx workspace notes

- Run tasks through Nx (`nx run`, `nx run-many`, `nx affected`) rather than calling the
  underlying tool (`jest`, `tsc`, ...) directly, so caching and the project graph stay useful.
- Prefix commands with the package manager (`npm exec nx ...`) instead of relying on a
  global `nx` install.
- Scaffold new apps/libs with `nx g @nx/nest:app` / `nx g @nx/js:lib` rather than hand-rolling
  boilerplate — check `nx g <generator> --help` before guessing flags.
- Nx also offers an official Claude Code plugin (MCP server + skills for workspace
  navigation/generators) via the `nrwl/nx-ai-agents-config` marketplace — not enabled here
  since it adds a plugin/marketplace and a sandbox network exception without being asked.
  Ask the user first if this would help.

## Definition of done (every increment)

- Runs via `docker-compose` with one documented command.
- Traced end to end (visible in Grafana/Tempo).
- Hard logic has failure-injecting tests; CI is green.
- Handoff note written: what changed, how to run, how to verify, what's next.
- No unjustified dependencies; any architecture-principle-level decision has an ADR.
