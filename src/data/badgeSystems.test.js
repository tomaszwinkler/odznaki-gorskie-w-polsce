import { describe, it, expect } from 'vitest'
import { badgeSystems } from './badgeSystems'
import { badgeCategories } from './badgeCategories'
import { badgeLevelsBySystem } from './badgeLevels'

describe('badgeSystems', () => {
  it('każdy system ma unikalne id', () => {
    const ids = badgeSystems.map((system) => system.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('każdy system wskazuje na istniejącą kategorię', () => {
    const knownCategoryIds = new Set(badgeCategories.map((category) => category.id))
    for (const system of badgeSystems) {
      expect(knownCategoryIds.has(system.category)).toBe(true)
    }
  })

  it('każdy dostępny system (available: true) ma zdefiniowane progi odznaki', () => {
    for (const system of badgeSystems.filter((s) => s.available)) {
      expect(badgeLevelsBySystem[system.id]).toBeDefined()
      expect(badgeLevelsBySystem[system.id].length).toBeGreaterThan(0)
    }
  })
})
