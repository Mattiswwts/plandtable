import { useState } from 'react'
import { describeConstraint } from '../utils/constraintText'

const TYPES = [
  { type: 'together', label: 'Côte à côte' },
  { type: 'apart', label: 'Pas côte à côte' },
  { type: 'nearTable', label: 'Près d\'une table' },
  { type: 'farFromTable', label: 'Loin d\'une table' },
]

function ConstraintBuilder({ guests, tables, constraints, onAddConstraint, onRemoveConstraint }) {
  const [type, setType] = useState('together')
  const [guestA, setGuestA] = useState('')
  const [guestB, setGuestB] = useState('')
  const [tableId, setTableId] = useState('')
  const [subjectMode, setSubjectMode] = useState('guest')
  const [tag, setTag] = useState('')

  const needsTwoGuests = type === 'together' || type === 'apart'
  const availableTags = [...new Set(guests.flatMap((g) => g.tags))]

  const canSubmit = needsTwoGuests
    ? guestA && guestB && guestA !== guestB
    : tableId && (subjectMode === 'guest' ? guestA : tag)

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return

    if (needsTwoGuests) {
      onAddConstraint({ type, guestIds: [guestA, guestB], tableId: null })
    } else if (subjectMode === 'tag') {
      const groupGuestIds = guests.filter((g) => g.tags.includes(tag)).map((g) => g.id)
      onAddConstraint({
        type,
        guestIds: groupGuestIds,
        tableId,
        label: `Groupe "${tag}"`,
      })
    } else {
      onAddConstraint({ type, guestIds: [guestA], tableId })
    }

    setGuestA('')
    setGuestB('')
    setTableId('')
    setTag('')
  }

  return (
    <section className="panel constraint-panel">
      <h2>
        Contraintes <span className="count-badge">{constraints.length}</span>
      </h2>

      <div className="constraint-type-choices">
        {TYPES.map((t) => (
          <button
            key={t.type}
            type="button"
            className={`chip-btn${type === t.type ? ' active' : ''}`}
            onClick={() => setType(t.type)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!needsTwoGuests && availableTags.length > 0 && (
        <div className="constraint-type-choices">
          <button
            type="button"
            className={`chip-btn${subjectMode === 'guest' ? ' active' : ''}`}
            onClick={() => setSubjectMode('guest')}
          >
            Un invité
          </button>
          <button
            type="button"
            className={`chip-btn${subjectMode === 'tag' ? ' active' : ''}`}
            onClick={() => setSubjectMode('tag')}
          >
            Un groupe (tag)
          </button>
        </div>
      )}

      <form className="constraint-form" onSubmit={handleSubmit}>
        {needsTwoGuests ? (
          <>
            <select value={guestA} onChange={(e) => setGuestA(e.target.value)}>
              <option value="">Invité A</option>
              {guests.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <select value={guestB} onChange={(e) => setGuestB(e.target.value)}>
              <option value="">Invité B</option>
              {guests.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            {subjectMode === 'tag' && availableTags.length > 0 ? (
              <select value={tag} onChange={(e) => setTag(e.target.value)}>
                <option value="">Groupe</option>
                {availableTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            ) : (
              <select value={guestA} onChange={(e) => setGuestA(e.target.value)}>
                <option value="">Invité</option>
                {guests.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            )}
            <select value={tableId} onChange={(e) => setTableId(e.target.value)}>
              <option value="">Table</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </>
        )}
        <button type="submit" disabled={!canSubmit}>
          Ajouter
        </button>
      </form>

      {constraints.length > 0 ? (
        <ul className="constraint-list">
          {constraints.map((c) => (
            <li key={c.id}>
              <span>{describeConstraint(c, guests, tables)}</span>
              <button
                type="button"
                className="remove-btn"
                onClick={() => onRemoveConstraint(c.id)}
                aria-label="Supprimer la contrainte"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-hint">Aucune contrainte pour l'instant.</p>
      )}
    </section>
  )
}

export default ConstraintBuilder
