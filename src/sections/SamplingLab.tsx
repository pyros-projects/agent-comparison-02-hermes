import { useMemo, useState } from 'react'
import { Card } from '../components/Card'
import { Slider } from '../components/Slider'
import { Chip } from '../components/Chip'
import { BarChart } from '../components/BarChart'
import { decodingContexts } from '../data/decodingContexts'
import { buildDistribution, sampleSequence } from '../lib/sampling'

export function SamplingLab() {
  const [contextId, setContextId] = useState(decodingContexts[0].id)
  const [temperature, setTemperature] = useState(0.9)
  const [topK, setTopK] = useState(5)
  const [topP, setTopP] = useState(0.9)
  const [length, setLength] = useState(12)
  const [sampled, setSampled] = useState<string>('')

  const context = decodingContexts.find((c) => c.id === contextId) ?? decodingContexts[0]

  const distribution = useMemo(
    () =>
      buildDistribution(context.logits, {
        temperature,
        topK,
        topP,
      }),
    [context, temperature, topK, topP],
  )

  const handleGenerate = () => {
    const tokens = sampleSequence(context.logits, { temperature, topK, topP }, length)
    setSampled(tokens.join(' '))
  }

  return (
    <section id="mystery" className="space-y-6 py-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Lab 3</p>
          <h2 className="font-display text-3xl text-white">Sampling Lab: Temperature, Top-k, Top-p</h2>
          <p className="max-w-3xl text-sm text-slate-200">
            Early text generators (and today’s LLMs) must pick the next token from a probability list. Decoding strategies like temperature scaling, top-k, and nucleus (top-p) sampling control creativity versus safety. Here you can see the distribution morph in real time.
          </p>
        </div>
        <Chip label="Decoding strategies" tone="cyan" />
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card title="Playground" eyebrow="Adjust decoding">
          <div className="flex flex-wrap gap-2 text-sm text-slate-200">
            {decodingContexts.map((ctx) => (
              <button
                key={ctx.id}
                className={`rounded-xl border px-3 py-2 ${contextId === ctx.id ? 'border-cyan-300 bg-cyan-400/20 text-cyan-50' : 'border-white/10 text-slate-200'}`}
                onClick={() => setContextId(ctx.id)}
              >
                {ctx.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-300">Prompt fragment: <span className="font-semibold text-white">{context.prompt}</span></p>
          <p className="text-xs text-slate-400">{context.description}</p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Slider label="Temperature" min={0.2} max={1.8} step={0.1} value={temperature} onChange={setTemperature} />
            <Slider label="Top-k" min={1} max={context.logits.length} step={1} value={topK} onChange={setTopK} />
            <Slider label="Top-p (nucleus)" min={0.1} max={1} step={0.05} value={topP} onChange={setTopP} />
            <Slider label="Tokens to sample" min={4} max={30} step={1} value={length} onChange={setLength} />
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <button
              onClick={handleGenerate}
              className="rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-ink shadow-lg shadow-cyan-500/30"
            >
              Sample sequence
            </button>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-xs text-slate-300">
              Lower temperature or smaller top-k → safer, repetitive text. Higher values → more surprise and chaos.
            </div>
          </div>

          <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sampled continuation</p>
            <p className="leading-relaxed text-white">
              <span className="text-slate-400">{context.prompt} </span>
              {sampled || '← Hit “Sample sequence” to generate using this distribution.'}
            </p>
          </div>
        </Card>

        <Card title="Probability view" eyebrow="Distribution after decoding">
          <BarChart
            items={distribution.map((d) => ({
              label: d.token,
              value: d.prob,
              secondary: `${(d.prob * 100).toFixed(1)}% after filters`,
            }))}
            color="bg-cyan-300"
          />
          <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
            <p className="font-semibold text-white">How the knobs work</p>
            <ul className="list-disc space-y-1 pl-4 text-slate-300">
              <li><strong>Temperature:</strong> rescales probabilities. Low = sharp peaks, high = flatter, more random.</li>
              <li><strong>Top-k:</strong> keep only the k most likely tokens; zero out the rest.</li>
              <li><strong>Top-p:</strong> keep the smallest set whose probability mass ≥ p (nucleus sampling).</li>
            </ul>
          </div>
        </Card>
      </div>

      <Card title="How this relates" eyebrow="Compare the labs">
        <div className="grid gap-4 md:grid-cols-3 text-sm text-slate-200">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
            <p className="font-semibold text-white">Versus n-grams</p>
            <p className="mt-2 text-slate-300">Both pick the next token from a distribution, but n-grams get probabilities from raw counts. Temperature/top-k/top-p show how <em>decoding</em> alone changes style even when the probabilities stay fixed.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
            <p className="font-semibold text-white">Versus genetic search</p>
            <p className="mt-2 text-slate-300">Genetic algorithms explore whole sentences as individuals. Sampling tweaks only the random choice at each step. GA evolves content; decoding dials in creativity of a single model.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
            <p className="font-semibold text-white">Why it matters</p>
            <p className="mt-2 text-slate-300">Modern LLM outputs are hugely sensitive to decoding. These knobs were already important for early probabilistic models and remain essential today for safety, determinism, and style.</p>
          </div>
        </div>
      </Card>
    </section>
  )
}
