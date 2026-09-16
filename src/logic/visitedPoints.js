export function getVisitedPointIds(entries) {
  const ids = new Set()
  for (const entry of entries) {
    for (const pointId of entry.pointIds) {
      ids.add(pointId)
    }
  }
  return ids
}
