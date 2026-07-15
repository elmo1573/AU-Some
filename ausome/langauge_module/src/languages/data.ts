import { LanguagePack, LanguageCode, RewardItem, MontessoriProduct } from '../types';

import englishJson from './english.json';
import spanishJson from './spanish.json';
import germanJson from './german.json';
import chineseJson from './chinese.json';
import arabicJson from './arabic.json';

export const SUPPORTED_LANGUAGES: Record<LanguageCode, { name: string; nativeName: string; flag: string }> = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
};

export const LANGUAGE_PACKS: Record<LanguageCode, LanguagePack> = {
  en: englishJson as unknown as LanguagePack,
  es: spanishJson as unknown as LanguagePack,
  de: germanJson as unknown as LanguagePack,
  zh: chineseJson as unknown as LanguagePack,
  ar: arabicJson as unknown as LanguagePack,
};

export const REWARD_SHOP_ITEMS: RewardItem[] = [
  { id: 'r_cowboy', name: 'Cowboy Hat', category: 'hats', cost: 15, emoji: '🤠', description: 'A cute wooden-style toy cowboy hat for your avatar.' },
  { id: 'r_crown', name: 'Golden Crown', category: 'hats', cost: 30, emoji: '👑', description: 'A royal crown to show your amazing speaking streak.' },
  { id: 'r_detective', name: 'Detective Cap', category: 'hats', cost: 20, emoji: '🕵️', description: 'Perfect for exploring vocabulary banks.' },
  { id: 'r_explorer', name: 'Explorer Outfit', category: 'outfits', cost: 25, emoji: '🥾', description: 'Sturdy boots and khaki vest for nature walks.' },
  { id: 'r_artist', name: 'Artist Apron', category: 'outfits', cost: 15, emoji: '🎨', description: 'An apron splattered with bright, creative paint.' },
  { id: 'r_bunny', name: 'Bunny Ears', category: 'hair', cost: 12, emoji: '🐰', description: 'Soft fluffy ears that respond to happy moments.' },
  { id: 'r_bonsai', name: 'Bonsai Tree', category: 'decorations', cost: 18, emoji: '🪴', description: 'A calm, green plant for your digital sensory room.' },
  { id: 'r_aquarium', name: 'Mini Aquarium', category: 'decorations', cost: 40, emoji: '🐟', description: 'A peaceful aquarium with small swimming fish.' },
  { id: 'r_lavender_theme', name: 'Lavender Mood', category: 'themes', cost: 20, emoji: '🪻', description: 'Change your AAC board theme to soft twilight lavender.' },
  { id: 'r_cream_theme', name: 'Montessori Sand', category: 'themes', cost: 10, emoji: '🪵', description: 'A beautiful warm cream and light woodgrain AAC board theme.' },
];

export const MONTESSORI_PRODUCTS: MontessoriProduct[] = [
  {
    id: 'm_movable',
    title: 'Large Movable Alphabet (English)',
    description: 'Beautifully crafted wooden letter boxes in sensory contrast colors (red consonants, blue vowels) to help children compose words physically before writing.',
    url: 'https://ksmontessori.com.pk/product/large-moevable-alphabets/',
    emoji: '🔤',
    highlightText: 'Fine Motor & Spatial Integration'
  },
  {
    id: 'm_sandpaper',
    title: 'Sandpaper Letters (English)',
    description: 'Tactile sandpaper-textured cards mounted on smooth wooden boards. Children trace the letter shapes with their fingers to create physical muscle memory of speech sounds.',
    url: 'https://ksmontessori.com.pk/product/sandpaper-letter-english/',
    emoji: '🖐️',
    highlightText: 'Multi-Sensory Tracing'
  }
];

export const REAL_WORLD_PRACTICE_CHECKLIST = [
  { id: 'ch_1', label: 'Use an AAC button ("Help" or "Please") to request something in real life.', points: 10 },
  { id: 'ch_2', label: 'Identify a real-world object from the "Food" bank during lunch.', points: 10 },
  { id: 'ch_3', label: 'Say "Thank you" or sign it to a family member or teacher today.', points: 15 },
  { id: 'ch_4', label: 'Point out a "Nature" bank item (like a tree or cloud) while outdoors.', points: 10 },
  { id: 'ch_5', label: 'Use the Sentence Builder in the app to show a parent how you feel today.', points: 15 },
];
