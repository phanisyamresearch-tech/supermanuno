import React from 'react';
import { COLORS } from '../logic/unoEngine';
import { SupermanShield } from './ComicIcons';

export default function ColorPickerModal({ onSelectColor }) {
  const options = [
    {
      id: 'red',
      name: 'SOLAR CRIMSON',
      sub: "Superman's Cape",
      bg: 'bg-gradient-to-br from-rose-600 to-red-800 hover:from-rose-500 hover:to-red-700',
      border: 'border-rose-400',
      text: 'text-rose-100',
    },
    {
      id: 'blue',
      name: 'METROPOLIS AZURE',
      sub: 'Suit of Steel',
      bg: 'bg-gradient-to-br from-sky-600 to-blue-800 hover:from-sky-500 hover:to-blue-700',
      border: 'border-sky-400',
      text: 'text-sky-100',
    },
    {
      id: 'yellow',
      name: 'SOLAR GOLD',
      sub: 'Sun Power Core',
      bg: 'bg-gradient-to-br from-amber-400 to-yellow-600 hover:from-amber-300 hover:to-yellow-500',
      border: 'border-yellow-300',
      text: 'text-slate-950',
    },
    {
      id: 'green',
      name: 'KRYPTONITE EMERALD',
      sub: 'Willpower / Energy',
      bg: 'bg-gradient-to-br from-emerald-500 to-green-800 hover:from-emerald-400 hover:to-green-700',
      border: 'border-emerald-400',
      text: 'text-emerald-100',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-comic-pop">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl comic-border-thick border-yellow-400 p-6 shadow-2xl flex flex-col items-center">
        {/* Header with Superman Shield */}
        <div className="flex items-center gap-2 mb-3">
          <SupermanShield className="w-10 h-10" glow />
          <h2 className="font-comic text-2xl md:text-3xl text-yellow-300 comic-title">
            HARNESS SOLAR FREQUENCY
          </h2>
        </div>

        <p className="text-slate-300 text-sm font-heading text-center mb-6">
          Wild power activated! Choose the next battle color:
        </p>

        {/* 2x2 Comic Color Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelectColor(opt.id)}
              className={`
                ${opt.bg} ${opt.text}
                p-4 rounded-2xl comic-border flex flex-col items-center justify-center gap-1
                transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg
              `}
            >
              <span className="font-comic text-lg md:text-xl font-black tracking-wide drop-shadow-[1px_1px_0px_#000]">
                {opt.name}
              </span>
              <span className="text-[11px] font-heading opacity-90">
                {opt.sub}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
