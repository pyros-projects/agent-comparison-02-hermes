import type { ChangeEvent } from 'react'

interface SliderProps {
  label: string
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
  suffix?: string
}

export function Slider({ label, min, max, step = 1, value, onChange, suffix }: SliderProps) {
  const handle = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value))
  }

  return (
    <label className="block space-y-2 text-sm text-slate-200">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.12em] text-slate-400">
        <span>{label}</span>
        <span className="text-white">{value}{suffix ?? ''}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handle}
        className="h-2 w-full rounded-full bg-slate-800 accent-emerald-300"
      />
    </label>
  )
}
