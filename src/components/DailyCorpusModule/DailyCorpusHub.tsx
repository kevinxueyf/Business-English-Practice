import React, { useState } from 'react';
import { DailyWorkoutTimer } from './DailyWorkoutTimer';
import { Business900View } from './Business900View';
import { DailyTedView } from './DailyTedView';
import { BookOpen, Sparkles, Video, BookmarkCheck } from 'lucide-react';
import { storageService } from '../../services/storageService';

interface DailyCorpusHubProps {
  onMinutesUpdated?: () => void;
}

export const DailyCorpusHub: React.FC<DailyCorpusHubProps> = ({ onMinutesUpdated }) => {
  const [subTab, setSubTab] = useState<'b900' | 'ted'>('b900');
  const [todayMinutes, setTodayMinutes] = useState<number>(() => {
    const stats = storageService.getUserStats();
    return stats.dailyWorkoutMinutes || 6;
  });

  const handleAddMinutes = (mins: number) => {
    const stats = storageService.getUserStats();
    const newMins = (stats.dailyWorkoutMinutes || 0) + mins;
    stats.dailyWorkoutMinutes = newMins;
    storageService.saveUserStats(stats);
    setTodayMinutes(newMins);
    onMinutesUpdated?.();
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* 1. Daily 10-20 min Workout Tracker */}
      <DailyWorkoutTimer
        currentMinutes={todayMinutes}
        targetMinutes={15}
        onAddMinutes={handleAddMinutes}
      />

      {/* 2. Top Sub-navigation Switcher: 商务英语 900 句 vs Gemini 每日 TED 演讲 */}
      <div className="flex rounded-2xl bg-slate-900 p-1 border border-slate-800 shadow-md">
        <button
          onClick={() => setSubTab('b900')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            subTab === 'b900'
              ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>商务英语 900 句 (分类场景复读)</span>
        </button>

        <button
          onClick={() => setSubTab('ted')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            subTab === 'ted'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Gemini 每日 TED 演讲 (音视频切片)</span>
        </button>
      </div>

      {/* 3. Sub-views */}
      {subTab === 'b900' ? <Business900View /> : <DailyTedView />}
    </div>
  );
};
