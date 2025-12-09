
import React from 'react';
import { Clock, Hash, CheckCircle2, Flame } from 'lucide-react';
import { GameMode } from '../types';

interface StatsBoardProps {
  moves: number;
  timer: number;
  matchedPairs: number;
  totalPairs: number;
  gameMode: GameMode;
  level: number;
}

export const StatsBoard: React.FC<StatsBoardProps> = ({ moves, timer, matchedPairs, totalPairs, gameMode, level }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Warning state for countdown in level mode (less than 10 seconds)
  const isLowTime = gameMode === 'level' && timer <= 10;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      
      {gameMode === 'level' && (
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-purple-200 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame size={48} />
            </div>
            <div className="flex items-center gap-1 mb-1 opacity-90">
                <span className="text-xs font-bold uppercase tracking-wider">Level</span>
            </div>
            <span className="text-3xl font-black">{level}</span>
        </div>
      )}

      <div className={`p-4 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300 shadow-sm ${
          isLowTime 
            ? 'bg-red-50 border-red-200 shadow-red-100 scale-105 animate-pulse' 
            : 'bg-white border-slate-100'
      }`}>
        <div className={`flex items-center gap-2 mb-1 ${isLowTime ? 'text-red-600' : 'text-blue-500'}`}>
          <Clock size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">
             {gameMode === 'level' ? 'Time Left' : 'Time'}
          </span>
        </div>
        <span className={`text-2xl font-mono font-black ${isLowTime ? 'text-red-600' : 'text-slate-700'}`}>
            {formatTime(timer)}
        </span>
      </div>

      <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center border-2 border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 text-orange-500 mb-1">
          <Hash size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Moves</span>
        </div>
        <span className="text-2xl font-mono font-black text-slate-700">{moves}</span>
      </div>

      <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center border-2 border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-500 mb-1">
          <CheckCircle2 size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Matches</span>
        </div>
        <span className="text-2xl font-mono font-black text-slate-700">{matchedPairs} <span className="text-slate-300 text-lg">/</span> {totalPairs}</span>
      </div>
    </div>
  );
};
