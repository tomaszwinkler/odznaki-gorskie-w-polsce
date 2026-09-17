# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

PWA (React + Vite) for tracking progress toward Polish mountain-hiking badges (GOT, Korona Gór Polski, Diadem Polskich Gór, and three "korony makroregionalne" — Korona Sudetów, Korona Beskidów, Turystyczna Korona Tatr). All data lives client-side in IndexedDB (Dexie) — no backend, no accounts. UI text, data, comments, commit messages, and test descriptions are all in Polish; keep it that way.

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

- `badgeCategories.js` / `badgeSystems.js`: badge systems grouped into categories. Each system has `available: boolean` — `false` means no catalog/levels loaded yet, and the UI shows a "dane w przygotowaniu" placeholder (`SystemPlaceholder`) instead of an empty list/map. When turning a system on, both `badgeSystems.js` (flip `available`) and `badgeLevelsBySystem` in `badgeLevels.js` must be filled in, or `badgeSystems.test.js` fails.
- `points.js`: the full point catalog (`initialPoints`), one flat array. **The same physical peak appears once per badge system it belongs to** (e.g. Śnieżka exists as `sniezka` in GOT, `sniezka-kgp` in KGP, `sniezka-diadem` in DIADEM, `sniezka-ks` in KORONA_SUDETOW — four rows, same `lat`/`lng`, different `id`/`points`/`badgeSystem`). `points` is a per-system weight (GOT uses a real point scale; KGP/DIADEM/the korony systems are "collect them all" badges and always use `points: 1`).
- `sharesPeakWith` (optional array on exactly **one** representative row per physical-peak cluster) links those duplicate rows together — see "Peak grouping" below. When adding a new badge system that reuses an existing physical peak, add a new `<id>-<suffix>` row for it and append that new id to the existing representative's `sharesPeakWith` array (don't create a new cluster).
- `trailInfo.js`: `trailInfoByPointId`, keyed by point `id` (not by physical peak) — trailhead/access/trail color/ascent time/elevation gain/notes. Every point in an `available: true` system should have an entry, or `PointsList`/`MapView` fall back to a "w przygotowaniu" message for that point.
- `points.test.js` enforces catalog invariants: unique ids, every `sharesPeakWith` target exists and isn't self-referential, and — the important one — every cluster of points sharing identical coordinates actually forms one connected `sharesPeakWith` group (computed via `buildPeakGroups`), except pairs explicitly listed in `KNOWN_COORDINATE_COINCIDENCES` (physically distinct summits that happen to share an approximate coordinate, e.g. the two Słonny sub-peaks). Geographic sanity bounds are split in two: `POLAND_BOUNDS` for everything except `KORONA_BESKIDOW`, and a much wider `CARPATHIAN_REGION_BOUNDS` for it, because that crown is deliberately international (Poland/Czechia/Slovakia/Ukraine) and its points legitimately sit far outside Poland.
- Coordinates and trail data are sourced from public tourism sites, not an official PTTK feed — expect "orientacyjne"/"szacunkowe" hedging in the data and comments; this is intentional, not a TODO to remove.

### Peak grouping (`src/logic/peakGroups.js`) — how "one visit counts for N systems" works

`buildPeakGroups(points)` reads every `sharesPeakWith` edge in the catalog and returns `Map<id, string[]>` mapping each grouped id to the *other* ids in its physical-peak cluster (BFS over an undirected graph, so it also resolves indirect/chained links, not just direct ones). `getVisitedPointIds(entries, peakGroups = new Map())` (in `visitedPoints.js`) takes that map as an **optional** second argument and expands the visited set at read time — the default empty map means old call sites and old tests are unaffected. `App.jsx` computes `peakGroups` once via `useMemo(() => buildPeakGroups(catalogPoints), [catalogPoints])` and threads it down through `JournalView` to `JournalForm` (merges same-cluster catalog rows into one checkbox, writes only the representative id to `pointIds`, but clears *all* ids in the cluster on uncheck so it still behaves for legacy entries) and `JournalList` (shows every badge system a logged id's cluster counts toward, deduplicating so a legacy entry with several ids from one cluster doesn't print the same peak's label more than once).

This means: **no IndexedDB migration is ever needed** when adding a new badge system that reuses an existing peak — extending `sharesPeakWith` in the static catalog retroactively credits already-saved journal entries, because expansion happens at read time against the current catalog, not against what was true when the entry was saved.

### State/data flow

`App.jsx` is the only component that talks to Dexie. It runs `syncPoints()` once on mount (upserts `initialPoints` into `db.points`, deletes rows no longer in the source — safe because "visited" isn't stored on the catalog), reads `catalogPoints`/`entries` via `useLiveQuery`, derives `visitedIds` (via `peakGroups`) and per-system `progressBySystem` (via `calculateProgress`), and passes plain data + callbacks down. Components below `App.jsx` never import `db.js` directly.

Journal entries (`db.entries`, Dexie `++id`) store `pointIds`, photos (raw `File`/`Blob` objects — not URLs, since there's no backend to upload to), and an optional `gpxTrack`. GPX import (`logic/gpx.js`) matches uploaded track points to catalog points by haversine distance within `DEFAULT_MATCH_THRESHOLD_METERS`, and can legitimately add several ids from the same peak cluster to `selectedIds` in one go — this is accepted as harmless (the merged checkbox still reads correctly) rather than deduplicated at match time.

### Component-level testing conventions

- `App.test.jsx` mocks `./db/db` and reimplements `dexie-react-hooks`'s `useLiveQuery` as a plain `useState`+`useEffect` that awaits the mocked module's promises — the *real* `useLiveQuery`/Dexie `liveQuery` never emits against a plain mocked `db` object (it needs real Dexie change-tracking), so don't try to make real Dexie work in these tests. It also mocks `./components/MapView` (the one heavy Leaflet-dependent child).
- `MapView.test.jsx` mocks `react-leaflet` and `leaflet` with simple passthrough stubs and asserts on the props passed to them, rather than rendering a real map.
- `JournalForm.test.jsx` mocks `../logic/imageCompression` (`compressImageFile` uses `createImageBitmap`/canvas, unavailable in jsdom without the native `canvas` package) — compression itself is verified manually in a real browser, not covered by the automated suite.
- `MountainBanner.test.jsx` relies on jsdom having no WebGL (`getContext('webgl')` returns `null`), which is the component's real fallback path, not a mock.

### PWA

`vite-plugin-pwa` (`vite.config.js`) caches OpenStreetMap tile requests (`CacheFirst`, 300 entries / 30 days) for offline map use. Testing offline/PWA behavior requires `npm run build` + `npm run preview` — `npm run dev` doesn't register the service worker the same way.
