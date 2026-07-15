import React from "react";
import { Calendar, CheckCircle2, Award, Gift, Sparkles } from "lucide-react";
import { Profile } from "../types";

interface DailyLoginProps {
  profile: Profile;
  onClaimReward: (rewardCoins: number, rewardTheme?: string, rewardBadge?: string) => void;
  onClose: () => void;
}

const DAYS_REWARDS = [
  { day: 1, type: "coins", value: 20, label: "20 Coins" },
  { day: 2, type: "coins", value: 30, label: "30 Coins" },
  { day: 3, type: "theme", value: 0, label: "Ocean Theme", themeName: "Ocean" },
  { day: 4, type: "coins", value: 50, label: "50 Coins" },
  { day: 5, type: "badge", value: 0, label: "Calm Explorer Badge", badgeName: "Calm Explorer" },
  { day: 6, type: "coins", value: 100, label: "100 Coins" },
  { day: 7, type: "mega", value: 200, label: "200 Coins + Certificate Sticker" }
];

export default function DailyLogin({ profile, onClaimReward, onClose }: DailyLoginProps) {
  // Let's determine the next claim day based on streak (modulo 7)
  const currentStreakIndex = (profile.streak) % 7;
  
  // Checks if already claimed today
  const todayStr = new Date().toISOString().split("T")[0];
  const hasClaimedToday = profile.lastLoginDate === todayStr;

  const handleClaim = () => {
    if (hasClaimedToday) return;

    const reward = DAYS_REWARDS[currentStreakIndex];
    if (reward.type === "coins" || reward.type === "mega") {
      onClaimReward(reward.value);
    } else if (reward.type === "theme") {
      onClaimReward(20, reward.themeName); // award small coins and theme
    } else if (reward.type === "badge") {
      onClaimReward(30, undefined, reward.badgeName); // award coins and badge
    }
  };

  return (
    <div id="daily-login-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-60 bg-muted-lavender/30 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border-4 border-muted-lavender bg-warm-cream p-6 md:p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="p-3 bg-soft-blue/20 rounded-full border-2 border-soft-blue">
            <Calendar className="w-8 h-8 text-muted-lavender" />
          </div>
          <h2 className="text-3xl font-bold text-muted-lavender">Daily Explorer Calendar</h2>
          <p className="text-lg text-muted-lavender/80">Log in every day to collect soft prizes and unlock custom themes!</p>
        </div>

        {/* Streak Info */}
        <div className="mb-6 p-4 rounded-2xl border-2 border-muted-lavender bg-soft-blue/10 flex items-center justify-between">
          <div>
            <p className="text-base text-muted-lavender/70">Your Active Streak</p>
            <p className="text-2xl font-bold text-muted-lavender">{profile.streak} Days Row</p>
          </div>
          <div className="flex items-center space-y-1 bg-soft-green/20 px-4 py-2 rounded-xl border-2 border-soft-green">
            <Sparkles className="w-5 h-5 text-muted-lavender mr-1" />
            <span className="font-bold text-muted-lavender">+20 Daily XP</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-8">
          {DAYS_REWARDS.map((reward, idx) => {
            const isCompleted = idx < currentStreakIndex;
            const isToday = idx === currentStreakIndex && !hasClaimedToday;
            const isClaimedTodayItem = idx === currentStreakIndex && hasClaimedToday;

            let statusBg = "bg-warm-cream border-muted-lavender/40";
            let iconColor = "text-muted-lavender/40";

            if (isCompleted || isClaimedTodayItem) {
              statusBg = "bg-soft-green/30 border-soft-green text-muted-lavender";
              iconColor = "text-muted-lavender";
            } else if (isToday) {
              statusBg = "bg-soft-blue/30 border-soft-blue text-muted-lavender animate-pulse scale-102";
              iconColor = "text-muted-lavender font-bold";
            }

            return (
              <div 
                key={reward.day}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${statusBg}`}
              >
                <span className="text-sm font-bold opacity-80">Day {reward.day}</span>
                <div className="my-2 p-1.5 bg-warm-cream/50 rounded-full border border-muted-lavender/20">
                  {reward.type === "coins" || reward.type === "mega" ? (
                    <Gift className={`w-5 h-5 ${iconColor}`} />
                  ) : reward.type === "theme" ? (
                    <Sparkles className={`w-5 h-5 ${iconColor}`} />
                  ) : (
                    <Award className={`w-5 h-5 ${iconColor}`} />
                  )}
                </div>
                <span className="text-xs font-bold text-center leading-tight">{reward.label}</span>
                
                {/* Status Indicator */}
                <div className="mt-2">
                  {isCompleted || isClaimedTodayItem ? (
                    <CheckCircle2 className="w-4 h-4 text-muted-lavender" />
                  ) : isToday ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-soft-blue px-1.5 py-0.5 rounded text-warm-cream">Ready</span>
                  ) : (
                    <span className="text-[10px] opacity-40 font-bold">Soon</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            id="claim-reward-button"
            disabled={hasClaimedToday}
            onClick={handleClaim}
            className={`px-8 py-4 rounded-2xl text-xl font-bold border-4 border-muted-lavender transition-all ${
              hasClaimedToday 
                ? "bg-soft-green/20 text-muted-lavender/50 cursor-not-allowed opacity-60" 
                : "bg-soft-green hover:bg-soft-green/90 active:scale-98 text-muted-lavender cursor-pointer shadow-md"
            }`}
          >
            {hasClaimedToday ? "Today's Reward Collected! 🎉" : "Collect My Day Reward 🎁"}
          </button>
          
          <button
            id="close-daily-button"
            onClick={onClose}
            className="px-8 py-4 bg-soft-blue hover:bg-soft-blue/90 text-muted-lavender text-xl font-bold rounded-2xl border-4 border-muted-lavender transition-all active:scale-98 shadow-md"
          >
            Back to Game Map
          </button>
        </div>

      </div>
    </div>
  );
}
