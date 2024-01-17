import getFolderIds from '@/pages/tape/getFolderIds';
import fetchItemFile from './fetchItemFile';
import getTapeInfoJSON from './getTapeInfoJSON';
import { Akord } from '@akord/akord-js';
import { Tape, TrackWithFiles } from '@/types/TapeInfo';

type fetchDataProps = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAudioFiles: React.Dispatch<React.SetStateAction<TrackWithFiles[] | null>>;
  setVideoFiles: React.Dispatch<React.SetStateAction<TrackWithFiles[] | null>>;
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

      const defaultModule = {
        moduleName: '',
        trackItem: null,
        additionalItem: [],
      };

      const defaultTrack = {
        type: 'Unknown',
        metadata: {
          name: 'Unknown',
          artistName: 'Unknown',
          duration: 0,
          fileName: 'Unknown',
        },
        url: '',
        file: null,
      };

      const modulePromises = mediaFolderIds.map(async (folder, i) => {
        try {
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
            name: file?.fileName || 'Unknown',
            time: tapeInfoJSON.modules[i]?.additional[0]?.time || 0,
            url: file?.url || '',
            file: file?.file || null,
            alt: file?.fileName || 'Unknown',
          }));

          let track;
          if (trackItemFile && trackItemFile.length > 0) {
            track = {
              type: tapeInfoJSON.modules[i]?.track?.type || 'Unknown',
              metadata: {
                name:
                  tapeInfoJSON.modules[i]?.track?.metadata?.name || 'Unknown',
                artistName:
                  tapeInfoJSON.modules[i]?.track?.metadata?.artistName ||
                  'Unknown',
                duration:
                  tapeInfoJSON.modules[i]?.track?.metadata?.duration || 0,
                fileName: trackItemFile[0]?.fileName || 'Unknown',
              },
              url: trackItemFile[0]?.url || '',
              file: trackItemFile[0]?.file || null,
            };
          } else {
            console.error('Track item was not found to map', trackItemFile);
            track = defaultTrack; // Use default track object instead of null
          }
          return {
            moduleName: folder?.name || 'Unknown',
            trackItem: track,
            additionalItem: additional,
          };
        } catch (error) {
          console.error('Error while trying to map module promises: ', error);
          return { ...defaultModule };
        }
      });

      const modules = await Promise.all(modulePromises);

      console.log('modules is fetched: ', modules);
      /*
        Step 4:
        Set Tape Context
        */

      const newTape = {
        tapeArtistName: tapeInfoJSON.tapeArtistName,
        akord,
        color: tapeInfoJSON.color,
        modules,
        tapeInfoJSON,
      };

      setTape(newTape);

      const audioFiles: TrackWithFiles[] = [];
      const videoFiles: TrackWithFiles[] = [];

      newTape.modules.forEach((module) => {
        if (module) {
          const track = module.trackItem;
          if (track) {
            const audioFileWithMetadata = {
              type: 'audio',
              metadata: { ...track.metadata },
              url: track.url,
              file: track.file,
            };

            const videoFileWithMetadata = {
              type: 'video',
              metadata: { ...track.metadata },
              url: track.url,
              file: track.file,
            };

            if (track.type === 'audio') {
              audioFiles.push(audioFileWithMetadata);
            } else if (track.type === 'video') {
              videoFiles.push(videoFileWithMetadata);
            }
          }
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
