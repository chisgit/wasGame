import { Trophy, Frown } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface GameOverScreenProps {
  winner: 'player' | 'opponent' | null;
  playerScore: number;
  opponentScore: number;
  onRestart: () => void;
  onExit: () => void;
}

export const GameOverScreen = ({
  winner,
  playerScore,
  opponentScore,
  onRestart,
  onExit
}: GameOverScreenProps) => {
  const { playSound } = useSound();
  
  const handleRestart = () => {
    playSound('click');
    onRestart();
  };
  
  const handleExit = () => {
    playSound('click');
    onExit();
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 max-w-[90%]">
        <div className="flex flex-col items-center mb-6">
          {winner === 'player' ? (
            <>
              <Trophy className="text-yellow-500 mb-2" size={48} />
              <h2 className="text-3xl font-bold text-center text-[#4a3f78]">Victory!</h2>
              <p className="text-gray-600 mt-2">You won the match!</p>
            </>
          ) : (
            <>
              <Frown className="text-gray-400 mb-2" size={48} />
              <h2 className="text-3xl font-bold text-center text-[#4a3f78]">Defeat</h2>
              <p className="text-gray-600 mt-2">Better luck next time!</p>
            </>
          )}
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <div className="text-center mb-2 font-semibold text-gray-700">Final Score</div>
          <div className="flex justify-center items-center gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#FFB7C5] text-white font-bold text-2xl mx-auto">
                {playerScore}
              </div>
              <span className="text-sm text-gray-600 mt-1 block">You</span>
            </div>
            
            <div className="text-gray-400 font-bold">-</div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#87CEEB] text-white font-bold text-2xl mx-auto">
                {opponentScore}
              </div>
              <span className="text-sm text-gray-600 mt-1 block">CPU</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleRestart}
            className="w-full py-3 px-6 bg-[#98FB98] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all"
          >
            Play Again
          </button>
          
          <button 
            onClick={handleExit}
            className="w-full py-3 px-6 bg-[#FFB7C5] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all"
          >
            Exit to Menu
          </button>
        </div>
      </div>
    </div>
  );
};