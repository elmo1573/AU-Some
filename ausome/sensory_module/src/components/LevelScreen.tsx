import { useState } from "react";
import { ArrowLeft, Star, Volume2, HelpCircle } from "lucide-react";
import { Level, GameProgress } from "../types";
import { LevelActivity, renderIllustration } from "./LevelActivities";
import * as audio from "../utils/audio";

interface LevelScreenProps {
  level: Level;
  progress: GameProgress;
  onBack: () => void;
  onLevelComplete: (levelId: number) => void;
}

export default function LevelScreen({ level, progress, onBack, onLevelComplete }: LevelScreenProps) {
  const [encouragement, setEncouragement] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const handleLevelSuccess = () => {
    setIsCompleted(true);
    audio.playSuccessChime();
    setEncouragement(null);
  };

  const handleIncorrectAttempt = (encouragingMsg: string) => {
    setEncouragement(encouragingMsg);
    // Auto-clear encouragement after 3 seconds for a clean experience
    setTimeout(() => {
      setEncouragement(null);
    }, 4000);
  };

  const showHint = () => {
    // Generate a calm visual hint based on the level ID
    const hints: Record<number, string> = {
      1: "Look closely at the card at the top, then click the exact same colour at the bottom.",
      2: "Find the shape that has the same corners or curves.",
      3: "Tap the picture that is larger in size.",
      4: "Tap one block, then another block to switch their places until they go from light to dark.",
      5: "Tap the picture that feels like the described touch.",
      6: "Listen carefully. Tap the button to replay the sound, then choose the card that matches.",
      7: "Tap the box category that fits the item shown.",
      8: "See how the items repeat? Find what goes in the empty box.",
      9: "Flip cards one by one to find matching pairs.",
      10: "Find the picture that looks different from all the other three.",
      11: "Look at the main item, then click the dark grey shape that has the exact same outline.",
      12: "Search carefully in the balloon grid for the differently coloured balloon.",
      13: "Arrange the stories in order by swapping them.",
      14: "Find the face that has peaceful eyes and a gentle smile.",
      15: "Think about where the object belongs in nature (Sky, Water, or Land).",
      16: "Sort the items by how they feel when touched.",
      17: "Look at the tree branches to spot the difference.",
      18: "Calmly locate the target star floating in the sea scene.",
      19: "Read the prompt and complete the random visual matching.",
      20: "You are doing amazing! Complete each of the three final matching steps."
    };
    
    const defaultHint = `Listen to the cozy prompt and tap your answer gently! There are no mistakes, just keep trying. Your active focus is beautiful!`;
    setHint(hints[level.id] || defaultHint);
    setTimeout(() => {
      setHint(null);
    }, 6000);
  };

  const proceedNext = () => {
    onLevelComplete(level.id);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 animate-fadeIn flex flex-col min-h-[90vh]">
      
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between mb-8">
        <button
          id="level-back-btn"
          onClick={onBack}
          className="flex items-center gap-2 text-[#5A6357] hover:text-slate-800 font-bold text-base transition-all bg-white/60 backdrop-blur-md py-2 px-5 rounded-full border border-white/60 shadow-sm cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>Back to Lobby</span>
        </button>

        <span className="text-[#9CA3AF] font-bold text-base">
          Level {level.id} of 100
        </span>

        <div className="flex items-center gap-2">
          {/* Stars indicator */}
          <div className="px-5 py-2.5 bg-white/60 backdrop-blur-md border border-white rounded-full shadow-sm flex items-center gap-2">
            <span className="text-[#5A6357]">⭐</span>
            <span className="font-bold text-base text-[#5A6357]">{progress.calmStars} Stars</span>
          </div>
        </div>
      </div>

      {/* Primary Instruction Block */}
      <div className="text-center mb-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#5A6357] leading-tight mb-2">
          {level.instruction}
        </h2>
        <p className="text-[#6B7280] text-base sm:text-lg font-bold max-w-xl mx-auto">
          {level.description}
        </p>
      </div>

      {/* Main Sensory Stage Card */}
      <div className="flex-1 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[48px] p-6 sm:p-12 shadow-2xl flex flex-col justify-center items-center relative min-h-[380px]">
        
        {!isCompleted ? (
          <div className="w-full flex flex-col items-center">
            {level.id % 5 === 0 && (
              <div className="w-full max-w-lg mb-6 bg-amber-50/90 border border-amber-200/80 px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-xs text-amber-800 font-black text-sm animate-pulse">
                <span>👑</span>
                <span>MEGA LEVEL CHECKPOINT: Put your sensory skills to the test!</span>
                <span>👑</span>
              </div>
            )}
            <LevelActivity
              levelId={level.id}
              onComplete={handleLevelSuccess}
              onIncorrectAttempt={handleIncorrectAttempt}
              isMuted={false}
            />
          </div>
        ) : (
          /* Level Completed Overlay Screen */
          <div className="flex flex-col items-center justify-center text-center animate-fadeIn p-4">
            <div className="w-20 h-20 rounded-3xl bg-[#B8C5B0] flex items-center justify-center shadow-md border-2 border-white text-4xl mb-6">
              🌸
            </div>
            
            <h3 className="text-3xl sm:text-4xl font-black text-[#5A6357] tracking-tight">
              Amazing Focus!
            </h3>
            
            <p className="text-[#6B7280] text-base sm:text-lg font-bold mt-2 max-w-md">
              You worked wonderfully and earned one <span className="font-bold text-amber-500">⭐ Calm Star</span>! Keep exploring at your own pace.
            </p>

            <button
              id="level-proceed-btn"
              onClick={proceedNext}
              className="mt-8 bg-[#B8C5B0] hover:bg-[#A8C8BC] text-white font-extrabold text-xl px-14 py-5.5 rounded-[24px] shadow-lg shadow-[#B8C5B0]/40 transition-all transform hover:scale-102 active:scale-95 cursor-pointer select-none"
            >
              Continue Journey
            </button>
          </div>
        )}

        {/* Dynamic Encouragement banner */}
        {encouragement && (
          <div className="absolute top-4 left-4 right-4 bg-[#E8F5E9] border border-[#C8E6C9] px-6 py-3.5 rounded-full flex items-center justify-center text-[#2E7D32] text-base sm:text-lg font-bold shadow-md animate-slideDown">
            <span className="mr-2">🌸</span>
            {encouragement}
          </div>
        )}
      </div>

      {/* Bottom Option Toolbar */}
      {!isCompleted && (
        <div className="mt-6 flex justify-between items-center">
          <button
            id="hint-toggle-btn"
            onClick={showHint}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#5A6357] transition-all font-bold text-sm cursor-pointer bg-white/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/40 shadow-xs"
          >
            <HelpCircle size={16} />
            <span>Show Hint</span>
          </button>

          {hint && (
            <div className="flex-1 max-w-md mx-4 bg-[#D6E6F2]/60 text-[#4A4A4A] border border-white/50 backdrop-blur-md p-4 rounded-[20px] text-sm font-bold leading-relaxed animate-fadeIn shadow-xs">
              💡 {hint}
            </div>
          )}

          <div className="text-[#9CA3AF] font-black text-xs sm:text-sm uppercase tracking-wider">
            Pressure-Free Zone
          </div>
        </div>
      )}
    </div>
  );
}
