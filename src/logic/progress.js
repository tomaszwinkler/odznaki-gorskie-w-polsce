// Zakłada, że `levels` jest posortowana rosnąco po `minPoints`.
export function calculateProgress(points, levels) {
  const totalPoints = points
    .filter((point) => point.visited)
    .reduce((sum, point) => sum + point.points, 0)

  const achievedLevels = levels.filter((level) => totalPoints >= level.minPoints)
  const currentLevel = achievedLevels.length > 0 ? achievedLevels[achievedLevels.length - 1] : null

  const nextLevel = levels.find((level) => totalPoints < level.minPoints) ?? null
  const pointsToNextLevel = nextLevel ? nextLevel.minPoints - totalPoints : 0

  return { totalPoints, currentLevel, nextLevel, pointsToNextLevel }
}
