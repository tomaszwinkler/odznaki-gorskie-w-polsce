import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDb, db, syncPoints, importEntries, configureCloud } from './db'
import { initialPoints } from '../data/points'

beforeEach(async () => {
  await db.points.clear()
  await db.journal.clear()
})

describe('syncPoints', () => {
  it('wypełnia bazę katalogiem punktów', async () => {
    await syncPoints()

    const stored = await db.points.toArray()
    expect(stored).toHaveLength(initialPoints.length)
  })

  it('nie duplikuje punktów przy ponownym wywołaniu', async () => {
    await syncPoints()
    await syncPoints()

    const stored = await db.points.toArray()
    expect(stored).toHaveLength(initialPoints.length)
  })

  it('usuwa z bazy punkty, których nie ma już w katalogu', async () => {
    await db.points.add({ id: 'nieaktualny-punkt', name: 'Stary', region: 'X', points: 1, badgeSystem: 'GOT' })

    await syncPoints()

    const stored = await db.points.toArray()
    expect(stored.find((point) => point.id === 'nieaktualny-punkt')).toBeUndefined()
    expect(stored).toHaveLength(initialPoints.length)
  })
})

describe('importEntries', () => {
  it('dokłada zaimportowane wpisy do istniejących, nadając nowe id', async () => {
    await db.journal.add({ id: 'jrnstarywpis', date: '2026-01-01', note: 'stary wpis', pointIds: [], photos: [], gpxTrack: [] })

    await importEntries([{ date: '2026-05-01', note: 'nowy wpis', pointIds: [], photos: [], gpxTrack: [] }])

    const stored = await db.journal.toArray()
    expect(stored).toHaveLength(2)
    expect(stored.map((entry) => entry.note)).toEqual(expect.arrayContaining(['stary wpis', 'nowy wpis']))
    expect(stored.every((entry) => typeof entry.id === 'string')).toBe(true)
  })
})

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
