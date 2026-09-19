import { useState } from 'react'
import { useObservable } from 'dexie-react-hooks'
import { db, cloudEnabled } from './db'

// Jedyne miejsce, które zna `db.cloud` — App.jsx korzysta wyłącznie z tego
// haka, a komponenty niżej dostają zwykłe dane i callbacki.
export function useCloudAccount() {
  const user = useObservable(db.cloud.currentUser)
  const syncState = useObservable(db.cloud.syncState)
  const [error, setError] = useState(null)

  const login = async () => {
    setError(null)
    try {
      await db.cloud.login()
    } catch (e) {
      console.error(e)
      setError('Nie udało się zalogować. Spróbuj ponownie.')
    }
  }

  // Odrzucenie (np. anulowanie okna dialogowego dodatku) nie jest błędem
  // wartym pokazania użytkownikowi.
  const logout = async ({ force = false } = {}) => {
    try {
      await db.cloud.logout({ force })
    } catch (e) {
      console.error(e)
    }
  }

  return { enabled: cloudEnabled, user, syncState, error, login, logout }
}
