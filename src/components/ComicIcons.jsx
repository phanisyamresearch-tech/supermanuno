import React from 'react';

// Superman "S" Shield
export function SupermanShield({ className = "w-8 h-8", glow = false }) {
  return (
    <svg 
      viewBox="0 0 100 95" 
      className={`${className} ${glow ? 'filter drop-shadow-[0_0_12px_rgba(234,179,8,0.9)]' : ''}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Shield Border */}
      <polygon 
        points="50,4 96,28 78,88 50,96 22,88 4,28" 
        fill="#dc2626" 
        stroke="#000" 
        strokeWidth="4" 
      />
      {/* Inner Yellow Diamond / Shield Base */}
      <polygon 
        points="50,11 88,32 72,82 50,89 28,82 12,32" 
        fill="#facc15" 
        stroke="#000" 
        strokeWidth="3" 
      />
      {/* Red Stylized "S" Emblem */}
      <path 
        d="M 50,15 
           C 65,15 76,20 78,28 
           L 68,34 
           C 65,28 58,25 50,25 
           C 41,25 35,28 35,34 
           C 35,40 40,43 54,47 
           C 69,51 77,57 77,66 
           C 77,77 65,85 48,85 
           C 35,85 24,79 20,70 
           L 30,64 
           C 34,71 41,75 50,75 
           C 58,75 64,72 64,66 
           C 64,60 58,57 44,53 
           C 30,49 22,43 22,34 
           C 22,23 34,15 50,15 Z" 
        fill="#dc2626" 
        stroke="#000" 
        strokeWidth="2.5" 
      />
    </svg>
  );
}

// Batman Silhouette Emblem
export function BatmanEmblem({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 100 65" className={className} fill="currentColor">
      <path 
        d="M 50 15 
           C 46 8, 42 2, 38 0 
           C 37 8, 33 13, 27 15 
           C 15 15, 0 25, 0 45 
           C 8 40, 20 40, 26 48 
           C 32 40, 42 42, 50 62 
           C 58 42, 68 40, 74 48 
           C 80 40, 92 40, 100 45 
           C 100 25, 85 15, 73 15 
           C 67 13, 63 8, 62 0 
           C 58 2, 54 8, 50 15 Z" 
        stroke="#000" 
        strokeWidth="3" 
      />
    </svg>
  );
}

// Wonder Woman Double-W Wings Emblem
export function WonderWomanEmblem({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 100 60" className={className} fill="none">
      <path 
        d="M 5 15 L 25 15 L 38 48 L 48 24 L 52 24 L 62 48 L 75 15 L 95 15 
           L 80 54 L 66 54 L 50 28 L 34 54 L 20 54 Z" 
        fill="#f59e0b" 
        stroke="#000" 
        strokeWidth="3.5" 
      />
      <path 
        d="M 16 15 L 30 15 L 42 38 L 48 25 L 52 25 L 58 38 L 70 15 L 84 15 
           L 70 42 L 50 20 L 30 42 Z" 
        fill="#facc15" 
        opacity="0.9"
      />
    </svg>
  );
}

// LexCorp Toxic Energy Emblem
export function LexCorpEmblem({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* Kryptonite Radiation Hazard */}
      <circle cx="50" cy="50" r="44" fill="#14532d" stroke="#22c55e" strokeWidth="4" />
      <polygon points="50,12 85,75 15,75" fill="#15803d" stroke="#000" strokeWidth="3" opacity="0.6" />
      {/* LexCorp Stylized 'L' */}
      <path 
        d="M 32 24 L 46 24 L 46 62 L 72 62 L 72 74 L 32 74 Z" 
        fill="#22c55e" 
        stroke="#000" 
        strokeWidth="3" 
      />
      {/* Radioactive dots */}
      <circle cx="50" cy="38" r="4" fill="#a7f3d0" />
      <circle cx="68" cy="42" r="3" fill="#a7f3d0" />
    </svg>
  );
}

// Heat Vision Blast (Skip)
export function HeatVisionIcon({ className = "w-10 h-10" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* Comic starburst background */}
      <path 
        d="M50 0 L58 32 L90 20 L68 45 L98 62 L66 68 L78 98 L48 76 L25 96 L34 65 L2 58 L32 42 L8 18 L40 28 Z" 
        fill="#fbbf24" 
        stroke="#000" 
        strokeWidth="3" 
      />
      {/* Glowing Eyes and Beams */}
      <circle cx="36" cy="46" r="9" fill="#ef4444" stroke="#000" strokeWidth="2" />
      <circle cx="64" cy="46" r="9" fill="#ef4444" stroke="#000" strokeWidth="2" />
      <circle cx="36" cy="46" r="4" fill="#ffffff" />
      <circle cx="64" cy="46" r="4" fill="#ffffff" />
      {/* Laser Beams shooting downward */}
      <path d="M 36 54 L 18 95" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" />
      <path d="M 36 54 L 18 95" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
      <path d="M 64 54 L 82 95" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" />
      <path d="M 64 54 L 82 95" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Vortex Rewind (Reverse)
export function VortexIcon({ className = "w-10 h-10" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* Globe */}
      <circle cx="50" cy="50" r="36" fill="#0284c7" stroke="#000" strokeWidth="4" />
      {/* Continents silhouette */}
      <path d="M 30 38 Q 42 28 58 35 Q 65 48 50 60 Q 32 55 30 38 Z" fill="#22c55e" opacity="0.8" />
      {/* Reverse Orbital Arrows */}
      <path 
        d="M 50 10 A 40 40 0 1 1 14 58" 
        stroke="#facc15" 
        strokeWidth="8" 
        strokeDasharray="8 4" 
        strokeLinecap="round" 
      />
      {/* Arrow Heads */}
      <polygon points="50,0 66,16 52,24" fill="#dc2626" stroke="#000" strokeWidth="2.5" />
      <polygon points="6,50 20,68 6,76" fill="#dc2626" stroke="#000" strokeWidth="2.5" />
    </svg>
  );
}

// Super Punch (+2 Card)
export function SuperPunchIcon({ className = "w-10 h-10" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* Comic Hit Star */}
      <polygon 
        points="50,4 62,30 92,20 74,46 98,68 68,72 72,98 46,80 24,96 30,68 2,58 28,42 12,18 40,26" 
        fill="#facc15" 
        stroke="#000" 
        strokeWidth="3.5" 
      />
      {/* Fist */}
      <path 
        d="M 32 40 C 32 30 46 28 54 36 C 58 30 70 34 68 44 C 74 44 76 56 68 64 L 46 72 C 34 72 28 58 32 40 Z" 
        fill="#ef4444" 
        stroke="#000" 
        strokeWidth="3" 
      />
      {/* Speed punch impact lines */}
      <line x1="16" y1="36" x2="6" y2="34" stroke="#000" strokeWidth="3" />
      <line x1="84" y1="30" x2="94" y2="28" stroke="#000" strokeWidth="3" />
      <line x1="82" y1="56" x2="94" y2="60" stroke="#000" strokeWidth="3" />
    </svg>
  );
}

// Fortress Crystals (Wild)
export function FortressCrystalIcon({ className = "w-10 h-10" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* Central Crystal Cluster */}
      <polygon points="50,8 64,52 50,92 36,52" fill="#38bdf8" stroke="#000" strokeWidth="3" />
      <polygon points="50,8 58,52 50,92" fill="#bae6fd" opacity="0.8" />
      {/* Left Crystal */}
      <polygon points="26,28 42,60 30,86 16,56" fill="#0284c7" stroke="#000" strokeWidth="2.5" />
      <polygon points="26,28 34,60 30,86" fill="#7dd3fc" opacity="0.6" />
      {/* Right Crystal */}
      <polygon points="74,28 84,56 70,86 58,60" fill="#0369a1" stroke="#000" strokeWidth="2.5" />
      <polygon points="74,28 78,56 70,86" fill="#bae6fd" opacity="0.7" />
    </svg>
  );
}

// Kryptonite Cluster (Wild Draw 4)
export function KryptoniteClusterIcon({ className = "w-10 h-10" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* Radiation Glow */}
      <circle cx="50" cy="50" r="42" fill="#22c55e" opacity="0.3" filter="blur(4px)" />
      {/* Jagged Green Crystal Matrix */}
      <polygon points="50,6 68,48 50,94 32,48" fill="#16a34a" stroke="#000" strokeWidth="3.5" />
      <polygon points="50,6 60,48 50,94" fill="#4ade80" opacity="0.9" />
      {/* Side shards */}
      <polygon points="24,24 44,54 28,84 12,50" fill="#15803d" stroke="#000" strokeWidth="3" />
      <polygon points="76,24 88,50 72,84 56,54" fill="#14532d" stroke="#000" strokeWidth="3" />
      <polygon points="76,24 80,50 72,84" fill="#86efac" opacity="0.8" />
    </svg>
  );
}

// Solar Burst (Legendary Superman Card)
export function SolarBurstIcon({ className = "w-10 h-10" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* Solar Rays */}
      <g stroke="#f59e0b" strokeWidth="4" strokeLinecap="round">
        <line x1="50" y1="4" x2="50" y2="18" />
        <line x1="50" y1="82" x2="50" y2="96" />
        <line x1="4" y1="50" x2="18" y2="50" />
        <line x1="82" y1="50" x2="96" y2="50" />
        <line x1="18" y1="18" x2="28" y2="28" />
        <line x1="72" y1="72" x2="82" y2="82" />
        <line x1="82" y1="18" x2="72" y2="28" />
        <line x1="18" y1="82" x2="28" y2="72" />
      </g>
      {/* Radiant Sun Core */}
      <circle cx="50" cy="50" r="30" fill="#facc15" stroke="#dc2626" strokeWidth="4" />
      {/* Mini Superman S inside Sun */}
      <polygon points="50,28 72,40 64,68 50,73 36,68 28,40" fill="#dc2626" />
      <polygon points="50,33 66,42 58,64 50,68 42,64 34,42" fill="#facc15" />
    </svg>
  );
}

// Comic "UNO" Logo Badge
export function UnoComicBadge({ className = "w-20 h-12" }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Rotated comic tilt */}
      <div className="transform -rotate-6 bg-red-600 px-3 py-1 rounded-xl comic-border-gold flex items-center justify-center">
        <span className="font-comic text-2xl tracking-wider text-yellow-300 drop-shadow-[2px_2px_0px_#000]">
          UNO!
        </span>
      </div>
    </div>
  );
}
