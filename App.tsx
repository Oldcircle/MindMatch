
import React, { useState, useEffect, useCallback } from 'react';
import { GameStatus, CardItem, Theme, Language, GameMode, AIConfig, GameRecords, GameRecord } from './types';
import { DEFAULT_THEMES, DEFAULT_AI_CONFIGS, LEVEL_CONFIGS, CASUAL_DIFFICULTIES } from './constants';
import { generateThemeContent } from './services/aiService';
import { Card } from './components/Card';
import { GameControls } from './components/GameControls';
import { StatsBoard } from './components/StatsBoard';
import { ModelSettings } from './components/ModelSettings';
import { RecordsModal } from './components/RecordsModal';
import { t } from './locales';
import { Trophy, AlertCircle, ArrowRight, BrainCircuit, Frown, Sparkles } from 'lucide-react';

const INITIAL_RECORDS: GameRecords = {
  casual: {},
  level: { maxLevel: 1, highScore: 0, history: [] }
};

export default function App() {
  // --- State: UI & Configs ---
  const [lang, setLang] = useState<Language>('zh');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRecordsOpen, setIsRecordsOpen] = useState(false);
  const [activeConfigId, setActiveConfigId] = useState<string>(() => {
    const saved = localStorage.getItem('mm_active_config_id');
    return saved || DEFAULT_AI_CONFIGS[0].id;
  });

  // --- State: Game Records ---
  const [records, setRecords] = useState<GameRecords>(() => {
    const saved = localStorage.getItem('mm_game_records');
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  });

  // --- State: Game Settings ---
  const [gameMode, setGameMode] = useState<GameMode>('casual');
  const [casualDifficultyId, setCasualDifficultyId] = useState<string>('normal');
  const [level, setLevel] = useState(1);
  const [currentTheme, setCurrentTheme] = useState<Theme>(DEFAULT_THEMES[0]);
  
  // Trigger to force restart when parameters are same
  const [restartTrigger, setRestartTrigger] = useState(0);

  // --- State: Game Play ---
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0); 
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- Helpers ---

  const getActiveConfig = useCallback((): AIConfig => {
    const savedConfigs = localStorage.getItem('mm_ai_configs');
    const configs: AIConfig[] = savedConfigs ? JSON.parse(savedConfigs) : DEFAULT_AI_CONFIGS;
    return configs.find(c => c.id === activeConfigId) || configs[0];
  }, [activeConfigId]);

  const getDifficultyConfig = useCallback(() => {
    if (gameMode === 'casual') {
      return CASUAL_DIFFICULTIES.find(d => d.id === casualDifficultyId) || CASUAL_DIFFICULTIES[1];
    } else {
      return LEVEL_CONFIGS[Math.min(level - 1, LEVEL_CONFIGS.length - 1)];
    }
  }, [gameMode, casualDifficultyId, level]);

  const saveRecord = useCallback((newRecord: Partial<GameRecord>) => {
    setRecords(prevRecords => {
      const updatedRecords = { ...prevRecords };
      
      if (gameMode === 'casual') {
         const existing = updatedRecords.casual[casualDifficultyId];
         // Logic: Prioritize lowest time, then lowest moves.
         const isBetter = !existing || 
            (newRecord.time! < existing.time!) || 
            (newRecord.time === existing.time! && newRecord.moves! < existing.moves!);
  
         if (isBetter) {
           updatedRecords.casual[casualDifficultyId] = {
             date: Date.now(),
             moves: newRecord.moves,
             time: newRecord.time
           };
         }
      } else {
         // Level Mode
         if (level > updatedRecords.level.maxLevel) {
            updatedRecords.level.maxLevel = level;
         }
         if ((newRecord.score || 0) > updatedRecords.level.highScore) {
            updatedRecords.level.highScore = newRecord.score || 0;
         }
         // Add history only if game over or significant milestone
         updatedRecords.level.history.push({
           date: Date.now(),
           score: newRecord.score,
           level: level
         });
         if (updatedRecords.level.history.length > 10) updatedRecords.level.history.shift();
      }
      
      localStorage.setItem('mm_game_records', JSON.stringify(updatedRecords));
      return updatedRecords;
    });
  }, [gameMode, casualDifficultyId, level]);

  // --- Game Initialization & Loop ---

  // Centralized Initialization Effect
  // This ensures that whenever Mode, Difficulty, Level, or Theme changes, the game resets correctly.
  useEffect(() => {
    const initializeGame = async () => {
        setStatus(GameStatus.IDLE);
        setErrorMsg(null);
        setFlippedIds([]);
        setMatchedPairs(0);
        setMoves(0);
        
        const config = getDifficultyConfig();
        const requiredPairs = config.pairs;
        
        // Timer Setup
        if (gameMode === 'level') {
            const lvlConfig = config as any; 
            setTimer(lvlConfig.timeLimit || 60);
        } else {
            setTimer(0);
            setScore(0); // Reset score in casual mode
        }

        // If level 1 in level mode, reset score
        if (gameMode === 'level' && level === 1) {
             setScore(0);
        }

        // Prepare Cards
        let items = [...currentTheme.items];
        
        // Loop items if we need more pairs than available in the theme
        if (items.length < requiredPairs) {
            const originalLength = items.length;
            const needed = requiredPairs - originalLength;
            for(let i=0; i<needed; i++) {
                items.push(items[i % originalLength]);
            }
        }
        
        const levelItems = items.slice(0, requiredPairs);
        const pairs = [...levelItems, ...levelItems];
        
        const shuffled = pairs
            .sort(() => Math.random() - 0.5)
            .map((content, index) => ({
            id: `card-${index}-${Date.now()}`, // Unique ID every init
            content,
            isFlipped: false,
            isMatched: false,
            }));

        setCards(shuffled);
        
        // Small delay to allow UI to settle before allowing interaction
        setTimeout(() => setStatus(GameStatus.PLAYING), 100);
    };

    initializeGame();
    
    // Explicit dependencies ensure no stale closures
  }, [gameMode, casualDifficultyId, level, currentTheme, getDifficultyConfig, restartTrigger]);


  // Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (status === GameStatus.PLAYING) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (gameMode === 'level') {
             // Countdown Logic
            if (prev <= 1) {
              clearInterval(interval);
              setStatus(GameStatus.GAME_OVER);
              saveRecord({ score, level });
              return 0;
            }
            return prev - 1;
          } else {
            // Elapsed Time Logic
            return prev + 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, gameMode, saveRecord, score, level]);


  // Win Condition Check
  useEffect(() => {
    const config = getDifficultyConfig();
    // Check if matchedPairs equals required pairs. 
    // Must be strictly matched and game is playing.
    if (matchedPairs > 0 && matchedPairs === config.pairs && status === GameStatus.PLAYING) {
      setStatus(GameStatus.WON);
      
      // Calculate Score
      const baseScore = 1000;
      let roundScore = 0;
      
      if (gameMode === 'casual') {
          roundScore = Math.max(100, baseScore - (timer * 2) - (moves * 5));
          saveRecord({ moves, time: timer });
      } else {
          // Level Mode: Time remaining is bonus
          const timeBonus = timer * 10;
          roundScore = baseScore + timeBonus + (level * 200);
          // Auto-save progress
          saveRecord({ score: score + roundScore, level });
      }
      
      setScore(prev => prev + roundScore);
    }
  }, [matchedPairs, status, getDifficultyConfig, timer, moves, gameMode, level, score, saveRecord]);


  // --- Interactions ---

  const handleCardClick = (id: string) => {
    if (status !== GameStatus.PLAYING) return;
    if (flippedIds.length >= 2) return;
    if (flippedIds.includes(id)) return;

    // Flip the card
    const newFlippedIds = [...flippedIds, id];
    setFlippedIds(newFlippedIds);

    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ));

    // Check match if 2 cards flipped
    if (newFlippedIds.length === 2) {
      setMoves(prev => prev + 1);
      checkForMatch(newFlippedIds);
    }
  };

  const checkForMatch = (ids: string[]) => {
    const [firstId, secondId] = ids;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    if (firstCard && secondCard && firstCard.content === secondCard.content) {
      // Match Found
      setMatchedPairs(prev => prev + 1);
      setCards(prev => prev.map(card => 
        ids.includes(card.id) ? { ...card, isMatched: true, isFlipped: true } : card
      ));
      setFlippedIds([]);
    } else {
      // No Match
      setTimeout(() => {
        setCards(prev => prev.map(card => 
          ids.includes(card.id) ? { ...card, isFlipped: false } : card
        ));
        setFlippedIds([]);
      }, 1000);
    }
  };


  // --- User Actions ---

  const handleGenerateTheme = async (prompt: string) => {
    setStatus(GameStatus.LOADING);
    setErrorMsg(null);
    try {
      const config = getActiveConfig();
      // Always request max items needed for Master difficulty (18 pairs) to ensure this theme works across all difficulties
      const maxNeeded = 18; 

      const items = await generateThemeContent(prompt, maxNeeded, config);
      
      const newTheme: Theme = {
        name: prompt,
        items: items,
        colorFrom: "from-violet-500",
        colorTo: "to-fuchsia-500"
      };
      
      setCurrentTheme(newTheme);
      // Changing currentTheme triggers useEffect -> initGame

    } catch (err: any) {
      console.error(err);
      setErrorMsg(t(lang, 'error_ai') + " " + (err.message || ''));
      setStatus(GameStatus.IDLE); // Reset to IDLE so user can try again
    }
  };

  const handleRestart = () => {
    if (gameMode === 'level') setLevel(1);
    setRestartTrigger(p => p + 1);
  };

  const handleNextLevel = () => {
    setLevel(prev => prev + 1);
    // Effect will handle init
  };

  const toggleMode = () => {
    const newMode = gameMode === 'casual' ? 'level' : 'casual';
    setGameMode(newMode);
    setLevel(1); 
    // Effect will handle init
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 transition-colors duration-500 selection:bg-primary/30">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
            <div className="text-center md:text-left">
                <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight mb-2">
                    {t(lang, 'app_title')}
                </h1>
                <p className="text-slate-500 text-sm sm:text-base flex items-center justify-center md:justify-start gap-2 flex-wrap">
                   <span className="flex items-center gap-1.5 px-3 py-1 bg-white/60 backdrop-blur rounded-full border border-slate-200 shadow-sm">
                        <Sparkles size={14} className="text-purple-500" />
                        <span className="font-semibold text-slate-700">{currentTheme.name}</span>
                   </span>
                </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-2xl shadow-sm border border-white/50 flex flex-col items-center min-w-[120px]">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{t(lang, 'score')}</span>
                <span className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">
                    {score.toLocaleString()}
                </span>
            </div>
        </div>

        {/* Controls */}
        <GameControls 
          status={status} 
          gameMode={gameMode}
          lang={lang}
          onRestart={handleRestart} 
          onGenerateTheme={handleGenerateTheme} 
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenRecords={() => setIsRecordsOpen(true)}
          onToggleLang={() => setLang(l => l === 'en' ? 'zh' : 'en')}
          onToggleMode={toggleMode}
          casualDifficulty={casualDifficultyId}
          onSetCasualDifficulty={setCasualDifficultyId}
        />

        {/* Stats */}
        <StatsBoard 
          moves={moves} 
          timer={timer} 
          matchedPairs={matchedPairs} 
          totalPairs={getDifficultyConfig().pairs} 
          gameMode={gameMode}
          level={level}
        />

        {/* Settings Modal */}
        <ModelSettings 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            activeConfigId={activeConfigId}
            onConfigChange={(id) => {
                setActiveConfigId(id);
                localStorage.setItem('mm_active_config_id', id);
            }}
            lang={lang}
        />
        
        {/* Records Modal */}
        <RecordsModal 
            isOpen={isRecordsOpen}
            onClose={() => setIsRecordsOpen(false)}
            records={records}
            lang={lang}
        />

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 animate-fade-in shadow-sm">
            <AlertCircle size={20} className="shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Game Grid Area */}
        <div className="relative min-h-[400px] bg-white/40 backdrop-blur-sm rounded-[2rem] p-4 sm:p-8 shadow-inner border border-white/20">
          
          {/* Loading Overlay */}
          {status === GameStatus.LOADING && (
            <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-md rounded-[2rem] flex flex-col items-center justify-center animate-fade-in">
              <div className="relative mb-4">
                <div className="w-20 h-20 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={32} />
              </div>
              <p className="text-slate-600 font-bold text-lg animate-pulse">{t(lang, 'loading_ai')}</p>
            </div>
          )}

          {/* Win / Game Over Overlay */}
          {(status === GameStatus.WON || status === GameStatus.GAME_OVER) && (
            <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-lg rounded-[2rem] flex flex-col items-center justify-center text-center p-6 animate-fade-in z-30">
              
              {status === GameStatus.WON ? (
                  <div className="bg-gradient-to-br from-yellow-300 to-orange-400 p-6 rounded-full mb-6 shadow-lg shadow-orange-200 animate-bounce-short">
                    <Trophy size={64} className="text-white drop-shadow-md" />
                  </div>
              ) : (
                  <div className="bg-slate-200 p-6 rounded-full mb-6 shadow-inner">
                    <Frown size={64} className="text-slate-500" />
                  </div>
              )}

              <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">
                {status === GameStatus.WON ? t(lang, 'win_title') : t(lang, 'game_over')}
              </h2>
              
              <p className="text-slate-600 mb-10 max-w-md text-lg font-medium leading-relaxed">
                {status === GameStatus.WON ? (
                    gameMode === 'casual' 
                        ? t(lang, 'win_msg_casual', { theme: currentTheme.name, moves }) 
                        : t(lang, 'win_msg_level', { level })
                ) : (
                    t(lang, 'game_over_timeout', { level })
                )}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button 
                    onClick={handleRestart}
                    className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all active:scale-95"
                  >
                    {t(lang, 'try_again')}
                  </button>
                  
                  {status === GameStatus.WON && gameMode === 'level' && (
                    <button 
                        onClick={handleNextLevel}
                        className="px-8 py-3.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        {t(lang, 'next_level')} <ArrowRight size={20} />
                    </button>
                  )}
              </div>
            </div>
          )}

          {/* Grid Layout - Adaptive */}
          <div 
             className="grid gap-3 sm:gap-4 mx-auto transition-all duration-500 justify-center w-full"
             style={{
                gridTemplateColumns: `repeat(${
                    gameMode === 'casual' 
                    ? (CASUAL_DIFFICULTIES.find(d => d.id === casualDifficultyId)?.cols || 4)
                    : (getDifficultyConfig().pairs >= 18 ? 6 : getDifficultyConfig().pairs >= 10 ? 5 : 4)
                }, minmax(0, 1fr))`,
                maxWidth: getDifficultyConfig().pairs > 12 ? '56rem' : '40rem'
             }}
          >
            {cards.map((card) => (
              <Card 
                key={card.id} 
                card={card} 
                onClick={handleCardClick} 
                gradientFrom={currentTheme.colorFrom}
                gradientTo={currentTheme.colorTo}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-slate-400 text-xs font-medium">
           MindMatch AI • Powering imagination with {activeConfigId === 'default-gemini' ? 'Gemini Flash 2.5' : 'Custom LLM'}
        </div>

      </div>
    </div>
  );
}
