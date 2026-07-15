/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Level, ShopItem, AchievementBadge } from './types';

export const LEVELS: Level[] = [
  {
    id: 1,
    activityType: 'rods',
    title: 'Short & Long Rods',
    subtitle: 'Rods 1 to 3',
    instruction: 'Arrange the Montessori red and blue rods from the smallest to the largest on the shelf.',
    targetNumbers: [1, 2, 3],
    difficulty: 'easy'
  },
  {
    id: 2,
    activityType: 'beads',
    title: 'Counting Bead Stair',
    subtitle: 'Numbers 1 to 5',
    instruction: 'Count the beautiful colored beads and click the number card that matches them.',
    targetNumbers: [1, 2, 3, 4, 5],
    difficulty: 'easy',
    mathMode: 'count'
  },
  {
    id: 3,
    activityType: 'teen-ten',
    title: 'Building Teen Numbers',
    subtitle: 'Numbers 11 to 15',
    instruction: 'Drag the correct unit card over the 0 on the ten board to build the target number.',
    targetNumbers: [11, 12, 13, 14, 15],
    difficulty: 'easy'
  },
  {
    id: 4,
    activityType: 'rods',
    title: 'The Great Rod Shelf',
    subtitle: 'Rods 1 to 5',
    instruction: 'Put the colorful rods in order starting from the smallest at the top to the largest at the bottom.',
    targetNumbers: [1, 2, 3, 4, 5],
    difficulty: 'medium'
  },
  {
    id: 5,
    activityType: 'beads',
    title: 'Short Bead Stair Master',
    subtitle: 'Numbers 1 to 10',
    instruction: 'Count the beads in the stair and match them with their corresponding number cards.',
    targetNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    difficulty: 'medium',
    mathMode: 'count'
  },
  {
    id: 6,
    activityType: 'teen-ten',
    title: 'Teen Board Explorer',
    subtitle: 'Numbers 16 to 19',
    instruction: 'Make the teen number by sliding the unit number on top of the golden ten board.',
    targetNumbers: [16, 17, 18, 19],
    difficulty: 'medium'
  },
  {
    id: 7,
    activityType: 'teen-ten',
    title: 'Twenty & Thirty Boards',
    subtitle: 'Numbers 20 to 39',
    instruction: 'Combine twenty or thirty boards with units to build double-digit numbers!',
    targetNumbers: [21, 25, 28, 32, 35, 37],
    difficulty: 'medium'
  },
  {
    id: 8,
    activityType: 'beads',
    title: 'Bead Addition Adventures',
    subtitle: 'Adding Bead Bars Together',
    instruction: 'Count both colored bead bars together to solve the addition equation!',
    targetNumbers: [5, 6, 7, 8, 9], // results of additions: 3+2, 4+2, 5+3, etc.
    difficulty: 'medium',
    mathMode: 'addition'
  },
  {
    id: 9,
    activityType: 'rods',
    title: 'The Grand Rod Masterpiece',
    subtitle: 'Rods 1 to 10',
    instruction: 'Arrange all ten Montessori rods in order from smallest to largest to complete the shelf.',
    targetNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    difficulty: 'hard'
  },
  {
    id: 10,
    activityType: 'teen-ten',
    title: 'Forty & Fifty Boards',
    subtitle: 'Numbers 40 to 59',
    instruction: 'Build numbers in the forty and fifty family! Slide the correct unit on the board.',
    targetNumbers: [42, 45, 48, 51, 54, 59],
    difficulty: 'medium'
  },
  {
    id: 11,
    activityType: 'beads',
    title: 'Bead Subtraction Stars',
    subtitle: 'Taking Away Beads',
    instruction: 'Look at the bead bar and take away beads to solve the subtraction equation!',
    targetNumbers: [2, 3, 4, 5, 6], // results of subtractions
    difficulty: 'hard',
    mathMode: 'subtraction'
  },
  {
    id: 12,
    activityType: 'beads',
    title: 'Bead Multiplication Fun',
    subtitle: 'Groups of Beads',
    instruction: 'Count the repeating groups of colored bead bars to solve the multiplication equation!',
    targetNumbers: [4, 6, 8, 9, 10], // results of multiplications: 2x2, 2x3, 2x4, 3x3, 2x5
    difficulty: 'hard',
    mathMode: 'multiplication'
  },
  {
    id: 13,
    activityType: 'beads',
    title: 'Bead Division Champion',
    subtitle: 'Sharing Beads Equally',
    instruction: 'Split the bead bar into equal groups to find the division answer!',
    targetNumbers: [2, 3, 4, 5], // results of division
    difficulty: 'hard',
    mathMode: 'division'
  },
  {
    id: 14,
    activityType: 'teen-ten',
    title: 'Sixty to Eighty Boards',
    subtitle: 'Numbers 60 to 89',
    instruction: 'Build numbers in the sixty, seventy, and eighty family using the boards!',
    targetNumbers: [63, 67, 72, 76, 81, 88],
    difficulty: 'hard'
  },
  {
    id: 15,
    activityType: 'teen-ten',
    title: 'The Hundred Board Master',
    subtitle: 'Numbers 90 to 100',
    instruction: 'Master numbers all the way up to 100 on the boards with Mimi Bear!',
    targetNumbers: [91, 95, 99, 100],
    difficulty: 'hard'
  }
];

