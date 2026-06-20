import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Zap, Flame } from 'lucide-react';
import type { ActivityStats } from '../hooks/useActivityTracker';
import type { FocusSession } from '../lib/supabase';
import { useCharacter } from '../context/CharacterContext';
import { CharacterSticker } from './CharacterSticker';

export type CompanionState = 'idle' | 'focus' | 'happy' | 'sad' | 'sleep' | 'levelUp';

interface CompanionCardProps {
  stats: ActivityStats;
  displayName: string;
  streak: number;
  sessions: FocusSession[];
}

function getCompanionState(stats: ActivityStats, streak: number): CompanionState {
  if (stats.sessionMinutes === 0 && stats.keystrokes === 0) return 'idle';
  if (stats.isTyping && stats.typingIntensity === 'intense') return 'focus';
  if (stats.isTyping) return 'focus';
  if (streak > 0 && stats.sessionMinutes > 0 && stats.focusScore > 70) return 'levelUp';
  if (stats.mood === 'stressed') return 'sad';
  if (stats.sessionMinutes > 30 && !stats.isTyping) return 'sleep';
  return 'idle';
}

function getDynamicMessage(
  state: CompanionState,
  character: ReturnType<typeof useCharacter>['character'],
  displayName: string,
  stats: ActivityStats,
  streak: number,
): string {
  const name = displayName.split(' ')[0];
  switch (state) {
    case 'idle':
      return `Ready for today's focus session, ${name}?`;
    case 'focus':
      return `${name}, you're in the zone! Keep going!`;
    case 'happy':
      return `Great work, ${name}! ${character.name} is proud of you!`;
    case 'sad':
      return `Hey ${name}, take a breath. ${character.name} is here for you.`;
    case 'sleep':
      return `You've been going for a while, ${name}. Maybe a quick stretch?`;
    case 'levelUp':
      if (streak > 0) return `You are ${Math.max(0, 60 - (stats.sessionMinutes % 60))} minutes away from a new streak day!`;
      return `Amazing focus, ${name}! You're leveling up!`;
    default:
      return character.catchphrase;
  }
}

const focusTips = ['FOCUS', 'CREATE', 'ACHIEVE', 'VIBE', 'FLOW', 'BUILD'];

