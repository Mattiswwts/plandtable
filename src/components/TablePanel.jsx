import { useState } from 'react'

function TablePanel({ tables, onAddTable, onUpdateTable, onRemoveTable }) {
  const [shape, setShape] = useState('round')
  const [capacity, setCapacity] = useState(8)

  function handleAdd(e) {
    e.preventDefault()
    const label = `Table ${tables.length + 1}`
    onAddTable({ label, shape, capacity: Number(capacity) || 1 })
  }

  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0)

  return (
    <section className="panel table-panel">
      <h2>
        Tables <span className="count-badge">{tables.length}</span>
      </h2>

      <form className="inline-form" onSubmit={handleAdd}>
        <select value={shape} onChange={(e) => setShape(e.target.value)}>
          <option value="round">Ronde</option>
          <option value="rect">Rectangulaire</option>
        </select>
        <input
          type="number"
          min="1"
          max="30"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          aria-label="Capacité"
        />
        <button type="submit">Ajouter une table</button>
      </form>

      {tables.length > 0 ? (
        <>
          <p className="hint">Capacité totale : {totalCapacity} place(s)</p>
          <ul className="table-list">
            {tables.map((table) => (
              <li key={table.id}>
                <input
                  type="text"
                  className="table-label-input"
                  value={table.label}
                  onChange={(e) =>
                    onUpdateTable(table.id, { label: e.target.value })
                  }
                  aria-label="Nom de la table"
                />
                <select
                  value={table.shape}
                  onChange={(e) =>
                    onUpdateTable(table.id, { shape: e.target.value })
                  }
                  aria-label="Forme de la table"
                >
                  <option value="round">Ronde</option>
                  <option value="rect">Rectangulaire</option>
                </select>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={table.capacity}
                  onChange={(e) =>
                    onUpdateTable(table.id, {
                      capacity: Number(e.target.value) || 1,
                    })
                  }
                  aria-label="Capacité de la table"
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => onRemoveTable(table.id)}
                  aria-label={`Supprimer ${table.label}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="empty-hint">Aucune table pour l'instant.</p>
      )}
    </section>
  )
}

export default TablePanel
