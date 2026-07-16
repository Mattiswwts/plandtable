const SEATS = 10
const FILLED_INDEXES = new Set([0, 1, 3, 4, 6, 8])

function seatPoint(index, radius, cx, cy) {
  const angle = (index / SEATS) * Math.PI * 2 - Math.PI / 2
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  }
}

function HeroDiagram() {
  const cx = 210
  const cy = 210
  const tableR = 96
  const seatOrbit = 150
  const outerOrbit = 196

  return (
    <svg
      className="hero-diagram"
      viewBox="0 0 420 420"
      width="420"
      height="420"
      aria-hidden="true"
    >
      <circle cx={cx} cy={cy} r={outerOrbit} className="hd-outer-ring" />
      <circle cx={cx} cy={cy} r={tableR} className="hd-table" />

      {Array.from({ length: SEATS }).map((_, i) => {
        const p = seatPoint(i, seatOrbit, cx, cy)
        const filled = FILLED_INDEXES.has(i)
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={filled ? 11 : 8}
            className={filled ? 'hd-seat hd-seat-filled' : 'hd-seat'}
          />
        )
      })}

      <circle cx={cx + 150} cy={cy - 150} r="3" className="hd-dot" />
      <circle cx={cx - 168} cy={cy + 40} r="2.4" className="hd-dot" />
      <circle cx={cx + 120} cy={cy + 160} r="2.6" className="hd-dot" />
      <circle cx={cx - 100} cy={cy - 140} r="2" className="hd-dot" />
    </svg>
  )
}

export default HeroDiagram
