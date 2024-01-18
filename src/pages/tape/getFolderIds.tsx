import { Akord } from '@akord/akord-js';

const getFolderIds = async (akord: Akord, singleVaultId: string) => {
  const folders = await akord.folder.listAll(singleVaultId);

  const folderMap = new Map();
  folders.forEach((folder) => {
    folderMap.set(folder.id, {
      ...folder,
      trackId: '',
      additionalId: '',
    });
  });

  const mediaFolderIds = folders
    .filter((folder) => folder.name.startsWith('module'))
    .map((folder) => {
      const trackFolder = folders.find(
        (f) => f.parentId === folder.id && f.name === 'Track'
      );
      const additionalFolder = folders.find(
        (f) => f.parentId === folder.id && f.name === 'Additional'
      );

      return {
        name: folder.name,
        folderId: folder.id,
        trackId: trackFolder ? trackFolder.id : '',
        additionalId: additionalFolder ? additionalFolder.id : '',
      };
    });

  // Getting JSON file
  const tapeInfoFolderArray = folders.filter((folder) =>
    folder.name.startsWith('tapeInfo')
  );

  const tapeInfoFolder = tapeInfoFolderArray[0];
  const tapeInfoFolderId = tapeInfoFolder.id;

  return { mediaFolderIds, tapeInfoFolderId };
};

export default getFolderIds;
