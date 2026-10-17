import React, { useState } from 'react';
import { Volume2, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { TranscriptLine } from '../../types';
import { speechService } from '../../services/speechService';

interface TranscriptViewerProps {
  transcript: TranscriptLine[];
  currentIndex: number;
  onSelectSentence: (index: number) => void;
  clueSentenceIndex?: number;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  transcript,
  currentIndex,
  onSelectSentence,
  clueSentenceIndex
}) => {
  const [showChinese, setShowChinese] = useState<boolean>(true);

  const handleSpeakSentence = (line: TranscriptLine, index: number) => {
    onSelectSentence(index);
    speechService.speak(line.en, {
      accent: line.accent || 'US',
      rate: 1.0
    });
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/50 mb-3">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
            <span>双语逐句精听文本</span>
            <span className="text-xs text-slate-400 font-normal">(点击单句即可发音回放)</span>
          </h3>
        </div>

        {/* Hide / Show Chinese toggle */}
        <button
          onClick={() => setShowChinese(!showChinese)}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition border border-slate-600/40"
          title="切换中文译文显示"
        >
          {showChinese ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              <span>隐藏译文 (盲听模式)</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>显示中文译文</span>
            </>
          )}
        </button>
      </div>

      {/* Transcript Line List */}
      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
        {transcript.map((line, idx) => {
          const isCurrent = idx === currentIndex;
          const isClue = clueSentenceIndex === idx;

          return (
            <div
              key={line.id}
              onClick={() => handleSpeakSentence(line, idx)}
              className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                isClue
                  ? 'bg-amber-950/30 border-amber-500/70 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/40'
                  : isCurrent
                  ? 'bg-sky-950/40 border-sky-500 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/30'
                  : 'bg-slate-850/50 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700'
              }`}
            >
              {/* Clue sentence marker */}
              {isClue && (
                <div className="absolute -top-2.5 right-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  <span>核心线索句 (Answer Clue)</span>
                </div>
              )}

              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-sky-400">
                    {line.speaker}
                  </span>
                  {line.role && (
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/50">
                      {line.role}
                    </span>
                  )}
                  {line.accent && (
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                      {line.accent}
                    </span>
                  )}
                </div>

                <button
                  className={`p-1 rounded-md transition ${
                    isCurrent
                      ? 'text-sky-400 bg-sky-500/10'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title="朗读此句"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* English Sentence */}
              <p
                className={`text-sm leading-relaxed ${
                  isCurrent ? 'font-semibold text-white' : 'text-slate-200'
                }`}
              >
                {line.en}
              </p>

              {/* Chinese Translation */}
              {showChinese && (
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  {line.zh}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
