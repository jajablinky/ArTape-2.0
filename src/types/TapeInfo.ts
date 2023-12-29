export type TapeInfo = {
    tapeName: string;
    vaultId: string;
    color: string;
  };

export interface TapeInfoJSON {
  tapeArtistName: string;
  type: string;
  color: string;
  audioFiles: AudioFile[];
  imageFiles: ImageFile[];
  videoFiles: VideoFile[];
}

interface Modules{
  module1: AudioFileWithFiles[];
  module2: VideoFileWithUrls[];
  module3: AudioFileWithFiles[];
  module4: AudioFileWithFiles[];
  module5: AudioFileWithFiles[];
  module6: AudioFileWithFiles[];
  module7: AudioFileWithFiles[];
  module8: AudioFileWithFiles[];
}

export interface Tape extends Omit<TapeInfoJSON, 'audioFiles' | 'imageFiles' | 'profilePicture'> {
  audioFiles: AudioFileWithUrls[];
  imageFiles: ImageFileWithUrls[];
  videoFiles: VideoFileWithUrls[];
  tapeInfoJSON: TapeInfoJSON | null;
}

export type ArrayAudioFileWithUrls = AudioFileWithUrls[];


export interface TapeWithAudioFiles extends Tape {
  audioFiles: AudioFileWithFiles[];

}
export interface TapeWithImageFiles extends Tape {

  imageFiles: ImageFileWithFiles[];
}

export interface TapeWithVideoFiles extends Tape {
  videoFiles: VideoFileWithFiles[];
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

export interface VideoFile {
  name: string;
  alt: string;
  artistName: string;
  moduleId: number;
  duration: number;
  fileName: string;
}

export interface VideoFileWithUrls extends VideoFile {
  videoUrl: string | null;
}

export interface VideoFileWithFiles extends VideoFileWithUrls {
  videoFile: File | null;
}