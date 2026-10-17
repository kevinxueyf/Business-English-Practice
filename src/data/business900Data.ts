import { BusinessPhrase } from '../types';

export const BUSINESS_900_PHRASES: BusinessPhrase[] = [
  // 1. 商务寒暄与破冰 (Icebreaking & Small Talk)
  {
    id: 'b900-01',
    category: 'icebreak',
    categoryName: '破冰与寒暄',
    en: "It's a pleasure to finally connect with you in person.",
    zh: "非常荣幸终于能和您当面建立联系。",
    phoneticTip: "注意 'finally connect' 的连读，'person' 重音在第一音节。",
    businessContext: "跨国会议开场、展会初次见面、线上长期沟通后首次线下碰头时的高情商开场白。",
    accent: 'US',
    difficulty: 'L1'
  },
  {
    id: 'b900-02',
    category: 'icebreak',
    categoryName: '破冰与寒暄',
    en: "How are things tracking on your side this quarter?",
    zh: "你们团队这个季度的各项业务推进得还顺利吗？",
    phoneticTip: "'tracking on' 连读为 /trækɪŋ ɒn/，语气平稳探询。",
    businessContext: "用于非正式或正式会议前 2 分钟闲聊 (Small Talk)，显得亲和且关注业务。",
    accent: 'US',
    difficulty: 'L2'
  },
  {
    id: 'b900-03',
    category: 'icebreak',
    categoryName: '破冰与寒暄',
    en: "I appreciate everyone making time for this sync despite the timezone difference.",
    zh: "非常感谢大家克服时差特意抽出时间参加本次同步会议。",
    phoneticTip: "重点重读 'appreciate' 和 'timezone'，体现对全球同事的体谅。",
    businessContext: "跨时区跨国会议主持人（Host）的标准暖场致谢词。",
    accent: 'UK',
    difficulty: 'L2'
  },

  // 2. 敏捷站会与项目汇报 (Agile Standup & Progress Sync)
  {
    id: 'b900-04',
    category: 'standup',
    categoryName: '站会与进度汇报',
    en: "Yesterday, I wrapped up the responsive layout and all automated unit tests are green.",
    zh: "昨天我完成了响应式界面的收尾工作，所有自动化单元测试已全部通过（绿灯）。",
    phoneticTip: "'wrapped up' 连读为 /ræpt ʌp/，'are green' 语调轻快自信。",
    businessContext: "每日晨会 (Daily Standup) 的标准极简三段式：“昨天完成、今天计划、有无阻塞”。",
    accent: 'US',
    difficulty: 'L2'
  },
  {
    id: 'b900-05',
    category: 'standup',
    categoryName: '站会与进度汇报',
    en: "My primary blocker right now is the pending API credentials from the security team.",
    zh: "我目前最大的阻碍是安全团队尚未签发的 API 访问凭据。",
    phoneticTip: "清晰读出 'blocker' 和 'pending'，避免含糊带过。",
    businessContext: "站会中提出阻塞项 (Flag a blocker)，促使 Scrum Master 介入协调推进。",
    accent: 'UK',
    difficulty: 'L2'
  },
  {
    id: 'b900-06',
    category: 'standup',
    categoryName: '站会与进度汇报',
    en: "Let's take this offline and circle back after our sprint demo.",
    zh: "这个问题细节较多，我们线下单独碰，并在冲刺演示会后再同步闭环。",
    phoneticTip: "'take this offline' 是跨国科技大厂极高频短语，'circle back' 意味回转复盘。",
    businessContext: "当站会讨论偏离主题或拖慢整体进度时，主持人礼貌控场用语。",
    accent: 'US',
    difficulty: 'L2'
  },

  // 3. 需求排期与范围防守 (Scope Creep & Deadlines)
  {
    id: 'b900-07',
    category: 'negotiation',
    categoryName: '排期防守与推辞',
    en: "Taking on three additional features without QA buffer introduces substantial regression risk.",
    zh: "在没有测试缓冲期的情况下追加三个新功能，会引入相当大的系统回归风险。",
    phoneticTip: "'buffer introduces' 注意鼻音衔接，'regression risk' 重读首音节。",
    businessContext: "面对产品经理或客户临时塞需求（Scope Creep）时，以“质量与稳定性”为武器的专业防守话术。",
    accent: 'UK',
    difficulty: 'L3'
  },
  {
    id: 'b900-08',
    category: 'negotiation',
    categoryName: '排期防守与推辞',
    en: "Would it be feasible to ship the core checkout flow for Friday and queue the rest for next sprint?",
    zh: "我们能否先在周五上线核心结账流程，将剩余次要功能排入下个迭代？",
    phoneticTip: "'Would it be feasible to...' 是极高情商的委婉建议句型，比 'We cannot do it' 得体得多。",
    businessContext: "给出双赢替代方案 (Trade-off & Phased Rollout)，既不当场拒绝，又守住底线。",
    accent: 'US',
    difficulty: 'L3'
  },
  {
    id: 'b900-09',
    category: 'negotiation',
    categoryName: '排期防守与推辞',
    en: "We need to manage stakeholder expectations around our current engineering bandwidth.",
    zh: "鉴于当前研发团队的工作负荷，我们需要合理引导利益相关方的心理预期。",
    phoneticTip: "'bandwidth' 在商业英语中广泛借代为“人力精力余量”。",
    businessContext: "向管理层打预防针、避免做出无法兑现的过度承诺 (Over-promising)。",
    accent: 'US',
    difficulty: 'L3'
  },

  // 4. 价格谈判与折中让步 (Pricing & Bargaining)
  {
    id: 'b900-10',
    category: 'procurement',
    categoryName: '价格谈判与议价',
    en: "If we commit to a 24-month agreement, what kind of volume rebate can you provide?",
    zh: "如果我们承诺签署 24 个月的长约，贵方能在用量返点上给出怎样的优惠？",
    phoneticTip: "'commit to a' 连读，'volume rebate'（阶梯用量返点）重音突出。",
    businessContext: "商务谈判中用“长期确定性”换取“更优单价”的标准筹码交换句式。",
    accent: 'US',
    difficulty: 'L3'
  },
  {
    id: 'b900-11',
    category: 'procurement',
    categoryName: '价格谈判与议价',
    en: "Our margins are razor-thin, but we can waive the onboarding architecture setup fee.",
    zh: "我们的利润空间已经非常薄了，但我们可以破例免除系统接入架构服务费。",
    phoneticTip: "'razor-thin'（薄如刀片）比喻利润极微，'waive' 读 /weɪv/（豁免）。",
    businessContext: "供应商守住公开报价底线、通过免除非核心费用达成妥协的经典话术。",
    accent: 'IN',
    difficulty: 'L3'
  },

  // 5. 故障危机公关与安抚 (Crisis Management)
  {
    id: 'b900-12',
    category: 'crisis',
    categoryName: '危机公关与安抚',
    en: "We take full ownership of yesterday's latency spike and are already rolling out a comprehensive patch.",
    zh: "对于昨天出现的延迟激增，我们承担全部责任，并且已经在全量部署综合修复补丁。",
    phoneticTip: "'take full ownership'（负全责，不甩锅）在跨国企业极具职业信誉感。",
    businessContext: "线上服务降级面对愤怒客户时，以真诚态度稳定局面的开场关键句。",
    accent: 'US',
    difficulty: 'L3'
  },
  {
    id: 'b900-13',
    category: 'crisis',
    categoryName: '危机公关与安抚',
    en: "Our VP of Engineering will share a transparent post-mortem root cause analysis by 3:00 PM today.",
    zh: "我们的技术副总裁将在今天下午 3:00 前向您同步一份公开透明的事后根本原因分析报告（RCA）。",
    phoneticTip: "'root cause analysis'（RCA）是高阶运维和技术外企必备黄金术语。",
    businessContext: "给出明确时间节点与行动交付物，彻底平息客户疑虑与恐慌。",
    accent: 'UK',
    difficulty: 'L4'
  },

  // 6. 董事会战略与高管提案 (C-Suite & Board Pitch)
  {
    id: 'b900-14',
    category: 'executive',
    categoryName: '高管战略提案',
    en: "Our net dollar retention rate climbed to 128%, proving our enterprise customer cohort is remarkably sticky.",
    zh: "我们的净金额留存率攀升到了 128%，证明我们的企业级客群粘性极其稳固。",
    phoneticTip: "'net dollar retention'（NDR）与 'sticky'（高粘性）是华尔街与 SaaS 董事会核心指标。",
    businessContext: "财报会议、融资路演或董事会季度汇报时，展示商业护城河的强力论据。",
    accent: 'US',
    difficulty: 'L4'
  },
  {
    id: 'b900-15',
    category: 'executive',
    categoryName: '高管战略提案',
    en: "Even under our most conservative stress-tested scenario, payback occurs within 7.2 months.",
    zh: "即使在我们最保守的压力测试情境下，投资回收期也在 7.2 个月以内。",
    phoneticTip: "'stress-tested scenario' 重读，体现严谨的财务测算底气。",
    businessContext: "向投资人或 CFO 申请数千万预算时，化解风险疑虑的关键定心丸。",
    accent: 'US',
    difficulty: 'L4'
  }
];

export const PHRASE_CATEGORIES = [
  { id: 'all', name: '全部经典 900 句' },
  { id: 'icebreak', name: '破冰与寒暄' },
  { id: 'standup', name: '站会与进度汇报' },
  { id: 'negotiation', name: '排期防守与推辞' },
  { id: 'procurement', name: '价格谈判与议价' },
  { id: 'crisis', name: '危机公关与安抚' },
  { id: 'executive', name: '高管战略提案' }
];
