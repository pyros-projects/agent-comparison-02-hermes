# AI Text Generation Lab

A modern, interactive playground to teach the fundamentals of early text generation algorithms.

## Features

### 1. N-Gram Lab
Explore how "next-word prediction" works using simple counting statistics.
- **Concepts**: N-grams, Context Window, Probability Distribution.
- **Interaction**: Train models on different corpora (Rhymes, Tech, Dr. Seuss) and generate text.

### 2. Genetic Text Lab
Watch text "evolve" from random noise to a target sentence using biological principles.
- **Concepts**: Population, Mutation, Crossover, Selection, Fitness.
- **Interaction**: Adjust mutation rates and population sizes to see how they affect convergence speed.

### 3. Sampling & Temperature Lab
Understand how AI models choose the next word from a list of possibilities.
- **Concepts**: Logits, Softmax, Temperature, Greedy vs. Random Sampling.
- **Interaction**: Adjust "temperature" to see how it flattens or sharpens the probability distribution.

## Tech Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Visualization**: Recharts
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## License
MIT
