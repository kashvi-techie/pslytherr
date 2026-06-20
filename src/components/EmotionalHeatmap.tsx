import { motion } from 'framer-motion';
import type { MoodStat } from '../lib/supabase';
import { useCharacter } from '../context/CharacterContext';

interface EmotionalHeatmapProps {
  moodStats: MoodStat[];
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const moodLabels = [
  { key: 'happiness' as const, label: 'Happy' },
  { key: 'stress' as const, label: 'Stressed' },
  { key: 'energy' as const, label: 'Energy' },
  { key: 'focus_level' as const, label: 'Focus' },
];

function getDayIndex(dateStr: string): number {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay(); // 0=Sun, 1=Mon...
  return day === 0 ? 6 : day - 1; // Convert to Mon=0...Sun=6
}

export function EmotionalHeatmap({ moodStats }: EmotionalHeatmapProps) {
  const { character } = useCharacter();
  const isDark = character.mode === 'dark';

  // Build a 4x7 grid from moodStats (4 moods x 7 days)
  function getIntensity(moodKey: 'happiness' | 'stress' | 'energy' | 'focus_level', dayIdx: number): number {
    // Find the date for this day index (last 7 days)
    const today = new Date();
    const todayDayIdx = getDayIndex(today.toISOString().split('T')[0]);
    const diff = dayIdx - todayDayIdx;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + (diff > 0 ? diff - 7 : diff));
    const dateStr = targetDate.toISOString().split('T')[0];

    const stat = moodStats.find(s => s.recorded_date === dateStr);
    if (!stat) return 0;

    // Normalize to 0-1 range
    const raw = stat[moodKey];
    return Math.min(1, Math.max(0, raw / 100));
  }

  function getCellColor(moodIdx: number, intensity: number): string {
    if (intensity < 0.05) return isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
    const alpha = 0.15 + intensity * 0.75;
    return moodIdx % 2 === 0
      ? `${character.accentFrom}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
      : `${character.accentTo}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
  }

  const hasData = moodStats.length > 0;

  return (
    <div className="p-5 h-full" style={{
      background: character.cardBg,
      border: `1px solid ${character.cardBorder}`,
      boxShadow: character.cardShadow,
      borderRadius: 24,
      backdropFilter: 'blur(16px)',
    }}>
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={character.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
        </svg>
        <p className="font-bold text-sm" style={{ color: character.textPrimary }}>
          Weekly Mood Heatmap
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-8">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={character.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
          </svg>
          <p className="text-xs font-semibold mt-3" style={{ color: character.textMuted }}>
            No mood data yet
          </p>
          <p className="text-[10px] mt-1 text-center" style={{ color: character.textMuted }}>
            Complete a 5-minute focus session to start tracking your mood
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1 mb-2 ml-7">
            {days.map(day => (
              <div key={day} className="flex-1 text-center">
                <span className="text-[10px] font-semibold" style={{ color: character.textMuted }}>
                  {day}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            {moodLabels.map((mood, moodIdx) => (
              <div key={mood.key} className="flex items-center gap-1">
                <span className="text-[10px] font-medium w-6 text-center flex-shrink-0" style={{ color: character.textMuted }}>
                  {mood.label.slice(0, 3)}
                </span>
                {days.map((day, dayIdx) => {
                  const intensity = getIntensity(mood.key, dayIdx);
                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (moodIdx * 7 + dayIdx) * 0.015 }}
                      className="flex-1 h-6 rounded-xl cursor-pointer transition-transform hover:scale-110"
                      style={{ backgroundColor: getCellColor(moodIdx, intensity) }}
                      title={`${mood.label} on ${day}: ${Math.round(intensity * 100)}%`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-[10px]" style={{ color: character.textMuted }}>Low</span>
            <div className="flex gap-1 flex-1 mx-3">
              {[0.1, 0.3, 0.5, 0.7, 0.9, 1.0].map((v, i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${character.accentFrom}${Math.round((0.2 + v * 0.6) * 255).toString(16).padStart(2, '0')}, ${character.accentTo}${Math.round((0.2 + v * 0.6) * 255).toString(16).padStart(2, '0')})`,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px]" style={{ color: character.textMuted }}>High</span>
          </div>
        </>
      )}
    </div>
  );
}
