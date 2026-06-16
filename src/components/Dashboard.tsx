import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogOut, ChevronDown, Trophy, Flame } from 'lucide-react';
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
import { useAuth } from '../context/AuthContext';
import { useFocusPersistence } from '../hooks/useFocusPersistence';

export function Dashboard() {
  const stats = useActivityTracker();
  const { character } = useCharacter();
  const { user, profile, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Persist sessions + mood to Supabase
  useFocusPersistence(user?.id, stats);

  const isDark = character.mode === 'dark';
  const displayName = profile?.display_name ?? user?.email?.split('@')[0] ?? 'Learner';
  const avatarUrl = profile?.avatar_url;
  const coins = profile?.coins ?? 0;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">

      {/* ── Top header ─────────────────────────────────────────────────── */}
      <header
        className="flex items-center gap-3 px-4 sm:px-6 py-3 flex-shrink-0"
        style={{
          background: character.headerBg,
          borderBottom: `1px solid ${character.headerBorder}`,
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Left: greeting */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={character.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-black leading-tight truncate" style={{
              color: character.textPrimary,
              fontSize: 'clamp(15px, 2.5vw, 22px)',
            }}>
              {character.greeting}{' '}
              <motion.span
                className="inline-block"
                animate={{ rotate: [0, 20, -10, 20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              >
                {displayName.split(' ')[0]}! 👋
              </motion.span>
            </h1>
            <p className="text-xs font-medium hidden sm:block" style={{ color: character.textSecondary }}>
              {stats.isTyping ? `${character.name} is typing with you! 🚀` : character.catchphrase}
            </p>
          </motion.div>
        </div>

        {/* Center: Focus session timer (hidden on mobile) */}
        <div className="hidden md:block flex-shrink-0">
          <FocusSession />
        </div>

        {/* Right: Stats + user */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Streak */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-2xl px-3 py-2"
            style={{ background: character.accentBg, border: `1px solid ${character.accentBorder}` }}>
            <Flame size={14} style={{ color: '#f97316' }} />
            <span className="text-xs font-bold" style={{ color: character.textPrimary }}>
              {stats.sessionMinutes > 0 ? Math.ceil(stats.sessionMinutes / 60) : 0}d
            </span>
          </div>

          {/* Coins */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-2xl px-3 py-2"
            style={{ background: character.accentBg, border: `1px solid ${character.accentBorder}` }}>
            <Trophy size={13} style={{ color: character.accentFrom }} />
            <span className="text-xs font-bold" style={{ color: character.textPrimary }}>
              {coins.toLocaleString()}
            </span>
          </div>

          {/* Bell */}
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="relative w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: character.cardBg, border: `1px solid ${character.cardBorder}` }}
          >
            <Bell size={16} style={{ color: character.textSecondary }} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
              style={{ background: character.accentFrom }}>3</span>
          </motion.button>

          {/* User avatar + menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowUserMenu(v => !v)}
              className="flex items-center gap-2 rounded-2xl px-2 py-1.5 transition-all"
              style={{ background: character.cardBg, border: `1px solid ${character.cardBorder}` }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName}
                  className="w-7 h-7 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${character.accentFrom}, ${character.accentTo})` }}>
                  {displayName[0]?.toUpperCase()}
                </div>
              )}
              <span className="text-xs font-semibold hidden sm:block max-w-[80px] truncate"
                style={{ color: character.textPrimary }}>
                {displayName.split(' ')[0]}
              </span>
              <ChevronDown size={12} style={{ color: character.textMuted }} className="hidden sm:block" />
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden z-50"
                  style={{
                    background: isDark ? 'rgba(15,8,8,0.98)' : 'rgba(255,255,255,0.98)',
                    border: `1px solid ${character.accentBorder}`,
                    boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
                    backdropFilter: 'blur(20px)',
                    minWidth: 180,
                  }}
                >
                  <div className="px-4 py-3 border-b" style={{ borderColor: character.accentBorder }}>
                    <p className="text-xs font-bold" style={{ color: character.textPrimary }}>{displayName}</p>
                    <p className="text-[10px]" style={{ color: character.textMuted }}>{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => { setShowUserMenu(false); signOut(); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={13} />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Mobile: focus timer */}
      <div className="md:hidden px-4 pt-3 flex-shrink-0">
        <FocusSession />
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5"
        style={{ scrollbarColor: `${character.accentFrom}44 transparent` }}
        onClick={() => showUserMenu && setShowUserMenu(false)}
      >
        <motion.div
          key={character.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">

            {/* Avatar playground — full width on mobile, 2 cols on md */}
            <div className="md:col-span-2 xl:col-span-2" style={{ minHeight: 280, height: 'clamp(280px, 30vw, 360px)' }}>
              <AvatarPlayground stats={stats} />
            </div>

            {/* Mood analytics — right column */}
            <div className="md:col-span-1">
              <MoodAnalytics stats={stats} />
            </div>

            {/* Activity timeline */}
            <div className="md:col-span-1">
              <ActivityTimeline stats={stats} />
            </div>

            {/* Character picker */}
            <div className="md:col-span-1">
              <AvatarCustomization />
            </div>

            {/* AI chat buddy */}
            <div className="md:col-span-1 xl:col-span-1" style={{ minHeight: 300 }}>
              <AIChatBuddy stats={stats} />
            </div>

            {/* Emotional heatmap — full width on small, 2 cols on md */}
            <div className="md:col-span-2 xl:col-span-2">
              <EmotionalHeatmap />
            </div>

            {/* Stats summary bar */}
            <div className="md:col-span-2 xl:col-span-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Keystrokes', value: stats.keystrokes.toLocaleString(), icon: '⌨️' },
                  { label: 'Mouse moves', value: `${(stats.mouseMoves / 1000).toFixed(1)}K`, icon: '🖱️' },
                  { label: 'Focus score', value: `${stats.focusScore}%`, icon: '🎯' },
                  { label: 'Session', value: `${stats.sessionMinutes}m`, icon: '⏱️' },
                ].map(item => (
                  <motion.div
                    key={item.label}
                    whileHover={{ y: -2 }}
                    className="rounded-2xl p-4 flex items-center gap-3"
                    style={{
                      background: character.cardBg,
                      border: `1px solid ${character.cardBorder}`,
                      boxShadow: character.cardShadow,
                      backdropFilter: 'blur(16px)',
                    }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-lg font-black" style={{ color: character.textPrimary }}>
                        {item.value}
                      </p>
                      <p className="text-[10px] font-medium" style={{ color: character.textMuted }}>
                        {item.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer
        className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2.5 flex-shrink-0 text-[11px]"
        style={{
          background: character.footerBg,
          borderTop: `1px solid ${character.headerBorder}`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-2">
          <span>{character.emoji}</span>
          <span className="font-bold" style={{ color: character.textPrimary }}>VibeBuddy AI</span>
        </div>

        {/* Desktop coming soon */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="flex items-center gap-2 rounded-full px-3 py-1"
          style={{ background: `${character.accentFrom}22`, border: `1px solid ${character.accentBorder}` }}
        >
          <span>🖥️</span>
          <span className="font-semibold tracking-wide hidden sm:inline" style={{ color: character.textSecondary }}>
            Desktop App — Coming Soon
          </span>
          <span className="sm:hidden font-semibold" style={{ color: character.textSecondary }}>Desktop — Soon</span>
          <span className="font-bold px-1.5 py-0.5 rounded-full text-[9px]"
            style={{ background: character.accentFrom, color: character.accentText }}>
            SOON
          </span>
        </motion.div>

        <div className="hidden lg:flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 bg-green-400 rounded-full"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span style={{ color: character.textMuted }}>Real-time Sync: ON</span>
          </div>
          <span style={{ color: character.textMuted }}>🔒 Secure & Private</span>
          <span style={{ color: character.textMuted }}>✨ AI Engine: Gemini 1.5 Flash</span>
        </div>
      </footer>

      <FloatingNotifications stats={stats} />
      <FloatingCompanion stats={stats} onOpenAnalytics={() => {}} />
    </div>
  );
}
