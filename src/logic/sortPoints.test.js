import { describe, it, expect } from 'vitest'
import { sortPoints } from './sortPoints'

const points = [
  { id: 'b', name: 'Babia Góra', region: 'Karpaty', points: 10, visited: true },
  { id: 's', name: 'Śnieżka', region: 'Sudety', points: 10, visited: false },
  { id: 'r', name: 'Rysy', region: 'Karpaty', points: 12, visited: false },
  { id: 'c', name: 'Chojnik', region: 'Sudety', points: 3, visited: true },
]

describe('sortPoints', () => {
  it('sortuje rosnąco po nazwie', () => {
    const result = sortPoints(points, 'name', 'asc')
    expect(result.map((p) => p.id)).toEqual(['b', 'c', 'r', 's'])
  })

  it('sortuje malejąco po nazwie', () => {
    const result = sortPoints(points, 'name', 'desc')
    expect(result.map((p) => p.id)).toEqual(['s', 'r', 'c', 'b'])
  })

  it('sortuje po paśmie, a w ramach pasma po nazwie', () => {
    const result = sortPoints(points, 'region', 'asc')
    expect(result.map((p) => p.id)).toEqual(['b', 'r', 'c', 's'])
  })

  it('sortuje po punktacji rosnąco', () => {
    const result = sortPoints(points, 'points', 'asc')
    expect(result.map((p) => p.points)).toEqual([3, 10, 10, 12])
  })

  it('sortuje po statusie odwiedzenia (nieodwiedzone pierwsze przy asc)', () => {
    const result = sortPoints(points, 'visited', 'asc')
    expect(result.map((p) => p.visited)).toEqual([false, false, true, true])
  })

  it('nie mutuje oryginalnej tablicy', () => {
    const original = [...points]
    sortPoints(points, 'name', 'asc')
    expect(points).toEqual(original)
  })
})
