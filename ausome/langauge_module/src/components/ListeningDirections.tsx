import React, { useState, useEffect } from 'react';
import { LanguageCode, VocabularyItem } from '../types';
import { speakText, playSensoryChime } from '../utils/speech';
import { Volume2, Ear, Star, ShieldCheck, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface ListeningDirectionsProps {
  langCode: LanguageCode;
  vocabulary: Record<string, VocabularyItem[]>;
  addStarsAndCoins: (stars: number, coins: number) => void;
  voicePack: string;
}

interface AuditoryTask {
  id: string;
  commandText: string;
  expectedEmoji: string;
  level: 1 | 2 | 3;
  options: Array<{ emoji: string; label: string }>;
}

export default function ListeningDirections({
  langCode,
  vocabulary,
  addStarsAndCoins,
  voicePack,
}: ListeningDirectionsProps) {
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1);
  const [activeTask, setActiveTask] = useState<AuditoryTask | null>(null);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [hasPlayedAuditoryCue, setHasPlayedAuditoryCue] = useState(false);

  // Generate localized auditory tasks based on actual vocabulary pack words
  const generateTaskForLevel = (level: 1 | 2 | 3) => {
    // Gather some real vocabulary items
    const allWords: VocabularyItem[] = [];
    Object.values(vocabulary).forEach((list) => {
      allWords.push(...list);
    });

    if (allWords.length === 0) return;

    // Pick a random target word
    const targetIdx = Math.floor(Math.random() * allWords.length);
    const target = allWords[targetIdx];

    // Pick 3 distractor words
    const distractors: VocabularyItem[] = [];
    while (distractors.length < 3) {
      const idx = Math.floor(Math.random() * allWords.length);
      const possible = allWords[idx];
      if (possible.id !== target.id && !distractors.find((d) => d.id === possible.id)) {
        distractors.push(possible);
      }
    }

    // Build the instruction command based on level & language
    let commandText = '';
    
    if (level === 1) {
      // Direct Noun search
      if (langCode === 'es') commandText = `Toca el o la: ${target.word}`;
      else if (langCode === 'de') commandText = `Berühre das oder den: ${target.word}`;
      else if (langCode === 'zh') commandText = `请触摸：${target.word}`;
      else if (langCode === 'ar') commandText = `المس: ${target.word}`;
      else commandText = `Touch the: ${target.word}`;
    } else if (level === 2) {
      // Attribute search (e.g. sweet apple / cozy bedroom / green tree)
      if (langCode === 'es') commandText = `Encuentra: ${target.word}`;
      else if (langCode === 'de') commandText = `Finde: ${target.word}`;
      else if (langCode === 'zh') commandText = `请找出：${target.word}`;
      else if (langCode === 'ar') commandText = `ابحث عن: ${target.word}`;
      else commandText = `Find the: ${target.word}`;
    } else {
      // Functional Command (e.g. "We need to eat! Find the Apple")
      if (langCode === 'es') commandText = `¡Es hora de aprender! Busca: ${target.word}`;
      else if (langCode === 'de') commandText = `Es ist Zeit zum Lernen! Suche: ${target.word}`;
      else if (langCode === 'zh') commandText = `学习时间到了！找一找：${target.word}`;
      else if (langCode === 'ar') commandText = `حان وقت التعلم! ابحث عن: ${target.word}`;
      else commandText = `Learning time! Look for the: ${target.word}`;
    }

    // Shuffle options
    const options = [
      { emoji: target.emoji, label: target.word },
      ...distractors.map((d) => ({ emoji: d.emoji, label: d.word })),
    ].sort(() => Math.random() - 0.5);

    setActiveTask({
      id: Math.random().toString(),
      commandText,
      expectedEmoji: target.emoji,
      level,
      options,
    });
    setFeedback(null);
    setHasPlayedAuditoryCue(false);
  };

  // Generate task on mount or level change
  useEffect(() => {
    generateTaskForLevel(currentLevel);
  }, [currentLevel, langCode]);

  // Handle voice cue playing
  const handlePlayVoice = () => {
    if (!activeTask) return;
    playSensoryChime('click');
    speakText(activeTask.commandText, langCode, voicePack);
    setHasPlayedAuditoryCue(true);
  };

  const handleOptionClick = (option: { emoji: string; label: string }) => {
    if (!activeTask || feedback) return;

    if (option.emoji === activeTask.expectedEmoji) {
      // Correct Match!
      playSensoryChime('success');
      setFeedback('correct');
      setScore(score + 1);
      addStarsAndCoins(3, 1); // Task completion rewards

      // Level up progress helper
      if (score > 0 && score % 3 === 0 && currentLevel < 3) {
        const nextLvl = (currentLevel + 1) as 1 | 2 | 3;
        setTimeout(() => {
          setCurrentLevel(nextLvl);
        }, 1500);
      }
    } else {
      // Incorrect Match
      playSensoryChime('click');
      setFeedback('incorrect');
      // Gentle phonetic/auditory corrective assistance
      speakText(activeTask.commandText, langCode, voicePack);
    }
  };

  const handleNextTask = () => {
    playSensoryChime('click');
    generateTaskForLevel(currentLevel);
  };

  return (
    <div id="listening-comprehension-container" className="max-w-4xl mx-auto space-y-6">
      
      {/* Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[32px] bg-white border-2 border-[#EAE8D9]">
        <div>
          <h2 className="text-2xl font-serif font-light text-[#2D2D2A] flex items-center gap-2">
            👂 Listening & Directions
          </h2>
          <p className="text-xs text-[#4A4A40]/80 mt-1 font-sans">
            Focus on speech sounds and build comprehension. Listen to the instruction, then touch the matching card.
          </p>
        </div>

        {/* Level Toggle Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-sans font-bold text-[#4A4A40]/70 uppercase tracking-wider">Difficulty:</span>
          <div className="flex bg-[#F5F2EB] p-1 rounded-full border border-[#D9D7C8]">
            {([1, 2, 3] as const).map((lvl) => (
              <button
                key={lvl}
                id={`difficulty-btn-${lvl}`}
                onClick={() => {
                  playSensoryChime('click');
                  setCurrentLevel(lvl);
                }}
                className={`text-xs px-4 py-1.5 rounded-full font-sans font-bold transition-all ${
                  currentLevel === lvl
                    ? 'bg-white text-[#5A5A40] shadow-sm'
                    : 'text-[#4A4A40]/60 hover:text-[#2D2D2A]'
                }`}
              >
                Lvl {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Task Card */}
      {activeTask && (
        <div className="bg-white border-2 border-[#EAE8D9] p-6 md:p-8 rounded-[40px] space-y-6 shadow-sm text-center animate-fade-in">
          
          {/* Big Auditory Trigger Block */}
          <div className="max-w-md mx-auto space-y-4">
            <button
              id="listening-play-cue-btn"
              onClick={handlePlayVoice}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center mx-auto border-2 transition-all cursor-pointer hover:scale-103 active:scale-97 shadow-sm ${
                hasPlayedAuditoryCue
                  ? 'bg-[#FAF6EC] border-[#EADAC2] text-[#7D5A2E]'
                  : 'bg-white border-[#EAE8D9] text-[#4A4A40] hover:border-[#5A5A40]'
              }`}
            >
              <Ear className="w-10 h-10 mb-1" />
              <span className="text-[9px] font-sans tracking-wider font-bold uppercase">
                {hasPlayedAuditoryCue ? 'Replay Sound' : 'Play Sound'}
              </span>
            </button>
            
            <p className="text-xs text-[#4A4A40]/70 font-sans">
              {hasPlayedAuditoryCue
                ? 'Did you hear that? Find the matching picture below!'
                : 'Click the Play Sound button to hear your instruction.'}
            </p>
          </div>

          {/* Option Cards Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {activeTask.options.map((opt, idx) => (
              <button
                key={idx}
                id={`listen-option-${idx}`}
                disabled={feedback === 'correct'}
                onClick={() => handleOptionClick(opt)}
                className={`flex flex-col items-center justify-center p-6 rounded-[28px] border-2 transition-all text-center min-h-[140px] shadow-sm select-none ${
                  feedback === 'correct' && opt.emoji === activeTask.expectedEmoji
                    ? 'bg-teal-50 border-teal-400 text-teal-900 scale-102 font-bold'
                    : 'bg-white border-[#EAE8D9] hover:border-[#5A5A40] cursor-pointer active:scale-95'
                }`}
              >
                <span className="text-4xl mb-3 select-none">{opt.emoji}</span>
                <span className="text-xs font-sans font-bold text-[#4A4A40]">
                  {feedback === 'correct' ? opt.label : '???'}
                </span>
              </button>
            ))}
          </div>

          {/* Feedback & Navigation Banner */}
          <div className="min-h-[50px] flex justify-center items-center">
            {feedback === 'correct' && (
              <div className="space-y-3 animate-fade-in">
                <span className="text-sm font-sans font-bold text-teal-700 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" /> Great Listening! Correct Match Found (+3 ⭐)
                </span>
                <button
                  id="listening-next-task-btn"
                  onClick={handleNextTask}
                  className="bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-sans font-bold uppercase tracking-widest text-xs px-6 py-3.5 rounded-full cursor-pointer shadow-sm transition-all"
                >
                  Next Lesson
                </button>
              </div>
            )}
            
            {feedback === 'incorrect' && (
              <div className="text-xs font-sans font-bold text-red-600 flex items-center gap-1.5 animate-bounce">
                <AlertCircle className="w-4 h-4" /> Try again! Listen carefully to the voice.
              </div>
            )}
          </div>

        </div>
      )}

      {/* Progress Footer */}
      <div className="p-4 rounded-full bg-white border-2 border-[#EAE8D9] flex justify-between items-center text-xs text-[#4A4A40]/85 px-6 font-sans">
        <span>Streak: <strong className="text-[#5A5A40]">{score}</strong></span>
        <span>Difficulty: <strong className="text-[#5A5A40]">Level {currentLevel}</strong> ({currentLevel === 1 ? 'Single Noun' : currentLevel === 2 ? 'Find Prompt' : 'Extended Instruction'})</span>
      </div>

    </div>
  );
}
