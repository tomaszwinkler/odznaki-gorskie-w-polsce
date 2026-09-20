import { beforeEach, describe, it, expect, vi } from 'vitest'
import { useEffect, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { syncPoints } from './db/db'

// Wszystkie prawdziwe systemy odznak mają już katalogi, a kod nadal obsługuje
// system bez danych (`available: false` → "dane w przygotowaniu"). Żeby ta
// ścieżka pozostała pokryta, dokładamy do listy systemów sztuczny system testowy.
vi.mock('./data/badgeSystems', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    badgeSystems: [
      ...actual.badgeSystems,
      { id: 'SYSTEM_TESTOWY', name: 'System testowy', category: 'regionalne', subcategory: 'Test', available: false },
    ],
  }
})

vi.mock('./components/MapView', () => ({
  default: ({ points }) => <div data-testid="map-view">Mapa: {points.length} punktów</div>,
}))

// Prawdziwy dexie-react-hooks/liveQuery wymaga realnej instancji Dexie do
// śledzenia zmian — z fejkowym `db` po prostu nigdy nie emituje wyniku.
// Zastępujemy hak minimalnym odpowiednikiem: efekt czeka na wynik queryFn()
// (który i tak wywołuje nasz zamockowany moduł ./db/db) i ustawia stan.
vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: (queryFn, deps, defaultValue) => {
    const [value, setValue] = useState(defaultValue)
    useEffect(() => {
      let cancelled = false
      queryFn().then((result) => {
        if (!cancelled) setValue(result)
      })
      return () => {
        cancelled = true
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
    return value
  },
}))

const catalogPoints = [
  { id: 'sniezka', name: 'Śnieżka', region: 'Sudety', points: 10, badgeSystem: 'GOT', lat: 50.736, lng: 15.74 },
  { id: 'rysy-kgp', name: 'Rysy', region: 'Tatry', points: 1, badgeSystem: 'KGP', lat: 49.1794, lng: 20.0881 },
]
const entries = [{ id: 'wpis-1', date: '2026-05-01', note: '', pointIds: ['sniezka'], photos: [], gpxTrack: [] }]

const cloudAccount = vi.hoisted(() => ({
  current: { enabled: false, user: undefined, syncState: undefined, login: () => {}, logout: () => {} },
}))

vi.mock('./db/useCloudAccount', () => ({
  useCloudAccount: () => cloudAccount.current,
}))

vi.mock('./db/db', () => ({
  db: {
    points: { toArray: () => Promise.resolve(catalogPoints) },
    journal: { toArray: () => Promise.resolve(entries) },
  },
  syncPoints: vi.fn(() => Promise.resolve()),
  importEntries: vi.fn(),
}))

const disabledCloud = { enabled: false, user: undefined, syncState: undefined, error: null, login: () => {}, logout: () => {} }

describe('App', () => {
  beforeEach(() => {
    cloudAccount.current = { ...disabledCloud }
    vi.mocked(syncPoints).mockClear()
  })

  it('synchronizuje katalog ponownie po zmianie użytkownika (wylogowanie czyści tabelę points)', async () => {
    cloudAccount.current = { ...disabledCloud, enabled: true, user: { isLoggedIn: true, userId: 'a@b.pl', email: 'a@b.pl' } }
    const { rerender } = render(<App />)
    await screen.findByText('Śnieżka')
    expect(syncPoints).toHaveBeenCalledTimes(1)

    cloudAccount.current = { ...disabledCloud, enabled: true, user: { isLoggedIn: false, userId: 'unauthorized' } }
    rerender(<App />)

    expect(syncPoints).toHaveBeenCalledTimes(2)
  })

  it('nie synchronizuje katalogu ponownie, gdy użytkownik się nie zmienia', async () => {
    const { rerender } = render(<App />)
    await screen.findByText('Śnieżka')
    rerender(<App />)

    expect(syncPoints).toHaveBeenCalledTimes(1)
  })

  it('przekazuje błąd logowania do menu konta', async () => {
    cloudAccount.current = { ...disabledCloud, enabled: true, user: { isLoggedIn: false }, error: 'Nie udało się zalogować. Spróbuj ponownie.' }
    render(<App />)
    await screen.findByText('Śnieżka')

    expect(screen.getByRole('alert')).toHaveTextContent('Nie udało się zalogować')
  })

  it('pokazuje domyślnie listę punktów wybranego systemu (GOT)', async () => {
    render(<App />)

    expect(await screen.findByText('Śnieżka')).toBeInTheDocument()
  })

  it('pokazuje pasek postępu tylko dla wybranego systemu, a nie dla wszystkich naraz', async () => {
    render(<App />)
    await screen.findByText('Śnieżka')

    expect(screen.getByRole('heading', { name: 'Mój postęp — GOT' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: /Mój postęp/ })).toHaveLength(1)
  })

  it('po przełączeniu systemu pokazuje pasek postępu nowego systemu zamiast poprzedniego', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Śnieżka')

    await user.click(screen.getByRole('button', { name: 'Korona Gór Polski' }))

    expect(await screen.findByRole('heading', { name: 'Mój postęp — Korona Gór Polski' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Mój postęp — GOT' })).not.toBeInTheDocument()
  })

  it('nie pokazuje paska postępu dla systemu bez danych', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Śnieżka')

    await user.click(screen.getByRole('button', { name: 'Odznaki regionalne' }))
    await user.click(screen.getByRole('button', { name: 'System testowy (wkrótce)' }))

    expect(await screen.findByText(/w przygotowaniu/)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Mój postęp/ })).not.toBeInTheDocument()
  })

  it('przełącza system odznaki w ramach tej samej kategorii', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Śnieżka')

    await user.click(screen.getByRole('button', { name: 'Korona Gór Polski' }))

    expect(await screen.findByText('Rysy')).toBeInTheDocument()
    expect(screen.queryByText('Śnieżka')).not.toBeInTheDocument()
  })

  it('przy zmianie kategorii wybiera pierwszy dostępny w niej system', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Śnieżka')

    await user.click(screen.getByRole('button', { name: 'Korony makroregionalne' }))

    expect(screen.getByRole('button', { name: 'Korona Sudetów' })).toHaveClass('active')
  })

  it('pokazuje placeholder dla systemu w tej kategorii, który wciąż nie ma katalogu', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Śnieżka')

    await user.click(screen.getByRole('button', { name: 'Odznaki regionalne' }))
    await user.click(screen.getByRole('button', { name: 'System testowy (wkrótce)' }))

    expect(await screen.findByText(/w przygotowaniu/)).toBeInTheDocument()
  })

  it('pokazuje widok Mapy po przełączeniu zakładki', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Śnieżka')

    await user.click(screen.getByRole('button', { name: 'Mapa' }))

    expect(await screen.findByTestId('map-view')).toBeInTheDocument()
  })

  it('pokazuje widok Dziennika z istniejącymi wpisami po przełączeniu zakładki', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Śnieżka')

    await user.click(screen.getByRole('button', { name: 'Dziennik' }))

    expect(await screen.findByText('2026-05-01')).toBeInTheDocument()
  })

  it('nie pokazuje menu konta, gdy chmura jest wyłączona', async () => {
    const { container } = render(<App />)
    await screen.findByText('Śnieżka')

    expect(container.querySelector('.account-menu')).toBeNull()
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
})
