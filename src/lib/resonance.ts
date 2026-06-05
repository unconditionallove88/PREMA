'use client';

/**
 * @fileOverview Resonance Audio Utility.
 * Procedurally generates a heartbeat sound (Lub-Dub) using the Web Audio API.
 * Provides emotional feedback for care interactions.
 */

export const playHeartbeat = () => {
  if (typeof window === 'undefined') return;

  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Beat 1: The "Lub" (Lower, shorter)
    const playFirstBeat = () => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(55, audioCtx.currentTime); 
      oscillator.frequency.exponentialRampToValueAtTime(35, audioCtx.currentTime + 0.12);

      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.12);
    };

    // Beat 2: The "Dub" (Slightly higher, more resonance)
    const playSecondBeat = () => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(50, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.18);

      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.18);
    };

    playFirstBeat();
    setTimeout(playSecondBeat, 140);

    // Close context after a delay to save resources
    setTimeout(() => {
      if (audioCtx.state !== 'closed') audioCtx.close();
    }, 1000);
  } catch (e) {
    console.warn("Audio Resonance unavailable:", e);
  }
};
