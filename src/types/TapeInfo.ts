// -Tape Types - //



// TapeInfo Types

export type TapeInfo = {
    tapeName: string;
    vaultId: string;
    color: string;
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
  additional: ImageArray[];
}

export interface ModuleVideo {
  track: BaseVideo[];
  additional: ImageArray[];
}

export interface ModuleAudioURL {
  track: AudioWithUrl[];
  additional: ImageArray[];
}

export interface ModuleVideoURL {
  track: VideoWithUrl[];
  additional: ImageArray[];
}

export interface ModuleAudioFile {
  track: AudioWithFile[];
  additional: ImageArray[];
}

// There should be no additional for video files currently, this is module audio specific
export interface ModuleVideoFile {
  track: VideoWithFile[];
  additional: [];
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

export interface ModulesWithFiles{
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

export interface Tape extends Omit<TapeInfoJSON, 'audioFiles' | 'imageFiles' | 'profilePicture'> {
  modules: ModulesWithURLs[];
  tapeInfoJSON: TapeInfoJSON | null;
}

export interface TapeWithFiles {
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
  audioUrl: string | null;
}

export interface AudioWithFile extends AudioWithUrl {
  audioFile: File | null;
}

export interface ImageArray {
  Image: BaseImage;
}

export interface BaseImage {
  name: string;
  alt: string;
  moduleId: number;
}

export interface ImageWithUrl extends BaseImage{
  url: string | null;
}

export interface ImageWithFile extends ImageWithUrl{
  file: File | null
}

export interface BaseVideo {
  name: string;
  alt: string;
  artistName: string;
  moduleId: number;
  duration: number;
  fileName: string;
}

export interface VideoWithUrl extends BaseVideo {
  videoUrl: string | null;
}

export interface VideoWithFile extends VideoWithUrl {
  videoFile: File | null;
}