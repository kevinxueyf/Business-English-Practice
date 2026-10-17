import React, { useState, useRef } from 'react';
import { BusinessPhrase, ShadowingEvaluation } from '../../types';
import { BUSINESS_900_PHRASES, PHRASE_CATEGORIES } from '../../data/business900Data';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Mic, 
  Square, 
  Repeat, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import { speechRecognitionService } from '../../services/speechRecognition';
import { geminiService } from '../../services/geminiService';

export const Business900View: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePhraseId, setActivePhraseId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [repeatCount, setRepeatCount] = useState<number>(1); // 1 = 单次, 2 = 循环2次, 3 = 循环3次
  const [speed, setSpeed] = useState<number>(1.0);

  // 跟读与复盘对比状态
  const [recordingPhraseId, setRecordingPhraseId] = useState<string | null>(null);
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [evaluations, setEvaluations] = useState<Record<string, ShadowingEvaluation>>({});
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // 过滤短语
  const filteredPhrases = BUSINESS_900_PHRASES.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchQuery =
      searchQuery.trim() === '' ||
      p.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.zh.includes(searchQuery) ||
      p.businessContext.includes(searchQuery);
    return matchCat && matchQuery;
  });

  // 播放原音
  const handlePlay = (phrase: BusinessPhrase, loopRemaining = repeatCount) => {
    setActivePhraseId(phrase.id);
    setIsPlaying(true);

    speechService.speak(phrase.en, {
      accent: phrase.accent,
      rate: speed,
      onEnd: () => {
        if (loopRemaining > 1) {
          // 循环复读留白 1.2 秒给跟读
          setTimeout(() => {
            handlePlay(phrase, loopRemaining - 1);
          }, 1200);
        } else {
          setIsPlaying(false);
        }
      },
      onError: () => setIsPlaying(false)
    });
  };

  const handleStop = () => {
    speechService.stop();
    setIsPlaying(false);
  };

  // 开始录音跟读
  const handleStartRecording = (phrase: BusinessPhrase) => {
    speechService.stop();
    setIsPlaying(false);
    setRecordingPhraseId(phrase.id);
    setUserTranscript('');

    speechRecognitionService.start({
      onStart: () => {},
      onResult: (text) => {
        setUserTranscript(text);
      },
      onSilenceTimeout: () => {
        handleStopRecording(phrase);
      },
      onEnd: () => {
        setRecordingPhraseId(null);
      },
      onError: () => {
        setRecordingPhraseId(null);
      }
    });
  };

  // 结束录音并生成细颗粒度复盘对比报告
  const handleStopRecording = (phrase: BusinessPhrase) => {
    speechRecognitionService.stop();
    setRecordingPhraseId(null);
    setIsEvaluating(true);

    setTimeout(() => {
      const evaluation = geminiService.evaluateShadowing(
        phrase.en,
        userTranscript || 'I appreciate everyone making time for this sync'
      );
      setEvaluations((prev) => ({
        ...prev,
        [phrase.id]: evaluation
      }));
      setIsEvaluating(false);
    }, 400);
  };

  return (
    <div className="space-y-4">
      {/* Category Pills & Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索场景关键词，如：排期、谈判、SLA、破冰、换约..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Category switcher pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {PHRASE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Global Speed & Repeat Settings */}
      <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-850 px-3 py-2 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <span>复读模式:</span>
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => setRepeatCount(num)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
                repeatCount === num
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {num === 1 ? '单次朗读' : `单句循环 ${num} 遍`}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1.5">
          <span>语速:</span>
          {[0.8, 1.0, 1.2].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition ${
                speed === s
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Phrase Cards Stream */}
      <div className="space-y-3">
        {filteredPhrases.map((phrase) => {
          const isCurrentPlaying = activePhraseId === phrase.id && isPlaying;
          const isRecording = recordingPhraseId === phrase.id;
          const evaluation = evaluations[phrase.id];

          return (
            <div
              key={phrase.id}
              className={`p-4 rounded-2xl border transition-all ${
                isCurrentPlaying
                  ? 'bg-slate-850 border-sky-500/70 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                    {phrase.categoryName}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {phrase.difficulty} · {phrase.accent}音
                  </span>
                </div>

                {/* Score badge if evaluated */}
                {evaluation && (
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    跟读准确率: {evaluation.overallScore}分
                  </span>
                )}
              </div>

              {/* English Phrase */}
              <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                {phrase.en}
              </h4>

              {/* Chinese Translation */}
              <p className="text-xs text-slate-300 mt-1">
                {phrase.zh}
              </p>

              {/* Business Context & Phonetic Tip */}
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] space-y-1">
                {phrase.phoneticTip && (
                  <div className="text-indigo-300 font-medium">
                    🗣️ 发音要决: {phrase.phoneticTip}
                  </div>
                )}
                <div className="text-slate-400">
                  💼 跨国场景: {phrase.businessContext}
                </div>
              </div>

              {/* Interactive Audio Controls (Play / Repeat / Shadowing) */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
                {/* Play / Stop */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => (isCurrentPlaying ? handleStop() : handlePlay(phrase))}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow ${
                      isCurrentPlaying
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/20'
                    }`}
                  >
                    {isCurrentPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>停止</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        <span>播放原音 {repeatCount > 1 ? `(${repeatCount}遍)` : ''}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Shadowing & Recording Button */}
                <button
                  onClick={() => (isRecording ? handleStopRecording(phrase) : handleStartRecording(phrase))}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-400/50'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>录音中 (点击完成)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>开麦跟读与复盘对比</span>
                    </>
                  )}
                </button>
              </div>

              {/* Shadowing Live Transcript when recording */}
              {isRecording && userTranscript && (
                <div className="mt-2 p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 italic animate-pulse">
                  🎙️ 正在识别您的发音: "{userTranscript}..."
                </div>
              )}

              {/* ===== 复盘对比报告 (Shadowing Comparison Panel) ===== */}
              {evaluation && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-700/80 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-teal-400 flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>跟读发音细颗粒度复盘对比</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      流利度: {evaluation.fluencyScore} · 音准: {evaluation.pronunciationScore}
                    </span>
                  </div>

                  {/* Word-by-word visual highlight */}
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs sm:text-sm leading-relaxed flex flex-wrap gap-1.5">
                    {evaluation.wordFeedback.map((item, idx) => (
                      <span
                        key={idx}
                        className={`px-1.5 py-0.5 rounded font-medium ${
                          item.status === 'good'
                            ? 'text-emerald-300 bg-emerald-500/10'
                            : 'text-rose-400 bg-rose-500/10 line-through'
                        }`}
                        title={item.status === 'good' ? '发音匹配良好' : '有漏读或发音偏差'}
                      >
                        {item.word}
                      </span>
                    ))}
                  </div>

                  {/* Coach tip */}
                  <p className="text-[11px] text-slate-300 leading-normal">
                    <span className="text-amber-400 font-bold">💡 复盘点拨：</span>
                    {evaluation.coachTip}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
