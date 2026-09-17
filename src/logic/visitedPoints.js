export function getVisitedPointIds(entries, peakGroups = new Map()) {
  const ids = new Set()
  for (const entry of entries) {
    for (const pointId of entry.pointIds) {
      ids.add(pointId)
      for (const siblingId of peakGroups.get(pointId) ?? []) {
        ids.add(siblingId)
      }
    }
  }
  return ids
}
