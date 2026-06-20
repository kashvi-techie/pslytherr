import { useState, useEffect } from 'react';
import { supabase, type FocusSession, type MoodStat } from '../lib/supabase';

export function useFocusSessions(userId: string | undefined) {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetch() {
      try {
        const { data } = await supabase
          .from('focus_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('started_at', { ascending: false })
          .limit(20);
        setSessions(data ?? []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetch();
    const interval = setInterval(fetch, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  return { sessions, loading };
}

export function useMoodStats(userId: string | undefined) {
  const [moodStats, setMoodStats] = useState<MoodStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetch() {
      try {
        // Get last 7 days of mood data
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
        const { data } = await supabase
          .from('mood_stats')
          .select('*')
          .eq('user_id', userId)
          .gte('recorded_date', sevenDaysAgo)
          .order('recorded_date', { ascending: true });
        setMoodStats(data ?? []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetch();
    const interval = setInterval(fetch, 120000);
    return () => clearInterval(interval);
  }, [userId]);

  return { moodStats, loading };
}
