import { type CSSProperties } from 'react';

interface CharacterStickerProps {
  characterId: string;
  size?: number;
  mouseAngle?: number;
  isTyping?: boolean;
  style?: CSSProperties;
}

// Pupil offset from eye center based on mouse angle
function pupilOffset(angle: number, maxR: number) {
  return {
    dx: Math.cos(angle) * maxR,
    dy: Math.sin(angle) * maxR,
  };
}

// ─── SHARED SCENE ELEMENTS ──────────────────────────────────────────────────

function GamingChair() {
  return (
    <g>
      {/* Chair back - outer shell */}
      <rect x="103" y="32" width="82" height="122" rx="20" fill="#383838" />
      {/* Chair back - inner cushion */}
      <rect x="110" y="39" width="68" height="108" rx="15" fill="#4a4a4a" />
      {/* Chair back - center seam line */}
      <line x1="144" y1="42" x2="144" y2="143" stroke="#393939" strokeWidth="2" opacity="0.7" />
      {/* Chair back - top highlight */}
      <rect x="113" y="42" width="62" height="18" rx="12" fill="#585858" opacity="0.6" />

      {/* Chair seat */}
      <rect x="90" y="148" width="96" height="26" rx="12" fill="#353535" />
      <rect x="93" y="148" width="90" height="14" rx="10" fill="#454545" />

      {/* Left armrest */}
      <rect x="78" y="130" width="26" height="20" rx="10" fill="#424242" />
      <rect x="80" y="130" width="22" height="11" rx="9" fill="#525252" />

      {/* Right armrest */}
      <rect x="172" y="130" width="26" height="20" rx="10" fill="#424242" />
      <rect x="174" y="130" width="22" height="11" rx="9" fill="#525252" />
    </g>
  );
}

function Laptop({ isTyping = false }: { isTyping?: boolean }) {
  return (
    <g>
      {/* ── Laptop lid (screen) ── */}
      {/* Lid outer shell */}
      <polygon points="20,152 108,147 114,78 26,82" fill="#686868" />
      {/* Lid bezel */}
      <polygon points="24,149 104,144 110,82 30,85" fill="#7a7a7a" />
      {/* Screen display */}
      <polygon points="28,146 100,141 106,86 33,89" fill="#4ab8cc" opacity="0.9" />
      {/* Screen glow */}
      <polygon points="28,146 100,141 106,86 33,89" fill="url(#screenGlow)" />
      {/* Screen content - code lines */}
      <g opacity="0.7">
        <line x1="35" y1="100" x2="80" y2="98" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="35" y1="108" x2="90" y2="106" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="35" y1="116" x2="72" y2="114" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        {isTyping && (
          <rect x="35" y="122" width="2" height="8" fill="white" opacity={Math.random() > 0.5 ? 1 : 0} />
        )}
      </g>
      {/* Screen highlight */}
      <polygon points="32,89 70,87 68,100 30,102" fill="rgba(255,255,255,0.12)" />
      {/* Lid logo/dot */}
      <circle cx="22" cy="82" r="4" fill="#606060" />
      <circle cx="22" cy="82" r="2" fill="#505050" />

      {/* ── Keyboard base ── */}
      <polygon points="20,152 108,147 120,166 32,171" fill="#5a5a5a" />
      {/* Keyboard top face */}
      <polygon points="24,152 104,148 115,163 35,167" fill="#4e4e4e" />
      {/* Key rows */}
      <g fill="#3d3d3d" opacity="0.8">
        {[0, 1, 2].map(row => (
          [0, 1, 2, 3, 4, 5, 6].map(col => (
            <rect
              key={`${row}-${col}`}
              x={32 + col * 11 + row * 2}
              y={152 + row * 4}
              width="8"
              height="3"
              rx="1"
              fill={isTyping && Math.random() > 0.6 ? '#666' : '#404040'}
            />
          ))
        ))}
      </g>
      {/* Trackpad */}
      <rect x="55" y="164" width="32" height="4" rx="2" fill="#4a4a4a" />
      {/* Hinge line */}
      <line x1="20" y1="152" x2="108" y2="147" stroke="#333" strokeWidth="1.5" />
    </g>
  );
}

// ─── CHARACTER BODIES ────────────────────────────────────────────────────────

