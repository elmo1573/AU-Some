import React, { useState } from 'react';
import { VocabularyItem, LanguageCode } from '../types';
import { REAL_WORLD_PRACTICE_CHECKLIST } from '../languages/data';
import { playSensoryChime } from '../utils/speech';
import { Award, ShieldCheck, Printer, CheckSquare, Heart, Sparkles, BookOpen, ChevronRight, Activity } from 'lucide-react';

interface ParentDashboardProps {
  langCode: LanguageCode;
  masteredWordsList: VocabularyItem[];
  aacUsageCount: Record<string, number>;
  stars: number;
  coins: number;
  streak: number;
  completedRealWorldChecklist: string[];
  toggleChecklist: (checklistId: string) => void;
  unlockedBadgeIds: string[];
}

export default function ParentDashboard({
  langCode,
  masteredWordsList,
  aacUsageCount,
  stars,
  coins,
  streak,
  completedRealWorldChecklist,
  toggleChecklist,
  unlockedBadgeIds,
}: ParentDashboardProps) {
  const [activePrintType, setActivePrintType] = useState<'aac' | 'cards' | null>(null);

  const calculateConfidenceScore = () => {
    // Communication Confidence is derived from mastered items + daily streak + AAC words practiced + checklist tasks
    const vocabWeight = Math.min(masteredWordsList.length * 4, 40);
    const badgeWeight = unlockedBadgeIds.length * 15;
    const streakWeight = Math.min(streak * 5, 20);
    const checklistWeight = completedRealWorldChecklist.length * 5;
    return Math.min(10 + vocabWeight + badgeWeight + streakWeight + checklistWeight, 100);
  };

  const confidenceScore = calculateConfidenceScore();

  // Categories of suggestions based on autism-friendly educational research
  const suggestedExercises = [
    {
      title: 'Tactile Tracing Board',
      desc: 'Scribble current vocabulary words in a shallow tray of flour, cornstarch, or colored sand. Let the child trace the physical lines as they speak.',
    },
    {
      title: 'Visual Pantry Match',
      desc: 'Affix simple custom PECS/AAC stickers to food containers in the kitchen. When the child taps the sticker, encourage them to vocalize the word.',
    },
    {
      title: 'Emotion Modeling Play',
      desc: 'Use visual mirrors during feeling exercises. Ask the child to make a happy face or sad face, matching their expressions with the app’s emojis.',
    }
  ];

  return (
    <div id="parent-dashboard-container" className="max-w-4xl mx-auto space-y-6">
      
      {/* Intro Dashboard Overview */}
      <div className="p-6 rounded-[32px] bg-white border-2 border-[#EAE8D9]">
        <h2 className="text-2xl font-serif font-light text-[#2D2D2A] flex items-center gap-2">
          👨‍👩‍👧 Parent & Caregiver Insights
        </h2>
        <p className="text-xs text-[#4A4A40]/80 mt-1 font-sans">
          Bridge app lessons with real-world practice. Track qualitative growth, download custom physical learning assets, and check daily activities.
        </p>
      </div>

      {/* Primary analytics overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Communication Confidence Card */}
        <div className="bg-[#FAF9F3] border-2 border-[#EAE8D9] p-6 rounded-[32px] space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-sans font-bold text-[#4A4A40]/70 uppercase tracking-widest block">
              Qualitative Growth Meter
            </span>
            <Activity className="w-5 h-5 text-[#5A5A40]" />
          </div>

          <div className="space-y-1">
            <span className="text-[9px] text-[#4A4A40]/60 block font-sans font-bold uppercase tracking-wider">Communication Confidence</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-serif font-bold text-[#2D2D2A]">{confidenceScore}%</span>
              <span className="text-xs font-sans font-bold uppercase tracking-wider bg-[#FAF6EC] text-[#7D5A2E] border border-[#EADAC2] px-2.5 py-1 rounded-full">
                {confidenceScore < 40 ? 'Exploring' : confidenceScore < 70 ? 'Cohesive' : 'Confident'}
              </span>
            </div>
          </div>

          {/* Graphical Progress Bar */}
          <div className="w-full bg-[#EAE8D9] h-3 rounded-full overflow-hidden border border-[#D9D7C8]">
            <div
              className="bg-[#5A5A40] h-full rounded-full transition-all duration-1000"
              style={{ width: `${confidenceScore}%` }}
            />
          </div>

          <p className="text-xs text-[#4A4A40]/80 leading-relaxed font-sans">
            Your child's **Communication Confidence** score represents their independent choice selection, turn-taking, and active daily streak. Instead of penalizing errors, it celebrates active effort and functional expression.
          </p>
        </div>

        {/* AAC Word Frequency usage chart */}
        <div className="bg-white border-2 border-[#EAE8D9] p-6 rounded-[32px] space-y-4">
          <span className="text-[10px] font-sans font-bold text-[#4A4A40]/70 uppercase tracking-widest block">
            Most Frequently Used Needs (AAC)
          </span>

          <div className="min-h-[140px] flex flex-wrap gap-2.5 items-center justify-center p-4 rounded-2xl bg-[#FAF9F3] border border-[#EAE8D9]">
            {Object.keys(aacUsageCount).length === 0 ? (
              <span className="text-xs text-[#4A4A40]/70 font-sans italic">
                No needs expressed on the board yet. Tap AAC buttons to populate this visual cloud.
              </span>
            ) : (
              Object.entries(aacUsageCount).map(([word, count]) => {
                // Determine size based on count
                const sizeClass = count > 10 ? 'text-xs px-3.5 py-2 font-bold bg-[#FAF6EC] border-[#EADAC2] text-[#7D5A2E]' :
                                  count > 4 ? 'text-[11px] px-3 py-1.5 font-bold bg-[#FAF9F3] border-[#EAE8D9] text-[#5A5A40]' :
                                  'text-[10px] px-2.5 py-1 font-semibold bg-white border-[#EAE8D9] text-[#4A4A40]';
                return (
                  <span
                    key={word}
                    className={`rounded-full border shadow-sm flex items-center gap-1 select-none font-sans uppercase tracking-wider ${sizeClass}`}
                  >
                    <span>{word}</span>
                    <span className="opacity-50 text-[9px] font-mono">({count}x)</span>
                  </span>
                );
              })
            )}
          </div>

          <p className="text-xs text-[#4A4A40]/80 font-sans leading-relaxed">
            Use this cloud to identify what needs or emotional triggers your child is sharing most.
          </p>
        </div>

      </div>

      {/* Printable Material Generators (Montessori PECS Assets) */}
      <div className="bg-white border-2 border-[#EAE8D9] rounded-[32px] p-6 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-serif font-light text-[#2D2D2A] flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-[#5A5A40]" />
              PECS Board & Tactile Card Generator
            </h3>
            <p className="text-xs text-[#4A4A40]/80 mt-1 font-sans">
              Print visual, high-contrast assets to use physically in sensory games at home.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              id="print-aac-btn"
              onClick={() => { playSensoryChime('click'); setActivePrintType(activePrintType === 'aac' ? null : 'aac'); }}
              className="text-xs font-sans font-bold uppercase tracking-wider px-4 py-2.5 rounded-full border border-[#D9D7C8] text-[#4A4A40] bg-white hover:bg-[#FAF9F3] cursor-pointer"
            >
              AAC Board
            </button>
            <button
              id="print-cards-btn"
              onClick={() => { playSensoryChime('click'); setActivePrintType(activePrintType === 'cards' ? null : 'cards'); }}
              className="text-xs font-sans font-bold uppercase tracking-wider px-4 py-2.5 rounded-full border border-[#D9D7C8] text-[#4A4A40] bg-white hover:bg-[#FAF9F3] cursor-pointer"
            >
              Flashcards
            </button>
          </div>
        </div>

        {/* Generated layout modal preview */}
        {activePrintType && (
          <div className="p-6 rounded-[24px] bg-[#FAF9F3] border-2 border-dashed border-[#D9D7C8] space-y-4 animate-fade-in relative">
            <div className="flex justify-between items-center pb-2 border-b border-[#EAE8D9]">
              <span className="text-[10px] font-sans font-bold text-[#4A4A40]/70 uppercase tracking-widest">
                {activePrintType === 'aac' ? 'Printable AAC Board' : 'Printable Flashcards'} Layout
              </span>
              <button
                id="close-print-preview-btn"
                onClick={() => window.print()}
                className="text-xs font-sans font-bold uppercase tracking-wider px-4 py-2 rounded-full text-white bg-[#5A5A40] hover:bg-[#4A4A35] cursor-pointer"
              >
                Send to Printer
              </button>
            </div>

            {/* Simulated printable content */}
            {activePrintType === 'aac' ? (
              <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto bg-white p-4 rounded-2xl border border-[#EAE8D9]">
                {['Want 🙋', 'Help 🆘', 'Stop 🛑', 'Finished ✅', 'More ➕', 'Drink 🥛', 'Eat 🍎', 'Toilet 🚽'].map((item) => (
                  <div key={item} className="p-3 border border-[#EAE8D9] rounded-xl text-center flex flex-col justify-center items-center min-h-[64px] bg-[#FAF9F3]">
                    <span className="text-xl select-none">{item.split(' ')[1]}</span>
                    <span className="text-[10px] font-sans font-bold text-[#4A4A40] mt-1">{item.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                {masteredWordsList.length === 0 ? (
                  <div className="col-span-3 text-center py-6 text-xs text-[#4A4A40]/70 italic bg-white rounded-2xl border border-[#EAE8D9] font-sans">
                    Master some vocabulary words in the app first to populate printable tactile flashcards!
                  </div>
                ) : (
                  masteredWordsList.slice(0, 6).map((item) => (
                    <div key={item.id} className="bg-white border border-[#EAE8D9] rounded-2xl p-3 text-center flex flex-col items-center justify-center space-y-1 shadow-sm min-h-[80px]">
                      <span className="text-3xl select-none">{item.emoji}</span>
                      <span className="text-xs font-sans font-bold text-[#2D2D2A]">{item.word}</span>
                      <span className="text-[9px] font-mono text-[#4A4A40]/70 italic">{item.phonetic}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Real-World Practice Checklist */}
      <div className="bg-white border-2 border-[#EAE8D9] rounded-[32px] p-6 space-y-4 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-lg font-serif font-light text-[#2D2D2A] flex items-center gap-1.5">
            <CheckSquare className="w-5 h-5 text-[#5A5A40]" />
            Real-World Practice Checklist
          </h3>
          <p className="text-xs text-[#4A4A40]/80 font-sans">
            Have your child demonstrate these exercises in natural environments. Tick items to reward them with extra Stars & Coins!
          </p>
        </div>

        <div className="space-y-2 pt-2">
          {REAL_WORLD_PRACTICE_CHECKLIST.map((task) => {
            const isCompleted = completedRealWorldChecklist.includes(task.id);
            return (
              <button
                key={task.id}
                id={`checklist-item-${task.id}`}
                onClick={() => {
                  playSensoryChime('success');
                  toggleChecklist(task.id);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left cursor-pointer ${
                  isCompleted
                    ? 'bg-[#FAF6EC] border-[#EADAC2] text-[#7D5A2E]'
                    : 'bg-white border-[#EAE8D9] text-[#4A4A40] hover:border-[#5A5A40]'
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                  isCompleted ? 'bg-[#5A5A40] border-[#5A5A40] text-white' : 'border-[#D9D7C8]'
                }`}>
                  {isCompleted && <span className="text-xs font-bold">✓</span>}
                </div>
                
                <span className="text-xs font-sans font-bold leading-relaxed flex-1">
                  {task.label}
                </span>

                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#7D5A2E] bg-[#FAF6EC] border border-[#EADAC2] px-2.5 py-1 rounded-full shrink-0">
                  +{task.points} Stars
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggested Montessori Exercises */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <ChevronRight className="w-4 h-4 text-[#5A5A40]" />
          <span className="text-[10px] font-sans font-bold text-[#4A4A40]/70 uppercase tracking-widest block">
            Suggested Montessori Exercises
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestedExercises.map((ex, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-[#EAE8D9] p-5 rounded-3xl space-y-2 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-serif font-bold text-[#2D2D2A] flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 stroke-none" />
                  {ex.title}
                </span>
                <p className="text-[11px] text-[#4A4A40]/80 leading-relaxed font-sans">
                  {ex.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
