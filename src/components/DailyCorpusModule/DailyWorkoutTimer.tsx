import React, { useState, useEffect } from 'react';
import { Clock, Flame, Award, CheckCircle2, Play, Pause, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyWorkoutTimerProps {
  currentMinutes: number;
  targetMinutes: number;
  onAddMinutes: (mins: number) => void;
}

export const DailyWorkoutTimer: React.FC<DailyWorkoutTimerProps> = ({
  currentMinutes,
  targetMinutes,
  onAddMinutes
}) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);

  // 每过 60 秒累计 1 分钟到用户数据中
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev + 1 >= 60) {
            onAddMinutes(1);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, onAddMinutes]);

  const percentage = Math.min(100, Math.round((currentMinutes / targetMinutes) * 100));

  useEffect(() => {
    if (percentage >= 100 && !hasCelebrated) {
      setHasCelebrated(true);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [percentage, hasCelebrated]);

  const formatTimer = (secs: number) => {
    const minsStr = String(currentMinutes).padStart(2, '0');
    const secsStr = String(secs).padStart(2, '0');
    return `${minsStr}:${secsStr}`;
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-3.5 sm:p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Left: Habit tracker title & motivation */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1.5">
              <span>每日 10-20 分钟商务磨耳朵与复读精练</span>
            </h3>
            {percentage >= 100 ? (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-0.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>今日达标</span>
              </span>
            ) : (
              <span className="text-[10px] text-indigo-300 font-semibold bg-indigo-500/10 px-1.5 py-0.2 rounded">
                进行中
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            保持碎片化高频训练，培养纯英文商务直觉与母语级语流肌肉记忆
          </p>
        </div>
      </div>

      {/* Right: Timer & Interactive controls */}
      <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
        <div className="flex items-center space-x-2">
          {/* Progress bar and minutes */}
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-indigo-300">
              {currentMinutes} <span className="text-slate-500 text-[10px]">/ {targetMinutes} min</span>
            </div>
            <div className="w-24 sm:w-28 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="font-mono text-xs sm:text-sm font-bold text-white bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
            {formatTimer(seconds)}
          </div>
        </div>

        {/* Play/Pause Timer */}
        <button
          onClick={() => setIsActive(!isActive)}
          className={`p-2 rounded-xl text-xs font-bold border transition shrink-0 ${
            isActive
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
          }`}
          title={isActive ? '暂停计时' : '继续计时'}
        >
          {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
