import { Akord } from '@akord/akord-js';

const getFolderIds = async (akord: Akord, singleVaultId: string) => {
  // Retrieve all folders from the specified vault
  const folders = await akord.folder.listAll(singleVaultId);

  // Creating a Map to store each folder for quick access by folder ID
  const folderMap = new Map();
  folders.forEach((folder) => {
    folderMap.set(folder.id, {
      ...folder,
      trackId: '',
      additionalId: '',
    });
  });

  // Filtering and transforming the folders that start with 'module' into the desired structure
  const mediaFolderIds = folders
    .filter((folder) => folder.name.startsWith('module')) // Filter out only folders starting with 'module'
    .map((folder) => {
      // Find the associated 'Track' and 'Additional' folders by checking the parentId
      const trackFolder = folders.find(
        (f) => f.parentId === folder.id && f.name === 'Track'
      );
      const additionalFolder = folders.find(
        (f) => f.parentId === folder.id && f.name === 'Additional'
      );

      // Return the transformed object with all required properties
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
