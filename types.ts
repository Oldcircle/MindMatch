
export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  WON = 'WON',
  GAME_OVER = 'GAME_OVER',
  LOADING = 'LOADING',
}

export type Language = 'en' | 'zh';

export type GameMode = 'casual' | 'level';

export interface CardItem {
  id: string;
  content: string; // Emoji or text
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: CardItem[];
  flippedIds: string[];
  matchedPairs: number;
  moves: number;
  timer: number;
  status: GameStatus;
  themeName: string;
  level: number;
  score: number;
}

export interface Theme {
  name: string;
  items: string[];
  colorFrom: string;
  colorTo: string;
}

export type AIProvider = 'google' | 'openai' | 'ollama';

export interface AIConfig {
  id: string;
  name: string;
  provider: AIProvider;
  apiKey: string;
  baseUrl: string;
  modelName: string;
}

export interface DifficultyLevel {
  pairs: number;
  timeLimit: number; // seconds (required now)
  nameKey: string;
}

export interface CasualDifficulty {
  id: string;
  nameKey: string;
  pairs: number;
  cols: number; // For grid layout hints
}

export interface GameRecord {
  date: number;
  score?: number;
  moves?: number;
  time?: number;
  level?: number;
}

export interface GameRecords {
  casual: Record<string, GameRecord>; // Keyed by difficulty ID
  level: {
    maxLevel: number;
    highScore: number;
    history: GameRecord[];
  };
}
