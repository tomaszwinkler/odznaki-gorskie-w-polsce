import { useEffect, useState } from 'react'

// Po tym czasie przestajemy czekać na ustalenie konta i pokazujemy przycisk
// logowania — inaczej zawieszony stan `isLoading` odciąłby użytkownika od logowania.
const LOADING_TIMEOUT_MS = 5000

const SYNC_LABELS = {
  initial: 'Łączenie…',
  'in-sync': 'Zsynchronizowano',
  pushing: 'Synchronizuję…',
  pulling: 'Synchronizuję…',
  'not-in-sync': 'Oczekuje na synchronizację',
  offline: 'Offline',
  error: 'Błąd synchronizacji',
}

function AccountMenu({ user, syncState, error, onLogin, onLogout }) {
  const [confirmingLogout, setConfirmingLogout] = useState(false)
  const [loadingTimedOut, setLoadingTimedOut] = useState(false)
  const isLoading = Boolean(user?.isLoading)
  const isLoggedIn = Boolean(user?.isLoggedIn)

  // Stan zależny od zmiany propsów korygujemy podczas renderowania (wzorzec z
  // dokumentacji Reacta), a nie w efekcie. Wylogowanie z innej karty nie może
  // zostawić otwartego potwierdzenia, które pojawiłoby się znowu po następnym
  // zalogowaniu; koniec ładowania kasuje znacznik przekroczenia limitu czasu.
  const [previous, setPrevious] = useState({ isLoading, isLoggedIn })
  if (previous.isLoading !== isLoading || previous.isLoggedIn !== isLoggedIn) {
    setPrevious({ isLoading, isLoggedIn })
    if (!isLoading) setLoadingTimedOut(false)
    if (!isLoggedIn) setConfirmingLogout(false)
  }

  useEffect(() => {
    if (!isLoading) return undefined
    const timer = setTimeout(() => setLoadingTimedOut(true), LOADING_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [isLoading])

  if (isLoading && !loadingTimedOut) {
    return (
      <div className="account-menu">
        <small>Ładowanie konta…</small>
      </div>
    )
  }

  if (!user?.isLoggedIn) {
    return (
      <div className="account-menu">
        <button type="button" onClick={onLogin}>
          Zaloguj się
        </button>
        <small>Dane zapisane tylko na tym urządzeniu</small>
        {error && <p role="alert">{error}</p>}
      </div>
    )
  }

  const phase = syncState?.phase
  const inSync = phase === 'in-sync'

  const confirmLogout = () => {
    setConfirmingLogout(false)
    onLogout({ force: !inSync })
  }

  return (
    <div className="account-menu">
      <span>{user.email}</span>
      <small role="status">{SYNC_LABELS[phase] ?? SYNC_LABELS.initial}</small>
      {error && <p role="alert">{error}</p>}
      {confirmingLogout ? (
        <>
          {/* Komunikat wyliczany na bieżąco, więc śledzi zmianę fazy synchronizacji. */}
          <p role="alert">
            {inSync
              ? 'Po wylogowaniu dane zostaną usunięte z tego urządzenia; wrócą po ponownym zalogowaniu.'
              : 'Masz niezsynchronizowane zmiany — zostaną usunięte bez możliwości odzyskania.'}
          </p>
          <div>
            <button type="button" onClick={confirmLogout}>
              {inSync ? 'Wyloguj' : 'Wyloguj mimo to'}
            </button>
            <button type="button" onClick={() => setConfirmingLogout(false)}>
              Anuluj
            </button>
          </div>
        </>
      ) : (
        <button type="button" onClick={() => setConfirmingLogout(true)}>
          Wyloguj
        </button>
      )}
    </div>
  )
}

export default AccountMenu
