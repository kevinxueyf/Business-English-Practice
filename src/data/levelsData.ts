import { LevelInfo, ListeningLesson } from '../types';

export const LEVELS: LevelInfo[] = [
  {
    id: 'L1',
    title: '破冰与基础构建',
    subtitle: 'Foundation & Onboarding',
    cefr: '0基础 - A2',
    targetUser: '刚接触跨国职场、开口紧张、听力词汇量有限的初学者',
    coreObjective: '克服开口恐惧，掌握高频职场词汇、日期时间确认与基础办公表达',
    listeningFeature: '慢速、发音清晰、标准美音/英音，结构规整无背景干扰',
    speakingFeature: '核心词汇跟读、高频句型复述、情景填空朗读',
    accentTypes: ['标准美音 (US)', '标准英音 (UK)'],
    color: 'from-emerald-500 to-teal-700',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  },
  {
    id: 'L2',
    title: '标准职场沟通',
    subtitle: 'Standard Workplace Workflow',
    cefr: 'B1 - B2 (独立工作者)',
    targetUser: '具备基础英文知识，但在项目汇报、站会发言与跨团队沟通时容易卡壳',
    coreObjective: '流利应对每日站会汇报、需求排期对齐、IT支持与日常商务邮件意图把握',
    listeningFeature: '职场正常语速，常见双人对话或短篇汇报，包含日常缩写与敏捷术语',
    speakingFeature: '问答式对话、根据中文要点即时转换为地道职场英文（告别Chinglish）',
    accentTypes: ['标准美音 (US)', '英音 (UK)', '澳音 (AU)'],
    color: 'from-blue-500 to-indigo-700',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  },
  {
    id: 'L3',
    title: '复杂业务与多元口音',
    subtitle: 'Business Nuances & Global Accents',
    cefr: 'B2 - C1 (业务骨干/经理)',
    targetUser: '需应对全球多国同事与客户，听懂非母语口音，并在商务谈判中有理有据表达',
    coreObjective: '适应多元口音（印/日/欧），应对供应商谈判议价、客户投诉化解与业务简报',
    listeningFeature: '高拟真多元口音（印度腔、日本腔、欧洲混杂音），语流连音，语速偏快',
    speakingFeature: '2分钟电梯演讲 (Elevator Pitch)、针对刁钻尖锐提问的专项沉着应辩',
    accentTypes: ['印度口音 (IN)', '日本口音 (JP)', '欧洲口音 (EU/DE/FR)'],
    color: 'from-amber-500 to-orange-700',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  },
  {
    id: 'L4',
    title: '高阶会议与动态模拟',
    subtitle: 'Executive Meetings & Real-time Control',
    cefr: 'C1 - C2 (高管/跨国领航者)',
    targetUser: '需在纯英文高管战略会、财报电话会中控场，处理突发危机与信息轰炸',
    coreObjective: '在高信息密度与多人抢话的复杂会议中主导节奏、精准反驳、把握弦外之音',
    listeningFeature: '高语速、密集行业术语、多人插话抢话（Overlapping）、弦外之音密集',
    speakingFeature: '1vN 多人沉浸式模拟，动态追问追堵，实时打断与即兴高情商反驳',
    accentTypes: ['全口音混合', '极速美音/英音', '全球高管混杂'],
    color: 'from-purple-500 to-rose-700',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
  }
];

