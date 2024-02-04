import { TrackWithFiles } from '@/types/TapeInfo';
import React, { createContext, useContext, useState } from 'react';

export type MediaClickType = {
  button: 'init' | 'play' | 'prev' | 'next' | 'module' | 'none';
  clickType: 'init' | 'none' | 'player' | 'audioModule' | 'videoModule';
};

export type MediaPlayerContextProps = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;

  isVideoPlaying: boolean;
  setIsVideoPlaying: React.Dispatch<React.SetStateAction<boolean>>;

  audioFiles: TrackWithFiles[] | null;
  setAudioFiles: React.Dispatch<React.SetStateAction<TrackWithFiles[] | null>>;

  videoFiles: TrackWithFiles[] | null;
  setVideoFiles: React.Dispatch<React.SetStateAction<TrackWithFiles[] | null>>;

  color: string;

  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;

  mediaDuration: number;
  setMediaDuration: React.Dispatch<React.SetStateAction<number>>;

  mediaProgress: number;
  setMediaProgress: React.Dispatch<React.SetStateAction<number>>;

  storedMediaProgress: number;
  setStoredMediaProgress: React.Dispatch<React.SetStateAction<number>>;

  seekMediaProgress: number;
  setSeekMediaProgress: React.Dispatch<React.SetStateAction<number>>;

  currentModuleIndex: number;
  setCurrentModuleIndex: React.Dispatch<React.SetStateAction<number>>;

  mediaSelected: string;
  setMediaSelected: React.Dispatch<React.SetStateAction<string>>;

  mediaClickType: MediaClickType;
  setMediaClickType: React.Dispatch<React.SetStateAction<MediaClickType>>;

  lastSelectedMedia: number;
  setLastSelectedMedia: React.Dispatch<React.SetStateAction<number>>;

  isMediaPlaying: boolean;
  setIsMediaPlaying: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultState = {
  loading: false,
  setLoading: () => {},

  isVideoPlaying: false,
  setIsVideoPlaying: () => {},

  audioFiles: null,
  setAudioFiles: () => {},

  videoFiles: null,
  setVideoFiles: () => {},

  color: '#000',

  volume: 1,
  setVolume: () => {},

  mediaDuration: 0,
  setMediaDuration: () => {},

  mediaProgress: 0,
  setMediaProgress: () => {},

  storedMediaProgress: 0,
  setStoredMediaProgress: () => {},

  seekMediaProgress: -1,
  setSeekMediaProgress: () => {},

  currentModuleIndex: -1,
  setCurrentModuleIndex: () => {},

  mediaSelected: '',
  setMediaSelected: () => {},

  mediaClickType: { button: 'init', clickType: 'init' } as MediaClickType,
  setMediaClickType: (() => {}) as React.Dispatch<
    React.SetStateAction<MediaClickType>
  >,

  lastSelectedMedia: -1,
  setLastSelectedMedia: () => {},

  isMediaPlaying: false,
  setIsMediaPlaying: () => {},
};

const MediaPlayerContext = createContext<MediaPlayerContextProps>(defaultState);

export const useMediaContext = () => useContext(MediaPlayerContext);

export default MediaPlayerContext;
