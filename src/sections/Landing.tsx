import { Chip } from '../components/Chip'

export function Landing() {
  return (
    <section id="top" className="pt-10 pb-12">
      <div className="flex flex-col gap-8 rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/70 via-slate-900/50 to-slate-900/20 p-8 shadow-soft backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <Chip label="Early Text Generation" />
          <Chip label="Hands-on" tone="amber" />
          <Chip label="Guided" tone="cyan" />
        </div>
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Playground</p>
            <h1 className="font-display text-4xl leading-tight text-white md:text-5xl">
              Feel how early text generators worked — without touching any code.
            </h1>
            <p className="text-lg text-slate-200 md:w-11/12">
              Experiment with three classic ideas side by side: counting-based n-grams, evolutionary text search, and decoding temperature/top-k/top-p sampling. Tune sliders, run the algorithms, and watch how small changes reshape the words that appear.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-200">
              <a href="#ngram" className="rounded-full bg-emerald-400 px-5 py-3 font-semibold text-ink shadow-lg shadow-emerald-500/30 hover:translate-y-[-1px] transition">
                Start in the N-gram Lab
              </a>
              <a href="#ga" className="rounded-full border border-white/10 px-5 py-3 font-semibold text-white hover:bg-white/5">
                See the labs
              </a>
            </div>
          </div>
          <div className="grid gap-4 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">You will explore</p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                  <span>How simple n-gram counts can mimic style — and why they break down.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
                  <span>How genetic algorithms evolve sentences through selection, crossover, and mutation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
                  <span>How sampling knobs (temperature / top-k / top-p) change the mood of a model’s next word.</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-50">
              <p className="text-sm font-semibold">How to read the UI</p>
              <p className="mt-2 text-slate-100">
                Each lab has a quick intro, a playground with sliders, and a short reflection. Make a change, click generate, and compare what happens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
