import { areSeatsAdjacent } from './tableGeometry'

// Distances utilisées pour juger si une table est "proche" ou "loin" d'une
// autre, basées sur la position réelle des tables sur le plan (table.x/y,
// que l'utilisateur peut déplacer à la main) — l'écart type entre deux
// tables voisines est de l'ordre de 250-350 selon leur capacité.
const NEAR_WEIGHT = 0.02
const NEAR_THRESHOLD = 260
const FAR_WEIGHT = 0.02
const FAR_SAFE_DISTANCE = 260

const TOGETHER_DIFFERENT_TABLE_PENALTY = 10
const TOGETHER_NOT_ADJACENT_PENALTY = 4
const APART_ADJACENT_PENALTY = 10

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildInitialSeats(guests, tables) {
  const seats = new Map(tables.map((t) => [t.id, []]))
  const shuffledGuests = shuffle(guests)
  const shuffledTables = shuffle(tables)
  let cursor = 0
  for (const guest of shuffledGuests) {
    let placed = false
    for (let attempt = 0; attempt < shuffledTables.length; attempt++) {
      const table = shuffledTables[cursor % shuffledTables.length]
      cursor++
      const list = seats.get(table.id)
      if (list.length < table.capacity) {
        list.push(guest.id)
        placed = true
        break
      }
    }
    if (!placed) continue // plus de place disponible : l'invité reste non placé
  }
  return seats
}

function cloneSeats(seats) {
  const clone = new Map()
  for (const [tableId, guestIds] of seats) clone.set(tableId, [...guestIds])
  return clone
}

function buildGuestSeatMap(seats) {
  const map = new Map()
  for (const [tableId, guestIds] of seats) {
    guestIds.forEach((guestId, seatIndex) => map.set(guestId, { tableId, seatIndex }))
  }
  return map
}

