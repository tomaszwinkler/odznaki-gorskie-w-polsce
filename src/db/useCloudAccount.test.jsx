import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCloudAccount } from './useCloudAccount'

const cloud = vi.hoisted(() => ({
  login: vi.fn(),
  logout: vi.fn(),
  currentUser: {},
  syncState: {},
}))

vi.mock('./db', () => ({
  db: { cloud },
  cloudEnabled: true,
}))

vi.mock('dexie-react-hooks', () => ({
  useObservable: () => undefined,
}))

beforeEach(() => {
  cloud.login.mockReset()
  cloud.logout.mockReset()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('useCloudAccount', () => {
  it('po nieudanym logowaniu ustawia komunikat błędu', async () => {
    cloud.login.mockRejectedValue(new Error('serwer niedostępny'))
    const { result } = renderHook(() => useCloudAccount())

    await act(async () => {
      await result.current.login()
    })

    expect(result.current.error).toBe('Nie udało się zalogować. Spróbuj ponownie.')
  })

  it('anulowanie okna logowania nie jest pokazywane jako błąd', async () => {
    const cancelled = new Error('User cancelled')
    cancelled.name = 'AbortError'
    cloud.login.mockRejectedValue(cancelled)
    const { result } = renderHook(() => useCloudAccount())

    await act(async () => {
      await result.current.login()
    })

    expect(result.current.error).toBeNull()
  })

  it('kolejna próba logowania czyści poprzedni błąd', async () => {
    cloud.login.mockRejectedValueOnce(new Error('serwer niedostępny')).mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useCloudAccount())

    await act(async () => {
      await result.current.login()
    })
    await act(async () => {
      await result.current.login()
    })

    expect(result.current.error).toBeNull()
  })
})
