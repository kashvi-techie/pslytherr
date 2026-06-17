import { motion } from 'framer-motion';
import {
  LayoutDashboard, Heart, Activity, BarChart2, Bell,
  Focus, Palette, Settings, ChevronRight, Sparkles,
} from 'lucide-react';
import { useCharacter, type CharacterId } from '../context/CharacterContext';

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
  const isDark = character.mode === 'dark';

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
          <div
            className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${character.sidebarLogo} flex items-center justify-center shadow-md flex-shrink-0`}
          >
            <span className="text-lg">{character.emoji}</span>
          </div>
          <div>
            <p className="font-bold text-base leading-tight" style={{ color: character.textPrimary }}>
              Pslyther
            </p>
            <p className="text-[10px] font-medium" style={{ color: character.textMuted }}>
              AI Workspace ✨
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
          <span className="text-sm">{character.emoji}</span>
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
          <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)' }}>
            😊
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-medium leading-none" style={{ color: character.textMuted }}>
              Buddy Coins
            </p>
            <p className="text-sm font-bold" style={{ color: character.textPrimary }}>1,250</p>
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
            K
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: character.textPrimary }}>
              
            </p>
            <p className="text-[10px]" style={{ color: character.textMuted }}>Premium User 👑</p>
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
