
export const CHINESE_HOURS = [
  '子 (23:00-01:00)', '丑 (01:00-03:00)', '寅 (03:00-05:00)', '卯 (05:00-07:00)',
  '辰 (07:00-09:00)', '巳 (09:00-11:00)', '午 (11:00-13:00)', '未 (13:00-15:00)',
  '申 (15:00-17:00)', '酉 (17:00-19:00)', '戌 (19:00-21:00)', '亥 (21:00-23:00)'
];

export const DATE_RANGE_OPTIONS = [
  { label: '未来一周', value: '7d', days: 7 },
  { label: '未来一个月', value: '1m', days: 30 },
  { label: '未来三个月', value: '3m', days: 90 },
  { label: '未来半年', value: '6m', days: 180 },
  { label: '未来一年', value: '1y', days: 365 },
];

export interface UserData {
  userName: string;
  birthDate: string; // YYYY-MM-DD
  birthHour: string; // "子", "丑" etc.
  request: string; // The specific goal (e.g., "Moving house", "Wedding")
  dateRange?: string; // '7d', '1m', '3m', '6m', '1y'
  tags?: string[]; // Optional tags for the request
}

// Data extracted from lunar-javascript to pass to AI
export interface LunarAnalysisData {
  userBaZi: {
    year: string;
    month: string;
    day: string;
    time: string;
    animal: string; // Zodiac
    dayElement: string; // Day Master (日主五行)
  };
}

export interface RecommendedDate {
  date: string; // YYYY-MM-DD
  weekDay: string; // e.g. 周五
  lunarDate: string; // e.g. 四月初五
  reason: string; // The "Convincing Logic"
  energyScore: number; // 80-100
  tags: string[]; // e.g. ["天德合", "月德"]
  type: string; // e.g. "天赐吉日", "上上吉日"
  bestTime: string; // e.g. "巳时 (09:00-11:00)"
  direction: string; // e.g. "正南"
  taboo: string; // e.g. "冲鼠(壬子)煞北"
}

export interface FortuneResult {
  title: string; 
  summary: string; // Overall analysis of the user's request vs their BaZi
  dates: {
    immediate: RecommendedDate[]; // Within 1 week (1 date)
    shortTerm: RecommendedDate[]; // 1 week - 1 month (2 dates)
    longTerm: RecommendedDate[];  // 1 month - 6 months (2 dates)
  };
  advice: string; // Preparation advice
}

export interface GasPayload {
  timestamp: string;
  userName: string;
  birthDate: string;
  request: string;
  resultSummary: string;
}

// Love (测姻缘) types
export interface LoveUserData {
  userName: string;
  birthDate: string; // YYYY-MM-DD
  birthHour: number; // 0-11 (子=0, 丑=1, etc.)
  gender: 'male' | 'female'; // 性别
}

export interface LoveResult {
  title: string;
  summary: string;
  spousePalace: {
    palace: string;
    majorStars: string[];
    minorStars: string[];
    auspiciousStars: string[];
    ominousStars: string[];
    transformations: string[];
  };
  yearlyAnalysis: {
    year: string;
    stars: string[];
    transformations: string[];
  };
  advice: string[]; // 3条可执行建议
}

// Money (算财运) types
export interface MoneyUserData {
  userName: string;
  wealthType: 'investment' | 'debt' | 'salary' | 'business' | 'other';
  customRequest?: string;
}

export interface MoneyResult {
  title: string;
  currentGanzhi: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  analysis: {
    positive: string; // 肯定：有利因素
    negative: string; // 真话：风险因素
    advice: string; // 建议：具体行动
  };
  auspiciousDirection?: string;
  auspiciousTime?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

// Dream (周公解梦) types
export interface DreamUserData {
  userName: string;
  dreamDescription: string; // 梦境描述
}

export interface DreamResult {
  title: string;
  dreamSummary: string; // 梦境简要描述
  folkInterpretation: {
    symbols: string[]; // 提取的关键意象
    prediction: string; // 周公解梦：吉凶判断
    auspiciousLevel: 'auspicious' | 'neutral' | 'inauspicious'; // 吉凶等级
  };
  psychologicalAnalysis: {
    perspective: 'freudian' | 'jungian' | 'integrated'; // 分析视角
    analysis: string; // 心理分析：潜意识反映的焦虑或欲望
    keyInsights: string[]; // 关键洞察
  };
  summary: string; // 一句话总结启示
}
