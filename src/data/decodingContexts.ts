import type { TokenLogit } from '../lib/sampling'

export interface DecodingContext {
  id: string
  label: string
  prompt: string
  logits: TokenLogit[]
  description: string
}

export const decodingContexts: DecodingContext[] = [
  {
    id: 'story',
    label: 'Story opener',
    prompt: 'Once upon a time',
    description: 'A light fairytale distribution that prefers slow, descriptive words.',
    logits: [
      { token: 'a', logit: 2.1 },
      { token: 'brave', logit: 1.7 },
      { token: 'curious', logit: 1.5 },
      { token: 'kingdom', logit: 1.4 },
      { token: 'princess', logit: 1.6 },
      { token: 'wandered', logit: 1.3 },
      { token: 'quietly', logit: 1.1 },
      { token: 'dragon', logit: 1 },
      { token: 'river', logit: 0.9 },
      { token: 'night', logit: 0.8 },
    ],
  },
  {
    id: 'cyber',
    label: 'Cyberpunk vibe',
    prompt: 'In the neon rain',
    description: 'Higher entropy mix with techy words and abrupt rhythm.',
    logits: [
      { token: 'a', logit: 1.2 },
      { token: 'signal', logit: 1.8 },
      { token: 'glitch', logit: 1.6 },
      { token: 'hacker', logit: 1.4 },
      { token: 'drifts', logit: 1 },
      { token: 'pulse', logit: 1.3 },
      { token: 'smoke', logit: 0.9 },
      { token: 'sparks', logit: 1.1 },
      { token: 'city', logit: 1.5 },
      { token: 'chrome', logit: 1 },
    ],
  },
  {
    id: 'explainer',
    label: 'Neutral explainer',
    prompt: 'In simple terms',
    description: 'Low-variance, explanatory tone to show how greedy decoding behaves.',
    logits: [
      { token: 'the', logit: 2.2 },
      { token: 'idea', logit: 1.7 },
      { token: 'is', logit: 2 },
      { token: 'that', logit: 1.9 },
      { token: 'we', logit: 1.5 },
      { token: 'can', logit: 1.6 },
      { token: 'predict', logit: 1.3 },
      { token: 'next', logit: 1.2 },
      { token: 'word', logit: 1.4 },
      { token: 'by', logit: 1 },
    ],
  },
]
