import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck, Cpu } from 'lucide-react';
import { storageService } from '../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [apiKey, setApiKey] = useState<string>(storageService.getApiKey());
  const [model, setModel] = useState<string>(storageService.getModel());
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    storageService.setApiKey(apiKey);
    storageService.setModel(model);
    setIsSaved(true);
    onSaved();
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setApiKey('');
    storageService.setApiKey('');
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Google Gemini 多模态 API 配置
            </h3>
            <p className="text-xs text-slate-400">
              配置个人 API Key 以解锁 Gemini 动态听力生成与实时会议大模型交互
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center space-x-1"
              >
                <span>免费获取 Gemini Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>选择 Gemini 模型版本</span>
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (极速推荐，低延迟)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (深层逻辑与高难度辩驳)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (最新世代体验)</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>本地安全存储与免配置演示模式</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              • 您的 API Key 仅保存在当前浏览器的 localStorage 中，绝不上传任何中转服务器。<br />
              • 未配置 Key 时系统自动运行在<strong>智能演示模式</strong>，内置高品质跨国真实题库、声学 TTS、四维评分与三级改写，全功能畅通无阻！
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-rose-400 transition"
          >
            清除 Key (使用演示模式)
          </button>

          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition shadow-md shadow-sky-500/20"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>已保存！</span>
                </>
              ) : (
                <span>保存配置</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
