import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import MountainBanner from './components/MountainBanner'
import ProgressHeader from './components/ProgressHeader'
import PointsList from './components/PointsList'
import MapView from './components/MapView'
import JournalView from './components/JournalView'
import SystemPlaceholder from './components/SystemPlaceholder'
import { db, syncPoints, importEntries } from './db/db'
import { badgeCategories } from './data/badgeCategories'
import { badgeSystems } from './data/badgeSystems'
import { badgeLevelsBySystem } from './data/badgeLevels'
import { calculateProgress } from './logic/progress'
import { getVisitedPointIds } from './logic/visitedPoints'
import { sortPoints } from './logic/sortPoints'
import './App.css'

function App() {
  const [view, setView] = useState('list')
  const [selectedCategory, setSelectedCategory] = useState(badgeCategories[0].id)
  const [selectedSystem, setSelectedSystem] = useState(badgeSystems[0].id)
  const [sort, setSort] = useState({ key: 'region', direction: 'asc' })

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

  useEffect(() => {
    syncPoints()
  }, [])

  const catalogPoints = useLiveQuery(
    () =>
      db.points
        .toArray()
        .then((rows) => rows.sort((a, b) => a.region.localeCompare(b.region) || a.name.localeCompare(b.name))),
    [],
    [],
  )

  const entries = useLiveQuery(() => db.entries.toArray(), [], [])

  const visitedIds = useMemo(() => getVisitedPointIds(entries), [entries])

  const points = useMemo(
    () => catalogPoints.map((point) => ({ ...point, visited: visitedIds.has(point.id) })),
    [catalogPoints, visitedIds],
  )

  const saveEntry = async (entry) => {
    const { id, ...fields } = entry
    if (id) {
      await db.entries.update(id, fields)
    } else {
      await db.entries.add(fields)
    }
  }

  const deleteEntry = async (id) => {
    await db.entries.delete(id)
  }

  const progressBySystem = badgeSystems
    .filter((system) => system.available)
    .map((system) => ({
      system,
      progress: calculateProgress(
        points.filter((point) => point.badgeSystem === system.id),
        badgeLevelsBySystem[system.id],
      ),
    }))

  const currentSystem = badgeSystems.find((system) => system.id === selectedSystem)
  const systemsInCategory = badgeSystems.filter((system) => system.category === selectedCategory)

  const pointsForSelectedSystem = useMemo(
    () => points.filter((point) => point.badgeSystem === selectedSystem),
    [points, selectedSystem],
  )
  const sortedPoints = useMemo(
    () => sortPoints(pointsForSelectedSystem, sort.key, sort.direction),
    [pointsForSelectedSystem, sort],
  )

  return (
    <main className="app">
      <MountainBanner />

      {progressBySystem.map(({ system, progress }) => (
        <ProgressHeader
          key={system.id}
          systemName={system.name}
          totalPoints={progress.totalPoints}
          currentLevel={progress.currentLevel}
          nextLevel={progress.nextLevel}
          pointsToNextLevel={progress.pointsToNextLevel}
        />
      ))}

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
        />
      )}
    </main>
  )
}

export default App
