/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Trophy, Star, Coins, CheckCircle2, Bookmark, GraduationCap } from 'lucide-react';
import { AchievementBadge, Certificate } from '../types';
import { audio } from '../audio';

interface ProgressProps {
  completedLevelIds: number[];
  totalLevelsCount: number;
  stars: number;
  coins: number;
  badges: AchievementBadge[];
  certificates: Certificate[];
  onViewCertificate: (certId: string) => void;
}

export const ProgressTracker: React.FC<ProgressProps> = ({
  completedLevelIds,
  totalLevelsCount,
  stars,
  coins,
  badges,
  certificates,
  onViewCertificate,
}) => {
  const percentage = Math.round((completedLevelIds.length / totalLevelsCount) * 100);

  return (
    <div className="bg-white rounded-3xl p-6 border-3 border-stone-200/60 shadow-xs flex flex-col gap-6 select-none">
      
      {/* Upper Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Progress Card */}
        <div className="bg-[#f0f6f4] p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold text-lg">
            📈
          </div>
          <div>
            <span className="block text-[10px] text-emerald-800/60 uppercase font-bold tracking-wider font-sans">
              Completed
            </span>
            <span className="block font-display font-black text-emerald-800 text-xl leading-none">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Stars Card */}
        <div className="bg-[#fef9e8] p-4 rounded-2xl border border-yellow-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 text-yellow-800 rounded-xl flex items-center justify-center font-bold text-lg animate-pulse">
            ⭐
          </div>
          <div>
            <span className="block text-[10px] text-yellow-800/60 uppercase font-bold tracking-wider font-sans">
              Stars Earned
            </span>
            <span className="block font-display font-black text-yellow-800 text-xl leading-none">
              {stars}
            </span>
          </div>
        </div>

        {/* Coins Card */}
        <div className="bg-[#fdf3eb] p-4 rounded-2xl border border-amber-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center font-bold text-lg">
            🪙
          </div>
          <div>
            <span className="block text-[10px] text-amber-800/60 uppercase font-bold tracking-wider font-sans">
              Total Coins
            </span>
            <span className="block font-display font-black text-amber-800 text-xl leading-none">
              {coins}
            </span>
          </div>
        </div>

        {/* Certificates Card */}
        <div className="bg-[#f4f2f9] p-4 rounded-2xl border border-purple-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 text-purple-800 rounded-xl flex items-center justify-center font-bold text-lg">
            🎓
          </div>
          <div>
            <span className="block text-[10px] text-purple-800/60 uppercase font-bold tracking-wider font-sans">
              Certificates
            </span>
            <span className="block font-display font-black text-purple-800 text-xl leading-none">
              {certificates.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-bold text-stone-500 font-display uppercase tracking-wider">
          <span>Learning Progress Map</span>
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            {completedLevelIds.length} of {totalLevelsCount} Levels Done
          </span>
        </div>
        
        {/* Progress Bar Track */}
        <div className="w-full h-5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/40 p-1 flex">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Individual Levels indicators list */}
        <div className="flex justify-between gap-1 sm:gap-2 mt-1">
          {Array.from({ length: totalLevelsCount }).map((_, idx) => {
            const levelId = idx + 1;
            const isCompleted = completedLevelIds.includes(levelId);
            const isMega = levelId % 5 === 0;

            return (
              <div
                key={levelId}
                className={`flex-grow h-7 rounded-lg flex items-center justify-center text-xs font-black font-display border transition-all ${
                  isCompleted
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold'
                    : isMega
                      ? 'bg-amber-100 border-amber-300 text-amber-800 animate-pulse'
                      : 'bg-stone-50 border-stone-200 text-stone-400'
                }`}
                title={isMega ? `Level ${levelId} (Mega Challenge!)` : `Level ${levelId}`}
              >
                {isMega ? '🏆' : isCompleted ? '✔' : levelId}
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlocked Badges Row */}
      <div>
        <h3 className="text-stone-800 font-display font-bold text-sm mb-3 flex items-center gap-1.5 uppercase tracking-wider">
          🏅 Achievement Badges Unlocked ({badges.filter(b => b.unlocked).length})
        </h3>
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all duration-300 max-w-xs flex-grow sm:flex-grow-0 ${
                badge.unlocked
                  ? 'bg-white border-yellow-200 shadow-sm'
                  : 'bg-stone-50/50 border-stone-100 opacity-40 select-none'
              }`}
            >
              <div className="text-3xl bg-amber-50 rounded-xl p-1 border border-amber-100">{badge.unlocked ? badge.icon : '🔒'}</div>
              <div>
                <span className="block font-display font-bold text-stone-800 text-xs">
                  {badge.unlocked ? badge.title : 'Locked Badge'}
                </span>
                <span className="block text-[10px] text-stone-400 font-medium leading-tight">
                  {badge.unlocked ? badge.description : 'Keep playing to unlock!'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earned Certificates Row */}
      {certificates.length > 0 && (
        <div className="border-t border-stone-100 pt-4">
          <h3 className="text-stone-800 font-display font-bold text-sm mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            🎓 Your Graduation Certificates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {certificates.map((cert) => (
              <button
                id={`view-certificate-card-${cert.id}`}
                key={cert.id}
                onClick={() => {
                  audio.playSoftTap();
                  onViewCertificate(cert.id);
                }}
                className="p-4 bg-amber-50 hover:bg-amber-100 rounded-2xl border border-amber-200/60 flex items-center justify-between text-left transition-all hover:scale-101 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎓</div>
                  <div>
                    <span className="block font-display font-bold text-amber-950 text-xs sm:text-sm">
                      {cert.title} Award
                    </span>
                    <span className="block text-[10px] text-stone-500 font-medium">
                      Completed {cert.levelsRange} on {cert.date}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-white border border-amber-200 px-2.5 py-1 rounded-xl uppercase font-display hover:bg-amber-50">
                  Print 📜
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
