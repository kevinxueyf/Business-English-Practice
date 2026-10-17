import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  SkipForward, 
  FastForward, 
  Globe2, 
  Repeat
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

  useEffect(() => {
    setSpeed(lesson.speed || 1.0);
    setAccent(lesson.accent.includes('IN') ? 'IN' : lesson.accent.includes('UK') ? 'UK' : 'US');
  }, [lesson]);

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
          setTimeout(() => {
            if (isPlaying) playSentence(index);
          }, 600);
        } else if (index + 1 < lesson.transcript.length) {
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
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 sm:p-5 shadow-xl">
      {/* Lesson Header Information */}
      <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-slate-700/60 gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 shrink-0">
              {lesson.level}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-slate-400 bg-slate-700/40 px-1.5 py-0.5 rounded truncate max-w-[140px] sm:max-w-none">
              {lesson.industry}
            </span>
            <span className="text-[10px] sm:text-xs text-indigo-300 flex items-center space-x-1 shrink-0">
              <Globe2 className="w-3 h-3" />
              <span>{lesson.accent.split('(')[0].trim()}</span>
            </span>
          </div>

          <h2 className="text-base sm:text-xl font-extrabold text-white truncate">
            {lesson.title}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-2">
            {lesson.scenario}
          </p>
        </div>

        {/* Dynamic Waveform Visualizer */}
        <div className="flex items-center space-x-1 h-7 sm:h-8 px-2 sm:px-3 bg-slate-900/80 rounded-xl border border-slate-700/50 shrink-0">
          {[40, 80, 100, 60, 90, 50].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-200 ${
                isPlaying
                  ? 'bg-gradient-to-t from-sky-500 to-indigo-400 animate-pulse'
                  : 'bg-slate-700'
              }`}
              style={{
                height: isPlaying ? `${Math.max(6, h)}%` : '20%',
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
          <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 ml-1.5">
            {currentSentenceIndex + 1}/{lesson.transcript.length}
          </span>
        </div>
      </div>

      {/* Main Playback Bar (Mobile & Desktop Responsive) */}
      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Playback Controls Cluster */}
        <div className="flex items-center justify-between w-full sm:w-auto space-x-2">
          {/* Main Play/Pause Button (Large Touch Target) */}
          <button
            onClick={handlePlayPause}
            className={`flex-1 sm:flex-none h-11 sm:h-12 px-5 sm:px-6 rounded-xl flex items-center justify-center font-bold text-white transition-all shadow-lg text-sm ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/25'
                : 'bg-sky-500 hover:bg-sky-400 shadow-sky-500/25'
            }`}
            title={isPlaying ? '暂停' : '播放全文'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current mr-1.5" />
                <span>暂停</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5 mr-1.5" />
                <span>{currentSentenceIndex === 0 ? '全篇精听' : '继续播放'}</span>
              </>
            )}
          </button>

          {/* Replay Current Sentence */}
          <button
            onClick={handleReplayCurrent}
            className="w-11 h-11 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/40 flex items-center justify-center transition shrink-0"
            title="单句重新发音"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Next Sentence */}
          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/40 flex items-center justify-center transition shrink-0"
            title="跳至下一句"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Repeat Current Sentence Toggle */}
          <button
            onClick={() => setRepeatMode(!repeatMode)}
            className={`h-11 px-3 rounded-xl text-xs font-bold border transition flex items-center space-x-1 shrink-0 ${
              repeatMode
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                : 'bg-slate-700/40 text-slate-400 border-slate-700'
            }`}
            title="单句循环练习"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">循环</span>
          </button>
        </div>

        {/* Speed & Accent Switchers */}
        <div className="flex items-center justify-between w-full sm:w-auto space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700/40">
          {/* Speed Toggle */}
          <button
            onClick={toggleSpeed}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1 h-9 px-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600/50 transition"
            title="切换播放语速"
          >
            <FastForward className="w-3.5 h-3.5 text-sky-400" />
            <span>{speed}x 语速</span>
          </button>

          {/* Accent Quick Switch */}
          <div className="flex items-center space-x-1 bg-slate-900/60 p-0.5 rounded-xl border border-slate-700/40">
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
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
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
