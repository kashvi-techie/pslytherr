import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, type UserProfile } from '../lib/supabase';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<UserProfile, 'companion_id' | 'coins'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function createOrFetchProfile(user: User): Promise<UserProfile | null> {
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (existing) return existing;

  const { data: created, error } = await supabase
    .from('user_profiles')
    .insert({
      id: user.id,
      display_name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Learner',
      avatar_url: user.user_metadata?.avatar_url ?? null,
      companion_id: 'piggy',
      coins: 0,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Profile creation error:', error);
    return null;
  }
  return created;
}

async function ensureStreak(userId: string) {
  const { data } = await supabase
    .from('streaks')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (!data) {
    await supabase.from('streaks').insert({
      user_id: userId,
      current_streak: 0,
      longest_streak: 0,
      total_focus_minutes: 0,
    });
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => {
          const p = await createOrFetchProfile(session.user);
          setProfile(p);
          await ensureStreak(session.user.id);
        })();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      (async () => {
        if (session?.user) {
          const p = await createOrFetchProfile(session.user);
          setProfile(p);
          await ensureStreak(session.user.id);
        } else {
          setProfile(null);
        }
        if (event === 'INITIAL_SESSION') setLoading(false);
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Pick<UserProfile, 'companion_id' | 'coins'>>) => {
    if (!user) return;
    const { data } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .maybeSingle();
    if (data) setProfile(data);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signInWithGoogle, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
