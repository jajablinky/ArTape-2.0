import {
  AudioFileWithFiles,
  AudioFileWithUrls,
  Tape,
  TapeWithAudioFiles,
} from '@/types/TapeInfo';
import { blobUrlToFile } from './blobUrltoFile';

export async function setAudioFilesWithFiles(
  tape: Tape
): Promise<TapeWithAudioFiles> {
  const audioFiles: AudioFileWithFiles[] = await Promise.all(
    tape.audioFiles.map(async (file: AudioFileWithUrls) => {
      const audioFile = await blobUrlToFile(
        file.audioUrl as string,
        file.fileName
      );
      const albumPictureFile = await blobUrlToFile(
        file.albumPictureUrl as string,
        file.albumPicture
      );
      return { ...file, audioFile, albumPictureFile };
    })
  );

  return { ...tape, audioFiles };
}
