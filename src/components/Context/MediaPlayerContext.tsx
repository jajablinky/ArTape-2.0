import { TrackWithFiles } from '@/types/TapeInfo';
import React, { createContext, useContext, useState } from 'react';

export type MediaClickType = {
  button: 'init' | 'play' | 'prev' | 'next' | 'module' | 'none';
  clickType: 'init' | 'none' | 'player' | 'audioModule' | 'videoModule';
};

export type MediaPlayerContextProps = {
  isVideoPlaying: boolean;
  setIsVideoPlaying: React.Dispatch<React.SetStateAction<boolean>>;

  audioFiles: TrackWithFiles[] | null;
  videoFiles: TrackWithFiles[] | null;

  color: string;

  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;

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

  isMediaPlaying: boolean;
  setIsMediaPlaying: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultState = {
  isVideoPlaying: false,
  setIsVideoPlaying: () => {},

  audioFiles: null,
  videoFiles: null,

  color: '#000',

  volume: 1,
  setVolume: () => {},

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

  isMediaPlaying: false,
  setIsMediaPlaying: () => {},
};

const MediaPlayerContext = createContext<MediaPlayerContextProps>(defaultState);

export default MediaPlayerContext;
