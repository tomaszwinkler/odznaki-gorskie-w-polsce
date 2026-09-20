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

  it('Dominanty Przedgórza Sudeckiego mają dwa oficjalne stopnie: srebrny (20) i złoty (41)', () => {
    const levels = badgeLevelsBySystem.DOMINANTY_PRZEDGORZA

    expect(levels.map((level) => level.minPoints)).toEqual([20, 41])
    expect(levels[0].name).toMatch(/srebrn/i)
    expect(levels[1].name).toMatch(/złot/i)
  })

  it('Korona Najwybitniejszych Szczytów Gór Polskich ma cztery stopnie: popularny (5), brązowy (20), srebrny (35), złoty (50)', () => {
    const levels = badgeLevelsBySystem.KNSGP

    expect(levels.map((level) => level.minPoints)).toEqual([5, 20, 35, 50])
    expect(levels.map((level) => level.name.toLowerCase())).toEqual([
      expect.stringContaining('popularn'),
      expect.stringContaining('brązow'),
      expect.stringContaining('srebrn'),
      expect.stringContaining('złot'),
    ])
  })

  it('Korona Polskich Beskidów kończy się progiem 10/10', () => {
    const levels = badgeLevelsBySystem.KORONA_POLSKICH_BESKIDOW

    expect(levels.at(-1).minPoints).toBe(10)
    expect(levels.at(-1).name).toMatch(/10\/10/)
  })

  it('wszystkie systemy odznak regionalnych są dostępne (bez placeholderów)', () => {
    const regional = badgeSystems.filter((system) => system.category === 'regionalne')

    expect(regional.length).toBeGreaterThan(0)
    expect(regional.every((system) => system.available)).toBe(true)
  })

  it('każdy dostępny system (available: true) ma zdefiniowane progi odznaki', () => {
    for (const system of badgeSystems.filter((s) => s.available)) {
      expect(badgeLevelsBySystem[system.id]).toBeDefined()
      expect(badgeLevelsBySystem[system.id].length).toBeGreaterThan(0)
    }
  })
})
