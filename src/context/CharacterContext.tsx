import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type CharacterId = 'piggy' | 'spidey' | 'batman' | 'cat' | 'bunny' | 'dino' | 'puppy' | 'bear';

export interface CharacterTheme {
  id: CharacterId;
  name: string;
  emoji: string;
  // App background
  appBg: string;
  // Sidebar
  sidebarBg: string;
  sidebarBorder: string;
  sidebarLogo: string;
  navActiveClass: string;
  navInactiveClass: string;
  // Cards
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  // Header
  headerBg: string;
  headerBorder: string;
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  // Accent / buttons
  accentFrom: string;
  accentTo: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  // Progress bars
  moodBarColors: string[];
  // Footer
  footerBg: string;
  // Mode
  mode: 'light' | 'dark';
  // Personality
  greeting: string;
  personality: string;
  catchphrase: string;
  hoverPhrases: string[];
  chatOpener: string;
}

const themes: Record<CharacterId, CharacterTheme> = {
  piggy: {
    id: 'piggy',
    name: 'Piggy',
    emoji: '🐷',
    appBg: 'linear-gradient(135deg, #FDF0F5 0%, #F7F4FC 40%, #EFF8F8 100%)',
    sidebarBg: 'rgba(255,255,255,0.5)',
    sidebarBorder: 'rgba(247,207,216,0.5)',
    sidebarLogo: 'from-blush-300 to-violet-400',
    navActiveClass: 'bg-blush-200 text-blush-700',
    navInactiveClass: 'text-violet-600 hover:bg-blush-50 hover:text-violet-700',
    cardBg: 'rgba(255,255,255,0.6)',
    cardBorder: 'rgba(255,255,255,0.85)',
    cardShadow: '0 8px 32px rgba(142,125,190,0.12)',
    headerBg: 'rgba(255,255,255,0.4)',
    headerBorder: 'rgba(255,255,255,0.6)',
    textPrimary: '#5b3f8c',
    textSecondary: '#8e7dbe',
    textMuted: '#b0a0cc',
    accentFrom: '#f4aec0',
    accentTo: '#8e7dbe',
    accentText: '#ffffff',
    accentBg: 'rgba(247,207,216,0.3)',
    accentBorder: 'rgba(247,207,216,0.6)',
    moodBarColors: ['from-blush-300 to-blush-400', 'from-teal-300 to-teal-400', 'from-sage-300 to-sage-400', 'from-violet-300 to-violet-400'],
    footerBg: 'rgba(255,255,255,0.4)',
    mode: 'light',
    greeting: 'Hey there!',
    personality: 'cheerful and supportive',
    catchphrase: 'Your buddy is working with you',
    hoverPhrases: ['You can do it!', 'Stay cute, stay focused!', "You're on fire!", 'Oink oink! Keep going!', 'Take a tiny break!'],
    chatOpener: "Hiii! You've been working so hard! I'm so proud of you!",
  },
  spidey: {
    id: 'spidey',
    name: 'Spidey',
    emoji: '🕷️',
    appBg: 'linear-gradient(135deg, #0d0000 0%, #1a0505 40%, #200808 100%)',
    sidebarBg: 'rgba(10,0,0,0.7)',
    sidebarBorder: 'rgba(200,30,30,0.3)',
    sidebarLogo: 'from-red-700 to-red-900',
    navActiveClass: 'bg-red-900/60 text-red-300',
    navInactiveClass: 'text-red-400/80 hover:bg-red-900/30 hover:text-red-300',
    cardBg: 'rgba(30,0,0,0.65)',
    cardBorder: 'rgba(180,30,30,0.25)',
    cardShadow: '0 8px 32px rgba(200,30,30,0.15)',
    headerBg: 'rgba(15,0,0,0.5)',
    headerBorder: 'rgba(180,30,30,0.2)',
    textPrimary: '#fca5a5',
    textSecondary: '#ef4444',
    textMuted: '#7f1d1d',
    accentFrom: '#dc2626',
    accentTo: '#991b1b',
    accentText: '#ffffff',
    accentBg: 'rgba(220,38,38,0.2)',
    accentBorder: 'rgba(220,38,38,0.4)',
    moodBarColors: ['from-red-500 to-red-600', 'from-red-400 to-orange-500', 'from-orange-400 to-yellow-500', 'from-red-600 to-red-800'],
    footerBg: 'rgba(10,0,0,0.6)',
    mode: 'dark',
    greeting: 'Hey, Hero!',
    personality: 'energetic and motivating',
    catchphrase: 'Stay sharp. Stay focused. Be unstoppable.',
    hoverPhrases: ['With great power comes great focus!', "You're swinging through it!", 'Great job, hero!', "Spidey sense says: you're crushing it!", "Don't look down, keep climbing!"],
    chatOpener: "Hey hero! Spidey's got your back! Your stats are looking legendary today!",
  },
  batman: {
    id: 'batman',
    name: 'Batman',
    emoji: '🦇',
    appBg: 'linear-gradient(135deg, #080808 0%, #101008 40%, #181410 100%)',
    sidebarBg: 'rgba(5,5,0,0.85)',
    sidebarBorder: 'rgba(200,160,0,0.25)',
    sidebarLogo: 'from-yellow-600 to-yellow-800',
    navActiveClass: 'bg-yellow-900/50 text-yellow-400',
    navInactiveClass: 'text-yellow-600/70 hover:bg-yellow-900/20 hover:text-yellow-400',
    cardBg: 'rgba(15,12,5,0.75)',
    cardBorder: 'rgba(180,140,0,0.2)',
    cardShadow: '0 8px 32px rgba(200,160,0,0.1)',
    headerBg: 'rgba(8,6,0,0.6)',
    headerBorder: 'rgba(180,140,0,0.15)',
    textPrimary: '#fbbf24',
    textSecondary: '#d97706',
    textMuted: '#78350f',
    accentFrom: '#d97706',
    accentTo: '#92400e',
    accentText: '#000000',
    accentBg: 'rgba(217,119,6,0.2)',
    accentBorder: 'rgba(217,119,6,0.4)',
    moodBarColors: ['from-yellow-500 to-yellow-600', 'from-yellow-400 to-amber-500', 'from-amber-400 to-orange-500', 'from-yellow-600 to-yellow-800'],
    footerBg: 'rgba(5,5,0,0.7)',
    mode: 'dark',
    greeting: 'Good evening.',
    personality: 'stoic and disciplined',
    catchphrase: 'Discipline today. Strength tomorrow.',
    hoverPhrases: ['Gotham needs your focus.', 'I am the night. You are the deadline.', 'Stay focused. Gotham counts on you.', 'Discipline is your superpower.', 'The Dark Knight never quits.'],
    chatOpener: 'Batman does not rest. Neither should you stop making progress. Your current data speaks.',
  },
  cat: {
    id: 'cat', name: 'Catto', emoji: '🐱',
    appBg: 'linear-gradient(135deg, #F0F5FD 0%, #E8F0FC 40%, #EEF5F0 100%)',
    sidebarBg: 'rgba(255,255,255,0.5)', sidebarBorder: 'rgba(200,210,240,0.5)',
    sidebarLogo: 'from-blue-300 to-teal-400',
    navActiveClass: 'bg-blue-100 text-blue-700', navInactiveClass: 'text-blue-500 hover:bg-blue-50',
    cardBg: 'rgba(255,255,255,0.6)', cardBorder: 'rgba(255,255,255,0.85)', cardShadow: '0 8px 32px rgba(100,150,220,0.12)',
    headerBg: 'rgba(255,255,255,0.4)', headerBorder: 'rgba(200,215,240,0.5)',
    textPrimary: '#1e3a6e', textSecondary: '#3b82f6', textMuted: '#93c5fd',
    accentFrom: '#60a5fa', accentTo: '#3b82f6', accentText: '#ffffff', accentBg: 'rgba(96,165,250,0.15)', accentBorder: 'rgba(96,165,250,0.4)',
    moodBarColors: ['from-blue-300 to-blue-400', 'from-teal-300 to-teal-400', 'from-cyan-300 to-cyan-400', 'from-blue-400 to-blue-600'],
    footerBg: 'rgba(255,255,255,0.4)', mode: 'light',
    greeting: 'Purr-fect day!', personality: 'calm and curious',
    catchphrase: 'Curiosity never killed the coder', hoverPhrases: ['Meow! Stay focused!', "You're purr-fect!", 'Curiosity = innovation!', 'Keep coding, kitty!'],
    chatOpener: 'Mreow! Look at you go! Your session stats are just purrfect!',
  },
  bunny: {
    id: 'bunny', name: 'Bunny', emoji: '🐰',
    appBg: 'linear-gradient(135deg, #FEF0FF 0%, #F9F0FF 40%, #F0FFF4 100%)',
    sidebarBg: 'rgba(255,255,255,0.5)', sidebarBorder: 'rgba(230,200,255,0.5)',
    sidebarLogo: 'from-purple-300 to-pink-400',
    navActiveClass: 'bg-purple-100 text-purple-700', navInactiveClass: 'text-purple-500 hover:bg-purple-50',
    cardBg: 'rgba(255,255,255,0.6)', cardBorder: 'rgba(255,255,255,0.85)', cardShadow: '0 8px 32px rgba(180,130,220,0.12)',
    headerBg: 'rgba(255,255,255,0.4)', headerBorder: 'rgba(230,200,255,0.5)',
    textPrimary: '#5b21b6', textSecondary: '#8b5cf6', textMuted: '#c4b5fd',
    accentFrom: '#a78bfa', accentTo: '#7c3aed', accentText: '#ffffff', accentBg: 'rgba(167,139,250,0.15)', accentBorder: 'rgba(167,139,250,0.4)',
    moodBarColors: ['from-purple-300 to-purple-400', 'from-pink-300 to-pink-400', 'from-violet-300 to-violet-400', 'from-purple-400 to-purple-600'],
    footerBg: 'rgba(255,255,255,0.4)', mode: 'light',
    greeting: 'Hop to it!', personality: 'bubbly and energetic',
    catchphrase: 'Hopping into productivity mode!', hoverPhrases: ['Hop hop! You got this!', 'Keep bouncing forward!', "You're ear-resistible!", 'Hoppy coding time!'],
    chatOpener: 'Hop hop! You are bouncing through this session so well!',
  },
  dino: {
    id: 'dino', name: 'Dino', emoji: '🦕',
    appBg: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 40%, #F0FFF4 100%)',
    sidebarBg: 'rgba(255,255,255,0.5)', sidebarBorder: 'rgba(170,240,200,0.5)',
    sidebarLogo: 'from-green-400 to-teal-500',
    navActiveClass: 'bg-green-100 text-green-700', navInactiveClass: 'text-green-600 hover:bg-green-50',
    cardBg: 'rgba(255,255,255,0.6)', cardBorder: 'rgba(255,255,255,0.85)', cardShadow: '0 8px 32px rgba(60,180,120,0.12)',
    headerBg: 'rgba(255,255,255,0.4)', headerBorder: 'rgba(170,240,200,0.5)',
    textPrimary: '#14532d', textSecondary: '#16a34a', textMuted: '#86efac',
    accentFrom: '#4ade80', accentTo: '#16a34a', accentText: '#ffffff', accentBg: 'rgba(74,222,128,0.15)', accentBorder: 'rgba(74,222,128,0.4)',
    moodBarColors: ['from-green-300 to-green-400', 'from-teal-300 to-teal-400', 'from-emerald-300 to-emerald-400', 'from-green-400 to-green-600'],
    footerBg: 'rgba(255,255,255,0.4)', mode: 'light',
    greeting: 'RAWR! Ready?', personality: 'prehistoric and powerful',
    catchphrase: 'Rawr-some focus activated!', hoverPhrases: ['RAWR! You are unstoppable!', 'Prehistoric power activated!', 'Dino-mite session!', 'Even dinos take breaks!'],
    chatOpener: 'RAWR! Dino is watching over your session! You are doing DINO-MITE today!',
  },
  puppy: {
    id: 'puppy', name: 'Puppy', emoji: '🐶',
    appBg: 'linear-gradient(135deg, #FFFBF0 0%, #FFF8E8 40%, #FFF5F0 100%)',
    sidebarBg: 'rgba(255,255,255,0.5)', sidebarBorder: 'rgba(255,220,150,0.5)',
    sidebarLogo: 'from-orange-300 to-amber-400',
    navActiveClass: 'bg-orange-100 text-orange-700', navInactiveClass: 'text-orange-500 hover:bg-orange-50',
    cardBg: 'rgba(255,255,255,0.6)', cardBorder: 'rgba(255,255,255,0.85)', cardShadow: '0 8px 32px rgba(240,160,60,0.12)',
    headerBg: 'rgba(255,255,255,0.4)', headerBorder: 'rgba(255,220,150,0.5)',
    textPrimary: '#7c2d12', textSecondary: '#ea580c', textMuted: '#fed7aa',
    accentFrom: '#fb923c', accentTo: '#ea580c', accentText: '#ffffff', accentBg: 'rgba(251,146,60,0.15)', accentBorder: 'rgba(251,146,60,0.4)',
    moodBarColors: ['from-orange-300 to-orange-400', 'from-amber-300 to-amber-400', 'from-yellow-300 to-yellow-400', 'from-orange-400 to-orange-600'],
    footerBg: 'rgba(255,255,255,0.4)', mode: 'light',
    greeting: 'Woof woof!', personality: 'loyal and enthusiastic',
    catchphrase: "Fetching productivity, one task at a time!", hoverPhrases: ['Woof! You got this!', "I'm rooting for you, buddy!", 'Tail-waggingly good work!', 'Fetch that deadline!'],
    chatOpener: 'WOOF WOOF! Your best friend here! Your work session is fetching amazing results!',
  },
  bear: {
    id: 'bear', name: 'Bear', emoji: '🐻',
    appBg: 'linear-gradient(135deg, #FDF8F0 0%, #FAF5E8 40%, #F5F0E8 100%)',
    sidebarBg: 'rgba(255,255,255,0.5)', sidebarBorder: 'rgba(200,180,140,0.4)',
    sidebarLogo: 'from-amber-500 to-amber-700',
    navActiveClass: 'bg-amber-100 text-amber-800', navInactiveClass: 'text-amber-700 hover:bg-amber-50',
    cardBg: 'rgba(255,255,255,0.6)', cardBorder: 'rgba(255,255,255,0.85)', cardShadow: '0 8px 32px rgba(160,120,60,0.12)',
    headerBg: 'rgba(255,255,255,0.4)', headerBorder: 'rgba(200,180,140,0.4)',
    textPrimary: '#451a03', textSecondary: '#92400e', textMuted: '#d4a76a',
    accentFrom: '#b45309', accentTo: '#78350f', accentText: '#ffffff', accentBg: 'rgba(180,83,9,0.15)', accentBorder: 'rgba(180,83,9,0.4)',
    moodBarColors: ['from-amber-400 to-amber-500', 'from-amber-300 to-amber-400', 'from-yellow-400 to-amber-400', 'from-amber-500 to-amber-700'],
    footerBg: 'rgba(255,255,255,0.4)', mode: 'light',
    greeting: 'Growl... Ready!', personality: 'calm and steady',
    catchphrase: 'Slow and steady wins the sprint!', hoverPhrases: ['Bear hug for your hard work!', 'Steady and strong!', 'Hibernate later, focus now!', 'Unbearably good work!'],
    chatOpener: 'Growl! Big Bear is checking your session stats. You are doing unbearably well!',
  },
};

interface CharacterContextValue {
  character: CharacterTheme;
  setCharacter: (id: CharacterId) => void;
  allCharacters: CharacterTheme[];
}

const CharacterContext = createContext<CharacterContextValue | null>(null);

export function CharacterProvider({
  children,
  initialCharacterId = 'piggy',
}: {
  children: ReactNode;
  initialCharacterId?: CharacterId;
}) {
  const [characterId, setCharacterId] = useState<CharacterId>(initialCharacterId);

  const setCharacter = useCallback((id: CharacterId) => {
    setCharacterId(id);
  }, []);

  return (
    <CharacterContext.Provider value={{
      character: themes[characterId],
      setCharacter,
      allCharacters: Object.values(themes),
    }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error('useCharacter must be used within CharacterProvider');
  return ctx;
}
