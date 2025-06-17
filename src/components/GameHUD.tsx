import { Pause, Volume2, Crown, Smartphone } from 'lucide-react';

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
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD - Scores */}
      <div className="absolute top-2 md:top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 md:gap-4 bg-black bg-opacity-30 px-3 md:px-6 py-1 md:py-2 rounded-full backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <span className="text-[#FFB7C5] font-bold text-sm md:text-base">YOU</span>
          <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFB7C5] text-white font-bold text-lg md:text-xl">
            {playerScore}
          </div>
        </div>
        
        <div className="text-white text-opacity-70 font-bold text-sm md:text-base">VS</div>
        
        <div className="flex items-center gap-1">
          <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#87CEEB] text-white font-bold text-lg md:text-xl">
            {opponentScore}
          </div>
          <span className="text-[#87CEEB] font-bold text-sm md:text-base">CPU</span>
        </div>
      </div>
      
      {/* First to 21 indicator */}
      <div className="absolute top-12 md:top-16 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black bg-opacity-30 px-3 md:px-4 py-1 rounded-full backdrop-blur-sm text-white text-xs md:text-sm">
        <Crown size={12} className="text-yellow-400 md:w-4 md:h-4" />
        <span>First to 21 wins</span>
      </div>
      
      {/* Active Powerup Indicator */}
      {activePowerup && (
        <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-black bg-opacity-50 p-2 md:p-3 rounded-lg backdrop-blur-sm text-white animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-[#98FB98] font-bold text-xs md:text-sm">ACTIVE:</span>
            <span className="text-xs md:text-sm">{activePowerup}</span>
          </div>
        </div>
      )}
      
      {/* Controls Reminder - Different for mobile */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-30 px-3 md:px-6 py-1 md:py-2 rounded-lg backdrop-blur-sm text-white text-opacity-70 text-xs md:text-sm text-center">
        {isMobile ? (
          <span>Drag to move | Tap to hit | Double-tap for power shot</span>
        ) : (
          <span>Move: Arrow Keys | Hit: Spacebar | Power Shot: Shift + Spacebar</span>
        )}
      </div>
      
      {/* Mobile touch indicator */}
      {isMobile && (
        <div className="absolute top-2 right-12 md:right-16">
          <Smartphone className="text-white text-opacity-50" size={16} />
        </div>
      )}
      
      {/* Pause Button */}
      <div className="absolute top-2 md:top-4 right-12 md:right-16 pointer-events-auto">
        <button 
          onClick={onPauseToggle}
          className="p-2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full transition-all touch-manipulation"
          style={{ minWidth: '44px', minHeight: '44px' }} // Ensure minimum touch target size
        >
          <Pause className="text-white" size={isMobile ? 20 : 24} />
        </button>
      </div>
    </div>
  );
};