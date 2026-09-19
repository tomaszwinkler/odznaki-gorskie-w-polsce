import { describe, it, expect, vi } from 'vitest'
import { useEffect, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

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

describe('App', () => {
  it('pokazuje domyślnie listę punktów wybranego systemu (GOT)', async () => {
    render(<App />)

    expect(await screen.findByText('Śnieżka')).toBeInTheDocument()
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
    await user.click(screen.getByRole('button', { name: 'Sudecka Odznaka Turystyczna (wkrótce)' }))

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
})
