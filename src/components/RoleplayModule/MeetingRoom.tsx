import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Send, 
  ShieldAlert, 
  Volume2, 
  HandMetal,
  Radio,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { RoleplayScenario, SpeechEvaluationResult } from '../../types';
import { speechService } from '../../services/speechService';
import { speechRecognitionService } from '../../services/speechRecognition';
import { geminiService } from '../../services/geminiService';
import { storageService } from '../../services/storageService';

interface MeetingRoomProps {
  scenario: RoleplayScenario;
  onFinishMeeting: (evaluation: SpeechEvaluationResult) => void;
  onSwitchScenario?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  status?: string;
}

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
  scenario,
  onFinishMeeting
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [turnCount, setTurnCount] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMsg: ChatMessage = {
      id: 'm-init',
      sender: 'ai',
      text: scenario.initialMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initMsg]);
    setTurnCount(0);

    setTimeout(() => {
      speakAiLine(scenario.initialMessage);
    }, 400);

    return () => {
      speechService.stop();
      speechRecognitionService.stop();
    };
  }, [scenario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveTranscript]);

  const speakAiLine = (text: string) => {
    setIsAiSpeaking(true);
    speechService.speak(text, {
      accent: scenario.persona.accent,
      rate: scenario.persona.voiceRate,
      pitch: scenario.persona.voicePitch,
      onEnd: () => setIsAiSpeaking(false),
      onError: () => setIsAiSpeaking(false)
    });
  };

  const handleInterruptAi = () => {
    speechService.stop();
    setIsAiSpeaking(false);
    startVoiceRecording();
  };

  const startVoiceRecording = () => {
    if (isAiSpeaking) {
      speechService.stop();
      setIsAiSpeaking(false);
    }

    setLiveTranscript('');
    const started = speechRecognitionService.start({
      onStart: () => setIsListening(true),
      onResult: (text) => {
        setLiveTranscript(text);
        setInputText(text);
      },
      onSilenceTimeout: () => {
        if (inputText.trim() || liveTranscript.trim()) {
          handleSendMessage(inputText || liveTranscript);
        }
      },
      onEnd: () => setIsListening(false),
      onError: (err) => {
        console.warn('Recognition error:', err);
        setIsListening(false);
      }
    });

    if (!started) {
      setIsListening(false);
    }
  };

  const stopVoiceRecording = () => {
    speechRecognitionService.stop();
    setIsListening(false);
    if (inputText.trim()) {
      handleSendMessage(inputText);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const speech = (textToSend || inputText).trim();
    if (!speech) return;

    speechRecognitionService.stop();
    setIsListening(false);
    setInputText('');
    setLiveTranscript('');

    const userMsg: ChatMessage = {
      id: `m-u-${Date.now()}`,
      sender: 'user',
      text: speech,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setTurnCount(prev => prev + 1);

    try {
      const aiReplyData = await geminiService.generateRoleplayResponse({
        scenario,
        history: newHistory.map(m => ({
          speaker: m.sender === 'ai' ? scenario.persona.name : 'User',
          text: m.text
        })),
        userSpeech: speech
      });

      const aiMsg: ChatMessage = {
        id: `m-a-${Date.now()}`,
        sender: 'ai',
        text: aiReplyData.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: aiReplyData.objectionType
      };

      setMessages(prev => [...prev, aiMsg]);
      speakAiLine(aiReplyData.reply);
    } catch (e) {
      console.error(e);
    }
  };

  const handleWrapUpAndEvaluate = async () => {
    speechService.stop();
    speechRecognitionService.stop();
    setIsEvaluating(true);

    const allUserSpeeches = messages
      .filter(m => m.sender === 'user')
      .map(m => m.text)
      .join(' ');

    const finalSpeech = allUserSpeeches || 'I propose we align on the phased milestone to protect our timeline.';

    try {
      const evaluation = await geminiService.evaluateSpeech({
        level: scenario.level,
        userSpeech: finalSpeech,
        scenarioContext: `${scenario.title}: ${scenario.background}`,
        userGoal: scenario.userGoal,
        personaTitle: `${scenario.persona.name} (${scenario.persona.title})`
      });

      evaluation.diagnostic.grammarIssues.forEach(issue => {
        storageService.addWeakness({
          type: 'grammar',
          item: issue.original,
          context: scenario.title,
          correction: issue.corrected,
          level: scenario.level
        });
      });

      onFinishMeeting(evaluation);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[calc(100vh-210px)] min-h-[480px] sm:h-[720px] relative">
      {/* Meeting Header Bar */}
      <div className="bg-slate-850 border-b border-slate-700/80 px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={scenario.persona.avatar}
              alt={scenario.persona.name}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-indigo-500/60 shadow-md"
            />
            {isAiSpeaking && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                {scenario.persona.name}
              </h3>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shrink-0">
                {scenario.persona.accentLabel.split('(')[0].trim()}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate">
              {scenario.persona.title}
            </p>
          </div>
        </div>

        {/* End & Evaluate Button */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={handleWrapUpAndEvaluate}
            disabled={isEvaluating}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            {isEvaluating ? (
              <span>诊断中...</span>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>看评分</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Goal Banner */}
      <div className="bg-slate-800/60 border-b border-slate-700/50 px-3 sm:px-5 py-2 flex items-center justify-between text-[11px] sm:text-xs gap-2">
        <div className="flex items-center space-x-1.5 min-w-0">
          <span className="font-bold text-amber-400 shrink-0">目标:</span>
          <span className="text-slate-200 truncate">{scenario.userGoal}</span>
        </div>
        <div className="text-[10px] text-slate-400 shrink-0">
          第 <span className="text-sky-400 font-bold">{turnCount}</span> 轮
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-slate-700 bg-slate-950/40">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 sm:gap-3 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] sm:text-xs font-bold ${
                  isUser
                    ? 'bg-sky-500 text-white'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {isUser ? 'YOU' : 'AI'}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-br from-sky-600 to-sky-700 text-white rounded-tr-none shadow-md shadow-sky-600/20'
                    : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/80 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-75 mb-1 gap-2">
                  <span className="font-semibold">
                    {isUser ? '我' : scenario.persona.name}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <p>{msg.text}</p>

                {msg.status && (
                  <div className="mt-1.5 pt-1 border-t border-slate-700/50 flex items-center space-x-1 text-[10px] text-amber-300 font-semibold">
                    <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>对手反应: {msg.status}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isListening && liveTranscript && (
          <div className="flex items-start gap-2 flex-row-reverse animate-pulse">
            <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold">
              YOU
            </div>
            <div className="max-w-[85%] p-3 rounded-2xl bg-sky-950/50 border border-sky-500/50 text-sky-200 text-xs italic">
              {liveTranscript}...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Phrases Helper Bar */}
      <div className="bg-slate-850 border-t border-slate-700/70 px-3 py-1.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-1.5 text-xs whitespace-nowrap">
          <span className="font-bold text-amber-400 shrink-0 flex items-center space-x-0.5 text-[11px]">
            <Sparkles className="w-3 h-3" />
            <span>锦囊:</span>
          </span>
          {scenario.suggestedPhrases.map((phrase, i) => (
            <button
              key={i}
              onClick={() => setInputText(phrase)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[10px] sm:text-[11px] transition max-w-[200px] sm:max-w-[260px] truncate"
              title="填入输入框"
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Audio & Input Control Station */}
      <div className="bg-slate-900 border-t border-slate-800 p-2.5 sm:p-4">
        <div className="flex items-center space-x-2">
          {/* Interrupt AI Button */}
          {isAiSpeaking && (
            <button
              onClick={handleInterruptAi}
              className="flex items-center space-x-1 px-2.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-[11px] font-bold transition animate-pulse shrink-0"
              title="打断发言"
            >
              <HandMetal className="w-3.5 h-3.5 text-amber-400" />
              <span>打断</span>
            </button>
          )}

          {/* Microphone Recording Button */}
          <button
            onClick={isListening ? stopVoiceRecording : startVoiceRecording}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-white transition-all shadow-lg shrink-0 ${
              isListening
                ? 'bg-rose-500 hover:bg-rose-600 animate-pulse ring-4 ring-rose-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25'
            }`}
            title={isListening ? '点击结束发言' : '点击开麦'}
          >
            {isListening ? (
              <Square className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            ) : (
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Text Input (iOS zoom-proof text-base) */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={
                isListening
                  ? '正在聆听... (停顿2.5s自动发送)'
                  : '说英语或直接打字...'
              }
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-3 pr-9 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white transition disabled:opacity-40"
              title="发送"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
