import { motion } from 'framer-motion';
import { useCharacter } from '../context/CharacterContext';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😤', label: 'Stressed' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '💧', label: 'Calm' },
];

const heatmapData = [
  [0.9, 0.7, 0.85, 0.6, 0.95, 0.4, 0.3],
  [0.2, 0.5, 0.3, 0.7, 0.15, 0.1, 0.05],
  [0.3, 0.4, 0.2, 0.35, 0.25, 0.6, 0.7],
  [0.6, 0.5, 0.7, 0.4, 0.65, 0.8, 0.9],
];

export function EmotionalHeatmap() {
  const { character } = useCharacter();
  const isDark = character.mode === 'dark';

  function getCellColor(moodIdx: number, intensity: number): string {
    const alpha = 0.15 + intensity * 0.75;
    if (intensity < 0.2) return isDark ? `rgba(255,255,255,0.05)` : `rgba(0,0,0,0.05)`;
    // Interpolate between accent colors based on intensity
    return moodIdx % 2 === 0
      ? `${character.accentFrom}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
      : `${character.accentTo}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
  }

  return (
    <div className="p-5 h-full" style={{
      background: character.cardBg,
      border: `1px solid ${character.cardBorder}`,
      boxShadow: character.cardShadow,
      borderRadius: 24,
      backdropFilter: 'blur(16px)',
    }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">🔮</span>
        <p className="font-bold text-sm" style={{ color: character.textPrimary }}>
          Weekly Mood Heatmap
        </p>
      </div>

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
        {moods.map((mood, moodIdx) => (
          <div key={mood.label} className="flex items-center gap-1">
            <span className="text-sm w-6 text-center flex-shrink-0">{mood.emoji}</span>
            {days.map((day, dayIdx) => {
              const intensity = heatmapData[moodIdx][dayIdx];
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
    </div>
  );
}
