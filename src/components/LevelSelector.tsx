import React from 'react';
import { ProficiencyLevel, LevelInfo } from '../types';
import { LEVELS } from '../data/levelsData';
import { CheckCircle2, ShieldAlert, Sparkles, Volume2, Mic } from 'lucide-react';

interface LevelSelectorProps {
  currentLevel: ProficiencyLevel;
  onSelectLevel: (level: ProficiencyLevel) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevel,
  onSelectLevel
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>学习进阶路径</span>
            <span className="text-xs font-normal text-slate-400">(0基础至纯英文高管会议控场)</span>
          </h2>
        </div>
        <span className="text-xs text-sky-400 font-medium">
          当前选中: <span className="font-bold underline">{currentLevel}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {LEVELS.map((level) => {
          const isActive = level.id === currentLevel;
          return (
            <button
              key={level.id}
              onClick={() => onSelectLevel(level.id)}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 relative overflow-hidden group ${
                isActive
                  ? 'bg-slate-800/90 border-sky-500 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/50'
                  : 'bg-slate-850/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              {/* Active Glow Accent */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-indigo-500" />
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`font-black text-sm px-2 py-0.5 rounded-md border ${level.badgeBg}`}
                  >
                    {level.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {level.cefr}
                  </span>
                </div>
                {isActive ? (
                  <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">
                    进行中
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-400">
                    切换
                  </span>
                )}
              </div>

              <div className="mt-2.5">
                <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                  {level.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {level.subtitle}
                </p>
              </div>

              <div className="mt-2.5 pt-2.5 border-t border-slate-700/40 space-y-1.5 text-[11px]">
                <div className="flex items-start space-x-1.5 text-slate-300">
                  <Volume2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1 text-slate-400">{level.listeningFeature}</span>
                </div>
                <div className="flex items-start space-x-1.5 text-slate-300">
                  <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1 text-slate-400">{level.speakingFeature}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
