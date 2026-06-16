import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ActivityStats } from '../hooks/useActivityTracker';
import { useCharacter } from '../context/CharacterContext';

interface Notification {
  id: number;
  text: string;
  icon: string;
  type: 'reminder' | 'stress' | 'hydration' | 'achievement';
}

const notificationPool: Omit<Notification, 'id'>[] = [
  { text: 'Time for a water break!', icon: '💧', type: 'hydration' },
  { text: "You've typed 13K+ keystrokes today!", icon: '🔥', type: 'achievement' },
  { text: 'Deep breath — you have got this!', icon: '🌿', type: 'reminder' },
  { text: 'You unlocked Focus Master badge!', icon: '🏆', type: 'achievement' },
  { text: 'Stretch your neck for 30 seconds!', icon: '🧘', type: 'reminder' },
];

interface FloatingNotificationsProps {
  stats: ActivityStats;
}

export function FloatingNotifications({ stats }: FloatingNotificationsProps) {
  const { character } = useCharacter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifIdx = useRef(0);

  const dismiss = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));

  useEffect(() => {
    const initial = setTimeout(() => {
      const notif: Notification = { ...notificationPool[0], id: Date.now() };
      setNotifications([notif]);
      setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== notif.id)), 6000);
    }, 4000);

    const interval = setInterval(() => {
      const pool = notificationPool[notifIdx.current % notificationPool.length];
      notifIdx.current++;
      const n: Notification = { ...pool, id: Date.now() };
      setNotifications(prev => [...prev.slice(-2), n]);
      setTimeout(() => setNotifications(prev => prev.filter(x => x.id !== n.id)), 6000);
    }, 16000);

    return () => { clearInterval(interval); clearTimeout(initial); };
  }, []);

  useEffect(() => {
    if (stats.typingIntensity === 'intense') {
      const n: Notification = {
        id: Date.now(),
        text: `Typing intensely! ${character.name} says take a breath!`,
        icon: character.emoji,
        type: 'stress',
      };
      setNotifications(prev => {
        if (prev.some(x => x.type === 'stress')) return prev;
        return [...prev.slice(-2), n];
      });
    }
  }, [stats.typingIntensity, character]);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 items-start pointer-events-none">
      <AnimatePresence>
        {notifications.map(notif => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="pointer-events-auto"
            style={{
              background: character.cardBg,
              border: `1px solid ${character.accentBorder}`,
              borderRadius: 18,
              padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
              maxWidth: 260, fontSize: 12, fontWeight: 600,
              backdropFilter: 'blur(16px)',
              boxShadow: character.cardShadow,
            }}
          >
            <span className="text-lg flex-shrink-0">{notif.icon}</span>
            <p className="flex-1 text-xs" style={{ color: character.textPrimary }}>{notif.text}</p>
            <button onClick={() => dismiss(notif.id)}
              className="transition-colors flex-shrink-0"
              style={{ color: character.textMuted }}>
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
