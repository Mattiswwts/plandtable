import { useState } from 'react'
import { parseGuestList } from '../utils/parseGuestList'

const SUGGESTED_TAGS = ['Famille', 'Amis', 'Collègues', 'Enfants']

function GuestPanel({ guests, onAddGuest, onAddGuests, onRemoveGuest, onAddTag, onRemoveTag }) {
  const [name, setName] = useState('')
  const [pasteText, setPasteText] = useState('')
  const [showPaste, setShowPaste] = useState(false)

  function handleManualSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAddGuest(trimmed)
    setName('')
  }

  const previewNames = parseGuestList(pasteText)

  function handlePasteImport() {
    if (previewNames.length === 0) return
    onAddGuests(previewNames)
    setPasteText('')
    setShowPaste(false)
  }

  return (
    <section className="panel guest-panel">
      <h2>
        Invités <span className="count-badge">{guests.length}</span>
      </h2>

      <form className="inline-form" onSubmit={handleManualSubmit}>
        <input
          type="text"
          placeholder="Nom de l'invité"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>

      <button
        type="button"
        className="link-btn"
        onClick={() => setShowPaste((v) => !v)}
      >
        {showPaste ? 'Masquer le collage de liste' : 'Coller une liste entière'}
      </button>

      {showPaste && (
        <div className="paste-box">
          <textarea
            placeholder={
              'Collez votre liste ici, un invité par ligne\nex: 1. Jean Dupont\nDupont, Marie\n- Sophie Bernard'
            }
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={6}
          />
          {previewNames.length > 0 && (
            <p className="hint">{previewNames.length} invité(s) détecté(s)</p>
          )}
          <button
            type="button"
            onClick={handlePasteImport}
            disabled={previewNames.length === 0}
          >
            Importer{previewNames.length > 0 ? ` (${previewNames.length})` : ''}
          </button>
        </div>
      )}

      {guests.length > 0 ? (
        <ul className="guest-list">
          {guests.map((guest) => {
            const availableTags = SUGGESTED_TAGS.filter((t) => !guest.tags.includes(t))
            return (
              <li key={guest.id}>
                <div className="guest-row">
                  <div className="guest-row-main">
                    <span className="guest-name">{guest.name}</span>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => onRemoveGuest(guest.id)}
                      aria-label={`Supprimer ${guest.name}`}
                    >
                      ×
                    </button>
                  </div>
                  <div className="guest-tags">
                    {guest.tags.map((tag) => (
                      <span className="tag-chip" key={tag}>
                        {tag}
                        <button
                          type="button"
                          onClick={() => onRemoveTag(guest.id, tag)}
                          aria-label={`Retirer le tag ${tag} de ${guest.name}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {availableTags.length > 0 && (
                      <select
                        className="tag-add-select"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) onAddTag(guest.id, e.target.value)
                        }}
                        aria-label={`Ajouter un tag à ${guest.name}`}
                      >
                        <option value="">+ tag</option>
                        {availableTags.map((tag) => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="empty-hint">Aucun invité pour l'instant.</p>
      )}
    </section>
  )
}

export default GuestPanel
