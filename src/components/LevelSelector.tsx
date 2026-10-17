import React, { useState } from 'react';
import { ProficiencyLevel, LevelInfo } from '../types';
import { LEVELS } from '../data/levelsData';
import { ChevronDown, ChevronUp, Volume2, Mic, Sparkles } from 'lucide-react';

interface LevelSelectorProps {
  currentLevel: ProficiencyLevel;
  onSelectLevel: (level: ProficiencyLevel) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevel,
  onSelectLevel
}) => {
  const [isExpandedMobile, setIsExpandedMobile] = useState<boolean>(false);
  const activeLevelInfo = LEVELS.find(l => l.id === currentLevel) || LEVELS[0];

  return (
    <div className="w-full">
      {/* Mobile Compact Header & Level Pills (< sm screen) */}
      <div className="sm:hidden bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-md space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white">学习进阶</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${activeLevelInfo.badgeBg}`}>
              {activeLevelInfo.id} · {activeLevelInfo.cefr}
            </span>
          </div>

          <button
            onClick={() => setIsExpandedMobile(!isExpandedMobile)}
            className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center space-x-0.5"
          >
            <span>{isExpandedMobile ? '收起详情' : '展开目标'}</span>
            {isExpandedMobile ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Horizontal Level Switcher Pills */}
        <div className="grid grid-cols-4 gap-1.5">
          {LEVELS.map((level) => {
            const isActive = level.id === currentLevel;
            return (
              <button
                key={level.id}
                onClick={() => onSelectLevel(level.id)}
                className={`py-2 px-1 rounded-xl text-center transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20 ring-1 ring-white/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
                }`}
              >
                <div className="text-xs font-extrabold">{level.id}</div>
                <div className="text-[9px] opacity-80 truncate">{level.title.slice(0, 4)}</div>
              </button>
            );
          })}
        </div>

        {/* Expandable Details on Mobile */}
        {isExpandedMobile && (
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 space-y-1.5 animate-in fade-in duration-150">
            <p className="font-semibold text-white">{activeLevelInfo.title}: {activeLevelInfo.subtitle}</p>
            <p className="text-slate-400 leading-tight">{activeLevelInfo.coreObjective}</p>
            <div className="flex items-center space-x-2 text-[10px] text-sky-300 pt-1">
              <span>🎧 {activeLevelInfo.listeningFeature}</span>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Grid Layout (>= sm screen) */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>学习进阶路径</span>
            <span className="text-xs font-normal text-slate-400">(0基础至纯英文高管会议控场)</span>
          </h2>
          <span className="text-xs text-sky-400 font-medium">
            当前选中: <span className="font-bold underline">{currentLevel}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-indigo-500" />
                )}

                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`font-black text-sm px-2 py-0.5 rounded-md border ${level.badgeBg}`}>
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
    </div>
  );
};
