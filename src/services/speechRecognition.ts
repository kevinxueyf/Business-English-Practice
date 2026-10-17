// Web Speech API interface declarations
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface RecognitionCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onSilenceTimeout?: () => void;
}

class SpeechRecognitionService {
  private recognition: any = null;
  private isListening = false;
  private silenceTimer: any = null;
  private readonly silenceThresholdMs = 2600; // 自动停顿检测时间

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as unknown as IWindow;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public start(callbacks: RecognitionCallbacks, lang: string = 'en-US'): boolean {
    if (!this.recognition) {
      callbacks.onError?.('当前浏览器不支持内置语音识别，请使用现代 Chrome/Edge 浏览器或点击文字输入');
      return false;
    }

    if (this.isListening) {
      this.stop();
    }

    this.recognition.lang = lang;

    this.recognition.onstart = () => {
      this.isListening = true;
      callbacks.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const currentText = finalTranscript || interimTranscript;
      callbacks.onResult?.(currentText, Boolean(finalTranscript));

      // 重置静音计时器
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
      }
      this.silenceTimer = setTimeout(() => {
        if (this.isListening && currentText.trim().length > 0) {
          callbacks.onSilenceTimeout?.();
        }
      }, this.silenceThresholdMs);
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition event:', event.error);
      if (event.error !== 'no-speech') {
        callbacks.onError?.(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
      }
      callbacks.onEnd?.();
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.error('Failed to start speech recognition', e);
      callbacks.onError?.('无法启动麦克风语音识别，请检查浏览器权限');
      return false;
    }
  }

  public stop(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping speech recognition', e);
      }
    }
    this.isListening = false;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
