import {
  AudioFileWithUrls,
  ImageFileWithUrls,
  TapeInfoJSON,
} from '@/types/TapeInfo';

async function processItem(
  item: any,
  tapeInfoJSON: TapeInfoJSON | null,
  akord: any
) {
  // Variable to hold the return values
  let result: {
    audioFiles?: AudioFileWithUrls[];
    imageFiles?: ImageFileWithUrls[];
    profilePicture?: { name: string; url: string };
  } = {};

  // Audio processing
  if (item.versions[0].type.startsWith('audio')) {
    const audioId = item.id;
    const { data: decryptedAudio } = await akord.stack.getVersion(audioId);

    const blobUrl = URL.createObjectURL(new Blob([decryptedAudio]));

    const audioMeta = tapeInfoJSON?.audioFiles.find(
      (audio) => audio.fileName === item.name
    );

    const udl = item.versions[0].udl;
    console.log(udl);

    result.audioFiles = [
      {
        trackNumber: audioMeta?.trackNumber || 0,
        name: audioMeta?.name || '',
        artistName: audioMeta?.artistName || '',
        duration: audioMeta?.duration || 0,
        audioUrl: blobUrl,
        fileName: audioMeta?.fileName || '',
        udl: udl || null,
      },
    ];
  }
  // Image processing
  else if (item.versions[0].type.startsWith('image')) {
    const imageId = item.id;
    const { data: decryptedImage } = await akord.stack.getVersion(imageId);
    const udl = item.versions[0].udl;

    const blobUrl = URL.createObjectURL(new Blob([decryptedImage]));
    const imageMeta = tapeInfoJSON?.imageFiles.find(
      (image) => image.name === item.name
    );
    // Find the matching image index and its corresponding moduleId in the tapeInfoJSON
    let matchingImageModuleId;
    const matchingImageIndex = tapeInfoJSON?.imageFiles.findIndex(
      (image) => image.name === item.name
    );
    if (matchingImageIndex !== -1 && matchingImageIndex !== undefined) {
      matchingImageModuleId =
        tapeInfoJSON?.imageFiles[matchingImageIndex].moduleId;
    }

    // Only add to imageFiles if it's not a profile picture or album picture

    result.imageFiles = [
      {
        name: item.name,
        alt: imageMeta?.alt || '',
        moduleId: matchingImageModuleId || 0,
        url: blobUrl,
        udl: udl | null,
      },
    ];
  }

  return result;
}

export default processItem;
