import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AccountMenu from './AccountMenu'

describe('AccountMenu', () => {
  it('dla niezalogowanego pokazuje przycisk logowania i informację o danych lokalnych', async () => {
    const onLogin = vi.fn()
    const user = userEvent.setup()
    render(<AccountMenu user={{ isLoggedIn: false }} syncState={undefined} onLogin={onLogin} onLogout={vi.fn()} />)

    expect(screen.getByText(/tylko na tym urządzeniu/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Zaloguj się' }))

    expect(onLogin).toHaveBeenCalledTimes(1)
  })

  it('dla zalogowanego pokazuje e-mail i stan synchronizacji', () => {
    render(
      <AccountMenu
        user={{ isLoggedIn: true, email: 'jan@example.com' }}
        syncState={{ phase: 'in-sync' }}
        onLogin={vi.fn()}
        onLogout={vi.fn()}
      />,
    )

    expect(screen.getByText('jan@example.com')).toBeInTheDocument()
    expect(screen.getByText('Zsynchronizowano')).toBeInTheDocument()
  })

  it.each([
    ['pushing', 'Synchronizuję…'],
    ['pulling', 'Synchronizuję…'],
    ['offline', 'Offline'],
    ['error', 'Błąd synchronizacji'],
    ['not-in-sync', 'Oczekuje na synchronizację'],
  ])('pokazuje etykietę dla fazy %s', (phase, label) => {
    render(
      <AccountMenu user={{ isLoggedIn: true, email: 'a@b.pl' }} syncState={{ phase }} onLogin={vi.fn()} onLogout={vi.fn()} />,
    )

    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('wylogowuje od razu, gdy wszystko jest zsynchronizowane', async () => {
    const onLogout = vi.fn()
    const user = userEvent.setup()
    render(
      <AccountMenu
        user={{ isLoggedIn: true, email: 'a@b.pl' }}
        syncState={{ phase: 'in-sync' }}
        onLogin={vi.fn()}
        onLogout={onLogout}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Wyloguj' }))

    expect(onLogout).toHaveBeenCalledWith({ force: false })
  })

  it('przy niezsynchronizowanych zmianach prosi o potwierdzenie przed wylogowaniem', async () => {
    const onLogout = vi.fn()
    const user = userEvent.setup()
    render(
      <AccountMenu
        user={{ isLoggedIn: true, email: 'a@b.pl' }}
        syncState={{ phase: 'offline' }}
        onLogin={vi.fn()}
        onLogout={onLogout}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Wyloguj' }))
    expect(onLogout).not.toHaveBeenCalled()
    expect(screen.getByText(/niezsynchronizowane zmiany/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Wyloguj mimo to' }))
    expect(onLogout).toHaveBeenCalledWith({ force: true })
  })

  it('pozwala anulować wylogowanie', async () => {
    const onLogout = vi.fn()
    const user = userEvent.setup()
    render(
      <AccountMenu
        user={{ isLoggedIn: true, email: 'a@b.pl' }}
        syncState={{ phase: 'error' }}
        onLogin={vi.fn()}
        onLogout={onLogout}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Wyloguj' }))
    await user.click(screen.getByRole('button', { name: 'Anuluj' }))

    expect(onLogout).not.toHaveBeenCalled()
    expect(screen.queryByText(/niezsynchronizowane zmiany/i)).not.toBeInTheDocument()
  })
})
