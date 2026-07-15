export interface Profile {
  id: string;
  name: string;
  avatar: string;
  currentLevel: number; // 1 to 50
  points: number;
  coins: number;
  xp: number;
  unlockedThemes: string[];
  badges: string[];
  certificates: Certificate[];
  streak: number;
  lastLoginDate: string | null; // YYYY-MM-DD
}

export interface LevelConfig {
  level: number;
  cardsCount: number;
  pairsCount: number;
  theme: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Mastery";
  description?: string;
}

export interface Card {
  id: string;
  uniqueId: string; // unique for each card instance on board
  iconName: string; // lucide icon name
  colorCode: string; // which color theme to use
  isMatched: boolean;
  isFlipped: boolean;
  points?: number; // for mastery level near-matches (e.g. 5 vs 6)
  styleVariant?: "solid" | "striped" | "dotted" | "waved"; // pattern variants for Levels 21-30
}

export interface GameState {
  currentLevel: number;
  cards: Card[];
  selectedIndices: number[]; // currently flipped cards index
  points: number;
  coins: number;
  xp: number;
  matches: number;
  errors: number;
  rapidErrorsCount: number; // consecutive rapid errors
  lastErrorTime: number | null; // timestamp of last mismatch
  isSensoryOverloadTriggered: boolean; // silent sensory mode
  isCompleted: boolean;
  startTime: number;
  timeSpent: number;
  hintPair: string[] | null; // [id1, id2] currently highlighted for hint
}

export interface SensoryLog {
  id: string;
  date: string;
  time: string;
  level: number;
  errorCount: number;
  triggerReason: string;
}

export interface ProgressLog {
  id: string;
  date: string;
  sessionTime: number; // seconds
  level: number;
  rapidErrors: number;
  sensoryTrigger: boolean;
  pointsEarned: number;
  completed: boolean;
}

export interface Certificate {
  id: string;
  level: number;
  date: string;
  childName: string;
  theme: string;
  achievement: string;
  stageName: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  isMega: boolean;
  dateEarned: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  requiredValue: number;
  currentValue: number;
  isUnlocked: boolean;
  rewardCoins: number;
}
