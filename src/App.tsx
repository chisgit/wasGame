import { useState, useEffect } from 'react';
import { Menu } from './components/Menu';
import { Game } from './components/Game';
import { CharacterSelect } from './components/CharacterSelect';
import { LoadingScreen } from './components/LoadingScreen';
import { GameState } from './types/gameTypes';

function App() {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [selectedCharacter, setSelectedCharacter] = useState<number>(0);
  const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Simulate asset loading
    const timer = setTimeout(() => {
      setAssetsLoaded(true);
      setGameState('menu');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const startGame = () => {
    setGameState('game');
  };

  const goToCharacterSelect = () => {
    setGameState('characterSelect');
  };

  const goToMenu = () => {
    setGameState('menu');
  };

  const selectCharacter = (index: number) => {
    setSelectedCharacter(index);
    // After selecting character, go to the game
    startGame();
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-[#121212] flex items-center justify-center">
      {gameState === 'loading' && <LoadingScreen assetsLoaded={assetsLoaded} />}
      {gameState === 'menu' && (
        <Menu onPlay={goToCharacterSelect} />
      )}
      {gameState === 'characterSelect' && (
        <CharacterSelect onSelect={selectCharacter} onBack={goToMenu} />
      )}
      {gameState === 'game' && (
        <Game characterIndex={selectedCharacter} onExit={goToMenu} />
      )}
    </div>
  );
}

export default App;