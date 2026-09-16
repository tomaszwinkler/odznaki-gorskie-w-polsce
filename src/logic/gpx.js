export const DEFAULT_MATCH_THRESHOLD_METERS = 300

function toRadians(degrees) {
  return (degrees * Math.PI) / 180
}

export function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const earthRadiusMeters = 6371000
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusMeters * c
}

// Prosty parser oparty na wyrażeniach regularnych zamiast DOMParser — pliki
// GPX ze śladami z zegarków/telefonów mają prostą, przewidywalną strukturę
// <trkpt lat="..." lon="...">, a dzięki temu funkcja daje się testować bez
// środowiska przeglądarkowego.
export function parseGpxTrackPoints(gpxText) {
  const points = []
  const tagRegex = /<trkpt\b[^>]*>/g
  const latRegex = /lat="(-?\d+(?:\.\d+)?)"/
  const lonRegex = /lon="(-?\d+(?:\.\d+)?)"/

  let match
  while ((match = tagRegex.exec(gpxText)) !== null) {
    const tag = match[0]
    const latMatch = latRegex.exec(tag)
    const lonMatch = lonRegex.exec(tag)
    if (latMatch && lonMatch) {
      points.push({ lat: parseFloat(latMatch[1]), lon: parseFloat(lonMatch[1]) })
    }
  }

  return points
}

export function findMatchedPointIds(trackPoints, catalogPoints, thresholdMeters = DEFAULT_MATCH_THRESHOLD_METERS) {
  return catalogPoints
    .filter((point) =>
      trackPoints.some((tp) => haversineDistanceMeters(point.lat, point.lng, tp.lat, tp.lon) <= thresholdMeters),
    )
    .map((point) => point.id)
}
