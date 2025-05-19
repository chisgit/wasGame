import { Pause, Volume2, Crown } from 'lucide-react';

interface GameHUDProps {
  playerScore: number;
  opponentScore: number;
  isPaused: boolean;
  activePowerup: string | null;
  onPauseToggle: () => void;
  onExit: () => void;
}

export const GameHUD = ({
  playerScore,
  opponentScore,
  isPaused,
  activePowerup,
  onPauseToggle,
  onExit
}: GameHUDProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD - Scores */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black bg-opacity-30 px-6 py-2 rounded-full backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <span className="text-[#FFB7C5] font-bold">YOU</span>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFB7C5] text-white font-bold text-xl">
            {playerScore}
          </div>
        </div>
        
        <div className="text-white text-opacity-70 font-bold">VS</div>
        
        <div className="flex items-center gap-1">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#87CEEB] text-white font-bold text-xl">
            {opponentScore}
          </div>
          <span className="text-[#87CEEB] font-bold">CPU</span>
        </div>
      </div>
      
      {/* First to 21 indicator */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black bg-opacity-30 px-4 py-1 rounded-full backdrop-blur-sm text-white text-sm">
        <Crown size={16} className="text-yellow-400" />
        <span>First to 21 wins</span>
      </div>
      
      {/* Active Powerup Indicator */}
      {activePowerup && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 p-3 rounded-lg backdrop-blur-sm text-white animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-[#98FB98] font-bold">ACTIVE POWERUP:</span>
            <span>{activePowerup}</span>
          </div>
        </div>
      )}
      
      {/* Controls Reminder */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-30 px-6 py-2 rounded-lg backdrop-blur-sm text-white text-opacity-70 text-sm">
        <span>Move: Arrow Keys | Hit: Spacebar | Power Shot: Shift + Spacebar</span>
      </div>
      
      {/* Pause Button */}
      <div className="absolute top-4 right-16 pointer-events-auto">
        <button 
          onClick={onPauseToggle}
          className="p-2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full transition-all"
        >
          <Pause className="text-white" />
        </button>
      </div>
    </div>
  );
};