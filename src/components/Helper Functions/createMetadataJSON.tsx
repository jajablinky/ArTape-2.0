import { Tape, TapeWithFiles } from '@/types/TapeInfo';

const createMetadataJSON = (
  data: any,
  tape: TapeWithFiles | null,
  color: string,
  imageModules: any
) => {
  try {
    const metadata = {
      profilePicture: data.profilePicture[0].name,
      tapeArtistName: data.tapeArtistName,
      tapeDescription: data.tapeDescription,
      type: data.type,
      color: color,
      memento: data.memento,
      audioFiles: tape?.audioFiles
        ? tape.audioFiles.map((file) => ({
            trackNumber: file.trackNumber,
            name: file.name,
            artistName: file.artistName,
            duration: file.duration,
            albumPicture: file.albumPicture,
            fileName: file.fileName,
          }))
        : [],
      imageFiles: imageModules
        ? imageModules.map((file: any) => ({
            name: file.name,
            alt: file.alt,
            moduleId: file.moduleId,
          }))
        : [],
      videoFiles: tape?.videoFiles
          ? tape.videoFiles.map((file: any) => ({
            name: file.name,
            alt: file.alt,
            artistName: file.artistName,
            moduleId: file.moduleId,
            duration: file.duration,
            fileName: file.fileName,
          }))
        : [],
    };
    return metadata;
  } catch (error) {
    console.error('Error in createMetadataJSON:', error);
    return null;
  }
};

export default createMetadataJSON;
