import { useState } from 'react'
import { parseGpxTrackPoints, findMatchedPointIds } from '../logic/gpx'
import { compressImageFile } from '../logic/imageCompression'

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

function pointNames(ids, points) {
  const byId = new Map(points.map((point) => [point.id, `${point.name} (${point.badgeSystem})`]))
  return ids.map((id) => byId.get(id) ?? id).join(', ')
}

// Renderowany z propem `key` zależnym od edytowanego wpisu (zob. JournalView),
// więc przełączenie się między wpisami/trybem dodawania montuje formularz od
// nowa i poniższe useState mogą bezpiecznie czytać editingEntry raz, przy
// montowaniu, zamiast synchronizować się efektem.
function JournalForm({ points, editingEntry, onSubmit, onCancel }) {
  const [date, setDate] = useState(editingEntry ? editingEntry.date : todayIsoDate)
  const [note, setNote] = useState(editingEntry ? editingEntry.note : '')
  const [selectedIds, setSelectedIds] = useState(editingEntry ? editingEntry.pointIds : [])
  const [photos, setPhotos] = useState(editingEntry ? (editingEntry.photos ?? []) : [])
  const [gpxTrack, setGpxTrack] = useState(editingEntry ? (editingEntry.gpxTrack ?? []) : [])
  const [gpxMessage, setGpxMessage] = useState(null)
  const [isProcessingPhotos, setIsProcessingPhotos] = useState(false)

  const togglePointSelection = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((pointId) => pointId !== id) : [...current, id],
    )
  }

  const handleGpxFile = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const text = await file.text()
    const trackPoints = parseGpxTrackPoints(text)

    if (trackPoints.length === 0) {
      setGpxTrack([])
      setGpxMessage('Nie rozpoznano żadnych punktów trasy w tym pliku GPX.')
      return
    }

    const matchedIds = findMatchedPointIds(trackPoints, points)
    setGpxTrack(trackPoints)
    setSelectedIds((current) => Array.from(new Set([...current, ...matchedIds])))

    setGpxMessage(
      matchedIds.length > 0
        ? `Ślad zawiera ${trackPoints.length} punktów GPS. Rozpoznano automatycznie: ${pointNames(matchedIds, points)} — możesz poprawić zaznaczenie powyżej.`
        : `Ślad zawiera ${trackPoints.length} punktów GPS, ale żaden nie pokrywa się z punktami odznaki w pobliżu.`,
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ id: editingEntry?.id, date, note, pointIds: selectedIds, photos, gpxTrack })
    if (!editingEntry) {
      setDate(todayIsoDate())
      setNote('')
      setSelectedIds([])
      setPhotos([])
      setGpxTrack([])
      setGpxMessage(null)
    }
  }

  return (
    <form className="journal-form" onSubmit={handleSubmit}>
      <h2>{editingEntry ? 'Edytuj wpis' : 'Dodaj wpis'}</h2>

      <label className="journal-field">
        Data
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
      </label>

      <label className="journal-field">
        Notatka
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          placeholder="Jak minęła wyprawa?"
        />
      </label>

      <label className="journal-field">
        Import trasy GPX
        <input type="file" accept=".gpx" onChange={handleGpxFile} />
      </label>
      {gpxMessage && <p className="journal-photos-hint">{gpxMessage}</p>}

      <fieldset className="point-checklist-field">
        <legend>Odwiedzone punkty</legend>
        <div className="point-checklist">
          {points.map((point) => (
            <label key={point.id} className="point-checklist-item">
              <input
                type="checkbox"
                checked={selectedIds.includes(point.id)}
                onChange={() => togglePointSelection(point.id)}
              />
              {point.name} ({point.region}, {point.badgeSystem})
            </label>
          ))}
        </div>
      </fieldset>

      <label className="journal-field">
        Zdjęcia
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={isProcessingPhotos}
          onChange={async (event) => {
            const files = Array.from(event.target.files)
            event.target.value = ''
            setIsProcessingPhotos(true)
            const compressed = await Promise.all(files.map((file) => compressImageFile(file)))
            setPhotos((current) => [...current, ...compressed])
            setIsProcessingPhotos(false)
          }}
        />
      </label>
      {isProcessingPhotos && <p className="journal-photos-hint">Przetwarzanie zdjęć…</p>}
      {photos.length > 0 && <p className="journal-photos-hint">Wybrano {photos.length} zdjęć.</p>}

      <div className="journal-form-actions">
        <button type="submit">{editingEntry ? 'Zapisz zmiany' : 'Zapisz wpis'}</button>
        {editingEntry && (
          <button type="button" className="journal-form-cancel" onClick={onCancel}>
            Anuluj
          </button>
        )}
      </div>
    </form>
  )
}

export default JournalForm
