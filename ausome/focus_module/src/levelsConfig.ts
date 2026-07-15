import { LevelConfig } from "./types";

export const THEMES = [
  "Shapes",
  "Nature",
  "Ocean",
  "Space",
  "Animals",
  "Fruits",
  "Weather",
  "Music",
  "Robots",
  "Transportation",
  "Forest",
  "Galaxy",
  "Garden",
  "Autumn",
  "Spring"
];

// Map themes to Lucide icon pools
export const THEME_ICONS: Record<string, { icon: string; label: string }[]> = {
  Shapes: [
    { icon: "Circle", label: "Circle" },
    { icon: "Square", label: "Square" },
    { icon: "Triangle", label: "Triangle" },
    { icon: "Heart", label: "Heart" },
    { icon: "Star", label: "Star" },
    { icon: "Diamond", label: "Diamond" },
    { icon: "Pentagon", label: "Pentagon" }, // We'll render standard shapes cleanly
    { icon: "Shield", label: "Shield" },
    { icon: "Moon", label: "Crescent" },
    { icon: "Octagon", label: "Octagon" }
  ],
  Nature: [
    { icon: "Leaf", label: "Leaf" },
    { icon: "Sun", label: "Sun" },
    { icon: "Flower", label: "Flower" },
    { icon: "Cloud", label: "Cloud" },
    { icon: "Sparkles", label: "Sparkles" },
    { icon: "Flame", label: "Flame" },
    { icon: "Snowflake", label: "Snowflake" },
    { icon: "Droplet", label: "Water" }
  ],
  Ocean: [
    { icon: "Fish", label: "Fish" },
    { icon: "Waves", label: "Waves" },
    { icon: "Anchor", label: "Anchor" },
    { icon: "Ship", label: "Ship" },
    { icon: "Compass", label: "Compass" },
    { icon: "Droplets", label: "Bubbles" },
    { icon: "Wind", label: "Sea Wind" }
  ],
  Space: [
    { icon: "Moon", label: "Moon" },
    { icon: "Rocket", label: "Rocket" },
    { icon: "Globe", label: "Earth" },
    { icon: "Telescope", label: "Telescope" },
    { icon: "Sun", label: "Sun" },
    { icon: "Orbit", label: "Orbit" },
    { icon: "Sparkles", label: "Stars" } // Valid Lucide replacement for MilkyWay
  ],
  Animals: [
    { icon: "Cat", label: "Cat" },
    { icon: "Dog", label: "Dog" },
    { icon: "Bird", label: "Bird" },
    { icon: "Fish", label: "Fish" },
    { icon: "Rabbit", label: "Rabbit" },
    { icon: "Snail", label: "Snail" },
    { icon: "Bug", label: "Ladybug" }
  ],
  Fruits: [
    { icon: "Apple", label: "Apple" },
    { icon: "Cherry", label: "Cherry" },
    { icon: "Grape", label: "Grape" },
    { icon: "Citrus", label: "Orange" },
    { icon: "Sprout", label: "Fruit Sprout" }, // Valid Lucide replacement
    { icon: "Leaf", label: "Fruit Leaf" } // Valid Lucide replacement
  ],
  Weather: [
    { icon: "Sun", label: "Sunny" },
    { icon: "Cloud", label: "Cloudy" },
    { icon: "CloudRain", label: "Rain" },
    { icon: "CloudSnow", label: "Snow" },
    { icon: "CloudLightning", label: "Storm" },
    { icon: "Wind", label: "Windy" },
    { icon: "Umbrella", label: "Umbrella" },
    { icon: "Rainbow", label: "Rainbow" }
  ],
  Music: [
    { icon: "Music", label: "Note" },
    { icon: "Mic", label: "Microphone" },
    { icon: "AudioLines", label: "Soundwave" },
    { icon: "Speaker", label: "Speaker" },
    { icon: "Disc", label: "Vinyl" },
    { icon: "Bell", label: "Bell" }
  ],
  Robots: [
    { icon: "Bot", label: "Robot" },
    { icon: "Cpu", label: "Chip" },
    { icon: "Cable", label: "Wire" },
    { icon: "Wrench", label: "Wrench" },
    { icon: "Hammer", label: "Hammer" },
    { icon: "Battery", label: "Battery" }
  ],
  Transportation: [
    { icon: "Car", label: "Car" },
    { icon: "Bus", label: "Bus" },
    { icon: "Train", label: "Train" },
    { icon: "Plane", label: "Airplane" },
    { icon: "Ship", label: "Ship" },
    { icon: "Truck", label: "Truck" },
    { icon: "Bike", label: "Bicycle" },
    { icon: "Rocket", label: "Rocket" }
  ],
  Forest: [
    { icon: "TreePine", label: "Pine Tree" },
    { icon: "Trees", label: "Forest" },
    { icon: "Leaf", label: "Leaf" }, // Valid Lucide replacement
    { icon: "Mountain", label: "Mountain" },
    { icon: "Compass", label: "Compass" }
  ],
  Galaxy: [
    { icon: "Atom", label: "Constellation" },
    { icon: "Orbit", label: "Galaxy" },
    { icon: "Rocket", label: "Shuttle" },
    { icon: "Moon", label: "Night" } // Valid Lucide replacement
  ],
  Garden: [
    { icon: "Flower", label: "Flower" },
    { icon: "Sprout", label: "Sprout" },
    { icon: "GlassWater", label: "Watering" },
    { icon: "Bug", label: "Butterfly" },
    { icon: "Sun", label: "Sunshine" }
  ],
  Autumn: [
    { icon: "Leaf", label: "Autumn Leaf" },
    { icon: "CloudRain", label: "Rainy Day" },
    { icon: "Flame", label: "Fireplace" },
    { icon: "Wind", label: "Breeze" }
  ],
  Spring: [
    { icon: "Sprout", label: "New Growth" },
    { icon: "Flower", label: "Bloom" },
    { icon: "Sun", label: "Warm Sun" },
    { icon: "Bird", label: "Robin" }
  ]
};

