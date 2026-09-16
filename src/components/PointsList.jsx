import { Fragment, useState } from 'react'
import { trailInfoByPointId } from '../data/trailInfo'

const columns = [
  { key: 'visited', label: 'Odwiedzony' },
  { key: 'name', label: 'Nazwa' },
  { key: 'region', label: 'Pasmo' },
  { key: 'points', label: 'Punkty' },
]

function TrailDetails({ trailInfo }) {
  if (!trailInfo) {
    return <p className="trail-info-missing">Dane o trasie i dojeździe są w przygotowaniu dla tego punktu.</p>
  }

  return (
    <dl className="trail-info">
      <dt>Punkt startowy</dt>
      <dd>{trailInfo.trailhead}</dd>
      <dt>Dojazd</dt>
      <dd>{trailInfo.access}</dd>
      <dt>Kolor szlaku</dt>
      <dd>{trailInfo.trailColor}</dd>
      <dt>Czas wejścia (w jedną stronę, latem)</dt>
      <dd>{trailInfo.ascentTime}</dd>
      <dt>Przewyższenie</dt>
      <dd>{trailInfo.elevationGain}</dd>
      {trailInfo.notes && (
        <>
          <dt>Uwagi</dt>
          <dd>{trailInfo.notes}</dd>
        </>
      )}
    </dl>
  )
}

function PointsList({ points, sortKey, sortDirection, onSort }) {
  const [expandedId, setExpandedId] = useState(null)

  return (
    <table className="points-list">
      <thead>
        <tr>
          {columns.map((column) => {
            const isActive = sortKey === column.key
            const arrow = isActive ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''
            return (
              <th key={column.key}>
                <button type="button" className="sort-button" onClick={() => onSort(column.key)}>
                  {column.label}
                  {arrow}
                </button>
              </th>
            )
          })}
          <th>Trasa</th>
        </tr>
      </thead>
      <tbody>
        {points.map((point) => {
          const isExpanded = expandedId === point.id
          return (
            <Fragment key={point.id}>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    checked={point.visited}
                    disabled
                    aria-label={`${point.name}: ${point.visited ? 'odwiedzony' : 'nieodwiedzony'}`}
                  />
                </td>
                <td>{point.name}</td>
                <td>{point.region}</td>
                <td>{point.points}</td>
                <td>
                  <button type="button" className="trail-toggle" onClick={() => setExpandedId(isExpanded ? null : point.id)}>
                    {isExpanded ? 'Ukryj' : 'Szczegóły'}
                  </button>
                </td>
              </tr>
              {isExpanded && (
                <tr className="point-detail-row">
                  <td colSpan={5}>
                    <TrailDetails trailInfo={trailInfoByPointId[point.id]} />
                  </td>
                </tr>
              )}
            </Fragment>
          )
        })}
      </tbody>
    </table>
  )
}

export default PointsList
