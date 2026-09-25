import React, { useRef, useEffect } from 'react';
import { Newspaper, ChevronDown, ChevronUp } from 'lucide-react';

export default function ComicLog({ logs, isOpen, onToggle }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={`fixed bottom-3 right-3 z-30 select-none transition-all ${isOpen ? 'max-w-sm w-full' : 'w-auto'}`}>
      {/* Header / Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between gap-3 px-3.5 py-1.5 bg-slate-900/95 hover:bg-slate-800 text-yellow-300 rounded-xl comic-border border-yellow-500/60 cursor-pointer shadow-xl transition-all"
      >
        <div className="flex items-center gap-1.5 font-comic text-xs md:text-sm">
          <Newspaper className="w-4 h-4 text-yellow-400" />
          <span>DAILY PLANET NEWS WIRE</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {/* Collapsible Log Stream */}
      {isOpen && (
        <div
          ref={scrollRef}
          className="h-44 bg-slate-950/95 p-2.5 comic-border border-t-0 rounded-b-xl overflow-y-auto space-y-1.5 scrollbar-thin text-xs shadow-2xl"
        >
          {logs.map((log) => {
            const isHero = log.text.includes('Superman') || log.type === 'hero';
            const isVillain = log.text.includes('Luthor') || log.text.includes('Kryptonite');
            const isSystem = log.type === 'system';

            return (
              <div
                key={log.id}
                className={`
                  p-1.5 rounded-lg border text-[11px] leading-tight
                  ${isHero ? 'bg-blue-950/50 border-blue-800/60 text-sky-200' : ''}
                  ${isVillain ? 'bg-red-950/50 border-red-800/60 text-rose-200' : ''}
                  ${isSystem ? 'bg-slate-900/50 border-slate-700/60 text-yellow-200' : ''}
                  ${!isHero && !isVillain && !isSystem ? 'bg-slate-900/40 border-slate-800 text-slate-300' : ''}
                `}
              >
                <div className="flex items-center justify-between opacity-60 text-[9px] mb-0.5 font-mono">
                  <span>{log.timestamp}</span>
                </div>
                <p className="font-heading tracking-wide">
                  {log.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
