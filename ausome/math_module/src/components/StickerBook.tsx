/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Palette, Trash2, HelpCircle, Save, Sparkles, Smile } from 'lucide-react';
import { SHOP_ITEMS } from '../levelsData';
import { StickerPlacement } from '../types';
import { audio } from '../audio';

interface StickerBookProps {
  unlockedItems: string[];
  stickerPlacements: StickerPlacement[];
  onUpdateStickers: (newPlacements: StickerPlacement[]) => void;
}

export const StickerBook: React.FC<StickerBookProps> = ({
  unlockedItems,
  stickerPlacements,
  onUpdateStickers,
}) => {
  const [backgroundTheme, setBackgroundTheme] = useState<'meadow' | 'space' | 'ocean'>('meadow');
  const [activeStickerId, setActiveStickerId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Get unlocked stickers
  const unlockedStickers = SHOP_ITEMS.filter(
    (item) => item.type === 'sticker' && (unlockedItems.includes(item.id) || item.cost === 0)
  );

  // Place a new sticker onto the board
  const handleStickerTrayClick = (itemId: string) => {
    audio.playSoftTap();
    
    // Add new sticker placement in the center
    const newSticker: StickerPlacement = {
      id: `stk-${Math.random().toString(36).substr(2, 9)}`,
      itemId: itemId,
      x: 35 + Math.random() * 30, // Random center area
      y: 35 + Math.random() * 30,
      scale: 1.0,
    };

    onUpdateStickers([...stickerPlacements, newSticker]);
    audio.playSoftBell();
  };

  // Move a placed sticker
  const handleStickerPointerDown = (e: React.PointerEvent, id: string) => {
    e.preventDefault();
    audio.playSoftTap();
    setActiveStickerId(id);

    const board = boardRef.current;
    if (!board) return;

    const moveHandler = (moveEvent: PointerEvent) => {
      const rect = board.getBoundingClientRect();
      const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const y = ((moveEvent.clientY - rect.top) / rect.height) * 100;

      // Keep inside bounds (0-100)
      const boundedX = Math.max(5, Math.min(95, x));
      const boundedY = Math.max(5, Math.min(95, y));

      const updated = stickerPlacements.map((stk) => {
        if (stk.id === id) {
          return { ...stk, x: boundedX, y: boundedY };
        }
        return stk;
      });

      onUpdateStickers(updated);
    };

    const upHandler = () => {
      setActiveStickerId(null);
      window.removeEventListener('pointermove', moveHandler);
      window.removeEventListener('pointerup', upHandler);
    };

    window.addEventListener('pointermove', moveHandler);
    window.addEventListener('pointerup', upHandler);
  };

  // Scale sticker
  const handleScaleSticker = (id: string, multiplier: number) => {
    audio.playSoftTap();
    const updated = stickerPlacements.map((stk) => {
      if (stk.id === id) {
        const newScale = Math.max(0.6, Math.min(2.5, stk.scale * multiplier));
        return { ...stk, scale: newScale };
      }
      return stk;
    });
    onUpdateStickers(updated);
  };

  // Remove a sticker
  const handleRemoveSticker = (id: string) => {
    audio.playEncourageTone();
    const updated = stickerPlacements.filter((stk) => stk.id !== id);
    onUpdateStickers(updated);
  };

  // Clear all stickers
  const handleClearBoard = () => {
    if (stickerPlacements.length === 0) return;
    audio.playEncourageTone();
    onUpdateStickers([]);
  };

  const getBackgroundClass = () => {
    switch (backgroundTheme) {
      case 'space':
        return 'bg-radial from-slate-900 to-indigo-950 text-white';
      case 'ocean':
        return 'bg-gradient-to-b from-sky-400 via-sky-600 to-blue-800 text-sky-100';
      default:
        // Meadow
        return 'bg-gradient-to-b from-emerald-100 via-yellow-50 to-amber-100 text-emerald-950';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 select-none">
      
      {/* Settings / Backdrop control bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs gap-4">
        <div>
          <h2 className="text-lg font-display font-black text-amber-950 flex items-center gap-2">
            🎨 Sandbox Sticker Book
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            Place your stickers, resize them, and drag them around to build beautiful scenes!
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Theme buttons */}
          <span className="text-xs font-bold text-stone-400 font-display flex items-center gap-1">
            <Palette className="w-3.5 h-3.5" /> Backgrounds:
          </span>
          {(['meadow', 'space', 'ocean'] as const).map((theme) => (
            <button
              id={`sticker-bg-tab-${theme}`}
              key={theme}
              onClick={() => {
                audio.playSoftTap();
                setBackgroundTheme(theme);
              }}
              className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider cursor-pointer border ${
                backgroundTheme === theme
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {theme === 'meadow' ? '🌳 Meadow' : theme === 'space' ? '🚀 Space' : '🐳 Ocean'}
            </button>
          ))}

          {/* Clear button */}
          <button
            id="clear-sticker-board-btn"
            disabled={stickerPlacements.length === 0}
            onClick={handleClearBoard}
            className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs flex items-center gap-1 border cursor-pointer transition-colors ${
              stickerPlacements.length > 0
                ? 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200'
                : 'bg-stone-50 text-stone-300 border-stone-200 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>
      </div>

      {/* Board Canvas */}
      <div
        ref={boardRef}
        className={`w-full aspect-[4/3] rounded-[32px] border-4 border-white shadow-lg overflow-hidden relative ${getBackgroundClass()} transition-all duration-700`}
        style={{ touchAction: 'none' }}
      >
        {/* Background elements (visual decorations) */}
        {backgroundTheme === 'meadow' && (
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <div className="absolute bottom-[-10px] left-0 right-0 h-16 bg-emerald-300/40 rounded-t-full filter blur-md" />
            <div className="absolute top-10 left-10 text-5xl opacity-40 animate-pulse">☁️</div>
            <div className="absolute top-20 right-24 text-6xl opacity-35 animate-pulse">☁️</div>
            <div className="absolute top-4 right-4 text-7xl opacity-50">☀️</div>
            <div className="absolute bottom-12 left-16 text-3xl opacity-50">🌷</div>
            <div className="absolute bottom-10 right-20 text-3xl opacity-50">🌻</div>
          </div>
        )}

        {backgroundTheme === 'space' && (
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <div className="absolute top-8 left-16 text-4xl opacity-50">🪐</div>
            <div className="absolute bottom-16 right-16 text-5xl opacity-30">🌎</div>
            {/* Stars */}
            <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
            <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-white rounded-full animate-pulse" />
            <div className="absolute bottom-1/2 right-1/3 w-2 h-2 bg-yellow-200 rounded-full animate-pulse" />
          </div>
        )}

        {backgroundTheme === 'ocean' && (
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-blue-900/40 filter blur-lg" />
            {/* Bubbles */}
            <div className="absolute bottom-10 left-1/4 w-4 h-4 rounded-full border border-white/30 animate-pulse" />
            <div className="absolute bottom-20 right-1/4 w-3 h-3 rounded-full border border-white/20 animate-pulse" />
            <div className="absolute bottom-1/3 left-1/3 w-5 h-5 rounded-full border border-white/30 animate-pulse" />
            <div className="absolute top-12 left-12 text-4xl opacity-40">⛵</div>
          </div>
        )}

        {/* Board Instruction Overlay if empty */}
        {stickerPlacements.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/5 pointer-events-none">
            <Smile className="w-12 h-12 text-stone-500/40 mb-3 animate-bounce" />
            <h3 className="font-display font-bold text-stone-800/60 text-base">
              Your Sticker Board is Empty
            </h3>
            <p className="text-stone-500/50 text-xs mt-1 max-w-xs leading-relaxed">
              Unlock cool stickers in the toy shop, then tap them in the tray below to start designing!
            </p>
          </div>
        )}

        {/* Render Stickers placed on the board */}
        {stickerPlacements.map((stk) => {
          const detail = SHOP_ITEMS.find((item) => item.id === stk.itemId);
          if (!detail) return null;

          const isActive = activeStickerId === stk.id;

          return (
            <div
              key={stk.id}
              className={`absolute group cursor-grab active:cursor-grabbing select-none ${
                isActive ? 'ring-2 ring-yellow-400 rounded-xl bg-white/20 p-1.5 shadow-md scale-105 z-40' : 'z-20 hover:scale-105'
              }`}
              style={{
                left: `${stk.x}%`,
                top: `${stk.y}%`,
                transform: `translate(-50%, -50%) scale(${stk.scale})`,
                transition: isActive ? 'none' : 'transform 0.1s ease',
              }}
              onPointerDown={(e) => handleStickerPointerDown(e, stk.id)}
            >
              {/* Sticker Emoji Visual */}
              <span className="text-5xl sm:text-6xl filter drop-shadow-md select-none pointer-events-none block">
                {detail.visual}
              </span>

              {/* Individual Sticker controls (Show on click / active) */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 backdrop-blur-xs rounded-full p-1 border border-stone-200 shadow-lg opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-50">
                <button
                  id={`scale-sticker-up-${stk.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScaleSticker(stk.id, 1.2);
                  }}
                  className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                  title="Make bigger"
                >
                  ➕
                </button>
                <button
                  id={`scale-sticker-down-${stk.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScaleSticker(stk.id, 0.8);
                  }}
                  className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                  title="Make smaller"
                >
                  ➖
                </button>
                <button
                  id={`delete-sticker-${stk.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSticker(stk.id);
                  }}
                  className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                  title="Remove sticker"
                >
                  ❌
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stickers Selection Tray */}
      <div className="bg-amber-50 rounded-3xl p-5 border-4 border-amber-100">
        <h3 className="text-amber-950 font-display font-bold text-sm sm:text-base mb-3 flex items-center gap-2">
          🌸 Your Sticker Inventory
        </h3>

        {unlockedStickers.length === 0 ? (
          <div className="text-center py-6 bg-white/50 border border-dashed border-amber-200 rounded-2xl p-4">
            <p className="text-amber-900/60 font-display text-xs sm:text-sm font-medium">
              You haven't unlocked any stickers yet!
            </p>
            <p className="text-amber-900/40 text-[11px] mt-1">
              Go to the <strong>Toy Shop</strong> to unlock beautiful stickers with your coins!
            </p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {unlockedStickers.map((item) => (
              <button
                id={`add-sticker-tray-item-${item.id}`}
                key={item.id}
                onClick={() => handleStickerTrayClick(item.id)}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white hover:bg-amber-100/30 rounded-2xl flex-shrink-0 border border-amber-200/50 shadow-xs hover:shadow-md cursor-pointer flex flex-col items-center justify-center transition-all btn-tactile"
              >
                <span className="text-3xl sm:text-4xl filter drop-shadow-sm">{item.visual}</span>
                <span className="text-[9px] font-bold text-amber-900/50 mt-1 truncate max-w-full px-1">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
