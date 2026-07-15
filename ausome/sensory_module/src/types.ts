export interface GameProgress {
  completedLevels: number[]; // Array of level IDs completed
  calmStars: number; // Number of stars earned (should match completed count)
  unlockedLevels: number[]; // Array of level IDs unlocked
  achievements: string[]; // List of unlocked achievement IDs
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji representing the achievement
  isUnlocked: boolean;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  instruction: string;
  category: string;
}

// 5 Senses Journeys - 20 levels each = 100 levels total
export const SENSES_INFO = [
  {
    name: "Sight Journey",
    category: "Visual Processing",
    emoji: "👁️",
    color: "#D6E6F2",
    levels: [
      { id: 1, title: "Colour Matching", description: "Match identical pastel colours.", instruction: "Find the matching colour." },
      { id: 2, title: "Shape Matching", description: "Match identical clean shapes.", instruction: "Find the matching shape." },
      { id: 3, title: "Big and Small", description: "Learn to distinguish sizes.", instruction: "Tap the big object." },
      { id: 4, title: "Colour Shades", description: "Arrange shades from light to dark.", instruction: "Put the colours in order, starting from the lightest." },
      { id: 5, title: "Mega Test: Visual Champion", description: "A grand test of colours, shapes, and sizes in a sequence!", instruction: "Solve all three visual quests!" },
      { id: 6, title: "Shadow Matching", description: "Match objects with their dark silhouette.", instruction: "Find the shadow that matches the picture." },
      { id: 7, title: "Find the Different Object", description: "Identify the object that stands out.", instruction: "Find the picture that is different." },
      { id: 8, title: "Pattern Completion", description: "Find the missing object to complete the pattern.", instruction: "What comes next in the pattern?" },
      { id: 9, title: "Spot the Difference", description: "Find a subtle difference between two items.", instruction: "Tap the difference on the right picture." },
      { id: 10, title: "Mega Test: Pattern Master", description: "Complete shadows, odd ones out, and patterns to test your skills!", instruction: "Solve all three pattern quests!" },
      { id: 11, title: "Memory Match", description: "Find pairs of matching sensory cards.", instruction: "Find all the matching cards." },
      { id: 12, title: "Visual Search", description: "Locate a target among other shapes.", instruction: "Find the specific object." },
      { id: 13, title: "Sequence Builder", description: "Order simple stories or growth steps.", instruction: "Put the pictures in the correct order." },
      { id: 14, title: "Emotion Recognition", description: "Identify simple, warm expressions.", instruction: "Which face looks calm?" },
      { id: 15, title: "Mega Test: Cognitive Wizard", description: "An advanced quest combining sequences, emotions, and memories!", instruction: "Complete all three cognitive quests!" },
      { id: 16, title: "Advanced Size Sort", description: "Sort items from smallest to largest.", instruction: "Tap the items in order of size." },
      { id: 17, title: "Nested Shapes Search", description: "Spot shapes hidden inside other shapes.", instruction: "Tap the shape inside." },
      { id: 18, title: "Visual Tracking", description: "Keep your eyes on the drifting star.", instruction: "Follow and tap the star!" },
      { id: 19, title: "Colour Spectrum Sort", description: "Arrange beautiful colors of the rainbow.", instruction: "Order the colors of the spectrum." },
      { id: 20, title: "Mega Test: Sight Grand Explorer", description: "The ultimate sight adventure. Prove your visual mastery!", instruction: "Complete the grand visual explorer quest!" }
    ]
  },
  {
    name: "Sound Journey",
    category: "Auditory Processing",
    emoji: "👂",
    color: "#E2ECE9",
    levels: [
      { id: 21, title: "Gentle Bird Chirp Match", description: "Listen to cozy bird chirps and find the bird.", instruction: "Tap to listen, then find the bird." },
      { id: 22, title: "Raindrop Pitter-Patter", description: "Match the sound of soft rain droplets falling.", instruction: "Match the pitter-patter sound!" },
      { id: 23, title: "Whooshing Wind Echo", description: "Find the sound of gentle wind blowing through trees.", instruction: "Which picture matches the wind?" },
      { id: 24, title: "Animal Sound Hunt", description: "Listen to friendly farm animals and match their face.", instruction: "Which animal makes this sound?" },
      { id: 25, title: "Mega Test: Sound Champion", description: "A sensory auditory test combining birds, rain, and wind sounds!", instruction: "Pass the sound champion test!" },
      { id: 26, title: "Soft Piano Melody Match", description: "Identify the warm, soothing piano note sound.", instruction: "Match the gentle piano sound." },
      { id: 27, title: "Happy Drum Rhythm", description: "Tap in sync with a soft, comforting drum beat.", instruction: "Listen and match the drum beat." },
      { id: 28, title: "Golden Bell Chiming", description: "Identify the sparkling sound of a clean metal bell.", instruction: "Find the ringing bell." },
      { id: 29, title: "Voice Emotion Tone", description: "Listen to friendly words and find the calm voice.", instruction: "Which voice sounds calm?" },
      { id: 30, title: "Mega Test: Rhythm Master", description: "A rhythmic combination of piano keys, drum beats, and sweet bells!", instruction: "Pass the rhythm master test!" },
      { id: 31, title: "Auditory Memory Pairs", description: "Match identical sound pairs behind the cards.", instruction: "Find matching sound pairs." },
      { id: 32, title: "Whispering Forest Sort", description: "Sort whispering leaves and whistling wind sounds.", instruction: "Sort the nature whispers." },
      { id: 33, title: "Loud vs Soft Sorter", description: "Learn to group sounds by how quiet or loud they are.", instruction: "Put the sound in the Soft or Loud box." },
      { id: 34, title: "Quiet Ocean Waves", description: "Identify the relaxing sound of slow sea waves.", instruction: "Match the ocean wave sound." },
      { id: 35, title: "Mega Test: Auditory Wizard", description: "A wizardly test of auditory memory, whisper sorts, and wave sounds!", instruction: "Pass the auditory wizard test!" },
      { id: 36, title: "High vs Low Pitch", description: "Distinguish between high ringing bells and low drum beats.", instruction: "Is the pitch high or low?" },
      { id: 37, title: "Environmental Sound Sort", description: "Sort sounds into indoor room sounds vs outdoor nature sounds.", instruction: "Where does this sound belong?" },
      { id: 38, title: "Humming Bee Tracking", description: "Follow the gentle buzzing bee sound as it floats around.", instruction: "Tap the humming bee." },
      { id: 39, title: "Lullaby Sequence", description: "Arrange the musical notes to complete a sweet lullaby.", instruction: "Complete the lullaby melody." },
      { id: 40, title: "Mega Test: Sound Grand Explorer", description: "The ultimate listening achievement. Showcase your amazing hearing!", instruction: "Complete the grand sound explorer quest!" }
    ]
  },
  {
    name: "Touch Journey",
    category: "Tactile Processing",
    emoji: "🧸",
    color: "#FFF4BD",
    levels: [
      { id: 41, title: "Soft Pillow Match", description: "Find the cushion that is soft and fluffy.", instruction: "Match the soft texture." },
      { id: 42, title: "Rough Brick Sort", description: "Find the bricks that have a rough, coarse surface.", instruction: "Match the rough texture." },
      { id: 43, title: "Smooth Mirror Feel", description: "Find the mirror with a smooth, glossy glass shine.", instruction: "Match the smooth texture." },
      { id: 44, title: "Bumpy Bubble Popping", description: "Pop the cute bubbles on the bumpy sensory wrap.", instruction: "Tap to pop all the bumpy bubbles!" },
      { id: 45, title: "Mega Test: Texture Champion", description: "A tactile test of soft pillows, rough bricks, and bumpy wraps!", instruction: "Pass the texture champion test!" },
      { id: 46, title: "Silky Satin vs Sandpaper", description: "Sort smooth, silky ribbons away from abrasive sandpaper.", instruction: "Sort the silky and scratchy items." },
      { id: 47, title: "Warm Soup vs Cold Ice", description: "Group cozy warm items separate from frosty cold items.", instruction: "Sort by warmth and coldness." },
      { id: 48, title: "Hard Stone vs Soft Cotton", description: "Learn to categorize objects by how hard or soft they feel.", instruction: "Is it hard or soft?" },
      { id: 49, title: "Heavy Sandbox vs Light Feather", description: "Compare weights of heavy sandboxes and light air feathers.", instruction: "Which one is light?" },
      { id: 50, title: "Mega Test: Material Master", description: "A master test sorting warm, heavy, silky, and hard materials!", instruction: "Pass the material master test!" },
      { id: 51, title: "Feeling Hidden Shapes", description: "Identify objects inside a sensory box just by their shadows.", instruction: "What shape is hidden?" },
      { id: 52, title: "Wet Splashing Water", description: "Catch the refreshing water splashes from the gentle fountain.", instruction: "Tap the splashing drops!" },
      { id: 53, title: "Dry Leaf Crunching", description: "Tap the dry autumn leaves to hear and feel their crunch.", instruction: "Crunch all the dry leaves!" },
      { id: 54, title: "Sticky Honey Touch", description: "Recognize sticky honey-glazed items vs clean dry items.", instruction: "Sort the sticky honey treats." },
      { id: 55, title: "Mega Test: Tactile Wizard", description: "A mystical test of hidden shapes, wet splashes, and sticky honey!", instruction: "Pass the tactile wizard test!" },
      { id: 56, title: "Fuzzy Teddy Bear Sort", description: "Identify cozy, fuzzy bears and distinguish from smooth toys.", instruction: "Sort the fuzzy toys." },
      { id: 57, title: "Smooth Pebbles Count", description: "Select the smooth, shiny pebbles from the stony beach.", instruction: "Find the smooth pebbles." },
      { id: 58, title: "Prickly Cactus Caution", description: "Find the pointy, prickly cactus spikes and learn to handle gently.", instruction: "Tap the prickly cactus carefully." },
      { id: 59, title: "Squishy Clay Shapes", description: "Muck around and sort squishy clay toys from firm wooden blocks.", instruction: "Sort the squishy shapes." },
      { id: 60, title: "Mega Test: Touch Grand Explorer", description: "The ultimate touch exploration! Become a true tactile explorer.", instruction: "Complete the grand touch explorer quest!" }
    ]
  },
  {
    name: "Taste & Smell Journey",
    category: "Gustatory & Olfactory",
    emoji: "🍓",
    color: "#F9DEDC",
    levels: [
      { id: 61, title: "Sweet Fruits Match", description: "Identify sweet, delicious berries and honey.", instruction: "Find the sweet treat." },
      { id: 62, title: "Sour Lemon Splash", description: "Spot the sour, mouth-puckering lemon slices.", instruction: "Find the sour lemon." },
      { id: 63, title: "Salty Pretzel Sorting", description: "Identify savory, salty snacks like pretzels and chips.", instruction: "Find the salty snack." },
      { id: 64, title: "Bitter Chocolate Bite", description: "Recognize dark, rich bitter cocoa and coffee beans.", instruction: "Find the bitter item." },
      { id: 65, title: "Mega Test: Flavour Champion", description: "A combined flavor test of sweet, sour, salty, and bitter tastes!", instruction: "Pass the flavour champion test!" },
      { id: 66, title: "Scent of Fresh Rose", description: "Match the beautiful floral perfume of fresh garden roses.", instruction: "Find the sweet rose scent." },
      { id: 67, title: "Peppermint Freshness", description: "Identify the cool, refreshing scent of peppermint leaves.", instruction: "Find the cool peppermint." },
      { id: 68, title: "Warm Vanilla Aroma", description: "Spot the soothing, sweet aroma of warm baking vanilla.", instruction: "Find the sweet vanilla pod." },
      { id: 69, title: "Spicy Cinnamon Scent", description: "Identify the warm, comforting scent of cinnamon bark.", instruction: "Find the cinnamon spice." },
      { id: 70, title: "Mega Test: Scent Master", description: "A scent matching test of fresh roses, cool peppermint, and vanilla!", instruction: "Pass the scent master test!" },
      { id: 71, title: "Fruits vs Veggies Sorter", description: "Group delicious orchard fruits away from fresh garden vegetables.", instruction: "Sort into Fruits or Vegetables." },
      { id: 72, title: "Warm Bakery Cookie", description: "Identify items that smell like freshly baked cookies.", instruction: "Which one smells like cookies?" },
      { id: 73, title: "Breakfast vs Dinner Sorter", description: "Sort morning breakfast items away from evening dinner meals.", instruction: "Sort the food by mealtime." },
      { id: 74, title: "Juicy Orange Squeeze", description: "Spot the tangy citrus scents of oranges and grapefruits.", instruction: "Find the citrus fruit." },
      { id: 75, title: "Mega Test: Culinary Wizard", description: "Sort meals, bake warm cookies, and identify citrus scents!", instruction: "Pass the culinary wizard test!" },
      { id: 76, title: "Scent of Rain Soil", description: "Identify the relaxing earthy aroma of soil after rain.", instruction: "Find the wet rainy soil." },
      { id: 77, title: "Edible vs Non-Edible", description: "Sort items into what is safe to eat vs what is not edible.", instruction: "Sort into Edible or Non-Edible." },
      { id: 78, title: "Hot Soup vs Cold Ice Cream", description: "Sort delicious hot steamed soup away from icy cold dessert treats.", instruction: "Sort by warm vs cold food." },
      { id: 79, title: "Fruity Juice Pairing", description: "Pair colorful fruit juices with the fruit they are squeezed from.", instruction: "Match juice to fruit." },
      { id: 80, title: "Mega Test: Flavour Grand Explorer", description: "The ultimate feast! Show off your taste and smell exploration.", instruction: "Complete the grand flavour explorer quest!" }
    ]
  },
  {
    name: "Focus & Balance Journey",
    category: "Proprioception & Focus",
    emoji: "🧘",
    color: "#E8F5E9",
    levels: [
      { id: 81, title: "Slow Deep Breathing", description: "Inhale and exhale as the calm balloon grows and shrinks.", instruction: "Breathe in and out slowly with the balloon." },
      { id: 82, title: "Floating Balloon Catch", description: "Gently tap the drifting balloon as it floats across the sky.", instruction: "Tap the floating balloon!" },
      { id: 83, title: "Starfish Wave Drift", description: "Follow and tap the friendly starfish drifting in ocean waves.", instruction: "Tap the drifting starfish!" },
      { id: 84, title: "Symmetrical Hand Claps", description: "Tap the glowing hands to create a steady, calming rhythm.", instruction: "Create a steady peaceful rhythm." },
      { id: 85, title: "Mega Test: Balance Champion", description: "Test your deep breathing, balloon catches, and wave drifts!", instruction: "Pass the balance champion test!" },
      { id: 86, title: "Calming Mirror Faces", description: "Look at the expressions and mimic the peaceful, relaxed look.", instruction: "Tap the calm, relaxed mirror face." },
      { id: 87, title: "Slow Leaf Drift Catch", description: "Gently catch the falling autumn leaves as they drift slowly.", instruction: "Tap the falling leaves!" },
      { id: 88, title: "Maze Path Tracing", description: "Guide the tiny ladybug along a straight, peaceful grass path.", instruction: "Trace the path with your finger." },
      { id: 89, title: "Symmetrical Shape Match", description: "Match mirror-image shapes on the left and right sides.", instruction: "Make the sides match perfectly." },
      { id: 90, title: "Mega Test: Focus Master", description: "Show amazing focus by copying calm faces and tracing paths!", instruction: "Pass the focus master test!" },
      { id: 91, title: "Sea Shell Hunt", description: "Search the calm sandy beach to find the hidden pink shell.", instruction: "Find the hidden pink shell." },
      { id: 92, title: "Calming Water Ripples", description: "Create smooth, slow circular ripples in the peaceful pond.", instruction: "Tap the water to make slow ripples." },
      { id: 93, title: "Step Sequence Sync", description: "Tap the footsteps in a slow, steady walking rhythm.", instruction: "Tap in a slow, steady walk." },
      { id: 94, title: "Floating Cloud Assembly", description: "Bring the soft fluffy clouds together to make a cozy shape.", instruction: "Move the clouds together." },
      { id: 95, title: "Mega Test: Focus Wizard", description: "Demonstrate supreme calm finding hidden shells and assembling clouds!", instruction: "Pass the focus wizard test!" },
      { id: 96, title: "Symmetrical Forest Balance", description: "Balance the stones on the left and right to build a neat tower.", instruction: "Balance the stone tower." },
      { id: 97, title: "Starry Sky Constellation", description: "Tap the stars in numerical order to draw a bright constellation.", instruction: "Connect the shining stars in order!" },
      { id: 98, title: "Slow Gentle Swirling", description: "Gently swirl your finger on the screen to paint sand patterns.", instruction: "Draw slow circular sand paths." },
      { id: 99, title: "Deep Peaceful Meditation", description: "Breathe with the golden lotus flower as it opens and closes.", instruction: "Relax and breathe with the lotus." },
      { id: 100, title: "Mega Test: Focus Grand Explorer", description: "The ultimate zen achievement. You are completely focused and calm!", instruction: "Complete the final grand focus explorer quest!" }
    ]
  }
];

