/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActivityType = 'rods' | 'beads' | 'teen-ten';

export interface Level {
  id: number;
  activityType: ActivityType;
  title: string;
  subtitle: string;
  instruction: string;
  targetNumbers: number[]; // numbers focused in this level
  difficulty: 'easy' | 'medium' | 'hard';
  mathMode?: 'count' | 'addition' | 'subtraction' | 'multiplication' | 'division';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAtLevel: number;
  unlocked: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  type: 'accessory' | 'sticker' | 'background' | 'character';
  visual: string; // Emoji, SVG, or tailwind color
  category: string;
}

export interface StickerPlacement {
  id: string;
  itemId: string;
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  scale: number;
}

export interface Certificate {
  id: string;
  childName: string;
  date: string;
  levelsRange: string; // e.g. "Levels 1–5" or "Levels 6–10"
  title: string; // e.g. "Number Explorer"
  logo: string;
}

export interface GameState {
  currentLevelId: number; // 1 to 10 (fully playable)
  completedLevelIds: number[];
  stars: number;
  coins: number;
  incorrectAttempts: number; // resets on successful level completion
  isEasyMode: boolean; // triggers when incorrectAttempts >= 3
  unlockedItems: string[]; // shop item IDs
  activeAvatar: string; // emoji or SVG key
  activeAccessory: string | null; // accessory item ID
  activeBackground: string; // tailwind color class
  badges: AchievementBadge[];
  certificates: Certificate[];
  stickerPlacements: StickerPlacement[];
  soundVolume: number; // 0 to 1
  isMuted: boolean;
  voiceEnabled: boolean;
  childName: string;
}
