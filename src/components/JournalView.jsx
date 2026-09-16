import { useState } from 'react'
import JournalForm from './JournalForm'
import JournalList from './JournalList'

function JournalView({ points, entries, onSaveEntry, onDeleteEntry }) {
  const [editingEntry, setEditingEntry] = useState(null)

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

  return (
    <section className="journal-view">
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
