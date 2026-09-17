import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PointsList from './PointsList'

const points = [
  { id: 'nieznany-punkt-testowy', name: 'Testowa Góra', region: 'Sudety', points: 10, visited: true },
  { id: 'rysy-kgp', name: 'Rysy', region: 'Tatry', points: 1, visited: false },
]

describe('PointsList', () => {
  it('wywołuje onSort z kluczem kolumny po kliknięciu nagłówka', async () => {
    const user = userEvent.setup()
    const onSort = vi.fn()
    render(<PointsList points={points} sortKey="region" sortDirection="asc" onSort={onSort} />)

    await user.click(screen.getByRole('button', { name: /Nazwa/ }))

    expect(onSort).toHaveBeenCalledWith('name')
  })

  it('pokazuje strzałkę kierunku sortowania przy aktywnej kolumnie', () => {
    render(<PointsList points={points} sortKey="region" sortDirection="desc" onSort={vi.fn()} />)

    expect(screen.getByRole('button', { name: /Pasmo ▼/ })).toBeInTheDocument()
  })

  it('oznacza checkboxem punkty odwiedzone i nieodwiedzone', () => {
    render(<PointsList points={points} sortKey="region" sortDirection="asc" onSort={vi.fn()} />)

    expect(screen.getByRole('checkbox', { name: 'Testowa Góra: odwiedzony' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Rysy: nieodwiedzony' })).not.toBeChecked()
  })

  it('rozwija szczegóły trasy z realnymi danymi dla punktu, który je ma', async () => {
    const user = userEvent.setup()
    render(<PointsList points={points} sortKey="region" sortDirection="asc" onSort={vi.fn()} />)

    const detailButtons = screen.getAllByRole('button', { name: 'Szczegóły' })
    await user.click(detailButtons[1]) // Rysy (rysy-kgp) ma dane w trailInfo.js

    expect(screen.getByText('Punkt startowy')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ukryj' })).toBeInTheDocument()
  })

  it('pokazuje komunikat "w przygotowaniu" dla punktu bez danych o trasie', async () => {
    const user = userEvent.setup()
    render(<PointsList points={points} sortKey="region" sortDirection="asc" onSort={vi.fn()} />)

    const detailButtons = screen.getAllByRole('button', { name: 'Szczegóły' })
    await user.click(detailButtons[0]) // Testowa Góra — syntetyczne id spoza trailInfo.js

    expect(screen.getByText('Dane o trasie i dojeździe są w przygotowaniu dla tego punktu.')).toBeInTheDocument()
  })
})
