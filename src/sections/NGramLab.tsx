import { useMemo, useState } from 'react'
import { corpora } from '../data/corpora'
import { BarChart } from '../components/BarChart'
import { Card } from '../components/Card'
import { Slider } from '../components/Slider'
import { Stat } from '../components/Stat'
import { Chip } from '../components/Chip'
import {
  buildNGram,
  corpusStats,
  generate,
  getContextDistribution,
  tokenize,
  type GeneratedToken,
  type NGramMode,
} from '../lib/ngram'

const defaultCorpusKey = 'nursery'

export function NGramLab() {
  const [corpusKey, setCorpusKey] = useState<keyof typeof corpora>(defaultCorpusKey)
  const [customText, setCustomText] = useState('')
  const [mode, setMode] = useState<NGramMode>('word')
  const [n, setN] = useState(3)
  const [prompt, setPrompt] = useState('twinkle twinkle')
  const [maxLength, setMaxLength] = useState(40)
  const [randomness, setRandomness] = useState<'greedy' | 'sample'>('sample')
  const [temperature, setTemperature] = useState(0.8)
  const [hideRare, setHideRare] = useState(0)

  const corpusText = customText.trim() ? customText : corpora[corpusKey].text
  const tokens = useMemo(() => tokenize(corpusText, mode), [corpusText, mode])
  const stats = useMemo(() => corpusStats(tokens), [tokens])
  const model = useMemo(() => buildNGram(tokens, n, mode), [tokens, n, mode])

  const context = useMemo(() => tokenize(prompt, mode).slice(-(n - 1)), [prompt, mode, n])
  const distribution = useMemo(() => getContextDistribution(model, context, hideRare || undefined), [model, context, hideRare])

  const [generated, setGenerated] = useState<GeneratedToken[]>([])

  const handleGenerate = () => {
    const promptTokens = tokenize(prompt, mode)
    const gen = generate(model, {
      promptTokens,
      maxLength,
      randomness,
      temperature,
    })
    setGenerated(gen)
  }

  return (
    <section id="ngram" className="space-y-6 py-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Lab 1</p>
          <h2 className="font-display text-3xl text-white">N-gram Lab: Predict by Counting</h2>
          <p className="max-w-3xl text-sm text-slate-200">
            Pick a tiny text, choose whether we count words or characters, and watch how different n values change the next-token prediction. Higher n = more context but also more risk of overfitting.
          </p>
        </div>
        <Chip label={mode === 'word' ? 'Word model' : 'Character model'} />
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card title="Corpus" eyebrow="Choose or paste" actions={<span className="text-xs text-slate-400">Tracks counts live</span>}>
          <div className="flex flex-wrap gap-3 text-xs">
            {Object.entries(corpora).map(([key, value]) => (
              <button
                key={key}
                className={`rounded-full border px-3 py-1 ${corpusKey === key ? 'border-emerald-300 bg-emerald-400/20 text-emerald-50' : 'border-white/10 text-slate-200 hover:border-white/40'}`}
                onClick={() => setCorpusKey(key as keyof typeof corpora)}
              >
                {value.name}
              </button>
            ))}
          </div>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste your own text here"
            className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-100 focus:border-emerald-300"
            rows={5}
          />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Stat label="Tokens" value={stats.total} />
            <Stat label="Distinct" value={stats.unique} />
            <Stat label="Mode" value={mode === 'word' ? 'Word' : 'Character'} />
          </div>
        </Card>

        <Card title="Config & Generate" eyebrow="Playground">
          <div className="grid gap-4 md:grid-cols-2">
            <Slider label="n (context window)" min={1} max={4} value={n} onChange={setN} />
            <Slider label="Max length" min={10} max={200} step={10} value={maxLength} onChange={setMaxLength} suffix=" tokens" />
            <Slider label="Temperature" min={0.2} max={1.8} step={0.1} value={temperature} onChange={setTemperature} />
            <label className="text-sm text-slate-200">
              Randomness mode
              <select
                value={randomness}
                onChange={(e) => setRandomness(e.target.value as 'greedy' | 'sample')}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 p-2 text-slate-100"
              >
                <option value="sample">Sample (temperature)</option>
                <option value="greedy">Greedy (always most likely)</option>
              </select>
            </label>
            <label className="text-sm text-slate-200">
              Tokenization
              <div className="mt-2 flex gap-2 text-xs">
                <button
                  onClick={() => setMode('word')}
                  className={`flex-1 rounded-xl border px-3 py-2 ${mode === 'word' ? 'border-emerald-300 bg-emerald-400/20 text-emerald-50' : 'border-white/10 text-slate-200'}`}
                >
                  Word based
                </button>
                <button
                  onClick={() => setMode('char')}
                  className={`flex-1 rounded-xl border px-3 py-2 ${mode === 'char' ? 'border-emerald-300 bg-emerald-400/20 text-emerald-50' : 'border-white/10 text-slate-200'}`}
                >
                  Character based
                </button>
              </div>
            </label>
            <Slider label="Hide rare n-grams (count ≥)" min={0} max={3} step={1} value={hideRare} onChange={setHideRare} />
          </div>
          <div className="mt-4 space-y-3">
            <label className="block text-sm text-slate-200">
              Prompt
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-slate-100"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type a starting text"
              />
            </label>
            <button
              onClick={handleGenerate}
              className="w-full rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-ink shadow-lg shadow-emerald-500/30 hover:translate-y-[-1px] transition"
            >
              Generate
            </button>
          </div>

          <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Output</p>
            <p className="leading-relaxed">
              <span className="text-slate-400">{prompt} </span>
              {generated.map((g, idx) => (
                <span
                  key={idx}
                  className={`rounded-md px-1 py-0.5 ${idx % 3 === 0 ? 'bg-emerald-500/20' : idx % 3 === 1 ? 'bg-amber-500/20' : 'bg-cyan-500/20'}`}
                  title={`Context: ${g.contextKey.replace(/\|~\|/g, ' ') || 'start'}`}
                >
                  {mode === 'word' ? `${idx === 0 ? '' : ' '}${g.token}` : g.token}
                </span>
              ))}
            </p>
            <p className="text-xs text-slate-400">Hover tokens to see which context was used.</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <Card title="Context visualizer" eyebrow="Top next tokens">
          <p className="text-sm text-slate-300">Context used: <span className="font-semibold text-white">{context.join(mode === 'word' ? ' ' : '') || 'start of text'}</span></p>
          <div className="mt-4">
            <BarChart
              items={distribution.map((d) => ({
                label: d.token,
                value: d.prob,
                secondary: `${d.count} count${d.count === 1 ? '' : 's'}`,
              }))}
            />
          </div>
        </Card>
        <Card title="What is an n-gram?" eyebrow="Explanation">
          <div className="space-y-3 text-sm text-slate-200">
            <p>
              An n-gram model looks at the previous <strong>n-1 tokens</strong> to guess the next one by counting how often each continuation happened in the corpus. A 1-gram ignores context; a 4-gram remembers the last 3 tokens.
            </p>
            <p>
              Lower n → smoother, generic output. Higher n → more faithful to the corpus, sometimes repetitive or brittle on new prompts.
            </p>
            <ul className="list-disc space-y-1 pl-4 text-slate-300">
              <li><strong>Strengths:</strong> simple, fast, captures local style.</li>
              <li><strong>Weaknesses:</strong> forgets long context, explodes in size as n grows, overfits small corpora.</li>
              <li><strong>Bridge to modern LMs:</strong> Modern neural models also predict next tokens, but learn probabilities with dense parameters instead of raw counts.</li>
            </ul>
          </div>
        </Card>
      </div>
    </section>
  )
}
