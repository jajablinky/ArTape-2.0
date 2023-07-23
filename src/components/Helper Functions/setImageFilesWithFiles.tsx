import {
  ImageFileWithFiles,
  ImageFileWithUrls,
  Tape,
  TapeWithImageFiles,
} from '@/types/TapeInfo';
import { blobUrlToFile } from './blobUrltoFile';

export async function setImageFilesWithFiles(
  tape: Tape
): Promise<TapeWithImageFiles> {
  const imageFiles: ImageFileWithFiles[] = await Promise.all(
    tape.imageFiles.map(async (file: ImageFileWithUrls) => {
      const imageFile = await blobUrlToFile(file.url as string, file.name);
      return { ...file, imageFile };
    })
  );

  return { ...tape, imageFiles };
}