export const INITIAL_BADGES: AchievementBadge[] = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Completed Level 1 in Number Rods!',
    icon: '🌱',
    unlockedAtLevel: 1,
    unlocked: false
  },
  {
    id: 'bead_friend',
    title: 'Bead Friend',
    description: 'Matched beads successfully!',
    icon: '🍒',
    unlockedAtLevel: 2,
    unlocked: false
  },
  {
    id: 'teen_builder',
    title: 'Teen Builder',
    description: 'Built your first teen number!',
    icon: '🧱',
    unlockedAtLevel: 3,
    unlocked: false
  },
  {
    id: 'rod_architect',
    title: 'Rod Architect',
    description: 'Arranged 5 rods in order!',
    icon: '📐',
    unlockedAtLevel: 4,
    unlocked: false
  },
  {
    id: 'explorer_medal',
    title: 'Explorer Medal',
    description: 'Completed the first Mega Challenge!',
    icon: '🏅',
    unlockedAtLevel: 5,
    unlocked: false
  },
  {
    id: 'double_digit',
    title: 'Double Digit Star',
    description: 'Mastered tens and units!',
    icon: '✨',
    unlockedAtLevel: 7,
    unlocked: false
  },
  {
    id: 'grandmaster',
    title: 'Montessori Grandmaster',
    description: 'Completed Level 10 and all challenges!',
    icon: '👑',
    unlockedAtLevel: 10,
    unlocked: false
  }
];

export const SHOP_ITEMS: ShopItem[] = [
  // Characters / Avatars
  { id: 'char_bear', name: 'Mimi Bear', cost: 0, type: 'character', visual: '🐻', category: 'Characters' },
  { id: 'char_turtle', name: 'Toby Turtle', cost: 10, type: 'character', visual: '🐢', category: 'Characters' },
  { id: 'char_bunny', name: 'Bella Bunny', cost: 20, type: 'character', visual: '🐰', category: 'Characters' },
  { id: 'char_koala', name: 'Kiki Koala', cost: 35, type: 'character', visual: '🐨', category: 'Characters' },

  // Accessories for Avatars
  { id: 'acc_none', name: 'No Hat', cost: 0, type: 'accessory', visual: '❌', category: 'Hats' },
  { id: 'acc_party', name: 'Party Hat', cost: 15, type: 'accessory', visual: '🥳', category: 'Hats' },
  { id: 'acc_crown', name: 'Golden Crown', cost: 30, type: 'accessory', visual: '👑', category: 'Hats' },
  { id: 'acc_chef', name: 'Chef Hat', cost: 25, type: 'accessory', visual: '👨‍🍳', category: 'Hats' },
  { id: 'acc_glasses', name: 'Cool Glasses', cost: 12, type: 'accessory', visual: '🕶️', category: 'Hats' },
  { id: 'acc_wizard', name: 'Wizard Hat', cost: 40, type: 'accessory', visual: '🧙', category: 'Hats' },

  // Stickers for Sticker Book
  { id: 'stk_star', name: 'Shiny Star', cost: 5, type: 'sticker', visual: '⭐', category: 'Stickers' },
  { id: 'stk_balloon', name: 'Red Balloon', cost: 8, type: 'sticker', visual: '🎈', category: 'Stickers' },
  { id: 'stk_flower', name: 'Spring Flower', cost: 8, type: 'sticker', visual: '🌸', category: 'Stickers' },
  { id: 'stk_rocket', name: 'Space Rocket', cost: 15, type: 'sticker', visual: '🚀', category: 'Stickers' },
  { id: 'stk_apple', name: 'Sweet Apple', cost: 6, type: 'sticker', visual: '🍎', category: 'Stickers' },
  { id: 'stk_unicorn', name: 'Magic Unicorn', cost: 25, type: 'sticker', visual: '🦄', category: 'Stickers' },
  { id: 'stk_rainbow', name: 'Rainbow Sticker', cost: 20, type: 'sticker', visual: '🌈', category: 'Stickers' },
  { id: 'stk_heart', name: 'Sparkle Heart', cost: 5, type: 'sticker', visual: '💖', category: 'Stickers' },

  // Background colors
  { id: 'bg_cream', name: 'Warm Cream', cost: 0, type: 'background', visual: 'bg-[#faf8f5]', category: 'Backgrounds' },
  { id: 'bg_sage', name: 'Soft Sage', cost: 15, type: 'background', visual: 'bg-[#e9f0eb]', category: 'Backgrounds' },
  { id: 'bg_yellow', name: 'Sunny Yellow', cost: 15, type: 'background', visual: 'bg-[#fdf9e2]', category: 'Backgrounds' },
  { id: 'bg_blue', name: 'Calm Sky', cost: 25, type: 'background', visual: 'bg-[#e4f0f6]', category: 'Backgrounds' }
];

// Helper to get color of Bead Stair rods in Montessori
export const BEAD_COLORS: { [key: number]: string } = {
  1: '#f87171', // Red
  2: '#4ade80', // Green
  3: '#fca5a5', // Peach/Pink
  4: '#facc15', // Yellow
  5: '#60a5fa', // Light Blue
  6: '#c084fc', // Lilac/Purple
  7: '#f3f4f6', // White
  8: '#b45309', // Brown
  9: '#1d4ed8', // Dark Blue
  10: '#f59e0b' // Golden
};
