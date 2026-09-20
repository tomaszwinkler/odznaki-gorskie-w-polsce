# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

PWA (React + Vite) for tracking progress toward Polish mountain-hiking badges (GOT, Korona Gór Polski, Diadem Polskich Gór, three "korony makroregionalne" — Korona Sudetów, Korona Beskidów, Turystyczna Korona Tatr — and three regional badges: Korona Bieszczadów, Dominanty Przedgórza Sudeckiego, Korona Polskich Beskidów). All data lives client-side in IndexedDB (Dexie) — no backend of our own; accounts and cross-device sync are optional and go through Dexie Cloud (see "Optional cloud sync"). UI text, data, comments, commit messages, and test descriptions are all in Polish; keep it that way.

## Commands

```bash
npm install
npm run dev       # dev server
npm test          # vitest run (whole suite)
npm run lint      # oxlint (not eslint)
npm run build     # production build — required to actually test PWA/offline behavior
npm run preview   # preview the production build
```

Run a single test file: `npx vitest run src/logic/peakGroups.test.js`
Run tests matching a name: `npx vitest run -t "nazwa testu"`

No TypeScript — plain JS/JSX throughout. Tests are colocated (`Foo.jsx` next to `Foo.test.jsx`), use `describe`/`it`/`expect` imported explicitly from `vitest` (no `globals: true` in `vite.config.js`), and test descriptions are Polish sentences. Component tests use `@testing-library/react` under `environment: 'jsdom'` (configured in `vite.config.js`, setup file at `src/test/setup.js`).

## Architecture

### Data layer (`src/data/`) — the catalog is static, not user data

- `badgeCategories.js` / `badgeSystems.js`: badge systems grouped into categories. Each system has `available: boolean` — `false` means no catalog/levels loaded yet, and the UI shows a "dane w przygotowaniu" placeholder (`SystemPlaceholder`) instead of an empty list/map. When turning a system on, both `badgeSystems.js` (flip `available`) and `badgeLevelsBySystem` in `badgeLevels.js` must be filled in, or `badgeSystems.test.js` fails. As of 2026-09-20 every system is `available: true` (the last placeholders — invented names like "Sudecka Odznaka Turystyczna" that no real badge has — were replaced by real badges); the placeholder path is still supported and `App.test.jsx` keeps it covered with a fake unavailable system. Badges earned by walking a trail (Główny Szlak Sudecki/Beskidzki) don't fit the peak-list model and are intentionally not catalogued.
- `points.js`: the full point catalog (`initialPoints`), one flat array. **The same physical peak appears once per badge system it belongs to** (e.g. Śnieżka exists as `sniezka` in GOT, `sniezka-kgp` in KGP, `sniezka-diadem` in DIADEM, `sniezka-ks` in KORONA_SUDETOW — four rows, same `lat`/`lng`, different `id`/`points`/`badgeSystem`). `points` is a per-system weight (GOT uses a real point scale; KGP/DIADEM/the korony systems are "collect them all" badges and always use `points: 1`).
- `sharesPeakWith` (optional array on exactly **one** representative row per physical-peak cluster) links those duplicate rows together — see "Peak grouping" below. When adding a new badge system that reuses an existing physical peak, add a new `<id>-<suffix>` row for it and append that new id to the existing representative's `sharesPeakWith` array (don't create a new cluster).
- `trailInfo.js`: `trailInfoByPointId`, keyed by point `id` (not by physical peak) — trailhead/access/trail color/ascent time/elevation gain/notes. Every point in an `available: true` system should have an entry, or `PointsList`/`MapView` fall back to a "w przygotowaniu" message for that point.
- `points.test.js` enforces catalog invariants: unique ids, every `sharesPeakWith` target exists and isn't self-referential, and — the important one — every cluster of points sharing identical coordinates actually forms one connected `sharesPeakWith` group (computed via `buildPeakGroups`), except pairs explicitly listed in `KNOWN_COORDINATE_COINCIDENCES` (physically distinct summits that happen to share an approximate coordinate, e.g. the two Słonny sub-peaks). Geographic sanity bounds are split in two: `POLAND_BOUNDS` for everything except `KORONA_BESKIDOW`, and a much wider `CARPATHIAN_REGION_BOUNDS` for it, because that crown is deliberately international (Poland/Czechia/Slovakia/Ukraine) and its points legitimately sit far outside Poland.
- Coordinates and trail data are sourced from public tourism sites, not an official PTTK feed — expect "orientacyjne"/"szacunkowe" hedging in the data and comments; this is intentional, not a TODO to remove.

### Peak grouping (`src/logic/peakGroups.js`) — how "one visit counts for N systems" works

