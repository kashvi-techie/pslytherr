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
    keystrokes: 12400,
    mouseMoves: 3200,
    focusScore: 84,
    isTyping: false,
    typingIntensity: 'idle',
    mood: 'happy',
    sessionMinutes: 47,
  });

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const keystrokeBuffer = useRef<number[]>([]);
  const sessionStart = useRef(Date.now() - 47 * 60 * 1000);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        sessionMinutes: Math.floor((Date.now() - sessionStart.current) / 60000),
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}
