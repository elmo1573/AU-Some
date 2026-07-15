import React, { useState, useEffect } from 'react';
import { speakText, playSensoryChime } from '../utils/speech';
import { LanguageCode } from '../types';
import { CheckCircle, Ear, Volume2, ArrowRight } from 'lucide-react';

interface SoundMatcherGameProps {
  langCode: LanguageCode;
  addStarsAndCoins: (stars: number, coins: number) => void;
  onLessonComplete?: () => void;
  voicePack: string;
}

interface SoundClue {
  id: string;
  emoji: string;
  name: Record<LanguageCode, string>;
  soundOnomatopoeia: Record<LanguageCode, string>;
}

const SOUND_DB: SoundClue[] = [
  {
    id: 'dog',
    emoji: '🐶',
    name: { en: 'Dog', es: 'Perro', de: 'Hund', zh: '狗', ar: 'كلب' },
    soundOnomatopoeia: { en: 'Woof! Woof!', es: '¡Guau! ¡Guau!', de: 'Wau! Wau!', zh: '汪汪！', ar: 'هوهو! هوهو!' }
  },
  {
    id: 'cat',
    emoji: '🐱',
    name: { en: 'Cat', es: 'Gato', de: 'Katze', zh: '猫', ar: 'قطة' },
    soundOnomatopoeia: { en: 'Meow! Meow!', es: '¡Miau! ¡Miau!', de: 'Miau! Miau!', zh: '喵喵！', ar: 'مياو! مياو!' }
  },
  {
    id: 'cow',
    emoji: '🐮',
    name: { en: 'Cow', es: 'Vaca', de: 'Kuh', zh: '牛', ar: 'بقرة' },
    soundOnomatopoeia: { en: 'Moo! Moo!', es: '¡Muu! ¡Muu!', de: 'Muu! Muu!', zh: '哞哞！', ar: 'موو! موو!' }
  },
  {
    id: 'pig',
    emoji: '🐷',
    name: { en: 'Pig', es: 'Cerdo', de: 'Schwein', zh: '猪', ar: 'خنزير' },
    soundOnomatopoeia: { en: 'Oink! Oink!', es: '¡Oink! ¡Oink!', de: 'Oink! Oink!', zh: '哼哼！', ar: 'أونك! أونك!' }
  },
  {
    id: 'duck',
    emoji: '🦆',
    name: { en: 'Duck', es: 'Pato', de: 'Ente', zh: '鸭子', ar: 'بطة' },
    soundOnomatopoeia: { en: 'Quack! Quack!', es: '¡Cua! ¡Cua!', de: 'Quak! Quak!', zh: '嘎嘎！', ar: 'كواك! كواك!' }
  },
  {
    id: 'bee',
    emoji: '🐝',
    name: { en: 'Bee', es: 'Abeja', de: 'Biene', zh: '蜜蜂', ar: 'نحلة' },
    soundOnomatopoeia: { en: 'Bzzz! Bzzz!', es: '¡Bzzz! ¡Bzzz!', de: 'Summ! Summ!', zh: '嗡嗡！', ar: 'بززز! بززز!' }
  }
];

