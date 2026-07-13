export function describeConstraint(constraint, guests, tables) {
  const nameOf = (id) => guests.find((g) => g.id === id)?.name ?? '?'
  const tableOf = (id) => tables.find((t) => t.id === id)?.label ?? '?'
  const subject = constraint.label ?? constraint.guestIds.map(nameOf).join(' et ')

  switch (constraint.type) {
    case 'together':
      return `${subject} doivent être côte à côte`
    case 'apart':
      return `${subject} ne doivent pas être côte à côte`
    case 'nearTable':
      return `${subject} doit être près de "${tableOf(constraint.tableId)}"`
    case 'farFromTable':
      return `${subject} doit être loin de "${tableOf(constraint.tableId)}"`
    default:
      return ''
  }
}
