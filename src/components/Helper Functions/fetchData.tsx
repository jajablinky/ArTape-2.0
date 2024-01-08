import getFolderIds from '@/pages/tape/getFolderIds';
import fetchItemFile from './fetchItemFile';
import getTapeInfoJSON from './getTapeInfoJSON';
import { Akord } from '@akord/akord-js';
import { AdditionalWithFiles, Tape } from '@/types/TapeInfo';

type fetchDataProps = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAudioFiles: React.Dispatch<React.SetStateAction<null>>;
  setVideoFiles: React.Dispatch<React.SetStateAction<null>>;
  id: string | string[];
  setTape: React.Dispatch<React.SetStateAction<Tape>>;
  tape: Tape;
};

const fetchData = async ({
  setLoading,
  id,
  setTape,
  setAudioFiles,
  setVideoFiles,
  tape,
}: fetchDataProps) => {
  try {
    console.log('fetching');
    setLoading(true);
    const akord = new Akord(); // a public instance

    // retrieve single vault Id
    const singleVaultId = Array.isArray(id) ? id[0] : id;

    if (akord && singleVaultId) {
      /* 
        Step 1:
        Retrieving folder ids from vault and storing in an array 
        */
      const { mediaFolderIds, tapeInfoFolderId } = await getFolderIds(
        akord,
        singleVaultId
      );

      /* 
        Step 2:
        Get files, and urls from modules
        */

      let tapeInfoDetails = await fetchItemFile(
        singleVaultId,
        tapeInfoFolderId,
        akord
      );

      // Get tapeInfo.json
      const tapeInfoFile = tapeInfoDetails[0].arrayBuffer;
      const tapeInfoJSON = getTapeInfoJSON(tapeInfoFile);

      if (!tapeInfoJSON) {
        console.error('Tape info JSON is invalid');
        return;
      }

      const modulePromises = mediaFolderIds.map(async (folder, i) => {
        let additionalItemFiles =
          i !== 1
            ? await fetchItemFile(singleVaultId, folder.additionalId, akord)
            : [];
        let trackItemFile = await fetchItemFile(
          singleVaultId,
          folder.trackId,
          akord
        );

        const additional = additionalItemFiles.map((file) => ({
          name: file.fileName,
          time: tapeInfoJSON.modules[i].additional[0].time,
          url: file.url,
          file: file.file,
          alt: file.fileName,
        }));

        const track = {
          type: tapeInfoJSON.modules[i].track.type,
          metadata: {
            name: tapeInfoJSON.modules[i].track.metadata.name,
            artistName: tapeInfoJSON.modules[i].track.metadata.artistName,
            duration: tapeInfoJSON.modules[i].track.metadata.duration,
            fileName: trackItemFile[0].fileName,
          },
          url: trackItemFile[0].url,
          file: trackItemFile[0].file,
        };

        return {
          moduleName: folder.name,
          trackItem: track,
          additionalItem: additional,
        };
      });

      const modules = await Promise.all(modulePromises);
      console.log('modules: ', modules);
      /*
        Step 4:
        Set Tape Context
        */

      setTape({
        akord,
        color: tapeInfoJSON.color,
        modules,
        tapeInfoJSON,
      });

      const audioFiles: AdditionalWithFiles[] = [];
      const videoFiles: AdditionalWithFiles[] = [];

      tape.modules.forEach((module) => {
        const track = module.trackItem;
        const fileWithMetadata = {
          ...track.metadata,
          url: track.url,
          file: track.file,
        };

        if (track.type === 'audio') {
          audioFiles.push(fileWithMetadata);
        } else if (track.type === 'video') {
          videoFiles.push(fileWithMetadata);
        }
      });

      setAudioFiles(audioFiles);
      setVideoFiles(videoFiles);
    }
    setLoading(false);
  } catch (e) {
    console.error(e);
    console.log('error trying to fetch tape');
    setLoading(false);
  }
};

export default fetchData;
