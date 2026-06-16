import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
