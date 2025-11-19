import './index.css'
import { Landing } from './sections/Landing'
import { NGramLab } from './sections/NGramLab'
import { GeneticLab } from './sections/GeneticLab'
import { SamplingLab } from './sections/SamplingLab'
import { useScrollSpy } from './hooks/useScrollSpy'

const sections = [
  { id: 'top', label: 'Home' },
  { id: 'ngram', label: 'N-gram Lab' },
  { id: 'ga', label: 'Genetic Lab' },
  { id: 'mystery', label: 'Sampling Lab' },
]

function App() {
  const active = useScrollSpy(sections.map((s) => s.id))

  return (
    <div className="min-h-screen bg-mist text-slate-100">
      <div className="sticky top-0 z-20 border-b border-white/5 bg-slate-900/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-amber-300" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Playground</p>
              <p className="font-display text-lg text-white">Early Text Generators</p>
            </div>
          </div>
          <nav className="hidden items-center gap-4 text-sm text-slate-200 md:flex">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`rounded-full px-3 py-2 ${active === section.id ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
              >
                {section.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Interactive labs
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <Landing />
        <NGramLab />
        <GeneticLab />
        <SamplingLab />
      </main>
      <footer className="border-t border-white/5 bg-slate-900/60 py-6 text-center text-xs text-slate-400">
        Built for the "Early Text Generation" walkthrough — explore, tweak, learn.
      </footer>
    </div>
  )
}

export default App
