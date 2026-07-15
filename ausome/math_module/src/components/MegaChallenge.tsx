/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Trophy, Star, ArrowRight, Check } from 'lucide-react';
import { BEAD_COLORS } from '../levelsData';
import { audio } from '../audio';

interface MegaChallengeProps {
  challengeNumber: 1 | 2; // Challenge 1 (after lvl 5), Challenge 2 (after lvl 10)
  isEasyMode: boolean;
  onComplete: () => void;
  onIncorrect: () => void;
}

export const MegaChallenge: React.FC<MegaChallengeProps> = ({
  challengeNumber,
  isEasyMode,
  onComplete,
  onIncorrect,
}) => {
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  
  // State for Stage 1: Rods sorting (simple subset of 3 rods)
  const sortedRods = challengeNumber === 1 ? [1, 3, 5] : [2, 5, 8];
  const [shelfSlots, setShelfSlots] = useState<(number | null)[]>(new Array(sortedRods.length).fill(null));
  
  // State for Stage 2: Beads match
  const beadsTarget = challengeNumber === 1 ? 7 : 14; // 7 beads or a 10 + 4 bead combination
  const beadsChoices = challengeNumber === 1 ? [5, 6, 7, 8] : [11, 12, 14, 15];

  // State for Stage 3: Teen Board Build
  const boardTarget = challengeNumber === 1 ? 13 : 42;
  const boardTens = challengeNumber === 1 ? 10 : 40;
  const boardUnit = challengeNumber === 1 ? 3 : 2;
  const unitChoices = challengeNumber === 1 ? [2, 3, 4, 5] : [1, 2, 3, 4];
  const [builtUnit, setBuiltUnit] = useState<number | null>(null);

  // STAGE 1: RODS SORTING LOGIC
  const handlePlaceRod = (num: number, idx: number) => {
    const expected = sortedRods[idx];
    if (num === expected) {
      audio.playSoftBell();
      const nextSlots = [...shelfSlots];
      nextSlots[idx] = num;
      setShelfSlots(nextSlots);

      // Check if Stage 1 complete
      if (nextSlots.every((s, i) => s === sortedRods[i])) {
        audio.playSuccessTone();
        setTimeout(() => {
          setCurrentStage(2);
        }, 1200);
      }
    } else {
      audio.playEncourageTone();
      onIncorrect();
    }
  };

  // STAGE 2: BEADS COUNTING LOGIC
  const handleSelectBeadsOption = (num: number) => {
    if (num === beadsTarget) {
      audio.playSoftBell();
      audio.playSuccessTone();
      setTimeout(() => {
        setCurrentStage(3);
      }, 1200);
    } else {
      audio.playEncourageTone();
      onIncorrect();
    }
  };

  // STAGE 3: BOARD MERGE LOGIC
  const handleSelectUnitOption = (num: number) => {
    if (num === boardUnit) {
      audio.playSoftBell();
      audio.playSuccessTone();
      setBuiltUnit(num);
      
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      audio.playEncourageTone();
      onIncorrect();
    }
  };

  // RENDER ROD VISUALS
  const renderRodVisual = (length: number) => {
    const segments = [];
    for (let i = 0; i < length; i++) {
      const isRed = i % 2 === 0;
      segments.push(
        <div
          key={i}
          className={`h-5 sm:h-7 w-6 rounded-[2px] border-y border-stone-800/20 first:rounded-l-md last:rounded-r-md ${
            isRed ? 'bg-red-500' : 'bg-sky-600'
          }`}
        />
      );
    }
    return <div className="flex select-none">{segments}</div>;
  };

  return (
    <div className="bg-gradient-to-b from-amber-50 to-orange-50/40 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl relative select-none">
      
      {/* Sparkles / Headers */}
      <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-950 font-display font-black text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg border-2 border-white animate-bounce flex items-center gap-1">
        <Trophy className="w-4 h-4 animate-spin-slow text-yellow-950" />
        <span>MEGA CHALLENGE {challengeNumber}!</span>
      </div>

      {/* Progress Path */}
      <div className="flex justify-center items-center gap-2 mb-6 sm:mb-8 text-xs font-display font-bold uppercase tracking-wider text-stone-500 select-none">
        <span className={`px-3 py-1.5 rounded-full ${currentStage === 1 ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-200' : 'bg-emerald-100 text-emerald-800'}`}>
          Stage 1: Rods
        </span>
        <ArrowRight className="w-4 h-4 text-stone-300" />
        <span className={`px-3 py-1.5 rounded-full ${currentStage === 2 ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-200' : currentStage > 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-400'}`}>
          Stage 2: Beads
        </span>
        <ArrowRight className="w-4 h-4 text-stone-300" />
        <span className={`px-3 py-1.5 rounded-full ${currentStage === 3 ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-200' : 'bg-stone-100 text-stone-400'}`}>
          Stage 3: Board
        </span>
      </div>

      {/* STAGE 1: RODS SORTING */}
      {currentStage === 1 && (
        <div className="flex flex-col gap-6 items-center">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-display font-black text-amber-950 flex items-center justify-center gap-2">
              📏 Stage 1: Sort the Rods!
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-md">
              Tap the correct rod below to place it in order on the wooden shelves.
            </p>
          </div>

          {/* Slots shelves */}
          <div className="flex flex-col gap-4 w-full max-w-md">
            {sortedRods.map((length, idx) => {
              const currentPlaced = shelfSlots[idx];
              return (
                <div key={idx} className="flex items-center gap-4 bg-white/70 p-3 rounded-2xl border border-amber-200/50 shadow-xs">
                  <span className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center font-display font-bold text-amber-800 text-xs">
                    {idx + 1}
                  </span>
                  
                  <div className="flex-grow min-h-[40px] flex items-center">
                    {currentPlaced ? (
                      <div className="flex items-center gap-3 animate-fade-in">
                        {renderRodVisual(currentPlaced)}
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">✔ Rod {currentPlaced}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-display font-semibold text-stone-400 italic">
                        Tap matching rod below to place Rod of size {length}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scrambled rods Tray */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-inner w-full max-w-md flex justify-center gap-4">
            {sortedRods.map((num) => {
              const isAlreadyPlaced = shelfSlots.includes(num);
              if (isAlreadyPlaced) return null;

              return (
                <button
                  id={`mega-rod-btn-${num}`}
                  key={num}
                  onClick={() => handlePlaceRod(num, sortedRods.indexOf(num))}
                  className="p-3 bg-stone-50 border border-stone-200 rounded-xl hover:bg-amber-50 cursor-pointer hover:border-amber-300 transition-all shadow-xs flex flex-col items-center gap-2"
                >
                  {renderRodVisual(num)}
                  <span className="text-[10px] font-bold text-stone-500 uppercase font-display">Rod {num}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STAGE 2: BEADS MATCHING */}
      {currentStage === 2 && (
        <div className="flex flex-col gap-6 items-center">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-display font-black text-amber-950">
              🍒 Stage 2: Count the Beads!
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Count the colorful Montessori beads on the hanger and find the matching card.
            </p>
          </div>

          {/* Bead Wire Visual */}
          <div className="relative flex items-center justify-center py-6 px-10 bg-white rounded-3xl border border-stone-200 shadow-md min-w-[280px]">
            {/* Wire */}
            <div className="absolute left-6 right-6 h-1.5 bg-gradient-to-b from-stone-300 to-stone-400 rounded-full" />
            
            {/* Beads rows */}
            <div className="flex gap-1.5 z-10">
              {beadsTarget <= 10 ? (
                // Single wire
                Array.from({ length: beadsTarget }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border border-black/10 relative shadow-sm"
                    style={{ backgroundColor: BEAD_COLORS[beadsTarget] || '#ccc' }}
                  >
                    <div className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-white/30" />
                  </div>
                ))
              ) : (
                // Double wire (Tens and units combo, e.g. 14 = 10 + 4)
                <div className="flex flex-col gap-3">
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-black/10 relative" style={{ backgroundColor: '#f59e0b' }} />
                    ))}
                  </div>
                  <div className="flex gap-1 justify-center">
                    {Array.from({ length: beadsTarget - 10 }).map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-black/10 relative" style={{ backgroundColor: BEAD_COLORS[beadsTarget - 10] }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Choices */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {beadsChoices.map((num) => {
              const isCorrect = num === beadsTarget;
              return (
                <button
                  id={`mega-bead-choice-${num}`}
                  key={num}
                  onClick={() => handleSelectBeadsOption(num)}
                  className={`h-20 sm:h-24 rounded-2xl border-3 font-display font-black text-2xl cursor-pointer bg-white hover:bg-stone-50 transition-all ${
                    isEasyMode && isCorrect
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-800 ring-4 ring-yellow-200 scale-105'
                      : 'border-stone-200 text-stone-800'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STAGE 3: TEEN/TEN BOARD */}
      {currentStage === 3 && (
        <div className="flex flex-col gap-6 items-center">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-display font-black text-amber-950">
              🧱 Stage 3: Seguin Board Merge!
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Place the correct unit card over the 0 of the tens card to build <strong className="text-amber-900">{boardTarget}</strong>!
            </p>
          </div>

          {/* Wooden board */}
          <div className="bg-white/80 p-5 rounded-2xl border-2 border-amber-100 flex items-center justify-center gap-6 w-full max-w-md shadow-xs">
            {/* Numeral merge */}
            <div className="flex font-display font-black text-5xl text-amber-900 select-none bg-stone-100 p-4 rounded-xl border border-amber-800/15">
              <span>{Math.floor(boardTens / 10)}</span>
              <span className={`w-10 text-center transition-colors ${builtUnit ? 'text-emerald-700 font-bold' : 'text-stone-300'}`}>
                {builtUnit ? builtUnit : '0'}
              </span>
            </div>

            {/* Visual beads */}
            <div className="flex gap-2">
              {Array.from({ length: Math.floor(boardTens / 10) }).map((_, i) => (
                <div key={i} className="flex flex-col gap-0.5 bg-yellow-50 p-1 rounded-sm border border-yellow-200">
                  {Array.from({ length: 10 }).map((_, b) => (
                    <div key={b} className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  ))}
                </div>
              ))}
              
              {builtUnit && (
                <div className="flex flex-col gap-0.5 bg-amber-50 p-1 rounded-sm border border-amber-200 animate-pulse">
                  {Array.from({ length: builtUnit }).map((_, b) => (
                    <div key={b} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: BEAD_COLORS[builtUnit] }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Unit Choices cards */}
          <div className="flex gap-4 justify-center items-center">
            {unitChoices.map((num) => {
              const isCorrect = num === boardUnit;
              return (
                <button
                  id={`mega-unit-choice-${num}`}
                  key={num}
                  disabled={builtUnit !== null}
                  onClick={() => handleSelectUnitOption(num)}
                  className={`w-14 h-20 rounded-2xl border-3 font-display font-black text-2xl bg-white hover:bg-stone-50 cursor-pointer transition-all ${
                    builtUnit !== null
                      ? 'opacity-50 border-stone-200'
                      : isEasyMode && isCorrect
                        ? 'border-yellow-400 bg-yellow-50 text-yellow-800 ring-4 ring-yellow-200'
                        : 'border-stone-200 text-stone-800'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
