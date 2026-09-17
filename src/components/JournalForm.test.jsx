import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JournalForm from './JournalForm'

vi.mock('../logic/imageCompression', () => ({
  compressImageFile: vi.fn((file) => Promise.resolve(file)),
}))

const points = [
  { id: 'sniezka', name: 'Śnieżka', region: 'Sudety', badgeSystem: 'GOT', lat: 50.736, lng: 15.74 },
  { id: 'rysy', name: 'Rysy', region: 'Karpaty', badgeSystem: 'GOT', lat: 49.1794, lng: 20.0881 },
]

describe('JournalForm', () => {
  it('wysyła wpis z zaznaczonymi punktami po zapisaniu', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<JournalForm points={points} editingEntry={null} onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByLabelText('Notatka'), 'super widoki')
    await user.click(screen.getByRole('checkbox', { name: /Śnieżka/ }))
    await user.click(screen.getByRole('button', { name: 'Zapisz wpis' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ note: 'super widoki', pointIds: ['sniezka'], photos: [], gpxTrack: [] }),
    )
  })

  it('czyści formularz po zapisaniu nowego wpisu', async () => {
    const user = userEvent.setup()
    render(<JournalForm points={points} editingEntry={null} onSubmit={vi.fn()} onCancel={vi.fn()} />)

    await user.type(screen.getByLabelText('Notatka'), 'coś')
    await user.click(screen.getByRole('button', { name: 'Zapisz wpis' }))

    expect(screen.getByLabelText('Notatka')).toHaveValue('')
  })

  it('wypełnia pola danymi edytowanego wpisu i pokazuje przycisk anulowania', () => {
    const editingEntry = { id: 5, date: '2026-03-02', note: 'stara notatka', pointIds: ['rysy'], photos: [], gpxTrack: [] }
    render(<JournalForm points={points} editingEntry={editingEntry} onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByLabelText('Notatka')).toHaveValue('stara notatka')
    expect(screen.getByRole('checkbox', { name: /Rysy/ })).toBeChecked()
    expect(screen.getByRole('button', { name: 'Zapisz zmiany' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Anuluj' })).toBeInTheDocument()
  })

  it('wywołuje onCancel po kliknięciu Anuluj w trybie edycji', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const editingEntry = { id: 5, date: '2026-03-02', note: '', pointIds: [], photos: [], gpxTrack: [] }
    render(<JournalForm points={points} editingEntry={editingEntry} onSubmit={vi.fn()} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: 'Anuluj' }))

    expect(onCancel).toHaveBeenCalled()
  })

  it('parsuje zaimportowany plik GPX i automatycznie zaznacza dopasowane punkty', async () => {
    const user = userEvent.setup()
    render(<JournalForm points={points} editingEntry={null} onSubmit={vi.fn()} onCancel={vi.fn()} />)

    const gpx = '<gpx><trkpt lat="49.1794" lon="20.0881"></trkpt></gpx>' // pokrywa się z Rysy
    const file = new File([gpx], 'trasa.gpx', { type: 'application/gpx+xml' })

    await user.upload(screen.getByLabelText('Import trasy GPX'), file)

    expect(await screen.findByText(/Rozpoznano automatycznie/)).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Rysy/ })).toBeChecked()
  })

  it('pokazuje komunikat, gdy plik GPX nie zawiera punktów trasy', async () => {
    const user = userEvent.setup()
    render(<JournalForm points={points} editingEntry={null} onSubmit={vi.fn()} onCancel={vi.fn()} />)

    const file = new File(['<gpx></gpx>'], 'pusty.gpx', { type: 'application/gpx+xml' })
    await user.upload(screen.getByLabelText('Import trasy GPX'), file)

    expect(await screen.findByText('Nie rozpoznano żadnych punktów trasy w tym pliku GPX.')).toBeInTheDocument()
  })

  it('dodaje wybrane zdjęcia do stanu (po przejściu przez skompresowaną wersję)', async () => {
    const user = userEvent.setup()
    render(<JournalForm points={points} editingEntry={null} onSubmit={vi.fn()} onCancel={vi.fn()} />)

    const photo = new File(['dane'], 'widok.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText('Zdjęcia'), photo)

    expect(await screen.findByText('Wybrano 1 zdjęć.')).toBeInTheDocument()
  })
})
