# Grupowanie fizycznie tożsamych szczytów — plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Jedno zaznaczenie w formularzu dziennika ma zaliczać wizytę na szczycie do wszystkich systemów odznak (GOT/KGP/DIADEM/KORONA_SUDETOW), do których dany fizyczny szczyt należy, bez zmiany istniejącego modelu per-system i bez utraty postępu z już zapisanych wpisów.

**Architecture:** Nowy czysty moduł `src/logic/peakGroups.js` buduje mapę grup na podstawie jawnego pola `sharesPeakWith` w katalogu (`src/data/points.js`). `getVisitedPointIds` dostaje opcjonalny drugi parametr (mapę grup) i rozszerza nim zbiór odwiedzonych id w locie, przy odczycie — bez migracji IndexedDB. `App.jsx` liczy grupy raz i przekazuje w dół. `JournalForm` scala checklistę w jeden wiersz na grupę; `JournalList` pokazuje wszystkie systemy, do których dany wpis się liczy.

**Tech Stack:** React 19 + Vite, Vitest + @testing-library/react (już skonfigurowane), Dexie/IndexedDB (bez zmian schematu).

**Spec:** `docs/superpowers/specs/2026-09-17-peak-grouping-design.md`

## Global Constraints

- Zero nowych zależności npm.
- Zachować istniejące konwencje: `describe`/`it` importowane z `vitest` (bez `globals: true`), opisy testów po polsku, pliki testowe kolokowane obok modułu/komponentu (`Name.test.js(x)`).
- TDD dla każdej zmiany zachowania: napisz test, zobacz czerwony, zaimplementuj minimalnie, zobacz zielony, dopiero potem commit.
- Nie zmieniać istniejących `id`, `points`, `badgeSystem`, `lat`/`lng`, `name`, `region` żadnego wpisu w `points.js` — wyłącznie dopisanie nowego, opcjonalnego pola `sharesPeakWith`.
- Po każdym tasku: `npx vitest run` musi przechodzić w całości (nie tylko nowy plik testowy) i `npm run lint` musi być czysty.
- Commit na koniec każdego taska, osobno (nie łączyć tasków w jeden commit).

---

### Task 1: `src/logic/peakGroups.js` — budowanie grup z `sharesPeakWith`

**Files:**
- Create: `src/logic/peakGroups.js`
- Create: `src/logic/peakGroups.test.js`

**Interfaces:**
- Produces: `buildPeakGroups(points: Array<{id: string, sharesPeakWith?: string[]}>): Map<string, string[]>` — dla każdego id należącego do grupy zwraca listę **pozostałych** id w tej samej grupie (bez samego siebie); id spoza jakiejkolwiek grupy nie mają wpisu w mapie.

- [ ] **Step 1: Napisz plik testowy z czterema przypadkami**

```js
import { describe, it, expect } from 'vitest'
import { buildPeakGroups } from './peakGroups'

describe('buildPeakGroups', () => {
  it('grupuje punkt z gwiazdą sharesPeakWith ze wszystkimi wskazanymi id', () => {
    const points = [
      { id: 'a', sharesPeakWith: ['b', 'c', 'd'] },
      { id: 'b' },
      { id: 'c' },
      { id: 'd' },
    ]

    const groups = buildPeakGroups(points)

    expect(groups.get('a')).toHaveLength(3)
    expect(groups.get('a')).toEqual(expect.arrayContaining(['b', 'c', 'd']))
    expect(groups.get('b')).toEqual(expect.arrayContaining(['a', 'c', 'd']))
    expect(groups.get('c')).toEqual(expect.arrayContaining(['a', 'b', 'd']))
    expect(groups.get('d')).toEqual(expect.arrayContaining(['a', 'b', 'c']))
  })

  it('łączy punkty pośrednio, przez wspóle powiązanie, nawet bez bezpośredniego linku', () => {
    const points = [
      { id: 'a', sharesPeakWith: ['b'] },
      { id: 'c', sharesPeakWith: ['b'] },
      { id: 'b' },
    ]

    const groups = buildPeakGroups(points)

    expect(groups.get('a')).toEqual(expect.arrayContaining(['b', 'c']))
    expect(groups.get('c')).toEqual(expect.arrayContaining(['a', 'b']))
    expect(groups.get('b')).toEqual(expect.arrayContaining(['a', 'c']))
  })

  it('nie umieszcza w mapie punktów bez żadnego powiązania', () => {
    const points = [{ id: 'a', sharesPeakWith: ['b'] }, { id: 'b' }, { id: 'x' }]

    const groups = buildPeakGroups(points)

    expect(groups.has('x')).toBe(false)
  })

  it('zwraca pustą mapę dla pustego katalogu', () => {
    expect(buildPeakGroups([])).toEqual(new Map())
  })
})
```

