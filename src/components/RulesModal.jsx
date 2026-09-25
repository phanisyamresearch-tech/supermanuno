import React from 'react';
import { SupermanShield, HeatVisionIcon, VortexIcon, SuperPunchIcon, FortressCrystalIcon, KryptoniteClusterIcon, SolarBurstIcon } from './ComicIcons';
import { X, BookOpen, ShieldCheck } from 'lucide-react';

export default function RulesModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-comic-pop">
      <div className="w-full max-w-2xl bg-slate-900 rounded-3xl comic-border-thick border-yellow-400 p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <SupermanShield className="w-8 h-8" glow />
            <h2 className="font-comic text-2xl md:text-3xl text-yellow-300 comic-title">
              HERO'S FIELD MANUAL: UNO RULES
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 comic-border cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-4 pr-2 scrollbar-thin text-slate-200 text-sm">
          {/* Mission Objective */}
          <div className="bg-slate-950 p-4 rounded-2xl comic-border border-slate-800">
            <h3 className="font-comic text-lg text-yellow-400 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-yellow-400" />
              MISSION OBJECTIVE
            </h3>
            <p className="font-body text-slate-300">
              Be the first hero to play all the cards from your hand. Match cards by <strong>Color</strong>, <strong>Number</strong>, or <strong>Action Symbol</strong>. Don't forget to shout <strong>"CALL UNO!"</strong> when you have only 1 card remaining!
            </p>
          </div>

          {/* Special Action Cards */}
          <div className="bg-slate-950 p-4 rounded-2xl comic-border border-slate-800">
            <h3 className="font-comic text-lg text-yellow-400 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-5 h-5 text-yellow-400" />
              SUPERHERO ACTION CARDS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Skip */}
              <div className="flex items-start gap-3 bg-slate-900/90 p-2.5 rounded-xl border border-slate-700">
                <HeatVisionIcon className="w-10 h-10 shrink-0" />
                <div>
                  <h4 className="font-comic text-rose-400 text-base">HEAT VISION (SKIP)</h4>
                  <p className="text-xs text-slate-300">Freezes the next player with laser focus, forcing them to miss their turn.</p>
                </div>
              </div>

              {/* Reverse */}
              <div className="flex items-start gap-3 bg-slate-900/90 p-2.5 rounded-xl border border-slate-700">
                <VortexIcon className="w-10 h-10 shrink-0" />
                <div>
                  <h4 className="font-comic text-sky-400 text-base">VORTEX REWIND (REVERSE)</h4>
                  <p className="text-xs text-slate-300">Superman circles the globe, instantly reversing turn order.</p>
                </div>
              </div>

              {/* Draw 2 */}
              <div className="flex items-start gap-3 bg-slate-900/90 p-2.5 rounded-xl border border-slate-700">
                <SuperPunchIcon className="w-10 h-10 shrink-0" />
                <div>
                  <h4 className="font-comic text-yellow-400 text-base">SUPER PUNCH (+2)</h4>
                  <p className="text-xs text-slate-300">Comic BAM! Forces next player to draw 2 cards and lose their turn.</p>
                </div>
              </div>

              {/* Wild */}
              <div className="flex items-start gap-3 bg-slate-900/90 p-2.5 rounded-xl border border-slate-700">
                <FortressCrystalIcon className="w-10 h-10 shrink-0" />
                <div>
                  <h4 className="font-comic text-purple-400 text-base">FORTRESS SPECTRUM (WILD)</h4>
                  <p className="text-xs text-slate-300">Play anytime! Shifts the game to any solar color you choose.</p>
                </div>
              </div>

              {/* Wild Draw 4 */}
              <div className="flex items-start gap-3 bg-slate-900/90 p-2.5 rounded-xl border border-slate-700">
                <KryptoniteClusterIcon className="w-10 h-10 shrink-0" />
                <div>
                  <h4 className="font-comic text-emerald-400 text-base">KRYPTONITE AMBUSH (+4)</h4>
                  <p className="text-xs text-slate-300">Radioactive strike! Next opponent draws 4 cards and loses their turn. You pick the color.</p>
                </div>
              </div>

              {/* Solar Burst */}
              <div className="flex items-start gap-3 bg-slate-900/90 p-2.5 rounded-xl border border-yellow-500/50">
                <SolarBurstIcon className="w-10 h-10 shrink-0" />
                <div>
                  <h4 className="font-comic text-yellow-300 text-base">SOLAR BURST (LEGENDARY)</h4>
                  <p className="text-xs text-slate-300">Exclusive Superman power: changes the color AND forces all opponents to draw 1 card!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Calling UNO */}
          <div className="bg-slate-950 p-4 rounded-2xl comic-border border-slate-800">
            <h3 className="font-comic text-lg text-yellow-400 mb-1">CALLING UNO!</h3>
            <p className="font-body text-slate-300">
              When playing your second-to-last card, make sure to click the glowing <strong>"CALL UNO!"</strong> button. If an opponent catches you before you call it, you must draw 2 penalty cards.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t-2 border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-comic text-lg rounded-xl comic-border cursor-pointer shadow-md"
          >
            GOT IT, LET'S PLAY!
          </button>
        </div>
      </div>
    </div>
  );
}
