# Logowanie użytkowników (Dexie Cloud) — plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Umożliwić opcjonalne logowanie (kod e-mail) i synchronizację dziennika między urządzeniami przez Dexie Cloud, bez zmian w `src/logic/`.

**Architecture:** Tabela `entries` (`++id`) jest migrowana do nowej tabeli `journal` (`@id`, id tekstowe) przez Dexie v3/v4. `db.js` dostaje fabrykę `createDb(name)` (testowalną migrację) i warunkową konfigurację chmury sterowaną `VITE_DEXIE_CLOUD_URL`. Stan konta czyta hook `useCloudAccount` (jedyny obok `App.jsx` plik znający `db`), a prezentacyjny `AccountMenu` dostaje zwykłe propsy.

**Tech Stack:** React 19, Dexie 4 + `dexie-cloud-addon`, `dexie-react-hooks` (`useObservable`), Vitest + jsdom + fake-indexeddb.

**Spec:** `docs/superpowers/specs/2026-09-19-logowanie-dexie-cloud-design.md`

## Global Constraints

- Cały tekst UI, komentarze, opisy testów i komunikaty commitów po polsku.
- Zwykły JS/JSX, bez TypeScript. Testy obok plików, `describe`/`it`/`expect` importowane jawnie z `vitest`.
- Tylko `App.jsx` (oraz `src/db/*`) importuje `db`; komponenty poniżej dostają dane i callbacki przez propsy.
- Tabela `points` nigdy się nie synchronizuje (`unsyncedTables: ['points']`).
- Bez `VITE_DEXIE_CLOUD_URL` aplikacja działa dokładnie jak dziś, a menu konta się nie renderuje.
- Poza zakresem: udostępnianie danych, role, profile, logowanie przez Google, własny formularz logowania.
- Commity kończymy linią: `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.

---

### Task 1: Migracja `entries` → `journal` (id tekstowe) + przepięcie App

**Files:**
- Modify: `package.json` (zależność `dexie-cloud-addon`)
- Modify: `src/db/db.js`
- Modify: `src/db/db.test.js`
- Modify: `src/App.jsx:52,65,67,72`
- Modify: `src/App.test.jsx:40-41`

**Interfaces:**
- Produces: `createDb(name?: string): Dexie` (z tabelami `points`, `journal`), `db` (instancja `createDb()`), `syncPoints()`, `importEntries(entries)` (zapis do `db.journal`).

- [ ] **Step 1: Zainstaluj addon i sprawdź dokumentację**

Run: `npm install dexie-cloud-addon`

Następnie przez context7 (`resolve-library-id` → `query-docs`, biblioteka `dexie-cloud`) potwierdź: (a) czy addon przyjmuje ręcznie podane id tekstowe w tabeli `@id`, (b) czy `++id` w starszych wersjach schematu nie powoduje błędu przy otwarciu bazy, (c) dokładne wartości `syncState.phase`. Jeśli (a) lub (b) okaże się nieprawdą, zatrzymaj się i zgłoś to użytkownikowi, zamiast improwizować.

- [ ] **Step 2: Napisz test migracji (zawodzi)**

W `src/db/db.test.js` zmień importy i `beforeEach`, dodaj test migracji:

```js
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createDb, db, syncPoints, importEntries } from './db'
import { initialPoints } from '../data/points'

