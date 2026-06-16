import { motion } from 'framer-motion';
import type { ActivityStats } from '../hooks/useActivityTracker';
import { useCharacter } from '../context/CharacterContext';

interface MoodAnalyticsProps {
  stats: ActivityStats;
}

const moodItems = [
  { label: 'Happiness', emoji: '😊', key: 'happiness', baseValue: 82 },
  { label: 'Focus',     emoji: '🎯', key: 'focus',     baseValue: 76 },
  { label: 'Energy',    emoji: '⚡', key: 'energy',    baseValue: 61 },
  { label: 'Stress',    emoji: '😤', key: 'stress',    baseValue: 18 },
];

export function MoodAnalytics({ stats }: MoodAnalyticsProps) {
  const { character } = useCharacter();
  const isDark = character.mode === 'dark';

  const values: Record<string, number> = {
    happiness: stats.mood === 'happy' ? 88 : stats.mood === 'focused' ? 82 : 65,
    focus: stats.focusScore,
    energy: stats.isTyping ? 75 : 61,
    stress: stats.typingIntensity === 'intense' ? 48 : stats.typingIntensity === 'moderate' ? 26 : 18,
  };

  return (
    <div className="glass-card p-5 h-full" style={{
      background: character.cardBg,
      borderColor: character.cardBorder,
      boxShadow: character.cardShadow,
    }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base">💗</span>
          <p className="font-bold text-sm" style={{ color: character.textPrimary }}>
            Mood Overview
          </p>
        </div>
        <span
          className="text-xs rounded-full px-3 py-1 font-medium"
          style={{ background: character.accentBg, color: character.textSecondary, border: `1px solid ${character.accentBorder}` }}
        >
          Today
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {moodItems.map((item, idx) => {
          const value = values[item.key] ?? item.baseValue;
          const barColor = character.moodBarColors[idx] || 'from-blue-300 to-blue-400';
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-2xl p-3"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : character.accentBg,
                border: `1px solid ${character.accentBorder}`,
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">{item.emoji}</span>
                <p className="text-xs font-medium" style={{ color: character.textMuted }}>
                  {item.label}
                </p>
              </div>
              <p className="text-xl font-bold mb-2" style={{ color: character.textPrimary }}>
                {value}%
              </p>
              <div className="h-2 rounded-full overflow-hidden"
                style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: idx * 0.15 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
