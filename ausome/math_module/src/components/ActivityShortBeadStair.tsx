/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HelpCircle, Sparkles, Star, Plus, Minus, X, Equal } from 'lucide-react';
import { BEAD_COLORS } from '../levelsData';
import { audio } from '../audio';

interface ShortBeadStairProps {
  targetNumbers: number[];
  isEasyMode: boolean;
  onSuccess: () => void;
  onIncorrect: () => void;
  isDemoMode: boolean;
  onDemoComplete: () => void;
  mathMode?: 'count' | 'addition' | 'subtraction' | 'multiplication' | 'division';
}

export const ActivityShortBeadStair: React.FC<ShortBeadStairProps> = ({
  targetNumbers,
  isEasyMode,
  onSuccess,
  onIncorrect,
  isDemoMode,
  onDemoComplete,
  mathMode = 'count',
}) => {
  // Select a random target number from the level target numbers list
  const [targetNumber, setTargetNumber] = useState<number>(targetNumbers[0]);
  const [choices, setChoices] = useState<number[]>([]);
  const [countedBeads, setCountedBeads] = useState<string[]>([]); // Unique IDs of tapped beads
  const [shakeCardId, setShakeCardId] = useState<number | null>(null);

  // Get active equation parameters based on the mode and target
  const getEquationParams = (target: number) => {
    if (mathMode === 'addition') {
      switch (target) {
        case 5: return { num1: 3, num2: 2, label: '3 + 2' };
        case 6: return { num1: 4, num2: 2, label: '4 + 2' };
        case 7: return { num1: 4, num2: 3, label: '4 + 3' };
        case 8: return { num1: 5, num2: 3, label: '5 + 3' };
        case 9: return { num1: 5, num2: 4, label: '5 + 4' };
        default: return { num1: Math.floor(target / 2), num2: Math.ceil(target / 2), label: `${Math.floor(target / 2)} + ${Math.ceil(target / 2)}` };
      }
    }
    if (mathMode === 'subtraction') {
      switch (target) {
        case 2: return { num1: 5, num2: 3, label: '5 - 3' };
        case 3: return { num1: 5, num2: 2, label: '5 - 2' };
        case 4: return { num1: 6, num2: 2, label: '6 - 2' };
        case 5: return { num1: 8, num2: 3, label: '8 - 3' };
        case 6: return { num1: 9, num2: 3, label: '9 - 3' };
        default: return { num1: target + 2, num2: 2, label: `${target + 2} - 2` };
      }
    }
    if (mathMode === 'multiplication') {
      switch (target) {
        case 4: return { groups: 2, each: 2, label: '2 × 2' };
        case 6: return { groups: 2, each: 3, label: '2 × 3' };
        case 8: return { groups: 4, each: 2, label: '4 × 2' };
        case 9: return { groups: 3, each: 3, label: '3 × 3' };
        case 10: return { groups: 2, each: 5, label: '2 × 5' };
        default: return { groups: 2, each: Math.floor(target / 2), label: `2 × ${Math.floor(target / 2)}` };
      }
    }
    if (mathMode === 'division') {
      switch (target) {
        case 2: return { total: 6, divisor: 3, label: '6 ÷ 3' };
        case 3: return { total: 6, divisor: 2, label: '6 ÷ 2' };
        case 4: return { total: 8, divisor: 2, label: '8 ÷ 2' };
        case 5: return { total: 10, divisor: 2, label: '10 ÷ 2' };
        default: return { total: target * 2, divisor: 2, label: `${target * 2} ÷ 2` };
      }
    }
    return { label: String(target) };
  };

  const eq = getEquationParams(targetNumber);

  useEffect(() => {
    if (!isDemoMode) {
      setupLevel();
    }
  }, [targetNumbers, isDemoMode, mathMode]);

  // Automated Demo sequence simulation for ALL math modes!
  useEffect(() => {
    if (!isDemoMode) return;

    setCountedBeads([]);
    const activeTimers: NodeJS.Timeout[] = [];

    if (mathMode === 'count') {
      // 1. COUNT DEMO
      for (let i = 0; i < targetNumber; i++) {
        const beadTimer = setTimeout(() => {
          setCountedBeads(prev => [...prev, `count-${i}`]);
          audio.playSoftTap();
          audio.speak(`${i + 1}`, true);
        }, i * 1100 + 1500);
        activeTimers.push(beadTimer);
      }

      const endTimer = setTimeout(() => {
        audio.playSoftBell();
        audio.speak(`Beautiful! There are ${targetNumber} beads! Let's click the card with number ${targetNumber}!`, true);
        setTimeout(() => {
          onDemoComplete();
        }, 1800);
      }, targetNumber * 1100 + 1800);
      activeTimers.push(endTimer);

    } else if (mathMode === 'addition') {
      // 2. ADDITION DEMO
      const { num1 = 0, num2 = 0 } = eq as any;
      audio.speak(`Let's watch Mimi Bear add ${num1} beads plus ${num2} beads!`, true);

      // Count left bar
      for (let i = 0; i < num1; i++) {
        const t = setTimeout(() => {
          setCountedBeads(prev => [...prev, `add-left-${i}`]);
          audio.playSoftTap();
          audio.speak(`${i + 1}`, true);
        }, i * 1100 + 3500);
        activeTimers.push(t);
      }

      // Count right bar
      for (let j = 0; j < num2; j++) {
        const t = setTimeout(() => {
          setCountedBeads(prev => [...prev, `add-right-${j}`]);
          audio.playSoftTap();
          audio.speak(`${num1 + j + 1}`, true);
        }, (num1 + j) * 1100 + 4000);
        activeTimers.push(t);
      }

      const totalCount = num1 + num2;
      const endTimer = setTimeout(() => {
        audio.playSuccessTone();
        audio.speak(`WOW! ${num1} plus ${num2} makes ${totalCount}! Tap the number card ${totalCount}!`, true);
        setTimeout(() => {
          onDemoComplete();
        }, 1800);
      }, totalCount * 1100 + 4500);
      activeTimers.push(endTimer);

    } else if (mathMode === 'subtraction') {
      // 3. SUBTRACTION DEMO
      const { num1 = 0, num2 = 0 } = eq as any;
      audio.speak(`We have ${num1} beads, and we take away ${num2} of them! Let's count how many are left.`, true);

      // Count remaining
      const remaining = num1 - num2;
      for (let i = 0; i < remaining; i++) {
        const t = setTimeout(() => {
          setCountedBeads(prev => [...prev, `sub-rem-${i}`]);
          audio.playSoftTap();
          audio.speak(`${i + 1}`, true);
        }, i * 1100 + 4000);
        activeTimers.push(t);
      }

      const endTimer = setTimeout(() => {
        audio.playSuccessTone();
        audio.speak(`Double Yay! ${num1} take away ${num2} leaves exactly ${remaining}! Click the number card ${remaining}!`, true);
        setTimeout(() => {
          onDemoComplete();
        }, 1800);
      }, remaining * 1100 + 4500);
      activeTimers.push(endTimer);

    } else if (mathMode === 'multiplication') {
      // 4. MULTIPLICATION DEMO
      const { groups = 0, each = 0 } = eq as any;
      audio.speak(`Let's count ${groups} groups of ${each} colored beads! That is ${each} times ${groups}!`, true);

      let step = 0;
      for (let g = 0; g < groups; g++) {
        for (let b = 0; b < each; b++) {
          const t = setTimeout(() => {
            setCountedBeads(prev => [...prev, `mul-g-${g}-b-${b}`]);
            audio.playSoftTap();
            audio.speak(`${step + 1}`, true);
          }, step * 1000 + 4000);
          activeTimers.push(t);
          step++;
        }
      }

      const endTimer = setTimeout(() => {
        audio.playSuccessTone();
        audio.speak(`Fantastic! ${each} times ${groups} is ${groups * each}! Let's select the card ${groups * each}!`, true);
        setTimeout(() => {
          onDemoComplete();
        }, 1800);
      }, (groups * each) * 1000 + 4500);
      activeTimers.push(endTimer);

    } else if (mathMode === 'division') {
      // 5. DIVISION DEMO
      const { total = 0, divisor = 0 } = eq as any;
      audio.speak(`We share ${total} beads equally onto ${divisor} cute plates! How many does each plate get?`, true);

      // Count beads on the first plate
      for (let b = 0; b < targetNumber; b++) {
        const t = setTimeout(() => {
          setCountedBeads(prev => [...prev, `div-plate-0-b-${b}`]);
          audio.playSoftTap();
          audio.speak(`${b + 1}`, true);
        }, b * 1100 + 4500);
        activeTimers.push(t);
      }

      const endTimer = setTimeout(() => {
        audio.playSuccessTone();
        audio.speak(`Splendid! Each plate gets exactly ${targetNumber} beads! Let's click the card ${targetNumber}!`, true);
        setTimeout(() => {
          onDemoComplete();
        }, 1800);
      }, targetNumber * 1100 + 5000);
      activeTimers.push(endTimer);
    }

    return () => {
      activeTimers.forEach(t => clearTimeout(t));
    };
  }, [isDemoMode, targetNumber, mathMode]);

  const setupLevel = () => {
    // Pick a random target from the allowed list
    const target = targetNumbers[Math.floor(Math.random() * targetNumbers.length)];
    setTargetNumber(target);
    setCountedBeads([]);

    // Generate 4 distinct choices
    const optionsSet = new Set<number>([target]);
    
    // Add dummy choices near the target
    while (optionsSet.size < Math.min(4, targetNumbers.length + 3)) {
      const offset = Math.floor(Math.random() * 5) - 2; // -2 to +2
      const candidate = target + offset;
      if (candidate >= 1 && candidate <= 100) {
        optionsSet.add(candidate);
      }
    }

    const optionsArray = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    setChoices(optionsArray);
  };

  const handleBeadClick = (beadId: string) => {
    if (isDemoMode) return;
    audio.playSoftTap();
    
    // Toggle bead counting
    if (countedBeads.includes(beadId)) {
      setCountedBeads(countedBeads.filter((id) => id !== beadId));
    } else {
      setCountedBeads([...countedBeads, beadId]);
    }
  };

  const handleChoiceClick = (num: number) => {
    if (isDemoMode) return;
    if (num === targetNumber) {
      // Success!
      audio.playSoftBell();
      audio.playSuccessTone();
      onSuccess();
      
      setTimeout(() => {
        setupLevel();
      }, 1200);
    } else {
      // Wrong!
      audio.playEncourageTone();
      setShakeCardId(num);
      setTimeout(() => setShakeCardId(null), 600);
      onIncorrect();
    }
  };

  // Renders a single bead segment
  const renderBead = (beadColor: string, isCounted: boolean, uniqueId: string, interactive: boolean, labelNum?: number) => {
    return (
      <button
        key={uniqueId}
        disabled={isDemoMode || !interactive}
        onClick={() => handleBeadClick(uniqueId)}
        style={{ backgroundColor: beadColor }}
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full relative shadow-md transition-all duration-300 flex-shrink-0 flex items-center justify-center border-2 border-amber-950/20 hover:scale-110 active:scale-95 cursor-pointer btn-tactile ${
          isCounted 
            ? 'border-yellow-400 scale-105 shadow-yellow-200 ring-4 ring-yellow-400/40' 
            : 'border-black/10'
        }`}
      >
        {/* Subtle 3D shine overlay */}
        <div className="absolute top-1 left-2 w-2.5 h-2.5 rounded-full bg-white/40" />

        {/* Number label */}
        {isEasyMode ? (
          <span className="font-sans text-xs font-black select-none text-stone-900 bg-white/60 px-1 rounded-full border border-white/40">
            {labelNum}
          </span>
        ) : isCounted ? (
          <span className="font-sans text-xs font-black text-stone-900 bg-white/80 px-1 rounded-full shadow-xs border border-white/40">
            {countedBeads.indexOf(uniqueId) + 1}
          </span>
        ) : null}
      </button>
    );
  };

  // Render bead wires dynamically based on mode
  const renderInteractiveArea = () => {
    const isCount = mathMode === 'count';
    const isAdd = mathMode === 'addition';
    const isSub = mathMode === 'subtraction';
    const isMul = mathMode === 'multiplication';
    const isDiv = mathMode === 'division';

    // 1. STANDARD COUNTING
    if (isCount) {
      const color = BEAD_COLORS[targetNumber] || '#f59e0b';
      return (
        <div className="flex flex-col items-center gap-4 bg-amber-50 rounded-4xl p-6 sm:p-8 border-4 border-amber-200 shadow-md">
          <span className="text-amber-950 font-display font-black text-sm uppercase bg-amber-100/60 px-4 py-1.5 rounded-full border-2 border-amber-200 tracking-wider">
            🧮 Count the Bead Stair
          </span>
          <div className="relative flex items-center justify-center py-8 px-6 bg-stone-100 rounded-3xl border-3 border-stone-200 shadow-inner w-full max-w-lg">
            <div className="absolute left-6 right-6 h-2 bg-gradient-to-b from-stone-400 to-stone-500 rounded-full" />
            <div className="flex gap-2 z-10 select-none items-center">
              {Array.from({ length: targetNumber }).map((_, i) => {
                const uniqueId = `count-${i}`;
                const isCounted = countedBeads.includes(uniqueId);
                return renderBead(color, isCounted, uniqueId, true, i + 1);
              })}
            </div>
          </div>
        </div>
      );
    }

    // 2. ADDITION VIEW
    if (isAdd) {
      const { num1 = 1, num2 = 1 } = eq as any;
      const color1 = BEAD_COLORS[num1] || '#ff0000';
      const color2 = BEAD_COLORS[num2] || '#0000ff';

      return (
        <div className="flex flex-col items-center gap-4 bg-red-50/50 rounded-4xl p-6 sm:p-8 border-4 border-red-200 shadow-md">
          <span className="text-red-950 font-display font-black text-sm uppercase bg-red-100/60 px-4 py-1.5 rounded-full border-2 border-red-200 tracking-wider">
            ➕ Montessori Bead Addition
          </span>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white p-6 rounded-3xl border-2 border-red-100 shadow-sm w-full max-w-2xl">
            {/* Left Bar */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-red-900 font-display font-black text-xl bg-red-100 px-3 py-1 rounded-xl">
                {num1} Beads
              </span>
              <div className="relative flex items-center justify-center p-4 bg-stone-50 rounded-2xl border border-stone-200 shadow-inner w-full">
                <div className="absolute left-4 right-4 h-1.5 bg-stone-400 rounded-full" />
                <div className="flex gap-1 z-10">
                  {Array.from({ length: num1 }).map((_, i) => {
                    const uniqueId = `add-left-${i}`;
                    const isCounted = countedBeads.includes(uniqueId);
                    return renderBead(color1, isCounted, uniqueId, true, i + 1);
                  })}
                </div>
              </div>
            </div>

            {/* Plus Symbol */}
            <div className="text-red-600 p-2 bg-red-50 rounded-full border-2 border-red-200">
              <Plus className="w-8 h-8 stroke-[4px]" />
            </div>

            {/* Right Bar */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-red-900 font-display font-black text-xl bg-red-100 px-3 py-1 rounded-xl">
                {num2} Beads
              </span>
              <div className="relative flex items-center justify-center p-4 bg-stone-50 rounded-2xl border border-stone-200 shadow-inner w-full">
                <div className="absolute left-4 right-4 h-1.5 bg-stone-400 rounded-full" />
                <div className="flex gap-1 z-10">
                  {Array.from({ length: num2 }).map((_, i) => {
                    const uniqueId = `add-right-${i}`;
                    const isCounted = countedBeads.includes(uniqueId);
                    return renderBead(color2, isCounted, uniqueId, true, num1 + i + 1);
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 3. SUBTRACTION VIEW
    if (isSub) {
      const { num1 = 1, num2 = 1 } = eq as any;
      const color1 = BEAD_COLORS[num1] || '#ff0000';
      const remaining = num1 - num2;

      return (
        <div className="flex flex-col items-center gap-4 bg-blue-50/50 rounded-4xl p-6 sm:p-8 border-4 border-blue-200 shadow-md">
          <span className="text-blue-950 font-display font-black text-sm uppercase bg-blue-100/60 px-4 py-1.5 rounded-full border-2 border-blue-200 tracking-wider">
            ➖ Montessori Bead Subtraction
          </span>
          <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-sm w-full max-w-xl">
            <span className="text-blue-900 font-display font-black text-xl bg-blue-100 px-4 py-1.5 rounded-xl">
              We have {num1} and take away {num2}!
            </span>
            <div className="relative flex items-center justify-center py-8 px-6 bg-stone-50 rounded-2xl border border-stone-200 shadow-inner w-full">
              <div className="absolute left-6 right-6 h-1.5 bg-stone-400 rounded-full" />
              <div className="flex gap-1.5 z-10">
                {/* Render active remaining beads */}
                {Array.from({ length: remaining }).map((_, i) => {
                  const uniqueId = `sub-rem-${i}`;
                  const isCounted = countedBeads.includes(uniqueId);
                  return renderBead(color1, isCounted, uniqueId, true, i + 1);
                })}

                {/* Render subtracted faded beads */}
                {Array.from({ length: num2 }).map((_, i) => {
                  return (
                    <div
                      key={`sub-faded-${i}`}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full relative shadow-inner flex items-center justify-center border-2 border-dashed border-red-400 bg-red-100/30 opacity-40 select-none"
                    >
                      <X className="w-5 h-5 text-red-500 stroke-[3px]" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 4. MULTIPLICATION VIEW
    if (isMul) {
      const { groups = 1, each = 1 } = eq as any;
      const color = BEAD_COLORS[each] || '#ff00ff';

      return (
        <div className="flex flex-col items-center gap-4 bg-purple-50/50 rounded-4xl p-6 sm:p-8 border-4 border-purple-200 shadow-md">
          <span className="text-purple-950 font-display font-black text-sm uppercase bg-purple-100/60 px-4 py-1.5 rounded-full border-2 border-purple-200 tracking-wider">
            ✖ Montessori Multiplication Board
          </span>
          <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-3xl border-2 border-purple-100 shadow-sm w-full max-w-xl">
            <span className="text-purple-900 font-display font-black text-xl bg-purple-100 px-4 py-1.5 rounded-xl">
              {groups} groups of {each} beads!
            </span>
            <div className="flex flex-col gap-3 p-6 bg-stone-50 rounded-2xl border border-stone-200 shadow-inner w-full items-center">
              {Array.from({ length: groups }).map((_, g) => (
                <div key={`group-${g}`} className="relative flex items-center justify-center w-full max-w-xs py-2">
                  <div className="absolute left-2 right-2 h-1 bg-stone-300 rounded-full" />
                  <div className="flex gap-1 z-10">
                    {Array.from({ length: each }).map((_, b) => {
                      const uniqueId = `mul-g-${g}-b-${b}`;
                      const isCounted = countedBeads.includes(uniqueId);
                      const helperNum = g * each + b + 1;
                      return renderBead(color, isCounted, uniqueId, true, helperNum);
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 5. DIVISION VIEW
    if (isDiv) {
      const { total = 1, divisor = 1 } = eq as any;
      const totalColor = BEAD_COLORS[total] || '#f59e0b';
      const shareColor = BEAD_COLORS[targetNumber] || '#e9d5ff';

      return (
        <div className="flex flex-col items-center gap-4 bg-emerald-50/50 rounded-4xl p-6 sm:p-8 border-4 border-emerald-200 shadow-md">
          <span className="text-emerald-950 font-display font-black text-sm uppercase bg-emerald-100/60 px-4 py-1.5 rounded-full border-2 border-emerald-200 tracking-wider">
            ➗ Montessori Fair Sharing Division
          </span>
          <div className="flex flex-col gap-6 bg-white p-6 rounded-3xl border-2 border-emerald-100 shadow-sm w-full max-w-xl items-center">
            {/* Top Bar showing Total */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-stone-500 font-display font-bold text-xs uppercase">Total Beads to Share</span>
              <div className="relative flex items-center justify-center py-3 px-4 bg-stone-50 rounded-xl border border-stone-200 shadow-inner max-w-sm">
                <div className="absolute left-4 right-4 h-1 bg-stone-400 rounded-full" />
                <div className="flex gap-1 z-10">
                  {Array.from({ length: total }).map((_, i) => (
                    <div
                      key={`total-${i}`}
                      className="w-6 h-6 rounded-full relative shadow-xs border border-amber-950/25"
                      style={{ backgroundColor: totalColor }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Split Shares into Plates */}
            <div className="w-full">
              <span className="block text-center text-emerald-900 font-display font-black text-xl mb-4 bg-emerald-100 py-1 px-4 rounded-xl max-w-fit mx-auto">
                Shared onto {divisor} Plates!
              </span>

              <div className="flex flex-wrap gap-4 justify-center">
                {Array.from({ length: divisor }).map((_, p) => (
                  <div
                    key={`plate-${p}`}
                    className="flex flex-col items-center gap-2 bg-[#f0f9f6] border-2 border-emerald-100 rounded-2xl p-4 w-36 shadow-xs relative"
                  >
                    <span className="text-emerald-800 font-sans font-black text-xs">Plate {p + 1}</span>
                    
                    {/* Render share beads inside plate */}
                    <div className="flex gap-1 flex-wrap justify-center mt-2 p-1.5 bg-white rounded-xl border border-emerald-200 shadow-inner">
                      {Array.from({ length: targetNumber }).map((_, b) => {
                        const uniqueId = `div-plate-${p}-b-${b}`;
                        const isCounted = countedBeads.includes(uniqueId);
                        // interactive only on the first plate to make counting easy
                        const isInteractive = p === 0;
                        return renderBead(shareColor, isCounted, uniqueId, isInteractive, b + 1);
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const finalChoices = isEasyMode
    ? choices.filter((c) => c === targetNumber || c === choices.find((x) => x !== targetNumber)).slice(0, 2)
    : choices;

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto p-4 select-none">
      
      {/* Dynamic Display of Equation / Question */}
      <div className="text-center">
        <span className="text-amber-700 bg-amber-50 font-display font-black text-xs sm:text-sm tracking-wide uppercase px-4 py-1.5 rounded-full border border-amber-200/60 inline-flex items-center gap-1 shadow-xs">
          🌟 Lesson: {mathMode.toUpperCase()}
        </span>
        <h2 className="text-amber-950 font-display font-black text-4xl sm:text-6xl mt-3 tracking-tight flex items-center justify-center gap-3">
          {mathMode === 'count' ? `Match the Beads! 📿` : `${eq.label} = ? 🐻📝`}
        </h2>
      </div>

      {/* Main Montessori Interactive Play Cabinet */}
      {renderInteractiveArea()}

      {/* Interactive Helper Hint */}
      <div className="text-center h-8">
        {countedBeads.length > 0 && (
          <p className="text-stone-700 font-display text-lg sm:text-xl font-black animate-fade-in flex items-center justify-center gap-2">
            🐻 MIMI BEAR COUNTED: <strong className="text-emerald-700 bg-emerald-50 border-2 border-emerald-200 px-3 py-1 rounded-2xl text-lg">{countedBeads.length}</strong> BEADS!
          </p>
        )}
      </div>

      {/* High-Contrast Interactive Answer Cards */}
      <div className="flex flex-col gap-4 text-center bg-stone-50 rounded-3xl p-6 sm:p-8 border-3 border-stone-200 shadow-sm max-w-2xl mx-auto w-full">
        <span className="text-stone-800 font-display font-black text-xl sm:text-2xl">
          Tap the correct card to solve! 🐻👇
        </span>

        <div className="grid grid-cols-2 gap-5 max-w-md mx-auto w-full">
          {finalChoices.map((num) => {
            const isCorrect = num === targetNumber;
            const isSelectedAndWrong = shakeCardId === num;

            return (
              <button
                id={`bead-choice-btn-${num}`}
                key={num}
                onClick={() => handleChoiceClick(num)}
                className={`h-24 sm:h-32 rounded-3xl flex flex-col items-center justify-center border-4 font-display font-black text-4xl sm:text-5xl shadow-md cursor-pointer transition-all duration-200 btn-tactile ${
                  isSelectedAndWrong
                    ? 'border-red-500 bg-red-100 text-red-800 animate-shake shadow-lg'
                    : isEasyMode && isCorrect
                      ? 'border-yellow-400 bg-yellow-100 text-yellow-900 shadow-lg ring-4 ring-yellow-400/50 animate-pulse scale-105'
                      : 'border-stone-300 bg-white hover:border-amber-400 text-stone-800 hover:bg-amber-50/50 hover:scale-102'
                }`}
              >
                {num}
                
                {isEasyMode && isCorrect && (
                  <span className="text-xs font-black text-yellow-900 bg-yellow-300 px-3 py-1 rounded-full mt-2 uppercase font-display tracking-wider flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" /> Tap me!
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Reference Tooltip for Assist Mode */}
      {isEasyMode && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-5 text-sm text-yellow-900 font-display max-w-lg mx-auto w-full shadow-xs animate-fade-in">
          <p className="font-black mb-3 flex items-center gap-1.5 text-base text-yellow-950">
            💡 Montessori Bead Stair Guide:
          </p>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {targetNumbers.map((num) => (
              <div key={num} className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-yellow-100 shadow-xs">
                <span className="font-black text-sm">{num}</span>
                <div 
                  className="w-5 h-5 rounded-full shadow-xs" 
                  style={{ backgroundColor: BEAD_COLORS[num] || '#ccc' }} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
