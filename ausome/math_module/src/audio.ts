/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioController {
  private ctx: AudioContext | null = null;
  private ambientOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private mainGain: GainNode | null = null;
  private isMusicPlaying = false;
  private isMuted = false;
  private activeThemeTimer: number | null = null;

  constructor() {
    // Lazy initialize when user interacts
  }

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.mainGain = this.ctx.createGain();
        this.mainGain.connect(this.ctx.destination);
        this.mainGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime);
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.mainGain && this.ctx) {
      this.mainGain.gain.setValueAtTime(muted ? 0 : 0.15, this.ctx.currentTime);
    }
  }

  // Play a very soft, sensory-safe bell chime (perfect for stars or coins)
  public playSoftBell() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (very soft, sweet chord)
    
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.mainGain) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine'; // Pure sine wave is softest
      osc.frequency.setValueAtTime(freq, now + idx * 0.08); // Arpeggiated
      
      // Gentle slope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.05 + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.08);
      
      osc.connect(gain);
      gain.connect(this.mainGain);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + 1.5 + idx * 0.08);
    });
  }

  // Quiet click/tap for dragging or selecting cards
  public playSoftTap() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, now); // E4
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.mainGain!);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // A supportive, warm low-pitch success chime for completing standard tasks
  public playSuccessTone() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const chord = [349.23, 440.00, 523.25, 698.46]; // F4, A4, C5, F5 (gentle, warm major)
    
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.mainGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle'; // Warmer, rounder sound
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.08 + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8 + idx * 0.06);

      osc.connect(gain);
      gain.connect(this.mainGain);

      osc.start(now + idx * 0.06);
      osc.stop(now + 1.0 + idx * 0.06);
    });
  }

  // A soft, low, consoling tone for encouraging retry (never harsh or critical)
  public playEncourageTone() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const chord = [392.00, 493.88, 587.33]; // G4, B4, D5 (soft, cozy warm triad, forward-looking)
    
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.mainGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.015, now + 0.05 + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6 + idx * 0.04);

      osc.connect(gain);
      gain.connect(this.mainGain);

      osc.start(now + idx * 0.04);
      osc.stop(now + 0.8 + idx * 0.04);
    });
  }

  // Background Ambient Lullaby Synth
  public startAmbientMusic() {
    this.initContext();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const playAmbientPhrase = () => {
      if (!this.isMusicPlaying || !this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      // Dreamy pentatonic progressions
      const progressions = [
        [261.63, 329.63, 392.00, 493.88], // C Maj7 (C4, E4, G4, B4)
        [349.23, 440.00, 523.25, 659.25], // F Maj7 (F4, A4, C5, E5)
        [293.66, 349.23, 440.00, 587.33], // D min7 (D4, F4, A4, D5)
        [329.63, 392.00, 493.88, 659.25], // E min7 (E4, G4, B4, E5)
      ];

      const chord = progressions[Math.floor(Math.random() * progressions.length)];
      
      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.mainGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.4);

        // Extremely quiet, slow swell
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.006, now + 1.2 + idx * 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5 + idx * 0.4);

        osc.connect(gain);
        gain.connect(this.mainGain);

        osc.start(now + idx * 0.4);
        osc.stop(now + 5.0 + idx * 0.4);
      });

      // Schedule next phrase in 6 seconds
      this.activeThemeTimer = window.setTimeout(playAmbientPhrase, 6000);
    };

    playAmbientPhrase();
  }

  public stopAmbientMusic() {
    this.isMusicPlaying = false;
    if (this.activeThemeTimer) {
      clearTimeout(this.activeThemeTimer);
      this.activeThemeTimer = null;
    }
  }

  // Speech Narration Wrapper (Sensory-safe speed and pitch)
  public speak(text: string, voiceEnabled: boolean) {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop current speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05; // Slightly faster, high energy!
      utterance.pitch = 1.30; // Very friendly, energetic, cute high-pitch voice suitable for toddlers
      utterance.volume = 1.0;

      // Try to find a friendly native-sounding voice if possible
      const voices = window.speechSynthesis.getVoices();
      const friendlyVoice = voices.find(v => 
        v.lang.startsWith('en') && 
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Microsoft'))
      );
      if (friendlyVoice) {
        utterance.voice = friendlyVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed', e);
    }
  }

  public stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audio = new AudioController();
