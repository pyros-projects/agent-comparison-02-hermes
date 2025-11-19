export interface GAStepResult {
  population: string[];
  bestGenome: string;
  bestFitness: number;
  avgFitness: number;
  generation: number;
}

export class GeneticTextModel {
  private population: string[];
  private populationSize: number;
  private mutationRate: number;
  private target: string;
  private generation: number;
  private chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .,!?:";

  constructor(target: string, popSize: number = 100, mutationRate: number = 0.01) {
    this.target = target;
    this.populationSize = popSize;
    this.mutationRate = mutationRate;
    this.generation = 0;
    this.population = [];
    this.initialize();
  }

  private randomChar(): string {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }

  private initialize() {
    this.population = [];
    for (let i = 0; i < this.populationSize; i++) {
      let individual = "";
      for (let j = 0; j < this.target.length; j++) {
        individual += this.randomChar();
      }
      this.population.push(individual);
    }
  }

  private calculateFitness(individual: string): number {
    let score = 0;
    for (let i = 0; i < individual.length; i++) {
      if (individual[i] === this.target[i]) {
        score++;
      }
    }
    return score / this.target.length;
  }

  public step(): GAStepResult {
    this.generation++;
    
    // 1. Selection (Tournament or Roulette - using simple elitism + random for simplicity)
    // Calculate all fitnesses
    const scored = this.population.map(p => ({
      dna: p,
      fitness: this.calculateFitness(p)
    }));

    // Sort by fitness desc
    scored.sort((a, b) => b.fitness - a.fitness);

    const bestFitness = scored[0].fitness;
    const bestGenome = scored[0].dna;
    const avgFitness = scored.reduce((sum, s) => sum + s.fitness, 0) / this.populationSize;

    // Create new population
    const newPopulation: string[] = [];

    // Elitism: Keep top 2%
    const eliteCount = Math.max(1, Math.floor(this.populationSize * 0.02));
    for (let i = 0; i < eliteCount; i++) {
      newPopulation.push(scored[i].dna);
    }

    // Fill rest
    while (newPopulation.length < this.populationSize) {
      const parentA = this.pickOne(scored);
      const parentB = this.pickOne(scored);
      let child = this.crossover(parentA.dna, parentB.dna);
      child = this.mutate(child);
      newPopulation.push(child);
    }

    this.population = newPopulation;

    return {
      population: this.population, // return full pop might be heavy, but ok for small size
      bestGenome,
      bestFitness,
      avgFitness,
      generation: this.generation
    };
  }

  private pickOne(scored: {dna: string, fitness: number}[]): {dna: string, fitness: number} {
    // Simple tournament
    const i = Math.floor(Math.random() * scored.length);
    const j = Math.floor(Math.random() * scored.length);
    return scored[i].fitness > scored[j].fitness ? scored[i] : scored[j];
  }

  private crossover(parentA: string, parentB: string): string {
    const midpoint = Math.floor(Math.random() * parentA.length);
    return parentA.substring(0, midpoint) + parentB.substring(midpoint);
  }

  private mutate(dna: string): string {
    let newDna = "";
    for (let i = 0; i < dna.length; i++) {
      if (Math.random() < this.mutationRate) {
        newDna += this.randomChar();
      } else {
        newDna += dna[i];
      }
    }
    return newDna;
  }

  public updateSettings(target: string, popSize: number, mutationRate: number) {
    // If target length changed, we might need to restart or pad/trim individuals
    // For simplicity, we just reset if target changes length significantly or on user request.
    // Here we just update params for next generation where possible.
    
    const targetChanged = target !== this.target;
    this.target = target;
    this.mutationRate = mutationRate;
    
    // Population size change is tricky mid-run, usually requires restart or resizing array
    if (popSize !== this.populationSize) {
       this.populationSize = popSize;
       // If growing, add randoms. If shrinking, slice.
       if (this.population.length < popSize) {
         while (this.population.length < popSize) {
           let ind = "";
           for(let j=0; j<this.target.length; j++) ind+=this.randomChar();
           this.population.push(ind);
         }
       } else {
         this.population = this.population.slice(0, popSize);
       }
    }

    if (targetChanged && this.population.length > 0 && this.population[0].length !== target.length) {
        // Hard reset if length changes
        this.generation = 0;
        this.initialize();
    }
  }
  
  public reset() {
      this.generation = 0;
      this.initialize();
  }
}
