import React, { useState } from 'react';
import { Sparkles, X, Loader2, BookOpen, Layers } from 'lucide-react';
import { ProficiencyLevel, ListeningLesson } from '../../types';
import { geminiService } from '../../services/geminiService';
import { storageService } from '../../services/storageService';

interface DynamicGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: ProficiencyLevel;
  onLessonGenerated: (lesson: ListeningLesson) => void;
}

const INDUSTRIES = [
  '软件与云计算 (SaaS & Cloud)',
  '跨境电商与供应链 (Cross-border E-commerce)',
  '投资银行与资本市场 (Investment Banking)',
  '生物医药与医疗健康 (BioTech & Healthcare)',
  '跨国管理咨询 (Management Consulting)',
  '新能源与先进制造 (Clean Energy & Manufacturing)'
];

const PRESET_TOPICS: Record<string, string[]> = {
  L1: ['新人入职欢迎与工牌领取', '预定会议室与日常办公用品申领', '确认客户会议时间与改期'],
  L2: ['每日站会 Sprint 进度汇报', '处理紧急 IT 工单与系统授权', '跨部门对齐产品排期与依赖'],
  L3: ['与印度供应商关于 SLA 价格谈判', '化解欧洲客户对交期延误的投诉', '向日本合作伙伴做新功能调研访谈'],
  L4: ['CFO 华尔街财报电话会答辩', '跨国董事会战略投资 1vN 质询', '应对突发数据泄露与媒体公关']
};

export const DynamicGeneratorModal: React.FC<DynamicGeneratorModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  onLessonGenerated
}) => {
  const [industry, setIndustry] = useState<string>(INDUSTRIES[0]);
  const [topic, setTopic] = useState<string>(PRESET_TOPICS[currentLevel]?.[0] || '跨部门沟通');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    const corpus = storageService.getCustomCorpus();
    const finalTopic = customPrompt.trim() ? `${topic} - ${customPrompt}` : topic;

    try {
      const newLesson = await geminiService.generateDynamicListening(
        currentLevel,
        industry,
        finalTopic,
        corpus
      );
      onLessonGenerated(newLesson);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>AI 动态听力剧本生成器</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                {currentLevel} 难度
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              直接调用 Gemini 模型，根据行业和业务场景实时生成高拟真对话与三维题型
            </p>
          </div>
        </div>

        {/* Form Controls */}
        <div className="space-y-4">
          {/* Industry Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              1. 选择所属行业领域
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Preset Topics */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              2. 选择实战情境主题
            </label>
            <div className="grid grid-cols-1 gap-2">
              {(PRESET_TOPICS[currentLevel] || []).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition ${
                    topic === t
                      ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-semibold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Topic Prompt */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              3. 自定义情景细节要求 (可选)
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="如：涉及预算缩减 15%，对方语速较快且带轻微德国口音..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Notice about corpus integration */}
          {storageService.getCustomCorpus() && (
            <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-[11px] text-indigo-300 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>检测到您已导入企业语料库，AI 将自动抽取真实业务词汇注入新剧本中。</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            取消
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-sky-500/25 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gemini 正在创作听力剧本...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>立即生成新听力</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
