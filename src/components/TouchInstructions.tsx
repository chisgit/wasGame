import React from 'react';
import { Smartphone, Hand, Zap } from 'lucide-react';

interface TouchInstructionsProps {
  onClose: () => void;
}

export const TouchInstructions = ({ onClose }: TouchInstructionsProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-6">
          <Smartphone className="text-[#FFB7C5]" size={32} />
          <h2 className="text-2xl font-bold text-[#4a3f78]">Mobile Controls</h2>
        </div>
        
        <div className="space-y-4 text-gray-700">
          <div className="flex items-start gap-3">
            <Hand className="text-[#87CEEB] mt-1" size={20} />
            <div>
              <h3 className="font-semibold">Movement</h3>
              <p className="text-sm">Drag your finger to move your character around the court</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-[#98FB98] rounded-full mt-1 flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold">Single Tap</h3>
              <p className="text-sm">Quick tap to hit the shuttlecock</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-[#FFB7C5] rounded-full mt-1 flex items-center justify-center">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold">Double Tap</h3>
              <p className="text-sm">Quick double tap for a power shot</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Zap className="text-[#98FB98] mt-1" size={20} />
            <div>
              <h3 className="font-semibold">Swipe</h3>
              <p className="text-sm">Fast swipe gesture to hit the shuttlecock with direction</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-[#87CEEB] rounded-full mt-1 flex items-center justify-center">
              <span className="text-white text-xs font-bold">H</span>
            </div>
            <div>
              <h3 className="font-semibold">Hold</h3>
              <p className="text-sm">Hold for 0.5 seconds for a power shot</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-[#f0f8ff] rounded-lg">
          <p className="text-sm text-[#4a3f78] font-medium">
            💡 Tip: The game automatically detects your gestures - just play naturally!
          </p>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full mt-6 py-3 px-6 bg-[#4a3f78] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};