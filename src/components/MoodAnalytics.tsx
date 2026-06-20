import { motion } from 'framer-motion';
import type { ActivityStats } from '../hooks/useActivityTracker';
import type { MoodStat } from '../lib/supabase';
import { useCharacter } from '../context/CharacterContext';

interface MoodAnalyticsProps {
  stats: ActivityStats;
  moodStats: MoodStat[];
}

export function MoodAnalytics({ stats, moodStats }: MoodAnalyticsProps) {
  const { character } = useCharacter();
  const isDark = character.mode === 'dark';

  // Use today's Supabase mood data if available, otherwise derive from live stats
  const today = new Date().toISOString().split('T')[0];
  const todayMood = moodStats.find(m => m.recorded_date === today);

  const hasData = !!todayMood;

  const moodItems = [
    {
      label: 'Happiness',
      value: hasData ? todayMood!.happiness : (stats.sessionMinutes > 0 ? (stats.mood === 'happy' ? 88 : stats.mood === 'focused' ? 82 : 65) : 0),
      color: character.moodBarColors[0] || 'from-blush-300 to-blush-400',
    },
    {
      label: 'Focus',
      value: hasData ? todayMood!.focus_level : stats.focusScore,
      color: character.moodBarColors[1] || 'from-teal-300 to-teal-400',
    },
    {
      label: 'Energy',
      value: hasData ? todayMood!.energy : (stats.sessionMinutes > 0 ? (stats.isTyping ? 75 : 61) : 0),
      color: character.moodBarColors[2] || 'from-sage-300 to-sage-400',
    },
    {
      label: 'Stress',
      value: hasData ? todayMood!.stress : (stats.sessionMinutes > 0 ? (stats.typingIntensity === 'intense' ? 48 : stats.typingIntensity === 'moderate' ? 26 : 18) : 0),
      color: character.moodBarColors[3] || 'from-violet-300 to-violet-400',
    },
  ];

  return (
    <div className="glass-card p-5 h-full" style={{
      background: character.cardBg,
      borderColor: character.cardBorder,
      boxShadow: character.cardShadow,
    }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={character.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <p className="font-bold text-sm" style={{ color: character.textPrimary }}>
            Mood Overview
          </p>
        </div>
        <span
          className="text-xs rounded-full px-3 py-1 font-medium"
          style={{ background: character.accentBg, color: character.textSecondary, border: `1px solid ${character.accentBorder}` }}
        >
          {hasData ? 'Today' : 'Live'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {moodItems.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl p-3"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : character.accentBg,
              border: `1px solid ${character.accentBorder}`,
            }}
          >
            <p className="text-xs font-medium mb-1.5" style={{ color: character.textMuted }}>
              {item.label}
            </p>
            <p className="text-xl font-bold mb-2" style={{ color: character.textPrimary }}>
              {item.value}%
            </p>
            <div className="h-2 rounded-full overflow-hidden"
              style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: idx * 0.15 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