beforeEach(async () => {
  await db.points.clear()
  await db.journal.clear()
})
```

Zamień w teście `importEntries` `db.entries` na `db.journal`:

```js
describe('importEntries', () => {
  it('dokłada zaimportowane wpisy do istniejących, nadając nowe id', async () => {
    await db.journal.add({ id: 'stary-wpis', date: '2026-01-01', note: 'stary wpis', pointIds: [], photos: [], gpxTrack: [] })

    await importEntries([{ date: '2026-05-01', note: 'nowy wpis', pointIds: [], photos: [], gpxTrack: [] }])

    const stored = await db.journal.toArray()
    expect(stored).toHaveLength(2)
    expect(stored.map((entry) => entry.note)).toEqual(expect.arrayContaining(['stary wpis', 'nowy wpis']))
    expect(stored.every((entry) => typeof entry.id === 'string')).toBe(true)
  })
})
```

Na końcu pliku dodaj:

```js
describe('migracja bazy z wersji 2', () => {
  const NAME = 'migracja-test'
  afterEach(async () => {
    await Dexie.delete(NAME)
  })

  it('przenosi wpisy z entries do journal z unikalnymi tekstowymi id i usuwa entries', async () => {
    const legacy = new Dexie(NAME)
    legacy.version(2).stores({ points: 'id', entries: '++id, date' })
    await legacy.table('entries').bulkAdd([
      { date: '2026-01-01', note: 'a', pointIds: ['sniezka'], photos: [], gpxTrack: [] },
      { date: '2026-02-02', note: 'b', pointIds: [], photos: [], gpxTrack: [] },
    ])
    legacy.close()

    const migrated = createDb(NAME)
    const rows = await migrated.table('journal').toArray()

    expect(rows).toHaveLength(2)
    expect(rows.map((row) => row.note).sort()).toEqual(['a', 'b'])
    expect(rows.every((row) => typeof row.id === 'string' && row.id.length > 0)).toBe(true)
    expect(new Set(rows.map((row) => row.id)).size).toBe(2)
    expect(rows.find((row) => row.note === 'a').pointIds).toEqual(['sniezka'])
    expect(migrated.tables.map((table) => table.name)).not.toContain('entries')
    migrated.close()
  })
})
```

- [ ] **Step 3: Uruchom test — ma zawieść**

Run: `npx vitest run src/db/db.test.js`
Expected: FAIL (`createDb` nie istnieje / `db.journal` undefined).

- [ ] **Step 4: Zaimplementuj w `src/db/db.js`**

Zastąp początek pliku (importy, `db`, `version(1..2)`) poniższym; `syncPoints` zostaje bez zmian, `importEntries` zapisuje do `journal`:

```js
import Dexie from 'dexie'
import dexieCloud from 'dexie-cloud-addon'
import { initialPoints } from '../data/points'

// Fabryka istnieje po to, żeby test migracji mógł otworzyć bazę o innej nazwie.
export function createDb(name = 'odznaki-gorskie') {
  const database = new Dexie(name, { addons: [dexieCloud] })

  database.version(1).stores({
    points: 'id',
  })

  database.version(2).stores({
    points: 'id',
    entries: '++id, date',
  })

  // Dexie nie pozwala zmienić klucza głównego w miejscu, więc dziennik trafia
  // do nowej tabeli `journal` z tekstowymi id (wymaganymi przez synchronizację
  // — auto-inkrementowane id kolidowałyby między urządzeniami).
  database
    .version(3)
    .stores({
      points: 'id',
      entries: '++id, date',
      journal: '@id, date',
    })
    .upgrade(async (tx) => {
      const legacyEntries = await tx.table('entries').toArray()
      await tx
        .table('journal')
        .bulkAdd(legacyEntries.map(({ id: _legacyId, ...entry }) => ({ id: crypto.randomUUID(), ...entry })))
    })

  database.version(4).stores({
    points: 'id',
    entries: null,
    journal: '@id, date',
  })

  return database
}

export const db = createDb()
```

W komentarzu `syncPoints` zamień „tabeli `entries`" na „tabeli `journal`". Zmień `importEntries`:

```js
export async function importEntries(entries) {
  await db.journal.bulkAdd(entries)
}
```

W komentarzu nad `importEntries` zamień „nadaje nowe klucze `++id`" na „nadaje nowe klucze `@id`".

- [ ] **Step 5: Przepnij `App.jsx` i mock w `App.test.jsx`**

`src/App.jsx`: zamień `db.entries` na `db.journal` w liniach 52, 65, 67, 72 (`useLiveQuery(() => db.journal.toArray(), [], [])`, `db.journal.update`, `db.journal.add`, `db.journal.delete`).

`src/App.test.jsx`: w mocku `db` zamień `entries: {...}` na `journal: { toArray: () => Promise.resolve(entries) }`, a w fixture zmień `id: 1` na `id: 'wpis-1'`.

- [ ] **Step 6: Uruchom całe testy i lint**

Run: `npm test` oraz `npm run lint`
Expected: PASS. Jeśli import `dexie-cloud-addon` wywala się w jsdom (np. brak API przeglądarki), zatrzymaj się i zgłoś to — wtedy spec wymaga zmiany schematu na `id` z id generowanymi w aplikacji.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/db/db.js src/db/db.test.js src/App.jsx src/App.test.jsx
git commit -m "Zmigruj dziennik do tabeli journal z tekstowymi id (przygotowanie pod Dexie Cloud)"
```

