import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft } from 'lucide-react';
import { useSound } from '../hooks/useSound';

// Mini character renderer function
const drawMiniCharacter = (
  canvas: HTMLCanvasElement,
  character: any
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = Math.min(canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const characterSize = size * 0.6;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw character similar to game rendering
  const headSize = characterSize * 0.4;
  const headX = centerX - headSize / 2;
  const headY = centerY - characterSize / 2;

  // Draw hair back
  ctx.fillStyle = character.hairColor;
  if (character.hairStyle.twintails) {
    // Simple twintails
    ctx.beginPath();
    ctx.arc(headX - headSize * 0.2, headY + headSize * 0.6, headSize * 0.15, 0, Math.PI * 2);
    ctx.arc(headX + headSize * 1.2, headY + headSize * 0.6, headSize * 0.15, 0, Math.PI * 2);
    ctx.fill();
  } else if (character.hairStyle.ponytail) {
    // Simple ponytail
    ctx.beginPath();
    ctx.arc(headX + headSize * 0.5, headY + headSize * 1.2, headSize * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw head
  ctx.fillStyle = '#FFE0BD';
  ctx.beginPath();
  ctx.arc(centerX, headY + headSize / 2, headSize / 2, 0, Math.PI * 2);
  ctx.fill();

  // Draw hair front
  ctx.fillStyle = character.hairColor;
  if (character.hairStyle.bangs) {
    ctx.beginPath();
    ctx.arc(centerX, headY + headSize * 0.2, headSize * 0.4, 0, Math.PI);
    ctx.fill();
  } else if (character.hairStyle.spiky) {
    // Simple spiky hair
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(headX + (headSize * i) / 4, headY);
      ctx.lineTo(headX + (headSize * i) / 4 + headSize * 0.1, headY - headSize * 0.3);
      ctx.lineTo(headX + (headSize * i) / 4 + headSize * 0.2, headY);
      ctx.fill();
    }
  }

  // Draw eyes
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(centerX - headSize * 0.15, headY + headSize * 0.4, headSize * 0.08, 0, Math.PI * 2);
  ctx.arc(centerX + headSize * 0.15, headY + headSize * 0.4, headSize * 0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#4A4A4A';
  ctx.beginPath();
  ctx.arc(centerX - headSize * 0.15, headY + headSize * 0.4, headSize * 0.04, 0, Math.PI * 2);
  ctx.arc(centerX + headSize * 0.15, headY + headSize * 0.4, headSize * 0.04, 0, Math.PI * 2);
  ctx.fill();

  // Draw mouth
  ctx.strokeStyle = '#4A4A4A';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, headY + headSize * 0.7, headSize * 0.05, 0, Math.PI);
  ctx.stroke();

  // Draw body
  ctx.fillStyle = character.color;
  ctx.beginPath();
  ctx.roundRect(
    centerX - characterSize * 0.15,
    headY + headSize * 0.8,
    characterSize * 0.3,
    characterSize * 0.4,
    5
  );
  ctx.fill();
};

// Character data with corresponding game data
const characters = [
  {
    name: 'Sakura',
    color: '#FFB7C5',
    hairColor: '#FF69B4',
    hairStyle: { bangs: true, twintails: true },
    stats: { power: 65, speed: 85, technique: 75 },
    description: 'Quick and agile with excellent technique. Special ability: Can briefly slow down time.'
  },
  {
    name: 'Takeshi',
    color: '#87CEEB',
    hairColor: '#4169E1',
    hairStyle: { bangs: false, spiky: true },
    stats: { power: 90, speed: 60, technique: 70 },
    description: 'Strong and powerful with overwhelming shots. Special ability: Power smash that\'s hard to return.'
  },
  {
    name: 'Yumi',
    color: '#98FB98',
    hairColor: '#98FB98',
    hairStyle: { bangs: true, ponytail: true },
    stats: { power: 70, speed: 70, technique: 90 },
    description: 'Well-balanced with excellent technique. Special ability: Can create deceptive shot trajectories.'
  }
];

interface CharacterSelectProps {
  onSelect: (index: number) => void;
  onBack: () => void;
}

export const CharacterSelect = ({ onSelect, onBack }: CharacterSelectProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { playSound } = useSound();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const character = characters[selectedIndex];

  // Update canvas when character changes
  useEffect(() => {
    if (canvasRef.current) {
      drawMiniCharacter(canvasRef.current, character);
    }
  }, [character]);

  const handlePrevious = () => {
    playSound('click');
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : characters.length - 1));
  };

  const handleNext = () => {
    playSound('click');
    setSelectedIndex((prev) => (prev < characters.length - 1 ? prev + 1 : 0));
  };

  const handleSelect = () => {
    playSound('select');
    onSelect(selectedIndex);
  };

  const handleBack = () => {
    playSound('click');
    onBack();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6a92f0] to-[#4a3f78] overflow-hidden"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        <div className="flex items-center justify-between w-full mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-white hover:text-[#FFB7C5] transition-colors"
          >
            <ChevronLeft />
            Back to Menu
          </button>
          <h2 className="text-4xl font-bold text-white drop-shadow-md">Select Your Character</h2>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        <div className="flex items-center justify-center w-full gap-8">
          <button
            onClick={handlePrevious}
            className="p-3 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full transition-all"
          >
            <ArrowLeft className="text-white" size={32} />
          </button>

          <div className="flex flex-col items-center bg-white bg-opacity-80 p-8 rounded-xl shadow-xl backdrop-blur-sm w-[450px]">
            {/* Character portrait */}
            <div
              className="w-64 h-64 mb-6 rounded-xl shadow-lg overflow-hidden border-4 flex items-center justify-center"
              style={{ borderColor: character.color, backgroundColor: character.color + '20' }}
            >
              <canvas
                ref={canvasRef}
                width={240}
                height={240}
                className="w-full h-full"
              />
            </div>

            <h3 className="text-3xl font-bold mb-2" style={{ color: character.color }}>
              {character.name}
            </h3>

            <p className="text-gray-700 mb-6 text-center">{character.description}</p>

            {/* Stats */}
            <div className="w-full space-y-3 mb-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Power</span>
                  <span>{character.stats.power}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{ width: `${character.stats.power}%`, backgroundColor: character.color }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Speed</span>
                  <span>{character.stats.speed}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{ width: `${character.stats.speed}%`, backgroundColor: character.color }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Technique</span>
                  <span>{character.stats.technique}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{ width: `${character.stats.technique}%`, backgroundColor: character.color }}
                  ></div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSelect}
              className="w-full py-3 px-6 text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-md"
              style={{ backgroundColor: character.color }}
            >
              Select {character.name}
            </button>
          </div>

          <button
            onClick={handleNext}
            className="p-3 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full transition-all"
          >
            <ArrowRight className="text-white" size={32} />
          </button>
        </div>

        {/* Character pagination dots */}
        <div className="flex items-center gap-2 mt-8">
          {characters.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${i === selectedIndex ? 'w-6' : ''}`}
              style={{
                backgroundColor: i === selectedIndex ? characters[i].color : 'rgba(255, 255, 255, 0.5)'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};