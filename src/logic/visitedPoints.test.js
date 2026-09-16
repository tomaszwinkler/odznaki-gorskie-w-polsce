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
})