- [ ] **Step 2: Uruchom test i zobacz, że nie przechodzi**

Run: `npx vitest run src/logic/peakGroups.test.js`
Expected: FAIL — `Cannot find module './peakGroups'`

- [ ] **Step 3: Zaimplementuj `buildPeakGroups`**

```js
export function buildPeakGroups(points) {
  const adjacency = new Map()

  const addEdge = (a, b) => {
    if (!adjacency.has(a)) adjacency.set(a, new Set())
    if (!adjacency.has(b)) adjacency.set(b, new Set())
    adjacency.get(a).add(b)
    adjacency.get(b).add(a)
  }

  for (const point of points) {
    for (const siblingId of point.sharesPeakWith ?? []) {
      addEdge(point.id, siblingId)
    }
  }

  const groups = new Map()
  const visited = new Set()

  for (const id of adjacency.keys()) {
    if (visited.has(id)) continue

    const component = []
    const queue = [id]
    visited.add(id)

    while (queue.length > 0) {
      const current = queue.shift()
      component.push(current)
      for (const neighbor of adjacency.get(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
        }
      }
    }

    for (const memberId of component) {
      groups.set(memberId, component.filter((otherId) => otherId !== memberId))
    }
  }

  return groups
}
```

- [ ] **Step 4: Uruchom test i zobacz, że przechodzi**

Run: `npx vitest run src/logic/peakGroups.test.js`
Expected: PASS (4/4)

- [ ] **Step 5: Commit**

```bash
git add src/logic/peakGroups.js src/logic/peakGroups.test.js
git commit -m "Dodaj buildPeakGroups do grupowania tożsamych fizycznie szczytów"
```

---

### Task 2: Rozszerz `getVisitedPointIds` o parametr `peakGroups`

**Files:**
- Modify: `src/logic/visitedPoints.js`
- Modify: `src/logic/visitedPoints.test.js`

**Interfaces:**
- Consumes: kształt `Map<string, string[]>` z Task 1 (nie importuje `peakGroups.js` — przyjmuje dowolną mapę o tym kształcie, żeby moduł zostać w pełni niezależny i testowalny osobno).
- Produces: `getVisitedPointIds(entries, peakGroups?: Map<string, string[]>): Set<string>` — drugi parametr opcjonalny, domyślnie pusta mapa.

- [ ] **Step 1: Dopisz failing test do istniejącego pliku**

Dodaj na końcu `describe('getVisitedPointIds', ...)` w `src/logic/visitedPoints.test.js`:

```js
  it('rozszerza zbiór odwiedzonych o punkty z tej samej grupy (peakGroups)', () => {
    const entries = [{ id: 1, pointIds: ['sniezka'] }]
    const peakGroups = new Map([['sniezka', ['sniezka-kgp', 'sniezka-diadem']]])

    expect(getVisitedPointIds(entries, peakGroups)).toEqual(new Set(['sniezka', 'sniezka-kgp', 'sniezka-diadem']))
  })

  it('nie rozszerza zbioru, gdy id nie ma grupy w peakGroups', () => {
    const entries = [{ id: 1, pointIds: ['rysy'] }]
    const peakGroups = new Map([['sniezka', ['sniezka-kgp']]])

    expect(getVisitedPointIds(entries, peakGroups)).toEqual(new Set(['rysy']))
  })
```

- [ ] **Step 2: Uruchom testy i zobacz, że nowe nie przechodzą**

