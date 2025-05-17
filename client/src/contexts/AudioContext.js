import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// Use the existing audio file in the assets directory
import backgroundMusic from '../assets/audio/background-music.mp3';

// Audio context
const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => {
    // Load muted preference from localStorage if available
    const savedMuted = localStorage.getItem('gameMuted');
    return savedMuted ? JSON.parse(savedMuted) : false;
  });

  const [isPlaying, setIsPlaying] = useState(false);

  // Use saved volume or default to 50%
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('gameVolume');
    return savedVolume ? parseFloat(savedVolume) : 0.5;
  });

  // Use ref to maintain audio instance across renders
  const audioRef = useRef(null);
  useEffect(() => {
    // Create audio element on component mount
    audioRef.current = new Audio(backgroundMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [volume]);

  // Handle mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      localStorage.setItem('gameMuted', JSON.stringify(isMuted));
    }
  }, [isMuted]);

  // Play/pause control
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && !isMuted) {
        // Using a Promise to handle autoplay restrictions elegantly
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Playback started successfully
            })
            .catch(error => {
              // Auto-play was prevented
              console.log("Autoplay prevented:", error);
              setIsPlaying(false);
            });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted]);
  // Set volume
  const setAudioVolume = (newVolume) => {
    // Ensure volume is between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume));

    setVolume(clampedVolume);
    localStorage.setItem('gameVolume', clampedVolume.toString());

    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  };

  // Toggle music on/off
  const toggleMusic = () => {
    setIsPlaying(prev => !prev);
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  // Start music
  const playMusic = () => {
    setIsPlaying(true);
  };

  // Stop music
  const pauseMusic = () => {
    setIsPlaying(false);
  };
    return (
    <AudioContext.Provider
      value={{
        isMuted,
        isPlaying,
        volume,
        toggleMute,
        toggleMusic,
        playMusic,
        pauseMusic,
        setAudioVolume
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

// Custom hook to use audio context
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
