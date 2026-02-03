import { DreamUserData, DreamResult } from '../types';

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
 * Generate dream interpretation using DeepSeek
 * Dual-layer analysis: Folk (周公解梦) + Psychology (Freud/Jung)
 */
export const generateDreamFortune = async (userData: DreamUserData): Promise<DreamResult> => {
  const systemPrompt = `
    Role: 你是一个解梦专家，精通周公解梦和西方心理学（弗洛伊德、荣格）。

    核心能力：
    1. **周公解梦（民俗层）**：提取梦中意象，查阅传统解梦知识，判断吉凶
    2. **心理分析（科学层）**：用弗洛伊德（潜意识欲望）或荣格（集体潜意识、原型）的视角分析

    分析原则：
    - 民俗层：直接告诉用户主吉还是主凶，不要模棱两可
    - 科学层：深入分析梦反映了什么心理状态（焦虑、欲望、冲突等）
    - 结合层：给出一句话的启示，让用户既能了解传统说法，也能认识自己的内心

    重要：
    - 避免迷信恐慌，用理性温和的方式表达
    - 心理分析要基于梦境内容，不要泛泛而谈
    - 如果是噩梦，要给出安抚性的解释
  `;

  const userPrompt = `
    用户信息：
    - 姓名：${userData.userName}
    - 梦境描述：${userData.dreamDescription}

    任务：
    请对用户的梦境进行双重解码，包括周公解梦（民俗层）和心理分析（科学层）。

    输出 JSON 格式：
    {
      "title": "梦境分析标题（如：张先生的蛇梦解析）",
      "dreamSummary": "用一句话概括这个梦的主要内容",
      "folkInterpretation": {
        "symbols": ["提取的关键意象", "如：蛇", "水"],
        "prediction": "周公解梦的解释（主吉/主凶及原因）",
        "auspiciousLevel": "auspicious/neutral/inauspicious"
      },
      "psychologicalAnalysis": {
        "perspective": "freudian/jungian/integrated（选择最合适的分析视角）",
        "analysis": "详细的心理分析，解释这个梦反映了用户潜意识里的什么焦虑、欲望或冲突",
        "keyInsights": ["关键洞察1", "关键洞察2", "关键洞察3"]
      },
      "summary": "用一句话总结这个梦的启示（结合民俗和心理两层含义）"
    }

    要求：
    1. folkInterpretation.prediction 要明确说明吉凶
    2. psychologicalAnalysis.analysis 要深入且具体，不要泛泛而谈
    3. summary 要简洁有力，给用户实际启发
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
      dreamSummary: aiResult.dreamSummary,
      folkInterpretation: aiResult.folkInterpretation,
      psychologicalAnalysis: aiResult.psychologicalAnalysis,
      summary: aiResult.summary
    };

  } catch (error) {
    console.error("Dream interpretation error:", error);
    throw new Error("Unable to interpret dream at this moment. Please try again later.");
  }
};
