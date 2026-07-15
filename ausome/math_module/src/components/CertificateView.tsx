/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Printer, X, ShieldAlert, Sparkles, Heart } from 'lucide-react';
import { Certificate } from '../types';
import { audio } from '../audio';

interface CertificateProps {
  certificate: Certificate;
  onClose: () => void;
  onUpdateChildName: (name: string) => void;
}

export const CertificateView: React.FC<CertificateProps> = ({
  certificate,
  onClose,
  onUpdateChildName,
}) => {
  const [editingName, setEditingName] = useState<string>(certificate.childName || '');

  const handlePrint = () => {
    audio.playSoftTap();
    window.print();
  };

  const handleSaveName = () => {
    audio.playSoftBell();
    onUpdateChildName(editingName);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in select-none no-print">
      <div className="bg-white rounded-3xl w-full max-w-2xl border-4 border-amber-200 shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Certificate Configuration Panel */}
        <div className="bg-amber-50 p-5 border-b border-amber-200/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-base font-display font-black text-amber-950 flex items-center gap-1.5">
              🎓 Level Completed Certificate!
            </h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Enter your name below to personalize your beautiful printable award!
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <input
              id="certificate-child-name-input"
              type="text"
              placeholder="Your Name Here"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="bg-white px-3 py-1.5 rounded-xl border border-stone-200 text-stone-800 text-sm font-display font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300 flex-grow max-w-[180px]"
            />
            <button
              id="certificate-save-name-btn"
              onClick={handleSaveName}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-display font-bold cursor-pointer transition-all"
            >
              Update Name
            </button>
          </div>
        </div>

        {/* Certificate Blueprint (Pre-styled for Letter/A4 layout & Print-friendly CSS rules) */}
        <div className="p-6 sm:p-10 bg-stone-50/50 flex items-center justify-center border-b border-stone-100">
          <div
            id="printable-certificate"
            className="w-full aspect-[1.414/1] bg-[#fefdf9] border-[12px] border-amber-900/20 p-6 sm:p-10 rounded-2xl shadow-lg relative flex flex-col justify-between items-center text-center overflow-hidden"
          >
            {/* Elegant corner flourishes */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-amber-500/40 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-amber-500/40 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-amber-500/40 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-amber-500/40 rounded-br-lg" />

            {/* Glowing background circles for visual interest on screen */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-200/10 rounded-full filter blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-100/10 rounded-full filter blur-3xl" />

            {/* Logo / Header */}
            <div className="flex flex-col items-center select-none">
              <span className="text-2xl sm:text-3xl tracking-wider font-display font-black text-amber-950 uppercase">
                🌞 AU-SOME
              </span>
              <span className="text-[9px] uppercase tracking-widest font-sans font-bold text-amber-700/60 mt-1">
                Autism-Friendly Montessori Maths Platform
              </span>
            </div>

            {/* Title */}
            <div className="my-2 select-none">
              <h1 className="text-xl sm:text-3.5xl font-display font-black text-amber-900 tracking-wide uppercase">
                Certificate of Achievement
              </h1>
              <div className="h-0.5 w-24 bg-amber-500/30 mx-auto mt-2" />
            </div>

            {/* Body copy */}
            <div className="flex flex-col gap-2 my-2">
              <span className="text-xs sm:text-sm font-serif italic text-stone-500">
                This certificate is proudly awarded to:
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-black text-emerald-800 tracking-wide border-b-2 border-dashed border-stone-200 px-8 py-1 max-w-md mx-auto truncate min-w-[200px]">
                {editingName || certificate.childName || 'Little Explorer'}
              </h2>
              <p className="text-[11px] sm:text-sm font-display text-stone-600 max-w-md mx-auto leading-relaxed mt-2">
                For successfully exploring, learning, and completing{' '}
                <strong className="text-amber-950">{certificate.levelsRange}</strong> in the
                study category <strong className="text-emerald-950">Basic Number Knowledge</strong>!
              </p>
            </div>

            {/* Badges / Awards Ornaments */}
            <div className="flex items-center justify-center gap-10 my-4 select-none">
              {/* Date */}
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-sans font-semibold text-stone-400 uppercase">Date</span>
                <span className="text-xs font-display font-bold text-stone-700">{certificate.date}</span>
              </div>

              {/* Central Seal Badge */}
              <div className="relative flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full border-4 border-amber-400/60 shadow-md">
                <Award className="w-10 h-10 text-amber-600" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 animate-spin-slow" />
              </div>

              {/* Award Title */}
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-sans font-semibold text-stone-400 uppercase">Award</span>
                <span className="text-xs font-display font-bold text-amber-800 uppercase tracking-wide flex items-center justify-end gap-1">
                  ⭐ {certificate.title}
                </span>
              </div>
            </div>

            {/* Stamp footer */}
            <div className="text-[9px] text-stone-400 font-sans mt-2 italic flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-400 fill-red-400" /> "The child is both a hope and a promise for mankind." — Maria Montessori
            </div>

          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-stone-50 p-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            id="close-certificate-view"
            onClick={() => {
              audio.playSoftTap();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-3 text-sm font-display font-bold text-stone-600 hover:bg-stone-200/60 rounded-2xl cursor-pointer text-center"
          >
            Close Window
          </button>

          <button
            id="print-certificate-btn"
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-sm font-display font-black flex items-center justify-center gap-2 shadow-xs hover:shadow-md cursor-pointer transition-all btn-tactile"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>

      </div>
    </div>
  );
};