// Generates 100 levels dynamically with difficulty increasing every 5 levels after Level 5
export const getLevelsConfig = (maxLevelNeeded: number = 100): LevelConfig[] => {
  const configs: LevelConfig[] = [];
  const targetMax = 100; // Limit strictly to 100 levels
  
  for (let lvl = 1; lvl <= targetMax; lvl++) {
    let cardsCount = 6;
    let pairsCount = 3;
    let difficulty: "Easy" | "Medium" | "Hard" | "Mastery" = "Easy";
    const theme = THEMES[(lvl - 1) % THEMES.length];
    let description = "";

    if (lvl <= 5) {
      // Levels 1-5: Easy Starting Foundation
      cardsCount = 6; // 3 pairs
      difficulty = "Easy";
      description = `Easy start stage: Very large cards, simple shapes, and gentle sounds. Perfect to build initial focus.`;
    } else {
      // After level 5, difficulty increases every 5 levels.
      // Every 5 levels represents a tier of increased focus difficulty.
      const tier = Math.floor((lvl - 6) / 5) + 1; 
      
      // Cards count scales up by 2 for each 5-level tier, maxing out at 24 to keep the screen sensory-friendly
      cardsCount = 6 + (tier * 2);
      if (cardsCount > 24) {
        cardsCount = 24; // Cap at 24 cards (12 pairs) so the screen stays calm and readable
      }
      
      pairsCount = cardsCount / 2;
      
      // Map tiers to appropriate Difficulty categories
      if (tier <= 2) {
        // Levels 6-15 (8 to 10 cards)
        difficulty = "Medium";
        description = `Steady progress: Slightly more cards (${cardsCount}) to test your attention using lovely ${theme} icons.`;
      } else if (tier <= 5) {
        // Levels 16-30 (12 to 16 cards)
        difficulty = "Hard";
        description = `Deep Focus: Shuffling cards with complex ${theme} figures. Keep calm and take your time.`;
      } else {
        // Levels 31-100 (18 to 24 cards)
        difficulty = "Mastery";
        description = `Mastery Challenge: Spot similar shapes and background patterns in the wonderful ${theme} environment.`;
      }
    }

    configs.push({
      level: lvl,
      cardsCount,
      pairsCount,
      theme,
      difficulty,
      description
    });
  }
  
  return configs;
};

export interface BadgeInfo {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

// Generates a distinct and vibrant badge for every level completed
export const getBadgeForLevel = (level: number, theme: string): BadgeInfo => {
  const adjectives = [
    "Bright", "Golden", "Radiant", "Joyful", "Super", "Mighty", "Sparkly", "Cosmic", "Gentle", "Brave",
    "Smart", "Focused", "Happy", "Sweet", "Wise", "Kind", "Calm", "Cool", "Magic", "Royal",
    "Breezy", "Sunny", "Playful", "Honored", "Silly", "Cute", "Friendly", "Active", "Deep", "Zen"
  ];
  
  const nouns = [
    "Champion", "Explorer", "Master", "Hero", "Star", "Buddy", "Wizard", "Winner", "Captain", "Navigator",
    "Seeker", "Pioneer", "Helper", "Protector", "Friend", "Genius", "Artist", "Ninja", "Ranger", "Guru"
  ];
  
  const adjIndex = (level * 3 + theme.length) % adjectives.length;
  const nounIndex = (level * 7 + theme.length * 2) % nouns.length;
  
  const title = `Level ${level}: ${adjectives[adjIndex]} ${theme} ${nouns[nounIndex]}`;
  const description = `Awarded for successfully finishing Level ${level} in the ${theme} adventure!`;
  
  // Icon based on theme/level
  let iconName = "Award";
  if (level % 4 === 0) iconName = "Trophy";
  else if (level % 4 === 1) iconName = "Star";
  else if (level % 4 === 2) iconName = "ShieldCheck";
  else if (level % 4 === 3) iconName = "Flame";

  return {
    id: `level_badge_${level}`,
    title,
    description,
    iconName
  };
};
