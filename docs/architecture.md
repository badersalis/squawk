                    ┌────────────────────────┐
                    │   Next.js Web (later)  │
                    └───────────┬────────────┘
                                │ HTTPS
                    ┌───────────▼────────────┐
                    │      NestJS API        │  ◄── /api/docs (Swagger)
                    │  (HTTP + BullMQ producers)
                    └─────┬────────────┬─────┘
                          │            │
                 ┌────────▼──┐    ┌────▼─────┐
                 │ PostgreSQL│    │  Redis   │
                 │ (source of│    │ (BullMQ) │
                 │  truth +  │    └────┬─────┘
                 │  FTS)     │         │
                 └────▲──────┘         │
                      │                │
                    ┌─┴────────────────▼─────┐
                    │   Worker process       │
                    │  (same image,          │
                    │   different entrypoint)│
                    │                        │
                    │  Ingestion  Scheduler  │
                    │  Notification workers  │
                    └────┬────────────┬──────┘
                         │            │
                 ┌───────▼──┐   ┌─────▼──────┐
                 │Greenhouse│   │   Ashby    │   … future providers
                 │  adapter │   │  adapter   │
                 └──────────┘   └────────────┘