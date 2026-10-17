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
  ExternalLink
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
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('listening')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-sky-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
                  BizPulse AI
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  实战闭环
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">进阶商务英语 · 听-说-评-练闭环系统</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('listening')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
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
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
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
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'evaluation'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">四维诊断</span>
              <span className="md:hidden">诊断</span>
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'knowledge'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span className="hidden md:inline">弱点追踪</span>
              <span className="md:hidden">复盘</span>
              {stats.weaknesses.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
              )}
            </button>
          </nav>

          {/* Quick Actions & Status */}
          <div className="flex items-center space-x-3">
            {/* Streak & Time Badges */}
            <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/40">
              <span className="flex items-center space-x-1 text-amber-400 font-semibold" title="连续打卡天数">
                <Flame className="w-4 h-4" />
                <span>{stats.streakDays} 天连续</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center space-x-1 text-sky-400" title="今日已累计听练时长">
                <Clock className="w-3.5 h-3.5" />
                <span>{stats.totalListeningMinutes + stats.totalSpeakingMinutes} 分钟</span>
              </span>
            </div>

            {/* Custom Corpus Button */}
            <button
              onClick={onOpenCorpus}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition"
              title="导入业务文档/PRD/邮件生成专属题库"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">导入语料</span>
            </button>

            {/* Gemini API Key Setting */}
            <button
              onClick={onOpenSettings}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-sm ${
                hasApiKey
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              }`}
              title="配置 Google Gemini API Key"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {hasApiKey ? 'Gemini 已连接' : 'Gemini 演示模式'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
