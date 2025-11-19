interface StatProps {
  label: string
  value: string | number
  hint?: string
}

export function Stat({ label, value, hint }: StatProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-200">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-50">{value}</p>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}
