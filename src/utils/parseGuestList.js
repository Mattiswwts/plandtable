const LIST_MARKER = /^\s*(?:\d+\s*[.),-]|[-*•])\s*/

// Tolère les listes copiées depuis Excel/WhatsApp : une ligne par invité,
// avec numérotation ("1.", "2)", "3,") ou puces ("-", "*", "•"). La virgule
// n'est pas utilisée comme séparateur de noms : beaucoup de listes de mariage
// utilisent le format "Nom, Prénom" par ligne, qu'il ne faut pas fragmenter.
export function parseGuestList(text) {
  if (!text) return []
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(LIST_MARKER, ''))
    .map((name) => name.trim().replace(/^["']|["']$/g, '').trim())
    .filter(Boolean)
}
