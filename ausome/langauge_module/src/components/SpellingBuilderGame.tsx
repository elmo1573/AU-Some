import React, { useState, useEffect } from 'react';
import { VocabularyItem, LanguageCode } from '../types';
import { speakText, playSensoryChime } from '../utils/speech';
import { Sparkles, RefreshCw, Volume2, CheckCircle, ArrowRight } from 'lucide-react';

interface SpellingBuilderGameProps {
  langCode: LanguageCode;
  vocabulary: Record<string, VocabularyItem[]>;
  addStarsAndCoins: (stars: number, coins: number) => void;
  onLessonComplete?: () => void;
  voicePack: string;
}

export default function SpellingBuilderGame({
  langCode,
  vocabulary,
  addStarsAndCoins,
  onLessonComplete,
  voicePack,
}: SpellingBuilderGameProps) {
  const [targetWord, setTargetWord] = useState<VocabularyItem | null>(null);
  const [lettersPool, setLettersPool] = useState<string[]>([]);
  const [spelledLetters, setSpelledLetters] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wordsCompletedCount, setWordsCompletedCount] = useState(0);

  const goalWordsCount = 3;

  // Gather all words in the current vocabulary pack
  const getAllWords = (): VocabularyItem[] => {
    const list: VocabularyItem[] = [];
    Object.values(vocabulary).forEach((words) => {
      list.push(...words);
    });
    return list.filter(w => w.word && w.word.length > 1);
  };

  const startNewWord = () => {
    const all = getAllWords();
    if (all.length === 0) return;

    // Select a random word
    const randomWord = all[Math.floor(Math.random() * all.length)];
    const wordUpper = randomWord.word.toUpperCase();
    
    // Scramble letters
    const pool = wordUpper.split('').sort(() => Math.random() - 0.5);

    setTargetWord(randomWord);
    setLettersPool(pool);
    setSpelledLetters([]);
    setIsCompleted(false);

    // Speak word on start
    setTimeout(() => {
      speakText(randomWord.word, langCode, voicePack);
    }, 300);
  };

  useEffect(() => {
    startNewWord();
  }, [langCode]);

  const handleTileClick = (letter: string, indexInPool: number) => {
    if (isCompleted) return;

    playSensoryChime('click');
    // Speak letter phonetically or alphabetically
    speakText(letter.toLowerCase(), langCode, voicePack);

    // Add to spelled list
    const newSpelled = [...spelledLetters, letter];
    setSpelledLetters(newSpelled);

    // Remove first occurrence from letters pool
    const newPool = [...lettersPool];
    newPool.splice(indexInPool, 1);
    setLettersPool(newPool);

    // Check if spelling matches target
    const target = targetWord?.word.toUpperCase() || '';
    if (newSpelled.join('') === target) {
      // Completed word!
      setIsCompleted(true);
      playSensoryChime('success');
      addStarsAndCoins(3, 1);
      setWordsCompletedCount(prev => prev + 1);

      // Vocalize the complete word
      setTimeout(() => {
        if (targetWord) {
          speakText(`${targetWord.word}!`, langCode, voicePack);
        }
      }, 600);
    } else if (newSpelled.length === target.length) {
      // Failed match, auto clear after short delay with a soft rumble
      setTimeout(() => {
        resetCurrentWord();
      }, 1000);
    }
  };

  const resetCurrentWord = () => {
    if (!targetWord) return;
    playSensoryChime('click');
    const wordUpper = targetWord.word.toUpperCase();
    setLettersPool(wordUpper.split('').sort(() => Math.random() - 0.5));
    setSpelledLetters([]);
    setIsCompleted(false);
  };

  const handleNext = () => {
    if (wordsCompletedCount >= goalWordsCount) {
      if (onLessonComplete) onLessonComplete();
    } else {
      startNewWord();
    }
  };

  if (!targetWord) {
    return (
      <div className="p-12 text-center text-sm font-sans italic text-[#4A4A40]/70">
        Loading Spelling letters...
      </div>
    );
  }

  const targetUpper = targetWord.word.toUpperCase();

  return (
    <div id="spelling-game-container" className="max-w-xl mx-auto space-y-6 bg-white border-2 border-[#EAE8D9] p-6 md:p-8 rounded-[40px] shadow-sm">
      
      {/* Header Info */}
      <div className="flex justify-between items-center pb-4 border-b border-[#EAE8D9]">
        <div>
          <span className="text-[10px] font-sans font-bold text-[#4A4A40]/60 uppercase tracking-widest block">
            Stage 5: Language Mastery
          </span>
          <h3 className="text-xl font-serif font-light text-[#2D2D2A] mt-0.5">
            ✏️ Spelling Builder
          </h3>
        </div>
        
        <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-[#FAF6EC] border border-[#EADAC2] text-[#7D5A2E] px-3.5 py-1.5 rounded-full">
          Progress: {wordsCompletedCount} / {goalWordsCount}
        </span>
      </div>

      {/* Target Image & Word Box */}
      <div className="flex flex-col items-center justify-center p-6 bg-[#FAF9F5] rounded-3xl border border-[#EAE8D9] text-center space-y-3 shadow-inner relative">
        <div className="w-20 h-20 rounded-full bg-white border border-[#EAE8D9] shadow-sm flex items-center justify-center text-5xl select-none">
          {targetWord.emoji}
        </div>
        
        <button
          onClick={() => speakText(targetWord.word, langCode, voicePack)}
          className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#5A5A40] hover:text-[#2D2D2A] bg-white border border-[#EAE8D9] px-3.5 py-1.5 rounded-full shadow-sm cursor-pointer active:scale-95 transition-all"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen Word</span>
        </button>
      </div>

      {/* Spelled / Empty Placeholder Boxes */}
      <div className="flex justify-center items-center gap-3 py-6">
        {targetUpper.split('').map((char, idx) => {
          const filledChar = spelledLetters[idx];
          return (
            <div
              key={idx}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-mono font-bold uppercase transition-all ${
                filledChar
                  ? 'bg-[#FAF6EC] border-[#5A5A40] text-[#2D2D2A]'
                  : 'bg-white border-dashed border-[#D9D7C8] text-transparent'
              }`}
            >
              {filledChar || '_'}
            </div>
          );
        })}
      </div>

      {/* Letter Tiles Pool */}
      {!isCompleted ? (
        <div className="space-y-4">
          <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-center text-[#4A4A40]/60">
            Tap tiles in the correct order:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {lettersPool.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => handleTileClick(letter, idx)}
                className="w-12 h-12 bg-white hover:bg-[#FAF9F3] border-2 border-[#EAE8D9] hover:border-[#5A5A40] rounded-xl text-lg font-mono font-bold uppercase flex items-center justify-center cursor-pointer active:scale-90 shadow-sm transition-all text-[#2D2D2A]"
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={resetCurrentWord}
              className="flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-wider text-rose-700 bg-[#FFF4F4] border border-rose-200 px-4 py-2 rounded-full cursor-pointer hover:bg-rose-100 transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear & Reset</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col items-center text-center space-y-3 animate-fade-in">
          <div className="flex items-center gap-1.5 text-teal-800 font-sans font-bold text-sm">
            <CheckCircle className="w-5 h-5 text-teal-600" />
            <span>Spelled Correctly!</span>
          </div>
          <p className="text-xs text-stone-500 font-sans">
            "{targetWord.word}" is spelled perfectly. +3 Stars & +1 Coin!
          </p>
          
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-sans font-bold uppercase tracking-widest text-[10px] px-5 py-3 rounded-full cursor-pointer shadow-sm hover:scale-103 active:scale-97 transition-all"
          >
            <span>{wordsCompletedCount >= goalWordsCount ? 'Finish Lesson' : 'Next Word'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
