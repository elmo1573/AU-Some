import React, { useState, useEffect } from 'react';
import { speakText, playSensoryChime } from '../utils/speech';
import { LanguageCode } from '../types';
import { CheckCircle, AlertCircle, Volume2, ArrowRight } from 'lucide-react';

interface MissingWordGameProps {
  langCode: LanguageCode;
  addStarsAndCoins: (stars: number, coins: number) => void;
  onLessonComplete?: () => void;
  voicePack: string;
}

interface GapSentence {
  id: string;
  prefix: Record<LanguageCode, string>;
  suffix: Record<LanguageCode, string>;
  correctWord: Record<LanguageCode, string>;
  correctEmoji: string;
  options: Array<{
    id: string;
    label: Record<LanguageCode, string>;
    emoji: string;
  }>;
}

const SENTENCES_DB: GapSentence[] = [
  {
    id: 'apple',
    prefix: { en: 'I want to eat a sweet red', es: 'Quiero comer una dulce', de: 'Ich möchte einen süßen roten', zh: '我想吃一个甜甜的红', ar: 'أريد أن آكل أحمر حلو' },
    suffix: { en: '🍎.', es: '🍎.', de: '🍎.', zh: '🍎。', ar: '🍎.' },
    correctWord: { en: 'apple', es: 'manzana', de: 'Apfel', zh: '苹果', ar: 'تفاحة' },
    correctEmoji: '🍎',
    options: [
      { id: 'opt_apple', label: { en: 'apple', es: 'manzana', de: 'Apfel', zh: '苹果', ar: 'تفاحة' }, emoji: '🍎' },
      { id: 'opt_milk', label: { en: 'milk', es: 'leche', de: 'Milch', zh: '牛奶', ar: 'حليب' }, emoji: '🥛' },
      { id: 'opt_sad', label: { en: 'sad', es: 'triste', de: 'traurig', zh: '伤心', ar: 'حزين' }, emoji: '😢' },
    ]
  },
  {
    id: 'happy',
    prefix: { en: 'I feel very', es: 'Me siento muy', de: 'Ich fühle mich sehr', zh: '我今天感觉很', ar: 'أنا أشعر بالـ' },
    suffix: { en: '😊 today!', es: '😊 hoy!', de: '😊 heute!', zh: '😊！', ar: '😊 اليوم!' },
    correctWord: { en: 'happy', es: 'feliz', de: 'glücklich', zh: '开心', ar: 'سعيد' },
    correctEmoji: '😊',
    options: [
      { id: 'opt_happy', label: { en: 'happy', es: 'feliz', de: 'glücklich', zh: '开心', ar: 'سعيد' }, emoji: '😊' },
      { id: 'opt_finished', label: { en: 'finished', es: 'terminado', de: 'fertig', zh: '完成', ar: 'منتهي' }, emoji: '✅' },
      { id: 'opt_sleep', label: { en: 'sleep', es: 'dormir', de: 'schlafen', zh: '睡觉', ar: 'نوم' }, emoji: '😴' },
    ]
  },
  {
    id: 'milk',
    prefix: { en: 'Can I please drink some cold', es: '¿Puedo beber un poco de', de: 'Kann ich bitte etwas kalte', zh: '我能喝一点冰凉的', ar: 'هل يمكنني شرب بعض الـ' },
    suffix: { en: '🥛?', es: '🥛?', de: '🥛?', zh: '🥛吗？', ar: '🥛 الباردة من فضلك؟' },
    correctWord: { en: 'milk', es: 'leche', de: 'Milch', zh: '牛奶', ar: 'حليب' },
    correctEmoji: '🥛',
    options: [
      { id: 'opt_milk', label: { en: 'milk', es: 'leche', de: 'Milch', zh: '牛奶', ar: 'حليب' }, emoji: '🥛' },
      { id: 'opt_apple', label: { en: 'apple', es: 'manzana', de: 'Apfel', zh: '苹果', ar: 'تفاحة' }, emoji: '🍎' },
      { id: 'opt_play', label: { en: 'play', es: 'jugar', de: 'spielen', zh: '玩耍', ar: 'لعب' }, emoji: '🧸' },
    ]
  }
];

