import React, { useState } from 'react';
import { 
  DetailedDiagnostic, 
  ProficiencyLevel, 
  SpeechEvaluationResult 
} from '../../types';
import { 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  AlertTriangle, 
  HeartHandshake, 
  Briefcase, 
  ArrowRight,
  BookmarkPlus,
  RefreshCw
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import { storageService } from '../../services/storageService';

interface DiagnosticFeedbackProps {
  evaluation: SpeechEvaluationResult;
  level: ProficiencyLevel;
  onRetest?: () => void;
}

export const DiagnosticFeedback: React.FC<DiagnosticFeedbackProps> = ({
  evaluation,
  level,
  onRetest
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [addedWeakness, setAddedWeakness] = useState<string | null>(null);

  const { diagnostic, aiComment, completedGoals, missedGoals, transcript } = evaluation;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSpeak = (text: string) => {
    speechService.speak(text, {
      accent: 'US',
      rate: 1.0
    });
  };

  const handleSaveToWeakness = (original: string, corrected: string) => {
    storageService.addWeakness({
      type: 'grammar',
      item: original,
      context: '场景模拟实战',
      correction: corrected,
      level
    });
    setAddedWeakness(original);
    setTimeout(() => setAddedWeakness(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Mentor Synthesis Note */}
      <div className="bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-purple-950/40 border border-sky-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm mb-2">
          <Sparkles className="w-4 h-4" />
          <span>AI 教练复盘总评</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">
          {aiComment}
        </p>

        {/* Goals Achieved / Missed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-700/50 text-xs">
          <div>
            <span className="font-bold text-emerald-400 block mb-1">
              ✓ 达成业务目标：
            </span>
            <ul className="space-y-1 text-slate-300">
              {completedGoals.map((g, i) => (
                <li key={i} className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-bold text-amber-400 block mb-1">
              △ 待加强突破点：
            </span>
            <ul className="space-y-1 text-slate-300">
              {missedGoals.map((g, i) => (
                <li key={i} className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 1. Grammar & Chinglish Diagnosis */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <h4 className="text-sm font-bold text-white">
              语法纠偏与中式英语 (Chinglish) 替换
            </h4>
          </div>
          <span className="text-xs text-slate-400">告别逐字直译，迈向母语级精准表达</span>
        </div>

        <div className="space-y-3">
          {diagnostic.grammarIssues.map((issue, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  {/* Original with Red Highlight */}
                  <div className="flex items-baseline space-x-2 text-xs">
                    <span className="font-bold text-rose-400 shrink-0">原表达 (需修正):</span>
                    <span className="line-through text-rose-300 bg-rose-500/10 px-1.5 py-0.5 rounded">
                      {issue.original}
                    </span>
                  </div>

                  {/* Native Polished Phrasing */}
                  <div className="flex items-baseline space-x-2 text-xs">
                    <span className="font-bold text-emerald-400 shrink-0">地道替换 (Native):</span>
                    <span className="font-semibold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {issue.corrected}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => handleSpeak(issue.corrected)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="朗读地道表达"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleSaveToWeakness(issue.original, issue.corrected)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-400 transition"
                    title="收录至弱点追踪知识库"
                  >
                    {addedWeakness === issue.original ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <BookmarkPlus className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Explanation Note */}
              <p className="text-xs text-slate-400 pt-1 border-t border-slate-800 leading-normal">
                <span className="text-slate-300 font-medium">深度解析：</span> {issue.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Business Pragmatics & High-EQ Phrasing */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-bold text-white">
              商务语用与跨文化得体度 (High-EQ Diplomacy)
            </h4>
          </div>
          <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
            情商礼仪指数: {diagnostic.pragmaticAdvice.politenessScore} / 100
          </span>
        </div>

        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2 text-xs">
          <div className="text-slate-200 leading-relaxed">
            <span className="font-bold text-purple-300">委婉化建议：</span>
            {diagnostic.pragmaticAdvice.tactfulSuggestion}
          </div>
          <div className="text-slate-300 leading-relaxed pt-2 border-t border-purple-500/20">
            <span className="font-bold text-amber-300">跨国职场礼仪要诀：</span>
            {diagnostic.pragmaticAdvice.businessEtiquetteTip}
          </div>
        </div>
      </div>

      {/* 3. Three-tier Paraphrasing Engine (三级 AI 改写) */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
          <div>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Paraphrasing Engine
            </span>
            <h4 className="text-base font-bold text-white mt-0.5">
              AI 三级进阶改写建议 (一键发音对比)
            </h4>
          </div>
          <span className="text-xs text-slate-400">同一种意图，三种不同气场的职场高阶表达</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Version 1: Concise & Clear */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                  1. 极简清晰版 (Concise)
                </span>
                <span className="text-[10px] text-slate-400">日常站会/即时通讯</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                "{diagnostic.paraphrases.concise}"
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleSpeak(diagnostic.paraphrases.concise)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="播放发音"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleCopy(diagnostic.paraphrases.concise, 'concise')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="复制文本"
              >
                {copiedKey === 'concise' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Version 2: Diplomatic & Tactful */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                  2. 高情商委婉版 (Diplomatic)
                </span>
                <span className="text-[10px] text-slate-400">跨部门协作/客户维系</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                "{diagnostic.paraphrases.diplomatic}"
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleSpeak(diagnostic.paraphrases.diplomatic)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="播放发音"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleCopy(diagnostic.paraphrases.diplomatic, 'diplomatic')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="复制文本"
              >
                {copiedKey === 'diplomatic' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Version 3: Executive & Polished */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  3. 投行/高管专业版 (Executive)
                </span>
                <span className="text-[10px] text-slate-400">董事会/大型商务谈判</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                "{diagnostic.paraphrases.executive}"
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleSpeak(diagnostic.paraphrases.executive)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="播放发音"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleCopy(diagnostic.paraphrases.executive, 'executive')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="复制文本"
              >
                {copiedKey === 'executive' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Retest or Back to Simulation Button */}
      {onRetest && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onRetest}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>重新发起此场景模拟实操</span>
          </button>
        </div>
      )}
    </div>
  );
};
