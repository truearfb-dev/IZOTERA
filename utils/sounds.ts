// Simple Mystical Synthesizer using Web Audio API
// No external assets required.

let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

type SoundType = 'hover' | 'click' | 'success' | 'reveal' | 'ambient';

export const playSound = (type: SoundType) => {
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'hover':
        // Light ethereal ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;

      case 'click':
        // Deep soft thud
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, now);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;

      case 'reveal':
        // Magical swell
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(440, now + 1.5); // A3 to A4
        
        // Add shimmering modulation
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 5; // 5Hz vibrato
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 10;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + 2);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2);
        
        osc.start(now);
        osc.stop(now + 2);
        break;
        
      case 'success':
        // Chime
        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C Major chord
        frequencies.forEach((freq, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.value = freq;
            o.connect(g);
            g.connect(ctx.destination);
            g.gain.setValueAtTime(0.05, now + i * 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
            o.start(now + i * 0.05);
            o.stop(now + 1.5);
        });
        break;
    }
  } catch (e) {
    console.warn("Audio play failed", e);
  }
};