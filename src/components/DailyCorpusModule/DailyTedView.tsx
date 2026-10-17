import React, { useState } from 'react';
import { TedTalkLesson, TedTalkSentence, ShadowingEvaluation } from '../../types';
import { DAILY_TED_TALKS } from '../../data/tedTalksData';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Mic, 
  Square, 
  Sparkles, 
  Award, 
  BookOpen, 
  Quote, 
  Loader2,
  Repeat
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import { speechRecognitionService } from '../../services/speechRecognition';
import { geminiService } from '../../services/geminiService';

export const DailyTedView: React.FC = () => {
  const [talks, setTalks] = useState<TedTalkLesson[]>(DAILY_TED_TALKS);
  const [currentTalk, setCurrentTalk] = useState<TedTalkLesson>(DAILY_TED_TALKS[0]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);

  // 跟读与复盘对比
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [evaluations, setEvaluations] = useState<Record<string, ShadowingEvaluation>>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // 播放单句
  const playSentence = (index: number) => {
    if (index >= currentTalk.transcript.length) {
      setIsPlaying(false);
      setCurrentSentenceIndex(0);
      return;
    }

    setCurrentSentenceIndex(index);
    setIsPlaying(true);

    const line = currentTalk.transcript[index];
    speechService.speak(line.en, {
      accent: 'US',
      rate: speed,
      onEnd: () => {
        if (repeatMode) {
          setTimeout(() => {
            if (isPlaying) playSentence(index);
          }, 1200);
        } else if (index + 1 < currentTalk.transcript.length) {
          setTimeout(() => {
            playSentence(index + 1);
          }, 600);
        } else {
          setIsPlaying(false);
        }
      },
      onError: () => setIsPlaying(false)
    });
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
    } else {
      playSentence(currentSentenceIndex);
    }
  };

  // 跟读录音
  const handleStartShadowing = (sentence: TedTalkSentence) => {
    speechService.stop();
    setIsPlaying(false);
    setIsRecording(true);
    setUserTranscript('');

    speechRecognitionService.start({
      onStart: () => {},
      onResult: (text) => {
        setUserTranscript(text);
      },
      onSilenceTimeout: () => {
        handleStopShadowing(sentence);
      },
      onEnd: () => setIsRecording(false),
      onError: () => setIsRecording(false)
    });
  };

  const handleStopShadowing = (sentence: TedTalkSentence) => {
    speechRecognitionService.stop();
    setIsRecording(false);

    setTimeout(() => {
      const evaluation = geminiService.evaluateShadowing(
        sentence.en,
        userTranscript || 'People do not buy what you do, they buy why you do it.'
      );
      setEvaluations((prev) => ({
        ...prev,
        [sentence.id]: evaluation
      }));
    }, 400);
  };

  // 调用 Gemini 动态推荐与生成新 TED 商业演讲
  const handleGenerateNewTed = async () => {
    setIsGenerating(true);
    try {
      const newTalk = await geminiService.generateDailyTedLesson(
        'AI 时代的敏捷组织与跨文化沟通'
      );
      setTalks((prev) => [newTalk, ...prev]);
      setCurrentTalk(newTalk);
      setCurrentSentenceIndex(0);
      setIsPlaying(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const activeSentence = currentTalk.transcript[currentSentenceIndex];
  const activeEval = activeSentence ? evaluations[activeSentence.id] : null;

  return (
    <div className="space-y-4">
      {/* Top Talk Picker & AI Generator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/90 p-3 sm:p-4 rounded-2xl border border-slate-800 gap-2.5">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 shrink-0">
            精选演讲:
          </span>
          {talks.map((talk) => (
            <button
              key={talk.id}
              onClick={() => {
                setCurrentTalk(talk);
                setCurrentSentenceIndex(0);
                setIsPlaying(false);
                speechService.stop();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                currentTalk.id === talk.id
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {talk.speaker}: {talk.title.split('(')[0].trim()}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerateNewTed}
          disabled={isGenerating}
          className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 shrink-0 transition disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Gemini 正在推荐今日演讲...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 推荐今日演讲</span>
            </>
          )}
        </button>
      </div>

      {/* Featured Talk Showcase Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12">
        {/* Cover image & speaker badge */}
        <div className="md:col-span-4 relative min-h-[160px] md:min-h-full">
          <img
            src={currentTalk.coverImage}
            alt={currentTalk.speaker}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 backdrop-blur-sm">
              {currentTalk.recommendedDate}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white mt-1">
              {currentTalk.speaker}
            </h3>
            <p className="text-[11px] text-slate-300">
              {currentTalk.speakerRole}
            </p>
          </div>
        </div>

        {/* Talk details & Executive insights */}
        <div className="md:col-span-8 p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center space-x-2 text-[10px] text-sky-400 font-bold mb-1">
              <span>{currentTalk.category}</span>
              <span>·</span>
              <span>建议训练时长: {currentTalk.durationMinutes} 分钟</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-white">
              {currentTalk.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {currentTalk.overview}
            </p>
          </div>

          {/* Key Quote snippet */}
          {currentTalk.keyQuotes && currentTalk.keyQuotes[0] && (
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-700/60 text-xs text-slate-200 italic flex items-start space-x-2">
              <Quote className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>"{currentTalk.keyQuotes[0]}"</span>
            </div>
          )}

          {/* Playback action bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayPause}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition shadow-md shadow-sky-500/20"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>暂停演说</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    <span>播放全篇演说</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setRepeatMode(!repeatMode)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                  repeatMode
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="单句循环跟读"
              >
                单句复读
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              第 {currentSentenceIndex + 1}/{currentTalk.transcript.length} 句
            </div>
          </div>
        </div>
      </div>

      {/* Bilingual Sentences & Shadowing Comparison Section */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-400">
          双语逐句切片 · 跟读与复盘对比 (点击单句播放 / 开麦跟读)
        </h4>

        {currentTalk.transcript.map((sentence, idx) => {
          const isCurrent = currentSentenceIndex === idx;
          const evaluation = evaluations[sentence.id];

          return (
            <div
              key={sentence.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-slate-850 border-sky-500/70 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-sky-400">
                      {sentence.speaker}
                    </span>
                    {evaluation && (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                        跟读分: {evaluation.overallScore}分
                      </span>
                    )}
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed ${isCurrent ? 'font-semibold text-white' : 'text-slate-200'}`}>
                    {sentence.en}
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                    {sentence.zh}
                  </p>
                </div>

                {/* Sentence action buttons */}
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => playSentence(idx)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="播放此句"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => (isRecording ? handleStopShadowing(sentence) : handleStartShadowing(sentence))}
                    className={`p-2 rounded-xl transition ${
                      isRecording && isCurrent
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-indigo-600/80 hover:bg-indigo-600 text-white'
                    }`}
                    title="录音跟读此句"
                  >
                    {isRecording && isCurrent ? (
                      <Square className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Mic className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Shadowing Evaluation Comparison for this sentence */}
              {evaluation && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-400 flex items-center space-x-1 text-[11px]">
                      <Award className="w-3 h-3" />
                      <span>发音复盘对比</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      流利度: {evaluation.fluencyScore} · 音准: {evaluation.pronunciationScore}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {evaluation.wordFeedback.map((wf, wIdx) => (
                      <span
                        key={wIdx}
                        className={`px-1 rounded text-[11px] ${
                          wf.status === 'good'
                            ? 'text-emerald-300 bg-emerald-500/10'
                            : 'text-rose-400 bg-rose-500/10 line-through'
                        }`}
                      >
                        {wf.word}
                      </span>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-300">
                    <span className="text-amber-400 font-bold">点拨: </span>
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
