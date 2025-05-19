import { useCallback, useRef } from 'react';

interface SoundOptions {
  volume?: number;
  loop?: boolean;
  stop?: boolean;
}

export const useSound = () => {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const isMutedRef = useRef<boolean>(false);
  
  // Sound URLs - in a real game, these would be actual sound files
  const soundUrls: Record<string, string> = {
    click: 'click.mp3',
    select: 'select.mp3',
    hit: 'hit.mp3',
    point: 'point.mp3',
    powerup: 'powerup.mp3',
    victory: 'victory.mp3',
    defeat: 'defeat.mp3',
    menuMusic: 'menu_music.mp3',
    gameMusic: 'game_music.mp3',
  };
  
  const playSound = useCallback((sound: string, options: SoundOptions = {}) => {
    if (isMutedRef.current && !options.stop) return;
    
    if (!audioRefs.current[sound] && !options.stop) {
      // In a real implementation, this would use actual sound files
      // For this demo, we'll simulate sounds
      console.log(`Playing sound: ${sound}`);
      
      // Simulate audio elements (not actually playing sounds in this example)
      audioRefs.current[sound] = document.createElement('audio');
      audioRefs.current[sound].src = soundUrls[sound];
      audioRefs.current[sound].volume = options.volume ?? 0.5;
      audioRefs.current[sound].loop = options.loop ?? false;
    }
    
    const audio = audioRefs.current[sound];
    
    if (options.stop) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    } else {
      // In a real game, this would play actual sounds
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio play failed:', e));
      }
    }
  }, []);
  
  const toggleMute = useCallback(() => {
    isMutedRef.current = !isMutedRef.current;
    
    // Mute or unmute all active sounds
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        if (isMutedRef.current) {
          audio.pause();
        } else if (audio.loop) {
          audio.play().catch(e => console.log('Audio play failed:', e));
        }
      }
    });
    
    return isMutedRef.current;
  }, []);
  
  return { playSound, toggleMute };
};