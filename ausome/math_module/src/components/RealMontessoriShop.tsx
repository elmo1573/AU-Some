/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExternalLink, ShoppingCart, Home, Mail, Award, ArrowRight } from 'lucide-react';

export const RealMontessoriShop: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto p-4 select-none pb-16">
      
      {/* Header section with cute title */}
      <div className="text-center">
        <span className="text-emerald-700 bg-emerald-50 font-display font-black text-xs sm:text-sm tracking-wide uppercase px-4 py-1.5 rounded-full border border-emerald-200/60 inline-flex items-center gap-1.5 shadow-xs">
          🛍️ Physical Materials Shop
        </span>
        <h2 className="text-stone-900 font-display font-black text-3xl sm:text-5xl mt-3 tracking-tight">
          Bring Montessori Learning Home! 🐻🪵
        </h2>
        <p className="text-stone-600 font-medium text-sm sm:text-base mt-2 max-w-xl mx-auto">
          Love playing with Mimi Bear's virtual rods and beads? Now you can buy the high-quality, physical wooden toys shipped directly to your doorstep!
        </p>
      </div>

      {/* Main product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* BOX 1: NUMBER RODS */}
        <div className="bg-white rounded-3xl border-3 border-stone-200/60 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
          <div>
            {/* Image container */}
            <div className="relative aspect-square overflow-hidden bg-stone-100 border-b border-stone-100">
              <img 
                src="/src/assets/images/number_rods_catalog_1783424111414.jpg" 
                alt="Montessori Number Rods" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-red-600 text-white font-display font-black text-xs uppercase px-3 py-1.5 rounded-full shadow-md tracking-wider">
                🪵 Real Wood Toy
              </span>
            </div>
            
            {/* Content info */}
            <div className="p-6 sm:p-8">
              <h3 className="text-red-950 font-display font-black text-3xl sm:text-4xl tracking-tight uppercase">
                Number Rods
              </h3>
              <p className="text-stone-500 text-xs font-bold mt-1 tracking-wider uppercase flex items-center gap-1">
                📐 Length & Counting Exploration
              </p>
              <p className="text-stone-600 font-medium mt-3 text-sm sm:text-base leading-relaxed">
                The classic Montessori alternating red and blue wooden rods. They are excellent for helping children understand lengths, quantities, sequence, and simple additions in a highly tactile physical form.
              </p>
              
              <div className="mt-4 p-3 bg-red-50/50 rounded-2xl border border-red-100/50">
                <span className="text-red-900 font-display font-black text-xs sm:text-sm block">
                  ✨ Slogan: Chance to buy all games for real now!
                </span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="p-6 sm:p-8 pt-0">
            <a 
              href="https://ksmontessori.com.pk/product/number-rods/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-display font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 btn-tactile cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" /> Buy Number Rods <ExternalLink className="w-4 h-4 opacity-80" />
            </a>
          </div>
        </div>

        {/* BOX 2: NUMBER CARDS */}
        <div className="bg-white rounded-3xl border-3 border-stone-200/60 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
          <div>
            {/* Image container */}
            <div className="relative aspect-square overflow-hidden bg-stone-100 border-b border-stone-100">
              <img 
                src="/src/assets/images/number_cards_catalog_1783424133363.jpg" 
                alt="Montessori Wooden Number Cards" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-emerald-600 text-white font-display font-black text-xs uppercase px-3 py-1.5 rounded-full shadow-md tracking-wider">
                🪵 Premium Craft
              </span>
            </div>
            
            {/* Content info */}
            <div className="p-6 sm:p-8">
              <h3 className="text-emerald-950 font-display font-black text-3xl sm:text-4xl tracking-tight uppercase">
                Number Cards
              </h3>
              <p className="text-stone-500 text-xs font-bold mt-1 tracking-wider uppercase flex items-center gap-1">
                🔢 Mathematical Symbol Association
              </p>
              <p className="text-stone-600 font-medium mt-3 text-sm sm:text-base leading-relaxed">
                Textured, beautifully polished wooden number cards displaying bold red numbers in an elegant storage box. Excellent for associate quantities with their correct numeral symbols!
              </p>

              <div className="mt-4 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                <span className="text-emerald-900 font-display font-black text-xs sm:text-sm block">
                  🌿 Authentic Montessori Sandpaper & Wooden design elements!
                </span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="p-6 sm:p-8 pt-0">
            <a 
              href="https://ksmontessori.com.pk/product/number-cards/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-display font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 btn-tactile cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" /> Buy Number Cards <ExternalLink className="w-4 h-4 opacity-80" />
            </a>
          </div>
        </div>

      </div>

      {/* BOX 3: BUY ALL & DOORSTEP DELIVERY + SOCIALS & CONTACT */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-3 border-amber-200 rounded-4xl p-6 sm:p-10 shadow-lg flex flex-col lg:flex-row items-center gap-8">
        
        {/* KS Montessori Logo / Mascot */}
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-white border-4 border-amber-300 shadow-md flex-shrink-0 overflow-hidden relative">
          <img 
            src="/src/assets/images/ks_montessori_logo_1783424154944.jpg" 
            alt="KS Montessori Logo" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content detail */}
        <div className="flex-grow flex flex-col gap-4 text-center lg:text-left">
          <div>
            <h3 className="text-amber-950 font-display font-black text-2xl sm:text-3xl tracking-tight">
              Want all Montessori products physically by your doorstep? 🚚🏠
            </h3>
            <p className="text-amber-900 font-medium text-sm sm:text-base mt-2 max-w-2xl">
              KS Montessori provides a complete collection of world-class, premium physical materials for children and classrooms. Visit our website to explore all options!
            </p>
          </div>

          {/* Social accounts buttons */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <a 
              href="https://ksmontessori.com.pk/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-amber-600 hover:bg-amber-700 text-white font-display font-black text-sm px-6 py-3 rounded-2xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all btn-tactile cursor-pointer"
            >
              <Home className="w-4 h-4" /> Visit ksmontessori.com.pk
            </a>

            <a 
              href="https://www.facebook.com/kiransaifami" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#1877F2] hover:bg-[#166fe5] text-white font-display font-black text-sm px-5 py-3 rounded-2xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all btn-tactile cursor-pointer"
            >
              <span className="text-base font-bold">f</span> Facebook Page
            </a>

            <a 
              href="https://www.instagram.com/kiransaif.ami/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-95 text-white font-display font-black text-sm px-5 py-3 rounded-2xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all btn-tactile cursor-pointer"
            >
              <span>📷</span> Instagram Profile
            </a>
          </div>

          <div className="bg-white/80 rounded-2xl p-4 border border-amber-200 shadow-inner flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center lg:justify-start items-center text-xs sm:text-sm mt-2">
            <div className="flex items-center gap-2 text-stone-700">
              <span className="p-2 bg-amber-100 rounded-lg text-amber-800">
                <Mail className="w-4 h-4" />
              </span>
              <div>
                <span className="block text-stone-400 font-bold uppercase text-[9px] tracking-wider">Email Us</span>
                <span className="font-sans font-bold text-stone-900">kiransaifami@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
