import { describe, it, expect } from 'vitest'
import { calculateProgress } from './progress'
import { badgeLevelsBySystem } from '../data/badgeLevels'

const gotLevels = badgeLevelsBySystem.GOT

describe('calculateProgress', () => {
  it('zwraca 0 punktów i brak stopnia, gdy nic nie jest odwiedzone', () => {
    const points = [
      { id: 1, points: 5, visited: false },
      { id: 2, points: 7, visited: false },
    ]

    const result = calculateProgress(points, gotLevels)

    expect(result.totalPoints).toBe(0)
    expect(result.currentLevel).toBeNull()
  })

  it('sumuje punkty tylko z odwiedzonych punktów', () => {
    const points = [
      { id: 1, points: 5, visited: true },
      { id: 2, points: 7, visited: false },
      { id: 3, points: 3, visited: true },
    ]

    const result = calculateProgress(points, gotLevels)

    expect(result.totalPoints).toBe(8)
  })

  it('wybiera najwyższy osiągnięty stopień odznaki', () => {
    const points = [{ id: 1, points: 35, visited: true }]

    const result = calculateProgress(points, gotLevels)

    expect(result.currentLevel.name).toBe('Mała brązowa GOT')
  })

  it('wskazuje kolejny stopień i liczbę brakujących punktów', () => {
    const points = [{ id: 1, points: 35, visited: true }]

    const result = calculateProgress(points, gotLevels)

    expect(result.nextLevel.name).toBe('Mała srebrna GOT')
    expect(result.pointsToNextLevel).toBe(gotLevels[2].minPoints - 35)
  })

  it('gdy osiągnięto najwyższy stopień, nie ma kolejnego poziomu', () => {
    const points = [{ id: 1, points: 999, visited: true }]

    const result = calculateProgress(points, gotLevels)

    expect(result.nextLevel).toBeNull()
    expect(result.pointsToNextLevel).toBe(0)
  })

  it('działa też dla systemu liczonego liczbą zdobytych szczytów (KGP)', () => {
    const points = Array.from({ length: 7 }, (_, index) => ({ id: index, points: 1, visited: true }))

    const result = calculateProgress(points, badgeLevelsBySystem.KGP)

    expect(result.totalPoints).toBe(7)
    expect(result.currentLevel.name).toBe('7 zdobytych szczytów (25%)')
  })
})
