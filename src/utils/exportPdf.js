import jsPDF from 'jspdf'

function guestName(guests, id) {
  return guests.find((g) => g.id === id)?.name ?? '?'
}

function safeFileName(name, fallback) {
  const trimmed = name.trim().replace(/\s+/g, '_')
  return `${trimmed || fallback}.pdf`
}

export function exportTablePlanPdf(project) {
  const { name, guests, tables, placement } = project
  const doc = new jsPDF()
  const title = name || 'Plan de table'

  if (tables.length === 0) {
    doc.setFontSize(14)
    doc.text('Aucune table créée.', 14, 20)
  }

  tables.forEach((table, index) => {
    if (index > 0) doc.addPage()
    doc.setFontSize(18)
    doc.text(title, 14, 18)
    doc.setFontSize(14)
    doc.text(table.label, 14, 30)
    doc.setFontSize(10)
    doc.text(
      `${table.shape === 'round' ? 'Table ronde' : 'Table rectangulaire'} — ${table.capacity} place(s)`,
      14,
      37,
    )

    const occupantIds = Object.entries(placement)
      .filter(([, p]) => p.tableId === table.id)
      .sort((a, b) => a[1].seatIndex - b[1].seatIndex)
      .map(([guestId]) => guestId)

    let y = 48
    doc.setFontSize(12)
    if (occupantIds.length === 0) {
      doc.text('Aucun invité placé.', 14, y)
    } else {
      occupantIds.forEach((guestId, i) => {
        doc.text(`${i + 1}. ${guestName(guests, guestId)}`, 14, y)
        y += 8
      })
    }
  })

  doc.save(safeFileName(title, 'plan-de-table'))
}

export function exportGuestListPdf(project) {
  const { name, guests, tables, placement } = project
  const doc = new jsPDF()
  const title = name || 'Liste des invités'

  doc.setFontSize(18)
  doc.text(title, 14, 18)
  doc.setFontSize(11)

  if (guests.length === 0) {
    doc.text('Aucun invité.', 14, 32)
    doc.save(safeFileName(title, 'liste-invites'))
    return
  }

  const sorted = [...guests].sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  let y = 32
  sorted.forEach((guest) => {
    const p = placement[guest.id]
    const table = p ? tables.find((t) => t.id === p.tableId) : null
    const tableLabel = table ? table.label : 'Non placé'
    if (y > 280) {
      doc.addPage()
      y = 20
    }
    doc.text(`${guest.name} — ${tableLabel}`, 14, y)
    y += 8
  })

  doc.save(safeFileName(title, 'liste-invites'))
}
