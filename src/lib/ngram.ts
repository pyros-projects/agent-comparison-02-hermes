export type NGramMode = 'word' | 'char'

export interface NGramModel {
  n: number
  mode: NGramMode
  counts: Record<string, Record<string, number>>
  totals: Record<string, number>
  vocabulary: Set<string>
}

export interface GenerateOptions {
  promptTokens: string[]
  maxLength: number
  randomness: 'greedy' | 'sample'
  temperature: number
  rng?: () => number
}

export interface GeneratedToken {
  token: string
  contextKey: string
}

const START_CONTEXT = '<start>'
const CONTEXT_SEPARATOR = '|~|'

const defaultAlphabet = 'abcdefghijklmnopqrstuvwxyz ' // fallback for character mode when corpus is too small

export function tokenize(text: string, mode: NGramMode): string[] {
  if (!text.trim()) return []
  if (mode === 'char') {
    return Array.from(text)
  }
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
}

function makeKey(context: string[]): string {
  if (!context.length) return START_CONTEXT
  return context.join(CONTEXT_SEPARATOR)
}

export function buildNGram(tokens: string[], n: number, mode: NGramMode): NGramModel {
  const counts: Record<string, Record<string, number>> = {}
  const totals: Record<string, number> = {}
  const vocabulary = new Set<string>()

  if (tokens.length === 0) {
    return { n, mode, counts, totals, vocabulary }
  }

  const window = Math.max(1, n - 1)

  for (let i = 0; i < tokens.length; i++) {
    const start = Math.max(0, i - window)
    const context = tokens.slice(start, i)
    const key = makeKey(context)
    const next = tokens[i]

    if (!counts[key]) counts[key] = {}
    counts[key][next] = (counts[key][next] ?? 0) + 1
    totals[key] = (totals[key] ?? 0) + 1
    vocabulary.add(next)
  }

  return { n, mode, counts, totals, vocabulary }
}

function normalize(counts: Record<string, number>): { token: string; prob: number; count: number }[] {
  const entries = Object.entries(counts)
  const total = entries.reduce((sum, [, c]) => sum + c, 0)
  if (total === 0) return []
  return entries
    .map(([token, count]) => ({ token, prob: count / total, count }))
    .sort((a, b) => b.prob - a.prob)
}

function findContextKey(model: NGramModel, contextTokens: string[]): string | null {
  for (let k = contextTokens.length; k >= 0; k--) {
    const key = makeKey(contextTokens.slice(contextTokens.length - k))
    if (model.counts[key]) return key
  }
  // allow start context if present
  if (model.counts[START_CONTEXT]) return START_CONTEXT
  return null
}

function sampleDistribution(options: {
  distribution: { token: string; prob: number }[]
  randomness: 'greedy' | 'sample'
  temperature: number
  rng?: () => number
}): { token: string; contextKey: string } | null {
  const { distribution, randomness, temperature, rng } = options
  if (!distribution.length) return null

  if (randomness === 'greedy') {
    return { token: distribution[0].token, contextKey: '' }
  }

  const scaled = distribution.map((item) => ({
    ...item,
    prob: Math.pow(item.prob, 1 / Math.max(0.05, temperature)),
  }))
  const total = scaled.reduce((sum, item) => sum + item.prob, 0)
  let threshold = (rng ?? Math.random)() * total
  for (const item of scaled) {
    threshold -= item.prob
    if (threshold <= 0) return { token: item.token, contextKey: '' }
  }
  return { token: scaled[scaled.length - 1].token, contextKey: '' }
}

export function generate(model: NGramModel, options: GenerateOptions): GeneratedToken[] {
  const { promptTokens, maxLength, randomness, temperature, rng } = options
  if (!maxLength) return []

  const contextWindow = Math.max(0, model.n - 1)
  let context = promptTokens.slice(-contextWindow)
  const output: GeneratedToken[] = []

  for (let i = 0; i < maxLength; i++) {
    const contextKey = findContextKey(model, context) ?? START_CONTEXT
    const nextCounts = model.counts[contextKey] ?? {}
    let distribution = normalize(nextCounts)

    // fallback to unigram when nothing is known
    if (!distribution.length && model.counts[START_CONTEXT]) {
      distribution = normalize(model.counts[START_CONTEXT])
    }

    // For character mode with tiny corpora ensure there is at least something to sample.
    if (!distribution.length && model.mode === 'char') {
      const fallbacks = defaultAlphabet.split('').reduce<Record<string, number>>((acc, letter) => {
        acc[letter] = 1
        return acc
      }, {})
      distribution = normalize(fallbacks)
    }

    if (!distribution.length) break

    const choice = sampleDistribution({ distribution, randomness, temperature, rng })
    if (!choice) break
    output.push({ token: choice.token, contextKey })
    context = [...context.slice(-(contextWindow - 1)), choice.token].filter(Boolean)
  }

  return output
}

export function getContextDistribution(
  model: NGramModel,
  contextTokens: string[],
  hideBelow?: number,
): { token: string; prob: number; count: number }[] {
  const key = findContextKey(model, contextTokens)
  if (!key) return []
  const normalized = normalize(model.counts[key])
  if (!hideBelow) return normalized
  return normalized.filter((item) => item.count >= hideBelow)
}

export function corpusStats(tokens: string[]): { total: number; unique: number } {
  return { total: tokens.length, unique: new Set(tokens).size }
}
