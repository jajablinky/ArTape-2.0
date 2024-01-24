import React, { useState } from 'react';
import MediaPlayerContext, {
  MediaClickType,
  MediaPlayerContextProps,
} from './MediaPlayerContext';

type MediaPlayerProviderProps = {
  children: React.ReactNode;
};

const MediaPlayerProvider: React.FC<MediaPlayerProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [audioFiles, setAudioFiles] = useState(null);
  const [videoFiles, setVideoFiles] = useState(null);
  const color = '#000';
  const [volume, setVolume] = useState(1);
  const [mediaProgress, setMediaProgress] = useState(0);
  const [storedMediaProgress, setStoredMediaProgress] = useState(0);
  const [seekMediaProgress, setSeekMediaProgress] = useState(-1);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(-1);
  const [mediaSelected, setMediaSelected] = useState('');
  const [mediaClickType, setMediaClickType] = useState({
    button: 'init',
    clickType: 'init',
  } as MediaClickType);
  const [lastSelectedMedia, setLastSelectedMedia] = useState(-1);
  const [isMediaPlaying, setIsMediaPlaying] = useState(false);

  const contextValue = {
    isVideoPlaying,
    setIsVideoPlaying,
    audioFiles,
    setAudioFiles,
    videoFiles,
    setVideoFiles,
    color,
    volume,
    setVolume,
    mediaProgress,
    setMediaProgress,
    storedMediaProgress,
    setStoredMediaProgress,
    seekMediaProgress,
    setSeekMediaProgress,
    currentModuleIndex,
    setCurrentModuleIndex,
    mediaSelected,
    setMediaSelected,
    mediaClickType,
    setMediaClickType,
    lastSelectedMedia,
    setLastSelectedMedia,
    isMediaPlaying,
    setIsMediaPlaying,
    loading,
    setLoading,
  };

  return (
    <MediaPlayerContext.Provider value={contextValue}>
      {children}
    </MediaPlayerContext.Provider>
  );
};

export default MediaPlayerProvider;
