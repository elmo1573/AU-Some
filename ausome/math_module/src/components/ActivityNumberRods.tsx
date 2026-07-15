/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Check, RefreshCw } from 'lucide-react';
import { audio } from '../audio';

interface NumberRodsProps {
  targetNumbers: number[];
  isEasyMode: boolean;
  onSuccess: () => void;
  onIncorrect: () => void;
  isDemoMode: boolean;
  onDemoComplete: () => void;
}

interface Rod {
  length: number;
  id: string;
}

export const ActivityNumberRods: React.FC<NumberRodsProps> = ({
  targetNumbers,
  isEasyMode,
  onSuccess,
  onIncorrect,
  isDemoMode,
  onDemoComplete,
}) => {
  // We want to sort these target numbers
  const sortedNumbers = [...targetNumbers].sort((a, b) => a - b);
  const [scrambledRods, setScrambledRods] = useState<Rod[]>([]);
  const [shelfSlots, setShelfSlots] = useState<(Rod | null)[]>([]);
  const [activeRodId, setActiveRodId] = useState<string | null>(null);

  // Initialize and scramble rods
  useEffect(() => {
    if (!isDemoMode) {
      resetGame();
    }
  }, [targetNumbers, isDemoMode]);

  // Automated Demo sequence simulation
  useEffect(() => {
    if (!isDemoMode) return;

    // Set up a clean starting state for demo
    const rods: Rod[] = sortedNumbers.map((num) => ({
      length: num,
      id: `rod-demo-${num}`,
    }));
    
    setScrambledRods([...rods].sort(() => 0.5 - Math.random()));
    setShelfSlots(new Array(sortedNumbers.length).fill(null));
    setActiveRodId(null);

    const activeTimers: NodeJS.Timeout[] = [];

    // Let's iterate over sorted numbers and place them step-by-step
    sortedNumbers.forEach((num, index) => {
      // Step A: Select the rod
      const selectTimer = setTimeout(() => {
        setActiveRodId(`rod-demo-${num}`);
        audio.playSoftTap();
        audio.speak(`Look at this rod of ${num}! Let's count its segments.`, true);
      }, index * 3000 + 1000);

      // Step B: Place the rod
      const placeTimer = setTimeout(() => {
        setShelfSlots(prevSlots => {
          const newSlots = [...prevSlots];
          newSlots[index] = { length: num, id: `rod-demo-${num}` };
          return newSlots;
        });
        setScrambledRods(prevScrambled => prevScrambled.filter(r => r.length !== num));
        setActiveRodId(null);
        audio.playSoftBell();
      }, index * 3000 + 2500);

      activeTimers.push(selectTimer, placeTimer);
    });

    // Final celebration & switch to child's turn
    const completeTimer = setTimeout(() => {
      audio.speak("Super! Mimi Bear placed all the rods! Now it's your turn to place them from smallest to largest!", true);
      setTimeout(() => {
        onDemoComplete();
      }, 1500);
    }, sortedNumbers.length * 3000 + 1000);

    activeTimers.push(completeTimer);

    return () => {
      activeTimers.forEach(t => clearTimeout(t));
    };
  }, [isDemoMode, targetNumbers]);

  const resetGame = () => {
    const rods: Rod[] = sortedNumbers.map((num) => ({
      length: num,
      id: `rod-${num}-${Math.random().toString(36).substr(2, 4)}`,
    }));
    
    // Scramble the rods
    const scrambled = [...rods].sort(() => Math.random() - 0.5);
    setScrambledRods(scrambled);
    setShelfSlots(new Array(sortedNumbers.length).fill(null));
    setActiveRodId(null);
  };

  // Click on a scrambled rod
  const handleScrambledRodClick = (rod: Rod) => {
    if (isDemoMode) return;
    audio.playSoftTap();
    setActiveRodId(rod.id === activeRodId ? null : rod.id);
  };

  // Click on a shelf slot (to place active rod or remove existing rod)
  const handleSlotClick = (slotIndex: number) => {
    if (isDemoMode) return;
    const existingRod = shelfSlots[slotIndex];
    
    // If there is an active rod selected, try to place it here
    if (activeRodId) {
      const rodToPlace = scrambledRods.find((r) => r.id === activeRodId);
      if (rodToPlace) {
        // Validation check: Is this the correct spot?
        // In Montessori, the slot index should correspond to sortedNumbers[slotIndex]
        const expectedLength = sortedNumbers[slotIndex];
        
        if (rodToPlace.length === expectedLength) {
          // Success! Place it on the shelf
          const newSlots = [...shelfSlots];
          newSlots[slotIndex] = rodToPlace;
          setShelfSlots(newSlots);
          
          // Remove from scrambled pile
          setScrambledRods(scrambledRods.filter((r) => r.id !== activeRodId));
          setActiveRodId(null);
          audio.playSoftBell();

          // Check if all slots are filled correctly
          const isComplete = newSlots.every((slot, idx) => slot !== null && slot.length === sortedNumbers[idx]);
          if (isComplete) {
            setTimeout(() => {
              onSuccess();
            }, 800);
          }
        } else {
          // Incorrect placement
          audio.playEncourageTone();
          onIncorrect();
          
          // Clear active selection to encourage re-evaluating
          setActiveRodId(null);
        }
      }
    } else if (existingRod) {
      // If there is no active rod, clicking a filled shelf slot returns the rod to the scrambled pile
      audio.playSoftTap();
      setShelfSlots(shelfSlots.map((slot, idx) => (idx === slotIndex ? null : slot)));
      setScrambledRods([...scrambledRods, existingRod]);
    }
  };

  // Render a Montessori number rod (alternating red and blue 10-cm segments)
  const renderRodVisual = (length: number, sizeMultiplier = 1) => {
    const segments = [];
    for (let i = 0; i < length; i++) {
      // First segment (from left) is always red, then alternate blue, red...
      const isRed = i % 2 === 0;
      segments.push(
        <div
          key={i}
          className={`h-6 sm:h-8 flex-grow rounded-[2px] transition-colors border-y border-stone-800/20 first:rounded-l-lg last:rounded-r-lg shadow-inner ${
            isRed 
              ? 'bg-red-500 shadow-red-400/50' 
              : 'bg-sky-600 shadow-sky-400/50'
          }`}
          style={{ width: `${30 * sizeMultiplier}px` }}
        />
      );
    }
    return (
      <div className="flex w-full select-none" style={{ maxWidth: `${length * 40 * sizeMultiplier}px` }}>
        {segments}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 select-none">
      
      {/* Wooden Rod Shelf / Board */}
      <div className="bg-amber-100/90 rounded-3xl p-6 sm:p-8 border-8 border-amber-800/20 shadow-lg relative">
        <div className="absolute top-4 right-4 text-amber-900/60 font-display font-medium text-xs sm:text-sm flex items-center gap-1">
          🧺 Montessori Shelf
        </div>

        <h3 className="text-amber-900 font-display font-bold text-lg mb-6 flex items-center gap-2">
          Arrange Smallest to Largest (Top to Bottom)
        </h3>

        {/* Shelf Slots */}
        <div className="flex flex-col gap-4 sm:gap-6 w-full">
          {sortedNumbers.map((num, idx) => {
            const currentRod = shelfSlots[idx];
            const isTargetForActive = activeRodId && scrambledRods.find(r => r.id === activeRodId)?.length === num;

            return (
              <div 
                key={`slot-${num}`} 
                className="flex items-center gap-4 w-full"
              >
                {/* Numeric label indicator on shelf */}
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center font-display font-bold text-amber-800 shadow-xs">
                  {num}
                </div>

                {/* The actual slot holder */}
                <button
                  id={`shelf-slot-${num}`}
                  onClick={() => handleSlotClick(idx)}
                  className={`flex-grow h-12 sm:h-16 rounded-xl border-2 border-dashed flex items-center px-2 cursor-pointer transition-all duration-300 ${
                    currentRod 
                      ? 'border-amber-400/20 bg-amber-200/20 shadow-xs' 
                      : isEasyMode && isTargetForActive
                        ? 'border-yellow-400 bg-yellow-100/70 shadow-md ring-4 ring-yellow-300/30 animate-pulse'
                        : isTargetForActive
                          ? 'border-amber-300 bg-amber-200/10'
                          : 'border-amber-700/20 hover:border-amber-700/40 hover:bg-amber-100/40 bg-amber-50/20'
                  }`}
                >
                  {currentRod ? (
                    <div className="flex items-center gap-4 w-full animate-fade-in">
                      {renderRodVisual(currentRod.length, 1.2)}
                      {isEasyMode && (
                        <span className="font-mono text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
                          <Check className="w-4 h-4" /> Correct
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-amber-800/40 font-display text-xs sm:text-sm pl-4 flex items-center gap-1.5 font-medium">
                      {isEasyMode && isTargetForActive ? (
                        <span className="text-yellow-700 flex items-center gap-1 font-semibold">
                          <Sparkles className="w-4 h-4 animate-spin-slow text-yellow-500" /> Place Rod {num} Here!
                        </span>
                      ) : (
                        `Tap here to place Rod of ${num}`
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scrambled Pile / Wooden Basket */}
      <div className="bg-amber-50 rounded-3xl p-6 border-4 border-amber-100 shadow-inner">
        <div className="flex justify-between items-center mb-4">
          <span className="text-amber-950 font-display font-bold text-sm sm:text-base flex items-center gap-2">
            🧺 Scrambled Rods Tray
          </span>
          <button
            id="reset-rods-btn"
            onClick={resetGame}
            className="text-xs text-amber-700 hover:text-amber-900 bg-amber-100/80 hover:bg-amber-100 px-3 py-1.5 rounded-full font-medium flex items-center gap-1 transition-all border border-amber-200 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Scramble again
          </button>
        </div>

        {scrambledRods.length === 0 ? (
          <div className="text-center py-8 text-amber-800/60 font-display font-medium text-sm">
            All rods are placed on the shelf! Well done!
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-start w-full">
            {scrambledRods.map((rod) => {
              const isSelected = rod.id === activeRodId;
              const belongsToHighlightedSlot = isEasyMode;

              return (
                <button
                  id={`scrambled-rod-${rod.length}`}
                  key={rod.id}
                  onClick={() => handleScrambledRodClick(rod)}
                  className={`flex items-center gap-4 p-3 rounded-2xl w-full text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-200/50 ring-4 ring-amber-300 shadow-md'
                      : belongsToHighlightedSlot
                        ? 'bg-white hover:bg-amber-100/30 border border-yellow-200 ring-2 ring-yellow-100'
                        : 'bg-white hover:bg-amber-100/30 border border-amber-200/60 shadow-xs'
                  }`}
                >
                  <div className="flex-grow">
                    {renderRodVisual(rod.length, 1.4)}
                  </div>
                  
                  {/* Indicator info for toddlers */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {isEasyMode && (
                      <span className="font-display font-bold text-sm text-yellow-800 bg-yellow-100 border border-yellow-200 px-2.5 py-1 rounded-full">
                        Size: {rod.length}
                      </span>
                    )}
                    <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider font-display ${
                      isSelected 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-amber-100/80 text-amber-800 hover:bg-amber-200'
                    }`}>
                      {isSelected ? 'Selected' : 'Tap to lift'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
