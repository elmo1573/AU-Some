import React, { useState } from 'react';
import { SentenceBlock, LanguageCode } from '../types';
import { speakText, playSensoryChime } from '../utils/speech';
import { Sparkles, Trash2, Volume2, ArrowRight } from 'lucide-react';

interface SentenceBuilderProps {
  sentenceBlocks: SentenceBlock[];
  langCode: LanguageCode;
  addStarsAndCoins: (stars: number, coins: number) => void;
  voicePack: string;
}

export default function SentenceBuilder({
  sentenceBlocks,
  langCode,
  addStarsAndCoins,
  voicePack,
}: SentenceBuilderProps) {
  const [constructedSentence, setConstructedSentence] = useState<SentenceBlock[]>([]);

  const handleBlockClick = (block: SentenceBlock) => {
    playSensoryChime('click');
    
    // Add to the built sentence sequence (max 4 blocks for autism-friendly simplicity)
    if (constructedSentence.length >= 4) return;
    
    // Vocalize individual block instantly on selection
    speakText(block.label, langCode, voicePack);

    setConstructedSentence([...constructedSentence, block]);
  };

  const handleRemoveBlock = (indexToRemove: number) => {
    playSensoryChime('click');
    setConstructedSentence(constructedSentence.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearSentence = () => {
    playSensoryChime('click');
    setConstructedSentence([]);
  };

  const handleSpeakPhrase = () => {
    if (constructedSentence.length === 0) return;

    playSensoryChime('success');
    
    // Compile and speak the full phrase
    const fullPhrase = constructedSentence.map((b) => b.label).join(' ');
    speakText(fullPhrase, langCode, voicePack);

    // Award encouragement stars for successful phrase building
    addStarsAndCoins(2, 1);
  };

  // Group blocks by type
  const starters = sentenceBlocks.filter((b) => b.type === 'starter');
  const actions = sentenceBlocks.filter((b) => b.type === 'action');
  const objects = sentenceBlocks.filter((b) => b.type === 'object');
  const feelings = sentenceBlocks.filter((b) => b.type === 'feeling');

  return (
    <div id="sentence-builder-container" className="max-w-4xl mx-auto space-y-6">
      
      {/* Intro header */}
      <div className="p-6 rounded-[32px] bg-white border-2 border-[#EAE8D9]">
        <h2 className="text-2xl font-serif font-light text-[#2D2D2A] flex items-center gap-2">
          ✨ Sentence Builder
        </h2>
        <p className="text-xs text-[#4A4A40]/80 mt-1">
          Tap visual brick blocks below to compose phrases, express how you feel, or request something.
        </p>
      </div>

      {/* 1. Sentence Visual Slot Workspace (Sandbox) */}
      <div className="bg-[#FAF9F3] border-2 border-dashed border-[#D9D7C8] rounded-[40px] p-6 min-h-[140px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
        
        {/* Placeholder slots for bricks */}
        <div className="flex flex-wrap items-center gap-2 flex-1 justify-center md:justify-start">
          {constructedSentence.length === 0 ? (
            <span className="text-xs font-serif text-[#4A4A40]/60 italic">
              Tap blocks from the trays below to build a sentence here...
            </span>
          ) : (
            constructedSentence.map((block, idx) => (
              <React.Fragment key={`${block.id}-${idx}`}>
                <button
                  id={`sandbox-block-${idx}`}
                  onClick={() => handleRemoveBlock(idx)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border-2 font-bold text-sm shadow-sm hover:line-through hover:opacity-80 active:scale-95 transition-all cursor-pointer ${block.colorClass}`}
                >
                  <span className="select-none">{block.emoji}</span>
                  <span className="text-[#2D2D2A]">{block.label}</span>
                </button>
                {idx < constructedSentence.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-[#D9D7C8] shrink-0" />
                )}
              </React.Fragment>
            ))
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {constructedSentence.length > 0 && (
            <>
              <button
                id="clear-sentence-btn"
                onClick={handleClearSentence}
                className="p-3.5 rounded-full border-2 border-[#EAE8D9] bg-white hover:bg-[#FAF9F3] hover:text-red-700 text-[#4A4A40] transition-all cursor-pointer"
                title="Clear sentence"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <button
                id="speak-sentence-compiled-btn"
                onClick={handleSpeakPhrase}
                className="flex items-center gap-2 bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-sans font-bold uppercase tracking-widest text-xs px-6 py-4 rounded-full shadow-sm transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
                <span>Speak Phrase</span>
              </button>
            </>
          )}
        </div>

      </div>

      {/* 2. Bricks Trays (Category Panels) */}
      <div className="space-y-6">
        
        {/* Row 1: Starters */}
        <div className="space-y-2">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#4A4A40]/70 block">
            1. Sentence Starters
          </span>
          <div className="flex flex-wrap gap-2.5">
            {starters.map((block) => (
              <button
                key={block.id}
                id={`block-starter-${block.id}`}
                onClick={() => handleBlockClick(block)}
                className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl border-2 font-bold text-sm hover:scale-103 active:scale-97 transition-all cursor-pointer ${block.colorClass}`}
              >
                <span className="text-base select-none">{block.emoji}</span>
                <span className="text-[#2D2D2A]">{block.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Actions */}
        <div className="space-y-2">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#4A4A40]/70 block">
            2. Actions
          </span>
          <div className="flex flex-wrap gap-2.5">
            {actions.map((block) => (
              <button
                key={block.id}
                id={`block-action-${block.id}`}
                onClick={() => handleBlockClick(block)}
                className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl border-2 font-bold text-sm hover:scale-103 active:scale-97 transition-all cursor-pointer ${block.colorClass}`}
              >
                <span className="text-base select-none">{block.emoji}</span>
                <span className="text-[#2D2D2A]">{block.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Objects */}
        <div className="space-y-2">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#4A4A40]/70 block">
            3. Objects / Places
          </span>
          <div className="flex flex-wrap gap-2.5">
            {objects.map((block) => (
              <button
                key={block.id}
                id={`block-object-${block.id}`}
                onClick={() => handleBlockClick(block)}
                className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl border-2 font-bold text-sm hover:scale-103 active:scale-97 transition-all cursor-pointer ${block.colorClass}`}
              >
                <span className="text-base select-none">{block.emoji}</span>
                <span className="text-[#2D2D2A]">{block.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: Feelings */}
        <div className="space-y-2">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#4A4A40]/70 block">
            4. Feelings
          </span>
          <div className="flex flex-wrap gap-2.5">
            {feelings.map((block) => (
              <button
                key={block.id}
                id={`block-feeling-${block.id}`}
                onClick={() => handleBlockClick(block)}
                className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl border-2 font-bold text-sm hover:scale-103 active:scale-97 transition-all cursor-pointer ${block.colorClass}`}
              >
                <span className="text-base select-none">{block.emoji}</span>
                <span className="text-[#2D2D2A]">{block.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
