import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Lightbulb, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { Question, TranscriptLine } from '../../types';
import { geminiService } from '../../services/geminiService';
import confetti from 'canvas-confetti';

interface QuestionCardProps {
  questions: Question[];
  transcript: TranscriptLine[];
  onHighlightClue: (index: number | undefined) => void;
  onNextLesson?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questions,
  transcript,
  onHighlightClue
}) => {
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<
    Record<string, { isCorrect: boolean; score: number; feedback: string }>
  >({});
  const [showHint, setShowHint] = useState<boolean>(false);

  const question = questions[currentQIndex];
  const currentAnswer = userInputs[question?.id] || '';
  const currentResult = results[question?.id];

  const handleSelectOption = (option: string) => {
    setUserInputs(prev => ({ ...prev, [question.id]: option }));
  };

  const handleInputChange = (val: string) => {
    setUserInputs(prev => ({ ...prev, [question.id]: val }));
  };

  const handleSubmit = () => {
    if (!currentAnswer.trim()) return;

    const grading = geminiService.gradeAnswer(question, currentAnswer);
    setResults(prev => ({ ...prev, [question.id]: grading }));

    // 高亮听力原文中对应的线索句
    if (question.clueSentenceIndex !== undefined) {
      onHighlightClue(question.clueSentenceIndex);
    }

    if (grading.isCorrect) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // ignore confetti errors
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(currentQIndex + 1);
      setShowHint(false);
      onHighlightClue(undefined);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
      setShowHint(false);
      onHighlightClue(undefined);
    }
  };

  if (!question) return null;

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header Question Status */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded border ${
                question.type === 'detail_fill'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : question.type === 'gist_choice'
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                  : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
              }`}
            >
              {question.type === 'detail_fill'
                ? '细节捕获 (填空)'
                : question.type === 'gist_choice'
                ? '主旨理解 (选择)'
                : '弦外之音 (深度剖析)'}
            </span>
            <span className="text-xs text-slate-400">
              第 {currentQIndex + 1} 题 / 共 {questions.length} 题
            </span>
          </div>

          {/* Quick Question Navigator Dots */}
          <div className="flex items-center space-x-1.5">
            {questions.map((q, idx) => {
              const res = results[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQIndex(idx);
                    onHighlightClue(undefined);
                  }}
                  className={`w-6 h-6 rounded-md text-xs font-bold transition flex items-center justify-center ${
                    idx === currentQIndex
                      ? 'bg-sky-500 text-white ring-2 ring-sky-400/50'
                      : res
                      ? res.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-slate-700/60 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Prompt */}
        <h4 className="text-base font-semibold text-white leading-snug mb-4">
          {question.prompt}
        </h4>

        {/* Question Interactive Area */}
        <div className="space-y-3 mb-5">
          {/* 1. Multiple Choice Options */}
          {question.type === 'gist_choice' && question.options && (
            <div className="space-y-2">
              {question.options.map((opt, i) => {
                const optLetter = opt.charAt(0);
                const isSelected = currentAnswer === optLetter || currentAnswer === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(optLetter)}
                    disabled={Boolean(currentResult)}
                    className={`w-full text-left p-3 rounded-xl border text-sm transition-all flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-500 text-white font-medium ring-1 ring-sky-500/50'
                        : 'bg-slate-850/60 border-slate-700/60 text-slate-300 hover:bg-slate-700/40 hover:border-slate-600'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {optLetter}
                    </span>
                    <span className="leading-relaxed">{opt.slice(2).trim()}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. Fill-in the blank or Subtext written response */}
          {(question.type === 'detail_fill' || question.type === 'subtext_analysis') && (
            <div>
              <textarea
                value={currentAnswer}
                onChange={(e) => handleInputChange(e.target.value)}
                disabled={Boolean(currentResult)}
                placeholder={
                  question.type === 'detail_fill'
                    ? '请输入您在听力中捕捉到的具体数字、时间、费用或指标...'
                    : '请分析说话人为什么这样说？其真实的职场潜台词与商业动机是什么？'
                }
                rows={3}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              />
            </div>
          )}
        </div>

        {/* Action Button: Submit / Check */}
        {!currentResult ? (
          <div className="flex items-center justify-between pt-2">
            {question.hint && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? '收起提示' : '查看解题线索提示'}</span>
              </button>
            )}
            <div className="ml-auto">
              <button
                onClick={handleSubmit}
                disabled={!currentAnswer.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交即刻核对
              </button>
            </div>
          </div>
        ) : (
          /* Feedback & Explanation Card */
          <div className="space-y-4 pt-2">
            <div
              className={`p-4 rounded-xl border ${
                currentResult.isCorrect
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold text-sm mb-1">
                {currentResult.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>恭喜！理解准确 ({currentResult.score}分)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>需要复盘核对 ({currentResult.score}分)</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                {currentResult.feedback}
              </p>
            </div>

            {/* In-depth Business Culture & Subtext Analysis */}
            {question.subtextInsights && (
              <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-300">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>弦外之音与跨文化商业潜台词</span>
                </div>
                <div className="text-xs space-y-1.5 text-slate-300">
                  <div>
                    <span className="text-slate-400 font-medium">表面表达 (Surface): </span>
                    <span>{question.subtextInsights.surfaceMeaning}</span>
                  </div>
                  <div>
                    <span className="text-purple-300 font-semibold">真实动机 (Subtext): </span>
                    <span className="text-purple-200">{question.subtextInsights.hiddenIntent}</span>
                  </div>
                  <div>
                    <span className="text-amber-300 font-medium">职场通识 (Takeaway): </span>
                    <span className="text-slate-300">{question.subtextInsights.businessCultureNote}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Standard Explanation & Clue Link */}
            <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-3 text-xs text-slate-300">
              <span className="font-bold text-sky-400">听力线索解析：</span>
              <span className="ml-1 text-slate-300">{question.explanation}</span>
            </div>

            {/* Next / Previous Question navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQIndex === 0}
                className="px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-xs text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                上一题
              </button>

              {currentQIndex + 1 < questions.length ? (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition"
                >
                  <span>下一题</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>全部题目完成！可进入场景模拟对练</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Hint drawer */}
        {showHint && question.hint && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{question.hint}</span>
          </div>
        )}
      </div>
    </div>
  );
};
