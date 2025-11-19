import { describe, expect, it } from 'vitest'
import { buildNGram, generate, tokenize } from '../ngram'

describe('n-gram model', () => {
  const corpus = 'a b a b c'
  const tokens = tokenize(corpus, 'word')

  it('builds counts and vocabulary', () => {
    const model = buildNGram(tokens, 2, 'word')
    expect(model.vocabulary.size).toBe(3)
    expect(model.counts['a']).toBeDefined()
  })

  it('falls back to unigram when context unknown', () => {
    const model = buildNGram(tokens, 3, 'word')
    const output = generate(model, {
      promptTokens: ['z'],
      maxLength: 1,
      randomness: 'greedy',
      temperature: 1,
      rng: () => 0,
    })
    expect(['a', 'b', 'c']).toContain(output[0]?.token)
  })

  it('respects temperature sampling', () => {
    const model = buildNGram(tokens, 2, 'word')
    const output = generate(model, {
      promptTokens: ['a'],
      maxLength: 1,
      randomness: 'sample',
      temperature: 0.5,
      rng: () => 0,
    })
    expect(output[0]?.token).toBe('b')
  })
})
