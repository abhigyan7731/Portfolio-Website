class SynthEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.droneOsc = null;
    this.droneFilter = null;
    this.isMuted = true;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.5;

      // Background Synth Drone
      this.droneOsc = this.ctx.createOscillator();
      this.droneOsc.type = 'sawtooth';
      this.droneOsc.frequency.value = 43.65; // Deep F1 note

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.value = 150;
      this.droneFilter.Q.value = 2;

      this.droneOsc.connect(this.droneFilter);
      this.droneFilter.connect(this.masterGain);
      
      this.droneOsc.start();
      
      // Smoothly rotate the filter to create a slow pulsating LFO effect
      setInterval(() => {
          if(!this.isMuted && this.ctx) {
              const val = 100 + Math.random() * 200;
              this.droneFilter.frequency.setTargetAtTime(val, this.ctx.currentTime, 4);
          }
      }, 4000);
      
      this.setMute(true);
      this.initialized = true;
    } catch(e) {
      console.log("Web Audio API not supported", e);
    }
  }

  setMute(muted) {
    if (!this.initialized) this.init();
    
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.3, this.ctx.currentTime, 1);
    }
    // Browsers require a resume after user interaction
    if (!muted && this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playHover() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playClick() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }
}

export const audioAPI = typeof window !== "undefined" ? new SynthEngine() : null;
