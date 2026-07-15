import React, { useState, useEffect } from 'react';
import { VocabularyItem, LanguageCode } from '../types';
import { speakText, playSensoryChime } from '../utils/speech';
import { CheckCircle, AlertCircle, Volume2, ArrowRight } from 'lucide-react';

interface PictureSelectionGameProps {
  langCode: LanguageCode;
  vocabulary: Record<string, VocabularyItem[]>;
  addStarsAndCoins: (stars: number, coins: number) => void;
  onLessonComplete?: () => void;
  voicePack: string;
  isBlitzMode?: boolean; // Fast timed mode for Astrocade
  onBlitzScore?: (points: number) => void;
}

export default function PictureSelectionGame({
  langCode,
  vocabulary,
  addStarsAndCoins,
  onLessonComplete,
  voicePack,
  isBlitzMode = false,
  onBlitzScore,
}: PictureSelectionGameProps) {
  const [targetWord, setTargetWord] = useState<VocabularyItem | null>(null);
  const [options, setOptions] = useState<VocabularyItem[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [roundCount, setRoundCount] = useState(0);

  const goalRounds = isBlitzMode ? 999 : 3;

  const getAllWords = (): VocabularyItem[] => {
    const list: VocabularyItem[] = [];
    Object.values(vocabulary).forEach((words) => {
      list.push(...words);
    });
    return list;
  };

  const setupRound = () => {
    const all = getAllWords();
    if (all.length < 3) return;

    // Select random target
    const target = all[Math.floor(Math.random() * all.length)];
    
    // Select 2 distractors
    const distractors: VocabularyItem[] = [];
    while (distractors.length < 2) {
      const p = all[Math.floor(Math.random() * all.length)];
      if (p.id !== target.id && !distractors.find(d => d.id === p.id)) {
        distractors.push(p);
      }
    }

    // Combine & shuffle
    const combined = [target, ...distractors].sort(() => Math.random() - 0.5);

    setTargetWord(target);
    setOptions(combined);
    setFeedback(null);
    setSelectedOptionId(null);

    // Vocalize prompt word
    setTimeout(() => {
      speakText(target.word, langCode, voicePack);
    }, 250);
  };

  useEffect(() => {
    setupRound();
  }, [langCode]);

  const handleOptionClick = (option: VocabularyItem) => {
    if (feedback) return; // Prevent double tapping

    setSelectedOptionId(option.id);

    if (option.id === targetWord?.id) {
      playSensoryChime('success');
      setFeedback('correct');
      setRoundCount(prev => prev + 1);

      if (isBlitzMode && onBlitzScore) {
        onBlitzScore(10);
      } else {
        addStarsAndCoins(3, 1);
      }

      // Automatically load next after delay if in blitz mode
      if (isBlitzMode) {
        setTimeout(() => {
          setupRound();
        }, 800);
      }
    } else {
      playSensoryChime('click');
      setFeedback('incorrect');
      // Speak target word again to assist learning
      speakText(targetWord?.word || '', langCode, voicePack);
    }
  };

  const handleNext = () => {
    if (roundCount >= goalRounds) {
      if (onLessonComplete) onLessonComplete();
    } else {
      setupRound();
    }
  };

  if (!targetWord) return <div className="p-8 text-center text-xs">Loading cards...</div>;

  return (
    <div id="picture-match-container" className="max-w-xl mx-auto space-y-6 bg-white border-2 border-[#EAE8D9] p-6 rounded-[40px] shadow-sm">
      
      {/* Game Stage Info */}
      <div className="flex justify-between items-center pb-3 border-b border-[#EAE8D9]">
        <div>
          <span className="text-[10px] font-sans font-bold text-[#4A4A40]/60 uppercase tracking-widest block">
            {isBlitzMode ? '⚡ Astrocade Lightning Blitz' : 'Stage 1: Communication First'}
          </span>
          <h3 className="text-lg font-serif font-light text-[#2D2D2A] mt-0.5">
            🖼️ Picture Match Game
          </h3>
        </div>
        
        {!isBlitzMode && (
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-[#FAF6EC] border border-[#EADAC2] text-[#7D5A2E] px-3.5 py-1.5 rounded-full">
            Progress: {roundCount} / {goalRounds}
          </span>
        )}
      </div>

      {/* Target Word Clue Panel */}
      <div className="bg-[#FAF9F5] border border-[#EAE8D9] p-6 rounded-3xl text-center space-y-3 shadow-inner">
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4A4A40]/60 block">
          Find the matching card for:
        </span>
        <div className="flex justify-center items-center gap-2">
          <span className="text-2xl font-serif font-black text-[#2D2D2A]">
            {targetWord.word}
          </span>
          <button
            onClick={() => speakText(targetWord.word, langCode, voicePack)}
            className="p-2 bg-white rounded-full border border-[#D9D7C8] hover:bg-[#FAF9F3] text-[#5A5A40] cursor-pointer transition-all active:scale-90"
            title="Repeat voice"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] font-mono text-[#4A4A40]/70 uppercase tracking-wider">
          Phonetic: {targetWord.phonetic}
        </p>
      </div>

      {/* Multiple Choice Cards */}
      <div className="grid grid-cols-3 gap-4">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === targetWord.id;

          let cardStyle = 'bg-white border-[#EAE8D9] hover:border-[#5A5A40]';
          if (feedback && isSelected) {
            cardStyle = isCorrect
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 scale-103'
              : 'bg-rose-50 border-rose-300 text-rose-950 opacity-60';
          } else if (feedback && isCorrect) {
            // Show correct answer even if they guessed wrong
            cardStyle = 'bg-emerald-50/50 border-emerald-300';
          }

          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option)}
              disabled={!!feedback}
              className={`p-5 rounded-[28px] border-2 text-center flex flex-col items-center justify-center space-y-2 cursor-pointer shadow-sm active:scale-95 transition-all ${cardStyle}`}
            >
              <span className="text-4xl select-none select-none filter drop-shadow">
                {option.emoji}
              </span>
              <span className="text-xs font-sans font-bold text-[#4A4A40] tracking-tight truncate w-full">
                {option.word}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress Trigger button */}
      {feedback && !isBlitzMode && (
        <div className="p-4 rounded-2xl bg-[#FAF9F3] border border-[#EAE8D9] flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-2">
            {feedback === 'correct' ? (
              <>
                <CheckCircle className="w-5 h-5 text-teal-600" />
                <span className="text-xs font-sans font-bold text-teal-800">
                  Awesome! That's correct. +3 Stars!
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-sans font-bold text-rose-800">
                  Let's try again! You can do it.
                </span>
              </>
            )}
          </div>

          <button
            onClick={feedback === 'correct' ? handleNext : setupRound}
            className="flex items-center gap-1.5 bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-sans font-bold uppercase tracking-widest text-[10px] px-5 py-3 rounded-full cursor-pointer transition-all active:scale-95"
          >
            <span>{feedback === 'correct' && roundCount >= goalRounds ? 'Finish Lesson' : 'Next Card'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
