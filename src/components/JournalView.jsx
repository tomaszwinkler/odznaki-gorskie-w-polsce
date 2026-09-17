import { useState } from 'react'
import JournalForm from './JournalForm'
import JournalList from './JournalList'
import { buildExportPayload, parseImportPayload } from '../logic/backup'

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

function JournalView({ points, entries, onSaveEntry, onDeleteEntry, onImportEntries }) {
  const [editingEntry, setEditingEntry] = useState(null)
  const [backupMessage, setBackupMessage] = useState(null)

  const handleSave = async (entryData) => {
    await onSaveEntry(entryData)
    setEditingEntry(null)
  }

  const handleDelete = async (id) => {
    await onDeleteEntry(id)
    if (editingEntry?.id === id) {
      setEditingEntry(null)
    }
  }

  const handleExport = async () => {
    const payload = await buildExportPayload(entries)
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `odznaki-dziennik-${todayIsoDate()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = async (event) => {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return

    try {
      const text = await file.text()
      const { entries: importedEntries } = await parseImportPayload(text)
      await onImportEntries(importedEntries)
      setBackupMessage({ type: 'success', text: `Zaimportowano ${importedEntries.length} wpis(ów) do dziennika.` })
    } catch (error) {
      setBackupMessage({ type: 'error', text: error.message })
    }
  }

  return (
    <section className="journal-view">
      <div className="journal-backup">
        <button type="button" onClick={handleExport}>
          Eksportuj dziennik
        </button>
        <label className="journal-backup-import">
          Importuj dziennik
          <input type="file" accept=".json,application/json" onChange={handleImportFile} />
        </label>
      </div>
      {backupMessage && (
        <p className={`journal-backup-message${backupMessage.type === 'error' ? ' journal-backup-error' : ''}`}>
          {backupMessage.text}
        </p>
      )}

      <JournalForm
        key={editingEntry?.id ?? 'new'}
        points={points}
        editingEntry={editingEntry}
        onSubmit={handleSave}
        onCancel={() => setEditingEntry(null)}
      />
      <JournalList entries={entries} points={points} onEdit={setEditingEntry} onDelete={handleDelete} />
    </section>
  )
}

export default JournalView