function PiggyBody({ isTyping }: { isTyping: boolean }) {
  return (
    <g>
      {/* Hoodie body - pink */}
      <ellipse cx="142" cy="158" rx="42" ry="30" fill="#f4a8c0" />
      {/* Hoodie front pocket */}
      <ellipse cx="142" cy="168" rx="18" ry="10" fill="#e894b0" />
      {/* Left arm reaching to laptop */}
      <path d="M 100 155 Q 82 153 65 150 Q 56 152 58 160 Q 62 164 72 162 Q 84 162 96 160 Z" fill="#f4a8c0" />
      {/* Left hand on keyboard */}
      <ellipse cx="60" cy="158" rx="9" ry="6" fill="#f9c4d4" />
      {/* Right arm */}
      <path d="M 172 155 Q 182 152 192 152 Q 196 158 192 163 Q 184 163 174 160 Z" fill="#f4a8c0" />
      {/* Right hand */}
      <ellipse cx="193" cy="158" rx="7" ry="5" fill="#f9c4d4" />
      {/* Left leg */}
      <path d="M 112 174 Q 96 186 80 200 Q 74 207 66 205 Q 64 198 74 192 Q 88 184 104 174 Z" fill="#f7cfd8" />
      {/* Left foot */}
      <ellipse cx="63" cy="207" rx="14" ry="7" fill="#f4a8c0" />
      {/* Right leg */}
      <path d="M 155 174 Q 160 186 158 200 Q 155 207 148 205 Q 144 198 146 188 Q 148 180 155 174 Z" fill="#f7cfd8" />
      {/* Right foot */}
      <ellipse cx="150" cy="207" rx="12" ry="7" fill="#f4a8c0" />
    </g>
  );
}

function SpideyBody({ isTyping }: { isTyping: boolean }) {
  return (
    <g>
      {/* Torso - red suit */}
      <ellipse cx="142" cy="158" rx="42" ry="28" fill="#cc1111" />
      {/* Blue accent sides */}
      <path d="M 108 150 Q 108 170 112 178 Q 120 182 120 170 Q 118 158 115 150 Z" fill="#1a4fc0" />
      <path d="M 170 150 Q 172 168 170 178 Q 162 182 162 170 Q 164 158 166 150 Z" fill="#1a4fc0" />
      {/* Spider web lines on torso */}
      <line x1="142" y1="135" x2="142" y2="182" stroke="#880000" strokeWidth="1" opacity="0.5" />
      <line x1="108" y1="158" x2="180" y2="158" stroke="#880000" strokeWidth="1" opacity="0.5" />
      {/* Spider symbol */}
      <ellipse cx="142" cy="153" rx="6" ry="4" fill="#0a0a0a" />
      <line x1="136" y1="150" x2="142" y2="158" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
      <line x1="148" y1="150" x2="142" y2="158" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
      <line x1="134" y1="155" x2="150" y2="155" stroke="#0a0a0a" strokeWidth="1.5" />
      {/* Left arm to keyboard */}
      <path d="M 105 152 Q 86 150 66 148 Q 58 150 59 159 Q 63 164 72 162 Q 84 160 98 158 Z" fill="#cc1111" />
      {/* Left hand */}
      <ellipse cx="60" cy="157" rx="9" ry="6" fill="#cc2222" />
      {/* Right arm */}
      <path d="M 172 152 Q 183 150 192 150 Q 196 156 192 163 Q 184 163 174 158 Z" fill="#1a4fc0" />
      {/* Right hand */}
      <ellipse cx="193" cy="157" rx="7" ry="5" fill="#1a4fc0" />
      {/* Left leg - blue */}
      <path d="M 115 175 Q 98 188 82 202 Q 75 208 67 206 Q 65 198 76 192 Q 90 184 107 174 Z" fill="#1a4fc0" />
      {/* Left boot - red */}
      <ellipse cx="64" cy="208" rx="14" ry="7" fill="#cc1111" />
      {/* Right leg - blue */}
      <path d="M 155 175 Q 159 188 157 202 Q 154 208 147 206 Q 143 198 145 188 Q 148 182 155 175 Z" fill="#1a4fc0" />
      {/* Right boot - red */}
      <ellipse cx="149" cy="208" rx="12" ry="7" fill="#cc1111" />
    </g>
  );
}

