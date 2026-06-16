import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Zap } from 'lucide-react';
import type { ActivityStats } from '../hooks/useActivityTracker';
import { useCharacter } from '../context/CharacterContext';

interface AvatarPlaygroundProps {
  stats: ActivityStats;
}

const focusTips = ['FOCUS', 'CREATE', 'ACHIEVE', 'VIBE', 'FLOW', 'BUILD'];

export function AvatarPlayground({ stats }: AvatarPlaygroundProps) {
  const { character } = useCharacter();
  const isDark = character.mode === 'dark';

  const [tipIndex, setTipIndex] = useState(0);
  const [bubbleKey, setBubbleKey] = useState(0);

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
            ✦
          </motion.div>
        ))}
      </div>

      {/* Neon sign */}
      <div className="absolute top-6 left-8 z-10">
        <div
          className="rounded-2xl p-3 text-center min-w-[90px]"
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
                fontSize: '13px',
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
          className="absolute top-6 right-8 z-10 rounded-2xl px-4 py-2.5 max-w-[180px]"
          style={{
            background: isDark ? 'rgba(30,10,10,0.95)' : 'rgba(255,255,255,0.93)',
            border: `1px solid ${character.accentBorder}`,
            boxShadow: character.cardShadow,
            borderBottomRightRadius: 4,
          }}
        >
          <p className="text-xs font-semibold leading-snug" style={{ color: character.textPrimary }}>
            {stats.isTyping
              ? `${character.name} is typing too! 🚀`
              : bubbles[bubbleKey % bubbles.length]}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Avatar figure */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          {/* Monitor */}
          <div
            className="absolute -top-4 w-28 h-20 rounded-xl border-2 flex items-center justify-center overflow-hidden"
            style={{ background: isDark ? '#1a0505' : '#5b2d8c', borderColor: character.accentFrom + '80' }}
          >
            <div className="w-24 h-16 rounded-lg flex items-center justify-center overflow-hidden"
              style={{ background: isDark ? '#2d0808' : '#f0e8ff' }}>
              <motion.div
                animate={{ opacity: stats.isTyping ? [1, 0.3, 1] : 1 }}
                transition={{ duration: 0.4, repeat: stats.isTyping ? Infinity : 0 }}
                className="text-center"
              >
                <p style={{ fontSize: 8, color: character.textMuted, margin: 0 }}>VibeBuddy AI</p>
                <p style={{ fontSize: 10, fontWeight: 700, color: character.textPrimary, margin: 0 }}>
                  {stats.isTyping ? '▋ coding...' : '> ready'}
                </p>
                {stats.isTyping && (
                  <p style={{ fontSize: 7, color: '#22c55e', margin: 0 }}>● live sync</p>
                )}
              </motion.div>
            </div>
          </div>

          {/* Character emoji */}
          <motion.div
            className="select-none"
            style={{ fontSize: 80, marginTop: 72 }}
            animate={
              stats.isTyping
                ? { y: [0, -6, -10, -6, 0], rotate: [0, -2, 2, -1, 0] }
                : { y: [0, -7, 0], rotate: [-1, 1, -1] }
            }
            transition={
              stats.isTyping
                ? { duration: 0.45, repeat: Infinity }
                : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            {character.emoji}
          </motion.div>

          {/* Keyboard */}
          <div className="flex gap-1 mt-1">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="w-4 h-2.5 rounded-sm"
                style={{ background: isDark ? '#3d0808' : '#cdc2e9' }}
                animate={stats.isTyping
                  ? { backgroundColor: [character.accentFrom + '80', character.accentTo + '80', character.accentFrom + '80'], scale: [1, 0.85, 1] }
                  : {}}
                transition={{ duration: 0.3, delay: i * 0.05, repeat: stats.isTyping ? Infinity : 0 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Live sync badge */}
      <div className="absolute bottom-5 left-5 z-10">
        <div className="flex items-center gap-2 rounded-full px-3 py-1.5 border"
          style={{ background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)', borderColor: character.accentBorder, backdropFilter: 'blur(8px)' }}>
          <motion.div
            className="w-2 h-2 bg-green-400 rounded-full"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <Wifi size={11} style={{ color: character.textSecondary }} />
          <span className="text-[11px] font-semibold" style={{ color: character.textPrimary }}>
            Live Activity Sync
          </span>
        </div>
        <p className="text-[9px] mt-1 ml-1" style={{ color: character.textMuted }}>
          Capturing keystrokes, mouse moves & actions
        </p>
      </div>

      {/* Today's stats */}
      <div className="absolute bottom-5 right-5 z-10">
        <div className="rounded-2xl px-4 py-3 border"
          style={{ background: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.7)', borderColor: character.accentBorder, backdropFilter: 'blur(8px)' }}>
          <p className="text-[10px] font-semibold mb-2" style={{ color: character.textMuted }}>
            Today's Stats
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">⌨️</span>
              <div>
                <p className="text-xs font-bold" style={{ color: character.textPrimary }}>
                  {stats.keystrokes.toLocaleString()}
                </p>
                <p className="text-[9px]" style={{ color: character.textMuted }}>Keystrokes</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🖱️</span>
              <div>
                <p className="text-xs font-bold" style={{ color: character.textPrimary }}>
                  {(stats.mouseMoves / 1000).toFixed(1)}K
                </p>
                <p className="text-[9px]" style={{ color: character.textMuted }}>Mouse</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={13} style={{ color: character.accentFrom }} />
              <div>
                <p className="text-xs font-bold" style={{ color: character.textPrimary }}>
                  {stats.focusScore}%
                </p>
                <p className="text-[9px]" style={{ color: character.textMuted }}>Focus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
