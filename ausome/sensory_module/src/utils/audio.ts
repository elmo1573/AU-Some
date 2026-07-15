// Web Audio API Synthesizer for Calm Nature Sounds and Feedback Chimes
// Fully offline, no external assets needed.

let audioCtx: AudioContext | null = null;
let currentBackgroundNode: AudioNode | null = null;
let bgGainNode: GainNode | null = null;
let isMuted = false;

// Initialize or resume AudioContext
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Generate White Noise Buffer
function createWhiteNoiseBuffer(ctx: AudioContext, duration = 2.0) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

// Generate Pink Noise Buffer (softer, better for rain/waves)
function createPinkNoiseBuffer(ctx: AudioContext, duration = 2.0) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    
    data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    data[i] *= 0.11; // estimate volume compensation
    b6 = white * 0.115926;
  }
  return buffer;
}

// Play gentle success chime (pentatonic sparkling wind chimes)
export function playSuccessChime() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // We play 3 rising soft bell-like notes to create a warm, non-startling success sound
    const notes = [329.63, 392.00, 523.25]; // E4, G4, C5 (C Major pentatonic harmony)
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + index * 0.12);
      
      gain.gain.setValueAtTime(0, now + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.12, now + index * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.9);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 1.0);
    });
  } catch (e) {
    console.error("Failed to play success chime", e);
  }
}

// Play soft encouraging retry purr
export function playEncouragementPurr() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Very low-frequency, soft harmonic sound - feels warm and reassuring like a gentle hug
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(120, now); // Comforting low hum
    osc.frequency.linearRampToValueAtTime(135, now + 0.4);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.5);
  } catch (e) {
    console.error("Failed to play retry chime", e);
  }
}

// Play a single birdsong chirp (for Level 6 audio matching, or ambient playback)
export function playBirdChirp(timeOffset = 0, volume = 0.15) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime + timeOffset;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    // Bird chirp is a quick sweep up and down in high frequencies
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(3200, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.2);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    console.error(e);
  }
}

// Play soft rain droplet sounds (for Level 6 audio matching, or ambient)
export function playRainDroplet(timeOffset = 0, volume = 0.1) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime + timeOffset;
    
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.01);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);
    
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {
    console.error(e);
  }
}

// Play rustling leaves sound
export function playLeafRustle(timeOffset = 0, volume = 0.12) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime + timeOffset;
    
    const bufferSource = ctx.createBufferSource();
    bufferSource.buffer = createWhiteNoiseBuffer(ctx, 0.4);
    
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2500, now);
    filter.Q.setValueAtTime(3.0, now);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    bufferSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    bufferSource.start(now);
    bufferSource.stop(now + 0.4);
  } catch (e) {
    console.error(e);
  }
}

// Play wind blow sound
export function playWindBlow(timeOffset = 0, duration = 1.5, volume = 0.15) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime + timeOffset;
    
    const bufferSource = ctx.createBufferSource();
    bufferSource.buffer = createPinkNoiseBuffer(ctx, duration);
    
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, now);
    // Smoothly modulate filter frequency for wind-like gusting
    filter.frequency.exponentialRampToValueAtTime(800, now + duration * 0.4);
    filter.frequency.exponentialRampToValueAtTime(300, now + duration * 0.85);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    bufferSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    bufferSource.start(now);
    bufferSource.stop(now + duration);
  } catch (e) {
    console.error(e);
  }
}

// Play flowing water bubble sound
export function playWaterBubble(timeOffset = 0, volume = 0.1) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime + timeOffset;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    // Bubble popping frequency sweep
    const baseFreq = 400 + Math.random() * 200;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.08);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.12);
  } catch (e) {
    console.error(e);
  }
}

// Stop any currently playing background sound
export function stopBackgroundSound() {
  if (currentBackgroundNode) {
    try {
      (currentBackgroundNode as AudioScheduledSourceNode).stop();
    } catch (e) {}
    currentBackgroundNode = null;
  }
}

