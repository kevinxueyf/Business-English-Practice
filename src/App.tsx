import React, { useState, useEffect } from 'react';
import { 
  ProficiencyLevel, 
  ListeningLesson, 
  RoleplayScenario, 
  SpeechEvaluationResult,
  UserWeaknessRecord,
  UserStats
} from './types';
import { LEVELS, PRESET_LESSONS } from './data/levelsData';
import { ROLEPLAY_SCENARIOS } from './data/roleplayScenarios';
import { storageService } from './services/storageService';
import { Navbar, NavTab } from './components/Navbar';
import { LevelSelector } from './components/LevelSelector';
import { ListeningPlayer } from './components/ListeningModule/ListeningPlayer';
import { TranscriptViewer } from './components/ListeningModule/TranscriptViewer';
import { QuestionCard } from './components/ListeningModule/QuestionCard';
import { DynamicGeneratorModal } from './components/ListeningModule/DynamicGeneratorModal';
import { MeetingRoom } from './components/RoleplayModule/MeetingRoom';
import { ScoreRadar } from './components/EvaluationModule/ScoreRadar';
import { DiagnosticFeedback } from './components/EvaluationModule/DiagnosticFeedback';
import { WeaknessTracker } from './components/KnowledgeGraph/WeaknessTracker';
import { SettingsModal } from './components/SettingsModal';
import { CorpusUploadModal } from './components/CorpusUploadModal';
import { 
  Sparkles, 
  BookOpen, 
  Volume2, 
  Mic2, 
  ArrowRight, 
  CheckCircle2, 
  Award,
  Layers
} from 'lucide-react';
import { speechService } from './services/speechService';

