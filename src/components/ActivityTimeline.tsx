import { motion } from 'framer-motion';
import type { ActivityStats } from '../hooks/useActivityTracker';
import { useCharacter } from '../context/CharacterContext';

interface TimelineEvent {
  time: string;
  text: string;
  icon: string;
  dotColor: string;
}

const baseEvents: TimelineEvent[] = [
  { time: '9:30 AM', text: 'Focus session started', icon: '🎯', dotColor: '#4ade80' },
  { time: '9:42 AM', text: 'High typing activity', icon: '⌨️', dotColor: '#a78bfa' },
  { time: '10:00 AM', text: 'Stress spike detected', icon: '⚡', dotColor: '#f87171' },
  { time: '10:15 AM', text: 'Water reminder sent', icon: '💧', dotColor: '#38bdf8' },
  { time: '10:30 AM', text: 'Mood improved', icon: '😊', dotColor: '#4ade80' },
];

interface ActivityTimelineProps {
  stats: ActivityStats;
}

export function ActivityTimeline({ stats }: ActivityTimelineProps) {
  const { character } = useCharacter();
  const isDark = character.mode === 'dark';

  const events = [...baseEvents];
  if (stats.isTyping) {
    events.unshift({ time: 'Now', text: 'Actively typing', icon: '🔥', dotColor: character.accentFrom });
  }

  return (
    <div className="p-5 h-full" style={{
      background: character.cardBg,
      border: `1px solid ${character.cardBorder}`,
      boxShadow: character.cardShadow,
      borderRadius: 24,
      backdropFilter: 'blur(16px)',
    }}>
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold text-sm" style={{ color: character.textPrimary }}>
          Activity Timeline
        </p>
        <button className="text-[11px] font-medium transition-colors"
          style={{ color: character.textMuted }}>
          View all
        </button>
      </div>

      <div className="relative space-y-0">
        <div className="absolute left-[19px] top-3 bottom-3 w-px"
          style={{ background: `linear-gradient(to bottom, ${character.accentFrom}88, ${character.accentTo}44)` }} />

        {events.slice(0, 6).map((event, idx) => (
          <motion.div
            key={`${event.time}-${idx}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.07 }}
            className="flex items-center gap-3 py-2"
          >
            <motion.div
              className="w-2.5 h-2.5 rounded-full z-10 relative flex-shrink-0"
              style={{ background: event.dotColor, boxShadow: `0 0 8px ${event.dotColor}88` }}
              animate={event.time === 'Now' ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-[10px] font-bold whitespace-nowrap"
                style={{ color: character.textMuted, minWidth: 52 }}>
                {event.time}
              </span>
              <span className="text-sm">{event.icon}</span>
              <span className="text-xs font-medium truncate" style={{ color: character.textPrimary }}>
                {event.text}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