export default function MissingWordGame({
  langCode,
  addStarsAndCoins,
  onLessonComplete,
  voicePack,
}: MissingWordGameProps) {
  const [currentSentence, setCurrentSentence] = useState<GapSentence | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [roundsCount, setRoundsCount] = useState(0);

  const goalRounds = 3;

  const startRound = () => {
    // Select round based on index or random
    const idx = roundsCount % SENTENCES_DB.length;
    const item = SENTENCES_DB[idx];
    
    setCurrentSentence(item);
    setSelectedOptionId(null);
    setFeedback(null);

    // Speak initial sentence prompt with blank gap
    setTimeout(() => {
      const fullPrompt = `${item.prefix[langCode]} ... ${item.suffix[langCode]}`;
      speakText(fullPrompt, langCode, voicePack);
    }, 300);
  };

  useEffect(() => {
    startRound();
  }, [roundsCount, langCode]);

  const handleOptionClick = (optionId: string) => {
    if (feedback) return;
    setSelectedOptionId(optionId);

    const isCorrect = optionId === `opt_${currentSentence?.id}`;
    if (isCorrect) {
      playSensoryChime('success');
      setFeedback('correct');
      setRoundsCount(prev => prev + 1);
      addStarsAndCoins(4, 1);

      // Vocalize the complete sentence after selection
      setTimeout(() => {
        if (currentSentence) {
          const finishedSentence = `${currentSentence.prefix[langCode]} ${currentSentence.correctWord[langCode]} ${currentSentence.correctEmoji}`;
          speakText(finishedSentence, langCode, voicePack);
        }
      }, 500);
    } else {
      playSensoryChime('click');
      setFeedback('incorrect');
    }
  };

  const handleNext = () => {
    if (roundsCount >= goalRounds) {
      if (onLessonComplete) onLessonComplete();
    } else {
      startRound();
    }
  };

  if (!currentSentence) return <div className="p-8 text-center text-xs">Loading puzzle...</div>;

  const pText = currentSentence.prefix[langCode] || currentSentence.prefix['en'];
  const sText = currentSentence.suffix[langCode] || currentSentence.suffix['en'];
  const cWord = currentSentence.correctWord[langCode] || currentSentence.correctWord['en'];

  return (
    <div id="missing-word-container" className="max-w-xl mx-auto space-y-6 bg-white border-2 border-[#EAE8D9] p-6 rounded-[40px] shadow-sm">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-[#EAE8D9]">
        <div>
          <span className="text-[10px] font-sans font-bold text-[#4A4A40]/60 uppercase tracking-widest block">
            Stage 3: Sentence Architect
          </span>
          <h3 className="text-lg font-serif font-light text-[#2D2D2A] mt-0.5">
            🧩 Picture Story Fill
          </h3>
        </div>
        
        <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-[#FAF6EC] border border-[#EADAC2] text-[#7D5A2E] px-3.5 py-1.5 rounded-full">
          Progress: {roundsCount} / {goalRounds}
        </span>
      </div>

      {/* Sentence Puzzle Display Workspace */}
      <div className="bg-[#FAF9F5] border-2 border-dashed border-[#D9D7C8] p-8 rounded-3xl text-center space-y-4 shadow-inner">
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4A4A40]/60 block">
          Complete the story sentence:
        </span>
        
        <div className="text-xl font-serif text-[#2D2D2A] leading-relaxed flex flex-wrap justify-center items-center gap-x-2 gap-y-3 pt-2">
          <span>{pText}</span>
          
          {feedback === 'correct' ? (
            <span className="px-3.5 py-1 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold scale-105 transition-all">
              {cWord}
            </span>
          ) : (
            <span className="w-24 h-8 border-2 border-dashed border-[#5A5A40] rounded-xl bg-white/70 animate-pulse flex items-center justify-center text-xs text-stone-400 font-sans font-bold uppercase tracking-wider">
              [ ? ]
            </span>
          )}

          <span>{sText}</span>
        </div>

        <button
          onClick={() => {
            const sentenceToSpeak = feedback === 'correct'
              ? `${pText} ${cWord}`
              : `${pText} ... ${sText}`;
            speakText(sentenceToSpeak, langCode, voicePack);
          }}
          className="flex items-center gap-1.5 text-[10px] font-sans font-bold text-[#5A5A40] hover:text-[#2D2D2A] bg-white border border-[#EAE8D9] px-3.5 py-1.5 rounded-full shadow-sm mx-auto cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>Read Aloud</span>
        </button>
      </div>

      {/* Brick Trays options */}
      <div className="space-y-3">
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#4A4A40]/60 text-center block">
          Tap the correct word brick below:
        </span>
        
        <div className="flex justify-center gap-4">
          {currentSentence.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isCorrect = opt.id === `opt_${currentSentence.id}`;

            let brickStyle = 'bg-stone-100 border-stone-300 text-stone-800 hover:border-[#5A5A40] hover:scale-102';
            if (feedback && isSelected) {
              brickStyle = isCorrect
                ? 'bg-emerald-100 border-emerald-400 text-emerald-800 scale-103'
                : 'bg-rose-100 border-rose-300 text-rose-800 opacity-60';
            } else if (feedback && isCorrect) {
              brickStyle = 'bg-emerald-100/50 border-emerald-300 text-emerald-800';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleOptionClick(opt.id)}
                disabled={!!feedback}
                className={`flex items-center gap-1.5 px-5 py-3 rounded-2xl border-2 font-bold text-sm shadow-sm transition-all cursor-pointer active:scale-95 ${brickStyle}`}
              >
                <span className="text-base select-none">{opt.emoji}</span>
                <span>{opt.label[langCode] || opt.label['en']}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Next round */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-[#FAF9F3] border border-[#EAE8D9] flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-2">
            {feedback === 'correct' ? (
              <>
                <CheckCircle className="w-5 h-5 text-teal-600" />
                <span className="text-xs font-sans font-bold text-teal-800">
                  Wonderful sentence structure! +4 Stars!
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-sans font-bold text-rose-800">
                  Try another block card to finish the story!
                </span>
              </>
            )}
          </div>

          <button
            onClick={feedback === 'correct' ? handleNext : startRound}
            className="flex items-center gap-1.5 bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-sans font-bold uppercase tracking-widest text-[10px] px-5 py-3 rounded-full cursor-pointer transition-all active:scale-95"
          >
            <span>{feedback === 'correct' && roundsCount >= goalRounds ? 'Finish Lesson' : 'Next Lesson Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
