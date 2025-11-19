interface ChipProps {
  label: string
  tone?: 'emerald' | 'amber' | 'cyan'
}

export function Chip({ label, tone = 'emerald' }: ChipProps) {
  const toneClass =
    tone === 'amber'
      ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
      : tone === 'cyan'
        ? 'bg-cyan-500/20 text-cyan-100 border-cyan-500/40'
        : 'bg-emerald-500/20 text-emerald-100 border-emerald-500/40'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${toneClass}`}>
      {label}
    </span>
  )
}
