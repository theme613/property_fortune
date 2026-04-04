'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserInput, Language, getMatchedProperty, generateHardcodedFortuneText, FortuneResult } from '@/lib/fortuneLogic';

export async function generateDynamicFortune(input: UserInput, language: Language): Promise<FortuneResult> {
  const property = getMatchedProperty(input, language);
  
  const API_KEY = process.env.GEMINI_API_KEY;
  
  // Fallback if API key is missing
  if (!API_KEY) {
    console.warn("GEMINI_API_KEY is missing. Falling back to hardcoded fortune.");
    return {
      fortune: generateHardcodedFortuneText(input, language),
      propertyTitle: property.title,
      propertyDescription: property.desc
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const zodiacMap: Record<string, string> = {
      Aries: '白羊座', Taurus: '金牛座', Gemini: '双子座', Cancer: '巨蟹座',
      Leo: '狮子座', Virgo: '处女座', Libra: '天秤座', Scorpio: '天蝎座',
      Sagittarius: '射手座', Capricorn: '摩羯座', Aquarius: '水瓶座', Pisces: '双鱼座'
    };

    const prompt = language === 'zh' 
      ? `你是一个顶级的星象房地产预测师。用户的星座是“${zodiacMap[input.zodiac]}”（具有该星座的典型性格和星象元素），出生于“${input.birthDate}”，职业是“${input.occupation}”。
         他们与房产“${property.title}”完美匹配。该房产的特征是：${property.desc}。
         请用2至3句话，写出一段充满赞美、且高度针对性的星象风水预测（中文）。你必须做到以下两点：
         1. 解释他们作为“${zodiacMap[input.zodiac]}”的内在性格特质，为什么天生就需要这套房产的独特空间设计或环境氛围。
         2. 强烈赞美他们的职业“${input.occupation}”并说明这套房产能如何成为他们扩展事业版图的完美根据地。
         把星象性格、职业特性与房产的各项优势完美合理地结合起来。直接输出预测结果，无须问候，不加任何前缀或引号。`
      : `You are an elite astrological real estate fortune teller. The user is a ${input.zodiac} born on ${input.birthDate}, working as a/an ${input.occupation}. 
         They have been matched with the property: "${property.title}". Property features: ${property.desc}. 
         Write a 2-3 sentence personalized, highly flattering, mystical fortune. You MUST accomplish two things:
         1. Explain specifically why their psychological personality traits and aura as a ${input.zodiac} perfectly require the unique physical/architectural features of this house. 
         2. Flatter their career and explain how this specific property empowers their success as a/an ${input.occupation}.
         Logically fuse their Zodiac personality, their career status, and the specific house details into one creative pitch. Return ONLY the fortune text itself, without prefixes or quotes.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      fortune: text.trim().replace(/^"/, '').replace(/"$/, ''), // clean any accidental quotes
      propertyTitle: property.title,
      propertyDescription: property.desc
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Silent Fallback if API fails (e.g. rate limit, bad network)
    return {
        fortune: generateHardcodedFortuneText(input, language),
        propertyTitle: property.title,
        propertyDescription: property.desc
    };
  }
}
