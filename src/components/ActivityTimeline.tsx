import { motion } from 'framer-motion';
import type { FocusSession } from '../lib/supabase';
import { useCharacter } from '../context/CharacterContext';

interface ActivityTimelineProps {
  sessions: FocusSession[];
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function getSessionIcon(session: FocusSession): string {
  if (session.focus_score > 75) return 'high';
  if (session.mood === 'stressed') return 'stress';
  return 'normal';
}

function getSessionColor(type: string, accentFrom: string): string {
  switch (type) {
    case 'high': return '#4ade80';
    case 'stress': return '#f87171';
    default: return accentFrom;
  }
}

function getSessionLabel(session: FocusSession): string {
  const mins = Math.round(session.duration_seconds / 60);
  if (session.focus_score > 75) return `Deep focus — ${mins}m session`;
  if (session.mood === 'stressed') return `Stress spike — ${mins}m session`;
  return `Focus session — ${mins}m`;
}

export function ActivityTimeline({ sessions }: ActivityTimelineProps) {
  const { character } = useCharacter();

  if (sessions.length === 0) {
    return (
      <div className="p-5 h-full flex flex-col items-center justify-center" style={{
        background: character.cardBg,
        border: `1px solid ${character.cardBorder}`,
        boxShadow: character.cardShadow,
        borderRadius: 24,
        backdropFilter: 'blur(16px)',
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={character.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
        <p className="text-xs font-semibold mt-3" style={{ color: character.textMuted }}>
          No activity yet
        </p>
        <p className="text-[10px] mt-1" style={{ color: character.textMuted }}>
          Your focus sessions will appear here
        </p>
      </div>
    );
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
        <span className="text-[11px] font-medium" style={{ color: character.textMuted }}>
          {sessions.length} sessions
        </span>
      </div>

      <div className="relative space-y-0">
        <div className="absolute left-[19px] top-3 bottom-3 w-px"
          style={{ background: `linear-gradient(to bottom, ${character.accentFrom}88, ${character.accentTo}44)` }} />

        {sessions.slice(0, 6).map((session, idx) => {
          const type = getSessionIcon(session);
          const dotColor = getSessionColor(type, character.accentFrom);
          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="flex items-center gap-3 py-2"
            >
              <motion.div
                className="w-2.5 h-2.5 rounded-full z-10 relative flex-shrink-0"
                style={{ background: dotColor, boxShadow: `0 0 8px ${dotColor}88` }}
              />
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-[10px] font-bold whitespace-nowrap"
                  style={{ color: character.textMuted, minWidth: 52 }}>
                  {formatTime(session.started_at)}
                </span>
                <span className="text-xs font-medium truncate" style={{ color: character.textPrimary }}>
                  {getSessionLabel(session)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
