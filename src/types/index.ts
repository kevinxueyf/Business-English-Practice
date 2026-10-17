export type ProficiencyLevel = 'L1' | 'L2' | 'L3' | 'L4';

export interface LevelInfo {
  id: ProficiencyLevel;
  title: string;
  subtitle: string;
  cefr: string;
  targetUser: string;
  coreObjective: string;
  listeningFeature: string;
  speakingFeature: string;
  accentTypes: string[];
  color: string;
  badgeBg: string;
}

export type QuestionType = 'detail_fill' | 'gist_choice' | 'subtext_analysis';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[]; // for choice
  correctAnswer: string;
  hint?: string;
  clueSentenceIndex?: number; // transcript line index where the answer/clue is located
  explanation: string;
  subtextInsights?: {
    surfaceMeaning: string;
    hiddenIntent: string;
    businessCultureNote: string;
  };
}

export interface TranscriptLine {
  id: string;
  speaker: string;
  role?: string;
  en: string;
  zh: string;
  timestamp?: string;
  accent?: string;
}

export interface ListeningLesson {
  id: string;
  level: ProficiencyLevel;
  title: string;
  industry: string;
  scenario: string;
  duration: string;
  accent: string;
  speed: number;
  transcript: TranscriptLine[];
  questions: Question[];
  keyVocabulary: {
    word: string;
    phonetic: string;
    definition: string;
    contextExample: string;
  }[];
}

export interface RoleplayPersona {
  id: string;
  name: string;
  title: string;
  company: string;
  accent: 'US' | 'UK' | 'IN' | 'JP' | 'AU' | 'EU';
  accentLabel: string;
  temperament: 'demanding' | 'collaborative' | 'hurried' | 'skeptical' | 'diplomatic';
  temperamentLabel: string;
  avatar: string;
  voicePitch: number;
  voiceRate: number;
  systemPrompt: string;
}

export interface RoleplayScenario {
  id: string;
  level: ProficiencyLevel;
  title: string;
  category: string;
  background: string;
  userGoal: string;
  persona: RoleplayPersona;
  initialMessage: string;
  potentialObjections: string[];
  suggestedPhrases: string[];
}

export interface DimensionScores {
  pronunciation: number;      // 0 - 100
  grammarVocabulary: number;  // 0 - 100
  businessPragmatics: number; // 0 - 100
  taskCompletion: number;     // 0 - 100
  overall: number;            // 0 - 100
}

export interface DetailedDiagnostic {
  pronunciationErrors: {
    word: string;
    issue: string;
    tip: string;
  }[];
  grammarIssues: {
    original: string;
    corrected: string;
    explanation: string;
    isChinglish: boolean;
  }[];
  pragmaticAdvice: {
    politenessScore: number;
    tactfulSuggestion: string;
    businessEtiquetteTip: string;
  };
  paraphrases: {
    concise: string;   // 极简清晰版
    diplomatic: string;// 高情商委婉版
    executive: string; // 投行高管专业版
  };
}

export interface SpeechEvaluationResult {
  transcript: string;
  scores: DimensionScores;
  diagnostic: DetailedDiagnostic;
  aiComment: string;
  completedGoals: string[];
  missedGoals: string[];
}

export interface UserWeaknessRecord {
  id: string;
  type: 'word' | 'grammar' | 'accent' | 'pragmatic';
  item: string;
  context: string;
  correction: string;
  mistakeCount: number;
  lastReviewed: string;
  level: ProficiencyLevel;
}

export interface UserStats {
  completedLessons: string[];
  completedRoleplays: string[];
  averageScore: number;
  streakDays: number;
  totalSpeakingMinutes: number;
  totalListeningMinutes: number;
  weaknesses: UserWeaknessRecord[];
  dailyWorkoutMinutes?: number; // 今日训练分钟数
  dailyGoalMinutes?: number;    // 每日目标（如15分钟）
}

export interface BusinessPhrase {
  id: string;
  category: string;
  categoryName: string;
  en: string;
  zh: string;
  phoneticTip?: string;
  businessContext: string;
  accent: 'US' | 'UK' | 'IN';
  difficulty: 'L1' | 'L2' | 'L3' | 'L4';
  isFavorite?: boolean;
}

export interface TedTalkSentence {
  id: string;
  speaker: string;
  en: string;
  zh: string;
  startSec: number;
  endSec: number;
  clue?: string;
}

export interface TedTalkLesson {
  id: string;
  title: string;
  speaker: string;
  speakerRole: string;
  category: string;
  coverImage: string;
  videoUrl?: string; // YouTube / MP4 embed url
  durationMinutes: number;
  recommendedDate: string;
  overview: string;
  executiveInsights: string;
  transcript: TedTalkSentence[];
  keyQuotes: string[];
}

export interface ShadowingEvaluation {
  userTranscript: string;
  referenceText: string;
  overallScore: number;
  fluencyScore: number;
  pronunciationScore: number;
  wordFeedback: {
    word: string;
    isMatch: boolean;
    status: 'good' | 'warning' | 'missed';
  }[];
  coachTip: string;
}
