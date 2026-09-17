import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JournalView from './JournalView'
import { buildExportPayload } from '../logic/backup'

const points = [{ id: 'sniezka', name: 'Śnieżka', region: 'Sudety', badgeSystem: 'GOT' }]

describe('JournalView', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('eksportuje dziennik jako plik pobierany przez link', async () => {
    const user = userEvent.setup()
    const entries = [{ id: 1, date: '2026-05-01', note: 'wpis', pointIds: [], photos: [], gpxTrack: [] }]
    const createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    render(<JournalView points={points} entries={entries} onSaveEntry={vi.fn()} onDeleteEntry={vi.fn()} onImportEntries={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Eksportuj dziennik' }))

    expect(createObjectUrlSpy).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()
  })

  it('importuje poprawny plik i pokazuje liczbę zaimportowanych wpisów', async () => {
    const user = userEvent.setup()
    const onImportEntries = vi.fn()
    const exported = [{ id: 1, date: '2026-05-01', note: 'wpis', pointIds: ['sniezka'], photos: [], gpxTrack: [] }]
    const payload = await buildExportPayload(exported)
    const file = new File([JSON.stringify(payload)], 'dziennik.json', { type: 'application/json' })

    render(<JournalView points={points} entries={[]} onSaveEntry={vi.fn()} onDeleteEntry={vi.fn()} onImportEntries={onImportEntries} />)
    await user.upload(screen.getByLabelText('Importuj dziennik'), file)

    expect(await screen.findByText('Zaimportowano 1 wpis(ów) do dziennika.')).toBeInTheDocument()
    expect(onImportEntries).toHaveBeenCalledWith([expect.objectContaining({ date: '2026-05-01', note: 'wpis' })])
  })

  it('pokazuje komunikat błędu i nie importuje niczego dla niepoprawnego pliku', async () => {
    const user = userEvent.setup()
    const onImportEntries = vi.fn()
    const file = new File(['to nie jest json'], 'zly.json', { type: 'application/json' })

    render(<JournalView points={points} entries={[]} onSaveEntry={vi.fn()} onDeleteEntry={vi.fn()} onImportEntries={onImportEntries} />)
    await user.upload(screen.getByLabelText('Importuj dziennik'), file)

    expect(await screen.findByText('Nieprawidłowy plik: to nie jest poprawny plik JSON.')).toBeInTheDocument()
    expect(onImportEntries).not.toHaveBeenCalled()
  })
})
