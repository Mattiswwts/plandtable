import jsPDF from 'jspdf'
import {
  SEAT_RADIUS,
  roundTableSeats,
  rectTableSeats,
  seatLabelPosition,
  estimateTextWidth,
  LABEL_LINE_HEIGHT,
} from './tableGeometry'

const GOLD = [193, 154, 91]
const SAGE = [138, 152, 115]
const BORDER = [214, 205, 184]
const TEXT_DARK_CSS = 'rgb(66, 55, 40)'
const SAGE_CSS = 'rgb(138, 152, 115)'
const MAX_SCALE = 1.5
const PX_PER_MM = 40 // résolution du rendu canvas, pour un texte net à l'impression

function guestName(guests, id) {
  return guests.find((g) => g.id === id)?.name ?? '?'
}

function safeFileName(name, fallback) {
  const trimmed = name.trim().replace(/\s+/g, '_')
  return `${trimmed || fallback}.pdf`
}

// jsPDF a un bug non résolu dans sa police par défaut : la fin de certains
// mots ("Fitzgerald", "Van Der Berg"...) se retrouve rendue dans une autre
// couleur que celle demandée, de façon imprévisible (indépendant de la
// longueur du texte, de l'alignement ou de la police testés). Comme ce sont
// justement des noms d'invités qu'on ne maîtrise pas, on contourne le bug en
// dessinant ces textes comme des images (canvas → PNG) plutôt que via le
// moteur de texte natif de jsPDF, qui reste fiable pour les libellés fixes.
function renderTextToImage(text, colorCss, fontSizeMm, weight = 400) {
  const fontPx = fontSizeMm * PX_PER_MM
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const font = `${weight} ${fontPx}px 'Work Sans', Arial, sans-serif`
  ctx.font = font
  const widthPx = Math.max(1, Math.ceil(ctx.measureText(text).width) + fontPx * 0.15)
  const heightPx = Math.ceil(fontPx * 1.35)
  canvas.width = widthPx
  canvas.height = heightPx
  ctx.font = font
  ctx.fillStyle = colorCss
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillText(text, fontPx * 0.05, heightPx / 2)
  return {
    dataUrl: canvas.toDataURL('image/png'),
    widthMm: widthPx / PX_PER_MM,
    heightMm: heightPx / PX_PER_MM,
  }
}

// Place un texte-image sur la page, avec la même sémantique d'ancrage que le
// texte SVG à l'écran (start/middle/end, hanging/middle/auto).
function drawLabel(doc, text, x, y, { align = 'center', baseline = 'middle', color = TEXT_DARK_CSS, fontSizeMm = 3, weight = 400 } = {}) {
  if (!text) return
  const img = renderTextToImage(text, color, fontSizeMm, weight)

  let left = x
  if (align === 'center') left = x - img.widthMm / 2
  else if (align === 'end' || align === 'right') left = x - img.widthMm

  let top = y - img.heightMm / 2
  if (baseline === 'hanging' || baseline === 'top') top = y
  else if (baseline === 'auto' || baseline === 'bottom') top = y - img.heightMm

  doc.addImage(img.dataUrl, 'PNG', left, top, img.widthMm, img.heightMm)
}

