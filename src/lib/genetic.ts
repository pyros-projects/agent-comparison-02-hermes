export interface GAParams {
  populationSize: number
  mutationRate: number
  crossoverRate: number
  target: string
  maxGenerations: number
  mode: 'target' | 'score'
  scoringRules?: ScoringRules
  alphabet?: string
  rng?: () => number
}

export interface ScoringRules {
  requiredLetters?: string
  preferredLength?: number
  bonusWords?: string[]
}

export interface GAState {
  population: string[]
  fitness: number[]
  best: string
  bestScore: number
  generation: number
  history: { generation: number; best: number; average: number }[]
}

const DEFAULT_ALPHABET = 'abcdefghijklmnopqrstuvwxyz ';

function randomChar(alphabet: string, rng: () => number): string {
  return alphabet[Math.floor(rng() * alphabet.length)]
}

function randomString(length: number, alphabet: string, rng: () => number): string {
  return Array.from({ length }, () => randomChar(alphabet, rng)).join('')
}

function targetFitness(candidate: string, target: string): number {
  const maxLen = Math.max(candidate.length, target.length)
  let score = 0
  for (let i = 0; i < maxLen; i++) {
    if (candidate[i] === target[i]) score += 1
  }
  return score / maxLen
}

function rulesFitness(candidate: string, rules: ScoringRules): number {
  let score = 0
  if (rules.requiredLetters) {
    for (const letter of rules.requiredLetters) {
      if (candidate.includes(letter)) score += 1
    }
  }
  if (rules.preferredLength) {
    const diff = Math.abs(candidate.length - rules.preferredLength)
    score += Math.max(0, 1 - diff / rules.preferredLength)
  }
  if (rules.bonusWords) {
    for (const word of rules.bonusWords) {
      if (candidate.includes(word)) score += 1.5
    }
  }
  return score / (1 + (rules.requiredLetters?.length ?? 0) + (rules.bonusWords?.length ?? 0) + 1)
}

function fitness(candidate: string, params: GAParams): number {
  if (params.mode === 'target') return targetFitness(candidate, params.target)
  return rulesFitness(candidate, params.scoringRules ?? {})
}

function select(population: string[], fitnesses: number[], rng: () => number): string {
  // roulette wheel selection
  const total = fitnesses.reduce((s, f) => s + f, 0) || 1
  let threshold = rng() * total
  for (let i = 0; i < population.length; i++) {
    threshold -= fitnesses[i]
    if (threshold <= 0) return population[i]
  }
  return population[population.length - 1]
}

function crossover(a: string, b: string, rng: () => number): [string, string] {
  const point = Math.floor(rng() * Math.min(a.length, b.length))
  return [a.slice(0, point) + b.slice(point), b.slice(0, point) + a.slice(point)]
}

function mutate(candidate: string, rate: number, alphabet: string, rng: () => number): string {
  return candidate
    .split('')
    .map((ch) => (rng() < rate ? randomChar(alphabet, rng) : ch))
    .join('')
}

export function initializeGA(params: GAParams): GAState {
  const alphabet = params.alphabet ?? DEFAULT_ALPHABET
  const rng = params.rng ?? Math.random
  const population = Array.from({ length: params.populationSize }, () =>
    randomString(Math.max(3, params.target.length), alphabet, rng),
  )
  const fitnessValues = population.map((p) => fitness(p, params))
  const bestIdx = fitnessValues.indexOf(Math.max(...fitnessValues))
  return {
    population,
    fitness: fitnessValues,
    best: population[bestIdx],
    bestScore: fitnessValues[bestIdx],
    generation: 0,
    history: [{ generation: 0, best: fitnessValues[bestIdx], average: average(fitnessValues) }],
  }
}

function average(values: number[]): number {
  if (!values.length) return 0
  return values.reduce((s, v) => s + v, 0) / values.length
}

export function stepGA(state: GAState, params: GAParams): GAState {
  const rng = params.rng ?? Math.random
  const alphabet = params.alphabet ?? DEFAULT_ALPHABET

  const nextPopulation: string[] = []

  while (nextPopulation.length < params.populationSize) {
    const parentA = select(state.population, state.fitness, rng)
    const parentB = select(state.population, state.fitness, rng)

    let [childA, childB] = [parentA, parentB]
    if (rng() < params.crossoverRate) {
      ;[childA, childB] = crossover(parentA, parentB, rng)
    }

    childA = mutate(childA, params.mutationRate, alphabet, rng)
    childB = mutate(childB, params.mutationRate, alphabet, rng)

    nextPopulation.push(childA)
    if (nextPopulation.length < params.populationSize) nextPopulation.push(childB)
  }

  const fitnessValues = nextPopulation.map((p) => fitness(p, params))
  const bestIdx = fitnessValues.indexOf(Math.max(...fitnessValues))

  const historyEntry = {
    generation: state.generation + 1,
    best: fitnessValues[bestIdx],
    average: average(fitnessValues),
  }

  return {
    population: nextPopulation,
    fitness: fitnessValues,
    best: nextPopulation[bestIdx],
    bestScore: fitnessValues[bestIdx],
    generation: state.generation + 1,
    history: [...state.history, historyEntry],
  }
}
