import React from 'react';
import { 
  SupermanShield, 
  HeatVisionIcon, 
  VortexIcon, 
  SuperPunchIcon, 
  FortressCrystalIcon, 
  KryptoniteClusterIcon, 
  SolarBurstIcon 
} from './ComicIcons';
import { COLORS } from '../logic/unoEngine';

export default function CardView({
  card,
  isPlayable = false,
  onClick = null,
  size = 'md',
  isFaceDown = false,
  style = {},
  className = '',
  disabled = false,
}) {
  // Dimensions based on size
  const sizeClasses = {
    sm: 'w-16 h-24 text-xs',
    md: 'w-24 h-36 md:w-28 md:h-42 text-sm',
    lg: 'w-32 h-48 md:w-36 md:h-54 text-base',
    pile: 'w-28 h-42 md:w-32 md:h-48 text-sm',
  }[size] || 'w-24 h-36 text-sm';

  // Render Face Down Card (Deck or Bot Hand)
  if (isFaceDown) {
    return (
      <div
        style={style}
        className={`relative ${sizeClasses} rounded-2xl comic-border bg-gradient-to-br from-blue-950 via-slate-900 to-red-950 flex flex-col items-center justify-center shadow-xl select-none overflow-hidden transition-all duration-200 ${className}`}
      >
        {/* Halftone pattern */}
        <div className="absolute inset-0 opacity-20 halftone-dark pointer-events-none" />
        
        {/* Decorative inner border */}
        <div className="absolute inset-1.5 border-2 border-yellow-500/70 rounded-xl pointer-events-none" />

        {/* Central Superman Crest */}
        <div className="relative z-10 flex flex-col items-center justify-center p-1">
          <SupermanShield className={size === 'sm' ? 'w-8 h-8' : 'w-14 h-14'} glow />
          <span className="font-comic text-yellow-400 text-xs tracking-wider mt-1 drop-shadow-[1px_1px_0px_#000]">
            DC UNO
          </span>
        </div>
      </div>
    );
  }

  if (!card) return null;

  const colorMeta = COLORS[card.color] || COLORS.wild;

  // Background gradients based on card color
  const getBgGradient = () => {
    switch (card.color) {
      case 'red':
        return 'from-rose-500 via-red-600 to-rose-900 text-white';
      case 'blue':
        return 'from-sky-400 via-blue-600 to-indigo-900 text-white';
      case 'yellow':
        return 'from-amber-300 via-yellow-400 to-amber-600 text-slate-950';
      case 'green':
        return 'from-emerald-400 via-green-600 to-emerald-950 text-white';
      default:
        // Wild or Special
        return 'from-slate-900 via-purple-950 to-indigo-950 text-yellow-300';
    }
  };

  // Render Card Center Visual
  const renderCardCenter = () => {
    switch (card.value) {
      case 'skip':
        return (
          <div className="flex flex-col items-center justify-center">
            <HeatVisionIcon className={size === 'sm' ? 'w-8 h-8' : 'w-14 h-14'} />
            <span className="font-comic text-xs uppercase tracking-wider mt-0.5 text-center drop-shadow-[1px_1px_0px_#000]">
              SKIP
            </span>
          </div>
        );
      case 'reverse':
        return (
          <div className="flex flex-col items-center justify-center">
            <VortexIcon className={size === 'sm' ? 'w-8 h-8' : 'w-14 h-14'} />
            <span className="font-comic text-xs uppercase tracking-wider mt-0.5 text-center drop-shadow-[1px_1px_0px_#000]">
              REVERSE
            </span>
          </div>
        );
      case 'draw2':
        return (
          <div className="flex flex-col items-center justify-center">
            <SuperPunchIcon className={size === 'sm' ? 'w-8 h-8' : 'w-14 h-14'} />
            <span className="font-comic text-xl font-bold tracking-tight text-yellow-300 drop-shadow-[2px_2px_0px_#000]">
              +2
            </span>
          </div>
        );
      case 'wild':
        return (
          <div className="flex flex-col items-center justify-center">
            <FortressCrystalIcon className={size === 'sm' ? 'w-8 h-8' : 'w-14 h-14'} />
            {/* 4 Colors Accent Dots */}
            <div className="flex gap-1 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black shadow" />
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 border border-black shadow" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black shadow" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black shadow" />
            </div>
            <span className="font-comic text-[11px] uppercase tracking-wider text-amber-300 drop-shadow-[1px_1px_0px_#000]">
              WILD
            </span>
          </div>
        );
      case 'wild_draw4':
        return (
          <div className="flex flex-col items-center justify-center">
            <KryptoniteClusterIcon className={size === 'sm' ? 'w-8 h-8' : 'w-14 h-14'} />
            <span className="font-comic text-2xl font-black text-emerald-300 drop-shadow-[2px_2px_0px_#000]">
              +4
            </span>
            <span className="font-comic text-[10px] uppercase text-emerald-200 tracking-wider">
              KRYPTONITE
            </span>
          </div>
        );
      case 'solar_burst':
        return (
          <div className="flex flex-col items-center justify-center">
            <SolarBurstIcon className={size === 'sm' ? 'w-8 h-8' : 'w-14 h-14'} />
            <span className="font-comic text-xs uppercase font-extrabold text-amber-300 drop-shadow-[1px_1px_0px_#000]">
              SOLAR BURST
            </span>
          </div>
        );
      default:
        // Regular number card
        return (
          <div className="relative flex items-center justify-center">
            {/* Comic Oval Badge */}
            <div className="w-14 h-20 md:w-16 md:h-24 rounded-full bg-white/20 backdrop-blur-xs border-2 border-black/30 flex items-center justify-center shadow-inner">
              <span className="font-comic text-4xl md:text-5xl font-black leading-none drop-shadow-[3px_3px_0px_#000]">
                {card.value}
              </span>
            </div>
            {/* Subtle Superman Watermark in background */}
            <div className="absolute opacity-15 pointer-events-none">
              <SupermanShield className="w-12 h-12" />
            </div>
          </div>
        );
    }
  };

  // Corner symbol representation
  const renderCornerSymbol = () => {
    if (card.value === 'skip') return '⊘';
    if (card.value === 'reverse') return '⇄';
    if (card.value === 'draw2') return '+2';
    if (card.value === 'wild') return '★';
    if (card.value === 'wild_draw4') return '+4';
    if (card.value === 'solar_burst') return '☀';
    return card.value;
  };

  const cornerSym = renderCornerSymbol();

  return (
    <div
      onClick={isPlayable && !disabled ? onClick : undefined}
      style={style}
      title={`${card.name}: ${card.lore}`}
      className={`
        relative ${sizeClasses} rounded-2xl comic-border
        bg-gradient-to-br ${getBgGradient()}
        flex flex-col justify-between p-2
        select-none transition-all duration-200
        ${isPlayable && !disabled ? 'cursor-pointer card-hover playable-glow ring-2 ring-yellow-400' : ''}
        ${!isPlayable && onClick && !disabled ? 'opacity-70 saturate-75 cursor-not-allowed' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {/* Halftone texture overlay */}
      <div className={`absolute inset-0 opacity-15 pointer-events-none rounded-2xl halftone-${card.color === 'wild' ? 'dark' : card.color}`} />

      {/* Top Left Corner Index */}
      <div className="relative z-10 flex flex-col items-center self-start leading-none font-comic text-base md:text-lg drop-shadow-[1px_1px_0px_#000]">
        <span>{cornerSym}</span>
        {card.color !== 'wild' && (
          <span className="w-1.5 h-1.5 rounded-full bg-white border border-black mt-0.5" />
        )}
      </div>

      {/* Center Art */}
      <div className="relative z-10 flex items-center justify-center my-auto">
        {renderCardCenter()}
      </div>

      {/* Bottom Right Corner Index (Inverted) */}
      <div className="relative z-10 flex flex-col items-center self-end leading-none font-comic text-base md:text-lg rotate-180 drop-shadow-[1px_1px_0px_#000]">
        <span>{cornerSym}</span>
        {card.color !== 'wild' && (
          <span className="w-1.5 h-1.5 rounded-full bg-white border border-black mt-0.5" />
        )}
      </div>
    </div>
  );
}
