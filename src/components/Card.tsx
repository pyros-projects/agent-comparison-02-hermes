import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  eyebrow?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ title, eyebrow, actions, children, className }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-slate-900/30 backdrop-blur-xl shadow-soft ${className ?? ''}`}
    >
      {(title || actions || eyebrow) && (
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <div>
            {eyebrow && <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{eyebrow}</p>}
            {title && <h3 className="mt-1 text-lg font-semibold text-slate-50">{title}</h3>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-3 text-sm text-slate-300">{actions}</div>}
        </div>
      )}
      <div className="p-5 pt-3 text-slate-200">{children}</div>
    </div>
  )
}
