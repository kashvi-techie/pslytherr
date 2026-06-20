import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, BarChart2, X, ChevronRight } from 'lucide-react';
import { useCharacter } from '../context/CharacterContext';
import type { ActivityStats } from '../hooks/useActivityTracker';
import { CompanionChatPanel } from './CompanionChatPanel';
import { CharacterSticker } from './CharacterSticker';
import type { CompanionState } from './CompanionCard';

interface FloatingCompanionProps {
  stats: ActivityStats;
  onOpenAnalytics: () => void;
}

const menuItems = [
  { icon: MessageCircle, key: 'chat',      label: (name: string) => `Talk to ${name}` },
  { icon: BarChart2,     key: 'analytics', label: () => 'See Analytics' },
  { icon: X,             key: 'quit',      label: () => 'Quit Companion' },
];

function getFloatingState(stats: ActivityStats): CompanionState {
  if (stats.isTyping && stats.typingIntensity === 'intense') return 'focus';
  if (stats.isTyping) return 'focus';
  if (stats.mood === 'stressed') return 'sad';
  return 'idle';
}

export function FloatingCompanion({ stats, onOpenAnalytics }: FloatingCompanionProps) {
  const { character } = useCharacter();
  const [visible, setVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [mouseAngle, setMouseAngle] = useState(0);
  const [pos, setPos] = useState({ x: window.innerWidth - 220, y: window.innerHeight - 270 });
  const [isDragging, setIsDragging] = useState(false);
  const companionRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const phraseIdx = useRef(0);
  const STICKER_SIZE = 170;
  const companionState = getFloatingState(stats);

  // Mouse angle tracking for eye direction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!companionRef.current) return;
      const rect = companionRef.current.getBoundingClientRect();
      // Head is roughly in the top ~45% of the sticker
      const headCx = rect.left + rect.width * 0.565;
      const headCy = rect.top + rect.height * 0.34;
      setMouseAngle(Math.atan2(e.clientY - headCy, e.clientX - headCx));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Hover speech rotation
  useEffect(() => {
    if (!isHovered) { setSpeechText(''); return; }
    const phrases = character.hoverPhrases;
    setSpeechText(phrases[phraseIdx.current % phrases.length]);
    phraseIdx.current++;
    const interval = setInterval(() => {
      setSpeechText(phrases[phraseIdx.current % phrases.length]);
      phraseIdx.current++;
    }, 2800);
    return () => clearInterval(interval);
  }, [isHovered, character]);

  // Drag handling
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (showMenu || showChat) return;
    setIsDragging(true);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  }, [pos, showMenu, showChat]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPos({
        x: Math.max(10, Math.min(window.innerWidth - STICKER_SIZE - 10, e.clientX - dragOffset.current.x)),
        y: Math.max(10, Math.min(window.innerHeight - STICKER_SIZE - 20, e.clientY - dragOffset.current.y)),
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isDragging]);

  const handleClick = useCallback(() => {
    if (isDragging) return;
    setShowMenu(m => !m);
    setShowChat(false);
  }, [isDragging]);

  // Re-show when character changes
  useEffect(() => {
    setVisible(true);
    setShowMenu(false);
    setShowChat(false);
  }, [character.id]);

  if (!visible) return null;

  const isDark = character.mode === 'dark';

  return (
    <>
      <div
        ref={companionRef}
        style={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          zIndex: 9999,
          userSelect: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          width: STICKER_SIZE,
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Speech bubble (hover) */}
        <AnimatePresence>
          {isHovered && speechText && !showMenu && !showChat && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.88 }}
              transition={{ duration: 0.18 }}
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 4px)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: isDark ? 'rgba(20,10,10,0.97)' : 'rgba(255,255,255,0.97)',
                border: `1.5px solid ${character.accentBorder}`,
                borderRadius: 16,
                padding: '8px 14px',
                fontSize: 11,
                fontWeight: 700,
                color: character.textPrimary,
                whiteSpace: 'nowrap',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                pointerEvents: 'none',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              {speechText}
              {/* Tail */}
              <div style={{
                position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)',
                width: 0, height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: `7px solid ${isDark ? 'rgba(20,10,10,0.97)' : 'rgba(255,255,255,0.97)'}`,
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Context menu */}
        <AnimatePresence>
          {showMenu && !showChat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                right: 0,
                background: isDark ? 'rgba(12,5,5,0.98)' : 'rgba(255,255,255,0.98)',
                border: `1px solid ${character.accentBorder}`,
                borderRadius: 22,
                padding: 8,
                width: 210,
                boxShadow: '0 20px 60px rgba(0,0,0,0.28)',
                backdropFilter: 'blur(24px)',
                cursor: 'default',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
              onMouseDown={e => e.stopPropagation()}
            >
              {/* Character name row */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px 10px',
                borderBottom: `1px solid ${character.accentBorder}`,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
                  background: `linear-gradient(135deg, ${character.accentFrom}55, ${character.accentTo}55)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800,
                  color: character.accentText,
                }}>
                  {character.name[0]}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: character.textPrimary }}>
                    {character.name}
                  </p>
                  <p style={{ margin: 0, fontSize: 10, color: character.textMuted }}>
                    Your AI companion
                  </p>
                </div>
              </div>

              <div style={{ padding: '6px 0' }}>
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isQuit = item.key === 'quit';
                  return (
                    <button
                      key={item.key}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: '100%', padding: '10px 14px',
                        background: 'transparent', border: 'none', borderRadius: 14,
                        cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
                        color: isQuit ? '#ef4444' : character.textPrimary,
                        transition: 'background 0.15s',
                        textAlign: 'left', fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = isQuit
                          ? 'rgba(239,68,68,0.1)'
                          : character.accentBg;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                      }}
                      onClick={() => {
                        setShowMenu(false);
                        if (item.key === 'chat') setShowChat(true);
                        if (item.key === 'analytics') onOpenAnalytics();
                        if (item.key === 'quit') setVisible(false);
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Icon size={15} />
                        {item.label(character.name)}
                      </span>
                      {!isQuit && <ChevronRight size={13} style={{ color: character.textMuted }} />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The character sticker */}
        <motion.div
          key={character.id}
          onClick={handleClick}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          initial={{ scale: 0, rotate: -15, y: 30 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          transition={{ type: 'spring', damping: 10, stiffness: 180, delay: 0.2 }}
          style={{ position: 'relative', display: 'block' }}
        >
          {/* Glow ring when typing */}
          <AnimatePresence>
            {stats.isTyping && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.06, 1] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  inset: -12,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${character.accentFrom}55, transparent 68%)`,
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>

          {/* Sticker with animations */}
          <motion.div
            animate={
              stats.isTyping
                ? {
                    y: [0, -8, -14, -8, -4, -10, -6, 0],
                    rotate: [0, -1.5, 1.5, -1, 0.5, -1, 0],
                  }
                : {
                    y: [0, -8, 0],
                    rotate: [0, 0.5, 0],
                  }
            }
            transition={
              stats.isTyping
                ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
            }
            style={{ position: 'relative', zIndex: 1 }}
          >
            <CharacterSticker
              characterId={character.id}
              size={STICKER_SIZE}
              mouseAngle={mouseAngle}
              isTyping={stats.isTyping}
              state={companionState}
            />
          </motion.div>

          {/* Online status dot */}
          <motion.div
            animate={{ scale: [1, 1.35, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              position: 'absolute',
              bottom: 26,
              right: 4,
              width: 13,
              height: 13,
              borderRadius: '50%',
              background: stats.isTyping ? '#22c55e' : '#94a3b8',
              border: '2.5px solid white',
              zIndex: 3,
              boxShadow: stats.isTyping ? '0 0 8px #22c55e' : 'none',
              transition: 'background 0.4s, box-shadow 0.4s',
            }}
          />

          {/* Typing indicator dots below sticker */}
          <AnimatePresence>
            {stats.isTyping && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 3,
                  zIndex: 3,
                }}
              >
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [1, 2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.35, delay: i * 0.07, repeat: Infinity }}
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 2,
                      background: character.accentFrom,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {showChat && (
          <CompanionChatPanel
            stats={stats}
            onClose={() => setShowChat(false)}
            position={{ x: pos.x, y: pos.y }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