function BatmanBody({ isTyping }: { isTyping: boolean }) {
  return (
    <g>
      {/* Cape - dark, behind body */}
      <path d="M 100 140 Q 88 130 85 155 Q 84 175 90 185 Q 98 195 108 175 Z" fill="#1a1a0a" />
      <path d="M 180 140 Q 192 130 194 155 Q 194 178 188 188 Q 180 196 172 176 Z" fill="#1a1a0a" />
      {/* Torso - dark suit */}
      <ellipse cx="142" cy="158" rx="40" ry="27" fill="#1f1f10" />
      {/* Bat symbol */}
      <path d="M 134 152 Q 142 145 150 152 Q 155 148 160 152 Q 152 162 142 158 Q 132 162 124 152 Q 129 148 134 152 Z" fill="#f9a825" />
      {/* Yellow utility belt stripe */}
      <rect x="108" y="165" width="68" height="7" rx="3" fill="#f9a825" />
      {/* Left arm */}
      <path d="M 107 152 Q 88 150 68 148 Q 60 150 61 159 Q 65 164 74 162 Q 86 160 100 158 Z" fill="#111108" />
      <ellipse cx="62" cy="157" rx="8" ry="5" fill="#1a1a0a" />
      {/* Right arm */}
      <path d="M 170 152 Q 182 150 192 150 Q 196 156 192 163 Q 184 163 173 158 Z" fill="#111108" />
      <ellipse cx="193" cy="157" rx="7" ry="5" fill="#1a1a0a" />
      {/* Left leg */}
      <path d="M 115 175 Q 99 188 83 202 Q 76 208 68 206 Q 66 198 77 192 Q 91 184 108 174 Z" fill="#111108" />
      <ellipse cx="65" cy="208" rx="14" ry="7" fill="#0d0d06" />
      {/* Right leg */}
      <path d="M 155 175 Q 159 188 157 202 Q 154 208 147 206 Q 143 198 145 188 Q 148 182 155 175 Z" fill="#111108" />
      <ellipse cx="149" cy="208" rx="12" ry="7" fill="#0d0d06" />
    </g>
  );
}

function CatBody({ isTyping }: { isTyping: boolean }) {
  return (
    <g>
      <ellipse cx="142" cy="158" rx="40" ry="27" fill="#93c5fd" />
      <path d="M 108 152 Q 88 150 68 148 Q 60 150 61 159 Q 65 164 74 162 Q 86 160 100 158 Z" fill="#93c5fd" />
      <ellipse cx="62" cy="157" rx="8" ry="5" fill="#bfdbfe" />
      <path d="M 170 152 Q 182 150 192 150 Q 196 156 192 163 Q 184 163 173 158 Z" fill="#93c5fd" />
      <path d="M 115 175 Q 99 188 83 202 Q 76 208 68 206 Q 66 198 77 192 Q 91 184 108 174 Z" fill="#bfdbfe" />
      <ellipse cx="65" cy="208" rx="14" ry="7" fill="#93c5fd" />
      <path d="M 155 175 Q 159 188 157 202 Q 154 208 147 206 Q 143 198 145 188 Q 148 182 155 175 Z" fill="#bfdbfe" />
      <ellipse cx="149" cy="208" rx="12" ry="7" fill="#93c5fd" />
    </g>
  );
}

function BunnyBody({ isTyping }: { isTyping: boolean }) {
  return (
    <g>
      <ellipse cx="142" cy="158" rx="40" ry="27" fill="#c4b5fd" />
      <path d="M 108 152 Q 88 150 68 148 Q 60 150 61 159 Q 65 164 74 162 Q 86 160 100 158 Z" fill="#c4b5fd" />
      <ellipse cx="62" cy="157" rx="8" ry="5" fill="#ede9fe" />
      <path d="M 170 152 Q 182 150 192 150 Q 196 156 192 163 Q 184 163 173 158 Z" fill="#c4b5fd" />
      <path d="M 115 175 Q 99 188 83 202 Q 76 208 68 206 Q 66 198 77 192 Q 91 184 108 174 Z" fill="#ede9fe" />
      <ellipse cx="65" cy="208" rx="14" ry="7" fill="#c4b5fd" />
      <path d="M 155 175 Q 159 188 157 202 Q 154 208 147 206 Q 143 198 145 188 Q 148 182 155 175 Z" fill="#ede9fe" />
      <ellipse cx="149" cy="208" rx="12" ry="7" fill="#c4b5fd" />
    </g>
  );
}

function DinoBody({ isTyping }: { isTyping: boolean }) {
  return (
    <g>
      <ellipse cx="142" cy="158" rx="40" ry="27" fill="#4ade80" />
      <path d="M 108 152 Q 88 150 68 148 Q 60 150 61 159 Q 65 164 74 162 Q 86 160 100 158 Z" fill="#4ade80" />
      <ellipse cx="62" cy="157" rx="8" ry="5" fill="#86efac" />
      <path d="M 170 152 Q 182 150 192 150 Q 196 156 192 163 Q 184 163 173 158 Z" fill="#4ade80" />
      <path d="M 115 175 Q 99 188 83 202 Q 76 208 68 206 Q 66 198 77 192 Q 91 184 108 174 Z" fill="#86efac" />
      <ellipse cx="65" cy="208" rx="14" ry="7" fill="#4ade80" />
      <path d="M 155 175 Q 159 188 157 202 Q 154 208 147 206 Q 143 198 145 188 Q 148 182 155 175 Z" fill="#86efac" />
      <ellipse cx="149" cy="208" rx="12" ry="7" fill="#4ade80" />
    </g>
  );
}

