/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { BEAD_COLORS } from '../levelsData';
import { audio } from '../audio';

interface TeenTenBoardsProps {
  targetNumbers: number[];
  isEasyMode: boolean;
  onSuccess: () => void;
  onIncorrect: () => void;
  isDemoMode: boolean;
  onDemoComplete: () => void;
}

export const ActivityTeenTenBoards: React.FC<TeenTenBoardsProps> = ({
  targetNumbers,
  isEasyMode,
  onSuccess,
  onIncorrect,
  isDemoMode,
  onDemoComplete,
}) => {
  const [targetNumber, setTargetNumber] = useState<number>(11);
  const [tensValue, setTensValue] = useState<number>(10);
  const [unitsValue, setUnitsValue] = useState<number | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [shakeUnitId, setShakeUnitId] = useState<number | null>(null);
  const [isMerged, setIsMerged] = useState<boolean>(false);

  useEffect(() => {
    if (!isDemoMode) {
      setupLevel();
    }
  }, [targetNumbers, isDemoMode]);

  // Automated Demo sequence simulation
  useEffect(() => {
    if (!isDemoMode) return;

    setIsMerged(false);
    setUnitsValue(null);

    const correctUnit = targetNumber === 100 ? 10 : targetNumber % 10;
    const activeTimers: NodeJS.Timeout[] = [];

    // Step 1: Explain target number
    const welcomeTimer = setTimeout(() => {
      audio.speak(`Let's watch Mimi Bear build ${targetNumber}! ${targetNumber} is built with a board of ${tensValue} and a unit card of ${correctUnit}!`, true);
    }, 1500);
    activeTimers.push(welcomeTimer);

    // Step 2: Highlight unit card
    const selectTimer = setTimeout(() => {
      audio.playSoftTap();
      audio.speak(`Look! We slide the number ${correctUnit} card over the zero of the ${tensValue} board!`, true);
    }, 4500);
    activeTimers.push(selectTimer);

    // Step 3: Complete merge
    const mergeTimer = setTimeout(() => {
      setUnitsValue(correctUnit);
      setIsMerged(true);
      audio.playSoftBell();
    }, 7500);
    activeTimers.push(mergeTimer);

    // Step 4: Final confirmation & switch
    const doneTimer = setTimeout(() => {
      audio.playSuccessTone();
      audio.speak(`Look! Ten and ${correctUnit} makes ${targetNumber}! Now it's your turn to match the card!`, true);
      setTimeout(() => {
        onDemoComplete();
      }, 1500);
    }, 9500);
    activeTimers.push(doneTimer);

    return () => {
      activeTimers.forEach(t => clearTimeout(t));
    };
  }, [isDemoMode, targetNumber, tensValue]);

  const setupLevel = () => {
    // Pick a random target from the list
    const target = targetNumbers[Math.floor(Math.random() * targetNumbers.length)];
    setTargetNumber(target);
    setIsMerged(false);
    setUnitsValue(null);

    // Calculate tens and units
    // For 100, we treat tens as 90 and unit as 10, or tens as 100 and unit as 0. 
    // In Montessori, Seguin Board B builds up to 99. Let's make sure we handle standard tens and units.
    const tens = target === 100 ? 90 : Math.floor(target / 10) * 10;
    const units = target === 100 ? 10 : target % 10;

    setTensValue(tens);

    // Generate options of unit cards (1-9 or 1-10)
    const correctUnit = units;
    const optionsSet = new Set<number>([correctUnit]);
    
    // Add extra unit card numbers as dummy options
    const maxUnit = target === 100 ? 10 : 9;
    while (optionsSet.size < Math.min(5, maxUnit)) {
      const candidate = Math.floor(Math.random() * maxUnit) + 1;
      optionsSet.add(candidate);
    }

    const optionsArray = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    setOptions(optionsArray);
  };

  const handleUnitSelect = (num: number) => {
    if (isDemoMode) return;
    const correctUnit = targetNumber === 100 ? 10 : targetNumber % 10;

    if (num === correctUnit) {
      // Correct!
      audio.playSoftTap();
      setUnitsValue(num);
      setIsMerged(true);
      
      audio.playSoftBell();
      audio.playSuccessTone();
      onSuccess();

      // Setup next level after short delay
      setTimeout(() => {
        setupLevel();
      }, 1500);
    } else {
      // Incorrect!
      audio.playEncourageTone();
      setShakeUnitId(num);
      setTimeout(() => setShakeUnitId(null), 600);
      onIncorrect();
    }
  };

  // Render Montessori Bead bars corresponding to Tens & Units
  const renderBeadVisuals = (tens: number, units: number | null) => {
    const numTenBars = Math.floor(tens / 10);
    const tenBars = [];

    // Render golden ten-bead bars
    for (let t = 0; t < numTenBars; t++) {
      tenBars.push(
        <div key={`ten-${t}`} className="flex flex-col gap-0.5 items-center bg-amber-50 p-1.5 rounded-lg border border-amber-200">
          <span className="text-[9px] font-bold text-amber-800 uppercase font-mono tracking-wide leading-none">10</span>
          <div className="flex flex-col gap-0.5 select-none my-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full relative shadow-xs border border-amber-700/30"
                style={{ backgroundColor: '#f59e0b' }} // Golden
              >
                <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white/40" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Render colored unit bead bar
    let unitBar = null;
    if (units !== null && units > 0) {
      const beadColor = BEAD_COLORS[units] || '#fca5a5';
      unitBar = (
        <div className="flex flex-col gap-0.5 items-center bg-amber-50 p-1.5 rounded-lg border border-amber-200 animate-bounce">
          <span className="text-[9px] font-bold text-stone-700 uppercase font-mono tracking-wide leading-none">{units}</span>
          <div className="flex flex-col gap-0.5 select-none my-1">
            {Array.from({ length: units }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full relative shadow-xs border border-black/10 animate-fade-in"
                style={{ backgroundColor: beadColor }}
              >
                <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white/40" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="flex gap-3 justify-center items-center py-4 px-6 bg-white rounded-2xl border border-stone-200/60 shadow-xs max-w-md mx-auto min-h-[220px]">
        {/* Golden 10-bars column */}
        <div className="flex gap-2 flex-wrap justify-center">
          {tenBars}
        </div>

        {/* Separator plus symbol or arrow */}
        {unitBar && (
          <div className="text-stone-300 font-black text-xl px-1">
            <ArrowRight className="w-5 h-5 text-amber-500" />
          </div>
        )}

        {/* Units column */}
        <div>
          {unitBar}
        </div>
      </div>
    );
  };

  const correctUnitVal = targetNumber === 100 ? 10 : targetNumber % 10;

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto p-4 select-none">
      
      {/* Target Number Banner */}
      <div className="text-center">
        <span className="text-stone-400 font-display text-xs font-bold uppercase tracking-wider">
          🎯 Target Number to Build
        </span>
        <h2 className="text-stone-800 font-display font-black text-4xl sm:text-5xl mt-1 text-emerald-700 animate-pulse">
          {targetNumber}
        </h2>
      </div>

      {/* Montessori Seguin Board Card Visual */}
      <div className="bg-amber-50/80 rounded-3xl p-6 sm:p-8 border-4 border-amber-100/90 shadow-md flex flex-col md:flex-row gap-6 items-center justify-center">
        
        {/* Left Board: numerals merging */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-stone-500 font-display font-medium text-xs tracking-wider uppercase">
            🪵 Wooden Seguin Board
          </span>

          <div className="relative flex items-center bg-stone-100 rounded-3xl p-4 border-4 border-amber-800/10 shadow-inner w-56 justify-center">
            {/* The Tens Card */}
            <div className="flex font-display font-black text-6xl tracking-tight text-amber-900 select-none">
              {targetNumber === 100 ? (
                <div className="relative inline-block text-center">
                  <span className={`transition-all duration-300 ${isMerged ? 'text-emerald-700 font-black scale-110' : 'text-amber-900'}`}>
                    {isMerged ? '100' : '90'}
                  </span>
                  {!isMerged && (
                    <div className={`absolute inset-y-1 right-0 w-12 border-3 border-dashed rounded-lg flex items-center justify-center transition-all ${
                      isEasyMode 
                        ? 'border-yellow-400 bg-yellow-100/50 ring-4 ring-yellow-200/60 animate-pulse' 
                        : 'border-amber-700/20'
                    }`}>
                      {isEasyMode && <span className="text-xs font-bold text-yellow-800 animate-bounce">?</span>}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Tens digit */}
                  <span>{Math.floor(tensValue / 10)}</span>
                  
                  {/* The Unit slot: merges unitsValue if placed, else shows 0 */}
                  <div className="relative inline-block w-12 h-16 justify-center text-center">
                    <span className={`transition-all duration-300 ${isMerged ? 'text-emerald-700 font-black scale-110' : 'text-amber-900/40 font-bold'}`}>
                      {isMerged ? unitsValue : '0'}
                    </span>
                    
                    {/* Visual slot indicator */}
                    {!isMerged && (
                      <div className={`absolute inset-y-1 inset-x-0 border-3 border-dashed rounded-lg flex items-center justify-center transition-all ${
                        isEasyMode 
                          ? 'border-yellow-400 bg-yellow-100/50 ring-4 ring-yellow-200/60 animate-pulse' 
                          : 'border-amber-700/20'
                      }`}>
                        {isEasyMode && <span className="text-xs font-bold text-yellow-800 animate-bounce">?</span>}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Board: corresponding beads display */}
        <div className="flex flex-col items-center gap-2 flex-grow w-full">
          <span className="text-stone-500 font-display font-medium text-xs tracking-wider uppercase">
            🌟 Quantity in Bead Bars
          </span>
          {renderBeadVisuals(tensValue, isMerged ? unitsValue : null)}
        </div>
      </div>

      {/* Interactive Units cards selection */}
      <div className="flex flex-col gap-4 text-center">
        <span className="text-stone-700 font-display font-bold text-sm">
          Pick the correct card to cover the zero:
        </span>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          {options.map((num) => {
            const isCorrectOption = num === correctUnitVal;
            const isSelectedAndWrong = shakeUnitId === num;

            // In easy mode, grey out incorrect cards to make it extremely accessible
            const isGreyedOut = isEasyMode && !isCorrectOption;

            return (
              <button
                id={`unit-card-btn-${num}`}
                key={num}
                disabled={isMerged || isGreyedOut}
                onClick={() => handleUnitSelect(num)}
                className={`w-14 h-20 sm:w-16 sm:h-24 rounded-2xl flex flex-col items-center justify-center border-3 font-display font-black text-2xl sm:text-3xl shadow-sm cursor-pointer transition-all btn-tactile ${
                  isMerged 
                    ? 'opacity-50 cursor-not-allowed border-stone-200 bg-stone-50'
                    : isSelectedAndWrong
                      ? 'border-red-400 bg-red-50 text-red-700 animate-shake shadow-md'
                      : isEasyMode && isCorrectOption
                        ? 'border-yellow-400 bg-yellow-50 text-yellow-800 shadow-md ring-4 ring-yellow-300/40 animate-pulse scale-110'
                        : isGreyedOut
                          ? 'border-stone-100 bg-stone-50 text-stone-300 opacity-30 cursor-not-allowed'
                          : 'border-stone-200 bg-white hover:border-stone-300 text-stone-800 hover:bg-stone-50/50'
                }`}
              >
                {num}
                
                {isEasyMode && isCorrectOption && (
                  <span className="absolute -top-3 bg-yellow-400 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-bounce border border-white">
                    ⭐ Target
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
