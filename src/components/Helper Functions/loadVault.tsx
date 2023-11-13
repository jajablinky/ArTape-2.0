import {
  AudioFileWithUrls,
  ImageFileWithUrls,
  TapeInfoJSON,
  VideoFileWithUrls,
} from '@/types/TapeInfo';
import processItem from './processItem';
import getTapeInfoJSON from './getTapeInfoJSON';

const loadVault = async (
  setProgress,
  setLoading,
  vaultId,
  setTape,
  akord,
  tape
) => {
  try {
    setProgress({
      percentage: 0,
      state: 'Communicating with Akord',
    });
    setLoading(true);
    const items = await akord.stack.listAll(vaultId);
    let tapeInfoJSON: TapeInfoJSON = {
      audioFiles: [],
      color: '',
      imageFiles: [],
      memento: '',
      profilePicture: '',
      tapeArtistName: '',
      tapeDescription: '',
      type: '',
      videoFiles: [],
    };

    const albumPictures: { [name: string]: string } = {};

    const tapeInfoPromises: Promise<TapeInfoJSON | null>[] = [];
    items.forEach((item) => {
      tapeInfoPromises.push(getTapeInfoJSON(item, akord));
    });

    const tapeInfoJSONs = await Promise.all(tapeInfoPromises);

    // Merge all the TapeInfoJSONs into tapeInfoJSON
    tapeInfoJSONs.forEach((tapeInfo) => {
      if (tapeInfo) {
        tapeInfoJSON = { ...tapeInfoJSON, ...tapeInfo };
      }
    });
    const processPromises: Promise<{
      audioFiles?: AudioFileWithUrls[];
      imageFiles?: ImageFileWithUrls[];
      videoFiles?: VideoFileWithUrls[];
      profilePicture?: { name: string; url: string };
    }>[] = [];

    items.forEach((item) => {
      processPromises.push(
        processItem(item, tapeInfoJSON, akord, albumPictures)
      );
    });
    setProgress({
      percentage: 80,
      state: 'Processing',
    });
    const processResults = await Promise.all(processPromises);

    const audioFiles: AudioFileWithUrls[] = [];
    const imageFiles: ImageFileWithUrls[] = [];
    const videoFiles: VideoFileWithUrls[] = [];
    const profilePicture: { name: string; url: string } = {
      name: '',
      url: '',
    };

    // Merge all the process results into audioFiles, imageFiles, videoFiles, and profilePicture
    processResults.forEach((result) => {
      if (result.audioFiles) {
        audioFiles.push(...result.audioFiles);
      }
      if (result.imageFiles) {
        imageFiles.push(...result.imageFiles);
      }
      if (result.videoFiles) {
        videoFiles.push(...result.videoFiles);
      }
      if (result.profilePicture) {
        profilePicture.name = result.profilePicture.name;
        profilePicture.url = result.profilePicture.url;
      }
    });

    console.log('collected songs');
    console.log('collected images');
    console.log('collected videos');
    setProgress({
      percentage: 100,
      state: 'Success!',
    });
    setTape({
      ...tape,
      audioFiles,
      color: tapeInfoJSON?.color,
      imageFiles,
      memento: tapeInfoJSON?.memento,
      profilePicture,
      tapeArtistName: tapeInfoJSON?.tapeArtistName,
      tapeDescription: tapeInfoJSON?.tapeDescription,
      type: tapeInfoJSON?.type,
      tapeInfoJSON,
      videoFiles,
    });
    setLoading(false);
  } catch (e) {
    console.error('error: ', e);
    setLoading(false);
  }
};

export default loadVault;
