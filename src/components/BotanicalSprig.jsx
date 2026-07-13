const LEAF = 'M0,0 Q12,-8 24,0 Q12,8 0,0 Z'

const LEAVES = [
  { x: 14, y: 190, angle: -55, scale: 1.05 },
  { x: 27, y: 154, angle: 45, scale: 0.95 },
  { x: 17, y: 119, angle: -50, scale: 0.9 },
  { x: 33, y: 84, angle: 48, scale: 0.8 },
  { x: 44, y: 52, angle: -42, scale: 0.62 },
]

function BotanicalSprig({ className = '', mirrored = false }) {
  return (
    <svg
      className={`botanical-sprig ${className}`}
      viewBox="0 0 100 220"
      width="100"
      height="220"
      aria-hidden="true"
      style={mirrored ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M10,210 C30,160 20,100 55,20" className="sprig-stem" />
      {LEAVES.map((leaf, i) => (
        <path
          key={i}
          d={LEAF}
          className="sprig-leaf"
          transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.angle}) scale(${leaf.scale})`}
        />
      ))}
      <circle cx="52" cy="24" r="4" className="sprig-bud" />
    </svg>
  )
}

export default BotanicalSprig
