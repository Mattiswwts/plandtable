export function describeConstraint(constraint, guests, tables) {
  const nameOf = (id) => guests.find((g) => g.id === id)?.name ?? '?'
  const tableOf = (id) => tables.find((t) => t.id === id)?.label ?? '?'
  const isGroup = Boolean(constraint.label)
  const subject = constraint.label ?? constraint.guestIds.map(nameOf).join(' et ')
  const etre = isGroup ? 'doit être' : 'doivent être'
  const neEtrePas = isGroup ? 'ne doit pas être' : 'ne doivent pas être'

  switch (constraint.type) {
    case 'together':
      return `${subject} ${etre} côte à côte`
    case 'apart':
      return `${subject} ${neEtrePas} côte à côte`
    case 'nearTable':
      return `${subject} ${etre} près de "${tableOf(constraint.tableId)}"`
    case 'farFromTable':
      return `${subject} ${etre} loin de "${tableOf(constraint.tableId)}"`
    default:
      return ''
  }
}
