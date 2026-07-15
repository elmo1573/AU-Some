/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, Trophy, Star, Coins, ShoppingBag, 
  Award, Sparkles, Smile, GraduationCap, RefreshCw, Moon, Check
} from 'lucide-react';

import { LEVELS, INITIAL_BADGES, SHOP_ITEMS } from './levelsData';
import { GameState, Level, ShopItem, Certificate, StickerPlacement } from './types';
import { audio } from './audio';

// Subcomponents
import { MascotBubble } from './components/MascotBubble';
import { ActivityNumberRods } from './components/ActivityNumberRods';
import { ActivityShortBeadStair } from './components/ActivityShortBeadStair';
import { ActivityTeenTenBoards } from './components/ActivityTeenTenBoards';
import { MegaChallenge } from './components/MegaChallenge';
import { ShopDialog } from './components/ShopDialog';
import { StickerBook } from './components/StickerBook';
import { CertificateView } from './components/CertificateView';
import { ProgressTracker } from './components/ProgressTracker';
import { RealMontessoriShop } from './components/RealMontessoriShop';
import HubLinkBar from '@shared/HubLinkBar';
import {
  hydrateProfileFromApi,
  loadModuleData,
  migrateLegacyKeys,
  saveModuleData,
} from '@shared/profile-client';