export const App: React.FC = () => {
  // Navigation & Modal states
  const [activeTab, setActiveTab] = useState<NavTab>('listening');
  const [currentLevel, setCurrentLevel] = useState<ProficiencyLevel>('L2');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isCorpusOpen, setIsCorpusOpen] = useState<boolean>(false);
  const [isDynamicModalOpen, setIsDynamicModalOpen] = useState<boolean>(false);

  // App Data states
  const [stats, setStats] = useState<UserStats>(storageService.getUserStats());
  const [hasApiKey, setHasApiKey] = useState<boolean>(Boolean(storageService.getApiKey()));
  const [lessons, setLessons] = useState<ListeningLesson[]>(PRESET_LESSONS);
  const [currentLesson, setCurrentLesson] = useState<ListeningLesson>(
    PRESET_LESSONS.find(l => l.level === 'L2') || PRESET_LESSONS[0]
  );
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [isListeningPlaying, setIsListeningPlaying] = useState<boolean>(false);
  const [clueSentenceIndex, setClueSentenceIndex] = useState<number | undefined>(undefined);

  // Roleplay states
  const [currentScenario, setCurrentScenario] = useState<RoleplayScenario>(
    ROLEPLAY_SCENARIOS.find(s => s.level === 'L2') || ROLEPLAY_SCENARIOS[0]
  );

  // Evaluation states
  const [latestEvaluation, setLatestEvaluation] = useState<SpeechEvaluationResult | null>(null);

  // 当切换等级时，自动同步对应等级的课程与实战场景
  const handleLevelChange = (lvl: ProficiencyLevel) => {
    setCurrentLevel(lvl);
    const matchedLesson = lessons.find(l => l.level === lvl) || lessons[0];
    setCurrentLesson(matchedLesson);
    setCurrentSentenceIndex(0);
    setClueSentenceIndex(undefined);
    setIsListeningPlaying(false);
    speechService.stop();

    const matchedScenario = ROLEPLAY_SCENARIOS.find(s => s.level === lvl) || ROLEPLAY_SCENARIOS[0];
    setCurrentScenario(matchedScenario);
  };

  const handleLessonGenerated = (newLesson: ListeningLesson) => {
    setLessons(prev => [newLesson, ...prev]);
    setCurrentLesson(newLesson);
    setCurrentSentenceIndex(0);
    setClueSentenceIndex(undefined);
    setIsListeningPlaying(false);
  };

  const handleFinishMeeting = (evaluation: SpeechEvaluationResult) => {
    setLatestEvaluation(evaluation);
    setActiveTab('evaluation');
    setStats(storageService.getUserStats());
  };

  const handleStartSpecificPractice = (weakness: UserWeaknessRecord) => {
    // 切换到与该弱点相配的等级和场景
    handleLevelChange(weakness.level);
    setActiveTab('roleplay');
  };

  const handleWordSpeak = (word: string) => {
    speechService.speak(word, { accent: 'US', rate: 0.9 });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        hasApiKey={hasApiKey}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCorpus={() => setIsCorpusOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Step 1: 进阶路线选择器 (L1 -> L4) */}
        <LevelSelector
          currentLevel={currentLevel}
          onSelectLevel={handleLevelChange}
        />

        {/* =========================================================================
            MODULE 1: AI 驱动的动态听力模块 (Listening Comprehension)
            ========================================================================= */}
        {activeTab === 'listening' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Lesson Selector & Generator Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 gap-3">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-xs font-bold text-slate-400 shrink-0">
                  {currentLevel} 实战剧本:
                </span>
                {lessons
                  .filter(l => l.level === currentLevel)
                  .map(lesson => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setCurrentLesson(lesson);
                        setCurrentSentenceIndex(0);
                        setClueSentenceIndex(undefined);
                        setIsListeningPlaying(false);
                        speechService.stop();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                        currentLesson.id === lesson.id
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {lesson.title.split('(')[0].trim()}
                    </button>
                  ))}
              </div>

              {/* Dynamic AI Generator Button */}
              <button
                onClick={() => setIsDynamicModalOpen(true)}
                className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-500/20 shrink-0 transition"
                title="根据您的行业和要求，调用 Gemini 动态生成全新听力剧本"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI 动态生成新行业剧本</span>
              </button>
            </div>

            {/* Listening Audio Player with Multi-accent & Waveform */}
            <ListeningPlayer
              lesson={currentLesson}
              currentSentenceIndex={currentSentenceIndex}
              onSentenceChange={(idx) => setCurrentSentenceIndex(idx)}
              isPlaying={isListeningPlaying}
              setIsPlaying={setIsListeningPlaying}
            />

            {/* Key Vocabulary Quick Bar */}
            {currentLesson.keyVocabulary && currentLesson.keyVocabulary.length > 0 && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center space-x-2 mb-2 text-xs font-bold text-sky-400">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>本课核心职场高频术语 (点击可单字发音)：</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {currentLesson.keyVocabulary.map((vocab, i) => (
                    <div
                      key={i}
                      onClick={() => handleWordSpeak(vocab.word)}
                      className="p-2.5 rounded-xl bg-slate-850/80 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition flex items-start justify-between group"
                    >
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-sky-300">
                            {vocab.word}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {vocab.phonetic}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          {vocab.definition}
                        </p>
                      </div>
                      <Volume2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0 mt-0.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Two Column Layout: Left = Interactive Transcript; Right = 3-Dimension Questions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (7 cols): Bilingual Interactive Transcript */}
              <div className="lg:col-span-7">
                <TranscriptViewer
                  transcript={currentLesson.transcript}
                  currentIndex={currentSentenceIndex}
                  onSelectSentence={(idx) => setCurrentSentenceIndex(idx)}
                  clueSentenceIndex={clueSentenceIndex}
                />
              </div>

              {/* Right Column (5 cols): AI Multi-dimensional Question Cards */}
              <div className="lg:col-span-5">
                <QuestionCard
                  questions={currentLesson.questions}
                  transcript={currentLesson.transcript}
                  onHighlightClue={(idx) => setClueSentenceIndex(idx)}
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODULE 2: 动态场景模拟引擎 (AI Roleplay)
            ========================================================================= */}
        {activeTab === 'roleplay' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Scenario Quick Selector Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 gap-3">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-xs font-bold text-slate-400 shrink-0">
                  {currentLevel} 会议模拟实战:
                </span>
                {ROLEPLAY_SCENARIOS
                  .filter(s => s.level === currentLevel)
                  .map(s => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentScenario(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                        currentScenario.id === s.id
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {s.title.split('(')[0].trim()}
                    </button>
                  ))}
              </div>

              <div className="text-xs text-indigo-400 font-semibold flex items-center space-x-1.5 shrink-0">
                <Mic2 className="w-4 h-4" />
                <span>支持语音输入、静音自动切话与中途打断</span>
              </div>
            </div>

            {/* Immersive Meeting Room Simulation */}
            <MeetingRoom
              scenario={currentScenario}
              onFinishMeeting={handleFinishMeeting}
            />
          </div>
        )}

        {/* =========================================================================
            MODULE 3: 四维实时评分与反馈系统 (Evaluation Module)
            ========================================================================= */}
        {activeTab === 'evaluation' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {latestEvaluation ? (
              <>
                {/* 4 Dimension Score Visualizer */}
                <ScoreRadar scores={latestEvaluation.scores} />

                {/* Detailed Diagnostic with Chinglish Correction & 3-Tier Paraphrasing */}
                <DiagnosticFeedback
                  evaluation={latestEvaluation}
                  level={currentLevel}
                  onRetest={() => setActiveTab('roleplay')}
                />
              </>
            ) : (
              /* If user has not completed a meeting yet, show comprehensive demo diagnostic */
              <div className="space-y-6">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center">
                  <Award className="w-10 h-10 text-teal-400 mx-auto mb-2" />
                  <h3 className="text-base font-bold text-white">
                    四维实时诊断实验室 (示例预览)
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                    完成一场“场景模拟”会议后，系统将为您生成细颗粒度的发音流利度、中式英语纠偏与高情商三级改写报告。
                  </p>
                  <button
                    onClick={() => setActiveTab('roleplay')}
                    className="mt-4 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-md shadow-teal-600/20"
                  >
                    立即开启一场 1v1 会议实战
                  </button>
                </div>

                {/* Default showcase scores */}
                <ScoreRadar
                  scores={{
                    pronunciation: 88,
                    grammarVocabulary: 82,
                    businessPragmatics: 85,
                    taskCompletion: 90,
                    overall: 86
                  }}
                />

                <DiagnosticFeedback
                  evaluation={{
                    transcript: "I suggest we to postpone the Friday release because third-party API is blocked.",
                    scores: {
                      pronunciation: 88,
                      grammarVocabulary: 82,
                      businessPragmatics: 85,
                      taskCompletion: 90,
                      overall: 86
                    },
                    diagnostic: {
                      pronunciationErrors: [
                        {
                          word: "postpone",
                          issue: "第二音节 /poʊn/ 双元音不够饱满，重音在第二音节",
                          tip: "读作 /pəʊstˈpəʊn/，弱读首音节，重读末尾。"
                        }
                      ],
                      grammarIssues: [
                        {
                          original: "I suggest we to postpone...",
                          corrected: "I suggest we postpone / I propose postponing...",
                          explanation: "suggest 后面接从句用虚拟语气原型（省略 should），不可接不定式 to do，这是最典型的中式英语漏洞。",
                          isChinglish: true
                        }
                      ],
                      pragmaticAdvice: {
                        politenessScore: 85,
                        tactfulSuggestion: "将生硬的 'because API is blocked' 改为 'due to an external dependency bottleneck'，更能体现专业敏捷素养。",
                        businessEtiquetteTip: "在向管理层提出延期时，永远在指出问题的同时附带一个备选方案 (Mitigation Plan)。"
                      },
                      paraphrases: {
                        concise: "We recommend moving the release date to next Tuesday due to pending API credentials.",
                        diplomatic: "Would it be feasible to target next Tuesday for the rollout to ensure full end-to-end testing?",
                        executive: "To safeguard platform stability, we propose phasing the launch: internal validation on Friday, general release on Tuesday."
                      }
                    },
                    aiComment: "整体业务逻辑非常清晰，目标达成度极高！重点纠正 suggest 从句的语法细节，并在会议中主动抛出 Plan B，职场表现将更显沉稳高管范。",
                    completedGoals: ["明确指出了外部依赖风险", "给出了合理的延期诉求"],
                    missedGoals: ["可补充一个无需延期的临时备选方案 (Fallback)"]
                  }}
                  level={currentLevel}
                  onRetest={() => setActiveTab('roleplay')}
                />
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            MODULE 4: “教练式”复盘与个人知识图谱 (Knowledge Graph)
            ========================================================================= */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <WeaknessTracker
              stats={stats}
              onRefreshStats={() => setStats(storageService.getUserStats())}
              onStartSpecificPractice={handleStartSpecificPractice}
            />
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-400">BizPulse AI</span> · 进阶式商务英语口语与听力实战闭环
          </div>
          <div>
            基于 React 19 + TypeScript + Vite + Google Gemini 多模态 API 构建
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={() => {
          setHasApiKey(Boolean(storageService.getApiKey()));
        }}
      />

      <CorpusUploadModal
        isOpen={isCorpusOpen}
        onClose={() => setIsCorpusOpen(false)}
        onSaved={() => {
          // updated corpus
        }}
      />

      <DynamicGeneratorModal
        isOpen={isDynamicModalOpen}
        onClose={() => setIsDynamicModalOpen(false)}
        currentLevel={currentLevel}
        onLessonGenerated={handleLessonGenerated}
      />
    </div>
  );
};
export default App;
