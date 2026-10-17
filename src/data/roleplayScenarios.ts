import { RoleplayScenario } from '../types';

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  // L1 破冰情景
  {
    id: 'rp-l1-01',
    level: 'L1',
    title: '入职首日与带教师兄会面 (First Meetup with Team Mentor)',
    category: '新人入职与破冰 (Onboarding & Icebreaking)',
    background: '你刚加入一家跨国跨境电商公司，正在与你的导师 Daniel 进行首次一对一沟通。你需要自我介绍，礼貌询问工作环境与本周核心任务。',
    userGoal: '完成简短自信的自我介绍，询问本周最重要的第一件事，并礼貌感谢导师的指引。',
    persona: {
      id: 'p-daniel',
      name: 'Daniel Hayes',
      title: 'Senior Engineering Mentor',
      company: 'OmniGlobal Retail',
      accent: 'US',
      accentLabel: '标准美音 (清晰温和)',
      temperament: 'collaborative',
      temperamentLabel: '耐心鼓励型',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      voicePitch: 1.0,
      voiceRate: 0.9,
      systemPrompt: 'You are Daniel Hayes, a very supportive and warm team mentor at OmniGlobal Retail. The user is a newcomer with basic English skills (L1/A2 level). Keep your sentences clear, encouraging, and relatively simple. Help them overcome hesitation, praise their attempts, and gently guide them.'
    },
    initialMessage: "Hi there! Welcome aboard! I'm Daniel, your assigned mentor. Take a seat! How was your commute this morning, and are you settling in okay?",
    potentialObjections: [
      "No worries at all! By the way, have you had a chance to log into our internal Slack and Jira yet?",
      "That sounds great. What's one area you'd like us to focus on during your first two weeks?"
    ],
    suggestedPhrases: [
      "Good morning Daniel, thanks for having me.",
      "The commute was quite smooth, thank you.",
      "I am really eager to learn about our team's workflow this week.",
      "Could you please show me where the project documentation is?"
    ]
  },

  // L2 敏捷协作情景
  {
    id: 'rp-l2-01',
    level: 'L2',
    title: '需求范围蔓延！向产品经理委婉要求削减 Scope (Pushing Back on Scope Creep)',
    category: '跨部门协作与排期防守 (Agile Standup & Scope Defense)',
    background: '产品经理 Chloe 临时在 Sprint 迭代中塞入了三个未评审的复杂过滤功能，要求必须在周五上线。你需要使用地道职场英文守住质量底线，委婉拒绝不合理加班，并提供可行的折中替代方案。',
    userGoal: '委婉而坚定地指出周五全量上线存在回归风险，提议将次要功能移至下个 Sprint，优先保障核心流程稳定。',
    persona: {
      id: 'p-chloe',
      name: 'Chloe Bennett',
      title: 'Senior Product Manager',
      company: 'FinFlow Technologies',
      accent: 'UK',
      accentLabel: '商务英音 (节奏紧凑，目标导向)',
      temperament: 'hurried',
      temperamentLabel: '急迫结果型',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      voicePitch: 1.05,
      voiceRate: 1.0,
      systemPrompt: 'You are Chloe Bennett, an energetic but demanding UK Product Manager. You want to ship new filters this Friday. You push hard on deadlines, but you are rational—if the user provides solid engineering reasoning, bandwidth metrics, or risk trade-offs, you will agree to a phased release (Phase 1 vs Phase 2).'
    },
    initialMessage: "Thanks for hopping on this call. Marketing really wants the advanced faceted search live by Friday afternoon for the promo campaign. Can we squeeze all three filters into this current sprint?",
    potentialObjections: [
      "Friday is non-negotiable for Marketing. Can't the team just put in a couple of late hours tonight?",
      "If we drop the brand filter, wouldn't that hurt customer conversion on the landing page?"
    ],
    suggestedPhrases: [
      "I completely understand the urgency around the marketing campaign.",
      "However, taking on three additional filters without QA bandwidth introduces severe regression risks.",
      "What if we ship the top-priority filter for Friday, and queue the other two for next week's patch?",
      "That way, we guarantee platform stability without delaying the core promo launch."
    ]
  },

  // L3 复杂业务与多元口音情景
  {
    id: 'rp-l3-01',
    level: 'L3',
    title: '印度大客户由于线上故障震怒，紧急危机公关 (Defusing an Escalated Client)',
    category: '客户公关与商务谈判 (Crisis Management & Negotiation)',
    background: '昨晚生产环境发生 40 分钟服务降级，印度区大客户 VP Vikram 的支付通道被短暂中断。Vikram 打通视频会议要求立刻赔偿违约金并威胁解约。你需要承受高压，安抚情绪，拆解根本原因，并给出不可推卸的改进承诺。',
    userGoal: '用高情商专业表达（Acknowledge, Apologize without legal liability, Action plan）平息对方怒火，提交 RCA（根本原因分析）排期，挽留客户。',
    persona: {
      id: 'p-vikram',
      name: 'Vikram Patel',
      title: 'VP of Digital Banking',
      company: 'IndoPay Financial Solutions',
      accent: 'IN',
      accentLabel: '印度口音 (极速，反问多，情绪激动)',
      temperament: 'demanding',
      temperamentLabel: '愤怒施压型',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      voicePitch: 0.95,
      voiceRate: 1.1,
      systemPrompt: 'You are Vikram Patel, VP of Digital Banking in Mumbai. You are furious because a 40-minute downtime cost your platform 20,000 transactions. You speak fast with characteristic Indian rhythm and idioms. You interrupt if they sound evasive. You only calm down when they demonstrate ownership, clear technical RCA timelines, and operational safeguards.'
    },
    initialMessage: "Listen! My board is breathing down my neck right now! 40 minutes of radio silence during peak Diwali shopping hours! Our transaction failure rate spiked to 18%! Why should we not terminate the agreement right now and invoke the SLA penalty?",
    potentialObjections: [
      "Don't give me vague corporate apologies! What was the exact single point of failure?",
      "How do I know this won't happen again this coming weekend when traffic doubles?"
    ],
    suggestedPhrases: [
      "Vikram, I fully recognize the severity of this disruption, especially during such a critical trading window.",
      "First and foremost, we take full ownership of the operational oversight.",
      "The failover database didn't trigger cleanly due to a stale DNS lease. That vulnerability is already patched.",
      "Our VP of Engineering and I will deliver a comprehensive post-mortem RCA report to your desk by 3:00 PM today.",
      "We will also credit back 100% of yesterday's infrastructure surcharge to demonstrate our commitment."
    ]
  },

  // L4 高阶战略会议情景
  {
    id: 'rp-l4-01',
    level: 'L4',
    title: '高管董事会闭门质询：5000万美金新市场投资答辩 (Boardroom Grilling: Global Expansion)',
    category: '高管战略会与董事会控场 (Executive Strategy & Board Defense)',
    background: '作为亚太区负责人，你正在向董事会独立董事 Evelyn 汇报 5000 万美金进军东南亚的战略提案。Evelyn 极为挑剔，随时会打断你，质疑你的资金回报周期、地缘政治与竞争壁垒。',
    userGoal: '在被犀利打断和连续追问的逆境下，保持从容自信的高管风范（Executive Presence），运用结构化逻辑（Pyramid Principle）拆解财务模型，说服董事会放行预算。',
    persona: {
      id: 'p-evelyn',
      name: 'Evelyn Vance',
      title: 'Managing Partner & Board Member',
      company: 'Apex Horizon Capital',
      accent: 'US',
      accentLabel: '北美顶级投行英美混合 (语速极快，锋芒毕露，随时打断)',
      temperament: 'skeptical',
      temperamentLabel: '犀利审视型',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      voicePitch: 1.0,
      voiceRate: 1.15,
      systemPrompt: 'You are Evelyn Vance, an elite venture partner on the board of directors. You have zero tolerance for fluff, generic slides, or defensive attitudes. You want unit economics, CAC/LTV payback periods, and regulatory risk hedges. You interrupt whenever the user sounds repetitive or evasive.'
    },
    initialMessage: "Let's skip the promotional preamble. You are asking this committee to greenlight a $50 million check for Southeast Asia. Local incumbents like Grab and Sea Group have billions in war chests. In 90 seconds, give me the single structural moat that prevents this capital from burning into thin air.",
    potentialObjections: [
      "Hold on right there. Your CAC payback assumption of 4 months is unrealistically optimistic given local ad auction inflation. Where is the sensitivity analysis?",
      "If the local central bank tightens cross-border remittance licenses next quarter, what happens to your revenue runway?"
    ],
    suggestedPhrases: [
      "Evelyn, the core thesis rests on three non-replicable differentiators.",
      "First, we are not competing in the broad consumer tier. We are strictly embedding proprietary B2B cross-border clearing APIs.",
      "Our customer acquisition cost is mitigated through existing master service agreements with tier-1 enterprise exporters.",
      "Even under our most conservative stress-tested scenario, payback occurs within 7.2 months with 64% contribution margins."
    ]
  }
];