Run: `npx vitest run src/logic/visitedPoints.test.js`
Expected: 2 nowe testy FAIL (zbiór nie zawiera rozszerzonych id — funkcja ignoruje drugi argument), pozostałe 4 istniejące dalej PASS.

- [ ] **Step 3: Zaimplementuj rozszerzenie**

Zamień całą zawartość `src/logic/visitedPoints.js` na:

```js
export function getVisitedPointIds(entries, peakGroups = new Map()) {
  const ids = new Set()
  for (const entry of entries) {
    for (const pointId of entry.pointIds) {
      ids.add(pointId)
      for (const siblingId of peakGroups.get(pointId) ?? []) {
        ids.add(siblingId)
      }
    }
  }
  return ids
}
```

- [ ] **Step 4: Uruchom testy i zobacz, że wszystkie przechodzą**

Run: `npx vitest run src/logic/visitedPoints.test.js`
Expected: PASS (6/6)

- [ ] **Step 5: Commit**

```bash
git add src/logic/visitedPoints.js src/logic/visitedPoints.test.js
git commit -m "Rozszerz getVisitedPointIds o opcjonalne grupy tożsamych szczytów"
```

---

### Task 3: Dopisz `sharesPeakWith` do realnych klastrów duplikatów w `points.js`

**Files:**
- Modify: `src/data/points.js` (dopisanie pola do 51 wpisów, żadnych innych zmian)
- Modify: `src/data/points.test.js`
- Create then delete: `scripts/tmp-add-shares-peak-with.mjs` (jednorazowy skrypt migracyjny, nie trafia do repo)

**Interfaces:**
- Konsumowane dalej w Task 4 przez `buildPeakGroups(initialPoints)`.

Poniższa tabela to kompletny wynik analizy całego katalogu (194 punkty) pod kątem identycznych współrzędnych `lat`/`lng` — to jedyne właściwe źródło duplikatów (nazwa bywa zapisana niespójnie między systemami, np. „Wysoka (Wysokie Skałki)” vs „Wysoka” dla tego samego szczytu w Pieninach — to nie jest błąd, tylko powód, żeby nie polegać na dopasowaniu po nazwie).

**Uwaga o wykluczeniu:** `slonny-pn-zach-diadem` i `slonny-pd-wsch-diadem` mają w katalogu identyczne (przybliżone) współrzędne, ale to **dwa różne wierzchołki** masywu Słonny (północno-zachodni i południowo-wschodni) — nie łączyć ich. To świadomy powód, dla którego grupowanie ma być jawne (`sharesPeakWith`), a nie wywnioskowane ze współrzędnych w runtime.

- [ ] **Step 1: Napisz i uruchom jednorazowy skrypt migracyjny**

Utwórz plik `scripts/tmp-add-shares-peak-with.mjs`:

