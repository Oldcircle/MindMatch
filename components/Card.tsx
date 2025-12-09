import React from 'react';
import { CardItem } from '../types';

interface CardProps {
  card: CardItem;
  onClick: (id: string) => void;
  gradientFrom: string;
  gradientTo: string;
}

export const Card: React.FC<CardProps> = ({ card, onClick, gradientFrom, gradientTo }) => {
  const handleClick = () => {
    if (!card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  return (
    <div 
      className="relative w-full aspect-square cursor-pointer group perspective-1000"
      onClick={handleClick}
    >
      <div 
        className={`w-full h-full duration-500 preserve-3d transition-transform shadow-lg rounded-xl ${
          card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
        }`}
      >
        {/* Back of Card (Face Down) */}
        <div 
          className={`absolute w-full h-full backface-hidden rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} border-2 border-white/20 flex items-center justify-center`}
        >
          <span className="text-white text-3xl opacity-50 font-bold">?</span>
        </div>

        {/* Front of Card (Face Up) */}
        <div 
          className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center"
        >
          <span className="text-4xl md:text-5xl select-none animate-bounce-short">
            {card.content}
          </span>
          {card.isMatched && (
            <div className="absolute inset-0 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg bg-white/80 px-2 py-1 rounded-full shadow-sm">
                ✓
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};