// -Tape Types - //

import { Akord } from "@akord/akord-js";



// TapeInfo Types

export type TapeInfo = {
    tapeName: string;
    vaultId: string;
    color: string;
    modules: Modules[];
  };

export interface TapeInfoJSON {
  tapeArtistName: string;
  type: string;
  color: string;
  modules: Modules[];
}



// Single Module Types

export type Module<T> = T[];

export interface ModuleAudio {
  track: BaseAudio[];
  additional: BaseImage[];
}

export interface ModuleVideo {
  track: BaseVideo[];
  additional: BaseImage[];
}

export interface ModuleAudioURL {
  track: AudioWithUrl[];
  additional: ImageWithUrl[];
}

export interface ModuleVideoURL {
  track: VideoWithUrl[];
  additional: ImageWithUrl[];
}

export interface ModuleAudioFile {
  track: AudioWithFile[];
  additional: ImageWithFile[];
}

// There should be no additional for video files currently, this is module audio specific
export interface ModuleVideoFile {
  track: VideoWithFile[];
  additional: ImageWithFile[];
}


// Full Module Types

export interface Modules{
  module1: Module<ModuleAudio>;
  module2: Module<ModuleVideo>;
  module3: Module<ModuleAudio>;
  module4: Module<ModuleAudio>;
  module5: Module<ModuleAudio>;
  module6: Module<ModuleAudio>;
  module7: Module<ModuleAudio>;
  module8: Module<ModuleAudio>;
}

export interface ModulesWithURLs{
  module1: Module<ModuleAudioURL>;
  module2: Module<ModuleVideoURL>;
  module3: Module<ModuleAudioURL>;
  module4: Module<ModuleAudioURL>;
  module5: Module<ModuleAudioURL>;
  module6: Module<ModuleAudioURL>;
  module7: Module<ModuleAudioURL>;
  module8: Module<ModuleAudioURL>;
}

export type ModulesWithFiles = {
  module1: Module<ModuleAudioFile>;
  module2: Module<ModuleVideoFile>;
  module3: Module<ModuleAudioFile>;
  module4: Module<ModuleAudioFile>;
  module5: Module<ModuleAudioFile>;
  module6: Module<ModuleAudioFile>;
  module7: Module<ModuleAudioFile>;
  module8: Module<ModuleAudioFile>;
}



// Full Tape Types

export interface Tape {
  akord: Akord;
  color: string;
  modules: ModulesWithURLs[];
  tapeArtistName: string;
  tapeInfoJSON: TapeInfoJSON | null;
}

export interface TapeWithFiles {
  akord: Akord;
  color: string;
  tapeArtistName: string;
  modules: ModulesWithFiles[];
  tapeInfoJSON: TapeInfoJSON | null;
}



// Single Data types

export interface BaseAudio {
  name: string;
  artistName: string;
  duration: number;
  fileName: string;
}

export interface AudioWithUrl extends BaseAudio {
  url: string | null;
}

export interface AudioWithFile extends AudioWithUrl {
  file: File | null;
}

export interface BaseImage {
  name: string;
  alt: string;
}

export interface ImageWithUrl extends BaseImage{
  url: string | null;
}

export interface ImageWithFile extends ImageWithUrl{
  file: File | null
}

export interface BaseVideo {
  name: string;
  artistName: string;
  duration: number;
  fileName: string;
}

export interface VideoWithUrl extends BaseVideo {
  url: string | null;
}

export interface VideoWithFile extends VideoWithUrl {
  file: File | null;
}