import React, { useState, useEffect, useMemo } from "react";
import { 
  Trophy, Settings, ShieldAlert, Award, Calendar, Timer, Sparkles, 
  Layers, Volume2, VolumeX, HelpCircle, ArrowLeft, RotateCcw, UserPlus, 
  Heart, CheckCircle2, Bot, Play, User, Star 
} from "lucide-react";
import { 
  Profile, LevelConfig, Card, GameState, SensoryLog, ProgressLog, Certificate, Badge, Achievement 
} from "./types";
import { getLevelsConfig, THEME_ICONS, getBadgeForLevel } from "./levelsConfig";
import { playCalmSound, speakPraise } from "./components/SoundManager";
import DailyLogin from "./components/DailyLogin";
import AchievementsPanel from "./components/AchievementsPanel";
import ParentDashboard from "./components/ParentDashboard";
import CelebrationScreen from "./components/CelebrationScreen";
import ShopPanel from "./components/ShopPanel";
import AUBotCompanion from "./components/AUBotCompanion";
import CardGrid from "./components/CardGrid";
import confetti from "canvas-confetti";
import HubLinkBar from "@shared/HubLinkBar";
import {
  createProfile,
  hydrateProfileFromApi,
  loadProfile,
  saveProfile as saveSharedProfile,
  syncProfileToApi,
} from "@shared/profile-client";

// Expanded lists of cute companion animal emojis
export const AVATAR_EMOJIS: Record<string, string> = {
  Dog: "🐶",
  Cat: "🐱",
  Rabbit: "🐰",
  Panda: "🐼",
  Koala: "🐨",
  Lion: "🦁",
  Monkey: "🐵",
  Fox: "🦊",
  Owl: "🦉"
};

export const PASTEL_LEVEL_COLORS = [
  { bg: "#FFD8BE", border: "#FFAC81", text: "#723617" }, // Soft Peach
  { bg: "#FCF6BD", border: "#E4C542", text: "#635008" }, // Butter Yellow
  { bg: "#D4F0F0", border: "#83D3D3", text: "#165959" }, // Mint Teal
  { bg: "#A9DEF9", border: "#5EBEEF", text: "#134B68" }, // Sky Blue
  { bg: "#E8D7F1", border: "#C394EB", text: "#48216A" }, // Lavender
  { bg: "#FFD1DC", border: "#FFA59E", text: "#7A2E38" }  // Sweet Pink
];

// Default standard profiles in case database is empty
const INITIAL_PROFILES: Profile[] = [
  {
    id: "profile_1",
    name: "Manha",
    avatar: "Dog",
    currentLevel: 1,
    points: 0,
    coins: 50,
    xp: 0,
    unlockedThemes: ["Shapes"],
    badges: [],
    certificates: [],
    streak: 1,
    lastLoginDate: null
  },
  {
    id: "profile_2",
    name: "Leo",
    avatar: "Cat",
    currentLevel: 1,
    points: 0,
    coins: 50,
    xp: 0,
    unlockedThemes: ["Shapes"],
    badges: [],
    certificates: [],
    streak: 1,
    lastLoginDate: null
  }
];

// Achievements master list
const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "badge_first", title: "First Match", description: "Completed your very first memory match!", iconName: "Star", requiredValue: 1, currentValue: 0, isUnlocked: false, rewardCoins: 10 },
  { id: "badge_lvl5", title: "5 Levels Completed", description: "Successfully finished 5 cognitive matching levels.", iconName: "Award", requiredValue: 5, currentValue: 0, isUnlocked: false, rewardCoins: 30 },
  { id: "badge_perfect", title: "10 Perfect Matches", description: "10 consecutive levels completed with under 3 errors.", iconName: "Trophy", requiredValue: 10, currentValue: 0, isUnlocked: false, rewardCoins: 50 },
  { id: "badge_explorer", title: "Memory Explorer", description: "Played 15 different theme challenges.", iconName: "BookOpen", requiredValue: 15, currentValue: 0, isUnlocked: false, rewardCoins: 40 },
  { id: "badge_calm", title: "Calm Player", description: "Completed a level in Silent Pacing mode without rush.", iconName: "Heart", requiredValue: 1, currentValue: 0, isUnlocked: false, rewardCoins: 20 },
  { id: "badge_fifty", title: "Matching Legend", description: "Reached the absolute mastery level 100!", iconName: "BrainCircuit", requiredValue: 100, currentValue: 0, isUnlocked: false, rewardCoins: 100 }
];

