import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { useCharacter, type CharacterId } from '../context/CharacterContext';
import { useAuth } from '../context/AuthContext';
import { CharacterSticker } from './CharacterSticker';

export function AvatarCustomization() {
  const { character, setCharacter, allCharacters } = useCharacter();
  const { updateProfile } = useAuth();

  return (
    <div className="p-5 h-full flex flex-col" style={{
      background: character.cardBg,
      border: `1px solid ${character.cardBorder}`,
      boxShadow: character.cardShadow,
      borderRadius: 24,
      backdropFilter: 'blur(16px)',
    }}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={15} style={{ color: character.textSecondary }} />
        <p className="font-bold text-sm" style={{ color: character.textPrimary }}>
          Choose Your Buddy
        </p>
      </div>

      {/* Currently active character */}
      <motion.div
        key={character.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-3 mb-3 flex items-center gap-3"
        style={{
          background: `linear-gradient(135deg, ${character.accentFrom}22, ${character.accentTo}22)`,
          border: `1px solid ${character.accentBorder}`,
        }}
      >
        <div className="w-12 h-12 flex items-center justify-center">
          <CharacterSticker characterId={character.id} size={48} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: character.textPrimary }}>
            {character.name}
          </p>
          <p className="text-[10px] truncate" style={{ color: character.textMuted }}>
            {character.catchphrase}
          </p>
        </div>
        <div className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: character.accentFrom }}>
          <Check size={10} className="text-white" strokeWidth={3} />
        </div>
      </motion.div>

      {/* Character grid */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {allCharacters.map((char, idx) => {
          const isSelected = character.id === char.id;
          return (
            <motion.button
              key={char.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                setCharacter(char.id as CharacterId);
                updateProfile({ companion_id: char.id });
              }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl cursor-pointer border-2 transition-all duration-200"
              style={{
                borderColor: isSelected ? character.accentFrom : 'transparent',
                background: isSelected
                  ? `${character.accentFrom}22`
                  : character.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
              }}
            >
              <div className="relative w-12 h-12 flex items-center justify-center">
                <CharacterSticker characterId={char.id} size={48} />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
                    style={{ background: character.accentFrom }}
                  >
                    <Check size={8} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </div>
              <span className="text-[9px] font-semibold text-center leading-tight"
                style={{ color: isSelected ? character.textPrimary : character.textMuted }}>
                {char.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Theme preview */}
      <AnimatePresence mode="wait">
        <motion.div
          key={character.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl p-3 text-center mt-auto"
          style={{
            background: `linear-gradient(135deg, ${character.accentFrom}18, ${character.accentTo}18)`,
            border: `1px solid ${character.accentBorder}`,
          }}
        >
          <p className="text-xs font-semibold" style={{ color: character.textPrimary }}>
            {character.name} — {character.greeting}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: character.textMuted }}>
            {character.catchphrase}
          </p>
          <div className="flex gap-1 justify-center mt-2">
            {[character.accentFrom, character.accentTo, character.textSecondary].map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