---

### Task 2: Warunkowa konfiguracja chmury

**Files:**
- Modify: `src/db/db.js`
- Create: `.env.example`
- Modify: `src/db/db.test.js`

**Interfaces:**
- Consumes: `createDb`, `db` z Task 1.
- Produces: `configureCloud(database, databaseUrl)`, `cloudEnabled: boolean` (true, gdy `VITE_DEXIE_CLOUD_URL` jest ustawiony).

- [ ] **Step 1: Napisz test (zawodzi)**

W `src/db/db.test.js` dodaj `vi` do importu z `vitest`, zaimportuj `configureCloud` i dopisz:

```js
describe('configureCloud', () => {
  it('konfiguruje chmurę z opcjonalnym logowaniem i bez synchronizacji katalogu', () => {
    const fakeDb = { cloud: { configure: vi.fn() } }

    configureCloud(fakeDb, 'https://przyklad.dexie.cloud')

    expect(fakeDb.cloud.configure).toHaveBeenCalledWith({
      databaseUrl: 'https://przyklad.dexie.cloud',
      requireAuth: false,
      unsyncedTables: ['points'],
    })
  })
})
```

- [ ] **Step 2: Uruchom — ma zawieść**

Run: `npx vitest run src/db/db.test.js -t "configureCloud"`
Expected: FAIL (`configureCloud` nie jest eksportowane).

- [ ] **Step 3: Zaimplementuj**

W `src/db/db.js`, po `export const db = createDb()`:

```js
// Chmura jest włączana tylko po ustawieniu VITE_DEXIE_CLOUD_URL — bez niej
// aplikacja działa lokalnie, jak dotychczas. Katalog `points` jest statyczny
// (syncPoints nadpisuje go przy każdym starcie), więc nie może się synchronizować.
export function configureCloud(database, databaseUrl) {
  database.cloud.configure({
    databaseUrl,
    requireAuth: false,
    unsyncedTables: ['points'],
  })
}

const cloudUrl = import.meta.env.VITE_DEXIE_CLOUD_URL
export const cloudEnabled = Boolean(cloudUrl)

if (cloudEnabled) {
  configureCloud(db, cloudUrl)
}
```

Utwórz `.env.example`:

```
# URL bazy Dexie Cloud (npx dexie-cloud create). Bez niego aplikacja działa tylko lokalnie.
VITE_DEXIE_CLOUD_URL=
```

- [ ] **Step 4: Uruchom testy**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/db/db.js src/db/db.test.js .env.example
git commit -m "Dodaj warunkową konfigurację Dexie Cloud sterowaną VITE_DEXIE_CLOUD_URL"
```

---

### Task 3: Hook `useCloudAccount` i komponent `AccountMenu`

**Files:**
- Create: `src/db/useCloudAccount.js`
- Create: `src/components/AccountMenu.jsx`
- Create: `src/components/AccountMenu.test.jsx`

**Interfaces:**
- Consumes: `db`, `cloudEnabled` z `./db`; `useObservable` z `dexie-react-hooks`.
- Produces:
  - `useCloudAccount(): { enabled: boolean, user: { isLoggedIn: boolean, email?: string } | undefined, syncState: { phase: string } | undefined, login: () => Promise, logout: (options?: { force?: boolean }) => Promise }`
  - `<AccountMenu user syncState onLogin onLogout />` — `onLogout` wywoływane z `{ force: boolean }`.

- [ ] **Step 1: Napisz testy komponentu (zawodzą)**

`src/components/AccountMenu.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AccountMenu from './AccountMenu'

