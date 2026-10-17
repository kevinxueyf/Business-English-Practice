import React, { useState } from 'react';
import { Upload, X, Check, FileText, Sparkles, BookOpen, Trash2 } from 'lucide-react';
import { storageService } from '../services/storageService';

interface CorpusUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const SAMPLE_CORPUS = `Project Artemis: Q4 Cross-Border Payment Infrastructure Migration.
Background:
- Our legacy billing engine suffers from high transaction drop rates in Southeast Asia (specifically Indonesia and Vietnam).
- SLA target: 99.98% uptime, transaction latency under 250ms.
- Key stakeholders: Regional VP Vikram, Head of Compliance Sarah, Lead Architect Marcus.
- Blocker: Third-party webhook token authentication fails intermittently during peak hours.
- Risk Mitigation: Deploy fallback mock service and negotiate 15% SLA penalty credit with cloud vendors.`;

export const CorpusUploadModal: React.FC<CorpusUploadModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [corpusText, setCorpusText] = useState<string>(storageService.getCustomCorpus());
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    storageService.saveCustomCorpus(corpusText);
    setIsSaved(true);
    onSaved();
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleInsertSample = () => {
    setCorpusText(SAMPLE_CORPUS);
  };

  const handleClear = () => {
    setCorpusText('');
    storageService.saveCustomCorpus('');
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>企业级业务语料库导入</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                专属定制
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              粘贴您的真实业务邮件、PRD 需求、会议纪要或产品白皮书，AI 将据此生成专属听力与对练！
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              企业业务材料内容 (英文/中英双语)
            </span>
            <button
              onClick={handleInsertSample}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>载入示例语料 (SaaS项目排期)</span>
            </button>
          </div>

          <textarea
            value={corpusText}
            onChange={(e) => setCorpusText(e.target.value)}
            rows={7}
            placeholder="在此粘贴您的业务文档、英文工作汇报、客户邮件往来或核心术语清单..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed resize-none"
          />

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400">
            💡 <strong>如何生效：</strong> 当您在“动态听力”或“场景模拟”中选择使用 AI 生成时，Gemini 会自动提取上文中出现的项目代号、SLA、排期及矛盾冲突点，生成完全贴合您真实工作的实战场景！
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-rose-400 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>清空语料库</span>
          </button>

          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              关闭
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>已保存！</span>
                </>
              ) : (
                <span>保存并应用</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