export default function SoundMatcherGame({
  langCode,
  addStarsAndCoins,
  onLessonComplete,
  voicePack,
}: SoundMatcherGameProps) {
  const [activeClue, setActiveClue] = useState<SoundClue | null>(null);
  const [options, setOptions] = useState<SoundClue[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  const goalRounds = 3;

  const startRound = () => {
    // Pick random target
    const target = SOUND_DB[Math.floor(Math.random() * SOUND_DB.length)];

    // Pick 2 distractors
    const distractors: SoundClue[] = [];
    while (distractors.length < 2) {
      const d = SOUND_DB[Math.floor(Math.random() * SOUND_DB.length)];
      if (d.id !== target.id && !distractors.find(item => item.id === d.id)) {
        distractors.push(d);
      }
    }

    // Combine & shuffle
    const combined = [target, ...distractors].sort(() => Math.random() - 0.5);

    setActiveClue(target);
    setOptions(combined);
    setFeedback(null);
    setSelectedId(null);

    // Vocalize onomatopoeia sound immediately on start
    setTimeout(() => {
      speakText(target.soundOnomatopoeia[langCode] || target.soundOnomatopoeia['en'], langCode, voicePack);
    }, 300);
  };

  useEffect(() => {
    startRound();
  }, [langCode]);

  const handlePlaySound = () => {
    if (!activeClue) return;
    playSensoryChime('click');
    speakText(activeClue.soundOnomatopoeia[langCode] || activeClue.soundOnomatopoeia['en'], langCode, voicePack);
  };

  const handleOptionClick = (clue: SoundClue) => {
    if (feedback) return;
    setSelectedId(clue.id);

    if (clue.id === activeClue?.id) {
      playSensoryChime('success');
      setFeedback('correct');
      setRoundsCompleted(prev => prev + 1);
      addStarsAndCoins(3, 1);

      // Vocalize congratulations with name
      setTimeout(() => {
        const localizedName = clue.name[langCode] || clue.name['en'];
        speakText(localizedName, langCode, voicePack);
      }, 500);
    } else {
      playSensoryChime('click');
      setFeedback('incorrect');
      // Speak correct clue helper
      speakText(activeClue?.soundOnomatopoeia[langCode] || activeClue?.soundOnomatopoeia['en'] || '', langCode, voicePack);
    }
  };

  const handleNext = () => {
    if (roundsCompleted >= goalRounds) {
      if (onLessonComplete) onLessonComplete();
    } else {
      startRound();
    }
  };

  if (!activeClue) return <div className="p-8 text-center text-xs">Loading sound safari...</div>;

  return (
    <div id="sound-matcher-container" className="max-w-xl mx-auto space-y-6 bg-white border-2 border-[#EAE8D9] p-6 rounded-[40px] shadow-sm">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center pb-3 border-b border-[#EAE8D9]">
        <div>
          <span className="text-[10px] font-sans font-bold text-[#4A4A40]/60 uppercase tracking-widest block">
            Stage 2: Vocabulary Builder
          </span>
          <h3 className="text-lg font-serif font-light text-[#2D2D2A] mt-0.5">
            🎵 Sound Matcher Safari
          </h3>
        </div>
        
        <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-[#FAF6EC] border border-[#EADAC2] text-[#7D5A2E] px-3.5 py-1.5 rounded-full">
          Progress: {roundsCompleted} / {goalRounds}
        </span>
      </div>

      {/* Auditory Clue Player Card */}
      <div className="bg-[#FAF9F5] border border-[#EAE8D9] p-8 rounded-3xl text-center space-y-4 shadow-inner">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-white border border-[#EAE8D9] flex items-center justify-center text-2xl animate-pulse">
            👂
          </div>
        </div>
        <p className="text-xs text-[#4A4A40]/70 font-sans leading-relaxed">
          Listen to this animal sound, then find the correct animal card:
        </p>
        
        <button
          onClick={handlePlaySound}
          className="flex items-center gap-2 bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-sans font-bold uppercase tracking-widest text-xs px-6 py-4 rounded-full mx-auto shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>Play Animal Sound</span>
        </button>
      </div>

      {/* Option Cards */}
      <div className="grid grid-cols-3 gap-4">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrect = option.id === activeClue.id;

          let cardStyle = 'bg-white border-[#EAE8D9] hover:border-[#5A5A40]';
          if (feedback && isSelected) {
            cardStyle = isCorrect
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 scale-103'
              : 'bg-rose-50 border-rose-300 text-rose-950 opacity-60';
          } else if (feedback && isCorrect) {
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
              <span className="text-xs font-sans font-bold text-[#4A4A40] tracking-tight">
                {option.name[langCode] || option.name['en']}
              </span>
            </button>
          );
        })}
      </div>

      {/* Round Next Panel */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-[#FAF9F3] border border-[#EAE8D9] flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-600" />
            <span className="text-xs font-sans font-bold text-teal-800">
              {feedback === 'correct' ? "Amazing! Correct animal matched. +3 Stars!" : "Incorrect. Let's try again!"}
            </span>
          </div>

          <button
            onClick={feedback === 'correct' ? handleNext : startRound}
            className="flex items-center gap-1.5 bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-sans font-bold uppercase tracking-widest text-[10px] px-5 py-3 rounded-full cursor-pointer transition-all active:scale-95"
          >
            <span>{feedback === 'correct' && roundsCompleted >= goalRounds ? 'Finish Lesson' : 'Next Clue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
