import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db, syncPoints, importEntries } from './db'
import { initialPoints } from '../data/points'

beforeEach(async () => {
  await db.points.clear()
  await db.entries.clear()
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
    await db.entries.add({ date: '2026-01-01', note: 'stary wpis', pointIds: [], photos: [], gpxTrack: [] })

    await importEntries([{ date: '2026-05-01', note: 'nowy wpis', pointIds: [], photos: [], gpxTrack: [] }])

    const stored = await db.entries.toArray()
    expect(stored).toHaveLength(2)
    expect(stored.map((entry) => entry.note)).toEqual(expect.arrayContaining(['stary wpis', 'nowy wpis']))
  })
})
