import React, { useState, useEffect } from "react";
import { 
  Play, Volume2, RotateCcw, HelpCircle, 
  Sparkles, Check, ChevronRight, HelpCircle as HelpIcon 
} from "lucide-react";
import * as audio from "../utils/audio";

// Helper to provide nice pastel colors
export const PASTEL_COLORS = {
  sage: "#E2ECE9", // Sage background
  cream: "#FDFBF7", // Cream background
  blue: "#E3EEF4", // Light Blue background
  yellow: "#FCF6DF", // Soft Yellow accent
  greenText: "#4A6B5D",
  blueText: "#4F7085",
  yellowText: "#87733B",
  darkGray: "#2D3748",
  pastelSageGreen: "#B4CFC3",
  pastelCream: "#FFFDF6",
  pastelBlue: "#C5DCED",
  pastelYellow: "#FFEFA6",
  pastelCoral: "#F7D6C8",
  pastelLavender: "#E0D7EC",
  pastelPink: "#F5D6E1"
};

// Render gorgeous custom flat SVG illustrations so we run fully offline
export function renderIllustration(type: string, size = 64, className = "", isShadow = false) {
  const colorAttr = isShadow ? "fill-gray-400 stroke-gray-500 opacity-80" : "";
  const strokeColor = isShadow ? "#718096" : "#4A5568";
  
  switch (type.toLowerCase()) {
    case "circle":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="40" fill={isShadow ? "#A0AEC0" : "#A3BFD9"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
        </svg>
      );
    case "square":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <rect x="15" y="15" width="70" height="70" rx="12" fill={isShadow ? "#A0AEC0" : "#D4E1C6"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
        </svg>
      );
    case "triangle":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <polygon points="50,15 85,80 15,80" fill={isShadow ? "#A0AEC0" : "#F6E4C4"} stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" className={colorAttr} />
        </svg>
      );
    case "star":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill={isShadow ? "#A0AEC0" : "#FDE893"} stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" className={colorAttr} />
        </svg>
      );
    case "heart":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <path d="M50,85 C50,85 10,50 10,30 C10,15 22,10 33,10 C42,10 48,18 50,22 C52,18 58,10 67,10 C78,10 90,15 90,30 C90,50 50,85 50,85 Z" fill={isShadow ? "#A0AEC0" : "#F0C7CE"} stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" className={colorAttr} />
        </svg>
      );
    case "pentagon":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <polygon points="50,10 90,40 75,85 25,85 10,40" fill={isShadow ? "#A0AEC0" : "#E4DCF1"} stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" className={colorAttr} />
        </svg>
      );
    case "apple":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <path d="M50,25 C45,15 30,15 25,25 C20,35 23,65 35,75 C45,82 50,78 55,75 C60,78 65,82 75,75 C87,65 90,35 85,25 C80,15 65,15 60,25 Z" fill={isShadow ? "#A0AEC0" : "#E8A39F"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          <path d="M50,25 C52,15 58,10 62,12" stroke={isShadow ? strokeColor : "#718096"} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M53,16 C57,14 62,15 65,18 C65,18 61,22 55,20 Z" fill={isShadow ? "#A0AEC0" : "#81C784"} stroke={isShadow ? strokeColor : "#388E3C"} strokeWidth="1" />
        </svg>
      );
    case "banana":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <path d="M20,15 C45,15 80,35 85,75 C75,80 60,75 50,60 C40,45 25,25 20,15 Z" fill={isShadow ? "#A0AEC0" : "#FCE07C"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          <path d="M18,13 L24,18" stroke={isShadow ? strokeColor : "#795548"} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "strawberry":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <path d="M50,85 C25,85 15,60 15,40 C15,25 30,20 50,25 C70,20 85,25 85,40 C85,60 75,85 50,85 Z" fill={isShadow ? "#A0AEC0" : "#F18F95"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          {/* Seeds */}
          {!isShadow && (
            <>
              <circle cx="35" cy="40" r="2" fill="#EAE060" />
              <circle cx="65" cy="40" r="2" fill="#EAE060" />
              <circle cx="50" cy="50" r="2" fill="#EAE060" />
              <circle cx="30" cy="60" r="2" fill="#EAE060" />
              <circle cx="70" cy="60" r="2" fill="#EAE060" />
              <circle cx="50" cy="70" r="2" fill="#EAE060" />
            </>
          )}
          {/* Leaves */}
          <path d="M50,23 C48,15 40,12 40,12 C45,18 48,22 50,23 C52,22 55,18 60,12 C60,12 52,15 50,23 Z" fill={isShadow ? "#A0AEC0" : "#81C784"} stroke={strokeColor} strokeWidth="2" />
        </svg>
      );
    case "cookie":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="40" fill={isShadow ? "#A0AEC0" : "#D4B483"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          {!isShadow && (
            <>
              <circle cx="35" cy="35" r="5" fill="#5D4037" />
              <circle cx="65" cy="40" r="4" fill="#5D4037" />
              <circle cx="45" cy="65" r="5" fill="#5D4037" />
              <circle cx="60" cy="60" r="5" fill="#5D4037" />
              <circle cx="32" cy="55" r="4" fill="#5D4037" />
            </>
          )}
        </svg>
      );
    case "carrot":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <polygon points="40,25 60,25 50,85" fill={isShadow ? "#A0AEC0" : "#FFA066"} stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" className={colorAttr} />
          <path d="M50,25 C50,15 45,10 40,10 C45,15 48,22 50,25" fill="none" stroke={isShadow ? strokeColor : "#81C784"} strokeWidth="3" strokeLinecap="round" />
          <path d="M50,25 C52,15 58,10 60,10 C55,15 52,22 50,25" fill="none" stroke={isShadow ? strokeColor : "#81C784"} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "dog":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="35" fill={isShadow ? "#A0AEC0" : "#E8D8C8"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          {/* Ears */}
          <path d="M20,30 C10,40 12,65 22,60 C26,55 24,35 20,30 Z" fill={isShadow ? "#A0AEC0" : "#9C7C5D"} stroke={strokeColor} strokeWidth="2.5" />
          <path d="M80,30 C90,40 88,65 78,60 C74,55 76,35 80,30 Z" fill={isShadow ? "#A0AEC0" : "#9C7C5D"} stroke={strokeColor} strokeWidth="2.5" />
          {/* Eyes */}
          {!isShadow && (
            <>
              <circle cx="40" cy="45" r="4.5" fill="#2D3748" />
              <circle cx="60" cy="45" r="4.5" fill="#2D3748" />
              {/* Nose */}
              <ellipse cx="50" cy="56" rx="6" ry="4" fill="#2D3748" />
              {/* Mouth */}
              <path d="M46,62 Q50,66 54,62" fill="none" stroke="#2D3748" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
        </svg>
      );
    case "cat":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="52" r="34" fill={isShadow ? "#A0AEC0" : "#D2D7DF"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          {/* Ears */}
          <polygon points="20,35 20,12 40,28" fill={isShadow ? "#A0AEC0" : "#A6B1C0"} stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="80,35 80,12 60,28" fill={isShadow ? "#A0AEC0" : "#A6B1C0"} stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
          {!isShadow && (
            <>
              {/* Eyes */}
              <circle cx="40" cy="48" r="4" fill="#2D3748" />
              <circle cx="60" cy="48" r="4" fill="#2D3748" />
              {/* Nose */}
              <polygon points="47,56 53,56 50,59" fill="#E8A39F" />
              {/* Whiskers */}
              <line x1="26" y1="56" x2="14" y2="54" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" />
              <line x1="26" y1="60" x2="14" y2="62" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" />
              <line x1="74" y1="56" x2="86" y2="54" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" />
              <line x1="74" y1="60" x2="86" y2="62" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
        </svg>
      );
    case "rabbit":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="56" r="32" fill={isShadow ? "#A0AEC0" : "#F5E6E8"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          {/* Long Ears */}
          <ellipse cx="38" cy="24" rx="9" ry="22" fill={isShadow ? "#A0AEC0" : "#F5E6E8"} stroke={strokeColor} strokeWidth="2.5" transform="rotate(-5, 38, 24)" />
          <ellipse cx="62" cy="24" rx="9" ry="22" fill={isShadow ? "#A0AEC0" : "#F5E6E8"} stroke={strokeColor} strokeWidth="2.5" transform="rotate(5, 62, 24)" />
          {!isShadow && (
            <>
              {/* Inner ears */}
              <ellipse cx="38" cy="24" rx="5" ry="17" fill="#F1C2C6" />
              <ellipse cx="62" cy="24" rx="5" ry="17" fill="#F1C2C6" />
              {/* Eyes */}
              <circle cx="41" cy="52" r="3.5" fill="#2D3748" />
              <circle cx="59" cy="52" r="3.5" fill="#2D3748" />
              {/* Nose */}
              <circle cx="50" cy="59" r="3" fill="#E8A39F" />
              {/* Cheeks */}
              <circle cx="34" cy="58" r="4" fill="#F1C2C6" opacity="0.6" />
              <circle cx="66" cy="58" r="4" fill="#F1C2C6" opacity="0.6" />
            </>
          )}
        </svg>
      );
    case "bird":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Body */}
          <path d="M25,50 C25,30 45,25 65,35 C80,45 80,65 65,70 C45,75 25,70 25,50 Z" fill={isShadow ? "#A0AEC0" : "#FFE082"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          {/* Wing */}
          <path d="M40,52 C40,42 55,42 60,52 C55,62 40,62 40,52 Z" fill={isShadow ? "#A0AEC0" : "#FFCA28"} stroke={strokeColor} strokeWidth="2" className={colorAttr} />
          {/* Tail */}
          <polygon points="25,50 10,42 12,58" fill={isShadow ? "#A0AEC0" : "#FFCA28"} stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" className={colorAttr} />
          {/* Beak */}
          <polygon points="75,44 86,48 74,52" fill={isShadow ? "#A0AEC0" : "#FF8F00"} stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" className={colorAttr} />
          {/* Eye */}
          {!isShadow && <circle cx="62" cy="42" r="3.5" fill="#2D3748" />}
        </svg>
      );
    case "fish":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Body */}
          <path d="M15,50 C30,30 65,30 80,50 C65,70 30,70 15,50 Z" fill={isShadow ? "#A0AEC0" : "#9FE2EC"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          {/* Fins */}
          <path d="M45,36 C45,20 58,25 55,36 Z" fill={isShadow ? "#A0AEC0" : "#64B5F6"} stroke={strokeColor} strokeWidth="2.5" className={colorAttr} />
          <path d="M45,64 C45,80 58,75 55,64 Z" fill={isShadow ? "#A0AEC0" : "#64B5F6"} stroke={strokeColor} strokeWidth="2.5" className={colorAttr} />
          {/* Tail */}
          <polygon points="17,50 2,36 6,64" fill={isShadow ? "#A0AEC0" : "#64B5F6"} stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" className={colorAttr} />
          {/* Eye */}
          {!isShadow && (
            <>
              <circle cx="68" cy="46" r="4.5" fill="#2D3748" />
              <circle cx="69" cy="45" r="1.5" fill="#FFFFFF" />
            </>
          )}
        </svg>
      );
    case "car":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <path d="M15,60 L20,42 C22,36 30,32 36,32 L64,32 C70,32 78,36 80,42 L85,60 C88,61 88,68 82,68 L18,68 C12,68 12,61 15,60 Z" fill={isShadow ? "#A0AEC0" : "#F18F95"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          {/* Windows */}
          <path d="M34,44 L38,36 L48,36 L48,44 Z" fill={isShadow ? "#A0AEC0" : "#FFFFFF"} stroke={strokeColor} strokeWidth="2.5" className={colorAttr} />
          <path d="M66,44 L62,36 L52,36 L52,44 Z" fill={isShadow ? "#A0AEC0" : "#FFFFFF"} stroke={strokeColor} strokeWidth="2.5" className={colorAttr} />
          {/* Wheels */}
          <circle cx="30" cy="68" r="11" fill={isShadow ? "#A0AEC0" : "#4A5568"} stroke={strokeColor} strokeWidth="3.5" className={colorAttr} />
          <circle cx="70" cy="68" r="11" fill={isShadow ? "#A0AEC0" : "#4A5568"} stroke={strokeColor} strokeWidth="3.5" className={colorAttr} />
          {!isShadow && (
            <>
              <circle cx="30" cy="68" r="4" fill="#CBD5E1" />
              <circle cx="70" cy="68" r="4" fill="#CBD5E1" />
            </>
          )}
        </svg>
      );
    case "bear":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="54" r="32" fill={isShadow ? "#A0AEC0" : "#B18A6A"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          {/* Ears */}
          <circle cx="24" cy="32" r="12" fill={isShadow ? "#A0AEC0" : "#B18A6A"} stroke={strokeColor} strokeWidth="2.5" className={colorAttr} />
          <circle cx="76" cy="32" r="12" fill={isShadow ? "#A0AEC0" : "#B18A6A"} stroke={strokeColor} strokeWidth="2.5" className={colorAttr} />
          {!isShadow && (
            <>
              <circle cx="24" cy="32" r="6" fill="#ECC3A6" />
              <circle cx="76" cy="32" r="6" fill="#ECC3A6" />
              {/* Eyes */}
              <circle cx="41" cy="48" r="3.5" fill="#2D3748" />
              <circle cx="59" cy="48" r="3.5" fill="#2D3748" />
              {/* Snout */}
              <ellipse cx="50" cy="58" rx="8" ry="6" fill="#ECC3A6" />
              <ellipse cx="50" cy="56" rx="4.5" ry="3" fill="#2D3748" />
            </>
          )}
        </svg>
      );
    case "ball":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="40" fill={isShadow ? "#A0AEC0" : "#90CDF4"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          {!isShadow && (
            <>
              <path d="M50,10 C35,22 35,78 50,90" fill="#FCF6DF" stroke={strokeColor} strokeWidth="2" />
              <path d="M50,10 C65,22 65,78 50,90" fill="#F0C7CE" stroke={strokeColor} strokeWidth="2" />
            </>
          )}
        </svg>
      );
    case "block":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <rect x="20" y="20" width="60" height="60" rx="10" fill={isShadow ? "#A0AEC0" : "#D4E1C6"} stroke={strokeColor} strokeWidth="3.5" className={colorAttr} />
          {!isShadow && (
            <text x="50" y="62" fontSize="38" fontWeight="800" textAnchor="middle" fill="#5A6F4E" fontFamily="Nunito, sans-serif">A</text>
          )}
        </svg>
      );
    case "balloon":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* String */}
          <path d="M50,75 Q48,85 54,95" stroke={isShadow ? strokeColor : "#718096"} strokeWidth="2.5" fill="none" />
          {/* Balloon Body */}
          <ellipse cx="50" cy="45" rx="26" ry="32" fill={isShadow ? "#A0AEC0" : "#E8A39F"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          {/* Balloon knot */}
          <polygon points="50,73 45,78 55,78" fill={isShadow ? "#A0AEC0" : "#E8A39F"} stroke={strokeColor} strokeWidth="2" className={colorAttr} />
          {!isShadow && (
            <ellipse cx="40" cy="30" rx="4" ry="8" fill="#FFFFFF" opacity="0.4" transform="rotate(-15, 40, 30)" />
          )}
        </svg>
      );
    case "tree":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Trunk */}
          <rect x="44" y="55" width="12" height="30" rx="4" fill={isShadow ? "#A0AEC0" : "#9C7C5D"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          {/* Bushy top */}
          <circle cx="50" cy="40" r="28" fill={isShadow ? "#A0AEC0" : "#B4CFC3"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          <circle cx="36" cy="48" r="20" fill={isShadow ? "#A0AEC0" : "#B4CFC3"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          <circle cx="64" cy="48" r="20" fill={isShadow ? "#A0AEC0" : "#B4CFC3"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
        </svg>
      );
    case "flower":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Stem */}
          <path d="M50,60 L50,90" stroke={isShadow ? strokeColor : "#74C39C"} strokeWidth="4" strokeLinecap="round" />
          <path d="M50,75 Q38,70 42,65" fill="none" stroke={isShadow ? strokeColor : "#74C39C"} strokeWidth="3.5" strokeLinecap="round" />
          {/* Petals */}
          <circle cx="50" cy="34" r="13" fill={isShadow ? "#A0AEC0" : "#F5D6E1"} stroke={strokeColor} strokeWidth="2" className={colorAttr} />
          <circle cx="50" cy="62" r="13" fill={isShadow ? "#A0AEC0" : "#F5D6E1"} stroke={strokeColor} strokeWidth="2" className={colorAttr} />
          <circle cx="36" cy="48" r="13" fill={isShadow ? "#A0AEC0" : "#F5D6E1"} stroke={strokeColor} strokeWidth="2" className={colorAttr} />
          <circle cx="64" cy="48" r="13" fill={isShadow ? "#A0AEC0" : "#F5D6E1"} stroke={strokeColor} strokeWidth="2" className={colorAttr} />
          {/* Center */}
          <circle cx="50" cy="48" r="14" fill={isShadow ? "#A0AEC0" : "#FFEFA6"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
        </svg>
      );
    case "leaf":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          {/* Leaf Body */}
          <path d="M50,15 C75,35 75,70 50,85 C25,70 25,35 50,15 Z" fill={isShadow ? "#A0AEC0" : "#CCE2D5"} stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" className={colorAttr} />
          {/* Veins */}
          <line x1="50" y1="15" x2="50" y2="85" stroke={isShadow ? strokeColor : "#74C39C"} strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="40" x2="68" y2="30" stroke={isShadow ? strokeColor : "#74C39C"} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="55" x2="65" y2="48" stroke={isShadow ? strokeColor : "#74C39C"} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="40" x2="32" y2="30" stroke={isShadow ? strokeColor : "#74C39C"} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="55" x2="35" y2="48" stroke={isShadow ? strokeColor : "#74C39C"} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "cloud":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <path d="M25,65 C15,65 10,55 18,48 C15,38 28,28 38,34 C44,22 62,24 66,35 C76,32 84,42 80,50 C86,58 78,65 70,65 Z" fill={isShadow ? "#A0AEC0" : "#E2ECE9"} stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" className={colorAttr} />
        </svg>
      );
    case "sun":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="22" fill={isShadow ? "#A0AEC0" : "#FFEFA6"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          {/* Ray Lines */}
          <g stroke={isShadow ? strokeColor : "#F5B041"} strokeWidth="4" strokeLinecap="round">
            <line x1="50" y1="14" x2="50" y2="22" />
            <line x1="50" y1="78" x2="50" y2="86" />
            <line x1="14" y1="50" x2="22" y2="50" />
            <line x1="78" y1="50" x2="86" y2="50" />
            <line x1="25" y1="25" x2="31" y2="31" />
            <line x1="69" y1="69" x2="75" y2="75" />
            <line x1="75" y1="25" x2="69" y2="31" />
            <line x1="31" y1="69" x2="25" y2="75" />
          </g>
        </svg>
      );
    case "drop":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <path d="M50,15 C50,15 80,50 80,62 C80,78 66,86 50,86 C34,86 20,78 20,62 C20,50 50,15 50,15 Z" fill={isShadow ? "#A0AEC0" : "#D2E4EE"} stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" className={colorAttr} />
          {!isShadow && (
            <path d="M38,62 C38,55 45,46 50,42" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.6" />
          )}
        </svg>
      );
    case "shell":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <path d="M50,15 C25,25 20,75 50,85 C80,75 75,25 50,15 Z" fill={isShadow ? "#A0AEC0" : "#F7D6C8"} stroke={strokeColor} strokeWidth="3" className={colorAttr} />
          <path d="M50,15 C45,35 40,65 50,85" stroke={strokeColor} strokeWidth="2" fill="none" />
          <path d="M50,15 C55,35 60,65 50,85" stroke={strokeColor} strokeWidth="2" fill="none" />
          <path d="M50,15 C35,35 30,65 50,85" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          <path d="M50,15 C65,35 70,65 50,85" stroke={strokeColor} strokeWidth="1.5" fill="none" />
        </svg>
      );
    // Sensory attributes / Illustrative
    case "soft": // Pillow
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <rect x="15" y="25" width="70" height="50" rx="15" fill="#EAE5F3" stroke={strokeColor} strokeWidth="3" />
          <path d="M15,25 L45,50 L15,75" stroke={strokeColor} strokeWidth="2.5" fill="none" />
          <path d="M85,25 L55,50 L85,75" stroke={strokeColor} strokeWidth="2.5" fill="none" />
          <circle cx="50" cy="50" r="4" fill="#6B5B95" />
        </svg>
      );
    case "rough": // Brick Wall
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <rect x="15" y="20" width="70" height="60" rx="4" fill="#F4CEC3" stroke={strokeColor} strokeWidth="3" />
          <line x1="15" y1="40" x2="85" y2="40" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="15" y1="60" x2="85" y2="60" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="40" y1="20" x2="40" y2="40" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="65" y1="20" x2="65" y2="40" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="28" y1="40" x2="28" y2="60" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="58" y1="40" x2="58" y2="60" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="45" y1="60" x2="45" y2="80" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );
    case "smooth": // Shiny Mirror
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="35" fill="#DCF0F7" stroke={strokeColor} strokeWidth="3" />
          <path d="M30,30 L70,70" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
          <path d="M42,22 L58,38" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case "bumpy": // Bubble Wrap
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <rect x="15" y="15" width="70" height="70" rx="10" fill="#E1EEEC" stroke={strokeColor} strokeWidth="3" />
          <circle cx="35" cy="35" r="7" fill="#BCE0DA" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="65" cy="35" r="7" fill="#BCE0DA" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="35" cy="65" r="7" fill="#BCE0DA" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="65" cy="65" r="7" fill="#BCE0DA" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="50" cy="50" r="7" fill="#BCE0DA" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case "happy":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="40" fill="#FFEFA6" stroke={strokeColor} strokeWidth="3" />
          <circle cx="35" cy="42" r="5" fill="#2D3748" />
          <circle cx="65" cy="42" r="5" fill="#2D3748" />
          <path d="M30,34 Q35,30 40,34" stroke="#2D3748" strokeWidth="2" fill="none" />
          <path d="M60,34 Q65,30 70,34" stroke="#2D3748" strokeWidth="2" fill="none" />
          <path d="M32,58 Q50,75 68,58" fill="none" stroke="#2D3748" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "calm":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="40" fill="#D4E1C6" stroke={strokeColor} strokeWidth="3" />
          {/* Peaceful closed eyes */}
          <path d="M28,45 Q35,52 42,45" fill="none" stroke="#2D3748" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M58,45 Q65,52 72,45" fill="none" stroke="#2D3748" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M38,62 Q50,68 62,62" fill="none" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "sad":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="40" fill="#C5DCED" stroke={strokeColor} strokeWidth="3" />
          <circle cx="35" cy="42" r="4.5" fill="#2D3748" />
          <circle cx="65" cy="42" r="4.5" fill="#2D3748" />
          <path d="M28,38 L38,34" stroke="#2D3748" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M72,38 L62,34" stroke="#2D3748" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M36,66 Q50,52 64,66" fill="none" stroke="#2D3748" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "excited":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="40" fill="#F7D6C8" stroke={strokeColor} strokeWidth="3" />
          {/* Star Eyes */}
          <polygon points="35,32 37,39 44,39 39,43 41,50 35,46 29,50 31,43 26,39 33,39" fill="#F5B041" stroke={strokeColor} strokeWidth="1.5" />
          <polygon points="65,32 67,39 74,39 69,43 71,50 65,46 59,50 61,43 56,39 63,39" fill="#F5B041" stroke={strokeColor} strokeWidth="1.5" />
          {/* Big happy mouth */}
          <path d="M30,55 Q50,78 70,55 Z" fill="#E8A39F" stroke={strokeColor} strokeWidth="3" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="40" fill="#CBD5E1" stroke={strokeColor} strokeWidth="3" />
          <HelpIcon className="text-gray-600 stroke-[3] mx-auto" size={size * 0.5} />
        </svg>
      );
  }
}

