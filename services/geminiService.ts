import { GoogleGenAI, Type } from '@google/genai';
import { UserData, FortuneResult } from '../types';
import { analyzeDestiny } from '../utils/lunarHelper';

export const generateFortune = async (userData: UserData): Promise<FortuneResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found. Please ensure process.env.API_KEY is available.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 1. Get Hard Data from Lunar Algorithm
  const lunarData = analyzeDestiny(userData);

  // 2. Construct Prompt
  const prompt = `
    Role: You are a highly respected Taoist Master (道长) proficient in BaZi (Four Pillars) and Zi Wei Dou Shu.
    Task: Interpret the destiny for the 'Benefactor' (User) based on the provided astrological data.
    Tone: Mystical, archaic Chinese simplified (半文半白), authoritative yet benevolent. Use terms like "贫道", "施主", "此乃", "天机".

    [User Data]
    Name: ${userData.userName}
    BaZi (Year/Month/Day/Time): ${lunarData.userBaZi.year} / ${lunarData.userBaZi.month} / ${lunarData.userBaZi.day} / ${lunarData.userBaZi.time}
    Zodiac: ${lunarData.userBaZi.animal}
    Day Master Element: ${lunarData.userBaZi.dayElement}

    [Target Prediction Scope: ${userData.scope}]
    Target Date info: ${JSON.stringify(lunarData.targetInfo)}
    Calculated Conflict: ${lunarData.conflictStatus}
    Focus Categories: ${userData.categories.join(', ')}

    Instructions:
    1. Analyze the interaction between the User's Day Master and the Target's Element (WuXing).
    2. Consider the 'Yi' (Dos) and 'Ji' (Don'ts) provided.
    3. Generate a JSON response. 
    
    Response Structure:
    - title: A poetic title for the prediction (e.g. "甲辰年·龙腾四海之象").
    - summary: A 2-sentence verdict in cryptic but inspiring style.
    - scores: An array for the user's selected categories. Give a score (0-100) and a short Daoist comment.
    - luckyGuide: Specific advice on color, direction (e.g. South-East), and a number (1-9).
    - advice: A longer paragraph of guidance, offering a philosophical solution to any bad omens.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            scores: { 
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  comment: { type: Type.STRING }
                }
              }
            },
            luckyGuide: {
              type: Type.OBJECT,
              properties: {
                color: { type: Type.STRING },
                direction: { type: Type.STRING },
                number: { type: Type.STRING }
              }
            },
            advice: { type: Type.STRING },
          },
          required: ['title', 'summary', 'scores', 'luckyGuide', 'advice']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("The heavens are cloudy (No response).");
    return JSON.parse(text) as FortuneResult;

  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Connection to the Tao interrupted.");
  }
};