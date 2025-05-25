import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft } from 'lucide-react';
import { useSound } from '../hooks/useSound';

// Professional anime-style character renderer
const drawMiniCharacter = (
  canvas: HTMLCanvasElement,
  character: any
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = Math.min(canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const scale = size * 0.0035; // Scale factor for all measurements

  // Clear canvas with subtle gradient background
  const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size / 2);
  bgGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Character positioning
  const headSize = 45 * scale;
  const headX = centerX - headSize / 2;
  const headY = centerY - 60 * scale;

  // Draw back hair layer
  ctx.fillStyle = character.hairColor;
  drawBackHair(ctx, character, headX, headY, headSize);

  // Draw neck
  ctx.fillStyle = '#FFDBAA';
  ctx.beginPath();
  ctx.roundRect(centerX - 8 * scale, headY + headSize * 0.85, 16 * scale, 15 * scale, 3 * scale);
  ctx.fill();

  // Draw head with better shading
  const headGradient = ctx.createRadialGradient(
    centerX - 5 * scale, headY + headSize * 0.3, 0,
    centerX, headY + headSize * 0.5, headSize * 0.7
  );
  headGradient.addColorStop(0, '#FFDBAA');
  headGradient.addColorStop(1, '#F4C2A1');
  ctx.fillStyle = headGradient;
  ctx.beginPath();
  ctx.ellipse(centerX, headY + headSize * 0.5, headSize * 0.5, headSize * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw front hair
  ctx.fillStyle = character.hairColor;
  drawFrontHair(ctx, character, headX, headY, headSize);

  // Draw anime-style eyes with highlights
  drawAnimeEyes(ctx, centerX, headY + headSize * 0.4, headSize, character);

  // Draw nose (subtle)
  ctx.fillStyle = '#E6B08A';
  ctx.beginPath();
  ctx.ellipse(centerX, headY + headSize * 0.6, 1.5 * scale, 2 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw mouth with expression
  drawMouth(ctx, centerX, headY + headSize * 0.75, headSize);

  // Draw badminton uniform
  drawBadmintonUniform(ctx, character, centerX, headY, headSize, scale);

  // Draw racket
  drawMiniRacket(ctx, centerX + 25 * scale, headY + 35 * scale, scale);

  // Add sparkle effects
  drawSparkles(ctx, centerX, centerY, scale);
};

const drawBackHair = (ctx: CanvasRenderingContext2D, character: any, headX: number, headY: number, headSize: number) => {
  if (character.hairStyle.twintails) {
    // Detailed twintails
    const twintailSize = headSize * 0.3;
    // Left twintail
    ctx.beginPath();
    ctx.ellipse(headX - twintailSize * 0.5, headY + headSize * 0.7, twintailSize, twintailSize * 1.5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Right twintail
    ctx.beginPath();
    ctx.ellipse(headX + headSize + twintailSize * 0.5, headY + headSize * 0.7, twintailSize, twintailSize * 1.5, 0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (character.hairStyle.ponytail) {
    // Flowing ponytail
    ctx.beginPath();
    ctx.ellipse(headX + headSize * 0.5, headY + headSize * 1.1, headSize * 0.25, headSize * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Main back hair
  ctx.beginPath();
  ctx.ellipse(headX + headSize * 0.5, headY + headSize * 0.4, headSize * 0.65, headSize * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
};

const drawFrontHair = (ctx: CanvasRenderingContext2D, character: any, headX: number, headY: number, headSize: number) => {
  if (character.hairStyle.bangs) {
    // Stylized bangs
    ctx.beginPath();
    ctx.moveTo(headX + headSize * 0.1, headY + headSize * 0.15);
    ctx.quadraticCurveTo(headX + headSize * 0.3, headY, headX + headSize * 0.5, headY + headSize * 0.25);
    ctx.quadraticCurveTo(headX + headSize * 0.7, headY, headX + headSize * 0.9, headY + headSize * 0.15);
    ctx.lineTo(headX + headSize * 0.8, headY + headSize * 0.3);
    ctx.quadraticCurveTo(headX + headSize * 0.5, headY + headSize * 0.4, headX + headSize * 0.2, headY + headSize * 0.3);
    ctx.closePath();
    ctx.fill();
  } else if (character.hairStyle.spiky) {
    // Dynamic spiky hair
    for (let i = 0; i < 6; i++) {
      const spikeX = headX + (headSize * i) / 5;
      const spikeHeight = headSize * (0.3 + Math.sin(i) * 0.1);
      ctx.beginPath();
      ctx.moveTo(spikeX, headY + headSize * 0.2);
      ctx.lineTo(spikeX + headSize * 0.1, headY - spikeHeight);
      ctx.lineTo(spikeX + headSize * 0.2, headY + headSize * 0.2);
      ctx.closePath();
      ctx.fill();
    }
  }
};

const drawAnimeEyes = (ctx: CanvasRenderingContext2D, centerX: number, eyeY: number, headSize: number, character: any) => {
  const eyeWidth = headSize * 0.12;
  const eyeHeight = headSize * 0.18;
  const leftEyeX = centerX - headSize * 0.18;
  const rightEyeX = centerX + headSize * 0.18;

  // Eye whites
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.ellipse(leftEyeX, eyeY, eyeWidth, eyeHeight, 0, 0, Math.PI * 2);
  ctx.ellipse(rightEyeX, eyeY, eyeWidth, eyeHeight, 0, 0, Math.PI * 2);
  ctx.fill();

  // Iris with character color
  const irisColor = character.name === 'Sakura' ? '#FF69B4' :
    character.name === 'Takeshi' ? '#4169E1' : '#32CD32';
  ctx.fillStyle = irisColor;
  ctx.beginPath();
  ctx.ellipse(leftEyeX, eyeY, eyeWidth * 0.7, eyeHeight * 0.8, 0, 0, Math.PI * 2);
  ctx.ellipse(rightEyeX, eyeY, eyeWidth * 0.7, eyeHeight * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.ellipse(leftEyeX, eyeY, eyeWidth * 0.3, eyeHeight * 0.4, 0, 0, Math.PI * 2);
  ctx.ellipse(rightEyeX, eyeY, eyeWidth * 0.3, eyeHeight * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Highlight shine
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.ellipse(leftEyeX - eyeWidth * 0.2, eyeY - eyeHeight * 0.3, eyeWidth * 0.2, eyeHeight * 0.25, 0, 0, Math.PI * 2);
  ctx.ellipse(rightEyeX - eyeWidth * 0.2, eyeY - eyeHeight * 0.3, eyeWidth * 0.2, eyeHeight * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyelashes
  ctx.strokeStyle = '#2C2C2C';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(leftEyeX - eyeWidth + i * eyeWidth * 0.7, eyeY - eyeHeight);
    ctx.lineTo(leftEyeX - eyeWidth + i * eyeWidth * 0.7 - 2, eyeY - eyeHeight - 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightEyeX - eyeWidth + i * eyeWidth * 0.7, eyeY - eyeHeight);
    ctx.lineTo(rightEyeX - eyeWidth + i * eyeWidth * 0.7 - 2, eyeY - eyeHeight - 4);
    ctx.stroke();
  }
};

const drawMouth = (ctx: CanvasRenderingContext2D, centerX: number, mouthY: number, headSize: number) => {
  ctx.strokeStyle = '#C67B5C';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  // Slight smile
  ctx.beginPath();
  ctx.arc(centerX, mouthY - headSize * 0.02, headSize * 0.08, 0.1, Math.PI - 0.1);
  ctx.stroke();
};

const drawBadmintonUniform = (ctx: CanvasRenderingContext2D, character: any, centerX: number, headY: number, headSize: number, scale: number) => {
  const bodyY = headY + headSize;
  const bodyWidth = 35 * scale;
  const bodyHeight = 45 * scale;

  // Main uniform
  const uniformGradient = ctx.createLinearGradient(centerX, bodyY, centerX, bodyY + bodyHeight);
  uniformGradient.addColorStop(0, character.color);
  uniformGradient.addColorStop(1, character.color + 'CC');
  ctx.fillStyle = uniformGradient;

  ctx.beginPath();
  ctx.roundRect(centerX - bodyWidth / 2, bodyY, bodyWidth, bodyHeight, 5 * scale);
  ctx.fill();

  // Collar
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(centerX - 8 * scale, bodyY);
  ctx.lineTo(centerX + 8 * scale, bodyY);
  ctx.lineTo(centerX + 12 * scale, bodyY + 8 * scale);
  ctx.lineTo(centerX, bodyY + 12 * scale);
  ctx.lineTo(centerX - 12 * scale, bodyY + 8 * scale);
  ctx.closePath();
  ctx.fill();

  // Sleeves
  ctx.fillStyle = character.color;
  // Left sleeve
  ctx.beginPath();
  ctx.ellipse(centerX - bodyWidth / 2 - 8 * scale, bodyY + 15 * scale, 12 * scale, 18 * scale, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // Right sleeve
  ctx.beginPath();
  ctx.ellipse(centerX + bodyWidth / 2 + 8 * scale, bodyY + 15 * scale, 12 * scale, 18 * scale, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Team logo/number
  ctx.fillStyle = 'white';
  ctx.font = `bold ${12 * scale}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(character.name[0], centerX, bodyY + 25 * scale);
};

const drawMiniRacket = (ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) => {
  const racketSize = 15 * scale;

  // Handle
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 4 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 20 * scale);
  ctx.stroke();

  // Frame
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.ellipse(x, y - racketSize / 2, racketSize / 2, racketSize / 1.5, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Strings
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  // Vertical strings
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(x + i * racketSize / 6, y - racketSize * 0.7);
    ctx.lineTo(x + i * racketSize / 6, y - racketSize * 0.1);
    ctx.stroke();
  }
  // Horizontal strings
  for (let i = -3; i <= 0; i++) {
    ctx.beginPath();
    ctx.moveTo(x - racketSize / 2.5, y - racketSize / 2 + i * racketSize / 8);
    ctx.lineTo(x + racketSize / 2.5, y - racketSize / 2 + i * racketSize / 8);
    ctx.stroke();
  }
};

const drawSparkles = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

  // Small sparkles around character
  const sparkles = [
    { x: centerX - 30 * scale, y: centerY - 40 * scale, size: 2 * scale },
    { x: centerX + 35 * scale, y: centerY - 30 * scale, size: 3 * scale },
    { x: centerX - 25 * scale, y: centerY + 20 * scale, size: 1.5 * scale },
    { x: centerX + 28 * scale, y: centerY + 30 * scale, size: 2.5 * scale }
  ];

  sparkles.forEach(sparkle => {
    ctx.beginPath();
    ctx.moveTo(sparkle.x, sparkle.y - sparkle.size);
    ctx.lineTo(sparkle.x, sparkle.y + sparkle.size);
    ctx.moveTo(sparkle.x - sparkle.size, sparkle.y);
    ctx.lineTo(sparkle.x + sparkle.size, sparkle.y);
    ctx.stroke();

    // Diagonal lines for 4-point star
    ctx.beginPath();
    ctx.moveTo(sparkle.x - sparkle.size * 0.7, sparkle.y - sparkle.size * 0.7);
    ctx.lineTo(sparkle.x + sparkle.size * 0.7, sparkle.y + sparkle.size * 0.7);
    ctx.moveTo(sparkle.x + sparkle.size * 0.7, sparkle.y - sparkle.size * 0.7);
    ctx.lineTo(sparkle.x - sparkle.size * 0.7, sparkle.y + sparkle.size * 0.7);
    ctx.stroke();
  });
};

// Enhanced character data with professional backstories
const characters = [
  {
    name: 'Sakura',
    color: '#FFB7C5',
    hairColor: '#FF69B4',
    hairStyle: { bangs: true, twintails: true },
    stats: { power: 65, speed: 85, technique: 75 },
    description: 'Sakura Hayashi - The Lightning Blossom. A prodigy from Tokyo\'s elite badminton academy, known for her lightning-fast reflexes and the legendary "Cherry Blossom Rush" technique that can slow time itself.'
  },
  {
    name: 'Takeshi',
    color: '#87CEEB',
    hairColor: '#4169E1',
    hairStyle: { bangs: false, spiky: true },
    stats: { power: 90, speed: 60, technique: 70 },
    description: 'Takeshi Yamamoto - The Thunder Spike. Captain of Kyoto University\'s championship team, his overwhelming "Thunder Smash" has never been successfully returned. A gentle giant with unwavering determination.'
  },
  {
    name: 'Yumi',
    color: '#98FB98',
    hairColor: '#98FB98',
    hairStyle: { bangs: true, ponytail: true },
    stats: { power: 70, speed: 70, technique: 90 },
    description: 'Yumi Tanaka - The Mystic Strategist. A tactical genius who can read opponents like an open book. Her "Phantom Trajectory" ability creates deceptive shot patterns that confuse even the most experienced players.'
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
      {/* Add CSS animations */}
      <style>{`
        @keyframes borderGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        .hover\\:scale-105:hover .select-button-shine {
          transform: scaleX(1);
        }
      `}</style>

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
          </button>          <div className="flex flex-col items-center bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl backdrop-blur-sm w-[500px] border border-white border-opacity-30">
            {/* Character portrait with enhanced styling */}
            <div
              className="w-72 h-72 mb-6 rounded-xl shadow-2xl overflow-hidden border-4 flex items-center justify-center relative"
              style={{
                borderColor: character.color,
                backgroundColor: character.color + '15',
                boxShadow: `0 8px 32px ${character.color}40, inset 0 2px 8px rgba(255,255,255,0.3)`
              }}
            >
              {/* Subtle animated border glow */}
              <div
                className="absolute inset-0 rounded-xl animate-pulse"
                style={{
                  background: `linear-gradient(45deg, ${character.color}20, transparent, ${character.color}20)`,
                  animation: 'borderGlow 3s ease-in-out infinite'
                }}
              />
              <canvas
                ref={canvasRef}
                width={280}
                height={280}
                className="w-full h-full relative z-10"
              />
            </div>            <div className="text-center mb-6">
              <h3 className="text-4xl font-bold mb-2 drop-shadow-md" style={{ color: character.color }}>
                {character.name}
              </h3>
              <div className="w-16 h-1 mx-auto rounded-full mb-4" style={{ backgroundColor: character.color }}></div>
              <p className="text-gray-700 leading-relaxed text-sm font-medium px-2">{character.description}</p>
            </div>            {/* Enhanced Stats */}
            <div className="w-full space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="flex items-center gap-2">
                    ⚡ Power
                  </span>
                  <span className="font-bold">{character.stats.power}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full transition-all duration-700 ease-out rounded-full shadow-sm"
                    style={{
                      width: `${character.stats.power}%`,
                      background: `linear-gradient(90deg, ${character.color}, ${character.color}DD)`
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="flex items-center gap-2">
                    ⚡ Speed
                  </span>
                  <span className="font-bold">{character.stats.speed}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full transition-all duration-700 ease-out rounded-full shadow-sm"
                    style={{
                      width: `${character.stats.speed}%`,
                      background: `linear-gradient(90deg, ${character.color}, ${character.color}DD)`
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="flex items-center gap-2">
                    🎯 Technique
                  </span>
                  <span className="font-bold">{character.stats.technique}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full transition-all duration-700 ease-out rounded-full shadow-sm"
                    style={{
                      width: `${character.stats.technique}%`,
                      background: `linear-gradient(90deg, ${character.color}, ${character.color}DD)`
                    }}
                  ></div>
                </div>
              </div>
            </div>            <button
              onClick={handleSelect}
              className="w-full py-4 px-6 text-white font-bold text-lg rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden group"
              style={{
                background: `linear-gradient(135deg, ${character.color}, ${character.color}DD)`,
                boxShadow: `0 6px 20px ${character.color}40`
              }}
            >
              <span className="relative z-10">Choose {character.name}</span>
              <div
                className="absolute inset-0 bg-white bg-opacity-20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              />
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