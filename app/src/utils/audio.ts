/**
 * Retro Sound Engine
 * Synthesizes 8-bit style sound effects using the Web Audio API.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      const AudioContextCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextCtor();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // --- Tetris Sounds ---
  move() { this.playTone(150, 'square', 0.05, 0.05); }
  rotate() { this.playTone(300, 'square', 0.05, 0.05); }
  clear() {
    this.playTone(400, 'square', 0.1, 0.1);
    setTimeout(() => this.playTone(600, 'square', 0.1, 0.1), 50);
    setTimeout(() => this.playTone(800, 'square', 0.2, 0.1), 100);
  }
  gameOver() {
    this.playTone(200, 'sawtooth', 0.5, 0.1);
    setTimeout(() => this.playTone(150, 'sawtooth', 0.5, 0.1), 200);
    setTimeout(() => this.playTone(100, 'sawtooth', 1.0, 0.1), 400);
  }

  // --- Minesweeper Sounds ---
  reveal() { this.playTone(600, 'sine', 0.05, 0.05); }
  flag() { this.playTone(800, 'sine', 0.1, 0.05); }
  explode() {
    this.init();
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }
}

export const sfx = new AudioEngine();
