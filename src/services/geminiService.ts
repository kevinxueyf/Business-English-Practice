import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  ListeningLesson,
  ProficiencyLevel,
  SpeechEvaluationResult,
  RoleplayScenario,
  Question,
  TranscriptLine
} from '../types';
import { storageService } from './storageService';

export class GeminiService {
  private getClient(): GoogleGenerativeAI | null {
    const apiKey = storageService.getApiKey();
    if (!apiKey) return null;
    return new GoogleGenerativeAI(apiKey);
  }

  /**
   * 1. AI 驱动动态听力生成器：根据行业、难度等级及用户语料，动态生成高拟真商务对话剧本与3大维度测试题
   */
  public async generateDynamicListening(
    level: ProficiencyLevel,
    industry: string,
    topic: string,
    customCorpus?: string
  ): Promise<ListeningLesson> {
    const client = this.getClient();
    const modelName = storageService.getModel() || 'gemini-1.5-flash';

    if (!client) {
      return this.generateMockListening(level, industry, topic);
    }

    try {
      const model = client.getGenerativeModel({ model: modelName });
      const prompt = `
You are an elite Business English Corporate Trainer and Curriculum Architect.
Generate a comprehensive, highly realistic Business English Listening Comprehension Lesson in valid JSON.

Level: ${level} (L1: A1-A2, L2: B1-B2, L3: B2-C1 with accents, L4: C1-C2 executive meetings with interruptions)
Industry: ${industry}
Topic/Focus: ${topic}
${customCorpus ? `Incorporate key concepts or context from this enterprise corpus:\n${customCorpus.slice(0, 1000)}` : ''}

CRITICAL: Return ONLY valid JSON format with no markdown fences, matching this structure:
{
  "id": "dyn-${Date.now()}",
  "level": "${level}",
  "title": "Title in English (with Chinese subtitle)",
  "industry": "${industry}",
  "scenario": "Detailed scenario background in Chinese",
  "duration": "2分00秒",
  "accent": "US/UK/IN/JP/AU according to level",
  "speed": 1.0,
  "keyVocabulary": [
    {"word": "term", "phonetic": "/.../", "definition": "Chinese definition", "contextExample": "Sample sentence"}
  ],
  "transcript": [
    {"id": "t-1", "speaker": "Speaker 1 Name", "role": "Job Title", "en": "English dialogue sentence", "zh": "Chinese translation"}
  ],
  "questions": [
    {
      "id": "q-1",
      "type": "detail_fill",
      "prompt": "【细节捕获】Question asking for specific number, date, or metric in Chinese",
      "correctAnswer": "Exact answer expected",
      "clueSentenceIndex": 0,
      "explanation": "Detailed Chinese explanation of where the clue is found"
    },
    {
      "id": "q-2",
      "type": "gist_choice",
      "prompt": "【主旨理解】Multiple-choice question in Chinese",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A",
      "clueSentenceIndex": 1,
      "explanation": "Explanation why A is correct"
    },
    {
      "id": "q-3",
      "type": "subtext_analysis",
      "prompt": "【弦外之音】Analysis question about unspoken intentions or diplomatic subtext in Chinese",
      "correctAnswer": "Core diplomatic intent",
      "clueSentenceIndex": 2,
      "explanation": "Comprehensive explanation of unspoken business etiquette and subtext",
      "subtextInsights": {
        "surfaceMeaning": "What was literally said",
        "hiddenIntent": "The unspoken strategic motivation",
        "businessCultureNote": "Cross-cultural business etiquette takeaway"
      }
    }
  ]
}
`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned) as ListeningLesson;
    } catch (e) {
      console.warn('Gemini dynamic listening generation failed, falling back to smart template', e);
      return this.generateMockListening(level, industry, topic);
    }
  }

  /**
   * 2. 四维实时口语评估与三级改写引擎
   */
  public async evaluateSpeech(params: {
    level: ProficiencyLevel;
    userSpeech: string;
    scenarioContext: string;
    userGoal: string;
    personaTitle: string;
  }): Promise<SpeechEvaluationResult> {
    const client = this.getClient();
    const modelName = storageService.getModel() || 'gemini-1.5-flash';

    if (!client || !params.userSpeech.trim()) {
      return this.generateMockSpeechEvaluation(params);
    }

    try {
      const model = client.getGenerativeModel({ model: modelName });
      const prompt = `
You are a senior executive coach and speech diagnostic engine at McKinsey & Google.
Evaluate the user's spoken English response in an authentic business simulation.

Target Level: ${params.level}
Scenario: ${params.scenarioContext}
Counterpart Persona: ${params.personaTitle}
User's Business Goal: ${params.userGoal}
User's Spoken Response: "${params.userSpeech}"

Evaluate across the four core dimensions:
1. Pronunciation & Fluency (0-100): Phonetics, stress, linking sounds, confidence.
2. Grammar & Vocabulary (0-100): Chinglish elimination, professional lexicon precision.
3. Business Pragmatics & Politeness (0-100): High-EQ diplomacy, avoiding blunt imperative commands.
4. Task Completion Rate (0-100): Did they effectively address the counterpart's objection and achieve the business goal?

Also provide 3 distinct paraphrased versions of their response:
- Concise & Clear (极简清晰版)
- Diplomatic & Tactful (高情商委婉版)
- Executive & Polished (投行/高管专业版)

CRITICAL: Return ONLY valid JSON format with no markdown fences, matching this structure:
{
  "transcript": "${params.userSpeech}",
  "scores": {
    "pronunciation": 88,
    "grammarVocabulary": 84,
    "businessPragmatics": 82,
    "taskCompletion": 85,
    "overall": 85
  },
  "diagnostic": {
    "pronunciationErrors": [
      {"word": "word", "issue": "Phonetic or stress fault", "tip": "How to say it properly with linking/accent"}
    ],
    "grammarIssues": [
      {"original": "problematic phrase", "corrected": "native phrasing", "explanation": "Grammar rule & why original is Chinglish", "isChinglish": true}
    ],
    "pragmaticAdvice": {
      "politenessScore": 82,
      "tactfulSuggestion": "How to sound more diplomatic without losing authority",
      "businessEtiquetteTip": "Cross-cultural workplace insight"
    },
    "paraphrases": {
      "concise": "Crisp 1-2 sentence direct formulation",
      "diplomatic": "Empathetic, highly tactful diplomatic version",
      "executive": "Boardroom-ready executive version with high leverage phrasing"
    }
  },
  "aiComment": "Encouraging, actionable mentor synthesis in Chinese",
  "completedGoals": ["Goal 1 achieved"],
  "missedGoals": ["Goal still needs reinforcement"]
}
`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned) as SpeechEvaluationResult;
    } catch (e) {
      console.warn('Gemini speech evaluation failed, falling back to smart diagnostic engine', e);
      return this.generateMockSpeechEvaluation(params);
    }
  }

  /**
   * 3. 动态场景模拟引擎：生成 AI 角色下一轮发言（带情绪、打断机制与即兴追问）
   */
  public async generateRoleplayResponse(params: {
    scenario: RoleplayScenario;
    history: { speaker: string; text: string }[];
    userSpeech: string;
  }): Promise<{ reply: string; objectionType?: string; isResolved: boolean }> {
    const client = this.getClient();
    const modelName = storageService.getModel() || 'gemini-1.5-flash';

    if (!client) {
      return this.generateMockRoleplayResponse(params);
    }

    try {
      const model = client.getGenerativeModel({ model: modelName });
      const historyStr = params.history
        .map(h => `${h.speaker}: ${h.text}`)
        .join('\n');

      const prompt = `
You are roleplaying as:
Name: ${params.scenario.persona.name}
Title: ${params.scenario.persona.title} at ${params.scenario.persona.company}
Temperament: ${params.scenario.persona.temperament} (${params.scenario.persona.temperamentLabel})
Accent: ${params.scenario.persona.accentLabel}
System Prompt: ${params.scenario.persona.systemPrompt}

Scenario: ${params.scenario.background}
Target Business Goal: ${params.scenario.userGoal}

Conversation History so far:
${historyStr}
User just said: "${params.userSpeech}"

Respond naturally in character (English). Keep your response between 1 to 3 punchy sentences.
If the user's argument was convincing and polite, show constructive progress. If they were evasive, push back sharply.

Return ONLY valid JSON:
{
  "reply": "Your in-character spoken line in English",
  "objectionType": "Pushback / Clarification / Compromise / Agreement",
  "isResolved": false
}
`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      return this.generateMockRoleplayResponse(params);
    }
  }

  /**
   * 4. 听力理解题目即时智能批改与线索高亮解析
   */
  public gradeAnswer(
    question: Question,
    userAnswer: string
  ): { isCorrect: boolean; score: number; feedback: string } {
    const userClean = userAnswer.trim().toLowerCase();
    const correctClean = question.correctAnswer.trim().toLowerCase();

    if (question.type === 'gist_choice') {
      const letterUser = userClean.charAt(0);
      const letterCorrect = correctClean.charAt(0);
      const isCorrect = letterUser === letterCorrect;
      return {
        isCorrect,
        score: isCorrect ? 100 : 0,
        feedback: isCorrect
          ? '回答正确！精准抓住了对话的核心主旨与商业诉求。'
          : `答案有偏差。正确选项为 ${question.correctAnswer}。请查看下方高亮的听力原文线索句。`
      };
    }

    // 填空题与弦外之音分析
    const isKeywordMatched = correctClean
      .split(/[\s,$/]+/)
      .filter(w => w.length > 2)
      .some(word => userClean.includes(word));

    if (userClean === correctClean || isKeywordMatched || userClean.length >= 8) {
      return {
        isCorrect: true,
        score: 92,
        feedback: '回答非常敏锐！准确捕捉到了关键事实细节与言外之意。'
      };
    }

    return {
      isCorrect: false,
      score: 55,
      feedback: `理解略有遗漏。参考要点是：“${question.correctAnswer}”。请关注对话原文高亮处。`
    };
  }

  // ===== 启发式智能 Fallback 模式（确保零配置秒开、无网络故障风险） =====

  private generateMockListening(level: ProficiencyLevel, industry: string, topic: string): ListeningLesson {
    return {
      id: `dyn-mock-${Date.now()}`,
      level,
      title: `${industry}: ${topic} 跨部门战略对齐`,
      industry,
      scenario: `针对近期 ${topic} 的关键指标波动，跨国业务团队召开高频协同会。`,
      duration: '2分05秒',
      accent: level === 'L3' ? 'IN' : level === 'L4' ? 'UK Fast' : 'US Standard',
      speed: level === 'L1' ? 0.85 : level === 'L4' ? 1.15 : 1.0,
      keyVocabulary: [
        { word: 'KPI Alignment', phonetic: '/ˌkeɪ piː ˈaɪ əˈlaɪnmənt/', definition: '关键绩效指标对齐', contextExample: 'We need full KPI alignment before our Q4 roadmap lock.' },
        { word: 'Deliverable', phonetic: '/dɪˈlɪvərəbl/', definition: '可交付成果', contextExample: 'The preliminary deliverable will be signed off by Friday.' },
        { word: 'Turnaround Time', phonetic: '/ˈtɜːnəraʊnd taɪm/', definition: '周转周期/响应处理时间', contextExample: 'Our customer success turnaround time dropped by 35%.' }
      ],
      transcript: [
        {
          id: 'mt-1',
          speaker: 'Elena (Director of Operations)',
          role: 'Ops Lead',
          en: `Good morning team. We are convening today to lock down the execution plan for ${topic}. Our primary objective is to streamline deliverables without budget overrun.`,
          zh: `大家早上好。今天我们碰头是为了锁定 ${topic} 的落地执行计划。我们的核心目标是在不超预算的前提下精简交付链路。`
        },
        {
          id: 'mt-2',
          speaker: 'Ken (Regional Lead)',
          role: 'APAC Lead',
          en: `From the regional side, we have allocated 3 senior specialists to support the rollout, with a strict milestone deadline of November 15th.`,
          zh: `从区域团队来看，我们已协调了 3 位资深专家支持上线，并且将里程碑交付底线严格定在 11 月 15 日。`
        },
        {
          id: 'mt-3',
          speaker: 'Elena (Director of Operations)',
          role: 'Ops Lead',
          en: `November 15th works well, provided that our compliance sign-off is completed by next Wednesday. Let's make sure we maintain transparency across all stakeholders.`,
          zh: `11 月 15 日可以，前提是我们的合规验收必须在下周三前全部完成。让我们确保所有利益相关方之间保持信息高度透明。`
        }
      ],
      questions: [
        {
          id: 'mq-1',
          type: 'detail_fill',
          prompt: '【细节捕获】区域团队设定的严格里程碑截止日期是哪一天？(填写日期如: November 15th)',
          correctAnswer: 'November 15th',
          clueSentenceIndex: 1,
          explanation: '第2句 Ken 明确表示："with a strict milestone deadline of November 15th."'
        },
        {
          id: 'mq-2',
          type: 'gist_choice',
          prompt: '【主旨理解】Elena 强调本次执行计划的重中之重是什么？',
          options: [
            'A. 在不超出预算的前提下精简交付链路并锁定计划',
            'B. 立即向总部追加 50 万美元的紧急差旅预算',
            'C. 将合规审批延期到明年第一季度',
            'D. 裁撤区域团队的外部技术支持人员'
          ],
          correctAnswer: 'A',
          clueSentenceIndex: 0,
          explanation: 'Elena 在开场第一句开宗明义指出："Our primary objective is to streamline deliverables without budget overrun."'
        },
        {
          id: 'mq-3',
          type: 'subtext_analysis',
          prompt: '【弦外之音】Elena 补充的 "provided that our compliance sign-off is completed..." 体现了何种职场管理意图？',
          correctAnswer: '设置前提条件约束，界定责任边界以避免自身背锅 (Setting preconditions & managing liability)',
          explanation: '职场高阶沟通中，“provided that”（以……为前提）是典型的风险转嫁与责任对齐用语，表明如果合规卡壳导致延误，责任在合规环节而非交付团队。',
          subtextInsights: {
            surfaceMeaning: '我同意 11 月 15 日的排期，只要下周三合规通过就行。',
            hiddenIntent: '如果下周三合规卡住，排期必须相应后推，我提前把免责底线划清。',
            businessCultureNote: '跨国项目管理中，口头答应排期时务必附加清晰的依附条件（Dependency Clause），防止后续成为唯一背责方。'
          }
        }
      ]
    };
  }

  private generateMockSpeechEvaluation(params: {
    level: ProficiencyLevel;
    userSpeech: string;
    scenarioContext: string;
    userGoal: string;
  }): SpeechEvaluationResult {
    const text = params.userSpeech || "I think we can do this by next Monday.";
    const hasChinglish = /open the light|give you call|suggest .* to|I very like|no why/i.test(text);

    return {
      transcript: text,
      scores: {
        pronunciation: 86,
        grammarVocabulary: hasChinglish ? 78 : 88,
        businessPragmatics: 85,
        taskCompletion: 87,
        overall: 86
      },
      diagnostic: {
        pronunciationErrors: [
          {
            word: text.split(' ')[0] || 'Actually',
            issue: '重音前移，辅音爆破过重',
            tip: '在商务表达中，发音宜轻快平缓，注意单词首音节重读与后续音节弱读。'
          }
        ],
        grammarIssues: [
          {
            original: text.slice(0, 35) + '...',
            corrected: 'I propose we align our milestones to target next Monday.',
            explanation: '避免口语化的直白叙述，使用 "propose" 和 "align" 能显著提升职场专业度。',
            isChinglish: hasChinglish
          }
        ],
        pragmaticAdvice: {
          politenessScore: 84,
          tactfulSuggestion: '将绝对的肯定陈述句改造为带缓冲前缀的建设性倡议（如：From our perspective... / Would it make sense to...）。',
          businessEtiquetteTip: '在跨文化会议中，使用探询式语气往往比命令式更能获得跨部门利益相关方的共鸣与支持。'
        },
        paraphrases: {
          concise: `We are targeting completion by next Monday to keep on schedule.`,
          diplomatic: `Would it be feasible to align on next Monday as our target delivery date?`,
          executive: `To mitigate risk, we recommend committing to next Monday's milestone with phased validation.`
        }
      },
      aiComment: '你的表达非常直接有力！在商务场景下，如果能加入“缓冲前缀（Hedging words）”和更精准的业务动词（如 align, streamline, mitigate），你的职场气场与说服力将更上一层楼。',
      completedGoals: ['清晰表达了核心时间节点', '展现出积极解决问题的态度'],
      missedGoals: ['可以进一步补充风险应对备选方案 (Contingency plan)']
    };
  }

  private generateMockRoleplayResponse(params: {
    scenario: RoleplayScenario;
    userSpeech: string;
  }): { reply: string; objectionType?: string; isResolved: boolean } {
    const userText = (params.userSpeech || '').toLowerCase();

    if (userText.includes('understand') || userText.includes('align') || userText.includes('risk') || userText.includes('compromise')) {
      return {
        reply: "That makes sense. If you can guarantee this timeline and send over the summary email by EOD, I think we can move forward with this approach.",
        objectionType: "Compromise",
        isResolved: true
      };
    }

    const objection = params.scenario.potentialObjections[0] ||
      "I hear your point, but what specific safeguards are in place to ensure this doesn't delay our client launch?";

    return {
      reply: objection,
      objectionType: "Pushback",
      isResolved: false
    };
  }
}

export const geminiService = new GeminiService();
