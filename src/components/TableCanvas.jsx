import { useRef, useState } from 'react'
import {
  SEAT_RADIUS,
  roundTableSeats,
  rectTableSeats,
  tableFootprint,
  seatLabelPosition,
  seatHitArea,
  estimateTextWidth,
  LABEL_LINE_HEIGHT,
} from '../utils/tableGeometry'

function TableCanvas({
  tables,
  guests,
  placement,
  locked,
  onRequestUnlock,
  onMoveGuestToSeat,
  onUnseatGuest,
  onMoveTable,
}) {
  const svgRef = useRef(null)
  const [selectedGuestId, setSelectedGuestId] = useState(null)
  const [dragTable, setDragTable] = useState(null) // { id, x, y }

  const guestById = new Map(guests.map((g) => [g.id, g]))
  const seatOccupant = new Map()
  for (const [guestId, p] of Object.entries(placement)) {
    seatOccupant.set(`${p.tableId}:${p.seatIndex}`, guestId)
  }
  const unseatedGuests = guests.filter((g) => !placement[g.id])
  const selectedGuest = selectedGuestId ? guestById.get(selectedGuestId) : null
  const selectedIsSeated = Boolean(selectedGuestId && placement[selectedGuestId])

  function handlePoolChipClick(guestId) {
    if (locked) {
      onRequestUnlock()
      return
    }
    setSelectedGuestId((current) => (current === guestId ? null : guestId))
  }

  function handleSeatClick(tableId, seatIndex) {
    if (locked) {
      onRequestUnlock()
      return
    }
    const occupantId = seatOccupant.get(`${tableId}:${seatIndex}`)

    if (!selectedGuestId) {
      if (occupantId) setSelectedGuestId(occupantId)
      return
    }

    if (selectedGuestId === occupantId) {
      setSelectedGuestId(null)
      return
    }

    onMoveGuestToSeat(selectedGuestId, tableId, seatIndex)
    setSelectedGuestId(null)
  }

  function handlePoolDrop() {
    if (locked) {
      onRequestUnlock()
      return
    }
    if (selectedIsSeated) {
      onUnseatGuest(selectedGuestId)
    }
    setSelectedGuestId(null)
  }

  function toSvgPoint(clientX, clientY) {
    const svg = svgRef.current
    const ctm = svg.getScreenCTM()
    if (!ctm) return { x: clientX, y: clientY }
    const point = svg.createSVGPoint()
    point.x = clientX
    point.y = clientY
    const transformed = point.matrixTransform(ctm.inverse())
    return { x: transformed.x, y: transformed.y }
  }

  function handleTablePointerDown(e, table) {
    if (locked) {
      onRequestUnlock()
      return
    }
    e.stopPropagation()
    e.preventDefault()

    const start = toSvgPoint(e.clientX, e.clientY)
    const offsetX = table.x - start.x
    const offsetY = table.y - start.y
    setDragTable({ id: table.id, x: table.x, y: table.y })

    function handleMove(moveEvent) {
      const p = toSvgPoint(moveEvent.clientX, moveEvent.clientY)
      setDragTable({ id: table.id, x: p.x + offsetX, y: p.y + offsetY })
    }

    function handleUp(upEvent) {
      const p = toSvgPoint(upEvent.clientX, upEvent.clientY)
      onMoveTable(table.id, p.x + offsetX, p.y + offsetY)
      setDragTable(null)
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  const displayTables = tables.map((t) =>
    dragTable && dragTable.id === t.id ? { ...t, x: dragTable.x, y: dragTable.y } : t,
  )

  // Géométrie calculée une seule fois par table, réutilisée pour le rendu
  // et pour calculer les limites réelles du plan (les noms longs peuvent
  // dépasser le rayon "standard" de la table : il ne faut jamais les couper).
  const tableRenders = displayTables.map((table) => {
    const isRound = table.shape === 'round'
    const geometry = isRound ? roundTableSeats(table) : rectTableSeats(table)
    return { table, isRound, ...geometry }
  })

  let minX = 0
  let minY = 0
  let maxX = 300
  let maxY = 260

  for (const { table, seats } of tableRenders) {
    const footprint = tableFootprint(table)
    minX = Math.min(minX, table.x - footprint)
    minY = Math.min(minY, table.y - footprint)
    maxX = Math.max(maxX, table.x + footprint)
    maxY = Math.max(maxY, table.y + footprint)

    for (const seat of seats) {
      const occupantId = seatOccupant.get(`${table.id}:${seat.index}`)
      const occupant = occupantId ? guestById.get(occupantId) : null
      if (!occupant) continue

      const label = seatLabelPosition(table, seat)
      const textWidth = estimateTextWidth(occupant.name)

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
  }

  const viewWidth = maxX - minX
  const viewHeight = maxY - minY

  let hint = "Faites glisser une table pour la repositionner. Touchez un invité pour le sélectionner, puis touchez un siège pour l'y placer."
  if (locked) {
    hint = 'Plan généré. Débloquez plandtable pour ajuster le placement.'
  } else if (selectedIsSeated) {
    hint = `${selectedGuest.name} sélectionné(e) : touchez un autre siège pour échanger, ou touchez la zone ci-dessous pour libérer sa place.`
  } else if (selectedGuest) {
    hint = `${selectedGuest.name} sélectionné(e) : touchez un siège pour l'y placer.`
  }

  return (
    <section className={`panel canvas-panel${locked ? ' locked' : ''}`}>
      <h2>Plan de table</h2>
      <p className="hint">{hint}</p>

      <div
        className={`guest-pool${selectedIsSeated ? ' droppable' : ''}`}
        onClick={handlePoolDrop}
      >
        {unseatedGuests.length === 0 && !selectedIsSeated ? (
          <span className="empty-hint">Tous les invités sont placés.</span>
        ) : (
          unseatedGuests.map((g) => (
            <button
              type="button"
              key={g.id}
              className={`guest-chip${selectedGuestId === g.id ? ' selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                handlePoolChipClick(g.id)
              }}
            >
              {g.name}
            </button>
          ))
        )}
        {selectedIsSeated && (
          <span className="empty-hint">Touchez ici pour libérer la place de {selectedGuest.name}</span>
        )}
      </div>

      <div className="svg-scroll">
        <svg
          ref={svgRef}
          viewBox={`${minX} ${minY} ${viewWidth} ${viewHeight}`}
          width={viewWidth}
          height={viewHeight}
          role="img"
          aria-label="Plan de table"
        >
          {tableRenders.map(({ table, seats, tableRadius, width, height }) => {
            const isRound = table.shape === 'round'
            return (
              <g key={table.id}>
                {isRound ? (
                  <circle
                    cx={table.x}
                    cy={table.y}
                    r={tableRadius}
                    className="table-shape"
                    onPointerDown={(e) => handleTablePointerDown(e, table)}
                  />
                ) : (
                  <rect
                    x={table.x - width / 2}
                    y={table.y - height / 2}
                    width={width}
                    height={height}
                    rx={8}
                    className="table-shape"
                    onPointerDown={(e) => handleTablePointerDown(e, table)}
                  />
                )}
                <text
                  x={table.x}
                  y={table.y}
                  className="table-label"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  pointerEvents="none"
                >
                  {table.label}
                </text>
                {seats.map((seat) => {
                  const occupantId = seatOccupant.get(`${table.id}:${seat.index}`)
                  const occupant = occupantId ? guestById.get(occupantId) : null
                  const label = seatLabelPosition(table, seat)
                  const hitArea = occupant ? seatHitArea(table, seat, occupant.name) : null
                  return (
                    <g
                      key={seat.index}
                      transform={`translate(${seat.cx}, ${seat.cy})`}
                      className={`seat${occupant ? ' occupied' : ''}${selectedGuestId === occupantId ? ' selected' : ''}`}
                      onClick={() => handleSeatClick(table.id, seat.index)}
                    >
                      {hitArea && (
                        <rect
                          x={hitArea.x}
                          y={hitArea.y}
                          width={hitArea.width}
                          height={hitArea.height}
                          fill="transparent"
                        />
                      )}
                      <circle r={SEAT_RADIUS} />
                      {occupant && (
                        <text
                          x={label.x - seat.cx}
                          y={label.y - seat.cy}
                          textAnchor={label.anchor}
                          dominantBaseline={label.baseline}
                          className="seat-name"
                        >
                          {occupant.name}
                        </text>
                      )}
                    </g>
                  )
                })}
              </g>
            )
          })}
        </svg>
      </div>
    </section>
  )
}

export default TableCanvas
