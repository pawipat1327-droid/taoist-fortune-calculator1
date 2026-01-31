import { UserData, FortuneResult, DATE_RANGE_OPTIONS } from '../types';
import { analyzeDestiny } from '../utils/lunarHelper';

interface DeepSeekRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  response_format?: { type: string };
  stream?: boolean;
  temperature?: number;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Call DeepSeek API via Vite proxy (bypasses CORS)
 */
const callDeepSeekAPI = async (
  systemPrompt: string,
  userPrompt: string,
  jsonResponse = false
): Promise<DeepSeekResponse> => {
  const body: DeepSeekRequest = {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    stream: false,
    temperature: 0.8
  };

  if (jsonResponse) {
    body.response_format = { type: 'json_object' };
    body.temperature = 1.3;
  }

  // Use Vite proxy in dev mode, or direct API call in production
  const isDev = import.meta.env.MODE === 'development';
  const apiUrl = isDev ? '/api/deepseek/chat/completions' : 'https://api.deepseek.com/chat/completions';

  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  // In production, we need to add API key header (proxy handles this in dev)
  if (!isDev) {
    (headers as any)['Authorization'] = 'Bearer sk-fe74936882674bf5ab67e874d06628ec';
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`DeepSeek API Error: ${response.status} ${JSON.stringify(errorData)}`);
  }

  return response.json();
};

