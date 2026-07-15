import React from 'react';
import { MONTESSORI_PRODUCTS } from '../languages/data';
import { playSensoryChime } from '../utils/speech';
import { Heart, Globe, ArrowUpRight, Instagram, Facebook, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function MontessoriShop() {
  const triggerExternalLinkClick = () => {
    playSensoryChime('success');
  };

  return (
    <div 
      id="montessori-shop-page" 
      className="max-w-4xl mx-auto bg-[#FFFDF9] border-6 border-[#EADAC2] rounded-[48px] p-8 md:p-12 space-y-10 shadow-xl"
    >
      
      {/* 1. INTRO HEADER - EXTRA BIG, COLORFUL, AND HIGHLY VISUAL */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="flex justify-center">
          <span className="rounded-full px-6 py-2 bg-amber-100 text-amber-900 border-3 border-amber-300 text-xs font-black uppercase tracking-widest inline-flex items-center gap-2 shadow-sm">
            ✨ Tactile Physical Learning ✨
          </span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-sans font-black text-[#2D2D2A] tracking-tight leading-tight">
          Want to Learn with Real Montessori Materials?
        </h2>
        
        <p className="text-base md:text-lg text-[#4A4A40]/90 leading-relaxed font-sans font-medium">
          Hands-on learning helps many children build confidence, strengthen fine motor skills, and connect spoken words with real-world experiences!
        </p>
      </div>

      {/* 2. MONTESSORI SHELVING DESIGN (Simulated with colorful wooden elements) */}
      <div className="space-y-12">
        
        {/* Shelf Heading with Round Horizontal Label */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <span className="rounded-full px-5 py-2.5 bg-sky-100 text-sky-800 border-3 border-sky-300 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-sm">
              <BookOpen className="w-4 h-4 text-sky-700" />
              Tactile Language Materials Shelf
            </span>
            <span className="text-sm font-sans font-black text-[#5A5A40]/80">Level 1 Shelf</span>
          </div>

          {/* Wooden Shelf Items Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {MONTESSORI_PRODUCTS.map((prod) => {
              const isMovable = prod.id === 'm_movable';
              return (
                <motion.div
                  key={prod.id}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="bg-white border-4 border-[#EADAC2] rounded-[40px] p-8 flex flex-col justify-between space-y-6 shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                >
                  {/* Decorative background visual shape */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FAF6EC] rounded-full -z-0 opacity-40 pointer-events-none" />

                  {/* Product content */}
                  <div className="space-y-5 relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      {/* GIANT DEDICATED VISUAL LOGO representing the physical Montessori Material */}
                      {isMovable ? (
                        <div className="w-24 h-24 bg-[#FFF8E1] border-4 border-[#FFD54F] rounded-3xl p-2 shrink-0 flex items-center justify-center shadow-inner relative" title="Movable Alphabet Logo">
                          {/* Stylized representation of compartmentalized alphabet tray */}
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <rect x="5" y="5" width="90" height="90" rx="10" fill="#EADAC2" stroke="#7D5A2E" strokeWidth="4" />
                            {/* Inner divider grid */}
                            <line x1="50" y1="5" x2="50" y2="95" stroke="#7D5A2E" strokeWidth="2" strokeDasharray="2,2" />
                            <line x1="5" y1="50" x2="95" y2="50" stroke="#7D5A2E" strokeWidth="2" strokeDasharray="2,2" />
                            {/* Colorful vowel (blue) and consonant (red) blocks */}
                            <text x="25" y="42" fontSize="38" fontWeight="bold" fill="#D32F2F" textAnchor="middle" dominantBaseline="middle" fontFamily="Fredoka">a</text>
                            <text x="75" y="42" fontSize="38" fontWeight="bold" fill="#1976D2" textAnchor="middle" dominantBaseline="middle" fontFamily="Fredoka">b</text>
                            <text x="25" y="82" fontSize="38" fontWeight="bold" fill="#1976D2" textAnchor="middle" dominantBaseline="middle" fontFamily="Fredoka">c</text>
                            <text x="75" y="82" fontSize="38" fontWeight="bold" fill="#D32F2F" textAnchor="middle" dominantBaseline="middle" fontFamily="Fredoka">d</text>
                          </svg>
                          <span className="absolute -bottom-2 -right-2 text-2xl">🪵</span>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-[#E3F2FD] border-4 border-[#90CAF9] rounded-3xl p-2 shrink-0 flex items-center justify-center shadow-inner relative" title="Sandpaper Letters Logo">
                          {/* Stylized sandpaper board with a tracking path and a pointing hand */}
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <rect x="5" y="5" width="90" height="90" rx="10" fill="#FFF8E1" stroke="#EADAC2" strokeWidth="4" />
                            {/* Tactile board inside */}
                            <rect x="18" y="18" width="64" height="64" rx="8" fill="#FFCDD2" stroke="#EF9A9A" strokeWidth="3" />
                            {/* Sandpaper textured path letter 'f' or 't' or cursive style */}
                            <path d="M 50,25 C 40,25 35,45 50,45 C 65,45 60,75 50,75" fill="none" stroke="#E57373" strokeWidth="12" strokeLinecap="round" strokeDasharray="1,5" />
                            {/* Small finger trace star indicator */}
                            <circle cx="50" cy="45" r="5" fill="#FBC02D" />
                            {/* Tracing arrow helper */}
                            <path d="M30,35 L38,45 L40,30" fill="none" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                          <span className="absolute -bottom-2 -right-2 text-2xl">🖐️</span>
                        </div>
                      )}

                      {/* Rounded horizontal highlight badge label */}
                      <span className="rounded-full px-4 py-2 bg-[#FAF6EC] text-[#7D5A2E] border-2 border-[#EADAC2] text-[10px] font-sans font-black uppercase tracking-wider text-right shadow-sm shrink-0">
                        {prod.highlightText}
                      </span>
                    </div>

                    <h3 className="text-xl font-sans font-black text-[#2D2D2A] tracking-tight leading-snug">
                      {prod.title}
                    </h3>
                    
                    <p className="text-sm text-[#4A4A40]/90 leading-relaxed font-sans font-medium">
                      {prod.description}
                    </p>
                  </div>

                  {/* Super big fun clickable buttons */}
                  <a
                    href={prod.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={triggerExternalLinkClick}
                    className="w-full flex items-center justify-center gap-2 bg-[#FAF6EC] border-3 border-[#7D5A2E] hover:bg-[#FAF9F3] text-[#7D5A2E] font-sans font-black uppercase tracking-wider text-xs py-4 rounded-full cursor-pointer transition-all shadow-md hover:scale-103 active:scale-97"
                  >
                    <span>Learn on Montessori Store</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </motion.div>
              );
            })}
          </div>

          {/* Styled Beautiful Wooden shelf bottom plank */}
          <div className="h-6 bg-[#A78B6D] border-t-4 border-[#8D6E4F] rounded-b-[24px] w-full shadow-lg flex items-center px-6 justify-between">
            <span className="w-6 h-1.5 rounded-full bg-[#5D4037]" />
            <span className="w-16 h-1.5 rounded-full bg-[#5D4037] opacity-60" />
            <span className="w-6 h-1.5 rounded-full bg-[#5D4037]" />
          </div>
        </div>

      </div>

      {/* 3. PRIMARY STORE CONNECTION - EXTREMELY VISUAL AND MASSIVE TARGETS */}
      <div className="p-8 rounded-[44px] bg-[#FAF6EC] border-4 border-[#EADAC2] flex flex-col md:flex-row justify-between items-center gap-8 shadow-md">
        <div className="space-y-2 text-center md:text-left">
          {/* Logo element next to header */}
          <h4 className="text-2xl font-sans font-black text-[#2D2D2A] flex items-center justify-center md:justify-start gap-2.5">
            <span className="text-3xl">🌎</span>
            Explore the KS Montessori Store
          </h4>
          <p className="text-sm md:text-base text-[#4A4A40]/90 font-sans font-medium">
            Find hundreds of authentic premium AMI-aligned tactile language resources, sandpapers, wood alphabets, and more!
          </p>
        </div>

        <a
          href="https://ksmontessori.com.pk/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={triggerExternalLinkClick}
          className="bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-sans font-black uppercase tracking-wider text-xs px-8 py-5 rounded-full cursor-pointer transition-all shadow-md hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2 border-3 border-[#3D3D2D]"
        >
          <span>Visit Montessori Store</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      {/* 4. SOCIAL CHANNELS SECTION - BEAUTIFUL BADGE PILLS */}
      <div className="pt-8 border-t-4 border-[#EAE8D9] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-sm font-sans font-black uppercase tracking-wider text-[#4A4A40] block">
            Follow KS Montessori & AMI Updates
          </span>
          <span className="text-xs text-[#4A4A40]/70 font-sans font-medium block mt-1">
            Stay up to date with sensory tactile teaching techniques, guidelines, and home layouts.
          </span>
        </div>

        {/* Horizontal rounded badges */}
        <div className="flex flex-wrap gap-4">
          <a
            href="https://www.instagram.com/kiransaif.ami/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={triggerExternalLinkClick}
            className="flex items-center gap-2 text-xs font-sans font-black uppercase tracking-wider px-6 py-3.5 rounded-full border-3 border-[#D9D7C8] text-[#4A4A40] bg-white hover:bg-[#FAF9F3] transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
          >
            <Instagram className="w-4 h-4 text-rose-600" />
            <span>Instagram</span>
          </a>

          <a
            href="https://www.facebook.com/kiransaifami"
            target="_blank"
            rel="noopener noreferrer"
            onClick={triggerExternalLinkClick}
            className="flex items-center gap-2 text-xs font-sans font-black uppercase tracking-wider px-6 py-3.5 rounded-full border-3 border-[#D9D7C8] text-[#4A4A40] bg-white hover:bg-[#FAF9F3] transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
          >
            <Facebook className="w-4 h-4 text-blue-600" />
            <span>Facebook</span>
          </a>
        </div>
      </div>

    </div>
  );
}
