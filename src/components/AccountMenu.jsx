import { useState } from 'react'

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

  if (user?.isLoading) {
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