export function CompanionCard({ stats, displayName, streak }: CompanionCardProps) {
  const { character } = useCharacter();
  const isDark = character.mode === 'dark';
  const companionState = getCompanionState(stats, streak);
  const message = getDynamicMessage(companionState, character, displayName, stats, streak);

  const [tipIndex, setTipIndex] = useState(0);
  const [mouseAngle, setMouseAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTipIndex(i => (i + 1) % focusTips.length), 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth * 0.35;
      const cy = window.innerHeight * 0.45;
      setMouseAngle(Math.atan2(e.clientY - cy, e.clientX - cx));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Determine animation variant based on companion state
  const animVariant = useMemo(() => {
    switch (companionState) {
      case 'focus':
        return { y: [0, -6, -10, -6, 0], rotate: [0, -1.5, 1.5, -0.5, 0] };
      case 'levelUp':
        return { y: [0, -12, -6, -14, 0], rotate: [0, -3, 3, -2, 0], scale: [1, 1.05, 1, 1.03, 1] };
      case 'sleep':
        return { y: [0, -3, 0], rotate: [0, 1, 0] };
      case 'sad':
        return { y: [0, -2, 0], rotate: [0, -0.5, 0] };
      default:
        return { y: [0, -7, 0], rotate: [0, 0.5, 0] };
    }
  }, [companionState]);

  const animTransition = useMemo(() => {
    switch (companionState) {
      case 'focus':
        return { duration: 0.5, repeat: Infinity, ease: 'easeInOut' as const };
      case 'levelUp':
        return { duration: 1.2, repeat: Infinity, ease: 'easeInOut' as const };
      case 'sleep':
        return { duration: 5, repeat: Infinity, ease: 'easeInOut' as const };
      case 'sad':
        return { duration: 4, repeat: Infinity, ease: 'easeInOut' as const };
      default:
        return { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const };
    }
  }, [companionState]);

  return (
    <div className="relative overflow-hidden h-full min-h-[320px]" style={{
      borderRadius: 24,
      background: isDark
        ? `linear-gradient(135deg, rgba(30,0,0,0.8), rgba(15,0,0,0.9))`
        : `linear-gradient(135deg, rgba(247,207,216,0.6), rgba(244,248,211,0.4), rgba(166,214,214,0.5))`,
      border: `1px solid ${character.cardBorder}`,
      boxShadow: character.cardShadow,
      backdropFilter: 'blur(16px)',
    }}>
      {/* Level-up glow effect */}
      <AnimatePresence>
        {companionState === 'levelUp' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${character.accentFrom}44, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute select-none"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
              color: character.accentFrom,
            }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill={character.accentFrom}>
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Neon sign - top left */}
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

      {/* Speech bubble - top right */}
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -8 }}
          className="absolute top-4 right-4 sm:top-6 sm:right-8 z-10 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 max-w-[160px] sm:max-w-[200px]"
          style={{
            background: isDark ? 'rgba(30,10,10,0.95)' : 'rgba(255,255,255,0.93)',
            border: `1px solid ${character.accentBorder}`,
            boxShadow: character.cardShadow,
            borderBottomRightRadius: 4,
          }}
        >
          <p className="text-[10px] sm:text-xs font-semibold leading-snug" style={{ color: character.textPrimary }}>
            {message}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Full-body mascot character - center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={animVariant}
          transition={animTransition}
        >
          <CharacterSticker
            characterId={character.id}
            size={Math.min(240, Math.max(150, typeof window !== 'undefined' ? window.innerWidth * 0.19 : 200))}
            mouseAngle={mouseAngle}
            isTyping={stats.isTyping}
            state={companionState}
          />
        </motion.div>

        {/* Sleep ZZZ effect */}
        <AnimatePresence>
          {companionState === 'sleep' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute"
              style={{ top: '20%', right: '25%' }}
            >
              {['Z', 'z', 'z'].map((z, i) => (
                <motion.span
                  key={i}
                  className="absolute font-black"
                  style={{
                    color: character.accentFrom,
                    fontSize: 16 - i * 3,
                    left: i * 14,
                    top: -i * 12,
                  }}
                  animate={{ y: [0, -20, -40], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                >
                  {z}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live sync badge - bottom left */}
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

      {/* Today's stats - bottom right */}
      <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-10">
        <div className="rounded-2xl px-3 py-2 sm:px-4 sm:py-3 border"
          style={{ background: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.7)', borderColor: character.accentBorder, backdropFilter: 'blur(8px)' }}>
          <p className="text-[9px] sm:text-[10px] font-semibold mb-1.5 sm:mb-2" style={{ color: character.textMuted }}>
            Today's Stats
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={character.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 16h8"/>
              </svg>
              <div>
                <p className="text-[10px] sm:text-xs font-bold" style={{ color: character.textPrimary }}>
                  {stats.keystrokes.toLocaleString()}
                </p>
                <p className="text-[8px] sm:text-[9px]" style={{ color: character.textMuted }}>Keys</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={character.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="3" width="12" height="18" rx="6"/><line x1="12" y1="7" x2="12" y2="11"/>
              </svg>
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
            {streak > 0 && (
              <div className="flex items-center gap-1">
                <Flame size={11} style={{ color: '#f97316' }} />
                <div>
                  <p className="text-[10px] sm:text-xs font-bold" style={{ color: character.textPrimary }}>
                    {streak}d
                  </p>
                  <p className="text-[8px] sm:text-[9px]" style={{ color: character.textMuted }}>Streak</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
