import { motion } from 'framer-motion';
import {
  LayoutDashboard, Heart, Activity, BarChart2, Bell,
  Focus, Palette, Settings, ChevronRight, Sparkles,
} from 'lucide-react';
import { useCharacter } from '../context/CharacterContext';
import { useAuth } from '../context/AuthContext';
import { CharacterSticker } from './CharacterSticker';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Heart, label: 'My Buddy', id: 'buddy' },
  { icon: Sparkles, label: 'Mood Hub', id: 'mood' },
  { icon: Activity, label: 'Activity', id: 'activity' },
  { icon: BarChart2, label: 'Insights', id: 'insights' },
  { icon: Bell, label: 'Reminders', id: 'reminders' },
  { icon: Focus, label: 'Focus Mode', id: 'focus' },
  { icon: Palette, label: 'Customization', id: 'customization' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { character } = useCharacter();
  const { profile, user } = useAuth();
  const isDark = character.mode === 'dark';
  const displayName = profile?.display_name ?? user?.email?.split('@')[0] ?? 'Learner';
  const coins = profile?.coins ?? 0;

  return (
    <aside
      className="w-56 flex-shrink-0 h-screen sticky top-0 flex flex-col"
      style={{
        background: character.sidebarBg,
        borderRight: `1px solid ${character.sidebarBorder}`,
        backdropFilter: 'blur(20px)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
      }}
    >
      {/* Logo */}
      <div className="p-5 pb-4">
        <motion.div
          key={character.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
            <CharacterSticker characterId={character.id} size={36} />
          </div>
          <div>
            <p className="font-bold text-base leading-tight" style={{ color: character.textPrimary }}>
              Pslyther
            </p>
            <p className="text-[10px] font-medium" style={{ color: character.textMuted }}>
              AI Workspace
            </p>
          </div>
        </motion.div>
      </div>

      {/* Character quick-switch */}
      <div className="px-3 mb-2">
        <div
          className="rounded-2xl px-3 py-2 flex items-center gap-2"
          style={{ background: character.accentBg, border: `1px solid ${character.accentBorder}` }}
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <CharacterSticker characterId={character.id} size={24} />
          </div>
          <p className="text-xs font-semibold flex-1 truncate" style={{ color: character.textPrimary }}>
            {character.name}
          </p>
          <span className="text-[9px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: character.accentBorder, color: character.textSecondary }}>
            Active
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSectionChange(item.id)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer select-none w-full text-left"
              style={{
                background: isActive ? character.accentBg : 'transparent',
                color: isActive ? character.textPrimary : character.textMuted,
                border: isActive ? `1px solid ${character.accentBorder}` : '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = character.accentBg + '88';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <Icon size={16} style={{ color: isActive ? character.textSecondary : character.textMuted }} />
              <span style={{ fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="p-3 space-y-2">
        {/* Buddy Coins */}
        <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5"
          style={{ background: character.accentBg, border: `1px solid ${character.accentBorder}` }}>
          <div className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={character.accentFrom} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v12M8 10h8M8 14h8"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-medium leading-none" style={{ color: character.textMuted }}>
              Buddy Coins
            </p>
            <p className="text-sm font-bold" style={{ color: character.textPrimary }}>{coins.toLocaleString()}</p>
          </div>
          <div className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: character.accentFrom }}>
            <ChevronRight size={10} className="text-white" />
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${character.accentFrom}, ${character.accentTo})` }}>
            {displayName[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: character.textPrimary }}>
              {displayName}
            </p>
            <p className="text-[10px]" style={{ color: character.textMuted }}>Pslyther User</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[9px] font-medium" style={{ color: character.textMuted }}>
            Pslyther v1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
}
