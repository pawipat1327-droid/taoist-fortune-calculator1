import { UserData, FortuneResult } from '../types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface DeepSeekRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
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
  messages: Array<{ role: string; content: string }>,
  temperature = 0.8
): Promise<DeepSeekResponse> => {
  const body: DeepSeekRequest = {
    model: 'deepseek-chat',
    messages,
    stream: false,
    temperature
  };

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

export const startMasterChat = async (userData: UserData, fortuneResult: FortuneResult): Promise<ChatMessage> => {
  const consolidatedRequest = [
    ...(userData.tags || []),
    userData.request
  ].filter(Boolean).join(' ');

  // Build context message with user's information and results (hidden from user)
  const contextMessage = `
    === HIDDEN CONTEXT (FOR AI USE ONLY) ===
    User Information:
    - Name: ${userData.userName}
    - Birth Date & Time: ${userData.birthDate} ${userData.birthHour}
    - Request: "${consolidatedRequest}"

    Fortune Analysis Results:
    - Title: ${fortuneResult.title}
    - Summary: ${fortuneResult.summary}

    Top Recommended Dates:
    ${[...fortuneResult.dates.immediate, ...fortuneResult.dates.shortTerm, ...fortuneResult.dates.longTerm].map((d, i) => `
    Date ${i + 1}: ${d.date} (${d.weekDay})
    - Lunar: ${d.lunarDate}
    - Score: ${d.energyScore}
    - Type: ${d.type}
    - Best Time: ${d.bestTime}
    - Direction: ${d.direction}
    - Reason: ${d.reason}
    - Taboo: ${d.taboo}
    `).join('\n')}

    Advice: ${fortuneResult.advice}
    === END HIDDEN CONTEXT ===

    IMPORTANT: Use the above context to understand the user's situation, but DO NOT repeat or reference this information in your visible response.
  `;

  const systemPrompt = `
    Role: You are a compassionate and wise Taoist Fortune Master (道长大师) who specializes in BaZi and Feng Shui.

    TONE & STYLE:
    - **Warm & Empathetic**: Speak like an elderly master who genuinely cares about the user's well-being.
    - **Proactive & Observant**: Based on the user's fortune results, notice subtle patterns and ask insightful questions.
    - **Natural & Conversational**: Use "您" (respectful 'you'), avoid robotic or repetitive phrases.
    - **Not a Fortune Teller**: You are a guide and advisor, not predicting the future but helping users understand their situation.

    CORE BEHAVIOR:
    1. **First Message ONLY**: Start with a thoughtful, empathetic opening that:
       - Acknowledges the user's situation ( WITHOUT repeating their details)
       - Observes something interesting from their fortune analysis
       - Asks ONE guiding question to help them reflect deeper
    2. **Subsequent Messages**: Answer the user's questions while:
       - Connecting back to their specific BaZi/fate patterns
       - Offering practical, actionable advice
       - Being honest if a question goes beyond what the fortune reveals
    3. **Conciseness**: Keep responses focused (150-250 words). Users have limited questions.

    EXAMPLE OPENING QUESTIONS (Adapt based on context):
    - "我看卦象中显示火元素偏旺，除了求财，您最近是否也容易心浮气躁？"
    - "您命中有金木相争的格局，在事业抉择上是否感到进退两难？"
    - "从您的生辰来看，本年贵人运势颇佳，除了正事，不妨多结交良友。"

    IMPORTANT:
    - Do NOT repeat the user's birth date, name, or request details.
    - Focus on insights and guidance.
    - Make each message valuable and personalized.
  `;

  const userPrompt = `
    Context: ${contextMessage}

    Please start the conversation with your first message. Based on the user's fortune analysis, observe something interesting and ask ONE thoughtful question to begin the dialogue.

    Output ONLY your message content (no JSON, no markdown formatting).
  `;

  try {
    const deepSeekResponse = await callDeepSeekAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    const content = deepSeekResponse.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from DeepSeek');
    }

    const chatMessage: ChatMessage = {
      role: 'assistant',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    return chatMessage;

  } catch (error) {
    console.error("Master Chat Service Error:", error);
    throw new Error("大师暂时无法回应，请稍后再试。");
  }
};

export const continueMasterChat = async (
  messages: ChatMessage[],
  userData: UserData,
  fortuneResult: FortuneResult
): Promise<ChatMessage> => {
  const consolidatedRequest = [
    ...(userData.tags || []),
    userData.request
  ].filter(Boolean).join(' ');

  // Build context message (hidden from user)
  const contextMessage = `
    === HIDDEN CONTEXT (FOR AI USE ONLY) ===
    User Information:
    - Name: ${userData.userName}
    - Birth Date & Time: ${userData.birthDate} ${userData.birthHour}
    - Request: "${consolidatedRequest}"

    Fortune Analysis Results:
    - Title: ${fortuneResult.title}
    - Summary: ${fortuneResult.summary}
    - Dates Count: ${fortuneResult.dates.immediate.length + fortuneResult.dates.shortTerm.length + fortuneResult.dates.longTerm.length}
    - Advice: ${fortuneResult.advice}
    === END HIDDEN CONTEXT ===

    IMPORTANT: Use the above context to understand the user's situation, but DO NOT repeat or reference this information in your visible response.
  `;

  const systemPrompt = `
    Role: You are a compassionate and wise Taoist Fortune Master (道长大师) who specializes in BaZi and Feng Shui.

    TONE & STYLE:
    - **Warm & Empathetic**: Speak like an elderly master who genuinely cares about the user's well-being.
    - **Insightful**: Answer questions while connecting to the user's specific fate patterns.
    - **Natural & Conversational**: Use "您" (respectful 'you'), avoid robotic or repetitive phrases.
    - **Concise**: Keep responses focused (150-250 words). Users have limited questions.

    CORE BEHAVIOR:
    1. Answer the user's question thoughtfully.
    2. Connect insights to their specific BaZi/fate patterns when relevant.
    3. Offer practical, actionable advice.
    4. If a question goes beyond what the fortune reveals, be honest about it.
    5. End with a gentle follow-up if appropriate.

    IMPORTANT:
    - Do NOT repeat the user's birth date, name, or request details.
    - Focus on insights and guidance.
    - Make each message valuable and personalized.
  `;

  const conversationHistory = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');

  try {
    const deepSeekResponse = await callDeepSeekAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Context:\n\n${conversationHistory}` }
    ]);

    const content = deepSeekResponse.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from DeepSeek');
    }

    const chatMessage: ChatMessage = {
      role: 'assistant',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    return chatMessage;

  } catch (error) {
    console.error("Master Chat Service Error:", error);
    throw new Error("大师暂时无法回应，请稍后再试。");
  }
};
