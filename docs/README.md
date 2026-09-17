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
- **Every service is versioned and self-documenting.** URI versioning (`/api/v1/...`),
  health checks excluded since infra tooling — not API consumers — calls those. Each
  service publishes its own OpenAPI spec at `/api/docs`.

```
/apps                   one deployable NestJS app per bounded context
  /schedule              flights, legs, simulated fare feed
  /search                non-stop itinerary search over Schedule, cached in Redis
/libs
  /domain                shared domain types (Flight, Segment, BookingClass, Offer, Order, Itinerary)
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

**Step 3 of the roadmap: Search/read path + caching.** Two services exist:

**Schedule** — flights, legs, simulated fare feed:

- `GET /api/health` — version-neutral
- `GET /api/v1/flights` — seeded, in-memory flight data
- `GET /api/v1/flights/:flightId/fares/:bookingClassCode` — a simulated fare/revenue feed
  (`FareFeedPort` / `FakeFareFeedAdapter`) standing in for the commercially-gated ATPCO
  feed a real airline would call here. Pricing is deterministic per flight+class but
  otherwise made up.

**Search** — non-stop itinerary search, read path only:

- `GET /api/health` — version-neutral
- `GET /api/v1/itineraries?origin=JFK&destination=LAX` — calls Schedule
  (`SchedulePort` / `HttpScheduleAdapter`), wraps each matching flight as a non-stop
  `Itinerary`, and caches the result in Redis for 60s (`ItineraryCachePort` /
  `RedisItineraryCacheAdapter`). Multi-leg connection-building is out of scope for this
  step.

Both services publish OpenAPI docs at `GET /api/docs`.

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

Run both services against that collector (separate terminals, or use the npm scripts
below which wire up the right env vars):

```
npm run serve:schedule   # http://localhost:3000
npm run serve:search     # http://localhost:3002
```

Then:

```
curl http://localhost:3000/api/health
curl http://localhost:3000/api/v1/flights
curl http://localhost:3000/api/v1/flights/flt_aa100/fares/Y
curl "http://localhost:3002/api/v1/itineraries?origin=JFK&destination=LAX"
```

Open http://localhost:3000/api/docs or http://localhost:3002/api/docs for each
service's interactive OpenAPI UI.

Open Grafana at http://localhost:3001 (that port is Grafana's alone — Search runs on
3002 to avoid colliding with it), go to **Explore → Tempo**, and search by
`service.name = schedule` or `service.name = search` to see traces, including the
itinerary lookup calling out to Schedule.

## Verifying

```
npx nx build @squawk/schedule @squawk/search   # compiles both services
npx nx test @squawk/schedule                    # builds Schedule's real Dockerfile with
                                                 # Testcontainers, boots it, hits it over HTTP
npx nx test @squawk/search                      # unit tests the caching logic, then wires
                                                 # real Redis + Schedule + Search containers
                                                 # together and proves the cache keeps
                                                 # answering after Schedule is stopped
```

Tests build and run the services' real Docker images rather than importing the app
in-process — that's what "production-shaped" is meant to buy you.
