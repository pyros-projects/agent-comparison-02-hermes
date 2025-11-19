Your task is to build a small but polished web app that helps non-technical users understand the *very early* history and mechanics of text-based generative AI.

The focus is on:
1. N-gram models.
2. Text generation via a simple genetic algorithm.
3. A third important concept of text generation AI of your own choosing, including explanations, visualizations, and interactive experimentation.

The app should be visually modern, responsive, and feel like a “state of the art” UI.

====================
1. HIGH-LEVEL GOAL
====================

Build a browser-based interactive playground that:

- Teaches laypeople the basics of early text generation approaches.
- Lets them *see* and *feel* how these methods work by experimenting with them.
- Explains what is happening in plain language, with as little math as possible but without being misleading.
- Has a clean, modern, professional UI.

Assume users:
- May have zero coding or math background.
- Are curious and willing to play with sliders, buttons, and small experiments.
- Learn best via “change parameter → see output change → read short explanation.”

===========================
2. OVERALL APP STRUCTURE
===========================

Create a single-page web app with three main sections, accessible via a top or side navigation:

1. “N-gram Lab”
2. “Genetic Text Lab”
3. “Mystery Lab” (your chosen third topic, renamed to something user-friendly)

Plus:
- A minimal landing/introduction section that explains the app in 2–3 short paragraphs and then leads users into the labs.

Use a modern SPA approach (for example: React + TypeScript + a utility-first CSS framework like Tailwind, or a similarly “state of the art” setup). You can choose the stack, but it must:
- Be widely used and idiomatic.
- Have a clean, maintainable structure.
- Be easy to extend with more labs later.

If you use a backend (for heavier computation), keep it simple (e.g. Python/FastAPI) and clearly separate API and frontend.

==========================
3. N-GRAM LAB (REQUIRED)
==========================

Purpose: Let users play with simple n-gram language models and understand:

- What an n-gram is.
- How “next word prediction by counting” works.
- How context length (n) changes behavior (more coherent vs. more repetitive/overfitting).

Features:

1. **Text corpus input**
   - Provide:
     - A few built-in example corpora (e.g., nursery rhyme, short story excerpt, some technical text).
     - A simple textarea where users can paste their own text.
   - Show corpus stats: number of tokens, distinct tokens, etc.

2. **N-gram configuration**
   - Slider or dropdown for n: 1-gram, 2-gram, 3-gram, 4-gram.
   - Option to switch between “word-based” and “character-based” n-grams (if reasonable).
   - A toggle to show/hide rare n-grams (for visualization clarity).

3. **Generation playground**
   - User types a short prompt (starting text).
   - User sets:
     - Max length (e.g., 20–200 tokens/chars).
     - Simple randomness setting (e.g., “greedy” vs “random with temperature-like slider”).
   - On “Generate”, display:
     - The generated text.
     - Highlight color for each new token that shows which n-gram context was used.

4. **Visualization & explanation**
   - A small panel that:
     - Shows a simple visualization of the n-gram counts (e.g., bar chart of most common next words after a context, or a simple graph).
     - Provides textual explanation like:
       - “You are using a 3-gram model, which looks at the last 2 words to predict the next one.”
       - “Notice how with n=1 the model ignores context and just uses global frequencies.”
   - Keep explanations short, readable, and in plain language.

5. **Educational content**
   - Add a short “What is an n-gram model?” box with:
     - 2–3 paragraphs of beginner-friendly text.
     - A couple of bullet points summarizing strengths/weaknesses.
     - One explicit link to how this relates to early language modeling vs modern neural models.

=================================
4. GENETIC TEXT LAB (REQUIRED)
=================================

Purpose: Demonstrate a *genetic algorithm* used for text generation/optimization, so users can see:

- Population, fitness, selection, crossover, mutation.
- How iterative improvement feels.
- That we can “evolve” text toward a target behavior (e.g., matching a target sentence or optimizing some scoring function).

Features:

1. **Concept & mode selection**
   - Give users two modes:
     1. “Evolve towards a target sentence” (e.g., classic “evolve to match this phrase exactly”).
     2. “Evolve towards a scoring function” (e.g., match certain letters, or length, or use specific words).
   - UI to choose target sentence or define simple scoring rules.

2. **Algorithm parameters**
   - Sliders or inputs for:
     - Population size.
     - Number of generations.
     - Mutation rate.
     - Crossover rate (or probability).
   - Reasonable defaults so users can just click “Run” to see something cool.

