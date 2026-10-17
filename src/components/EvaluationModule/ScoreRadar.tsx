import React from 'react';
import { DimensionScores } from '../../types';
import { Award, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

interface ScoreRadarProps {
  scores: DimensionScores;
}

export const ScoreRadar: React.FC<ScoreRadarProps> = ({ scores }) => {
  const dimensions = [
    {
      label: '发音与流利度',
      sub: 'Pronunciation & Rhythm',
      score: scores.pronunciation,
      color: 'bg-emerald-500',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30'
    },
    {
      label: '语法与精准词汇',
      sub: 'Grammar & Chinglish Fix',
      score: scores.grammarVocabulary,
      color: 'bg-blue-500',
      text: 'text-blue-400',
      border: 'border-blue-500/30'
    },
    {
      label: '商务语用与得体度',
      sub: 'Business Pragmatics & EQ',
      score: scores.businessPragmatics,
      color: 'bg-purple-500',
      text: 'text-purple-400',
      border: 'border-purple-500/30'
    },
    {
      label: '核心任务达成率',
      sub: 'Goal & Objection Clearance',
      score: scores.taskCompletion,
      color: 'bg-amber-500',
      text: 'text-amber-400',
      border: 'border-amber-500/30'
    }
  ];

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/60 gap-3">
        <div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            四维实时诊断核心评估单元
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            口语综合得分与多维能力拆解
          </h3>
        </div>

        {/* Overall Big Score Badge */}
        <div className="flex items-center space-x-3 bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-700 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-2xl text-white shadow-md shadow-sky-500/20">
            {scores.overall}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-300">
              综合实战评定
            </div>
            <div className="text-[11px] text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {scores.overall >= 85
                  ? '具备跨国独立沟通水准'
                  : scores.overall >= 70
                  ? '具备良好业务协作能力'
                  : '需加强高频句式强化'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Dimension Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {dimensions.map((dim, i) => (
          <div
            key={i}
            className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white">{dim.label}</span>
                <span className="text-[10px] text-slate-400 block">{dim.sub}</span>
              </div>
              <span className={`font-mono text-base font-extrabold ${dim.text}`}>
                {dim.score} <span className="text-xs text-slate-500 font-normal">/100</span>
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${dim.color}`}
                style={{ width: `${dim.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
