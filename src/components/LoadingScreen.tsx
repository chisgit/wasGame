import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  assetsLoaded: boolean;
}

export const LoadingScreen = ({ assetsLoaded }: LoadingScreenProps) => {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const nextProgress = prev + Math.random() * 15;
        return assetsLoaded ? 100 : Math.min(nextProgress, 95);
      });
    }, 300);

    return () => clearInterval(interval);
  }, [assetsLoaded]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gradient-to-b from-[#8859b6] to-[#4a3f78]">
      <h1 className="text-5xl font-bold mb-12 animate-pulse text-[#FFB7C5]">
        Anime Badminton
      </h1>
      <div className="w-64 h-3 bg-[#2a2a2a] rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-[#FFB7C5] to-[#87CEEB] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      <div className="flex items-center gap-2">
        <Loader2 className="animate-spin text-[#98FB98]" />
        <span className="text-[#98FB98]">Loading assets... {Math.floor(loadingProgress)}%</span>
      </div>
      <div className="mt-16 max-w-md text-center text-[#d1d1d1] text-sm">
        <p>Prepare for an exciting badminton match with cute anime characters and special power-ups!</p>
      </div>
    </div>
  );
};