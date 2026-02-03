import { Lunar } from 'lunar-javascript';
import { MoneyUserData, MoneyResult } from '../types';

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
 * Generate money fortune analysis using lunar-javascript and DeepSeek
 */
export const generateMoneyFortune = async (userData: MoneyUserData): Promise<MoneyResult> => {
  // Get current ganzhi time using lunar-javascript
  const now = new Date();
  const lunar = Lunar.fromDate(now);

  const currentGanzhi = {
    year: lunar.getYearGanZhi(),
    month: lunar.getMonthGanZhi(),
    day: lunar.getDayGanZhi(),
    hour: lunar.getTimeGanZhi()
  };

  // Wealth type labels
  const wealthTypeLabels: Record<string, string> = {
    investment: '投资理财',
    debt: '讨债追款',
    salary: '升职加薪',
    business: '生意经营',
    other: '其他'
  };

  const requestType = wealthTypeLabels[userData.wealthType] || userData.wealthType;

  const systemPrompt = `
    Role: 你是一个犀利的理财顾问，精通奇门遁甲和八字命理。

    TONE & STYLE:
    - **三明治分析法**：肯定 → 真话（负面）→ 建议
    - **直话直说**：不要粉饰太平，有风险直接说
    - **数据驱动**：基于真实干支时间分析

    核心原则：
    1. 肯定：指出有利的因素（天干地支组合、五行生克）
    2. 真话：直接指出"空亡"、"击刑"、"旬空"等风险，有破财风险必须直说
    3. 建议：给出具体的行动建议（如方位、时间、注意事项）

    重要：
    - 不要盲目乐观
    - 如果时机不好，明确告知风险等级
    - 建议必须具体，不要说"谨慎投资"这种空话
  `;

  const userPrompt = `
    用户信息：
    - 姓名：${userData.userName}
    - 求财类型：${requestType}
    - 具体问题：${userData.customRequest || '无'}

    当前时间干支：
    - 年柱：${currentGanzhi.year}
    - 月柱：${currentGanzhi.month}
    - 日柱：${currentGanzhi.day}
    - 时柱：${currentGanzhi.hour}

    任务：
    请根据以上干支时间，使用奇门遁甲或八字分析方法，分析该用户目前的财运情况。

    输出 JSON 格式：
    {
      "title": "标题（如：张先生投资财运分析）",
      "analysis": {
        "positive": "肯定：目前有利的因素（如财星得位、日主身强等）",
        "negative": "真话：直接指出风险（如空亡、比劫夺财、财星受克等）",
        "advice": "建议：具体行动建议（如宜东方、午时行动、避开寅日等）"
      },
      "auspiciousDirection": "吉方（如：东方）",
      "auspiciousTime": "吉时（如：午时 11:00-13:00）",
      "riskLevel": "风险等级：low/medium/high"
    }

    要求：
    1. positive 部分要具体说明有利因素
    2. negative 部分要直话直说，不要委婉
    3. advice 部分要给出可执行的建议
    4. riskLevel 基于真实分析判断
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
      currentGanzhi,
      analysis: aiResult.analysis,
      auspiciousDirection: aiResult.auspiciousDirection,
      auspiciousTime: aiResult.auspiciousTime,
      riskLevel: aiResult.riskLevel || 'medium'
    };

  } catch (error) {
    console.error("Money fortune generation error:", error);
    throw new Error("Unable to generate money fortune at this moment. Please try again later.");
  }
};