`buildPeakGroups(points)` reads every `sharesPeakWith` edge in the catalog and returns `Map<id, string[]>` mapping each grouped id to the *other* ids in its physical-peak cluster (BFS over an undirected graph, so it also resolves indirect/chained links, not just direct ones). `getVisitedPointIds(entries, peakGroups = new Map())` (in `visitedPoints.js`) takes that map as an **optional** second argument and expands the visited set at read time — the default empty map means old call sites and old tests are unaffected. `App.jsx` computes `peakGroups` once via `useMemo(() => buildPeakGroups(catalogPoints), [catalogPoints])` and threads it down through `JournalView` to `JournalForm` (merges same-cluster catalog rows into one checkbox, writes only the representative id to `pointIds`, but clears *all* ids in the cluster on uncheck so it still behaves for legacy entries) and `JournalList` (shows every badge system a logged id's cluster counts toward, deduplicating so a legacy entry with several ids from one cluster doesn't print the same peak's label more than once).

This means: **no IndexedDB migration is ever needed** when adding a new badge system that reuses an existing peak — extending `sharesPeakWith` in the static catalog retroactively credits already-saved journal entries, because expansion happens at read time against the current catalog, not against what was true when the entry was saved.

### State/data flow

`App.jsx` is the only component that talks to Dexie. It runs `syncPoints()` on mount and again whenever the logged-in user changes (see "Optional cloud sync" below) (upserts `initialPoints` into `db.points`, deletes rows no longer in the source — safe because "visited" isn't stored on the catalog), reads `catalogPoints`/`entries` via `useLiveQuery`, derives `visitedIds` (via `peakGroups`) and per-system `progressBySystem` (via `calculateProgress`), and passes plain data + callbacks down. Components below `App.jsx` never import `db.js` directly.

Journal entries (`db.journal`, Dexie `@id` — text ids) store `pointIds`, photos (raw `File`/`Blob` objects, stored directly in IndexedDB rather than as URLs), and an optional `gpxTrack`. The `@id` ids carry the `jrn` prefix (a Dexie Cloud requirement for `@id` tables); the v3 migration in `src/db/db.js` copies the legacy `entries` table (`++id`) into `journal`, assigning `'jrn' + randomUUID` without dashes, and v4 drops `entries`. `createDb(name)` builds the Dexie instance (a separate factory so the migration test can open a differently-named DB); `db` is `createDb()`. GPX import (`logic/gpx.js`) matches uploaded track points to catalog points by haversine distance within `DEFAULT_MATCH_THRESHOLD_METERS`, and can legitimately add several ids from the same peak cluster to `selectedIds` in one go — this is accepted as harmless (the merged checkbox still reads correctly) rather than deduplicated at match time.

### Optional cloud sync (Dexie Cloud)

Login and sync are optional and off by default. `db.js` calls `configureCloud(db, url)` only when `VITE_DEXIE_CLOUD_URL` is set (`cloudEnabled`; see `.env.example`), with `requireAuth: false` (the app works logged-out) and `unsyncedTables: ['points']` — the catalog is static and rewritten by `syncPoints()` on every start, so it must never sync; only `journal` does. `configureCloud` also sets `nameSuffix: false`, otherwise the addon renames the IndexedDB to `<name>-<dbid>` and existing local data would be stranded. `src/db/useCloudAccount.js` is the only place that touches `db.cloud`; `App.jsx` only uses the hook (returns `enabled`, `user`, `syncState`, `error`, `login`, `logout`; `login` catches failures into `error`, `logout` swallows cancellation), renders `AccountMenu` only when `cloudEnabled`, and the component itself gets plain props. Logout (always confirmed in `AccountMenu`) clears ALL local tables including `points`; `App.jsx` re-runs `syncPoints()` whenever `account.user?.userId` changes to restore the catalog. `logout({ force: true })` deletes unsynced changes. Exports (`buildExportPayload`) and imports (`importEntries`) strip `id`, `owner` and `realmId`. Without the env var the app behaves exactly as before.

Production status (2026-09-20): the Dexie Cloud database exists and login/sync are live on the Vercel deployment. The database URL is **not** in the repo — it lives in `VITE_DEXIE_CLOUD_URL` (`.env.local` locally, Vercel Production env var in prod); Vite inlines it at build time, so changing it needs a rebuild/redeploy. Every origin that should be able to log in must be added with `npx dexie-cloud whitelist <origin>` (localhost:5173 and the production domain are done; a new domain or Vercel preview URL is not covered). `dexie-cloud.json`, `dexie-cloud.key` and `.env.dexie-cloud` hold CLI credentials and are gitignored — never commit them. The free Dexie Cloud tier allows 3 production users. Setup steps and the manual verification checklist are in README.md ("Logowanie i synchronizacja").

### Component-level testing conventions

- `App.test.jsx` mocks `./db/db` and reimplements `dexie-react-hooks`'s `useLiveQuery` as a plain `useState`+`useEffect` that awaits the mocked module's promises — the *real* `useLiveQuery`/Dexie `liveQuery` never emits against a plain mocked `db` object (it needs real Dexie change-tracking), so don't try to make real Dexie work in these tests. It also mocks `./components/MapView` (the one heavy Leaflet-dependent child).
- `MapView.test.jsx` mocks `react-leaflet` and `leaflet` with simple passthrough stubs and asserts on the props passed to them, rather than rendering a real map.
- `JournalForm.test.jsx` mocks `../logic/imageCompression` (`compressImageFile` uses `createImageBitmap`/canvas, unavailable in jsdom without the native `canvas` package) — compression itself is verified manually in a real browser, not covered by the automated suite.
- `MountainBanner.test.jsx` relies on jsdom having no WebGL (`getContext('webgl')` returns `null`), which is the component's real fallback path, not a mock.

### PWA

`vite-plugin-pwa` (`vite.config.js`) caches OpenStreetMap tile requests (`CacheFirst`, 300 entries / 30 days) for offline map use. Testing offline/PWA behavior requires `npm run build` + `npm run preview` — `npm run dev` doesn't register the service worker the same way.
