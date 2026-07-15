/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Volume2, Sparkles, VolumeX } from 'lucide-react';
import { audio } from '../audio';

interface MascotProps {
  text: string;
  avatar: string;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  isEasyMode: boolean;
}

export const MascotBubble: React.FC<MascotProps> = ({
  text,
  avatar,
  voiceEnabled,
  onToggleVoice,
  isEasyMode,
}) => {
  const [wiggle, setWiggle] = useState(false);

  useEffect(() => {
    // Speak when text changes
    audio.speak(text, voiceEnabled);
    // Wasp wiggle animation on text change
    setWiggle(true);
    const timer = setTimeout(() => setWiggle(false), 500);
    return () => clearTimeout(timer);
  }, [text, voiceEnabled]);

  const handleMascotClick = () => {
    setWiggle(true);
    audio.playSoftTap();
    audio.speak(text, voiceEnabled);
    setTimeout(() => setWiggle(false), 500);
  };

  return (
    <div className="flex items-end gap-5 p-5 bg-amber-50 rounded-4xl border-2 border-amber-100 max-w-3xl mx-auto shadow-md my-6">
      {/* Mascot Circle */}
      <div className="relative flex-shrink-0">
        <button
          id="mascot-button"
          onClick={handleMascotClick}
          className={`w-24 h-24 rounded-full bg-cream border-4 border-amber-300 flex items-center justify-center text-5xl shadow-lg cursor-pointer transition-transform duration-300 select-none btn-tactile ${
            wiggle ? 'animate-bounce scale-110' : 'hover:scale-105'
          }`}
          aria-label="Tap to repeat voice"
        >
          {avatar}
          {isEasyMode && (
            <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-1.5 animate-pulse border-2 border-white">
              <Sparkles className="w-5 h-5" />
            </div>
          )}
        </button>

        {/* Voice control button */}
        <button
          id="toggle-voice-btn"
          onClick={onToggleVoice}
          className={`absolute -bottom-2 -right-2 p-2.5 rounded-full shadow-lg cursor-pointer border-2 transition-colors ${
            voiceEnabled
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
              : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
          }`}
          title={voiceEnabled ? 'Mute Voice' : 'Unmute Voice'}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Bubble Speech */}
      <div className="relative bg-white p-6 rounded-3xl rounded-bl-none border-2 border-amber-100 text-gray-800 flex-grow shadow-md">
        <div className="absolute left-[-12px] bottom-0 w-0 h-0 border-t-[12px] border-t-transparent border-r-[12px] border-r-white border-b-0 border-l-0"></div>
        
        {/* Easy mode indicator */}
        {isEasyMode && (
          <span className="inline-block text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-black mb-2 tracking-wide uppercase font-mono animate-pulse">
            ✨ Assisted Mode Active (Extra Visual Hints)
          </span>
        )}
        
        <p className="text-xl sm:text-2xl font-display font-black leading-relaxed text-amber-950">
          {text}
        </p>
        
        <button
          id="repeat-instruction-text"
          onClick={handleMascotClick}
          className="text-sm text-amber-600 hover:text-amber-800 font-bold underline mt-2 flex items-center gap-1.5 cursor-pointer"
        >
          <Volume2 className="w-4 h-4" /> Tap me to hear it again 🐻📣
        </button>
      </div>
    </div>
  );
};
