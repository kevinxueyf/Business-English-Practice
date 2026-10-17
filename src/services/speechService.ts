export interface TTSOptions {
  accent?: 'US' | 'UK' | 'IN' | 'JP' | 'AU' | 'EU' | string;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  onBoundary?: (charIndex: number) => void;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.initVoices();
        };
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    if (this.voices.length > 0) {
      this.isInitialized = true;
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  private selectVoiceForAccent(accent?: string): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (voices.length === 0) return null;

    const acc = (accent || 'US').toUpperCase();

    // 针对各口音寻找最佳匹配
    if (acc.includes('IN') || acc.includes('INDIA')) {
      const match = voices.find(v => v.lang.includes('en-IN') || v.name.toLowerCase().includes('india'));
      if (match) return match;
    } else if (acc.includes('UK') || acc.includes('GB')) {
      const match = voices.find(v => v.lang.includes('en-GB') || v.name.toLowerCase().includes('british') || v.name.toLowerCase().includes('uk'));
      if (match) return match;
    } else if (acc.includes('AU') || acc.includes('AUSTRALIA')) {
      const match = voices.find(v => v.lang.includes('en-AU') || v.name.toLowerCase().includes('australia'));
      if (match) return match;
    } else if (acc.includes('JP') || acc.includes('JAPAN')) {
      // 日本口音常可通过特定引擎或特定中立英语实现
      const match = voices.find(v => v.lang.includes('ja-JP') || v.name.toLowerCase().includes('japan') || v.lang.includes('en-JP'));
      if (match) return match;
    }

    // 默认回退到 en-US
    const usVoice = voices.find(v => v.lang.includes('en-US') && !v.name.includes('Google') && v.localService) ||
                    voices.find(v => v.lang.includes('en-US')) ||
                    voices.find(v => v.lang.startsWith('en'));

    return usVoice || voices[0] || null;
  }

  public speak(text: string, options: TTSOptions = {}): void {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      options.onEnd?.();
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    const voice = this.selectVoiceForAccent(options.accent);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;

    // 特殊口音的声学特征补偿微调
    if (options.accent === 'IN') {
      utterance.pitch = (options.pitch ?? 1.0) * 1.08; // 印度口音略升调
      utterance.rate = (options.rate ?? 1.0) * 1.05;
    } else if (options.accent === 'JP') {
      utterance.pitch = (options.pitch ?? 1.0) * 0.96;
      utterance.rate = (options.rate ?? 1.0) * 0.92;
    }

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('TTS utterance encountered an event:', e);
      this.currentUtterance = null;
      options.onError?.(e);
      // Ensure onEnd is called so UI does not hang
      options.onEnd?.();
    };

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.error('Failed to trigger speech synthesis', e);
      options.onEnd?.();
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  public pause(): void {
    if (this.synth) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const speechService = new SpeechService();
