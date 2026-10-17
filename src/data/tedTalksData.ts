import { TedTalkLesson } from '../types';

export const DAILY_TED_TALKS: TedTalkLesson[] = [
  {
    id: 'ted-01',
    title: 'How Great Leaders Inspire Action (黄金圈法则：优秀领袖如何激发行动)',
    speaker: 'Simon Sinek',
    speakerRole: 'Author & Leadership Thinker',
    category: '领导力与商业说服 (Leadership & Pitching)',
    coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 12,
    recommendedDate: '今日推荐 (10-15分钟轻精听)',
    overview: '全球播放量超 6000 万次的商业经典演讲。Simon Sinek 提出了“黄金圈 (The Golden Circle)”模型：平庸的公司从“做什么 (What)”出发，而苹果等伟大企业永远从“为什么 (Why)”开始沟通。',
    executiveInsights: '在商业演示、产品发布或团队激励中，永远先讲“为什么做这件事（初心与使命）”，再讲“怎么做（差异化路径）”，最后才讲“具体产品功能”。情感共鸣远胜于功能堆砌。',
    keyQuotes: [
      "People don't buy what you do; they buy why you do it.",
      "The goal is not to do business with everybody who needs what you have. The goal is to do business with people who believe what you believe."
    ],
    transcript: [
      {
        id: 'tt-1',
        speaker: 'Simon Sinek',
        en: "How do you explain when things don't go as we assume? Or better yet, how do you explain when others are able to achieve things that seem to defy all the assumptions?",
        zh: "当事情的进展不如我们所预料时，你该如何解释？或者换个说法，当某些人做到了似乎打破所有人常识设想的成就时，你又该如何解释？",
        startSec: 0,
        endSec: 10
      },
      {
        id: 'tt-2',
        speaker: 'Simon Sinek',
        en: "Why is Apple so innovative? Year after year, they're more innovative than all their competition. And yet, they're just a computer company. They're just like everyone else.",
        zh: "为什么苹果公司如此具有创新力？年复一年，他们比所有竞争对手都更具创新力。然而，他们归根结底只是一家电脑公司，硬件材料和别人别无二致。",
        startSec: 10,
        endSec: 22
      },
      {
        id: 'tt-3',
        speaker: 'Simon Sinek',
        en: "As it turns out, there's a pattern. As it turns out, all the great inspiring leaders and organizations in the world think, act, and communicate the exact same way. And it's the complete opposite to everyone else.",
        zh: "事实证明，这背后存在着清晰的规律。世界上所有具有启发力的伟大领袖与企业，他们的思考、行动和沟通方式如出一辙，并且与常人完全背道而驰。",
        startSec: 22,
        endSec: 36
      },
      {
        id: 'tt-4',
        speaker: 'Simon Sinek',
        en: "I codified it, and I call it the Golden Circle: Why, How, and What. Very simply, every single organization on the planet knows what they do. But very few people or organizations know why they do what they do.",
        zh: "我将其总结归纳为‘黄金圈’法则：为什么、怎么做、做什么。简而言之，地球上的每家公司都知道自己在‘做什么’；但极少数人或企业能够真正阐明‘为什么这么做’。",
        startSec: 36,
        endSec: 52
      },
      {
        id: 'tt-5',
        speaker: 'Simon Sinek',
        en: "People don't buy what you do; they buy why you do it. If you talk about what you believe, you will attract those who believe what you believe.",
        zh: "人们买的不是你‘做什么’，而是你‘为什么做’。只要你清晰地传达出你的信仰，你就会自然而然地吸引那些与你志同道合的人。",
        startSec: 52,
        endSec: 66
      }
    ]
  },
  {
    id: 'ted-02',
    title: 'Principles: Radical Truth and Radical Transparency (极度求真与极度透明)',
    speaker: 'Ray Dalio',
    speakerRole: 'Founder of Bridgewater Associates',
    category: '企业文化与高效决策 (Management & Culture)',
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 14,
    recommendedDate: '进阶推荐 (B2-C1 高管思维)',
    overview: '全球最大对冲基金桥水基金创始人 Ray Dalio 分享其独创的“创意择优 (Idea Meritocracy)”与“极度求真”的管理原则，如何在跨国团队消除办公室政治与沉默文化。',
    executiveInsights: '在跨国业务协作中，隐瞒问题与盲目礼貌是组织效率的最大杀手。通过以数据和事实为准绳的客观辩论，让最优质的观点脱颖而出，而非权级最高的人说了算。',
    keyQuotes: [
      "Pain plus reflection equals progress.",
      "Don't let the fear of what others think of you stand in your way."
    ],
    transcript: [
      {
        id: 'rd-1',
        speaker: 'Ray Dalio',
        en: "In order to be successful, you have to be an independent thinker because the consensus is already built into the price.",
        zh: "要想在投资和商业中获得巨大成功，你必须成为一名独立思考者，因为市场共识早已被反映在当下的价格之中了。",
        startSec: 0,
        endSec: 10
      },
      {
        id: 'rd-2',
        speaker: 'Ray Dalio',
        en: "To be an independent thinker, it means you have to be willing to be wrong. And when I had my biggest mistake, it gave me the humility I needed.",
        zh: "成为独立思考者，意味着你必须时刻做好承认自己犯错的准备。当我经历人生最惨痛的商业挫折时，正是它赋予了我不可或缺的谦卑。",
        startSec: 10,
        endSec: 22
      },
      {
        id: 'rd-3',
        speaker: 'Ray Dalio',
        en: "We created an idea meritocracy. And by idea meritocracy, I mean a system that brings together smart, independent thinkers and has them disagree productively.",
        zh: "我们在桥水建立了一套‘创意择优’机制。所谓的创意择优，是指汇聚聪慧且独立的思考者，并让他们展开极具建设性的良性辩论。",
        startSec: 22,
        endSec: 36
      },
      {
        id: 'rd-4',
        speaker: 'Ray Dalio',
        en: "Radical truth and radical transparency means people can say what they really think, and everyone can challenge everyone regardless of hierarchy.",
        zh: "极度求真与极度透明，意味着每个人都能毫无保留地说出真实想法，任何职级的员工都能对任何人发起挑战，不论层级高低。",
        startSec: 36,
        endSec: 50
      }
    ]
  },
  {
    id: 'ted-03',
    title: 'The Learn-It-All Culture: Transforming Microsoft (从无所不知到无所不学)',
    speaker: 'Satya Nadella',
    speakerRole: 'CEO of Microsoft',
    category: '组织转型与成长型思维 (Growth Mindset & Strategy)',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 10,
    recommendedDate: '精炼推荐 (10分钟晨间复读)',
    overview: '微软 CEO 萨提亚·纳德拉讲述如何带领微软从官僚内耗的“Know-It-All (自以为无所不知)”泥潭，转型为崇尚同理心与终身学习的“Learn-It-All (无所不学)”万亿科技巨头。',
    executiveInsights: '在快速迭代的 AI 时代，自命不凡的专家很快会被淘汰，而具备同理心 (Empathy) 和成长型思维 (Growth Mindset) 的跨职能人才才能赢得未来。',
    keyQuotes: [
      "The 'learn-it-all' will always do better than the 'know-it-all' in the long run.",
      "Empathy grounds our innovation. You cannot have innovation without empathy."
    ],
    transcript: [
      {
        id: 'sn-1',
        speaker: 'Satya Nadella',
        en: "When I became CEO, I knew our core challenge wasn't our technological prowess. Our core challenge was our culture.",
        zh: "当我出任 CEO 时，我深知我们面临的核心挑战并非技术实力本身，我们最深层的挑战在于组织文化。",
        startSec: 0,
        endSec: 10
      },
      {
        id: 'sn-2',
        speaker: 'Satya Nadella',
        en: "Carol Dweck wrote a book called Mindset. If you take two boys at school, one with more innate capability and one with less, the 'learn-it-all' will always outdo the 'know-it-all'.",
        zh: "心理学家卡罗尔·德韦克曾著有《终身成长》一书。若学校里有两个男孩，哪怕其中一人天赋稍逊，只要他是‘终身学习者’，长远来看他必定战胜‘自诩无所不知者’。",
        startSec: 10,
        endSec: 24
      },
      {
        id: 'sn-3',
        speaker: 'Satya Nadella',
        en: "Our business is about confronting uncertainty with curiosity. We must move from an obsession with proving we are right, to a relentless pursuit of learning.",
        zh: "我们的商业使命，就是怀着强烈的好奇心直面未知与不确定性。我们必须从‘执着于证明自己是对的’，转向‘永无止境地探求新知’。",
        startSec: 24,
        endSec: 40
      }
    ]
  }
];
