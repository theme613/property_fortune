'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ChevronLeft, MessageCircle } from 'lucide-react';
import { FortuneResult, Language } from '@/lib/fortuneLogic';

interface Props {
  result: FortuneResult;
  language: Language;
  onReset: () => void;
}

// Elegant Staggered Card Elements
const resultContainer: any = {
  hidden: { opacity: 0, scale: 0.98, y: 20 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { staggerChildren: 0.2, delayChildren: 0.1, duration: 0.6, ease: "easeOut" } 
  }
};

const slideUpTxt: any = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function FortuneResultCard({ result, language, onReset }: Props) {
  const isZh = language === 'zh';
  
  // WhatsApp Message Generation
  const waNumber = "60178483620";
  const waMessage = isZh 
    ? `你好！我在房产之耀(Property Destiny)上匹配到了 ${result.propertyTitle}。可以给我更多详情吗？` 
    : `Hello! I just got matched with ${result.propertyTitle} on Property Destiny. Can you give me more information?`;
  
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <motion.div
      variants={resultContainer}
      initial="hidden"
      animate="show"
      className="glass-panel"
      style={{
        padding: '3.5rem',
        maxWidth: '700px',
        width: '100%',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        <motion.div variants={slideUpTxt}>
          <div style={{ display: 'inline-block', borderBottom: '1px solid var(--primary)', paddingBottom: '0.6rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '4px', color: 'var(--primary)', margin: 0 }}>
              {isZh ? '您的专属宏图' : 'Your Architectural Match'}
            </h2>
          </div>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8, opacity: 0.9, fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--foreground)' }}>
            "{result.fortune}"
          </p>
        </motion.div>

        <motion.div
          variants={slideUpTxt}
          whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(0,0,0,0.15)" }}
          style={{
            background: 'var(--accent)',
            borderRadius: '6px',
            padding: '3rem 2.5rem',
            border: '1px solid var(--glass-border)',
            position: 'relative',
            transition: 'all 0.4s ease'
          }}
        >
          <div style={{ position: 'absolute', top: '-1.8rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ background: 'var(--background)', padding: '0.8rem', borderRadius: '50%', color: 'var(--primary)', border: '1px solid var(--glass-border)', boxShadow: '0 4px 15px var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Building2 size={35} strokeWidth={1.5} />
            </motion.div>
          </div>
          
          <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--secondary)', fontFamily: 'var(--font-serif)', marginTop: '0.5rem' }}>
            {result.propertyTitle}
          </h3>
          <p style={{ opacity: 0.85, lineHeight: 1.7, fontSize: '1rem', color: 'var(--foreground)' }}>
            {result.propertyDescription}
          </p>
        </motion.div>

        <motion.div variants={slideUpTxt} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
          
          {/* WhatsApp CTA Button */}
          <motion.a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, backgroundColor: "#20b858" }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: '#25D366', // Official WhatsApp Green
              color: '#ffffff',
              border: 'none',
              padding: '1rem 2.5rem',
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              borderRadius: '30px',
              textDecoration: 'none',
              fontWeight: 600,
              boxShadow: '0 5px 20px rgba(37, 211, 102, 0.35)',
              width: '100%',
              maxWidth: '350px'
            }}
          >
            <MessageCircle size={20} /> {isZh ? '即刻 WhatsApp 了解详情' : 'WhatsApp Me For More Info'}
          </motion.a>

          {/* Return Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            style={{
              background: 'transparent',
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              padding: '0.7rem 2rem',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              borderRadius: '30px',
              opacity: 0.9,
              marginTop: '0.5rem'
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'var(--btn-text)'; e.currentTarget.style.boxShadow = '0 5px 15px var(--primary-glow)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <ChevronLeft size={16} /> {isZh ? '重新测算星盘' : 'Recalculate Destiny'}
          </motion.button>
        </motion.div>

      </div>
    </motion.div>
  );
}
