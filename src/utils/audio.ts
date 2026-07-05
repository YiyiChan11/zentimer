// ──────────────────────────────────────────────
// ZenTimer — Audio Engine
// Uses Web Audio API for precise, file-free sound generation.
// All tones are synthesised at runtime — no audio assets needed.
// ──────────────────────────────────────────────

type SoundType = 'ding' | 'start' | 'complete' | 'tick' | 'chime'

class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private volume = 50 // 0–100

  /** Lazily create AudioContext (must be after user gesture) */
  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AC()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = this.gainValue()
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  /** Convert 0–100 volume to gain (logarithmic scale for natural perception) */
  private gainValue(): number {
    // Volume can go very loud — at 100% we use gain 1.5
    // Logarithmic curve so perceived loudness is smooth
    const v = this.volume / 100
    if (v === 0) return 0
    return Math.pow(v, 2) * 1.5
  }

  /** Set master volume 0–100 */
  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(100, vol))
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.gainValue(),
        this.ctx.currentTime,
        0.05,
      )
    }
  }

  getVolume(): number {
    return this.volume
  }

  /** Initialise / unlock audio (call on first user interaction) */
  unlock(): void {
    this.ensureContext()
  }

  /** Play a pure tone with envelope */
  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    delay = 0,
    gainMult = 1,
  ): void {
    const ctx = this.ensureContext()
    if (!this.masterGain) return

    const t0 = ctx.currentTime + delay
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.value = freq

    // Envelope: attack → sustain → release
    const attack = 0.01
    const release = duration * 0.6
    gain.gain.setValueAtTime(0, t0)
    gain.gain.linearRampToValueAtTime(0.5 * gainMult, t0 + attack)
    gain.gain.linearRampToValueAtTime(0.3 * gainMult, t0 + duration * 0.3)
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration + release)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(t0)
    osc.stop(t0 + duration + release + 0.1)
  }

  /** Play a specific sound type */
  play(type: SoundType): void {
    this.ensureContext()
    if (!this.ctx || !this.masterGain) return

    switch (type) {
      case 'ding':
        // Crystal-clear bell ding — two harmonic partials
        this.playTone(1318.51, 0.5, 'sine', 0, 1.0)   // E6
        this.playTone(2637.02, 0.4, 'sine', 0.005, 0.4) // E7
        this.playTone(659.25, 0.6, 'sine', 0, 0.5)     // E5
        break

      case 'start':
        // Gentle ascending two-tone
        this.playTone(523.25, 0.2, 'sine', 0, 0.6)     // C5
        this.playTone(783.99, 0.3, 'sine', 0.12, 0.6)   // G5
        break

      case 'complete':
        // Satisfying completion chime — major triad arpeggio
        this.playTone(523.25, 0.3, 'sine', 0, 0.7)      // C5
        this.playTone(659.25, 0.3, 'sine', 0.1, 0.7)    // E5
        this.playTone(783.99, 0.3, 'sine', 0.2, 0.7)    // G5
        this.playTone(1046.50, 0.6, 'sine', 0.3, 0.8)   // C6
        break

      case 'tick':
        // Soft tick
        this.playTone(2000, 0.03, 'square', 0, 0.15)
        break

      case 'chime':
        // Wind-chime-like — multiple partials
        this.playTone(1760, 0.4, 'sine', 0, 0.5)
        this.playTone(2349, 0.4, 'sine', 0.08, 0.4)
        this.playTone(2637, 0.5, 'sine', 0.16, 0.35)
        this.playTone(3520, 0.3, 'sine', 0.24, 0.2)
        break
    }
  }

  /** Test the current volume with a sample ding */
  testVolume(): void {
    this.play('ding')
  }
}

// Singleton instance
export const audioEngine = new AudioEngine()
