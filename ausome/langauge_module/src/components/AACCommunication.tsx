import React, { useState } from 'react';
import { AACWord, LanguageCode } from '../types';
import { speakText, playSensoryChime } from '../utils/speech';
import { Volume2, Smile, Sparkles, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AACCommunicationProps {
  aacWords: AACWord[];
  langCode: LanguageCode;
  onWordUsed: (wordLabel: string) => void;
  stars: number;
  addStarsAndCoins: (stars: number, coins: number) => void;
  aacTheme: 'classic' | 'warm-cream' | 'pastel-blue' | 'soft-lavender';
  setAacTheme: (theme: 'classic' | 'warm-cream' | 'pastel-blue' | 'soft-lavender') => void;
  voicePack: string;
  avatar?: { hat: string; outfit: string; decor: string; faceColor?: string; expression?: string };
}

export default function AACCommunication({
  aacWords,
  langCode,
  onWordUsed,
  addStarsAndCoins,
  aacTheme,
  setAacTheme,
  voicePack,
  avatar = { hat: '', outfit: '', decor: '🪴', faceColor: '#FAF5EB', expression: '😊' },
}: AACCommunicationProps) {
  const [activeWord, setActiveWord] = useState<AACWord | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleWordClick = (word: AACWord) => {
    setActiveWord(word);
    setIsSpeaking(true);
    playSensoryChime('click');
    onWordUsed(word.label);

    // Speak the actual localized label
    speakText(word.label, langCode, voicePack);

    // Award minor encouragement stars occasionally
    addStarsAndCoins(1, 0);

    // Stop speaking animation after 1.2 seconds
    setTimeout(() => {
      setIsSpeaking(false);
    }, 1200);
  };

  // Sensory container themes
  const themeClasses = {
    classic: 'bg-white border-4 border-[#D9D7C8] rounded-[44px] shadow-md',
    'warm-cream': 'bg-[#FAF6EC] border-4 border-[#EADAC2] rounded-[44px] shadow-md',
    'pastel-blue': 'bg-[#F2F7FA] border-4 border-[#BCE2F1] rounded-[44px] shadow-md',
    'soft-lavender': 'bg-[#FAF2F9] border-4 border-[#ECCCEE] rounded-[44px] shadow-md',
  };

  const currentFaceColor = avatar.faceColor || '#FAF5EB';
  const currentExpression = avatar.expression || '😊';

  return (
    <div id="aac-communication-container" className="space-y-8 max-w-4xl mx-auto p-1">
      
      {/* Header section with theme control and horizontal rounded labels */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-6 rounded-[36px] bg-white border-4 border-[#EADAC2] shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full px-4 py-1 bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-sans font-black uppercase tracking-wider inline-block">
              Express Yourself
            </span>
          </div>
          <h2 className="text-3xl font-serif font-black text-[#2D2D2A] tracking-tight flex items-center gap-2 mt-1">
            🗣️ AAC Core Board
          </h2>
          <p className="text-xs text-[#4A4A40]/80 mt-1 font-medium">
            Tap any giant button to speak out loud, express your needs, and communicate.
          </p>
        </div>

        {/* Sensory Theme Selector - Horizontal rounded labels */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="rounded-full px-3.5 py-1.5 bg-yellow-100 text-yellow-800 border-2 border-yellow-300 font-bold inline-flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5" />
            Board Style
          </span>
          
          <div className="flex bg-[#FAF6EC] p-1 rounded-full border-2 border-[#EADAC2] shadow-inner">
            {(['classic', 'warm-cream', 'pastel-blue', 'soft-lavender'] as const).map((t) => (
              <button
                key={t}
                id={`theme-btn-${t}`}
                onClick={() => {
                  playSensoryChime('click');
                  setAacTheme(t);
                }}
                className={`text-[10px] px-3.5 py-2.5 rounded-full font-sans font-black uppercase tracking-wide transition-all cursor-pointer ${
                  aacTheme === t
                    ? 'bg-[#5A5A40] text-white shadow-md'
                    : 'text-[#4A4A40] hover:text-[#2D2D2A]'
                }`}
              >
                {t === 'classic' && 'Solid'}
                {t === 'warm-cream' && 'Cream'}
                {t === 'pastel-blue' && 'Blue'}
                {t === 'soft-lavender' && 'Lavender'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Board Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Customized Mirroring Speaking Avatar */}
        <div className="md:col-span-4 flex flex-col items-center justify-between p-6 rounded-[44px] border-4 border-[#EADAC2] bg-white text-center min-h-[300px] shadow-lg relative overflow-hidden">
          
          {/* Subtle sparkles decoration */}
          <div className="absolute top-4 left-4 text-3xl opacity-20 select-none">✨</div>
          <div className="absolute top-4 right-4 text-3xl opacity-20 select-none">✨</div>

          <div className="space-y-1.5">
            <span className="rounded-full px-3.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-sans font-black uppercase tracking-wider inline-block">
              Vocalization mirror
            </span>
          </div>

          {/* Interactive animated Customized Avatar face */}
          <div className="relative my-6">
            {/* Speaking visual soundwaves */}
            <AnimatePresence>
              {isSpeaking && (
                <>
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute inset-0 rounded-full bg-[#5A5A40]/20 z-0"
                  />
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: 1.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                    className="absolute inset-0 rounded-full bg-[#5A5A40]/15 z-0"
                  />
                </>
              )}
            </AnimatePresence>

            <motion.div 
              animate={isSpeaking ? { scale: [1, 1.15, 0.95, 1.05, 1], y: [0, -5, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Hat */}
              {avatar.hat && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-5xl z-20 select-none filter drop-shadow">
                  {avatar.hat}
                </span>
              )}

              {/* Face sphere with customizable skin background */}
              <div 
                style={{ backgroundColor: currentFaceColor }}
                className="w-28 h-28 rounded-full border-4 border-[#7D5A2E]/20 flex items-center justify-center relative shadow-md transition-all"
              >
                {/* Expressions */}
                <div className="text-5xl select-none">
                  {isSpeaking ? '😮' : currentExpression}
                </div>
              </div>

              {/* Outfit */}
              {avatar.outfit ? (
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-5xl select-none z-10">
                  {avatar.outfit}
                </span>
              ) : (
                <div className="w-16 h-8 bg-[#5A5A40] rounded-t-2xl border-2 border-[#3D3D2D] absolute -bottom-6 left-1/2 -translate-x-1/2 z-10 shadow-sm" />
              )}
            </motion.div>
          </div>

          <div className="min-h-[60px] flex flex-col justify-center w-full">
            {activeWord ? (
              <motion.div 
                key={activeWord.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-2"
              >
                <div className="rounded-full px-5 py-2.5 bg-[#FAF6EC] border-2 border-[#EADAC2] text-sm font-sans font-black text-[#2D2D2A] inline-flex items-center justify-center gap-1.5 shadow-sm max-w-full">
                  <span className="text-xl select-none">{activeWord.emoji}</span>
                  <span>{activeWord.label}</span>
                </div>
                <div className="text-[10px] font-sans font-black text-[#5A5A40] uppercase tracking-widest block">
                  {isSpeaking ? '🗣️ VOCALIZING SOUND...' : '✅ SPOKEN'}
                </div>
              </motion.div>
            ) : (
              <p className="text-xs text-[#4A4A40]/60 italic font-serif">
                Tap a block to start communicating!
              </p>
            )}
          </div>
        </div>

        {/* Right Columns: Giant grid of AAC blocks */}
        <div className={`md:col-span-8 p-6 transition-all ${themeClasses[aacTheme]}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {aacWords.map((word) => (
              <motion.button
                key={word.id}
                id={`aac-word-${word.id}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleWordClick(word)}
                className={`group relative flex flex-col items-center justify-between p-4.5 rounded-[28px] border-3 transition-all text-center cursor-pointer min-h-[114px] shadow-sm ${word.colorClass} hover:shadow-md`}
              >
                {/* Symbol Display */}
                <span className="text-4xl mb-2 transition-transform group-hover:scale-110 group-active:scale-90 select-none">
                  {word.emoji}
                </span>
                
                {/* Horizontal Round Badge Label */}
                <span className="text-xs font-black tracking-tight leading-none select-none text-[#2D2D2A] bg-white/90 border border-[#D9D7C8] px-4 py-2 rounded-full shadow-sm w-full truncate">
                  {word.label}
                </span>

                {/* Speaker icon indicator */}
                <Volume2 className="absolute top-3 right-3 w-4 h-4 text-[#4A4A40]/40 group-hover:text-[#4A4A40] transition-colors" />
              </motion.button>
            ))}
          </div>
          
          {/* Legend/Footer - Horizontal rounded pills */}
          <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t-2 border-[#D9D7C8] text-[9px] font-sans font-black uppercase tracking-wider text-[#4A4A40]/70">
            <span className="flex items-center gap-1.5 bg-[#FFF0F0] border-2 border-rose-200 px-3.5 py-1.5 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block animate-pulse" /> Needs
            </span>
            <span className="flex items-center gap-1.5 bg-[#FFFDE7] border-2 border-amber-200 px-3.5 py-1.5 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block animate-pulse" /> Urgent / Action
            </span>
            <span className="flex items-center gap-1.5 bg-[#E8EAF6] border-2 border-indigo-200 px-3.5 py-1.5 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block animate-pulse" /> Places
            </span>
            <span className="flex items-center gap-1.5 bg-[#E0F2F1] border-2 border-teal-200 px-3.5 py-1.5 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block animate-pulse" /> Courtesies
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
