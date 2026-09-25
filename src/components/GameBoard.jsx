import React from 'react';
import CardView from './CardView';
import { COLORS } from '../logic/unoEngine';
import { SupermanShield } from './ComicIcons';
import { RotateCw, RotateCcw, Sparkles } from 'lucide-react';

export default function GameBoard({
  topCard,
  activeColor,
  drawDeckCount,
  direction,
  isMyTurn,
  onDrawCard,
  actionBurst,
  disabled = false,
  canPass = false,
  onPassTurn = null,
}) {
  const activeColorInfo = COLORS[activeColor] || COLORS.red;

  return (
    <div className="relative w-full max-w-2xl min-h-[260px] md:min-h-[300px] flex items-center justify-center p-4">
      {/* Table Background with Metropolis Skyline Aura */}
      <div className="absolute inset-0 bg-radial from-slate-900/90 via-slate-950/95 to-black rounded-3xl comic-border-thick border-slate-800 shadow-2xl overflow-hidden">
        {/* Halftone texture */}
        <div className="absolute inset-0 opacity-10 halftone-dark pointer-events-none" />

        {/* Orbit Direction Ring */}
        <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-slate-700/50 pointer-events-none flex items-center justify-between px-6">
          <div className="flex items-center gap-1.5 text-slate-500 font-heading text-xs tracking-wider">
            {direction === 1 ? (
              <>
                <RotateCw className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>CLOCKWISE ORBIT</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>REVERSED ORBIT</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comic Action Burst Overlay */}
      {actionBurst && (
        <div className="absolute z-50 pointer-events-none flex items-center justify-center animate-comic-pop">
          <div className="relative bg-yellow-400 text-slate-950 px-6 py-3 rounded-2xl comic-border-thick rotate-[-6deg] shadow-[0_0_35px_rgba(250,204,21,1)]">
            <span className="font-comic text-2xl md:text-4xl font-black uppercase tracking-wider block text-center drop-shadow-[2px_2px_0px_#fff]">
              {actionBurst}
            </span>
            <div className="absolute -top-3 -right-3 text-red-600">
              <Sparkles className="w-8 h-8 fill-red-600 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        </div>
      )}

      {/* Central Cards Arena */}
      <div className="relative z-10 flex items-center justify-center gap-6 md:gap-10">
        {/* Draw Pile (Deck) */}
        <div className="flex flex-col items-center">
          <div
            onClick={isMyTurn && !disabled ? onDrawCard : undefined}
            className={`
              relative cursor-pointer transition-transform
              ${isMyTurn && !disabled ? 'hover:scale-105 active:scale-95 ring-2 ring-yellow-400 rounded-2xl' : 'cursor-not-allowed opacity-85'}
            `}
            title={isMyTurn ? "Click to Draw a Card from Metropolis Deck" : "Wait for your turn"}
          >
            {/* 3D Stack Effect underneath */}
            <div className="absolute top-2 left-2 w-24 h-36 md:w-28 md:h-42 bg-slate-900 rounded-2xl comic-border opacity-70 -z-10" />
            <div className="absolute top-1 left-1 w-24 h-36 md:w-28 md:h-42 bg-blue-950 rounded-2xl comic-border opacity-85 -z-5" />

            <CardView isFaceDown size="md" />

            {/* Draw prompt badge */}
            {isMyTurn && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-950 text-[10px] md:text-xs font-comic px-2.5 py-0.5 rounded-full border border-black shadow whitespace-nowrap animate-pulse">
                DRAW CARD
              </div>
            )}
          </div>

          <span className="text-[11px] font-heading text-slate-400 mt-3">
            Deck: {drawDeckCount} cards
          </span>

          {/* Pass button if player drew and cannot play */}
          {canPass && isMyTurn && (
            <button
              onClick={onPassTurn}
              className="mt-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-yellow-300 border border-slate-600 rounded-lg text-xs font-comic tracking-wide"
            >
              PASS TURN
            </button>
          )}
        </div>

        {/* Discard Pile (Active Card on Top) */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {/* Visual bottom layer card tilt */}
            <div className="absolute top-1 -left-1 w-24 h-36 md:w-28 md:h-42 bg-slate-800 rounded-2xl comic-border opacity-40 rotate-6 -z-10" />
            <div className="absolute -top-1 left-1 w-24 h-36 md:w-28 md:h-42 bg-slate-800 rounded-2xl comic-border opacity-50 -rotate-3 -z-5" />

            <CardView card={topCard} size="md" />
          </div>

          <span className="text-[11px] font-heading text-slate-400 mt-3">
            Current Discard
          </span>
        </div>
      </div>

      {/* Active Color Indicator Banner */}
      <div className="absolute bottom-3 flex items-center gap-2 bg-slate-900/95 px-4 py-1.5 rounded-full comic-border border-yellow-500/40 shadow-lg">
        <span className="text-xs font-heading text-slate-400 uppercase tracking-wider">
          Active Color:
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className="w-3.5 h-3.5 rounded-full border border-black shadow"
            style={{ backgroundColor: activeColorInfo.hex }}
          />
          <span
            className="font-comic text-xs md:text-sm tracking-wide"
            style={{ color: activeColorInfo.hex }}
          >
            {activeColorInfo.name}
          </span>
        </div>
      </div>
    </div>
  );
}
