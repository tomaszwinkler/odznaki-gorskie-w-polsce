import { describe, it, expect } from 'vitest'
import { buildPeakGroups } from './peakGroups'

describe('buildPeakGroups', () => {
  it('grupuje punkt z gwiazdą sharesPeakWith ze wszystkimi wskazanymi id', () => {
    const points = [
      { id: 'a', sharesPeakWith: ['b', 'c', 'd'] },
      { id: 'b' },
      { id: 'c' },
      { id: 'd' },
    ]

    const groups = buildPeakGroups(points)

    expect(groups.get('a')).toHaveLength(3)
    expect(groups.get('a')).toEqual(expect.arrayContaining(['b', 'c', 'd']))
    expect(groups.get('b')).toEqual(expect.arrayContaining(['a', 'c', 'd']))
    expect(groups.get('c')).toEqual(expect.arrayContaining(['a', 'b', 'd']))
    expect(groups.get('d')).toEqual(expect.arrayContaining(['a', 'b', 'c']))
  })

  it('łączy punkty pośrednio, przez wspóle powiązanie, nawet bez bezpośredniego linku', () => {
    const points = [
      { id: 'a', sharesPeakWith: ['b'] },
      { id: 'c', sharesPeakWith: ['b'] },
      { id: 'b' },
    ]

    const groups = buildPeakGroups(points)

    expect(groups.get('a')).toEqual(expect.arrayContaining(['b', 'c']))
    expect(groups.get('c')).toEqual(expect.arrayContaining(['a', 'b']))
    expect(groups.get('b')).toEqual(expect.arrayContaining(['a', 'c']))
  })

  it('nie umieszcza w mapie punktów bez żadnego powiązania', () => {
    const points = [{ id: 'a', sharesPeakWith: ['b'] }, { id: 'b' }, { id: 'x' }]

    const groups = buildPeakGroups(points)

    expect(groups.has('x')).toBe(false)
  })

  it('zwraca pustą mapę dla pustego katalogu', () => {
    expect(buildPeakGroups([])).toEqual(new Map())
  })
})
