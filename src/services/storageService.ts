import { UserStats, UserWeaknessRecord, ProficiencyLevel } from '../types';

const STORAGE_KEYS = {
  GEMINI_API_KEY: 'bizpulse_gemini_api_key',
  GEMINI_MODEL: 'bizpulse_gemini_model',
  USER_STATS: 'bizpulse_user_stats',
  CUSTOM_CORPUS: 'bizpulse_custom_corpus',
};

const DEFAULT_STATS: UserStats = {
  completedLessons: [],
  completedRoleplays: [],
  averageScore: 86,
  streakDays: 4,
  totalSpeakingMinutes: 28,
  totalListeningMinutes: 54,
  weaknesses: [
    {
      id: 'w-1',
      type: 'grammar',
      item: 'I suggest we to postpone the release date.',
      context: 'Sprint 排期沟通',
      correction: 'I suggest we postpone the release date. (suggest 后面接从句用虚拟语气原型或 -ing，不接不定式 to do)',
      mistakeCount: 3,
      lastReviewed: '2026-10-16',
      level: 'L2'
    },
    {
      id: 'w-2',
      type: 'pragmatic',
      item: 'You must give me the document today.',
      context: '跨部门协作催办',
      correction: 'Would it be possible to share the document with us by EOD today? (将生硬命令句转换为高情商咨询句)',
      mistakeCount: 4,
      lastReviewed: '2026-10-15',
      level: 'L2'
    },
    {
      id: 'w-3',
      type: 'accent',
      item: 'Indian English rhythm & dental t/d sounds',
      context: '供应商议价谈判',
      correction: '印度英语常将 /t/ 和 /d/ 卷舌发音，且语调上升。多注意抓取实义动词和数字重音。',
      mistakeCount: 2,
      lastReviewed: '2026-10-17',
      level: 'L3'
    },
    {
      id: 'w-4',
      type: 'word',
      item: 'Gross Margin Compression',
      context: '财报分析会议',
      correction: '毛利率收缩/被挤压 (高频投行及高管会财报术语)',
      mistakeCount: 2,
      lastReviewed: '2026-10-17',
      level: 'L4'
    }
  ]
};

export const storageService = {
  getApiKey(): string {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || '';
  },

  setApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key.trim());
  },

  getModel(): string {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_MODEL) || 'gemini-1.5-flash';
  },

  setModel(model: string): void {
    localStorage.setItem(STORAGE_KEYS.GEMINI_MODEL, model);
  },

  getUserStats(): UserStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_STATS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading stats from localStorage', e);
    }
    return DEFAULT_STATS;
  },

  saveUserStats(stats: UserStats): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving stats to localStorage', e);
    }
  },

  addWeakness(weakness: Omit<UserWeaknessRecord, 'id' | 'mistakeCount' | 'lastReviewed'>): void {
    const stats = this.getUserStats();
    const existingIndex = stats.weaknesses.findIndex(w => w.item.toLowerCase() === weakness.item.toLowerCase());
    const today = new Date().toISOString().split('T')[0];

    if (existingIndex >= 0) {
      stats.weaknesses[existingIndex].mistakeCount += 1;
      stats.weaknesses[existingIndex].lastReviewed = today;
    } else {
      stats.weaknesses.unshift({
        ...weakness,
        id: 'w-' + Date.now(),
        mistakeCount: 1,
        lastReviewed: today
      });
    }
    this.saveUserStats(stats);
  },

  removeWeakness(id: string): void {
    const stats = this.getUserStats();
    stats.weaknesses = stats.weaknesses.filter(w => w.id !== id);
    this.saveUserStats(stats);
  },

  getCustomCorpus(): string {
    return localStorage.getItem(STORAGE_KEYS.CUSTOM_CORPUS) || '';
  },

  saveCustomCorpus(text: string): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CORPUS, text);
  }
};
