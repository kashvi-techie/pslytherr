import { motion } from 'framer-motion';
import { CharacterProvider, useCharacter } from './context/CharacterContext';
import { Dashboard } from './components/Dashboard';

function ThemedApp() {
  const { character } = useCharacter();

  return (
    <motion.div
      key={character.id + '-app'}
      className="flex h-screen overflow-hidden"
      style={{ background: character.appBg }}
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <main className="flex-1 flex flex-col overflow-hidden">
        <Dashboard />
      </main>
    </motion.div>
  );
}

function App() {
  return (
    <CharacterProvider>
      <ThemedApp />
    </CharacterProvider>
  );
}

export default App;
