export enum FortuneCategory {
  WEALTH = '财运',
  LOVE = '姻缘',
  CAREER = '事业',
  HEALTH = '健康',
  TABOO = '宜忌',
}

export enum PredictionScope {
  DAY = '日运',
  MONTH = '月运',
  YEAR = '流年',
}

export const CHINESE_HOURS = [
  '子 (23:00-01:00)', '丑 (01:00-03:00)', '寅 (03:00-05:00)', '卯 (05:00-07:00)', 
  '辰 (07:00-09:00)', '巳 (09:00-11:00)', '午 (11:00-13:00)', '未 (13:00-15:00)', 
  '申 (15:00-17:00)', '酉 (17:00-19:00)', '戌 (19:00-21:00)', '亥 (21:00-23:00)'
];

export interface UserData {
  userName: string;
  birthDate: string; // YYYY-MM-DD
  birthHour: string; // "子", "丑" etc.
  scope: PredictionScope;
  targetDate: string; // YYYY-MM-DD (Used for Day/Month/Year logic)
  categories: FortuneCategory[];
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
  targetInfo: {
    lunarDateStr: string;
    ganZhi: string; // 干支
    yi: string[]; // 宜
    ji: string[]; // 忌
    chong: string; // 冲煞
    wuxing: string; // 纳音五行
    shenSha: string[]; // 吉神/凶煞
  };
  conflictStatus: string; // Pre-calculated conflict description
}

export interface FortuneResult {
  title: string; // e.g., "乙巳年·运势总批"
  summary: string; // 判词
  scores: {
    category: string;
    score: number; // 0-100
    comment: string;
  }[];
  luckyGuide: {
    color: string;
    direction: string;
    number: string;
  };
  advice: string; // 道长寄语
}

export interface GasPayload {
  timestamp: string;
  userName: string;
  birthDate: string;
  scope: string;
  targetDate: string;
  categories: string[];
  resultSummary: string;
}