// Étendue réelle du diagramme (table + sièges + étiquettes de noms), en
// unités "px" locales centrées sur la table — même logique que TableCanvas,
// pour que rien ne dépasse une fois mis à l'échelle sur la page PDF.
function diagramBounds(table, occupantNameOf) {
  const isRound = table.shape === 'round'
  const geometry = isRound ? roundTableSeats(table) : rectTableSeats(table)

  let minX = -30
  let maxX = 30
  let minY = -30
  let maxY = 30

  if (isRound) {
    minX = Math.min(minX, -geometry.tableRadius)
    maxX = Math.max(maxX, geometry.tableRadius)
    minY = Math.min(minY, -geometry.tableRadius)
    maxY = Math.max(maxY, geometry.tableRadius)
  } else {
    minX = Math.min(minX, -geometry.width / 2)
    maxX = Math.max(maxX, geometry.width / 2)
    minY = Math.min(minY, -geometry.height / 2)
    maxY = Math.max(maxY, geometry.height / 2)
  }

  for (const seat of geometry.seats) {
    minX = Math.min(minX, seat.cx - SEAT_RADIUS)
    maxX = Math.max(maxX, seat.cx + SEAT_RADIUS)
    minY = Math.min(minY, seat.cy - SEAT_RADIUS)
    maxY = Math.max(maxY, seat.cy + SEAT_RADIUS)

    const name = occupantNameOf(seat.index)
    if (!name) continue

    const label = seatLabelPosition(table, seat)
    const textWidth = estimateTextWidth(name)
    if (label.anchor === 'start') {
      maxX = Math.max(maxX, label.x + textWidth)
    } else if (label.anchor === 'end') {
      minX = Math.min(minX, label.x - textWidth)
    } else {
      minX = Math.min(minX, label.x - textWidth / 2)
      maxX = Math.max(maxX, label.x + textWidth / 2)
    }

    if (label.baseline === 'hanging') {
      maxY = Math.max(maxY, label.y + LABEL_LINE_HEIGHT)
    } else if (label.baseline === 'auto') {
      minY = Math.min(minY, label.y - LABEL_LINE_HEIGHT)
    } else {
      minY = Math.min(minY, label.y - LABEL_LINE_HEIGHT / 2)
      maxY = Math.max(maxY, label.y + LABEL_LINE_HEIGHT / 2)
    }
  }

  return { minX, maxX, minY, maxY, geometry, isRound }
}

function occupantNameOfFor(guests, occupantIds) {
  return (seatIndex) => {
    const guestId = occupantIds[seatIndex]
    return guestId ? guestName(guests, guestId) : null
  }
}

function occupantIdsForTable(placement, tableId) {
  const occupantIds = []
  for (const [guestId, p] of Object.entries(placement)) {
    if (p.tableId === tableId) occupantIds[p.seatIndex] = guestId
  }
  return occupantIds
}

// Dessine une table (forme + sièges + noms) à la position et à l'échelle
// données par toPdf/scale — le point commun entre la page détail d'une
// table (échelle calculée pour elle seule) et le plan d'ensemble (échelle
// partagée par toutes les tables, à leurs positions réelles les unes par
// rapport aux autres).
function drawTableAtScale(doc, table, occupantNameOf, toPdf, scale, { nameFontSizeMm, tableFontSizeMm }) {
  const isRound = table.shape === 'round'
  const geometry = isRound ? roundTableSeats(table) : rectTableSeats(table)

  doc.setDrawColor(...SAGE)
  doc.setLineWidth(0.4)
  if (isRound) {
    const c = toPdf(table.x, table.y)
    doc.circle(c.x, c.y, geometry.tableRadius * scale, 'S')
  } else {
    const topLeft = toPdf(table.x - geometry.width / 2, table.y - geometry.height / 2)
    doc.roundedRect(topLeft.x, topLeft.y, geometry.width * scale, geometry.height * scale, 2, 2, 'S')
  }

  const tableLabelPos = toPdf(table.x, table.y)
  drawLabel(doc, table.label, tableLabelPos.x, tableLabelPos.y, {
    align: 'center',
    baseline: 'middle',
    fontSizeMm: tableFontSizeMm,
    weight: 600,
  })

  geometry.seats.forEach((seat) => {
    const name = occupantNameOf(seat.index)
    const p = toPdf(seat.cx, seat.cy)
    const r = Math.max(1.1, SEAT_RADIUS * scale)

    if (name) {
      doc.setFillColor(...GOLD)
      doc.setDrawColor(...GOLD)
    } else {
      doc.setFillColor(255, 255, 255)
      doc.setDrawColor(...BORDER)
    }
    doc.circle(p.x, p.y, r, 'FD')

    if (name) {
      const label = seatLabelPosition(table, seat)
      const lp = toPdf(label.x, label.y)
      const align = label.anchor === 'start' ? 'start' : label.anchor === 'end' ? 'end' : 'center'
      drawLabel(doc, name, lp.x, lp.y, { align, baseline: label.baseline, fontSizeMm: nameFontSizeMm })
    }
  })
}

