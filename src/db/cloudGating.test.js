import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Osobny plik, bo test przeładowuje moduł ./db (vi.resetModules) i podmienia
// dodatek Dexie Cloud atrapą — nie może to wpływać na singleton `db` z db.test.js.
const configure = vi.fn()

beforeEach(() => {
  configure.mockReset()
  vi.resetModules()
  vi.doMock('dexie-cloud-addon', () => ({
    default: (dexie) => {
      dexie.cloud = { configure }
    },
  }))
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.doUnmock('dexie-cloud-addon')
})

describe('włączanie chmury zmienną VITE_DEXIE_CLOUD_URL', () => {
  it('konfiguruje chmurę (z przyciętym adresem), gdy adres bazy jest ustawiony', async () => {
    vi.stubEnv('VITE_DEXIE_CLOUD_URL', '  https://przyklad.dexie.cloud  ')

    const { cloudEnabled } = await import('./db')

    expect(cloudEnabled).toBe(true)
    expect(configure).toHaveBeenCalledTimes(1)
    expect(configure).toHaveBeenCalledWith(expect.objectContaining({ databaseUrl: 'https://przyklad.dexie.cloud' }))
  })

  it.each([['pusty adres', ''], ['same spacje', '   ']])('nie konfiguruje chmury przy wartości: %s', async (_opis, value) => {
    vi.stubEnv('VITE_DEXIE_CLOUD_URL', value)

    const { cloudEnabled } = await import('./db')

    expect(cloudEnabled).toBe(false)
    expect(configure).not.toHaveBeenCalled()
  })
})
