import React, { useState, useEffect } from "react";
import { Bot, Send, Volume2, VolumeX, Sparkles, AlertCircle } from "lucide-react";
import { playCalmSound } from "./SoundManager";

interface AUBotCompanionProps {
  currentLevel: number;
  triggerContext?: "start" | "halfway" | "complete" | "general";
  isCalmMode?: boolean;
}

const PRESET_PROMPTS = [
  "Hello A-U-Bot!",
  "What is this game?",
  "I did a match!",
  "Give me focus power!"
];

export default function AUBotCompanion({
  currentLevel,
  triggerContext = "general",
  isCalmMode = false
}: AUBotCompanionProps) {
  const [speechText, setSpeechText] = useState("Let's find the matching cards together.");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speakVolume, setSpeakVolume] = useState(true);

  // Auto-respond when gameplay context changes
  useEffect(() => {
    let autoPrompt = "";
    if (triggerContext === "start") {
      autoPrompt = `Level ${currentLevel} starts. Say hello and suggest let's find matching cards together calmly.`;
    } else if (triggerContext === "halfway") {
      autoPrompt = "The child is halfway completed. Say a supportive focus encouragement.";
    } else if (triggerContext === "complete") {
      autoPrompt = "The child successfully completed the level. Celebrate and praise their focus!";
    } else {
      return; // skip if generic
    }

    fetchSpeech(autoPrompt, triggerContext);
  }, [triggerContext, currentLevel]);

  const fetchSpeech = async (promptStr: string, context: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptStr,
          triggerContext: context,
          module: "focus",
        }),
      });
      const data = await response.json();
      if (data.responseText || data.answer) {
        setSpeechText(data.responseText || data.answer);
        
        // Synthesize text feedback with soft sound effects
        if (!isCalmMode && speakVolume) {
          playCalmSound("chime", 0.8);
        }
      }
    } catch (err) {
      console.warn("Could not retrieve AI speech response:", err);
      // Fallback response matching standard behavior
      if (context === "start") setSpeechText("Let's search for matching cards together.");
      else if (context === "halfway") setSpeechText("You are doing an awesome job. Keep looking!");
      else if (context === "complete") setSpeechText("Wonderful matching! Let's play another.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPreset = (prompt: string) => {
    fetchSpeech(prompt, "general");
  };

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    fetchSpeech(inputValue, "general");
    setInputValue("");
  };

  return (
    <div className="bg-warm-cream border-4 border-muted-lavender rounded-3xl p-5 shadow-sm space-y-4">
      
      {/* Bot Header */}
      <div className="flex items-center justify-between border-b border-muted-lavender/20 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 bg-soft-blue/20 rounded-2xl border-2 border-soft-blue text-muted-lavender">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-muted-lavender">A-U-Bot Supporting Companion</h3>
            <span className="text-[10px] font-bold text-soft-green bg-soft-green/20 px-2 py-0.5 rounded-full border border-soft-green">
              ACTIVE EXPLORER BUDDY
            </span>
          </div>
        </div>

        {/* Quiet Sound Mute for AI companion */}
        {!isCalmMode && (
          <button
            onClick={() => setSpeakVolume(!speakVolume)}
            className="p-1.5 rounded-lg border border-muted-lavender/30 text-muted-lavender hover:bg-muted-lavender/10"
            title="Toggle Sound"
          >
            {speakVolume ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Speech bubble */}
      <div className="relative p-4 rounded-2xl bg-soft-blue/10 border-2 border-muted-lavender/40 text-sm font-bold text-muted-lavender min-h-[64px] flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-muted-lavender animate-spin" />
            <span className="italic text-xs">A-U-Bot is thinking gently...</span>
          </div>
        ) : (
          <p className="leading-relaxed text-center italic">"{speechText}"</p>
        )}
      </div>

      {/* Preset Fast Prompts */}
      <div className="space-y-2">
        <span className="block text-[10px] font-bold text-muted-lavender/60 uppercase">Say something to your buddy:</span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              disabled={isLoading}
              onClick={() => handleSendPreset(prompt)}
              className="px-3 py-1.5 bg-warm-cream hover:bg-soft-blue/20 disabled:opacity-50 text-xs font-bold text-muted-lavender border border-muted-lavender rounded-lg transition-all active:scale-95 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Text Prompt Form */}
      <form onSubmit={handleCustomSend} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          disabled={isLoading}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a quiet message here..."
          className="flex-1 px-4 py-2 bg-warm-cream rounded-xl border border-muted-lavender text-xs font-bold text-muted-lavender placeholder-muted-lavender/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="p-2.5 bg-soft-green hover:bg-soft-green/90 disabled:opacity-50 text-muted-lavender rounded-xl border-2 border-muted-lavender shadow-sm transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
