import React from 'react';
import CardView from './CardView';
import { BatmanEmblem, WonderWomanEmblem, LexCorpEmblem, SupermanShield } from './ComicIcons';

export default function BotPlayer({
  bot,
  isTurn,
  position = 'top', // 'top' | 'left' | 'right'
  speech = null,
}) {
  if (!bot) return null;

  const cardCount = bot.hand.length;
  const isUno = cardCount === 1;

  // Render Bot Emblem
  const renderEmblem = () => {
    switch (bot.id) {
      case 'batman':
        return <BatmanEmblem className="w-7 h-7 text-yellow-400" />;
      case 'wonderwoman':
        return <WonderWomanEmblem className="w-8 h-6" />;
      case 'lexluthor':
        return <LexCorpEmblem className="w-7 h-7" />;
      default:
        return <SupermanShield className="w-7 h-7" />;
    }
  };

  return (
    <div className={`flex flex-col items-center select-none relative ${isTurn ? 'scale-105' : 'opacity-90'} transition-transform duration-200`}>
      {/* Dynamic Comic Speech Bubble */}
      {speech && (
        <div className="absolute -top-12 z-30 max-w-xs animate-comic-pop">
          <div className="comic-speech comic-speech-bottom px-3 py-1 text-xs font-bold text-slate-900 whitespace-nowrap shadow-md">
            "{speech}"
          </div>
        </div>
      )}

      {/* Bot Card Header / Profile */}
      <div 
        className={`
          flex items-center gap-2.5 px-3 py-1.5 rounded-xl comic-border bg-slate-900/95
          ${isTurn ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] ring-2 ring-yellow-400' : 'border-slate-700'}
        `}
      >
        {/* Emblem Circle */}
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${bot.avatarColor} flex items-center justify-center border-2 border-black shadow`}>
          {renderEmblem()}
        </div>

        {/* Name & Role */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-comic text-sm md:text-base text-yellow-300 drop-shadow-[1px_1px_0px_#000]">
              {bot.name}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
              {bot.badge}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 font-heading">
            {isTurn ? '⚡ Deciding move...' : bot.role}
          </span>
        </div>

        {/* Card Count Pill */}
        <div className="ml-2 flex flex-col items-center">
          <div 
            className={`
              px-2.5 py-0.5 rounded-full font-comic text-xs md:text-sm border-2 border-black font-black
              ${isUno 
                ? 'bg-red-600 text-yellow-300 animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]' 
                : 'bg-yellow-400 text-slate-950'
              }
            `}
          >
            {isUno ? 'UNO! (1)' : `${cardCount}`}
          </div>
        </div>
      </div>

      {/* Mini Fanned Face-down Deck Representation */}
      <div className="flex items-center -space-x-10 mt-2 overflow-visible h-14">
        {Array.from({ length: Math.min(cardCount, 8) }).map((_, idx) => (
          <div
            key={idx}
            style={{
              transform: `rotate(${(idx - Math.min(cardCount, 8) / 2) * 4}deg)`,
              zIndex: idx,
            }}
            className="transition-transform"
          >
            <CardView isFaceDown size="sm" className="w-10 h-14 scale-80" />
          </div>
        ))}
      </div>
    </div>
  );
}
