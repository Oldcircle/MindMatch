
import React from 'react';
import { X, Trophy, Clock, Hash, Medal } from 'lucide-react';
import { GameRecords, Language } from '../types';
import { CASUAL_DIFFICULTIES } from '../constants';
import { t } from '../locales';

interface RecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: GameRecords;
  lang: Language;
}

export const RecordsModal: React.FC<RecordsModalProps> = ({ isOpen, onClose, records, lang }) => {
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="flex items-center gap-2 text-yellow-700">
            <Trophy size={24} className="text-yellow-500" />
            <h2 className="text-xl font-bold">{t(lang, 'records_title')}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-white/50 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8">
            
            {/* Level Mode Records */}
            <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Medal size={16} />
                    {t(lang, 'level_records')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex flex-col items-center">
                        <span className="text-xs text-purple-600 font-bold mb-1">{t(lang, 'max_level')}</span>
                        <span className="text-3xl font-black text-slate-700">{records.level.maxLevel}</span>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col items-center">
                        <span className="text-xs text-indigo-600 font-bold mb-1">{t(lang, 'high_score')}</span>
                        <span className="text-3xl font-black text-slate-700">{records.level.highScore}</span>
                    </div>
                </div>
            </section>

            {/* Casual Mode Records */}
            <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Medal size={16} />
                    {t(lang, 'casual_records')}
                </h3>
                
                <div className="space-y-3">
                    {CASUAL_DIFFICULTIES.map(diff => {
                        const rec = records.casual[diff.id];
                        return (
                            <div key={diff.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-slate-700">{t(lang, diff.nameKey as any)}</span>
                                    {!rec && <span className="text-xs text-slate-400 italic">{t(lang, 'no_records')}</span>}
                                </div>
                                {rec && (
                                    <div className="flex gap-4 text-sm">
                                        <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            <Clock size={14} />
                                            <span className="font-mono font-bold">{formatTime(rec.time || 0)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                            <Hash size={14} />
                                            <span className="font-mono font-bold">{rec.moves}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

        </div>
      </div>
    </div>
  );
};
