import { afterEach, describe, it, expect, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AccountMenu from './AccountMenu'

const loggedIn = { isLoggedIn: true, email: 'a@b.pl' }

describe('AccountMenu', () => {
  it('dla niezalogowanego pokazuje przycisk logowania i informację o danych lokalnych', async () => {
    const onLogin = vi.fn()
    const user = userEvent.setup()
    render(<AccountMenu user={{ isLoggedIn: false }} syncState={undefined} onLogin={onLogin} onLogout={vi.fn()} />)

    expect(screen.getByText(/tylko na tym urządzeniu/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Zaloguj się' }))

    expect(onLogin).toHaveBeenCalledTimes(1)
  })

  describe('gdy ustalanie konta trwa zbyt długo', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    it('po limicie czasu pokazuje przycisk logowania zamiast wiecznego "Ładowanie konta…"', () => {
      vi.useFakeTimers()
      render(<AccountMenu user={{ isLoggedIn: false, isLoading: true }} onLogin={vi.fn()} onLogout={vi.fn()} />)
      expect(screen.getByText('Ładowanie konta…')).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(screen.queryByText('Ładowanie konta…')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Zaloguj się' })).toBeInTheDocument()
    })

    it('nie pokazuje przycisku logowania przed upływem limitu czasu', () => {
      vi.useFakeTimers()
      render(<AccountMenu user={{ isLoggedIn: false, isLoading: true }} onLogin={vi.fn()} onLogout={vi.fn()} />)

      act(() => {
        vi.advanceTimersByTime(4000)
      })

      expect(screen.getByText('Ładowanie konta…')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Zaloguj się' })).not.toBeInTheDocument()
    })
  })

  it('po wylogowaniu z innej karty nie przywraca starego potwierdzenia wylogowania po ponownym zalogowaniu', async () => {
    const user = userEvent.setup()
    const loggedIn = { isLoggedIn: true, email: 'a@b.pl' }
    const props = { syncState: { phase: 'in-sync' }, onLogin: vi.fn(), onLogout: vi.fn() }
    const { rerender } = render(<AccountMenu user={loggedIn} {...props} />)
    await user.click(screen.getByRole('button', { name: 'Wyloguj' }))
    expect(screen.getByRole('alert')).toBeInTheDocument()

    rerender(<AccountMenu user={{ isLoggedIn: false }} {...props} />)
    rerender(<AccountMenu user={loggedIn} {...props} />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Wyloguj' })).toBeInTheDocument()
  })

  it('w trakcie ustalania konta pokazuje "Ładowanie konta…" zamiast przycisku logowania', () => {
    render(<AccountMenu user={{ isLoggedIn: false, isLoading: true }} syncState={undefined} onLogin={vi.fn()} onLogout={vi.fn()} />)

    expect(screen.getByText('Ładowanie konta…')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Zaloguj się' })).not.toBeInTheDocument()
  })

  it('pokazuje błąd logowania w elemencie role="alert" dla niezalogowanego', () => {
    render(
      <AccountMenu
        user={{ isLoggedIn: false }}
        syncState={undefined}
        error="Nie udało się zalogować. Spróbuj ponownie."
        onLogin={vi.fn()}
        onLogout={vi.fn()}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Nie udało się zalogować. Spróbuj ponownie.')
  })

  it('dla zalogowanego pokazuje e-mail i stan synchronizacji w role="status"', () => {
    render(<AccountMenu user={loggedIn} syncState={{ phase: 'in-sync' }} onLogin={vi.fn()} onLogout={vi.fn()} />)

    expect(screen.getByText('a@b.pl')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Zsynchronizowano')
  })

  it.each([
    ['pushing', 'Synchronizuję…'],
    ['pulling', 'Synchronizuję…'],
    ['offline', 'Offline'],
    ['error', 'Błąd synchronizacji'],
    ['not-in-sync', 'Oczekuje na synchronizację'],
    ['initial', 'Łączenie…'],
  ])('pokazuje etykietę dla fazy %s', (phase, label) => {
    render(<AccountMenu user={loggedIn} syncState={{ phase }} onLogin={vi.fn()} onLogout={vi.fn()} />)

    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('bez syncState pokazuje etykietę "Łączenie…"', () => {
    render(<AccountMenu user={loggedIn} syncState={undefined} onLogin={vi.fn()} onLogout={vi.fn()} />)

    expect(screen.getByText('Łączenie…')).toBeInTheDocument()
  })

  it('przy pełnej synchronizacji prosi o potwierdzenie i wylogowuje bez force', async () => {
    const onLogout = vi.fn()
    const user = userEvent.setup()
    render(<AccountMenu user={loggedIn} syncState={{ phase: 'in-sync' }} onLogin={vi.fn()} onLogout={onLogout} />)

    await user.click(screen.getByRole('button', { name: 'Wyloguj' }))
    expect(onLogout).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Po wylogowaniu dane zostaną usunięte z tego urządzenia; wrócą po ponownym zalogowaniu.',
    )

    await user.click(screen.getByRole('button', { name: 'Wyloguj' }))
    expect(onLogout).toHaveBeenCalledWith({ force: false })
  })

  it('przy niezsynchronizowanych zmianach ostrzega o utracie i wylogowuje z force', async () => {
    const onLogout = vi.fn()
    const user = userEvent.setup()
    render(<AccountMenu user={loggedIn} syncState={{ phase: 'offline' }} onLogin={vi.fn()} onLogout={onLogout} />)

    await user.click(screen.getByRole('button', { name: 'Wyloguj' }))
    expect(onLogout).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Masz niezsynchronizowane zmiany — zostaną usunięte bez możliwości odzyskania.',
    )

    await user.click(screen.getByRole('button', { name: 'Wyloguj mimo to' }))
    expect(onLogout).toHaveBeenCalledWith({ force: true })
  })

  it('pozwala anulować wylogowanie', async () => {
    const onLogout = vi.fn()
    const user = userEvent.setup()
    render(<AccountMenu user={loggedIn} syncState={{ phase: 'error' }} onLogin={vi.fn()} onLogout={onLogout} />)

    await user.click(screen.getByRole('button', { name: 'Wyloguj' }))
    await user.click(screen.getByRole('button', { name: 'Anuluj' }))

    expect(onLogout).not.toHaveBeenCalled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('komunikat potwierdzenia śledzi aktualną fazę synchronizacji', async () => {
    const onLogout = vi.fn()
    const user = userEvent.setup()
    const { rerender } = render(
      <AccountMenu user={loggedIn} syncState={{ phase: 'pushing' }} onLogin={vi.fn()} onLogout={onLogout} />,
    )

    await user.click(screen.getByRole('button', { name: 'Wyloguj' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/niezsynchronizowane zmiany/)

    rerender(<AccountMenu user={loggedIn} syncState={{ phase: 'in-sync' }} onLogin={vi.fn()} onLogout={onLogout} />)
    expect(screen.getByRole('alert')).toHaveTextContent(/wrócą po ponownym zalogowaniu/)

    await user.click(screen.getByRole('button', { name: 'Wyloguj' }))
    expect(onLogout).toHaveBeenCalledWith({ force: false })
  })
})
