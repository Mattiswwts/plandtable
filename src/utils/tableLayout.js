import { tableFootprint } from './tableGeometry'

const GAP = 40
const MAX_ROW_WIDTH = 900
const MARGIN = 40

// Trouve une position pour une nouvelle table qui ne chevauche aucune table
// existante, en balayant une grille ligne par ligne. Les tables existantes
// gardent leur position réelle (potentiellement déplacée à la main par
// l'utilisateur) : seule la nouvelle table est placée automatiquement.
export function findFreeTablePosition(existingTables, newTable) {
  const footprint = tableFootprint(newTable)
  let x = footprint + MARGIN
  let y = footprint + MARGIN
  let rowMaxFootprint = footprint

  for (let attempt = 0; attempt < 300; attempt++) {
    const overlaps = existingTables.some((t) => {
      const dist = Math.hypot(t.x - x, t.y - y)
      return dist < tableFootprint(t) + footprint + GAP
    })
    if (!overlaps) return { x, y }

    x += footprint * 2 + GAP
    if (x > MAX_ROW_WIDTH) {
      x = footprint + MARGIN
      y += rowMaxFootprint * 2 + GAP
      rowMaxFootprint = footprint
    }
  }

  return { x, y }
}
