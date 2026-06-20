import { useState, useEffect, useCallback, useRef } from 'react';

export interface ActivityStats {
  keystrokes: number;
  mouseMoves: number;
  focusScore: number;
  isTyping: boolean;
  typingIntensity: 'idle' | 'light' | 'moderate' | 'intense';
  mood: 'happy' | 'focused' | 'stressed' | 'tired';
  sessionMinutes: number;
}

export function useActivityTracker() {
  const [stats, setStats] = useState<ActivityStats>({
    keystrokes: 0,
    mouseMoves: 0,
    focusScore: 0,
    isTyping: false,
    typingIntensity: 'idle',
    mood: 'happy',
    sessionMinutes: 0,
  });

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const keystrokeBuffer = useRef<number[]>([]);
  const sessionStart = useRef(Date.now());

  const updateMood = useCallback((intensity: ActivityStats['typingIntensity']): ActivityStats['mood'] => {
    if (intensity === 'intense') return 'stressed';
    if (intensity === 'moderate') return 'focused';
    if (intensity === 'light') return 'happy';
    return 'tired';
  }, []);

  const handleKeyDown = useCallback(() => {
    const now = Date.now();
    keystrokeBuffer.current.push(now);
    keystrokeBuffer.current = keystrokeBuffer.current.filter(t => now - t < 5000);

    const rate = keystrokeBuffer.current.length;
    const intensity: ActivityStats['typingIntensity'] =
      rate > 20 ? 'intense' : rate > 10 ? 'moderate' : rate > 2 ? 'light' : 'idle';

    setStats(prev => ({
      ...prev,
      keystrokes: prev.keystrokes + 1,
      isTyping: true,
      typingIntensity: intensity,
      mood: updateMood(intensity),
    }));

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setStats(prev => ({ ...prev, isTyping: false, typingIntensity: 'idle' }));
    }, 1500);
  }, [updateMood]);

  const handleMouseMove = useCallback(() => {
    setStats(prev => ({ ...prev, mouseMoves: prev.mouseMoves + 1 }));
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleKeyDown, handleMouseMove]);

  // Update session timer every minute and compute focus score from recent activity
  useEffect(() => {
    const interval = setInterval(() => {
      const recentKeys = keystrokeBuffer.current.length;
      // Focus score: 0-100 based on sustained typing activity in last 5s window
      const computedFocus = Math.min(100, Math.round(recentKeys * 2.5));
      setStats(prev => ({
        ...prev,
        sessionMinutes: Math.floor((Date.now() - sessionStart.current) / 60000),
        focusScore: computedFocus,
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}
