import { describeConstraint } from '../utils/constraintText'

function SolveButton({ guests, tables, constraints, totalCapacity, hasPlacement, locked, onSolve, onRequestUnlock, result }) {
  const canSolve = guests.length > 0 && tables.length > 0
  const capacityShortfall = totalCapacity < guests.length

  function handleClick() {
    if (locked) {
      onRequestUnlock()
      return
    }
    onSolve()
  }

  return (
    <section className="panel solve-panel">
      <h2>Placement</h2>

      {capacityShortfall && (
        <p className="warning-hint">
          Capacité insuffisante : {totalCapacity} place(s) pour {guests.length}{' '}
          invité(s). Ajoutez des tables ou augmentez leur capacité.
        </p>
      )}

      <button type="button" className="solve-btn" onClick={handleClick} disabled={!canSolve}>
        {hasPlacement ? 'Régénérer le placement' : 'Placer automatiquement les invités'}
      </button>
      {locked && (
        <p className="warning-hint">
          Débloquez plandtable pour régénérer le placement au-delà de 30 invités.
        </p>
      )}

      {result && (
        <div className="solve-result">
          <p className="hint">
            {constraints.length - result.unsatisfied.length}/{constraints.length}{' '}
            contrainte(s) satisfaite(s)
          </p>
          {result.unseated.length > 0 && (
            <p className="warning-hint">
              {result.unseated.length} invité(s) sans place :{' '}
              {result.unseated
                .map((id) => guests.find((g) => g.id === id)?.name)
                .filter(Boolean)
                .join(', ')}
            </p>
          )}
          {result.unsatisfied.length > 0 && (
            <ul className="violation-list">
              {result.unsatisfied.map((c) => (
                <li key={c.id}>{describeConstraint(c, guests, tables)}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}

export default SolveButton
