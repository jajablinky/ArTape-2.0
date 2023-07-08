export type TapeInfo = {
    tapeName: string;
    vaultId: string;
  };

export interface TapeInfoJSON {
    audioFiles: AudioFile[];
    color: string;
    imageFiles: ImageFile[];
    memento: string;
    profilePicture: string;
    tapeArtistName: string;
    tapeDescription: string;
    type: string;
}


export interface Tape extends Omit<TapeInfoJSON, 'audioFiles' | 'imageFiles' | 'profilePicture'> {
  audioFiles: AudioFileWithUrls[];
  imageFiles: ImageFileWithUrls[];
  profilePicture: { name: string; url: string };
  tapeInfoJSON: TapeInfoJSON | null;
}

export type ArrayAudioFileWithUrls = AudioFileWithUrls[];


export interface TapeWithFiles extends Tape {
  audioFiles: AudioFileWithFiles[];
}
export interface AudioFile {
  trackNumber: number;
  name: string;
  artistName: string;
  duration: number;
  albumPicture: string;
}

export interface AudioFileWithUrls extends AudioFile {
  audioUrl: string | null;
  albumPictureUrl: string | null;
}

export interface AudioFileWithFiles extends AudioFileWithUrls {
  audioFile: File | null;
  albumPictureFile: File | null;
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
imageFile: File | null
}