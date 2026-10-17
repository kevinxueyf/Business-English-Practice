import React from 'react';
import { 
  Headphones, 
  Mic2, 
  BarChart3, 
  BrainCircuit, 
  Key, 
  Upload, 
  Flame, 
  Clock, 
  Sparkles,
  Settings2
} from 'lucide-react';
import { UserStats } from '../types';

export type NavTab = 'listening' | 'roleplay' | 'evaluation' | 'knowledge';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  stats: UserStats;
  hasApiKey: boolean;
  onOpenSettings: () => void;
  onOpenCorpus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  hasApiKey,
  onOpenSettings,
  onOpenCorpus
}) => {
  return (
    <>
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo & Brand */}
            <div 
              className="flex items-center space-x-2.5 cursor-pointer select-none" 
              onClick={() => setActiveTab('listening')}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-sky-500/20 ring-1 ring-white/20 shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
                    BizPulse AI
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                    实战
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden lg:block leading-none mt-0.5">
                  进阶商务英语 · 听-说-评-练闭环系统
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs (Hidden on mobile, mobile uses bottom bar) */}
            <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
              <button
                onClick={() => setActiveTab('listening')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'listening'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span>动态听力</span>
              </button>

              <button
                onClick={() => setActiveTab('roleplay')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'roleplay'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Mic2 className="w-4 h-4" />
                <span>场景模拟</span>
              </button>

              <button
                onClick={() => setActiveTab('evaluation')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'evaluation'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>四维诊断</span>
              </button>

              <button
                onClick={() => setActiveTab('knowledge')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'knowledge'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <BrainCircuit className="w-4 h-4" />
                <span>弱点追踪</span>
                {stats.weaknesses.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                )}
              </button>
            </nav>

            {/* Quick Actions & Status */}
            <div className="flex items-center space-x-2 sm:space-x-2.5">
              {/* Streak Badge */}
              <div className="flex items-center space-x-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 font-bold">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{stats.streakDays}d</span>
              </div>

              {/* Custom Corpus Button */}
              <button
                onClick={onOpenCorpus}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition"
                title="导入企业业务语料"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">导入语料</span>
              </button>

              {/* Gemini Settings Button */}
              <button
                onClick={onOpenSettings}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  hasApiKey
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                }`}
                title="配置 Gemini API Key"
              >
                <Key className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">
                  {hasApiKey ? 'Gemini 已连接' : '演示模式'}
                </span>
                <span className="sm:hidden">
                  {hasApiKey ? '已连' : '演示'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Floating Bottom Navigation Bar (iOS / Android App Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => setActiveTab('listening')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'listening'
              ? 'text-sky-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'listening' ? 'bg-sky-500/15' : ''}`}>
            <Headphones className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">动态听力</span>
        </button>

        <button
          onClick={() => setActiveTab('roleplay')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'roleplay'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'roleplay' ? 'bg-indigo-500/15' : ''}`}>
            <Mic2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">场景模拟</span>
        </button>

        <button
          onClick={() => setActiveTab('evaluation')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'evaluation'
              ? 'text-teal-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'evaluation' ? 'bg-teal-500/15' : ''}`}>
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">四维诊断</span>
        </button>

        <button
          onClick={() => setActiveTab('knowledge')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl relative transition-all ${
            activeTab === 'knowledge'
              ? 'text-purple-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'knowledge' ? 'bg-purple-500/15' : ''}`}>
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">弱点追踪</span>
          {stats.weaknesses.length > 0 && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900 animate-pulse"></span>
          )}
        </button>
      </nav>
    </>
  );
};
