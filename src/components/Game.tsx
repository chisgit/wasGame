import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { GameEngine } from '../game/GameEngine';
import { useSound } from '../hooks/useSound';
import { GameHUD } from './GameHUD';
import { GameOverScreen } from './GameOverScreen';

interface GameProps {
  characterIndex: number;
  onExit: () => void;
}

export const Game = ({ characterIndex, onExit }: GameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);
  const [activePowerup, setActivePowerup] = useState<string | null>(null);
  const { playSound } = useSound();

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize game engine
    const canvas = canvasRef.current;
    const engine = new GameEngine(canvas, characterIndex);
    gameEngineRef.current = engine;

    // Start the game loop
    engine.start();
    
    // Play game music
    playSound('gameMusic', { loop: true });
    
    // Subscribe to score updates
    const scoreSubscription = engine.onScoreUpdate((player, opponent) => {
      setPlayerScore(player);
      setOpponentScore(opponent);
      
      // Check for game over
      if (player >= 21) {
        setGameOver(true);
        setWinner('player');
        playSound('victory');
      } else if (opponent >= 21) {
        setGameOver(true);
        setWinner('opponent');
        playSound('defeat');
      }
    });
    
    // Subscribe to powerup updates
    const powerupSubscription = engine.onPowerupChange((powerup) => {
      setActivePowerup(powerup);
      if (powerup) {
        playSound('powerup');
      }
    });
    
    // Clean up
    return () => {
      engine.stop();
      playSound('gameMusic', { stop: true });
      scoreSubscription();
      powerupSubscription();
    };
  }, [characterIndex, playSound]);
  
  // Handle pause/resume
  useEffect(() => {
    if (!gameEngineRef.current) return;
    
    if (isPaused) {
      gameEngineRef.current.pause();
    } else {
      gameEngineRef.current.resume();
    }
  }, [isPaused]);

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    playSound('click');
  };

  const handleExitClick = () => {
    if (gameOver) {
      playSound('click');
      onExit();
    } else {
      playSound('click');
      setIsPaused(true);
      setShowExitConfirm(true);
    }
  };

  const handleExitConfirm = () => {
    playSound('click');
    setShowExitConfirm(false);
    onExit();
  };

  const handleExitCancel = () => {
    playSound('click');
    setShowExitConfirm(false);
    setIsPaused(false);
  };
  
  const handleRestart = () => {
    if (!gameEngineRef.current) return;
    
    playSound('select');
    setPlayerScore(0);
    setOpponentScore(0);
    setGameOver(false);
    setWinner(null);
    gameEngineRef.current.restart();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      {/* Game Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full max-w-[1920px] max-h-[1080px] object-contain"
      />
      
      {/* HUD */}
      <GameHUD
        playerScore={playerScore}
        opponentScore={opponentScore}
        isPaused={isPaused}
        activePowerup={activePowerup}
        onPauseToggle={handlePauseToggle}
        onExit={handleExitClick}
      />
      
      {/* Pause Menu */}
      {isPaused && !showExitConfirm && !gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-80">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#4a3f78]">Game Paused</h2>
            
            <div className="space-y-4">
              <button 
                onClick={handlePauseToggle}
                className="w-full py-3 px-6 bg-[#87CEEB] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all"
              >
                Resume
              </button>
              
              <button 
                onClick={handleExitClick}
                className="w-full py-3 px-6 bg-[#FFB7C5] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all"
              >
                Exit to Menu
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Exit Confirmation */}
      {showExitConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-80">
            <h2 className="text-xl font-bold mb-4 text-center text-[#4a3f78]">Exit Game?</h2>
            <p className="text-gray-600 mb-6 text-center">Your current game progress will be lost.</p>
            
            <div className="flex gap-4">
              <button 
                onClick={handleExitCancel}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              
              <button 
                onClick={handleExitConfirm}
                className="flex-1 py-2 px-4 bg-[#FFB7C5] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Game Over Screen */}
      {gameOver && (
        <GameOverScreen 
          winner={winner} 
          playerScore={playerScore}
          opponentScore={opponentScore}
          onRestart={handleRestart}
          onExit={handleExitClick}
        />
      )}
      
      {/* Close button */}
      <button 
        onClick={handleExitClick}
        className="absolute top-4 right-4 p-2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full z-10 transition-all"
      >
        <X className="text-white" />
      </button>
    </div>
  );
};