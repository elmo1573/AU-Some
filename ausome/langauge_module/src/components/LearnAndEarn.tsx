import React, { useState } from 'react';
import { RewardItem } from '../types';
import { REWARD_SHOP_ITEMS } from '../languages/data';
import { playSensoryChime } from '../utils/speech';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Smile, Sparkles, Check, Lock, ShieldCheck, Heart, Palette, Wand2 } from 'lucide-react';

interface LearnAndEarnProps {
  stars: number;
  coins: number;
  streak: number;
  unlockedRewardIds: string[];
  unlockRewardItem: (itemId: string, cost: number) => void;
  avatar: { hat: string; outfit: string; decor: string; faceColor?: string; expression?: string };
  setAvatar: (avatar: { hat: string; outfit: string; decor: string; faceColor?: string; expression?: string }) => void;
  setAacTheme: (theme: 'classic' | 'warm-cream' | 'pastel-blue' | 'soft-lavender') => void;
}

const FACE_COLORS = [
  { value: '#FAF5EB', label: 'Cozy Cream', bgClass: 'bg-[#FAF5EB]' },
  { value: '#FFF275', label: 'Sunny Yellow', bgClass: 'bg-[#FFF275]' },
  { value: '#FFCAD4', label: 'Cotton Candy', bgClass: 'bg-[#FFCAD4]' },
  { value: '#B5E2FA', label: 'Pastel Blue', bgClass: 'bg-[#B5E2FA]' },
  { value: '#E8F5E9', label: 'Mint Green', bgClass: 'bg-[#E8F5E9]' },
  { value: '#F3E5F5', label: 'Soft Lavender', bgClass: 'bg-[#F3E5F5]' },
];

const EXPRESSIONS = [
  { value: '😊', label: 'Happy' },
  { value: '😄', label: 'Big Smile' },
  { value: '😌', label: 'Calm' },
  { value: '🤩', label: 'Star Eyes' },
  { value: '😎', label: 'Cool' },
  { value: '😉', label: 'Wink' },
  { value: '😗', label: 'Whistle' },
  { value: '😸', label: 'Cat Happy' },
];