export default function App() {
  // App screens: "home" | "map" | "game" | "celebration" | "parent" | "shop"
  const [screen, setScreen] = useState<"home" | "map" | "game" | "celebration" | "parent" | "shop">("home");
  
  // Game & profile states
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const levelsPool = useMemo(() => getLevelsConfig(selectedProfile?.currentLevel || 1), [selectedProfile?.currentLevel]);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [sensoryLogs, setSensoryLogs] = useState<SensoryLog[]>([]);
  const [activityLogs, setActivityLogs] = useState<ProgressLog[]>([]);

  // Toggles
  const [isCalmMode, setIsCalmMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  // Active game board state
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [encouragementText, setEncouragementText] = useState("Tap any card to begin.");
  const [aiTriggerContext, setAiTriggerContext] = useState<"start" | "halfway" | "complete" | "general">("start");

  // Modals state
  const [showDailyLogin, setShowDailyLogin] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showProfileCreator, setShowProfileCreator] = useState(false);

  // Profile creation fields
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileAvatar, setNewProfileAvatar] = useState("Dog");

  // Fetch profiles, journals, and logs on boot
  useEffect(() => {
    hydrateProfileFromApi();

    fetch("/api/profiles")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProfiles(data);
        }
      })
      .catch(err => console.warn("Using offline fallback for profiles."));

    fetch("/api/journals")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setActivityLogs(data);
      })
      .catch(err => console.warn("Using offline fallback for progress journals."));

    fetch("/api/sensory-logs")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setSensoryLogs(data);
      })
      .catch(err => console.warn("Using offline fallback for sensory logs."));
  }, []);

  // Save profile helper (fullstack server post + local state update)
  const saveProfileData = (updatedProfile: Profile) => {
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    setSelectedProfile(updatedProfile);

    const shared = loadProfile() || createProfile({
      id: updatedProfile.id,
      name: updatedProfile.name,
      avatar: AVATAR_EMOJIS[updatedProfile.avatar] || updatedProfile.avatar,
    });
    shared.modules.focus = updatedProfile as unknown as Record<string, unknown>;
    shared.name = updatedProfile.name;
    shared.avatar = AVATAR_EMOJIS[updatedProfile.avatar] || updatedProfile.avatar;
    saveSharedProfile(shared);
    syncProfileToApi(shared);
    
    fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shared)
    }).catch(err => console.warn("Profile changes backed up locally only.", err));
  };

  // Create profile handler
  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    const newProfile: Profile = {
      id: `profile_${Date.now()}`,
      name: newProfileName,
      avatar: newProfileAvatar,
      currentLevel: 1,
      points: 0,
      coins: 50,
      xp: 0,
      unlockedThemes: ["Shapes"],
      badges: [],
      certificates: [],
      streak: 1,
      lastLoginDate: new Date().toISOString().split("T")[0]
    };

    const updated = [...profiles, newProfile];
    setProfiles(updated);
    setSelectedProfile(newProfile);
    setShowProfileCreator(false);
    setNewProfileName("");
    
    fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProfile)
    }).catch(err => console.warn("Profiles updated offline."));

    playCalmSound("bell", 1.0, isMuted);
    setScreen("map");
  };

  // Claim Daily reward
  const handleClaimDailyReward = (coinsEarned: number, themeReward?: string, badgeReward?: string) => {
    if (!selectedProfile) return;
    
    const todayStr = new Date().toISOString().split("T")[0];
    const updated: Profile = {
      ...selectedProfile,
      coins: selectedProfile.coins + coinsEarned,
      xp: selectedProfile.xp + 20,
      streak: selectedProfile.lastLoginDate === null ? 1 : selectedProfile.streak + 1,
      lastLoginDate: todayStr
    };

    if (themeReward && !updated.unlockedThemes.includes(themeReward)) {
      updated.unlockedThemes.push(themeReward);
    }
    if (badgeReward && !updated.badges.includes(badgeReward)) {
      updated.badges.push(badgeReward);
    }

    saveProfileData(updated);
    setShowDailyLogin(false);
    playCalmSound("piano", 1.0, isMuted);
  };

  // Start Level Setup
  const handleStartLevel = (levelNum: number) => {
    const levelConf = levelsPool.find(l => l.level === levelNum) || levelsPool[0];
    const theme = levelConf.theme;
    
    // Pick matching icon assets from THEME_ICONS or default to Shapes
    const availablePool = THEME_ICONS[theme] || THEME_ICONS["Shapes"];
    
    // Take pairs needed
    const pairsNeeded = levelConf.pairsCount;
    const selectedPairs = [];
    for (let i = 0; i < pairsNeeded; i++) {
      selectedPairs.push(availablePool[i % availablePool.length]);
    }

    // Generate duplicate cards for board matching
    const generatedCards: Card[] = [];
    
    // Pattern varieties for Level 21-30
    const patterns: ("solid" | "striped" | "dotted" | "waved")[] = ["striped", "dotted", "waved"];

    selectedPairs.forEach((pair, pairIdx) => {
      const cardId = `card_id_${pairIdx}`;
      
      // Determine style patterns for Steady Focus 21-30 levels
      const styleVariant = (levelNum >= 21 && levelNum <= 30) 
        ? patterns[pairIdx % patterns.length] 
        : "solid";

      // Near Match Points differentiators for Levels 41-50
      const isMasteryNearMatch = levelNum >= 41 && pairIdx === 0; // make the first pair near match

      // Duplicate cards
      generatedCards.push({
        id: cardId,
        uniqueId: `${cardId}_a`,
        iconName: pair.icon,
        colorCode: "soft-blue",
        isMatched: false,
        isFlipped: false,
        styleVariant,
        points: isMasteryNearMatch ? 5 : undefined
      });

      generatedCards.push({
        id: cardId,
        uniqueId: `${cardId}_b`,
        iconName: pair.icon,
        colorCode: "soft-blue",
        isMatched: false,
        isFlipped: false,
        styleVariant,
        points: isMasteryNearMatch ? 6 : undefined // 5 vs 6 dots to match the prompt example!
      });
    });

    // Shuffle cards positions (Always shuffle cards between levels only, never during gameplay as required)
    const shuffledCards = generatedCards.sort(() => Math.random() - 0.5);

    setGameState({
      currentLevel: levelNum,
      cards: shuffledCards,
      selectedIndices: [],
      points: 0,
      coins: 0,
      xp: 0,
      matches: 0,
      errors: 0,
      rapidErrorsCount: 0,
      lastErrorTime: null,
      isSensoryOverloadTriggered: false,
      isCompleted: false,
      startTime: Date.now(),
      timeSpent: 0,
      hintPair: null
    });

    setEncouragementText("Let's look closely at the cards.");
    setAiTriggerContext("start");
    playCalmSound("wood", 1.0, isMuted);
    setScreen("game");
  };

  // Card Tapped logic
  const handleCardTap = (index: number) => {
    if (!gameState || gameState.isCompleted) return;
    
    const card = gameState.cards[index];
    if (card.isFlipped || card.isMatched) return;

    // Check if max flipped
    if (gameState.selectedIndices.length >= 2) return;

    // Flip card
    const updatedCards = [...gameState.cards];
    updatedCards[index] = { ...card, isFlipped: true };

    const updatedSelected = [...gameState.selectedIndices, index];

    setGameState(prev => prev ? {
      ...prev,
      cards: updatedCards,
      selectedIndices: updatedSelected
    } : null);

    // Play soft tap sound
    playCalmSound("wood", gameState.isSensoryOverloadTriggered ? 0.3 : 1.0, isMuted);

    // If we have flipped 2 cards, check match!
    if (updatedSelected.length === 2) {
      const idx1 = updatedSelected[0];
      const idx2 = updatedSelected[1];
      const card1 = updatedCards[idx1];
      const card2 = updatedCards[idx2];

      const isMatch = card1.id === card2.id && card1.points === card2.points; // must match id AND dots/points count!

      if (isMatch) {
        // Success match
        setTimeout(() => {
          if (!gameState) return;
          const matchedCards = [...updatedCards];
          matchedCards[idx1].isMatched = true;
          matchedCards[idx2].isMatched = true;

          const newMatches = gameState.matches + 1;
          const levelConf = levelsPool.find(l => l.level === gameState.currentLevel) || levelsPool[0];
          const isFinished = newMatches === levelConf.pairsCount;

          // Points rewards: +10 per correct match
          const ptsEarned = 10;
          const coinsEarned = 2;
          const xpEarned = 5;

          // Check if halfway
          const isHalfway = newMatches === Math.ceil(levelConf.pairsCount / 2);
          if (isHalfway && !isFinished) {
            setAiTriggerContext("halfway");
          }

          setGameState(prev => prev ? {
            ...prev,
            cards: matchedCards,
            selectedIndices: [],
            matches: newMatches,
            points: prev.points + ptsEarned,
            coins: prev.coins + coinsEarned,
            xp: prev.xp + xpEarned,
            rapidErrorsCount: 0, // reset sensory triggers upon successful correct pacing!
            hintPair: null,
            isCompleted: isFinished
          } : null);

          setEncouragementText("Perfect match!");
          playCalmSound("water", gameState.isSensoryOverloadTriggered ? 0.3 : 1.0, isMuted);
          
          // Beautiful highly vibrant confetti burst for successful match
          try {
            confetti({
              particleCount: 65,
              spread: 80,
              origin: { y: 0.7 },
              colors: ["#FF1E56", "#FFAC41", "#00FFC6", "#39FF14", "#9B5DE5", "#FF781F", "#FF007F"]
            });
          } catch (err) {
            console.warn("Confetti failed to launch", err);
          }

          if (isVoiceEnabled) {
            speakPraise(undefined, isMuted);
          }

          if (isFinished) {
            handleLevelComplete(gameState.points + ptsEarned, gameState.coins + coinsEarned, gameState.xp + xpEarned);
          }
        }, isCalmMode ? 50 : 800);

      } else {
        // Mismatch logic
        const now = Date.now();
        const lastErrTime = gameState.lastErrorTime;
        
        let isRapid = false;
        if (lastErrTime && (now - lastErrTime < 3000)) {
          isRapid = true;
        }

        const newRapidCount = isRapid ? gameState.rapidErrorsCount + 1 : 1;
        const triggerSensory = newRapidCount > 3;

        // Encouragement phrases (strict prompt instruction: NO Wrong, Failed, Lost, or Incorrect)
        const phrases = ["Almost!", "Nice try.", "Keep exploring."];
        const nextEncouragement = phrases[Math.floor(Math.random() * phrases.length)];

        setGameState(prev => prev ? {
          ...prev,
          errors: prev.errors + 1,
          rapidErrorsCount: newRapidCount,
          lastErrorTime: now,
          isSensoryOverloadTriggered: triggerSensory || prev.isSensoryOverloadTriggered
        } : null);

        setEncouragementText(nextEncouragement);

        // Silent Sensory Overload Action Logging
        if (triggerSensory && !gameState.isSensoryOverloadTriggered) {
          const newSensoryLog: SensoryLog = {
            id: `sensory_${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString(),
            level: gameState.currentLevel,
            errorCount: gameState.errors + 1,
            triggerReason: "Rapid Consecutive Errors (<3s interval)"
          };

          setSensoryLogs(prev => [...prev, newSensoryLog]);
          
          fetch("/api/sensory-logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSensoryLog)
          }).catch(err => console.warn("Log offline fallback."));
        }

        // Mismatch Flip back delay: longer if sensory mode activated to calm processing
        const revealDelay = triggerSensory || gameState.isSensoryOverloadTriggered ? 2500 : 1000;

        setTimeout(() => {
          const resetCards = [...updatedCards];
          resetCards[idx1].isFlipped = false;
          resetCards[idx2].isFlipped = false;

          setGameState(prev => prev ? {
            ...prev,
            cards: resetCards,
            selectedIndices: []
          } : null);

          // Wood tap mismatch alert
          playCalmSound("wood", (triggerSensory || gameState.isSensoryOverloadTriggered) ? 0.1 : 0.6, isMuted);
        }, isCalmMode ? 10 : revealDelay);
      }
    }
  };

  // Spend Coins for Visual Hint
  const handleTriggerHint = () => {
    if (!gameState || !selectedProfile || selectedProfile.coins < 20) return;

    // Find first unmatched pair
    const unmatchedCards = gameState.cards.filter(c => !c.isMatched);
    if (unmatchedCards.length < 2) return;

    const first = unmatchedCards[0];
    const match = unmatchedCards.find(c => c.id === first.id && c.uniqueId !== first.uniqueId && c.points === first.points);

    if (match) {
      const idx1 = gameState.cards.findIndex(c => c.uniqueId === first.uniqueId);
      const idx2 = gameState.cards.findIndex(c => c.uniqueId === match.uniqueId);

      // Highlight the pair
      setGameState(prev => prev ? {
        ...prev,
        hintPair: [first.id, match.id]
      } : null);

      // Spend 20 coins
      const updatedProfile = {
        ...selectedProfile,
        coins: Math.max(0, selectedProfile.coins - 20)
      };
      saveProfileData(updatedProfile);

      playCalmSound("chime", 1.0, isMuted);

      // Clear highlight after 1.5 seconds
      setTimeout(() => {
        setGameState(prev => prev ? { ...prev, hintPair: null } : null);
      }, 1500);
    }
  };

  // Level Complete Reward Calculations
  const handleLevelComplete = (lvlPoints: number, lvlCoins: number, lvlXp: number) => {
    if (!selectedProfile || !gameState) return;

    const nextLvl = selectedProfile.currentLevel + 1;
    
    // Check for achievements
    const updatedAchievements = achievements.map(ach => {
      let currentVal = ach.currentValue;
      if (ach.id === "badge_first") currentVal = 1;
      if (ach.id === "badge_lvl5" && gameState.currentLevel >= 5) currentVal = 5;
      if (ach.id === "badge_perfect" && gameState.errors <= 2) currentVal += 1;
      if (ach.id === "badge_explorer") currentVal = selectedProfile.unlockedThemes.length;
      if (ach.id === "badge_calm" && gameState.isSensoryOverloadTriggered) currentVal = 1;
      if (ach.id === "badge_fifty" && gameState.currentLevel >= 100) currentVal = 100;

      const isUnl = currentVal >= ach.requiredValue;
      return { ...ach, currentValue: currentVal, isUnlocked: isUnl };
    });

    setAchievements(updatedAchievements);

    // Save logs for parent
    const journalEntry: ProgressLog = {
      id: `journal_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      sessionTime: Math.round((Date.now() - gameState.startTime) / 1000),
      level: gameState.currentLevel,
      rapidErrors: gameState.errors,
      sensoryTrigger: gameState.isSensoryOverloadTriggered,
      pointsEarned: lvlPoints,
      completed: true
    };

    setActivityLogs(prev => [...prev, journalEntry]);
    
    fetch("/api/journals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(journalEntry)
    }).catch(err => console.warn("Journal offline fallback."));

    // Award standard completion badges/coins
    const finalProfile: Profile = {
      ...selectedProfile,
      currentLevel: nextLvl > selectedProfile.currentLevel ? nextLvl : selectedProfile.currentLevel,
      points: selectedProfile.points + lvlPoints,
      coins: selectedProfile.coins + lvlCoins + (gameState.errors === 0 ? 25 : 0), // Perfect bonus +25
      xp: selectedProfile.xp + lvlXp,
      badges: [...selectedProfile.badges]
    };

    // If level completed is > 5, automatically award the unique custom level-specific badge!
    if (gameState.currentLevel > 5) {
      const levelBadge = getBadgeForLevel(gameState.currentLevel, levelsPool[gameState.currentLevel - 1]?.theme || "Shapes");
      if (!finalProfile.badges.includes(levelBadge.id)) {
        finalProfile.badges.push(levelBadge.id);
      }
    }

    // Every 10th level: Review stages completion & Certificate creation
    if (gameState.currentLevel % 10 === 0) {
      const stageId = `stage_${gameState.currentLevel}`;
      const hasCert = finalProfile.certificates.some(c => c.id === stageId);
      
      if (!hasCert) {
        const certObj: Certificate = {
          id: stageId,
          level: gameState.currentLevel,
          date: new Date().toLocaleDateString(),
          childName: selectedProfile.name,
          theme: levelsPool[gameState.currentLevel - 1]?.theme || "Shapes",
          achievement: "Cognitive Focus and Matching Stage Completed",
          stageName: `Stage ${gameState.currentLevel / 10}`
        };
        finalProfile.certificates.push(certObj);
        finalProfile.coins += 100; // certificate +100 bonus
      }
    }

    saveProfileData(finalProfile);
    setAiTriggerContext("complete");

    if (isVoiceEnabled) {
      const congratulatoryPhrases = [
        `Good job, ${selectedProfile.name}! You completed Level ${gameState.currentLevel}!`,
        `Well done, ${selectedProfile.name}! Fantastic matching!`,
        `Amazing focus, ${selectedProfile.name}! You finished the quest!`
      ];
      const selectedPhrase = congratulatoryPhrases[Math.floor(Math.random() * congratulatoryPhrases.length)];
      speakPraise(selectedPhrase, isMuted);
    }

    // Redirect to celebration immediately
    setScreen("celebration");
  };

  // Claim unlocked achievement badges
  const handleClaimAchievementReward = (achievementId: string, rewardCoins: number) => {
    if (!selectedProfile) return;
    
    const unlAch = achievements.find(a => a.id === achievementId);
    if (!unlAch || !unlAch.isUnlocked) return;

    if (selectedProfile.badges.includes(achievementId)) return; // already claimed

    const updated = {
      ...selectedProfile,
      coins: selectedProfile.coins + rewardCoins,
      badges: [...selectedProfile.badges, achievementId]
    };

    saveProfileData(updated);
    playCalmSound("bell", 1.0, isMuted);
  };

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col font-sans relative antialiased text-muted-lavender">
      
      {/* 1. SCREEN: HOME (Profile selection or creator) */}
      {screen === "home" && (
        <div id="home-screen" className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto space-y-8 animate-fade-in">
          
          {/* Main Launcher App Branding */}
          <div className="space-y-4">
            <div className="w-24 h-24 bg-soft-blue/20 rounded-full border-4 border-muted-lavender flex items-center justify-center mx-auto relative">
              <Star className="w-12 h-12 text-muted-lavender animate-pulse" />
              <div className="absolute top-1 right-1 bg-soft-green rounded-full p-1 border border-muted-lavender">
                <CheckCircle2 className="w-4 h-4 text-muted-lavender" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tight text-muted-lavender uppercase">Matching Quest</h1>
              <span className="text-sm font-bold bg-soft-blue/20 px-3 py-1 rounded-full border border-soft-blue text-muted-lavender">
                An AU-Some Safe Focus Game 🌸
              </span>
            </div>
          </div>

          {/* Profile Choice Section */}
          <div className="w-full bg-warm-cream p-6 rounded-3xl border-4 border-muted-lavender space-y-4 shadow-sm">
            <h3 className="text-xl font-black text-muted-lavender flex items-center justify-center gap-1.5">
              <User className="w-5 h-5" />
              <span>Who is playing today?</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 justify-center">
              {profiles.map(p => (
                <button
                  id={`select-profile-${p.id}`}
                  key={p.id}
                  onClick={() => {
                    setSelectedProfile(p);
                    playCalmSound("bell", 1.0, isMuted);
                    setScreen("map");
                  }}
                  className="p-4 bg-soft-blue hover:bg-soft-blue/90 border-4 border-muted-lavender rounded-2xl flex flex-col items-center space-y-2 cursor-pointer transition-all active:scale-95 text-muted-lavender shadow-md"
                >
                  <div className="w-14 h-14 bg-warm-cream rounded-full border-2 border-muted-lavender flex items-center justify-center text-2xl">
                    {AVATAR_EMOJIS[p.avatar] || "🐶"}
                  </div>
                  <span className="text-lg font-black">{p.name}</span>
                  <span className="text-xs font-bold opacity-85">Level {p.currentLevel}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-muted-lavender/10">
              <button
                id="create-new-profile-toggle"
                onClick={() => setShowProfileCreator(true)}
                className="w-full py-3 bg-soft-green hover:bg-soft-green/90 text-muted-lavender font-bold text-lg rounded-xl border-2 border-muted-lavender flex items-center justify-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-5 h-5" />
                <span>Create New Profile</span>
              </button>
            </div>
          </div>

          {/* Profile Creator PopUp Dialog */}
          {showProfileCreator && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-muted-lavender/50 backdrop-blur-sm">
              <form 
                onSubmit={handleCreateProfile}
                className="w-full max-w-md bg-warm-cream rounded-3xl border-4 border-muted-lavender p-6 space-y-6 shadow-2xl"
              >
                <h3 className="text-2xl font-black text-muted-lavender text-center">New Explorer Profile</h3>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-muted-lavender/80">Child's Name:</label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Enter name (max 12 letters)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-muted-lavender text-lg font-bold bg-warm-cream text-muted-lavender focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-muted-lavender/80">Select Companion Avatar:</label>
                  <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1.5 border border-[#C3DEC0] rounded-2xl bg-[#F0F6EF]/50">
                    {Object.keys(AVATAR_EMOJIS).map(avatar => (
                      <button
                        type="button"
                        key={avatar}
                        onClick={() => setNewProfileAvatar(avatar)}
                        className={`p-2 rounded-xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                          newProfileAvatar === avatar 
                            ? "bg-[#FEF6C7] border-[#7AA676] scale-102 shadow-sm" 
                            : "bg-[#FAF8F3] border-[#C3DEC0]/40 text-muted-lavender/80 hover:bg-[#FAF8F3]/80"
                        }`}
                      >
                        <span className="text-2xl">
                          {AVATAR_EMOJIS[avatar]}
                        </span>
                        <span>{avatar}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2 border-t border-muted-lavender/10">
                  <button
                    type="button"
                    onClick={() => setShowProfileCreator(false)}
                    className="px-4 py-2 bg-muted-lavender/10 border border-muted-lavender rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-soft-green hover:bg-soft-green/90 text-muted-lavender font-bold rounded-xl border-2 border-muted-lavender shadow-md"
                  >
                    Save Explorer
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

      {/* 2. SCREEN: ADVENTURE LEVEL MAP */}
      {screen === "map" && selectedProfile && (
        <div id="adventure-map-screen" className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 md:p-6 space-y-6 animate-fade-in">
          
          {/* Quick Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-muted-lavender/20 pb-4">
            
            <div className="flex items-center space-x-3 bg-warm-cream p-2.5 rounded-2xl border border-muted-lavender/40 shadow-sm">
              <div className="w-12 h-12 bg-[#FEF6C7] rounded-full border-2 border-[#7AA676] flex items-center justify-center text-xl">
                {AVATAR_EMOJIS[selectedProfile.avatar] || "🐶"}
              </div>
              <div>
                <span className="block text-xs font-bold text-muted-lavender/70">Explorer Profile</span>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-muted-lavender">{selectedProfile.name}</h2>
                  <button
                    onClick={() => {
                      setScreen("home");
                      playCalmSound("wood", 1.0, isMuted);
                    }}
                    className="px-2.5 py-1 bg-[#FEF6C7] border-2 border-[#FAD76C] hover:bg-[#FAF1B1] text-[#906D19] text-[11px] font-black rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    👤 Change Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Config & Calm modes toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <HubLinkBar className="text-muted-lavender mr-1" />
              <button
                id="toggle-voice-button"
                onClick={() => {
                  setIsVoiceEnabled(!isVoiceEnabled);
                  playCalmSound("wood", 1.0, isMuted);
                }}
                className={`px-4 py-2 rounded-xl border-2 border-muted-lavender text-xs font-bold cursor-pointer transition-all active:scale-95 ${
                  isVoiceEnabled 
                    ? "bg-[#FEF6C7] text-[#4D4315] font-black border-[#F9E684]" 
                    : "bg-warm-cream text-muted-lavender/80"
                }`}
              >
                {isVoiceEnabled ? "🗣️ VOICE PRAISE: ON" : "🗣️ Voice Praise: OFF"}
              </button>

              <button
                id="toggle-calm-mode-button"
                onClick={() => {
                  setIsCalmMode(!isCalmMode);
                  playCalmSound("wood", 1.0, isMuted);
                }}
                className={`px-4 py-2 rounded-xl border-2 border-muted-lavender text-xs font-bold cursor-pointer transition-all active:scale-95 ${
                  isCalmMode 
                    ? "bg-soft-green text-muted-lavender font-black" 
                    : "bg-warm-cream text-muted-lavender/80"
                }`}
              >
                {isCalmMode ? "🌸 CALM MODE: ON" : "🌸 Calm Mode (Mute animations)"}
              </button>

              <button
                id="toggle-mute-button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2.5 rounded-xl border-2 transition-all active:scale-95 shadow-sm ${
                  isMuted 
                    ? "bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200" 
                    : "bg-sky-100 border-sky-300 text-sky-700 hover:bg-sky-200"
                }`}
                title="Mute Sound"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                id="shop-nav-button"
                onClick={() => {
                  setScreen("shop");
                  playCalmSound("wood", 1.0, isMuted);
                }}
                className="px-4 py-2 bg-[#FEF6C7] hover:bg-[#FAF1B1] text-[#5C4A00] font-black text-xs rounded-xl border-2 border-[#F9E684] cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>🛍️ Montessori Shop</span>
              </button>

              <button
                id="parent-dashboard-nav-button"
                onClick={() => setScreen("parent")}
                className="px-4 py-2 bg-muted-lavender text-warm-cream font-bold text-xs rounded-xl border-2 border-muted-lavender cursor-pointer shadow-md transition-all active:scale-95 hover:bg-[#5C4D80]"
              >
                🔑 Parent Zone
              </button>

              <button
                onClick={() => {
                  setScreen("home");
                  playCalmSound("wood", 1.0, isMuted);
                }}
                className="p-2.5 rounded-xl border-2 border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-all active:scale-95 shadow-sm"
              >
                Log Out
              </button>
            </div>

          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-4 gap-2 bg-[#FEF6C7] p-4 rounded-3xl border-2 border-[#FAD76C] shadow-md">
            <div className="text-center">
              <span className="block text-[10px] uppercase font-black text-[#8C761D]">Points</span>
              <span className="text-lg font-black text-[#5C4A00]">{selectedProfile.points}</span>
            </div>
            <div className="text-center border-l border-[#FAD76C]/60">
              <span className="block text-[10px] uppercase font-black text-[#8C761D]">Coins</span>
              <span className="text-lg font-black text-[#226315]">🪙 {selectedProfile.coins}</span>
            </div>
            <div className="text-center border-l border-[#FAD76C]/60">
              <span className="block text-[10px] uppercase font-black text-[#8C761D]">XP</span>
              <span className="text-lg font-black text-[#5C4A00]">{selectedProfile.xp}</span>
            </div>
            <div className="text-center border-l border-[#FAD76C]/60">
              <span className="block text-[10px] uppercase font-black text-[#8C761D]">Badges</span>
              <span className="text-lg font-black text-[#5C4A00]">🏆 {selectedProfile.badges.length}</span>
            </div>
          </div>

          {/* Main Map Navigation Area */}
          <div className="bg-[#FAF8F3] rounded-3xl border-4 border-[#7AA676] p-6 relative min-h-[50vh] flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-[#3D543B]">Match Quest Roadmap</h3>
                
                {/* Daily Explorer Cal Link */}
                <div className="flex gap-2">
                  <button
                    id="open-daily-login"
                    onClick={() => {
                      setShowDailyLogin(true);
                      playCalmSound("chime", 1.0, isMuted);
                    }}
                    className="px-4 py-2 bg-sky-50 text-sky-800 hover:bg-sky-100 border-2 border-sky-300 font-black text-xs rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Calendar className="w-4 h-4 text-sky-700" />
                    <span>Daily Login</span>
                  </button>

                  <button
                    id="open-badges-panel"
                    onClick={() => {
                      setShowAchievements(true);
                      playCalmSound("bell", 1.0, isMuted);
                    }}
                    className="px-4 py-2 bg-[#FEF6C7] text-[#4D4315] hover:bg-[#FAF1B1] border-2 border-[#F9E684] font-black text-xs rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Trophy className="w-4 h-4 text-[#8C761D]" />
                    <span>My Badges</span>
                  </button>
                </div>
              </div>

              {/* Levels Horizontal Path - Scrolled view */}
              <div className="overflow-x-auto pb-4">
                <div className="flex items-center space-x-4 w-max p-2">
                  {levelsPool.map((lvl) => {
                    const isCompleted = lvl.level < selectedProfile.currentLevel;
                    const isUnlocked = lvl.level === selectedProfile.currentLevel;
                    const isLocked = lvl.level > selectedProfile.currentLevel;

                    // Milestones celebrations highlighted!
                    const isMilestone = lvl.level % 5 === 0;

                    const colorScheme = PASTEL_LEVEL_COLORS[(lvl.level - 1) % PASTEL_LEVEL_COLORS.length];

                    let btnStyle = {};
                    let btnClass = "";

                    if (isCompleted) {
                      btnStyle = {
                        backgroundColor: colorScheme.bg,
                        borderColor: colorScheme.border,
                        color: colorScheme.text,
                        boxShadow: `0 6px 0 0 ${colorScheme.border}`
                      };
                      btnClass = "cursor-pointer hover:scale-120 hover:rotate-3 active:scale-135 active:rotate-0 shadow-md transition-all duration-300";
                    } else if (isUnlocked) {
                      btnStyle = {
                        backgroundColor: colorScheme.bg,
                        borderColor: "#7AA676", // Framed with warm Sage Green
                        color: colorScheme.text,
                        boxShadow: "0 8px 0 0 #5C7E5A, 0 0 20px rgba(122, 166, 118, 0.5)"
                      };
                      btnClass = "scale-110 cursor-pointer font-black hover:scale-130 hover:-rotate-3 active:scale-140 active:rotate-0 ring-4 ring-[#7AA676]/40 transition-all duration-300 shadow-xl";
                    } else {
                      // Locked
                      btnStyle = {
                        backgroundColor: "#E2E8F0",
                        borderColor: "#CBD5E1",
                        color: "#94A3B8",
                        boxShadow: "0 4px 0 0 #CBD5E1"
                      };
                      btnClass = "opacity-40 cursor-not-allowed";
                    }

                    return (
                      <div key={lvl.level} className="flex flex-col items-center space-y-2 flex-shrink-0">
                        <button
                          id={`level-button-${lvl.level}`}
                          disabled={isLocked}
                          onClick={() => handleStartLevel(lvl.level)}
                          className={`w-16 h-16 rounded-3xl border-4 transition-all flex flex-col items-center justify-center relative ${btnClass}`}
                          style={btnStyle}
                        >
                          {isCompleted ? (
                            <span className="text-xl font-black flex items-center justify-center gap-0.5">
                              {lvl.level}
                              <span className="text-xs">✓</span>
                            </span>
                          ) : (
                            <span className="text-xl font-black">{lvl.level}</span>
                          )}
                          
                          {/* Celebration indicators */}
                          {isMilestone && (
                            <div className="absolute -top-2.5 -right-2.5 bg-[#FEF6C7] p-1 rounded-full border-2 border-[#7AA676] animate-pulse" title="Milestone Reward Level">
                              <Sparkles className="w-3.5 h-3.5 text-[#88701B]" />
                            </div>
                          )}
                        </button>
                        <span className="text-[10px] font-bold truncate max-w-[80px] opacity-90 text-muted-lavender">{lvl.theme}</span>
                        <span className="text-[9px] uppercase tracking-wide opacity-60 font-bold text-muted-lavender">{lvl.difficulty}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Helper guidelines card */}
            <div className="mt-8 p-4 bg-soft-blue/10 border-2 border-muted-lavender/60 rounded-2xl flex items-center space-x-3 text-sm">
              <HelpCircle className="w-8 h-8 text-muted-lavender flex-shrink-0" />
              <p className="leading-relaxed text-muted-lavender/90">
                ⭐ Tap any unlocked level on the roadmap to start matching cards. Complete levels to earn badges and certificates of mastery stages!
              </p>
            </div>

          </div>

          {/* Daily login modal overlay */}
          {showDailyLogin && (
            <DailyLogin
              profile={selectedProfile}
              onClaimReward={handleClaimDailyReward}
              onClose={() => setShowDailyLogin(false)}
            />
          )}

          {/* Achievements modal overlay */}
          {showAchievements && (
            <AchievementsPanel
              profile={selectedProfile}
              achievements={achievements}
              onClaimAchievementReward={handleClaimAchievementReward}
              onClose={() => setShowAchievements(false)}
            />
          )}

        </div>
      )}

      {/* 3. SCREEN: ACTIVE MATCHING GAME BOARD */}
      {screen === "game" && gameState && selectedProfile && (
        <div id="game-board-screen" className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 md:p-6 space-y-6 animate-fade-in">
          
          {/* Board top controls */}
          <div className="flex items-center justify-between border-b border-muted-lavender/20 pb-4">
            <div className="flex items-center gap-3">
            <button
              id="exit-game-back-to-map"
              onClick={() => {
                playCalmSound("wood", 1.0, isMuted);
                setScreen("map");
              }}
              className="flex items-center space-x-1.5 px-4 py-2 bg-warm-cream hover:bg-muted-lavender/10 text-muted-lavender font-bold text-sm rounded-xl border-2 border-muted-lavender cursor-pointer transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Map</span>
            </button>
            <HubLinkBar className="text-muted-lavender" />
            </div>

            {/* Title / Theme */}
            <div className="text-center">
              <span className="text-xs uppercase font-black opacity-60">Level {gameState.currentLevel} Challenge</span>
              <h2 className="text-2xl font-black">{levelsPool[gameState.currentLevel - 1]?.theme || "Shapes"} Matching</h2>
            </div>

            {/* Board Settings/Toggles */}
            <div className="flex items-center gap-2">
              <button
                id="toggle-voice-button-game"
                onClick={() => {
                  setIsVoiceEnabled(!isVoiceEnabled);
                  playCalmSound("wood", 1.0, isMuted);
                }}
                className={`px-3 py-2 rounded-xl border-2 border-muted-lavender text-xs font-bold cursor-pointer transition-all active:scale-95 ${
                  isVoiceEnabled 
                    ? "bg-[#FEF6C7] text-[#4D4315] font-black border-[#F9E684]" 
                    : "bg-warm-cream text-muted-lavender/80"
                }`}
                title="Toggle vocal praise voice"
              >
                {isVoiceEnabled ? "🗣️ VOICE: ON" : "🗣️ Voice: OFF"}
              </button>

              <button
                id="hint-spent-coins-button"
                disabled={selectedProfile.coins < 20 || gameState.hintPair !== null}
                onClick={handleTriggerHint}
                className={`px-4 py-2 text-xs font-black rounded-xl border-2 border-muted-lavender cursor-pointer transition-all active:scale-95 flex items-center gap-1 ${
                  selectedProfile.coins >= 20 
                    ? "bg-soft-green text-muted-lavender hover:bg-soft-green/90 shadow-sm" 
                    : "bg-muted-lavender/10 text-muted-lavender/40 cursor-not-allowed opacity-60"
                }`}
                title="Spend 20 coins to reveal a match pair!"
              >
                <span>💡 Hint (20 Coins)</span>
              </button>

              <button
                id="quick-reset-board-button"
                onClick={() => handleStartLevel(gameState.currentLevel)}
                className="p-2 bg-warm-cream hover:bg-muted-lavender/10 text-muted-lavender rounded-xl border-2 border-muted-lavender"
                title="Reset Level"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Progress bar showing matches complete (no countdown timers!) */}
          <div className="space-y-1.5 bg-warm-cream p-4 rounded-2xl border-2 border-muted-lavender/60 shadow-sm">
            <div className="flex justify-between text-xs font-bold">
              <span>Progress Bar (Concentrate calmly!)</span>
              <span>Matched: {gameState.matches} / {levelsPool[gameState.currentLevel - 1]?.pairsCount} pairs</span>
            </div>
            <div className="w-full h-5 bg-warm-cream rounded-full border-2 border-muted-lavender/20 overflow-hidden relative">
              <div 
                className="h-full bg-soft-green transition-all duration-300"
                style={{
                  width: `${(gameState.matches / (levelsPool[gameState.currentLevel - 1]?.pairsCount || 1)) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Sensory alert state display for parent context/support testing */}
          {gameState.isSensoryOverloadTriggered && (
            <div className="p-3 bg-soft-green/20 border-2 border-soft-green rounded-xl flex items-center space-x-2 text-xs text-muted-lavender font-extrabold animate-pulse">
              <ShieldAlert className="w-5 h-5" />
              <span>Silent Pacing Mode Active: We slowed down card responses to help you focus comfortably.</span>
            </div>
          )}

          {/* Main Gameplay Dual Columns Grid (Grid & AI Bot) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* Left columns - Cards Grid */}
            <div className="lg:col-span-3">
              <CardGrid
                cards={gameState.cards}
                onCardTap={handleCardTap}
                isCalmMode={isCalmMode}
                isSensoryOverloadTriggered={gameState.isSensoryOverloadTriggered}
                hintPair={gameState.hintPair}
              />
            </div>

            {/* Right column - AI companion support */}
            <div className="lg:col-span-1 space-y-4">
              
              {/* Bot */}
              <AUBotCompanion
                currentLevel={gameState.currentLevel}
                triggerContext={aiTriggerContext}
                isCalmMode={isCalmMode}
              />

              {/* Stats card */}
              <div className="bg-warm-cream border-2 border-muted-lavender/60 rounded-3xl p-4 text-xs font-bold space-y-1 text-center">
                <span className="text-[10px] block uppercase opacity-60">Level Performance</span>
                <span className="block text-sm">Mistakes: {gameState.errors}</span>
                <span className="block text-sm text-soft-green">🪙 Coins: +{gameState.matches * 2}</span>
                <span className="block text-sm">Points: +{gameState.matches * 10}</span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 4. SCREEN: CELEBRATION */}
      {screen === "celebration" && gameState && selectedProfile && (
        <CelebrationScreen
          level={gameState.currentLevel}
          pointsEarned={gameState.points}
          coinsEarned={gameState.coins + (gameState.errors === 0 ? 25 : 0)} // Perfect bonus +25
          xpEarned={gameState.xp}
          bonusTheme={gameState.currentLevel % 5 === 0 ? levelsPool[gameState.currentLevel]?.theme : undefined}
          bonusBadge={
            gameState.currentLevel > 5 
              ? getBadgeForLevel(gameState.currentLevel, levelsPool[gameState.currentLevel - 1]?.theme || "Shapes").title
              : undefined
          }
          onNextLevel={() => {
            playCalmSound("wood", 1.0, isMuted);
            // Move to map first, then they can pick levels
            setScreen("map");
          }}
          isCalmMode={isCalmMode}
        />
      )}

      {/* 5. SCREEN: PARENT DASHBOARD */}
      {screen === "parent" && selectedProfile && (
        <ParentDashboard
          profile={selectedProfile}
          sensoryLogs={sensoryLogs}
          activityLogs={activityLogs}
          onClearLogs={() => {
            setSensoryLogs([]);
            setActivityLogs([]);
            playCalmSound("wood", 1.0, isMuted);
          }}
          onClose={() => {
            playCalmSound("wood", 1.0, isMuted);
            setScreen("map");
          }}
        />
      )}

      {/* 6. SCREEN: MONTESSORI SHOP */}
      {screen === "shop" && (
        <ShopPanel
          onClose={() => {
            playCalmSound("wood", 1.0, isMuted);
            setScreen("map");
          }}
        />
      )}

    </div>
  );
}
