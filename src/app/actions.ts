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

    const incomeLabel: Record<string, string> = {
      below_3k:  language === 'zh' ? '月收入低于RM3,000' : 'below RM 3,000/month',
      '3k_5k':   language === 'zh' ? '月收入RM3,000-5,000' : 'RM 3,000–5,000/month',
      '5k_8k':   language === 'zh' ? '月收入RM5,000-8,000' : 'RM 5,000–8,000/month',
      '8k_12k':  language === 'zh' ? '月收入RM8,000-12,000' : 'RM 8,000–12,000/month',
      '12k_20k': language === 'zh' ? '月收入RM12,000-20,000' : 'RM 12,000–20,000/month',
      above_20k: language === 'zh' ? '月收入高于RM20,000' : 'above RM 20,000/month',
    };
    const income = incomeLabel[input.monthlyIncome] || input.monthlyIncome;

    const prompt = language === 'zh'
      ? `你是一个顶级的星象房地产预测师。用户星座"${zodiacMap[input.zodiac]}"，出生于"${input.birthDate}"，职业"${input.occupation}"，${income}。
         完美匹配房产："${property.title}"。特征：${property.desc}。
         请用2至3句话写出高度针对性的星象预测（中文）：
         1. 解释其${zodiacMap[input.zodiac]}性格特质与该房产空间设计的天然契合。
         2. 赞美其职业并说明此房产如何助其事业腾飞。
         3. 称赞其以${income}的经济实力，能将此优质资产纳入囊中，是宇宙赋予的财富智慧。
         直接输出预测，无前缀无引号。`
      : `You are an elite astrological real estate fortune teller. The user is a ${input.zodiac} born on ${input.birthDate}, working as a/an ${input.occupation}, earning ${income}. 
         Matched property: "${property.title}". Features: ${property.desc}. 
         Write 2-3 sentences of highly personalized, flattering, mystical fortune:
         1. Explain why their ${input.zodiac} personality traits demand this property's specific features.
         2. Flatter their career and how this property powers their success.
         3. Praise their income level (${income}) as a sign of cosmic abundance — affirm that securing this property is a spiritually and financially aligned power move.
         Fuse Zodiac, career, income, and property into one compelling pitch. Return ONLY the fortune text, no prefixes or quotes.`;

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
