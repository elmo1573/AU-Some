import { LanguageCode } from '../types';

const LANG_VOICE_MAP: Record<LanguageCode, string[]> = {
  en: ['en-US', 'en-GB', 'en-AU', 'en'],
  es: ['es-ES', 'es-MX', 'es-US', 'es'],
  de: ['de-DE', 'de'],
  zh: ['zh-CN', 'zh-HK', 'zh-TW', 'zh'],
  ar: ['ar-SA', 'ar-EG', 'ar-AE', 'ar'],
};

/**
 * Speaks a word or phrase in the specified language, using the best available voice.
 * Fallback to default speech if language-specific voices aren't fully loaded.
 */
export function speakText(text: string, langCode: LanguageCode, voicePackType: string = 'natural') {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('Speech synthesis not supported in this environment.');
    return;
  }

  // Cancel any ongoing speech to prevent sensory overload/overlap
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to find matching voice
  const voices = window.speechSynthesis.getVoices();
  const targetLocales = LANG_VOICE_MAP[langCode] || ['en-US'];
  
  let selectedVoice: SpeechSynthesisVoice | null = null;
  
  // Loop through preferences to find a voice that matches
  for (const locale of targetLocales) {
    selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(locale.toLowerCase())) || null;
    if (selectedVoice) break;
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  // Soften parameters for sensitive ears (Autism-friendly)
  // Moderate speed (slightly slower for clear processing) and pleasant pitch
  utterance.rate = voicePackType === 'slower' ? 0.75 : 0.88; 
  utterance.pitch = voicePackType === 'high' ? 1.15 : 1.0; 
  utterance.volume = 0.9;

  window.speechSynthesis.speak(utterance);
}

/**
 * Triggers a soft sensory chime using Web Audio API for rewarding correct answers
 * without loud or jarring buzzer sounds.
 */
export function playSensoryChime(type: 'success' | 'click' | 'streak' | 'star') {
  if (typeof window === 'undefined') return;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    const ctx = new AudioContextClass();
    
    if (type === 'success') {
      // Warm pentatonic double chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.12); // G5

      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    } else if (type === 'click') {
      // Soft woodblock tick
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'star') {
      // Magical sparkly twinkle chime
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.05, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
      });
    }
  } catch (err) {
    console.warn('Audio chime playing was blocked or failed:', err);
  }
}
