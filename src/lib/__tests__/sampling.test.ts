import { describe, expect, it } from 'vitest'
import { buildDistribution, sampleFromDistribution } from '../sampling'

const logits = [
  { token: 'a', logit: 2 },
  { token: 'b', logit: 1 },
  { token: 'c', logit: 0.5 },
]

describe('sampling strategies', () => {
  it('applies top-k', () => {
    const dist = buildDistribution(logits, { temperature: 1, topK: 1, topP: 1 })
    expect(dist).toHaveLength(1)
    expect(dist[0].token).toBe('a')
  })

  it('applies top-p', () => {
    const dist = buildDistribution(logits, { temperature: 1, topK: 3, topP: 0.6 })
    expect(dist.reduce((s, d) => s + d.prob, 0)).toBeCloseTo(1)
  })

  it('samples using probs', () => {
    const dist = buildDistribution(logits, { temperature: 1, topK: 3, topP: 1 })
    const token = sampleFromDistribution(dist, () => 0)
    expect(token).toBe('a')
  })
})
