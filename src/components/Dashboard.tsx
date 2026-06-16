import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { AvatarPlayground } from './AvatarPlayground';
import { MoodAnalytics } from './MoodAnalytics';
import { AIChatBuddy } from './AIChatBuddy';
import { ActivityTimeline } from './ActivityTimeline';
import { AvatarCustomization } from './AvatarCustomization';
import { EmotionalHeatmap } from './EmotionalHeatmap';
import { FocusSession } from './FocusSession';
import { FloatingNotifications } from './FloatingNotifications';
import { FloatingCompanion } from './FloatingCompanion';
import { useActivityTracker } from '../hooks/useActivityTracker';
import { useCharacter } from '../context/CharacterContext';

const moodLabel: Record<string, string> = {
  happy: 'happy and productive',
  focused: 'deeply focused',
  stressed: 'a bit stressed',
  tired: 'tired',
};

export function Dashboard() {
  const stats = useActivityTracker();
  const { character } = useCharacter();
  const isDark = character.mode === 'dark';

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Top header bar */}
      <header
        className="flex items-center gap-4 px-6 py-4 flex-shrink-0"
        style={{
          background: character.headerBg,
          borderBottom: `1px solid ${character.headerBorder}`,
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex-1">
          <motion.div
            key={character.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <h1 className="text-2xl font-black leading-tight">
              <span style={{ color: character.textPrimary }}>
                {character.greeting}{' '}
              </span>
              <motion.span
                className="inline-block"
                animate={{ rotate: [0, 20, -10, 20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              >
                👋
              </motion.span>
            </h1>
            <p className="text-sm font-medium mt-0.5" style={{ color: character.textSecondary }}>
              {stats.isTyping
                ? `${character.name} is typing with you right now! 🚀`
                : character.catchphrase}
            </p>
          </motion.div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs font-semibold text-green-400">Live Sync Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs">✨</span>
              <span className="text-xs font-semibold" style={{ color: character.textMuted }}>
                100% Real-time
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs">{character.emoji}</span>
              <span className="text-xs font-semibold" style={{ color: character.textMuted }}>
                {moodLabel[stats.mood] || 'vibing'}
              </span>
            </div>
          </div>
        </div>

        <FocusSession />

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{
              background: character.cardBg,
              border: `1px solid ${character.cardBorder}`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <Bell size={16} style={{ color: character.textSecondary }} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
              style={{ background: character.accentFrom }}>
              3
            </span>
          </motion.button>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${character.accentFrom}, ${character.accentTo})`, color: character.accentText }}
          >
            K
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <div
        className="flex-1 overflow-y-auto p-5"
        style={{ scrollbarColor: `${character.accentFrom}44 transparent` }}
      >
        <motion.div
          key={character.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-3 gap-4"
          style={{ minHeight: 'calc(100vh - 140px)' }}
        >
          {/* Left + center column */}
          <div className="col-span-2 flex flex-col gap-4">
            <div style={{ height: '340px' }}>
              <AvatarPlayground stats={stats} />
            </div>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <ActivityTimeline stats={stats} />
              <AvatarCustomization />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            <MoodAnalytics stats={stats} />
            <AIChatBuddy stats={stats} />
            <EmotionalHeatmap />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{
          background: character.footerBg,
          borderTop: `1px solid ${character.headerBorder}`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{character.emoji}</span>
          <span className="text-xs font-bold" style={{ color: character.textPrimary }}>
            VibeBuddy AI
          </span>
        </div>

        {/* Desktop coming soon */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: `linear-gradient(135deg, ${character.accentFrom}22, ${character.accentTo}22)`,
            border: `1px solid ${character.accentBorder}`,
          }}
        >
          <span style={{ fontSize: 12 }}>🖥️</span>
          <span
            className="text-[11px] font-semibold tracking-wide"
            style={{ color: character.textSecondary }}
          >
            Desktop App — Coming Soon
          </span>
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: character.accentFrom, color: character.accentText }}
          >
            SOON
          </span>
        </motion.div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 bg-green-400 rounded-full"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[11px] font-medium" style={{ color: character.textMuted }}>
              Real-time Sync: ON
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs">🔒</span>
            <span className="text-[11px] font-medium" style={{ color: character.textMuted }}>
              Secure & Private
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs">✨</span>
            <span className="text-[11px] font-medium" style={{ color: character.textMuted }}>
              AI Engine: Gemini 1.5 Flash
            </span>
          </div>
        </div>
      </footer>

      <FloatingNotifications stats={stats} />
      <FloatingCompanion stats={stats} onOpenAnalytics={() => {}} />
    </div>
  );
}
