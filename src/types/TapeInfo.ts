export type TapeInfo = {
    tapeName: string;
    vaultId: string;
    color: string;
  };

export interface TapeInfoJSON {
    audioFiles: AudioFile[];
    color: string;
    imageFiles: ImageFile[];
    tapeArtistName: string;
    type: string;
}


export interface Tape extends Omit<TapeInfoJSON, 'audioFiles' | 'imageFiles' | 'profilePicture'> {
  audioFiles: AudioFileWithUrls[];
  imageFiles: ImageFileWithUrls[];
  tapeInfoJSON: TapeInfoJSON | null;
}

export type ArrayAudioFileWithUrls = AudioFileWithUrls[];


export interface TapeWithAudioFiles extends Tape {
  audioFiles: AudioFileWithFiles[];

}
export interface TapeWithImageFiles extends Tape {

  imageFiles: ImageFileWithFiles[];
}

export interface AudioFile {
  trackNumber: number;
  name: string;
  artistName: string;
  duration: number;
  fileName: string;
}

export interface AudioFileWithUrls extends AudioFile {
  audioUrl: string | null;
}

export interface AudioFileWithFiles extends AudioFileWithUrls {
  audioFile: File | null;
}

export interface ImageFile {
    name: string;
    alt: string;
    moduleId: number;
}

export interface ImageFileWithUrls extends ImageFile{
    url: string | null;
}

export interface ImageFileWithFiles extends ImageFileWithUrls{
file: File | null
}