describe('AccountMenu', () => {
  it('dla niezalogowanego pokazuje przycisk logowania i informację o danych lokalnych', async () => {
    const onLogin = vi.fn()
    const user = userEvent.setup()
    render(<AccountMenu user={{ isLoggedIn: false }} syncState={undefined} onLogin={onLogin} onLogout={vi.fn()} />)

    expect(screen.getByText(/tylko na tym urządzeniu/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Zaloguj się' }))

    expect(onLogin).toHaveBeenCalledTimes(1)
  })

  it('dla zalogowanego pokazuje e-mail i stan synchronizacji', () => {
    render(
      <AccountMenu
        user={{ isLoggedIn: true, email: 'jan@example.com' }}
        syncState={{ phase: 'in-sync' }}
        onLogin={vi.fn()}
        onLogout={vi.fn()}
      />,
    )

    expect(screen.getByText('jan@example.com')).toBeInTheDocument()
    expect(screen.getByText('Zsynchronizowano')).toBeInTheDocument()
  })

  it.each([
    ['pushing', 'Synchronizuję…'],
    ['pulling', 'Synchronizuję…'],
    ['offline', 'Offline'],
    ['error', 'Błąd synchronizacji'],
    ['not-in-sync', 'Oczekuje na synchronizację'],
  ])('pokazuje etykietę dla fazy %s', (phase, label) => {
    render(
      <AccountMenu user={{ isLoggedIn: true, email: 'a@b.pl' }} syncState={{ phase }} onLogin={vi.fn()} onLogout={vi.fn()} />,
    )

    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('wylogowuje od razu, gdy wszystko jest zsynchronizowane', async () => {
    const onLogout = vi.fn()
    const user = userEvent.setup()
    render(
      <AccountMenu
        user={{ isLoggedIn: true, email: 'a@b.pl' }}
        syncState={{ phase: 'in-sync' }}
        onLogin={vi.fn()}
        onLogout={onLogout}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Wyloguj' }))

    expect(onLogout).toHaveBeenCalledWith({ force: false })
  })

  it('przy niezsynchronizowanych zmianach prosi o potwierdzenie przed wylogowaniem', async () => {
    const onLogout = vi.fn()
    const user = userEvent.setup()
    render(
      <AccountMenu
        user={{ isLoggedIn: true, email: 'a@b.pl' }}
        syncState={{ phase: 'offline' }}
        onLogin={vi.fn()}
        onLogout={onLogout}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Wyloguj' }))
    expect(onLogout).not.toHaveBeenCalled()
    expect(screen.getByText(/niezsynchronizowane zmiany/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Wyloguj mimo to' }))
    expect(onLogout).toHaveBeenCalledWith({ force: true })
  })

  it('pozwala anulować wylogowanie', async () => {
    const onLogout = vi.fn()
    const user = userEvent.setup()
    render(
      <AccountMenu
        user={{ isLoggedIn: true, email: 'a@b.pl' }}
        syncState={{ phase: 'error' }}
        onLogin={vi.fn()}
        onLogout={onLogout}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Wyloguj' }))
    await user.click(screen.getByRole('button', { name: 'Anuluj' }))

    expect(onLogout).not.toHaveBeenCalled()
    expect(screen.queryByText(/niezsynchronizowane zmiany/i)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Uruchom — ma zawieść**

Run: `npx vitest run src/components/AccountMenu.test.jsx`
Expected: FAIL (brak modułu).

- [ ] **Step 3: Zaimplementuj `AccountMenu.jsx`**

```jsx
import { useState } from 'react'

const SYNC_LABELS = {
  initial: 'Łączenie…',
  'in-sync': 'Zsynchronizowano',
  pushing: 'Synchronizuję…',
  pulling: 'Synchronizuję…',
  'not-in-sync': 'Oczekuje na synchronizację',
  offline: 'Offline',
  error: 'Błąd synchronizacji',
}

function AccountMenu({ user, syncState, onLogin, onLogout }) {
  const [confirmingLogout, setConfirmingLogout] = useState(false)

  if (!user?.isLoggedIn) {
    return (
      <div className="account-menu">
        <button type="button" onClick={onLogin}>
          Zaloguj się
        </button>
        <small>Dane zapisane tylko na tym urządzeniu</small>
      </div>
    )
  }

  const phase = syncState?.phase
  const inSync = phase === 'in-sync'

  const handleLogoutClick = () => {
    if (inSync) {
      onLogout({ force: false })
    } else {
      setConfirmingLogout(true)
    }
  }

  return (
    <div className="account-menu">
      <span>{user.email}</span>
      <small>{SYNC_LABELS[phase] ?? SYNC_LABELS.initial}</small>
      {confirmingLogout ? (
        <p role="alert">
          Masz niezsynchronizowane zmiany — po wylogowaniu mogą zostać utracone.
          <button
            type="button"
            onClick={() => {
              setConfirmingLogout(false)
              onLogout({ force: true })
            }}
          >
            Wyloguj mimo to
          </button>
          <button type="button" onClick={() => setConfirmingLogout(false)}>
            Anuluj
          </button>
        </p>
      ) : (
        <button type="button" onClick={handleLogoutClick}>
          Wyloguj
        </button>
      )}
    </div>
  )
}

export default AccountMenu
```

- [ ] **Step 4: Zaimplementuj `src/db/useCloudAccount.js`**

```js
import { useObservable } from 'dexie-react-hooks'
import { db, cloudEnabled } from './db'

// Jedyne miejsce (poza App.jsx), które zna `db.cloud` — komponenty niżej
// dostają zwykłe dane i callbacki.
export function useCloudAccount() {
  const user = useObservable(db.cloud.currentUser)
  const syncState = useObservable(db.cloud.syncState)

  return {
    enabled: cloudEnabled,
    user,
    syncState,
    login: () => db.cloud.login(),
    logout: ({ force = false } = {}) => db.cloud.logout({ force }),
  }
}
```

- [ ] **Step 5: Uruchom testy i lint**

Run: `npx vitest run src/components/AccountMenu.test.jsx` oraz `npm run lint`
Expected: PASS. (Hook nie ma osobnego testu jednostkowego — to cienka nakładka na `db.cloud`, weryfikowana ręcznie w Task 5; jego użycie w `App` jest pokryte mockiem w Task 4.)

- [ ] **Step 6: Commit**

```bash
git add src/db/useCloudAccount.js src/components/AccountMenu.jsx src/components/AccountMenu.test.jsx
git commit -m "Dodaj hook useCloudAccount i komponent AccountMenu"
```

---

### Task 4: Podpięcie menu konta w `App`

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/App.css`
- Modify: `src/App.test.jsx`

**Interfaces:**
- Consumes: `useCloudAccount()` i `<AccountMenu />` z Task 3.

- [ ] **Step 1: Napisz testy (zawodzą)**

W `src/App.test.jsx` dodaj obok pozostałych mocków (zmienna sterowana testem):

```jsx
const cloudAccount = vi.hoisted(() => ({
  current: { enabled: false, user: undefined, syncState: undefined, login: () => {}, logout: () => {} },
}))

vi.mock('./db/useCloudAccount', () => ({
  useCloudAccount: () => cloudAccount.current,
}))
```

Dopisz testy w `describe('App')`:

```jsx
  it('nie pokazuje menu konta, gdy chmura jest wyłączona', async () => {
    cloudAccount.current = { enabled: false }
    render(<App />)
    await screen.findByText('Śnieżka')

    expect(screen.queryByRole('button', { name: 'Zaloguj się' })).not.toBeInTheDocument()
  })

  it('pokazuje menu konta z przyciskiem logowania, gdy chmura jest włączona', async () => {
    const login = vi.fn()
    cloudAccount.current = { enabled: true, user: { isLoggedIn: false }, syncState: undefined, login, logout: vi.fn() }
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Śnieżka')

    await user.click(screen.getByRole('button', { name: 'Zaloguj się' }))

    expect(login).toHaveBeenCalledTimes(1)
  })
```

- [ ] **Step 2: Uruchom — ma zawieść**

Run: `npx vitest run src/App.test.jsx`
Expected: FAIL (brak menu w `App`).

- [ ] **Step 3: Zaimplementuj w `App.jsx`**

Dodaj importy:

```jsx
import AccountMenu from './components/AccountMenu'
import { useCloudAccount } from './db/useCloudAccount'
```

W ciele `App()` po `useState` dodaj `const account = useCloudAccount()`, a w JSX zaraz po `<MountainBanner />`:

```jsx
      {account.enabled && (
        <AccountMenu
          user={account.user}
          syncState={account.syncState}
          onLogin={account.login}
          onLogout={account.logout}
        />
      )}
```

- [ ] **Step 4: Dodaj style do `src/App.css`**

```css
.account-menu {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}
```

- [ ] **Step 5: Uruchom pełny zestaw**

Run: `npm test`, `npm run lint`, `npm run build`
Expected: wszystko przechodzi.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/App.css src/App.test.jsx
git commit -m "Pokaż menu konta w App, gdy Dexie Cloud jest skonfigurowany"
```

---

### Task 5: Dokumentacja i weryfikacja ręczna

**Files:**
- Modify: `CLAUDE.md` (sekcje Data layer / State flow / PWA — opis `journal`, `createDb`, `cloudEnabled`, `useCloudAccount`, `VITE_DEXIE_CLOUD_URL`; zaktualizuj wzmianki o `db.entries`)
- Modify: `README.md` (krótka sekcja „Logowanie i synchronizacja": jak założyć bazę i ustawić zmienną)
- Modify: `C:\Users\tomas\.claude\projects\C--Users-tomas-Desktop-Gwardia-AI-zadanie-glowne-Odznaki-g-rskie-w-Polsce\memory\backend_dexie_cloud_decision.md` (status: migracja UUID i integracja wdrożone w kodzie, czeka na bazę)

- [ ] **Step 1: Zaktualizuj `CLAUDE.md` i `README.md`**

W `CLAUDE.md` zamień „Journal entries (`db.entries`, Dexie `++id`)" na „(`db.journal`, `@id`, id tekstowe)" i dodaj akapit o chmurze (opcjonalna, `VITE_DEXIE_CLOUD_URL`, `points` niesynchronizowane, `useCloudAccount`). W `README.md` opisz:

```
npx dexie-cloud create            # zwraca URL bazy
npx dexie-cloud whitelist http://localhost:5173
npx dexie-cloud whitelist https://<domena-vercel>
# ustaw VITE_DEXIE_CLOUD_URL w .env.local oraz w zmiennych środowiskowych Vercel
```

- [ ] **Step 2: Sprawdź całość automatycznie**

Run: `npm test`, `npm run lint`, `npm run build`
Expected: PASS.

- [ ] **Step 3: Weryfikacja ręczna (wymaga bazy Dexie Cloud od użytkownika)**

Po założeniu bazy i ustawieniu `VITE_DEXIE_CLOUD_URL` w `.env.local`, `npm run dev`:
1. Stara baza z wpisami (v2) → po otwarciu wpisy widoczne w Dzienniku (migracja).
2. „Zaloguj się" → kod z e-maila → wskaźnik przechodzi do „Zsynchronizowano".
3. Dodaj wpis ze zdjęciem; druga karta/przeglądarka po zalogowaniu na to samo konto pokazuje wpis i zdjęcie.
4. Tryb offline (DevTools) → „Offline"; dodaj wpis, wróć online → synchronizacja.
5. „Wyloguj" przy niezsynchronizowanych zmianach → ostrzeżenie; sprawdź, co dzieje się z danymi lokalnymi po wylogowaniu i dopisz obserwację do README.
6. Bez `VITE_DEXIE_CLOUD_URL` → brak menu konta, aplikacja działa jak wcześniej.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md README.md
git commit -m "Opisz logowanie i synchronizację przez Dexie Cloud w dokumentacji"
```
