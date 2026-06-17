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
  const { data: existing, error: selectError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (existing) return existing;

  if (selectError) {
    console.warn('[Auth] Profile select error, retrying:', selectError.message);
    await new Promise(r => setTimeout(r, 600));
    const { data: retry } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (retry) return retry;
  }

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
    console.warn('[Auth] Profile insert error:', insertError.message);
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

  const profileLoadingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function initAuth() {
      // ── Step 1: Check for OAuth code in URL ──
      // If the URL has a `code` param (PKCE flow), exchange it FIRST.
      // This is the most reliable way to establish a session after OAuth redirect.
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        console.log('[Auth] Found OAuth code in URL, exchanging...');
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error('[Auth] Code exchange failed:', exchangeError.message);
        } else {
          console.log('[Auth] Code exchange succeeded');
          // Clean the URL to remove the code param so it doesn't get reused
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, '', cleanUrl);
        }
      }

      // ── Step 2: Get the current session ──
      // After exchanging the code (or if no code), getSession() will return
      // the established session. This also processes any remaining hash fragments.
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('[Auth] getSession error:', sessionError.message);
      }

      console.log('[Auth] getSession result:', currentSession ? 'session present' : 'null');

      if (cancelled) return;

      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);

        // Load profile
        profileLoadingRef.current = true;
        try {
          const p = await createOrFetchProfile(currentSession.user);
          if (!cancelled) setProfile(p);
          await ensureStreak(currentSession.user.id);
        } catch (err) {
          console.warn('[Auth] Profile init failed:', err);
        } finally {
          profileLoadingRef.current = false;
        }
      }

      if (!cancelled) setLoading(false);
    }

    initAuth();

    // ── Step 3: Listen for subsequent auth changes ──
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('[Auth] onAuthStateChange:', event, newSession ? 'session present' : 'null');

        if (cancelled) return;

        // Skip INITIAL_SESSION — we already handled it in getSession above
        if (event === 'INITIAL_SESSION') return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'SIGNED_OUT' || !newSession) {
          setProfile(null);
          return;
        }

        if (newSession?.user && !profileLoadingRef.current) {
          profileLoadingRef.current = true;
          (async () => {
            try {
              const p = await createOrFetchProfile(newSession.user);
              if (!cancelled) setProfile(p);
              await ensureStreak(newSession.user.id);
            } catch (err) {
              console.warn('[Auth] Profile refresh failed:', err);
            } finally {
              profileLoadingRef.current = false;
            }
          })();
        }
      }
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
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
