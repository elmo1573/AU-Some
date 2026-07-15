/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ShoppingBag, Coins, Sparkles, Check } from 'lucide-react';
import { SHOP_ITEMS } from '../levelsData';
import { ShopItem } from '../types';
import { audio } from '../audio';

interface ShopProps {
  coins: number;
  unlockedItems: string[];
  activeAvatar: string;
  activeAccessory: string | null;
  onBuyItem: (item: ShopItem) => void;
  onSelectAvatar: (emoji: string) => void;
  onSelectAccessory: (id: string | null) => void;
  onClose: () => void;
}

export const ShopDialog: React.FC<ShopProps> = ({
  coins,
  unlockedItems,
  activeAvatar,
  activeAccessory,
  onBuyItem,
  onSelectAvatar,
  onSelectAccessory,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'Characters' | 'Hats' | 'Stickers'>('Characters');

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (activeTab === 'Characters') return item.type === 'character';
    if (activeTab === 'Hats') return item.type === 'accessory';
    return item.type === 'sticker';
  });

  const handlePurchase = (item: ShopItem) => {
    if (coins >= item.cost) {
      audio.playSoftBell();
      onBuyItem(item);
    } else {
      audio.playEncourageTone();
    }
  };

  const handleSelect = (item: ShopItem) => {
    audio.playSoftTap();
    if (item.type === 'character') {
      onSelectAvatar(item.visual);
    } else if (item.type === 'accessory') {
      onSelectAccessory(item.id === 'acc_none' ? null : item.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-[#faf8f5] rounded-3xl w-full max-w-2xl border-4 border-amber-100 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-amber-100/60 p-5 border-b-2 border-amber-200/40 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-amber-200/60 rounded-2xl">
              <ShoppingBag className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-amber-950">
                AU-SOME Toy Shop
              </h2>
              <p className="text-stone-500 text-xs font-medium">
                Spend your shiny coins to get fun accessories and stickers!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Coin balance */}
            <div className="flex items-center gap-1.5 bg-yellow-400 text-yellow-950 px-4 py-2 rounded-2xl font-bold text-sm shadow-xs border border-yellow-300">
              <Coins className="w-4 h-4 text-yellow-950 animate-bounce" />
              <span>{coins}</span>
            </div>

            <button
              id="close-shop-btn"
              onClick={() => {
                audio.playSoftTap();
                onClose();
              }}
              className="p-2 hover:bg-stone-200/60 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-stone-100/60 p-2 gap-2 flex-shrink-0 border-b border-stone-200/30">
          {(['Characters', 'Hats', 'Stickers'] as const).map((tab) => (
            <button
              id={`shop-tab-${tab.toLowerCase()}`}
              key={tab}
              onClick={() => {
                audio.playSoftTap();
                setActiveTab(tab);
              }}
              className={`flex-grow py-3 rounded-2xl font-display font-bold text-sm transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-amber-950 shadow-xs ring-2 ring-amber-100'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-white/40'
              }`}
            >
              {tab === 'Characters' ? '🐼 Avatars' : tab === 'Hats' ? '🎩 Accessories' : '🌸 Stickers'}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="p-6 overflow-y-auto flex-grow no-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isUnlocked = unlockedItems.includes(item.id) || item.cost === 0;
              const isAffordable = coins >= item.cost;
              
              // Check if selected
              const isSelected = 
                (item.type === 'character' && activeAvatar === item.visual) ||
                (item.type === 'accessory' && (activeAccessory === item.id || (item.id === 'acc_none' && !activeAccessory)));

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-between transition-all ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-50/50 ring-4 ring-emerald-100'
                      : isUnlocked
                        ? 'border-stone-200 bg-white hover:border-amber-200/50'
                        : isAffordable
                          ? 'border-yellow-200 bg-yellow-50/20'
                          : 'border-stone-100 bg-stone-50/60 opacity-80'
                  }`}
                >
                  {/* Visual preview */}
                  <div className="w-20 h-20 rounded-2xl bg-stone-50 border border-stone-200/50 flex items-center justify-center text-4xl shadow-inner relative select-none">
                    {item.visual}
                    {isUnlocked && isSelected && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="text-center mt-3 mb-4 w-full">
                    <span className="block font-display font-bold text-stone-800 text-sm truncate">
                      {item.name}
                    </span>
                    <span className="block text-[11px] text-stone-400 font-medium">
                      {item.category}
                    </span>
                  </div>

                  {/* Button Action */}
                  <div className="w-full">
                    {isUnlocked ? (
                      item.type === 'sticker' ? (
                        <div className="w-full py-2 bg-stone-100 text-stone-500 rounded-xl font-display font-semibold text-xs text-center border border-stone-200/40">
                          Unlocked ✔
                        </div>
                      ) : (
                        <button
                          id={`select-shop-item-${item.id}`}
                          onClick={() => handleSelect(item)}
                          className={`w-full py-2.5 rounded-xl font-display font-bold text-xs cursor-pointer btn-tactile ${
                            isSelected
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          {isSelected ? 'Equipped' : 'Equip'}
                        </button>
                      )
                    ) : (
                      <button
                        id={`buy-shop-item-${item.id}`}
                        disabled={!isAffordable}
                        onClick={() => handlePurchase(item)}
                        className={`w-full py-2.5 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer btn-tactile ${
                          isAffordable
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs hover:shadow-md'
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>Unlock {item.cost}</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Info footer */}
        <div className="bg-stone-50 p-4 border-t border-stone-100 text-center text-[11px] text-stone-400 font-medium flex flex-col gap-1.5 flex-shrink-0">
          <div>
            🎨 Keep learning and playing to earn more coins! Unlocked stickers can be used in your <strong>Sticker Book</strong>.
          </div>
          <div className="text-amber-800 font-bold text-[11px] bg-amber-50 rounded-lg py-1 px-3 border border-amber-100/50 flex justify-center items-center gap-1">
            🪵 Parents: Looking for physical toys? Check out our{' '}
            <button
              onClick={() => {
                audio.playSoftTap();
                onClose();
                window.dispatchEvent(new CustomEvent('switch-tab-real-shop'));
              }}
              className="underline text-amber-900 hover:text-amber-950 font-black cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-0.5"
            >
              Real Materials Shop 🛍️
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
