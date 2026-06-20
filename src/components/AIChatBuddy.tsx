import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import type { ActivityStats } from '../hooks/useActivityTracker';
import { useCharacter } from '../context/CharacterContext';

interface Message {
  id: number;
  text: string;
  sender: 'buddy' | 'user';
}

interface AIChatBuddyProps {
  stats: ActivityStats;
}

const responseTemplates = [
  "You've been at it for {mins} mins! 🔥 {keystrokes} keystrokes — that's legendary! Take a tiny break!",
  "Focus score of {focus}%?! You're absolutely crushing this session! 🎯",
  "I've been watching — you're in the zone! Deep work energy detected. 🚀",
  "Hey! Noticed your energy might be dipping. Stand up, shake it out! 🌿",
  "You are doing phenomenal work. {character} is proud of you! 💫",
  "Session tip: every 25 mins, rest for 5. Pomodoro keeps you sharp! ⏱️",
];

export function AIChatBuddy({ stats }: AIChatBuddyProps) {
  const { character } = useCharacter();
  const isDark = character.mode === 'dark';
  const responseIdx = useRef(0);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: stats.sessionMinutes > 0
        ? `${character.chatOpener} You've worked ${stats.sessionMinutes} mins with ${stats.keystrokes.toLocaleString()} keystrokes.`
        : `${character.chatOpener} Start a focus session and I'll track your progress!`,
      sender: 'buddy',
    },
  ]);
  const [input, setInput] = useState('');
  const [isBuddyTyping, setIsBuddyTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Reset messages when character changes
  useEffect(() => {
    setMessages([{
      id: Date.now(),
      text: `${character.chatOpener} You've worked ${stats.sessionMinutes} mins today. ${character.name} has your back!`,
      sender: 'buddy',
    }]);
  }, [character.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text?: string) => {
    const msgText = text || input;
    if (!msgText.trim()) return;

    const userMsg: Message = { id: Date.now(), text: msgText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsBuddyTyping(true);

    setTimeout(() => {
      const template = responseTemplates[responseIdx.current % responseTemplates.length];
      responseIdx.current++;
      const reply = template
        .replace('{mins}', String(stats.sessionMinutes))
        .replace('{keystrokes}', stats.keystrokes.toLocaleString())
        .replace('{focus}', String(stats.focusScore))
        .replace('{character}', character.name);

      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'buddy' }]);
      setIsBuddyTyping(false);
    }, 1000 + Math.random() * 700);
  };

  return (
    <div className="p-5 h-full flex flex-col" style={{
      background: character.cardBg,
      border: `1px solid ${character.cardBorder}`,
      boxShadow: character.cardShadow,
      borderRadius: 24,
      backdropFilter: 'blur(16px)',
    }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-2xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${character.accentFrom}44, ${character.accentTo}44)` }}>
          <Sparkles size={16} style={{ color: character.textSecondary }} />
        </div>
        <p className="font-bold text-sm" style={{ color: character.textPrimary }}>
          AI Buddy Says
        </p>
        <span className="w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-bold"
          style={{ background: `linear-gradient(135deg, ${character.accentFrom}44, ${character.accentTo}44)`, color: character.textSecondary }}>
          {character.name[0]}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0 mb-3 pr-1" style={{ maxHeight: '200px' }}>
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.sender === 'buddy' && (
                <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold flex-shrink-0 self-end"
                  style={{ background: `linear-gradient(135deg, ${character.accentFrom}55, ${character.accentTo}55)`, color: character.accentText }}>
                  {character.name[0]}
                </div>
              )}
              <div
                className="rounded-2xl px-3 py-2 max-w-[78%] text-xs font-medium leading-snug"
                style={{
                  background: msg.sender === 'buddy'
                    ? (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.85)')
                    : `linear-gradient(135deg, ${character.accentFrom}, ${character.accentTo})`,
                  color: msg.sender === 'buddy' ? character.textPrimary : character.accentText,
                  border: msg.sender === 'buddy' ? `1px solid ${character.accentBorder}` : 'none',
                  borderRadius: msg.sender === 'buddy' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {isBuddyTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2 items-end"
            >
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold"
                style={{ background: `linear-gradient(135deg, ${character.accentFrom}55, ${character.accentTo}55)`, color: character.accentText }}>
                {character.name[0]}
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1"
                style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.85)', border: `1px solid ${character.accentBorder}` }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: character.textMuted }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, delay, repeat: Infinity }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mb-2 flex-wrap">
        {['Take Break', 'How am I?', 'Motivate me'].map(q => (
          <button key={q} onClick={() => sendMessage(q)}
            className="text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all"
            style={{ background: character.accentBg, color: character.textSecondary, border: `1px solid ${character.accentBorder}` }}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder={`Chat with ${character.name}...`}
          className="flex-1 rounded-2xl px-3 py-2 text-xs font-medium focus:outline-none"
          style={{
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
            border: `1px solid ${character.accentBorder}`,
            color: character.textPrimary,
            caretColor: character.accentFrom,
          }}
        />
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => sendMessage()}
          className="w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${character.accentFrom}, ${character.accentTo})` }}>
          <Send size={13} style={{ color: character.accentText }} />
        </motion.button>
      </div>
    </div>
  );
}
