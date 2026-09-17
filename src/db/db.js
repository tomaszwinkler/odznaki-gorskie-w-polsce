import Dexie from 'dexie'
import { initialPoints } from '../data/points'

export const db = new Dexie('odznaki-gorskie')

db.version(1).stores({
  points: 'id',
})

db.version(2).stores({
  points: 'id',
  entries: '++id, date',
})

// Synchronizuje katalog punktów (nazwa, pasmo, punkty, współrzędne) z
// aktualną zawartością src/data/points.js. Katalog nie przechowuje już
// statusu "odwiedzony" — ten jest wyliczany z wpisów w tabeli `entries`
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
// nadpisuje ani nie usuwa danych. `bulkAdd` nadaje nowe klucze `++id`, więc
// wielokrotny import tego samego pliku tworzy duplikaty zamiast nadpisywać.
export async function importEntries(entries) {
  await db.entries.bulkAdd(entries)
}
