import { useState, useEffect } from 'react';
import { Settings, Volume2, VolumeX, Info, Smartphone } from 'lucide-react';
import { useSound } from '../hooks/useSound';
import { TouchInstructions } from './TouchInstructions';

interface MenuProps {
  onPlay: () => void;
}

export const Menu = ({ onPlay }: MenuProps) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showTouchInstructions, setShowTouchInstructions] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { playSound, toggleMute } = useSound();

  useEffect(() => {
    // Detect if user is on mobile
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0);
      setIsMobile(isMobileDevice);
      
      // Show touch instructions automatically on first mobile visit
      if (isMobileDevice && !localStorage.getItem('touchInstructionsShown')) {
        setTimeout(() => {
          setShowTouchInstructions(true);
          localStorage.setItem('touchInstructionsShown', 'true');
        }, 1000);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePlay = () => {
    playSound('click');
    onPlay();
  };

  const handleToggleSettings = () => {
    playSound('click');
    setShowSettings(!showSettings);
    setShowInfo(false);
    setShowTouchInstructions(false);
  };

  const handleToggleInfo = () => {
    playSound('click');
    setShowInfo(!showInfo);
    setShowSettings(false);
    setShowTouchInstructions(false);
  };

  const handleShowTouchInstructions = () => {
    playSound('click');
    setShowTouchInstructions(true);
    setShowSettings(false);
    setShowInfo(false);
  };

  const handleToggleMute = () => {
    playSound('click');
    setIsMuted(!isMuted);
    toggleMute();
  };

  useEffect(() => {
    // Play background music when component mounts
    playSound('menuMusic', { loop: true });
    
    return () => {
      // Stop menu music when component unmounts
      playSound('menuMusic', { stop: true });
    };
  }, [playSound]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background with animated cherry blossoms */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] to-[#6a92f0] overflow-hidden">
        <div className="cherry-blossoms"></div>
      </div>
      
      {/* Torii gate silhouette */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <div className="w-[80%] h-[40vh] bg-[#e94e50] opacity-80 bg-[url('https://images.pexels.com/photos/4467879/pexels-photo-4467879.jpeg')] bg-cover bg-center"></div>
      </div>
      
      {/* Title and menu */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 md:mb-12 text-white drop-shadow-lg text-center">
          <span className="text-[#FFB7C5]">Anime</span> Badminton
        </h1>
        
        <div className="bg-white bg-opacity-80 p-6 md:p-8 rounded-xl shadow-2xl backdrop-blur-sm flex flex-col items-center space-y-4 w-72 md:w-80 mx-4">
          <button 
            onClick={handlePlay}
            className="w-full py-3 px-6 bg-[#FFB7C5] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-md"
          >
            Play Game
          </button>
          
          {isMobile && (
            <button 
              onClick={handleShowTouchInstructions}
              className="w-full py-3 px-6 bg-[#98FB98] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              <Smartphone size={18} />
              Touch Controls
            </button>
          )}
          
          <button 
            onClick={handleToggleSettings}
            className="w-full py-3 px-6 bg-[#87CEEB] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2"
          >
            <Settings size={18} />
            Settings
          </button>
          
          <button 
            onClick={handleToggleInfo}
            className="w-full py-3 px-6 bg-[#98FB98] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2"
          >
            <Info size={18} />
            How to Play
          </button>
        </div>
      </div>
      
      {/* Settings panel */}
      {showSettings && (
        <div className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 p-6 rounded-xl shadow-2xl backdrop-blur-sm w-72 md:w-80 mx-4">
          <h2 className="text-2xl font-bold mb-4 text-[#4a3f78]">Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Music & Sound:</span>
              <button onClick={handleToggleMute} className="p-2 hover:bg-gray-100 rounded-full">
                {isMuted ? <VolumeX className="text-red-500" /> : <Volume2 className="text-green-500" />}
              </button>
            </div>
            
            <button 
              onClick={handleToggleSettings}
              className="w-full mt-4 py-2 px-4 bg-[#4a3f78] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* How to play panel */}
      {showInfo && (
        <div className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 p-6 rounded-xl shadow-2xl backdrop-blur-sm w-80 md:w-96 max-h-[70vh] overflow-y-auto mx-4">
          <h2 className="text-2xl font-bold mb-4 text-[#4a3f78]">How to Play</h2>
          <div className="space-y-4 text-gray-700 text-sm md:text-base">
            <p><strong>Controls:</strong></p>
            
            {!isMobile && (
              <>
                <p>Keyboard/Mouse:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Move: Arrow keys or WASD</li>
                  <li>Hit: Spacebar or Left-Click</li>
                  <li>Power Shot: Shift + Spacebar or Right-Click</li>
                </ul>
              </>
            )}
            
            {isMobile && (
              <>
                <p>Touch Controls:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Move: Drag your finger</li>
                  <li>Hit: Tap or swipe</li>
                  <li>Power Shot: Double-tap or hold</li>
                </ul>
              </>
            )}
            
            <p><strong>Scoring:</strong></p>
            <p>First to 21 points wins!</p>
            
            <p><strong>Power-ups:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>🌀 Speed Boost - Move faster for 10 seconds</li>
              <li>🔥 Power Hit - Extra powerful shots for 3 hits</li>
              <li>✨ Misdirection - Makes shuttle trajectory unpredictable</li>
            </ul>
            
            <button 
              onClick={handleToggleInfo}
              className="w-full mt-4 py-2 px-4 bg-[#4a3f78] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Touch Instructions Modal */}
      {showTouchInstructions && (
        <TouchInstructions onClose={() => setShowTouchInstructions(false)} />
      )}
      
      {/* Sound controls */}
      <div className="absolute bottom-4 right-4 z-10">
        <button 
          onClick={handleToggleMute}
          className="p-3 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full transition-all shadow-md"
        >
          {isMuted ? <VolumeX className="text-gray-700" /> : <Volume2 className="text-gray-700" />}
        </button>
      </div>
      
      {/* Mobile indicator */}
      {isMobile && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white bg-opacity-80 px-3 py-1 rounded-full">
            <Smartphone size={16} className="text-[#4a3f78]" />
          </div>
        </div>
      )}
    </div>
  );
};