function PuppyBody({ isTyping }: { isTyping: boolean }) {
  return (
    <g>
      <ellipse cx="142" cy="158" rx="40" ry="27" fill="#fbbf24" />
      <path d="M 108 152 Q 88 150 68 148 Q 60 150 61 159 Q 65 164 74 162 Q 86 160 100 158 Z" fill="#fbbf24" />
      <ellipse cx="62" cy="157" rx="8" ry="5" fill="#fde68a" />
      <path d="M 170 152 Q 182 150 192 150 Q 196 156 192 163 Q 184 163 173 158 Z" fill="#fbbf24" />
      <path d="M 115 175 Q 99 188 83 202 Q 76 208 68 206 Q 66 198 77 192 Q 91 184 108 174 Z" fill="#fde68a" />
      <ellipse cx="65" cy="208" rx="14" ry="7" fill="#fbbf24" />
      <path d="M 155 175 Q 159 188 157 202 Q 154 208 147 206 Q 143 198 145 188 Q 148 182 155 175 Z" fill="#fde68a" />
      <ellipse cx="149" cy="208" rx="12" ry="7" fill="#fbbf24" />
    </g>
  );
}

function BearBody({ isTyping }: { isTyping: boolean }) {
  return (
    <g>
      <ellipse cx="142" cy="158" rx="40" ry="27" fill="#d97706" />
      <ellipse cx="142" cy="165" rx="22" ry="14" fill="#fde68a" />
      <path d="M 108 152 Q 88 150 68 148 Q 60 150 61 159 Q 65 164 74 162 Q 86 160 100 158 Z" fill="#d97706" />
      <ellipse cx="62" cy="157" rx="8" ry="5" fill="#fde68a" />
      <path d="M 170 152 Q 182 150 192 150 Q 196 156 192 163 Q 184 163 173 158 Z" fill="#d97706" />
      <path d="M 115 175 Q 99 188 83 202 Q 76 208 68 206 Q 66 198 77 192 Q 91 184 108 174 Z" fill="#fde68a" />
      <ellipse cx="65" cy="208" rx="14" ry="7" fill="#d97706" />
      <path d="M 155 175 Q 159 188 157 202 Q 154 208 147 206 Q 143 198 145 188 Q 148 182 155 175 Z" fill="#fde68a" />
      <ellipse cx="149" cy="208" rx="12" ry="7" fill="#d97706" />
    </g>
  );
}

// ─── CHARACTER HEADS ────────────────────────────────────────────────────────

interface HeadProps {
  mouseAngle: number;
  isTyping: boolean;
}

function PiggyHead({ mouseAngle, isTyping }: HeadProps) {
  const { dx, dy } = pupilOffset(mouseAngle, 4);
  return (
    <g>
      {/* Ears */}
      <ellipse cx="76" cy="38" rx="16" ry="20" fill="#f4a8c0" />
      <ellipse cx="150" cy="38" rx="16" ry="20" fill="#f4a8c0" />
      <ellipse cx="76" cy="38" rx="9" ry="13" fill="#f9c4d4" />
      <ellipse cx="150" cy="38" rx="9" ry="13" fill="#f9c4d4" />
      {/* Head */}
      <circle cx="113" cy="75" r="50" fill="#f7c5d5" stroke="#e89ab0" strokeWidth="2.5" />
      {/* Blush marks */}
      <ellipse cx="84" cy="82" rx="12" ry="7" fill="#ffb3c9" opacity="0.65" />
      <ellipse cx="142" cy="82" rx="12" ry="7" fill="#ffb3c9" opacity="0.65" />
      {/* Eyes — whites */}
      <ellipse cx="94" cy="68" rx="14" ry="16" fill="white" />
      <ellipse cx="132" cy="68" rx="14" ry="16" fill="white" />
      {/* Eye outline */}
      <ellipse cx="94" cy="68" rx="14" ry="16" fill="none" stroke="#d4849e" strokeWidth="1.5" />
      <ellipse cx="132" cy="68" rx="14" ry="16" fill="none" stroke="#d4849e" strokeWidth="1.5" />
      {/* Pupils */}
      <circle cx={94 + dx} cy={68 + dy} r="6" fill="#2d1a1a" />
      <circle cx={132 + dx} cy={68 + dy} r="6" fill="#2d1a1a" />
      {/* Eye shine */}
      <circle cx={90 + dx * 0.3} cy={63 + dy * 0.3} r="3" fill="white" opacity="0.9" />
      <circle cx={128 + dx * 0.3} cy={63 + dy * 0.3} r="3" fill="white" opacity="0.9" />
      {/* Second smaller shine */}
      <circle cx={96 + dx * 0.3} cy={72 + dy * 0.3} r="1.5" fill="white" opacity="0.7" />
      <circle cx={134 + dx * 0.3} cy={72 + dy * 0.3} r="1.5" fill="white" opacity="0.7" />
      {/* Snout */}
      <ellipse cx="113" cy="90" rx="16" ry="12" fill="#f9b8cc" />
      <circle cx="107" cy="90" r="4" fill="#e896b2" />
      <circle cx="119" cy="90" r="4" fill="#e896b2" />
      {/* Mouth */}
      <path d="M 106 100 Q 113 106 120 100" fill="none" stroke="#d080a0" strokeWidth="2" strokeLinecap="round" />
      {/* Sparkle eyes */}
      {isTyping && <circle cx="88" cy="60" r="2" fill="white" opacity="0.9" />}
      {isTyping && <circle cx="126" cy="60" r="2" fill="white" opacity="0.9" />}
    </g>
  );
}

