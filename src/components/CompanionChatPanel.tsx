import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, ExternalLink } from 'lucide-react';
import { useCharacter } from '../context/CharacterContext';
import type { ActivityStats } from '../hooks/useActivityTracker';

interface Message {
  id: number;
  text: string;
  sender: 'character' | 'user';
  isLink?: boolean;
  linkText?: string;
  linkUrl?: string;
}

interface CompanionChatPanelProps {
  stats: ActivityStats;
  onClose: () => void;
  position: { x: number; y: number };
}

function generateResponse(character: ReturnType<typeof useCharacter>['character'], userMsg: string, stats: ActivityStats): Message {
  const name = character.name;
  const lower = userMsg.toLowerCase();
  let text = '';
  let isLink = false;
  let linkText = '';
  let linkUrl = '';

  if (lower.includes('break') || lower.includes('rest') || lower.includes('tired')) {
    text = `${character.emoji} Absolutely! You've been working for ${stats.sessionMinutes} minutes. A 5-minute break will recharge you. Step away, stretch, drink water. I'll be right here!`;
  } else if (lower.includes('how am i') || lower.includes('stats') || lower.includes('progress') || lower.includes('data')) {
    text = `${character.emoji} Your session stats look ${stats.focusScore > 75 ? 'incredible' : 'solid'}! Focus score: ${stats.focusScore}%, keystrokes: ${stats.keystrokes.toLocaleString()}, session time: ${stats.sessionMinutes} mins. You're ${stats.mood === 'focused' ? 'in deep flow state!' : 'doing great!'}`;
  } else if (lower.includes('stress') || lower.includes('anxiety') || lower.includes('pressure')) {
    text = `${character.emoji} I sense some stress! ${name === 'Piggy' ? 'Oink oink, deep breath!' : name === 'Spidey' ? 'Even Spider-Man takes a moment!' : 'Even Batman meditates.'} Try 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s. You've got this!`;
  } else if (lower.includes('motivation') || lower.includes('give up') || lower.includes('cant') || lower.includes("can't")) {
    text = `${character.emoji} ${character.hoverPhrases[0]} You've already put in ${stats.sessionMinutes} minutes of real work today. That's not nothing — that's everything. Keep going!`;
  } else if (lower.includes('water') || lower.includes('drink') || lower.includes('hydrat')) {
    text = `${character.emoji} YES! Hydration is productivity fuel! Drink a full glass right now. Your brain is 75% water — keep it topped up!`;
  } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    text = `${character.emoji} ${character.chatOpener} I'm always watching over your session. What do you need?`;
  } else {
    // Simulate web search suggestion
    const query = encodeURIComponent(userMsg);
    isLink = true;
    linkText = `Search "${userMsg.slice(0, 30)}..."`;
    linkUrl = `https://www.google.com/search?q=${query}`;
    text = `${character.emoji} Great question! I've found some resources for you. Also — you've been focused for ${stats.sessionMinutes} mins today, so your brain is sharp enough to tackle this!`;
  }

  return { id: Date.now() + 1, text, sender: 'character', isLink, linkText, linkUrl };
}

