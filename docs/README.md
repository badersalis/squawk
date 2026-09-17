# Squawk

An airline reservation system, built to be **production-shaped**: the architecture, the
consistency guarantees, and the observability are all real. The only things that are
faked are commercially-gated external data feeds — fares, GDS connectivity, ATPCO — which
live behind clean interfaces so they can later be swapped for the real thing.

Airline reservations are a good vehicle for this because the interesting engineering
problems are unavoidable, not manufactured: a seat can be authorized for sale by more
booking classes than there are physical seats (deliberate overbooking, not a bug), a
priced offer expires out from under a shopper mid-checkout, and a booking is never
"done" — it stays mutable for its entire lifetime through schedule changes and
cancellations. Two problems anchor the whole system and are being built by hand rather
than farmed out to a framework:

- **Seat holds under concurrency** — the last-seat race, TTL expiry, and what happens
  when two shoppers convert the same inventory unit at once.
- **The booking saga** — order → hold → payment → ticket, with explicit compensating
  actions and idempotency keys on every mutating step, so a booking either fully
  completes or fully rolls back. Never double-book, never double-charge.

## Architecture

- **Read path vs. write path.** Shopping/search is high-volume, cacheable, eventually
  consistent. Booking is low-volume, strongly consistent, transactional. They don't
  share a database or a scaling profile.
- **One source of truth per aggregate.** PostgreSQL holds inventory and orders. Redis is
  an optimization layer in front of it (TTL holds, search cache) — never the system of
  record.
- **Sagas, not transactions, for multi-step writes**, with compensating actions and
  idempotency keys throughout.
- **Kafka (via Redpanda locally) as the event backbone**, with versioned events treated
  as a public contract.
- **OpenTelemetry from the start** — every request and every saga step is traceable
  end to end.

```
/apps                   one deployable NestJS app per bounded context
  /schedule              flights, legs, simulated fare feed (the only service so far)
/libs
  /domain                shared domain types (Flight, Segment, BookingClass, Offer, Order)
  /observability          OpenTelemetry bootstrap, shared instrumentation
  /testing                Testcontainers-based test helpers
/infra
  docker-compose.yml      Postgres, Redis, Redpanda, OTel collector, Tempo, Prometheus, Grafana
/docs
  adr/                    architecture decision records
```

Each service is layered hexagonally: `domain` (no framework, no DB), `application`
(use-cases, ports), `infrastructure` (adapters — DB, Kafka, Redis, HTTP, fakes).

## Status

**Step 2 of the roadmap: Schedule + simulated feed.** One service exists — **Schedule** —
exposing:

- `GET /api/health`
- `GET /api/flights` — seeded, in-memory flight data
- `GET /api/flights/:flightId/fares/:bookingClassCode` — a simulated fare/revenue feed
  (`FareFeedPort` / `FakeFareFeedAdapter`) standing in for the commercially-gated ATPCO
  feed a real airline would call here. Pricing is deterministic per flight+class but
  otherwise made up.

There is no database wiring, no saga, no seat-hold logic yet — Postgres only enters the
picture once Inventory/Orders need a real source of truth (roadmap step 5). See
[`docs/adr/`](adr/) for why the initial tooling (Nx, Prisma, Vitest) was chosen.

## Running it

Bring up the infrastructure:

```
docker compose -f infra/docker-compose.yml up -d
```

This starts Postgres (`5432`), Redis (`6380`, remapped to avoid a local port
conflict), Redpanda (`9092`), the OTel collector (`4317`/`4318`), Tempo (`3200`), Prometheus
(`9090`), and Grafana (`3001`, anonymous access, Tempo + Prometheus pre-provisioned as
datasources).

Run the Schedule service against that collector:

```
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317 npx nx serve @squawk/schedule
```

Then:

```
curl http://localhost:3000/api/health
curl http://localhost:3000/api/flights
curl http://localhost:3000/api/flights/flt_aa100/fares/Y
```

Open Grafana at http://localhost:3001, go to **Explore → Tempo**, and search by
`service.name = schedule` to see the traces for those two requests.

## Verifying

```
npx nx build @squawk/schedule       # compiles the service
npx nx test @squawk/schedule        # builds the service's real Dockerfile with
                                     # Testcontainers, boots it, and hits it over HTTP
```

The test doesn't import the app in-process — it builds and runs the same Docker image
that would ship, which is what "production-shaped" is meant to buy you.