```js
import fs from 'fs'

const groups = {
  'babia-gora': ['babia-gora-kgp', 'babia-gora-diadem'],
  'biskupia-kopa': ['biskupia-kopa-kgp', 'biskupia-kopa-diadem'],
  'borowa-diadem': ['borowa-ks'],
  'chelmiec': ['chelmiec-kgp', 'chelmiec-diadem'],
  'cwilin': ['cwilin-diadem'],
  'czupel': ['czupel-kgp', 'czupel-diadem'],
  'jagodna': ['jagodna-kgp', 'jagodna-diadem', 'jagodna-ks'],
  'jalowiec': ['jalowiec-diadem'],
  'jaworzyna-krynicka': ['jaworzyna-krynicka-diadem'],
  'klimczok': ['klimczok-diadem'],
  'klodzka-gora-kgp': ['klodzka-gora-diadem', 'klodzka-gora-ks'],
  'koskowa-gora': ['koskowa-gora-diadem'],
  'kowadlo': ['kowadlo-kgp', 'kowadlo-diadem'],
  'kraczonik': ['kraczonik-diadem'],
  'krzesanica': ['krzesanica-diadem'],
  'lackowa': ['lackowa-kgp', 'lackowa-diadem'],
  'lamana-skala': ['lamana-skala-diadem'],
  'luban': ['luban-diadem'],
  'lubomir': ['lubomir-kgp', 'lubomir-diadem'],
  'lubon-wielki': ['lubon-wielki-diadem'],
  'lysica': ['lysica-kgp', 'lysica-diadem'],
  'modyn': ['modyn-diadem'],
  'mogielica': ['mogielica-kgp', 'mogielica-diadem'],
  'orlica': ['orlica-kgp', 'orlica-diadem'],
  'pilsko': ['pilsko-diadem'],
  'polica': ['polica-diadem'],
  'postawna': ['postawna-diadem'],
  'radziejowa': ['radziejowa-kgp', 'radziejowa-diadem'],
  'rudawiec': ['rudawiec-kgp'],
  'rysy': ['rysy-kgp', 'rysy-diadem'],
  'skalnik': ['skalnik-kgp', 'skalnik-diadem', 'skalnik-ks'],
  'skopiec': ['skopiec-kgp', 'skopiec-diadem', 'skopiec-ks'],
  'skrzyczne': ['skrzyczne-kgp', 'skrzyczne-diadem'],
  'sleza': ['sleza-kgp', 'sleza-diadem', 'sleza-ks'],
  'sniezka': ['sniezka-kgp', 'sniezka-diadem', 'sniezka-ks'],
  'sniezniki': ['snieznik-kgp', 'snieznik-diadem', 'snieznik-ks'],
  'swinica': ['swinica-diadem'],
  'szczeliniec-wielki': ['szczeliniec-wielki-kgp', 'szczeliniec-wielki-diadem', 'szczeliniec-wielki-ks'],
  'tarnica': ['tarnica-kgp', 'tarnica-diadem'],
  'trojgarb': ['trojgarb-diadem'],
  'trzy-korony': ['trzy-korony-diadem'],
  'turbacz': ['turbacz-kgp', 'turbacz-diadem'],
  'waligora': ['waligora-kgp', 'waligora-diadem', 'waligora-ks'],
  'watkowa': ['watkowa-diadem'],
  'wielka-czantoria': ['wielka-czantoria-diadem'],
  'wielka-racza': ['wielka-racza-diadem'],
  'wielka-rawka': ['wielka-rawka-diadem'],
  'wielka-sowa': ['wielka-sowa-kgp', 'wielka-sowa-diadem', 'wielka-sowa-ks'],
  'wlodarz': ['wlodarz-diadem'],
  'wysoka-kopa': ['wysoka-kopa-kgp', 'wysoka-kopa-diadem', 'wysoka-kopa-ks'],
  'wysoka-pieniny': ['wysoka-pieniny-kgp', 'wysoka-pieniny-diadem'],
}

const path = 'src/data/points.js'
let content = fs.readFileSync(path, 'utf8')

for (const [id, siblings] of Object.entries(groups)) {
  const idPattern = `id: '${id}',`
  const idx = content.indexOf(idPattern)
  if (idx === -1) throw new Error(`Nie znaleziono wpisu o id: ${id}`)

  const lineEnd = content.indexOf('},', idx)
  if (lineEnd === -1) throw new Error(`Nie znaleziono końca wpisu dla id: ${id}`)

  const before = content.slice(0, lineEnd)
  const after = content.slice(lineEnd)
  content = `${before}, sharesPeakWith: ${JSON.stringify(siblings)}${after}`
}

fs.writeFileSync(path, content)
console.log(`Dopisano sharesPeakWith do ${Object.keys(groups).length} wpisów.`)
```

Run: `node scripts/tmp-add-shares-peak-with.mjs`
Expected: `Dopisano sharesPeakWith do 51 wpisów.`

- [ ] **Step 2: Zweryfikuj wynik ręcznie**

Run:
```bash
node --input-type=module -e "
import { initialPoints } from './src/data/points.js';
const withGroups = initialPoints.filter(p => p.sharesPeakWith);
console.log('wpisów z sharesPeakWith:', withGroups.length);
"
```
Expected: `wpisów z sharesPeakWith: 51`

- [ ] **Step 3: Usuń jednorazowy skrypt**

