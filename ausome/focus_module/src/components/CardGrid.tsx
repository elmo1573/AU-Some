import React from "react";
import { 
  Circle, Square, Triangle, Heart, Star, Diamond, Shield, Moon, Octagon,
  Leaf, Sun, Flower, Cloud, Sparkles, Flame, Snowflake, Droplet, Fish,
  Waves, Anchor, Ship, Compass, Droplets, Wind, Globe, Telescope, Orbit,
  Cat, Dog, Bird, Rabbit, Snail, Bug, Apple, Cherry, Grape, Citrus,
  Sprout, CloudRain, CloudSnow, CloudLightning, Umbrella, Rainbow,
  Music, Mic, AudioLines, Speaker, Disc, Bell, Bot, Cpu, Cable, Wrench,
  Hammer, Battery, Car, Bus, Train, Plane, Truck, Bike
} from "lucide-react";
import { Card } from "../types";

// Dynamic Lucide named component dictionary
const ICON_DICTIONARY: Record<string, React.ComponentType<any>> = {
  Circle, Square, Triangle, Heart, Star, Diamond, Shield, Moon, Octagon,
  Leaf, Sun, Flower, Cloud, Sparkles, Flame, Snowflake, Droplet, Fish,
  Waves, Anchor, Ship, Compass, Droplets, Wind, Globe, Telescope, Orbit,
  Cat, Dog, Bird, Rabbit, Snail, Bug, Apple, Cherry, Grape, Citrus,
  Sprout, CloudRain, CloudSnow, CloudLightning, Umbrella, Rainbow,
  Music, Mic, AudioLines, Speaker, Disc, Bell, Bot, Cpu, Cable, Wrench,
  Hammer, Battery, Car, Bus, Train, Plane, Truck, Bike
};

// Beautiful, sensory-friendly high-contrast pastel colors for matched pairs
const PAIR_COLORS = [
  { bg: "#EAF9EB", border: "#51C057", text: "#1E5821" }, // Soft Sage / Mint Green
  { bg: "#E8F4FD", border: "#3A9CF6", text: "#124B82" }, // Bright Sky Blue
  { bg: "#FEF7D2", border: "#ECC216", text: "#6D5407" }, // Butter Yellow
  { bg: "#FCE4EC", border: "#F05A8D", text: "#8A1C44" }, // Cozy Rose/Pink
  { bg: "#F5EEFD", border: "#A25EEF", text: "#4C1C8C" }, // Gentle Lavender / Purple
  { bg: "#EBF0FF", border: "#5C83FF", text: "#173192" }, // Calming Indigo
  { bg: "#E0F7F6", border: "#18C5BD", text: "#055D59" }, // Soft Turquoise Teal
  { bg: "#FFF0EB", border: "#FF7B54", text: "#842A12" }, // Peach Orange
  { bg: "#F9F8F6", border: "#D5C5B5", text: "#564B40" }, // Soft Warm Oatmeal
  { bg: "#F7FEE7", border: "#84CC16", text: "#365314" }, // Lime Meadow Green
  { bg: "#FFFAEB", border: "#F59E0B", text: "#78350F" }, // Sweet Honey Amber
  { bg: "#FAF5FF", border: "#D946EF", text: "#701A75" }  // Sweet Grape Fuchsia
];

