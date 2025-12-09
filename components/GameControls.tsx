
import React, { useState } from 'react';
import { GameStatus, GameMode, Language } from '../types';
import { Wand2, RefreshCw, Play, Settings, Languages, Gamepad2, Layers, Trophy, Sparkles } from 'lucide-react';
import { t } from '../locales';
import { CASUAL_DIFFICULTIES } from '../constants';

interface GameControlsProps {
  status: GameStatus;
  gameMode: GameMode;
  lang: Language;
  onRestart: () => void;
  onGenerateTheme: (prompt: string) => void;
  onOpenSettings: () => void;
  onOpenRecords: () => void;
  onToggleLang: () => void;
  onToggleMode: () => void;
  casualDifficulty: string;
  onSetCasualDifficulty: (id: string) => void;
}

export const GameControls: React.FC<GameControlsProps> = ({ 
  status, gameMode, lang, onRestart, onGenerateTheme, onOpenSettings, onOpenRecords, onToggleLang, onToggleMode,
  casualDifficulty, onSetCasualDifficulty
}) => {
  const [prompt, setPrompt] = useState('');

  const handleGenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerateTheme(prompt);
      setPrompt('');
    }
  };

  const isPlaying = status === GameStatus.PLAYING;
  const isLoading = status === GameStatus.LOADING;

  return (
    <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-lg border border-white/50 mb-8 space-y-6">
      
      {/* Top Row: Meta Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-xl">
            <button
                onClick={onToggleMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                    gameMode === 'casual' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <Gamepad2 size={18} />
                {t(lang, 'mode_casual')}
            </button>
            <button
                onClick={onToggleMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                    gameMode === 'level' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <Layers size={18} />
                {t(lang, 'mode_level')}
            </button>
        </div>

        <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button 
                onClick={onOpenRecords}
                className="flex items-center gap-2 px-3 py-2 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-xl text-sm font-bold transition-colors"
                title={t(lang, 'records_btn')}
            >
                <Trophy size={18} />
                <span className="hidden sm:inline">{t(lang, 'records_btn')}</span>
            </button>
            <button 
                onClick={onOpenSettings}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold transition-colors"
                title={t(lang, 'settings_title')}
            >
                <Settings size={18} />
            </button>
            <button 
                onClick={onToggleLang} 
                className="flex items-center gap-2 px-3 py-2 text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold transition-colors"
                title="Switch Language"
            >
                <Languages size={18} />
                <span className="text-xs uppercase">{lang}</span>
            </button>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full" />

      {/* Action Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* Left: Game Actions */}
        <div className="flex gap-3">
            <button
            onClick={onRestart}
            disabled={isLoading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:transform-none font-bold shadow-md shadow-slate-200"
            >
            {isPlaying ? <RefreshCw size={20} /> : <Play size={20} />}
            {isPlaying ? t(lang, 'restart_game') : t(lang, 'start_game')}
            </button>
            
            {/* Difficulty Selector (Casual Mode Only) */}
            {gameMode === 'casual' && (
                <div className="relative min-w-[160px] flex-1 sm:flex-none">
                    <select 
                        value={casualDifficulty}
                        onChange={(e) => onSetCasualDifficulty(e.target.value)}
                        disabled={isLoading}
                        className="w-full h-full appearance-none pl-4 pr-10 py-3 bg-white border-2 border-slate-100 hover:border-blue-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-sm font-bold text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 transition-all cursor-pointer"
                    >
                        {CASUAL_DIFFICULTIES.map(d => (
                            <option key={d.id} value={d.id}>
                                {t(lang, d.nameKey as any)}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 bg-white pl-1">
                        <Settings size={16} />
                    </div>
                </div>
            )}
        </div>

        {/* Right: AI Generator */}
        <form onSubmit={handleGenSubmit} className="flex-1 flex gap-2 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-1.5 rounded-xl border border-purple-100/50">
            <div className="relative flex-1">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t(lang, 'theme_placeholder')}
                    className="w-full h-full px-4 py-2 bg-white rounded-lg border-0 focus:ring-2 focus:ring-purple-200 text-sm font-medium placeholder:text-slate-400"
                    disabled={isLoading}
                />
            </div>
            <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white rounded-lg hover:opacity-90 hover:shadow-lg transition-all disabled:opacity-50 disabled:shadow-none font-bold whitespace-nowrap"
            >
            {isLoading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
            ) : (
                <Sparkles size={18} />
            )}
            <span className="hidden sm:inline">{t(lang, 'generate_btn')}</span>
            </button>
        </form>
      </div>
    </div>
  );
};