function SpideyHead({ mouseAngle, isTyping }: HeadProps) {
  const { dx, dy } = pupilOffset(mouseAngle, 5);
  const leftEyeCenter = { x: 91, y: 66 };
  const rightEyeCenter = { x: 135, y: 66 };
  return (
    <g>
      {/* Head - big red circle */}
      <circle cx="113" cy="72" r="52" fill="#cc0000" stroke="#1a0000" strokeWidth="3" />
      {/* Web pattern - radial lines */}
      <g stroke="#880000" strokeWidth="1.2" opacity="0.55" fill="none">
        <line x1="113" y1="20" x2="113" y2="124" />
        <line x1="61" y1="72" x2="165" y2="72" />
        <line x1="76" y1="35" x2="150" y2="109" />
        <line x1="150" y1="35" x2="76" y2="109" />
        <line x1="67" y1="54" x2="159" y2="90" />
        <line x1="159" y1="54" x2="67" y2="90" />
        {/* Web arcs */}
        <circle cx="113" cy="72" r="18" />
        <circle cx="113" cy="72" r="34" />
        <circle cx="113" cy="72" r="50" />
      </g>
      {/* Head top highlight */}
      <ellipse cx="96" cy="44" rx="22" ry="12" fill="rgba(255,255,255,0.18)" transform="rotate(-15 96 44)" />

      {/* Left eye - white almond lens */}
      <ellipse cx={leftEyeCenter.x} cy={leftEyeCenter.y} rx="20" ry="15" fill="white" transform={`rotate(-18 ${leftEyeCenter.x} ${leftEyeCenter.y})`} />
      <ellipse cx={leftEyeCenter.x} cy={leftEyeCenter.y} rx="20" ry="15" fill="none" stroke="#1a0000" strokeWidth="2" transform={`rotate(-18 ${leftEyeCenter.x} ${leftEyeCenter.y})`} />

      {/* Right eye - white almond lens */}
      <ellipse cx={rightEyeCenter.x} cy={rightEyeCenter.y} rx="20" ry="15" fill="white" transform={`rotate(18 ${rightEyeCenter.x} ${rightEyeCenter.y})`} />
      <ellipse cx={rightEyeCenter.x} cy={rightEyeCenter.y} rx="20" ry="15" fill="none" stroke="#1a0000" strokeWidth="2" transform={`rotate(18 ${rightEyeCenter.x} ${rightEyeCenter.y})`} />

      {/* Pupils inside lenses */}
      <ellipse
        cx={leftEyeCenter.x + dx * 0.7}
        cy={leftEyeCenter.y + dy * 0.7}
        rx="10" ry="9"
        fill={isTyping ? "#220000" : "#111"}
        transform={`rotate(-18 ${leftEyeCenter.x + dx * 0.7} ${leftEyeCenter.y + dy * 0.7})`}
      />
      <ellipse
        cx={rightEyeCenter.x + dx * 0.7}
        cy={rightEyeCenter.y + dy * 0.7}
        rx="10" ry="9"
        fill={isTyping ? "#220000" : "#111"}
        transform={`rotate(18 ${rightEyeCenter.x + dx * 0.7} ${rightEyeCenter.y + dy * 0.7})`}
      />
      {/* Eye shine */}
      <ellipse cx={83 + dx * 0.2} cy={59 + dy * 0.2} rx="7" ry="5" fill="rgba(255,255,255,0.35)" transform="rotate(-15 83 59)" />
      <ellipse cx={127 + dx * 0.2} cy={59 + dy * 0.2} rx="7" ry="5" fill="rgba(255,255,255,0.35)" transform="rotate(15 127 59)" />
    </g>
  );
}

