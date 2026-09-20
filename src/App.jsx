import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import MountainBanner from './components/MountainBanner'
import ProgressHeader from './components/ProgressHeader'
import PointsList from './components/PointsList'
import MapView from './components/MapView'
import JournalView from './components/JournalView'
import SystemPlaceholder from './components/SystemPlaceholder'
import AccountMenu from './components/AccountMenu'
import { db, syncPoints, importEntries } from './db/db'
import { useCloudAccount } from './db/useCloudAccount'
import { badgeCategories } from './data/badgeCategories'
import { badgeSystems } from './data/badgeSystems'
import { badgeLevelsBySystem } from './data/badgeLevels'
import { calculateProgress } from './logic/progress'
import { getVisitedPointIds } from './logic/visitedPoints'
import { buildPeakGroups } from './logic/peakGroups'
import { sortPoints } from './logic/sortPoints'
import './App.css'

function App() {
  const [view, setView] = useState('list')
  const [selectedCategory, setSelectedCategory] = useState(badgeCategories[0].id)
  const [selectedSystem, setSelectedSystem] = useState(badgeSystems[0].id)
  const [sort, setSort] = useState({ key: 'region', direction: 'asc' })

  const account = useCloudAccount()

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    const firstSystemInCategory = badgeSystems.find((system) => system.category === categoryId)
    setSelectedSystem(firstSystemInCategory.id)
  }

  const handleSort = (key) => {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }

  // Wylogowanie/zmiana konta w Dexie Cloud czyści wszystkie tabele lokalne,
  // także `points` — dlatego katalog synchronizujemy ponownie przy zmianie tożsamości.
  const userId = account.user?.userId
  useEffect(() => {
    syncPoints()
  }, [userId])

  const catalogPoints = useLiveQuery(
    () =>
      db.points
        .toArray()
        .then((rows) => rows.sort((a, b) => a.region.localeCompare(b.region) || a.name.localeCompare(b.name))),
    [],
    [],
  )

  const entries = useLiveQuery(() => db.journal.toArray(), [], [])

  const peakGroups = useMemo(() => buildPeakGroups(catalogPoints), [catalogPoints])
  const visitedIds = useMemo(() => getVisitedPointIds(entries, peakGroups), [entries, peakGroups])

  const points = useMemo(
    () => catalogPoints.map((point) => ({ ...point, visited: visitedIds.has(point.id) })),
    [catalogPoints, visitedIds],
  )

  const saveEntry = async (entry) => {
    const { id, ...fields } = entry
    if (id) {
      await db.journal.update(id, fields)
    } else {
      await db.journal.add(fields)
    }
  }

  const deleteEntry = async (id) => {
    await db.journal.delete(id)
  }

  const currentSystem = badgeSystems.find((system) => system.id === selectedSystem)
  const systemsInCategory = badgeSystems.filter((system) => system.category === selectedCategory)

  const pointsForSelectedSystem = useMemo(
    () => points.filter((point) => point.badgeSystem === selectedSystem),
    [points, selectedSystem],
  )

  // Postęp liczymy tylko dla wybranego systemu — przy kilkunastu odznakach
  // pokazywanie pasków wszystkich naraz tworzyło długi stos przed listą.
  const selectedProgress = useMemo(
    () =>
      currentSystem.available
        ? calculateProgress(pointsForSelectedSystem, badgeLevelsBySystem[currentSystem.id])
        : null,
    [currentSystem, pointsForSelectedSystem],
  )
  const sortedPoints = useMemo(
    () => sortPoints(pointsForSelectedSystem, sort.key, sort.direction),
    [pointsForSelectedSystem, sort],
  )

  return (
    <main className="app">
      <MountainBanner />

      {account.enabled && (
        <AccountMenu
          user={account.user}
          syncState={account.syncState}
          error={account.error}
          onLogin={account.login}
          onLogout={account.logout}
        />
      )}

      <div className="category-switcher">
        {badgeCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={selectedCategory === category.id ? 'active' : ''}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="system-switcher">
        {systemsInCategory.map((system) => (
          <button
            key={system.id}
            type="button"
            className={selectedSystem === system.id ? 'active' : ''}
            onClick={() => setSelectedSystem(system.id)}
          >
            {system.name}
            {!system.available && ' (wkrótce)'}
          </button>
        ))}
      </div>

      {selectedProgress && (
        <ProgressHeader
          systemName={currentSystem.name}
          totalPoints={selectedProgress.totalPoints}
          currentLevel={selectedProgress.currentLevel}
          nextLevel={selectedProgress.nextLevel}
          pointsToNextLevel={selectedProgress.pointsToNextLevel}
        />
      )}

      <div className="view-switcher">
        <button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
          Lista
        </button>
        <button type="button" className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}>
          Mapa
        </button>
        <button type="button" className={view === 'journal' ? 'active' : ''} onClick={() => setView('journal')}>
          Dziennik
        </button>
      </div>

      {view === 'list' &&
        (currentSystem.available ? (
          <PointsList points={sortedPoints} sortKey={sort.key} sortDirection={sort.direction} onSort={handleSort} />
        ) : (
          <SystemPlaceholder systemName={currentSystem.name} />
        ))}
      {view === 'map' &&
        (currentSystem.available ? (
          <MapView points={pointsForSelectedSystem} />
        ) : (
          <SystemPlaceholder systemName={currentSystem.name} />
        ))}
      {view === 'journal' && (
        <JournalView
          points={catalogPoints}
          entries={entries}
          onSaveEntry={saveEntry}
          onDeleteEntry={deleteEntry}
          onImportEntries={importEntries}
          peakGroups={peakGroups}
        />
      )}
    </main>
  )
}

export default App