// Dessine le plan d'une table seule, mis à l'échelle pour tenir dans le
// cadre donné, centré sur (centerX, centerY).
function drawTableDiagram(doc, table, guests, occupantIds, centerX, centerY, maxWidthMm, maxHeightMm) {
  const normTable = { ...table, x: 0, y: 0 }
  const occupantNameOf = occupantNameOfFor(guests, occupantIds)

  const bounds = diagramBounds(normTable, occupantNameOf)
  const spanX = bounds.maxX - bounds.minX
  const spanY = bounds.maxY - bounds.minY
  const scale = Math.min(maxWidthMm / spanX, maxHeightMm / spanY, MAX_SCALE)
  const originX = centerX - ((bounds.minX + bounds.maxX) / 2) * scale
  const originY = centerY - ((bounds.minY + bounds.maxY) / 2) * scale
  const toPdf = (x, y) => ({ x: originX + x * scale, y: originY + y * scale })

  drawTableAtScale(doc, normTable, occupantNameOf, toPdf, scale, { nameFontSizeMm: 2.6, tableFontSizeMm: 3 })
}

// Plan d'ensemble : toutes les tables sur une seule page, à leurs positions
// réelles les unes par rapport aux autres (mêmes coordonnées que la "vue
// d'ensemble" à l'écran), mises à l'échelle pour tenir sur une page paysage.
function drawFullPlan(doc, guests, tables, placement) {
  const occupantNameOfByTable = new Map()
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  for (const table of tables) {
    const occupantNameOf = occupantNameOfFor(guests, occupantIdsForTable(placement, table.id))
    occupantNameOfByTable.set(table.id, occupantNameOf)
    const bounds = diagramBounds(table, occupantNameOf)
    minX = Math.min(minX, bounds.minX)
    maxX = Math.max(maxX, bounds.maxX)
    minY = Math.min(minY, bounds.minY)
    maxY = Math.max(maxY, bounds.maxY)
  }

  const marginX = 14
  const topMargin = 32
  const bottomMargin = 14
  const availableWidth = doc.internal.pageSize.getWidth() - marginX * 2
  const availableHeight = doc.internal.pageSize.getHeight() - topMargin - bottomMargin

  const spanX = maxX - minX
  const spanY = maxY - minY
  const scale = Math.min(availableWidth / spanX, availableHeight / spanY, MAX_SCALE)
  const originX = marginX + (availableWidth - spanX * scale) / 2 - minX * scale
  const originY = topMargin + (availableHeight - spanY * scale) / 2 - minY * scale
  const toPdf = (x, y) => ({ x: originX + x * scale, y: originY + y * scale })

  for (const table of tables) {
    drawTableAtScale(doc, table, occupantNameOfByTable.get(table.id), toPdf, scale, {
      nameFontSizeMm: 2,
      tableFontSizeMm: 2.6,
    })
  }
}

export function exportTablePlanPdf(project) {
  const { name, guests, tables, placement } = project
  const title = name || 'Plan de table'
  const doc = new jsPDF({ orientation: tables.length > 0 ? 'landscape' : 'portrait' })

  if (tables.length === 0) {
    drawLabel(doc, title, 14, 14, { align: 'start', baseline: 'top', fontSizeMm: 6, weight: 600 })
    drawLabel(doc, 'Aucune table créée.', 14, 30, { align: 'start', baseline: 'top', fontSizeMm: 4 })
    doc.save(safeFileName(title, 'plan-de-table'))
    return
  }

  drawLabel(doc, title, 14, 14, { align: 'start', baseline: 'top', fontSizeMm: 6, weight: 600 })
  drawLabel(doc, "Plan d'ensemble", 14, 25, {
    align: 'start',
    baseline: 'top',
    fontSizeMm: 3.6,
    weight: 500,
    color: SAGE_CSS,
  })
  drawFullPlan(doc, guests, tables, placement)

  tables.forEach((table) => {
    doc.addPage('a4', 'portrait')
    drawLabel(doc, title, 14, 14, { align: 'start', baseline: 'top', fontSizeMm: 6, weight: 600 })
    drawLabel(doc, table.label, 14, 27, { align: 'start', baseline: 'top', fontSizeMm: 4.5, weight: 600 })
    doc.setFontSize(10)
    doc.setTextColor(110, 100, 85)
    doc.text(
      `${table.shape === 'round' ? 'Table ronde' : 'Table rectangulaire'} — ${table.capacity} place(s)`,
      14,
      37,
    )

    drawTableDiagram(doc, table, guests, occupantIdsForTable(placement, table.id), 105, 150, 170, 210)
  })

  doc.save(safeFileName(title, 'plan-de-table'))
}