export function CompanionChatPanel({ stats, onClose, position }: CompanionChatPanelProps) {
  const { character } = useCharacter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTypingIndicator, setIsTypingIndicator] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isDark = character.mode === 'dark';

  useEffect(() => {
    // Opening message from character
    const opener: Message = {
      id: Date.now(),
      text: `${character.chatOpener} You've been working for ${stats.sessionMinutes} minutes today with ${stats.keystrokes.toLocaleString()} keystrokes. Focus score: ${stats.focusScore}%. ${stats.focusScore > 70 ? 'Absolutely crushing it!' : 'Steady progress, keep going!'} Ask me anything or take a break — your call!`,
      sender: 'character',
    };
    setMessages([opener]);
  }, [character.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
    const captured = input;
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTypingIndicator(true);

    setTimeout(() => {
      const reply = generateResponse(character, captured, stats);
      setMessages(prev => [...prev, reply]);
      setIsTypingIndicator(false);
    }, 900 + Math.random() * 600);
  };

  // Position panel to the left of the companion
  const panelX = Math.max(10, position.x - 310);
  const panelY = Math.max(10, position.y - 200);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.88, x: 20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 250 }}
      style={{
        position: 'fixed',
        left: panelX,
        top: panelY,
        width: 300,
        height: 420,
        zIndex: 9998,
        background: isDark ? 'rgba(15,8,8,0.97)' : 'rgba(255,255,255,0.97)',
        border: `1px solid ${character.accentBorder}`,
        borderRadius: 24,
        boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        backdropFilter: 'blur(24px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
        borderBottom: `1px solid ${character.accentBorder}`,
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: `linear-gradient(135deg, ${character.accentFrom}, ${character.accentTo})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0,
        }}>
          {character.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: character.textPrimary }}>
            {character.name}
          </p>
          <p style={{ margin: 0, fontSize: 10, color: character.textMuted }}>
            {character.personality} companion
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 28, height: 28, borderRadius: 10, border: 'none', background: character.accentBg,
            color: character.textSecondary, cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', gap: 8 }}>
            {msg.sender === 'character' && (
              <div style={{
                width: 28, height: 28, borderRadius: 10, flexShrink: 0, alignSelf: 'flex-end',
                background: `linear-gradient(135deg, ${character.accentFrom}, ${character.accentTo})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              }}>
                {character.emoji}
              </div>
            )}
            <div style={{
              maxWidth: '80%',
              background: msg.sender === 'character'
                ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.85)')
                : `linear-gradient(135deg, ${character.accentFrom}, ${character.accentTo})`,
              borderRadius: msg.sender === 'character' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
              padding: '9px 12px',
              fontSize: 11.5,
              fontWeight: 500,
              lineHeight: 1.5,
              color: msg.sender === 'character' ? character.textPrimary : character.accentText,
              border: msg.sender === 'character' ? `1px solid ${character.accentBorder}` : 'none',
            }}>
              {msg.text}
              {msg.isLink && msg.linkUrl && (
                <a
                  href={msg.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4, marginTop: 6,
                    fontSize: 10.5, fontWeight: 600, color: character.textSecondary,
                    textDecoration: 'none',
                  }}
                >
                  <ExternalLink size={11} />
                  {msg.linkText}
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTypingIndicator && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 10, flexShrink: 0,
              background: `linear-gradient(135deg, ${character.accentFrom}, ${character.accentTo})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>
              {character.emoji}
            </div>
            <div style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.85)',
              borderRadius: '16px 16px 16px 4px', padding: '12px 16px',
              border: `1px solid ${character.accentBorder}`,
              display: 'flex', gap: 4,
            }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: character.textMuted }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, delay: i * 0.15, repeat: Infinity }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div style={{ padding: '0 14px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {["How am I doing?", "I need a break", "Motivate me!"].map(q => (
          <button
            key={q}
            onClick={() => { setInput(q); }}
            style={{
              padding: '5px 10px', borderRadius: 10, border: `1px solid ${character.accentBorder}`,
              background: character.accentBg, color: character.textSecondary,
              fontSize: 10, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'center',
        borderTop: `1px solid ${character.accentBorder}`,
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)',
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder={`Ask ${character.name} anything...`}
          style={{
            flex: 1, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
            border: `1px solid ${character.accentBorder}`, borderRadius: 14,
            padding: '8px 12px', fontSize: 11.5, color: character.textPrimary,
            outline: 'none', fontFamily: 'inherit',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            width: 34, height: 34, borderRadius: 12, border: 'none',
            background: `linear-gradient(135deg, ${character.accentFrom}, ${character.accentTo})`,
            color: character.accentText, cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Send size={13} />
        </button>
      </div>
    </motion.div>
  );
}
