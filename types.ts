
export const CHINESE_HOURS = [
  '子 (23:00-01:00)', '丑 (01:00-03:00)', '寅 (03:00-05:00)', '卯 (05:00-07:00)',
  '辰 (07:00-09:00)', '巳 (09:00-11:00)', '午 (11:00-13:00)', '未 (13:00-15:00)',
  '申 (15:00-17:00)', '酉 (17:00-19:00)', '戌 (19:00-21:00)', '亥 (21:00-23:00)'
];

export const DATE_RANGE_OPTIONS = [
  { label: '7日内', value: '7d', days: 7 },
  { label: '1个月内', value: '1m', days: 30 },
  { label: '3个月内', value: '3m', days: 90 },
  { label: '半年内', value: '6m', days: 180 },
  { label: '1年内', value: '1y', days: 365 },
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
