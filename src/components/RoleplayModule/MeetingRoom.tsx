import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Square, 
  Sparkles, 
  Send, 
  ShieldAlert, 
  RotateCcw, 
  Volume2, 
  MessageSquare, 
  ArrowRight,
  HandMetal,
  Radio,
  FileText,
  UserCheck
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
  onFinishMeeting,
  onSwitchScenario
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [turnCount, setTurnCount] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始化会议：播放 AI 欢迎词
  useEffect(() => {
    const initMsg: ChatMessage = {
      id: 'm-init',
      sender: 'ai',
      text: scenario.initialMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initMsg]);
    setTurnCount(0);

    // AI 开场发言
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
      onEnd: () => {
        setIsAiSpeaking(false);
      },
      onError: () => {
        setIsAiSpeaking(false);
      }
    });
  };

  // 打断 AI 发言
  const handleInterruptAi = () => {
    speechService.stop();
    setIsAiSpeaking(false);
    startVoiceRecording();
  };

  // 开始语音录音与实时转写
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
        // 静音检测超时：自动代用户提交
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

  // 用户发送发言
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

    // AI 生成针对性回复（若用户已达成目标，可推进）
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

  // 结束会议并生成四维全景诊断报告
  const handleWrapUpAndEvaluate = async () => {
    speechService.stop();
    speechRecognitionService.stop();
    setIsEvaluating(true);

    // 汇总用户的所有发言
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

      // 保存到弱点图谱
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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[750px] relative">
      {/* Meeting Header Bar */}
      <div className="bg-slate-850 border-b border-slate-700/80 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Avatar with pulsing indicator */}
          <div className="relative">
            <img
              src={scenario.persona.avatar}
              alt={scenario.persona.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/60 shadow-md"
            />
            {isAiSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">
                {scenario.persona.name}
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {scenario.persona.accentLabel}
              </span>
              <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                {scenario.persona.temperamentLabel}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {scenario.persona.title} · {scenario.persona.company}
            </p>
          </div>
        </div>

        {/* Meeting Control Actions */}
        <div className="flex items-center space-x-2">
          {/* Status Indicator */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs">
            <Radio className={`w-3.5 h-3.5 ${isAiSpeaking ? 'text-emerald-400 animate-pulse' : isListening ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-slate-300 text-[11px] font-medium">
              {isAiSpeaking ? '对方正在发言...' : isListening ? '正在倾听您的陈述...' : '等待发言'}
            </span>
          </div>

          {/* End & Evaluate Button */}
          <button
            onClick={handleWrapUpAndEvaluate}
            disabled={isEvaluating}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            {isEvaluating ? (
              <span>正在生成四维诊断...</span>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>结束会议并看评分</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scenario Background & User Goal Banner */}
      <div className="bg-slate-800/60 border-b border-slate-700/50 px-5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-amber-400">本场业务目标：</span>
          <span className="text-slate-200">{scenario.userGoal}</span>
        </div>
        <div className="text-[11px] text-slate-400 shrink-0">
          已进行 <span className="text-sky-400 font-bold">{turnCount}</span> 轮攻防
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 bg-slate-950/40">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-sky-500 text-white'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {isUser ? 'YOU' : 'AI'}
              </div>

              <div
                className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-br from-sky-600 to-sky-700 text-white rounded-tr-none shadow-md shadow-sky-600/20'
                    : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/80 shadow-md'
                }`}
              >
                {/* Speaker & Timestamp */}
                <div className="flex items-center justify-between text-[11px] opacity-75 mb-1 gap-2">
                  <span className="font-semibold">
                    {isUser ? '我 (You)' : scenario.persona.name}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <p>{msg.text}</p>

                {/* Objection Tag */}
                {msg.status && (
                  <div className="mt-2 pt-1.5 border-t border-slate-700/50 flex items-center space-x-1.5 text-[10px] text-amber-300 font-semibold">
                    <ShieldAlert className="w-3 h-3 text-amber-400" />
                    <span>对手反应: {msg.status}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live Interim Transcript Display */}
        {isListening && liveTranscript && (
          <div className="flex items-start gap-3 flex-row-reverse animate-pulse">
            <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold">
              YOU
            </div>
            <div className="max-w-[75%] p-3.5 rounded-2xl bg-sky-950/50 border border-sky-500/50 text-sky-200 text-sm italic">
              {liveTranscript}...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Phrases Helper Bar (职场高分句式锦囊) */}
      <div className="bg-slate-850 border-t border-slate-700/70 px-4 py-2">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="font-bold text-amber-400 shrink-0 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>高分锦囊：</span>
          </span>
          {scenario.suggestedPhrases.map((phrase, i) => (
            <button
              key={i}
              onClick={() => {
                setInputText(phrase);
              }}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition truncate max-w-[260px]"
              title="点击填入输入框"
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Audio & Input Control Station */}
      <div className="bg-slate-900 border-t border-slate-800 p-4">
        <div className="flex items-center space-x-3">
          {/* Interrupt AI Button (允许中途抢话打断) */}
          {isAiSpeaking && (
            <button
              onClick={handleInterruptAi}
              className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold transition animate-pulse"
              title="点击打断对方发言并立即开麦反驳"
            >
              <HandMetal className="w-4 h-4 text-amber-400" />
              <span>打断发言 (Interrupt)</span>
            </button>
          )}

          {/* Microphone Recording Button */}
          <button
            onClick={isListening ? stopVoiceRecording : startVoiceRecording}
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white transition-all shadow-lg shrink-0 ${
              isListening
                ? 'bg-rose-500 hover:bg-rose-600 animate-pulse ring-4 ring-rose-500/30 shadow-rose-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25'
            }`}
            title={isListening ? '点击完成发言' : '按住/点击开麦 (实时静音识别)'}
          >
            {isListening ? (
              <Square className="w-5 h-5 fill-current" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Text Input fallback */}
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
                  ? '正在聆听您的英语陈述... (停止说话2.5秒将自动发送)'
                  : '用英文直接表达观点，或点击左侧麦克风说英语...'
              }
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="absolute right-2 top-2 p-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
              title="发送发言"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
