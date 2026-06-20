import { type CSSProperties } from 'react';
import type { CompanionState } from './CompanionCard';

interface CharacterStickerProps {
  characterId: string;
  size?: number;
  mouseAngle?: number;
  isTyping?: boolean;
  state?: CompanionState;
  style?: CSSProperties;
}

function pupilOffset(angle: number, maxR: number) {
  return {
    dx: Math.cos(angle) * maxR,
    dy: Math.sin(angle) * maxR,
  };
}

// ─── PREMIUM GAMING CHAIR ───────────────────────────────────────────────────

function PremiumGamingChair() {
  return (
    <g>
      {/* Chair base shadow */}
      <ellipse cx="144" cy="218" rx="45" ry="8" fill="rgba(0,0,0,0.15)" />
      
      {/* Chair base / star */}
      <ellipse cx="144" cy="214" rx="42" ry="7" fill="#1a1a1a" />
      <ellipse cx="144" cy="212" rx="38" ry="5" fill="#2a2a2a" />
      
      {/* Chair pole */}
      <rect x="140" y="176" width="8" height="36" rx="3" fill="#2a2a2a" />
      <rect x="142" y="176" width="4" height="36" rx="2" fill="#3a3a3a" />
      
      {/* Chair wheels */}
      <circle cx="108" cy="216" r="6" fill="#1a1a1a" />
      <circle cx="108" cy="215" r="4" fill="#2a2a2a" />
      <circle cx="180" cy="216" r="6" fill="#1a1a1a" />
      <circle cx="180" cy="215" r="4" fill="#2a2a2a" />
      <circle cx="126" cy="218" r="5" fill="#1a1a1a" />
      <circle cx="162" cy="218" r="5" fill="#1a1a1a" />

      {/* Chair back - outer shell */}
      <rect x="98" y="28" width="92" height="130" rx="22" fill="#1a1a1a" />
      <rect x="102" y="32" width="84" height="122" rx="18" fill="#2a2a2a" />
      
      {/* Chair back - padding */}
      <rect x="108" y="38" width="72" height="110" rx="14" fill="#3a3a3a" />
      <rect x="112" y="42" width="64" height="102" rx="12" fill="#4a4a4a" />
      
      {/* Chair stitching */}
      <line x1="144" y1="42" x2="144" y2="140" stroke="#3a3a3a" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />
      
      {/* Chair headrest */}
      <rect x="118" y="36" width="52" height="20" rx="10" fill="#5a5a5a" />
      <rect x="122" y="40" width="44" height="12" rx="6" fill="#6a6a6a" />

      {/* Chair seat */}
      <rect x="86" y="152" width="116" height="28" rx="14" fill="#1a1a1a" />
      <rect x="90" y="154" width="108" height="22" rx="12" fill="#2a2a2a" />
      <rect x="94" y="156" width="100" height="16" rx="10" fill="#3a3a3a" />

      {/* Left armrest */}
      <rect x="72" y="132" width="28" height="24" rx="12" fill="#2a2a2a" />
      <rect x="76" y="134" width="20" height="16" rx="8" fill="#3a3a3a" />
      <rect x="78" y="136" width="16" height="8" rx="4" fill="#4a4a4a" />

      {/* Right armrest */}
      <rect x="188" y="132" width="28" height="24" rx="12" fill="#2a2a2a" />
      <rect x="192" y="134" width="20" height="16" rx="8" fill="#3a3a3a" />
      <rect x="194" y="136" width="16" height="8" rx="4" fill="#4a4a4a" />
    </g>
  );
}

// ─── PREMIUM LAPTOP ─────────────────────────────────────────────────────────

function PremiumLaptop({ isTyping = false }: { isTyping?: boolean }) {
  return (
    <g>
      {/* Laptop screen - outer */}
      <polygon points="18,156 112,150 118,76 24,82" fill="#4a4a4a" />
      <polygon points="22,153 108,148 114,80 28,85" fill="#5a5a5a" />
      
      {/* Laptop screen - display */}
      <polygon points="26,150 104,145 110,84 32,88" fill="#1e293b" />
      
      {/* Screen content glow */}
      <polygon points="28,148 102,143 108,86 34,90" fill="url(#screenGradient)" opacity="0.9" />
      
      {/* Screen content lines */}
      <g opacity="0.6">
        <line x1="38" y1="100" x2="82" y2="97" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="38" y1="108" x2="92" y2="105" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="38" y1="116" x2="76" y2="114" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
        {isTyping && (
          <rect x="38" y="122" width="2" height="8" fill="#60a5fa" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0;0.8" dur="1s" repeatCount="indefinite" />
          </rect>
        )}
      </g>
      
      {/* Screen reflection */}
      <polygon points="34,90 72,88 72,102 32,104" fill="rgba(255,255,255,0.08)" />
      
      {/* Camera */}
      <circle cx="20" cy="80" r="3" fill="#3a3a3a" />
      <circle cx="20" cy="80" r="1.5" fill="#1a1a1a" />

      {/* Laptop base */}
      <polygon points="18,156 112,150 124,172 30,178" fill="#4a4a4a" />
      <polygon points="22,156 108,151 118,168 34,173" fill="#3a3a3a" />
      
      {/* Keyboard keys */}
      <g fill="#2a2a2a" opacity="0.9">
        {[0, 1, 2].map(row => (
          [0, 1, 2, 3, 4, 5, 6].map(col => (
            <rect
              key={`${row}-${col}`}
              x={30 + col * 11 + row * 2}
              y={156 + row * 4}
              width="8"
              height="3"
              rx="1"
              fill={isTyping && Math.random() > 0.6 ? '#4a4a4a' : '#2a2a2a'}
            />
          ))
        ))}
      </g>
      
      {/* Trackpad */}
      <rect x="58" y="168" width="32" height="4" rx="2" fill="#3a3a3a" />
      
      {/* Laptop edge highlight */}
      <line x1="18" y1="156" x2="112" y2="150" stroke="#5a5a5a" strokeWidth="1" />
    </g>
  );
}

