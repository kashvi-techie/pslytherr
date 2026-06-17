import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Zap } from 'lucide-react';
import type { ActivityStats } from '../hooks/useActivityTracker';
import { useCharacter } from '../context/CharacterContext';
import { CharacterSticker } from './CharacterSticker';

interface AvatarPlaygroundProps {
  stats: ActivityStats;
}

const focusTips = ['FOCUS', 'CREATE', 'ACHIEVE', 'VIBE', 'FLOW', 'BUILD'];

export function AvatarPlayground({ stats }: AvatarPlaygroundProps) {
  const { character } = useCharacter();
  const isDark = character.mode === 'dark';

  const [tipIndex, setTipIndex] = useState(0);
  const [bubbleKey, setBubbleKey] = useState(0);
  const [mouseAngle, setMouseAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTipIndex(i => (i + 1) % focusTips.length), 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (stats.isTyping) {
      const t = setInterval(() => setBubbleKey(k => k + 1), 4000);
      return () => clearInterval(t);
    }
  }, [stats.isTyping]);

  // Mouse angle tracking for eye direction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Center of the mascot area
      const cx = window.innerWidth * 0.35;
      const cy = window.innerHeight * 0.45;
      setMouseAngle(Math.atan2(e.clientY - cy, e.clientX - cx));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const bubbles = character.hoverPhrases;

  return (
    <div className="relative overflow-hidden h-full min-h-[300px]" style={{
      borderRadius: 24,
      background: isDark
        ? `linear-gradient(135deg, rgba(30,0,0,0.8), rgba(15,0,0,0.9))`
        : `linear-gradient(135deg, rgba(247,207,216,0.6), rgba(244,248,211,0.4), rgba(166,214,214,0.5))`,
      border: `1px solid ${character.cardBorder}`,
      boxShadow: character.cardShadow,
      backdropFilter: 'blur(16px)',
    }}>
      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute select-none text-xs"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
              color: character.accentFrom,
            }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity }}
          >
            &#10022;
          </motion.div>
        ))}
      </div>

      {/* Neon sign */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-10">
        <div
          className="rounded-2xl p-2.5 sm:p-3 text-center min-w-[70px] sm:min-w-[90px]"
          style={{
            background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(50,30,80,0.85)',
            border: `1px solid ${character.accentFrom}66`,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="font-black text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(135deg, ${character.accentFrom}, ${character.accentTo})`,
                fontSize: 'clamp(10px, 1.5vw, 13px)',
                letterSpacing: '2px',
              }}
            >
              {focusTips[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${bubbleKey}-${stats.isTyping}`}
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -8 }}
          className="absolute top-4 right-4 sm:top-6 sm:right-8 z-10 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 max-w-[140px] sm:max-w-[180px]"
          style={{
            background: isDark ? 'rgba(30,10,10,0.95)' : 'rgba(255,255,255,0.93)',
            border: `1px solid ${character.accentBorder}`,
            boxShadow: character.cardShadow,
            borderBottomRightRadius: 4,
          }}
        >
          <p className="text-[10px] sm:text-xs font-semibold leading-snug" style={{ color: character.textPrimary }}>
            {stats.isTyping
              ? `${character.name} is typing too!`
              : bubbles[bubbleKey % bubbles.length]}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Full-body mascot character */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={
            stats.isTyping
              ? { y: [0, -6, -10, -6, 0], rotate: [0, -1.5, 1.5, -0.5, 0] }
              : { y: [0, -7, 0], rotate: [0, 0.5, 0] }
          }
          transition={
            stats.isTyping
              ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <CharacterSticker
            characterId={character.id}
            size={Math.min(220, Math.max(140, typeof window !== 'undefined' ? window.innerWidth * 0.18 : 180))}
            mouseAngle={mouseAngle}
            isTyping={stats.isTyping}
          />
        </motion.div>
      </div>

      {/* Live sync badge */}
      <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-10">
        <div className="flex items-center gap-2 rounded-full px-2.5 py-1.5 sm:px-3 sm:py-1.5 border"
          style={{ background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)', borderColor: character.accentBorder, backdropFilter: 'blur(8px)' }}>
          <motion.div
            className="w-2 h-2 bg-green-400 rounded-full"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <Wifi size={11} style={{ color: character.textSecondary }} />
          <span className="text-[10px] sm:text-[11px] font-semibold" style={{ color: character.textPrimary }}>
            Live Sync
          </span>
        </div>
      </div>

      {/* Today's stats */}
      <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-10">
        <div className="rounded-2xl px-3 py-2 sm:px-4 sm:py-3 border"
          style={{ background: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.7)', borderColor: character.accentBorder, backdropFilter: 'blur(8px)' }}>
          <p className="text-[9px] sm:text-[10px] font-semibold mb-1.5 sm:mb-2" style={{ color: character.textMuted }}>
            Today's Stats
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm">&#9000;</span>
              <div>
                <p className="text-[10px] sm:text-xs font-bold" style={{ color: character.textPrimary }}>
                  {stats.keystrokes.toLocaleString()}
                </p>
                <p className="text-[8px] sm:text-[9px]" style={{ color: character.textMuted }}>Keys</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm">&#128433;</span>
              <div>
                <p className="text-[10px] sm:text-xs font-bold" style={{ color: character.textPrimary }}>
                  {(stats.mouseMoves / 1000).toFixed(1)}K
                </p>
                <p className="text-[8px] sm:text-[9px]" style={{ color: character.textMuted }}>Mouse</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={11} style={{ color: character.accentFrom }} />
              <div>
                <p className="text-[10px] sm:text-xs font-bold" style={{ color: character.textPrimary }}>
                  {stats.focusScore}%
                </p>
                <p className="text-[8px] sm:text-[9px]" style={{ color: character.textMuted }}>Focus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