```bash
rm scripts/tmp-add-shares-peak-with.mjs
```

- [ ] **Step 4: Dopisz test integralności danych do `points.test.js`**

Dodaj na końcu `describe('initialPoints', ...)` w `src/data/points.test.js`:

```js
  it('każde sharesPeakWith wskazuje na istniejące id i nie zawiera samego siebie', () => {
    const idsSet = new Set(initialPoints.map((point) => point.id))
    for (const point of initialPoints) {
      for (const siblingId of point.sharesPeakWith ?? []) {
        expect(idsSet.has(siblingId)).toBe(true)
        expect(siblingId).not.toBe(point.id)
      }
    }
  })
```

- [ ] **Step 5: Uruchom pełny zestaw testów**

Run: `npx vitest run`
Expected: wszystkie testy PASS (żaden istniejący test nie powinien się zepsuć — dodane pole jest czysto addytywne).

- [ ] **Step 6: Commit**

```bash
git add src/data/points.js src/data/points.test.js
git commit -m "Dopisz sharesPeakWith do 51 klastrów fizycznie tożsamych szczytów"
```

---

### Task 4: Okablowanie w `App.jsx` i `JournalView.jsx`

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/JournalView.jsx`

**Interfaces:**
- Consumes: `buildPeakGroups` (Task 1), `getVisitedPointIds(entries, peakGroups)` (Task 2).
- Produces: prop `peakGroups: Map<string, string[]>` przekazywany do `JournalView` → `JournalForm`/`JournalList` (konsumowane w Task 5 i 6).

- [ ] **Step 1: Zaimportuj `buildPeakGroups` w `App.jsx`**

W `src/App.jsx` zmień:
```js
import { getVisitedPointIds } from './logic/visitedPoints'
```
na:
```js
import { getVisitedPointIds } from './logic/visitedPoints'
import { buildPeakGroups } from './logic/peakGroups'
```

- [ ] **Step 2: Policz `peakGroups` i użyj go w `getVisitedPointIds`**

W `src/App.jsx` zmień:
```js
  const visitedIds = useMemo(() => getVisitedPointIds(entries), [entries])
```
na:
```js
  const peakGroups = useMemo(() => buildPeakGroups(catalogPoints), [catalogPoints])
  const visitedIds = useMemo(() => getVisitedPointIds(entries, peakGroups), [entries, peakGroups])
```

- [ ] **Step 3: Przekaż `peakGroups` do `JournalView`**

W `src/App.jsx` zmień blok renderowania widoku dziennika:
```jsx
      {view === 'journal' && (
        <JournalView
          points={catalogPoints}
          entries={entries}
          onSaveEntry={saveEntry}
          onDeleteEntry={deleteEntry}
          onImportEntries={importEntries}
        />
      )}
```
na:
```jsx
      {view === 'journal' && (
        <JournalView
          points={catalogPoints}
          entries={entries}
          onSaveEntry={saveEntry}
          onDeleteEntry={deleteEntry}
          onImportEntries={importEntries}
          peakGroups={peakGroups}
        />
      )}