// Play one of the gentle ambient background tracks loops
export function playBackgroundSound(type: 'rain' | 'waves' | 'birds' | 'wind' | 'water') {
  stopBackgroundSound();
  if (isMuted) return;
  
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    bgGainNode = ctx.createGain();
    bgGainNode.gain.setValueAtTime(0.01, now);
    bgGainNode.gain.linearRampToValueAtTime(0.15, now + 1.0); // smooth fade in
    bgGainNode.connect(ctx.destination);
    
    if (type === 'rain') {
      // Continuous pink noise + occasional soft droplets
      const bufferSource = ctx.createBufferSource();
      bufferSource.buffer = createPinkNoiseBuffer(ctx, 4.0);
      bufferSource.loop = true;
      
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(650, now);
      
      bufferSource.connect(filter);
      filter.connect(bgGainNode);
      
      bufferSource.start(now);
      currentBackgroundNode = bufferSource;
      
      // Schedule some droplets
      const interval = setInterval(() => {
        if (isMuted || currentBackgroundNode !== bufferSource) {
          clearInterval(interval);
          return;
        }
        if (Math.random() > 0.4) {
          playRainDroplet(0, 0.05 + Math.random() * 0.05);
        }
      }, 350);
      
    } else if (type === 'waves') {
      // Swelling ocean waves noise
      const bufferSource = ctx.createBufferSource();
      bufferSource.buffer = createPinkNoiseBuffer(ctx, 6.0);
      bufferSource.loop = true;
      
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(250, now);
      
      // Sweep lowpass back and forth every 6 seconds to match the wave loop
      const modulator = ctx.createOscillator();
      modulator.frequency.setValueAtTime(1 / 6, now); // 6 second wave cycles
      
      const modulatorGain = ctx.createGain();
      modulatorGain.gain.setValueAtTime(250, now); // Sweeping range: 250Hz - 500Hz
      
      modulator.connect(modulatorGain);
      modulatorGain.connect(filter.frequency);
      
      bufferSource.connect(filter);
      filter.connect(bgGainNode);
      
      modulator.start(now);
      bufferSource.start(now);
      currentBackgroundNode = bufferSource;
      
    } else if (type === 'wind') {
      // Smooth continuous wind gusting
      const bufferSource = ctx.createBufferSource();
      bufferSource.buffer = createPinkNoiseBuffer(ctx, 5.0);
      bufferSource.loop = true;
      
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, now);
      
      const modulator = ctx.createOscillator();
      modulator.frequency.setValueAtTime(0.12, now); // Slow wind oscillation
      
      const modulatorGain = ctx.createGain();
      modulatorGain.gain.setValueAtTime(150, now);
      
      modulator.connect(modulatorGain);
      modulatorGain.connect(filter.frequency);
      
      bufferSource.connect(filter);
      filter.connect(bgGainNode);
      
      modulator.start(now);
      bufferSource.start(now);
      currentBackgroundNode = bufferSource;
      
    } else if (type === 'birds') {
      // Gentle soft bird ambient chirping (no constant sound, just random gentle chirps)
      const bufferSource = ctx.createBufferSource();
      // Dummy short silence buffer to hold background process
      bufferSource.buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      bufferSource.loop = true;
      
      bufferSource.connect(bgGainNode);
      bufferSource.start(now);
      currentBackgroundNode = bufferSource;
      
      const interval = setInterval(() => {
        if (isMuted || currentBackgroundNode !== bufferSource) {
          clearInterval(interval);
          return;
        }
        if (Math.random() > 0.5) {
          // Play 1 to 3 soft chirps
          const count = 1 + Math.floor(Math.random() * 3);
          for (let i = 0; i < count; i++) {
            playBirdChirp(i * 0.15, 0.03 + Math.random() * 0.04);
          }
        }
      }, 3000);
      
    } else if (type === 'water') {
      // Flowing stream bubbling sound
      const bufferSource = ctx.createBufferSource();
      bufferSource.buffer = createPinkNoiseBuffer(ctx, 4.0);
      bufferSource.loop = true;
      
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, now);
      
      bufferSource.connect(filter);
      filter.connect(bgGainNode);
      
      bufferSource.start(now);
      currentBackgroundNode = bufferSource;
      
      const interval = setInterval(() => {
        if (isMuted || currentBackgroundNode !== bufferSource) {
          clearInterval(interval);
          return;
        }
        // Bubble pops
        const count = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          playWaterBubble(i * 0.08, 0.04 + Math.random() * 0.04);
        }
      }, 400);
    }
  } catch (e) {
    console.error("Failed to start ambient background sound", e);
  }
}

// Toggle Mute State
export function setMuteState(muted: boolean) {
  isMuted = muted;
  if (isMuted) {
    stopBackgroundSound();
  }
}

export function getMuteState() {
  return isMuted;
}