export default function App() {
  // --- Game State Initialization ---
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const fromProfile = loadModuleData<GameState | null>('math', null);
      if (fromProfile) return fromProfile;

      const saved = localStorage.getItem('au_some_maths_state');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load game state', e);
    }

    return {
      currentLevelId: 1,
      completedLevelIds: [],
      stars: 10, // give a few starting stars to feel rewarded
      coins: 20, // starting coins to buy a simple sticker
      incorrectAttempts: 0,
      isEasyMode: false,
      unlockedItems: ['char_bear', 'acc_none', 'bg_cream'],
      activeAvatar: '🐻',
      activeAccessory: null,
      activeBackground: 'bg-[#faf8f5]',
      badges: INITIAL_BADGES,
      certificates: [],
      stickerPlacements: [],
      soundVolume: 0.5,
      isMuted: false,
      voiceEnabled: true,
      childName: '',
    };
  });

  // --- Views ---
  const [activeTab, setActiveTab] = useState<'play' | 'stickers' | 'progress' | 'real-shop'>('play');
  const [activeCategory, setActiveCategory] = useState<'rods' | 'beads' | 'teen-ten' | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  
  // Category levels configuration
  const CATEGORY_LEVELS: { [key: string]: number[] } = {
    rods: [1, 4, 9],
    beads: [2, 5, 8, 11, 12, 13],
    'teen-ten': [3, 6, 7, 10, 14, 15]
  };

  // Custom states for triggers
  const [activeMegaChallenge, setActiveMegaChallenge] = useState<1 | 2 | null>(null);
  const [mascotText, setMascotText] = useState<string>('');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [successCelebration, setSuccessCelebration] = useState<boolean>(false);
  const [celebrationDetails, setCelebrationDetails] = useState<{ stars: number; coins: number } | null>(null);

  useEffect(() => {
    hydrateProfileFromApi().then(() => {
      migrateLegacyKeys();
      const legacy = localStorage.getItem('au_some_maths_state');
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy) as GameState;
          saveModuleData('math', parsed as unknown as Record<string, unknown>);
          setGameState(parsed);
        } catch {
          // ignore bad legacy data
        }
      }
    });
  }, []);

  // --- Sync Game State to shared profile ---
  useEffect(() => {
    try {
      saveModuleData('math', gameState as unknown as Record<string, unknown>);
    } catch (e) {
      console.error('Could not save state', e);
    }
  }, [gameState]);

  // --- Reset demo mode when level changes ---
  useEffect(() => {
    setIsDemoMode(true);
  }, [gameState.currentLevelId, activeCategory]);

  // --- Event listener for switching to real-shop tab ---
  useEffect(() => {
    const handleSwitchTab = () => {
      setActiveTab('real-shop');
    };
    window.addEventListener('switch-tab-real-shop', handleSwitchTab);
    return () => {
      window.removeEventListener('switch-tab-real-shop', handleSwitchTab);
    };
  }, []);

  // --- Setup Level Text Instruction On Mount/Level Change ---
  useEffect(() => {
    if (activeTab === 'play') {
      if (!activeCategory) {
        setMascotText("Woohoo! 🎉 Tap on a game below to play! Red and blue rods, sparkling colored beads, or golden boards! What do you want to play today?");
      } else if (activeMegaChallenge) {
        const text = `Mega Challenge ${activeMegaChallenge}! Let's combine everything we learned about numbers. You can do it!`;
        setMascotText(text);
      } else {
        const currentLevel = LEVELS.find((l) => l.id === gameState.currentLevelId);
        if (currentLevel) {
          if (isDemoMode) {
            setMascotText(`Let's watch Mimi Bear show us how to play first! 👀 then it will be your turn!`);
          } else {
            const helperText = gameState.isEasyMode 
              ? `Let's work together! ${currentLevel.instruction} Count with me, I have highlighted the answer cards!`
              : currentLevel.instruction;
            setMascotText(helperText);
          }
        }
      }
    } else if (activeTab === 'stickers') {
      setMascotText('Welcome to your Sticker Board! Tap unlocked stickers below to decorate your beautiful background. Move them around with your finger!');
    } else if (activeTab === 'progress') {
      setMascotText('Look at all your amazing progress! You have earned stars, badges, and completed lessons. I am so proud of you!');
    } else if (activeTab === 'real-shop') {
      setMascotText('Buy real, beautiful wooden Montessori toys shipped directly to your home! Try counting on real rods and beads with your family!');
    }
  }, [gameState.currentLevelId, gameState.isEasyMode, activeTab, activeMegaChallenge, activeCategory, isDemoMode]);

  // --- Sound Control ---
  const handleToggleMute = () => {
    const nextMuteState = !gameState.isMuted;
    setGameState((prev) => ({ ...prev, isMuted: nextMuteState }));
    audio.setMute(nextMuteState);
    audio.playSoftTap();
    
    if (nextMuteState) {
      audio.stopAmbientMusic();
      setMusicPlaying(false);
    } else {
      audio.startAmbientMusic();
      setMusicPlaying(true);
    }
  };

  const handleToggleVoice = () => {
    audio.playSoftTap();
    setGameState((prev) => ({ ...prev, voiceEnabled: !prev.voiceEnabled }));
  };

  const ensureMusicStarts = () => {
    if (!musicPlaying && !gameState.isMuted) {
      audio.startAmbientMusic();
      setMusicPlaying(true);
    }
  };

  // --- Encouraging phrase selector ---
  const getRandomEncouragement = () => {
    const phrases = [
      "Let's try again!",
      "Great effort!",
      "You're improving!",
      "Wonderful attempt!",
      "You've got this, let's try one more time!",
      "Excellent try, you are getting closer!",
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  const getRandomSuccessPhrase = () => {
    const phrases = [
      "Superb! You got it!",
      "Incredible work!",
      "You are a superstar!",
      "Brilliant! Mimi Bear is dancing!",
      "Fantastic job! I am so happy!",
      "Beautiful! That is perfectly correct!",
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  // --- Level Gameplay Actions ---
  const handleLevelSuccess = () => {
    ensureMusicStarts();
    const currentLvl = LEVELS.find((l) => l.id === gameState.currentLevelId);
    if (!currentLvl) return;

    const gainedStars = 10; // Extra fun rewards!
    const gainedCoins = 20;
    
    // Play success celebration
    setCelebrationDetails({ stars: gainedStars, coins: gainedCoins });
    setSuccessCelebration(true);
    audio.playSuccessTone();

    // Select random success praise
    const praise = getRandomSuccessPhrase();
    setMascotText(praise);

    setTimeout(() => {
      setSuccessCelebration(false);
      setCelebrationDetails(null);

      setGameState((prev) => {
        const nextCompletedIds = prev.completedLevelIds.includes(currentLvl.id)
          ? prev.completedLevelIds
          : [...prev.completedLevelIds, currentLvl.id];

        // Check for newly unlocked badges
        const updatedBadges = prev.badges.map((badge) => {
          if (badge.unlockedAtLevel === currentLvl.id) {
            return { ...badge, unlocked: true };
          }
          return badge;
        });

        // Find next level in active category
        const curCat = activeCategory || currentLvl.activityType;
        const levelsInCat = CATEGORY_LEVELS[curCat] || [1];
        const currentIndex = levelsInCat.indexOf(currentLvl.id);

        let nextLvlId = prev.currentLevelId;
        let finishedCategory = false;

        if (currentIndex !== -1 && currentIndex < levelsInCat.length - 1) {
          nextLvlId = levelsInCat[currentIndex + 1];
        } else {
          finishedCategory = true;
        }

        if (finishedCategory) {
          // Finished the category! Return to main chooser
          setActiveCategory(null);
          // High energy voice narration on complete
          const bonusStars = 20;
          const bonusCoins = 40;
          setTimeout(() => {
            setMascotText(`YAY! 🎉 Double Yay! You completed all the levels in this game! Mimi Bear is dancing! Let's choose another adventure!`);
          }, 300);

          return {
            ...prev,
            completedLevelIds: nextCompletedIds,
            stars: prev.stars + gainedStars + bonusStars,
            coins: prev.coins + gainedCoins + bonusCoins,
            incorrectAttempts: 0,
            isEasyMode: false,
            badges: updatedBadges,
          };
        }

        return {
          ...prev,
          completedLevelIds: nextCompletedIds,
          stars: prev.stars + gainedStars,
          coins: prev.coins + gainedCoins,
          incorrectAttempts: 0,
          isEasyMode: false, // Reset assist mode
          badges: updatedBadges,
          currentLevelId: nextLvlId,
        };
      });
    }, 2500);
  };

  const handleLevelIncorrect = () => {
    ensureMusicStarts();
    audio.playEncourageTone();

    setGameState((prev) => {
      const nextAttempts = prev.incorrectAttempts + 1;
      const isNowEasy = nextAttempts >= 3;

      if (isNowEasy && !prev.isEasyMode) {
        setMascotText(`Let's work together! I have highlighted the answers. Try clicking the glowing option!`);
      } else {
        setMascotText(getRandomEncouragement());
      }

      return {
        ...prev,
        incorrectAttempts: nextAttempts,
        isEasyMode: isNowEasy,
      };
    });
  };

  // --- Mega Challenge Completion Actions ---
  const handleMegaChallengeComplete = () => {
    if (!activeMegaChallenge) return;
    
    audio.playSuccessTone();
    audio.playSoftBell();

    const currentMegaNum = activeMegaChallenge;
    const rangeLabel = currentMegaNum === 1 ? "Levels 1–5" : "Levels 6–10";
    const awardTitle = currentMegaNum === 1 ? "Number Explorer" : "Bead Master";

    const newCert: Certificate = {
      id: `cert-${currentMegaNum}-${Math.random().toString(36).substr(2, 4)}`,
      childName: gameState.childName || 'Little Mathematician',
      date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
      levelsRange: rangeLabel,
      title: awardTitle,
      logo: '🎓',
    };

    setMascotText(`YOU DID IT! You completed Mega Challenge ${currentMegaNum}! Here is your special Printable Certificate of Achievement!`);

    setGameState((prev) => {
      // Unlock "Explorer Medal" or "Grandmaster" badges
      const targetLevelForBadge = currentMegaNum === 1 ? 5 : 10;
      const updatedBadges = prev.badges.map((b) => {
        if (b.unlockedAtLevel === targetLevelForBadge) {
          return { ...b, unlocked: true };
        }
        return b;
      });

      // Unlock special accessory in shop as a direct gift: Party Hat for Challenge 1, Crown for Challenge 2!
      const giftAcc = currentMegaNum === 1 ? 'acc_party' : 'acc_crown';
      const updatedUnlocked = prev.unlockedItems.includes(giftAcc)
        ? prev.unlockedItems
        : [...prev.unlockedItems, giftAcc];

      // Advance past level 5 to 6 or end level 10
      const nextLvl = currentMegaNum === 1 ? 6 : 10;

      return {
        ...prev,
        stars: prev.stars + 15,
        coins: prev.coins + 30,
        certificates: [...prev.certificates, newCert],
        badges: updatedBadges,
        unlockedItems: updatedUnlocked,
        currentLevelId: nextLvl,
      };
    });

    setActiveMegaChallenge(null);
    setActiveCertificate(newCert);
  };

  // --- Shop Purchases ---
  const handleBuyShopItem = (item: ShopItem) => {
    setGameState((prev) => {
      if (prev.coins >= item.cost && !prev.unlockedItems.includes(item.id)) {
        return {
          ...prev,
          coins: prev.coins - item.cost,
          unlockedItems: [...prev.unlockedItems, item.id],
        };
      }
      return prev;
    });
  };

  const handleSelectAvatar = (emoji: string) => {
    setGameState((prev) => ({ ...prev, activeAvatar: emoji }));
  };

  const handleSelectAccessory = (id: string | null) => {
    setGameState((prev) => ({ ...prev, activeAccessory: id }));
  };

  const handleUpdateChildName = (name: string) => {
    setGameState((prev) => ({ ...prev, childName: name }));
    // Also update current active certificate name if open
    if (activeCertificate) {
      setActiveCertificate({ ...activeCertificate, childName: name });
    }
  };

  // --- Render Active Activity ---
  const renderActiveActivity = () => {
    if (!activeCategory) {
      return (
        <div className="flex flex-col gap-10 w-full max-w-4xl mx-auto p-4 select-none text-center animate-fade-in">
          <div>
            <h2 className="text-4xl sm:text-5xl font-display font-black text-amber-950 uppercase tracking-tight flex items-center justify-center gap-2">
              🌟 Choose Your Game! 🌟
            </h2>
            <p className="text-stone-600 text-lg sm:text-xl mt-3 max-w-2xl mx-auto font-black">
              Tap on a game below to play with Mimi Bear! Each game plays a fun automatic guide first, then it's your turn! 🎉
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto w-full">
            {/* Rods Card */}
            <button
              onClick={() => {
                audio.playSoftTap();
                setActiveCategory('rods');
                setGameState(prev => ({ ...prev, currentLevelId: 1 }));
                setIsDemoMode(true);
              }}
              className="group relative bg-red-50/70 hover:bg-red-50 border-4 border-red-200 hover:border-red-400 rounded-4xl p-8 flex flex-col items-center justify-between transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
            >
              <div className="text-8xl group-hover:animate-bounce mb-4 select-none">📏</div>
              <div className="flex-grow flex flex-col justify-center">
                <h3 className="text-2xl sm:text-3xl font-display font-black text-red-900">Number Rods</h3>
                <p className="text-stone-600 text-sm mt-2 leading-relaxed font-bold">
                  Arrange red & blue rods from smallest to largest!
                </p>
              </div>
              <div className="mt-8 w-full py-4 bg-red-500 group-hover:bg-red-600 text-white rounded-2xl font-display font-black text-base uppercase tracking-wider shadow-md">
                Play Game! 🚀
              </div>
            </button>

            {/* Beads Card */}
            <button
              onClick={() => {
                audio.playSoftTap();
                setActiveCategory('beads');
                setGameState(prev => ({ ...prev, currentLevelId: 2 }));
                setIsDemoMode(true);
              }}
              className="group relative bg-emerald-50/70 hover:bg-emerald-50 border-4 border-emerald-200 hover:border-emerald-400 rounded-4xl p-8 flex flex-col items-center justify-between transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
            >
              <div className="text-8xl group-hover:animate-bounce mb-4 select-none">📿</div>
              <div className="flex-grow flex flex-col justify-center">
                <h3 className="text-2xl sm:text-3xl font-display font-black text-emerald-900">Short Bead Stair</h3>
                <p className="text-stone-600 text-sm mt-2 leading-relaxed font-bold">
                  Count beautiful glittering beads on wooden wires!
                </p>
              </div>
              <div className="mt-8 w-full py-4 bg-emerald-500 group-hover:bg-emerald-600 text-white rounded-2xl font-display font-black text-base uppercase tracking-wider shadow-md">
                Play Game! 🚀
              </div>
            </button>

            {/* Teen-Ten Card */}
            <button
              onClick={() => {
                audio.playSoftTap();
                setActiveCategory('teen-ten');
                setGameState(prev => ({ ...prev, currentLevelId: 3 }));
                setIsDemoMode(true);
              }}
              className="group relative bg-amber-50/70 hover:bg-amber-50 border-4 border-amber-200 hover:border-amber-400 rounded-4xl p-8 flex flex-col items-center justify-between transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
            >
              <div className="text-8xl group-hover:animate-bounce mb-4 select-none">🧱</div>
              <div className="flex-grow flex flex-col justify-center">
                <h3 className="text-2xl sm:text-3xl font-display font-black text-amber-900">Teen Boards</h3>
                <p className="text-stone-600 text-sm mt-2 leading-relaxed font-bold">
                  Merge cards and stack golden beads to build double digits!
                </p>
              </div>
              <div className="mt-8 w-full py-4 bg-amber-500 group-hover:bg-amber-600 text-white rounded-2xl font-display font-black text-base uppercase tracking-wider shadow-md">
                Play Game! 🚀
              </div>
            </button>
          </div>
        </div>
      );
    }

    if (activeMegaChallenge) {
      return (
        <MegaChallenge
          challengeNumber={activeMegaChallenge}
          isEasyMode={gameState.isEasyMode}
          onComplete={handleMegaChallengeComplete}
          onIncorrect={handleLevelIncorrect}
        />
      );
    }

    const currentLevel = LEVELS.find((l) => l.id === gameState.currentLevelId);
    if (!currentLevel) {
      return (
        <div className="text-center py-12">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto animate-bounce mb-4" />
          <h2 className="text-3xl font-display font-black text-amber-950">You Completed the Journey!</h2>
          <p className="text-stone-500 text-sm mt-1 max-w-sm mx-auto">
            Amazing! You've mastered all Montessori Math levels! You can replay any level in the Progress dashboard.
          </p>
          <button
            id="restart-game-btn"
            onClick={() => {
              audio.playSoftTap();
              setGameState((prev) => ({ ...prev, currentLevelId: 1 }));
              setActiveCategory(null);
            }}
            className="mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-display font-black cursor-pointer shadow-xs hover:shadow-md"
          >
            Play From Category Selection again 🔄
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {/* Play/Demo Banner control */}
        <div className="flex flex-wrap justify-between items-center bg-stone-100 rounded-2xl p-4 border border-stone-200 max-w-3xl mx-auto w-full shadow-sm">
          <div className="flex items-center gap-3">
            {isDemoMode ? (
              <span className="flex items-center gap-1.5 bg-blue-100 text-blue-800 border border-blue-200 px-3.5 py-1.5 rounded-full font-display font-black text-sm animate-pulse">
                👀 WATCHING THE GUIDE (Demo Mode)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full font-display font-black text-sm">
                🎉 YOUR TURN TO PLAY!
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {isDemoMode && (
              <button
                onClick={() => {
                  audio.playSoftTap();
                  setIsDemoMode(false);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                Skip and Play ⏭️
              </button>
            )}

            <button
              onClick={() => {
                audio.playSoftTap();
                setActiveCategory(null);
              }}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-colors border border-stone-300"
            >
              Main Menu 🏠
            </button>
          </div>
        </div>

        {/* Selected Category Game Rendering */}
        {currentLevel.activityType === 'rods' && (
          <ActivityNumberRods
            key={currentLevel.id}
            targetNumbers={currentLevel.targetNumbers}
            isEasyMode={gameState.isEasyMode}
            onSuccess={handleLevelSuccess}
            onIncorrect={handleLevelIncorrect}
            isDemoMode={isDemoMode}
            onDemoComplete={() => setIsDemoMode(false)}
          />
        )}

        {currentLevel.activityType === 'beads' && (
          <ActivityShortBeadStair
            key={currentLevel.id}
            targetNumbers={currentLevel.targetNumbers}
            isEasyMode={gameState.isEasyMode}
            onSuccess={handleLevelSuccess}
            onIncorrect={handleLevelIncorrect}
            isDemoMode={isDemoMode}
            onDemoComplete={() => setIsDemoMode(false)}
            mathMode={currentLevel.mathMode}
          />
        )}

        {currentLevel.activityType === 'teen-ten' && (
          <ActivityTeenTenBoards
            key={currentLevel.id}
            targetNumbers={currentLevel.targetNumbers}
            isEasyMode={gameState.isEasyMode}
            onSuccess={handleLevelSuccess}
            onIncorrect={handleLevelIncorrect}
            isDemoMode={isDemoMode}
            onDemoComplete={() => setIsDemoMode(false)}
          />
        )}
      </div>
    );
  };

  // Get active companion accessory emoji
  const getAccessoryEmoji = () => {
    if (!gameState.activeAccessory) return null;
    const accessory = SHOP_ITEMS.find((i) => i.id === gameState.activeAccessory);
    return accessory ? accessory.visual : null;
  };

  return (
    <div className={`min-h-screen pb-16 flex flex-col font-sans transition-colors duration-500 ${gameState.activeBackground}`}>
      
      {/* SUCCESS CELEBRATION OVERLAY */}
      {successCelebration && celebrationDetails && (
        <div className="fixed inset-0 bg-stone-950/25 backdrop-blur-xs z-50 flex flex-col items-center justify-center p-4 animate-fade-in no-print">
          <div className="bg-white rounded-3xl p-8 border-4 border-emerald-300 shadow-2xl text-center max-w-sm w-full relative animate-bounce">
            <div className="text-6xl mb-4 animate-spin-slow">🌟</div>
            <h2 className="text-2xl font-display font-black text-emerald-800 uppercase tracking-wide">
              Perfectly Done!
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              You counted and placed everything correctly!
            </p>
            
            <div className="flex gap-4 justify-center items-center mt-6">
              <span className="flex items-center gap-1 bg-yellow-100 border border-yellow-200 text-yellow-800 font-display font-black px-4 py-2 rounded-2xl text-sm">
                ⭐ +{celebrationDetails.stars}
              </span>
              <span className="flex items-center gap-1 bg-amber-100 border border-amber-200 text-amber-800 font-display font-black px-4 py-2 rounded-2xl text-sm">
                🪙 +{celebrationDetails.coins}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SHOP DIALOG */}
      {isShopOpen && (
        <ShopDialog
          coins={gameState.coins}
          unlockedItems={gameState.unlockedItems}
          activeAvatar={gameState.activeAvatar}
          activeAccessory={gameState.activeAccessory}
          onBuyItem={handleBuyShopItem}
          onSelectAvatar={handleSelectAvatar}
          onSelectAccessory={handleSelectAccessory}
          onClose={() => setIsShopOpen(false)}
        />
      )}

      {/* CERTIFICATE LIGHTBOX */}
      {activeCertificate && (
        <CertificateView
          certificate={activeCertificate}
          onClose={() => setActiveCertificate(null)}
          onUpdateChildName={handleUpdateChildName}
        />
      )}

      {/* TOP BAR / NAVIGATION (Hides on standard print views) */}
      <header className="bg-white/85 backdrop-blur-md sticky top-0 z-40 border-b border-stone-200/40 p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xs select-none no-print">
        {/* Logo and Level Pack */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-2xl shadow-sm">
            🧩
          </div>
          <div>
            <h1 className="text-xl font-display font-black text-emerald-900 tracking-tight flex items-center gap-1">
              AU-SOME <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-sans uppercase">Maths</span>
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              Montessori-inspired supportive learning
            </p>
          </div>
        </div>

        {/* Currency displays and configuration */}
        <div className="flex flex-wrap items-center gap-3">
          <HubLinkBar className="text-emerald-900" />
          {/* Stars display */}
          <div className="flex items-center gap-1 bg-yellow-400 text-yellow-950 font-display font-black px-3.5 py-2 rounded-2xl text-xs sm:text-sm border border-yellow-300 shadow-xs">
            <span>⭐</span>
            <span>{gameState.stars}</span>
          </div>

          {/* Coins display */}
          <div className="flex items-center gap-1 bg-amber-400 text-amber-950 font-display font-black px-3.5 py-2 rounded-2xl text-xs sm:text-sm border border-amber-300 shadow-xs">
            <span>🪙</span>
            <span>{gameState.coins}</span>
          </div>

          {/* Settings button - Mute */}
          <button
            id="header-mute-btn"
            onClick={handleToggleMute}
            className={`p-2 rounded-2xl border transition-all cursor-pointer ${
              gameState.isMuted
                ? 'bg-red-50 text-red-500 border-red-100 hover:bg-red-100'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
            title={gameState.isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {gameState.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Toggle level map modal / stats view directly */}
          <button
            id="toy-shop-trigger-btn"
            onClick={() => {
              ensureMusicStarts();
              audio.playSoftTap();
              setIsShopOpen(true);
            }}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-4 py-2 rounded-2xl font-display font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer btn-tactile"
          >
            <ShoppingBag className="w-4 h-4" /> Toy Shop
          </button>
        </div>
      </header>

      {/* CORE CONTENT CONTAINER */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-6 flex-grow flex flex-col gap-6 no-print">
        
        {/* Child name greeting card if set */}
        {gameState.childName && (
          <div className="text-center sm:text-left select-none bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-2.5 text-xs text-emerald-800 font-display font-bold flex items-center justify-center sm:justify-start gap-2 max-w-fit animate-fade-in">
            👋 Hello, {gameState.childName}! Welcome back to your learning playground!
          </div>
        )}

        {/* Mascot companion speech bubble */}
        <MascotBubble
          text={mascotText}
          avatar={gameState.activeAvatar}
          voiceEnabled={gameState.voiceEnabled}
          onToggleVoice={handleToggleVoice}
          isEasyMode={gameState.isEasyMode}
        />

        {/* WORKSPACE VIEWER */}
        <div className="bg-white/45 backdrop-blur-xs rounded-4xl p-2 sm:p-4 border border-white/20">
          {activeTab === 'play' && (
            <div className="animate-fade-in">
              
              {/* Level indicator card if playing standard game */}
              {!activeMegaChallenge && LEVELS.find((l) => l.id === gameState.currentLevelId) && (
                <div className="flex justify-between items-center px-6 py-3 bg-white/70 rounded-2xl border border-stone-200/40 shadow-xs max-w-2xl mx-auto mb-4 select-none">
                  <div>
                    <span className="block text-[10px] text-stone-400 font-sans font-bold uppercase tracking-wide">
                      Active Lesson
                    </span>
                    <span className="block font-display font-black text-stone-800 text-base">
                      Level {gameState.currentLevelId}: {LEVELS.find((l) => l.id === gameState.currentLevelId)?.title}
                    </span>
                  </div>

                  <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full border ${
                    LEVELS.find((l) => l.id === gameState.currentLevelId)?.difficulty === 'easy'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : LEVELS.find((l) => l.id === gameState.currentLevelId)?.difficulty === 'medium'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
                        : 'bg-orange-50 text-orange-700 border-orange-100'
                  }`}>
                    {LEVELS.find((l) => l.id === gameState.currentLevelId)?.difficulty} difficulty
                  </span>
                </div>
              )}

              {renderActiveActivity()}
            </div>
          )}

          {activeTab === 'stickers' && (
            <div className="animate-fade-in">
              <StickerBook
                unlockedItems={gameState.unlockedItems}
                stickerPlacements={gameState.stickerPlacements}
                onUpdateStickers={(placements) => {
                  setGameState((prev) => ({ ...prev, stickerPlacements: placements }));
                }}
              />
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="animate-fade-in">
              <ProgressTracker
                completedLevelIds={gameState.completedLevelIds}
                totalLevelsCount={LEVELS.length}
                stars={gameState.stars}
                coins={gameState.coins}
                badges={gameState.badges}
                certificates={gameState.certificates}
                onViewCertificate={(id) => {
                  const found = gameState.certificates.find((c) => c.id === id);
                  if (found) setActiveCertificate(found);
                }}
              />
            </div>
          )}

          {activeTab === 'real-shop' && (
            <div className="animate-fade-in">
              <RealMontessoriShop />
            </div>
          )}
        </div>
      </main>

      {/* LOWER TAB BAR CONTROLLER */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-stone-200/50 p-3 flex justify-around items-center shadow-lg select-none no-print">
        <button
          id="tab-btn-play"
          onClick={() => {
            ensureMusicStarts();
            audio.playSoftTap();
            setActiveTab('play');
          }}
          className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'play'
              ? 'bg-emerald-100 text-emerald-800 scale-105 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span className="text-xl sm:text-2xl">🎮</span>
          <span className="text-[10px] font-display font-bold uppercase tracking-wider mt-1">Play Math</span>
        </button>

        <button
          id="tab-btn-stickers"
          onClick={() => {
            ensureMusicStarts();
            audio.playSoftTap();
            setActiveTab('stickers');
          }}
          className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'stickers'
              ? 'bg-amber-100 text-amber-800 scale-105 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span className="text-xl sm:text-2xl">🎨</span>
          <span className="text-[10px] font-display font-bold uppercase tracking-wider mt-1">Sticker Board</span>
        </button>

        <button
          id="tab-btn-progress"
          onClick={() => {
            ensureMusicStarts();
            audio.playSoftTap();
            setActiveTab('progress');
          }}
          className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'progress'
              ? 'bg-purple-100 text-purple-800 scale-105 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span className="text-xl sm:text-2xl">📊</span>
          <span className="text-[10px] font-display font-bold uppercase tracking-wider mt-1">Progress Map</span>
        </button>

        <button
          id="tab-btn-real-shop"
          onClick={() => {
            ensureMusicStarts();
            audio.playSoftTap();
            setActiveTab('real-shop');
          }}
          className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'real-shop'
              ? 'bg-red-100 text-red-800 scale-105 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span className="text-xl sm:text-2xl">🛍️</span>
          <span className="text-[10px] font-display font-bold uppercase tracking-wider mt-1">Real Materials</span>
        </button>
      </footer>

    </div>
  );
}