export default function LearnAndEarn({
  stars,
  coins,
  streak,
  unlockedRewardIds,
  unlockRewardItem,
  avatar,
  setAvatar,
  setAacTheme,
}: LearnAndEarnProps) {
  const [activeTab, setActiveTab] = useState<'customizer' | 'shop'>('customizer');
  const [animateAvatar, setAnimateAvatar] = useState(false);

  const handlePurchase = (item: RewardItem) => {
    if (coins < item.cost) {
      playSensoryChime('click');
      return;
    }

    playSensoryChime('success');
    unlockRewardItem(item.id, item.cost);
    triggerAvatarAnimation();
  };

  const triggerAvatarAnimation = () => {
    setAnimateAvatar(true);
    setTimeout(() => setAnimateAvatar(false), 800);
  };

  const handleEquip = (item: RewardItem) => {
    playSensoryChime('click');
    triggerAvatarAnimation();
    const updated = { ...avatar };
    
    if (item.category === 'hats') {
      updated.hat = item.emoji;
    } else if (item.category === 'outfits') {
      updated.outfit = item.emoji;
    } else if (item.category === 'decorations') {
      updated.decor = item.emoji;
    } else if (item.category === 'themes') {
      const matchedTheme = item.id === 'r_lavender_theme' ? 'soft-lavender' : 'warm-cream';
      setAacTheme(matchedTheme);
    }

    setAvatar(updated);
  };

  const handleSetFaceColor = (colorHex: string) => {
    playSensoryChime('click');
    triggerAvatarAnimation();
    setAvatar({
      ...avatar,
      faceColor: colorHex,
    });
  };

  const handleSetExpression = (expEmoji: string) => {
    playSensoryChime('click');
    triggerAvatarAnimation();
    setAvatar({
      ...avatar,
      expression: expEmoji,
    });
  };

  const currentFaceColor = avatar.faceColor || '#FAF5EB';
  const currentExpression = avatar.expression || '😊';

  return (
    <div id="learn-and-earn-page" className="max-w-4xl mx-auto space-y-8 p-1">
      
      {/* 1. BIG COLORFUL ECONOMY STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-[#FFFDEB] border-4 border-[#FFF59D] p-5 rounded-[32px] flex items-center gap-4.5 shadow-md"
        >
          <div className="text-4xl select-none animate-pulse">⭐️</div>
          <div>
            <span className="rounded-full px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-sans font-black uppercase tracking-wider inline-block">
              Learning Stars
            </span>
            <div className="text-3xl font-serif font-black text-[#2D2D2A] mt-1">{stars}</div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-[#E8F5E9] border-4 border-[#A5D6A7] p-5 rounded-[32px] flex items-center gap-4.5 shadow-md"
        >
          <div className="text-4xl select-none">🪙</div>
          <div>
            <span className="rounded-full px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-sans font-black uppercase tracking-wider inline-block">
              Wood Coins
            </span>
            <div className="text-3xl font-serif font-black text-[#2D2D2A] mt-1">{coins}</div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-[#FFEBEE] border-4 border-[#FFCDD2] p-5 rounded-[32px] flex items-center gap-4.5 shadow-md"
        >
          <div className="text-4xl select-none">🔥</div>
          <div>
            <span className="rounded-full px-3 py-1 bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-sans font-black uppercase tracking-wider inline-block">
              Streak
            </span>
            <div className="text-3xl font-serif font-black text-[#2D2D2A] mt-1">{streak} Days</div>
          </div>
        </motion.div>

      </div>

      {/* 2. MODE SELECTORS - EXTRA CHUNKY TAB PILLS */}
      <div className="flex bg-[#F5F2EB] p-2 rounded-[36px] border-3 border-[#D9D7C8] max-w-lg mx-auto shadow-inner">
        <button
          id="customizer-tab-btn"
          onClick={() => { playSensoryChime('click'); setActiveTab('customizer'); }}
          className={`flex-1 text-sm py-4 rounded-[28px] font-sans font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'customizer'
              ? 'bg-[#5A5A40] text-white shadow-md scale-103'
              : 'text-[#4A4A40]/70 hover:text-[#2D2D2A]'
          }`}
        >
          <span className="text-lg">🧸</span>
          <span>Avatar Playhouse</span>
        </button>
        <button
          id="rewards-shop-tab-btn"
          onClick={() => { playSensoryChime('click'); setActiveTab('shop'); }}
          className={`flex-1 text-sm py-4 rounded-[28px] font-sans font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'shop'
              ? 'bg-[#5A5A40] text-white shadow-md scale-103'
              : 'text-[#4A4A40]/70 hover:text-[#2D2D2A]'
          }`}
        >
          <span className="text-lg">🛍️</span>
          <span>Unlock Rewards</span>
        </button>
      </div>

      {/* 3. CUSTOMIZER TAB: CHARACTER PLAYHOUSE SANBOX */}
      {activeTab === 'customizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Giant Character display card */}
          <div className="lg:col-span-5 bg-white border-4 border-[#EADAC2] p-8 rounded-[44px] flex flex-col items-center justify-between min-h-[460px] text-center relative overflow-hidden shadow-lg bg-[radial-gradient(#FAF8F5_1px,transparent_1px)] [background-size:16px_16px]">
            
            {/* Background sensory decor decoration */}
            <div className="absolute top-6 left-6 text-5xl select-none animate-bounce">
              {avatar.decor || '🪴'}
            </div>
            <div className="absolute top-6 right-6 text-5xl select-none">
              🪁
            </div>

            <div className="space-y-1.5 pt-4">
              <span className="rounded-full px-5 py-2.5 bg-sky-100 text-sky-800 border-2 border-sky-300 font-bold inline-flex items-center gap-2 text-xs uppercase tracking-wider">
                ✨ My Smart Avatar ✨
              </span>
              <p className="text-xs text-[#4A4A40]/60 font-sans font-medium">Tap your wardrobe closet to try new styles!</p>
            </div>

            {/* Giant Simulated Avatar character structure with animations */}
            <motion.div 
              animate={animateAvatar ? { scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, 5, -5, 3, 0] } : { y: [0, -10, 0] }}
              transition={animateAvatar ? { duration: 0.6 } : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative my-10 flex flex-col items-center"
            >
              {/* Hat slot */}
              {avatar.hat && (
                <motion.span 
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 text-7xl z-20 select-none drop-shadow-md"
                >
                  {avatar.hat}
                </motion.span>
              )}

              {/* Main Face circle */}
              <div 
                style={{ backgroundColor: currentFaceColor }}
                className="w-40 h-40 rounded-full border-6 border-[#7D5A2E]/20 flex items-center justify-center relative shadow-xl transition-colors duration-500"
              >
                {/* Smiley face expressions */}
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="text-7xl select-none animate-pulse">
                    {currentExpression}
                  </div>
                </div>

                {/* Left/Right sensory cheeks */}
                <div className="absolute left-6 top-1/2 w-4 h-2.5 rounded-full bg-rose-300/60 blur-[1px]" />
                <div className="absolute right-6 top-1/2 w-4 h-2.5 rounded-full bg-rose-300/60 blur-[1px]" />
              </div>

              {/* Outfit clothing slot */}
              {avatar.outfit ? (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-7xl select-none z-10 filter drop-shadow"
                >
                  {avatar.outfit}
                </motion.span>
              ) : (
                <div className="w-24 h-14 bg-[#5A5A40] rounded-t-[28px] border-4 border-[#3D3D2D] absolute -bottom-11 left-1/2 -translate-x-1/2 z-10 shadow" />
              )}
            </motion.div>

            {/* Customizer guidance note in round label */}
            <span className="rounded-full px-4 py-2 bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-sans font-bold uppercase tracking-wider inline-block">
              🌟 Hand-painted wooden toy style
            </span>
          </div>

          {/* Right customizable options panel */}
          <div className="lg:col-span-7 bg-white border-4 border-[#EADAC2] p-8 rounded-[44px] space-y-8 shadow-lg">
            
            {/* Category: Face Colors */}
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="rounded-full px-4 py-1.5 bg-[#FFFCEB] text-[#7D5A2E] border-2 border-[#ECCEC1] font-bold inline-flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Palette className="w-4 h-4 text-[#7D5A2E]" />
                  Avatar colors
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3.5">
                {FACE_COLORS.map((col) => {
                  const isSelected = currentFaceColor === col.value;
                  return (
                    <button
                      key={col.value}
                      onClick={() => handleSetFaceColor(col.value)}
                      style={{ backgroundColor: col.value }}
                      className={`h-14 rounded-full border-4 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-[#7D5A2E] scale-110 shadow-md ring-4 ring-[#7D5A2E]/10' 
                          : 'border-stone-200 hover:border-stone-400 hover:scale-105'
                      }`}
                      title={col.label}
                    />
                  );
                })}
              </div>
            </div>

            {/* Category: Expression Face Shapes */}
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="rounded-full px-4 py-1.5 bg-[#FFFCEB] text-[#7D5A2E] border-2 border-[#ECCEC1] font-bold inline-flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  🎭 Fun expressions
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {EXPRESSIONS.map((exp) => {
                  const isSelected = currentExpression === exp.value;
                  return (
                    <button
                      key={exp.value}
                      onClick={() => handleSetExpression(exp.value)}
                      className={`p-3.5 rounded-2xl border-3 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#FAF6EC] border-[#7D5A2E] text-[#7D5A2E] font-black scale-103 shadow-sm'
                          : 'bg-white border-stone-200 hover:border-stone-400 hover:bg-[#FAF9F5]'
                      }`}
                    >
                      <span className="text-3xl select-none">{exp.value}</span>
                      <span className="text-[10px] uppercase font-sans font-black tracking-wide">{exp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category: Wardrobe unlocked assets */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center">
                <span className="rounded-full px-4 py-1.5 bg-[#FFFCEB] text-[#7D5A2E] border-2 border-[#ECCEC1] font-bold inline-flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  👑 My wardrobe closet
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                
                {/* Remove options */}
                <button
                  id="equip-base-hat"
                  onClick={() => { playSensoryChime('click'); setAvatar({ ...avatar, hat: '' }); }}
                  className="p-4 border-3 border-dashed border-stone-200 rounded-2xl flex items-center justify-center gap-2 font-sans font-black uppercase tracking-wider text-[11px] text-[#4A4A40]/70 bg-stone-50 hover:bg-stone-100 hover:border-stone-300 cursor-pointer"
                >
                  <span>❌</span>
                  <span>No Hat</span>
                </button>

                <button
                  id="equip-base-outfit"
                  onClick={() => { playSensoryChime('click'); setAvatar({ ...avatar, outfit: '' }); }}
                  className="p-4 border-3 border-dashed border-stone-200 rounded-2xl flex items-center justify-center gap-2 font-sans font-black uppercase tracking-wider text-[11px] text-[#4A4A40]/70 bg-stone-50 hover:bg-stone-100 hover:border-stone-300 cursor-pointer"
                >
                  <span>❌</span>
                  <span>No Outfit</span>
                </button>

                {REWARD_SHOP_ITEMS.map((item) => {
                  const isUnlocked = unlockedRewardIds.includes(item.id);
                  if (!isUnlocked) return null;

                  const isEquipped = 
                    (item.category === 'hats' && avatar.hat === item.emoji) ||
                    (item.category === 'outfits' && avatar.outfit === item.emoji) ||
                    (item.category === 'decorations' && avatar.decor === item.emoji);

                  return (
                    <button
                      key={item.id}
                      id={`equip-reward-${item.id}`}
                      onClick={() => handleEquip(item)}
                      className={`p-4 border-3 rounded-2xl flex items-center gap-2 font-sans font-black text-xs cursor-pointer transition-all ${
                        isEquipped
                          ? 'bg-[#FAF6EC] border-[#7D5A2E] text-[#7D5A2E] shadow-md scale-102'
                          : 'bg-white border-stone-200 hover:border-stone-400 hover:bg-[#FAF9F5]'
                      }`}
                    >
                      <span className="text-2xl select-none">{item.emoji}</span>
                      <span className="truncate">{item.name}</span>
                      {isEquipped && <Check className="w-4 h-4 text-[#7D5A2E] ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 4. SHOP TAB: REWARDS MARKETPLACE */}
      {activeTab === 'shop' && (
        <div className="bg-white border-4 border-[#EADAC2] rounded-[44px] p-6 md:p-8 space-y-6 shadow-md">
          
          <div className="pb-4 border-b border-[#EAE8D9] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#2D2D2A] flex items-center gap-1.5">
                🛒 Rewards Marketplace
              </h3>
              <p className="text-xs text-[#4A4A40]/70 mt-1 font-sans font-medium">
                Spend your wooden coins 🪙 to unlock custom clothing, themes, and cute toys!
              </p>
            </div>
            
            <span className="rounded-full px-4 py-1.5 bg-[#FFFDEB] text-amber-800 border-2 border-[#FFF59D] font-bold inline-flex items-center gap-1.5 text-xs uppercase tracking-wider self-start md:self-auto">
              💰 Current wallet: {coins} coins
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REWARD_SHOP_ITEMS.map((item) => {
              const isUnlocked = unlockedRewardIds.includes(item.id);
              const canAfford = coins >= item.cost;

              // Color coordinate based on category for gorgeous sensory organization
              const categoryTheme = 
                item.category === 'hats' 
                  ? { bg: 'bg-[#FFF8E1]', border: 'border-[#FFD54F]', logoBg: 'bg-[#FFE082]', text: 'text-[#7F6000]' }
                  : item.category === 'outfits'
                  ? { bg: 'bg-[#E3F2FD]', border: 'border-[#64B5F6]', logoBg: 'bg-[#90CAF9]', text: 'text-[#0D47A1]' }
                  : item.category === 'decorations'
                  ? { bg: 'bg-[#E8F5E9]', border: 'border-[#81C784]', logoBg: 'bg-[#A5D6A7]', text: 'text-[#1B5E20]' }
                  : { bg: 'bg-[#F3E5F5]', border: 'border-[#BA68C8]', logoBg: 'bg-[#CE93D8]', text: 'text-[#4A148C]' };

              return (
                <div
                  key={item.id}
                  className={`p-6 rounded-[36px] border-4 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all shadow-md hover:shadow-lg ${
                    isUnlocked
                      ? 'bg-[#E8F5E9]/90 border-[#4CAF50] text-[#1B5E20] ring-4 ring-[#4CAF50]/10'
                      : `${categoryTheme.bg} ${categoryTheme.border} ${categoryTheme.text}`
                  }`}
                >
                  {/* Left part: Giant Rounded Logo and Description */}
                  <div className="flex flex-col sm:flex-row items-center gap-4.5 text-center sm:text-left w-full sm:w-auto">
                    {/* Giant Circular "Logo Badge" */}
                    <span className={`text-5xl select-none p-4 rounded-full border-4 border-white/50 shrink-0 shadow-inner flex items-center justify-center w-20 h-20 animate-wiggle ${categoryTheme.logoBg}`}>
                      {item.emoji}
                    </span>
                    
                    <div className="space-y-1.5 flex-1">
                      {/* Horizontal Rounded Name Label */}
                      <span className="inline-block px-4 py-1.5 rounded-full bg-white/90 border-2 border-black/5 text-[#2D2D2A] text-sm font-black tracking-tight shadow-sm">
                        {item.name}
                      </span>
                      <p className="text-xs text-[#2D2D2A]/80 font-sans font-medium leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Right part: Action Button / Owned stamp */}
                  <div className="shrink-0 w-full sm:w-auto flex justify-center sm:justify-end">
                    {isUnlocked ? (
                      <span className="rounded-full px-5 py-3 bg-[#4CAF50] text-white border-2 border-white/40 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md">
                        <Check className="w-4 h-4 text-white" /> Owned!
                      </span>
                    ) : (
                      <button
                        id={`purchase-btn-${item.id}`}
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className={`text-sm font-black px-6 py-4 rounded-full border-3 flex items-center gap-2 shadow-md transition-all w-full sm:w-auto justify-center ${
                          canAfford
                            ? 'bg-white border-[#7D5A2E] text-[#7D5A2E] hover:bg-[#FAF9F3] hover:scale-106 active:scale-95 cursor-pointer'
                            : 'bg-black/5 text-black/30 border-black/10 cursor-not-allowed shadow-none'
                        }`}
                      >
                        <Lock className="w-4 h-4" />
                        <span>{item.cost} 🪙</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
