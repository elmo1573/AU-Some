import React, { useEffect } from "react";
import { Award, Sparkles, Star, Gift, ArrowRight } from "lucide-react";
import { playCalmSound } from "./SoundManager";
import confetti from "canvas-confetti";

interface CelebrationScreenProps {
  level: number;
  pointsEarned: number;
  coinsEarned: number;
  xpEarned: number;
  bonusTheme?: string;
  bonusBadge?: string;
  onNextLevel: () => void;
  isCalmMode?: boolean;
}

const CONGRATS_MESSAGES = [
  "You did it!",
  "Wonderful focus!",
  "Great matching!",
  "You kept trying.",
  "So proud of you."
];

export default function CelebrationScreen({
  level,
  pointsEarned,
  coinsEarned,
  xpEarned,
  bonusTheme,
  bonusBadge,
  onNextLevel,
  isCalmMode = false
}: CelebrationScreenProps) {
  const congratulationText = CONGRATS_MESSAGES[(level - 1) % CONGRATS_MESSAGES.length];

  useEffect(() => {
    if (!isCalmMode) {
      // Play a soft cascading chime melody for rewards
      const timer1 = setTimeout(() => playCalmSound("bell", 1.0), 100);
      const timer2 = setTimeout(() => playCalmSound("chime", 1.0), 400);
      const timer3 = setTimeout(() => playCalmSound("piano", 1.0), 800);

      // Double-corner spectacular vibrant confetti blast
      try {
        const vibrantColors = ["#FF1E56", "#FFAC41", "#00FFC6", "#39FF14", "#9B5DE5", "#FF781F", "#FF007F"];
        confetti({
          particleCount: 75,
          angle: 60,
          spread: 75,
          origin: { x: 0, y: 0.8 },
          colors: vibrantColors
        });
        confetti({
          particleCount: 75,
          angle: 120,
          spread: 75,
          origin: { x: 1, y: 0.8 },
          colors: vibrantColors
        });
      } catch (err) {
        console.warn("Celebration confetti failed to launch", err);
      }

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isCalmMode]);

  return (
    <div id="mega-celebration-screen" className="fixed inset-0 z-50 flex items-center justify-center bg-warm-cream p-4 overflow-hidden select-none">
      
      {/* Background Soft Rainbow & Balloons (hidden in Calm Mode) */}
      {!isCalmMode && (
        <>
          {/* Gentle Pastel Rainbow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-soft-blue/10 via-warm-cream to-soft-green/10 opacity-70 mix-blend-multiply pointer-events-none" />
          
          {/* Slow Floating Balloons */}
          <div className="absolute bottom-[-100px] left-[10%] w-16 h-20 bg-soft-blue/30 border-2 border-muted-lavender/30 rounded-full animate-[bounce_10s_infinite] opacity-60 pointer-events-none flex items-center justify-center">
            <span className="text-xl">🎈</span>
          </div>
          <div className="absolute bottom-[-150px] right-[15%] w-20 h-24 bg-soft-green/30 border-2 border-muted-lavender/30 rounded-full animate-[bounce_12s_infinite] opacity-60 pointer-events-none flex items-center justify-center">
            <span className="text-2xl">🎈</span>
          </div>
          <div className="absolute top-[10%] right-[8%] w-14 h-18 bg-muted-lavender/20 border-2 border-muted-lavender/25 rounded-full animate-[bounce_8s_infinite] opacity-60 pointer-events-none flex items-center justify-center">
            <span className="text-lg">🎈</span>
          </div>

          {/* Sparkles Particle Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => {
              const leftVal = `${(i * 17) % 100}%`;
              const topVal = `${(i * 23) % 100}%`;
              const delayVal = `${(i * 0.4).toFixed(1)}s`;
              return (
                <div 
                  key={i}
                  className="absolute w-4 h-4 text-soft-green opacity-40 animate-ping"
                  style={{
                    left: leftVal,
                    top: topVal,
                    animationDelay: delayVal,
                    animationDuration: "3s"
                  }}
                >
                  <Sparkles className="w-4 h-4 text-muted-lavender" />
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Main Celebration Box */}
      <div className="w-full max-w-2xl text-center p-6 md:p-10 border-8 border-double border-muted-lavender rounded-3xl bg-warm-cream relative shadow-2xl z-10 animate-fade-in">
        
        {/* Confetti Star Header (Calm/Static in Calm Mode) */}
        <div className="flex justify-center mb-6 relative">
          <div className={`p-6 bg-soft-blue/20 rounded-full border-4 border-muted-lavender relative ${!isCalmMode ? 'animate-bounce' : ''}`}>
            <Award className="w-20 h-20 text-muted-lavender" />
          </div>
          {!isCalmMode && (
            <>
              <Star className="absolute top-0 left-12 w-8 h-8 text-muted-lavender animate-spin text-soft-green fill-soft-green" />
              <Star className="absolute bottom-2 right-12 w-6 h-6 text-muted-lavender animate-pulse" />
            </>
          )}
        </div>

        {/* Milestone Indicator */}
        <div className="mb-4">
          <span className="px-5 py-2 rounded-full border-2 border-muted-lavender bg-soft-green/20 text-muted-lavender font-black text-sm uppercase tracking-wider">
            ⭐ LEVEL {level} CELEBRATION ⭐
          </span>
        </div>

        {/* Warm Messages */}
        <h1 className="text-4xl md:text-5xl font-black text-muted-lavender mb-2">
          {congratulationText}
        </h1>
        <p className="text-lg text-muted-lavender/80 mb-8 max-w-md mx-auto">
          You finished this focus challenge! You did a wonderful job identifying matching pairs.
        </p>

        {/* Reward Summary Table */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
          
          <div className="p-3 bg-warm-cream border-2 border-muted-lavender rounded-2xl flex flex-col items-center">
            <span className="text-xs font-bold text-muted-lavender/60 uppercase">Points</span>
            <span className="text-xl font-black text-muted-lavender">+{pointsEarned}</span>
          </div>

          <div className="p-3 bg-soft-green/20 border-2 border-muted-lavender rounded-2xl flex flex-col items-center">
            <span className="text-xs font-bold text-muted-lavender/60 uppercase">Coins</span>
            <span className="text-xl font-black text-muted-lavender">+{coinsEarned}</span>
          </div>

          <div className="p-3 bg-warm-cream border-2 border-muted-lavender rounded-2xl flex flex-col items-center">
            <span className="text-xs font-bold text-muted-lavender/60 uppercase">XP</span>
            <span className="text-xl font-black text-muted-lavender">+{xpEarned}</span>
          </div>

        </div>

        {/* Unlocks section */}
        {(bonusTheme || bonusBadge) && (
          <div className="mb-8 p-4 bg-soft-blue/10 border-2 border-muted-lavender rounded-2xl max-w-md mx-auto space-y-2">
            <h4 className="text-sm font-black text-muted-lavender flex items-center justify-center gap-1">
              <Gift className="w-4 h-4 text-muted-lavender" />
              <span>SPECIAL MILESTONE BONUSES</span>
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {bonusTheme && (
                <span className="bg-soft-green px-3 py-1 rounded-xl text-xs font-black border border-muted-lavender">
                  Unlocked Theme: {bonusTheme} 🎨
                </span>
              )}
              {bonusBadge && (
                <span className="bg-soft-blue px-3 py-1 rounded-xl text-xs font-black border border-muted-lavender">
                  Earned Badge: {bonusBadge} 🏆
                </span>
              )}
            </div>
          </div>
        )}

        {/* Progression Button */}
        <div className="flex justify-center">
          <button
            id="celebration-continue-button"
            onClick={onNextLevel}
            className="px-10 py-5 bg-soft-green hover:bg-soft-green/90 text-muted-lavender text-2xl font-black rounded-2xl border-4 border-muted-lavender shadow-lg flex items-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <span>Continue Quest</span>
            <ArrowRight className="w-6 h-6 text-muted-lavender" />
          </button>
        </div>

      </div>
    </div>
  );
}
