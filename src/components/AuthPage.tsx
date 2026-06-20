import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const companionInitials = ['P', 'S', 'B', 'C', 'B', 'D'];
const companionColors = ['#f4aec0', '#dc2626', '#d97706', '#60a5fa', '#a78bfa', '#4ade80'];

export function AuthPage() {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FDF0F5 0%, #F0F4FF 50%, #EFF8F8 100%)' }}
    >
      {/* Floating background characters */}
      {companionInitials.map((initial, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none rounded-full flex items-center justify-center font-black"
          style={{
            fontSize: 24 + (i % 3) * 8,
            left: `${8 + i * 15}%`,
            top: `${12 + (i % 4) * 22}%`,
            opacity: 0.12,
            width: 50 + (i % 3) * 12,
            height: 50 + (i % 3) * 12,
            background: companionColors[i],
            color: 'white',
          }}
          animate={{ y: [0, -18, 0], rotate: [0, 6, -6, 0] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        >
          {initial}
        </motion.div>
      ))}

      {/* Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #f4aec055, transparent)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #8e7dbe55, transparent)' }} />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full mx-4"
        style={{ maxWidth: 420 }}
      >
        <div
          className="rounded-3xl p-8 sm:p-10"
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.95)',
            boxShadow: '0 24px 80px rgba(142,125,190,0.18), 0 4px 16px rgba(0,0,0,0.06)',
          }}
        >
          {/* Logo area */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                style={{ background: 'linear-gradient(135deg, #f4aec0, #8e7dbe)', fontSize: 28, fontWeight: 900, color: 'white' }}>
                P
              </div>
            </motion.div>
            <h1 className="text-3xl font-black text-[#5b3f8c] mb-1 tracking-tight">
              Pslyther
            </h1>
            <p className="text-sm font-medium text-[#8e7dbe]">
              Your AI-powered focus companion
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: '🎯', label: 'Focus Tracking' },
              { icon: '💗', label: 'Mood Insights' },
              { icon: '🔥', label: 'Daily Streaks' },
            ].map(f => (
              <div
                key={f.label}
                className="text-center rounded-2xl p-3"
                style={{ background: 'rgba(247,207,216,0.3)', border: '1px solid rgba(247,207,216,0.6)' }}
              >
                <div className="text-xl mb-1">{f.icon}</div>
                <p className="text-[10px] font-semibold text-[#8e7dbe] leading-tight">{f.label}</p>
              </div>
            ))}
          </div>

          {/* Sign in button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-2xl py-3.5 px-5 font-bold text-sm transition-all"
            style={{
              background: 'white',
              border: '1.5px solid rgba(0,0,0,0.12)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              color: '#1f1f1f',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {/* Google logo SVG */}
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
              <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.32-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
              <path fill="#FBBC05" d="M11.68 28.18A13.9 13.9 0 0 1 10.8 24c0-1.45.25-2.86.68-4.18v-5.7H4.34A23.93 23.93 0 0 0 0 24c0 3.86.92 7.51 2.56 10.75l7.12-5.52z" />
              <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.34 5.7c1.74-5.2 6.59-9.07 12.32-9.07z"/>
            </svg>
            {loading ? 'Connecting...' : 'Continue with Google'}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.08)' }} />
            <span className="text-xs font-medium text-[#b0a0cc]">or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.08)' }} />
          </div>

          {/* Email note */}
          <p className="text-center text-xs font-medium text-[#b0a0cc] leading-relaxed">
            Sign in to sync your focus sessions, streaks, and companion across devices.
          </p>

          {/* Companion row */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {companionInitials.map((initial, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                style={{ background: companionColors[i] }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, delay: i * 0.25, repeat: Infinity }}
              >
                {initial}
              </motion.div>
            ))}
          </div>
          <p className="text-center text-[10px] font-medium text-[#c4b5f0] mt-2">
            8 companions waiting for you
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-[#b0a0cc] mt-4 font-medium">
          By continuing you agree to Pslyther's Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
