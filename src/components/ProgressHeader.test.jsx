import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressHeader from './ProgressHeader'

describe('ProgressHeader', () => {
  it('wyświetla nazwę systemu i liczbę zdobytych punktów', () => {
    render(
      <ProgressHeader
        systemName="GOT"
        totalPoints={42}
        currentLevel={{ name: 'Popularna GOT' }}
        nextLevel={{ name: 'Mała brązowa GOT' }}
        pointsToNextLevel={8}
      />,
    )

    expect(screen.getByText('Mój postęp — GOT')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('Popularna GOT')).toBeInTheDocument()
  })

  it('pokazuje liczbę brakujących punktów do kolejnego stopnia', () => {
    render(
      <ProgressHeader
        systemName="GOT"
        totalPoints={22}
        currentLevel={{ name: 'Popularna GOT' }}
        nextLevel={{ name: 'Mała brązowa GOT' }}
        pointsToNextLevel={8}
      />,
    )

    expect(screen.getByText('8', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Mała brązowa GOT')).toBeInTheDocument()
  })

  it('informuje o braku aktualnego stopnia, gdy currentLevel jest null', () => {
    render(<ProgressHeader systemName="GOT" totalPoints={0} currentLevel={null} nextLevel={null} pointsToNextLevel={null} />)

    expect(screen.getByText('brak')).toBeInTheDocument()
  })

  it('informuje o osiągnięciu najwyższego stopnia, gdy brak nextLevel', () => {
    render(
      <ProgressHeader
        systemName="KGP"
        totalPoints={28}
        currentLevel={{ name: 'Korona Gór Polski zdobyta (28/28)' }}
        nextLevel={null}
        pointsToNextLevel={null}
      />,
    )

    expect(screen.getByText('Osiągnięto najwyższy dostępny stopień.')).toBeInTheDocument()
  })
})
