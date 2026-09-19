import Dexie from 'dexie'
import dexieCloud from 'dexie-cloud-addon'
import { initialPoints } from '../data/points'

// Dexie Cloud wymaga, by klucze tabel z `@id` zaczynały się od prefiksu `jrn`
// (prefiks = pierwsze trzy litery nazwy tabeli), a resztę mogą stanowić
// dowolne losowe, globalnie unikalne znaki. Usuwamy stare pole `id` oraz pola
// synchronizacji (`owner`, `realmId`), żeby wpis nie przeniósł obcych metadanych.
function toJournalRow({ id: _id, owner: _owner, realmId: _realmId, ...entry }) {
  return { id: 'jrn' + crypto.randomUUID().replaceAll('-', ''), ...entry }
}

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
      await tx.table('journal').bulkAdd(legacyEntries.map(toJournalRow))
    })

  database.version(4).stores({
    points: 'id',
    entries: null,
    journal: '@id, date',
  })

  return database
}

export const db = createDb()

// Chmura jest włączana tylko po ustawieniu VITE_DEXIE_CLOUD_URL — bez niej
// aplikacja działa lokalnie, jak dotychczas. Katalog `points` jest statyczny
// (syncPoints nadpisuje go przy każdym starcie), więc nie może się synchronizować.
export function configureCloud(database, databaseUrl) {
  database.cloud.configure({
    databaseUrl,
    requireAuth: false,
    unsyncedTables: ['points'],
    // Domyślnie addon zmienia nazwę bazy na `<nazwa>-<dbid>`, przez co
    // włączenie chmury otworzyłoby pustą bazę i porzuciło dotychczasowe dane
    // lokalne (razem z migracją do `journal`). Zachowujemy oryginalną nazwę.
    nameSuffix: false,
  })
}

const cloudUrl = import.meta.env.VITE_DEXIE_CLOUD_URL?.trim()
export const cloudEnabled = Boolean(cloudUrl)

if (cloudEnabled) {
  configureCloud(db, cloudUrl)
}

// Synchronizuje katalog punktów (nazwa, pasmo, punkty, współrzędne) z
// aktualną zawartością src/data/points.js. Katalog nie przechowuje już
// statusu "odwiedzony" — ten jest wyliczany z wpisów w tabeli `journal`
// (zob. src/logic/visitedPoints.js), więc synchronizacja może po prostu
// nadpisać dane katalogowe bez ryzyka utraty postępu użytkownika. Usuwa
// też punkty, których nie ma już w src/data/points.js (np. po zmianie id
// przy poprawianiu danych) — inaczej zostałyby w bazie na zawsze jako
// osierocone rekordy.
export async function syncPoints() {
  const currentIds = new Set(initialPoints.map((point) => point.id))
  const existingIds = await db.points.toCollection().primaryKeys()
  const staleIds = existingIds.filter((id) => !currentIds.has(id))

  if (staleIds.length > 0) {
    await db.points.bulkDelete(staleIds)
  }
  await db.points.bulkPut(initialPoints)
}

// Dokłada zaimportowane wpisy dziennika do istniejących (merge) — nigdy nie
// nadpisuje ani nie usuwa danych. `bulkAdd` nadaje nowe klucze `@id`, więc
// wielokrotny import tego samego pliku tworzy duplikaty zamiast nadpisywać.
export async function importEntries(entries) {
  await db.journal.bulkAdd(entries.map(toJournalRow))
}
