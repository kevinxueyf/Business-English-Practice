import React, { useState } from 'react';
import { UserStats, UserWeaknessRecord } from '../../types';
import { 
  BrainCircuit, 
  Trash2, 
  RotateCw, 
  Volume2, 
  Sparkles, 
  AlertCircle, 
  Flame, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import { storageService } from '../../services/storageService';

interface WeaknessTrackerProps {
  stats: UserStats;
  onRefreshStats: () => void;
  onStartSpecificPractice: (weakness: UserWeaknessRecord) => void;
}

export const WeaknessTracker: React.FC<WeaknessTrackerProps> = ({
  stats,
  onRefreshStats,
  onStartSpecificPractice
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = stats.weaknesses.filter((w) => {
    if (filterType === 'all') return true;
    return w.type === filterType;
  });

  const handleDelete = (id: string) => {
    storageService.removeWeakness(id);
    onRefreshStats();
  };

  const handleSpeak = (text: string) => {
    speechService.speak(text, { accent: 'US', rate: 1.0 });
  };

  return (
    <div className="space-y-6">
      {/* Knowledge Overview Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                “教练式”复盘与专属弱点知识图谱
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                基于真实听力与实战对练，自动追踪收录易错词汇、中式英语漏洞与薄弱口音
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700/60 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-400">收录待突破难点</div>
              <div className="text-lg font-black text-purple-400">
                {stats.weaknesses.length} 个专项
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          {[
            { id: 'all', label: '全部难点' },
            { id: 'grammar', label: '中式英语/语法' },
            { id: 'pragmatic', label: '商务语用/得体度' },
            { id: 'accent', label: '口音盲区' },
            { id: 'word', label: '高频业务词' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterType === tab.id
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          共筛选出 <strong className="text-white">{filtered.length}</strong> 条记录
        </span>
      </div>

      {/* Weakness Record Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-800/40 rounded-2xl border border-slate-800">
          <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-400">
            暂无此类型弱点记录，继续在听力与模拟实战中挑战自己吧！
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((w) => (
            <div
              key={w.id}
              className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-purple-500/50 transition-all shadow-md flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        w.type === 'grammar'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : w.type === 'pragmatic'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                          : w.type === 'accent'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                      }`}
                    >
                      {w.type === 'grammar'
                        ? '语法与Chinglish'
                        : w.type === 'pragmatic'
                        ? '商务得体度'
                        : w.type === 'accent'
                        ? '多元口音'
                        : '核心词汇'}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-700/50 px-1.5 py-0.5 rounded">
                      {w.level}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500">
                    频次: {w.mistakeCount} 次 · 最近: {w.lastReviewed}
                  </span>
                </div>

                {/* Question / Mistake Item */}
                <h5 className="text-sm font-semibold text-white">
                  {w.item}
                </h5>

                {/* Correction or Tip */}
                <div className="mt-2 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="text-emerald-400 font-bold block mb-0.5">
                    💡 纠偏突破点：
                  </span>
                  {w.correction}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleSpeak(w.correction || w.item)}
                    className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="朗读示范"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition"
                    title="已掌握，从弱点图谱中移除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onStartSpecificPractice(w)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-semibold transition shadow-sm"
                >
                  <span>针对性复训</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
