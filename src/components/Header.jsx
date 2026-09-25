import React from 'react';
import { SupermanShield } from './ComicIcons';
import { Volume2, VolumeX, HelpCircle, RotateCcw, Users, Swords } from 'lucide-react';

export default function Header({
  playerCount,
  onChangeMode,
  isMuted,
  onToggleSound,
  onOpenRules,
  onRestart,
}) {
  return (
    <header className="w-full bg-slate-950/95 border-b-3 border-black py-2.5 px-4 shadow-xl select-none sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Superman Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <SupermanShield className="w-10 h-10 md:w-12 md:h-12" glow />
          </div>
          <div className="flex flex-col">
            <h1 className="font-comic text-xl md:text-3xl text-yellow-400 tracking-wider leading-none comic-title-hero">
              SUPERMAN <span className="text-red-500">UNO</span>
            </h1>
            <span className="text-[10px] md:text-xs text-sky-300 font-heading tracking-widest uppercase">
              Battle for Metropolis • DC Comics Edition
            </span>
          </div>
        </div>

        {/* Center: Game Mode Toggle */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl comic-border border-slate-700">
          <button
            onClick={() => onChangeMode(2)}
            className={`
              flex items-center gap-1.5 px-3 py-1 rounded-lg font-comic text-xs md:text-sm transition-all cursor-pointer
              ${playerCount === 2 
                ? 'bg-red-600 text-yellow-300 shadow-md scale-102' 
                : 'text-slate-400 hover:text-white'
              }
            `}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>2P DUEL (VS LUTHOR)</span>
          </button>
          <button
            onClick={() => onChangeMode(4)}
            className={`
              flex items-center gap-1.5 px-3 py-1 rounded-lg font-comic text-xs md:text-sm transition-all cursor-pointer
              ${playerCount === 4 
                ? 'bg-blue-600 text-yellow-300 shadow-md scale-102' 
                : 'text-slate-400 hover:text-white'
              }
            `}
          >
            <Users className="w-3.5 h-3.5" />
            <span>4P JUSTICE LEAGUE</span>
          </button>
        </div>

        {/* Right: Sound, Rules, Restart Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-yellow-400 rounded-xl comic-border border-slate-700 cursor-pointer transition-transform active:scale-95"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Rules Guide */}
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-sky-300 rounded-xl comic-border border-slate-700 font-comic text-xs md:text-sm cursor-pointer transition-transform active:scale-95"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">RULES</span>
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            className="flex items-center gap-1 px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded-xl comic-border font-comic text-xs md:text-sm cursor-pointer transition-transform active:scale-95"
            title="Restart Match"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">RESTART</span>
          </button>
        </div>
      </div>
    </header>
  );
}
