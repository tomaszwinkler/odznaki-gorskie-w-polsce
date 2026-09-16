const comparators = {
  visited: (a, b) => Number(a.visited) - Number(b.visited),
  region: (a, b) => a.region.localeCompare(b.region),
  name: (a, b) => a.name.localeCompare(b.name),
  points: (a, b) => a.points - b.points,
}

export function sortPoints(points, key, direction = 'asc') {
  const comparator = comparators[key]

  const sorted = [...points].sort((a, b) => comparator(a, b) || a.name.localeCompare(b.name))

  return direction === 'desc' ? sorted.reverse() : sorted
}
