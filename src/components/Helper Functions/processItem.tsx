import {
  AudioFileWithUrls,
  ImageFileWithUrls,
  VideoFileWithUrls,
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
    videoFiles?: VideoFileWithUrls[];
    profilePicture?: { name: string; url: string };
  } = {};

  // Audio processing
  if (
    item.versions[0].type.startsWith('audio')
  ) {
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
        moduleId: audioMeta?.moduleId || 0,
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
  // Video processing
  else if (item.versions[0].type.startsWith('video')) {
    const videoId = item.id;
    const { data: decryptedVideo } = await akord.stack.getVersion(videoId);

    const blobUrl = URL.createObjectURL(new Blob([decryptedVideo]));

    const videoMeta = tapeInfoJSON?.videoFiles.find(
      (video) => video.fileName === item.name
    );

    const udl = item.versions[0].udl;
    console.log(udl);

    result.videoFiles = [
      {
        moduleId: videoMeta?.moduleId || 0,
        name: videoMeta?.name || '',
        artistName: videoMeta?.artistName || '',
        duration: videoMeta?.duration || 0,
        videoUrl: blobUrl,
        fileName: videoMeta?.fileName || '',
        udl: udl || null,
      },
    ];
  }

  return result;
}

export default processItem;
