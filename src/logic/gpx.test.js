import { describe, it, expect } from 'vitest'
import { haversineDistanceMeters, parseGpxTrackPoints, findMatchedPointIds } from './gpx'

describe('haversineDistanceMeters', () => {
  it('zwraca 0 dla tego samego punktu', () => {
    expect(haversineDistanceMeters(49.2319, 19.9814, 49.2319, 19.9814)).toBeCloseTo(0, 3)
  })

  it('liczy w przybliżeniu poprawny dystans między znanymi punktami', () => {
    // Warszawa -> Kraków, ok. 252 km w linii prostej
    const dist = haversineDistanceMeters(52.2297, 21.0122, 50.0647, 19.945)
    expect(dist / 1000).toBeGreaterThan(240)
    expect(dist / 1000).toBeLessThan(265)
  })
})

describe('parseGpxTrackPoints', () => {
  it('parsuje punkty trkpt niezależnie od kolejności atrybutów', () => {
    const gpx = `
      <gpx>
        <trk><trkseg>
          <trkpt lat="49.2319" lon="19.9814"><ele>1200</ele></trkpt>
          <trkpt lon="19.9339" lat="49.2447"></trkpt>
        </trkseg></trk>
      </gpx>
    `
    const points = parseGpxTrackPoints(gpx)
    expect(points).toEqual([
      { lat: 49.2319, lon: 19.9814 },
      { lat: 49.2447, lon: 19.9339 },
    ])
  })

  it('zwraca pustą tablicę, gdy brak punktów trkpt', () => {
    expect(parseGpxTrackPoints('<gpx></gpx>')).toEqual([])
  })
})

describe('findMatchedPointIds', () => {
  const catalogPoints = [
    { id: 'kasprowy-wierch', lat: 49.2319, lng: 19.9814 },
    { id: 'giewont', lat: 49.2447, lng: 19.9339 },
    { id: 'rysy', lat: 49.1794, lng: 20.0881 },
  ]

  it('dopasowuje punkty katalogowe blisko śladu GPX', () => {
    const trackPoints = [{ lat: 49.232, lon: 19.9815 }]
    const matched = findMatchedPointIds(trackPoints, catalogPoints, 300)
    expect(matched).toEqual(['kasprowy-wierch'])
  })

  it('nie dopasowuje punktów poza progiem odległości', () => {
    const trackPoints = [{ lat: 49.232, lon: 19.9815 }]
    const matched = findMatchedPointIds(trackPoints, catalogPoints, 10)
    expect(matched).toEqual([])
  })

  it('obsługuje wiele dopasowanych punktów', () => {
    const trackPoints = [
      { lat: 49.2319, lon: 19.9814 },
      { lat: 49.2447, lon: 19.9339 },
    ]
    const matched = findMatchedPointIds(trackPoints, catalogPoints, 300)
    expect(matched).toEqual(['kasprowy-wierch', 'giewont'])
  })
})
