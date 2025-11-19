export interface TokenLogit {
  token: string
  logit: number
}

export interface SamplingOptions {
  temperature: number
  topK: number
  topP: number
  rng?: () => number
}

export interface ProbabilityToken {
  token: string
  prob: number
}

function softmax(logits: TokenLogit[], temperature: number): ProbabilityToken[] {
  const safeTemp = Math.max(0.05, temperature)
  const expValues = logits.map((item) => Math.exp(item.logit / safeTemp))
  const total = expValues.reduce((s, v) => s + v, 0)
  return logits
    .map((item, index) => ({ token: item.token, prob: expValues[index] / total }))
    .sort((a, b) => b.prob - a.prob)
}

function applyTopK(probs: ProbabilityToken[], k: number): ProbabilityToken[] {
  if (k <= 0 || k >= probs.length) return probs
  const sliced = probs.slice(0, k)
  const norm = sliced.reduce((s, v) => s + v.prob, 0)
  return sliced.map((p) => ({ ...p, prob: p.prob / norm }))
}

function applyTopP(probs: ProbabilityToken[], p: number): ProbabilityToken[] {
  if (p >= 0.999) return probs
  let total = 0
  const kept: ProbabilityToken[] = []
  for (const item of probs) {
    kept.push(item)
    total += item.prob
    if (total >= p) break
  }
  const norm = kept.reduce((s, v) => s + v.prob, 0)
  return kept.map((k) => ({ ...k, prob: k.prob / norm }))
}

export function buildDistribution(logits: TokenLogit[], options: SamplingOptions): ProbabilityToken[] {
  const base = softmax(logits, options.temperature)
  const afterTopK = applyTopK(base, options.topK)
  return applyTopP(afterTopK, options.topP)
}

export function sampleFromDistribution(distribution: ProbabilityToken[], rng: () => number = Math.random): string {
  const total = distribution.reduce((s, v) => s + v.prob, 0) || 1
  let threshold = rng() * total
  for (const item of distribution) {
    threshold -= item.prob
    if (threshold <= 0) return item.token
  }
  return distribution[distribution.length - 1].token
}

export function sampleSequence(
  logits: TokenLogit[],
  options: SamplingOptions,
  length: number,
  rng: () => number = Math.random,
): string[] {
  const dist = buildDistribution(logits, options)
  return Array.from({ length }, () => sampleFromDistribution(dist, rng))
}
