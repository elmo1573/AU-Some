export type LanguageCode = 'en' | 'es' | 'de' | 'zh' | 'ar';

export type VocabCategory =
  | 'actions'
  | 'food'
  | 'feelings'
  | 'home'
  | 'school'
  | 'community'
  | 'nature'
  | 'animals';

export interface VocabularyItem {
  id: string;
  word: string;
  englishWord: string;
  emoji: string;
  phonetic: string;
  category: VocabCategory;
  example: string;
  aacSymbol?: string;
  image?: string;
  audio?: string;
  viseme?: string[];
  difficulty?: number;
}

export interface AACWord {
  id: string;
  label: string;
  emoji: string;
  category: 'needs' | 'action' | 'social' | 'objects' | 'places';
  colorClass: string; // Pastel colors for autism friendliness
}

export interface SentenceBlock {
  id: string;
  label: string;
  emoji: string;
  type: 'starter' | 'action' | 'object' | 'feeling' | 'modifier';
  colorClass: string;
}

export interface LanguagePack {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  welcomeMessage: string;
  subMessage: string;
  categoryLabels: Record<VocabCategory, string>;
  aacWords: AACWord[];
  sentenceBlocks: SentenceBlock[];
  vocabulary: Record<VocabCategory, VocabularyItem[]>;
}

export interface RewardItem {
  id: string;
  name: string;
  category: 'outfits' | 'hair' | 'hats' | 'decorations' | 'themes' | 'voices';
  cost: number;
  emoji: string;
  description: string;
}

export interface MontessoriProduct {
  id: string;
  title: string;
  description: string;
  url: string;
  emoji: string;
  highlightText: string;
}

export interface UserState {
  activeLanguage: LanguageCode;
  instructionLanguage?: LanguageCode;
  stars: number;
  coins: number;
  streak: number;
  masteredWords: string[]; // List of vocabulary item IDs
  aacUsageCount: Record<string, number>; // Maps word label/ID to frequency count
  avatar: {
    hat: string;
    outfit: string;
    decor: string;
    faceColor?: string;
    expression?: string;
  };
  aacTheme: 'classic' | 'warm-cream' | 'pastel-blue' | 'soft-lavender';
  unlockedRewardIds: string[];
  streakUpdatedDate?: string;
  completedRealWorldChecklist: string[];
}
