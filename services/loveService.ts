import { astro } from 'iztro';
import { LoveUserData, LoveResult } from '../types';

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

  const isDev = import.meta.env.MODE === 'development';
  const apiUrl = isDev ? '/api/deepseek/chat/completions' : 'https://api.deepseek.com/chat/completions';

  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

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

/**
 * Generate love fortune analysis using iztro and DeepSeek
 */
export const generateLoveFortune = async (userData: LoveUserData): Promise<LoveResult> => {
  // Use iztro to generate horoscope
  const horoscope = astro.bySolar(
    userData.birthDate,
    userData.birthHour,
    userData.gender === 'male' ? 1 : 0 // 1=male, 0=female in iztro
  );

  // Extract spouse palace (夫妻宫) data
  const spousePalace = horoscope.palace.find(p => p.name === '夫妻宫');

  if (!spousePalace) {
    throw new Error('无法获取夫妻宫数据');
  }

  // Get current year horoscope for yearly analysis
  const currentYear = new Date().getFullYear();
  const yearlyHoroscope = horoscope.yearly(currentYear);

  // Prepare data for AI analysis
  const spousePalaceData = {
    palace: spousePalace.name,
    majorStars: spousePalace.majorStars.map(s => ({
      name: s.name,
      type: s.type,
      nature: s.nature
    })),
    minorStars: spousePalace.minorStars.map(s => ({
      name: s.name,
      type: s.type
    })),
    auspiciousStars: spousePalace.auxiliaryStars?.filter(s => s.type === '吉').map(s => s.name) || [],
    ominousStars: spousePalace.auxiliaryStars?.filter(s => s.type === '凶').map(s => s.name) || [],
    transformations: spousePalace.majorStars.map(s => {
      const trans = s.flower;
      return trans ? `${s.name}:${trans}` : null;
    }).filter(Boolean) as string[]
  };

  const yearlyData = {
    year: currentYear.toString(),
    decadal: yearlyHoroscope.decadal?.name || '',
    age: yearlyHoroscope.decadal?.age?.toString() || '',
    palace: yearlyHoroscope.palace?.find(p => p.name === '夫妻宫')?.name || ''
  };

  const systemPrompt = `
    Role: 你是一个说话直白、客观的命理师，精通紫微斗数。

    TONE & STYLE:
    - **大白话**: 用通俗语言解释，不要堆砌专业术语
    - **客观理性**: 基于星曜数据说话，不夸大不美化
    - **实用主义**: 给出可执行的建议，而不是空泛的安慰

    核心任务：
    1. 分析用户的夫妻宫星曜配置
    2. 结合流年四化变化
    3. 给出3条具体可执行的建议

    重要原则：
    - 必须结合四化（禄权科忌）进行分析
    - 如果有煞星或空宫，要如实指出
    - 建议要具体，不要说"多沟通"这种空话
    - 不要盲目乐观，也不要过度悲观
  `;

  const userPrompt = `
    用户信息：
    - 姓名：${userData.userName}
    - 性别：${userData.gender === 'male' ? '男' : '女'}
    - 生辰：${userData.birthDate} ${['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][userData.birthHour]}时

    夫妻宫数据（真实）：
    ${JSON.stringify(spousePalaceData, null, 2)}

    流年数据（${currentYear}年）：
    ${JSON.stringify(yearlyData, null, 2)}

    任务：
    请根据以上紫微斗数数据，分析该用户今年的感情运势。

    输出 JSON 格式：
    {
      "title": "标题（如：张先生2025年姻缘分析）",
      "summary": "命理综述：用大白话解释夫妻宫配置和流年影响",
      "advice": [
        "建议1：具体可执行的建议",
        "建议2：具体可执行的建议",
        "建议3：具体可执行的建议"
      ]
    }

    要求：
    1. 每条建议都要具体，例如"3月桃花旺，可参加社交活动"而不是"把握机会"
    2. 如果夫妻宫有煞星，要直接说明风险
    3. 如果流年有化禄或化权，要说明机遇
  `;

  try {
    const deepSeekResponse = await callDeepSeekAPI(systemPrompt, userPrompt, true);

    const content = deepSeekResponse.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from DeepSeek');
    }

    const aiResult = JSON.parse(content);

    return {
      title: aiResult.title,
      summary: aiResult.summary,
      spousePalace: spousePalaceData,
      yearlyAnalysis: yearlyData,
      advice: aiResult.advice
    };

  } catch (error) {
    console.error("Love fortune generation error:", error);
    throw new Error("Unable to generate love fortune at this moment. Please try again later.");
  }
};
