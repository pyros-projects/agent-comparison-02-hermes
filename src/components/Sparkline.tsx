interface SparklineProps {
  values: number[]
  height?: number
  stroke?: string
}

export function Sparkline({ values, height = 80, stroke = '#7cf2d4' }: SparklineProps) {
  if (!values.length) return <div className="h-[80px]" />

  const width = Math.max(200, values.length * 20)
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const span = max - min || 1

  const points = values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * (width - 20) + 10
      const y = height - ((v - min) / span) * (height - 20) - 10
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Sparkline chart">
      <defs>
        <linearGradient id="sparkGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.9" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" points={points} />
      <polyline
        points={`${points} ${width - 10},${height - 10} 10,${height - 10}`}
        fill="url(#sparkGradient)"
        stroke="none"
        opacity="0.25"
      />
    </svg>
  )
}