interface ActivityProps {
  levelId: number;
  onComplete: () => void;
  onIncorrectAttempt: (message: string) => void;
  isMuted: boolean;
}

export function LevelActivity({ levelId: rawLevelId, onComplete, onIncorrectAttempt, isMuted }: ActivityProps) {
  const levelId = ((rawLevelId - 1) % 20) + 1;
  
  // Let's create individual level states and rendering
  const [subRound, setSubRound] = useState(0); // For multiple rounds per level (keep it engaging!)
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [shuffledShades, setShuffledShades] = useState<any[]>([]);
  const [cardFlips, setCardFlips] = useState<{ id: number; item: string; isMatched: boolean; isFlipped: boolean }[]>([]);
  const [activeFlipped, setActiveFlipped] = useState<number[]>([]);
  const [isMemoryFinished, setIsMemoryFinished] = useState(false);
  const [natureSortingList, setNatureSortingList] = useState<{ id: string; name: string; type: string }[]>([]);
  const [currentSortingIndex, setCurrentSortingIndex] = useState(0);
  const [spotDifferences, setSpotDifferences] = useState<{ id: number; x: number; y: number; found: boolean }[]>([]);
  const [starfishPosition, setStarfishPosition] = useState({ x: 50, y: 50 });
  const [starfishCount, setStarfishCount] = useState(0);

  // Re-initialize states when levelId or subRound shifts
  useEffect(() => {
    setSelectedItems([]);
    setShuffledShades([]);
    setCardFlips([]);
    setActiveFlipped([]);
    setIsMemoryFinished(false);
    setCurrentSortingIndex(0);
    
    if (levelId === 4) {
      // Shaded blocks: Light to Dark
      const shades = [
        { id: 1, color: "#E0F2FE", name: "Light Soft Sky Blue", value: 1 },
        { id: 2, color: "#7DD3FC", name: "Medium Sky Blue", value: 2 },
        { id: 3, color: "#0EA5E9", name: "Durable Ocean Blue", value: 3 },
        { id: 4, color: "#0369A1", name: "Deep Space Navy Blue", value: 4 }
      ];
      // Shuffle them
      setShuffledShades([...shades].sort(() => Math.random() - 0.5));
    }

    if (levelId === 9) {
      // Memory Match - 3 pairs: Sun, Flower, Shell
      const items = ["sun", "flower", "shell"];
      const doubleItems = [...items, ...items].map((item, index) => ({
        id: index,
        item,
        isMatched: false,
        isFlipped: false
      })).sort(() => Math.random() - 0.5);
      setCardFlips(doubleItems);
    }

    if (levelId === 13) {
      // Sequence Builder
      // Round 0: Seed -> Sprout -> Flower
      // Round 1: Sleep -> Breakfast -> Brush Teeth
      const rounds = [
        [
          { step: 1, type: "drop", label: "1. Water the soil" },
          { step: 2, type: "leaf", label: "2. Sprout appears" },
          { step: 3, type: "flower", label: "3. Flower blooms" }
        ],
        [
          { step: 1, type: "sun", label: "1. Morning Sun" },
          { step: 2, type: "cookie", label: "2. Eat yummy cookies" },
          { step: 3, type: "dog", label: "3. Walk the friendly dog" }
        ]
      ];
      // Shuffle selected round
      setShuffledShades([...rounds[subRound % rounds.length]].sort(() => Math.random() - 0.5));
    }

    if (levelId === 15) {
      // Nature Sorting: Sky, Water, Land
      const items = [
        { id: "1", name: "Cloud", type: "sky" },
        { id: "2", name: "Fish", type: "water" },
        { id: "3", name: "Rabbit", type: "land" },
        { id: "4", name: "Sun", type: "sky" },
        { id: "5", name: "Shell", type: "water" },
        { id: "6", name: "Dog", type: "land" }
      ].sort(() => Math.random() - 0.5);
      setNatureSortingList(items);
    }

    if (levelId === 16) {
      // Sensory Categories: Soft, Hard, Smooth, Rough
      const items = [
        { id: "1", name: "Feather Pillow", type: "soft" },
        { id: "2", name: "Brick Wall", type: "rough" },
        { id: "3", name: "Polished Mirror", type: "smooth" },
        { id: "4", name: "Bubble Wrap", type: "bumpy" }
      ].sort(() => Math.random() - 0.5);
      setNatureSortingList(items); // Re-use list state
    }

    if (levelId === 17) {
      // Spot the Difference
      // Left and Right images. Difference is at specific spot.
      // We will define 1 difference in the tree/flowers
      setSpotDifferences([{ id: 1, x: 70, y: 35, found: false }]);
    }

    if (levelId === 18) {
      // Visual Focus (Starfish drift)
      setStarfishPosition({ x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 });
      setStarfishCount(0);
    }

  }, [levelId, subRound]);

  // Handle Level Completion or progression of Sub-rounds
  const nextSubRound = () => {
    if (subRound >= 1) {
      audio.playSuccessChime();
      onComplete();
    } else {
      audio.playSuccessChime();
      setSubRound(subRound + 1);
    }
  };

  // Helper trigger for wrong tries
  const triggerIncorrect = () => {
    audio.playEncouragementPurr();
    const feedbacks = [
      "🌸 Let's try again! You are doing great.",
      "🌸 Great effort! Take your time.",
      "🌸 You're improving! Have another go.",
      "🌸 Keep going! Peaceful and steady."
    ];
    onIncorrectAttempt(feedbacks[Math.floor(Math.random() * feedbacks.length)]);
  };

  // Render individual levels
  // -------------------------------------------------------------
  // LEVEL 1: COLOUR MATCHING
  if (levelId === 1) {
    const questions = [
      { target: PASTEL_COLORS.pastelSageGreen, name: "Sage Green", options: [PASTEL_COLORS.pastelSageGreen, PASTEL_COLORS.pastelBlue, PASTEL_COLORS.pastelPink] },
      { target: PASTEL_COLORS.pastelBlue, name: "Soft Blue", options: [PASTEL_COLORS.pastelYellow, PASTEL_COLORS.pastelBlue, PASTEL_COLORS.pastelLavender] },
      { target: PASTEL_COLORS.pastelPink, name: "Pastel Pink", options: [PASTEL_COLORS.pastelPink, PASTEL_COLORS.pastelSageGreen, PASTEL_COLORS.pastelCoral] }
    ];
    const cur = questions[subRound % questions.length];

    const handleSelect = (color: string) => {
      if (color === cur.target) {
        nextSubRound();
      } else {
        triggerIncorrect();
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <div className="mb-8 text-center">
          <p className="text-gray-500 font-mono text-xs tracking-wider uppercase mb-1">Target Colour</p>
          <div 
            className="w-32 h-32 rounded-3xl shadow-md border-4 border-white transition-all duration-300 transform hover:scale-102"
            style={{ backgroundColor: cur.target }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {cur.options.map((opt, i) => (
            <button
              key={i}
              id={`color-opt-${i}`}
              onClick={() => handleSelect(opt)}
              className="h-28 rounded-2xl shadow-sm border-2 border-transparent hover:border-gray-300 transition-all active:scale-95 cursor-pointer"
              style={{ backgroundColor: opt }}
              aria-label={`Option ${i + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // LEVEL 2: SHAPE MATCHING
  if (levelId === 2) {
    const questions = [
      { target: "star", options: ["circle", "star", "triangle"] },
      { target: "circle", options: ["square", "triangle", "circle"] },
      { target: "heart", options: ["heart", "pentagon", "square"] }
    ];
    const cur = questions[subRound % questions.length];

    const handleSelect = (shape: string) => {
      if (shape === cur.target) {
        nextSubRound();
      } else {
        triggerIncorrect();
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <div className="mb-8 text-center">
          <p className="text-gray-500 font-mono text-xs tracking-wider uppercase mb-1">Target Shape</p>
          <div className="w-32 h-32 rounded-3xl bg-white shadow-sm flex items-center justify-center border border-gray-100">
            {renderIllustration(cur.target, 80)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {cur.options.map((opt, i) => (
            <button
              key={i}
              id={`shape-opt-${i}`}
              onClick={() => handleSelect(opt)}
              className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:bg-sky-50/20 transition-all flex items-center justify-center cursor-pointer active:scale-95"
            >
              {renderIllustration(opt, 70)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // LEVEL 3: BIG AND SMALL
  if (levelId === 3) {
    const questions = [
      { item: "bear", target: "big", desc: "Tap the BIG bear" },
      { item: "apple", target: "small", desc: "Tap the SMALL apple" },
      { item: "cloud", target: "big", desc: "Tap the BIG cloud" }
    ];
    const cur = questions[subRound % questions.length];

    const handleSelect = (size: "big" | "small") => {
      if (size === cur.target) {
        nextSubRound();
      } else {
        triggerIncorrect();
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <h3 className="text-xl text-slate-700 font-medium mb-8 text-center">{cur.desc}</h3>
        
        <div className="flex items-center justify-center gap-12 w-full">
          {/* Big Option */}
          <button
            id="size-big"
            onClick={() => handleSelect("big")}
            className="p-6 bg-white rounded-3xl shadow-sm hover:shadow-md border border-gray-100 transition-all flex items-center justify-center cursor-pointer transform hover:scale-102 active:scale-95"
          >
            <div className="flex flex-col items-center">
              {renderIllustration(cur.item, 110)}
              <span className="mt-2 text-xs text-gray-400 font-mono">Big</span>
            </div>
          </button>

          {/* Small Option */}
          <button
            id="size-small"
            onClick={() => handleSelect("small")}
            className="p-6 bg-white rounded-3xl shadow-sm hover:shadow-md border border-gray-100 transition-all flex items-center justify-center cursor-pointer transform hover:scale-102 active:scale-95"
          >
            <div className="flex flex-col items-center">
              {renderIllustration(cur.item, 50)}
              <span className="mt-2 text-xs text-gray-400 font-mono">Small</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // LEVEL 4: COLOUR SHADES
  if (levelId === 4) {
    const handleSwap = (index1: number, index2: number) => {
      const copy = [...shuffledShades];
      const temp = copy[index1];
      copy[index1] = copy[index2];
      copy[index2] = temp;
      setShuffledShades(copy);

      // Check if perfectly sorted from lightest to darkest (value 1 to 4)
      const isSorted = copy.every((shade, idx) => shade.value === idx + 1);
      if (isSorted) {
        setTimeout(() => {
          nextSubRound();
        }, 500);
      }
    };

    const handleBlockClick = (index: number) => {
      if (selectedItems.length === 0) {
        setSelectedItems([index]);
      } else {
        const firstIndex = selectedItems[0];
        if (firstIndex === index) {
          setSelectedItems([]); // Unselect
        } else {
          handleSwap(firstIndex, index);
          setSelectedItems([]);
        }
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <p className="text-gray-500 font-sans text-sm text-center mb-6">
          Tap two color blocks to swap their positions. Make them go from lightest to darkest!
        </p>

        <div className="grid grid-cols-4 gap-3 w-full mb-8">
          {shuffledShades.map((shade, idx) => {
            const isSelected = selectedItems.includes(idx);
            return (
              <button
                key={shade.id}
                id={`shade-block-${idx}`}
                onClick={() => handleBlockClick(idx)}
                className={`h-36 rounded-2xl shadow-sm transition-all relative flex flex-col items-center justify-end pb-3 cursor-pointer ${
                  isSelected ? "ring-4 ring-emerald-300 scale-102 shadow" : "border-2 border-transparent"
                }`}
                style={{ backgroundColor: shade.color }}
              >
                <span className="bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] text-gray-600 font-mono">
                  {isSelected ? "Swapping" : "Tap"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // LEVEL 5: TEXTURE RECOGNITION
  if (levelId === 5) {
    const questions = [
      { target: "soft", desc: "Which one feels soft like a fluffy cloud?", options: ["rough", "soft", "bumpy"] },
      { target: "rough", desc: "Which one feels rough like a brick wall?", options: ["smooth", "bumpy", "rough"] },
      { target: "smooth", desc: "Which one feels smooth like a clean mirror?", options: ["smooth", "rough", "bumpy"] }
    ];
    const cur = questions[subRound % questions.length];

    const handleSelect = (option: string) => {
      if (option === cur.target) {
        nextSubRound();
      } else {
        triggerIncorrect();
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <h3 className="text-lg text-slate-700 font-medium mb-6 text-center">{cur.desc}</h3>

        <div className="grid grid-cols-3 gap-4 w-full">
          {cur.options.map((opt, i) => (
            <button
              key={i}
              id={`texture-opt-${i}`}
              onClick={() => handleSelect(opt)}
              className="p-4 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-emerald-200 transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95"
            >
              {renderIllustration(opt, 75)}
              <span className="mt-3 text-sm font-medium text-slate-500 capitalize">{opt}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // LEVEL 6: SOUND MATCHING
  if (levelId === 6) {
    const questions = [
      { sound: "birds" as const, desc: "Chirp chirp! Which sound matches the birds?", options: ["flower", "bird", "cloud"] },
      { sound: "rain" as const, desc: "Pitter-patter! Which sound matches the rain?", options: ["drop", "sun", "leaf"] },
      { sound: "wind" as const, desc: "Whoosh! Which sound matches the blowing wind?", options: ["shell", "cloud", "star"] }
    ];
    const cur = questions[subRound % questions.length];

    const playSound = () => {
      if (cur.sound === "birds") audio.playBirdChirp(0, 0.25);
      if (cur.sound === "rain") {
        audio.playRainDroplet(0, 0.2);
        audio.playRainDroplet(0.1, 0.15);
      }
      if (cur.sound === "wind") audio.playWindBlow(0, 1.2, 0.25);
    };

    const handleSelect = (option: string) => {
      // Map option to correct category
      const soundMap: Record<string, string> = {
        bird: "birds",
        drop: "rain",
        cloud: "wind"
      };
      if (soundMap[option] === cur.sound) {
        nextSubRound();
      } else {
        triggerIncorrect();
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <p className="text-gray-500 text-sm text-center mb-4">
          Tap the blue button to listen to a soft sound, then tap the matching picture!
        </p>

        <button
          id="listen-sound-btn"
          onClick={playSound}
          className="mb-8 flex items-center gap-2 bg-sky-100 hover:bg-sky-200 text-sky-700 font-semibold px-6 py-4 rounded-full shadow-sm hover:shadow transition-all transform active:scale-95 cursor-pointer"
        >
          <Volume2 size={24} className="stroke-[2.5]" />
          <span>Tap to Listen</span>
        </button>

        <div className="grid grid-cols-3 gap-4 w-full">
          {cur.options.map((opt, i) => (
            <button
              key={i}
              id={`sound-opt-${i}`}
              onClick={() => handleSelect(opt)}
              className="p-5 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-sky-200 transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95"
            >
              {renderIllustration(opt, 75)}
              <span className="mt-2 text-xs font-mono text-gray-400 uppercase">{opt}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // LEVEL 7: OBJECT SORTING
  if (levelId === 7) {
    const itemsToSort = [
      { id: "dog", name: "Cute Puppy", category: "animal" },
      { id: "apple", name: "Red Apple", category: "food" },
      { id: "car", name: "Toy Car", category: "toy" },
      { id: "banana", name: "Sweet Banana", category: "food" }
    ];
    const cur = itemsToSort[subRound % itemsToSort.length];

    const handleSort = (category: string) => {
      if (category === cur.category) {
        nextSubRound();
      } else {
        triggerIncorrect();
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto">
        <p className="text-gray-500 text-sm text-center mb-4">
          Tap the correct box where this item belongs!
        </p>

        <div className="mb-6 p-6 bg-white rounded-3xl shadow-xs border border-gray-50/50 flex flex-col items-center">
          {renderIllustration(cur.id, 90)}
          <h4 className="text-slate-700 font-medium mt-3 text-lg">{cur.name}</h4>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full">
          <button
            id="sort-box-animal"
            onClick={() => handleSort("animal")}
            className="p-4 bg-sage-50 rounded-2xl border border-teal-100 hover:bg-teal-50 transition-all text-teal-800 font-medium text-sm flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
          >
            <span>🐶</span>
            <span>Animals</span>
          </button>
          <button
            id="sort-box-food"
            onClick={() => handleSort("food")}
            className="p-4 bg-orange-50 rounded-2xl border border-orange-100 hover:bg-orange-100/50 transition-all text-orange-800 font-medium text-sm flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
          >
            <span>🍎</span>
            <span>Food</span>
          </button>
          <button
            id="sort-box-toy"
            onClick={() => handleSort("toy")}
            className="p-4 bg-sky-50 rounded-2xl border border-sky-100 hover:bg-sky-100/50 transition-all text-sky-800 font-medium text-sm flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
          >
            <span>🧸</span>
            <span>Toys</span>
          </button>
        </div>
      </div>
    );
  }

  // LEVEL 8: PATTERN COMPLETION
  if (levelId === 8) {
    const patterns = [
      { sequence: ["apple", "banana", "apple", "banana"], target: "apple", options: ["banana", "apple", "carrot"] },
      { sequence: ["star", "circle", "star", "circle"], target: "star", options: ["circle", "square", "star"] },
      { sequence: ["sun", "cloud", "sun", "cloud"], target: "sun", options: ["cloud", "sun", "drop"] }
    ];
    const cur = patterns[subRound % patterns.length];

    const handleSelect = (option: string) => {
      if (option === cur.target) {
        nextSubRound();
      } else {
        triggerIncorrect();
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <p className="text-gray-500 text-sm text-center mb-6">
          Find the next picture that matches the repeating pattern!
        </p>

        {/* The pattern sequence display */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-3xl shadow-xs border border-gray-100 mb-8 w-full justify-center overflow-x-auto">
          {cur.sequence.map((item, i) => (
            <React.Fragment key={i}>
              <div className="p-2 bg-emerald-50/30 rounded-xl border border-emerald-100/40">
                {renderIllustration(item, 50)}
              </div>
              <ChevronRight className="text-gray-300 shrink-0" size={16} />
            </React.Fragment>
          ))}
          <div className="w-14 h-14 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50 flex items-center justify-center shrink-0">
            <HelpCircle className="text-sky-400 stroke-[2]" size={24} />
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {cur.options.map((opt, i) => (
            <button
              key={i}
              id={`pattern-opt-${i}`}
              onClick={() => handleSelect(opt)}
              className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-sky-200 transition-all flex items-center justify-center cursor-pointer active:scale-95"
            >
              {renderIllustration(opt, 65)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // LEVEL 9: MEMORY MATCH
  if (levelId === 9) {
    const handleCardClick = (id: number) => {
      if (activeFlipped.length === 2 || cardFlips[id].isMatched || cardFlips[id].isFlipped) return;

      const updated = [...cardFlips];
      updated[id].isFlipped = true;
      setCardFlips(updated);

      const nextFlipped = [...activeFlipped, id];
      setActiveFlipped(nextFlipped);

      if (nextFlipped.length === 2) {
        const [first, second] = nextFlipped;
        if (updated[first].item === updated[second].item) {
          // It is a match!
          setTimeout(() => {
            updated[first].isMatched = true;
            updated[second].isMatched = true;
            setCardFlips(updated);
            setActiveFlipped([]);

            // Check if all are matched
            if (updated.every(c => c.isMatched)) {
              setIsMemoryFinished(true);
            }
          }, 400);
        } else {
          // No match, flip back
          setTimeout(() => {
            updated[first].isFlipped = false;
            updated[second].isFlipped = false;
            setCardFlips(updated);
            setActiveFlipped([]);
          }, 1000);
        }
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <p className="text-gray-500 text-sm text-center mb-6">
          Find all matching card pairs. Take your time!
        </p>

        <div className="grid grid-cols-3 gap-4 w-full mb-8">
          {cardFlips.map((card, idx) => {
            const showFace = card.isFlipped || card.isMatched;
            return (
              <button
                key={card.id}
                id={`memory-card-${idx}`}
                onClick={() => handleCardClick(idx)}
                className={`h-28 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer border relative flex items-center justify-center ${
                  showFace ? "bg-white border-sky-100 transform rotate-y-180" : "bg-sky-100 border-sky-200"
                }`}
              >
                {showFace ? (
                  renderIllustration(card.item, 65)
                ) : (
                  <span className="text-2xl font-semibold text-sky-400">🌸</span>
                )}
              </button>
            );
          })}
        </div>

        {isMemoryFinished && (
          <button
            id="memory-complete-btn"
            onClick={onComplete}
            className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-6 py-3.5 rounded-full shadow-xs hover:shadow transition-all cursor-pointer font-bold animate-pulse"
          >
            <Check size={20} className="stroke-[2.5]" />
            <span>Success! Proceed</span>
          </button>
        )}
      </div>
    );
  }

  // LEVEL 10: FIND THE DIFFERENT OBJECT
  if (levelId === 10) {
    const questions = [
      { list: ["apple", "apple", "strawberry", "apple"], targetIndex: 2, desc: "Tap the strawberry" },
      { list: ["cat", "dog", "cat", "cat"], targetIndex: 1, desc: "Tap the dog" },
      { list: ["circle", "circle", "circle", "square"], targetIndex: 3, desc: "Tap the square" }
    ];
    const cur = questions[subRound % questions.length];

    const handleSelect = (idx: number) => {
      if (idx === cur.targetIndex) {
        nextSubRound();
      } else {
        triggerIncorrect();
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <h3 className="text-lg text-slate-700 font-medium mb-6 text-center">
          One of these pictures does not belong. Can you spot it?
        </h3>

        <div className="grid grid-cols-4 gap-3 w-full">
          {cur.list.map((item, idx) => (
            <button
              key={idx}
              id={`diff-opt-${idx}`}
              onClick={() => handleSelect(idx)}
              className="p-4 bg-white rounded-2xl shadow-xs border border-gray-100 hover:border-teal-200 transition-all flex items-center justify-center cursor-pointer active:scale-95"
            >
              {renderIllustration(item, 55)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // LEVEL 11: SHADOW MATCHING
  if (levelId === 11) {
    const questions = [
      { item: "rabbit", options: ["dog", "rabbit", "cat"] },
      { item: "car", options: ["car", "bear", "block"] },
      { item: "tree", options: ["flower", "leaf", "tree"] }
    ];
    const cur = questions[subRound % questions.length];

    const handleSelect = (option: string) => {
      if (option === cur.item) {
        nextSubRound();
      } else {
        triggerIncorrect();
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <div className="mb-6 text-center">
          <p className="text-gray-500 font-mono text-xs tracking-wider uppercase mb-1">Match This Object</p>
          <div className="w-28 h-28 rounded-3xl bg-white shadow-xs flex items-center justify-center border border-gray-50">
            {renderIllustration(cur.item, 70)}
          </div>
        </div>

        <p className="text-slate-600 font-sans text-sm text-center mb-6">
          Find the matching dark shadow silhouette below:
        </p>

        <div className="grid grid-cols-3 gap-4 w-full">
          {cur.options.map((opt, i) => (
            <button
              key={i}
              id={`shadow-opt-${i}`}
              onClick={() => handleSelect(opt)}
              className="p-4 bg-white rounded-2xl shadow-xs border border-gray-100 hover:border-indigo-200 transition-all flex items-center justify-center cursor-pointer active:scale-95"
            >
              {renderIllustration(opt, 65, "", true)} {/* Render in Shadow style! */}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // LEVEL 12: VISUAL SEARCH
  if (levelId === 12) {
    const targetColors = ["#FFF176", "#81C784", "#F48FB1"]; // Yellow, Green, Pink
    const curTarget = targetColors[subRound % targetColors.length];
    
    // Generate 12 balloons, 1 of target colour, 11 of pastel blue color
    const items = Array.from({ length: 12 }, (_, idx) => {
      if (idx === 4) return { isTarget: true, color: curTarget };
      return { isTarget: false, color: "#90CDF4" }; // Distractors
    });

    const handleSelect = (isTarget: boolean) => {
      if (isTarget) {
        nextSubRound();
      } else {
        triggerIncorrect();
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <p className="text-slate-700 font-medium text-lg text-center mb-6">
          Find the <span className="font-bold underline" style={{ color: curTarget }}>special colored balloon</span> in the grid!
        </p>

        <div className="grid grid-cols-4 gap-3 w-full">
          {items.map((balloon, idx) => (
            <button
              key={idx}
              id={`balloon-search-${idx}`}
              onClick={() => handleSelect(balloon.isTarget)}
              className="p-3 bg-white rounded-2xl shadow-xs border border-gray-100 flex items-center justify-center cursor-pointer transition-all active:scale-90"
            >
              <svg width="45" height="55" viewBox="0 0 100 120">
                <path d="M50,85 Q48,95 54,105" stroke="#718096" strokeWidth="3" fill="none" />
                <ellipse cx="50" cy="50" rx="30" ry="38" fill={balloon.color} stroke="#4A5568" strokeWidth="3" />
                <polygon points="50,82 45,88 55,88" fill={balloon.color} stroke="#4A5568" strokeWidth="2.5" />
                <ellipse cx="38" cy="32" rx="4" ry="8" fill="#FFFFFF" opacity="0.4" transform="rotate(-15, 38, 32)" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // LEVEL 13: SEQUENCE BUILDER
  if (levelId === 13) {
    const handleSwap = (idx1: number, idx2: number) => {
      const copy = [...shuffledShades];
      const temp = copy[idx1];
      copy[idx1] = copy[idx2];
      copy[idx2] = temp;
      setShuffledShades(copy);

      // Check order
      const isCorrect = copy.every((step, idx) => step.step === idx + 1);
      if (isCorrect) {
        setTimeout(() => {
          nextSubRound();
        }, 500);
      }
    };

    const handleClick = (idx: number) => {
      if (selectedItems.length === 0) {
        setSelectedItems([idx]);
      } else {
        const first = selectedItems[0];
        if (first === idx) {
          setSelectedItems([]);
        } else {
          handleSwap(first, idx);
          setSelectedItems([]);
        }
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <p className="text-gray-500 text-sm text-center mb-6">
          Tap two pictures to swap their sequence. Arrange them in the logical order!
        </p>

        <div className="grid grid-cols-3 gap-4 w-full mb-8">
          {shuffledShades.map((item, idx) => {
            const isSelected = selectedItems.includes(idx);
            return (
              <button
                key={idx}
                id={`seq-item-${idx}`}
                onClick={() => handleClick(idx)}
                className={`p-4 bg-white rounded-3xl shadow-sm transition-all cursor-pointer border flex flex-col items-center justify-center min-h-[140px] ${
                  isSelected ? "border-emerald-300 ring-4 ring-emerald-200" : "border-gray-100"
                }`}
              >
                {renderIllustration(item.type, 70)}
                <span className="mt-3 text-xs text-slate-500 font-medium text-center leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // LEVEL 14: EMOTION RECOGNITION
  if (levelId === 14) {
    const questions = [
      { target: "calm", desc: "Which face looks completely calm and peaceful?", options: ["happy", "calm", "sad"] },
      { target: "happy", desc: "Which face looks very happy and smiling?", options: ["sad", "happy", "excited"] },
      { target: "excited", desc: "Which face looks excited and cheerful?", options: ["calm", "excited", "sad"] }
    ];
    const cur = questions[subRound % questions.length];

    const handleSelect = (option: string) => {
      if (option === cur.target) {
        nextSubRound();
      } else {
        triggerIncorrect();
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <h3 className="text-lg text-slate-700 font-medium mb-6 text-center">{cur.desc}</h3>

        <div className="grid grid-cols-3 gap-4 w-full">
          {cur.options.map((opt, i) => (
            <button
              key={i}
              id={`emotion-opt-${i}`}
              onClick={() => handleSelect(opt)}
              className="p-4 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-emerald-200 transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95"
            >
              {renderIllustration(opt, 80)}
              <span className="mt-3 text-sm font-medium text-slate-500 capitalize">{opt}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // LEVEL 15: NATURE SORTING
  if (levelId === 15) {
    const activeItem = natureSortingList[currentSortingIndex];

    const handleSort = (destination: string) => {
      if (activeItem.type === destination) {
        if (currentSortingIndex + 1 >= natureSortingList.length) {
          nextSubRound();
        } else {
          audio.playSuccessChime();
          setCurrentSortingIndex(currentSortingIndex + 1);
        }
      } else {
        triggerIncorrect();
      }
    };

    if (!activeItem) return null;

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <p className="text-slate-500 text-sm text-center mb-6">
          Sort the item into the correct category!
        </p>

        <div className="mb-6 p-6 bg-white rounded-3xl shadow-xs border border-gray-50 flex flex-col items-center">
          {renderIllustration(activeItem.name, 80)}
          <h4 className="text-slate-700 font-medium mt-3 text-lg capitalize">{activeItem.name}</h4>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full">
          <button
            id="nature-sky"
            onClick={() => handleSort("sky")}
            className="p-4 bg-sky-50 rounded-2xl border border-sky-100 hover:bg-sky-100/50 transition-all text-sky-800 font-medium text-sm flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
          >
            <span>☁️</span>
            <span>Sky</span>
          </button>
          <button
            id="nature-water"
            onClick={() => handleSort("water")}
            className="p-4 bg-blue-50 rounded-2xl border border-blue-100 hover:bg-blue-100/50 transition-all text-blue-800 font-medium text-sm flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
          >
            <span>🌊</span>
            <span>Water</span>
          </button>
          <button
            id="nature-land"
            onClick={() => handleSort("land")}
            className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 hover:bg-emerald-100/50 transition-all text-emerald-800 font-medium text-sm flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
          >
            <span>🌳</span>
            <span>Land</span>
          </button>
        </div>
      </div>
    );
  }

  // LEVEL 16: SENSORY CATEGORIES
  if (levelId === 16) {
    const activeItem = natureSortingList[currentSortingIndex];

    const handleSort = (destination: string) => {
      if (activeItem.type === destination) {
        if (currentSortingIndex + 1 >= natureSortingList.length) {
          nextSubRound();
        } else {
          audio.playSuccessChime();
          setCurrentSortingIndex(currentSortingIndex + 1);
        }
      } else {
        triggerIncorrect();
      }
    };

    if (!activeItem) return null;

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <p className="text-slate-500 text-sm text-center mb-6">
          How does this object feel? Place it in the correct feeling box!
        </p>

        <div className="mb-6 p-6 bg-white rounded-3xl shadow-xs border border-gray-50 flex flex-col items-center">
          {renderIllustration(activeItem.type, 80)}
          <h4 className="text-slate-700 font-medium mt-3 text-lg capitalize">{activeItem.name}</h4>
        </div>

        <div className="grid grid-cols-4 gap-2 w-full">
          {["soft", "rough", "smooth", "bumpy"].map((cat) => (
            <button
              key={cat}
              id={`sensory-cat-${cat}`}
              onClick={() => handleSort(cat)}
              className="p-3 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 text-slate-700 font-medium text-xs capitalize flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
            >
              <span className="text-lg">
                {cat === "soft" ? "☁️" : cat === "rough" ? "🧱" : cat === "smooth" ? "🔍" : "🍓"}
              </span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // LEVEL 17: SPOT THE DIFFERENCE
  if (levelId === 17) {
    const handleSpot = () => {
      const copy = [...spotDifferences];
      copy[0].found = true;
      setSpotDifferences(copy);
      setTimeout(() => {
        nextSubRound();
      }, 700);
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <p className="text-gray-500 text-sm text-center mb-6">
          Find the difference on the right tree! (Hint: Look for a red fruit!)
        </p>

        <div className="flex items-center gap-6 w-full justify-center">
          {/* Left Original Picture */}
          <div className="p-4 bg-white rounded-3xl border border-gray-100 relative">
            <span className="absolute top-2 left-2 bg-emerald-50 text-[10px] px-2 py-0.5 rounded-full text-emerald-800">Original</span>
            {renderIllustration("tree", 130)}
          </div>

          {/* Right Picture with Difference */}
          <div className="p-4 bg-white rounded-3xl border border-gray-100 relative">
            <span className="absolute top-2 left-2 bg-sky-50 text-[10px] px-2 py-0.5 rounded-full text-sky-800">Spot It</span>
            
            <div className="relative">
              {renderIllustration("tree", 130)}
              
              {/* Difference: Hanging Apple */}
              <button
                id="difference-spot"
                onClick={handleSpot}
                className={`absolute w-7 h-7 bg-red-400 border border-red-500 rounded-full cursor-pointer transition-all ${
                  spotDifferences[0].found ? "scale-110 bg-emerald-300 border-emerald-500 ring-4 ring-emerald-100" : "hover:scale-105"
                }`}
                style={{ top: "35%", right: "30%" }}
              >
                {spotDifferences[0].found && <Check size={14} className="text-white mx-auto" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LEVEL 18: VISUAL FOCUS
  if (levelId === 18) {
    const handleStarfishTap = () => {
      audio.playSuccessChime();
      if (starfishCount + 1 >= 3) {
        onComplete();
      } else {
        setStarfishCount(starfishCount + 1);
        setStarfishPosition({ x: 15 + Math.random() * 70, y: 15 + Math.random() * 70 });
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <p className="text-slate-600 font-sans text-sm text-center mb-4">
          Tap the floating star of the sky! Find it 3 times ({starfishCount}/3)
        </p>

        {/* Floating Ocean Box */}
        <div className="w-full h-72 rounded-3xl bg-blue-50/50 relative overflow-hidden border-2 border-dashed border-sky-200">
          {/* Cute passive background bubbles */}
          <div className="absolute w-4 h-4 bg-sky-200/40 rounded-full top-1/4 left-1/3 animate-bounce" />
          <div className="absolute w-6 h-6 bg-sky-200/30 rounded-full top-2/3 left-2/3 animate-pulse" />
          <div className="absolute w-5 h-5 bg-sky-200/40 rounded-full top-1/2 left-10" />

          {/* Target Star */}
          <button
            id="target-starfish"
            onClick={handleStarfishTap}
            className="absolute transition-all duration-300 cursor-pointer p-1 bg-white/40 hover:bg-white rounded-full"
            style={{ top: `${starfishPosition.y}%`, left: `${starfishPosition.x}%`, transform: "translate(-50%, -50%)" }}
          >
            {renderIllustration("star", 48)}
          </button>
        </div>
      </div>
    );
  }

  // LEVEL 19: MIXED SENSORY CHALLENGE
  if (levelId === 19) {
    // Let's run randomized Color, Shape, and Size challenges
    const subChallenges = [
      { id: 1, type: "color", target: PASTEL_COLORS.pastelBlue, options: [PASTEL_COLORS.pastelSageGreen, PASTEL_COLORS.pastelBlue, PASTEL_COLORS.pastelPink], instruction: "Match the blue colour!" },
      { id: 2, type: "shape", target: "star", options: ["circle", "star", "triangle"], instruction: "Find the shining star!" },
      { id: 3, type: "size", target: "big", item: "bear", instruction: "Find the big teddy bear!" }
    ];
    const cur = subChallenges[subRound % subChallenges.length];

    const handleSelect = (val: string) => {
      if (val === cur.target) {
        nextSubRound();
      } else {
        triggerIncorrect();
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <h3 className="text-lg text-slate-700 font-medium mb-6 text-center">{cur.instruction}</h3>

        {cur.type === "color" && (
          <div className="grid grid-cols-3 gap-4 w-full">
            {cur.options.map((opt, i) => (
              <button
                key={i}
                id={`mixed-color-${i}`}
                onClick={() => handleSelect(opt!)}
                className="h-28 rounded-2xl shadow-xs border border-transparent hover:border-gray-200 cursor-pointer active:scale-95"
                style={{ backgroundColor: opt }}
              />
            ))}
          </div>
        )}

        {cur.type === "shape" && (
          <div className="grid grid-cols-3 gap-4 w-full">
            {cur.options.map((opt, i) => (
              <button
                key={i}
                id={`mixed-shape-${i}`}
                onClick={() => handleSelect(opt!)}
                className="p-4 bg-white rounded-2xl shadow-xs border border-gray-100 flex items-center justify-center cursor-pointer active:scale-95"
              >
                {renderIllustration(opt!, 70)}
              </button>
            ))}
          </div>
        )}

        {cur.type === "size" && (
          <div className="flex items-center justify-center gap-12 w-full">
            <button
              id="mixed-size-big"
              onClick={() => handleSelect("big")}
              className="p-5 bg-white rounded-3xl shadow-xs border border-gray-100 flex flex-col items-center cursor-pointer active:scale-95"
            >
              {renderIllustration("bear", 100)}
              <span className="mt-2 text-xs text-slate-400">Big</span>
            </button>
            <button
              id="mixed-size-small"
              onClick={() => handleSelect("small")}
              className="p-5 bg-white rounded-3xl shadow-xs border border-gray-100 flex flex-col items-center cursor-pointer active:scale-95"
            >
              {renderIllustration("bear", 50)}
              <span className="mt-2 text-xs text-slate-400">Small</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // LEVEL 20: SENSORY EXPLORER
  if (levelId === 20) {
    // Grand final challenge:
    // Step 0: Find Calm face
    // Step 1: Match shape triangle
    // Step 2: Complete color pattern
    const steps = [
      { step: 0, instruction: "Step 1: Tap the CALM face.", target: "calm", type: "emotion", options: ["happy", "calm", "sad"] },
      { step: 1, instruction: "Step 2: Tap the TRIANGLE.", target: "triangle", type: "shape", options: ["circle", "square", "triangle"] },
      { step: 2, instruction: "Step 3: Complete the colorful pattern.", target: "flower", type: "pattern", options: ["apple", "flower", "drop"] }
    ];
    const cur = steps[subRound % steps.length];

    const handleSelect = (option: string) => {
      if (option === cur.target) {
        nextSubRound();
      } else {
        triggerIncorrect();
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        <h3 className="text-xl text-emerald-800 font-semibold mb-6 text-center">{cur.instruction}</h3>

        {cur.type === "pattern" && (
          <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-gray-100 mb-6 justify-center">
            {["flower", "drop", "flower", "drop"].map((item, i) => (
              <React.Fragment key={i}>
                <div className="p-1.5">{renderIllustration(item, 40)}</div>
                <ChevronRight size={12} className="text-gray-300" />
              </React.Fragment>
            ))}
            <div className="w-10 h-10 rounded-lg border border-dashed border-sky-300 flex items-center justify-center font-bold text-sky-400">?</div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 w-full">
          {cur.options.map((opt, i) => (
            <button
              key={i}
              id={`final-opt-${i}`}
              onClick={() => handleSelect(opt)}
              className="p-4 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-emerald-200 transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95"
            >
              {renderIllustration(opt, 75)}
              <span className="mt-2 text-xs font-mono text-gray-400 uppercase">{opt}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="p-8 text-center bg-white rounded-3xl border">
      <HelpIcon className="text-amber-500 mx-auto mb-2" size={48} />
      <p className="text-slate-600">This peaceful sensory activity is loading...</p>
    </div>
  );
}
