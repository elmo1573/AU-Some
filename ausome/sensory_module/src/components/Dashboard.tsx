import { Star, Lock, Award, Heart, Volume2, VolumeX, Flame, Eye, Fingerprint, Sparkles } from "lucide-react";
import { LEVELS, ACHIEVEMENTS, GameProgress, SENSES_INFO } from "../types";
import { PASTEL_COLORS } from "./LevelActivities";
import * as audio from "../utils/audio";
import { useState } from "react";
import HubLinkBar from "@shared/HubLinkBar";

interface DashboardProps {
  progress: GameProgress;
  onSelectLevel: (levelId: number) => void;
  onResetProgress: () => void;
  onOpenShop: () => void;
}

export default function Dashboard({ progress, onSelectLevel, onResetProgress, onOpenShop }: DashboardProps) {
  const [activeAmbient, setActiveAmbient] = useState<'none' | 'rain' | 'waves' | 'birds' | 'wind' | 'water'>('none');
  const [muted, setMuted] = useState(audio.getMuteState());
  const [selectedJourneyIndex, setSelectedJourneyIndex] = useState<number>(0);

  const handleAmbientPlay = (type: 'rain' | 'waves' | 'birds' | 'wind' | 'water') => {
    if (activeAmbient === type) {
      audio.stopBackgroundSound();
      setActiveAmbient('none');
    } else {
      audio.setMuteState(false);
      setMuted(false);
      audio.playBackgroundSound(type);
      setActiveAmbient(type);
    }
  };

  const toggleMute = () => {
    const nextMute = !muted;
    setMuted(nextMute);
    audio.setMuteState(nextMute);
    if (nextMute) {
      setActiveAmbient('none');
    }
  };

  const getLatestUnlockedLevelId = () => {
    const unlocked = progress.unlockedLevels;
    if (unlocked.length === 0) return 1;
    return Math.max(...unlocked);
  };

  const latestLevelId = getLatestUnlockedLevelId();
  const latestLevel = LEVELS.find(l => l.id === latestLevelId) || LEVELS[0];

  // Get active selected journey info
  const activeJourney = SENSES_INFO[selectedJourneyIndex];
  
  // Calculate completed count for each journey
  const getJourneyCompletedCount = (journeyIdx: number) => {
    const journeyLevels = SENSES_INFO[journeyIdx].levels;
    return journeyLevels.filter(lvl => progress.completedLevels.includes(lvl.id)).length;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 animate-fadeIn">
      {/* Header Navigation */}
      <header className="flex flex-col sm:flex-row items-center justify-between p-6 bg-[#E8EDEA]/70 backdrop-blur-xl border border-white/60 rounded-[32px] mb-8 shadow-lg gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#B8C5B0] flex items-center justify-center shadow-md border-2 border-white">
            <div className="w-6 h-6 border-4 border-white rounded-full animate-pulse"></div>
          </div>
          <div>
            <span className="text-3xl font-black tracking-tight text-[#5A6357]">AU-SOME</span>
            <span className="text-xs uppercase tracking-wider text-[#9CA3AF] font-bold block">Sensory Learning</span>
          </div>
        </div>
        
        {/* Dynamic overall progress bar - out of 100 levels! */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 w-full max-w-md">
          <div className="flex justify-between text-xs text-[#5A6357] font-black mb-1">
            <span>Overall Progress</span>
            <span>{progress.completedLevels.length}% Completed ({progress.completedLevels.length}/100)</span>
          </div>
          <div className="w-full h-4 bg-[#D6E6F2] rounded-full overflow-hidden shadow-inner relative" title="Your overall progress mapping">
            <div 
              className="h-full bg-[#A8C8BC] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress.completedLevels.length}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <HubLinkBar className="text-[#5A6357]" />
          <button 
            id="header-shop-btn"
            onClick={onOpenShop}
            className="px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60 shadow-xs flex items-center gap-1.5 cursor-pointer font-black text-xs sm:text-sm active:scale-95 transition-all hover:scale-105"
            title="Visit KS Montessori Sensory Shop"
          >
            <span>🛍️</span>
            <span>Shop</span>
          </button>
          <div className="px-4 py-2 bg-white/60 backdrop-blur-md border border-white rounded-full shadow-sm flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-base text-[#5A6357]">{progress.calmStars} Calm Stars</span>
          </div>
          <button 
            id="sound-mute-toggle-header"
            onClick={toggleMute}
            className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center border border-white shadow-sm cursor-pointer hover:bg-white/95 active:scale-95 transition-all text-xl"
            title={muted ? "Unmute sounds" : "Mute all sounds"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </header>

      {/* Gentle description */}
      <div className="text-center mb-8 bg-white/30 backdrop-blur-md p-6 border border-white/40 rounded-[28px] max-w-2xl mx-auto shadow-sm">
        <p className="text-[#5A6357] text-lg font-bold leading-relaxed">
          Welcome back! Explore 5 sensory zones. Take your time, listen to calming sounds, and complete sweet quests at your own pace. 🌸
        </p>
      </div>

      {/* Primary Continuation banner and Stats card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Core Progress Card */}
        <div id="stats-progress-card" className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-[#9CA3AF] font-bold text-sm uppercase tracking-wider mb-2">My Journey Progress</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-[#5A6357]">{progress.completedLevels.length}</span>
              <span className="text-[#9CA3AF] text-xl font-bold">/ 100</span>
            </div>
            <p className="text-sm text-[#6B7280] mt-1 font-bold">Peaceful activities successfully completed</p>
          </div>
          
          <div className="mt-4">
            <div className="w-full h-4 bg-[#D6E6F2] rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-[#A8C8BC] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress.completedLevels.length}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#9CA3AF] font-mono mt-2 font-bold">
              <span>Start</span>
              <span className="text-[#5A6357]">{progress.completedLevels.length}% Done</span>
              <span>100 Levels!</span>
            </div>
          </div>
        </div>

        {/* Big Continuation Banner */}
        <div id="action-continue-card" className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-xl md:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex-1 text-center sm:text-left">
            <span className="bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-3 animate-pulse">
              👑 Next recommended level
            </span>
            <h2 className="text-3xl font-black text-[#5A6357] leading-tight">
              Level {latestLevel.id} – {latestLevel.title}
            </h2>
            <p className="text-[#6B7280] text-base sm:text-lg mt-2 font-bold">
              {latestLevel.description}
            </p>
          </div>
          <button
            id="dashboard-continue-btn"
            onClick={() => onSelectLevel(latestLevel.id)}
            className="w-full sm:w-auto bg-[#B8C5B0] hover:bg-[#A8C8BC] text-white font-extrabold text-xl px-10 py-6 rounded-3xl shadow-lg shadow-[#B8C5B0]/40 transition-all transform hover:scale-102 active:scale-95 cursor-pointer select-none"
          >
            Continue Journey
          </button>
        </div>
      </div>

      {/* Atmospheric Soundscapes */}
      <div id="atmospheric-music-card" className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-xl mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌸</span>
            <h3 className="font-extrabold text-[#5A6357] text-xl">Sensory Atmospheric Soundscapes</h3>
          </div>
          <button
            id="sound-mute-toggle"
            onClick={toggleMute}
            className={`w-10 h-10 rounded-full border transition-all cursor-pointer flex items-center justify-center shadow-xs ${
              muted 
                ? "bg-amber-100/70 border-amber-200 text-amber-800" 
                : "bg-white/70 border-white/90 text-[#5A6357] hover:bg-white/95"
            }`}
            title={muted ? "Unmute sounds" : "Mute all sounds"}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
        <p className="text-[#6B7280] text-sm mb-4 font-bold">
          Optional gentle background sounds to help you focus and feel calm. Tap a box to start or stop.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { id: 'rain', label: 'Raindrops', icon: '🌧️' },
            { id: 'waves', label: 'Ocean Waves', icon: '🌊' },
            { id: 'birds', label: 'Soft Birds', icon: '🐦' },
            { id: 'wind', label: 'Forest Wind', icon: '🍃' },
            { id: 'water', label: 'Spring Water', icon: '💧' }
          ].map((snd) => {
            const isActive = activeAmbient === snd.id;
            return (
              <button
                key={snd.id}
                id={`ambient-btn-${snd.id}`}
                onClick={() => handleAmbientPlay(snd.id as any)}
                className={`py-3.5 px-4 rounded-[20px] border text-base font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:scale-105 duration-300 ${
                  isActive 
                    ? "bg-[#B8C5B0] text-white border-white shadow-md ring-4 ring-[#B8C5B0]/25" 
                    : "bg-white/50 border-white/60 text-[#4A4A4A] hover:bg-white/70 shadow-sm"
                }`}
              >
                <span className="text-3xl">{snd.icon}</span>
                <span>{snd.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Montessori Shop Promo Card */}
      <div id="shop-promo-card" className="bg-[#FAF6EE]/90 border border-[#EBE3CE]/60 rounded-[32px] p-6 shadow-md mb-8 flex flex-col sm:flex-row justify-between items-center gap-6 animate-fadeIn">
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="bg-[#ECE5D3] text-[#8D8268] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Exclusive Montessori Partner
            </span>
            <span className="bg-emerald-50 text-emerald-800 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              ✨ Physical Play Materials
            </span>
          </div>
          <h3 className="text-2xl font-black text-[#5C523C] leading-tight">
            Explore the KS Montessori Sensory Toy Shop
          </h3>
          <p className="text-[#6B7280] text-sm font-bold leading-relaxed">
            Enhance auditory, visual, and tactile learning with physical materials like standard Dressing Frames, Sound Boxes, Touch Tablets, and Brown Stairs. Curated to complement our learning game.
          </p>
        </div>
        <button
          id="dashboard-visit-shop-btn"
          onClick={onOpenShop}
          className="w-full sm:w-auto bg-[#8C9C84] hover:bg-[#7D8C75] text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all transform hover:scale-102 active:scale-95 cursor-pointer select-none flex items-center justify-center gap-2 shrink-0"
        >
          <span>🛍️ Open Sensory Shop</span>
        </button>
      </div>

      {/* Senses Journeys Tab Selector - Highly interactive and visual for autism friendliness */}
      <div className="mb-8">
        <h3 className="text-3xl font-black text-[#5A6357] mb-6 flex items-center gap-2.5">
          <span className="text-xl">🌸</span>
          <span>My 5 Senses Journeys</span>
        </h3>

        {/* Tactile Big Zone Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {SENSES_INFO.map((sense, idx) => {
            const isSelected = selectedJourneyIndex === idx;
            const completedCount = getJourneyCompletedCount(idx);
            
            return (
              <button
                key={sense.name}
                id={`sense-tab-${idx}`}
                onClick={() => {
                  audio.playSuccessChime();
                  setSelectedJourneyIndex(idx);
                }}
                className={`p-4 rounded-3xl border-2 text-center transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:scale-102 ${
                  isSelected 
                    ? "shadow-lg scale-102 font-black border-[#A8C8BC]" 
                    : "bg-white/40 border-white/60 text-[#5A6357] hover:bg-white/70"
                }`}
                style={{ backgroundColor: isSelected ? sense.color : undefined }}
              >
                <span className="text-4xl filter drop-shadow-xs">{sense.emoji}</span>
                <span className="text-base font-extrabold tracking-tight mt-1 text-[#3B4438]">{sense.name}</span>
                <span className="text-[11px] font-black uppercase text-slate-500 bg-white/70 px-2 py-0.5 rounded-full mt-1 border border-white/40">
                  {completedCount}/20 Done
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Levels Matrix Section for the Selected Journey */}
      <div className="mb-12 bg-white/30 backdrop-blur-md p-6 rounded-[36px] border border-white/40 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-2">
          <div>
            <h4 className="text-2xl font-black text-[#5A6357] flex items-center gap-2">
              <span>{activeJourney.emoji}</span>
              <span>{activeJourney.name} Map</span>
            </h4>
            <p className="text-[#6B7280] text-sm font-bold mt-1">
              Complete each level to unlock the next. Look out for the gold **Mega Levels** after every 5 activities to test your mastery!
            </p>
          </div>
          <div className="bg-white/60 border border-white/80 px-4 py-2 rounded-full font-black text-[#5A6357] text-sm shadow-xs shrink-0">
            Progress: {getJourneyCompletedCount(selectedJourneyIndex)} / 20 Completed
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {activeJourney.levels.map((lvl) => {
            const level = LEVELS.find(l => l.id === lvl.id) || LEVELS[0];
            const isCompleted = progress.completedLevels.includes(level.id);
            const isUnlocked = progress.unlockedLevels.includes(level.id);
            const isMega = level.id % 5 === 0;

            return (
              <button
                key={level.id}
                id={`level-card-${level.id}`}
                disabled={!isUnlocked}
                onClick={() => onSelectLevel(level.id)}
                className={`p-5 rounded-[28px] border text-left flex flex-col justify-between min-h-[145px] transition-all relative cursor-pointer select-none duration-300 ${
                  isCompleted 
                    ? isMega 
                      ? "bg-amber-50/70 border-amber-300 hover:bg-amber-100/60 shadow-lg scale-102 ring-2 ring-amber-200"
                      : "bg-white/85 border-emerald-300/80 hover:bg-white hover:border-emerald-400 shadow-md hover:scale-105" 
                    : isUnlocked 
                      ? isMega 
                        ? "bg-amber-50 border-amber-400/80 hover:bg-amber-100 shadow-lg scale-102 hover:scale-105 ring-2 ring-amber-300"
                        : "bg-white/55 border-white/80 hover:bg-white hover:border-white shadow-md hover:scale-105" 
                      : "bg-[#E8EDEA]/40 border-slate-200/40 opacity-40 cursor-not-allowed"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#5A6357] font-black text-[12px] uppercase tracking-wider">Level {level.id}</span>
                    {isCompleted ? (
                      <span className="text-amber-400 text-lg">⭐</span>
                    ) : !isUnlocked ? (
                      <Lock className="text-[#9CA3AF]" size={14} />
                    ) : isMega ? (
                      <span className="text-amber-500 text-sm animate-bounce">👑</span>
                    ) : null}
                  </div>
                  <h4 className={`font-black leading-tight text-base ${isMega ? "text-amber-900" : "text-[#4A4A4A]"}`}>
                    {level.title}
                  </h4>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {isMega && (
                    <span className="text-[10px] bg-amber-200 border border-amber-300 text-amber-900 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Mega Level
                    </span>
                  )}
                  <span className="text-[10px] bg-white/80 text-[#5A6357] px-2 py-0.5 rounded-full font-black border border-white/60">
                    {level.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="border-t border-[#D1D8D5] pt-10">
        <h3 className="text-3xl font-black text-[#5A6357] mb-6 flex items-center gap-2">
          <Award className="text-amber-500" size={24} />
          <span>My Calm Achievements</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = progress.achievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                id={`achievement-${ach.id}`}
                className={`p-5 rounded-[28px] border flex flex-col justify-between gap-4 transition-all duration-500 ${
                  isUnlocked 
                    ? "bg-white/60 backdrop-blur-md border-amber-200/90 shadow-md ring-4 ring-amber-100/30" 
                    : "bg-white/25 backdrop-blur-md border-white/40 opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${
                    isUnlocked ? "bg-amber-100/60 border border-amber-200" : "bg-white/30 border border-white/40"
                  }`}>
                    {isUnlocked ? ach.icon : "🔒"}
                  </div>
                  <div>
                    <h4 className={`font-extrabold text-sm leading-tight ${isUnlocked ? "text-[#4A4A4A]" : "text-slate-500"}`}>
                      {ach.title}
                    </h4>
                    <p className="text-[#6B7280] text-[11px] mt-1 leading-snug font-bold">
                      {ach.description}
                    </p>
                  </div>
                </div>
                {isUnlocked && (
                  <span className="text-xs text-center bg-emerald-50/80 text-emerald-800 py-1 rounded-full font-black border border-emerald-100/50 block">
                    Completed
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Reset Action */}
      <div className="mt-16 pt-6 border-t border-[#D1D8D5] flex justify-between items-center text-[#9CA3AF] text-sm font-black">
        <span>© AU-SOME Sensory Game</span>
        <button
          id="reset-progress-btn"
          onClick={() => {
            if (confirm("Would you like to reset your stars and start fresh? This cannot be undone.")) {
              onResetProgress();
            }
          }}
          className="text-[#9CA3AF] hover:text-red-400 underline cursor-pointer hover:font-black transition-all"
        >
          Reset Game Progress
        </button>
      </div>
    </div>
  );
}