const getPairColor = (cardId: string) => {
  let hash = 0;
  for (let i = 0; i < cardId.length; i++) {
    hash = cardId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PAIR_COLORS.length;
  return PAIR_COLORS[index];
};

interface CardGridProps {
  cards: Card[];
  onCardTap: (index: number) => void;
  isCalmMode?: boolean;
  isSensoryOverloadTriggered?: boolean;
  hintPair: string[] | null;
}

export default function CardGrid({
  cards,
  onCardTap,
  isCalmMode = false,
  isSensoryOverloadTriggered = false,
  hintPair
}: CardGridProps) {
  
  // Custom CSS pattern overlay based on Level 21-30 visual parameters
  const getPatternStyles = (variant?: "solid" | "striped" | "dotted" | "waved") => {
    if (variant === "striped") {
      return {
        backgroundImage: "repeating-linear-gradient(45deg, rgba(94, 75, 117, 0.04) 0px, rgba(94, 75, 117, 0.04) 4px, transparent 4px, transparent 12px)"
      };
    }
    if (variant === "dotted") {
      return {
        backgroundImage: "radial-gradient(rgba(94, 75, 117, 0.08) 15%, transparent 16%)",
        backgroundSize: "8px 8px"
      };
    }
    if (variant === "waved") {
      return {
        backgroundImage: "repeating-linear-gradient(0deg, rgba(94, 75, 117, 0.03) 0px, rgba(94, 75, 117, 0.03) 2px, transparent 2px, transparent 8px)"
      };
    }
    return {};
  };

  return (
    <div 
      className={`grid gap-4 w-full mx-auto justify-center ${
        isSensoryOverloadTriggered ? "p-6 md:p-8" : "p-4"
      } ${
        cards.length <= 6 
          ? "grid-cols-2 sm:grid-cols-3 max-w-xl" 
          : cards.length <= 8 
          ? "grid-cols-2 sm:grid-cols-4 max-w-2xl"
          : cards.length <= 12 
          ? "grid-cols-3 sm:grid-cols-4 max-w-3xl"
          : cards.length <= 16
          ? "grid-cols-4 sm:grid-cols-4 max-w-4xl"
          : "grid-cols-4 sm:grid-cols-5 md:grid-cols-6 max-w-5xl"
      }`}
    >
      {cards.map((card, idx) => {
        const IconComponent = ICON_DICTIONARY[card.iconName] || Star;
        const isFlipped = card.isFlipped || card.isMatched;
        const pairColor = getPairColor(card.id);
        
        // Highlight logic for hints (Optional using coins)
        const isHighlightedHint = hintPair && hintPair.includes(card.id);

        // Responsive card heights
        let cardHeightClass = "h-36 sm:h-44"; // default large
        if (cards.length > 12) {
          cardHeightClass = "h-24 sm:h-28"; // smaller for high density
        } else if (cards.length > 8) {
          cardHeightClass = "h-28 sm:h-36";
        }

        return (
          <div
            id={`card-${idx}`}
            key={`${card.uniqueId}-${idx}`}
            onClick={() => onCardTap(idx)}
            className={`relative rounded-3xl border-4 border-[#7AA676] transition-all cursor-pointer select-none overflow-hidden ${cardHeightClass} ${
              isHighlightedHint ? "ring-8 ring-amber-400 animate-pulse" : ""
            } ${
              isCalmMode 
                ? "" // Plain instant mode
                : isSensoryOverloadTriggered
                ? "duration-700 hover:scale-101" // Slow response
                : "duration-300 hover:scale-103 active:scale-97" // standard responsive
            }`}
            style={{
              perspective: isCalmMode ? "none" : "1000px",
              boxShadow: "0 6px 0 0 #5C7E5A"
            }}
          >
            {/* CARD FRONT / REVEALED STATE */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center p-3 transition-transform ${
                isCalmMode ? "" : isSensoryOverloadTriggered ? "duration-700" : "duration-300"
              }`}
              style={{
                backgroundColor: card.isMatched ? pairColor.bg : "#FEF6C7",
                border: card.isMatched ? `4px solid ${pairColor.border}` : "4px solid #FAD76C",
                transform: isFlipped ? "rotateY(0deg)" : "rotateY(180deg)",
                backfaceVisibility: "hidden",
                ...getPatternStyles(card.styleVariant)
              }}
            >
              {/* Main Matching Icon */}
              <IconComponent 
                className={`w-14 h-14 ${isCalmMode ? "" : "animate-fade-in"}`} 
                style={{ color: card.isMatched ? pairColor.text : "#906D19" }}
              />

              {/* Near-Match Points Indicator (Level 41-50 Details) */}
              {card.points !== undefined && (
                <div className="mt-2 flex items-center space-x-1">
                  {[...Array(card.points)].map((_, dotIdx) => (
                    <span 
                      key={dotIdx} 
                      className="w-2.5 h-2.5 rounded-full border" 
                      style={
                        card.isMatched 
                          ? { backgroundColor: pairColor.text, borderColor: pairColor.border } 
                          : { backgroundColor: "#B08A20", borderColor: "#906D19" }
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* CARD BACK / HIDDEN STATE */}
            <div
              className={`absolute inset-0 bg-[#EBF3EA] border-4 border-[#7AA676] flex items-center justify-center transition-transform ${
                isCalmMode ? "" : isSensoryOverloadTriggered ? "duration-700" : "duration-300"
              }`}
              style={{
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                backfaceVisibility: "hidden"
              }}
            >
              {/* Supportive question mark or simple calm symbol */}
              <div className="w-14 h-14 rounded-full bg-[#FEF6C7] flex items-center justify-center border-4 border-[#FAD76C] shadow-md shadow-amber-900/10">
                <span className="text-3xl font-black text-[#88701B] animate-pulse">?</span>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
