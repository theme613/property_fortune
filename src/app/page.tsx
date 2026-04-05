'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserInput, FortuneResult, ZodiacSign, Language, Region, getMatchedProperty } from '@/lib/fortuneLogic';
import { generateDynamicFortune } from './actions';
import FortuneResultCard from '@/components/FortuneResultCard';
import { Building2, Compass, Briefcase, Calendar, Key, Sun, Moon, Music, Music2, Globe, MapPin, TrendingUp } from 'lucide-react';

const ZODIACS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 
  'Leo', 'Virgo', 'Libra', 'Scorpio', 
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const REGIONS: { value: Region; en: string; zh: string }[] = [
  { value: 'any', en: 'Anywhere (Let the Stars Decide)', zh: '听从星辰的安排 (全马任意地点)' },
  { value: 'kuala_lumpur', en: 'Kuala Lumpur', zh: '吉隆坡' },
  { value: 'selangor', en: 'Selangor', zh: '雪兰莪' },
  { value: 'johor', en: 'Johor', zh: '柔佛' },
  { value: 'penang', en: 'Penang', zh: '槟城' },
  { value: 'perak', en: 'Perak', zh: '霹雳州' },
  { value: 'negeri_sembilan', en: 'Negeri Sembilan', zh: '森美兰' },
  { value: 'pahang', en: 'Pahang', zh: '彭亨' },
  { value: 'kelantan', en: 'Kelantan', zh: '吉兰丹' },
  { value: 'terengganu', en: 'Terengganu', zh: '登嘉楼' },
  { value: 'sabah', en: 'Sabah', zh: '沙巴州' },
  { value: 'sarawak', en: 'Sarawak', zh: '砂拉越' },
];

const INCOME_RANGES = [
  { value: 'below_3k',  en: 'Below RM 3,000 / month',        zh: '月收入低于 RM 3,000' },
  { value: '3k_5k',    en: 'RM 3,000 – RM 5,000 / month',   zh: '月收入 RM 3,000 – RM 5,000' },
  { value: '5k_8k',    en: 'RM 5,000 – RM 8,000 / month',   zh: '月收入 RM 5,000 – RM 8,000' },
  { value: '8k_12k',   en: 'RM 8,000 – RM 12,000 / month',  zh: '月收入 RM 8,000 – RM 12,000' },
  { value: '12k_20k',  en: 'RM 12,000 – RM 20,000 / month', zh: '月收入 RM 12,000 – RM 20,000' },
  { value: 'above_20k',en: 'Above RM 20,000 / month',       zh: '月收入高于 RM 20,000' },
];

const DICT = {
  en: {
    title: 'Property Destiny',
    subtitle: 'Exclusive Real Estate Matchmaking',
    zodiacLbl: 'Astrological Sign',
    dobLbl: 'Date of Birth',
    profLbl: 'Profession',
    profPlc: 'e.g. Entrepreneur, Engineer, Investor',
    incomeLbl: 'Monthly Income',
    regionLbl: 'Preferred Location',
    btnSearch: 'Discover Your Property',
    load1: 'Consulting the Oracle...',
    load2: 'Analyzing market alignment...',
    load3: 'Securing your perfect investment...',
    loadWait: 'Matching your profile...',
    dayLabel: 'Day',
    yearLabel: 'Year'
  },
  zh: {
    title: '房产之耀',
    subtitle: '尊享房地产精准匹配',
    zodiacLbl: '您的星座',
    dobLbl: '出生日期',
    profLbl: '职业领域',
    profPlc: '例如：企业家、工程师、投资人',
    incomeLbl: '每月收入',
    regionLbl: '期望区域与州属',
    btnSearch: '洞悉您的专属产业',
    load1: '正在连接星象神谕...',
    load2: '正在分析市场契合度...',
    load3: '正在为您锁定完美的投资...',
    loadWait: '正在为您匹配专属档案...',
    dayLabel: '日',
    yearLabel: '年'
  }
};

const ZODIAC_ZH: Record<ZodiacSign, string> = {
  Aries: '白羊座', Taurus: '金牛座', Gemini: '双子座', Cancer: '巨蟹座',
  Leo: '狮子座', Virgo: '处女座', Libra: '天秤座', Scorpio: '天蝎座',
  Sagittarius: '射手座', Capricorn: '摩羯座', Aquarius: '水瓶座', Pisces: '双鱼座'
};

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_ZH = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 18 - i); 

const staggerContainer: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  exit: { opacity: 0, scale: 0.98, filter: 'blur(5px)', transition: { duration: 0.4 } }
};

const slideUpItem: any = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 20 } }
};

const topBarContainer: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
};

const dropDownItem: any = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
};

