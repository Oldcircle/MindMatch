
import { Theme, AIConfig, DifficultyLevel, CasualDifficulty } from './types';

export const DEFAULT_THEMES: Theme[] = [
  {
    name: "Classic Fruits",
    items: ["🍎", "🍌", "🍇", "🍊", "🍓", "🍉", "🍍", "🥝", "🍒", "🍑", "🥭", "🍋", "🍐", "🍏", "🥥", "🍅", "🥑", "🍆"],
    colorFrom: "from-orange-400",
    colorTo: "to-red-500"
  },
  {
    name: "Space Explorer",
    items: ["🚀", "👨‍🚀", "🪐", "👽", "☄️", "🛰️", "🌑", "🔭", "🌍", "☀️", "🌟", "🛸", "🌌", "👾", "🤖", "🌠", "🎆", "🎇"],
    colorFrom: "from-indigo-500",
    colorTo: "to-purple-600"
  },
  {
    name: "Animals",
    items: ["🐶", "🐱", "🦊", "🐻", "🐼", "🐨", "🦁", "🐯", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇"],
    colorFrom: "from-emerald-400",
    colorTo: "to-teal-500"
  }
];

export const DEFAULT_AI_CONFIGS: AIConfig[] = [
  {
    id: 'default-gemini',
    name: 'Default (Gemini)',
    provider: 'google',
    apiKey: '',
    baseUrl: '',
    modelName: 'gemini-2.5-flash'
  },
  {
    id: 'deepseek-example',
    name: 'DeepSeek',
    provider: 'openai',
    apiKey: '',
    baseUrl: 'https://api.deepseek.com',
    modelName: 'deepseek-chat'
  },
  {
    id: 'local-ollama',
    name: 'Ollama Local',
    provider: 'ollama',
    apiKey: 'ollama', // Often ignored but needed for some clients
    baseUrl: 'http://localhost:11434/v1',
    modelName: 'llama3'
  }
];

export const LEVEL_CONFIGS: DifficultyLevel[] = [
  { pairs: 4, timeLimit: 30, nameKey: 'level_1' },  // 8 cards
  { pairs: 6, timeLimit: 45, nameKey: 'level_2' },  // 12 cards
  { pairs: 8, timeLimit: 60, nameKey: 'level_3' },  // 16 cards
  { pairs: 10, timeLimit: 80, nameKey: 'level_4' }, // 20 cards
  { pairs: 12, timeLimit: 100, nameKey: 'level_5' }, // 24 cards
  { pairs: 15, timeLimit: 140, nameKey: 'level_6' }, // 30 cards
  { pairs: 18, timeLimit: 180, nameKey: 'level_7' }, // 36 cards
];

export const CASUAL_DIFFICULTIES: CasualDifficulty[] = [
  { id: 'easy', nameKey: 'diff_easy', pairs: 6, cols: 3 },    // 3x4
  { id: 'normal', nameKey: 'diff_normal', pairs: 8, cols: 4 },  // 4x4
  { id: 'hard', nameKey: 'diff_hard', pairs: 12, cols: 4 },   // 4x6
  { id: 'master', nameKey: 'diff_master', pairs: 18, cols: 6 }, // 6x6
];

export const CASUAL_PAIRS_COUNT = 8; // Fallback
