import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, Target } from 'lucide-react';
import { useCharacter } from '../context/CharacterContext';

export function FocusSession() {
  const { character } = useCharacter();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-4 rounded-2xl px-5 py-3 flex-shrink-0"
      style={{
        background: character.cardBg,
        border: `1px solid ${character.cardBorder}`,
        backdropFilter: 'blur(12px)',
        boxShadow: character.cardShadow,
      }}>
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${character.accentFrom}55, ${character.accentTo}55)` }}>
        <Target size={20} style={{ color: character.textSecondary }} />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: character.textMuted }}>
          Focus Session
        </p>
        <motion.p
          key={mins}
          className="text-2xl font-black leading-tight"
          style={{ color: character.textPrimary }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.3 }}
        >
          {mins}:{secs}
        </motion.p>
        <p className="text-[10px]" style={{ color: character.textMuted }}>Deep Work</p>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setRunning(r => !r)}
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${character.accentFrom}, ${character.accentTo})`, boxShadow: character.cardShadow }}
      >
        {running
          ? <Pause size={14} style={{ color: character.accentText, fill: character.accentText }} />
          : <Play size={14} style={{ color: character.accentText, fill: character.accentText }} />
        }
      </motion.button>
    </div>
  );
}
