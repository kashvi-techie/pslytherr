/*
# Pslyther Core Schema

## Overview
Creates the core multi-user schema for Pslyther — all data is scoped per authenticated user via RLS.

## New Tables

### user_profiles
Extends auth.users with app-specific data.
- id: matches auth.users.id (no separate user_id column needed — IS the key)
- companion_id: the selected character slug (piggy, spidey, batman, etc.)
- display_name: display name pulled from Google OAuth
- avatar_url: profile photo from Google OAuth
- coins: gamification currency earned by focusing
- created_at, updated_at: timestamps

### focus_sessions
One row per completed focus session.
- id: uuid primary key
- user_id: owner (DEFAULT auth.uid(), FK to auth.users)
- duration_seconds: total session length
- keystrokes: keyboard activity count
- mouse_moves: mouse activity count
- focus_score: calculated 0-100 score
- mood: detected mood string (happy/focused/stressed/tired)
- started_at: when the session began
- completed_at: when the session ended (null = in-progress)

### mood_stats
Daily mood snapshot per user.
- id: uuid primary key
- user_id: owner
- recorded_date: the calendar date (date type, not timestamp)
- happiness, focus_level, energy, stress: 0-100 integer scores
- Unique constraint on (user_id, recorded_date) so one row per day

### streaks
Per-user streak counters.
- id: uuid primary key
- user_id: unique (one row per user)
- current_streak: days in a row with at least one focus session
- longest_streak: all-time best streak
- last_active_date: the last date a session was completed
- total_focus_minutes: lifetime total

## Security
RLS enabled on all tables. Authenticated users can only access their own rows.
All policies use auth.uid() for ownership checks.
*/

-- ─── USER PROFILES ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  companion_id text NOT NULL DEFAULT 'piggy',
  display_name text,
  avatar_url text,
  coins integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
CREATE POLICY "select_own_profile" ON user_profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
CREATE POLICY "insert_own_profile" ON user_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
CREATE POLICY "update_own_profile" ON user_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON user_profiles;
CREATE POLICY "delete_own_profile" ON user_profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── FOCUS SESSIONS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS focus_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_seconds integer NOT NULL DEFAULT 0,
  keystrokes integer NOT NULL DEFAULT 0,
  mouse_moves integer NOT NULL DEFAULT 0,
  focus_score integer NOT NULL DEFAULT 0 CHECK (focus_score >= 0 AND focus_score <= 100),
  mood text NOT NULL DEFAULT 'focused',
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS focus_sessions_user_id_idx ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS focus_sessions_started_at_idx ON focus_sessions(started_at DESC);

ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_sessions" ON focus_sessions;
CREATE POLICY "select_own_sessions" ON focus_sessions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_sessions" ON focus_sessions;
CREATE POLICY "insert_own_sessions" ON focus_sessions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_sessions" ON focus_sessions;
CREATE POLICY "update_own_sessions" ON focus_sessions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_sessions" ON focus_sessions;
CREATE POLICY "delete_own_sessions" ON focus_sessions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ─── MOOD STATS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mood_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  recorded_date date NOT NULL DEFAULT CURRENT_DATE,
  happiness integer NOT NULL DEFAULT 75 CHECK (happiness >= 0 AND happiness <= 100),
  focus_level integer NOT NULL DEFAULT 70 CHECK (focus_level >= 0 AND focus_level <= 100),
  energy integer NOT NULL DEFAULT 65 CHECK (energy >= 0 AND energy <= 100),
  stress integer NOT NULL DEFAULT 20 CHECK (stress >= 0 AND stress <= 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, recorded_date)
);

CREATE INDEX IF NOT EXISTS mood_stats_user_date_idx ON mood_stats(user_id, recorded_date DESC);

ALTER TABLE mood_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_mood" ON mood_stats;
CREATE POLICY "select_own_mood" ON mood_stats FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_mood" ON mood_stats;
CREATE POLICY "insert_own_mood" ON mood_stats FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_mood" ON mood_stats;
CREATE POLICY "update_own_mood" ON mood_stats FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_mood" ON mood_stats;
CREATE POLICY "delete_own_mood" ON mood_stats FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ─── STREAKS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_active_date date,
  total_focus_minutes integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_streak" ON streaks;
CREATE POLICY "select_own_streak" ON streaks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_streak" ON streaks;
CREATE POLICY "insert_own_streak" ON streaks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_streak" ON streaks;
CREATE POLICY "update_own_streak" ON streaks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_streak" ON streaks;
CREATE POLICY "delete_own_streak" ON streaks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
