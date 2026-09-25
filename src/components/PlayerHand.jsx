import React from 'react';
import CardView from './CardView';
import { canPlayCard } from '../logic/unoEngine';
import { SupermanShield } from './ComicIcons';
import { AlertCircle, Zap, ShieldAlert } from 'lucide-react';

export default function PlayerHand({
  player,
  topCard,
  activeColor,
  isMyTurn,
  onPlayCard,
  onCallUno,
  hasCalledUno,
  canChallengeUno = false,
  onChallengeUno,
  disabled = false,
}) {
  const cards = player?.hand || [];
  const cardCount = cards.length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Player Status Bar / Hero Info & Action Buttons */}
      <div className="w-full max-w-5xl px-4 py-2 flex flex-wrap items-center justify-between gap-3 z-20">
        {/* Left: Superman Avatar, Turn Badge & UNO Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 bg-slate-900/95 px-4 py-2 rounded-xl comic-border border-yellow-500/60 shadow-lg">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 to-red-600 flex items-center justify-center border-2 border-yellow-400 shadow-md">
                <SupermanShield className="w-6 h-6" glow />
              </div>
              {isMyTurn && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-comic text-base md:text-lg text-yellow-300 drop-shadow-[1px_1px_0px_#000]">
                  {player.name}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-red-700 text-white border border-black uppercase shadow">
                  {cardCount} {cardCount === 1 ? 'Card' : 'Cards'}
                </span>
              </div>
              <p className="text-[11px] text-sky-300 font-heading tracking-wide">
                {isMyTurn ? "★ YOUR TURN - SELECT A CARD OR DRAW" : "Waiting for opponents..."}
              </p>
            </div>
          </div>

          {/* Call UNO Action Button */}
          <button
            onClick={onCallUno}
            disabled={hasCalledUno}
            className={`
              relative px-4 py-2 rounded-xl font-comic text-sm md:text-base tracking-wider comic-border transition-all duration-200 shadow-xl
              ${hasCalledUno 
                ? 'bg-slate-700 text-slate-400 border-slate-600 cursor-default opacity-80' 
                : cardCount <= 2 
                  ? 'bg-gradient-to-r from-amber-500 via-red-600 to-yellow-500 text-white animate-bounce shadow-[0_0_20px_rgba(239,68,68,0.9)] cursor-pointer hover:scale-105 active:scale-95' 
                  : 'bg-red-700 hover:bg-red-600 text-yellow-300 cursor-pointer active:scale-95'
              }
            `}
          >
            <span className="flex items-center gap-1.5">
              <Zap className={`w-4 h-4 ${hasCalledUno ? 'text-slate-400' : 'text-yellow-300 fill-yellow-300'}`} />
              {hasCalledUno ? 'UNO CALLED! ✓' : 'CALL UNO!'}
            </span>
          </button>

          {/* Challenge Bot UNO button */}
          {canChallengeUno && (
            <button
              onClick={onChallengeUno}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-95 text-white font-comic text-xs md:text-sm rounded-xl comic-border flex items-center gap-1.5 shadow-xl transition-transform cursor-pointer animate-pulse"
              title="Catch an opponent who forgot to call UNO! (+2 cards penalty)"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-300" />
              <span>CATCH OPPONENT UNO! (+2)</span>
            </button>
          )}
        </div>
      </div>

      {/* Cards Fan / Hand Container */}
      <div className="w-full max-w-6xl overflow-x-auto pb-8 pt-4 px-4 flex items-center justify-start md:justify-center scrollbar-thin">
        <div className="flex items-center -space-x-6 md:-space-x-8 hover:space-x-1 transition-all duration-300 py-3 px-4 min-w-max">
          {cards.map((card, idx) => {
            const playable = isMyTurn && !disabled && canPlayCard(card, topCard, activeColor);
            
            // Calculate a gentle rotation angle for a natural physical hand fanning effect
            const mid = (cards.length - 1) / 2;
            const offset = idx - mid;
            const rot = Math.max(-10, Math.min(10, offset * 1.8));
            const yOffset = Math.abs(offset) * 1.5;

            return (
              <div
                key={card.id || idx}
                style={{
                  transform: `rotate(${rot}deg) translateY(${yOffset}px)`,
                  zIndex: 10 + idx,
                }}
                className="transition-all duration-200 origin-bottom hover:!translate-y-[-28px] hover:!rotate-0 hover:!z-50"
              >
                <CardView
                  card={card}
                  size="md"
                  isPlayable={playable}
                  onClick={() => onPlayCard(card)}
                  disabled={!isMyTurn || disabled}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
