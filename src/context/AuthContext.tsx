import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
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
  // Try fetching first — profile may already exist from a previous login
  const { data: existing, error: selectError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (existing) return existing;

  // If select failed with RLS error, the JWT might not be ready yet.
  // Retry once after a short delay.
  if (selectError) {
    await new Promise(r => setTimeout(r, 500));
    const { data: retry } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (retry) return retry;
  }

  // Create new profile
  const { data: created, error: insertError } = await supabase
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

  if (insertError) {
    // INSERT may fail with unique violation if a concurrent call already created it.
    // Fall back to SELECT.
    const { data: fallback } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    return fallback ?? null;
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
    // Use .select() after insert to verify it landed
    await supabase.from('streaks').insert({
      user_id: userId,
      current_streak: 0,
      longest_streak: 0,
      total_focus_minutes: 0,
    }).select('id').maybeSingle();
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Track whether we've resolved the initial auth state
  const initialResolved = useRef(false);

  useEffect(() => {
    // Do NOT call getSession() here.
    // onAuthStateChange fires INITIAL_SESSION synchronously on subscribe,
    // which is the authoritative source for the current session.
    // Calling getSession() in parallel creates a race: it may resolve before
    // the OAuth hash fragment is exchanged, setting user=null and loading=false
    // prematurely, which flashes the login screen.

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[Auth] event:', event, 'session:', session ? 'present' : 'null');

        // Synchronous state updates
        setSession(session);
        setUser(session?.user ?? null);

        // Determine if initial resolution is done
        const isInitialEvent = event === 'INITIAL_SESSION';
        const isSignInEvent = event === 'SIGNED_IN';
        const isSignOutEvent = event === 'SIGNED_OUT';

        if (isSignOutEvent) {
          setProfile(null);
          if (!initialResolved.current) {
            initialResolved.current = true;
            setLoading(false);
          }
          return;
        }

        // Async profile work — must be wrapped to avoid deadlock in onAuthStateChange
        (async () => {
          if (session?.user) {
            try {
              const p = await createOrFetchProfile(session.user);
              setProfile(p);
              await ensureStreak(session.user.id);
            } catch (err) {
              console.warn('[Auth] Profile init failed:', err);
              // Don't nuke the session — the user is still signed in.
              // They just won't have a profile object yet.
            }
          } else {
            setProfile(null);
          }

          // Mark loading complete after the first real resolution
          if (!initialResolved.current) {
            initialResolved.current = true;
            setLoading(false);
          }
        })();
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (error) {
      console.error('[Auth] Google OAuth error:', error.message);
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Pick<UserProfile, 'companion_id' | 'coins'>>) => {
    if (!user) return;
    const { data } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .maybeSingle();
    if (data) setProfile(data);
  }, [user]);

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
