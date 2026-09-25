import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SupermanShield, BatmanEmblem, WonderWomanEmblem, LexCorpEmblem } from './ComicIcons';
import { Trophy, RotateCcw } from 'lucide-react';

export default function GameOverModal({
  winner,
  players,
  turnCount,
  onRestart,
}) {
  const isHumanWinner = winner?.id === 'superman';

  useEffect(() => {
    if (isHumanWinner) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#facc15', '#0284c7', '#ffffff']
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [isHumanWinner]);

  // Winner emblem
  const renderWinnerEmblem = () => {
    switch (winner?.id) {
      case 'superman':
        return <SupermanShield className="w-16 h-16" glow />;
      case 'batman':
        return <BatmanEmblem className="w-16 h-12 text-yellow-400" />;
      case 'wonderwoman':
        return <WonderWomanEmblem className="w-16 h-12" />;
      case 'lexluthor':
        return <LexCorpEmblem className="w-16 h-16" />;
      default:
        return <SupermanShield className="w-16 h-16" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-comic-pop">
      <div className="w-full max-w-lg bg-slate-900 rounded-3xl comic-border-thick border-yellow-400 p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Hero Banner / Emblem */}
        <div className="mb-3 relative">
          <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center comic-border border-yellow-400 shadow-xl">
            {renderWinnerEmblem()}
          </div>
          {isHumanWinner && (
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-slate-950 p-2 rounded-full border-2 border-black">
              <Trophy className="w-5 h-5 fill-slate-950" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className={`font-comic text-3xl md:text-5xl ${isHumanWinner ? 'text-yellow-300' : 'text-red-500'} comic-title mb-2`}>
          {isHumanWinner ? 'HEROIC VICTORY!' : 'MISSION COMPROMISED!'}
        </h2>

        {/* Subtitle / Flavor text */}
        <p className="font-heading text-lg text-slate-200 mb-4">
          {isHumanWinner 
            ? 'Superman has triumphed! Metropolis is safe once again!' 
            : `${winner?.name} has cleared their hand and claimed supremacy!`}
        </p>

        {/* Winner Quote Box */}
        <div className="w-full bg-slate-950/80 p-3 rounded-2xl comic-border border-slate-700 mb-5">
          <p className="text-yellow-400 text-sm italic font-body">
            "{winner?.quotes?.[0] || 'A legendary game!'}"
          </p>
        </div>

        {/* Players Final Hand Summary */}
        <div className="w-full grid grid-cols-2 gap-2 mb-6 text-left">
          {players.map((p) => (
            <div key={p.id} className="bg-slate-800/80 px-3 py-2 rounded-xl flex items-center justify-between text-xs font-heading">
              <span className="text-slate-200 truncate">{p.name}</span>
              <span className={`font-bold ${p.hand.length === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {p.hand.length === 0 ? 'WINNER (0)' : `${p.hand.length} left`}
              </span>
            </div>
          ))}
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full py-3.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-red-600 hover:from-yellow-300 hover:to-red-500 text-slate-950 font-comic text-2xl rounded-2xl comic-border flex items-center justify-center gap-2 cursor-pointer shadow-xl transition-transform active:scale-95"
        >
          <RotateCcw className="w-6 h-6 stroke-[3]" />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
}
