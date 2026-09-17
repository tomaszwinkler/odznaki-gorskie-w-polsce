import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JournalList from './JournalList'

const points = [{ id: 'sniezka', name: 'Śnieżka', region: 'Sudety', badgeSystem: 'GOT' }]

describe('JournalList', () => {
  it('pokazuje komunikat, gdy brak wpisów', () => {
    render(<JournalList entries={[]} points={points} onEdit={vi.fn()} onDelete={vi.fn()} />)

    expect(screen.getByText('Brak wpisów w dzienniku. Dodaj pierwszy wpis powyżej.')).toBeInTheDocument()
  })

  it('sortuje wpisy od najnowszego do najstarszego', () => {
    const entries = [
      { id: 1, date: '2026-01-01', note: 'stary', pointIds: [], photos: [] },
      { id: 2, date: '2026-05-01', note: 'nowy', pointIds: [], photos: [] },
    ]
    render(<JournalList entries={entries} points={points} onEdit={vi.fn()} onDelete={vi.fn()} />)

    const dates = screen.getAllByRole('listitem').map((item) => item.querySelector('strong').textContent)
    expect(dates).toEqual(['2026-05-01', '2026-01-01'])
  })

  it('wywołuje onEdit z całym wpisem po kliknięciu "Edytuj"', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const entry = { id: 1, date: '2026-05-01', note: 'notatka', pointIds: [], photos: [] }
    render(<JournalList entries={[entry]} points={points} onEdit={onEdit} onDelete={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Edytuj' }))

    expect(onEdit).toHaveBeenCalledWith(entry)
  })

  it('usuwa wpis dopiero po potwierdzeniu, nie po pierwszym kliknięciu "Usuń"', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const entry = { id: 1, date: '2026-05-01', note: 'notatka', pointIds: [], photos: [] }
    render(<JournalList entries={[entry]} points={points} onEdit={vi.fn()} onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: 'Usuń' }))
    expect(onDelete).not.toHaveBeenCalled()
    expect(screen.getByText('Na pewno?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tak, usuń' }))
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('anulowanie potwierdzenia nie wywołuje onDelete', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const entry = { id: 1, date: '2026-05-01', note: 'notatka', pointIds: [], photos: [] }
    render(<JournalList entries={[entry]} points={points} onEdit={vi.fn()} onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: 'Usuń' }))
    await user.click(screen.getByRole('button', { name: 'Anuluj' }))

    expect(onDelete).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Usuń' })).toBeInTheDocument()
  })

  it('pokazuje wszystkie systemy, do których liczy się wpis z połączonego szczytu', () => {
    const groupedPoints = [
      { id: 'sniezka', name: 'Śnieżka', region: 'Karkonosze', badgeSystem: 'GOT' },
      { id: 'sniezka-kgp', name: 'Śnieżka', region: 'Karkonosze', badgeSystem: 'KGP' },
    ]
    const peakGroups = new Map([['sniezka', ['sniezka-kgp']]])
    const entry = { id: 1, date: '2026-05-01', note: '', pointIds: ['sniezka'], photos: [] }

    render(<JournalList entries={[entry]} points={groupedPoints} onEdit={vi.fn()} onDelete={vi.fn()} peakGroups={peakGroups} />)

    expect(screen.getByText('Śnieżka (GOT, KGP)')).toBeInTheDocument()
  })

  it('nie duplikuje etykiety szczytu, gdy wpis zawiera kilka id z tej samej grupy', () => {
    const groupedPoints = [
      { id: 'sniezka', name: 'Śnieżka', region: 'Karkonosze', badgeSystem: 'GOT' },
      { id: 'sniezka-kgp', name: 'Śnieżka', region: 'Karkonosze', badgeSystem: 'KGP' },
    ]
    const peakGroups = new Map([
      ['sniezka', ['sniezka-kgp']],
      ['sniezka-kgp', ['sniezka']],
    ])
    const entry = { id: 1, date: '2026-05-01', note: '', pointIds: ['sniezka', 'sniezka-kgp'], photos: [] }

    render(<JournalList entries={[entry]} points={groupedPoints} onEdit={vi.fn()} onDelete={vi.fn()} peakGroups={peakGroups} />)

    expect(screen.getByText('Śnieżka (GOT, KGP)')).toBeInTheDocument()
    expect(screen.queryByText('Śnieżka (GOT, KGP), Śnieżka (KGP, GOT)')).not.toBeInTheDocument()
  })
})
