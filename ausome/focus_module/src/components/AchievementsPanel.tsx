import React from "react";
import { Trophy, Star, ShieldCheck, Flame, BookOpen, BrainCircuit, Heart, Award, Sparkles } from "lucide-react";
import { Achievement, Profile } from "../types";
import { getBadgeForLevel, THEMES } from "../levelsConfig";

interface AchievementsPanelProps {
  profile: Profile;
  achievements: Achievement[];
  onClaimAchievementReward: (achievementId: string, rewardCoins: number) => void;
  onClose: () => void;
}

// Icon mapper for achievements
const getAchievementIcon = (iconName: string) => {
  const props = { className: "w-8 h-8 text-muted-lavender" };
  switch (iconName) {
    case "Trophy": return <Trophy {...props} />;
    case "Star": return <Star {...props} />;
    case "ShieldCheck": return <ShieldCheck {...props} />;
    case "Flame": return <Flame {...props} />;
    case "BookOpen": return <BookOpen {...props} />;
    case "BrainCircuit": return <BrainCircuit {...props} />;
    case "Heart": return <Heart {...props} />;
    case "Award": return <Award {...props} />;
    default: return <Sparkles {...props} />;
  }
};

export default function AchievementsPanel({
  profile,
  achievements,
  onClaimAchievementReward,
  onClose
}: AchievementsPanelProps) {
  return (
    <div id="achievements-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-60 bg-muted-lavender/30 backdrop-blur-sm">
      <div className="w-full max-w-3xl h-[85vh] flex flex-col rounded-3xl border-4 border-muted-lavender bg-warm-cream overflow-hidden shadow-2xl">
        
        {/* Sticky Header */}
        <div className="p-6 border-b-4 border-muted-lavender bg-soft-blue/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="w-10 h-10 text-muted-lavender animate-bounce" />
            <div>
              <h2 className="text-3xl font-bold text-muted-lavender">Your Badges & Awards</h2>
              <p className="text-sm text-muted-lavender/80">Every match builds your focus strength!</p>
            </div>
          </div>
          <button
            id="close-achievements-header"
            onClick={onClose}
            className="px-5 py-2 bg-warm-cream hover:bg-muted-lavender/10 text-muted-lavender font-bold rounded-xl border-2 border-muted-lavender transition-all active:scale-95"
          >
            Close
          </button>
        </div>

        {/* Scrollable achievements list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((ach) => {
              const progressPercent = Math.min(100, Math.round((ach.currentValue / ach.requiredValue) * 100));
              const isClaimed = profile.badges.includes(ach.id);

              return (
                <div 
                  key={ach.id}
                  className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                    ach.isUnlocked 
                      ? "bg-soft-green/10 border-soft-green shadow-sm" 
                      : "bg-muted-lavender/5 border-muted-lavender/20"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-3 rounded-2xl border-2 ${
                      ach.isUnlocked ? "bg-soft-green/30 border-soft-green" : "bg-warm-cream border-muted-lavender/20"
                    }`}>
                      {getAchievementIcon(ach.iconName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-muted-lavender truncate">{ach.title}</h4>
                      <p className="text-xs text-muted-lavender/70 mt-1 leading-relaxed">{ach.description}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-bold text-muted-lavender/80 mb-1">
                      <span>Progress: {progressPercent}%</span>
                      <span>{ach.currentValue} / {ach.requiredValue}</span>
                    </div>
                    <div className="w-full h-4 bg-warm-cream rounded-full border-2 border-muted-lavender/20 overflow-hidden">
                      <div 
                        className="h-full bg-soft-blue transition-all duration-500" 
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Reward Action */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm font-bold text-muted-lavender">
                      <span>Reward:</span>
                      <span className="text-soft-green font-extrabold">+{ach.rewardCoins} Coins</span>
                    </div>

                    {isClaimed ? (
                      <span className="text-xs font-bold uppercase tracking-wide bg-soft-green/20 text-muted-lavender border border-soft-green px-3 py-1 rounded-full">
                        Unlocked 🎉
                      </span>
                    ) : ach.isUnlocked ? (
                      <button
                        onClick={() => onClaimAchievementReward(ach.id, ach.rewardCoins)}
                        className="px-4 py-2 bg-soft-green hover:bg-soft-green/90 text-muted-lavender text-xs font-bold rounded-xl border-2 border-muted-lavender shadow-sm transition-all active:scale-95 cursor-pointer"
                      >
                        Claim Badge 🏆
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-muted-lavender/50 uppercase tracking-wider">
                        Locked 🔒
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Dynamic Custom Level Badges Showcase Album */}
          <div className="mt-8 border-t-4 border-dashed border-muted-lavender/30 pt-6">
            <h3 className="text-2xl font-black text-muted-lavender mb-2 text-center flex items-center justify-center gap-2">
              <span>🌟 Your Level Badges Showcase 🌟</span>
            </h3>
            <p className="text-center text-xs text-muted-lavender/70 mb-6">
              Every level you pass after Level 5 unlocks a special, unique memory focus badge!
            </p>

            {profile.badges.filter(b => b.startsWith("level_badge_")).length === 0 ? (
              <div className="p-8 bg-warm-cream border-2 border-dashed border-muted-lavender/30 rounded-2xl text-center text-sm text-muted-lavender/60">
                🔒 No level badges collected yet. Pass any level after Level 5 to start your custom album!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {profile.badges
                  .filter(b => b.startsWith("level_badge_"))
                  .map(id => {
                    const lvlStr = id.replace("level_badge_", "");
                    const lvl = parseInt(lvlStr, 10);
                    return lvl;
                  })
                  .filter(lvl => !isNaN(lvl))
                  .sort((a, b) => a - b)
                  .map((lvl) => {
                    const theme = THEMES[(lvl - 1) % THEMES.length];
                    const badgeInfo = getBadgeForLevel(lvl, theme);
                    
                    return (
                      <div 
                        key={lvl}
                        className="p-4 rounded-2xl border-2 border-muted-lavender bg-warm-cream flex flex-col items-center text-center shadow-sm relative overflow-hidden hover:scale-105 transition-all duration-300"
                      >
                        {/* Badge Icon */}
                        <div className="p-2.5 bg-soft-blue/20 rounded-full border-2 border-muted-lavender mb-2">
                          {getAchievementIcon(badgeInfo.iconName)}
                        </div>
                        
                        {/* Badge Title */}
                        <span className="text-xs font-black text-muted-lavender leading-tight block truncate w-full" title={badgeInfo.title}>
                          {badgeInfo.title.split(": ")[1]}
                        </span>
                        
                        {/* Badge Sub */}
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-lavender/60 mt-1 block">
                          Level {lvl}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-4 border-muted-lavender bg-warm-cream flex justify-center">
          <button
            id="close-achievements-footer"
            onClick={onClose}
            className="w-full max-w-sm py-4 bg-soft-blue hover:bg-soft-blue/90 text-muted-lavender text-xl font-bold rounded-2xl border-4 border-muted-lavender transition-all active:scale-98 shadow-md"
          >
            Back to Adventure Map
          </button>
        </div>

      </div>
    </div>
  );
}
