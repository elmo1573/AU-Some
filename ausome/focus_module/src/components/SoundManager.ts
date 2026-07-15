// Dynamic Synthesizer of Calm, Autism-Friendly Sounds using Web Audio API

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export type SoundType = "wood" | "bell" | "water" | "chime" | "piano";

export const playCalmSound = (
  type: SoundType,
  volumeScale: number = 1.0, // Used to reduce volume dynamically during sensory overload
  isMuted: boolean = false
) => {
  if (isMuted || volumeScale <= 0) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Main Volume Node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.08 * volumeScale, now); // default soft baseline
    masterGain.connect(ctx.destination);

    if (type === "wood") {
      // Wood tap: organic, dry, low-resonance
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gainNode.gain.setValueAtTime(1.0, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gainNode);
      gainNode.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.09);
    } 
    else if (type === "bell") {
      // Warm, ringing, soft hand-bell
      const frequencies = [523.25, 783.99, 1046.50]; // Harmonics of C5
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        
        const individualVolume = idx === 0 ? 1.0 : 0.4 / idx;
        gainNode.gain.setValueAtTime(individualVolume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gainNode);
        gainNode.connect(masterGain);
        osc.start(now);
        osc.stop(now + 1.3);
      });
    } 
    else if (type === "water") {
      // Calm water drop: pitch sweep upwards
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);

      gainNode.gain.setValueAtTime(1.0, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gainNode);
      gainNode.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.13);
    } 
    else if (type === "chime") {
      // Wind chime: airy and sparkling
      const frequencies = [880, 987.77, 1174.66, 1318.51]; // High clean tones
      // Pick a random frequency from the set to simulate wind movement
      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(0.6, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc.connect(gainNode);
      gainNode.connect(masterGain);
      osc.start(now);
      osc.stop(now + 1.6);
    } 
    else if (type === "piano") {
      // Soft gentle piano note (Major C triad tones randomly)
      const pitches = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      const freq = pitches[Math.floor(Math.random() * pitches.length)];

      const osc = ctx.createOscillator();
      const oscSub = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      oscSub.type = "triangle"; // gives body to the tone
      oscSub.frequency.setValueAtTime(freq / 2, now); // sub-octave

      gainNode.gain.setValueAtTime(0.8, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gainNode);
      oscSub.connect(gainNode);
      gainNode.connect(masterGain);

      osc.start(now);
      oscSub.start(now);
      osc.stop(now + 0.9);
      oscSub.stop(now + 0.9);
    }
  } catch (error) {
    console.warn("Web Audio API is not supported or was blocked by browser autoplay rules.", error);
  }
};

// Soothing vocal speech synthesis praise for autism-friendly encouragement
export const speakPraise = (
  specificText?: string,
  isMuted: boolean = false
) => {
  if (isMuted || !("speechSynthesis" in window)) return;

  try {
    // Cancel any previous speech immediately to avoid overlapping audio and sensory overload
    window.speechSynthesis.cancel();

    const randomPhrases = [
      "Good job!",
      "Well done!",
      "Super star!",
      "Great matching!",
      "Wonderful focus!",
      "Fantastic!"
    ];
    
    const text = specificText || randomPhrases[Math.floor(Math.random() * randomPhrases.length)];
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Slow down speed slightly (0.85) to make it highly digestible and reassuring
    utterance.rate = 0.85;
    utterance.pitch = 1.15; // friendly, warm tone
    utterance.volume = 0.7; // soft and comforting baseline

    // Match friendly English voices if they are available
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(
      (v) => 
        (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Zira")) && 
        v.lang.startsWith("en")
    ) || voices.find((v) => v.lang.startsWith("en"));

    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("Speech Synthesis failed or is blocked by user gestures", e);
  }
};

