import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { ActivityStats } from './useActivityTracker';

/**
 * Saves focus sessions and mood stats to Supabase.
 * Called from Dashboard when a user is authenticated.
 */
export function useFocusPersistence(userId: string | undefined, stats: ActivityStats) {
  const sessionIdRef = useRef<string | null>(null);
  const sessionStartRef = useRef<string>(new Date().toISOString());
  const lastSaveRef = useRef<number>(Date.now());
  const hasSavedMoodTodayRef = useRef(false);

  // Create or update focus session every 5 minutes
  useEffect(() => {
    if (!userId) return;

    const SAVE_INTERVAL = 5 * 60 * 1000; // 5 minutes

    const interval = setInterval(async () => {
      if (stats.sessionMinutes < 1) return;
      const now = Date.now();
      if (now - lastSaveRef.current < SAVE_INTERVAL) return;
      lastSaveRef.current = now;

      try {
        if (!sessionIdRef.current) {
          // Create new session record
          const { data } = await supabase
            .from('focus_sessions')
            .insert({
              user_id: userId,
              duration_seconds: stats.sessionMinutes * 60,
              keystrokes: stats.keystrokes,
              mouse_moves: stats.mouseMoves,
              focus_score: stats.focusScore,
              mood: stats.mood,
              started_at: sessionStartRef.current,
            })
            .select('id')
            .maybeSingle();
          if (data?.id) sessionIdRef.current = data.id;
        } else {
          // Update existing session
          await supabase
            .from('focus_sessions')
            .update({
              duration_seconds: stats.sessionMinutes * 60,
              keystrokes: stats.keystrokes,
              mouse_moves: stats.mouseMoves,
              focus_score: stats.focusScore,
              mood: stats.mood,
            })
            .eq('id', sessionIdRef.current);
        }

        // Update streak
        await updateStreak(userId, stats.sessionMinutes);
      } catch (e) {
        console.warn('Session save failed:', e);
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [userId, stats]);

  // Save mood stats once per day
  useEffect(() => {
    if (!userId || hasSavedMoodTodayRef.current || stats.sessionMinutes < 5) return;
    hasSavedMoodTodayRef.current = true;

    const today = new Date().toISOString().split('T')[0];
    const moodValues = {
      happiness: stats.mood === 'happy' ? 88 : stats.mood === 'focused' ? 82 : 65,
      focus_level: stats.focusScore,
      energy: stats.typingIntensity === 'intense' ? 75 : 61,
      stress: stats.typingIntensity === 'intense' ? 48 : stats.typingIntensity === 'moderate' ? 26 : 18,
    };

    supabase
      .from('mood_stats')
      .upsert({
        user_id: userId,
        recorded_date: today,
        ...moodValues,
      }, { onConflict: 'user_id,recorded_date' })
      .then(({ error }) => {
        if (error) console.warn('Mood save failed:', error.message);
      });
  }, [userId, stats.sessionMinutes]);
}

async function updateStreak(userId: string, sessionMinutes: number) {
  const { data: existing } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (!existing) return;

  const today = new Date().toISOString().split('T')[0];
  const lastActive = existing.last_active_date;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let newStreak = existing.current_streak;
  if (lastActive === today) {
    // Already counted today
  } else if (lastActive === yesterday) {
    newStreak = existing.current_streak + 1;
  } else {
    newStreak = 1; // Streak broken, restart
  }

  const newLongest = Math.max(existing.longest_streak, newStreak);
  const newTotal = existing.total_focus_minutes + sessionMinutes;

  await supabase
    .from('streaks')
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_active_date: today,
      total_focus_minutes: newTotal,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);
}
