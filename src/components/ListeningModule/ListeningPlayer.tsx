import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  SkipForward, 
  FastForward, 
  Globe2, 
  Layers
} from 'lucide-react';
import { ListeningLesson } from '../../types';
import { speechService } from '../../services/speechService';

interface ListeningPlayerProps {
  lesson: ListeningLesson;
  currentSentenceIndex: number;
  onSentenceChange: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const ListeningPlayer: React.FC<ListeningPlayerProps> = ({
  lesson,
  currentSentenceIndex,
  onSentenceChange,
  isPlaying,
  setIsPlaying
}) => {
  const [speed, setSpeed] = useState<number>(lesson.speed || 1.0);
  const [repeatMode, setRepeatMode] = useState<boolean>(false);
  const [accent, setAccent] = useState<string>(lesson.accent.includes('IN') ? 'IN' : lesson.accent.includes('UK') ? 'UK' : 'US');

  // 当切换课程时同步语速与口音
  useEffect(() => {
    setSpeed(lesson.speed || 1.0);
    setAccent(lesson.accent.includes('IN') ? 'IN' : lesson.accent.includes('UK') ? 'UK' : 'US');
  }, [lesson]);

  // 播放单句
  const playSentence = (index: number) => {
    if (index >= lesson.transcript.length) {
      setIsPlaying(false);
      onSentenceChange(0);
      return;
    }

    onSentenceChange(index);
    setIsPlaying(true);

    const line = lesson.transcript[index];
    const sentenceAccent = line.accent || accent;

    speechService.speak(line.en, {
      accent: sentenceAccent,
      rate: speed,
      onEnd: () => {
        if (repeatMode) {
          // 单句重复
          setTimeout(() => {
            if (isPlaying) playSentence(index);
          }, 600);
        } else if (index + 1 < lesson.transcript.length) {
          // 连续播放下一句
          setTimeout(() => {
            playSentence(index + 1);
          }, 450);
        } else {
          setIsPlaying(false);
        }
      },
      onError: () => {
        setIsPlaying(false);
      }
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

  const handleNext = () => {
    speechService.stop();
    const nextIdx = (currentSentenceIndex + 1) % lesson.transcript.length;
    playSentence(nextIdx);
  };

  const handleReplayCurrent = () => {
    speechService.stop();
    playSentence(currentSentenceIndex);
  };

  const toggleSpeed = () => {
    const speeds = [0.8, 1.0, 1.2, 1.4];
    const currIdx = speeds.indexOf(speed);
    const nextSpeed = speeds[(currIdx + 1) % speeds.length];
    setSpeed(nextSpeed);
    if (isPlaying) {
      speechService.stop();
      playSentence(currentSentenceIndex);
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl">
      {/* Lesson Header Information */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/60 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
              {lesson.level}
            </span>
            <span className="text-xs font-medium text-slate-400 bg-slate-700/40 px-2 py-0.5 rounded">
              {lesson.industry}
            </span>
            <span className="text-xs text-slate-400 flex items-center space-x-1">
              <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lesson.accent}</span>
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1.5">
            {lesson.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {lesson.scenario}
          </p>
        </div>

        {/* Audio Waveform Animation Indicator */}
        <div className="flex items-center space-x-1 h-8 px-3 py-1 bg-slate-900/60 rounded-xl border border-slate-700/40 shrink-0">
          {[40, 75, 95, 60, 85, 45, 90, 65, 35].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-300 ${
                isPlaying
                  ? 'bg-gradient-to-t from-sky-500 to-indigo-400 animate-pulse'
                  : 'bg-slate-700'
              }`}
              style={{
                height: isPlaying ? `${Math.max(8, (h * (i % 2 === 0 ? 1 : 0.7)))}%` : '20%',
                animationDelay: `${i * 120}ms`
              }}
            />
          ))}
          <span className="text-[11px] font-mono text-slate-400 ml-2">
            {currentSentenceIndex + 1}/{lesson.transcript.length}
          </span>
        </div>
      </div>

      {/* Main Playback Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          {/* Main Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white transition-all shadow-lg ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
                : 'bg-sky-500 hover:bg-sky-400 shadow-sky-500/25'
            }`}
            title={isPlaying ? '暂停' : '播放全文'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Replay Current Sentence */}
          <button
            onClick={handleReplayCurrent}
            className="p-2.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/40 transition"
            title="单句重新发音"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Next Sentence */}
          <button
            onClick={handleNext}
            className="p-2.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/40 transition"
            title="跳至下一句"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Repeat Current Sentence Toggle */}
          <button
            onClick={() => setRepeatMode(!repeatMode)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
              repeatMode
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                : 'bg-slate-700/40 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="单句循环练习"
          >
            单句循环
          </button>
        </div>

        {/* Speed & Accent Switchers */}
        <div className="flex items-center space-x-2">
          {/* Speed Toggle */}
          <button
            onClick={toggleSpeed}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600/50 transition"
            title="切换播放语速"
          >
            <FastForward className="w-3.5 h-3.5 text-sky-400" />
            <span>{speed}x 语速</span>
          </button>

          {/* Accent Quick Switch */}
          <div className="flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-700/40">
            {(['US', 'UK', 'IN'] as const).map((acc) => (
              <button
                key={acc}
                onClick={() => {
                  setAccent(acc);
                  if (isPlaying) {
                    speechService.stop();
                    playSentence(currentSentenceIndex);
                  }
                }}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
                  accent === acc
                    ? 'bg-sky-500 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {acc === 'US' ? '美音' : acc === 'UK' ? '英音' : '印音'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
