export const ASCENDANTS = [
  {
    id: 'solis',
    name: 'Solis',
    title: 'The Sun Guardian',
    description: 'A radiant being of pure energy and warmth. Masters of focus and vitality.',
    color: '#F59E0B',
    starter: true,
  },
  {
    id: 'lumis',
    name: 'Lumis',
    title: 'The Light Weaver',
    description: 'Ethereal creatures of luminescence. Known for clarity and insight.',
    color: '#EA580C',
    starter: true,
  },
  {
    id: 'noctis',
    name: 'Noctis',
    title: 'The Night Scholar',
    description: 'Mysterious beings thriving in darkness. Deep thinkers and strategists.',
    color: '#8B5CF6',
    starter: false,
  },
  {
    id: 'terra',
    name: 'Terra',
    title: 'The Earth Keeper',
    description: 'Grounded and steadfast. Embody patience and resilience.',
    color: '#10B981',
    starter: false,
  },
  {
    id: 'aqua',
    name: 'Aqua',
    title: 'The Flow Master',
    description: 'Fluid and adaptable beings. Champions of continuous momentum.',
    color: '#06B6D4',
    starter: false,
  },
  {
    id: 'aether',
    name: 'Aether',
    title: 'The Cosmic Sage',
    description: 'Ancient beings of cosmic wisdom. Ultimate form of focus mastery.',
    color: '#EC4899',
    starter: false,
  },
] as const;

export const EVOLUTION_STAGES = [
  { stage: 0, name: 'Hatchling', requiredLevel: 1 },
  { stage: 1, name: 'Awakened', requiredLevel: 10 },
  { stage: 2, name: 'Ascended', requiredLevel: 25 },
  { stage: 3, name: 'Transcendent', requiredLevel: 50 },
] as const;

export const XP_PER_LEVEL = 100;

export const SESSION_DURATIONS = [
  { minutes: 25, label: '25 min', xp: 25 },
  { minutes: 50, label: '50 min', xp: 50 },
] as const;
