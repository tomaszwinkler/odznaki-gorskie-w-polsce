export function buildPeakGroups(points) {
  const adjacency = new Map()

  const addEdge = (a, b) => {
    if (!adjacency.has(a)) adjacency.set(a, new Set())
    if (!adjacency.has(b)) adjacency.set(b, new Set())
    adjacency.get(a).add(b)
    adjacency.get(b).add(a)
  }

  for (const point of points) {
    for (const siblingId of point.sharesPeakWith ?? []) {
      addEdge(point.id, siblingId)
    }
  }

  const groups = new Map()
  const visited = new Set()

  for (const id of adjacency.keys()) {
    if (visited.has(id)) continue

    const component = []
    const queue = [id]
    visited.add(id)

    while (queue.length > 0) {
      const current = queue.shift()
      component.push(current)
      for (const neighbor of adjacency.get(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
        }
      }
    }

    for (const memberId of component) {
      groups.set(memberId, component.filter((otherId) => otherId !== memberId))
    }
  }

  return groups
}