export default function Home() {
  const [formData, setFormData] = useState<UserInput>({
    zodiac: 'Aries',
    birthDate: '', 
    occupation: '',
    preferredArea: 'any',
    monthlyIncome: '5k_8k'
  });

  const [bDay, setBDay] = useState('1');
  const [bMonth, setBMonth] = useState('1');
  const [bYear, setBYear] = useState('1990');

  const [isConsulting, setIsConsulting] = useState(false);
  const [result, setResult] = useState<FortuneResult | null>(null);
  
  const [isLightMode, setIsLightMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initialAutoplayAttempted = useRef(false);

  const t = DICT[language];
  const [loadingText, setLoadingText] = useState(t.loadWait);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    if (mediaQuery.matches) setIsLightMode(true);
    
    if (navigator.language && navigator.language.toLowerCase().startsWith('zh')) {
      setLanguage('zh');
    }

    const listener = (e: MediaQueryListEvent) => setIsLightMode(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (isLightMode) document.body.classList.add('light');
    else document.body.classList.remove('light');
  }, [isLightMode]);

  useEffect(() => {
    if (initialAutoplayAttempted.current) return;
    initialAutoplayAttempted.current = true;

    const tryAutoPlay = async () => {
      if (!audioRef.current) return;
      if (!audioRef.current.getAttribute('src')) {
        audioRef.current.setAttribute('src', '/crooked.mp3');
      }
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {}
    };

    tryAutoPlay();

    const handleFirstInteraction = async () => {
      if (!audioRef.current) return;
      if (audioRef.current.paused) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch(e) {}
      }
      document.removeEventListener('mousedown', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('mousedown', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    return () => {
      document.removeEventListener('mousedown', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const toggleLevelOption = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  }

  const toggleAudio = async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!audioRef.current.getAttribute('src')) {
          audioRef.current.setAttribute('src', '/crooked.mp3');
        }
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      alert(language === 'zh' ? "音频文件丢失。请确认您已放入 crooked.mp3" : "Audio track disabled. Please ensure crooked.mp3 exists in public/");
      setIsPlaying(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.occupation) return;
    
    setIsConsulting(true);
    
    const formattedDOB = `${bYear}-${bMonth.toString().padStart(2, '0')}-${bDay.toString().padStart(2, '0')}`;
    const submissionData = { ...formData, birthDate: formattedDOB };

    // Fire off the Gemini API Request simultaneously
    const apiPromise = generateDynamicFortune(submissionData, language);

    setTimeout(() => setLoadingText(t.load1), 700);
    setTimeout(() => setLoadingText(t.load2), 1500);
    setTimeout(() => setLoadingText(t.load3), 2600);
    
    // Minimum UI display period for the amazing loading sequence (3.6 seconds)
    const timerPromise = new Promise(resolve => setTimeout(resolve, 3600));

    try {
      // Promise.all waits until BOTH the 3.6s animation finishes AND the Gemini request completes.
      const [gResult] = await Promise.all([apiPromise, timerPromise]);
      setResult(gResult);
    } catch (e) {
      console.error("Failed to generate fortune", e);
    }

    setIsConsulting(false);
    setLoadingText(t.loadWait); 
  };

  const selectStyles: React.CSSProperties = {
    background: 'var(--input-bg)', border: '1px solid var(--glass-border)', color: 'var(--foreground)',
    padding: '0.9rem', borderRadius: '4px', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease',
    flex: 1
  };

  const applyFocus = (e: React.FocusEvent<HTMLSelectElement | HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--primary)';
    e.target.style.boxShadow = '0 0 10px var(--primary-glow)';
  };

  const removeFocus = (e: React.FocusEvent<HTMLSelectElement | HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--glass-border)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative',
      padding: '5.5rem 1rem 3rem 1rem' 
    }}>
      
      <audio ref={audioRef} loop />

      {/* Top Navigation / Toggles */}
      <motion.div 
        variants={topBarContainer}
        initial="hidden"
        animate="show"
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.8rem', zIndex: 50 }}
      >
        <motion.button 
          variants={dropDownItem}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleLevelOption}
          style={{
            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--primary)',
            padding: '0.5rem 1rem', borderRadius: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
            backdropFilter: 'blur(10px)', transition: 'background 0.2s ease, border-color 0.2s ease', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600
          }}
        >
          <Globe size={18} /> {language === 'en' ? 'EN' : '中文'}
        </motion.button>

        <motion.button 
          variants={dropDownItem}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleAudio}
          style={{
            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--primary)',
            padding: '0.6rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)', transition: 'background 0.2s ease, border-color 0.2s ease'
          }}
        >
          {isPlaying ? <Music size={20} /> : <Music2 size={20} opacity={0.5} />}
        </motion.button>

        <motion.button 
          variants={dropDownItem}
          whileHover={{ scale: 1.1, rotate: -15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLightMode(!isLightMode)}
          style={{
            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--primary)',
            padding: '0.6rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)', transition: 'background 0.2s ease, border-color 0.2s ease'
          }}
        >
          <motion.div animate={{ rotate: isLightMode ? 180 : 0 }}>
            {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
          </motion.div>
        </motion.button>
      </motion.div>

      {/* PERFECT CENTERING WRAPPER */}
      <div style={{ margin: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {!isConsulting && !result && (
            <motion.div
              key="form"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              exit="exit"
              className="glass-panel"
              style={{ padding: '3.5rem', maxWidth: '540px', width: '100%', position: 'relative', zIndex: 10 }}
            >
              <motion.div variants={slideUpItem} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Building2 size={42} color="var(--primary)" strokeWidth={1.5} style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' }} />
                </motion.div>
                <h1 className="text-gradient" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', marginBottom: '0.5rem', letterSpacing: '1px' }}>
                  {t.title}
                </h1>
                <p style={{ opacity: 0.8, fontSize: '0.95rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t.subtitle}</p>
              </motion.div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                
                <motion.div variants={slideUpItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <Compass size={16} /> {t.zodiacLbl}
                  </label>
                  <select 
                    name="zodiac"
                    value={formData.zodiac}
                    onChange={handleChange}
                    required
                    style={selectStyles}
                    onFocus={applyFocus}
                    onBlur={removeFocus}
                  >
                    {ZODIACS.map(z => (
                       <option key={z} value={z}>{language === 'zh' ? ZODIAC_ZH[z] : z}</option>
                    ))}
                  </select>
                </motion.div>

                <motion.div variants={slideUpItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <Calendar size={16} /> {t.dobLbl}
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select value={bDay} onChange={e => setBDay(e.target.value)} style={selectStyles} onFocus={applyFocus} onBlur={removeFocus}>
                      <option value="" disabled>{t.dayLabel}</option>
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={bMonth} onChange={e => setBMonth(e.target.value)} style={selectStyles} onFocus={applyFocus} onBlur={removeFocus}>
                      {language === 'zh' 
                        ? MONTHS_ZH.map((m, i) => <option key={i} value={i+1}>{m}</option>)
                        : MONTHS_EN.map((m, i) => <option key={i} value={i+1}>{m}</option>)
                      }
                    </select>
                    <select value={bYear} onChange={e => setBYear(e.target.value)} style={selectStyles} onFocus={applyFocus} onBlur={removeFocus}>
                      <option value="" disabled>{t.yearLabel}</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </motion.div>

                <motion.div variants={slideUpItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <Briefcase size={16} /> {t.profLbl}
                  </label>
                  <input 
                    type="text"
                    name="occupation"
                    placeholder={t.profPlc}
                    value={formData.occupation}
                    onChange={handleChange}
                    required
                    style={selectStyles}
                    onFocus={applyFocus}
                    onBlur={removeFocus}
                  />
                </motion.div>

                <motion.div variants={slideUpItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <TrendingUp size={16} /> {t.incomeLbl}
                  </label>
                  <select 
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    required
                    style={selectStyles}
                    onFocus={applyFocus}
                    onBlur={removeFocus}
                  >
                    {INCOME_RANGES.map(r => (
                       <option key={r.value} value={r.value}>{language === 'zh' ? r.zh : r.en}</option>
                    ))}
                  </select>
                </motion.div>

                <motion.div variants={slideUpItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <MapPin size={16} /> {t.regionLbl}
                  </label>
                  <select 
                    name="preferredArea"
                    value={formData.preferredArea}
                    onChange={handleChange}
                    required
                    style={selectStyles}
                    onFocus={applyFocus}
                    onBlur={removeFocus}
                  >
                    {REGIONS.map(reg => (
                       <option key={reg.value} value={reg.value}>{language === 'zh' ? reg.zh : reg.en}</option>
                    ))}
                  </select>
                </motion.div>

                <motion.div variants={slideUpItem}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    style={{
                      background: 'var(--primary)', color: 'var(--btn-text)', border: 'none', padding: '1.2rem',
                      borderRadius: '4px', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px',
                      cursor: 'pointer', marginTop: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '0.5rem', width: '100%', transition: 'background 0.3s ease, box-shadow 0.3s ease',
                      boxShadow: '0 4px 15px var(--primary-glow)'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--secondary)'; e.currentTarget.style.boxShadow = '0 8px 25px var(--primary-glow)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 4px 15px var(--primary-glow)'; }}
                  >
                    <Key size={18} /> {t.btnSearch}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          )}

          {isConsulting && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center', zIndex: 10 }}
            >
              <motion.div 
                animate={{ rotateY: 180, scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{ display: 'inline-block', marginBottom: '2.5rem' }}
              >
                <Building2 size={70} color="var(--primary)" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 15px var(--primary-glow))' }} />
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.h2 
                  key={loadingText}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', color: 'var(--foreground)', letterSpacing: '1px', fontWeight: 500 }}
                >
                  {loadingText}
                </motion.h2>
              </AnimatePresence>
            </motion.div>
          )}

          {result && !isConsulting && (
            <motion.div key="result" style={{ width: '100%', zIndex: 10 }}>
              <FortuneResultCard result={result} language={language} onReset={() => setResult(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
