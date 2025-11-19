export interface NGramStats {
  token: string;
  count: number;
  probability: number;
}

export class NGramModel {
  private n: number;
  // Map of context (joined by space) -> Map of next token -> count
  private model: Map<string, Map<string, number>>;
  
  constructor(n: number) {
    this.n = n;
    this.model = new Map();
  }

  // Simple tokenization: split by space, handle punctuation loosely
  private tokenize(text: string): string[] {
    // Add spaces around punctuation so they become their own tokens
    return text
      .replace(/([.,!?;:()"])/g, " $1 ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ");
  }

  public train(corpus: string) {
    const tokens = this.tokenize(corpus);
    this.model.clear();

    if (tokens.length < this.n) return;

    for (let i = 0; i < tokens.length - this.n; i++) {
      // Create context of size n-1
      // Note: An "n-gram" usually means a sequence of n items. 
      // The "context" for prediction is the first n-1 items.
      // If n=1 (unigram), context is empty.
      
      let context: string;
      let nextToken: string;

      if (this.n === 1) {
        context = "";
        nextToken = tokens[i];
      } else {
        const contextTokens = tokens.slice(i, i + this.n - 1);
        context = contextTokens.join(" ");
        nextToken = tokens[i + this.n - 1];
      }

      if (!this.model.has(context)) {
        this.model.set(context, new Map());
      }
      const nextCounts = this.model.get(context)!;
      nextCounts.set(nextToken, (nextCounts.get(nextToken) || 0) + 1);
    }
  }

  public getNextTokenStats(history: string[]): NGramStats[] {
    // Get the relevant context from the end of history
    let context = "";
    
    if (this.n > 1) {
      const needed = this.n - 1;
      const relevantHistory = history.slice(-needed);
      // If we don't have enough history, we can't predict accurately with this N.
      // For simplicity in this UI, we might fallback or just return empty.
      // But let's try to match strictly first.
      context = relevantHistory.join(" ");
    } 
    // For n=1, context is always ""

    if (!this.model.has(context)) {
      return [];
    }

    const nextCounts = this.model.get(context)!;
    let total = 0;
    nextCounts.forEach((c) => total += c);

    const stats: NGramStats[] = [];
    nextCounts.forEach((count, token) => {
      stats.push({
        token,
        count,
        probability: count / total
      });
    });

    return stats.sort((a, b) => b.probability - a.probability);
  }

  public generate(history: string[], method: 'greedy' | 'random' = 'greedy'): string | null {
    const stats = this.getNextTokenStats(history);
    if (stats.length === 0) return null;

    if (method === 'greedy') {
      return stats[0].token;
    } else {
      // Simple weighted random selection
      const r = Math.random();
      let accum = 0;
      for (const stat of stats) {
        accum += stat.probability;
        if (r <= accum) return stat.token;
      }
      return stats[stats.length - 1].token;
    }
  }
  
  public getN(): number {
    return this.n;
  }
}
