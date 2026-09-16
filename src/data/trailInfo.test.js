import { describe, it, expect } from 'vitest'
import { trailInfoByPointId } from './trailInfo'
import { initialPoints } from './points'

describe('trailInfoByPointId', () => {
  it('zawiera wpis dla każdego punktu KGP', () => {
    const kgpIds = initialPoints.filter((point) => point.badgeSystem === 'KGP').map((point) => point.id)
    for (const id of kgpIds) {
      expect(trailInfoByPointId[id]).toBeDefined()
    }
  })

  it('nie zawiera kluczy bez odpowiadającego punktu w katalogu (literówki id)', () => {
    const knownIds = new Set(initialPoints.map((point) => point.id))
    for (const id of Object.keys(trailInfoByPointId)) {
      expect(knownIds.has(id)).toBe(true)
    }
  })

  it('każdy wpis ma wypełnione podstawowe pola', () => {
    for (const info of Object.values(trailInfoByPointId)) {
      expect(info.trailhead).toBeTruthy()
      expect(info.access).toBeTruthy()
      expect(info.trailColor).toBeTruthy()
      expect(info.ascentTime).toBeTruthy()
      expect(info.elevationGain).toBeTruthy()
    }
  })
})
