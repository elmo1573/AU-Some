import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import LevelScreen from "./components/LevelScreen";
import Shop from "./components/Shop";
import { GameProgress, LEVELS, ACHIEVEMENTS } from "./types";
import {
  hydrateProfileFromApi,
  loadModuleData,
  saveModuleData,
} from "@shared/profile-client";

const LOCAL_STORAGE_KEY = "ausome_game_progress_v2";

const INITIAL_PROGRESS: GameProgress = {
  completedLevels: [],
  calmStars: 0,
  unlockedLevels: [1, 21, 41, 61, 81], // Unlock the first level of EACH sense by default for an autism-friendly, stress-free choice
  achievements: []
};

export default function App() {
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<"dashboard" | "shop">("dashboard");
  const [progress, setProgress] = useState<GameProgress>(INITIAL_PROGRESS);

  useEffect(() => {
    hydrateProfileFromApi().then(() => {
      const fromProfile = loadModuleData<GameProgress | null>("sensory", null);
      if (fromProfile && Array.isArray(fromProfile.completedLevels)) {
        setProgress(fromProfile);
        return;
      }

      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as GameProgress;
          if (Array.isArray(parsed.completedLevels) && Array.isArray(parsed.unlockedLevels)) {
            setProgress(parsed);
            saveModuleData("sensory", parsed as unknown as Record<string, unknown>);
          }
        }
      } catch (e) {
        console.error("Failed to load progress from localStorage", e);
      }
    });
  }, []);

  // Save progress helper
  const saveProgress = (newProgress: GameProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProgress));
      saveModuleData("sensory", newProgress as unknown as Record<string, unknown>);
    } catch (e) {
      console.error("Failed to save progress to localStorage", e);
    }
  };

  // Reset progress handler
  const handleResetProgress = () => {
    saveProgress(INITIAL_PROGRESS);
    setCurrentLevelId(null);
  };

  // Level completion logic
  const handleLevelComplete = (levelId: number) => {
    // 1. Add to completed levels if not already there
    const updatedCompleted = progress.completedLevels.includes(levelId)
      ? progress.completedLevels
      : [...progress.completedLevels, levelId];

    // 2. Stars is equivalent to completed count
    const updatedStars = updatedCompleted.length;

    // 3. Unlock the next level
    let updatedUnlocked = [...progress.unlockedLevels];
    const nextLevelId = levelId + 1;
    if (nextLevelId <= 100 && !updatedUnlocked.includes(nextLevelId)) {
      updatedUnlocked.push(nextLevelId);
    }

    // 4. Calculate Achievements
    const updatedAchievements = [...progress.achievements];
    
    // First Activity
    if (updatedCompleted.length >= 1 && !updatedAchievements.includes("first_activity")) {
      updatedAchievements.push("first_activity");
    }
    
    // Mega Level Champion (any level divisible by 5)
    if (levelId % 5 === 0 && !updatedAchievements.includes("mega_level_conquered")) {
      updatedAchievements.push("mega_level_conquered");
    }

    // Sight Explorer (levels 1-20 completed)
    const hasCompletedSight = Array.from({ length: 20 }, (_, i) => i + 1).every(id => updatedCompleted.includes(id));
    if (hasCompletedSight && !updatedAchievements.includes("sight_journey_completed")) {
      updatedAchievements.push("sight_journey_completed");
    }

    // Sound Listener (levels 21-40 completed)
    const hasCompletedSound = Array.from({ length: 20 }, (_, i) => i + 21).every(id => updatedCompleted.includes(id));
    if (hasCompletedSound && !updatedAchievements.includes("sound_journey_completed")) {
      updatedAchievements.push("sound_journey_completed");
    }

    // Tactile Expert (levels 41-60 completed)
    const hasCompletedTouch = Array.from({ length: 20 }, (_, i) => i + 41).every(id => updatedCompleted.includes(id));
    if (hasCompletedTouch && !updatedAchievements.includes("touch_journey_completed")) {
      updatedAchievements.push("touch_journey_completed");
    }

    // Flavor Scientist (levels 61-80 completed)
    const hasCompletedTasteSmell = Array.from({ length: 20 }, (_, i) => i + 61).every(id => updatedCompleted.includes(id));
    if (hasCompletedTasteSmell && !updatedAchievements.includes("taste_smell_completed")) {
      updatedAchievements.push("taste_smell_completed");
    }

    // Zen Master (levels 81-100 completed)
    const hasCompletedFocus = Array.from({ length: 20 }, (_, i) => i + 81).every(id => updatedCompleted.includes(id));
    if (hasCompletedFocus && !updatedAchievements.includes("focus_movement_completed")) {
      updatedAchievements.push("focus_movement_completed");
    }

    // Grand Sensory Explorer (all 100 levels)
    if (updatedCompleted.length === 100 && !updatedAchievements.includes("sensory_star")) {
      updatedAchievements.push("sensory_star");
    }

    const nextProgressState: GameProgress = {
      completedLevels: updatedCompleted,
      calmStars: updatedStars,
      unlockedLevels: updatedUnlocked,
      achievements: updatedAchievements
    };

    saveProgress(nextProgressState);

    // Go back to Lobby Dashboard
    setCurrentLevelId(null);
  };

  // Find active level configuration
  const activeLevel = LEVELS.find(l => l.id === currentLevelId);

  return (
    <div id="ausome-viewport" className="min-h-screen bg-[#FDFCF8] text-[#4A4A4A] flex flex-col font-sans selection:bg-[#B8C5B0]/30 relative overflow-x-hidden">
      
      {/* Background Decorative Blobs (Soft Sensory Shapes) */}
      <div className="absolute top-10 left-10 sm:top-20 sm:left-40 w-64 h-64 sm:w-80 sm:h-80 bg-[#D6E6F2] rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-40 w-72 h-72 sm:w-96 sm:h-96 bg-[#FFF4BD] rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-[#F9DEDC] rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-72 h-72 bg-[#B8C5B0] rounded-full mix-blend-multiply filter blur-3xl opacity-25 pointer-events-none" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start z-10">
        {activeLevel ? (
          <LevelScreen
            level={activeLevel}
            progress={progress}
            onBack={() => setCurrentLevelId(null)}
            onLevelComplete={handleLevelComplete}
          />
        ) : currentView === "shop" ? (
          <Shop
            onBack={() => setCurrentView("dashboard")}
          />
        ) : (
          <Dashboard
            progress={progress}
            onSelectLevel={(id) => {
              setCurrentLevelId(id);
              setCurrentView("dashboard");
            }}
            onResetProgress={handleResetProgress}
            onOpenShop={() => setCurrentView("shop")}
          />
        )}
      </main>
    </div>
  );
}