// Flatten all levels to a single array of 100 levels
export const LEVELS: Level[] = SENSES_INFO.reduce<Level[]>((acc, sense) => {
  const mappedLevels = sense.levels.map(lvl => ({
    id: lvl.id,
    title: lvl.title,
    description: lvl.description,
    instruction: lvl.instruction,
    category: sense.category
  }));
  return [...acc, ...mappedLevels];
}, []);

export const ACHIEVEMENTS: Omit<Achievement, 'isUnlocked'>[] = [
  { id: "first_activity", title: "First Activity", description: "Completed your first peaceful activity!", icon: "🌸" },
  { id: "mega_level_conquered", title: "Mega Level Champion", description: "Passed a Mega Level checkpoint with flying colours!", icon: "⭐" },
  { id: "sight_journey_completed", title: "Sight Master", description: "Completed all 20 levels in the Sight Journey!", icon: "👁️" },
  { id: "sound_journey_completed", title: "Sound Listener", description: "Completed all 20 levels in the Sound Journey!", icon: "👂" },
  { id: "touch_journey_completed", title: "Tactile Expert", description: "Completed all 20 levels in the Touch Journey!", icon: "🧸" },
  { id: "taste_smell_completed", title: "Flavor Scientist", description: "Completed all 20 levels in Taste & Smell!", icon: "🍓" },
  { id: "focus_movement_completed", title: "Zen Master", description: "Completed all 20 levels in Focus & Balance!", icon: "🧘" },
  { id: "sensory_star", title: "Grand Sensory Explorer", description: "Completed all 100 levels. You are absolutely amazing!", icon: "👑" }
];
