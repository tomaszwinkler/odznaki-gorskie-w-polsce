import { describe, it, expect } from 'vitest'
import { computeScaledDimensions } from './imageCompression'

describe('computeScaledDimensions', () => {
  it('pomniejsza szeroki obraz zachowując proporcje, ograniczając dłuższy bok', () => {
    expect(computeScaledDimensions(4000, 3000, 1600)).toEqual({ width: 1600, height: 1200 })
  })

  it('pomniejsza wysoki (portretowy) obraz ograniczając wysokość jako dłuższy bok', () => {
    expect(computeScaledDimensions(3000, 4000, 1600)).toEqual({ width: 1200, height: 1600 })
  })

  it('nie powiększa obrazu, który jest już mniejszy niż maksimum', () => {
    expect(computeScaledDimensions(800, 600, 1600)).toEqual({ width: 800, height: 600 })
  })

  it('zwraca oryginalne wymiary, gdy dłuższy bok jest równy maksimum', () => {
    expect(computeScaledDimensions(1600, 1200, 1600)).toEqual({ width: 1600, height: 1200 })
  })
})