function tableDistance(tableIdA, tableIdB, tablePositions) {
  if (tableIdA === tableIdB) return 0
  const a = tablePositions.get(tableIdA)
  const b = tablePositions.get(tableIdB)
  if (!a || !b) return Infinity
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function computeCost(seats, tables, constraints, tablePositions) {
  const guestSeat = buildGuestSeatMap(seats)
  const tableById = new Map(tables.map((t) => [t.id, t]))
  let cost = 0
  const violated = new Set()

  for (const c of constraints) {
    if (c.type === 'together') {
      for (let i = 0; i < c.guestIds.length; i++) {
        for (let j = i + 1; j < c.guestIds.length; j++) {
          const a = guestSeat.get(c.guestIds[i])
          const b = guestSeat.get(c.guestIds[j])
          if (!a || !b || a.tableId !== b.tableId) {
            cost += TOGETHER_DIFFERENT_TABLE_PENALTY
            violated.add(c)
          } else if (!areSeatsAdjacent(tableById.get(a.tableId), a.seatIndex, b.seatIndex)) {
            cost += TOGETHER_NOT_ADJACENT_PENALTY
            violated.add(c)
          }
        }
      }
    } else if (c.type === 'apart') {
      for (let i = 0; i < c.guestIds.length; i++) {
        for (let j = i + 1; j < c.guestIds.length; j++) {
          const a = guestSeat.get(c.guestIds[i])
          const b = guestSeat.get(c.guestIds[j])
          if (
            a &&
            b &&
            a.tableId === b.tableId &&
            areSeatsAdjacent(tableById.get(a.tableId), a.seatIndex, b.seatIndex)
          ) {
            cost += APART_ADJACENT_PENALTY
            violated.add(c)
          }
        }
      }
    } else if (c.type === 'nearTable') {
      // guestIds peut contenir plusieurs invités (contrainte de groupe par tag) :
      // chacun est jugé indépendamment par rapport à la table ciblée.
      for (const guestId of c.guestIds) {
        const a = guestSeat.get(guestId)
        const dist = a ? tableDistance(a.tableId, c.tableId, tablePositions) : Infinity
        cost += Number.isFinite(dist) ? dist * NEAR_WEIGHT : 10
        if (!Number.isFinite(dist) || dist > NEAR_THRESHOLD) violated.add(c)
      }
    } else if (c.type === 'farFromTable') {
      for (const guestId of c.guestIds) {
        const a = guestSeat.get(guestId)
        const dist = a ? tableDistance(a.tableId, c.tableId, tablePositions) : Infinity
        if (Number.isFinite(dist)) {
          cost += Math.max(0, FAR_SAFE_DISTANCE - dist) * FAR_WEIGHT
          if (dist < FAR_SAFE_DISTANCE) violated.add(c)
        }
      }
    }
  }

  if (tables.length > 0) {
    const totalPlaced = tables.reduce((s, t) => s + seats.get(t.id).length, 0)
    const average = totalPlaced / tables.length
    for (const t of tables) {
      cost += Math.abs(seats.get(t.id).length - average)
    }
  }

  return { cost, violated }
}

function mutate(seats, tables) {
  const tableIds = [...seats.keys()]
  if (tableIds.length === 0) return

  const move = Math.random()

  if (move < 1 / 3 && tableIds.length >= 2) {
    // échange deux invités entre deux tables différentes
    const t1 = tableIds[Math.floor(Math.random() * tableIds.length)]
    const t2 = tableIds[Math.floor(Math.random() * tableIds.length)]
    if (t1 === t2) return
    const list1 = seats.get(t1)
    const list2 = seats.get(t2)
    if (list1.length === 0 || list2.length === 0) return
    const i1 = Math.floor(Math.random() * list1.length)
    const i2 = Math.floor(Math.random() * list2.length)
    const tmp = list1[i1]
    list1[i1] = list2[i2]
    list2[i2] = tmp
  } else if (move < 2 / 3) {
    // échange deux sièges au sein d'une même table (change qui est à côté de qui)
    const tableId = tableIds[Math.floor(Math.random() * tableIds.length)]
    const list = seats.get(tableId)
    if (list.length < 2) return
    const i1 = Math.floor(Math.random() * list.length)
    const i2 = Math.floor(Math.random() * list.length)
    if (i1 === i2) return
    const tmp = list[i1]
    list[i1] = list[i2]
    list[i2] = tmp
  } else if (tableIds.length >= 2) {
    // déplace un invité vers une table qui a de la place (aide à équilibrer)
    const sourceId = tableIds[Math.floor(Math.random() * tableIds.length)]
    const sourceList = seats.get(sourceId)
    if (sourceList.length === 0) return
    const destId = tableIds[Math.floor(Math.random() * tableIds.length)]
    if (destId === sourceId) return
    const destTable = tables.find((t) => t.id === destId)
    const destList = seats.get(destId)
    if (destList.length >= destTable.capacity) return
    const idx = Math.floor(Math.random() * sourceList.length)
    const [guestId] = sourceList.splice(idx, 1)
    destList.push(guestId)
  }
}

export function solvePlacement(project, { iterations = 4000 } = {}) {
  const { guests, tables, constraints } = project

  if (guests.length === 0 || tables.length === 0) {
    return { placement: {}, unsatisfied: [], unseated: guests.map((g) => g.id) }
  }

  const tablePositions = new Map(tables.map((t) => [t.id, { x: t.x, y: t.y }]))

  let seats = buildInitialSeats(guests, tables)
  let { cost } = computeCost(seats, tables, constraints, tablePositions)

  const T0 = 20
  for (let i = 0; i < iterations; i++) {
    const temperature = T0 * (1 - i / iterations)
    const next = cloneSeats(seats)
    mutate(next, tables)
    const { cost: nextCost } = computeCost(next, tables, constraints, tablePositions)
    const delta = nextCost - cost
    if (delta < 0 || Math.random() < Math.exp(-delta / Math.max(temperature, 0.01))) {
      seats = next
      cost = nextCost
    }
  }

  const { violated } = computeCost(seats, tables, constraints, tablePositions)

  const placement = {}
  for (const [tableId, guestIds] of seats) {
    guestIds.forEach((guestId, seatIndex) => {
      placement[guestId] = { tableId, seatIndex }
    })
  }

  const seatedIds = new Set(Object.keys(placement))
  const unseated = guests.filter((g) => !seatedIds.has(g.id)).map((g) => g.id)

  return { placement, unsatisfied: [...violated], unseated }
}
