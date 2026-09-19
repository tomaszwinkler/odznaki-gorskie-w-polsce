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

function AccountMenu({ user, syncState, onLogin, onLogout }) {
  const [confirmingLogout, setConfirmingLogout] = useState(false)

  if (!user?.isLoggedIn) {
    return (
      <div className="account-menu">
        <button type="button" onClick={onLogin}>
          Zaloguj się
        </button>
        <small>Dane zapisane tylko na tym urządzeniu</small>
      </div>
    )
  }

  const phase = syncState?.phase
  const inSync = phase === 'in-sync'

  const handleLogoutClick = () => {
    if (inSync) {
      onLogout({ force: false })
    } else {
      setConfirmingLogout(true)
    }
  }

  return (
    <div className="account-menu">
      <span>{user.email}</span>
      <small>{SYNC_LABELS[phase] ?? SYNC_LABELS.initial}</small>
      {confirmingLogout ? (
        <p role="alert">
          Masz niezsynchronizowane zmiany — po wylogowaniu mogą zostać utracone.
          <button
            type="button"
            onClick={() => {
              setConfirmingLogout(false)
              onLogout({ force: true })
            }}
          >
            Wyloguj mimo to
          </button>
          <button type="button" onClick={() => setConfirmingLogout(false)}>
            Anuluj
          </button>
        </p>
      ) : (
        <button type="button" onClick={handleLogoutClick}>
          Wyloguj
        </button>
      )}
    </div>
  )
}

export default AccountMenu