export function exportGuestListPdf(project) {
  const { name, guests, tables, placement } = project
  const doc = new jsPDF()
  const title = name || 'Liste des invités'

  drawLabel(doc, title, 14, 14, { align: 'start', baseline: 'top', fontSizeMm: 6, weight: 600 })

  if (guests.length === 0) {
    doc.setFontSize(11)
    doc.text('Aucun invité.', 14, 32)
    doc.save(safeFileName(title, 'liste-invites'))
    return
  }

  const sorted = [...guests].sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  let y = 30
  sorted.forEach((guest) => {
    const p = placement[guest.id]
    const table = p ? tables.find((t) => t.id === p.tableId) : null
    const tableLabel = table ? table.label : 'Non placé'
    if (y > 280) {
      doc.addPage()
      y = 20
    }
    drawLabel(doc, `${guest.name} — ${tableLabel}`, 14, y, { align: 'start', baseline: 'top', fontSizeMm: 3.6 })
    y += 8
  })

  doc.save(safeFileName(title, 'liste-invites'))
}

const CARD_MARGIN_MM = 10
const CARD_GAP_MM = 5
const CARD_COLS = 2
const CARD_ROWS = 4

// Une carte de nom par invité placé (nom + table), en grille prête à
// découper — le complément physique du plan de table pour le jour J.
export function exportPlaceCardsPdf(project) {
  const { guests, tables, placement } = project
  const doc = new jsPDF()

  const seated = guests
    .filter((g) => placement[g.id])
    .map((g) => ({ guest: g, table: tables.find((t) => t.id === placement[g.id].tableId) }))
    .sort((a, b) => a.guest.name.localeCompare(b.guest.name, 'fr'))

  if (seated.length === 0) {
    drawLabel(doc, "Aucun invité placé pour l'instant.", 14, 20, {
      align: 'start',
      baseline: 'top',
      fontSizeMm: 4,
    })
    doc.save('marque-places.pdf')
    return
  }

  const pageWidth = 210
  const pageHeight = 297
  const usableWidth = pageWidth - CARD_MARGIN_MM * 2
  const usableHeight = pageHeight - CARD_MARGIN_MM * 2
  const cardWidth = (usableWidth - CARD_GAP_MM * (CARD_COLS - 1)) / CARD_COLS
  const cardHeight = (usableHeight - CARD_GAP_MM * (CARD_ROWS - 1)) / CARD_ROWS
  const perPage = CARD_COLS * CARD_ROWS

  seated.forEach((item, index) => {
    const posInPage = index % perPage
    if (index > 0 && posInPage === 0) doc.addPage()

    const col = posInPage % CARD_COLS
    const row = Math.floor(posInPage / CARD_COLS)
    const x = CARD_MARGIN_MM + col * (cardWidth + CARD_GAP_MM)
    const y = CARD_MARGIN_MM + row * (cardHeight + CARD_GAP_MM)
    const cx = x + cardWidth / 2
    const cy = y + cardHeight / 2

    doc.setDrawColor(...BORDER)
    doc.setLineWidth(0.25)
    doc.setLineDashPattern([1.5, 1.5], 0)
    doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'S')
    doc.setLineDashPattern([], 0)

    drawLabel(doc, item.guest.name, cx, cy - 3, {
      align: 'center',
      baseline: 'middle',
      fontSizeMm: 5.5,
      weight: 500,
    })

    doc.setDrawColor(...GOLD)
    doc.setLineWidth(0.3)
    doc.line(cx - 14, cy + 5, cx + 14, cy + 5)

    if (item.table) {
      drawLabel(doc, item.table.label, cx, cy + 12, {
        align: 'center',
        baseline: 'middle',
        fontSizeMm: 3.2,
        color: SAGE_CSS,
      })
    }
  })

  doc.save('marque-places.pdf')
}
