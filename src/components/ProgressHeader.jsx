function ProgressHeader({ systemName, totalPoints, currentLevel, nextLevel, pointsToNextLevel }) {
  return (
    <section className="progress-header">
      <h2>Mój postęp — {systemName}</h2>
      <p className="progress-points">
        <strong>{totalPoints}</strong> pkt
      </p>
      <p>
        Aktualny stopień: <strong>{currentLevel ? currentLevel.name : 'brak'}</strong>
      </p>
      {nextLevel ? (
        <p>
          Do kolejnego stopnia (<strong>{nextLevel.name}</strong>) brakuje{' '}
          <strong>{pointsToNextLevel}</strong> pkt.
        </p>
      ) : (
        <p>Osiągnięto najwyższy dostępny stopień.</p>
      )}
    </section>
  )
}

export default ProgressHeader
