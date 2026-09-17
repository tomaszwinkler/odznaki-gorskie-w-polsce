import { describe, it, expect } from 'vitest'
import { initialPoints } from './points'
import { badgeSystems } from './badgeSystems'

// Przybliżony prostokąt obejmujący całą Polskę — łapie literówki we
// współrzędnych (np. zamienione lat/lng).
const POLAND_BOUNDS = { minLat: 49, maxLat: 55, minLng: 14, maxLng: 24 }

describe('initialPoints', () => {
  it('każdy punkt ma unikalne id', () => {
    const ids = initialPoints.map((point) => point.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('każdy punkt ma współrzędne mieszczące się w granicach Polski', () => {
    for (const point of initialPoints) {
      expect(point.lat).toBeGreaterThanOrEqual(POLAND_BOUNDS.minLat)
      expect(point.lat).toBeLessThanOrEqual(POLAND_BOUNDS.maxLat)
      expect(point.lng).toBeGreaterThanOrEqual(POLAND_BOUNDS.minLng)
      expect(point.lng).toBeLessThanOrEqual(POLAND_BOUNDS.maxLng)
    }
  })

  it('każdy punkt należy do znanego systemu odznak i ma dodatnią liczbę punktów', () => {
    const knownSystemIds = new Set(badgeSystems.map((system) => system.id))
    for (const point of initialPoints) {
      expect(knownSystemIds.has(point.badgeSystem)).toBe(true)
      expect(point.points).toBeGreaterThan(0)
    }
  })

  it('Korona Gór Polski zawiera pełne 28 szczytów', () => {
    const kgpPoints = initialPoints.filter((point) => point.badgeSystem === 'KGP')
    expect(kgpPoints).toHaveLength(28)
  })

  it('Diadem Polskich Gór zawiera pełne 80 szczytów', () => {
    const diademPoints = initialPoints.filter((point) => point.badgeSystem === 'DIADEM')
    expect(diademPoints).toHaveLength(80)
  })

  it('każde sharesPeakWith wskazuje na istniejące id i nie zawiera samego siebie', () => {
    const idsSet = new Set(initialPoints.map((point) => point.id))
    for (const point of initialPoints) {
      for (const siblingId of point.sharesPeakWith ?? []) {
        expect(idsSet.has(siblingId)).toBe(true)
        expect(siblingId).not.toBe(point.id)
      }
    }
  })
})
