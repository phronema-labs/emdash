---
"emdash": patch
---

Cuts anonymous cold-start runtime init roughly in half on every measured region, most dramatically where D1 replica latency is highest. The homepage cold `rt` on `ape` dropped from ~5200 ms to ~1300 ms; `use` from ~2000 ms to ~900 ms.

Three changes:

- **FTS index verify/repair is no longer run on every cold start.** Search indexes are only touched when content changes or when the search endpoints are actually used, so the ~1.5 s per-cold-boot scan it performed in high-latency regions was pure tax on anonymous reads. The check is now run lazily by the search/suggest endpoints on first use (at most once per worker lifetime) via a new `ensureSearchHealthy()` on the runtime.
- **Cold-start timings are now broken out in `Server-Timing`.** In addition to the aggregate `rt`, the first cold request exposes sub-phases (`rt.db`, `rt.plugins`, `rt.site`, `rt.sandbox`, `rt.market`, `rt.hooks`, `rt.cron`) so future regressions are easier to localise.
- **Distinguishes D1 Sessions routing from genuinely isolated per-request DBs.** Previously any `ctx.db` override (including plain D1 Sessions on anonymous reads) defeated module-scoped caches for the manifest, taxonomy names, and byline / taxonomy-assignment existence probes. Only playground / DO-preview contexts now set `ctx.dbIsIsolated = true`; plain D1 session routing reuses the caches, which restores their worker-lifetime hit rate for anonymous traffic.
