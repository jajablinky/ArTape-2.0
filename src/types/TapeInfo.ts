import { Akord } from "@akord/akord-js";
import { File } from 'buffer';
// -Tape Types - //

// TapeInfo Types

export type TapeInfo = {
    tapeName: string;
    vaultId: string;
    color: string;
    modules: Module[];
  };

export type TapeInfoJSON = {
  tapeArtistName: string;
  type: string;
  color: string;
  modules: Module[];
}

export type Metadata = {
  name: string;
  artistName: string;
  duration: number;
  fileName: string;
};

export type Track = {
  type: string;
  metadata: Metadata;
};

export type TrackWithFiles = Track & {
  url: string | null;
  file: File | null;
};

export type Additional = {
  name: string;
  alt: string;
  time: number;
};

export type AdditionalWithFiles = Additional & {
  url: string | null;
  file: File | null;
};

export type Module = {
  module: number;
  track: Track;
  additional: Additional[];
};

export type ModuleWithFiles = {
  moduleName: string;
  trackItem: TrackWithFiles;
  additionalItem: AdditionalWithFiles[];
};

// Full Tape Types

export interface Tape {
  akord: Akord;
  color: string;
  modules: ModuleWithFiles[];
  tapeArtistName: string;
  tapeInfoJSON: TapeInfoJSON | null;
}