function BatmanHead({ mouseAngle, isTyping }: HeadProps) {
  const { dx, dy } = pupilOffset(mouseAngle, 4);
  return (
    <g>
      {/* Bat ears */}
      <polygon points="88,28 80,6 100,22" fill="#111108" />
      <polygon points="138,28 158,6 120,22" fill="#111108" />
      <polygon points="88,28 82,10 98,24" fill="#1a1a10" />
      <polygon points="138,28 156,10 122,24" fill="#1a1a10" />
      {/* Head */}
      <circle cx="113" cy="72" r="48" fill="#1a1a10" stroke="#0d0d08" strokeWidth="3" />
      {/* Head highlight */}
      <ellipse cx="98" cy="50" rx="18" ry="10" fill="rgba(255,255,255,0.08)" transform="rotate(-15 98 50)" />
      {/* Mask seam */}
      <path d="M 80 65 Q 113 58 146 65" fill="none" stroke="#111108" strokeWidth="2" />
      {/* Eye whites - slitted */}
      <ellipse cx="93" cy="68" rx="15" ry="8" fill="white" />
      <ellipse cx="133" cy="68" rx="15" ry="8" fill="white" />
      {/* Eye slits */}
      <path d="M 78 64 Q 93 60 108 64" fill="#111108" />
      <path d="M 118 64 Q 133 60 148 64" fill="#111108" />
      {/* Pupils */}
      <circle cx={93 + dx} cy={68 + dy} r="5" fill="#111108" />
      <circle cx={133 + dx} cy={68 + dy} r="5" fill="#111108" />
      {/* Eye shine */}
      <circle cx={89 + dx * 0.3} cy={65 + dy * 0.3} r="3" fill="rgba(255,255,255,0.6)" />
      <circle cx={129 + dx * 0.3} cy={65 + dy * 0.3} r="3" fill="rgba(255,255,255,0.6)" />
      {/* Gold jaw */}
      <path d="M 88 92 Q 113 100 138 92 Q 135 100 113 104 Q 91 100 88 92 Z" fill="#f9a825" opacity="0.7" />
    </g>
  );
}

function CatHead({ mouseAngle, isTyping }: HeadProps) {
  const { dx, dy } = pupilOffset(mouseAngle, 4);
  return (
    <g>
      {/* Cat ears */}
      <polygon points="82,38 74,16 100,34" fill="#60a5fa" />
      <polygon points="144,38 154,16 126,34" fill="#60a5fa" />
      <polygon points="84,36 78,20 98,34" fill="#bfdbfe" />
      <polygon points="142,36 150,20 128,34" fill="#bfdbfe" />
      {/* Head */}
      <circle cx="113" cy="75" r="46" fill="#93c5fd" stroke="#60a5fa" strokeWidth="2.5" />
      {/* Blush */}
      <ellipse cx="86" cy="84" rx="11" ry="6" fill="#fda4af" opacity="0.5" />
      <ellipse cx="140" cy="84" rx="11" ry="6" fill="#fda4af" opacity="0.5" />
      {/* Eyes */}
      <ellipse cx="94" cy="70" rx="13" ry="15" fill="white" />
      <ellipse cx="132" cy="70" rx="13" ry="15" fill="white" />
      {/* Pupils (cat slit pupils) */}
      <ellipse cx={94 + dx} cy={70 + dy} rx="5" ry="8" fill="#1e3a5f" />
      <ellipse cx={132 + dx} cy={70 + dy} rx="5" ry="8" fill="#1e3a5f" />
      <circle cx={91 + dx * 0.3} cy={64 + dy * 0.3} r="2.5" fill="white" opacity="0.8" />
      <circle cx={129 + dx * 0.3} cy={64 + dy * 0.3} r="2.5" fill="white" opacity="0.8" />
      {/* Nose */}
      <polygon points="113,82 109,87 117,87" fill="#fda4af" />
      {/* Mouth */}
      <path d="M 109 87 Q 113 92 117 87" fill="none" stroke="#dba0b0" strokeWidth="1.5" />
      {/* Whiskers */}
      <line x1="68" y1="85" x2="90" y2="84" stroke="#e0e0e0" strokeWidth="1.2" />
      <line x1="68" y1="90" x2="90" y2="88" stroke="#e0e0e0" strokeWidth="1.2" />
      <line x1="136" y1="84" x2="158" y2="85" stroke="#e0e0e0" strokeWidth="1.2" />
      <line x1="136" y1="88" x2="158" y2="90" stroke="#e0e0e0" strokeWidth="1.2" />
    </g>
  );
}

