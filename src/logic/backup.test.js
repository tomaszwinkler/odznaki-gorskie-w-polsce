import { describe, it, expect } from 'vitest'
import { blobToDataUrl, dataUrlToFile, buildExportPayload, parseImportPayload, CURRENT_SCHEMA_VERSION } from './backup'

describe('blobToDataUrl', () => {
  it('koduje zawartość bloba jako base64 data URL z zachowanym typem MIME', async () => {
    const blob = new Blob(['hello'], { type: 'text/plain' })

    const dataUrl = await blobToDataUrl(blob)

    expect(dataUrl).toBe('data:text/plain;base64,aGVsbG8=')
  })
})

describe('dataUrlToFile', () => {
  it('odtwarza plik z zachowaną zawartością, typem MIME i nazwą', async () => {
    const file = dataUrlToFile('data:text/plain;base64,aGVsbG8=', 'notatka.txt')

    expect(file.name).toBe('notatka.txt')
    expect(file.type).toBe('text/plain')
    expect(await file.text()).toBe('hello')
  })
})

describe('buildExportPayload', () => {
  it('zwraca payload z numerem schematu, datą eksportu i wpisami bez pola id', async () => {
    const entries = [{ id: 1, date: '2026-05-01', note: 'super widoki', pointIds: ['sniezka'], photos: [], gpxTrack: [] }]

    const payload = await buildExportPayload(entries)

    expect(payload.schemaVersion).toBe(CURRENT_SCHEMA_VERSION)
    expect(typeof payload.exportedAt).toBe('string')
    expect(new Date(payload.exportedAt).toString()).not.toBe('Invalid Date')
    expect(payload.entries).toEqual([
      { date: '2026-05-01', note: 'super widoki', pointIds: ['sniezka'], photos: [], gpxTrack: [] },
    ])
  })

  it('koduje zdjęcia (File) jako obiekty z nazwą, typem i base64 data URL', async () => {
    const photo = new File(['hello'], 'widok.png', { type: 'image/png' })
    const entries = [{ id: 1, date: '2026-05-01', note: '', pointIds: [], photos: [photo], gpxTrack: [] }]

    const payload = await buildExportPayload(entries)

    expect(payload.entries[0].photos).toEqual([
      { name: 'widok.png', type: 'image/png', dataUrl: 'data:image/png;base64,aGVsbG8=' },
    ])
  })
})

describe('parseImportPayload', () => {
  it('odtwarza wpisy wyeksportowane przez buildExportPayload, ze zdjęciami jako pliki', async () => {
    const photo = new File(['hello'], 'widok.png', { type: 'image/png' })
    const original = [{ id: 1, date: '2026-05-01', note: 'super widoki', pointIds: ['sniezka'], photos: [photo], gpxTrack: [] }]
    const json = JSON.stringify(await buildExportPayload(original))

    const { entries } = await parseImportPayload(json)

    expect(entries).toHaveLength(1)
    expect(entries[0].date).toBe('2026-05-01')
    expect(entries[0].note).toBe('super widoki')
    expect(entries[0].pointIds).toEqual(['sniezka'])
    expect(entries[0]).not.toHaveProperty('id')
    expect(entries[0].photos[0]).toBeInstanceOf(File)
    expect(entries[0].photos[0].name).toBe('widok.png')
    expect(await entries[0].photos[0].text()).toBe('hello')
  })

  it('odrzuca plik, który nie jest poprawnym JSON-em', async () => {
    await expect(parseImportPayload('to nie jest json')).rejects.toThrow(
      'Nieprawidłowy plik: to nie jest poprawny plik JSON.',
    )
  })

  it('odrzuca plik bez numeru wersji schematu', async () => {
    await expect(parseImportPayload(JSON.stringify({ entries: [] }))).rejects.toThrow('brak numeru wersji schematu')
  })

  it('odrzuca plik z nowszą, nieobsługiwaną wersją schematu', async () => {
    const json = JSON.stringify({ schemaVersion: CURRENT_SCHEMA_VERSION + 1, entries: [] })
    await expect(parseImportPayload(json)).rejects.toThrow('nowszej wersji aplikacji')
  })

  it('odrzuca plik bez listy wpisów', async () => {
    const json = JSON.stringify({ schemaVersion: CURRENT_SCHEMA_VERSION })
    await expect(parseImportPayload(json)).rejects.toThrow('brak listy wpisów dziennika')
  })

  it('odrzuca wpis bez poprawnej daty', async () => {
    const json = JSON.stringify({ schemaVersion: CURRENT_SCHEMA_VERSION, entries: [{ note: 'x' }] })
    await expect(parseImportPayload(json)).rejects.toThrow('nie ma poprawnej daty')
  })
})
