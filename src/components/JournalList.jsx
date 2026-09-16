import { useEffect, useMemo, useState } from 'react'

function useObjectUrls(files) {
  const urls = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files])

  useEffect(() => {
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [urls])

  return urls
}

function EntryPhotos({ photos }) {
  const urls = useObjectUrls(photos ?? [])

  if (urls.length === 0) return null

  return (
    <div className="entry-photos">
      {urls.map((url) => (
        <img key={url} src={url} alt="" className="entry-photo-thumb" />
      ))}
    </div>
  )
}

function pointNames(pointIds, pointsById) {
  return pointIds
    .map((id) => {
      const point = pointsById.get(id)
      return point ? `${point.name} (${point.badgeSystem})` : id
    })
    .join(', ')
}

function JournalList({ entries, points, onEdit, onDelete }) {
  const pointsById = useMemo(() => new Map(points.map((point) => [point.id, point])), [points])
  const sorted = useMemo(() => [...entries].sort((a, b) => b.date.localeCompare(a.date)), [entries])
  const [confirmingId, setConfirmingId] = useState(null)

  if (sorted.length === 0) {
    return <p>Brak wpisów w dzienniku. Dodaj pierwszy wpis powyżej.</p>
  }

  return (
    <ul className="journal-list">
      {sorted.map((entry) => (
        <li key={entry.id} className="journal-entry">
          <div className="journal-entry-header">
            <strong>{entry.date}</strong>
            <div className="journal-entry-actions">
              <button type="button" onClick={() => onEdit(entry)}>
                Edytuj
              </button>
              {confirmingId === entry.id ? (
                <>
                  <span className="journal-confirm-label">Na pewno?</span>
                  <button
                    type="button"
                    className="journal-confirm-yes"
                    onClick={() => {
                      onDelete(entry.id)
                      setConfirmingId(null)
                    }}
                  >
                    Tak, usuń
                  </button>
                  <button type="button" onClick={() => setConfirmingId(null)}>
                    Anuluj
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setConfirmingId(entry.id)}>
                  Usuń
                </button>
              )}
            </div>
          </div>
          {entry.note && <p>{entry.note}</p>}
          {entry.pointIds.length > 0 && (
            <p className="journal-entry-points">{pointNames(entry.pointIds, pointsById)}</p>
          )}
          {entry.gpxTrack?.length > 0 && (
            <p className="journal-entry-gpx">Ślad GPX: {entry.gpxTrack.length} punktów</p>
          )}
          <EntryPhotos photos={entry.photos} />
        </li>
      ))}
    </ul>
  )
}

export default JournalList