export const PRESET_LESSONS: ListeningLesson[] = [
  // L1 课程
  {
    id: 'l1-01',
    level: 'L1',
    title: '新人入职首日引导 (HR Welcome & Equipment Handover)',
    industry: '通用跨国企业 (General Corporate)',
    scenario: 'HR主管 Sarah 向新入职工程师 Alex 介绍入职流程、工牌领取及IT电脑配置安排。',
    duration: '1分45秒',
    accent: 'US Standard (美音标准清晰)',
    speed: 0.85,
    keyVocabulary: [
      { word: 'Onboarding', phonetic: '/ˈɒnbɔːrdɪŋ/', definition: '入职培训与融入流程', contextExample: 'Welcome to your first day of onboarding!' },
      { word: 'Security Badge', phonetic: '/sɪˈkjʊərəti bædʒ/', definition: '员工出入安全工牌', contextExample: 'Please keep your security badge visible at all times.' },
      { word: 'Credentials', phonetic: '/krəˈdenʃlz/', definition: '登录凭证与密码', contextExample: 'The IT desk will send your login credentials to your personal email.' },
      { word: 'Orientation', phonetic: '/ˌɔːriənˈteɪʃn/', definition: '新人宣讲介绍会', contextExample: 'The company orientation begins at 2:00 PM in Conference Room B.' }
    ],
    transcript: [
      {
        id: 't-1',
        speaker: 'Sarah (HR)',
        role: 'People Operations Lead',
        en: "Good morning Alex! Welcome to the Global Tech family. We are thrilled to have you here today.",
        zh: "早上好 Alex！欢迎加入 Global Tech 大家庭。非常高兴今天能迎来你的加入。"
      },
      {
        id: 't-2',
        speaker: 'Alex',
        role: 'New Software Engineer',
        en: "Good morning Sarah. Thank you so much, I am really excited to start.",
        zh: "早上好 Sarah。非常感谢，我对即将开始的工作感到非常期待。"
      },
      {
        id: 't-3',
        speaker: 'Sarah (HR)',
        role: 'People Operations Lead',
        en: "First, here is your temporary security badge. Please visit the reception desk on the 3rd floor before 4:00 PM today to get your permanent photo badge.",
        zh: "首先，这是你的临时安全工牌。请在今天下午 4:00 之前前往 3 楼前台办理正式的有照片的工牌。"
      },
      {
        id: 't-4',
        speaker: 'Sarah (HR)',
        role: 'People Operations Lead',
        en: "Next, at 11:00 AM sharp, Mark from the IT department will deliver your laptop and help you configure your two-factor authentication credentials.",
        zh: "接下来，今天上午 11:00 整，IT 部门的 Mark 会为你送来笔记本电脑，并协助你配置双重身份验证登录凭据。"
      },
      {
        id: 't-5',
        speaker: 'Alex',
        role: 'New Software Engineer',
        en: "Got it. So 11:00 AM for IT setup, and reception before 4:00 PM for the photo badge.",
        zh: "明白了。所以是上午 11:00 搞定 IT 配置，下午 4:00 前去前台办照片工牌。"
      },
      {
        id: 't-6',
        speaker: 'Sarah (HR)',
        role: 'People Operations Lead',
        en: "Exactly! And don't forget our team welcome lunch at 12:30 PM at the 1st floor bistro. Relax and enjoy your first day!",
        zh: "完全正确！还有别忘了我们今天中午 12:30 在 1 楼小餐厅的团队欢迎午餐。放轻松，好好享受你在公司的第一天！"
      }
    ],
    questions: [
      {
        id: 'q-1',
        type: 'detail_fill',
        prompt: '【细节捕获】Alex 需要在下午几点之前去几楼前台办理正式带照片的工牌？(填写时间与楼层，如: 4:00 PM on 3rd floor)',
        correctAnswer: '4:00 PM on 3rd floor',
        clueSentenceIndex: 2,
        explanation: '在听力文本第3句中，Sarah 明确交代："Please visit the reception desk on the 3rd floor before 4:00 PM today to get your permanent photo badge."'
      },
      {
        id: 'q-2',
        type: 'gist_choice',
        prompt: '【主旨理解】关于上午 11:00 的安排，下列哪项描述最为准确？',
        options: [
          'A. Alex 需要参加全公司的新人入职宣讲大会',
          'B. IT 部门的 Mark 会交付笔记本并协助配置双重身份凭证',
          'C. Sarah 陪同 Alex 参观整栋大楼各个部门',
          'D. 团队在 1 楼小餐厅举行新人欢迎披萨午餐'
        ],
        correctAnswer: 'B',
        clueSentenceIndex: 3,
        explanation: '第4句 Sarah 提到："at 11:00 AM sharp, Mark from the IT department will deliver your laptop and help you configure your two-factor authentication credentials."'
      },
      {
        id: 'q-3',
        type: 'subtext_analysis',
        prompt: '【弦外之音】Alex 在听到安排后主动回复："Got it. So 11:00 AM for IT setup, and reception before 4:00 PM..."，体现了跨国职场中的哪项核心沟通习惯？',
        correctAnswer: '主动复述确认关键信息 (Closing the loop / Echoing back)',
        explanation: '在英语商务环境中，复述关键的时间节点与动作项（Action Items）被称为 Closed-loop communication（闭环沟通），能有效消除误解并展现专业可靠感。',
        subtextInsights: {
          surfaceMeaning: '重复了一遍对方刚才说的两个具体时间与地点。',
          hiddenIntent: '向对方证明自己已完全理解，并请求对方做最后确认（Double check），防止遗漏。',
          businessCultureNote: '在跨国企业中，用简短清晰的句式复述核心细节是极具职业素养的高分表现，避免了沉默或模糊的“OK”。'
        }
      }
    ]
  },

  // L2 课程
  {
    id: 'l2-01',
    level: 'L2',
    title: '敏捷每日站会与跨团队阻塞 (Daily Standup & API Blocker)',
    industry: '软件与互联网 SaaS (Software & Cloud)',
    scenario: '前端工程师 Emily 在晨会中向 Scrum Master 和后端团队汇报进度，并委婉提出第三方支付接口延期阻塞了发布排期。',
    duration: '2分10秒',
    accent: 'UK Business (英音职业自然语速)',
    speed: 1.0,
    keyVocabulary: [
      { word: 'Blocker', phonetic: '/ˈblɒkər/', definition: '阻碍项目进度的障碍物/依赖项', contextExample: 'My main blocker is the pending sandbox key from the payments team.' },
      { word: 'Sprint goal', phonetic: '/sprɪnt ɡəʊl/', definition: '当前双周迭代的核心发布目标', contextExample: 'To meet our sprint goal, we must freeze the checkout code by Thursday.' },
      { word: 'Bottleneck', phonetic: '/ˈbɒtlnek/', definition: '瓶颈、阻碍整体吞吐量的节点', contextExample: 'The security compliance audit might become a bottleneck.' },
      { word: 'Bandwidth', phonetic: '/ˈbændwɪdθ/', definition: '工作负荷余量/精力', contextExample: 'Does anyone on the backend team have the bandwidth to assist?' }
    ],
    transcript: [
      {
        id: 't-201',
        speaker: 'David (Scrum Master)',
        role: 'Agile Delivery Lead',
        en: "Morning everyone. Let's do our quick 15-minute sync. Emily, could you kick us off with the checkout module?",
        zh: "大家早上好。开始我们 15 分钟的快速站会同步。Emily，你先从结账模块开始好吗？"
      },
      {
        id: 't-202',
        speaker: 'Emily (Frontend Dev)',
        role: 'Senior UI Engineer',
        en: "Sure thing. Yesterday, I wrapped up the responsive layout and input validation for the new checkout flow. Everything passed automated unit tests.",
        zh: "没问题。昨天我完成了新结账流程的响应式布局和输入验证。所有内容都通过了自动化单元测试。"
      },
      {
        id: 't-203',
        speaker: 'David (Scrum Master)',
        role: 'Agile Delivery Lead',
        en: "Great progress. Any roadblocks ahead of our Thursday demo?",
        zh: "进展很棒。在周四的演示之前，有遇到什么阻碍吗？"
      },
      {
        id: 't-204',
        speaker: 'Emily (Frontend Dev)',
        role: 'Senior UI Engineer',
        en: "Actually, yes. We're currently waiting on the webhook documentation and sandbox tokens from the Stripe integration team. Until that's unblocked, end-to-end payment simulations remain at risk.",
        zh: "实际上，确实有。我们目前正在等待 Stripe 集成团队提供 Webhook 文档与沙箱测试令牌。在解除这个阻碍之前，端到端支付测试仍面临风险。"
      },
      {
        id: 't-205',
        speaker: 'Marcus (Backend Dev)',
        role: 'Lead Services Architect',
        en: "I can jump in there. I'm having a quick catch-up with their tech lead at 1:30 PM. I'll flag this as a critical path item and escalate if needed.",
        zh: "我可以插手这件事。我今天下午 1:30 会和他们的技术负责人碰一下。我会把这标记为关键路径项目，必要时向上升级上报。"
      },
      {
        id: 't-206',
        speaker: 'David (Scrum Master)',
        role: 'Agile Delivery Lead',
        en: "Appreciate it Marcus. Emily, let's keep the user-facing UI mock data ready in case we need a fallback for Thursday. Next up, Kevin?",
        zh: "多谢 Marcus。Emily，我们先准备好前端界面模拟数据（Mock），以防周四需要备用方案。接下来，Kevin？"
      }
    ],
    questions: [
      {
        id: 'q-201',
        type: 'detail_fill',
        prompt: '【细节捕获】后端负责人 Marcus 与外部技术主管约在今天几点同步？(填写如: 1:30 PM)',
        correctAnswer: '1:30 PM',
        clueSentenceIndex: 4,
        explanation: '第5句中 Marcus 提到："I\'m having a quick catch-up with their tech lead at 1:30 PM."'
      },
      {
        id: 'q-202',
        type: 'gist_choice',
        prompt: '【主旨理解】导致结账模块端到端测试无法推进的核心原因是什么？',
        options: [
          'A. 前端响应式布局未适配移动端平板设备',
          'B. 缺乏 Stripe 支付团队的 Webhook 文档和沙箱测试令牌',
          'C. 单元自动化测试存在 5 个严重未能通过的断言错误',
          'D. Scrum Master 临时缩减了结账功能的预算与人手'
        ],
        correctAnswer: 'B',
        clueSentenceIndex: 3,
        explanation: '第4句 Emily 明确汇报："We\'re currently waiting on the webhook documentation and sandbox tokens from the Stripe integration team."'
      },
      {
        id: 'q-203',
        type: 'subtext_analysis',
        prompt: '【弦外之音】Scrum Master 说的 "let\'s keep mock data ready in case we need a fallback"，背后的职场真实意图是什么？',
        correctAnswer: '对外部团队准时交付不抱侥幸心理，提前建立风险防范兜底方案 (Contingency Plan)',
        explanation: '敏捷敏锐的管理人员即便听到了同事会去 escalate（催促推进），也会在第一时间要求团队准备“假数据备选方案”，确保周四演示会绝不会当场开天窗。',
        subtextInsights: {
          surfaceMeaning: '如果周四出问题，我们还有备用模拟数据可以应付演示。',
          hiddenIntent: '外部团队经常跳票，我们不能把宝全押在他们下午的答复上，必须立即执行 Plan B。',
          businessCultureNote: '在跨国技术组织中，"Fallback" 或 "Plan B" 是高频抗风险机制，体现了 "Hope is not a strategy" 的务实文化。'
        }
      }
    ]
  },

  // L3 课程 (印度口音/多元商务谈判)
  {
    id: 'l3-01',
    level: 'L3',
    title: '跨国供应商议价与交付 SLA 谈判 (Vendor Price & SLA Hardball)',
    industry: '全球供应链与云服务 (Global Procurement & Cloud)',
    scenario: '印度班加罗尔云架构供应商 Raj 与中国区采购总监 Lin 针对云服务集群续约价格与 99.95% 可用性 SLA 违约赔偿金展开攻防。',
    duration: '2分35秒',
    accent: 'Indian English (印度口音，快语速，卷舌轻齿轻辅音)',
    speed: 1.05,
    keyVocabulary: [
      { word: 'SLA (Service Level Agreement)', phonetic: '/ˌes el ˈeɪ/', definition: '服务等级协议，约定系统可用性底线', contextExample: 'Our enterprise tier contract guarantees 99.95% uptime SLA.' },
      { word: 'Penalty Clause', phonetic: '/ˈpenəlti klɔːz/', definition: '合同中的违约赔偿/罚则条款', contextExample: 'We require a strict penalty clause for unplanned outages.' },
      { word: 'Compromise', phonetic: '/ˈkɒmprəmaɪz/', definition: '折中妥协与互惠让步', contextExample: 'Can we find a reasonable compromise on the annual billing cadence?' },
      { word: 'Leverage', phonetic: '/ˈliːvərɪdʒ/', definition: '谈判筹码与施压优势', contextExample: 'Having alternative quotes from AWS gives us substantial leverage.' }
    ],
    transcript: [
      {
        id: 't-301',
        speaker: 'Raj (Vendor VP, India)',
        role: 'VP of Global Client Operations',
        accent: 'IN',
        en: "Namaste Lin, good to see you again. Regarding your request for an additional 12% price discount on the multi-region Kubernetes cluster, I must be completely upfront: our margins are razor-thin due to recent energy surcharges.",
        zh: "你好 Lin，很高兴再次见到你。关于你提出的针对多区域 K8s 集群额外降价 12% 的诉求，我必须坦率直言：由于近期能源附加费上涨，我们的利润空间已经薄如刀片了。"
      },
      {
        id: 't-302',
        speaker: 'Lin (Procurement Director)',
        role: 'Strategic Sourcing Lead',
        en: "I hear your cost concerns Raj. However, our board has capped our infrastructure expansion budget. If we cannot reach common ground on the total cost, we will be forced to split the volume with Azure.",
        zh: "我理解你的成本顾虑 Raj。但是，我们董事会对基础设施扩张预算做了严格封顶。如果我们无法在总成本上达成共识，我们将不得不把采购份额分流给 Azure。"
      },
      {
        id: 't-303',
        speaker: 'Raj (Vendor VP, India)',
        role: 'VP of Global Client Operations',
        accent: 'IN',
        en: "Listen Lin, we definitely do not want that to happen. What if we do this: I cannot touch the headline unit rate by 12%, but I can offer an 8% rebate credit plus waive the $25,000 onboarding migration architecture fee?",
        zh: "听我说 Lin，我们绝不希望出现这种局面。不如这样：我无法在公开单价上降 12%，但我可以提供 8% 的返点额度，并免除价值 25,000 美元的系统迁移架构服务费？"
      },
      {
        id: 't-304',
        speaker: 'Lin (Procurement Director)',
        role: 'Strategic Sourcing Lead',
        en: "That is a constructive step forward Raj. What about the penalty clause? If uptime drops below 99.95%, we need a 15% credit on the monthly invoice, not 5%.",
        zh: "这是建设性的一步 Raj。那么违约罚则条款呢？如果系统可用性低于 99.95%，我们需要当月账单 15% 的返还额度，而不是 5%。"
      },
      {
        id: 't-305',
        speaker: 'Raj (Vendor VP, India)',
        role: 'VP of Global Client Operations',
        accent: 'IN',
        en: "15% is quite steep for our legal team, but if you commit to a 24-month contract instead of annual renewal, I will personally push the 15% SLA credit through executive approval today.",
        zh: "15% 对我们法务来说相当严苛，但如果你愿意承诺签署 24 个月的长约而不是一年一签，我今天可以亲自在高管会上促成这 15% SLA 赔偿条款的审批通过。"
      }
    ],
    questions: [
      {
        id: 'q-301',
        type: 'detail_fill',
        prompt: '【细节捕获】Raj 提出免除多少美元的入职迁移架构服务费用？(填写数字如: $25,000)',
        correctAnswer: '$25,000',
        clueSentenceIndex: 2,
        explanation: '第3句 Raj 给出折中方案："waive the $25,000 onboarding migration architecture fee"'
      },
      {
        id: 'q-302',
        type: 'gist_choice',
        prompt: '【主旨理解】Raj 最终同意为 15% SLA 违约赔偿条款破例申请批准的前提条件是什么？',
        options: [
          'A. 买方必须预付全额 3 年的服务器机架租赁费用',
          'B. 买方需要承诺将合同周期从一年一签延长为 24 个月长约',
          'C. 买方放弃 8% 的年度返点折扣',
          'D. 双方将仲裁地改设在印度班加罗尔商业法院'
        ],
        correctAnswer: 'B',
        clueSentenceIndex: 4,
        explanation: '第5句 Raj 明确给出交换筹码："if you commit to a 24-month contract instead of annual renewal, I will personally push the 15% SLA credit through"'
      },
      {
        id: 'q-303',
        type: 'subtext_analysis',
        prompt: '【弦外之音】采购总监 Lin 提到 "we will be forced to split the volume with Azure" 时的核心谈判策略是什么？',
        correctAnswer: '展示替代选择 (BATNA - Best Alternative to a Negotiated Agreement)，施加商业流失压力',
        explanation: '在商务谈判中，直接说“你太贵了”容易陷入僵局，而委婉提及竞争对手（Azure）并强调“董事会预算封顶不得不分流份额”，既不撕破脸，又给供应商制造了极大的丢单恐惧，迫使其主动给出折扣与让步。',
        subtextInsights: {
          surfaceMeaning: '如果价格谈不拢，我们只能分流一部分业务给微软 Azure。',
          hiddenIntent: '我手上有备选供应商随时能替换你，这是最后通牒，你必须立刻亮出底牌让步。',
          businessCultureNote: '高阶跨国商务谈判中，熟练运用 BATNA（最佳替代方案）施压是标准博弈手法，以中立客观语气说出最硬气的底线。'
        }
      }
    ]
  },

  // L4 课程 (跨国财报电话会与危机公关)
  {
    id: 'l4-01',
    level: 'L4',
    title: '跨国科技巨头 Q3 财报电话会 (Q3 Earnings Call & Analyst Hardball)',
    industry: '资本市场与上市公司高管会 (Investment Banking & Investor Relations)',
    scenario: '首席财务官 (CFO) 和 CEO 在极速多方财报电话会议中，应对华尔街知名做空机构分析师关于毛利暴跌与反垄断罚款的尖锐打断与质疑。',
    duration: '3分15秒',
    accent: 'Fast-paced Executive Mix (华尔街极速英语，多人抢话，重叠提问)',
    speed: 1.15,
    keyVocabulary: [
      { word: 'Gross Margin Compression', phonetic: '/ɡrəʊs ˈmɑːdʒɪn kəmˈpreʃn/', definition: '毛利率收缩/被挤压', contextExample: 'We saw a 240 basis points gross margin compression this quarter.' },
      { word: 'Headwind', phonetic: '/ˈhedwɪnd/', definition: '逆风/不利宏观因素', contextExample: 'Foreign exchange volatility created a temporary macroeconomic headwind.' },
      { word: 'Regulatory Headroom', phonetic: '/ˌreɡjələˈtɔːri ˈhedruːm/', definition: '监管合规回旋空间', contextExample: 'We maintain adequate regulatory headroom despite ongoing FTC probes.' },
      { word: 'Capital Expenditure (CapEx)', phonetic: '/ˈkæpɪtl ɪkˈspendɪtʃər/', definition: '资本性支出（服务器、厂房、算力中心投资）', contextExample: 'Our AI infrastructure CapEx peaked in Q3.' }
    ],
    transcript: [
      {
        id: 't-401',
        speaker: 'Victoria (CFO)',
        role: 'Chief Financial Officer',
        en: "Thank you operator. Turning to slide 14, non-GAAP operating margin expanded 180 basis points year-over-year to 31.4%, driven by operational leverage across our enterprise cloud division, despite seasonal foreign exchange headwinds.",
        zh: "谢谢接线员。翻到第 14 页幻灯片，非通用会计准则下营业利润率同比扩大 180 个基点达到 31.4%，这得益于企业云业务部门的经营杠杆释放，尽管面临季节性汇率逆风。"
      },
      {
        id: 't-402',
        speaker: 'Julian (Goldman Sachs Analyst)',
        role: 'Senior Wall Street Analyst',
        en: "Sorry Victoria, if I could just jump in right here—looking at your deferred revenue guidance for Q4, that represents a 6% sequential deceleration. Isn't that an admission that your enterprise customer churn is accelerating following the price hike?",
        zh: "抱歉插一句 Victoria——看你们第四季度的递延收入指引，这代表着环比减速 6%。这难道不是在变相承认在提价之后，你们的企业级客户流失率正在加速恶化吗？"
      },
      {
        id: 't-403',
        speaker: 'Edward (CEO)',
        role: 'Chief Executive Officer',
        en: "Julian, let me address that directly. That inference would be entirely incorrect. What you are witnessing is a strategic transition from upfront three-year multi-million prepayments to consumption-based quarterly billing.",
        zh: "Julian，这个问题由我直接回答。你这一推论完全不准确。你所看到的，实际上是我们从三年期数百万美元的一次性预付款模式，战略转型为按季度使用量计费模式。"
      },
      {
        id: 't-404',
        speaker: 'Edward (CEO)',
        role: 'Chief Executive Officer',
        en: "Our net dollar retention rate among Fortune 500 accounts actually climbed to 128%, which is the highest in four consecutive quarters. Our enterprise cohort has never been stickier.",
        zh: "我们在财富 500 强客户群中的净金额留存率（NDR）实际上攀升到了 128%，为连续四个季度以来的最高水平。我们的企业级客群粘性从未如此牢固。"
      },
      {
        id: 't-405',
        speaker: 'Julian (Goldman Sachs Analyst)',
        role: 'Senior Wall Street Analyst',
        en: "Fair enough Edward, but how do you reconcile that stickiness with the European Commission's 450-million-euro preliminary compliance inquiry disclosed in footnote 7?",
        zh: "很好 Edward，但你们如何将这种客群粘性与第 7 条脚注中披露的欧盟委员会 4.5 亿欧元初步合规质询相互调和呢？"
      },
      {
        id: 't-406',
        speaker: 'Victoria (CFO)',
        role: 'Chief Financial Officer',
        en: "Julian, as standard legal practice dictates, footnote 7 represents an abundance of caution disclosure. We have already accrued a full contingency reserve in Q2, meaning no incremental cash impact on fiscal 2027 guidance.",
        zh: "Julian，正如标准法务惯例所要求，脚注 7 仅属于审慎性披露。我们在第二季度就已经全额计提了应急准备金，这意味着对 2027 财年的现金指引没有任何增量负面影响。"
      }
    ],
    questions: [
      {
        id: 'q-401',
        type: 'detail_fill',
        prompt: '【细节捕获】CEO Edward 指出，公司在财富 500 强客户中的净金额留存率 (NDR) 攀升到了百分之多少？(填写数字如: 128%)',
        correctAnswer: '128%',
        clueSentenceIndex: 3,
        explanation: '第4句 Edward 摆出权威硬核数据：“net dollar retention rate among Fortune 500 accounts actually climbed to 128%”。'
      },
      {
        id: 'q-402',
        type: 'gist_choice',
        prompt: '【主旨理解】分析师 Julian 质疑第四季度递延收入增速放缓，CEO 给出的根本解释是什么？',
        options: [
          'A. 欧洲宏观经济萎缩导致跨国客户纷纷削减了 IT 预算',
          'B. 商业计费模式从“3年一次性预付费”转型为“按季度实际用量付费”',
          'C. 提价策略导致大量中小客户转向了竞争对手的开源生态',
          'D. 汇率波动吞噬了第四季度的全部账面利润'
        ],
        correctAnswer: 'B',
        clueSentenceIndex: 2,
        explanation: '第3句 CEO 指出：“strategic transition from upfront three-year multi-million prepayments to consumption-based quarterly billing”。计费周期的会计确认方式改变导致了账面递延收入的暂时性变化，而非客户流失。'
      },
      {
        id: 'q-403',
        type: 'subtext_analysis',
        prompt: '【弦外之音】分析师直接插话："Sorry Victoria, if I could just jump in right here..." 并抛出 "Isn\'t that an admission that..."，这种问法在华尔街财报会议中的潜台词是什么？CEO 为何立刻抢答？',
        correctAnswer: '设置叙事陷阱 (Trap Question)，试图逼管理层认错引发股价波动；CEO 抢答是高级危机公关控场，杜绝市场恐慌蔓延',
        explanation: '在财报电话会议中，做空机构或敏锐分析师常通过中途打断、使用“Isn\'t that an admission（这难道不是承认……）”等具有定性暗示的词汇构筑心理陷阱。CEO 第一时间切入直接否定假定，并用 NDR 128% 硬数据反击，是跨国顶级控场的教科书范例。',
        subtextInsights: {
          surfaceMeaning: '我有一个关于第四季度收入减速的疑问想打断确认一下。',
          hiddenIntent: '我抓到了你们财报里的破绽，我要在公开电话会上坐实你们客户流失的假象，借此动摇投资者信心。',
          businessCultureNote: 'C-Suite 高管面对恶意陷阱提问时，绝不能使用含糊其辞的防御性语言，必须以 "That inference is incorrect" 迅速夺回议程主动权。'
        }
      }
    ]
  }
];
