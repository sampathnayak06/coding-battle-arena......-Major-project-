// Centralized AAA Audio Manager using WebAudio API
// Provides rich synth sound effects for UI, combat, combos, countdowns, and low HP feedback

class AudioManager {
  constructor() {
    this.ctx = null;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;
    this.isMuted = false;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playTone({ freq = 440, type = "sine", duration = 0.1, volume = 0.2, decay = 0.08, detune = 0, targetFreq = null } = {}) {
    if (this.isMuted) return;
    const c = this.ensureContext();
    if (!c) return;

    try {
      const now = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (targetFreq !== null) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, targetFreq), now + duration);
      }
      if (detune) osc.detune.setValueAtTime(detune, now);

      const effectiveVolume = volume * this.sfxVolume;
      gain.gain.setValueAtTime(effectiveVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay + duration);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start(now);
      osc.stop(now + duration + decay + 0.02);
    } catch (e) {
      console.warn("[AudioManager] PlayTone error:", e);
    }
  }

  // --- Sound Library ---
  playClick() {
    this.playTone({ freq: 800, type: "sine", duration: 0.04, volume: 0.15, decay: 0.03 });
  }

  playHover() {
    this.playTone({ freq: 400, type: "sine", duration: 0.03, volume: 0.08, decay: 0.02 });
  }

  playCountdownTick() {
    this.playTone({ freq: 600, type: "sine", duration: 0.08, volume: 0.2, decay: 0.05 });
  }

  playFightStart() {
    this.playTone({ freq: 220, targetFreq: 880, type: "sawtooth", duration: 0.35, volume: 0.35, decay: 0.2 });
    setTimeout(() => {
      this.playTone({ freq: 880, type: "triangle", duration: 0.2, volume: 0.3, decay: 0.15 });
    }, 150);
  }

  playCorrect() {
    this.playTone({ freq: 523.25, type: "triangle", duration: 0.1, volume: 0.25, decay: 0.1 }); // C5
    setTimeout(() => {
      this.playTone({ freq: 659.25, type: "triangle", duration: 0.1, volume: 0.25, decay: 0.1 }); // E5
    }, 80);
    setTimeout(() => {
      this.playTone({ freq: 783.99, type: "triangle", duration: 0.18, volume: 0.3, decay: 0.15 }); // G5
    }, 160);
  }

  playIncorrect() {
    this.playTone({ freq: 180, targetFreq: 110, type: "sawtooth", duration: 0.25, volume: 0.3, decay: 0.2 });
    setTimeout(() => {
      this.playTone({ freq: 130, targetFreq: 85, type: "sawtooth", duration: 0.3, volume: 0.25, decay: 0.2 });
    }, 120);
  }

  playCombo(level = 1) {
    const baseFreq = 440 + level * 70;
    this.playTone({ freq: baseFreq, targetFreq: baseFreq + 140, type: "sine", duration: 0.15, volume: 0.25, decay: 0.1 });
  }

  playCriticalHit() {
    this.playTone({ freq: 150, targetFreq: 600, type: "sawtooth", duration: 0.15, volume: 0.35, decay: 0.1 });
    setTimeout(() => {
      this.playTone({ freq: 900, targetFreq: 1200, type: "triangle", duration: 0.2, volume: 0.4, decay: 0.15 });
    }, 80);
  }

  playDamageDealt() {
    this.playTone({ freq: 300, targetFreq: 150, type: "square", duration: 0.12, volume: 0.2, decay: 0.08 });
  }

  playDamageTaken() {
    this.playTone({ freq: 140, targetFreq: 70, type: "sawtooth", duration: 0.2, volume: 0.3, decay: 0.15 });
  }

  playLowHpWarning() {
    this.playTone({ freq: 110, targetFreq: 90, type: "sine", duration: 0.25, volume: 0.35, decay: 0.2 });
  }

  playReward() {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone({ freq, type: "sine", duration: 0.12, volume: 0.2, decay: 0.1 });
      }, idx * 60);
    });
  }

  playWin() {
    const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    arpeggio.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone({ freq, type: "triangle", duration: 0.2, volume: 0.3, decay: 0.15 });
      }, idx * 90);
    });
  }

  playDefeat() {
    const notes = [392.0, 369.99, 349.23, 329.63]; // G4, F#4, F4, E4
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone({ freq, type: "sawtooth", duration: 0.25, volume: 0.25, decay: 0.2 });
      }, idx * 140);
    });
  }
}

export const audioManager = new AudioManager();
export default audioManager;
