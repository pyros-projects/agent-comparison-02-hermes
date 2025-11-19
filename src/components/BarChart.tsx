interface BarChartProps {
  items: { label: string; value: number; secondary?: string }[]
  color?: string
}

export function BarChart({ items, color = 'bg-emerald-300' }: BarChartProps) {
  if (!items.length) return <p className="text-sm text-slate-400">No data for this context yet.</p>

  const max = Math.max(...items.map((i) => i.value), 1)

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex items-baseline justify-between text-sm text-slate-300">
            <span className="font-medium text-slate-50">{item.label}</span>
            <span className="text-xs text-slate-400">{(item.value * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full ${color}`}
              style={{ width: `${(item.value / max) * 100}%`, boxShadow: '0 0 12px rgba(124,242,212,0.45)' }}
            />
          </div>
          {item.secondary && <p className="text-xs text-slate-500">{item.secondary}</p>}
        </div>
      ))}
    </div>
  )
}
