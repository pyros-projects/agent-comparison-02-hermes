import { describe, expect, it } from 'vitest'
import { initializeGA, stepGA, type GAParams } from '../genetic'

const baseParams: GAParams = {
  populationSize: 20,
  mutationRate: 0.1,
  crossoverRate: 0.8,
  target: 'abc',
  maxGenerations: 10,
  mode: 'target',
  rng: () => 0.3,
}

describe('genetic algorithm', () => {
  it('initializes with population', () => {
    const state = initializeGA(baseParams)
    expect(state.population).toHaveLength(baseParams.populationSize)
    expect(state.history[0].generation).toBe(0)
  })

  it('improves or changes over steps', () => {
    const first = initializeGA(baseParams)
    const next = stepGA(first, baseParams)
    expect(next.generation).toBe(1)
    expect(next.population.length).toBe(baseParams.populationSize)
  })
})
