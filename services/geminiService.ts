import { GoogleGenAI, Type } from '@google/genai';
import { UserData, FortuneResult } from '../types';
import { analyzeDestiny } from '../utils/lunarHelper';

export const generateFortune = async (userData: UserData): Promise<FortuneResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const lunarData = analyzeDestiny(userData);
  const today = new Date().toISOString().split('T')[0];

  const prompt = `
    Role: You are an expert Feng Shui and BaZi Date Selection Master (择日师).
    User Name: ${userData.userName}
    User BaZi: ${lunarData.userBaZi.year} Year / ${lunarData.userBaZi.month} Month / ${lunarData.userBaZi.day} Day / ${lunarData.userBaZi.time} Hour.
    User Zodiac: ${lunarData.userBaZi.animal}
    User Day Master: ${lunarData.userBaZi.dayElement}
    
    User's Request (Goal): "${userData.request}"
    Current Date: ${today}

    TASK:
    Find exactly 5 auspicious dates for the User's Goal starting from tomorrow (${today}).
    You MUST strictly follow this distribution:
    1. [Immediate] Find 1 date within the next 7 days.
    2. [Short-term] Find 2 dates between 7 days from now and 30 days from now.
    3. [Long-term] Find 2 dates between 1 month from now and 6 months from now.

    LOGIC REQUIREMENTS FOR SELECTION:
    - The date must be suitable for the requested activity (check 'Yi' 宜).
    - The date should NOT clash (Chong 冲) with the user's Zodiac (${lunarData.userBaZi.animal}).
    - Ideally, look for 'San He' (Three Harmony) or 'Liu He' (Six Harmony) days with the user.
    - Mention specific Shen Sha (Gods/Sha) if applicable (e.g. 天德, 月德, 天医).
    
    TONE:
    - Use clear, persuasive, colloquial Chinese (通俗易懂).
    - Explain *why* this date is chosen (The "Reason" field).
    
    OUTPUT JSON FORMAT:
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
            title: { type: Type.STRING, description: "E.g. '张先生搬家择吉方案'" },
            summary: { type: Type.STRING, description: "A brief analysis of the user's BaZi suitability for this event." },
            advice: { type: Type.STRING, description: "Preparation advice for the event." },
            dates: {
              type: Type.OBJECT,
              properties: {
                immediate: {
                  type: Type.ARRAY,
                  items: {
                     type: Type.OBJECT,
                     properties: {
                        date: { type: Type.STRING, description: "YYYY-MM-DD" },
                        weekDay: { type: Type.STRING, description: "e.g. 周五" },
                        lunarDate: { type: Type.STRING, description: "e.g. 四月初八" },
                        reason: { type: Type.STRING, description: "Convincing reason why this date is good for the user." },
                        energyScore: { type: Type.NUMBER },
                        tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                     }
                  }
                },
                shortTerm: {
                  type: Type.ARRAY,
                  items: {
                     type: Type.OBJECT,
                     properties: {
                        date: { type: Type.STRING },
                        weekDay: { type: Type.STRING },
                        lunarDate: { type: Type.STRING },
                        reason: { type: Type.STRING },
                        energyScore: { type: Type.NUMBER },
                        tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                     }
                  }
                },
                longTerm: {
                  type: Type.ARRAY,
                  items: {
                     type: Type.OBJECT,
                     properties: {
                        date: { type: Type.STRING },
                        weekDay: { type: Type.STRING },
                        lunarDate: { type: Type.STRING },
                        reason: { type: Type.STRING },
                        energyScore: { type: Type.NUMBER },
                        tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                     }
                  }
                }
              },
              required: ['immediate', 'shortTerm', 'longTerm']
            }
          },
          required: ['title', 'summary', 'dates', 'advice']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response.");
    return JSON.parse(text) as FortuneResult;

  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Unable to calculate dates at this moment.");
  }
};