// ─── PREMIUM PIGGY CHARACTER ────────────────────────────────────────────────

function PremiumPiggyHead({ mouseAngle, state = 'idle' }: { mouseAngle: number; state?: CompanionState }) {
  const { dx, dy } = pupilOffset(mouseAngle, 5);
  const isSleeping = state === 'sleep';
  const isSad = state === 'sad';
  const isHappy = state === 'happy' || state === 'levelUp';

  return (
    <g>
      {/* Ears */}
      <ellipse cx="72" cy="36" rx="18" ry="24" fill="#f8b4c8" />
      <ellipse cx="154" cy="36" rx="18" ry="24" fill="#f8b4c8" />
      <ellipse cx="72" cy="36" rx="10" ry="16" fill="#fca4bc" />
      <ellipse cx="154" cy="36" rx="10" ry="16" fill="#fca4bc" />
      
      {/* Head */}
      <circle cx="113" cy="78" r="54" fill="#ffc4d6" />
      <circle cx="113" cy="78" r="52" fill="#ffd4e2" />
      
      {/* Cheek blush */}
      <ellipse cx="82" cy="88" rx="14" ry="9" fill="#ffb3c9" opacity="0.7" />
      <ellipse cx="144" cy="88" rx="14" ry="9" fill="#ffb3c9" opacity="0.7" />
      
      {/* Eye whites */}
      <ellipse cx="92" cy="70" rx="16" ry="18" fill="white" />
      <ellipse cx="134" cy="70" rx="16" ry="18" fill="white" />
      
      {/* Eye outlines */}
      <ellipse cx="92" cy="70" rx="16" ry="18" fill="none" stroke="#e89ab0" strokeWidth="1.5" />
      <ellipse cx="134" cy="70" rx="16" ry="18" fill="none" stroke="#e89ab0" strokeWidth="1.5" />
      
      {/* Pupils - state-based */}
      {isSleeping ? (
        <>
          <line x1="78" y1="70" x2="106" y2="70" stroke="#2d1a1a" strokeWidth="3" strokeLinecap="round" />
          <line x1="120" y1="70" x2="148" y2="70" stroke="#2d1a1a" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={92 + dx} cy={70 + dy} r="7" fill="#2d1a1a" />
          <circle cx={134 + dx} cy={70 + dy} r="7" fill="#2d1a1a" />
          
          {/* Star highlights */}
          <circle cx={87 + dx * 0.3} cy={64 + dy * 0.3} r="3.5" fill="white" opacity="0.95" />
          <circle cx={129 + dx * 0.3} cy={64 + dy * 0.3} r="3.5" fill="white" opacity="0.95" />
          
          {/* Small highlights */}
          <circle cx={95 + dx * 0.3} cy={74 + dy * 0.3} r="2" fill="white" opacity="0.8" />
          <circle cx={137 + dx * 0.3} cy={74 + dy * 0.3} r="2" fill="white" opacity="0.8" />
        </>
      )}
      
      {/* Blink eyelids */}
      {!isSleeping && (
        <>
          <ellipse className="blink-lid" cx="92" cy="70" rx="16" ry="0" fill="#ffc4d6" />
          <ellipse className="blink-lid" cx="134" cy="70" rx="16" ry="0" fill="#ffc4d6" />
        </>
      )}
      
      {/* Snout */}
      <ellipse cx="113" cy="94" rx="18" ry="14" fill="#fca4bc" />
      <circle cx="106" cy="94" r="4.5" fill="#e896b2" />
      <circle cx="120" cy="94" r="4.5" fill="#e896b2" />
      
      {/* Mouth - state-based */}
      {isSad ? (
        <path d="M 104 108 Q 113 102 122 108" fill="none" stroke="#d080a0" strokeWidth="2.5" strokeLinecap="round" />
      ) : isHappy ? (
        <path d="M 100 106 Q 113 118 126 106" fill="none" stroke="#d080a0" strokeWidth="2.5" strokeLinecap="round" />
      ) : (
        <path d="M 104 106 Q 113 112 122 106" fill="none" stroke="#d080a0" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </g>
  );
}

function PremiumPiggyBody() {
  return (
    <g>
      {/* Hoodie body */}
      <ellipse cx="142" cy="162" rx="46" ry="34" fill="#f8b4c8" />
      <ellipse cx="142" cy="168" rx="22" ry="12" fill="#fca4bc" />
      
      {/* Hoodie hood */}
      <path d="M 96 140 Q 90 130 95 120 Q 100 115 113 115 Q 126 115 131 120 Q 136 130 130 140 Z" fill="#f8b4c8" />
      
      {/* Left arm */}
      <path d="M 100 158 Q 82 156 65 154 Q 56 156 58 164 Q 62 168 72 166 Q 84 166 96 164 Z" fill="#f8b4c8" />
      <ellipse cx="60" cy="162" rx="10" ry="7" fill="#fca4bc" />
      
      {/* Right arm */}
      <path d="M 172 158 Q 182 156 192 156 Q 196 162 192 167 Q 184 167 174 164 Z" fill="#f8b4c8" />
      <ellipse cx="193" cy="162" rx="8" ry="6" fill="#fca4bc" />
      
      {/* Left leg */}
      <path d="M 112 178 Q 96 190 80 204 Q 74 211 66 209 Q 64 202 74 196 Q 88 188 104 178 Z" fill="#fca4bc" />
      <ellipse cx="63" cy="211" rx="15" ry="8" fill="#f8b4c8" />
      
      {/* Right leg */}
      <path d="M 155 178 Q 160 190 158 204 Q 155 211 148 209 Q 144 202 146 192 Q 148 184 155 178 Z" fill="#fca4bc" />
      <ellipse cx="150" cy="211" rx="13" ry="8" fill="#f8b4c8" />
    </g>
  );
}

// ─── PREMIUM SPIDEY CHARACTER ───────────────────────────────────────────────

function PremiumSpideyHead({ mouseAngle, state = 'idle' }: { mouseAngle: number; state?: CompanionState }) {
  const { dx, dy } = pupilOffset(mouseAngle, 6);
  const isSleeping = state === 'sleep';
  const leftEyeCenter = { x: 90, y: 68 };
  const rightEyeCenter = { x: 136, y: 68 };

  return (
    <g>
      {/* Head */}
      <circle cx="113" cy="74" r="56" fill="#dc2626" stroke="#1a0000" strokeWidth="3" />
      
      {/* Web pattern */}
      <g stroke="#880000" strokeWidth="1.2" opacity="0.6" fill="none">
        <line x1="113" y1="18" x2="113" y2="130" />
        <line x1="57" y1="74" x2="169" y2="74" />
        <line x1="73" y1="32" x2="153" y2="116" />
        <line x1="153" y1="32" x2="73" y2="116" />
        <line x1="63" y1="52" x2="163" y2="96" />
        <line x1="163" y1="52" x2="63" y2="96" />
        <circle cx="113" cy="74" r="20" />
        <circle cx="113" cy="74" r="36" />
        <circle cx="113" cy="74" r="52" />
      </g>
      
      {/* Head highlight */}
      <ellipse cx="92" cy="44" rx="24" ry="14" fill="rgba(255,255,255,0.2)" transform="rotate(-15 92 44)" />
      
      {/* Eye lenses - state-based */}
      {isSleeping ? (
        <>
          <line x1="74" y1="68" x2="106" y2="68" stroke="#111" strokeWidth="3" strokeLinecap="round" transform="rotate(-18 90 68)" />
          <line x1="120" y1="68" x2="152" y2="68" stroke="#111" strokeWidth="3" strokeLinecap="round" transform="rotate(18 136 68)" />
        </>
      ) : (
        <>
          {/* Left eye */}
          <ellipse cx={leftEyeCenter.x} cy={leftEyeCenter.y} rx="22" ry="17" fill="white" transform={`rotate(-18 ${leftEyeCenter.x} ${leftEyeCenter.y})`} />
          <ellipse cx={leftEyeCenter.x} cy={leftEyeCenter.y} rx="22" ry="17" fill="none" stroke="#1a0000" strokeWidth="2.5" transform={`rotate(-18 ${leftEyeCenter.x} ${leftEyeCenter.y})`} />
          <ellipse
            cx={leftEyeCenter.x + dx * 0.8}
            cy={leftEyeCenter.y + dy * 0.8}
            rx="11" ry="10"
            fill="#111"
            transform={`rotate(-18 ${leftEyeCenter.x + dx * 0.8} ${leftEyeCenter.y + dy * 0.8})`}
          />
          <ellipse cx={82 + dx * 0.2} cy={62 + dy * 0.2} rx="8" ry="6" fill="rgba(255,255,255,0.4)" transform="rotate(-15 82 62)" />
          
          {/* Right eye */}
          <ellipse cx={rightEyeCenter.x} cy={rightEyeCenter.y} rx="22" ry="17" fill="white" transform={`rotate(18 ${rightEyeCenter.x} ${rightEyeCenter.y})`} />
          <ellipse cx={rightEyeCenter.x} cy={rightEyeCenter.y} rx="22" ry="17" fill="none" stroke="#1a0000" strokeWidth="2.5" transform={`rotate(18 ${rightEyeCenter.x} ${rightEyeCenter.y})`} />
          <ellipse
            cx={rightEyeCenter.x + dx * 0.8}
            cy={rightEyeCenter.y + dy * 0.8}
            rx="11" ry="10"
            fill="#111"
            transform={`rotate(18 ${rightEyeCenter.x + dx * 0.8} ${rightEyeCenter.y + dy * 0.8})`}
          />
          <ellipse cx={128 + dx * 0.2} cy={62 + dy * 0.2} rx="8" ry="6" fill="rgba(255,255,255,0.4)" transform="rotate(15 128 62)" />
        </>
      )}
      
      {/* Blink eyelids */}
      {!isSleeping && (
        <>
          <ellipse className="blink-lid-spidey" cx={leftEyeCenter.x} cy={leftEyeCenter.y} rx="22" ry="0" fill="#dc2626" transform={`rotate(-18 ${leftEyeCenter.x} ${leftEyeCenter.y})`} />
          <ellipse className="blink-lid-spidey" cx={rightEyeCenter.x} cy={rightEyeCenter.y} rx="22" ry="0" fill="#dc2626" transform={`rotate(18 ${rightEyeCenter.x} ${rightEyeCenter.y})`} />
        </>
      )}
    </g>
  );
}

function PremiumSpideyBody() {
  return (
    <g>
      {/* Torso - red */}
      <ellipse cx="142" cy="162" rx="46" ry="32" fill="#dc2626" />
      
      {/* Blue side panels */}
      <path d="M 108 154 Q 108 174 112 182 Q 120 186 120 174 Q 118 162 115 154 Z" fill="#1e88e5" />
      <path d="M 170 154 Q 172 172 170 182 Q 162 186 162 174 Q 164 162 166 154 Z" fill="#1e88e5" />
      
      {/* Spider emblem */}
      <ellipse cx="142" cy="158" rx="7" ry="5" fill="#0a0a0a" />
      <line x1="135" y1="154" x2="142" y2="162" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="149" y1="154" x2="142" y2="162" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="133" y1="158" x2="151" y2="158" stroke="#0a0a0a" strokeWidth="2" />
      
      {/* Left arm - red */}
      <path d="M 105 156 Q 86 154 66 152 Q 58 154 59 163 Q 63 168 72 166 Q 84 164 98 162 Z" fill="#dc2626" />
      <ellipse cx="60" cy="161" rx="10" ry="7" fill="#dc2626" />
      
      {/* Right arm - blue */}
      <path d="M 172 156 Q 183 154 192 154 Q 196 160 192 167 Q 184 167 174 162 Z" fill="#1e88e5" />
      <ellipse cx="193" cy="161" rx="8" ry="6" fill="#1e88e5" />
      
      {/* Left leg - blue */}
      <path d="M 115 179 Q 98 192 82 206 Q 75 212 67 210 Q 65 202 76 196 Q 90 188 107 178 Z" fill="#1e88e5" />
      <ellipse cx="64" cy="212" rx="15" ry="8" fill="#dc2626" />
      
      {/* Right leg - blue */}
      <path d="M 155 179 Q 159 192 157 206 Q 154 212 147 210 Q 143 202 145 192 Q 148 186 155 179 Z" fill="#1e88e5" />
      <ellipse cx="149" cy="212" rx="13" ry="8" fill="#dc2626" />
    </g>
  );
}

// ─── PREMIUM BATMAN CHARACTER ───────────────────────────────────────────────

function PremiumBatmanHead({ mouseAngle, state = 'idle' }: { mouseAngle: number; state?: CompanionState }) {
  const { dx, dy } = pupilOffset(mouseAngle, 4);
  const isSleeping = state === 'sleep';

  return (
    <g>
      {/* Bat ears */}
      <polygon points="86,30 78,6 98,24" fill="#0a0a0a" />
      <polygon points="140,30 160,6 122,24" fill="#0a0a0a" />
      <polygon points="88,28 82,10 96,24" fill="#1a1a1a" />
      <polygon points="138,28 156,10 124,24" fill="#1a1a1a" />
      
      {/* Head */}
      <circle cx="113" cy="74" r="52" fill="#1a1a1a" stroke="#0a0a0a" strokeWidth="3" />
      
      {/* Head highlight */}
      <ellipse cx="96" cy="52" rx="20" ry="12" fill="rgba(255,255,255,0.08)" transform="rotate(-15 96 52)" />
      
      {/* Brow line */}
      <path d="M 78 68 Q 113 60 148 68" fill="none" stroke="#0a0a0a" strokeWidth="2.5" />
      
      {/* Eyes - state-based */}
      {isSleeping ? (
        <>
          <line x1="76" y1="70" x2="108" y2="70" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="118" y1="70" x2="150" y2="70" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Left eye */}
          <ellipse cx="92" cy="70" rx="16" ry="9" fill="white" />
          <path d="M 76 66 Q 92 62 108 66" fill="#1a1a1a" />
          <circle cx={92 + dx} cy={70 + dy} r="5.5" fill="#1a1a1a" />
          <circle cx={88 + dx * 0.3} cy={67 + dy * 0.3} r="3" fill="rgba(255,255,255,0.7)" />
          
          {/* Right eye */}
          <ellipse cx="134" cy="70" rx="16" ry="9" fill="white" />
          <path d="M 118 66 Q 134 62 150 66" fill="#1a1a1a" />
          <circle cx={134 + dx} cy={70 + dy} r="5.5" fill="#1a1a1a" />
          <circle cx={130 + dx * 0.3} cy={67 + dy * 0.3} r="3" fill="rgba(255,255,255,0.7)" />
        </>
      )}
      
      {/* Blink eyelids */}
      {!isSleeping && (
        <>
          <ellipse className="blink-lid" cx="92" cy="70" rx="16" ry="0" fill="#1a1a1a" />
          <ellipse className="blink-lid" cx="134" cy="70" rx="16" ry="0" fill="#1a1a1a" />
        </>
      )}
      
      {/* Mouth area */}
      <path d="M 88 94 Q 113 102 138 94 Q 135 102 113 106 Q 91 102 88 94 Z" fill="#f9a825" opacity="0.8" />
    </g>
  );
}

function PremiumBatmanBody() {
  return (
    <g>
      {/* Wings */}
      <path d="M 100 144 Q 88 134 85 159 Q 84 179 90 189 Q 98 199 108 179 Z" fill="#0a0a0a" />
      <path d="M 180 144 Q 192 134 194 159 Q 194 182 188 192 Q 180 200 172 180 Z" fill="#0a0a0a" />
      
      {/* Torso */}
      <ellipse cx="142" cy="162" rx="44" ry="30" fill="#1a1a1a" />
      
      {/* Chest emblem */}
      <path d="M 134 156 Q 142 149 150 156 Q 155 152 160 156 Q 152 166 142 162 Q 132 166 124 156 Q 129 152 134 156 Z" fill="#f9a825" />
      
      {/* Utility belt */}
      <rect x="108" y="169" width="68" height="8" rx="3" fill="#f9a825" />
      
      {/* Left arm */}
      <path d="M 107 156 Q 88 154 68 152 Q 60 154 61 163 Q 65 168 74 166 Q 86 164 100 162 Z" fill="#0a0a0a" />
      <ellipse cx="62" cy="161" rx="9" ry="6" fill="#1a1a1a" />
      
      {/* Right arm */}
      <path d="M 170 156 Q 182 154 192 154 Q 196 160 192 167 Q 184 167 173 162 Z" fill="#0a0a0a" />
      <ellipse cx="193" cy="161" rx="8" ry="6" fill="#1a1a1a" />
      
      {/* Left leg */}
      <path d="M 115 179 Q 99 192 83 206 Q 76 212 68 210 Q 66 202 77 196 Q 91 188 108 178 Z" fill="#0a0a0a" />
      <ellipse cx="65" cy="212" rx="15" ry="8" fill="#1a1a1a" />
      
      {/* Right leg */}
      <path d="M 155 179 Q 159 192 157 206 Q 154 212 147 210 Q 143 202 145 192 Q 148 186 155 179 Z" fill="#0a0a1a" />
      <ellipse cx="149" cy="212" rx="13" ry="8" fill="#1a1a1a" />
    </g>
  );
}

// ─── OTHER CHARACTERS (simplified for now) ──────────────────────────────────

function CatHead({ mouseAngle, state: _state = 'idle' }: { mouseAngle: number; state?: CompanionState }) {
  const { dx, dy } = pupilOffset(mouseAngle, 4);
  return (
    <g>
      <polygon points="82,38 74,16 100,34" fill="#60a5fa" />
      <polygon points="144,38 154,16 126,34" fill="#60a5fa" />
      <polygon points="84,36 78,20 98,34" fill="#bfdbfe" />
      <polygon points="142,36 150,20 128,34" fill="#bfdbfe" />
      <circle cx="113" cy="75" r="46" fill="#93c5fd" stroke="#60a5fa" strokeWidth="2.5" />
      <ellipse cx="86" cy="84" rx="11" ry="6" fill="#fda4af" opacity="0.5" />
      <ellipse cx="140" cy="84" rx="11" ry="6" fill="#fda4af" opacity="0.5" />
      <ellipse cx="94" cy="70" rx="13" ry="15" fill="white" />
      <ellipse cx="132" cy="70" rx="13" ry="15" fill="white" />
      <ellipse cx={94 + dx} cy={70 + dy} rx="5" ry="8" fill="#1e3a5f" />
      <ellipse cx={132 + dx} cy={70 + dy} rx="5" ry="8" fill="#1e3a5f" />
      <circle cx={91 + dx * 0.3} cy={64 + dy * 0.3} r="2.5" fill="white" opacity="0.8" />
      <circle cx={129 + dx * 0.3} cy={64 + dy * 0.3} r="2.5" fill="white" opacity="0.8" />
      <ellipse className="blink-lid" cx="94" cy="70" rx="13" ry="0" fill="#93c5fd" />
      <ellipse className="blink-lid" cx="132" cy="70" rx="13" ry="0" fill="#93c5fd" />
      <polygon points="113,82 109,87 117,87" fill="#fda4af" />
      <path d="M 109 87 Q 113 92 117 87" fill="none" stroke="#dba0b0" strokeWidth="1.5" />
    </g>
  );
}

function CatBody() {
  return (
    <g>
      <ellipse cx="142" cy="162" rx="44" ry="30" fill="#93c5fd" />
      <path d="M 108 156 Q 88 154 68 152 Q 60 154 61 163 Q 65 168 74 166 Q 86 164 100 162 Z" fill="#93c5fd" />
      <ellipse cx="62" cy="161" rx="9" ry="6" fill="#bfdbfe" />
      <path d="M 170 156 Q 182 154 192 154 Q 196 160 192 167 Q 184 167 173 162 Z" fill="#93c5fd" />
      <path d="M 115 179 Q 99 192 83 206 Q 76 212 68 210 Q 66 202 77 196 Q 91 188 108 178 Z" fill="#bfdbfe" />
      <ellipse cx="65" cy="212" rx="15" ry="8" fill="#93c5fd" />
      <path d="M 155 179 Q 159 192 157 206 Q 154 212 147 210 Q 143 202 145 192 Q 148 186 155 179 Z" fill="#bfdbfe" />
      <ellipse cx="149" cy="212" rx="13" ry="8" fill="#93c5fd" />
    </g>
  );
}

// Add similar simplified versions for Bunny, Dino, Puppy, Bear...
function BunnyHead({ mouseAngle, state: _state = 'idle' }: { mouseAngle: number; state?: CompanionState }) {
  const { dx, dy } = pupilOffset(mouseAngle, 4);
  return (
    <g>
      <ellipse cx="88" cy="22" rx="13" ry="30" fill="#c4b5fd" />
      <ellipse cx="138" cy="22" rx="13" ry="30" fill="#c4b5fd" />
      <ellipse cx="88" cy="22" rx="7" ry="22" fill="#fda4af" />
      <ellipse cx="138" cy="22" rx="7" ry="22" fill="#fda4af" />
      <circle cx="113" cy="78" r="44" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2.5" />
      <circle cx="96" cy="72" r="13" fill="white" />
      <circle cx="130" cy="72" r="13" fill="white" />
      <circle cx={96 + dx} cy={72 + dy} r="7" fill="#7c3aed" />
      <circle cx={130 + dx} cy={72 + dy} r="7" fill="#7c3aed" />
      <circle cx={92 + dx * 0.3} cy={68 + dy * 0.3} r="3" fill="white" opacity="0.8" />
      <circle cx={126 + dx * 0.3} cy={68 + dy * 0.3} r="3" fill="white" opacity="0.8" />
      <ellipse className="blink-lid" cx="96" cy="72" rx="13" ry="0" fill="#ede9fe" />
      <ellipse className="blink-lid" cx="130" cy="72" rx="13" ry="0" fill="#ede9fe" />
      <ellipse cx="113" cy="85" rx="5" ry="4" fill="#fda4af" />
    </g>
  );
}

function BunnyBody() {
  return (
    <g>
      <ellipse cx="142" cy="162" rx="44" ry="30" fill="#c4b5fd" />
      <path d="M 108 156 Q 88 154 68 152 Q 60 154 61 163 Q 65 168 74 166 Q 86 164 100 162 Z" fill="#c4b5fd" />
      <ellipse cx="62" cy="161" rx="9" ry="6" fill="#ede9fe" />
      <path d="M 170 156 Q 182 154 192 154 Q 196 160 192 167 Q 184 167 173 162 Z" fill="#c4b5fd" />
      <path d="M 115 179 Q 99 192 83 206 Q 76 212 68 210 Q 66 202 77 196 Q 91 188 108 178 Z" fill="#ede9fe" />
      <ellipse cx="65" cy="212" rx="15" ry="8" fill="#c4b5fd" />
      <path d="M 155 179 Q 159 192 157 206 Q 154 212 147 210 Q 143 202 145 192 Q 148 186 155 179 Z" fill="#ede9fe" />
      <ellipse cx="149" cy="212" rx="13" ry="8" fill="#c4b5fd" />
    </g>
  );
}

function DinoHead({ mouseAngle, state: _state = 'idle' }: { mouseAngle: number; state?: CompanionState }) {
  const { dx, dy } = pupilOffset(mouseAngle, 4);
  return (
    <g>
      <polygon points="100,28 95,12 108,26" fill="#22c55e" />
      <polygon points="113,24 113,6 120,22" fill="#22c55e" />
      <polygon points="126,28 131,12 118,26" fill="#22c55e" />
      <circle cx="113" cy="76" r="46" fill="#4ade80" stroke="#22c55e" strokeWidth="2.5" />
      <circle cx="94" cy="70" r="13" fill="white" />
      <circle cx="132" cy="70" r="13" fill="white" />
      <circle cx={94 + dx} cy={70 + dy} r="7" fill="#14532d" />
      <circle cx={132 + dx} cy={70 + dy} r="7" fill="#14532d" />
      <circle cx={90 + dx * 0.3} cy={66 + dy * 0.3} r="3" fill="white" opacity="0.8" />
      <circle cx={128 + dx * 0.3} cy={66 + dy * 0.3} r="3" fill="white" opacity="0.8" />
      <ellipse className="blink-lid" cx="94" cy="70" rx="13" ry="0" fill="#4ade80" />
      <ellipse className="blink-lid" cx="132" cy="70" rx="13" ry="0" fill="#4ade80" />
      <path d="M 92 90 Q 113 102 134 90" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

function DinoBody() {
  return (
    <g>
      <ellipse cx="142" cy="162" rx="44" ry="30" fill="#4ade80" />
      <path d="M 108 156 Q 88 154 68 152 Q 60 154 61 163 Q 65 168 74 166 Q 86 164 100 162 Z" fill="#4ade80" />
      <ellipse cx="62" cy="161" rx="9" ry="6" fill="#86efac" />
      <path d="M 170 156 Q 182 154 192 154 Q 196 160 192 167 Q 184 167 173 162 Z" fill="#4ade80" />
      <path d="M 115 179 Q 99 192 83 206 Q 76 212 68 210 Q 66 202 77 196 Q 91 188 108 178 Z" fill="#86efac" />
      <ellipse cx="65" cy="212" rx="15" ry="8" fill="#4ade80" />
      <path d="M 155 179 Q 159 192 157 206 Q 154 212 147 210 Q 143 202 145 192 Q 148 186 155 179 Z" fill="#86efac" />
      <ellipse cx="149" cy="212" rx="13" ry="8" fill="#4ade80" />
    </g>
  );
}

function PuppyHead({ mouseAngle, state: _state = 'idle' }: { mouseAngle: number; state?: CompanionState }) {
  const { dx, dy } = pupilOffset(mouseAngle, 4);
  return (
    <g>
      <ellipse cx="76" cy="60" rx="18" ry="28" fill="#d97706" />
      <ellipse cx="150" cy="60" rx="18" ry="28" fill="#d97706" />
      <circle cx="113" cy="74" r="46" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
      <circle cx="95" cy="68" r="14" fill="white" />
      <circle cx="131" cy="68" r="14" fill="white" />
      <circle cx={95 + dx} cy={68 + dy} r="8" fill="#7c2d12" />
      <circle cx={131 + dx} cy={68 + dy} r="8" fill="#7c2d12" />
      <circle cx={91 + dx * 0.3} cy={64 + dy * 0.3} r="3" fill="white" opacity="0.9" />
      <circle cx={127 + dx * 0.3} cy={64 + dy * 0.3} r="3" fill="white" opacity="0.9" />
      <ellipse className="blink-lid" cx="95" cy="68" rx="14" ry="0" fill="#fbbf24" />
      <ellipse className="blink-lid" cx="131" cy="68" rx="14" ry="0" fill="#fbbf24" />
      <ellipse cx="113" cy="84" rx="10" ry="7" fill="#92400e" />
      <path d="M 104 90 Q 113 98 122 90" fill="none" stroke="#7c2d12" strokeWidth="2" />
    </g>
  );
}

function PuppyBody() {
  return (
    <g>
      <ellipse cx="142" cy="162" rx="44" ry="30" fill="#fbbf24" />
      <path d="M 108 156 Q 88 154 68 152 Q 60 154 61 163 Q 65 168 74 166 Q 86 164 100 162 Z" fill="#fbbf24" />
      <ellipse cx="62" cy="161" rx="9" ry="6" fill="#fde68a" />
      <path d="M 170 156 Q 182 154 192 154 Q 196 160 192 167 Q 184 167 173 162 Z" fill="#fbbf24" />
      <path d="M 115 179 Q 99 192 83 206 Q 76 212 68 210 Q 66 202 77 196 Q 91 188 108 178 Z" fill="#fde68a" />
      <ellipse cx="65" cy="212" rx="15" ry="8" fill="#fbbf24" />
      <path d="M 155 179 Q 159 192 157 206 Q 154 212 147 210 Q 143 202 145 192 Q 148 186 155 179 Z" fill="#fde68a" />
      <ellipse cx="149" cy="212" rx="13" ry="8" fill="#fbbf24" />
    </g>
  );
}

function BearHead({ mouseAngle, state: _state = 'idle' }: { mouseAngle: number; state?: CompanionState }) {
  const { dx, dy } = pupilOffset(mouseAngle, 4);
  return (
    <g>
      <circle cx="76" cy="42" r="18" fill="#d97706" />
      <circle cx="150" cy="42" r="18" fill="#d97706" />
      <circle cx="76" cy="42" r="11" fill="#fde68a" />
      <circle cx="150" cy="42" r="11" fill="#fde68a" />
      <circle cx="113" cy="76" r="48" fill="#d97706" stroke="#b45309" strokeWidth="2.5" />
      <ellipse cx="113" cy="90" rx="20" ry="14" fill="#fde68a" />
      <circle cx="94" cy="68" r="13" fill="white" />
      <circle cx="132" cy="68" r="13" fill="white" />
      <circle cx={94 + dx} cy={68 + dy} r="7" fill="#451a03" />
      <circle cx={132 + dx} cy={68 + dy} r="7" fill="#451a03" />
      <circle cx={90 + dx * 0.3} cy={64 + dy * 0.3} r="3" fill="white" opacity="0.9" />
      <circle cx={128 + dx * 0.3} cy={64 + dy * 0.3} r="3" fill="white" opacity="0.9" />
      <ellipse className="blink-lid" cx="94" cy="68" rx="13" ry="0" fill="#d97706" />
      <ellipse className="blink-lid" cx="132" cy="68" rx="13" ry="0" fill="#d97706" />
      <ellipse cx="113" cy="88" rx="8" ry="6" fill="#78350f" />
      <path d="M 105 94 Q 113 101 121 94" fill="none" stroke="#78350f" strokeWidth="2" />
    </g>
  );
}

function BearBody() {
  return (
    <g>
      <ellipse cx="142" cy="162" rx="44" ry="30" fill="#d97706" />
      <ellipse cx="142" cy="169" rx="24" ry="15" fill="#fde68a" />
      <path d="M 108 156 Q 88 154 68 152 Q 60 154 61 163 Q 65 168 74 166 Q 86 164 100 162 Z" fill="#d97706" />
      <ellipse cx="62" cy="161" rx="9" ry="6" fill="#fde68a" />
      <path d="M 170 156 Q 182 154 192 154 Q 196 160 192 167 Q 184 167 173 162 Z" fill="#d97706" />
      <path d="M 115 179 Q 99 192 83 206 Q 76 212 68 210 Q 66 202 77 196 Q 91 188 108 178 Z" fill="#fde68a" />
      <ellipse cx="65" cy="212" rx="15" ry="8" fill="#d97706" />
      <path d="M 155 179 Q 159 192 157 206 Q 154 212 147 210 Q 143 202 145 192 Q 148 186 155 179 Z" fill="#fde68a" />
      <ellipse cx="149" cy="212" rx="13" ry="8" fill="#d97706" />
    </g>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

const bodyMap: Record<string, () => JSX.Element> = {
  piggy: PremiumPiggyBody,
  spidey: PremiumSpideyBody,
  batman: PremiumBatmanBody,
  cat: CatBody,
  bunny: BunnyBody,
  dino: DinoBody,
  puppy: PuppyBody,
  bear: BearBody,
};

const headMap: Record<string, (p: { mouseAngle: number; state?: CompanionState }) => JSX.Element> = {
  piggy: (p) => <PremiumPiggyHead {...p} />,
  spidey: (p) => <PremiumSpideyHead {...p} />,
  batman: (p) => <PremiumBatmanHead {...p} />,
  cat: (p) => <CatHead {...p} />,
  bunny: (p) => <BunnyHead {...p} />,
  dino: (p) => <DinoHead {...p} />,
  puppy: (p) => <PuppyHead {...p} />,
  bear: (p) => <BearHead {...p} />,
};

export function CharacterSticker({
  characterId,
  size = 180,
  mouseAngle = 0,
  isTyping = false,
  state = 'idle',
  style,
}: CharacterStickerProps) {
  const BodyComp = bodyMap[characterId] || bodyMap.piggy;
  const HeadComp = headMap[characterId] || headMap.piggy;

  return (
    <svg
      viewBox="0 0 200 220"
      width={size}
      height={size * (220 / 200)}
      style={{ display: 'block', overflow: 'visible', ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={`sticker-${characterId}`} x="-15%" y="-15%" width="130%" height="130%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="5" result="dilated" />
          <feFlood floodColor="white" result="white" />
          <feComposite in="white" in2="dilated" operator="in" result="outline" />
          <feMerge>
            <feMergeNode in="outline" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="screenGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <g
        filter={`url(#sticker-${characterId})`}
        style={{ filter: `url(#sticker-${characterId}) drop-shadow(0 10px 20px rgba(0,0,0,0.35))` }}
      >
        <PremiumGamingChair />
        <BodyComp />
        <PremiumLaptop isTyping={isTyping} />
        <HeadComp mouseAngle={mouseAngle} state={state} />
      </g>
    </svg>
  );
}
