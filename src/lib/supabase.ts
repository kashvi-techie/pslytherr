import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use PKCE flow instead of implicit flow.
    // Implicit flow passes the token in the URL hash fragment which can be
    // lost on certain hosting platforms (Vercel, Netlify) or when the page
    // reloads before the JS listener processes it.
    // PKCE flow passes a `code` query parameter and exchanges it server-side,
    // which is far more reliable.
    flowType: 'pkce',

    // Auto-refresh tokens before they expire
    autoRefreshToken: true,

    // Detect session from URL on load — critical for OAuth redirects
    detectSessionInUrl: true,

    // Persist session in localStorage (default) so it survives reloads
    persistSession: true,
  },
});

// ─── Types ──────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  companion_id: string;
  display_name: string | null;
  avatar_url: string | null;
  coins: number;
  created_at: string;
  updated_at: string;
}

export interface FocusSession {
  id: string;
  user_id: string;
  duration_seconds: number;
  keystrokes: number;
  mouse_moves: number;
  focus_score: number;
  mood: string;
  started_at: string;
  completed_at: string | null;
}

export interface MoodStat {
  id: string;
  user_id: string;
  recorded_date: string;
  happiness: number;
  focus_level: number;
  energy: number;
  stress: number;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  total_focus_minutes: number;
}
