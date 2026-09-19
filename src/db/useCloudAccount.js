import { useObservable } from 'dexie-react-hooks'
import { db, cloudEnabled } from './db'

// Jedyne miejsce (poza App.jsx), które zna `db.cloud` — komponenty niżej
// dostają zwykłe dane i callbacki.
export function useCloudAccount() {
  const user = useObservable(db.cloud.currentUser)
  const syncState = useObservable(db.cloud.syncState)

  return {
    enabled: cloudEnabled,
    user,
    syncState,
    login: () => db.cloud.login(),
    logout: ({ force = false } = {}) => db.cloud.logout({ force }),
  }
}
