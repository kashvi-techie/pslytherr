import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CharacterProvider, useCharacter, type CharacterId } from './context/CharacterContext';
import { Dashboard } from './components/Dashboard';
import { AuthPage } from './components/AuthPage';

function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #FDF0F5, #F7F4FC, #EFF8F8)' }}
    >
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: 64, marginBottom: 20 }}
      >
        🐷
      </motion.div>
      <p className="text-sm font-semibold" style={{ color: '#8e7dbe' }}>
        Loading VibeBuddy...
      </p>
      <div className="flex gap-1.5 mt-4">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: '#f4aec0' }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}

// Inner app — must be inside CharacterProvider
function ThemedApp() {
  const { character } = useCharacter();
  return (
    <motion.div
      key={character.id + '-root'}
      className="flex h-screen overflow-hidden"
      style={{ background: character.appBg }}
      initial={{ opacity: 0.85 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Dashboard />
      </main>
    </motion.div>
  );
}

// Route guard — reads auth, shows AuthPage or the protected app
function ProtectedApp() {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="auth-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AuthPage />
        </motion.div>
      </AnimatePresence>
    );
  }

  const companionId = (profile?.companion_id ?? 'piggy') as CharacterId;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="contents"
      >
        <CharacterProvider initialCharacterId={companionId}>
          <ThemedApp />
        </CharacterProvider>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProtectedApp />
    </AuthProvider>
  );
}

export default App;
