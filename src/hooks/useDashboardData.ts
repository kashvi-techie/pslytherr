import { useEffect, useState } from 'react';
import { supabase, type FocusSession, type MoodStat, type Streak } from '../lib/supabase';

export interface DashboardData {
  currentStreak: number | null;
  longestStreak: number | null;
  totalFocusMinutes: number | null;
  todayFocusMinutes: number | null;
  latestSession: FocusSession | null;
  latestMood: MoodStat | null;
  sessionCount: number | null;
  hasSessionData: boolean;
}

export function useDashboardData(userId: string | undefined) {
  const [data, setData] = useState<DashboardData>({
    currentStreak: null,
    longestStreak: null,
    totalFocusMinutes: null,
    todayFocusMinutes: null,
    latestSession: null,
    latestMood: null,
    sessionCount: null,
    hasSessionData: false,
  });

  useEffect(() => {
    if (!userId) {
      setData({
        currentStreak: null,
        longestStreak: null,
        totalFocusMinutes: null,
        todayFocusMinutes: null,
        latestSession: null,
        latestMood: null,
        sessionCount: null,
        hasSessionData: false,
      });
      return;
    }

    let cancelled = false;
    const loadDashboard = async () => {
      const today = new Date().toISOString().split('T')[0];

      const [streakRes, sessionsRes, moodRes] = await Promise.all([
        supabase
          .from('streaks')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle(),
        supabase
          .from('focus_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('started_at', { ascending: false })
          .limit(10),
        supabase
          .from('mood_stats')
          .select('*')
          .eq('user_id', userId)
          .order('recorded_date', { ascending: false })
          .limit(1),
      ]);

      if (cancelled) return;

      const streak = streakRes.data as Streak | null;
      const sessions = sessionsRes.data as FocusSession[] | null;
      const mood = moodRes.data as MoodStat[] | null;

      let todayTotal = 0;
      if (sessions && sessions.length) {
        todayTotal = sessions
          .filter(session => session.started_at?.startsWith(today))
          .reduce((sum, session) => sum + (session.duration_seconds ?? 0), 0);
      }

      setData({
        currentStreak: streak?.current_streak ?? null,
        longestStreak: streak?.longest_streak ?? null,
        totalFocusMinutes: streak?.total_focus_minutes ?? null,
        todayFocusMinutes: todayTotal ? Math.floor(todayTotal / 60) : 0,
        latestSession: sessions?.[0] ?? null,
        latestMood: mood?.[0] ?? null,
        sessionCount: sessions?.length ?? 0,
        hasSessionData: Boolean(sessions && sessions.length > 0) || Boolean(streak),
      });
    };

    loadDashboard();
    const interval = setInterval(loadDashboard, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [userId]);

  return data;
}
