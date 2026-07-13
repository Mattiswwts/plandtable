export const SEAT_RADIUS = 10
// Espace réservé au nom complet affiché à l'extérieur de chaque siège, pour
// l'espacement automatique entre tables (évite qu'un nom d'une table ne
// vienne chevaucher les noms d'une table voisine placée automatiquement).
// Calé large (~23 caractères) : les tables ne connaissent pas encore les
// invités qui y seront assis au moment où elles sont positionnées.
export const NAME_LABEL_SPACE = 130

export function roundTableSeats(table) {
  const tableRadius = 34 + table.capacity * 4
  const seatOrbit = tableRadius + SEAT_RADIUS + 6
  const seats = []
  for (let i = 0; i < table.capacity; i++) {
    const angle = (i / table.capacity) * Math.PI * 2 - Math.PI / 2
    seats.push({
      index: i,
      cx: table.x + Math.cos(angle) * seatOrbit,
      cy: table.y + Math.sin(angle) * seatOrbit,
    })
  }
  return { tableRadius, seats }
}

export function rectTableSize(table) {
  const width = Math.max(140, Math.ceil(table.capacity / 2) * 46)
  const height = 70
  return { width, height }
}

export function rectTableSeats(table) {
  const { width, height } = rectTableSize(table)
  const top = Math.ceil(table.capacity / 2)
  const bottom = table.capacity - top
  const seats = []
  const left = table.x - width / 2
  for (let i = 0; i < top; i++) {
    const t = top === 1 ? 0.5 : i / (top - 1)
    seats.push({
      index: i,
      cx: left + t * width,
      cy: table.y - height / 2 - SEAT_RADIUS - 6,
    })
  }
  for (let i = 0; i < bottom; i++) {
    const t = bottom === 1 ? 0.5 : i / (bottom - 1)
    seats.push({
      index: top + i,
      cx: left + t * width,
      cy: table.y + height / 2 + SEAT_RADIUS + 6,
    })
  }
  return { width, height, seats }
}

// Deux sièges sont "voisins" s'ils sont physiquement côte à côte : autour du
// cercle pour une table ronde, dans la même rangée pour une table rectangulaire
// (une rangée face à l'autre n'est pas considérée comme voisine).
export function areSeatsAdjacent(table, seatIndexA, seatIndexB) {
  if (seatIndexA === seatIndexB) return false
  if (table.shape === 'round') {
    const diff = Math.abs(seatIndexA - seatIndexB)
    return diff === 1 || diff === table.capacity - 1
  }
  const top = Math.ceil(table.capacity / 2)
  const sameRow = seatIndexA < top === seatIndexB < top
  return sameRow && Math.abs(seatIndexA - seatIndexB) === 1
}

// Rayon du cercle englobant la table et ses sièges, centré sur (table.x, table.y).
// Sert à la fois à dimensionner le viewBox du plan et à espacer les tables
// entre elles sans qu'elles ne se chevauchent.
export function tableFootprint(table) {
  if (table.shape === 'round') {
    const { tableRadius } = roundTableSeats(table)
    return tableRadius + SEAT_RADIUS + NAME_LABEL_SPACE
  }
  const { width, height } = rectTableSize(table)
  return Math.max(width, height) / 2 + SEAT_RADIUS + NAME_LABEL_SPACE
}

// Estimation grossière (sans mesure DOM réelle) de la largeur d'un texte,
// pour dimensionner le plan sans que les noms longs ne débordent du canvas.
export function estimateTextWidth(text, fontSize = 12) {
  return text.length * fontSize * 0.56
}

// Position et alignement du nom complet d'un invité, radialement à
// l'extérieur de son siège (donc toujours plus loin de la table que le
// siège lui-même : ne peut jamais chevaucher la table).
export function seatLabelPosition(table, seat) {
  const dx = seat.cx - table.x
  const dy = seat.cy - table.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const gap = SEAT_RADIUS + 8

  return {
    x: seat.cx + ux * gap,
    y: seat.cy + uy * gap,
    anchor: ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle',
    baseline: uy > 0.35 ? 'hanging' : uy < -0.35 ? 'auto' : 'middle',
  }
}
