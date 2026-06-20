import { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CharacterProvider, useCharacter, type CharacterId } from './context/CharacterContext';
import { Dashboard } from './components/Dashboard';
import { AuthPage } from './components/AuthPage';
import { Onboarding } from './components/Onboarding';
import { CharacterSticker } from './components/CharacterSticker';

function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #FDF0F5, #F7F4FC, #EFF8F8)' }}
    >
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ marginBottom: 20 }}
      >
        <CharacterSticker characterId="piggy" size={80} />
      </motion.div>
      <p className="text-sm font-semibold" style={{ color: '#8e7dbe' }}>
        Loading Pslyther...
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

function ProtectedApp() {
  const { user, profile, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Wait until auth state is resolved
  if (loading) return <LoadingScreen />;

  // No user = show sign-in
  if (!user) {
    return (
      <motion.div
        key="auth-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AuthPage />
      </motion.div>
    );
  }

  // User is authenticated — show dashboard even if profile hasn't loaded yet.
  // Profile may be null briefly after OAuth redirect; it'll populate async.
  const companionId = (profile?.companion_id ?? 'piggy') as CharacterId;

  // Check if this is a first-time user (no display name set yet)
  const isFirstTimeUser = !profile?.display_name || profile.display_name === 'Learner';

  if (isFirstTimeUser && showOnboarding) {
    return (
      <CharacterProvider initialCharacterId={companionId}>
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      </CharacterProvider>
    );
  }

  return (
    <CharacterProvider initialCharacterId={companionId}>
      <ThemedApp />
    </CharacterProvider>
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
