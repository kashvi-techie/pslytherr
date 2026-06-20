import { useState, useEffect } from 'react';
import { supabase, type Streak } from '../lib/supabase';

export function useStreakData(userId: string | undefined) {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchStreak() {
      try {
        const { data } = await supabase
          .from('streaks')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        setStreak(data);
      } catch {
        // silently fail — streak will remain null
      } finally {
        setLoading(false);
      }
    }

    fetchStreak();

    // Poll every 60s so streak updates propagate
    const interval = setInterval(fetchStreak, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  return { streak, loading };
}
