class AudioService {
  private audioCtx: AudioContext | null = null;

  private initCtx(): AudioContext | null {
    try {
      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
      return null;
    }
  }

  /**
   * Plays a serene, warm double chime bell tone (ideal for prayer reminder)
   */
  playGentleChime(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Harmonic frequencies for a calming Tibetan/Islamic chime tone
    const freqs = [528, 792, 1056]; // 528Hz Solfeggio tone of clarity

    freqs.forEach((f, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + index * 0.12);

      gain.gain.setValueAtTime(0.001, now + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.18 / (index + 1), now + index * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 2.4);
    });
  }

  /**
   * Plays a melodious Takbeer harmonic sequence: "Allahu Akbar, Allahu Akbar"
   */
  playTakbeerMelody(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    // Melodic notes sequence mimicking authentic Maqam Rast / Bayati Azan intro
    // G4, C5, B4, C5, D5, C5
    const notes = [
      { f: 392.00, d: 0.6 }, // Al-
      { f: 523.25, d: 0.9 }, // la-
      { f: 493.88, d: 0.4 }, // hu
      { f: 523.25, d: 0.8 }, // Ak-
      { f: 587.33, d: 1.1 }, // bar...
      { f: 523.25, d: 0.9 }, //
    ];

    let start = ctx.currentTime + 0.05;

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.22, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + note.d + 0.05);

      start += note.d * 0.85;
    });
  }

  /**
   * Soft notification beep
   */
  playNotificationBeep(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1174.66, now + 0.1);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * Celebration sound when Sadqa is logged
   */
  playSadqaJoyTone(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  }

  playByType(type: 'takbeer' | 'beep' | 'gentle' | 'silent'): void {
    if (type === 'silent') return;
    if (type === 'takbeer') this.playTakbeerMelody();
    else if (type === 'beep') this.playNotificationBeep();
    else this.playGentleChime();
  }
}

export const audioService = new AudioService();
