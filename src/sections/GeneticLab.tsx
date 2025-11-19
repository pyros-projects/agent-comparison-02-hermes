import { useEffect, useMemo, useState } from 'react'
import { Card } from '../components/Card'
import { Slider } from '../components/Slider'
import { Stat } from '../components/Stat'
import { Chip } from '../components/Chip'
import { Sparkline } from '../components/Sparkline'
import { initializeGA, stepGA, type GAParams, type GAState } from '../lib/genetic'

const alphabet = 'abcdefghijklmnopqrstuvwxyz .!?' // allow basic punctuation

export function GeneticLab() {
  const [mode, setMode] = useState<GAParams['mode']>('target')
  const [target, setTarget] = useState('to be or not to be')
  const [populationSize, setPopulationSize] = useState(60)
  const [mutationRate, setMutationRate] = useState(0.05)
  const [crossoverRate, setCrossoverRate] = useState(0.7)
  const [maxGenerations, setMaxGenerations] = useState(60)
  const [preferredLength, setPreferredLength] = useState(22)
  const [requiredLetters, setRequiredLetters] = useState('aeiou')
  const [bonusWords, setBonusWords] = useState('ai, text, code')
  const [autoRun, setAutoRun] = useState(false)

  const params: GAParams = useMemo(
    () => ({
      populationSize,
      mutationRate,
      crossoverRate,
      target,
      maxGenerations,
      mode,
      scoringRules: {
        requiredLetters: requiredLetters.replace(/\s+/g, ''),
        preferredLength,
        bonusWords: bonusWords
          .split(',')
          .map((w) => w.trim())
          .filter(Boolean),
      },
      alphabet,
    }),
    [populationSize, mutationRate, crossoverRate, target, maxGenerations, mode, requiredLetters, preferredLength, bonusWords],
  )

  const [state, setState] = useState<GAState>(() => initializeGA(params))

  useEffect(() => {
    setState(initializeGA(params))
  }, [params])

  useEffect(() => {
    if (!autoRun) return
    const id = setInterval(() => {
      setState((current) => {
        if (current.generation >= params.maxGenerations) {
          setAutoRun(false)
          return current
        }
        return stepGA(current, params)
      })
    }, 160)
    return () => clearInterval(id)
  }, [autoRun, params])

  const handleStep = () => setState((current) => stepGA(current, params))
  const handleReset = () => setState(initializeGA(params))

  const historyBest = state.history.map((h) => h.best)
  const historyAvg = state.history.map((h) => h.average)

  return (
    <section id="ga" className="space-y-6 py-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Lab 2</p>
          <h2 className="font-display text-3xl text-white">Genetic Text Lab: Evolve a Sentence</h2>
          <p className="max-w-3xl text-sm text-slate-200">
            Watch a population of candidate strings compete. Selection, crossover, and mutation nudge them towards a target phrase or a custom scoring rule. Step through generations or let it auto-run.
          </p>
        </div>
        <Chip label="Evolutionary search" tone="amber" />
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card title="Setup" eyebrow="Choose goal">
          <div className="flex gap-3 text-sm text-slate-200">
            <button
              className={`flex-1 rounded-xl border px-3 py-2 ${mode === 'target' ? 'border-amber-300 bg-amber-500/20 text-amber-50' : 'border-white/10'}`}
              onClick={() => setMode('target')}
            >
              Match a target sentence
            </button>
            <button
              className={`flex-1 rounded-xl border px-3 py-2 ${mode === 'score' ? 'border-amber-300 bg-amber-500/20 text-amber-50' : 'border-white/10'}`}
              onClick={() => setMode('score')}
            >
              Optimize a scoring rule
            </button>
          </div>

          {mode === 'target' ? (
            <label className="mt-4 block text-sm text-slate-200">
              Target sentence
              <input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-slate-100"
              />
            </label>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="text-sm text-slate-200">
                Required letters
                <input
                  value={requiredLetters}
                  onChange={(e) => setRequiredLetters(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 p-2 text-slate-100"
                />
                <span className="text-xs text-slate-400">We add points if they appear.</span>
              </label>
              <label className="text-sm text-slate-200">
                Desired length
                <input
                  type="number"
                  value={preferredLength}
                  onChange={(e) => setPreferredLength(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 p-2 text-slate-100"
                />
                <span className="text-xs text-slate-400">Reward closer lengths.</span>
              </label>
              <label className="text-sm text-slate-200 md:col-span-2">
                Bonus words (comma separated)
                <input
                  value={bonusWords}
                  onChange={(e) => setBonusWords(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 p-2 text-slate-100"
                />
              </label>
            </div>
          )}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Slider label="Population" min={10} max={200} step={10} value={populationSize} onChange={setPopulationSize} />
            <Slider label="Generations" min={10} max={200} step={10} value={maxGenerations} onChange={setMaxGenerations} />
            <Slider label="Mutation" min={0.01} max={0.3} step={0.01} value={mutationRate} onChange={setMutationRate} />
            <Slider label="Crossover" min={0.1} max={1} step={0.05} value={crossoverRate} onChange={setCrossoverRate} />
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <button
              onClick={() => setAutoRun((v) => !v)}
              className={`rounded-2xl px-4 py-3 font-semibold ${autoRun ? 'bg-amber-500 text-ink' : 'bg-amber-400 text-ink'} shadow-lg shadow-amber-500/30`}
            >
              {autoRun ? 'Pause auto-run' : 'Auto-run evolution'}
            </button>
            <button onClick={handleStep} className="rounded-2xl border border-white/10 px-4 py-3 font-semibold text-white hover:border-white/40">
              Step one generation
            </button>
            <button onClick={handleReset} className="rounded-2xl border border-white/10 px-4 py-3 font-semibold text-slate-200 hover:border-white/40">
              Reset population
            </button>
          </div>
        </Card>

        <Card title="What you see" eyebrow="Live evolution">
          <div className="space-y-3 text-sm text-slate-200">
            <p><strong>Best candidate:</strong> <span className="font-mono text-white">{state.best}</span></p>
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Generation" value={state.generation} />
              <Stat label="Best fitness" value={state.bestScore.toFixed(3)} />
              <Stat label="Average" value={state.history.at(-1)?.average.toFixed(3) ?? '0'} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Best fitness over time</p>
              <Sparkline values={historyBest} stroke="#f6ad55" />
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Average fitness</p>
              <Sparkline values={historyAvg} stroke="#7cf2d4" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-sm font-semibold text-white">Genetic algorithm recap</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-300">
                <li><strong>Population</strong>: many candidate strings.</li>
                <li><strong>Fitness</strong>: how well a string matches the goal.</li>
                <li><strong>Selection</strong>: fitter strings are chosen to reproduce.</li>
                <li><strong>Crossover</strong>: swap pieces between parents.</li>
                <li><strong>Mutation</strong>: random changes to explore.</li>
              </ul>
              <p className="mt-2 text-xs text-slate-400">
                AI connection: before deep nets were dominant, genetic algorithms were a playful way to search the giant space of text programs or prompts.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