```

- [ ] **Step 4: Przyjmij i przekaż `peakGroups` w `JournalView.jsx`**

W `src/components/JournalView.jsx` zmień sygnaturę funkcji:
```js
function JournalView({ points, entries, onSaveEntry, onDeleteEntry, onImportEntries }) {
```
na:
```js
function JournalView({ points, entries, onSaveEntry, onDeleteEntry, onImportEntries, peakGroups }) {
```

Zmień renderowanie `JournalForm` i `JournalList`:
```jsx
      <JournalForm
        key={editingEntry?.id ?? 'new'}
        points={points}
        editingEntry={editingEntry}
        onSubmit={handleSave}
        onCancel={() => setEditingEntry(null)}
      />
      <JournalList entries={entries} points={points} onEdit={setEditingEntry} onDelete={handleDelete} />
```
na:
```jsx
      <JournalForm
        key={editingEntry?.id ?? 'new'}
        points={points}
        editingEntry={editingEntry}
        onSubmit={handleSave}
        onCancel={() => setEditingEntry(null)}
        peakGroups={peakGroups}
      />
      <JournalList
        entries={entries}
        points={points}
        onEdit={setEditingEntry}
        onDelete={handleDelete}
        peakGroups={peakGroups}
      />
```

- [ ] **Step 5: Uruchom pełny zestaw testów**

Run: `npx vitest run`
Expected: wszystkie testy PASS (Task 5/6 jeszcze nie czytają `peakGroups`, więc to czysta zmiana okablowania — `JournalForm`/`JournalList` dostaną prop, ale go jeszcze nie użyją; `App.test.jsx` mockuje `./db/db`, więc realne dane wciąż nie mają `sharesPeakWith` w mocku testowym — bez znaczenia, `buildPeakGroups` zwróci wtedy pustą mapę).

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/components/JournalView.jsx
git commit -m "Policz peakGroups w App.jsx i przekaż do widoku dziennika"
```

---

### Task 5: Scalona checklista w `JournalForm.jsx`

**Files:**
- Modify: `src/components/JournalForm.jsx`
- Modify: `src/components/JournalForm.test.jsx`

**Interfaces:**
- Consumes: prop `peakGroups: Map<string, string[]>` (domyślnie `new Map()`, żeby istniejące testy/wywołania bez tego propa działały bez zmian).

- [ ] **Step 1: Dopisz dwa failing testy**

Dodaj na końcu pliku `src/components/JournalForm.test.jsx`, w `describe('JournalForm', ...)`, i zaimportuj `buildPeakGroups`:

```js
import { buildPeakGroups } from '../logic/peakGroups'
```

```js
  it('scala punkty tego samego szczytu w jedną pozycję z plakietkami wszystkich systemów', async () => {
    const user = userEvent.setup()
    const groupedPoints = [
      { id: 'sniezka', name: 'Śnieżka', region: 'Karkonosze', badgeSystem: 'GOT', lat: 50.736, lng: 15.74, sharesPeakWith: ['sniezka-kgp'] },
      { id: 'sniezka-kgp', name: 'Śnieżka', region: 'Karkonosze', badgeSystem: 'KGP', lat: 50.736, lng: 15.74 },
    ]
    const peakGroups = buildPeakGroups(groupedPoints)
    const onSubmit = vi.fn()

    render(<JournalForm points={groupedPoints} editingEntry={null} onSubmit={onSubmit} onCancel={vi.fn()} peakGroups={peakGroups} />)

    expect(screen.getAllByRole('checkbox')).toHaveLength(1)
    expect(screen.getByRole('checkbox', { name: 'Śnieżka (Karkonosze, GOT, KGP)' })).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Zapisz wpis' }))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ pointIds: ['sniezka'] }))
  })

  it('odznaczenie scalonej pozycji usuwa wszystkie powiązane id z zaznaczenia', async () => {
    const user = userEvent.setup()
    const groupedPoints = [
      { id: 'sniezka', name: 'Śnieżka', region: 'Karkonosze', badgeSystem: 'GOT', lat: 50.736, lng: 15.74, sharesPeakWith: ['sniezka-kgp'] },
      { id: 'sniezka-kgp', name: 'Śnieżka', region: 'Karkonosze', badgeSystem: 'KGP', lat: 50.736, lng: 15.74 },
    ]
    const peakGroups = buildPeakGroups(groupedPoints)
    // Wpis sprzed tej zmiany, z osobno zapisanym tylko jednym id z grupy.
    const editingEntry = { id: 1, date: '2026-05-01', note: '', pointIds: ['sniezka-kgp'], photos: [], gpxTrack: [] }

    render(<JournalForm points={groupedPoints} editingEntry={editingEntry} onSubmit={vi.fn()} onCancel={vi.fn()} peakGroups={peakGroups} />)

    const checkbox = screen.getByRole('checkbox', { name: /Śnieżka/ })
    expect(checkbox).toBeChecked()

    await user.click(checkbox)

    expect(checkbox).not.toBeChecked()
  })
```

- [ ] **Step 2: Uruchom testy i zobacz, że nowe nie przechodzą**

Run: `npx vitest run src/components/JournalForm.test.jsx`
Expected: 2 nowe testy FAIL (dziś renderują się 2 osobne checkboxy zamiast 1 scalonego).

- [ ] **Step 3: Zaimplementuj scalanie w `JournalForm.jsx`**

Dodaj import na górze pliku:
```js
import { useMemo, useState } from 'react'
```
(zamień istniejące `import { useState } from 'react'` na powyższe).

Zmień sygnaturę komponentu:
```js
function JournalForm({ points, editingEntry, onSubmit, onCancel, peakGroups = new Map() }) {
```

Dodaj po istniejących `useState` (przed `togglePointSelection`):
```js
  const pointsById = useMemo(() => new Map(points.map((point) => [point.id, point])), [points])

  const checklistRows = useMemo(() => {
    const rendered = new Set()
    const rows = []
    for (const point of points) {
      if (rendered.has(point.id)) continue
      const siblingIds = peakGroups.get(point.id) ?? []
      const groupIds = [point.id, ...siblingIds]
      groupIds.forEach((id) => rendered.add(id))
      rows.push({
        representativeId: point.id,
        groupIds,
        name: point.name,
        region: point.region,
        badgeSystems: groupIds.map((id) => pointsById.get(id)?.badgeSystem ?? id),
      })
    }
    return rows
  }, [points, peakGroups, pointsById])
```

Zamień `togglePointSelection`:
```js
  const togglePointSelection = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((pointId) => pointId !== id) : [...current, id],
    )
  }
```
na:
```js
  const toggleGroupSelection = (representativeId, groupIds) => {
    setSelectedIds((current) => {
      const isChecked = groupIds.some((id) => current.includes(id))
      return isChecked
        ? current.filter((id) => !groupIds.includes(id))
        : [...current, representativeId]
    })
  }
```

Zamień renderowanie checklisty:
```jsx
        <div className="point-checklist">
          {points.map((point) => (
            <label key={point.id} className="point-checklist-item">
              <input
                type="checkbox"
                checked={selectedIds.includes(point.id)}
                onChange={() => togglePointSelection(point.id)}
              />
              {point.name} ({point.region}, {point.badgeSystem})
            </label>
          ))}
        </div>
```
na:
```jsx
        <div className="point-checklist">
          {checklistRows.map((row) => (
            <label key={row.representativeId} className="point-checklist-item">
              <input
                type="checkbox"
                checked={row.groupIds.some((id) => selectedIds.includes(id))}
                onChange={() => toggleGroupSelection(row.representativeId, row.groupIds)}
              />
              {row.name} ({row.region}, {row.badgeSystems.join(', ')})
            </label>
          ))}
        </div>
```

- [ ] **Step 4: Uruchom cały plik testowy JournalForm**

Run: `npx vitest run src/components/JournalForm.test.jsx`
Expected: PASS (9/9 — 7 istniejących + 2 nowe; istniejące testy używają punktów bez `sharesPeakWith`, więc `checklistRows` sprowadza się dokładnie do dzisiejszego zachowania, jeden wiersz na punkt).

- [ ] **Step 5: Commit**

```bash
git add src/components/JournalForm.jsx src/components/JournalForm.test.jsx
git commit -m "Scal checklistę w JournalForm dla fizycznie tożsamych szczytów"
```

---

### Task 6: Wielosystemowe etykiety w `JournalList.jsx`

**Files:**
- Modify: `src/components/JournalList.jsx`
- Modify: `src/components/JournalList.test.jsx`

**Interfaces:**
- Consumes: prop `peakGroups: Map<string, string[]>` (domyślnie `new Map()`).

- [ ] **Step 1: Dopisz failing test**

Dodaj na końcu `describe('JournalList', ...)` w `src/components/JournalList.test.jsx`:

```js
  it('pokazuje wszystkie systemy, do których liczy się wpis z połączonego szczytu', () => {
    const groupedPoints = [
      { id: 'sniezka', name: 'Śnieżka', region: 'Karkonosze', badgeSystem: 'GOT' },
      { id: 'sniezka-kgp', name: 'Śnieżka', region: 'Karkonosze', badgeSystem: 'KGP' },
    ]
    const peakGroups = new Map([['sniezka', ['sniezka-kgp']]])
    const entry = { id: 1, date: '2026-05-01', note: '', pointIds: ['sniezka'], photos: [] }

    render(<JournalList entries={[entry]} points={groupedPoints} onEdit={vi.fn()} onDelete={vi.fn()} peakGroups={peakGroups} />)

    expect(screen.getByText('Śnieżka (GOT, KGP)')).toBeInTheDocument()
  })
```

- [ ] **Step 2: Uruchom test i zobacz, że nie przechodzi**

Run: `npx vitest run src/components/JournalList.test.jsx`
Expected: nowy test FAIL — dziś pokaże `Śnieżka (GOT)` (bez KGP).

- [ ] **Step 3: Zaimplementuj rozszerzenie etykiety**

Zamień:
```js
function pointNames(pointIds, pointsById) {
  return pointIds
    .map((id) => {
      const point = pointsById.get(id)
      return point ? `${point.name} (${point.badgeSystem})` : id
    })
    .join(', ')
}
```
na:
```js
function pointNames(pointIds, pointsById, peakGroups) {
  return pointIds
    .map((id) => {
      const point = pointsById.get(id)
      if (!point) return id

      const siblingIds = peakGroups.get(id) ?? []
      const badgeSystems = [point.badgeSystem, ...siblingIds.map((siblingId) => pointsById.get(siblingId)?.badgeSystem)].filter(
        Boolean,
      )
      return `${point.name} (${badgeSystems.join(', ')})`
    })
    .join(', ')
}
```

Zmień sygnaturę komponentu:
```js
function JournalList({ entries, points, onEdit, onDelete, peakGroups = new Map() }) {
```

Zmień wywołanie w JSX:
```jsx
            <p className="journal-entry-points">{pointNames(entry.pointIds, pointsById)}</p>
```
na:
```jsx
            <p className="journal-entry-points">{pointNames(entry.pointIds, pointsById, peakGroups)}</p>
```

- [ ] **Step 4: Uruchom cały plik testowy JournalList**

Run: `npx vitest run src/components/JournalList.test.jsx`
Expected: PASS (6/6 — 5 istniejących + 1 nowy).

- [ ] **Step 5: Commit**

```bash
git add src/components/JournalList.jsx src/components/JournalList.test.jsx
git commit -m "Pokaż wszystkie systemy odznak dla scalonych szczytów w JournalList"
```

---

### Task 7: Pełna weryfikacja końcowa

**Files:** brak zmian — tylko weryfikacja.

- [ ] **Step 1: Uruchom cały zestaw testów**

Run: `npx vitest run`
Expected: wszystkie testy PASS (istniejące + nowe z Tasków 1–6).

- [ ] **Step 2: Uruchom lint**

Run: `npm run lint`
Expected: brak błędów.

- [ ] **Step 3: Uruchom build produkcyjny**

Run: `npm run build`
Expected: build kończy się sukcesem, bez nowych ostrzeżeń ponad istniejące (rozmiar chunka >500kB — znany, niezwiązany z tą zmianą).

- [ ] **Step 4: Ręczna weryfikacja w przeglądarce**

Uruchom `npm run dev`, otwórz zakładkę „Dziennik”, sprawdź:
- lista „Odwiedzone punkty” pokazuje jeden wiersz dla Śnieżki (i innych szczytów z co najmniej 2 systemami) z plakietkami wszystkich systemów zamiast 4 osobnych checkboxów,
- zaznaczenie i zapisanie wpisu pokazuje w liście wpisów dziennika pełną listę systemów, np. „Śnieżka (GOT, KGP, DIADEM, KORONA_SUDETOW)”,
- przełącz się na listę/mapę GOT i KGP osobno — Śnieżka powinna pokazywać się jako odwiedzona w obu, mimo jednego zaznaczenia w dzienniku.

- [ ] **Step 5: Commit (jeśli step 4 wymagał poprawek) lub finalny push**

Jeśli wszystko działa bez poprawek, ten task nie generuje nowego commita — repo jest już w pożądanym stanie po Tasku 6.
