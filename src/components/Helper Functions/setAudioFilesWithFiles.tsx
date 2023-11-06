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

      return { ...file, audioFile };
    })
  );

  return { ...tape, audioFiles };
}