function BunnyHead({ mouseAngle, isTyping }: HeadProps) {
  const { dx, dy } = pupilOffset(mouseAngle, 4);
  return (
    <g>
      {/* Long ears */}
      <ellipse cx="88" cy="22" rx="13" ry="30" fill="#c4b5fd" />
      <ellipse cx="138" cy="22" rx="13" ry="30" fill="#c4b5fd" />
      <ellipse cx="88" cy="22" rx="7" ry="22" fill="#fda4af" />
      <ellipse cx="138" cy="22" rx="7" ry="22" fill="#fda4af" />
      {/* Head */}
      <circle cx="113" cy="78" r="44" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2.5" />
      {/* Blush */}
      <ellipse cx="88" cy="86" rx="11" ry="6" fill="#fda4af" opacity="0.5" />
      <ellipse cx="138" cy="86" rx="11" ry="6" fill="#fda4af" opacity="0.5" />
      {/* Eyes */}
      <circle cx="96" cy="72" r="13" fill="white" />
      <circle cx="130" cy="72" r="13" fill="white" />
      <circle cx={96 + dx} cy={72 + dy} r="7" fill="#7c3aed" />
      <circle cx={130 + dx} cy={72 + dy} r="7" fill="#7c3aed" />
      <circle cx={92 + dx * 0.3} cy={68 + dy * 0.3} r="3" fill="white" opacity="0.8" />
      <circle cx={126 + dx * 0.3} cy={68 + dy * 0.3} r="3" fill="white" opacity="0.8" />
      {/* Nose */}
      <ellipse cx="113" cy="85" rx="5" ry="4" fill="#fda4af" />
      <path d="M 108 89 Q 113 94 118 89" fill="none" stroke="#e08090" strokeWidth="1.5" />
    </g>
  );
}