export const generateFortune = async (userData: UserData): Promise<FortuneResult> => {
  const lunarData = analyzeDestiny(userData);
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Calculate date range based on user selection (default to 1 month)
  const selectedRange = DATE_RANGE_OPTIONS.find(opt => opt.value === userData.dateRange) || DATE_RANGE_OPTIONS[1];
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + selectedRange.days);
  const endDateStr = endDate.toISOString().split('T')[0];

  const systemPrompt = `
    Role: You are a highly professional Taoist Feng Shui and BaZi Date Selection Master (资深择日师) who is also well-versed in modern psychology.
    Your task is to SCAN, SCORE, and RANK auspicious dates based on the user's BaZi and their specific request.

    TONE & STYLE:
    - **Vernacular & Accessible (大白话)**: Explain concepts simply. Avoid obscure jargon. If you must use a term (like "San He"), explain it briefly.
    - **Warm & Personalized**: Speak directly to the user (using "您"). Connect the analysis to their specific request.
    - **NO TEMPLATES**: Do not use generic "universal formulas". Every sentence must be relevant to THIS user and THIS request.

    CORE PRINCIPLES (STRICT):
    1. **Scan the Entire Date Range**: Systematically analyze ALL dates from ${todayStr} to ${endDateStr}.
    2. **Avoid Clashes (避冲)**: You MUST calculate the Earthly Branch of the date. If it clashes (冲) with the User's Zodiac (${lunarData.userBaZi.animal}), EXCLUDE it immediately.
       - Rat(子) clashes Horse(午) -> Avoid Wu dates
       - Ox(丑) clashes Sheep(未) -> Avoid Wei dates
       - Tiger(寅) clashes Monkey(申) -> Avoid Shen dates
       - Rabbit(卯) clashes Rooster(酉) -> Avoid You dates
       - Dragon(辰) clashes Dog(戌) -> Avoid Xu dates
       - Snake(巳) clashes Pig(亥) -> Avoid Hai dates
    3. **Score Each Valid Date (0-100)**: For dates that pass the clash check, calculate a comprehensive score based on:
       - **Harmony Bonus (30 points)**: San He (三合), Liu He (六合), Tian De (天德), Yue De (月德)
       - **Activity Match (25 points)**: The date's 'Yi' (宜) suitability for the User's Request
       - **Day Master Support (25 points)**: Whether the date elements support the user's Day Master (${lunarData.userBaZi.dayElement})
       - **Timing Factor (20 points)**: Consider the distance from today (earlier dates for urgent requests get bonus)
    4. **Rank & Return Top 5**: Sort all scored dates from highest to lowest. Return ONLY the top 5 dates (or fewer if <5 valid dates exist).

    SCORING GUIDELINES:
    - 95-100: Extraordinary (multiple harmony factors, perfect activity match)
    - 85-94: Excellent (strong harmony, good activity match)
    - 75-84: Good (decent harmony, acceptable for the activity)
    - 65-74: Fair (minimal conflicts, usable)
    - Below 65: Do not include in results

    OUTPUT FORMAT:
    Return strictly valid JSON. No markdown.

    JSON SCHEMA:
    {
      "title": "Title of the plan (e.g. '张先生(甲子年)搬家择吉方案')",
      "summary": "命理综述: Use plain language to explain why this timeframe is suitable for the user's specific request. Mention how you searched ${selectedRange.label} and scored dates based on harmony, activity match, and timing. Avoid sounding like a robot.",
      "dates": [
        {
          "date": "YYYY-MM-DD",
          "weekDay": "e.g. 周日",
          "type": "Label based on score range: '天赐吉日'(95+) OR '上上吉日'(85-94) OR '大吉'(75-84) OR '吉日'(65-74)",
          "lunarDate": "e.g. 丙午年四月初八",
          "bestTime": "Specific auspicious hour, e.g. '巳时 (09:00-11:00)' - MUST NOT clash with user.",
          "direction": "Best direction for the activity, e.g. '正南' (avoid Wu Gui/Jue Ming).",
          "reason": "大师批语: Specific explanation for this date. Why is it good for *this specific request*? Mention the score factors (harmony, activity match, etc.). (Keep it friendly)",
          "taboo": "Briefly mention the daily clash, e.g. '冲鼠(壬子)煞北'",
          "energyScore": 95
        }
        // ... Return up to 5 dates, sorted by score descending. If fewer than 5 valid dates, return whatever you found.
      ],
      "advice": "道长锦囊: Actionable, practical advice for the user's specific event. Do NOT give generic advice like 'do good deeds'. Give specific tips related to ${userData.request}."
    }
  `;

  const userPrompt = `
    User Info:
    - Name: ${userData.userName}
    - BaZi: ${lunarData.userBaZi.year} / ${lunarData.userBaZi.month} / ${lunarData.userBaZi.day} / ${lunarData.userBaZi.time}
    - Zodiac: ${lunarData.userBaZi.animal}
    - Day Master: ${lunarData.userBaZi.dayElement}

    Request: "${userData.request}" (Tags: ${(userData.tags || []).join(', ')})
    Date Range: ${todayStr} to ${endDateStr} (${selectedRange.label})

    TASK:
    1. **SCAN**: Systematically analyze each date in the range ${todayStr} to ${endDateStr}.
    2. **FILTER**: Exclude any date that clashes with the user's Zodiac (${lunarData.userBaZi.animal}).
    3. **SCORE**: For each valid date, calculate a score (0-100) based on:
       - Harmony factors (San He, Liu He, Tian De, Yue De)
       - Activity match with "${userData.request}"
       - Support for Day Master (${lunarData.userBaZi.dayElement})
       - Timing (urgency consideration)
    4. **RANK**: Sort all valid dates by score (highest to lowest).
    5. **OUTPUT**: Return the top 5 dates (or fewer if <5 valid dates exist).

    For each returned date, provide:
    1. The Date & Lunar Date
    2. Best Time (吉时) and Direction (吉方)
    3. Detailed Reason explaining the score factors
    4. Daily Taboo/Clash (冲煞)
    5. The calculated score (energyScore)

    IMPORTANT: Do NOT force 5 results if you cannot find enough valid dates. Return what you find, prioritized by score.
  `;

  try {
    const deepSeekResponse = await callDeepSeekAPI(systemPrompt, userPrompt, true);

    const content = deepSeekResponse.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from DeepSeek');
    }

    const apiResult = JSON.parse(content);

    // Transform dates array to object structure expected by FortuneResult
    const datesArray = apiResult.dates || [];

    // Ensure each date has required fields with defaults
    const datesWithDefaults = datesArray.map((date: any) => ({
      date: date.date || '',
      weekDay: date.weekDay || '',
      lunarDate: date.lunarDate || '',
      reason: date.reason || '',
      energyScore: date.energyScore || 70,
      tags: date.tags || [],
      type: date.type || '吉日',
      bestTime: date.bestTime || '吉时待定',
      direction: date.direction || '正南',
      taboo: date.taboo || ''
    }));

    // Split dates into immediate (1), short-term (2), long-term (2)
    const transformedResult: FortuneResult = {
      title: apiResult.title,
      summary: apiResult.summary,
      dates: {
        immediate: datesWithDefaults.slice(0, 1), // First date - immediate/urgent
        shortTerm: datesWithDefaults.slice(1, 3), // Next 2 dates - short term (1 month)
        longTerm: datesWithDefaults.slice(3, 5), // Last 2 dates - long term (up to 6 months)
      },
      advice: apiResult.advice
    };

    return transformedResult;

  } catch (error) {
    console.error("Fortune generation error:", error);
    throw new Error("Unable to calculate dates at this moment. Please try again later.");
  }
};