3. **Run & visualize evolution**
   - Start/Stop button.
   - Show per generation:
     - Best candidate string.
     - Average fitness and best fitness (simple line chart over generations).
   - Allow step-by-step mode (“Next generation”) and auto-run mode (animated).

4. **Explain GA concepts**
   - A short explanation panel that covers:
     - What a population is.
     - What fitness means.
     - What selection, crossover, and mutation are.
   - Use simple analogies (e.g., evolution, breeding, random mutations).

5. **Connect to generative text**
   - Add 1–2 paragraphs explaining:
     - Why genetic algorithms were interesting for early text generation or optimization.
     - How this differs from probabilistic models like n-grams and from modern neural LMs.

==================================================
5. MYSTERY LAB (YOUR CHOICE, BUT EXPLAINED WELL)
==================================================

Here, *you* (the coding agent) must pick a third important concept related to text generation AI that:

- Is historically or conceptually important.
- Is implementable in a lightweight way (no huge models).
- Can be explained visually and interactively to laypeople.

Examples of suitable topics (you can choose one of these or propose your own):
- Temperature and sampling strategies (greedy vs. sampling vs. top-k/top-p) using a tiny toy probability distribution.
- Beam search vs. greedy decoding, on a small toy sequence model.
- Simple Markov chain vs. “true” LM: when memory matters.
- A tiny RNN or simple feed-forward LM trained on a tiny corpus (if kept minimal and local).

REQUIREMENTS FOR THIS LAB:

1. **Before coding, think and explain**
   - Think of 3 candidate topics.
   - Pick one based on:
     - Conceptual importance.
     - Ease of implementation.
     - Educational clarity for laypeople.
   - In comments or a README section, briefly explain:
     - Why you chose this topic.
     - How you plan to illustrate it interactively.

2. **Interactive controls**
   - Provide at least:
     - 2–3 parameters the user can change.
     - A clear visualization that changes when parameters change.
     - A short textual explanation of the effect.

3. **Comparison + reflection**
   - Somewhere in the UI, include a short “How this relates to n-grams & GA” explanation:
     - 3–6 bullet points or a short paragraph comparing this lab’s method to the other two.

===================================
6. UI / UX & IMPLEMENTATION GUIDES
===================================

User experience:

- The UI should feel like a modern, polished, single-page playground:
  - Clear typography, good spacing, and responsive layout.
  - Light/dark mode optional but nice to have.
  - Use charts/graphs where helpful (e.g., n-gram counts, GA fitness over time).
- Avoid clutter; use tabs/accordions or collapsible panels for advanced settings.
- Each lab should have:
  - “What is this?” intro section.
  - “Playground” section (controls + outputs).
  - “What did you just see?” summary section.

Technical guidelines:

- Use a modern front-end stack (e.g., React + TypeScript) with a clear component structure.
- Prefer client-side computation for n-gram and GA where feasible.
- If you introduce a backend:
  - Keep endpoints small and stateless.
  - Document each endpoint’s purpose and request/response format briefly.

Accessibility & performance:

- The app should run smoothly in a modern browser without special hardware.
- Avoid huge dependencies unless necessary.
- Make UI controls keyboard-accessible and ensure good contrast.

=================
7. DELIVERABLES
=================

Produce:

1. A working web app with:
   - Landing page.
   - N-gram Lab.
   - Genetic Text Lab.
   - Mystery Lab (your chosen topic).

2. Source code:
   - Clean, idiomatic, and structured (components, hooks, etc.).
   - With clear comments where logic might be non-obvious.

3. Documentation:
   - A concise README describing:
     - What the app does.
     - How to run it locally.
     - A short description of each lab and what the user will learn.
   - Optional: a short “Developer Notes” section explaining design decisions.

4. Basic tests:
   - At least a handful of unit tests or integration tests for the core logic (e.g., n-gram generation, GA step, mystery lab core algorithm).

====================
8. WORKING STYLE
====================

- First, outline the architecture and chosen tech stack in a README or comments.
- Then implement feature by feature, starting with:
  1. N-gram Lab core logic and UI.
  2. Genetic Text Lab core logic and UI.
  3. Mystery Lab design and implementation.
- Continuously keep the codebase clean and small; aim for pedagogical clarity over clever tricks.

Your primary metric of success: A non-technical person can open the app, play for 20–30 minutes, and walk away with an intuitive understanding of how early text generation methods work and why modern models are such a leap beyond them.