function DinoHead({ mouseAngle, isTyping }: HeadProps) {
  const { dx, dy } = pupilOffset(mouseAngle, 4);
  return (
    <g>
      {/* Dino spikes */}
      <polygon points="100,28 95,12 108,26" fill="#22c55e" />
      <polygon points="113,24 113,6 120,22" fill="#22c55e" />
      <polygon points="126,28 131,12 118,26" fill="#22c55e" />
      {/* Head */}
      <circle cx="113" cy="76" r="46" fill="#4ade80" stroke="#22c55e" strokeWidth="2.5" />
      {/* Scale pattern */}
      <g fill="rgba(34,197,94,0.25)">
        {[0,1,2,3].map(r => [0,1,2,3,4].map(c => (
          <circle key={`${r}-${c}`} cx={82 + c * 16} cy={58 + r * 16} r="5" />
        )))}
      </g>
      {/* Eyes */}
      <circle cx="94" cy="70" r="13" fill="white" />
      <circle cx="132" cy="70" r="13" fill="white" />
      <circle cx={94 + dx} cy={70 + dy} r="7" fill="#14532d" />
      <circle cx={132 + dx} cy={70 + dy} r="7" fill="#14532d" />
      <circle cx={90 + dx * 0.3} cy={66 + dy * 0.3} r="3" fill="white" opacity="0.8" />
      <circle cx={128 + dx * 0.3} cy={66 + dy * 0.3} r="3" fill="white" opacity="0.8" />
      {/* Dino mouth */}
      <path d="M 92 90 Q 113 102 134 90" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

function PuppyHead({ mouseAngle, isTyping }: HeadProps) {
  const { dx, dy } = pupilOffset(mouseAngle, 4);
  return (
    <g>
      {/* Floppy ears */}
      <ellipse cx="76" cy="60" rx="18" ry="28" fill="#d97706" />
      <ellipse cx="150" cy="60" rx="18" ry="28" fill="#d97706" />
      {/* Head */}
      <circle cx="113" cy="74" r="46" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
      {/* Blush */}
      <ellipse cx="86" cy="84" rx="12" ry="6" fill="#fca5a5" opacity="0.5" />
      <ellipse cx="140" cy="84" rx="12" ry="6" fill="#fca5a5" opacity="0.5" />
      {/* Eyes */}
      <circle cx="95" cy="68" r="14" fill="white" />
      <circle cx="131" cy="68" r="14" fill="white" />
      <circle cx={95 + dx} cy={68 + dy} r="8" fill="#7c2d12" />
      <circle cx={131 + dx} cy={68 + dy} r="8" fill="#7c2d12" />
      <circle cx={91 + dx * 0.3} cy={64 + dy * 0.3} r="3" fill="white" opacity="0.9" />
      <circle cx={127 + dx * 0.3} cy={64 + dy * 0.3} r="3" fill="white" opacity="0.9" />
      {/* Nose */}
      <ellipse cx="113" cy="84" rx="10" ry="7" fill="#92400e" />
      <circle cx="110" cy="82" r="2.5" fill="#fde68a" opacity="0.5" />
      {/* Mouth */}
      <path d="M 104 90 Q 113 98 122 90" fill="none" stroke="#7c2d12" strokeWidth="2" />
    </g>
  );
}

function BearHead({ mouseAngle, isTyping }: HeadProps) {
  const { dx, dy } = pupilOffset(mouseAngle, 4);
  return (
    <g>
      {/* Round ears */}
      <circle cx="76" cy="42" rx="18" fill="#d97706" />
      <circle cx="150" cy="42" rx="18" fill="#d97706" />
      <circle cx="76" cy="42" rx="11" fill="#fde68a" />
      <circle cx="150" cy="42" rx="11" fill="#fde68a" />
      {/* Head */}
      <circle cx="113" cy="76" r="48" fill="#d97706" stroke="#b45309" strokeWidth="2.5" />
      {/* Muzzle */}
      <ellipse cx="113" cy="90" rx="20" ry="14" fill="#fde68a" />
      {/* Eyes */}
      <circle cx="94" cy="68" r="13" fill="white" />
      <circle cx="132" cy="68" r="13" fill="white" />
      <circle cx={94 + dx} cy={68 + dy} r="7" fill="#451a03" />
      <circle cx={132 + dx} cy={68 + dy} r="7" fill="#451a03" />
      <circle cx={90 + dx * 0.3} cy={64 + dy * 0.3} r="3" fill="white" opacity="0.9" />
      <circle cx={128 + dx * 0.3} cy={64 + dy * 0.3} r="3" fill="white" opacity="0.9" />
      {/* Nose */}
      <ellipse cx="113" cy="88" rx="8" ry="6" fill="#78350f" />
      <circle cx="110" cy="86" r="2" fill="#fde68a" opacity="0.5" />
      {/* Mouth */}
      <path d="M 105 94 Q 113 101 121 94" fill="none" stroke="#78350f" strokeWidth="2" />
    </g>
  );
}

// ─── MAIN STICKER COMPONENT ──────────────────────────────────────────────────

const bodyMap: Record<string, (p: { isTyping: boolean }) => JSX.Element> = {
  piggy:  ({ isTyping }) => <PiggyBody isTyping={isTyping} />,
  spidey: ({ isTyping }) => <SpideyBody isTyping={isTyping} />,
  batman: ({ isTyping }) => <BatmanBody isTyping={isTyping} />,
  cat:    ({ isTyping }) => <CatBody isTyping={isTyping} />,
  bunny:  ({ isTyping }) => <BunnyBody isTyping={isTyping} />,
  dino:   ({ isTyping }) => <DinoBody isTyping={isTyping} />,
  puppy:  ({ isTyping }) => <PuppyBody isTyping={isTyping} />,
  bear:   ({ isTyping }) => <BearBody isTyping={isTyping} />,
};

const headMap: Record<string, (p: HeadProps) => JSX.Element> = {
  piggy:  (p) => <PiggyHead {...p} />,
  spidey: (p) => <SpideyHead {...p} />,
  batman: (p) => <BatmanHead {...p} />,
  cat:    (p) => <CatHead {...p} />,
  bunny:  (p) => <BunnyHead {...p} />,
  dino:   (p) => <DinoHead {...p} />,
  puppy:  (p) => <PuppyHead {...p} />,
  bear:   (p) => <BearHead {...p} />,
};

export function CharacterSticker({
  characterId,
  size = 180,
  mouseAngle = 0,
  isTyping = false,
  style,
}: CharacterStickerProps) {
  const BodyComp = bodyMap[characterId] || bodyMap.piggy;
  const HeadComp = headMap[characterId] || headMap.piggy;

  return (
    <svg
      viewBox="0 0 200 215"
      width={size}
      height={size * (215 / 200)}
      style={{ display: 'block', overflow: 'visible', ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Sticker white outline */}
        <filter id={`sticker-${characterId}`} x="-15%" y="-15%" width="130%" height="130%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="5" result="dilated" />
          <feFlood floodColor="white" result="white" />
          <feComposite in="white" in2="dilated" operator="in" result="outline" />
          <feMerge>
            <feMergeNode in="outline" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Drop shadow */}
        <filter id={`shadow-${characterId}`} x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="rgba(0,0,0,0.3)" />
        </filter>
        {/* Screen glow gradient */}
        <linearGradient id="screenGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* Full sticker group with outline + shadow */}
      <g
        filter={`url(#sticker-${characterId})`}
        style={{ filter: `url(#sticker-${characterId}) drop-shadow(0 10px 18px rgba(0,0,0,0.3))` }}
      >
        {/* Layer 1: Chair (behind everything) */}
        <GamingChair />

        {/* Layer 2: Character body (in chair, behind laptop) */}
        <BodyComp isTyping={isTyping} />

        {/* Layer 3: Laptop (in front of body/lap) */}
        <Laptop isTyping={isTyping} />

        {/* Layer 4: Character head (on top, in front) */}
        <HeadComp mouseAngle={mouseAngle} isTyping={isTyping} />
      </g>
    </svg>
  );
}
