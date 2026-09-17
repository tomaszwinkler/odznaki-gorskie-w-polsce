import { describe, it, expect } from 'vitest'
import { getVisitedPointIds } from './visitedPoints'

describe('getVisitedPointIds', () => {
  it('zwraca pusty zbiór, gdy nie ma wpisów', () => {
    expect(getVisitedPointIds([])).toEqual(new Set())
  })

  it('zbiera punkty z pojedynczego wpisu', () => {
    const entries = [{ id: 1, pointIds: ['sniezka', 'rysy'] }]
    expect(getVisitedPointIds(entries)).toEqual(new Set(['sniezka', 'rysy']))
  })

  it('łączy punkty z wielu wpisów bez duplikatów', () => {
    const entries = [
      { id: 1, pointIds: ['sniezka'] },
      { id: 2, pointIds: ['sniezka', 'rysy'] },
    ]
    expect(getVisitedPointIds(entries)).toEqual(new Set(['sniezka', 'rysy']))
  })

  it('ignoruje wpisy bez wybranych punktów', () => {
    const entries = [{ id: 1, pointIds: [] }]
    expect(getVisitedPointIds(entries)).toEqual(new Set())
  })

  it('rozszerza zbiór odwiedzonych o punkty z tej samej grupy (peakGroups)', () => {
    const entries = [{ id: 1, pointIds: ['sniezka'] }]
    const peakGroups = new Map([['sniezka', ['sniezka-kgp', 'sniezka-diadem']]])

    expect(getVisitedPointIds(entries, peakGroups)).toEqual(new Set(['sniezka', 'sniezka-kgp', 'sniezka-diadem']))
  })

  it('nie rozszerza zbioru, gdy id nie ma grupy w peakGroups', () => {
    const entries = [{ id: 1, pointIds: ['rysy'] }]
    const peakGroups = new Map([['sniezka', ['sniezka-kgp']]])

    expect(getVisitedPointIds(entries, peakGroups)).toEqual(new Set(['rysy']))
  })
})
